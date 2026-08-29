import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const geminiEmbed = {
  async embedContent({
    content,
    outputDimensionality,
  }: {
    content: {
      role: string;
      parts: { text: string }[];
    };
    outputDimensionality?: number;
  }) {
    const text = content.parts.map((part) => part.text).join("");

    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
      config: {
        outputDimensionality,
      },
    });

    return {
      embedding: {
        values: response.embeddings?.[0]?.values ?? [],
      },
    };
  },
};

export const geminiChat = {
  async generateContent(prompt: string) {
    const response = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: prompt,
    });

    return {
      response: {
        text: () => response.output_text,
      },
    };
  },
};