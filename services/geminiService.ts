
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are "Musa'id Oqba", an expert Islamic scholar AI assistant for the "Oqba bin Nafi Digital Library". 
Your knowledge is based on authentic Islamic sources including the Quran, Sahih Hadith, and the works of classical scholars.
Guidelines:
1. Provide accurate, moderate, and well-sourced information.
2. Always maintain a respectful and scholarly tone.
3. If asked about a specific Ayah, provide deep insights, context (Sabab al-Nuzul), and practical spiritual lessons.
4. For legal (Fiqh) questions, mention that users should consult specialized local scholars for binding fatwas.
5. Answer in Arabic by default unless the user speaks another language.
6. Use beautiful, clear Arabic formatting.
`;

export const sendMessageToScholar = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى المحاولة مرة أخرى لاحقاً.";
  }
};

export const getAyahInsight = async (ayahText: string, context: string) => {
  try {
    const prompt = `Analyze this Quranic Ayah: "${ayahText}". Context: ${context}. Provide a concise "Scholar Insight" (نظرة العالم) in Arabic, focusing on linguistic beauty and spiritual depth.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "You are a specialized Mufassir (Quranic exegete). Provide brief but profound insights.",
      }
    });
    return response.text;
  } catch (error) {
    return "تأمل في جمال هذا النص القرآني وما يحمله من هداية للقلب.";
  }
};

export const generateIslamicImage = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `High quality, photorealistic, cinematic lighting, Islamic heritage theme: ${prompt}. Focus on authentic details of North African and Algerian Islamic architecture, specifically inspired by Sidi Okba Mosque in Biskra. Avoid human faces.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};
