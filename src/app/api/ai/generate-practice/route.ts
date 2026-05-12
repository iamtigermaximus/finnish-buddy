// src/app/api/ai/generate-practice/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { generatePracticeExercises } from "@/lib/ai/grammar-helper";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topicId, numberOfExercises } = await req.json();

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

    const exercises = await generatePracticeExercises(
      topic.title,
      grammarRules,
      topic.level.name,
      numberOfExercises || 3,
    );

    return NextResponse.json({ exercises });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate practice exercises" },
      { status: 500 },
    );
  }
}
