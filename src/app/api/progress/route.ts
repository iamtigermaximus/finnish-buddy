// // src/app/api/progress/route.ts
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { prisma } from "@/lib/db/prisma";

// interface UpdateData {
//   grammarViewed?: boolean;
//   examplesViewed?: boolean;
//   practiceCompleted?: boolean;
//   quizCompleted?: boolean;
//   completed?: boolean;
//   completedAt?: Date;
// }

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession();
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { topicId, step, completed } = await req.json();

//     // Get or create progress record
//     let progress = await prisma.progress.findFirst({
//       where: {
//         userId: session.user.id,
//         topicId: topicId,
//       },
//     });

//     if (!progress) {
//       progress = await prisma.progress.create({
//         data: {
//           userId: session.user.id,
//           topicId: topicId,
//         },
//       });
//     }

//     // Update specific step
//     const updateData: UpdateData = {};
//     switch (step) {
//       case "grammar":
//         updateData.grammarViewed = completed;
//         break;
//       case "examples":
//         updateData.examplesViewed = completed;
//         break;
//       case "practice":
//         updateData.practiceCompleted = completed;
//         break;
//       case "quiz":
//         updateData.quizCompleted = completed;
//         if (completed) {
//           updateData.completed = true;
//           updateData.completedAt = new Date();
//         }
//         break;
//     }

//     const updated = await prisma.progress.update({
//       where: { id: progress.id },
//       data: updateData,
//     });

//     return NextResponse.json(updated);
//   } catch (error) {
//     console.error("Error updating progress:", error);
//     return NextResponse.json(
//       { error: "Failed to update progress" },
//       { status: 500 },
//     );
//   }
// }

// export async function GET(req: Request) {
//   try {
//     const session = await getServerSession();
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const progress = await prisma.progress.findMany({
//       where: { userId: session.user.id },
//       include: {
//         topic: {
//           include: {
//             level: true,
//           },
//         },
//       },
//     });

//     // Return empty array if no progress, not an error
//     return NextResponse.json(progress || []);
//   } catch (error) {
//     console.error("Error fetching progress:", error);
//     // Return empty array instead of error
//     return NextResponse.json([]);
//   }
// }

// src/app/api/progress/route.ts
// src/app/api/progress/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth"; // We'll create this

export async function POST(req: Request) {
  try {
    // FIX: Pass the authOptions explicitly
    const session = await getServerSession(authOptions);

    console.log("Session in POST:", session?.user?.id);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topicId, step, completed, score } = await req.json();

    // Get or create progress record
    let progress = await prisma.progress.findFirst({
      where: {
        userId: session.user.id,
        topicId: topicId,
      },
    });

    if (!progress) {
      progress = await prisma.progress.create({
        data: {
          userId: session.user.id,
          topicId: topicId,
        },
      });
    }

    const updateData: Record<string, unknown> = {};

    switch (step) {
      case "grammar":
        updateData.grammarViewed = completed;
        break;
      case "examples":
        updateData.examplesViewed = completed;
        break;
      case "practice":
        updateData.practiceCompleted = completed;
        break;
      case "quiz":
        updateData.quizCompleted = completed;
        if (score !== undefined) {
          updateData.quizScore = score;
        }
        if (completed) {
          updateData.completed = true;
          updateData.completedAt = new Date();
        }
        break;
    }

    const updated = await prisma.progress.update({
      where: { id: progress.id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    // FIX: Pass the authOptions explicitly
    const session = await getServerSession(authOptions);

    console.log("Session in GET:", session?.user?.id);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const progress = await prisma.progress.findMany({
      where: { userId: session.user.id },
      include: {
        topic: {
          include: {
            level: true,
          },
        },
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json([]);
  }
}
