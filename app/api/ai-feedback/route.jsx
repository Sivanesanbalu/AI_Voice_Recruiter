import { FEEDBACK_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const { conversation } = await req.json();

    let convoData;
    try {
      convoData = JSON.parse(conversation);
    } catch {
      convoData = conversation;
    }

    const FINAL_PROMPT = FEEDBACK_PROMPT.replace('{{conversation}}', JSON.stringify(convoData));

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'google/gemma-3n-e2b-it:free',
      messages: [
        {
          role: 'user',
          content: FINAL_PROMPT,
        },
      ],
    });

    let messageContent = completion.choices[0].message.content;

    const jsonString = messageContent
      .replace(/```(?:json)?\s*/gi, '')
      .replace(/```/g, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (jsonError) {
      console.error("JSON parsing failed. Raw content:\n", jsonString);
      throw new Error("Failed to parse JSON from AI response");
    }

    return NextResponse.json(parsed); // ✅ Correct format

  } catch (e) {
    console.error("Parsing or API error:", e);
    return NextResponse.json(
      { error: "Server error", details: e.message || String(e) },
      { status: 500 }
    );
  }
}
