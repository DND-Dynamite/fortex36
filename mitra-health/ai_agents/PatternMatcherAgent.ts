
import { agentBus } from './AgentBus';
import { SensorReading, AgentPattern } from '../types';
import { GoogleGenAI } from '@google/genai';

export class PatternMatcherAgent {
  private ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  init() {
    agentBus.subscribe<SensorReading[]>('sensor:batch', async (batch) => {
      if (batch.length < 5) return;
      
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze these sensor readings for medical crisis patterns: ${JSON.stringify(batch.slice(-10))}. Respond with the condition and confidence level.`,
      });

      // Simple extraction logic (ideally use responseSchema)
      const text = response.text || '';
      const pattern: AgentPattern = {
        matchedCrisis: text.includes('Cardiac') ? 'Cardiac Event' : text.includes('Stroke') ? 'Stroke' : 'Normal',
        confidence: 0.85,
        signatures: ['R-R Interval Variance', 'BP Oscillation']
      };

      agentBus.emit<AgentPattern>('pattern:matched', pattern);
    });
  }
}
