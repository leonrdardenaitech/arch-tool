import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(geminiApiKey);

export const useGemini = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refinePrompt = async (text) => {
    setLoading(true);
    setError(null);
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest",
        systemInstruction: "PRO ARCHITECT ENGINE: Refine input into highly structural, high-fidelity master prompts with architectural rigor."
      });

      const result = await model.generateContent(text);
      const response = await result.response;
      const refinedText = response.text();
      
      setLoading(false);
      return refinedText;
    } catch (e) {
      console.error("Refinement error:", e);
      setError(e.message);
      setLoading(false);
      return `Nexus Link Broken: ${e.message}`;
    }
  };

  return { refinePrompt, loading, error };
};
