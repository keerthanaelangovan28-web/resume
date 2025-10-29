import { GoogleGenAI, Type } from "@google/genai";
import type { Question, ResumeData } from '../types';

export const analyzeResumeImage = async (imageBase64: string): Promise<ResumeData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not set for image analysis. Using mock data.");
    return Promise.resolve({
      name: 'Jane Doe (from Image)',
      skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'System Design'],
      experience: ['Analyzed from resume image.'],
    });
  }

  const ai = new GoogleGenAI({ apiKey });
  const imagePart = { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } };
  const textPart = { text: "Analyze this resume image. Extract the candidate's name, a list of their technical skills, and a summary of their experience. Respond in JSON." };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            experience: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["name", "skills", "experience"],
        },
      },
    });
    return JSON.parse(response.text) as ResumeData;
  } catch (error) {
    console.error("Error calling Gemini API for image analysis:", error);
    throw new Error("Failed to analyze resume image from the API.");
  }
};

export const getQuizQuestions = async (skills: string[]): Promise<Question[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not set. Using mock quiz data.");
    return Promise.resolve([
        { question: "Explain the concept of closures in JavaScript and provide a practical use case." },
        { question: "Describe the component lifecycle in React. How has it changed with the introduction of Hooks?" },
        { question: "What is the event loop in Node.js and how does it handle asynchronous operations?" },
        { question: "Explain the benefits of using a utility-first CSS framework like Tailwind CSS over traditional CSS or component libraries like Bootstrap." },
        { question: "Discuss the trade-offs between monolithic and microservices architectures." },
    ]);
  }
  
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Based on the following skills: ${skills.join(', ')}, generate 25 conceptual, open-ended interview questions to test a candidate's deep understanding. The questions should not be answerable with a simple 'yes' or 'no'. Provide the response as a JSON object.`;

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
              description: "An array of 25 quiz questions.",
              items: {
                type: Type.OBJECT,
                properties: {
                  question: {
                    type: Type.STRING,
                    description: "The conceptual, open-ended question text."
                  }
                },
                required: ["question"]
              }
            }
          },
          required: ["questions"]
        },
      },
    });

    const parsedResponse = JSON.parse(response.text);
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

export const evaluateQuizAnswers = async (questions: Question[], answers: string[]): Promise<number> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.warn("API_KEY not set for evaluation. Returning a mock score.");
        const score = answers.reduce((acc, answer) => acc + (answer.length > 20 ? Math.floor(Math.random() * 6) + 15 : Math.floor(Math.random() * 10)), 0);
        return Math.min(score, 100 * questions.length/25);
    }

    const ai = new GoogleGenAI({ apiKey });
    const evaluationPrompt = `An AI assistant is evaluating a candidate's answers to a technical quiz.
      Here are the questions and the candidate's answers:
      ${questions.map((q, i) => `Question ${i+1}: ${q.question}\nAnswer ${i+1}: ${answers[i] || '(No answer provided)'}`).join('\n\n')}

      Please evaluate all the answers. For each answer, assign a score from 0 to 20 based on accuracy, depth, and clarity.
      After evaluating all answers, calculate the total score by summing up the scores for each question.
      The final response must be a JSON object containing only one key: "totalScore", which is a number.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: evaluationPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        totalScore: { type: Type.NUMBER }
                    },
                    required: ["totalScore"]
                }
            }
        });

        const parsedResponse = JSON.parse(response.text);
        return parsedResponse.totalScore;
    } catch(error) {
        console.error("Error calling Gemini API for evaluation:", error);
        throw new Error("Failed to evaluate answers from the API.");
    }
};