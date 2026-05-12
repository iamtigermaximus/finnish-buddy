// src/lib/ai/content-generator.ts
import { callGroq } from "./groq-client";

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

// Fallback lesson when AI fails
function getFallbackLesson(topicTitle: string, level: string): GeneratedLesson {
  return {
    grammarExplanation: `Welcome to ${topicTitle}! This is an important topic for ${level} level Finnish learners. Focus on understanding the basic rules and practicing regularly. Keep studying and you'll master it! 🐻`,
    grammarRules: [
      `Rule 1: Understand the basic concept of ${topicTitle}`,
      `Rule 2: Practice with examples every day`,
      `Rule 3: Review common mistakes to avoid`,
      `Rule 4: Apply what you learn in conversation`,
    ],
    examples: [
      {
        finnish: "Tämä on esimerkki.",
        english: "This is an example.",
        explanation: "Practice creating your own sentences",
      },
      {
        finnish: "Harjoittelen joka päivä.",
        english: "I practice every day.",
        explanation: "Consistency is key",
      },
      {
        finnish: "Ymmärrän nyt paremmin.",
        english: "I understand better now.",
        explanation: "Learning takes time",
      },
    ],
    memoryAid: {
      mnemonic: `Remember ${topicTitle} by practicing daily!`,
      explanation:
        "The best way to learn is through consistent practice and exposure to the language.",
      quickTips: [
        "Study 15 minutes every day",
        "Use flashcards for vocabulary",
        "Practice with a language partner",
        "Watch Finnish videos with subtitles",
      ],
    },
    practiceExercises: [
      {
        prompt: `Create a sentence using what you learned about "${topicTitle}".`,
        expectedAnswer: "Example answer",
        hint: "Think about the grammar rules you just learned",
      },
      {
        prompt: `Translate to Finnish: "I want to learn more."`,
        expectedAnswer: "Haluan oppia lisää",
        hint: "Haluan = I want, oppia = to learn, lisää = more",
      },
      {
        prompt: `Fill in the blank: "___ on kaunis päivä." (It is a beautiful day)`,
        expectedAnswer: "Se",
        hint: "Se means 'it' in Finnish",
      },
    ],
    quizQuestions: [
      {
        text: `What is the most important factor when learning ${topicTitle}?`,
        type: "multiple_choice",
        options: [
          "Regular practice",
          "Only reading once",
          "Skipping difficult parts",
          "Memorizing without understanding",
        ],
        correctAnswer: "Regular practice",
        explanation:
          "Consistent practice is the key to mastering any language concept! 🐻",
      },
      {
        text: `How can you improve your understanding of ${topicTitle}?`,
        type: "multiple_choice",
        options: [
          "Study a little every day",
          "Study once a month",
          "Never review",
          "Only take quizzes without studying",
        ],
        correctAnswer: "Study a little every day",
        explanation:
          "Daily practice, even for just 15 minutes, helps reinforce what you've learned! 📚",
      },
      {
        text: `What should you do if you don't understand ${topicTitle}?`,
        type: "multiple_choice",
        options: [
          "Ask for help",
          "Give up",
          "Skip to next topic",
          "Ignore it completely",
        ],
        correctAnswer: "Ask for help",
        explanation:
          "Asking questions and seeking help is a great way to learn! 🐻",
      },
      {
        text: `Which approach works best for learning Finnish?`,
        type: "multiple_choice",
        options: [
          "Combine reading, writing, listening, and speaking",
          "Only read textbooks",
          "Only watch videos",
          "Only take quizzes",
        ],
        correctAnswer: "Combine reading, writing, listening, and speaking",
        explanation:
          "Using multiple methods helps reinforce learning in different ways! 🌟",
      },
      {
        text: `What is the best attitude for learning ${topicTitle}?`,
        type: "multiple_choice",
        options: [
          "Be patient and persistent",
          "Expect overnight success",
          "Get frustrated easily",
          "Compare yourself to others",
        ],
        correctAnswer: "Be patient and persistent",
        explanation:
          "Language learning takes time. Be kind to yourself and keep going! 🐻",
      },
    ],
  };
}

export async function generateCompleteLesson(
  topicTitle: string,
  level: string,
  numberOfQuestions: number = 10,
): Promise<GeneratedLesson> {
  // Use fallback directly if no API key (faster and more reliable)
  if (
    !process.env.GROQ_API_KEY ||
    process.env.GROQ_API_KEY === "dummy_key_for_now"
  ) {
    console.log("No API key, using fallback lesson");
    return getFallbackLesson(topicTitle, level);
  }

  const systemPrompt = `You are Otso, an expert Finnish language teacher. 
  Generate a complete lesson for ${level} level students on "${topicTitle}".
  Make it engaging, accurate, and appropriate for ${level} level.
  Return ONLY valid JSON. No markdown, no extra text, no code blocks.`;

  const prompt = `Generate a complete Finnish lesson for ${level} level students on the topic: "${topicTitle}"

Return ONLY valid JSON. Do not include any text outside the JSON. Do not use markdown code blocks.

{
  "grammarExplanation": "Clear friendly explanation",
  "grammarRules": ["Rule 1", "Rule 2", "Rule 3", "Rule 4"],
  "examples": [
    {"finnish": "Example in Finnish", "english": "English translation", "explanation": "Brief explanation"}
  ],
  "memoryAid": {
    "mnemonic": "Catchy memory trick",
    "explanation": "How to remember this concept",
    "quickTips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4"]
  },
  "practiceExercises": [
    {"prompt": "Exercise question", "expectedAnswer": "correct answer", "hint": "helpful hint"}
  ],
  "quizQuestions": [
    {
      "text": "Question text",
      "type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Why this is correct"
    }
  ]
}

Requirements:
- Use simple language for ${level} level
- Include 4 grammar rules
- Include 5 examples
- Include 4 practice exercises
- Include ${numberOfQuestions} quiz questions (all multiple choice)
- Add 🐻 emoji in explanations`;

  try {
    const response = await callGroq(prompt, systemPrompt);

    // Clean the response
    let cleanResponse = response.trim();

    // Remove markdown code blocks
    cleanResponse = cleanResponse.replace(/^```json\n?/i, "");
    cleanResponse = cleanResponse.replace(/^```\n?/, "");
    cleanResponse = cleanResponse.replace(/\n?```$/, "");

    // Find JSON object
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response, using fallback");
      return getFallbackLesson(topicTitle, level);
    }

    const lesson = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (
      !lesson.grammarExplanation ||
      !lesson.grammarRules ||
      !lesson.examples ||
      !lesson.memoryAid ||
      !lesson.practiceExercises ||
      !lesson.quizQuestions
    ) {
      console.error("Missing required fields, using fallback");
      return getFallbackLesson(topicTitle, level);
    }

    return lesson;
  } catch (error) {
    console.error("Lesson generation failed, using fallback:", error);
    return getFallbackLesson(topicTitle, level);
  }
}
