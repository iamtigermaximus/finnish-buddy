// src/app/api/progress/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";

interface UpdateData {
  grammarViewed?: boolean;
  examplesViewed?: boolean;
  practiceCompleted?: boolean;
  quizCompleted?: boolean;
  completed?: boolean;
  completedAt?: Date;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topicId, step, completed } = await req.json();

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

    // Update specific step
    const updateData: UpdateData = {};
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
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const progress = await prisma.progress.findMany({
      where: { userId: session.user.id },
      include: { topic: true },
    });

    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 },
    );
  }
}
