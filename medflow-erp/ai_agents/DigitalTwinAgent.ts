
import { agentBus } from './AgentBus';
import { SensorReading, DigitalTwinState, AgentAnomaly, AgentPrediction } from '../types';

export class DigitalTwinAgent {
  private latestReading: SensorReading | null = null;
  private latestAnomaly: AgentAnomaly | null = null;
  private latestPrediction: AgentPrediction | null = null;

  init() {
    agentBus.subscribe<SensorReading>('sensor:data', r => {
      this.latestReading = r;
      this.simulate();
    });
    agentBus.subscribe<AgentAnomaly>('anomaly:detected', a => this.latestAnomaly = a);
    agentBus.subscribe<AgentPrediction>('prediction:ready', p => this.latestPrediction = p);
  }

  private simulate() {
    if (!this.latestReading) return;

    // Simulation logic: Combine real data with agent insights
    const twinState: DigitalTwinState = {
      predictedHR: this.latestReading.heartRate + (this.latestAnomaly?.score || 0) * 20,
      predictedBP: this.latestReading.systolic + (this.latestAnomaly?.score || 0) * 15,
      riskLevel: (this.latestAnomaly?.score || 0) > 0.7 ? 'CRITICAL' : (this.latestAnomaly?.score || 0) > 0.4 ? 'ELEVATED' : 'STABLE',
      simulationHorizon: '60 Minutes'
    };

    agentBus.emit<DigitalTwinState>('twin:state_updated', twinState);
  }
}
