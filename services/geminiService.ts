
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // API_KEY가 없을 경우를 대비한 빈 문자열 처리 및 타입 단언
    this.ai = new GoogleGenAI({ apiKey: (process.env.API_KEY as string) || '' });
  }

  async polishDraft(title: string, content: string) {
    if (!process.env.API_KEY) return null;
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Please polish this writing draft about a K-pop group. Make it more emotive and well-structured. Keep the language as the user provided (Korean if Korean, English if English). 
        Title: ${title}
        Content: ${content}`,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini polish error:", error);
      return null;
    }
  }

  async getWritingPrompt(groupName: string) {
    if (!process.env.API_KEY) return "Write about your favorite memory.";
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a short creative writing prompt for a fan of the K-pop group "${groupName}". Make it inspiring.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              prompt: { type: Type.STRING }
            },
            required: ["prompt"]
          }
        }
      });
      const data = JSON.parse(response.text || '{"prompt": "Write about your favorite memory."}');
      return data.prompt;
    } catch (error) {
      return "Tell us about a moment that made you fall in love with their music.";
    }
  }
}

export const gemini = new GeminiService();
