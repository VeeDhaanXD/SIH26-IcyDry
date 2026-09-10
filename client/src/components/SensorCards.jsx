export default function SensorCards({ state }) {
  const tempColor = state.temperature > 50 ? '#ff4444' : state.temperature > 40 ? '#ff8800' : '#44bb44';
  const humColor = state.humidity > 70 ? '#4488ff' : state.humidity > 50 ? '#44bb44' : '#ffaa00';
  const solarColor = state.solarIntensity > 600 ? '#ffdd00' : state.solarIntensity > 300 ? '#ffaa00' : '#888';
  const batteryColor = state.battery > 60 ? '#44bb44' : state.battery > 30 ? '#ffaa00' : '#ff4444';

  const cards = [
    {
      label: 'TEMPERATURE',
      value: `${state.temperature} °C`,
      sub: state.temperature > 48 ? '↑ High' : state.temperature < 30 ? '↓ Low' : '● Normal',
      color: tempColor,
      icon: '🌡️',
    },
    {
      label: 'HUMIDITY',
      value: `${state.humidity} %`,
      sub: state.humidity > 65 ? '↑ Above target' : state.humidity < 35 ? '↓ Low' : '● Normal',
      color: humColor,
      icon: '💧',
    },
    {
      label: 'SOLAR',
      value: `${state.solarIntensity} W/m²`,
      sub: state.solarIntensity > 600 ? '☀ Strong' : state.solarIntensity > 200 ? '☁ Weak' : '🌙 None',
      color: solarColor,
      icon: '☀️',
    },
    {
      label: 'FAN',
      value: `${state.fanSpeed} %`,
      sub: state.fanMode === 'AUTO' ? 'AUTO' : 'MANUAL',
      color: '#6aafcf',
      icon: '💨',
    },
    {
      label: 'HEATER',
      value: state.heaterOn ? 'ON' : 'OFF',
      sub: state.heaterOn ? 'SOLAR + AUX' : 'STANDBY',
      color: state.heaterOn ? '#ff6644' : '#666',
      icon: '🔥',
    },
    {
      label: 'BATTERY',
      value: `${state.battery} %`,
      sub: state.battery > 50 ? 'Charging' : state.battery > 20 ? 'Low' : 'Critical',
      color: batteryColor,
      icon: '🔋',
    },
  ];

  return (
    <div className="sensor-cards">
      {cards.map(card => (
        <div key={card.label} className="sensor-card">
          <div className="sensor-card-header">
            <span className="sensor-icon">{card.icon}</span>
            <span className="sensor-label">{card.label}</span>
          </div>
          <div className="sensor-value" style={{ color: card.color }}>{card.value}</div>
          <div className="sensor-sub">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
