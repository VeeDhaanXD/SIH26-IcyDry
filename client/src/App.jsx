import { useState, useEffect } from 'react';
import SensorCard from './components/SensorCard';
import DryingChart from './components/DryingChart';
import SolarChart from './components/SolarChart';
import BatchHistory from './components/BatchHistory';
import SystemStatus from './components/SystemStatus';
import AIPrediction from './components/AIPrediction';
import PackagingStatus from './components/PackagingStatus';
import WeeklyChart from './components/WeeklyChart';
import {
  currentBatch,
  sensorData,
  dryingHistory,
  solarHistory,
  batchHistory,
  packagingStats,
  systemAlerts,
  weeklyProduction,
} from './data/mockData';
import './App.css';

function App() {
  const [sensor, setSensor] = useState(sensorData);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [time, setTime] = useState(new Date());
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('icydry-theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    document.body.classList.toggle('light', !isDark);
    document.body.style.colorScheme = isDark ? 'dark' : 'light';
    localStorage.setItem('icydry-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const sensorInterval = setInterval(() => {
      setSensor((prev) => ({
        ...prev,
        temperature: +(prev.temperature + (Math.random() - 0.5) * 0.6).toFixed(1),
        humidity: +(prev.humidity + (Math.random() - 0.5) * 0.4).toFixed(1),
        solarPower: +(prev.solarPower + (Math.random() - 0.5) * 0.3).toFixed(1),
      }));
    }, 3000);

    const clockInterval = setInterval(() => setTime(new Date()), 1000);

    return () => {
      clearInterval(sensorInterval);
      clearInterval(clockInterval);
    };
  }, []);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">☀</span>
          <div className="brand-text">
            <h1>IcyDry</h1>
            <span className="brand-sub">Smart Solar Dryer</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">◉</span>
            Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === 'batches' ? 'active' : ''}`}
            onClick={() => setActiveTab('batches')}
          >
            <span className="nav-icon">☰</span>
            Batches
          </button>
          <button
            className={`nav-item ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            <span className="nav-icon">⚙</span>
            System
          </button>
          <button
            className={`nav-item ${activeTab === 'packaging' ? 'active' : ''}`}
            onClick={() => setActiveTab('packaging')}
          >
            <span className="nav-icon">◫</span>
            Packaging
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-battery">
            <div className="battery-icon">
              <div
                className="battery-fill"
                style={{ width: `${sensor.batteryLevel}%` }}
              />
            </div>
            <span>{sensor.batteryLevel}%</span>
          </div>
          <div className="sidebar-status">
            <span className="status-dot online" />
            System Online
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="top-bar-left">
            <h2 className="page-title">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'batches' && 'Batch Management'}
              {activeTab === 'system' && 'System Status'}
              {activeTab === 'packaging' && 'Packaging'}
            </h2>
            <span className="batch-badge">
              <span className="batch-badge-dot" />
              {currentBatch.id} — {currentBatch.status.toUpperCase()}
            </span>
          </div>
          <div className="top-bar-right">
            <button
              className="theme-toggle"
              onClick={() => setIsDark((d) => !d)}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? '☀' : '☽'}
            </button>
            <span className="live-indicator">
              <span className="live-dot" />
              Live
            </span>
            <span className="current-time">
              {time.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
            <span className="current-date">
              {time.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="dashboard-grid">
            <SensorCard
              icon="🌡"
              label="Temperature"
              value={sensor.temperature}
              unit="°C"
              color="#f97316"
              max={80}
              current={sensor.temperature}
              hero
            />

            <SensorCard
              icon="⚡"
              label="Solar Power"
              value={sensor.solarPower}
              unit="W"
              color="#eab308"
              max={20}
              current={sensor.solarPower}
              compact
            />
            <SensorCard
              icon="💧"
              label="Humidity"
              value={sensor.humidity}
              unit="%"
              color="#14b8a6"
              max={100}
              current={sensor.humidity}
              compact
            />

            <DryingChart data={dryingHistory} />

            <SystemStatus alerts={systemAlerts} compact />

            <AIPrediction batch={currentBatch} sensor={sensor} />

            <SolarChart data={solarHistory} />

            <SensorCard
              icon="🔋"
              label="Battery"
              value={sensor.batteryLevel}
              unit="%"
              color="#10b981"
              max={100}
              current={sensor.batteryLevel}
              compact
            />

            <WeeklyChart data={weeklyProduction} />
          </div>
        )}

        {activeTab === 'batches' && (
          <div className="batches-view">
            <BatchHistory batches={batchHistory} />
          </div>
        )}

        {activeTab === 'system' && (
          <div className="system-view">
            <SystemStatus alerts={systemAlerts} />
          </div>
        )}

        {activeTab === 'packaging' && (
          <div className="packaging-view">
            <PackagingStatus stats={packagingStats} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
