// src/app/api/ai/generate-situations/route.ts
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

    const { level = "A1", count = 4 } = await req.json();

    if (!deepseek) {
      return NextResponse.json({ situations: getFallbackSituations() });
    }

    const systemPrompt = `You are Otso, a friendly Finnish bear.
Generate ${count} real-life situational dialogues for ${level} level Finnish learners.

For each situation, provide:
- title: Short name (e.g., "At the Cafe")
- description: Brief description
- icon: Emoji (☕, 🛒, 🍽️, etc.)
- conversation: Array of 5-8 lines with speaker, finnish, english
- keyPhrases: Array of 4-6 useful phrases from the conversation
- tips: Practical tip for the situation

Return ONLY valid JSON in this format:
{
  "situations": [
    {
      "title": "At the Cafe",
      "description": "Ordering coffee and pastries",
      "icon": "☕",
      "conversation": [
        {"speaker": "Barista", "finnish": "Hei, mitä saisi olla?", "english": "Hello, what can I get you?"},
        {"speaker": "You", "finnish": "Yksi kahvi, kiitos.", "english": "One coffee, please."}
      ],
      "keyPhrases": ["Mitä saisi olla?", "Yksi kahvi, kiitos", "Paljonko se on?"],
      "tips": "Always say 'kiitos' when ordering. Finns appreciate politeness!"
    }
  ]
}`;

    const prompt = `Generate ${count} real-life situational dialogues for ${level} level Finnish learners.
Include common situations like: at a cafe, at a restaurant, shopping, meeting people, at the doctor, etc.
Make the dialogues natural and useful for everyday conversation.
Return ONLY valid JSON.`;

    const completion = await deepseek.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      model: "deepseek-chat",
      temperature: 0.9,
      max_tokens: 4000,
    });

    const response = completion.choices[0]?.message?.content || "";

    let cleanResponse = response.trim();
    cleanResponse = cleanResponse.replace(/^```json\n?/i, "");
    cleanResponse = cleanResponse.replace(/^```\n?/, "");
    cleanResponse = cleanResponse.replace(/\n?```$/, "");

    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return NextResponse.json({ situations: data.situations });
    }

    return NextResponse.json({ situations: getFallbackSituations() });
  } catch (error) {
    console.error("Generate situations error:", error);
    return NextResponse.json({ situations: getFallbackSituations() });
  }
}

function getFallbackSituations() {
  return [
    {
      title: "At the Cafe ☕",
      description: "Ordering coffee and pastries",
      icon: "☕",
      conversation: [
        {
          speaker: "Barista",
          finnish: "Hei, mitä saisi olla?",
          english: "Hello, what can I get you?",
        },
        {
          speaker: "You",
          finnish: "Yksi kahvi ja korvapuusti, kiitos.",
          english: "One coffee and a cinnamon roll, please.",
        },
        {
          speaker: "Barista",
          finnish: "Tässä on kahvisi. Haluatko maitoa?",
          english: "Here's your coffee. Do you want milk?",
        },
        {
          speaker: "You",
          finnish: "Kyllä, kiitos. Paljonko se on?",
          english: "Yes, please. How much is it?",
        },
        {
          speaker: "Barista",
          finnish: "Viisi euroa, kiitos.",
          english: "Five euros, thanks.",
        },
        {
          speaker: "You",
          finnish: "Kiitos! Hauskaa päivänjatkoa!",
          english: "Thanks! Have a nice day!",
        },
      ],
      keyPhrases: [
        "Mitä saisi olla?",
        "Yksi kahvi, kiitos",
        "Paljonko se on?",
        "Hauskaa päivänjatkoa",
      ],
      tips: "Finnish baristas appreciate politeness. Always say 'kiitos' when receiving something. Tipping is not expected but appreciated!",
    },
    {
      title: "At the Supermarket 🛒",
      description: "Buying groceries",
      icon: "🛒",
      conversation: [
        {
          speaker: "Cashier",
          finnish: "Hei, onko teillä kanta-asiakaskorttia?",
          english: "Hello, do you have a loyalty card?",
        },
        { speaker: "You", finnish: "Ei, ei ole.", english: "No, I don't." },
        {
          speaker: "Cashier",
          finnish: "Yhteensä 23 euroa ja 50 senttiä.",
          english: "Total 23 euros and 50 cents.",
        },
        {
          speaker: "You",
          finnish: "Tässä on 25 euroa.",
          english: "Here's 25 euros.",
        },
        {
          speaker: "Cashier",
          finnish: "Kiitos. Tässä on vaihtorahasi. Kuitti mukaan?",
          english: "Thanks. Here's your change. Receipt with you?",
        },
        {
          speaker: "You",
          finnish: "Ei kiitos. Hauskaa päivänjatkoa!",
          english: "No thanks. Have a nice day!",
        },
      ],
      keyPhrases: ["Onko teillä...?", "Yhteensä", "Tässä on", "Kuitti mukaan?"],
      tips: "Many stores ask if you have a loyalty card. 'Ei kiitos' is polite when declining.",
    },
    {
      title: "At the Restaurant 🍽️",
      description: "Ordering food and asking for the bill",
      icon: "🍽️",
      conversation: [
        {
          speaker: "Waiter",
          finnish: "Tervetuloa! Montako teitä on?",
          english: "Welcome! How many of you are there?",
        },
        {
          speaker: "You",
          finnish: "Kaksi, kiitos.",
          english: "Two, thank you.",
        },
        {
          speaker: "Waiter",
          finnish: "Mitä haluaisitte juoda?",
          english: "What would you like to drink?",
        },
        {
          speaker: "You",
          finnish: "Vettä, kiitos. Ja saisinko ruokalistan?",
          english: "Water, please. And could I have the menu?",
        },
        {
          speaker: "Waiter",
          finnish:
            "Tässä on ruokalista. Sanokaa kun olette valmiita tilaamaan.",
          english: "Here's the menu. Let me know when you're ready to order.",
        },
        {
          speaker: "You",
          finnish: "Saisinko laskun, kiitos?",
          english: "Could I have the bill, please?",
        },
      ],
      keyPhrases: [
        "Montako teitä on?",
        "Mitä haluaisitte?",
        "Saisinko laskun?",
        "Ruokalista",
      ],
      tips: "In Finnish restaurants, it's common to call the waiter by saying 'Anteeksi' (Excuse me). Tipping is not mandatory but rounding up is appreciated.",
    },
  ];
}
