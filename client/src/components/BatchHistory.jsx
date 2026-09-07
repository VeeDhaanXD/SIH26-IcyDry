function BatchHistory({ batches }) {
  const statusColors = {
    completed: '#10b981',
    drying: '#f97316',
    failed: '#ef4444',
  };

  return (
    <div className="batch-history">
      <h3 className="section-title">Batch History</h3>
      <div className="batch-table-wrapper">
        <table className="batch-table">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Date</th>
              <th>Material</th>
              <th>Qty</th>
              <th>Drying Time</th>
              <th>Moisture</th>
              <th>Quality</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => (
              <tr key={batch.id}>
                <td className="batch-id">{batch.id}</td>
                <td>{batch.date}</td>
                <td>{batch.material}</td>
                <td>{batch.quantity}</td>
                <td>{batch.dryingTime ? `${batch.dryingTime}h` : '—'}</td>
                <td>{batch.finalMoisture ? `${batch.finalMoisture}%` : '—'}</td>
                <td>
                  {batch.quality ? (
                    <span className={`quality-badge ${batch.quality.replace('+', '-plus')}`}>
                      {batch.quality}
                    </span>
                  ) : '—'}
                </td>
                <td>
                  <span
                    className="status-dot"
                    style={{ background: statusColors[batch.status] }}
                  />
                  {batch.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BatchHistory;
