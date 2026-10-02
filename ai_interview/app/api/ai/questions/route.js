import { NextResponse } from "next/server";
import { aiClient, model, parseJson, verifyRecruiter } from "@/lib/server-ai";

export async function POST(req){
  try{
    await verifyRecruiter(req);
    const {jobPosition,jobDescription,duration,types,codingEnabled}=await req.json();
    const count=Math.max(4,Math.min(14,Math.round(Number(duration||30)/4)));
    const prompt = `Create a structured interview plan as JSON only.
Role: ${jobPosition}
Job description: ${jobDescription}
Duration: ${duration} minutes
Interview categories: ${(types||[]).join(", ")}
Coding enabled: ${codingEnabled ? "yes" : "no"}

Return exactly {"questions":[...]}.
Each question item must have:
question:string,
category:string,
maxScore:number,
isCoding:boolean,
expectedSignals:string[],
rubric:{"excellent":string,"acceptable":string,"weak":string}

Generate about ${count} total questions. Questions must directly test the job description. Do not include coding questions unless coding is enabled. If coding is enabled, include 1-2 practical coding questions suited to this role, not generic trivia.`;
    const completion=await aiClient().chat.completions.create({model:model(),messages:[{role:"user",content:prompt}],temperature:0.3});
    const parsed=parseJson(completion.choices?.[0]?.message?.content||"{}");
    return NextResponse.json({questions:Array.isArray(parsed)?parsed:(parsed.questions||[])});
  }catch(e){return NextResponse.json({error:e.message||"Server error"},{status:/Unauthorized/.test(e.message)?401:500})}
}
