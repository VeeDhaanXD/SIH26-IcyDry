function SystemStatus({ alerts, compact }) {
  const typeIcons = {
    info: 'ℹ',
    success: '✓',
    warning: '⚠',
    error: '✕',
  };

  const typeColors = {
    info: '#14b8a6',
    success: '#10b981',
    warning: '#f97316',
    error: '#ef4444',
  };

  const components = [
    { name: 'ESP32 Controller', status: 'online', detail: 'Firmware v2.1.0' },
    { name: 'Temperature Sensor', status: 'online', detail: 'SHT31' },
    { name: 'Humidity Sensor', status: 'online', detail: 'SHT31' },
    { name: 'DC Fans', status: 'active', detail: '85% speed' },
    { name: 'Heater Element', status: 'active', detail: '60% power' },
    { name: 'Solar Charge Ctrl', status: 'online', detail: 'MPPT' },
    { name: 'LiFePO4 Battery', status: 'charging', detail: '82%' },
    { name: 'Wi-Fi Module', status: 'online', detail: 'Connected' },
  ];

  const statusColors = {
    online: '#10b981',
    active: '#14b8a6',
    charging: '#f97316',
    offline: '#ef4444',
  };

  const displayComponents = compact ? components.slice(0, 5) : components;

  return (
    <div className="system-status">
      <div className="status-section">
        <h3 className="section-title">System Components</h3>
        <div className="component-grid">
          {displayComponents.map((comp) => (
            <div key={comp.name} className="component-item">
              <span
                className="status-indicator"
                style={{ background: statusColors[comp.status], color: statusColors[comp.status] }}
              />
              <div className="component-info">
                <span className="component-name">{comp.name}</span>
                <span className="component-detail">{comp.detail}</span>
              </div>
              <span className="component-status" style={{ color: statusColors[comp.status] }}>
                {comp.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {!compact && (
        <div className="status-section">
          <h3 className="section-title">Recent Alerts</h3>
          <div className="alert-list">
            {alerts.map((alert) => (
              <div key={alert.id} className="alert-item">
                <span className="alert-icon" style={{ color: typeColors[alert.type] }}>
                  {typeIcons[alert.type]}
                </span>
                <span className="alert-message">{alert.message}</span>
                <span className="alert-time">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SystemStatus;
