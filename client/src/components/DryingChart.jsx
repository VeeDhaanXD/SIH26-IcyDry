import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function DryingChart({ data }) {
  return (
    <div className="chart-container" style={{ '--chart-accent': '#f97316' }}>
      <h3 className="chart-title">Drying Process Monitoring</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="tempGradLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2030" />
          <XAxis dataKey="time" stroke="#555873" fontSize={11} />
          <YAxis stroke="#555873" fontSize={11} />
          <Tooltip
            contentStyle={{
              background: '#14161f',
              border: '1px solid #2a2d42',
              borderRadius: 10,
              color: '#f0f1f5',
              fontSize: 12,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#f97316"
            strokeWidth={2.5}
            name="Temp (°C)"
            dot={false}
            activeDot={{ r: 5, stroke: '#f97316', strokeWidth: 2, fill: '#14161f' }}
          />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#14b8a6"
            strokeWidth={2.5}
            name="Humidity (%)"
            dot={false}
            activeDot={{ r: 5, stroke: '#14b8a6', strokeWidth: 2, fill: '#14161f' }}
          />
          <Line
            type="monotone"
            dataKey="moisture"
            stroke="#10b981"
            strokeWidth={2.5}
            name="Moisture (%)"
            dot={false}
            activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2, fill: '#14161f' }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="wave-container">
        <svg className="wave-svg" viewBox="0 0 1200 30" preserveAspectRatio="none">
          <path
            d="M0,15 C150,25 350,5 600,15 C850,25 1050,5 1200,15 L1200,30 L0,30 Z"
            fill="rgba(249, 115, 22, 0.04)"
          />
        </svg>
      </div>
    </div>
  );
}

export default DryingChart;
