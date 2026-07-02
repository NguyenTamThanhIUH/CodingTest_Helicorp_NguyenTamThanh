import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Moon, ShoppingBag, Heart, Menu, X, Wind } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme, cart, wishlist, setCartOpen, addLog } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Total cart items count
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  // Total wishlist items count
  const wishlistCount = wishlist.length;

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      addLog('scroll', `Cuộn đến phần: ${id}`);
    }
  };

  return (
    <header className="navbar-container">
      <nav className="navbar">
        {/* Logo */}
        <a href="#" className="logo" onClick={(e) => handleScrollTo(e, 'home')}>
          <Wind size={24} color="var(--accent-primary)" />
          <span>Aether<strong>Aura</strong></span>
        </a>

        {/* Desktop Navigation Links */}
        <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <a href="#home" onClick={(e) => handleScrollTo(e, 'home')}>Tổng Quan</a>
          </li>
          <li>
            <a href="#features" onClick={(e) => handleScrollTo(e, 'features')}>Tính Năng</a>
          </li>
          <li>
            <a href="#dashboard" onClick={(e) => handleScrollTo(e, 'dashboard')}>Điều Khiển</a>
          </li>
          <li>
            <a href="#specs" onClick={(e) => handleScrollTo(e, 'specs')}>Thông Số</a>
          </li>
          <li>
            <a href="#register" onClick={(e) => handleScrollTo(e, 'register')}>Đặt Hàng</a>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className="nav-actions">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="nav-btn" 
            aria-label="Chuyển đổi giao diện"
            title="Đổi chủ đề"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Wishlist Button */}
          <button 
            className="nav-btn" 
            aria-label="Danh sách yêu thích"
            title="Sản phẩm yêu thích"
            onClick={() => {
              addLog('click', 'Mở danh sách yêu thích');
              // We'll link wishlist opening to the cart/preorder panel
              setCartOpen(true);
            }}
          >
            <Heart size={20} />
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </button>

          {/* Cart Button */}
          <button 
            className="nav-btn" 
            aria-label="Giỏ hàng"
            title="Giỏ hàng pre-order"
            onClick={() => {
              addLog('click', 'Mở giỏ hàng');
              setCartOpen(true);
            }}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>

          {/* CTA Nav Link */}
          <a 
            href="#register" 
            className="cta-nav"
            onClick={(e) => handleScrollTo(e, 'register')}
          >
            Đặt Hàng Ngay
          </a>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
    </header>
  );
};
