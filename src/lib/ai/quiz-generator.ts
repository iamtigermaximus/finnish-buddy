// src/lib/ai/quiz-generator.ts
import { callDeepSeekJSON } from "./deepseek-client";

export interface AIQuestion {
  text: string;
  type: "multiple_choice" | "fill_blank" | "translation" | "true_false";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export interface AIQuiz {
  title: string;
  description: string;
  questions: AIQuestion[];
  passingScore: number;
}

// Fallback quiz when AI fails
function getFallbackQuiz(
  topicTitle: string,
  level: string,
  numberOfQuestions: number = 10,
): AIQuiz {
  const questions: AIQuestion[] = [];

  for (let i = 0; i < Math.min(numberOfQuestions, 10); i++) {
    questions.push({
      text: `What is an important concept when learning "${topicTitle}"?`,
      type: "multiple_choice",
      options: [
        "Regular practice and review",
        "Only reading once",
        "Skipping difficult parts",
        "Memorizing without understanding",
      ],
      correctAnswer: "Regular practice and review",
      explanation:
        "Consistent practice is the key to mastering any Finnish concept! Keep studying with Otso! 🐻",
      points: 1,
    });
  }

  return {
    title: `${topicTitle} - Practice Quiz`,
    description: `Test your knowledge of ${topicTitle.toLowerCase()} with these ${numberOfQuestions} questions. Good luck! 🐻`,
    questions,
    passingScore: 70,
  };
}

export async function generateAIQuiz(
  topicTitle: string,
  topicDescription: string,
  grammarRules: string[],
  level: string,
  numberOfQuestions: number = 10,
): Promise<AIQuiz | null> {
  // Check if DeepSeek API key is available
  if (
    !process.env.DEEPSEEK_API_KEY ||
    process.env.DEEPSEEK_API_KEY === "dummy_key_for_now"
  ) {
    console.log(
      "No valid DEEPSEEK_API_KEY found, using fallback quiz generator",
    );
    return getFallbackQuiz(topicTitle, level, numberOfQuestions);
  }

  const systemPrompt = `You are Otso, a friendly Finnish bear and expert Finnish language teacher.
  Generate a ${level} level Finnish quiz with ${numberOfQuestions} questions.
  All questions MUST be multiple choice with 4 options each.
  Make questions fun, challenging but fair.
  Use Finnish examples where appropriate.
  Return ONLY valid JSON. No other text.`;

  const prompt = `Generate a Finnish language quiz for ${level} level students on the topic: "${topicTitle}"

Topic description: ${topicDescription}

Grammar rules covered:
${grammarRules.map((rule, i) => `${i + 1}. ${rule}`).join("\n")}

Generate ${numberOfQuestions} multiple-choice questions that test understanding of these concepts.

Requirements for each question:
1. Question text should be clear and test understanding
2. Provide 4 answer options
3. Only ONE correct answer per question
4. Include a friendly explanation with 🐻 emoji
5. Make questions varied in difficulty

Return in this exact JSON format:
{
  "title": "Fun quiz title with 🐻 emoji",
  "description": "Encouraging description",
  "passingScore": 70,
  "questions": [
    {
      "text": "Question text here",
      "type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Correct option text",
      "explanation": "Friendly explanation with 🐻 emoji",
      "points": 1
    }
  ]
}`;

  try {
    const quiz = await callDeepSeekJSON<AIQuiz>(prompt, systemPrompt);
    if (quiz && quiz.questions && quiz.questions.length > 0) {
      // Ensure all questions are multiple choice
      quiz.questions = quiz.questions.map((q) => ({
        ...q,
        type: "multiple_choice",
        options: q.options || ["Option A", "Option B", "Option C", "Option D"],
      }));
      return quiz;
    }
    return getFallbackQuiz(topicTitle, level, numberOfQuestions);
  } catch (error) {
    console.error("AI Quiz generation failed, using fallback:", error);
    return getFallbackQuiz(topicTitle, level, numberOfQuestions);
  }
}

export async function regenerateQuiz(
  topicTitle: string,
  level: string,
  previousScore: number,
  weakAreas?: string[],
): Promise<AIQuiz | null> {
  if (
    !process.env.DEEPSEEK_API_KEY ||
    process.env.DEEPSEEK_API_KEY === "dummy_key_for_now"
  ) {
    return getFallbackQuiz(topicTitle, level, previousScore < 50 ? 8 : 10);
  }

  const weakAreasText =
    weakAreas && weakAreas.length > 0
      ? `The student struggled with: ${weakAreas.join(", ")}. Focus on these areas.`
      : "Create a fresh quiz with different questions.";

  const prompt = `Generate a NEW practice quiz for ${level} level Finnish student on "${topicTitle}".
  
${weakAreasText}

Previous score: ${previousScore}%

Create ${previousScore < 50 ? 8 : 10} multiple choice questions that:
1. Target areas that need improvement
2. Are slightly easier if the student scored low
3. Are more challenging if they scored high
4. Include encouraging feedback

Return in same JSON format with title, description, passingScore, and questions array.
All questions must be multiple choice with 4 options.`;

  try {
    const quiz = await callDeepSeekJSON<AIQuiz>(
      prompt,
      "You are Otso the bear, creating personalized quizzes. Return ONLY valid JSON. All questions must be multiple choice.",
    );
    if (quiz && quiz.questions && quiz.questions.length > 0) {
      quiz.questions = quiz.questions.map((q) => ({
        ...q,
        type: "multiple_choice",
        options: q.options || ["Option A", "Option B", "Option C", "Option D"],
      }));
      return quiz;
    }
    return getFallbackQuiz(topicTitle, level, previousScore < 50 ? 8 : 10);
  } catch (error) {
    console.error("Quiz regeneration failed, using fallback:", error);
    return getFallbackQuiz(topicTitle, level, previousScore < 50 ? 8 : 10);
  }
}
