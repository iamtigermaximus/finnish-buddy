// // src/app/api/ai/generate-lesson/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { generateCompleteLesson } from "@/lib/ai/content-generator";
// import { authOptions } from "@/lib/auth";

// export async function POST(req: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { topicTitle, level, numberOfQuestions } = await req.json();

//     const lesson = await generateCompleteLesson(
//       topicTitle,
//       level,
//       numberOfQuestions || 10,
//     );

//     if (!lesson) {
//       return NextResponse.json(
//         { error: "Failed to generate lesson" },
//         { status: 500 },
//       );
//     }

//     return NextResponse.json(lesson);
//   } catch (error) {
//     console.error("Lesson generation error:", error);
//     return NextResponse.json(
//       { error: "Failed to generate lesson" },
//       { status: 500 },
//     );
//   }
// }
// src/app/api/ai/generate-lesson/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { generateCompleteLesson } from "@/lib/ai/content-generator";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topicTitle, level, numberOfQuestions } = await req.json();

    if (!topicTitle || !level) {
      return NextResponse.json(
        { error: "Missing topicTitle or level" },
        { status: 400 },
      );
    }

    const lesson = await generateCompleteLesson(
      topicTitle,
      level,
      numberOfQuestions || 10,
    );

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Lesson generation error:", error);

    // Return user-friendly error message
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate lesson";

    return NextResponse.json(
      {
        error: errorMessage,
        friendlyMessage:
          "🐻 Oops! Otso is having trouble creating your lesson right now. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
