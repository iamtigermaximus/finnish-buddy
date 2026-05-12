// src/app/api/levels/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    const { searchParams } = new URL(req.url);
    const levelName = searchParams.get("level");

    const levels = await prisma.level.findMany({
      where: levelName ? { name: levelName } : undefined,
      include: {
        topics: {
          orderBy: { order: "asc" },
          include: {
            grammarRules: {
              take: 1,
            },
            progress: session?.user?.id
              ? {
                  where: { userId: session.user.id },
                }
              : false,
            quizzes: {
              take: 1,
            },
          },
        },
      },
      orderBy: { order: "asc" },
    });

    // Calculate progress for each level
    const levelsWithProgress = levels.map((level) => {
      const topics = level.topics;
      const completedTopics = topics.filter(
        (topic) =>
          topic.progress &&
          topic.progress.length > 0 &&
          topic.progress[0].completed,
      ).length;

      const progressPercentage =
        topics.length > 0
          ? Math.round((completedTopics / topics.length) * 100)
          : 0;

      return {
        ...level,
        progress: progressPercentage,
        completedTopics,
        totalTopics: topics.length,
      };
    });

    return NextResponse.json(levelsWithProgress);
  } catch (error) {
    console.error("Error fetching levels:", error);
    return NextResponse.json(
      { error: "Failed to fetch levels" },
      { status: 500 },
    );
  }
}
