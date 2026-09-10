export default function SimulationControls({ config, setConfig, onStart, onPause, onReset, state, onTriggerHighTemp, onResetTrigger, triggerActive }) {
  return (
    <div className="sim-controls">
      <h3 className="panel-title">SIMULATION CONTROL</h3>

      <div className="control-grid">
        <div className="control-group">
          <label>Batch Weight (kg)</label>
          <input type="number" step="0.1" min="0.5" max="5"
            value={config.batchWeight}
            onChange={e => setConfig({ ...config, batchWeight: +e.target.value })}
            disabled={state.running} />
        </div>

        <div className="control-group">
          <label>Initial Moisture (%)</label>
          <input type="number" step="1" min="15" max="50"
            value={config.initialMoisture}
            onChange={e => setConfig({ ...config, initialMoisture: +e.target.value })}
            disabled={state.running} />
        </div>

        <div className="control-group">
          <label>Solar Intensity (W/m²)</label>
          <input type="number" step="10" min="0" max="1000"
            value={config.solarIntensity}
            onChange={e => setConfig({ ...config, solarIntensity: +e.target.value })}
            disabled={state.running} />
        </div>

        <div className="control-group">
          <label>Ambient Temp (°C)</label>
          <input type="number" step="1" min="15" max="45"
            value={config.ambientTemp}
            onChange={e => setConfig({ ...config, ambientTemp: +e.target.value })}
            disabled={state.running} />
        </div>

        <div className="control-group">
          <label>Fan Mode</label>
          <select value={config.fanMode}
            onChange={e => setConfig({ ...config, fanMode: e.target.value })}>
            <option value="AUTO">AUTO</option>
            <option value="MANUAL">MANUAL</option>
          </select>
        </div>

        <div className="control-group">
          <label>Heater Mode</label>
          <select value={config.heaterMode}
            onChange={e => setConfig({ ...config, heaterMode: e.target.value })}>
            <option value="AUTO">AUTO</option>
            <option value="ON">ON</option>
            <option value="OFF">OFF</option>
          </select>
        </div>
      </div>

      <div className="control-buttons">
        {!state.running ? (
          <button className="btn btn-start" onClick={onStart}>
            ▶ START SIMULATION
          </button>
        ) : (
          <button className="btn btn-pause" onClick={onPause}>
            {state.paused ? '▶ RESUME' : '⏸ PAUSE'}
          </button>
        )}
        <button className="btn btn-reset" onClick={onReset}>
          ↻ RESET
        </button>
      </div>

      <div style={{ marginTop: "16px", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
        <h3 className="panel-title" style={{ marginBottom: "10px" }}>HARDWARE TRIGGER</h3>
        <p style={{ fontSize: "11px", color: "var(--text-dim)", marginBottom: "10px", lineHeight: 1.4 }}>
          Send command to ESP32 to trigger high temperature alert + buzzer
        </p>
        {!triggerActive ? (
          <button className="btn btn-trigger" onClick={onTriggerHighTemp} style={{
            width: "100%",
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "#fff",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            fontWeight: 700,
            fontSize: "13px",
            cursor: "pointer",
            letterSpacing: "0.5px",
            boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
            transition: "all 0.3s ease"
          }}>
            ⚠ TRIGGER HIGH TEMP
          </button>
        ) : (
          <button className="btn btn-reset" onClick={onResetTrigger} style={{
            width: "100%",
            background: "#333",
            color: "var(--text)",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            fontWeight: 700,
            fontSize: "13px",
            cursor: "pointer"
          }}>
            ✕ RESET TRIGGER
          </button>
        )}
      </div>
    </div>
  );
}
