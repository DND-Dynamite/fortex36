
import { agentBus } from './AgentBus';
import { SensorReading } from '../types';

export class SensorAgent {
  broadcast(reading: SensorReading) {
    agentBus.emit<SensorReading>('sensor:data', reading);
  }
}

export const sensorAgent = new SensorAgent();
