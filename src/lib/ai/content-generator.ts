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
  // Use fallback directly if no API key
  if (
    !process.env.DEEPSEEK_API_KEY ||
    process.env.DEEPSEEK_API_KEY === "dummy_key_for_now"
  ) {
    console.log("No DeepSeek API key, using fallback lesson");
    return getFallbackLesson(topicTitle, level);
  }

  // ✅ GENERIC system prompt - NO hardcoded topic examples
  const systemPrompt = `You are Otso, a friendly Finnish bear and expert Finnish language teacher. 
  You teach ENGLISH-SPEAKING students who are learning Finnish.
  You explain grammar concepts IN ENGLISH.
  You use a warm, encouraging, friendly tone with emojis 🐻, 🎯, 💡, 📚, ✨.
  Never cut off mid-list or mid-explanation.
  Your explanations help English speakers understand Finnish grammar rules clearly.
  IMPORTANT: Write ALL explanations, rules, memory aid explanations, and quiz questions IN ENGLISH.
  ONLY Finnish example sentences should be in Finnish.
  Keep your responses concise and clear.`;

  // ✅ GENERIC prompt - builds instructions based on the actual topic
  const prompt = `Generate a COMPLETE, COMPREHENSIVE Finnish lesson for ${level} level ENGLISH-SPEAKING students.

TOPIC: "${topicTitle}"

⚠️ CRITICAL RULES:
- Write ALL explanations, grammar rules, and instructions in ENGLISH
- ONLY the "finnish" field in examples should contain Finnish text
- Give a COMPLETE lesson about "${topicTitle}" - cover EVERYTHING relevant to this topic
- DO NOT cut off mid-sentence or mid-list
- Include ALL relevant items for this topic (if it's pronouns, include all pronouns; if it's verbs, include all conjugations; etc.)
- Include 6-8 examples minimum
- Include 6-8 grammar rules minimum

📚 REQUIRED STRUCTURE:

1. GRAMMAR EXPLANATION (in English):
   - Start with: "Hei ystävä! 🐻 Let's learn about ${topicTitle} together!"
   - Give a COMPLETE, thorough explanation (minimum 100 words)
   - Cover ALL aspects of ${topicTitle}
   - End with an encouraging note

2. GRAMMAR RULES (minimum 6 rules, all in English):
   - List ALL the important rules for ${topicTitle}
   - Each rule should be clear and practical
   - Include examples within rules when helpful

3. EXAMPLES (minimum 6 examples):
   - "finnish": A real Finnish sentence using ${topicTitle}
   - "english": English translation
   - "explanation": English explanation of what's happening

4. MEMORY AID (all in English):
   - "mnemonic": A catchy memory trick specific to ${topicTitle}
   - "explanation": Why this memory trick works
   - "quickTips": 4-6 helpful tips for remembering ${topicTitle}

5. PRACTICE EXERCISES (minimum 4 exercises):
   - "prompt": English instruction testing ${topicTitle}
   - "expectedAnswer": The correct Finnish answer
   - "hint": English hint to guide the student

6. QUIZ QUESTIONS (${numberOfQuestions} multiple choice questions):
   - Test understanding of ${topicTitle}
   - Mix easy, medium, and hard questions
   - Include friendly explanations for each answer

Return ONLY valid JSON. Make the lesson COMPLETE and COMPREHENSIVE for "${topicTitle}". Do not cut off.`;

  try {
    const response = await callDeepSeek(prompt, systemPrompt);

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
      !lesson.examples
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
