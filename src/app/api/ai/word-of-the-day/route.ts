// src/app/api/ai/word-of-the-day/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import OpenAI from "openai";
import { authOptions } from "@/lib/auth";

interface WordData {
  word: string;
  meaning: string;
  explanation: string;
  exampleFinnish: string;
  exampleEnglish: string;
  memoryTip: string;
  funFact: string;
  timeOfDay: string;
}

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

const cachedWords: Record<string, WordData> = {};
let cachedDate: string = "";

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

function getCurrentTimeSlot(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

function getTimeSlotEmoji(timeSlot: string): string {
  switch (timeSlot) {
    case "morning":
      return "🌅";
    case "afternoon":
      return "☀️";
    case "evening":
      return "🌙";
    default:
      return "🐻";
  }
}

function getTimeSlotGreeting(timeSlot: string): string {
  switch (timeSlot) {
    case "morning":
      return "Good morning!";
    case "afternoon":
      return "Good afternoon!";
    case "evening":
      return "Good evening!";
    default:
      return "Hei!";
  }
}

const fallbackWords: Record<string, WordData[]> = {
  morning: [
    {
      word: "aamiainen",
      meaning: "breakfast",
      explanation:
        "The first meal of the day. A very important word for morning conversations!",
      exampleFinnish: "Mitä söit aamiaiseksi?",
      exampleEnglish: "What did you have for breakfast?",
      memoryTip: "Sounds like 'ah-me-ai-nen' - ah, morning meal! 🥐",
      funFact:
        "Finns often eat a big breakfast including porridge or open sandwiches.",
      timeOfDay: "morning",
    },
    {
      word: "herätys",
      meaning: "wake-up / alarm",
      explanation: "The act of waking up or your alarm clock.",
      exampleFinnish: "Herätys on kuudelta.",
      exampleEnglish: "The alarm is at six.",
      memoryTip:
        "Think 'hair-rat-ys' - your hair is a mess when you wake up! ⏰",
      funFact:
        " 'Herätys' is also what you shout at a hotel for a wake-up call.",
      timeOfDay: "morning",
    },
  ],
  afternoon: [
    {
      word: "lounas",
      meaning: "lunch",
      explanation: "The midday meal. Essential vocabulary for lunch breaks!",
      exampleFinnish: "Lähdetäänkö lounaalle?",
      exampleEnglish: "Shall we go for lunch?",
      memoryTip: "Sounds like 'loo-nas' - loo break after lunch! 🍽️",
      funFact:
        "Many workplaces have a subsidized 'lounas' at a company cafeteria.",
      timeOfDay: "afternoon",
    },
    {
      word: "töissä",
      meaning: "at work",
      explanation: "Being at work or on the job.",
      exampleFinnish: "Olen töissä iltaan asti.",
      exampleEnglish: "I'm at work until evening.",
      memoryTip: "Think 'toys-sah' - work is not toys! 💼",
      funFact: " 'Töissä' is the inessive case of 'työ' (work).",
      timeOfDay: "afternoon",
    },
  ],
  evening: [
    {
      word: "telkkari",
      meaning: "television / TV",
      explanation:
        "Casual word for television, perfect for evening relaxation.",
      exampleFinnish: "Mitä telkkarista tulee illalla?",
      exampleEnglish: "What's on TV tonight?",
      memoryTip: "Think 'tell-carry' - the TV carries stories to tell you! 📺",
      funFact: "Finns love shortening words. 'Televisio' becomes 'telkkari'!",
      timeOfDay: "evening",
    },
    {
      word: "leffa",
      meaning: "movie / film",
      explanation: "Shortened form of 'elokuva', perfect for evening plans.",
      exampleFinnish: "Lähdetäänkö leffaan?",
      exampleEnglish: "Shall we go to the movies?",
      memoryTip: "Sounds like 'laugh-a' - movies make you laugh! 🎬",
      funFact: " 'Leffa' is spoken language - say 'elokuva' in formal writing.",
      timeOfDay: "evening",
    },
  ],
};

function getFallbackWord(timeSlot: string): WordData {
  const words = fallbackWords[timeSlot];
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = getTodayDate();
    const timeSlot = getCurrentTimeSlot();
    const cacheKey = `${today}-${timeSlot}`;

    if (cachedWords[cacheKey] && cachedDate === today) {
      return NextResponse.json(cachedWords[cacheKey]);
    }

    if (!deepseek) {
      const word = getFallbackWord(timeSlot);
      cachedWords[cacheKey] = word;
      cachedDate = today;
      return NextResponse.json(word);
    }

    const systemPrompt = `You are Otso, a friendly Finnish bear. Your task is to teach a Finnish word of the day.

Choose a word that fits the time of day: ${timeSlot} (${getTimeSlotGreeting(timeSlot)})
- For morning: breakfast, waking up, morning routines
- For afternoon: lunch, work, daily activities
- For evening: TV, movies, relaxation, dinner

Return ONLY valid JSON. No markdown. Use this exact format:
{
  "word": "the finnish word",
  "meaning": "English meaning/translation",
  "explanation": "A friendly, short explanation",
  "exampleFinnish": "Example sentence in Finnish",
  "exampleEnglish": "English translation",
  "memoryTip": "Creative way to remember this word",
  "funFact": "Interesting fact about this word",
  "timeOfDay": "${timeSlot}"
}`;

    const prompt = `Generate a Finnish word of the day for ${timeSlot} time.

Choose a word appropriate for ${getTimeSlotGreeting(timeSlot)}
Return ONLY valid JSON with the fields described.`;

    const completion = await deepseek.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      model: "deepseek-chat",
      temperature: 0.8,
      max_tokens: 800,
    });

    const response = completion.choices[0]?.message?.content || "";

    let wordData: WordData;
    try {
      let cleanResponse = response.trim();
      cleanResponse = cleanResponse.replace(/^```json\n?/i, "");
      cleanResponse = cleanResponse.replace(/^```\n?/, "");
      cleanResponse = cleanResponse.replace(/\n?```$/, "");

      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        wordData = JSON.parse(jsonMatch[0]) as WordData;
        wordData.timeOfDay = timeSlot;
      } else {
        wordData = getFallbackWord(timeSlot);
      }
    } catch (parseError) {
      console.error("Failed to parse AI response, using fallback");
      wordData = getFallbackWord(timeSlot);
    }

    cachedWords[cacheKey] = wordData;
    cachedDate = today;

    return NextResponse.json({
      ...wordData,
      timeSlot,
      timeSlotEmoji: getTimeSlotEmoji(timeSlot),
      greeting: getTimeSlotGreeting(timeSlot),
    });
  } catch (error) {
    console.error("Word of the day error:", error);
    const timeSlot = getCurrentTimeSlot();
    return NextResponse.json({
      ...getFallbackWord(timeSlot),
      timeSlot,
      timeSlotEmoji: getTimeSlotEmoji(timeSlot),
      greeting: getTimeSlotGreeting(timeSlot),
    });
  }
}
