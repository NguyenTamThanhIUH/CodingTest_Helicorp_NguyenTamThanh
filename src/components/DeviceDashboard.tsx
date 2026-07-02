import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AetherDevice } from './AetherDevice';
import { Power, Fan, Sparkles, Shield, Activity, RefreshCw } from 'lucide-react';

export const DeviceDashboard: React.FC = () => {
  const { 
    power, setPower, 
    fanSpeed, setFanSpeed, 
    auraColor, setAuraColor, 
    aqi, 
    filterLife, resetFilter,
    addLog
  } = useApp();


  const [aqiHistory, setAqiHistory] = useState<number[]>([78, 77, 78, 76, 75, 73, 75, 78, 77, 78]);

  useEffect(() => {
    setAqiHistory(prev => {
      const nextHistory = [...prev.slice(1), aqi];
      return nextHistory;
    });
  }, [aqi]);

  const handlePowerToggle = () => {
    const nextPower = !power;
    setPower(nextPower);
    addLog('click', `Bật/Tắt thiết bị: Chuyển sang ${nextPower ? 'ON' : 'OFF'}`);
  };

  const handleSpeedChange = (speed: typeof fanSpeed) => {
    setFanSpeed(speed);
    addLog('click', `Điều chỉnh tốc độ quạt sang: ${speed}`);
  };

  const handleColorChange = (color: typeof auraColor, name: string) => {
    setAuraColor(color);
    addLog('click', `Thay đổi màu đèn Aura sang: ${name}`);
  };

  const handleResetFilter = () => {
    resetFilter();
    addLog('click', 'Đặt lại tuổi thọ màng lọc HEPA H14');
  };

  // Generate SVG Path for the Line Graph
  const generateSvgPaths = () => {
    const width = 500;
    const height = 100;
    const padding = 10;
    const maxVal = 150; // Scaling ceiling for AQI
    const pointsCount = aqiHistory.length;
    
    const coords = aqiHistory.map((val, idx) => {
      const x = (idx * (width / (pointsCount - 1)));
      // Map value (0 to maxVal) to height range (height - padding to padding)
      const y = height - padding - (val / maxVal) * (height - 2 * padding);
      return { x, y };
    });

  
    const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
    
    // Create fill path (close the shape to the bottom)
    const fillPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

    return { linePath, fillPath };
  };

  const { linePath, fillPath } = generateSvgPaths();

  return (
    <section id="dashboard" className="dashboard-section">
      <div className="section-header">
        <span className="section-subtitle">Live Simulation</span>
        <h2 className="section-main-title">Trải Nghiệm Bảng Điều Khiển Thực Tế</h2>
        <p className="section-desc">
          Tương tác trực tiếp với máy ảo để kiểm nghiệm cơ chế lọc khí. Chỉ số chất lượng không khí (AQI) 
          và tuổi thọ màng lọc sẽ thay đổi tương ứng theo các thiết lập của bạn.
        </p>
      </div>

      <div className="dashboard-container">
        {/* Left Column: Device Control Dashboard Cards */}
        <div className="dashboard-details">
          
          {/* Main Controls Card */}
          <div className="dashboard-card">
            <h3><Fan size={18} /> Cấu Hình Thiết Bị</h3>
            
            <div className="control-grid">
              {/* Power Row */}
              <div className="power-toggle-row">
                <div>
                  <span className="control-label">Nguồn Điện</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Bật thiết bị để kích hoạt hệ thống lọc tự động</p>
                </div>
                <button 
                  className={`power-btn ${power ? 'active' : ''}`}
                  onClick={handlePowerToggle}
                  title={power ? 'Tắt thiết bị' : 'Bật thiết bị'}
                >
                  <Power size={20} />
                </button>
              </div>

              {/* Fan Speed Row */}
              <div>
                <span className="control-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Tốc Độ Quạt Lọc</span>
                <div className="speed-selector">
                  {(['Auto', 1, 2, 3] as const).map((speed) => (
                    <button
                      key={speed}
                      disabled={!power}
                      className={`speed-btn ${fanSpeed === speed ? 'active' : ''}`}
                      onClick={() => handleSpeedChange(speed)}
                    >
                      {speed === 'Auto' ? 'AUTO' : `CẤP ${speed}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Aura Ambient Color Card */}
          <div className="dashboard-card">
            <h3><Sparkles size={18} /> Đèn Hào Quang Aura LED</h3>
            <span className="control-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Chọn Màu Dải Đèn</span>
            
            <div className="color-picker">
              <button 
                disabled={!power || fanSpeed === 'Auto'}
                className={`color-dot cyan ${auraColor === 'cyan' ? 'active' : ''}`}
                onClick={() => handleColorChange('cyan', 'Ice Cyan')}
                title="Ice Cyan"
              />
              <button 
                disabled={!power || fanSpeed === 'Auto'}
                className={`color-dot purple ${auraColor === 'purple' ? 'active' : ''}`}
                onClick={() => handleColorChange('purple', 'Neon Purple')}
                title="Neon Purple"
              />
              <button 
                disabled={!power || fanSpeed === 'Auto'}
                className={`color-dot green ${auraColor === 'green' ? 'active' : ''}`}
                onClick={() => handleColorChange('green', 'Emerald Green')}
                title="Emerald Green"
              />
              <button 
                disabled={!power || fanSpeed === 'Auto'}
                className={`color-dot orange ${auraColor === 'orange' ? 'active' : ''}`}
                onClick={() => handleColorChange('orange', 'Sunset Orange')}
                title="Sunset Orange"
              />
              <button 
                disabled={!power || fanSpeed === 'Auto'}
                className={`color-dot red ${auraColor === 'red' ? 'active' : ''}`}
                onClick={() => handleColorChange('red', 'Magma Red')}
                title="Magma Red"
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                {fanSpeed === 'Auto' ? '(Chế độ Auto tự điều chỉnh màu theo AQI)' : '(Được chọn thủ công)'}
              </span>
            </div>
          </div>

          {/* Filter Status Card */}
          <div className="dashboard-card">
            <h3><Shield size={18} /> Tình Trạng Màng Lọc HEPA H14</h3>
            <div className="filter-reset-row">
              <div className="filter-info">
                <span className="control-label">Tuổi Thọ Màng Lọc</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                  <div className="filter-bar-bg">
                    <div 
                      className="filter-bar-fill" 
                      style={{ 
                        width: `${filterLife}%`,
                        backgroundColor: filterLife > 50 ? 'var(--success)' : filterLife > 20 ? 'var(--warning)' : 'var(--danger)'
                      }} 
                    />
                  </div>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{Math.floor(filterLife)}%</strong>
                </div>
              </div>
              
              <button 
                className="reset-filter-btn"
                onClick={handleResetFilter}
                disabled={filterLife > 99}
                title="Thay thế và làm sạch màng lọc khí"
              >
                <RefreshCw size={14} style={{ marginRight: '6px', display: 'inline' }} />
                Thay Mới
              </button>
            </div>
          </div>

          {/* Real-time Graph Card */}
          <div className="dashboard-card graph-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}><Activity size={18} /> Biểu Đồ AQI Thời Gian Thực</h3>
              <span className="live-tag" style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                LIVE UPDATE
              </span>
            </div>
            
            <div className="aqi-graph-container">
              {/* Dynamic Y-Axis Labels */}
              <div className="graph-y-axis">
                <span>150 (Kém)</span>
                <span>75 (TB)</span>
                <span>0 (Tốt)</span>
              </div>
              
              <svg className="aqi-graph-svg" viewBox="0 0 500 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="graph-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Horizontal Grid lines */}
                <line x1="0" y1="10" x2="500" y2="10" className="grid-line-svg" />
                <line x1="0" y1="50" x2="500" y2="50" className="grid-line-svg" />
                <line x1="0" y1="90" x2="500" y2="90" className="grid-line-svg" />

                {/* Shaded Area Chart */}
                <path d={fillPath} className="graph-area" />

                {/* Line Chart */}
                <path d={linePath} className="graph-path" />
              </svg>
            </div>
          </div>

        </div>

        {/* Right Column: Live Simulated Device Preview */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <AetherDevice />
        </div>

      </div>
    </section>
  );
};
