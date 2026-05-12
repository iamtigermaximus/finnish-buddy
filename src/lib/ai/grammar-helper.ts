// src/lib/ai/grammar-helper.ts
import { callGroq } from "./groq-client";

export async function explainGrammarWithAI(
  grammarRule: string,
  userQuestion: string,
  level: string,
  topicTitle: string,
): Promise<string> {
  const prompt = `A ${level} level Finnish student is learning about "${topicTitle}".

GRAMMAR RULE: ${grammarRule}

The student asks: "${userQuestion}"

As Otso the friendly bear, provide a warm, encouraging explanation that:
1. Answers the question directly and clearly
2. Uses simple language appropriate for ${level} level
3. Includes 2-3 concrete examples with Finnish and English
4. Points out common mistakes students make
5. Ends with a practical tip or small exercise
6. Uses friendly emojis (🐻, 📚, 💡) to be engaging

Keep the response friendly but educational, around 200-300 words.`;

  return await callGroq(prompt);
}

export async function generatePracticeExercises(
  topicTitle: string,
  grammarRules: string[],
  level: string,
  numberOfExercises: number = 3,
): Promise<Array<{ prompt: string; expectedAnswer: string; hint: string }>> {
  const prompt = `Create ${numberOfExercises} interactive practice exercises for ${level} level Finnish students learning "${topicTitle}".

Grammar rules covered:
${grammarRules.join("\n")}

For each exercise, provide:
1. A prompt or fill-in-the-blank sentence in Finnish
2. The expected correct answer
3. A helpful hint (like Otso the bear would give)

Make exercises progressively challenging.
Include a mix of sentence completion, translation, and correction exercises.

Return as JSON array:
[
  {
    "prompt": "Minä ___ (puhua) suomea.",
    "expectedAnswer": "puhun",
    "hint": "Verb type 1: remove -a, add -n for minä. You've got this! 🐻"
  }
]`;

  try {
    const response = await callGroq(
      prompt,
      "Return ONLY valid JSON array. No other text.",
    );
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return getFallbackExercises(topicTitle);
  } catch (error) {
    console.error("Practice exercise generation failed:", error);
    return getFallbackExercises(topicTitle);
  }
}

function getFallbackExercises(topicTitle: string) {
  return [
    {
      prompt: `Practice using "${topicTitle}" in a sentence.`,
      expectedAnswer: "Example answer",
      hint: "Review the grammar rules and try again! 📚",
    },
  ];
}

export async function getWordMemoryTip(
  finnishWord: string,
  englishMeaning: string,
): Promise<string> {
  const prompt = `Create a fun, memorable mnemonic or memory trick to remember the Finnish word "${finnishWord}" which means "${englishMeaning}".

Make it:
1. Short and catchy (max 20 words)
2. Visual or rhyming if possible
3. Something a student would actually remember
4. Include a small 🐻 emoji

Examples:
- "kuusi (spruce) sounds like 'goosey' - a goose in a spruce tree!"
- "kello (clock) - 'kello' rhymes with 'yellow' - a yellow clock"

Return ONLY the memory tip, nothing else.`;

  try {
    return await callGroq(
      prompt,
      "You are Otso the bear creating fun memory tricks. Be creative and helpful!",
    );
  } catch (error) {
    return `🐻 Think of something funny linking "${finnishWord}" to "${englishMeaning}"!`;
  }
}
