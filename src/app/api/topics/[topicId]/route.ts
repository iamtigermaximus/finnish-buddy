// src/app/api/topics/[topicId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ topicId: string }> },
) {
  try {
    const session = await getServerSession();
    const { topicId } = await params;

    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        level: true,
        grammarRules: {
          include: {
            examples: true,
          },
        },
        examples: true,
        memoryAid: true,
        vocabulary: true,
        quizzes: {
          include: {
            questions: {
              orderBy: { order: "asc" },
            },
          },
          where: {
            isDynamic: false,
          },
          take: 1,
        },
        progress: session?.user?.id
          ? {
              where: { userId: session.user.id },
            }
          : false,
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json(topic);
  } catch (error) {
    console.error("Error fetching topic:", error);
    return NextResponse.json(
      { error: "Failed to fetch topic" },
      { status: 500 },
    );
  }
}
