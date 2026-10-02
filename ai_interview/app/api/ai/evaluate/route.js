import { NextResponse } from "next/server";
import { aiClient, model, parseJson } from "@/lib/server-ai";

const SUPA="https://tprodidywabvkimvdgzi.supabase.co";
const KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwcm9kaWR5d2FidmtpbXZkZ3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3Nzc2NzMsImV4cCI6MjEwNjM1MzY3M30.BvJR1f3LGhz-0Zr57SKhk-ggl86e96LrUubvKQnm1H4";
async function rpc(name,body){
  const r=await fetch(SUPA+"/rest/v1/rpc/"+name,{method:"POST",headers:{apikey:KEY,Authorization:"Bearer "+KEY,"Content-Type":"application/json"},body:JSON.stringify(body)});
  const t=await r.text(); let j;try{j=JSON.parse(t)}catch{j=t} if(!r.ok) throw new Error(j?.message||t);return j;
}
export async function POST(req){
  try{
    const {token,sessionId,transcript,codingAnswer,codingLanguage,durationSeconds}=await req.json();
    const interview=await rpc("public_get_interview",{p_token:token});
    const session=await rpc("candidate_get_session",{p_token:token,p_session_id:sessionId});
    if(!interview||!session) throw new Error("Invalid interview session");
    const prompt=`You are a rigorous interview evaluator. Score only evidence present in the candidate answers. Do not infer protected traits or personality.
ROLE: ${interview.title}
JOB DESCRIPTION: ${interview.jobDescription}
CV PROFILE: ${JSON.stringify(session.cvProfile||{})}
QUESTIONS: ${JSON.stringify(interview.questions||[])}
TRANSCRIPT: ${JSON.stringify(transcript||[])}
CODING ANSWER: ${codingAnswer||""}
CODING LANGUAGE: ${codingLanguage||""}

Return JSON only:
{
 "overallScore":0-100,
 "codingScore":0-100 or null,
 "scoreBreakdown":{"Technical":0-100,"Communication":0-100,"Problem Solving":0-100,"Experience":0-100},
 "questionScores":[{"questionId":"uuid","question":"text","category":"text","answer":"candidate answer","score":number,"maxScore":number,"reasoning":"brief evidence-based reason","strengths":["..."],"gaps":["..."]}],
 "summary":"concise recruiter summary",
 "strengths":["..."],
 "gaps":["..."],
 "followUpTopics":["..."]
}
Keep question score within its maxScore. Weight overall score by maxScore. Do not recommend hiring or rejecting; provide evidence and scores only.`;
    const completion=await aiClient().chat.completions.create({model:model(),messages:[{role:"user",content:prompt}],temperature:0.1});
    const evaluation=parseJson(completion.choices?.[0]?.message?.content||"{}");
    await rpc("candidate_complete_session",{p_token:token,p_session_id:sessionId,p_duration_seconds:Number(durationSeconds||0),p_transcript:transcript||[],p_evaluation:evaluation,p_coding_answer:codingAnswer||null,p_coding_language:codingLanguage||null});
    return NextResponse.json({ok:true,evaluation});
  }catch(e){return NextResponse.json({error:e.message||"Evaluation failed"},{status:500})}
}
