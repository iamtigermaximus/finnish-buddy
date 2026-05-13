// src/lib/ai/deepseek-client.ts
import OpenAI from "openai";

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
  timeout: 30000, // 30 second timeout
  maxRetries: 2,
});

export const AI_MODEL = "deepseek-chat";

export async function callDeepSeek(
  prompt: string,
  systemPrompt?: string,
): Promise<string> {
  if (
    !process.env.DEEPSEEK_API_KEY ||
    process.env.DEEPSEEK_API_KEY === "dummy_key_for_now"
  ) {
    console.log("No DEEPSEEK_API_KEY, using mock response");
    return JSON.stringify({
      grammarExplanation:
        "This is a sample lesson. Add your DEEPSEEK_API_KEY to generate real content! 🐻",
      grammarRules: [
        "Rule 1",
        "Rule 2",
        "Rule 3",
        "Rule 4",
        "Rule 5",
        "Rule 6",
      ],
      examples: [
        { finnish: "Esimerkki", english: "Example", explanation: "Sample" },
      ],
      memoryAid: {
        mnemonic: "Sample",
        explanation: "Sample",
        quickTips: ["Tip 1", "Tip 2", "Tip 3", "Tip 4"],
      },
      practiceExercises: [
        { prompt: "Sample", expectedAnswer: "answer", hint: "hint" },
      ],
      quizQuestions: [
        {
          text: "Sample question",
          type: "multiple_choice",
          options: ["A", "B", "C", "D"],
          correctAnswer: "A",
          explanation: "Explanation 🐻",
        },
      ],
    });
  }

  try {
    const completion = await deepseek.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            systemPrompt ||
            `You are Otso, a friendly Finnish bear and expert Finnish language teacher. Keep responses concise. Return ONLY valid JSON when requested.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: AI_MODEL,
      temperature: 0.5, // Lower temperature for more consistent JSON
      max_tokens: 3000, // Reduced from 4000
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("DeepSeek API error:", error);
    throw error;
  }
}

export async function callDeepSeekJSON<T>(
  prompt: string,
  systemPrompt?: string,
): Promise<T | null> {
  try {
    const response = await callDeepSeek(prompt, systemPrompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error("DeepSeek JSON parsing error:", error);
    return null;
  }
}
