// src/lib/ai/deepseek-client.ts
import OpenAI from "openai";

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

export const AI_MODEL = "deepseek-v4-pro"; // or "deepseek-reasoner" for reasoning tasks

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
    const completion = await deepseek.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            systemPrompt ||
            `You are Otso, a friendly Finnish bear and expert Finnish language teacher. Keep responses concise and friendly. Use 🐻 emoji occasionally.`,
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
