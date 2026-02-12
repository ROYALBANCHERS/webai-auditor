import { GoogleGenAI, Type } from "@google/genai";
import { AuditResult } from "../types";

export const auditWebsite = async (url: string): Promise<AuditResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are a senior frontend developer and UX expert who speaks in a casual, friendly "Bhai" style (Indian slang mixed with English, Hinglish). 
    Your persona is knowledgeable but relaxed.
    
    I want you to audit this website URL: ${url}
    
    Since you cannot browse the live web, use your training data to infer the likely state of this website if it is a popular one, 
    OR simulate a detailed audit based on standard best practices for a website of this domain name's implied type (e.g., e-commerce, portfolio, blog).
    
    Provide the output in strict JSON format.
    
    The content tone must be "Bhai-style".
    
    Fields required:
    - summary: A short paragraph description mixing Hindi and English. Start with "Bhai website..."
    - issues: A list of 3-5 specific UI/UX issues commonly found or inferred.
    - technical_analysis: A list of 3 specific technical faults. PREDICT where code might be missing (e.g., "Missing meta description", "No ARIA labels on buttons") and identify functionality that often breaks (e.g., "Submit button responsiveness", "Mobile menu JS errors").
    - rating: A number from 1 to 5 (can be a decimal like 3.5).
    - advice: One solid piece of premium advice.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            issues: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            technical_analysis: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            rating: { type: Type.NUMBER },
            advice: { type: Type.STRING }
          },
          required: ["summary", "issues", "technical_analysis", "rating", "advice"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AuditResult;
  } catch (error) {
    console.error("Gemini Audit Error:", error);
    throw error;
  }
};