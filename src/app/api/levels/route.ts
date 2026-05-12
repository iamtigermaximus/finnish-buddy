// src/app/api/levels/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth";

interface TopicProgress {
  completed: boolean;
  grammarViewed: boolean;
  examplesViewed: boolean;
  practiceCompleted: boolean;
  quizCompleted: boolean;
  quizScore: number | null;
}

interface TopicWithProgress {
  id: string;
  title: string;
  description: string;
  order: number;
  levelId: string;
  createdAt: Date;
  updatedAt: Date;
  grammarRules: unknown[];
  quizzes: unknown[];
  progress: TopicProgress[];
}

interface LevelWithTopics {
  id: string;
  name: string;
  title: string;
  description: string;
  order: number;
  color: string;
  createdAt: Date;
  topics: TopicWithProgress[];
}

interface TopicResponse {
  id: string;
  title: string;
  description: string;
  order: number;
  userProgress: TopicProgress | null;
  grammarRules: unknown[];
  quizzes: unknown[];
}

interface LevelResponse {
  id: string;
  name: string;
  title: string;
  description: string;
  order: number;
  color: string;
  createdAt: Date;
  progress: number;
  completedTopics: number;
  totalTopics: number;
  topics: TopicResponse[];
}

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const levelName = searchParams.get("level");

    const levels = (await prisma.level.findMany({
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
    })) as LevelWithTopics[];

    const levelsWithProgress: LevelResponse[] = levels.map((level) => {
      const topics = level.topics;

      const completedTopics = topics.filter((topic) => {
        return (
          topic.progress &&
          topic.progress.length > 0 &&
          topic.progress[0].completed
        );
      }).length;

      const progressPercentage =
        topics.length > 0
          ? Math.round((completedTopics / topics.length) * 100)
          : 0;

      const transformedTopics: TopicResponse[] = topics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        order: topic.order,
        userProgress:
          topic.progress && topic.progress.length > 0
            ? topic.progress[0]
            : null,
        grammarRules: topic.grammarRules,
        quizzes: topic.quizzes,
      }));

      return {
        id: level.id,
        name: level.name,
        title: level.title,
        description: level.description,
        order: level.order,
        color: level.color,
        createdAt: level.createdAt,
        progress: progressPercentage,
        completedTopics,
        totalTopics: topics.length,
        topics: transformedTopics,
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
