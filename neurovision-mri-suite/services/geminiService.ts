
import { GoogleGenAI, Type } from "@google/genai";
import { MedicalReport } from "../types";

export const generateMedicalReport = async (
  base64Image: string,
  clinicalHistory: string = "Routine clinical evaluation"
): Promise<MedicalReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      {
        parts: [
          {
            text: `You are an expert board-certified neuroradiologist. 
            Analyze the provided MRI image carefully. 
            Clinical Context: ${clinicalHistory}
            
            Generate a formal radiological report in JSON format. 
            The report must be strictly structured and medically professional.
            
            Return ONLY a JSON object with this structure:
            {
              "patientInfo": { "id": "NV-${Math.floor(Math.random() * 10000)}", "age": "N/A", "gender": "N/A" },
              "clinicalHistory": "The provided history.",
              "technique": "Multi-planar, multi-sequence MRI of the region.",
              "findings": "Detail the anatomical observations, noting any lesions, intensities, or anomalies.",
              "impression": "The primary clinical conclusion.",
              "recommendations": ["Step 1", "Step 2"],
              "status": "completed"
            }
            
            Note: This is a simulation for educational purposes. Include a standard medical disclaimer in your findings if necessary.`
          },
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Image.split(',')[1] || base64Image,
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
          patientInfo: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              age: { type: Type.STRING },
              gender: { type: Type.STRING }
            },
            required: ["id", "age", "gender"]
          },
          clinicalHistory: { type: Type.STRING },
          technique: { type: Type.STRING },
          findings: { type: Type.STRING },
          impression: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          status: { type: Type.STRING }
        },
        required: ["patientInfo", "findings", "impression", "recommendations", "status"]
      }
    }
  });

  try {
    const text = response.text;
    if (!text) throw new Error("No response text");
    return JSON.parse(text) as MedicalReport;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Radiological analysis failed to generate valid structured data.");
  }
};
