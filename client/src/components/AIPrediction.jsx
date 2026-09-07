import { useEffect, useRef, useState } from 'react';

function AIPrediction({ batch, sensor }) {
  const progress = batch.targetMoisture
    ? Math.min(((45 - batch.currentMoisture) / (45 - batch.targetMoisture)) * 100, 100)
    : 0;

  const [displayProgress, setDisplayProgress] = useState(0);
  const animRef = useRef(null);

  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplayProgress(Math.round(progress * eased));
      if (p < 1) animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [progress]);

  return (
    <div className="ai-prediction">
      <h3 className="section-title">AI Drying Prediction</h3>
      <div className="prediction-grid">
        <div className="prediction-card">
          <div className="prediction-label">Current Batch</div>
          <div className="prediction-value">{batch.id}</div>
          <div className="prediction-sub">{batch.material}</div>
        </div>
        <div className="prediction-card">
          <div className="prediction-label">Elapsed Time</div>
          <div className="prediction-value">{batch.elapsed} min</div>
          <div className="prediction-sub">since {batch.startTime}</div>
        </div>
        <div className="prediction-card highlight">
          <div className="prediction-label">Estimated Remaining</div>
          <div className="prediction-value">{batch.estimatedRemaining} min</div>
          <div className="prediction-sub">~{Math.ceil(batch.estimatedRemaining / 60 * 10) / 10}h left</div>
        </div>
        <div className="prediction-card">
          <div className="prediction-label">Completion Est.</div>
          <div className="prediction-value">12:50 PM</div>
          <div className="prediction-sub">today</div>
        </div>
      </div>

      <div className="drying-progress">
        <div className="progress-header">
          <span>Drying Progress</span>
          <span>{displayProgress}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-labels">
          <span>Moisture: {batch.currentMoisture}%</span>
          <span>Target: {batch.targetMoisture}%</span>
        </div>
      </div>

      <div className="ai-factors">
        <h4 className="factors-title">Prediction Factors</h4>
        <div className="factor-list">
          <div className="factor">
            <span className="factor-name">Temperature</span>
            <span className="factor-value">{sensor.temperature}°C</span>
            <span className="factor-status good">Optimal</span>
          </div>
          <div className="factor">
            <span className="factor-name">Humidity</span>
            <span className="factor-value">{sensor.humidity}%</span>
            <span className="factor-status warn">Slightly High</span>
          </div>
          <div className="factor">
            <span className="factor-name">Airflow</span>
            <span className="factor-value">{sensor.airflow} m/s</span>
            <span className="factor-status good">Good</span>
          </div>
          <div className="factor">
            <span className="factor-name">Solar Input</span>
            <span className="factor-value">{sensor.solarPower}W</span>
            <span className="factor-status good">Charging</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIPrediction;
