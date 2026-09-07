import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

function PackagingStatus({ stats }) {
  const COLORS = ['#f97316', '#14b8a6', '#10b981'];

  return (
    <div className="packaging-status">
      <h3 className="section-title">Packaging Overview</h3>
      <div className="packaging-grid">
        <div className="packaging-stats">
          <div className="pack-stat">
            <span className="pack-stat-value">{stats.totalPacked.toLocaleString()}</span>
            <span className="pack-stat-label">Total Packed</span>
          </div>
          <div className="pack-stat">
            <span className="pack-stat-value">{stats.todayPacked}</span>
            <span className="pack-stat-label">Today</span>
          </div>
          <div className="pack-stat">
            <span className="pack-stat-value">{stats.avgPackingTime}m</span>
            <span className="pack-stat-label">Avg Time</span>
          </div>
          <div className="pack-stat">
            <span className="pack-stat-value">{stats.lastBatchPacked}</span>
            <span className="pack-stat-label">Last Packed</span>
          </div>
        </div>
        <div className="packaging-chart-section">
          <h4 className="chart-subtitle">Packaging Materials Used</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.materialTypes}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="count"
              >
                {stats.materialTypes.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#1f2028',
                  border: '1px solid #2e303a',
                  borderRadius: 8,
                  color: '#f3f4f6',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {stats.materialTypes.map((item, index) => (
              <div key={item.name} className="legend-item">
                <span className="legend-dot" style={{ background: COLORS[index] }} />
                <span>{item.name}</span>
                <span className="legend-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PackagingStatus;
