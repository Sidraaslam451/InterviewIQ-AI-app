import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateInterviewQuestions = async ({ role, difficulty, questionCount }) => {
  const prompt = `Generate ${questionCount} technical interview questions for a ${role} position at ${difficulty} difficulty level.

Return ONLY a valid JSON array, no extra text, in this exact format:
[
  { "question": "..." },
  { "question": "..." }
]`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  });

  const content = response.text;

  const cleaned = content.replace(/```json|```/g, "").trim();

  return JSON.parse(cleaned);
};