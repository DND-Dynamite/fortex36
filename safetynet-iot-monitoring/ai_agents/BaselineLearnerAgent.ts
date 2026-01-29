
import { agentBus } from './AgentBus';
import { SensorReading, AgentBaseline } from '../types';
import { db } from '../database/db';

export class BaselineLearnerAgent {
  private readings: SensorReading[] = [];
  
  init() {
    agentBus.subscribe<SensorReading>('sensor:data', (r) => {
      this.readings.push(r);
      // Analyze every 10 readings
      if (this.readings.length % 10 === 0) {
        this.calculateAndPublish();
      }
    });
  }

  private calculateAndPublish() {
    const last50 = this.readings.slice(-50);
    if (last50.length < 5) return;

    const avgHR = last50.reduce((s, r) => s + r.heartRate, 0) / last50.length;
    const avgSys = last50.reduce((s, r) => s + r.systolic, 0) / last50.length;
    
    const baseline: AgentBaseline = {
      hrRange: [avgHR - 10, avgHR + 10],
      bpNormal: `${avgSys.toFixed(0)}/80`,
      tempBaseline: 36.6,
      activityProfile: this.readings.length > 100 ? 'Active Athlete' : 'Stationary'
    };

    agentBus.emit<AgentBaseline>('baseline:updated', baseline);
    db.save('baseline_current', baseline);
  }
}
