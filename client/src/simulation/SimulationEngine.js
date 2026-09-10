export class DryingSimulator {
  constructor() {
    this.reset();
  }

  reset(config = {}) {
    this.temperature = config.ambientTemp || 30;
    this.humidity = 75;
    this.moisture = config.initialMoisture || 28;
    this.targetMoisture = config.targetMoisture || 8;
    this.batchWeight = config.batchWeight || 1.5;
    this.solarIntensity = config.solarIntensity || 720;
    this.ambientTemp = config.ambientTemp || 30;
    this.ambientHumidity = config.ambientHumidity || 65;
    this.battery = config.battery || 85;
    this.fanSpeed = 40;
    this.heaterOn = true;
    this.heaterPower = 50;
    this.airflow = 1.6;
    this.elapsed = 0;
    this.running = false;
    this.paused = false;
    this.completed = false;
    this.batchId = config.batchId || `B${Date.now().toString(36).slice(-4).toUpperCase()}`;
    this.history = [];
    this.timeline = [];
    this.lastMLPrediction = null;
    this.fanMode = config.fanMode || 'AUTO';
    this.heaterMode = config.heaterMode || 'AUTO';
  }

  _heaterControl() {
    if (this.heaterMode === 'OFF') return false;
    if (this.heaterMode === 'ON') return true;
    if (this.temperature < 42) return true;
    if (this.temperature > 48) return false;
    if (this.humidity > 60) return true;
    return false;
  }

  _fanControl() {
    if (this.fanMode === 'MANUAL') return this.fanSpeed;
    if (this.humidity > 70) return 85;
    if (this.humidity > 50) return 70;
    if (this.humidity > 30) return 55;
    return 40;
  }

  _dryingRate() {
    const k = 0.012;
    const tempFactor = Math.max(0, (this.temperature - 25) / 25);
    const humFactor = Math.max(0, (100 - this.humidity) / 80);
    const fanFactor = 0.7 + 0.3 * (this.fanSpeed / 100);
    const heaterBoost = this.heaterOn ? 1.1 : 0.85;
    return k * tempFactor * humFactor * fanFactor * heaterBoost;
  }

  step(dt = 5) {
    if (!this.running || this.paused || this.completed) return this.getState();

    this.heaterOn = this._heaterControl();
    this.fanSpeed = this._fanControl();

    const rate = this._dryingRate();
    const moistureLoss = this.moisture * rate * dt;
    this.moisture = Math.max(0, this.moisture - moistureLoss);

    const solarHeat = this.solarIntensity * 0.004;
    const ambientEffect = (this.ambientTemp - this.temperature) * 0.03;
    const heaterEffect = this.heaterOn ? this.heaterPower * 0.08 : -0.3;
    const fanCooling = this.fanSpeed * 0.018;
    this.temperature += solarHeat + ambientEffect + heaterEffect - fanCooling;
    this.temperature += (Math.random() - 0.5) * 0.4;
    this.temperature = Math.max(22, Math.min(62, this.temperature));

    this.humidity += (this.moisture - this.humidity) * 0.04;
    this.humidity += (Math.random() - 0.5) * 0.6;
    this.humidity = Math.max(15, Math.min(92, this.humidity));

    this.airflow = this.fanSpeed * 0.04 + (Math.random() - 0.5) * 0.1;

    this.battery += (this.solarIntensity > 200 ? 0.1 : -0.05) * dt;
    this.battery = Math.max(10, Math.min(100, this.battery));

    this.elapsed += dt;

    const record = {
      timestamp: this.elapsed,
      temperature: +this.temperature.toFixed(1),
      humidity: +this.humidity.toFixed(1),
      moisture: +this.moisture.toFixed(2),
      fanSpeed: this.fanSpeed,
      heaterOn: this.heaterOn,
      solarIntensity: +this.solarIntensity.toFixed(0),
      battery: +this.battery.toFixed(1),
      airflow: +this.airflow.toFixed(2),
    };
    this.history.push(record);

    if (this.moisture <= this.targetMoisture + 1) {
      this.completed = true;
      this.running = false;
      this.addTimeline('DONE', `Drying complete. Final moisture: ${this.moisture.toFixed(1)}%`);
    }

    return this.getState();
  }

  getState() {
    const progress = Math.min(100, ((28 - this.moisture) / (28 - this.targetMoisture)) * 100);
    let stage = 'INITIAL';
    if (this.completed) stage = 'COMPLETE';
    else if (this.moisture <= this.targetMoisture + 5) stage = 'NEAR_COMPLETE';
    else if (this.elapsed > 60) stage = 'STABILIZING';
    else if (this.elapsed > 8) stage = 'ACTIVE_DRYING';

    return {
      batchId: this.batchId,
      temperature: +this.temperature.toFixed(1),
      humidity: +this.humidity.toFixed(1),
      moisture: +this.moisture.toFixed(2),
      targetMoisture: this.targetMoisture,
      batchWeight: this.batchWeight,
      solarIntensity: +this.solarIntensity.toFixed(0),
      battery: +this.battery.toFixed(1),
      fanSpeed: this.fanSpeed,
      heaterOn: this.heaterOn,
      heaterPower: this.heaterOn ? this.heaterPower : 0,
      airflow: +this.airflow.toFixed(2),
      elapsed: this.elapsed,
      progress: +Math.min(100, Math.max(0, progress)).toFixed(1),
      stage,
      running: this.running,
      paused: this.paused,
      completed: this.completed,
      history: this.history.slice(-60),
      timeline: this.timeline.slice(-20),
      fanMode: this.fanMode,
      heaterMode: this.heaterMode,
    };
  }

  addTimeline(type, message) {
    this.timeline.push({
      time: this.elapsed,
      type,
      message,
      timestamp: new Date().toLocaleTimeString(),
    });
  }

  getMLPayload() {
    const prev = this.history.length > 1 ? this.history[this.history.length - 2] : null;
    return {
      temperature: this.temperature,
      humidity: this.humidity,
      solarIntensity: this.solarIntensity,
      fanSpeed: this.fanSpeed,
      heaterStatus: this.heaterOn,
      batchWeight: this.batchWeight,
      initialMoisture: 28,
      elapsedTime: this.elapsed,
      temperatureChange: prev ? +(this.temperature - prev.temperature).toFixed(2) : 0,
      humidityChange: prev ? +(this.humidity - prev.humidity).toFixed(2) : 0,
    };
  }
}
