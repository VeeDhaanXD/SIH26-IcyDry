import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:5000";

function LiveSensors() {
  const [sensor, setSensor] = useState(null);
  const [online, setOnline] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SERVER_URL);
    socketRef.current = socket;

    socket.on("connect", () => setOnline(true));
    socket.on("disconnect", () => setOnline(false));

    socket.on("sensorUpdate", (data) => {
      setSensor(data);
      setOnline(true);
      setLastUpdate(new Date());
    });

    fetch(`${SERVER_URL}/api/sensors/latest`)
      .then((r) => (r.ok ? r.json() : null))
      .then((result) => {
        if (result && result.success) {
          setSensor(result.data);
          setOnline(true);
          setLastUpdate(new Date(result.data.timestamp));
        }
      })
      .catch(() => {});

    return () => socket.disconnect();
  }, []);

  if (!sensor) {
    return (
      <div className="dashboard-grid">
        <div className="sensor-card hero" style={{ gridColumn: "1 / -1", minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "48px", animation: "floatSlow 3s ease-in-out infinite" }}>📡</div>
          <h2 style={{ margin: 0, color: "var(--text-bright)" }}>Waiting for ESP32 data...</h2>
          <p style={{ opacity: 0.5, margin: 0 }}>Make sure ESP32 is connected to WiFi</p>
          <div className="audio-bars" style={{ marginTop: "12px" }}>
            <div className="audio-bar"></div>
            <div className="audio-bar"></div>
            <div className="audio-bar"></div>
            <div className="audio-bar"></div>
            <div className="audio-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  const tempColor = sensor.temperature >= 50 ? "#ef4444" : sensor.temperature >= 35 ? "#f97316" : "#10b981";
  const humidityColor = sensor.humidity >= 70 ? "#ef4444" : sensor.humidity >= 50 ? "#eab308" : "#14b8a6";
  const fanColor = sensor.fanSpeed > 0 ? "#3b82f6" : "#6b7280";

  return (
    <div className="dashboard-grid">
      <div className="sensor-card hero" style={{ "--card-accent": tempColor, animationDelay: "0s" }}>
        <div className="sensor-header">
          <span className="sensor-icon">🌡</span>
          <span className="sensor-label">Temperature</span>
        </div>
        <div className="sensor-value" style={{ color: tempColor }}>
          {sensor.temperature}<span className="sensor-unit">°C</span>
        </div>
        <div className="sensor-bar-track">
          <div className="sensor-bar-fill" style={{ width: `${(sensor.temperature / 80) * 100}%`, background: tempColor }}></div>
        </div>
        <div className="sensor-range">
          <span>0°C</span>
          <span style={{ color: tempColor, fontWeight: 600 }}>{sensor.temperature >= 50 ? "HIGH TEMP!" : sensor.temperature >= 45 ? "Warm" : "Normal"}</span>
          <span>80°C</span>
        </div>
      </div>

      <div className="sensor-card" style={{ "--card-accent": humidityColor, animationDelay: "0.1s" }}>
        <div className="sensor-header">
          <span className="sensor-icon">💧</span>
          <span className="sensor-label">Humidity</span>
        </div>
        <div className="sensor-value" style={{ color: humidityColor }}>
          {sensor.humidity}<span className="sensor-unit">%</span>
        </div>
        <div className="sensor-bar-track">
          <div className="sensor-bar-fill" style={{ width: `${sensor.humidity}%`, background: humidityColor }}></div>
        </div>
        <div className="sensor-range">
          <span>0%</span>
          <span style={{ color: humidityColor, fontWeight: 600 }}>{sensor.humidity >= 70 ? "HIGH" : "Normal"}</span>
          <span>100%</span>
        </div>
      </div>

      <div className="sensor-card" style={{ "--card-accent": fanColor, animationDelay: "0.18s" }}>
        <div className="sensor-header">
          <span className="sensor-icon">💨</span>
          <span className="sensor-label">Fan Speed</span>
        </div>
        <div className="sensor-value" style={{ color: fanColor }}>
          {sensor.fanSpeed}<span className="sensor-unit">%</span>
        </div>
        <div className="sensor-bar-track">
          <div className="sensor-bar-fill" style={{ width: `${sensor.fanSpeed}%`, background: fanColor }}></div>
        </div>
        <div className="sensor-range">
          <span>0%</span>
          <span style={{ color: fanColor, fontWeight: 600 }}>{sensor.fanSpeed > 0 ? "Running" : "Off"}</span>
          <span>100%</span>
        </div>
      </div>

      <div className="sensor-card" style={{ "--card-accent": sensor.heaterStatus ? "#ef4444" : "#6b7280", animationDelay: "0.26s" }}>
        <div className="sensor-header">
          <span className="sensor-icon">🔥</span>
          <span className="sensor-label">Heater</span>
        </div>
        <div className="sensor-value" style={{ color: sensor.heaterStatus ? "#ef4444" : "#6b7280" }}>
          {sensor.heaterStatus ? "ON" : "OFF"}
        </div>
        <div className="sensor-bar-track">
          <div className="sensor-bar-fill" style={{ width: sensor.heaterStatus ? "100%" : "0%", background: "#ef4444" }}></div>
        </div>
        <div className="sensor-range">
          <span>OFF</span>
          <span style={{ color: sensor.heaterStatus ? "#ef4444" : "#6b7280", fontWeight: 600 }}>{sensor.heaterStatus ? "Active" : "Inactive"}</span>
          <span>ON</span>
        </div>
      </div>

      <div className="sensor-card" style={{ "--card-accent": "#8b5cf6", animationDelay: "0.34s" }}>
        <div className="sensor-header">
          <span className="sensor-icon">📡</span>
          <span className="sensor-label">Device</span>
        </div>
        <div className="sensor-value" style={{ fontSize: "18px", color: "#8b5cf6" }}>
          {sensor.deviceId}
        </div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>
          Mode: <span style={{ color: "var(--text-bright)", fontWeight: 600 }}>{sensor.systemMode || "AUTO"}</span>
        </div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
          Batch: <span style={{ color: "var(--text-bright)", fontWeight: 600 }}>{sensor.batchId}</span>
        </div>
      </div>

      <div className="sensor-card" style={{ "--card-accent": online ? "#10b981" : "#ef4444", animationDelay: "0.42s", gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>{online ? "🟢" : "🔴"}</span>
            <div>
              <div style={{ fontWeight: 700, color: "var(--text-bright)", fontSize: "14px" }}>
                ESP32 {online ? "ONLINE" : "OFFLINE"}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                {online ? "Receiving live sensor data" : "Connection lost — retrying..."}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12px", color: "var(--text-muted)" }}>
            <span>Last update: {lastUpdate ? lastUpdate.toLocaleTimeString() : "—"}</span>
            <div className="audio-bars">
              {online && (
                <>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveSensors;
