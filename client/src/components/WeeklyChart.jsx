import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function WeeklyChart({ data }) {
  return (
    <div className="chart-container" style={{ '--chart-accent': '#f43f5e' }}>
      <h3 className="chart-title">Weekly Production</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#e11d48" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2030" />
          <XAxis dataKey="day" stroke="#555873" fontSize={11} />
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
          <Bar
            dataKey="quantity"
            fill="url(#barGrad)"
            radius={[6, 6, 0, 0]}
            name="Quantity"
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeeklyChart;
