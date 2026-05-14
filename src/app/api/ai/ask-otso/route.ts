// src/app/api/ai/ask-otso/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import OpenAI from "openai";
import { authOptions } from "@/lib/auth";

// Initialize DeepSeek only if API key exists
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

    const { question } = await req.json();

    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { error: "Please ask a question!" },
        { status: 400 },
      );
    }

    // If no API key, return a simple educational response (no error message)
    if (!deepseek) {
      return NextResponse.json({
        answer: `🐻 Hei ystävä! Let me help you with "${question}"

Here's what you need to know about Finnish grammar:

### Quick Tip
The best way to learn Finnish grammar is through consistent practice with real examples. 

### General Advice
- Start with basic sentence structure (Subject-Verb-Object)
- Learn the most common cases first: nominative, partitive, genitive
- Practice with everyday phrases

### Recommended Topics to Study
1. Personal pronouns (minä, sinä, hän, me, te, he)
2. Verb Type 1 conjugation (puhua → minä puhun)
3. Partitive case using the UNO method
4. Location cases (-ssa, -sta, -Vn, -lla, -lta, -lle)

Would you like to try a specific topic from our Ask Otso list? I'm here to help! 🐻`,
      });
    }

    const systemPrompt = `You are Otso, a friendly Finnish bear and expert Finnish language teacher.

Your personality:
- Warm, encouraging, and patient
- Use 🐻 emoji occasionally
- Keep responses clear and helpful

How to answer:
1. Start with a friendly greeting
2. Give a clear, direct answer first
3. Provide 2-3 examples with Finnish and English
4. Add a memory trick if applicable
5. End with encouragement

Use this format:
### Quick Answer
[Direct answer]

### Examples
**Finnish:** [sentence]
**English:** [translation]
**Explanation:** [what's happening]

### Memory Trick
[Simple tip]

Keep it friendly and educational!`;

    const userPrompt = `A Finnish learner asks: "${question}"

Answer as Otso the bear. Be helpful and clear. Include examples.`;

    const completion = await deepseek.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      model: "deepseek-chat",
      temperature: 0.7,
      max_tokens: 2000,
    });

    const answer =
      completion.choices[0]?.message?.content ||
      "🐻 Hmm, I'm not sure about that. Could you rephrase your question?";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Ask Otso error:", error);
    // Return a friendly fallback response, not an error message
    return NextResponse.json({
      answer: `🐻 I'm having a little trouble answering that right now. 

Please try asking in a different way, or choose a topic from the Ask Otso list. 

I'm here to help with:
- Grammar differences (mikä vs mitä, tai vs vai)
- Case usage (partitive, genitive, location cases)
- Verb conjugations and types
- Word order and sentence structure

What would you like to learn about? 🐻`,
    });
  }
}
