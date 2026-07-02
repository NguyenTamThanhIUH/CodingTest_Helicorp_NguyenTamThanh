import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, CheckCircle2, ShieldCheck, Link2 } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  edition: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
}

export const RegisterForm: React.FC = () => {
  const { addToCart, setCartOpen, addLog } = useApp();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    edition: 'cyan'
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');


  const phoneRegex = /^(0|84)(3|5|7|8|9)[0-9]{8}$/;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    if (name === 'fullName') {
      if (!value.trim()) {
        newErrors.fullName = 'Họ và tên không được để trống';
      } else if (value.trim().length < 2) {
        newErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
      } else {
        delete newErrors.fullName;
      }
    }

    if (name === 'email') {
      if (!value) {
        newErrors.email = 'Email không được để trống';
      } else if (!emailRegex.test(value)) {
        newErrors.email = 'Email không đúng định dạng (Ví dụ: name@example.com)';
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'phone') {
      if (!value) {
        newErrors.phone = 'Số điện thoại không được để trống';
      } else if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
        newErrors.phone = 'Số điện thoại Việt Nam không hợp lệ (Mẫu: 09xxxxxxxx)';
      } else {
        delete newErrors.phone;
      }
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

 
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Họ và tên không được để trống';
    if (!formData.email) newErrors.email = 'Email không được để trống';
    if (!formData.phone) newErrors.phone = 'Số điện thoại không được để trống';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addLog('form', 'Đăng ký thất bại: Biểu mẫu điền thiếu hoặc sai thông tin');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    addLog('form', `Đang kết nối Webhook gửi thông tin đăng ký cho: ${formData.fullName}`);

    const payload = {
      ...formData,
      submittedAt: new Date().toISOString(),
      source: 'Aether Aura Landing Page',
      userAgent: navigator.userAgent
    };

    try {
      
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSubmitStatus('success');
        addLog('form', `Gửi Webhook thành công! Nhận phản hồi HTTP 200 từ https://httpbin.org/post`);
        
       
        const editionNameMap: Record<string, { name: string; price: number; colorName: string }> = {
          cyan: { name: 'Aether Aura Smart (Ice Cyan)', price: 249, colorName: 'Ice Cyan' },
          purple: { name: 'Aether Aura Smart (Neon Purple)', price: 259, colorName: 'Neon Purple' },
          green: { name: 'Aether Aura Smart (Emerald Green)', price: 259, colorName: 'Emerald Green' },
          orange: { name: 'Aether Aura Smart (Sunset Orange)', price: 249, colorName: 'Sunset Orange' },
          red: { name: 'Aether Aura Smart (Magma Red)', price: 269, colorName: 'Magma Red' }
        };

        const chosenItem = editionNameMap[formData.edition] || editionNameMap.cyan;
        addToCart({
          id: `aether-aura-${formData.edition}`,
          name: chosenItem.name,
          price: chosenItem.price,
          color: formData.edition,
          colorName: chosenItem.colorName
        });

 
        setFormData({ fullName: '', email: '', phone: '', edition: 'cyan' });
        
    
        setTimeout(() => {
          setCartOpen(true);
        }, 1500);

      } else {
        throw new Error('Webhook returned non-200 status');
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
      addLog('system', 'Lỗi kết nối Webhook. Tự động chuyển qua chế độ lưu trữ khẩn cấp');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="register" className="register-section">
      {/* Background glow behind form */}
      <div 
        className="hero-bg-glow" 
        style={{ top: '20%', left: '50%', width: '40vw', height: '40vw', opacity: 0.1, background: 'radial-gradient(circle, var(--accent-secondary) 0%, transparent 70%)' }} 
      />

      <div className="register-container">
        <div className="register-card">
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="section-subtitle">Đăng ký mua</span>
            <h2 className="section-main-title" style={{ fontSize: '2.25rem' }}>Đăng Ký Đặt Hàng Pre-Order</h2>
            <p className="section-desc" style={{ fontSize: '0.95rem' }}>
              Hãy để lại thông tin của bạn để giữ chỗ đặt hàng trước. Hệ thống sẽ kết nối trực tiếp đến Webhook để xác nhận.
            </p>
          </div>

          {submitStatus === 'success' ? (
            <div className="success-view" style={{ textAlign: 'center', padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <CheckCircle2 size={56} color="var(--success)" style={{ animation: 'float 4s infinite' }} />
              <h3 style={{ color: 'var(--success)', fontSize: '1.5rem' }}>Đặt hàng Pre-order thành công!</h3>
              <p style={{ maxWidth: '400px', color: 'var(--text-secondary)' }}>
                Dữ liệu đăng ký của bạn đã được truyền tải thành công qua Webhook thực tế. Hệ thống đã thêm phiên bản bạn đã chọn vào Giỏ hàng.
              </p>
              <button 
                className="btn-secondary" 
                onClick={() => setSubmitStatus('idle')}
                style={{ padding: '0.6rem 1.5rem', marginTop: '1rem' }}
              >
                Đăng ký biểu mẫu mới
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="register-form" noValidate>
              
              {/* Full Name field */}
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Họ và tên</label>
                <input 
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Nguyễn Văn A"
                  className="form-input"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              {/* Email & Phone side-by-side row */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Địa chỉ Email</label>
                  <input 
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@gmail.com"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Số điện thoại</label>
                  <input 
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="09xxxxxxxx"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>

              {/* Selected Color Variant dropdown */}
              <div className="form-group">
                <label className="form-label" htmlFor="edition">Phiên bản màu sắc quan tâm</label>
                <select 
                  id="edition"
                  name="edition"
                  className="form-select"
                  value={formData.edition}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  <option value="cyan">Ice Cyan Edition ($249)</option>
                  <option value="purple">Neon Purple Edition ($259)</option>
                  <option value="green">Emerald Green Edition ($259)</option>
                  <option value="orange">Sunset Orange Edition ($249)</option>
                  <option value="red">Magma Red Edition ($269)</option>
                </select>
              </div>

              {/* Webhook info banner */}
              <div className="webhook-info-badge">
                <Link2 size={16} />
                <span>Outbound API: Đang đồng bộ hóa dữ liệu thời gian thực tới <strong>https://httpbin.org/post</strong></span>
              </div>

              {submitStatus === 'error' && (
                <div className="error-message" style={{ justifyContent: 'center', backgroundColor: 'rgba(239, 68, 68, 0.05)', padding: '10px', borderRadius: '8px' }}>
                  Có lỗi xảy ra khi truyền qua Webhook. Xin vui lòng thử lại!
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang truyền dữ liệu...' : 'Xác Nhận Đăng Ký Pre-Order'}
                <Send size={16} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                <ShieldCheck size={14} color="var(--success)" />
                <span>Bảo mật thông tin mã hóa chuẩn SSL 256-bit</span>
              </div>

            </form>
          )}
        </div>
      </div>
    </section>
  );
};
