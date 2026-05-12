// // src/app/api/ai/generate-quiz/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { generateAIQuiz, regenerateQuiz } from "@/lib/ai/quiz-generator";
// import { prisma } from "@/lib/db/prisma";
// import { authOptions } from "@/lib/auth";

// export async function POST(req: NextRequest) {
//   try {
//     // FIX: Use authOptions to ensure session is captured
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { topicId, regenerate, previousScore, weakAreas } = await req.json();

//     // Fetch topic details from database
//     const topic = await prisma.topic.findUnique({
//       where: { id: topicId },
//       include: {
//         grammarRules: true,
//         level: true,
//       },
//     });

//     if (!topic) {
//       return NextResponse.json({ error: "Topic not found" }, { status: 404 });
//     }

//     // Extract grammar rules as strings
//     const grammarRules = topic.grammarRules.map(
//       (rule) => `${rule.title}: ${rule.explanation}`,
//     );

//     let quiz;
//     if (regenerate && previousScore !== undefined) {
//       // Generate personalized quiz based on previous performance
//       quiz = await regenerateQuiz(
//         topic.title,
//         topic.level.name,
//         previousScore,
//         weakAreas,
//       );
//     } else {
//       // Generate fresh quiz
//       quiz = await generateAIQuiz(
//         topic.title,
//         topic.description,
//         grammarRules,
//         topic.level.name,
//         10,
//       );
//     }

//     if (!quiz) {
//       return NextResponse.json(
//         { error: "Failed to generate quiz. Please try again." },
//         { status: 500 },
//       );
//     }

//     // Create a dynamic quiz record (not saved permanently, just for this session)
//     const dynamicQuiz = {
//       id: `dynamic_${Date.now()}`,
//       title: quiz.title,
//       description: quiz.description,
//       passingScore: quiz.passingScore,
//       isDynamic: true,
//       questions: quiz.questions.map((q, idx) => ({
//         id: `q_${idx}`,
//         text: q.text,
//         type: q.type.toUpperCase(),
//         options: q.options ? JSON.stringify(q.options) : null,
//         correctAnswer: q.correctAnswer,
//         explanation: q.explanation,
//         points: q.points,
//         order: idx,
//       })),
//     };

//     return NextResponse.json(dynamicQuiz);
//   } catch (error) {
//     console.error("Quiz generation error:", error);
//     return NextResponse.json(
//       { error: "Failed to generate quiz. Please try again." },
//       { status: 500 },
//     );
//   }
// }
// src/app/api/ai/generate-quiz/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { generateAIQuiz, regenerateQuiz } from "@/lib/ai/quiz-generator";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topicId, regenerate, previousScore, weakAreas } = await req.json();

    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        grammarRules: true,
        level: true,
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const grammarRules = topic.grammarRules.map(
      (rule) => `${rule.title}: ${rule.explanation}`,
    );

    let quiz;
    if (regenerate && previousScore !== undefined) {
      quiz = await regenerateQuiz(
        topic.title,
        topic.level.name,
        previousScore,
        weakAreas,
      );
    } else {
      quiz = await generateAIQuiz(
        topic.title,
        topic.description,
        grammarRules,
        topic.level.name,
        10,
      );
    }

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      // Return fallback quiz if generation failed
      const fallbackQuiz = {
        id: `fallback_${Date.now()}`,
        title: `${topic.title} - Quiz`,
        description: `Test your knowledge of ${topic.title.toLowerCase()}.`,
        passingScore: 70,
        isDynamic: true,
        questions: [
          {
            id: "q_0",
            text: `What is important when learning "${topic.title}"?`,
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
            points: 1,
            order: 0,
          },
          {
            id: "q_1",
            text: `How can you improve your understanding of ${topic.title}?`,
            type: "multiple_choice",
            options: [
              "Study a little every day",
              "Study once a month",
              "Never review",
              "Only take quizzes",
            ],
            correctAnswer: "Study a little every day",
            explanation:
              "Daily practice helps reinforce what you've learned! 📚",
            points: 1,
            order: 1,
          },
          {
            id: "q_2",
            text: `What should you do if you don't understand ${topic.title}?`,
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
            points: 1,
            order: 2,
          },
        ],
      };
      return NextResponse.json(fallbackQuiz);
    }

    const dynamicQuiz = {
      id: `dynamic_${Date.now()}`,
      title: quiz.title,
      description: quiz.description,
      passingScore: quiz.passingScore,
      isDynamic: true,
      questions: quiz.questions.map((q, idx) => ({
        id: `q_${idx}`,
        text: q.text,
        type: q.type.toLowerCase(),
        options: q.options ? q.options : null,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: q.points,
        order: idx,
      })),
    };

    return NextResponse.json(dynamicQuiz);
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz. Please try again." },
      { status: 500 },
    );
  }
}
