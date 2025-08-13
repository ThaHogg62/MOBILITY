
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { AiGeneratedSample, AiBeatSequence } from '../types';

// Ensure the API key is available in the environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
  // This warning is helpful for developers during setup.
  console.warn("API_KEY environment variable not set. Creative Assistant will not work.");
}

// Initialize with the key (or empty string if not found, API calls will then fail gracefully).
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const generateCreativeIdea = async (topic: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is not configured. The Creative Assistant is unavailable.";
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a creative idea for a music producer related to: "${topic}". Be concise and inspiring. For example, if the topic is 'drum beat', suggest a specific rhythm or style.`,
      config: {
        systemInstruction: "You are a creative assistant for music producers. You provide short, actionable ideas.",
        temperature: 0.8,
        maxOutputTokens: 100,
        thinkingConfig: { thinkingBudget: 0 } // Low latency for quick suggestions
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Error generating idea: ${error.message}`;
    }
    return "An unknown error occurred while generating an idea.";
  }
};


export const generateSampleIdea = async (prompt: string): Promise<AiGeneratedSample> => {
  if (!apiKey) {
    throw new Error("API Key is not configured. The AI Sample Generator is unavailable.");
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on the user prompt: "${prompt}", generate a creative and descriptive name for a unique audio sample, and a one-sentence description. For example, if the prompt is "deep 808 bass for trap", you could suggest a name like "Subterranean 808" with a description like "A chest-rattling bass sound with a long decay, perfect for modern trap beats."`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "A short, creative, and catchy name for the audio sample."
            },
            description: {
              type: Type.STRING,
              description: "A one-sentence description of what the audio sample sounds like."
            }
          },
          required: ["name", "description"]
        },
        temperature: 0.9,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    
    if (parsed && typeof parsed.name === 'string' && typeof parsed.description === 'string') {
        return parsed as AiGeneratedSample;
    } else {
        throw new Error("Received an invalid format from the AI.");
    }

  } catch (error) {
    console.error("Error calling Gemini API for sample generation:", error);
    if (error instanceof Error) {
        throw new Error(`Error generating sample idea: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating a sample idea.");
  }
};

export const generateBeatSequence = async (prompt: string): Promise<AiBeatSequence> => {
    if (!apiKey) {
        throw new Error("API Key is not configured. The AI Beat Generator is unavailable.");
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `The user wants a drum beat sequence based on the prompt: "${prompt}". Create a sequence of 8 drum hits. The hits should be one of the following types: 'kick', 'snare', 'hihat', 'open-hat', 'clap', 'tom'. For example, for "boom bap", a good sequence would be ["kick", "hihat", "snare", "hihat", "kick", "hihat", "kick", "snare"].`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sequence: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            },
                            description: "An array of 8 strings representing the drum sequence."
                        }
                    },
                    required: ["sequence"]
                },
                temperature: 1.0,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);

        if (parsed && Array.isArray(parsed.sequence)) {
            return parsed.sequence as AiBeatSequence;
        } else {
            throw new Error("Received an invalid format from the AI for the beat sequence.");
        }

    } catch (error) {
        console.error("Error calling Gemini API for beat sequence generation:", error);
        if (error instanceof Error) {
            throw new Error(`Error generating beat: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the beat.");
    }
};
