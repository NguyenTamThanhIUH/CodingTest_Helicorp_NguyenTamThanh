import React from 'react';
import { useApp } from '../context/AppContext';
import { AetherDevice } from './AetherDevice';
import { ArrowRight, Sparkles, Play } from 'lucide-react';

export const Hero: React.FC = () => {
  const { addToCart, setCartOpen, addLog } = useApp();

  const handlePreOrder = () => {
    // Add default device to cart
    addToCart({
      id: 'aether-aura-smart',
      name: 'Aether Aura Smart Air Purifier',
      price: 249,
      color: 'cyan',
      colorName: 'Ice Cyan'
    });
    setCartOpen(true);
    addLog('click', 'Click nút "Đặt Hàng Ngay" tại Hero section');
  };

  const handleScrollToFeatures = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById('features');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      addLog('click', 'Xem tính năng từ Hero section');
    }
  };

  return (
    <section id="home" className="hero-section">
      {/* Background radial glows for premium vibe */}
      <div className="hero-bg-glow" />
      <div className="hero-bg-glow-2" />

      <div className="hero-container">
        {/* Left column: Text details and Actions */}
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Kỷ Nguyên Mới Của Không Khí Sạch</span>
          </div>
          
          <h1 className="hero-title">
            Breathe the Future with <span>Aether Aura</span>
          </h1>
          
          <p className="hero-desc">
            Thiết bị lọc khí & điều hòa khí hậu AI tiên tiến nhất hành tinh. 
            Tích hợp lọc HEPA 14 chuẩn y khoa, khử khuẩn UV-C và phản hồi ánh sáng sinh học 
            (Aura lighting) đồng bộ theo cảm xúc không gian của bạn.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={handlePreOrder}>
              Đặt Hàng Pre-Order <ArrowRight size={18} />
            </button>
            <button className="btn-secondary" onClick={handleScrollToFeatures}>
              Khám Phá Tính Năng <Play size={16} fill="currentColor" />
            </button>
          </div>

          {/* Key Product Statistics */}
          <div className="hero-stats">
            <div className="stat-item">
              <h3>99.97%</h3>
              <p>Hiệu quả lọc bụi mịn PM2.5</p>
            </div>
            <div className="stat-item">
              <h3>12 dB</h3>
              <p>Độ ồn cực thấp (SilentMode)</p>
            </div>
            <div className="stat-item">
              <h3>550 m³/h</h3>
              <p>Chỉ số CADR (Làm sạch 60m²)</p>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Device illustration */}
        <div className="hero-visual">
          <AetherDevice />
        </div>
      </div>
    </section>
  );
};
