import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart } from 'lucide-react';

interface Edition {
  id: string;
  name: string;
  price: number;
  color: 'cyan' | 'purple' | 'green' | 'orange' | 'red';
  colorName: string;
  desc: string;
}

export const Specs: React.FC = () => {
  const { addToCart, toggleWishlist, isInWishlist, setCartOpen, addLog } = useApp();

  const editions: Edition[] = [
    { id: 'aether-aura-cyan', name: 'Aether Aura Smart (Ice Cyan)', price: 249, color: 'cyan', colorName: 'Ice Cyan', desc: 'Phiên bản Tiêu chuẩn - Sắc xanh băng thanh mát' },
    { id: 'aether-aura-purple', name: 'Aether Aura Smart (Neon Purple)', price: 259, color: 'purple', colorName: 'Neon Purple', desc: 'Phiên bản Đặc biệt - Sắc tím Neon huyền ảo' },
    { id: 'aether-aura-green', name: 'Aether Aura Smart (Emerald Green)', price: 259, color: 'green', colorName: 'Emerald Green', desc: 'Phiên bản Đặc biệt - Sắc lục bảo thiên nhiên' },
    { id: 'aether-aura-orange', name: 'Aether Aura Smart (Sunset Orange)', price: 249, color: 'orange', colorName: 'Sunset Orange', desc: 'Phiên bản Tiêu chuẩn - Sắc cam hoàng hôn ấm áp' },
    { id: 'aether-aura-red', name: 'Aether Aura Smart (Magma Red)', price: 269, color: 'red', colorName: 'Magma Red', desc: 'Phiên bản Cao cấp - Sắc đỏ dung nham mạnh mẽ' }
  ];

  const handleAddToCart = (item: Edition) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      color: item.color,
      colorName: item.colorName
    });
    setCartOpen(true);
    addLog('click', `Mua phiên bản: ${item.colorName} từ khu vực cấu hình`);
  };

  const handleWishlistToggle = (item: Edition) => {
    toggleWishlist(item.id);
  };

  return (
    <section id="specs" className="specs-section">
      <div className="section-header">
        <span className="section-subtitle">Đặc tả chi tiết</span>
        <h2 className="section-main-title">Thông Số Kỹ Thuật & Cấu Hình</h2>
        <p className="section-desc">
          Lựa chọn màu sắc hào quang phù hợp nhất với cá tính và không gian của bạn, 
          đồng thời khám phá các chi tiết kỹ thuật được kiểm nghiệm khắt khe của Aether Aura.
        </p>
      </div>

      <div className="specs-grid">
        {/* Left Column: Product Editions (E-commerce Mini Catalog) */}
        <div className="editions-container">
          <h3 className="section-title" style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Các Phiên Bản Màu Sắc</h3>
          {editions.map((edition) => {
            const favorite = isInWishlist(edition.id);
            return (
              <div key={edition.id} className="edition-card">
                <div className="edition-info">
                  {/* Visual Silhouette with Dynamic color glow */}
                  <div className="edition-visual">
                    <div className={`edition-color-aura ${edition.color}`} />
                    <div className="edition-device-silhouette" />
                  </div>
                  
                  <div className="edition-text">
                    <h4>{edition.colorName} Edition</h4>
                    <p>{edition.desc}</p>
                  </div>
                </div>

                <div className="edition-price-actions">
                  <span className="edition-price">${edition.price}</span>
                  
                  {/* Wishlist toggle */}
                  <button 
                    className={`wishlist-btn-toggle ${favorite ? 'active' : ''}`}
                    onClick={() => handleWishlistToggle(edition)}
                    aria-label={`Thêm ${edition.colorName} vào danh sách yêu thích`}
                    title={favorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <Heart size={16} />
                  </button>

                  {/* Add to Cart button */}
                  <button 
                    className="action-btn-small" 
                    onClick={() => handleAddToCart(edition)}
                    title="Đặt pre-order phiên bản này"
                  >
                    Pre-order
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Specifications Sheet Table */}
        <div className="specs-sheet-card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            Thông Số Bản Standard & Special
          </h3>
          
          <table className="specs-table">
            <tbody>
              <tr>
                <td className="specs-label">Phạm vi hoạt động</td>
                <td className="specs-value">40m² - 65m² (Làm sạch phòng ngủ/phòng khách chỉ trong 8-12 phút)</td>
              </tr>
              <tr>
                <td className="specs-label">Chỉ số CADR khí sạch</td>
                <td className="specs-value">550 m³/h (Khả năng lọc sạch cực mạnh)</td>
              </tr>
              <tr>
                <td className="specs-label">Màng lọc chính</td>
                <td className="specs-value">Màng lọc HEPA H14 Chuẩn Y Khoa (Tích hợp sợi than hoạt tính dừa khử mùi)</td>
              </tr>
              <tr>
                <td className="specs-label">Hệ thống khử khuẩn</td>
                <td className="specs-value">UV-C LED bước sóng ngắn 254nm tiêu diệt vi sinh vật từ bên trong</td>
              </tr>
              <tr>
                <td className="specs-label">Độ ồn hoạt động</td>
                <td className="specs-value">12 dB (Chế độ SilentMode siêu êm) đến tối đa 48 dB (Chế độ Cấp 3)</td>
              </tr>
              <tr>
                <td className="specs-label">Các cảm biến chính</td>
                <td className="specs-value">Cảm biến bụi mịn PM2.5 hồng ngoại Laser, Cảm biến hạt khí độc hại VOCs, Nhiệt độ & Độ ẩm</td>
              </tr>
              <tr>
                <td className="specs-label">Kết nối & Smart Home</td>
                <td className="specs-value">Wi-Fi 6 (2.4GHz/5GHz), Bluetooth 5.2, Hỗ trợ đồng bộ Matter/Thread điều khiển giọng nói</td>
              </tr>
              <tr>
                <td className="specs-label">Kích thước & Cân nặng</td>
                <td className="specs-value">Đường kính: 220 mm | Chiều cao: 420 mm | Khối lượng: 4.2 kg</td>
              </tr>
              <tr>
                <td className="specs-label">Công suất danh định</td>
                <td className="specs-value">5 Watts (Silent) - 42 Watts (Max Turbo)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
