import { NextResponse } from "next/server";
import { aiClient, model, parseJson } from "@/lib/server-ai";

export async function POST(req){
  try{
    const {filename,mimeType,fileData}=await req.json();
    if(!fileData) return NextResponse.json({profile:{}});
    const prompt="Analyze this candidate CV for interview context. Return JSON only with keys summary, skills (array), experienceHighlights (array), education (array), projects (array), strengthsToProbe (array), claimsToVerify (array). Do not invent facts.";
    let content;
    if(mimeType==="text/plain"){
      const text=Buffer.from(fileData.split(",").pop(),"base64").toString("utf8").slice(0,30000);
      content=[{type:"text",text:prompt+"\n\nCV TEXT:\n"+text}];
    } else {
      content=[{type:"text",text:prompt},{type:"file",file:{filename:filename||"resume.pdf",file_data:fileData}}];
    }
    const completion=await aiClient().chat.completions.create({model:model(),messages:[{role:"user",content}],temperature:0.2});
    return NextResponse.json({profile:parseJson(completion.choices?.[0]?.message?.content||"{}")});
  }catch(e){
    return NextResponse.json({profile:{summary:"CV uploaded successfully. Automated CV extraction was unavailable for this file format.",skills:[],experienceHighlights:[],projects:[],strengthsToProbe:[],claimsToVerify:[]},warning:e.message});
  }
}
