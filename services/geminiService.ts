import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// Initialize conditionally to avoid crashing if key is missing in some envs (though mandated by instructions)
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateEventDescription = async (title: string, keywords: string): Promise<string> => {
  if (!ai) {
    console.warn("API Key missing for Gemini.");
    return "API Key missing. Please provide a description manually.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Write a short, exciting, cyberpunk-themed description (max 50 words) for a volunteering event titled "${title}". Keywords: ${keywords}. Tone: Urgent, futuristic, inspiring.`;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description. Please try again.";
  }
};