// // src/lib/ai/quiz-generator.ts
// import { callGroqJSON } from "./groq-client";

// export interface AIQuestion {
//   text: string;
//   type: "multiple_choice" | "fill_blank" | "translation" | "true_false";
//   options?: string[];
//   correctAnswer: string;
//   explanation: string;
//   points: number;
// }

// export interface AIQuiz {
//   title: string;
//   description: string;
//   questions: AIQuestion[];
//   passingScore: number;
// }

// export async function generateAIQuiz(
//   topicTitle: string,
//   topicDescription: string,
//   grammarRules: string[],
//   level: string,
//   numberOfQuestions: number = 10,
// ): Promise<AIQuiz | null> {
//   const systemPrompt = `You are Otso, a friendly Finnish bear and expert Finnish language teacher.
//   Generate a quiz for ${level} level Finnish students.
//   Make questions fun, challenging but fair.
//   Include real-world Finnish examples.
//   Return ONLY valid JSON.`;

//   const prompt = `Generate a Finnish language quiz for level ${level} on the topic: "${topicTitle}"

// Topic description: ${topicDescription}

// Grammar rules covered:
// ${grammarRules.map((rule, i) => `${i + 1}. ${rule}`).join("\n")}

// Generate ${numberOfQuestions} questions that test understanding of these concepts.

// Requirements:
// 1. Mix question types: multiple_choice (60%), fill_blank (20%), translation (20%)
// 2. Make questions progressively harder
// 3. Include cultural elements where appropriate
// 4. For fill_blank: provide the full sentence with blank marked as ___
// 5. For translation: ask to translate from English to Finnish

// Return in this exact JSON format:
// {
//   "title": "Quiz title (engaging and friendly)",
//   "description": "Brief description encouraging the student",
//   "passingScore": 70,
//   "questions": [
//     {
//       "text": "Question text",
//       "type": "multiple_choice",
//       "options": ["Option A", "Option B", "Option C", "Option D"],
//       "correctAnswer": "Option A",
//       "explanation": "Friendly explanation with 🐻 emoji",
//       "points": 1
//     }
//   ]
// }`;

//   try {
//     const quiz = await callGroqJSON<AIQuiz>(prompt, systemPrompt);
//     return quiz;
//   } catch (error) {
//     console.error("AI Quiz generation failed:", error);
//     return null;
//   }
// }

// export async function regenerateQuiz(
//   topicTitle: string,
//   level: string,
//   previousScore: number,
//   weakAreas?: string[],
// ): Promise<AIQuiz | null> {
//   const weakAreasText =
//     weakAreas && weakAreas.length > 0
//       ? `The student struggled with: ${weakAreas.join(", ")}. Focus on these areas.`
//       : "The student needs more practice generally.";

//   const prompt = `Generate a NEW practice quiz for ${level} level Finnish student on "${topicTitle}".

// ${weakAreasText}

// Previous score: ${previousScore}%

// Create ${previousScore < 50 ? 8 : 10} questions that:
// 1. Target the student's weak areas
// 2. Are slightly easier if they scored low
// 3. Include more variety than the previous quiz
// 4. Encourage the student with positive feedback

// Return in same JSON format with title, description, passingScore, and questions array.`;

//   try {
//     const quiz = await callGroqJSON<AIQuiz>(
//       prompt,
//       "You are Otso the bear, creating personalized quizzes. Return ONLY valid JSON.",
//     );
//     return quiz;
//   } catch (error) {
//     console.error("Quiz regeneration failed:", error);
//     return null;
//   }
// }
// // src/lib/ai/quiz-generator.ts
// import { callGroqJSON } from "./groq-client";

// export interface AIQuestion {
//   text: string;
//   type: "multiple_choice" | "fill_blank" | "translation" | "true_false";
//   options?: string[];
//   correctAnswer: string;
//   explanation: string;
//   points: number;
// }

// export interface AIQuiz {
//   title: string;
//   description: string;
//   questions: AIQuestion[];
//   passingScore: number;
// }

// // Fallback quiz generator when AI is not available
// function generateFallbackQuiz(
//   topicTitle: string,
//   topicDescription: string,
//   grammarRules: string[],
//   level: string,
//   numberOfQuestions: number = 10,
// ): AIQuiz {
//   const questions: AIQuestion[] = [];

//   // Extract key terms from grammar rules
//   const keyTerms =
//     grammarRules.length > 0
//       ? grammarRules[0].split(" ").slice(0, 3).join(" ")
//       : topicTitle;

//   for (let i = 0; i < numberOfQuestions; i++) {
//     // Use mostly multiple choice for better user experience
//     const type = i % 5 === 0 ? "fill_blank" : "multiple_choice";

//     if (type === "multiple_choice") {
//       questions.push({
//         text: `What is a key aspect of "${topicTitle}"?`,
//         type: "multiple_choice",
//         options: [
//           "Understanding the basic rules and patterns",
//           "Memorizing all exceptions first",
//           "Skipping to advanced topics",
//           "Only reading without practice",
//         ],
//         correctAnswer: "Understanding the basic rules and patterns",
//         explanation: `When learning ${topicTitle}, focus on understanding the core rules and patterns first. Practice regularly with examples to build confidence! 🐻`,
//         points: 1,
//       });

//       questions.push({
//         text: `How should you practice "${topicTitle}" effectively?`,
//         type: "multiple_choice",
//         options: [
//           "Study theory only",
//           "Practice with examples and exercises",
//           "Skip difficult parts",
//           "Only take quizzes",
//         ],
//         correctAnswer: "Practice with examples and exercises",
//         explanation:
//           "Active practice with examples and exercises helps reinforce what you've learned. Keep practicing! 🌟",
//         points: 1,
//       });
//     } else {
//       questions.push({
//         text: `Complete this sentence: "I need to ___ more to master ${topicTitle}."`,
//         type: "fill_blank",
//         correctAnswer: "practice",
//         explanation:
//           "Consistent practice is the key to mastering any language concept! Keep going! 🐻",
//         points: 1,
//       });
//     }
//   }

//   return {
//     title: `${topicTitle} - Practice Quiz`,
//     description: `Test your knowledge with ${numberOfQuestions} questions about ${topicTitle.toLowerCase()}. Take your time and do your best! 🐻`,
//     passingScore: 70,
//     questions: questions.slice(0, numberOfQuestions),
//   };
// }

// export async function generateAIQuiz(
//   topicTitle: string,
//   topicDescription: string,
//   grammarRules: string[],
//   level: string,
//   numberOfQuestions: number = 10,
// ): Promise<AIQuiz | null> {
//   // Check if Groq API key is available
//   if (
//     !process.env.GROQ_API_KEY ||
//     process.env.GROQ_API_KEY === "dummy_key_for_now"
//   ) {
//     console.log("No valid GROQ_API_KEY found, using fallback quiz generator");
//     return generateFallbackQuiz(
//       topicTitle,
//       topicDescription,
//       grammarRules,
//       level,
//       numberOfQuestions,
//     );
//   }

//   const systemPrompt = `You are Otso, a friendly Finnish bear and expert Finnish language teacher.
//   Generate a ${level} level Finnish quiz with ${numberOfQuestions} questions.
//   Focus on multiple choice questions (80%) as they are most effective for testing.
//   Make questions fun, challenging but fair.
//   Use Finnish examples where appropriate.
//   Return ONLY valid JSON. No other text.`;

//   const prompt = `Generate a Finnish language quiz for ${level} level students on the topic: "${topicTitle}"

// Topic description: ${topicDescription}

// Grammar rules covered:
// ${grammarRules.map((rule, i) => `${i + 1}. ${rule}`).join("\n")}

// Generate ${numberOfQuestions} multiple-choice questions that test understanding of these concepts.

// Requirements for each question:
// 1. Question text should be clear and test understanding
// 2. Provide 4 answer options (A, B, C, D)
// 3. Only ONE correct answer per question
// 4. Include a friendly explanation with 🐻 emoji
// 5. Make questions progressively harder

// Example of a good question:
// {
//   "text": "What is the correct way to say 'I speak Finnish'?",
//   "type": "multiple_choice",
//   "options": ["Minä puhun suomea", "Minä puhut suomea", "Minä puhuu suomea", "Minä puhuvat suomea"],
//   "correctAnswer": "Minä puhun suomea",
//   "explanation": "Correct! 'Minä' takes the -n ending. Great job! 🐻",
//   "points": 1
// }

// Return in this exact JSON format:
// {
//   "title": "Fun and engaging quiz title with 🐻 emoji",
//   "description": "Encouraging description of what this quiz covers",
//   "passingScore": 70,
//   "questions": [
//     {
//       "text": "Question text here",
//       "type": "multiple_choice",
//       "options": ["Option A", "Option B", "Option C", "Option D"],
//       "correctAnswer": "Correct option text",
//       "explanation": "Friendly explanation with 🐻 emoji",
//       "points": 1
//     }
//   ]
// }`;

//   try {
//     const quiz = await callGroqJSON<AIQuiz>(prompt, systemPrompt);
//     if (quiz && quiz.questions && quiz.questions.length > 0) {
//       // Ensure all questions are multiple choice
//       quiz.questions = quiz.questions.map((q) => ({
//         ...q,
//         type: "multiple_choice",
//         options: q.options || ["Option A", "Option B", "Option C", "Option D"],
//       }));
//       return quiz;
//     }
//     return generateFallbackQuiz(
//       topicTitle,
//       topicDescription,
//       grammarRules,
//       level,
//       numberOfQuestions,
//     );
//   } catch (error) {
//     console.error("AI Quiz generation failed, using fallback:", error);
//     return generateFallbackQuiz(
//       topicTitle,
//       topicDescription,
//       grammarRules,
//       level,
//       numberOfQuestions,
//     );
//   }
// }

// export async function regenerateQuiz(
//   topicTitle: string,
//   level: string,
//   previousScore: number,
//   weakAreas?: string[],
// ): Promise<AIQuiz | null> {
//   // Check if Groq API key is available
//   if (
//     !process.env.GROQ_API_KEY ||
//     process.env.GROQ_API_KEY === "dummy_key_for_now"
//   ) {
//     console.log("No valid GROQ_API_KEY found, using fallback quiz generator");
//     return generateFallbackQuiz(
//       topicTitle,
//       "",
//       [],
//       level,
//       previousScore < 50 ? 8 : 10,
//     );
//   }

//   const weakAreasText =
//     weakAreas && weakAreas.length > 0
//       ? `The student struggled with: ${weakAreas.join(", ")}. Focus on these areas.`
//       : "Create a fresh quiz with different questions.";

//   const prompt = `Generate a NEW practice quiz for ${level} level Finnish student on "${topicTitle}".

// ${weakAreasText}

// Previous score: ${previousScore}%

// Create ${previousScore < 50 ? 8 : 10} multiple choice questions that:
// 1. Target areas that need improvement
// 2. Are slightly easier if the student scored low
// 3. Are more challenging if they scored high
// 4. Include encouraging feedback

// Return in same JSON format with title, description, passingScore, and questions array.
// All questions must be multiple choice with 4 options.`;

//   try {
//     const quiz = await callGroqJSON<AIQuiz>(
//       prompt,
//       "You are Otso the bear, creating personalized quizzes. Return ONLY valid JSON. All questions must be multiple choice.",
//     );
//     if (quiz && quiz.questions && quiz.questions.length > 0) {
//       quiz.questions = quiz.questions.map((q) => ({
//         ...q,
//         type: "multiple_choice",
//         options: q.options || ["Option A", "Option B", "Option C", "Option D"],
//       }));
//       return quiz;
//     }
//     return generateFallbackQuiz(
//       topicTitle,
//       "",
//       [],
//       level,
//       previousScore < 50 ? 8 : 10,
//     );
//   } catch (error) {
//     console.error("Quiz regeneration failed, using fallback:", error);
//     return generateFallbackQuiz(
//       topicTitle,
//       "",
//       [],
//       level,
//       previousScore < 50 ? 8 : 10,
//     );
//   }
// }

// // Helper function to check answers and calculate score
// export interface QuizResult {
//   score: number;
//   totalPoints: number;
//   percentage: number;
//   passed: boolean;
//   results: Array<{
//     questionId: number;
//     userAnswer: string;
//     isCorrect: boolean;
//     correctAnswer: string;
//     explanation: string;
//   }>;
// }

// export function checkQuizAnswers(
//   questions: AIQuestion[],
//   userAnswers: Record<string, string>,
// ): QuizResult {
//   const results: QuizResult["results"] = [];
//   let totalPoints = 0;
//   let earnedPoints = 0;

//   questions.forEach((question, idx) => {
//     const userAnswer = userAnswers[`q_${idx}`] || "";
//     const isCorrect =
//       userAnswer.toLowerCase().trim() ===
//       question.correctAnswer.toLowerCase().trim();
//     const points = question.points || 1;

//     totalPoints += points;
//     if (isCorrect) earnedPoints += points;

//     results.push({
//       questionId: idx,
//       userAnswer,
//       isCorrect,
//       correctAnswer: question.correctAnswer,
//       explanation: question.explanation,
//     });
//   });

//   const percentage = Math.round((earnedPoints / totalPoints) * 100);
//   const passed = percentage >= 70;

//   return {
//     score: earnedPoints,
//     totalPoints,
//     percentage,
//     passed,
//     results,
//   };
// }
// src/lib/ai/quiz-generator.ts
import { callGroqJSON } from "./groq-client";

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
  // Check if Groq API key is available
  if (
    !process.env.GROQ_API_KEY ||
    process.env.GROQ_API_KEY === "dummy_key_for_now"
  ) {
    console.log("No valid GROQ_API_KEY found, using fallback quiz generator");
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
    const quiz = await callGroqJSON<AIQuiz>(prompt, systemPrompt);
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
    !process.env.GROQ_API_KEY ||
    process.env.GROQ_API_KEY === "dummy_key_for_now"
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
    const quiz = await callGroqJSON<AIQuiz>(
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
