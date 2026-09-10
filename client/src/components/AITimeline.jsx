export default function AITimeline({ timeline }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="ai-timeline">
        <h3 className="panel-title">AI ACTIVITY</h3>
        <div className="timeline-empty">No activity yet. Start a simulation.</div>
      </div>
    );
  }

  const typeStyles = {
    INFO: { color: '#44aaff', icon: '●' },
    WARN: { color: '#ffaa00', icon: '⚠' },
    CRITICAL: { color: '#ff4444', icon: '🚨' },
    RECOMMEND: { color: '#44bb44', icon: '→' },
    DONE: { color: '#44ff44', icon: '✓' },
    PREDICTION: { color: '#aa88ff', icon: '◎' },
  };

  return (
    <div className="ai-timeline">
      <h3 className="panel-title">AI ACTIVITY</h3>
      <div className="timeline-list">
        {[...timeline].reverse().map((entry, i) => {
          const style = typeStyles[entry.type] || typeStyles.INFO;
          return (
            <div key={i} className="timeline-entry" style={{ borderLeftColor: style.color }}>
              <span className="timeline-time">{entry.timestamp}</span>
              <span className="timeline-icon" style={{ color: style.color }}>{style.icon}</span>
              <span className="timeline-msg">{entry.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
