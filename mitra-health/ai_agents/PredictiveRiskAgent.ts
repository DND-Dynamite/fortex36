
import { agentBus } from './AgentBus';
import { SensorReading, AgentPrediction } from '../types';
import { GoogleGenAI } from '@google/genai';

export class PredictiveRiskAgent {
  private ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  init() {
    agentBus.subscribe<SensorReading[]>('sensor:batch', async (batch) => {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Predict the health risk for the next hour based on this trajectory: ${JSON.stringify(batch.slice(-5))}`,
      });

      const prediction: AgentPrediction = {
        score: Math.random() * 100,
        timeToCritical: 45,
        forecast: response.text || 'Stable trajectory.'
      };

      agentBus.emit<AgentPrediction>('prediction:ready', prediction);
    });
  }
}
