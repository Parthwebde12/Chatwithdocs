import { geminiEmbed } from "./gemini";

export async function embedText(text: string): Promise<number[]> {
  const result = await geminiEmbed.embedContent({
    content: { role: "user", parts: [{ text }] },
    outputDimensionality: 768,
  } as any);
  return result.embedding.values;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const results = await Promise.all(texts.map((t) => embedText(t)));
  return results;
}