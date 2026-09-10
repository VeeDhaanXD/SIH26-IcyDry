import { scenarios } from '../simulation/scenarios';

export default function ScenarioPanel({ onApply, activeScenario, disabled }) {
  return (
    <div className="scenario-panel">
      <h3 className="panel-title">SCENARIOS</h3>
      <div className="scenario-grid">
        {scenarios.map(s => (
          <button
            key={s.id}
            className={`scenario-btn ${activeScenario === s.id ? 'active' : ''}`}
            onClick={() => onApply(s)}
            disabled={disabled}
          >
            <span className="scenario-icon">{s.icon}</span>
            <span className="scenario-name">{s.name}</span>
            <span className="scenario-desc">{s.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
