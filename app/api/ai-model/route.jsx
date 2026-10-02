import { NextResponse } from "next/server";
import OpenAI from "openai";

export const QUESTION_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}

📝 Your task:
Analyze the job description to identify key responsibilities, required skills, and expected experience
Generate a list of interview questions depends on interview duration
Adjust the number and depth of questions to match the interview duration.
Ensure the questions match the tone and structure of a real-life {{type}} interview.
🌿 Format your response in JSON format with array list of questions
format: interviewQuestions=[
  {
    question:"",
    type:"Technical" | "Behavioral" | "Experience" | "Problem Solving" | "Leadership"
  },
  ...
]

🔴 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`;

export async function POST(req) {
  const { jobPosition, jobDescription, duration, type } = await req.json();

  const FINAL_PROMPT = QUESTION_PROMPT
    .replace('{{jobTitle}}', jobPosition)
    .replace('{{jobDescription}}', jobDescription)
    .replace('{{duration}}', duration)
    .replace('{{type}}', type);

  try {
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

    
    return NextResponse.json(parsed.interviewQuestions);
  } catch (e) {
    console.error("Parsing or API error:", e);
    return NextResponse.json({ error: "Server error", details: e.message || String(e) }, { status: 500 });
  }
}
