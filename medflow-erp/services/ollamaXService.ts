
import { AnalysisResult } from "../types";

/**
 * Communicates with the Python backend (server.py) which handles
 * both the image storage and the Ollama Moondream inference.
 */
export const analyzeWithOllama = async (base64Image: string): Promise<AnalysisResult> => {
  // We now point to our Python backend port 5000
  const BACKEND_URL = 'http://localhost:5000/analyze/ollama';

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        filename: `scan_${Date.now()}.png`
      }),
    });

    console.log("response ->", response);

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || `Backend connection failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // The backend returns an object with "analysis" containing the result
    if (data.analysis) {
      return data.analysis as AnalysisResult;
    }
    
    throw new Error("Invalid response format from backend");
  } catch (error: any) {
    console.error("Analysis Service Error:", error);
    throw new Error(error.message || "Could not connect to RadianceX Python Backend. Ensure server.py is running on port 5000.");
  }
};
