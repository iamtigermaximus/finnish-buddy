// src/lib/ai/content-generator.ts
import { callDeepSeek } from "./deepseek-client";

export interface GeneratedLesson {
  grammarExplanation: string;
  grammarRules: string[];
  examples: Array<{ finnish: string; english: string; explanation?: string }>;
  memoryAid: {
    mnemonic: string;
    explanation: string;
    quickTips: string[];
  };
  practiceExercises: Array<{
    prompt: string;
    expectedAnswer: string;
    hint: string;
  }>;
  quizQuestions: Array<{
    text: string;
    type: "multiple_choice" | "fill_blank" | "translation";
    options?: string[];
    correctAnswer: string;
    explanation: string;
  }>;
}

interface JsonParseError {
  message: string;
  position: number;
}

// Helper function to repair common JSON issues
function repairJSON(malformedJson: string): string {
  let repaired = malformedJson;

  // Remove trailing commas before closing brackets/braces
  repaired = repaired.replace(/,(\s*[}\]])/g, "$1");

  // Add missing quotes around property names
  repaired = repaired.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');

  // Fix unescaped quotes inside strings
  repaired = repaired.replace(
    /:\s*"([^"]*?)"/g,
    (match: string, content: string) => {
      const escaped = content.replace(/"/g, '\\"');
      return `:"${escaped}"`;
    },
  );

  // Remove comments (// or /* */)
  repaired = repaired.replace(/\/\/.*$/gm, "");
  repaired = repaired.replace(/\/\*[\s\S]*?\*\//g, "");

  return repaired;
}

// Validate and ensure all required fields exist
function validateLesson(lesson: GeneratedLesson): boolean {
  if (
    !lesson.grammarExplanation ||
    typeof lesson.grammarExplanation !== "string"
  ) {
    console.error("Missing or invalid grammarExplanation");
    return false;
  }
  if (
    !lesson.grammarRules ||
    !Array.isArray(lesson.grammarRules) ||
    lesson.grammarRules.length === 0
  ) {
    console.error("Missing or invalid grammarRules");
    return false;
  }
  if (
    !lesson.examples ||
    !Array.isArray(lesson.examples) ||
    lesson.examples.length === 0
  ) {
    console.error("Missing or invalid examples");
    return false;
  }
  if (!lesson.memoryAid || typeof lesson.memoryAid !== "object") {
    console.error("Missing or invalid memoryAid");
    return false;
  }
  if (
    !lesson.practiceExercises ||
    !Array.isArray(lesson.practiceExercises) ||
    lesson.practiceExercises.length === 0
  ) {
    console.error("Missing or invalid practiceExercises");
    return false;
  }
  if (
    !lesson.quizQuestions ||
    !Array.isArray(lesson.quizQuestions) ||
    lesson.quizQuestions.length === 0
  ) {
    console.error("Missing or invalid quizQuestions");
    return false;
  }

  return true;
}

export async function generateCompleteLesson(
  topicTitle: string,
  level: string,
  numberOfQuestions: number = 10,
): Promise<GeneratedLesson> {
  // Check API key first
  if (
    !process.env.DEEPSEEK_API_KEY ||
    process.env.DEEPSEEK_API_KEY === "dummy_key_for_now"
  ) {
    throw new Error(
      "DeepSeek API key is not configured. Please add DEEPSEEK_API_KEY to your environment variables.",
    );
  }

  const systemPrompt = `You are Otso, a friendly Finnish bear and expert Finnish language teacher. 
  You teach ENGLISH-SPEAKING students who are learning Finnish.
  You explain grammar concepts IN ENGLISH.
  You use a warm, encouraging, friendly tone with emojis 🐻, 🎯, 💡, 📚, ✨.
  IMPORTANT: Return ONLY valid JSON. No markdown, no extra text, no code blocks.`;

  const prompt = `Generate a COMPLETE Finnish lesson for ${level} level ENGLISH-SPEAKING students.

TOPIC: "${topicTitle}"

Return ONLY valid JSON. Use this exact structure:

{
  "grammarExplanation": "A short, friendly explanation in English (2-3 sentences)",
  "grammarRules": ["Rule 1 in English", "Rule 2 in English", "Rule 3 in English", "Rule 4 in English", "Rule 5 in English", "Rule 6 in English"],
  "examples": [
    {"finnish": "Finnish sentence here", "english": "English translation", "explanation": "Brief English explanation"}
  ],
  "memoryAid": {
    "mnemonic": "Catchy memory trick in English",
    "explanation": "Short explanation in English",
    "quickTips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4"]
  },
  "practiceExercises": [
    {"prompt": "Exercise question in English", "expectedAnswer": "Correct Finnish answer", "hint": "English hint"}
  ],
  "quizQuestions": [
    {
      "text": "Question in English",
      "type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Correct option",
      "explanation": "Brief explanation in English with 🐻"
    }
  ]
}

Requirements:
- Keep explanations SHORT (5-10 sentences)
- Include 6 grammar rules
- Include 5 examples
- Include 6 practice exercises
- Include ${numberOfQuestions} quiz questions (multiple choice only)
- Use 🐻 emoji occasionally
- Return ONLY valid JSON. No extra text.`;

  try {
    // Add timeout to the API call
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error("Request timeout after 30 seconds")),
        30000,
      );
    });

    const responsePromise = callDeepSeek(prompt, systemPrompt);
    const response = (await Promise.race([
      responsePromise,
      timeoutPromise,
    ])) as string;

    let cleanResponse = response.trim();

    // Remove markdown code blocks
    cleanResponse = cleanResponse.replace(/^```json\n?/i, "");
    cleanResponse = cleanResponse.replace(/^```\n?/, "");
    cleanResponse = cleanResponse.replace(/\n?```$/, "");

    // Try to find JSON object
    let jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Try to repair the JSON
      const repaired = repairJSON(cleanResponse);
      jsonMatch = repaired.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in AI response");
      }
    }

    let lesson: GeneratedLesson;
    try {
      lesson = JSON.parse(jsonMatch[0]) as GeneratedLesson;
    } catch (parseError) {
      // Try one more time with aggressive repair
      const repaired = repairJSON(jsonMatch[0]);
      lesson = JSON.parse(repaired) as GeneratedLesson;
    }

    if (!validateLesson(lesson)) {
      throw new Error("Missing required fields in AI response");
    }

    return lesson;
  } catch (error) {
    console.error("Lesson generation failed:", error);
    throw new Error(
      `Failed to generate lesson: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
