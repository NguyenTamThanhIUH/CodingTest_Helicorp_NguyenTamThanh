import React, { createContext, useContext, useState, useEffect } from 'react';


export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  colorName: string;
}

export interface UserLog {
  id: string;
  type: 'click' | 'scroll' | 'hover' | 'system' | 'form';
  description: string;
  timestamp: string;
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  

  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string, color: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;


  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  
  power: boolean;
  setPower: (power: boolean) => void;
  fanSpeed: 1 | 2 | 3 | 'Auto';
  setFanSpeed: (speed: 1 | 2 | 3 | 'Auto') => void;
  auraColor: 'cyan' | 'purple' | 'green' | 'orange' | 'red';
  setAuraColor: (color: 'cyan' | 'purple' | 'green' | 'orange' | 'red') => void;
  aqi: number;
  setAqi: (aqi: number) => void;
  filterLife: number;
  resetFilter: () => void;

 
  logs: UserLog[];
  addLog: (type: UserLog['type'], description: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('aether-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('aether-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [cartOpen, setCartOpen] = useState(false);

 
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('aether-wishlist');
    return saved ? JSON.parse(saved) : [];
  });


  const [power, setPower] = useState(true);
  const [fanSpeed, setFanSpeed] = useState<1 | 2 | 3 | 'Auto'>(2);
  const [auraColor, setAuraColor] = useState<'cyan' | 'purple' | 'green' | 'orange' | 'red'>('cyan');
  const [aqi, setAqi] = useState(78); // Initial Air Quality Index (Moderate)
  const [filterLife, setFilterLife] = useState(98);

  
  const [logs, setLogs] = useState<UserLog[]>([]);


  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aether-theme', theme);
  }, [theme]);

  
  useEffect(() => {
    localStorage.setItem('aether-cart', JSON.stringify(cart));
  }, [cart]);

  
  useEffect(() => {
    localStorage.setItem('aether-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);


  useEffect(() => {
    if (!power) {

      const interval = setInterval(() => {
        setAqi(prev => Math.min(prev + 1, 150));
      }, 5000);
      return () => clearInterval(interval);
    }


    const interval = setInterval(() => {
      let speedFactor = 1;
      if (fanSpeed === 1) speedFactor = 0.5;
      if (fanSpeed === 2) speedFactor = 1.2;
      if (fanSpeed === 3) speedFactor = 2.5;
      if (fanSpeed === 'Auto') {
        speedFactor = aqi > 100 ? 2.5 : aqi > 50 ? 1.2 : 0.4;
      }

      setAqi(prev => {
        const targetAqi = 12; 
        if (prev > targetAqi) {
          const decrease = Math.max(1, Math.round(speedFactor * (prev - targetAqi) * 0.05));
          return Math.max(targetAqi, prev - decrease);
        } else if (prev < targetAqi) {
          return prev + 1;
        }
        return prev;
      });


      setFilterLife(prev => Math.max(0, Number((prev - 0.001 * speedFactor).toFixed(4))));
    }, 3000);

    return () => clearInterval(interval);
  }, [power, fanSpeed, aqi]);

  
  useEffect(() => {
    if (!power) {
      setAuraColor('red');
      return;
    }

    if (fanSpeed === 'Auto') {
      if (aqi <= 35) setAuraColor('green');
      else if (aqi <= 75) setAuraColor('cyan');
      else if (aqi <= 115) setAuraColor('purple');
      else if (aqi <= 150) setAuraColor('orange');
      else setAuraColor('red');
    }
  }, [aqi, fanSpeed, power]);


  useEffect(() => {
    const auraHexMap = {
      cyan: '#06b6d4',
      purple: '#8b5cf6',
      green: '#10b981',
      orange: '#f97316',
      red: '#ef4444'
    };
    document.documentElement.style.setProperty('--active-aura', auraHexMap[auraColor]);
  }, [auraColor]);


  const addLog = (type: UserLog['type'], description: string) => {
    const newLog: UserLog = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      description,
      timestamp: new Date().toLocaleTimeString()
    };
    setLogs(prev => [newLog, ...prev.slice(0, 19)]); 
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    addLog('click', `Chuyển đổi giao diện sang ${nextTheme === 'light' ? 'Sáng' : 'Tối'}`);
  };


  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.color === item.color);
      if (existing) {
        return prev.map(i => 
          i.id === item.id && i.color === item.color 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    addLog('click', `Thêm sản phẩm "${item.name} (${item.colorName})" vào giỏ hàng`);
  };

  const removeFromCart = (id: string, color: string) => {
    const item = cart.find(i => i.id === id && i.color === color);
    setCart(prev => prev.filter(i => !(i.id === id && i.color === color)));
    if (item) {
      addLog('click', `Xóa sản phẩm "${item.name} (${item.colorName})" khỏi giỏ hàng`);
    }
  };

  const clearCart = () => {
    setCart([]);
    addLog('click', 'Xóa toàn bộ giỏ hàng');
  };

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        addLog('click', `Xóa sản phẩm "${productId}" khỏi danh sách yêu thích`);
        return prev.filter(id => id !== productId);
      } else {
        addLog('click', `Thêm sản phẩm "${productId}" vào danh sách yêu thích`);
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const resetFilter = () => {
    setFilterLife(100);
    addLog('click', 'Đã đặt lại tuổi thọ màng lọc khí');
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      cart, addToCart, removeFromCart, clearCart, cartOpen, setCartOpen,
      wishlist, toggleWishlist, isInWishlist,
      power, setPower, fanSpeed, setFanSpeed, auraColor, setAuraColor, aqi, setAqi, filterLife, resetFilter,
      logs, addLog
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
