import { useEffect, useRef, useState } from 'react';

function SensorCard({ icon, label, value, unit, color, max, current, hero, compact }) {
  const percent = max ? Math.min((current / max) * 100, 100) : 0;
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);
  const animFrame = useRef(null);

  useEffect(() => {
    const start = prevValue.current;
    const end = typeof value === 'number' ? value : parseFloat(value) || 0;
    const duration = 800;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentVal = start + (end - start) * eased;
      setDisplayValue(Number.isInteger(end) ? Math.round(currentVal) : +currentVal.toFixed(1));
      if (progress < 1) {
        animFrame.current = requestAnimationFrame(animate);
      } else {
        prevValue.current = end;
      }
    };

    animFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame.current);
  }, [value]);

  const cardClass = `sensor-card${hero ? ' hero' : ''}${compact ? ' small' : ''}`;

  return (
    <div className={cardClass} style={{ '--card-accent': color }}>
      {hero ? (
        <>
          <div className="sensor-header">
            <span className="sensor-icon" style={{ color }}>{icon}</span>
            <span className="sensor-label">{label}</span>
          </div>
          <div className="sensor-ring" style={{ borderColor: color }}>
            <div className="sensor-value" style={{ color }}>
              {displayValue}
              <span className="sensor-unit">{unit}</span>
            </div>
          </div>
          <div className="audio-bars">
            <span className="audio-bar" />
            <span className="audio-bar" />
            <span className="audio-bar" />
            <span className="audio-bar" />
            <span className="audio-bar" />
            <span className="audio-bar" />
            <span className="audio-bar" />
          </div>
          {max !== undefined && (
            <div className="sensor-bar-track">
              <div
                className="sensor-bar-fill"
                style={{ width: `${percent}%`, background: color }}
              />
            </div>
          )}
          {max !== undefined && (
            <div className="sensor-range">
              <span>0</span>
              <span>{max}{unit}</span>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="sensor-header">
            <span className="sensor-icon" style={{ color }}>{icon}</span>
            <span className="sensor-label">{label}</span>
          </div>
          <div className="sensor-value" style={{ color }}>
            {displayValue}
            <span className="sensor-unit">{unit}</span>
          </div>
          {max !== undefined && (
            <div className="sensor-bar-track">
              <div
                className="sensor-bar-fill"
                style={{ width: `${percent}%`, background: color }}
              />
            </div>
          )}
          {max !== undefined && (
            <div className="sensor-range">
              <span>0</span>
              <span>{max}{unit}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SensorCard;
