import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function SolarChart({ data }) {
  return (
    <div className="chart-container" style={{ '--chart-accent': '#eab308' }}>
      <h3 className="chart-title">Solar Energy & Battery</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#eab308" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
          <Area
            type="monotone"
            dataKey="power"
            stroke="#eab308"
            fill="url(#solarGrad)"
            name="Solar (W)"
            strokeWidth={2.5}
            activeDot={{ r: 5, stroke: '#eab308', strokeWidth: 2, fill: '#14161f' }}
          />
          <Area
            type="monotone"
            dataKey="battery"
            stroke="#10b981"
            fill="url(#batteryGrad)"
            name="Battery (%)"
            strokeWidth={2.5}
            activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2, fill: '#14161f' }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="wave-container">
        <svg className="wave-svg" viewBox="0 0 1200 30" preserveAspectRatio="none">
          <path
            d="M0,15 C150,5 350,25 600,15 C850,5 1050,25 1200,15 L1200,30 L0,30 Z"
            fill="rgba(234, 179, 8, 0.03)"
          />
        </svg>
      </div>
    </div>
  );
}

export default SolarChart;
