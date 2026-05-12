// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🐻 Seeding Finnish Buddy database...");

  // Create levels
  const levels = await prisma.level.createMany({
    data: [
      {
        name: "A1",
        title: "Beginner",
        description: "Survive simple daily situations",
        order: 1,
        color: "#48bb78",
      },
      {
        name: "A2",
        title: "Elementary",
        description: "Simple descriptions and routines",
        order: 2,
        color: "#4299e1",
      },
      {
        name: "B1",
        title: "Intermediate",
        description: "Handle everyday situations & express opinions",
        order: 3,
        color: "#ed8936",
      },
      {
        name: "B2",
        title: "Upper Intermediate",
        description: "Nuance, fluency, and complex structures",
        order: 4,
        color: "#9f7aea",
      },
      {
        name: "C1",
        title: "Advanced",
        description: "Precise expression & stylistic variation",
        order: 5,
        color: "#f56565",
      },
      {
        name: "C2",
        title: "Proficient",
        description: "Mastery, archaic forms, and creative language use",
        order: 6,
        color: "#ed64a6",
      },
    ],
  });

  console.log("✓ Levels created");

  const a1 = await prisma.level.findUnique({ where: { name: "A1" } });

  if (a1) {
    // Create A1 topics
    const topics = await prisma.topic.createMany({
      data: [
        {
          title: "Personal Pronouns",
          description: "Learn minä, sinä, hän, me, te, he",
          levelId: a1.id,
          order: 1,
        },
        {
          title: "Verb Type 1 Conjugation",
          description: "Basic conjugation: puhua → minä puhun",
          levelId: a1.id,
          order: 2,
        },
        {
          title: "Present Tense",
          description: "Positive & negative forms",
          levelId: a1.id,
          order: 3,
        },
        {
          title: "Question Formation",
          description: "Ask questions with -ko/-kö suffix",
          levelId: a1.id,
          order: 4,
        },
        {
          title: "Consonant Gradation",
          description: "kk→k, pp→p, tt→t changes",
          levelId: a1.id,
          order: 5,
        },
        {
          title: "Partitive Case",
          description: "UNcountable, Negative, Ongoing",
          levelId: a1.id,
          order: 6,
        },
        {
          title: "Genitive Case",
          description: "Show possession with -n ending",
          levelId: a1.id,
          order: 7,
        },
        {
          title: "Location Cases: Inessive & Elative",
          description: "In and out of places",
          levelId: a1.id,
          order: 8,
        },
        {
          title: "Location Cases: Illative & Adessive",
          description: "Into and onto places",
          levelId: a1.id,
          order: 9,
        },
        {
          title: "Location Cases: Ablative & Allative",
          description: "Off and onto surfaces",
          levelId: a1.id,
          order: 10,
        },
        {
          title: "Essive Case & Postpositions",
          description: "Temporary state and location words",
          levelId: a1.id,
          order: 11,
        },
        {
          title: "Numbers & Word Order",
          description: "Count 1-100 and basic sentence structure",
          levelId: a1.id,
          order: 12,
        },
      ],
    });

    console.log("✓ A1 topics created");
  }

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
