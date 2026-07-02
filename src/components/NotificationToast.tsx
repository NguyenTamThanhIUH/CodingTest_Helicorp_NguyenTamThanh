import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import type { UserLog } from '../context/AppContext';
import { MousePointer, Eye, Send, Settings, X, Info } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { logs, addLog } = useApp();
  const [activeToasts, setActiveToasts] = useState<UserLog[]>([]);
  const lastLoggedSection = useRef<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'dashboard', 'specs', 'register'];
      const scrollPosition = window.scrollY + 200; // offset for better detection

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            if (lastLoggedSection.current !== sectionId) {
              lastLoggedSection.current = sectionId;
              
              // Map section ID to Vietnamese name
              const sectionNames: Record<string, string> = {
                home: 'Trang chủ (Hero Section)',
                features: 'Tính năng nổi bật (Features Grid)',
                dashboard: 'Bảng điều khiển máy lọc (Dashboard)',
                specs: 'Thông số kỹ thuật & Cấu hình (Specs)',
                register: 'Đặt hàng Pre-order (Subscription Form)'
              };

              addLog('scroll', `Cuộn đến phần: ${sectionNames[sectionId]}`);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [addLog]);


  useEffect(() => {
    if (logs.length > 0) {
      const latestLog = logs[0];
      
      
      setActiveToasts(prev => {
        if (prev.some(t => t.id === latestLog.id)) return prev;
        return [...prev, latestLog];
      });

      // Auto-remove toast after 4 seconds
      const timer = setTimeout(() => {
        setActiveToasts(prev => prev.filter(t => t.id !== latestLog.id));
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [logs]);

  const removeToast = (id: string) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  };

  const getToastHeader = (type: UserLog['type']) => {
    switch (type) {
      case 'click': return 'Tương tác click chuột';
      case 'scroll': return 'Dịch chuyển màn hình';
      case 'hover': return 'Rà chuột tương tác';
      case 'form': return 'Gửi biểu mẫu Webhook';
      case 'system': return 'Hệ thống Aether';
      default: return 'Thông báo';
    }
  };

  const getToastIcon = (type: UserLog['type']) => {
    switch (type) {
      case 'click': return <MousePointer size={16} />;
      case 'scroll': return <Eye size={16} />;
      case 'form': return <Send size={16} />;
      case 'hover': return <Info size={16} />;
      case 'system': return <Settings size={16} />;
      default: return <Info size={16} />;
    }
  };

  return (
    <div className="toast-container">
      {activeToasts.map((toast) => (
        <div key={toast.id} className="toast-card">
          <div className={`toast-icon type-${toast.type}`}>
            {getToastIcon(toast.type)}
          </div>
          
          <div className="toast-details">
            <h5>{getToastHeader(toast.type)}</h5>
            <p>{toast.description}</p>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{toast.timestamp}</span>
          </div>

          <button 
            className="toast-close" 
            onClick={() => removeToast(toast.id)}
            title="Đóng thông báo"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
