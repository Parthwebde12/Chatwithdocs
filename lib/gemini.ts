import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiChat = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
export const geminiEmbed = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });