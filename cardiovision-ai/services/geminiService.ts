
import { GoogleGenAI, Type } from "@google/genai";
import { ECGAnalysisResult } from "../types";

export const analyzeECGImage = async (base64Image: string): Promise<ECGAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    As an expert clinical cardiologist and biomedical engineer, analyze this ECG image using a multi-stage algorithmic approach:
    
    1. **Pan-Tompkins Simulation**: Mentally apply the Pan-Tompkins algorithm (bandpass filtering, derivative, squaring, and integration) to identify QRS complexes. Count them precisely to calculate Heart Rate and RR-interval variability.
    2. **Heuristic Fuzzy Classification**: Use fuzzy logic principles to classify the rhythm (e.g., Sinus Rhythm, Atrial Fibrillation, PVCs) based on the morphology of P-waves, QRS duration, and RR consistency.
    3. **Glasgow Algorithm Interpretation**: Apply standard Glasgow interpretation criteria for clinical diagnostics, measuring intervals (PR, QRS, QT/QTc) and axes (P, QRS, T).
    
    Return a structured JSON object with the following schema:
    - heartRate (number)
    - prInterval (number, ms)
    - qrsDuration (number, ms)
    - qtInterval (number, ms)
    - qtcInterval (number, ms)
    - pAxis (number)
    - qrsAxis (number)
    - tAxis (number)
    - interpretation (string)
    - panTompkinsFindings: { qrsCount: number, rrIntervals: number[], isRegular: boolean }
    - fuzzyLogicClassification: { label: string, confidence: number, reasoning: string }
    - glasgowDiagnosis: { primaryDiagnosis: string, secondaryFindings: string[], severity: "Normal" | "Borderline" | "Abnormal" }
    - waveformSimulation: Array of { time: number, voltage: number } representing a typical beat extracted from the image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image.split(',')[1] || base64Image
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            heartRate: { type: Type.NUMBER },
            prInterval: { type: Type.NUMBER },
            qrsDuration: { type: Type.NUMBER },
            qtInterval: { type: Type.NUMBER },
            qtcInterval: { type: Type.NUMBER },
            pAxis: { type: Type.NUMBER },
            qrsAxis: { type: Type.NUMBER },
            tAxis: { type: Type.NUMBER },
            interpretation: { type: Type.STRING },
            panTompkinsFindings: {
              type: Type.OBJECT,
              properties: {
                qrsCount: { type: Type.NUMBER },
                rrIntervals: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                isRegular: { type: Type.BOOLEAN }
              }
            },
            fuzzyLogicClassification: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                reasoning: { type: Type.STRING }
              }
            },
            glasgowDiagnosis: {
              type: Type.OBJECT,
              properties: {
                primaryDiagnosis: { type: Type.STRING },
                secondaryFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
                severity: { type: Type.STRING }
              }
            },
            waveformSimulation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.NUMBER },
                  voltage: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as ECGAnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze ECG image. Please ensure the image is clear.");
  }
};
