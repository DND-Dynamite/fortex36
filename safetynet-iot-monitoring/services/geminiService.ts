
import { GoogleGenAI, Type } from "@google/genai";
import { SensorReading, AIAssessment, LabResult, UserProfile, RoutineTask } from '../types';

// Initialize AI client using the recommended configuration
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getHealthAssessment = async (readings: SensorReading[]): Promise<AIAssessment> => {
  const model = 'gemini-3-flash-preview';
  const prompt = `
    You are the "SafetyNet Master Orchestrator". You coordinate 5 specialized AI Agents to protect user health.
    TELEMETRY FEED (JSON): ${JSON.stringify(readings.slice(-40))}
    ORCHESTRATION TASKS:
    1. BASELINE LEARNER: Determine "Normal" profile.
    2. ANOMALY DETECTOR: Flag deviations.
    3. PATTERN MATCHER: Search for crisis signatures.
    4. PREDICTIVE RISK AGENT: Forecast health trajectory 30-60 mins ahead.
    5. ENVIRONMENT SENTINEL: Correlate ambient factors.
    Respond strictly in JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallRisk: { type: Type.STRING },
            riskScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            agents: {
              type: Type.OBJECT,
              properties: {
                baseline: { type: Type.OBJECT, properties: { hrRange: { type: Type.ARRAY, items: { type: Type.NUMBER } }, bpNormal: { type: Type.STRING }, tempBaseline: { type: Type.NUMBER }, activityProfile: { type: Type.STRING } } },
                anomaly: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, method: { type: Type.STRING }, flags: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                pattern: { type: Type.OBJECT, properties: { matchedCrisis: { type: Type.STRING }, confidence: { type: Type.NUMBER }, signatures: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                prediction: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, timeToCritical: { type: Type.NUMBER }, forecast: { type: Type.STRING } } },
                environment: { type: Type.OBJECT, properties: { hazardLevel: { type: Type.STRING }, factors: { type: Type.ARRAY, items: { type: Type.STRING } } } }
              }
            },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    // Use .text property to get the response string as per guidelines
    return JSON.parse(response.text || '{}') as AIAssessment;
  } catch (error) {
    console.error("Master Orchestrator Error:", error);
    throw error;
  }
};

export const getLabPrediction = async (labResults: LabResult[], currentSensors: SensorReading): Promise<string> => {
  const model = 'gemini-3-pro-preview';
  const prompt = `
    As a clinical diagnostic AI, analyze these Lab Test Results and correlate them with real-time sensor data.
    LAB DATA: ${JSON.stringify(labResults)}
    SENSOR DATA: ${JSON.stringify(currentSensors)}
    Predict potential sub-clinical issues or health optimizations needed based on hormonal or chemical markers that sensors cannot see.
    Provide a professional medical summary.
  `;
  const response = await ai.models.generateContent({ model, contents: prompt });
  // Use .text property to get the response string
  return response.text || "Analysis unavailable.";
};

export const generateDailyRoutine = async (profile: UserProfile, assessment: AIAssessment | null): Promise<RoutineTask[]> => {
  const model = 'gemini-3-flash-preview';
  const prompt = `
    Create a detailed daily routine for ${profile.name} (Role: ${profile.role}, Job: ${profile.occupation}, Location: ${profile.workLocation}).
    Context: Health Risk Score is ${assessment?.riskScore || 'Unknown'}.
    Include 6-8 specific activities throughout the day that maximize productivity while managing their specific health risks. 
    Focus on Mindfulness, Pranayama, and ergonomics if they work at a desk.
    Return strictly a JSON array of objects with keys: time, activity, reason.
  `;
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            time: { type: Type.STRING },
            activity: { type: Type.STRING },
            reason: { type: Type.STRING }
          }
        }
      }
    }
  });
  // Use .text property to get the response string
  return JSON.parse(response.text || '[]') as RoutineTask[];
};
