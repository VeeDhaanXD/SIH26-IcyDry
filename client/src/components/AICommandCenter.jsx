export default function AICommandCenter({ prediction, state }) {
  const stage = prediction?.dryingStage || state.stage;
  const remaining = prediction?.remainingTime ?? Math.max(0, Math.round((28 - state.moisture) / 0.3));
  const confidence = prediction?.confidence || 0;
  const recommendation = prediction?.recommendation;

  const stageColors = {
    INITIAL: '#888',
    ACTIVE_DRYING: '#44bb44',
    STABILIZING: '#ffaa00',
    NEAR_COMPLETE: '#44aaff',
    COMPLETE: '#44ff44',
  };

  const progressPct = state.progress;

  return (
    <div className="ai-command-center">
      <h3 className="panel-title">AI ENGINE</h3>

      <div className="ai-section">
        <div className="ai-label">DRYING STATE</div>
        <div className="ai-stage" style={{ color: stageColors[stage] || '#fff' }}>
          {stage?.replace(/_/g, ' ')}
        </div>
        <div className="ai-confidence">
          <div className="confidence-bar">
            <div className="confidence-fill" style={{ width: `${confidence * 100}%` }} />
          </div>
          <span>{(confidence * 100).toFixed(0)}% confidence</span>
        </div>
      </div>

      <div className="ai-divider" />

      <div className="ai-section">
        <div className="ai-label">REMAINING TIME</div>
        <div className="ai-time">{remaining} min</div>
        <div className="ai-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span>{progressPct}% complete</span>
        </div>
      </div>

      <div className="ai-divider" />

      <div className="ai-section">
        <div className="ai-label">RECOMMENDATION</div>
        {recommendation ? (
          <div className="ai-recommendation">
            <div className="rec-action">{recommendation.action}</div>
            <div className="rec-reason">{recommendation.reason}</div>
          </div>
        ) : state.running ? (
          <div className="ai-recommendation">
            <div className="rec-action" style={{ color: '#44bb44' }}>System operating normally</div>
            <div className="rec-reason">No action required</div>
          </div>
        ) : (
          <div className="ai-recommendation">
            <div className="rec-action" style={{ color: '#666' }}>Waiting for simulation</div>
            <div className="rec-reason">Start a batch to see AI predictions</div>
          </div>
        )}
      </div>

      {prediction?.modelMAE && (
        <div className="ai-footer">
          Model MAE: ±{prediction.modelMAE.toFixed(1)} min
        </div>
      )}
    </div>
  );
}
