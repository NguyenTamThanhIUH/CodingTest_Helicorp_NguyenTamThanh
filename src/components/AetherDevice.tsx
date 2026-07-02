import React from 'react';
import { useApp } from '../context/AppContext';
import { Power, Wind } from 'lucide-react';

export const AetherDevice: React.FC = () => {
  const { power, fanSpeed, auraColor, aqi, filterLife } = useApp();

  // Determine fan speed rotation duration
  const getFanDuration = () => {
    if (!power) return '0s';
    if (fanSpeed === 1) return '2.5s';
    if (fanSpeed === 2) return '1.2s';
    if (fanSpeed === 3) return '0.4s';
    if (fanSpeed === 'Auto') {
      return aqi > 100 ? '0.4s' : aqi > 50 ? '1.2s' : '3s';
    }
    return '1.2s';
  };

  // Determine AQI category text and color
  const getAqiStatus = () => {
    if (aqi <= 35) return { text: 'Tốt', color: '#10b981' };
    if (aqi <= 75) return { text: 'Bình thường', color: '#06b6d4' };
    if (aqi <= 115) return { text: 'Kém', color: '#8b5cf6' };
    if (aqi <= 150) return { text: 'Xấu', color: '#f97316' };
    return { text: 'Nguy hại', color: '#ef4444' };
  };

  const aqiStatus = getAqiStatus();

  return (
    <div className="device-wrapper">
      {/* Device Outer Glow (Ambient Aura) */}
      <div className={`device-glow color-${auraColor} ${power ? 'active' : 'inactive'}`} />

      {/* Main Device Cylinder Body */}
      <div className={`device-cylinder ${power ? 'powered-on' : 'powered-off'}`}>
        
        {/* Top Fan Grill & Aura Ring */}
        <div className="device-top">
          <div className={`aura-ring color-${auraColor} ${power ? 'glowing' : ''}`} />
          <div className="fan-grill">
            <div 
              className="fan-blades" 
              style={{ animationDuration: getFanDuration() }}
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="blade" style={{ transform: `rotate(${i * 60}deg)` }} />
              ))}
            </div>
          </div>
        </div>

        {/* LED Glass Touch Screen */}
        <div className="device-screen-panel">
          <div className="glass-screen">
            {power ? (
              <>
                <div className="screen-header">
                  <span className="live-tag">LIVE AQI</span>
                  <Wind size={12} className="pulse-icon" />
                </div>
                <div className="aqi-number" style={{ color: aqiStatus.color }}>
                  {aqi}
                </div>
                <div className="aqi-desc" style={{ backgroundColor: `${aqiStatus.color}15`, color: aqiStatus.color }}>
                  {aqiStatus.text}
                </div>
                <div className="screen-footer">
                  <div className="stat-label">
                    <span>QUẠT</span>
                    <strong className="text-val">{fanSpeed}</strong>
                  </div>
                  <div className="stat-divider" />
                  <div className="stat-label">
                    <span>MÀNG LỌC</span>
                    <strong className="text-val">{Math.floor(filterLife)}%</strong>
                  </div>
                </div>
              </>
            ) : (
              <div className="screen-off-state">
                <Power size={20} className="off-icon" />
                <span>STANDBY</span>
              </div>
            )}
          </div>
        </div>

        {/* Sleek Aluminum Grill Pattern for Air Intake */}
        <div className="device-body-grill">
          <div className="air-intake-lines">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="grill-line" />
            ))}
          </div>
        </div>

        {/* Base Panel */}
        <div className="device-base">
          <span className="brand-logo">AETHER</span>
        </div>
      </div>

      {/* Styled JSX for the Device Graphic - avoiding external asset dependency */}
      <style>{`
        .device-wrapper {
          position: relative;
          width: 320px;
          height: 520px;
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1200px;
        }

        /* Ambient Aura Background Glow */
        .device-glow {
          position: absolute;
          width: 260px;
          height: 440px;
          border-radius: 130px;
          filter: blur(60px);
          opacity: 0;
          z-index: 1;
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .device-glow.active {
          opacity: 0.35;
        }
        .device-glow.color-cyan { background: var(--aura-cyan); }
        .device-glow.color-purple { background: var(--aura-purple); }
        .device-glow.color-green { background: var(--aura-green); }
        .device-glow.color-orange { background: var(--aura-orange); }
        .device-glow.color-red { background: var(--aura-red); }

        /* Outer Cylinder Body */
        .device-cylinder {
          position: relative;
          width: 220px;
          height: 420px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 243, 248, 0.9) 100%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 110px / 40px;
          box-shadow: 
            0 15px 35px rgba(0, 0, 0, 0.05),
            inset -8px 0 15px rgba(0, 0, 0, 0.03),
            inset 8px 0 15px rgba(255, 255, 255, 0.8);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0;
          transition: all 0.5s ease;
        }

        [data-theme="dark"] .device-cylinder {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.6),
            inset -8px 0 20px rgba(0, 0, 0, 0.4),
            inset 8px 0 20px rgba(255, 255, 255, 0.05);
        }

        .device-cylinder::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: linear-gradient(90deg, 
            rgba(255, 255, 255, 0) 0%, 
            rgba(255, 255, 255, 0.3) 30%, 
            rgba(255, 255, 255, 0) 60%, 
            rgba(0, 0, 0, 0.03) 95%
          );
          border-radius: inherit;
          pointer-events: none;
        }

        [data-theme="dark"] .device-cylinder::before {
          background: linear-gradient(90deg, 
            rgba(255, 255, 255, 0) 0%, 
            rgba(255, 255, 255, 0.05) 30%, 
            rgba(255, 255, 255, 0) 60%, 
            rgba(0, 0, 0, 0.2) 95%
          );
        }

        .device-cylinder.powered-off {
          filter: brightness(0.8);
        }

        /* Top cap & Fan */
        .device-top {
          position: absolute;
          top: -20px;
          width: 220px;
          height: 40px;
          background: #e2e8f0;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
        }

        [data-theme="dark"] .device-top {
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .aura-ring {
          position: absolute;
          width: 200px;
          height: 30px;
          border-radius: 50%;
          border: 2px solid transparent;
          transition: all 0.8s ease;
        }

        .aura-ring.glowing {
          box-shadow: 0 0 10px 1px var(--active-aura);
          border-color: var(--active-aura);
        }

        .fan-grill {
          position: relative;
          width: 170px;
          height: 22px;
          background: #cbd5e1;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.2);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        [data-theme="dark"] .fan-grill {
          background: #0f172a;
        }

        .fan-blades {
          position: relative;
          width: 130px;
          height: 130px;
          animation: spin-slow linear infinite;
        }

        .blade {
          position: absolute;
          top: 0;
          left: calc(50% - 8px);
          width: 16px;
          height: 65px;
          background: linear-gradient(to bottom, #94a3b8, #475569);
          clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%);
          transform-origin: bottom center;
        }

        [data-theme="dark"] .blade {
          background: linear-gradient(to bottom, #475569, #1e293b);
        }

        /* Screen Panel */
        .device-screen-panel {
          margin-top: 50px;
          z-index: 5;
          width: 80%;
          display: flex;
          justify-content: center;
        }

        .glass-screen {
          width: 156px;
          height: 156px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.03),
            inset 0 4px 10px rgba(255, 255, 255, 0.8),
            inset 0 -4px 10px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 15px;
          text-align: center;
          user-select: none;
          transition: all 0.3s ease;
        }

        [data-theme="dark"] .glass-screen {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 
            0 15px 30px rgba(0, 0, 0, 0.35),
            inset 0 4px 10px rgba(255, 255, 255, 0.05),
            inset 0 -4px 10px rgba(0, 0, 0, 0.2);
        }

        .screen-header {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }

        .pulse-icon {
          animation: float 2s infinite ease-in-out;
        }

        .aqi-number {
          font-family: var(--font-heading);
          font-size: 2.75rem;
          font-weight: 800;
          line-height: 1;
          margin: 4px 0;
          transition: color 0.5s ease;
          text-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }

        .aqi-desc {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 10px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          transition: all 0.5s ease;
        }

        .screen-footer {
          display: flex;
          width: 100%;
          justify-content: space-around;
          align-items: center;
          margin-top: 12px;
        }

        .stat-label {
          display: flex;
          flex-direction: column;
          font-size: 0.55rem;
          color: var(--text-muted);
          font-weight: 700;
        }

        .text-val {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-divider {
          width: 1px;
          height: 16px;
          background-color: var(--border-color);
        }

        .screen-off-state {
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .off-icon {
          opacity: 0.4;
        }

        /* Grill Lines Intakes */
        .device-body-grill {
          width: 85%;
          display: flex;
          justify-content: center;
        }

        .air-intake-lines {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px 12px;
          width: 100%;
          padding: 10px;
        }

        .grill-line {
          height: 4px;
          border-radius: 2px;
          background: #cbd5e1;
          opacity: 0.6;
        }

        [data-theme="dark"] .grill-line {
          background: #1e293b;
        }

        /* Device Base */
        .device-base {
          margin-bottom: 10px;
          text-align: center;
          width: 100%;
        }

        .brand-logo {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 2px;
          opacity: 0.6;
        }

        /* Float device animations */
        .device-cylinder {
          animation: float 6s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
