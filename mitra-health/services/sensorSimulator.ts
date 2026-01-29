
import { SensorReading, CrisisScenario } from '../types';

export class SensorSimulator {
  private lastReading: SensorReading = {
    timestamp: Date.now(),
    heartRate: 72,
    spo2: 98,
    bodyTemp: 36.6,
    airQuality: 45,
    systolic: 120,
    diastolic: 80,
    glucose: 95,
    steps: 1200,
    sleepQuality: 85,
    movementX: 0,
    movementY: 0,
    movementZ: 1.0
  };

  private scenarioStart: number = 0;

  public getNextReading(scenario: CrisisScenario = 'NORMAL'): SensorReading {
    const now = Date.now();
    if (this.scenarioStart === 0) this.scenarioStart = now;
    const elapsedMinutes = (now - this.scenarioStart) / 60000;

    const base = { ...this.lastReading, timestamp: now };
    const jitter = (range: number) => (Math.random() - 0.5) * range;

    switch (scenario) {
      case 'CARDIAC':
        // Progressive heart rate increase and BP spike
        base.heartRate = 70 + (elapsedMinutes * 1.5); // +1.5 bpm per min
        base.systolic = 120 + (elapsedMinutes * 1.2);
        base.movementZ = 1.0 + jitter(0.5);
        if (elapsedMinutes > 30) base.spo2 -= 0.1 * (elapsedMinutes - 30);
        break;

      case 'HEAT_EXHAUSTION':
        base.bodyTemp = 36.6 + (elapsedMinutes * 0.05);
        base.heartRate = 72 + (elapsedMinutes * 1.0);
        base.airQuality = 80 + (elapsedMinutes * 2); // Simulating worsening room conditions
        break;

      case 'FALL':
        // Instant impact
        if (elapsedMinutes < 0.2) {
          base.movementX = 5.0; base.movementY = 5.0; base.movementZ = -9.8;
          base.heartRate = 110;
        } else {
          base.movementX = 0; base.movementY = 0; base.movementZ = 0; // Immobility after fall
          base.heartRate = 95;
        }
        break;

      case 'STROKE':
        base.systolic = 130 + (elapsedMinutes * 2.0);
        base.heartRate = 80 + jitter(10);
        base.movementX = jitter(2.0); // Simulating loss of balance/coordination
        break;

      case 'OVERDOSE':
        base.heartRate = 72 - (elapsedMinutes * 0.5); // Resp depression leads to bradycardia
        base.spo2 = 98 - (elapsedMinutes * 0.4);
        base.sleepQuality = 20;
        break;

      case 'INFECTION':
        base.bodyTemp = 36.6 + (elapsedMinutes * 0.02);
        base.heartRate = 72 + (elapsedMinutes * 0.3);
        base.airQuality = 120; // Poor ventilation
        break;

      default:
        // Normal random walk
        base.heartRate = Math.max(60, Math.min(100, base.heartRate + jitter(2)));
        base.spo2 = Math.max(95, Math.min(100, base.spo2 + jitter(0.2)));
        base.bodyTemp = Math.max(36.0, Math.min(37.5, base.bodyTemp + jitter(0.05)));
        base.systolic = Math.max(110, Math.min(130, base.systolic + jitter(1.5)));
        base.glucose = Math.max(70, Math.min(120, base.glucose + jitter(2)));
    }

    this.lastReading = base;
    return base;
  }

  public resetScenario() {
    this.scenarioStart = Date.now();
  }
}

export const sensorSimulator = new SensorSimulator();
