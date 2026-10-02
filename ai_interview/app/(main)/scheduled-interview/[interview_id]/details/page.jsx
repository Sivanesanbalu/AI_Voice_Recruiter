"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getToken, rest } from "@/lib/supabase-rest";
import { ArrowLeft, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Results(){
  const {interview_id:id}=useParams(); const [interview,setInterview]=useState(null); const [sessions,setSessions]=useState([]); const [scores,setScores]=useState({}); const [open,setOpen]=useState("");
  useEffect(()=>{(async()=>{try{
    if(!getToken()){location.href="/login";return}
    const ints=await rest("saas_interviews",{query:"select=*&id=eq."+id}); if(!ints?.[0]) throw new Error("Interview not found");setInterview(ints[0]);
    const ses=await rest("saas_sessions",{query:"select=*&interview_id=eq."+id+"&order=created_at.desc"});setSessions(ses||[]);
    if(ses?.length){const ids=ses.map(s=>s.id).join(",");const sc=await rest("saas_question_scores",{query:"select=*&session_id=in.("+ids+")&order=created_at.asc"});const grouped={};(sc||[]).forEach(x=>(grouped[x.session_id]??=[]).push(x));setScores(grouped)}
  }catch(e){toast.error(e.message)}})()},[id]);
  if(!interview)return <div className="grid min-h-[50vh] place-items-center"><Loader2 className="animate-spin"/></div>;
  return <div>
    <div className="flex items-start gap-4"><Link href="/dashboard" className="rounded-xl border border-white/10 p-2"><ArrowLeft size={18}/></Link><div><p className="text-sm text-blue-400">Interview results</p><h1 className="text-3xl font-black">{interview.title}</h1><p className="mt-2 text-slate-400">{sessions.length} candidate sessions · {interview.duration_minutes} min</p></div></div>
    <div className="mt-8 space-y-4">{!sessions.length&&<div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-slate-400">No candidates have started this interview yet.</div>}
    {sessions.map(s=>{const detail=scores[s.id]||[];const summary=s.ai_summary||{};return <div key={s.id} className="rounded-2xl border border-white/10 bg-white/[.04]">
      <button onClick={()=>setOpen(open===s.id?"":s.id)} className="flex w-full items-center justify-between gap-4 p-5 text-left"><div><div className="flex flex-wrap items-center gap-3"><h2 className="text-lg font-black">{s.candidate_name}</h2><span className={"rounded-full px-2 py-1 text-xs "+(s.status==="completed"?"bg-emerald-500/15 text-emerald-300":"bg-amber-500/15 text-amber-200")}>{s.status}</span></div><p className="mt-1 text-sm text-slate-400">{s.candidate_email}</p></div><div className="flex items-center gap-5"><div className="text-right"><p className="text-xs text-slate-500">Overall</p><p className="text-2xl font-black">{s.overall_score==null?"—":Math.round(Number(s.overall_score))+"%"}</p></div>{open===s.id?<ChevronUp/>:<ChevronDown/>}</div></button>
      {open===s.id&&<div className="border-t border-white/10 p-5">
        <div className="grid gap-3 md:grid-cols-4">{Object.entries(s.score_breakdown||{}).map(([k,v])=><div key={k} className="rounded-xl bg-white/5 p-4"><p className="text-xs text-slate-400">{k}</p><p className="mt-1 text-xl font-black">{Math.round(Number(v||0))}%</p></div>)}</div>
        {summary.summary&&<div className="mt-5 rounded-xl bg-blue-500/10 p-4"><p className="text-xs font-bold uppercase tracking-wider text-blue-300">AI evidence summary</p><p className="mt-2 leading-7 text-slate-300">{summary.summary}</p></div>}
        <h3 className="mt-6 font-black">Question scores</h3><div className="mt-3 space-y-3">{detail.map((q,n)=><div key={q.id} className="rounded-xl border border-white/10 p-4"><div className="flex justify-between gap-4"><b>Q{n+1}. {q.question_text}</b><span className="shrink-0 font-black text-blue-300">{Number(q.score)}/{Number(q.max_score)}</span></div><p className="mt-2 text-sm text-slate-400">Answer: {q.candidate_answer||"No answer captured"}</p>{q.reasoning&&<p className="mt-2 text-sm text-slate-300">{q.reasoning}</p>}</div>)}</div>
        {!!s.transcript?.length&&<><h3 className="mt-6 font-black">Transcript</h3><div className="mt-3 space-y-2">{s.transcript.map((t,n)=><div key={n} className="rounded-xl bg-slate-900 p-4 text-sm"><b className="text-blue-300">AI:</b> {t.question}<br/><b className="text-emerald-300">Candidate:</b> {t.answer}</div>)}</div></>}
      </div>}
    </div>})}</div>
  </div>
}
