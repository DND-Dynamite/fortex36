
import { GoogleGenAI, Type } from "@google/genai";
import { RoundData, CognitiveAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzePerformance(
  finalScore: number,
  rounds: RoundData[]
): Promise<CognitiveAnalysis> {
  const avgResponseTime = rounds.length > 0 
    ? rounds.reduce((acc, r) => acc + r.responseTime, 0) / rounds.length 
    : 0;
  
  const prompt = `
    Analyze this user's performance on the Memory Maze cognitive test.
    Final Score: ${finalScore}/100
    Level Reached: ${rounds[rounds.length - 1]?.level || 0}
    Average Response Time: ${avgResponseTime.toFixed(0)}ms
    Rounds Detail: ${JSON.stringify(rounds)}

    Task: Provide a professional cognitive summary. Evaluate short-term memory, concentration, and processing speed.
    Also provide 3 actionable recommendations for cognitive health.
    Include a mandatory medical disclaimer at the end stating this is not a diagnostic tool.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            focusScore: { type: Type.NUMBER, description: "Score from 0-100" },
            memoryScore: { type: Type.NUMBER, description: "Score from 0-100" },
            processingSpeed: { type: Type.NUMBER, description: "Score from 0-100" },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "focusScore", "memoryScore", "processingSpeed", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      summary: "We encountered an error analyzing your data. However, your performance suggests a strong level of engagement.",
      focusScore: 70,
      memoryScore: 70,
      processingSpeed: 70,
      recommendations: ["Stay hydrated", "Get 7-9 hours of sleep", "Engage in regular physical activity"]
    };
  }
}
