
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratorResponse } from '../types';
import { SYSTEM_INSTRUCTION, EXAMPLES_CONTEXT } from './promptData';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    styleAnalysis: {
      type: Type.STRING,
      description: "A brief summary of the key characteristics of effective LinkedIn posts based on the examples and how they apply to this draft.",
    },
    posts: {
      type: Type.ARRAY,
      description: "List of 3 generated LinkedIn posts.",
      items: {
        type: Type.OBJECT,
        properties: {
          hook: {
            type: Type.STRING,
            description: "The first two lines of the post. Must be short and create curiosity.",
          },
          content: {
            type: Type.STRING,
            description: "The full body of the LinkedIn post. Use double line breaks (\\n\\n) between paragraphs for optimal whitespace.",
          },
          rationale: {
            type: Type.STRING,
            description: "A brief explanation of why this specific angle and structure works.",
          },
        },
        required: ["hook", "content", "rationale"],
      },
    },
  },
  required: ["styleAnalysis", "posts"],
};

export const generateLinkedInPosts = async (draft: string): Promise<GeneratorResponse> => {
  const ai = getClient();

  const prompt = `
    ${EXAMPLES_CONTEXT}
    
    Based on the style analysis of the examples above, please transform the following draft into 3 distinct, viral-style LinkedIn posts.
    
    <draft>
    ${draft}
    </draft>
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, 
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratorResponse;
    }
    throw new Error("No content generated");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
