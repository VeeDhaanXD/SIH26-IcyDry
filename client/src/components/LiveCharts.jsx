import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function LiveCharts({ history }) {
  const data = history.map(h => ({
    time: `${Math.floor(h.timestamp / 60)}:${String(h.timestamp % 60).padStart(2, '0')}`,
    temp: h.temperature,
    hum: h.humidity,
    moisture: h.moisture,
  }));

  if (data.length < 2) {
    return (
      <div className="live-charts">
        <h3 className="panel-title">LIVE SENSOR GRAPHS</h3>
        <div className="chart-empty">Start simulation to see real-time data</div>
      </div>
    );
  }

  return (
    <div className="live-charts">
      <h3 className="panel-title">LIVE SENSOR GRAPHS</h3>

      <div className="chart-row">
        <div className="chart-box">
          <h4>Temperature (°C)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#666" fontSize={10} />
              <YAxis stroke="#666" fontSize={10} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ background: '#1a1a2a', border: '1px solid #333' }} />
              <ReferenceLine y={48} stroke="#ff444466" strokeDasharray="3 3" label="Max" />
              <Line type="monotone" dataKey="temp" stroke="#ff6644" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>Humidity (%)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#666" fontSize={10} />
              <YAxis stroke="#666" fontSize={10} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ background: '#1a1a2a', border: '1px solid #333' }} />
              <Line type="monotone" dataKey="hum" stroke="#4488ff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-row">
        <div className="chart-box full-width">
          <h4>Moisture Content (%)</h4>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#666" fontSize={10} />
              <YAxis stroke="#666" fontSize={10} domain={[0, 'auto']} />
              <Tooltip contentStyle={{ background: '#1a1a2a', border: '1px solid #333' }} />
              <ReferenceLine y={8} stroke="#44ff4466" strokeDasharray="3 3" label="Target" />
              <Line type="monotone" dataKey="moisture" stroke="#44bb44" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
