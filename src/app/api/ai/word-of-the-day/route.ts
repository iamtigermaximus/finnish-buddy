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
  timeSlot: string;
  timeSlotEmoji: string;
  greeting: string;
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

function getCurrentTimeSlot(): {
  slot: string;
  emoji: string;
  greeting: string;
} {
  const hour = new Date().getHours();
  if (hour < 12) {
    return { slot: "morning", emoji: "🌅", greeting: "Good morning!" };
  }
  if (hour < 18) {
    return { slot: "afternoon", emoji: "☀️", greeting: "Good afternoon!" };
  }
  return { slot: "evening", emoji: "🌙", greeting: "Good evening!" };
}

const fallbackWords: WordData[] = [
  {
    word: "telkkari",
    meaning: "television / TV",
    explanation:
      "A casual Finnish word for television, commonly used in everyday speech.",
    exampleFinnish: "Mitä telkkarista tulee illalla?",
    exampleEnglish: "What's on TV tonight?",
    memoryTip: "Think 'tell-carry' - the TV carries stories to tell you! 📺",
    funFact: "Finns love shortening words. 'Televisio' becomes 'telkkari'!",
    timeOfDay: "evening",
    timeSlot: "evening",
    timeSlotEmoji: "🌙",
    greeting: "Good evening!",
  },
  {
    word: "aamiainen",
    meaning: "breakfast",
    explanation:
      "The first meal of the day. Very important in Finnish culture!",
    exampleFinnish: "Mitä söit aamiaiseksi?",
    exampleEnglish: "What did you have for breakfast?",
    memoryTip: "Sounds like 'ah-me-ai-nen' - ah, morning meal! 🥐",
    funFact:
      "Many Finns eat a hearty breakfast including porridge or rye bread.",
    timeOfDay: "morning",
    timeSlot: "morning",
    timeSlotEmoji: "🌅",
    greeting: "Good morning!",
  },
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
    timeSlot: "afternoon",
    timeSlotEmoji: "☀️",
    greeting: "Good afternoon!",
  },
  {
    word: "kaveri",
    meaning: "friend / buddy",
    explanation: "A common word for friend, more casual than 'ystävä'.",
    exampleFinnish: "Hän on mun kaveri.",
    exampleEnglish: "He/She is my friend.",
    memoryTip:
      "Sounds like 'cav-airy' - a friend you can have airy conversations with! 👫",
    funFact: " 'Kaveri' is used more often than 'ystävä' in spoken Finnish.",
    timeOfDay: "any",
    timeSlot: "morning",
    timeSlotEmoji: "🌅",
    greeting: "Good morning!",
  },
  {
    word: "kiire",
    meaning: "hurry / rush / busy",
    explanation:
      "A very common Finnish word used to express being busy or in a hurry.",
    exampleFinnish: "Minulla on kiire.",
    exampleEnglish: "I'm in a hurry / I'm busy.",
    memoryTip:
      "Sounds like 'keer-eh' - when you're in a hurry, you 'veer' quickly! ⏰",
    funFact: "Finns often say 'Ei kiirettä' (No hurry) to be polite.",
    timeOfDay: "any",
    timeSlot: "afternoon",
    timeSlotEmoji: "☀️",
    greeting: "Good afternoon!",
  },
  {
    word: "kiva",
    meaning: "nice / fun / cool",
    explanation:
      "An extremely common Finnish word meaning nice, enjoyable, or cool.",
    exampleFinnish: "Tämä on kiva paikka.",
    exampleEnglish: "This is a nice place.",
    memoryTip: "Sounds like 'kee-va' - keep saying it, it's a nice word! 😊",
    funFact: "You'll hear 'kiva' constantly in everyday Finnish conversation.",
    timeOfDay: "any",
    timeSlot: "evening",
    timeSlotEmoji: "🌙",
    greeting: "Good evening!",
  },
];

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = getTodayDate();
    const timeInfo = getCurrentTimeSlot();
    const cacheKey = `${today}-${timeInfo.slot}`;

    if (cachedWords[cacheKey] && cachedDate === today) {
      return NextResponse.json(cachedWords[cacheKey]);
    }

    if (!deepseek) {
      // Return random fallback word
      const randomIndex = Math.floor(Math.random() * fallbackWords.length);
      const word = {
        ...fallbackWords[randomIndex],
        timeSlot: timeInfo.slot,
        timeSlotEmoji: timeInfo.emoji,
        greeting: timeInfo.greeting,
      };
      cachedWords[cacheKey] = word;
      cachedDate = today;
      return NextResponse.json(word);
    }

    const systemPrompt = `You are Otso, a friendly Finnish bear. Your task is to teach a useful Finnish word of the day.

Choose ANY interesting, useful Finnish word that language learners would love to know. It can be:
- Common everyday words (like "kaveri" for friend, "kiire" for hurry)
- Fun slang words (like "telkkari" for TV, "leffa" for movie)
- Useful verbs or adjectives
- Cultural words
- Words that are hard to guess from English

The word does NOT need to be related to the time of day. It can be ANY word at ANY time.

Return ONLY valid JSON. No markdown. Use this exact format:
{
  "word": "the finnish word",
  "meaning": "English meaning/translation",
  "explanation": "A friendly, short explanation of what this word means and when to use it",
  "exampleFinnish": "Example sentence in Finnish using the word",
  "exampleEnglish": "English translation of the example",
  "memoryTip": "A creative way to remember this word",
  "funFact": "An interesting fact about this word or Finnish culture"
}

The tone should be warm and friendly, like Otso is speaking directly to the learner.`;

    const prompt = `Generate a Finnish word of the day for language learners.

Choose a word that is:
- Useful in everyday conversation
- Appropriate for beginner/intermediate learners
- Interesting or fun to learn
- Can be a common word, slang, expression, or useful vocabulary

Do NOT limit yourself to time-of-day words. ANY Finnish word is fine!

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
        wordData.timeSlot = timeInfo.slot;
        wordData.timeSlotEmoji = timeInfo.emoji;
        wordData.greeting = timeInfo.greeting;
      } else {
        const randomIndex = Math.floor(Math.random() * fallbackWords.length);
        wordData = {
          ...fallbackWords[randomIndex],
          timeSlot: timeInfo.slot,
          timeSlotEmoji: timeInfo.emoji,
          greeting: timeInfo.greeting,
        };
      }
    } catch (parseError) {
      console.error("Failed to parse AI response, using fallback");
      const randomIndex = Math.floor(Math.random() * fallbackWords.length);
      wordData = {
        ...fallbackWords[randomIndex],
        timeSlot: timeInfo.slot,
        timeSlotEmoji: timeInfo.emoji,
        greeting: timeInfo.greeting,
      };
    }

    cachedWords[cacheKey] = wordData;
    cachedDate = today;

    return NextResponse.json(wordData);
  } catch (error) {
    console.error("Word of the day error:", error);
    const timeInfo = getCurrentTimeSlot();
    const randomIndex = Math.floor(Math.random() * fallbackWords.length);
    const wordData = {
      ...fallbackWords[randomIndex],
      timeSlot: timeInfo.slot,
      timeSlotEmoji: timeInfo.emoji,
      greeting: timeInfo.greeting,
    };
    return NextResponse.json(wordData);
  }
}
