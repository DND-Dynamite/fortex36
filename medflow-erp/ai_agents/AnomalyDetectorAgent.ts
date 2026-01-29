
import { agentBus } from './AgentBus';
import { SensorReading, AgentBaseline, AgentAnomaly } from '../types';

export class AnomalyDetectorAgent {
  private currentBaseline: AgentBaseline | null = null;

  init() {
    agentBus.subscribe<AgentBaseline>('baseline:updated', b => this.currentBaseline = b);
    agentBus.subscribe<SensorReading>('sensor:data', r => this.check(r));
  }

  private check(r: SensorReading) {
    if (!this.currentBaseline) return;

    let score = 0;
    const flags: string[] = [];

    if (r.heartRate > this.currentBaseline.hrRange[1]) {
      score += 0.4;
      flags.push('Tachycardia');
    }

    if (r.bodyTemp > 37.8) {
      score += 0.3;
      flags.push('Hyperthermia');
    }

    const anomaly: AgentAnomaly = {
      score: Math.min(score, 1.0),
      method: 'Z-Score Deviation',
      flags
    };

    agentBus.emit<AgentAnomaly>('anomaly:detected', anomaly);
  }
}
