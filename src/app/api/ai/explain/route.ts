// src/app/api/ai/explain/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { explainGrammarWithAI } from "@/lib/ai/grammar-helper";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { grammarRuleId, question } = await req.json();

    // Fetch grammar rule from database
    const grammarRule = await prisma.grammarRule.findUnique({
      where: { id: grammarRuleId },
      include: {
        topic: {
          include: { level: true },
        },
      },
    });

    if (!grammarRule) {
      return NextResponse.json(
        { error: "Grammar rule not found" },
        { status: 404 },
      );
    }

    const explanation = await explainGrammarWithAI(
      `${grammarRule.title}: ${grammarRule.explanation}\nRules: ${grammarRule.rules}`,
      question,
      grammarRule.topic.level.name,
      grammarRule.topic.title,
    );

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("AI explanation error:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation. Please try again." },
      { status: 500 },
    );
  }
}
