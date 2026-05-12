// // src/lib/ai/groq-client.ts
// import Groq from "groq-sdk";

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// export const AI_MODEL = "llama-3.1-8b-instant"; // Best for Finnish language
// // Alternative: "mixtral-8x7b-32768" (also good, different strengths)

// export interface AIResponse {
//   success: boolean;
//   content?: string;
//   error?: string;
// }

// export async function callGroq(
//   prompt: string,
//   systemPrompt?: string,
// ): Promise<string> {
//   try {
//     const completion = await groq.chat.completions.create({
//       messages: [
//         {
//           role: "system",
//           content:
//             systemPrompt ||
//             `You are Otso, a friendly Finnish bear and expert Finnish language teacher.
//           You help students learn Finnish grammar, vocabulary, and culture.
//           You are warm, encouraging, and patient.
//           Always provide accurate, clear explanations with examples.
//           Keep responses appropriate for the student's level.
//           Use emojis occasionally to keep it friendly! 🐻`,
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       model: AI_MODEL,
//       temperature: 0.7,
//       max_tokens: 2000,
//     });

//     return completion.choices[0]?.message?.content || "";
//   } catch (error) {
//     console.error("Groq API error:", error);
//     throw error;
//   }
// }

// export async function callGroqJSON<T>(
//   prompt: string,
//   systemPrompt?: string,
// ): Promise<T | null> {
//   try {
//     const response = await callGroq(
//       prompt,
//       systemPrompt + " Return ONLY valid JSON. No other text.",
//     );
//     const jsonMatch = response.match(/\{[\s\S]*\}/);
//     if (jsonMatch) {
//       return JSON.parse(jsonMatch[0]);
//     }
//     return null;
//   } catch (error) {
//     console.error("Groq JSON parsing error:", error);
//     return null;
//   }
// }
// src/lib/ai/groq-client.ts
// import Groq from "groq-sdk";

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY || "dummy",
// });

// export const AI_MODEL = "openai/gpt-oss-120b";

// export async function callGroq(
//   prompt: string,
//   systemPrompt?: string,
// ): Promise<string> {
//   // If no valid API key, return a simple response
//   if (
//     !process.env.GROQ_API_KEY ||
//     process.env.GROQ_API_KEY === "dummy_key_for_now"
//   ) {
//     console.log("No GROQ_API_KEY, using mock response");
//     return JSON.stringify({
//       grammarExplanation:
//         "This is a sample lesson. To get AI-generated content, add your GROQ_API_KEY to .env.local",
//       grammarRules: ["Rule 1", "Rule 2", "Rule 3"],
//       examples: [
//         { finnish: "Esimerkki", english: "Example", explanation: "Sample" },
//       ],
//       memoryAid: {
//         mnemonic: "Sample mnemonic",
//         explanation: "Sample explanation",
//         quickTips: ["Tip 1"],
//       },
//       practiceExercises: [
//         { prompt: "Sample exercise", expectedAnswer: "answer", hint: "hint" },
//       ],
//       quizQuestions: [
//         {
//           text: "Sample question",
//           type: "multiple_choice",
//           options: ["A", "B"],
//           correctAnswer: "A",
//           explanation: "Explanation",
//         },
//       ],
//     });
//   }

//   try {
//     const completion = await groq.chat.completions.create({
//       messages: [
//         {
//           role: "system",
//           content:
//             systemPrompt ||
//             `You are Otso, a friendly Finnish bear and expert Finnish language teacher.`,
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       model: AI_MODEL,
//       temperature: 0.7,
//       max_tokens: 4000,
//     });

//     return completion.choices[0]?.message?.content || "";
//   } catch (error) {
//     console.error("Groq API error:", error);
//     throw error;
//   }
// }

// export async function callGroqJSON<T>(
//   prompt: string,
//   systemPrompt?: string,
// ): Promise<T | null> {
//   try {
//     const response = await callGroq(prompt, systemPrompt);
//     const jsonMatch = response.match(/\{[\s\S]*\}/);
//     if (jsonMatch) {
//       return JSON.parse(jsonMatch[0]);
//     }
//     return null;
//   } catch (error) {
//     console.error("Groq JSON parsing error:", error);
//     return null;
//   }
// }
// src/lib/ai/groq-client.ts
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const AI_MODEL = "openai/gpt-oss-120b";

export async function callGroq(
  prompt: string,
  systemPrompt?: string,
): Promise<string> {
  if (
    !process.env.GROQ_API_KEY ||
    process.env.GROQ_API_KEY === "dummy_key_for_now"
  ) {
    console.log("No GROQ_API_KEY, using mock response");
    return JSON.stringify({
      title: "Sample Quiz",
      description: "This is a sample quiz",
      passingScore: 70,
      questions: [
        {
          text: "What is the best way to learn Finnish?",
          type: "multiple_choice",
          options: [
            "Practice daily",
            "Study once a month",
            "Never review",
            "Only take tests",
          ],
          correctAnswer: "Practice daily",
          explanation: "Consistent practice is key! 🐻",
          points: 1,
        },
      ],
    });
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            systemPrompt ||
            `You are Otso, a friendly Finnish bear and expert Finnish language teacher.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: AI_MODEL,
      temperature: 0.7,
      max_tokens: 4000,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq API error:", error);
    throw error;
  }
}

export async function callGroqJSON<T>(
  prompt: string,
  systemPrompt?: string,
): Promise<T | null> {
  try {
    const response = await callGroq(prompt, systemPrompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error("Groq JSON parsing error:", error);
    return null;
  }
}
