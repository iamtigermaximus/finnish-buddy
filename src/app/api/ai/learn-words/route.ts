// src/app/api/ai/learn-words/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import OpenAI from "openai";
import { authOptions } from "@/lib/auth";

const deepseek =
  process.env.DEEPSEEK_API_KEY &&
  process.env.DEEPSEEK_API_KEY !== "dummy_key_for_now"
    ? new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: "https://api.deepseek.com",
        timeout: 30000,
        maxRetries: 2,
      })
    : null;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { level = "A1", count = 8 } = await req.json();

    if (!deepseek) {
      return NextResponse.json({ words: getFallbackWords(level, count) });
    }

    const systemPrompt = `You are Otso, a friendly Finnish bear.
Generate ${count} random Finnish vocabulary words for ${level} level learners.

IMPORTANT: For each word, based on its part of speech, provide DIFFERENT types of information:

- For VERBS: provide conjugation table (minä, sinä, hän, me, te, he)
- For NOUNS: provide case forms (nominative, genitive, partitive, inessive, elative, illative)
- For ADJECTIVES: provide comparative, superlative, and opposite
- For OTHER: provide example sentence and common phrase

Return ONLY valid JSON in this format:
{
  "words": [
    {
      "finnish": "word",
      "english": "translation",
      "level": "${level}",
      "partOfSpeech": "verb",
      "conjugation": {
        "minä": "form",
        "sinä": "form",
        "hän": "form",
        "me": "form",
        "te": "form",
        "he": "form"
      }
    }
  ]
}

Make the content useful and appropriate for ${level} level learners.`;

    const prompt = `Generate ${count} random Finnish vocabulary words for ${level} level learners.

For each word:
1. Choose a random part of speech (verb, noun, adjective, or other)
2. Based on the part of speech, provide appropriate grammatical information:
   - Verb: include conjugation table
   - Noun: include case forms (nominative, genitive, partitive, inessive, elative, illative)
   - Adjective: include comparative, superlative, and opposite
   - Other: include example sentence and common phrase

Return ONLY valid JSON.`;

    const completion = await deepseek.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      model: "deepseek-chat",
      temperature: 0.9,
      max_tokens: 3000,
    });

    const response = completion.choices[0]?.message?.content || "";

    let cleanResponse = response.trim();
    cleanResponse = cleanResponse.replace(/^```json\n?/i, "");
    cleanResponse = cleanResponse.replace(/^```\n?/, "");
    cleanResponse = cleanResponse.replace(/\n?```$/, "");

    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return NextResponse.json({ words: data.words });
    }

    return NextResponse.json({ words: getFallbackWords(level, count) });
  } catch (error) {
    console.error("Random words error:", error);
    return NextResponse.json({ words: getFallbackWords("A1", 8) });
  }
}

function getFallbackWords(level: string, count: number) {
  const allWords = [
    // Verbs
    {
      finnish: "puhua",
      english: "to speak",
      level: "A1",
      partOfSpeech: "verb",
      conjugation: {
        minä: "puhun",
        sinä: "puhut",
        hän: "puhuu",
        me: "puhumme",
        te: "puhutte",
        he: "puhuvat",
      },
    },
    {
      finnish: "asua",
      english: "to live",
      level: "A1",
      partOfSpeech: "verb",
      conjugation: {
        minä: "asun",
        sinä: "asut",
        hän: "asuu",
        me: "asumme",
        te: "asutte",
        he: "asuvat",
      },
    },
    // Nouns
    {
      finnish: "talo",
      english: "house",
      level: "A1",
      partOfSpeech: "noun",
      cases: {
        nominative: "talo",
        genitive: "talon",
        partitive: "taloa",
        inessive: "talossa",
        elative: "talosta",
        illative: "taloon",
      },
    },
    {
      finnish: "koira",
      english: "dog",
      level: "A1",
      partOfSpeech: "noun",
      cases: {
        nominative: "koira",
        genitive: "koiran",
        partitive: "koiraa",
        inessive: "koirassa",
        elative: "koirasta",
        illative: "koiraan",
      },
    },
    // Adjectives
    {
      finnish: "hyvä",
      english: "good",
      level: "A1",
      partOfSpeech: "adjective",
      comparative: "parempi",
      superlative: "paras",
      opposite: "huono",
    },
    {
      finnish: "iso",
      english: "big",
      level: "A1",
      partOfSpeech: "adjective",
      comparative: "isompi",
      superlative: "isoin",
      opposite: "pieni",
    },
    // Others with examples
    {
      finnish: "hei",
      english: "hello",
      level: "A1",
      partOfSpeech: "interjection",
      exampleSentence: "Hei, mitä kuuluu?",
      exampleTranslation: "Hello, how are you?",
      commonPhrase: "Hei hei! (Bye bye!)",
    },
    {
      finnish: "kiitos",
      english: "thank you",
      level: "A1",
      partOfSpeech: "interjection",
      exampleSentence: "Kiitos avusta!",
      exampleTranslation: "Thank you for the help!",
      commonPhrase: "Kiitos paljon (Thank you very much)",
    },
  ];

  const shuffled = [...allWords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
