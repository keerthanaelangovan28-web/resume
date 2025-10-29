
import { GoogleGenAI, Type } from "@google/genai";
import type { Question } from '../types';

const getQuizQuestions = async (skills: string[]): Promise<Question[]> => {
  // This is a placeholder for a real API key, which should be stored in environment variables.
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is not set. Using mock data.");
    // Return mock data if API key is not available
    return Promise.resolve([
        { question: "What is a closure in JavaScript?", options: ["A function having access to the parent scope", "A type of class", "A way to close a file", "A variable type"], correctAnswer: "A function having access to the parent scope" },
        { question: "Which hook is used to perform side effects in a React functional component?", options: ["useState", "useEffect", "useContext", "useReducer"], correctAnswer: "useEffect" },
        { question: "What does `npm` stand for?", options: ["Node Package Manager", "New Project Manager", "Node Project Module", "N-tier Package Module"], correctAnswer: "Node Package Manager" },
        { question: "In Tailwind CSS, what utility class is used for flexbox?", options: ["flexbox", "flex-container", "flex", "display-flex"], correctAnswer: "flex" },
        { question: "What is the purpose of TypeScript?", options: ["To add static typing to JavaScript", "To style web pages", "To manage databases", "To create 3D graphics"], correctAnswer: "To add static typing to JavaScript" },
    ]);
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Based on the following skills: ${skills.join(', ')}, generate 5 conceptual multiple-choice questions to test a candidate's knowledge. Each question must have exactly 4 options, with only one correct answer. Provide the response as a JSON object.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              description: "An array of 5 quiz questions.",
              items: {
                type: Type.OBJECT,
                properties: {
                  question: {
                    type: Type.STRING,
                    description: "The question text."
                  },
                  options: {
                    type: Type.ARRAY,
                    description: "An array of 4 possible answers.",
                    items: {
                      type: Type.STRING
                    }
                  },
                  correctAnswer: {
                    type: Type.STRING,
                    description: "The correct answer from the options array."
                  }
                },
                required: ["question", "options", "correctAnswer"]
              }
            }
          },
          required: ["questions"]
        },
      },
    });

    const jsonString = response.text;
    const parsedResponse = JSON.parse(jsonString);
    
    if (parsedResponse.questions && Array.isArray(parsedResponse.questions)) {
      return parsedResponse.questions as Question[];
    } else {
      throw new Error("Invalid response format from Gemini API");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate quiz questions from the API.");
  }
};

export { getQuizQuestions };
