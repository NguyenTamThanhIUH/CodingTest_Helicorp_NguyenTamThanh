import React from 'react';
import { ShieldCheck, Cpu, Zap, Sparkles, VolumeX, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Features: React.FC = () => {
  const { addLog } = useApp();

  const handleFeatureHover = (title: string) => {
  
    addLog('hover', `Xem thông tin tính năng: ${title}`);
  };

  const featuresList = [
    {
      icon: <ShieldCheck size={26} />,
      title: 'Màng lọc HEPA H14 chuẩn Y khoa',
      desc: 'Loại bỏ đến 99.995% các tác nhân ô nhiễm siêu vi kích thước tới 0.1 µm, phấn hoa, khói bụi mịn và các chất độc hại trong không khí.'
    },
    {
      icon: <Cpu size={26} />,
      title: 'Trí tuệ nhân tạo Smart IAQ',
      desc: 'Cảm biến tích hợp tự động phân tích mật độ hạt ô nhiễm, chất hữu cơ bay hơi VOCs để tự động tăng giảm tốc độ lọc thông minh.'
    },
    {
      icon: <Zap size={26} />,
      title: 'Diệt khuẩn sâu bằng UV-C',
      desc: 'Đèn LED UV-C vô hại với con người nằm sâu trong lõi máy liên tục vô hiệu hóa vi khuẩn, virus và nấm mốc bám trên màng lọc.'
    },
    {
      icon: <Sparkles size={26} />,
      title: 'Đèn sinh học Aura Lighting',
      desc: 'Dải đèn LED chuyển sắc vô cấp phản hồi trực quan theo mức độ sạch của không khí hoặc điều chỉnh theo cảm xúc không gian.'
    },
    {
      icon: <VolumeX size={26} />,
      title: 'Công nghệ QuietStorm 12dB',
      desc: 'Thiết kế khí động học mô phỏng cánh máy bay phản lực giúp tối ưu luồng gió lưu thông mà vẫn giữ tiếng ồn ở ngưỡng gần như vô thanh.'
    },
    {
      icon: <Activity size={26} />,
      title: 'Đồng bộ API & Webhook',
      desc: 'Xuất dữ liệu môi trường thời gian thực, kết nối nhà thông minh Google Home/Apple HomeKit và hỗ trợ cài đặt webhook báo cáo.'
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="section-header">
        <span className="section-subtitle">Đỉnh Cao Công Nghệ</span>
        <h2 className="section-main-title">Trải Nghiệm Đẳng Cấp Thượng Lưu</h2>
        <p className="section-desc">
          Aether Aura không chỉ là một chiếc máy lọc khí. Đó là một giải pháp quản trị khí hậu thông minh, 
          bảo vệ sức khỏe chủ động được tích hợp các công nghệ tối tân nhất hiện nay.
        </p>
      </div>

      <div className="features-grid">
        {featuresList.map((feat, idx) => (
          <div 
            key={idx} 
            className="feature-card"
            onMouseEnter={() => handleFeatureHover(feat.title)}
          >
            <div className="feature-icon-wrapper">
              {feat.icon}
            </div>
            <h3>{feat.title}</h3>
            <p>{feat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
