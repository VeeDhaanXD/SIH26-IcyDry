import { useState, useRef, useCallback, useEffect } from 'react';
import { DryingSimulator } from '../simulation/SimulationEngine';
import MachineVisualization from '../components/MachineVisualization';
import SensorCards from '../components/SensorCards';
import SimulationControls from '../components/SimulationControls';
import ScenarioPanel from '../components/ScenarioPanel';
import AICommandCenter from '../components/AICommandCenter';
import AITimeline from '../components/AITimeline';
import LiveCharts from '../components/LiveCharts';

const ML_API = 'http://localhost:8000';
const SERVER_URL = 'http://localhost:5000';
const DEVICE_ID = 'SURYAROMA-001';

export default function Simulation() {
  const simRef = useRef(new DryingSimulator());
  const intervalRef = useRef(null);
  const [state, setState] = useState(simRef.current.getState());
  const [prediction, setPrediction] = useState(null);
  const [config, setConfig] = useState({
    batchWeight: 1.5,
    initialMoisture: 28,
    targetMoisture: 8,
    solarIntensity: 720,
    ambientTemp: 30,
    ambientHumidity: 65,
    fanMode: 'AUTO',
    heaterMode: 'AUTO',
  });
  const [activeScenario, setActiveScenario] = useState(null);
  const [mlConnected, setMlConnected] = useState(false);
  const [triggerActive, setTriggerActive] = useState(false);

  const fetchPrediction = useCallback(async (sim) => {
    try {
      const payload = sim.getMLPayload();
      const res = await fetch(`${ML_API}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setPrediction(data);
        setMlConnected(true);

        const stage = data.dryingStage;
        if (stage === 'NEAR_COMPLETE' && state.stage !== 'NEAR_COMPLETE') {
          sim.addTimeline('PREDICTION', 'AI: Batch approaching completion');
        } else if (data.remainingTime < 10 && data.remainingTime > 0) {
          sim.addTimeline('PREDICTION', `AI: ~${Math.round(data.remainingTime)} min remaining`);
        }
      }
    } catch {
      setMlConnected(false);
    }
  }, [state.stage]);

  const startSim = useCallback(() => {
    const sim = simRef.current;
    sim.reset(config);
    sim.running = true;
    sim.paused = false;
    setState(sim.getState());
    sim.addTimeline('INFO', `Batch ${sim.batchId} started`);
    sim.addTimeline('INFO', `Weight: ${config.batchWeight}kg | Moisture: ${config.initialMoisture}%`);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      sim.step(5);
      setState(sim.getState());

      if (sim.elapsed % 15 === 0) {
        fetchPrediction(sim);
      }

      if (sim.completed) {
        clearInterval(intervalRef.current);
        fetchPrediction(sim);
      }
    }, 200);
  }, [config, fetchPrediction]);

  const pauseSim = useCallback(() => {
    const sim = simRef.current;
    sim.paused = !sim.paused;
    setState(sim.getState());
    sim.addTimeline('INFO', sim.paused ? 'Simulation paused' : 'Simulation resumed');
  }, []);

  const resetSim = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    simRef.current.reset(config);
    setState(simRef.current.getState());
    setPrediction(null);
    setActiveScenario(null);
  }, [config]);

  const applyScenario = useCallback((scenario) => {
    setActiveScenario(scenario.id);
    const newConfig = { ...config, ...scenario.config };
    setConfig(newConfig);
    simRef.current.addTimeline('INFO', `Scenario: ${scenario.name}`);
    simRef.current.addTimeline('INFO', scenario.aiNote);
    setState(simRef.current.getState());
  }, [config]);

  const triggerHighTemp = useCallback(async () => {
    try {
      await fetch(`${SERVER_URL}/api/devices/${DEVICE_ID}/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: { highTemp: true, buzzer: true, fan: true, heater: false }
        }),
      });
      setTriggerActive(true);
      simRef.current.addTimeline('WARNING', 'HIGH TEMP TRIGGER sent to ESP32');
      setState(simRef.current.getState());
    } catch (err) {
      console.error('Trigger failed:', err);
    }
  }, []);

  const resetTrigger = useCallback(async () => {
    try {
      await fetch(`${SERVER_URL}/api/devices/${DEVICE_ID}/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: { highTemp: false, buzzer: false }
        }),
      });
      setTriggerActive(false);
      simRef.current.addTimeline('INFO', 'Trigger reset — buzzer OFF');
      setState(simRef.current.getState());
    } catch (err) {
      console.error('Reset trigger failed:', err);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="simulation-page">
      <div className="sim-header">
        <div className="sim-title">
          <h2>SIMULATION — Digital Twin</h2>
          <span className={`sim-status ${state.running ? 'active' : ''}`}>
            {state.running ? (state.paused ? '⏸ PAUSED' : '● SIMULATION ACTIVE') : '○ IDLE'}
          </span>
        </div>
        <div className="sim-batch-info">
          <span>BATCH #{state.batchId}</span>
          <span>{state.batchWeight} kg</span>
          <span>Elapsed: {Math.floor(state.elapsed / 60)}:{String(state.elapsed % 60).padStart(2, '0')}</span>
          <span className={`ml-status ${mlConnected ? 'connected' : ''}`}>
            ML: {mlConnected ? '● Connected' : '○ Offline'}
          </span>
        </div>
      </div>

      <div className="sim-top-row">
        <div className="sim-progress">
          <h3>DRYING PROGRESS</h3>
          <div className="progress-ring">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#222" strokeWidth="8" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#44bb44" strokeWidth="8"
                strokeDasharray={`${state.progress * 3.14} 314`}
                strokeLinecap="round" transform="rotate(-90 60 60)" />
            </svg>
            <div className="progress-text">
              <span className="progress-pct">{state.progress}%</span>
              <span className="progress-sub">~{Math.max(0, Math.round((28 - state.moisture) / 0.3))} min left</span>
            </div>
          </div>
        </div>
        <div className="sim-machine">
          <MachineVisualization state={state} />
        </div>
        <div className="sim-ai">
          <AICommandCenter prediction={prediction} state={state} />
        </div>
      </div>

      <SensorCards state={state} />

      <div className="sim-main-row">
        <div className="sim-left">
          <SimulationControls
            config={config} setConfig={setConfig}
            onStart={startSim} onPause={pauseSim} onReset={resetSim}
            state={state}
            onTriggerHighTemp={triggerHighTemp} onResetTrigger={resetTrigger} triggerActive={triggerActive}
          />
          <ScenarioPanel onApply={applyScenario} activeScenario={activeScenario} disabled={state.running} />
        </div>
        <div className="sim-center">
          <LiveCharts history={state.history} />
        </div>
        <div className="sim-right">
          <AITimeline timeline={state.timeline} />
        </div>
      </div>
    </div>
  );
}
