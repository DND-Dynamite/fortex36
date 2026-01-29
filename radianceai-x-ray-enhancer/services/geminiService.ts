
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

export const analyzeXRay = async (base64Image: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Image.split(',')[1],
          },
        },
        {
          text: "You are a senior radiologist. Analyze this medical X-ray scan. Provide detailed findings, a summary, recommendations, a severity assessment, and your confidence level. Focus on anomalies like fractures, opacities, or misalignments. Return as JSON.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          findings: { type: Type.STRING },
          summary: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          severity: { 
            type: Type.STRING,
            description: "One of: low, moderate, high, critical"
          },
          confidence: { type: Type.NUMBER }
        },
        required: ["findings", "summary", "recommendations", "severity", "confidence"]
      }
    },
  });

  return JSON.parse(response.text) as AnalysisResult;
};
