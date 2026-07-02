/**
 * chatService.ts
 * ─────────────────────────────────────────────────────
 * Dual-mode AI chat service for AetherBot:
 *  1. KB Mode  – fast offline keyword-matching (no API key needed)
 *  2. Gemini Mode – Google Gemini 1.5 Flash API (requires API key)
 *
 * The Gemini system prompt is "trained" with complete Aether Aura
 * product knowledge so the AI gives accurate consultation answers.
 */

/* ──────────────── Types ──────────────── */
export type ChatMode = 'kb' | 'gemini';

export interface ServiceMessage {
  role: 'user' | 'model';
  text: string;
}

/* ──────────────── System Prompt (Gemini) ──────────────── */
export const SYSTEM_PROMPT = `
Bạn là AetherBot — trợ lý tư vấn sản phẩm thông minh, thân thiện và chuyên nghiệp của thương hiệu **Aether Aura**.
Nhiệm vụ của bạn là tư vấn và hỗ trợ khách hàng về sản phẩm máy lọc không khí thông minh **Aether Aura Smart**.

## THÔNG TIN SẢN PHẨM ĐẦY ĐỦ

### Tổng quan
Aether Aura Smart là máy lọc không khí thông minh cao cấp, tích hợp đèn Aura LED đổi màu độc đáo, cảm biến chất lượng không khí realtime và kết nối Smart Home toàn diện.

### Các phiên bản & Giá bán
| Phiên bản | Màu sắc | Loại | Giá |
|---|---|---|---|
| Ice Cyan | Xanh băng | Standard | $249 |
| Neon Purple | Tím Neon | Special | $259 |
| Emerald Green | Lục bảo | Special | $259 |
| Sunset Orange | Cam hoàng hôn | Standard | $249 |
| Magma Red | Đỏ dung nham | Premium | $269 |

### Thông số kỹ thuật chính
- **Phạm vi hoạt động:** 40m² – 65m² (làm sạch phòng trong 8-12 phút)
- **CADR:** 550 m³/h (thuộc hàng cao nhất phân khúc)
- **Màng lọc:** HEPA H14 Chuẩn Y Khoa (loại bỏ 99.995% PM2.5) + sợi than hoạt tính dừa khử mùi
- **Khử khuẩn:** UV-C LED bước sóng 254nm (tiêu diệt vi khuẩn, virus trong máy)
- **Độ ồn:** 12 dB (SilentMode) → 48 dB (Max Turbo)
- **Cảm biến:** PM2.5 Laser hồng ngoại, VOCs, Nhiệt độ & Độ ẩm
- **Kết nối:** Wi-Fi 6 (2.4GHz/5GHz), Bluetooth 5.2, Matter/Thread
- **Smart Home:** Google Home, Apple HomeKit, Amazon Alexa, điều khiển giọng nói
- **Kích thước:** Đường kính 220mm × Chiều cao 420mm | Khối lượng 4.2 kg
- **Công suất:** 5W (Silent) đến 42W (Max Turbo)
- **Tuổi thọ màng lọc:** ~6-12 tháng (theo dõi qua app & dashboard)

### Tính năng đặc trưng
- **Đèn Aura LED:** 5 màu tuỳ chỉnh (Cyan, Purple, Green, Orange, Red) — tự động đổi màu theo AQI
- **Chế độ Auto:** Tự điều chỉnh tốc độ quạt theo chất lượng không khí realtime
- **Dashboard tương tác:** Theo dõi AQI, tốc độ quạt, tuổi thọ màng lọc trực quan
- **Ứng dụng di động:** Quản lý từ xa, lịch sử dữ liệu, thông báo thay lọc
- **Chế độ ngủ (SilentMode):** Chỉ 12dB, đèn Aura mờ nhẹ, không ảnh hưởng giấc ngủ

### Chính sách bán hàng
- **Pre-order:** Đặt cọc trước, nhận hàng ưu tiên + ưu đãi sớm
- **Wishlist:** Lưu yêu thích để theo dõi thông tin & khuyến mãi
- **Đặt hàng:** Chọn phiên bản → Thêm vào giỏ → Điền thông tin giao hàng

### Cách đặt hàng trên website
1. Cuộn đến mục "Thông Số & Cấu Hình"
2. Chọn phiên bản màu sắc và nhấn "Pre-order"
3. Mở giỏ hàng bằng icon 🛒 ở thanh điều hướng
4. Hoặc đăng ký newsletter ở cuối trang để nhận ưu đãi sớm nhất

## QUY TẮC TRẢ LỜI
- Luôn trả lời bằng **tiếng Việt** trừ khi khách hỏi bằng tiếng Anh
- Sử dụng emoji phù hợp để câu trả lời sinh động, thân thiện
- Trả lời **ngắn gọn, súc tích** nhưng đầy đủ thông tin
- Dùng **markdown** (bold, bullet list) để định dạng rõ ràng
- Nếu câu hỏi ngoài phạm vi sản phẩm, lịch sự hướng khách về chủ đề Aether Aura
- Luôn kết thúc bằng câu hỏi hoặc gợi ý để duy trì cuộc hội thoại
- KHÔNG bịa đặt thông tin không có trong dữ liệu sản phẩm
`.trim();

/* ──────────────── Knowledge Base (KB Mode) ──────────────── */
interface KBEntry {
  keywords: string[];
  answer: string;
}

const knowledgeBase: KBEntry[] = [
  {
    keywords: ['xin chào', 'hello', 'hi', 'chào', 'hey', 'alo'],
    answer:
      'Xin chào! 👋 Tôi là **AetherBot** — trợ lý AI tư vấn sản phẩm của Aether Aura.\n\nTôi có thể giúp bạn:\n• 💰 Báo giá & so sánh phiên bản\n• 🔬 Thông số kỹ thuật chi tiết\n• 🛒 Hướng dẫn đặt hàng\n• 📡 Tính năng Smart Home\n\nBạn cần tư vấn gì hôm nay?',
  },
  {
    keywords: ['giá', 'bao nhiêu tiền', 'price', 'chi phí', 'cost', 'bán giá', 'giá bán'],
    answer:
      '💰 **Bảng giá Aether Aura Smart:**\n\n• 🧊 **Ice Cyan** (Standard) — **$249**\n• 💜 **Neon Purple** (Special) — **$259**\n• 🌿 **Emerald Green** (Special) — **$259**\n• 🌅 **Sunset Orange** (Standard) — **$249**\n• 🔴 **Magma Red** (Premium) — **$269**\n\nPhiên bản Special & Premium có hiệu ứng đèn Aura nâng cao hơn! Bạn quan tâm màu nào? 🎨',
  },
  {
    keywords: ['rẻ nhất', 'giá rẻ', 'thấp nhất', 'cheap', 'affordable', 'tiết kiệm'],
    answer:
      '💡 Phiên bản **giá tốt nhất** là **Ice Cyan** và **Sunset Orange** — chỉ **$249**!\n\nCả hai đều có đầy đủ tính năng core:\n• HEPA H14 + UV-C khử khuẩn\n• CADR 550 m³/h\n• Wi-Fi 6 + Matter/Thread\n• Đèn Aura LED 5 màu\n\nBạn muốn xem thêm chi tiết về phiên bản nào không? 😊',
  },
  {
    keywords: ['màu', 'color', 'phiên bản', 'edition', 'version', 'màu sắc'],
    answer:
      '🎨 **5 phiên bản Aether Aura Smart:**\n\n1. 🧊 **Ice Cyan** $249 — Thanh mát, hiện đại (Standard)\n2. 💜 **Neon Purple** $259 — Huyền ảo, nổi bật (Special)\n3. 🌿 **Emerald Green** $259 — Thiên nhiên, thư thái (Special)\n4. 🌅 **Sunset Orange** $249 — Ấm áp, năng động (Standard)\n5. 🔴 **Magma Red** $269 — Mạnh mẽ, đẳng cấp (Premium)\n\nMỗi màu đều có thể tuỳ chỉnh qua bảng điều khiển! Bạn thích màu nào? ✨',
  },
  {
    keywords: ['lọc', 'filter', 'hepa', 'màng lọc', 'thay lọc', 'bộ lọc'],
    answer:
      '🔬 **Hệ thống lọc 3 tầng Aether Aura:**\n\n1. **Pre-filter** — Lọc bụi thô, lông thú cưng\n2. **HEPA H14 Chuẩn Y Khoa** — Loại bỏ **99.995%** bụi mịn PM2.5\n   ↳ Tích hợp sợi than hoạt tính dừa khử mùi, formaldehyde\n3. **UV-C LED 254nm** — Tiêu diệt vi khuẩn, virus bên trong máy\n\n⏰ Tuổi thọ màng lọc: **6-12 tháng** tuỳ môi trường\nĐèn báo & app thông báo khi cần thay! Bạn có câu hỏi thêm không? 😊',
  },
  {
    keywords: ['cadr', 'công suất', 'diện tích', 'phòng', 'phạm vi', 'diện tích phòng', 'bao nhiêu m2'],
    answer:
      '💨 **Hiệu suất lọc không khí:**\n\n• **CADR:** 550 m³/h (top đầu phân khúc)\n• **Phạm vi:** 40m² — 65m² ✅\n• **Tốc độ làm sạch:** Phòng ngủ 25m² → sạch trong **8 phút**\n• **Tốc độ quạt:** 4 cấp (1, 2, 3, Auto)\n• **Công suất:** 5W (Silent) → 42W (Max Turbo)\n\nPhù hợp: phòng ngủ, phòng khách, văn phòng, phòng trẻ em! Bạn cần dùng cho phòng nào? 🏠',
  },
  {
    keywords: ['tiếng ồn', 'ồn', 'noise', 'db', 'decibel', 'êm', 'silent', 'yên tĩnh', 'ngủ'],
    answer:
      '🔇 **Độ ồn hoạt động:**\n\n| Chế độ | Độ ồn | Ghi chú |\n|---|---|---|\n| SilentMode | **12 dB** | Êm hơn tiếng thì thầm |\n| Cấp 1 | ~20 dB | Rất êm |\n| Cấp 2 | ~32 dB | Êm vừa |\n| Cấp 3 Max | ~48 dB | Có thể nghe thấy |\n\nBạn có thể **bật 24/7 trong phòng ngủ** ở SilentMode mà hoàn toàn không bị ảnh hưởng! 😴',
  },
  {
    keywords: ['kết nối', 'wifi', 'bluetooth', 'smart home', 'google home', 'apple', 'alexa', 'matter', 'homekit', 'ứng dụng', 'app'],
    answer:
      '📡 **Kết nối & Smart Home:**\n\n• **Wi-Fi 6** (2.4GHz + 5GHz dual-band)\n• **Bluetooth 5.2** (kết nối trực tiếp)\n• **Matter / Thread** — chuẩn Smart Home thế hệ mới\n\n✅ Tương thích:\n• Google Home & Google Assistant\n• Apple HomeKit & Siri\n• Amazon Alexa\n• Điều khiển bằng giọng nói\n\nBạn đang dùng hệ sinh thái Smart Home nào? 🏡',
  },
  {
    keywords: ['cảm biến', 'sensor', 'pm2.5', 'vocs', 'nhiệt độ', 'độ ẩm', 'không khí'],
    answer:
      '📊 **Hệ thống cảm biến realtime:**\n\n• 🌫️ **PM2.5 Laser** — Bụi mịn hồng ngoại độ chính xác cao\n• ☣️ **VOCs** — Khí độc hại: Formaldehyde, Benzene, CO2…\n• 🌡️ **Nhiệt độ & Độ ẩm** — Theo dõi vi khí hậu phòng\n\nDữ liệu hiển thị **realtime** trên:\n• Dashboard trực quan trên website\n• Ứng dụng di động\n• Biểu đồ AQI theo lịch sử\n\nThú vị chứ? Bạn muốn biết thêm về tính năng nào? 🤔',
  },
  {
    keywords: ['kích thước', 'nặng', 'cân nặng', 'size', 'dimension', 'weight', 'chiều cao', 'đường kính', 'to', 'nhỏ'],
    answer:
      '📐 **Kích thước & Thiết kế:**\n\n• **Đường kính:** 220 mm (nhỏ gọn)\n• **Chiều cao:** 420 mm\n• **Khối lượng:** 4.2 kg\n• **Thiết kế:** Trụ tròn cao cấp, đèn Aura LED vòng quanh\n\n✅ Nhỏ gọn, dễ di chuyển giữa các phòng\n✅ Đặt vừa bàn, kệ, góc phòng\n✅ Thiết kế như một **vật trang trí** đẹp mắt\n\nBạn đặt máy ở phòng nào? 🏠',
  },
  {
    keywords: ['đặt hàng', 'mua', 'order', 'pre-order', 'giỏ hàng', 'cart', 'thanh toán', 'mua hàng', 'preorder'],
    answer:
      '🛒 **Cách đặt Pre-order Aether Aura:**\n\n**Bước 1:** Cuộn đến mục **"Thông Số & Cấu Hình"**\n**Bước 2:** Chọn phiên bản màu sắc yêu thích\n**Bước 3:** Nhấn **"Pre-order"** → Tự động thêm vào giỏ\n**Bước 4:** Nhấn icon 🛒 ở góc phải thanh điều hướng để xem giỏ hàng\n\n💡 **Ưu đãi Pre-order:**\n• Nhận hàng ưu tiên đợt đầu\n• Giá khoá sớm (Early-bird)\n• Hỗ trợ kỹ thuật ưu tiên\n\nBạn muốn đặt phiên bản nào? 😊',
  },
  {
    keywords: ['aqi', 'chất lượng không khí', 'air quality', 'chỉ số', 'ô nhiễm', 'bụi', 'pm'],
    answer:
      '🌬️ **Chỉ số AQI & Màu đèn Aura:**\n\n| AQI | Mức độ | Màu Aura |\n|---|---|---|\n| 0-35 | Tốt 🟢 | Xanh lá |\n| 36-75 | Khá tốt 🔵 | Xanh cyan |\n| 76-115 | Trung bình 🟣 | Tím |\n| 116-150 | Kém 🟠 | Cam |\n| >150 | Nguy hiểm 🔴 | Đỏ |\n\nỞ **Chế độ Auto**, máy tự điều chỉnh tốc độ quạt và đổi màu đèn theo AQI!\nBạn có thể thấy trực tiếp trên Dashboard ở trang web này 📊',
  },
  {
    keywords: ['bảo hành', 'warranty', 'hỏng', 'sửa chữa', 'đổi trả', 'return'],
    answer:
      '🛡️ **Chính sách bảo hành:**\n\n• **Bảo hành sản phẩm:** 24 tháng chính hãng\n• **Đổi trả miễn phí:** 30 ngày nếu có lỗi sản xuất\n• **Hỗ trợ kỹ thuật:** 24/7 qua hotline & chat\n• **Thay màng lọc:** Bảo hành 3 tháng\n\nĐội ngũ kỹ thuật Aether Aura luôn sẵn sàng hỗ trợ bạn! Bạn cần thêm thông tin gì không? 😊',
  },
  {
    keywords: ['so sánh', 'tốt hơn', 'khác', 'khác nhau', 'difference', 'compare', 'vs', 'versus'],
    answer:
      '⚖️ **So sánh nhanh các phiên bản:**\n\n| | Standard | Special | Premium |\n|---|---|---|---|\n| Giá | $249 | $259 | $269 |\n| Đèn Aura | ✅ | ✅✨ | ✅✨✨ |\n| HEPA H14 | ✅ | ✅ | ✅ |\n| Wi-Fi 6 | ✅ | ✅ | ✅ |\n| App Control | ✅ | ✅ | ✅ |\n\n✨ = Hiệu ứng đèn Aura nâng cao (gradient động)\n✨✨ = Hiệu ứng Premium (rainbow pulse + chế độ party)\n\nBạn muốn tôi tư vấn chọn phiên bản phù hợp không? 🎯',
  },
  {
    keywords: ['wishlist', 'yêu thích', 'bookmark', 'lưu', 'follow'],
    answer:
      '❤️ **Tính năng Wishlist:**\n\nNhấn icon **trái tim 🤍** bên cạnh mỗi phiên bản trong mục "Cấu Hình" để lưu vào danh sách yêu thích!\n\n**Lợi ích:**\n• Theo dõi các phiên bản bạn quan tâm\n• Nhận thông báo khi có khuyến mãi\n• Dễ dàng so sánh trước khi quyết định mua\n\nBạn đã thêm phiên bản nào vào wishlist chưa? 😊',
  },
  {
    keywords: ['cảm ơn', 'thanks', 'thank you', 'tks', 'cảm ơn bạn', 'ty'],
    answer:
      'Không có gì, rất vui được tư vấn cho bạn! 😊✨\n\nNếu còn bất kỳ câu hỏi nào về **Aether Aura Smart**, hãy hỏi tôi bất cứ lúc nào nhé!\n\nBạn có muốn xem thêm thông tin hoặc bắt đầu đặt hàng không? 🛒',
  },
  {
    keywords: ['tạm biệt', 'bye', 'goodbye', 'gặp lại', 'thôi', 'ok bye'],
    answer:
      'Tạm biệt và cảm ơn bạn đã quan tâm đến **Aether Aura**! 👋🌟\n\nChúc bạn luôn hít thở không khí trong lành. Hẹn gặp lại! 🌬️',
  },
];

const fallbackAnswers = [
  'Hmm, tôi chưa nắm được ý bạn. Bạn có thể hỏi tôi về **giá cả**, **thông số kỹ thuật**, **các phiên bản màu**, hoặc **cách đặt hàng** nhé! 🤔',
  'Xin lỗi, câu hỏi này ngoài phạm vi tư vấn của tôi một chút. Tôi chuyên về sản phẩm **Aether Aura Smart** — bạn muốn hỏi về tính năng lọc HEPA, AQI, hay kết nối Smart Home không? 💡',
  'Câu hỏi thú vị! Tuy nhiên tôi chuyên tư vấn về sản phẩm **Aether Aura Smart**. Hãy thử hỏi về giá, màu sắc, thông số, hay bảo hành nhé! 🎯',
];

export function findKBAnswer(userText: string): string {
  const normalised = userText.toLowerCase().trim();
  for (const entry of knowledgeBase) {
    if (entry.keywords.some((kw) => normalised.includes(kw))) {
      return entry.answer;
    }
  }
  return fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)];
}

/* ──────────────── Gemini API ──────────────── */
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

/**
 * Call Google Gemini 1.5 Flash API with full conversation history.
 * The system prompt is injected as the very first `user` turn.
 */
export async function callGeminiAPI(
  apiKey: string,
  history: ServiceMessage[],
  userMessage: string
): Promise<string> {
  // Build Gemini-format message array
  const geminiContents: GeminiMessage[] = [
    // Inject system prompt as opening context
    {
      role: 'user',
      parts: [{ text: `[SYSTEM CONTEXT - KHÔNG hiển thị cho khách]\n${SYSTEM_PROMPT}` }],
    },
    {
      role: 'model',
      parts: [{ text: 'Đã hiểu. Tôi sẽ đóng vai AetherBot và tư vấn theo đúng thông tin sản phẩm Aether Aura.' }],
    },
    // Append conversation history
    ...history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    })),
    // Current user message
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: geminiContents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 600,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    }),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    const errMsg = (errBody as { error?: { message?: string } })?.error?.message ?? response.statusText;
    throw new Error(`Gemini API lỗi (${response.status}): ${errMsg}`);
  }

  const data = await response.json() as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini trả về phản hồi rỗng.');
  return text.trim();
}
