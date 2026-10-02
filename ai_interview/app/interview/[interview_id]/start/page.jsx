"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { publicRpc, SUPABASE_URL } from "@/lib/supabase-rest";
import { Code2, Loader2, Mic, MicOff, Send, Timer } from "lucide-react";
import { toast } from "sonner";

export default function InterviewRoom(){
  const {interview_id:token}=useParams(); const router=useRouter();
  const [interview,setInterview]=useState(null); const [session,setSession]=useState(null); const [idx,setIdx]=useState(0); const [answer,setAnswer]=useState(""); const [transcript,setTranscript]=useState([]); const [remaining,setRemaining]=useState(0); const [listening,setListening]=useState(false); const [codingAnswer,setCodingAnswer]=useState(""); const [codingLanguage,setCodingLanguage]=useState("javascript"); const [busy,setBusy]=useState(false); const recognitionRef=useRef(null); const startedRef=useRef(Date.now());
  const questions=interview?.questions||[]; const current=questions[idx];
  const displayTime=useMemo(()=>String(Math.floor(remaining/60)).padStart(2,"0")+":"+String(remaining%60).padStart(2,"0"),[remaining]);

  useEffect(()=>{(async()=>{try{const sessionId=localStorage.getItem("interview_session_"+token);if(!sessionId) throw new Error("Start from the interview link."); const [i,s]=await Promise.all([publicRpc("public_get_interview",{p_token:token}),publicRpc("candidate_get_session",{p_token:token,p_session_id:sessionId})]);if(!i||!s)throw new Error("Invalid interview session");setInterview(i);setSession({...s,id:sessionId});setRemaining(Number(i.durationMinutes)*60);startedRef.current=Date.now();}catch(e){toast.error(e.message);router.replace("/interview/"+token)}})()},[token]);
  useEffect(()=>{if(!interview)return;const t=setInterval(()=>setRemaining(r=>{if(r<=1){clearInterval(t);finish(true);return 0}return r-1}),1000);return()=>clearInterval(t)},[interview,transcript,codingAnswer]);
  useEffect(()=>{if(current&&!current.isCoding)speak(current.question)},[idx,interview]);
  function speak(text){ if(typeof window==="undefined"||!window.speechSynthesis)return; window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text);u.rate=0.96;window.speechSynthesis.speak(u); }
  function toggleMic(){
    if(listening){recognitionRef.current?.stop();setListening(false);return}
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){toast.error("Speech recognition is not supported in this browser. Type your answer instead.");return}
    const r=new SR();r.continuous=true;r.interimResults=true;r.lang="en-IN";r.onresult=e=>{let text="";for(let i=0;i<e.results.length;i++)text+=e.results[i][0].transcript+" ";setAnswer(text.trim())};r.onend=()=>setListening(false);r.onerror=()=>setListening(false);recognitionRef.current=r;r.start();setListening(true);
  }
  async function next(){
    if(!current)return;
    if(current.isCoding){if(!codingAnswer.trim()){toast.error("Add your coding answer.");return}}else if(!answer.trim()){toast.error("Answer the question before continuing.");return}
    const entry={questionId:current.id,question:current.question,category:current.category,answer:current.isCoding?codingAnswer:answer,isCoding:Boolean(current.isCoding),at:new Date().toISOString()};
    const nextTranscript=[...transcript,entry];setTranscript(nextTranscript);setAnswer("");recognitionRef.current?.stop();setListening(false);
    if(idx>=questions.length-1) await finish(false,nextTranscript); else setIdx(i=>i+1);
  }
  async function finish(auto=false,finalTranscript=transcript){
    if(busy||!session)return;setBusy(true);window.speechSynthesis?.cancel();recognitionRef.current?.stop();
    try{
      const durationSeconds=Math.floor((Date.now()-startedRef.current)/1000);
      const r=await fetch(SUPABASE_URL+"/functions/v1/interview-ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"evaluate",token,sessionId:session.id,transcript:finalTranscript,codingAnswer,codingLanguage,durationSeconds})});
      const j=await r.json();if(!r.ok)throw new Error(j.error||"Evaluation failed");router.replace("/interview/"+token+"/completed");
    }catch(e){toast.error(e.message);setBusy(false)}
  }
  if(!interview||!session)return <main className="grid min-h-screen place-items-center"><Loader2 className="animate-spin"/></main>;
  return <main className="min-h-screen px-5 py-6">
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[.04] px-5 py-4"><div><p className="text-sm text-slate-400">{interview.title}</p><h1 className="font-black">AI Interview Room</h1></div><div className={"flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-lg "+(remaining<60?"bg-red-500/15 text-red-300":"bg-white/5")}><Timer size={18}/>{displayTime}</div></header>
      <div className="mt-5 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <aside className="rounded-3xl border border-white/10 bg-gradient-to-b from-blue-500/15 to-white/[.03] p-6 text-center"><div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-blue-500 text-3xl font-black shadow-[0_0_70px_rgba(59,130,246,.35)]">AI</div><h2 className="mt-5 text-xl font-black">AI Interviewer</h2><p className="mt-2 text-sm leading-6 text-slate-400">Question {idx+1} of {questions.length}. Answers are evaluated only against the role, question and evidence you provide.</p><button onClick={()=>speak(current?.question||"")} className="mt-5 rounded-xl border border-white/10 px-4 py-2 text-sm">Repeat question</button></aside>
        <section className="rounded-3xl border border-white/10 bg-white/[.04] p-6">
          <div className="flex items-center gap-2 text-sm font-bold text-blue-400">{current?.isCoding?<Code2 size={17}/>:<Mic size={17}/>} {current?.category||"Question"}</div>
          <h2 className="mt-3 text-2xl font-black leading-9">{current?.question}</h2>
          {current?.isCoding?<div className="mt-6"><select value={codingLanguage} onChange={e=>setCodingLanguage(e.target.value)} className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm">{["javascript","python","java","c++","sql","other"].map(x=><option key={x}>{x}</option>)}</select><textarea value={codingAnswer} onChange={e=>setCodingAnswer(e.target.value)} rows={14} spellCheck={false} placeholder="Write your solution and explain key decisions..." className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-4 font-mono text-sm"/></div>:<div className="mt-6"><textarea value={answer} onChange={e=>setAnswer(e.target.value)} rows={9} placeholder="Speak or type your answer..." className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-4"/><button onClick={toggleMic} className={"mt-3 flex items-center gap-2 rounded-xl px-4 py-2 font-bold "+(listening?"bg-red-500":"bg-blue-500")}>{listening?<><MicOff size={18}/> Stop listening</>:<><Mic size={18}/> Speak answer</>}</button></div>}
          <div className="mt-6 flex items-center justify-between"><span className="text-xs text-slate-500">Max score: {current?.maxScore||10}</span><button onClick={next} disabled={busy} className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-slate-950 disabled:opacity-50">{busy?"Evaluating...":idx===questions.length-1?"Complete interview":"Submit & next"}<Send size={17}/></button></div>
        </section>
      </div>
    </div>
  </main>
}
