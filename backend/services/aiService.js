// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// export const generateInterviewQuestions = async ({
//   role,
//   difficulty,
//   questionCount,
// }) => {
//   const prompt = `Generate ${questionCount} technical interview questions for a ${role} position at ${difficulty} difficulty level.

// Return ONLY a valid JSON array, no extra text, in this exact format:
// [
//   { "question": "..." },
//   { "question": "..." }
// ]`;

//   const response = await ai.models.generateContent({
//     model: "gemini-3.1-flash-lite",
//     contents: prompt,
//   });

//   const content = response.text;

//   const cleaned = content.replace(/```json|```/g, "").trim();

//   return JSON.parse(cleaned);
// };
// export const evaluateAnswer = async ({ question, userAnswer, role }) => {
//   const prompt = `You are an interviewer evaluating a candidate's answer for a ${role} position.

// Question: ${question}
// Candidate's Answer: ${userAnswer || "(No answer provided)"}

// Evaluate this answer and return ONLY a valid JSON object, no extra text, in this exact format:
// {
//   "score": 0,
//   "strength": "...",
//   "weakness": "...",
//   "improvementTip": "..."
// }

// Score should be an integer from 0 to 10. If no answer was provided, score should be 0.`;

//   const response = await ai.models.generateContent({
//     model: "gemini-3.1-flash-lite",
//     contents: prompt,
//   });

//   const content = response.text;
//   const cleaned = content.replace(/```json|```/g, "").trim();

//   return JSON.parse(cleaned);
// };

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODELS_TO_TRY = [
  process.env.GEMINI_MODEL_PRIMARY,
  process.env.GEMINI_MODEL_FALLBACK,
].filter(Boolean); // agar koi value missing ho, usse list se hata dete hain

const callGemini = async (prompt) => {
  let lastError;

  for (const model of MODELS_TO_TRY) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });
      return response.text;
    } catch (err) {
      console.error(`Model "${model}" failed:`, err.message);
      lastError = err;
      // agla model try karne ke liye loop continue hoga
    }
  }

  throw lastError; // saare models fail ho gaye, ab error throw karo
};

export const generateInterviewQuestions = async ({
  role,
  difficulty,
  questionCount,
}) => {
  const prompt = `Generate ${questionCount} technical interview questions for a ${role} position at ${difficulty} difficulty level.

Return ONLY a valid JSON array, no extra text, in this exact format:
[
  { "question": "..." },
  { "question": "..." }
]`;

  const content = await callGemini(prompt);
  const cleaned = content.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
};

export const evaluateAnswer = async ({ question, userAnswer, role }) => {
  const prompt = `You are an interviewer evaluating a candidate's answer for a ${role} position.

Question: ${question}
Candidate's Answer: ${userAnswer || "(No answer provided)"}

Evaluate this answer and return ONLY a valid JSON object, no extra text, in this exact format:
{
  "score": 0,
  "strength": "...",
  "weakness": "...",
  "improvementTip": "..."
}

Score should be an integer from 0 to 10. If no answer was provided, score should be 0.`;

  const content = await callGemini(prompt);
  const cleaned = content.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
};
