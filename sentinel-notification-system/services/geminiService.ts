
// import { GoogleGenAI, Type } from "@google/genai";
// import { Alarm, Stakeholder, Severity } from "../types";

// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// export const analyzeAlarm = async (alarm: Partial<Alarm>, stakeholders: Stakeholder[]) => {
//   const model = "gemini-3-flash-preview";
  
//   const stakeholderSummary = stakeholders
//     .filter(s => s.isActive)
//     .map(s => `${s.name} (Role: ${s.role}, ID: ${s.id})`)
//     .join(", ");

//   const prompt = `
//     Analyze the following industrial alarm and determine the best response.
//     ALARM DATA:
//     Type: ${alarm.type}
//     Source: ${alarm.source}
//     Description: ${alarm.description}
//     Reported Severity: ${alarm.severity}

//     STAKEHOLDERS AVAILABLE:
//     ${stakeholderSummary}

//     Tasks:
//     1. Re-evaluate the severity if necessary based on the description.
//     2. Select the most relevant stakeholders to notify (maximum 3).
//     3. Draft a concise, professional notification message for the chosen stakeholders.
//     4. Provide a brief analysis of the potential impact.
//   `;

//   try {
//     const response = await ai.models.generateContent({
//       model,
//       contents: prompt,
//       config: {
//         responseMimeType: "application/json",
//         responseSchema: {
//           type: Type.OBJECT,
//           properties: {
//             suggestedSeverity: { type: Type.STRING, description: "INFO, WARNING, or CRITICAL" },
//             analysis: { type: Type.STRING },
//             recommendedStakeholderIds: { 
//               type: Type.ARRAY, 
//               items: { type: Type.STRING } 
//             },
//             notificationMessage: { type: Type.STRING }
//           },
//           required: ["suggestedSeverity", "analysis", "recommendedStakeholderIds", "notificationMessage"]
//         }
//       }
//     });

//     return JSON.parse(response.text || '{}');
//   } catch (error) {
//     console.error("Gemini Analysis Error:", error);
//     return null;
//   }
// };
