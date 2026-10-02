"use client";
import { useState } from "react";
import { auth, ensureCompany, getToken, rest } from "@/lib/supabase-rest";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Code2, Plus, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";

const TYPES=["Technical","Behavioral","Experience","Problem Solving","Leadership"];

export default function CreateInterview(){
  const [step,setStep]=useState(1); const [jobPosition,setJobPosition]=useState(""); const [jobDescription,setJobDescription]=useState(""); const [duration,setDuration]=useState(30); const [types,setTypes]=useState(["Technical","Experience"]); const [coding,setCoding]=useState(false); const [questions,setQuestions]=useState([]); const [busy,setBusy]=useState(false); const [link,setLink]=useState("");
  const toggleType=t=>setTypes(v=>v.includes(t)?v.filter(x=>x!==t):[...v,t]);
  async function generate(){
    if(!jobPosition.trim()||jobDescription.trim().length<30){toast.error("Add a job title and a detailed job description.");return}
    setBusy(true);
    try{
      const r=await fetch("/api/ai/questions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+getToken()},body:JSON.stringify({jobPosition,jobDescription,duration,types,codingEnabled:coding})});
      const j=await r.json(); if(!r.ok) throw new Error(j.error||"Question generation failed"); setQuestions(j.questions||[]);setStep(2);
    }catch(e){toast.error(e.message)}finally{setBusy(false)}
  }
  function updateQ(i,key,val){setQuestions(q=>q.map((x,n)=>n===i?{...x,[key]:val}:x))}
  function addQ(){setQuestions(q=>[...q,{question:"",category:"General",maxScore:10,isCoding:false,expectedSignals:[]}])}
  async function publish(){
    if(!questions.length||questions.some(q=>!q.question.trim())){toast.error("Every question needs text.");return}
    setBusy(true);
    try{
      const user=await auth.user(); const companyId=await ensureCompany();
      const rows=await rest("saas_interviews",{method:"POST",body:{company_id:companyId,title:jobPosition,job_description:jobDescription,duration_minutes:Number(duration),interview_types:types,coding_enabled:coding,status:"published",created_by:user.id,settings:{voice:true,cvRequired:true}}});
      const interview=rows[0];
      await rest("saas_questions",{method:"POST",body:questions.map((q,i)=>({interview_id:interview.id,position:i+1,question:q.question,category:q.category||"General",max_score:Number(q.maxScore||10),is_coding:Boolean(q.isCoding),expected_signals:q.expectedSignals||[],rubric:q.rubric||{}}))});
      const url=location.origin+"/interview/"+interview.public_token;setLink(url);setStep(3);toast.success("Interview published");
    }catch(e){toast.error(e.message)}finally{setBusy(false)}
  }
  return <div className="max-w-4xl">
    <div className="flex items-center gap-3"><Link href="/dashboard" className="rounded-xl border border-white/10 p-2"><ArrowLeft size={18}/></Link><div><p className="text-sm text-blue-400">Step {step} of 3</p><h1 className="text-3xl font-black">Create AI interview</h1></div></div>
    <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-blue-500 transition-all" style={{width:(step/3*100)+"%"}}/></div>
    {step===1&&<div className="mt-8 space-y-6 rounded-3xl border border-white/10 bg-white/[.04] p-7">
      <div><label className="text-sm font-bold">Job title</label><input value={jobPosition} onChange={e=>setJobPosition(e.target.value)} placeholder="e.g. AI / ML Engineer" className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"/></div>
      <div><label className="text-sm font-bold">Job description</label><textarea value={jobDescription} onChange={e=>setJobDescription(e.target.value)} rows={9} placeholder="Responsibilities, required skills, experience, stack..." className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"/></div>
      <div className="grid gap-5 md:grid-cols-2"><div><label className="text-sm font-bold">Interview time</label><select value={duration} onChange={e=>setDuration(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3">{[10,15,20,30,45,60].map(x=><option key={x} value={x}>{x} minutes</option>)}</select></div><div><label className="text-sm font-bold">Interview types</label><div className="mt-2 flex flex-wrap gap-2">{TYPES.map(t=><button type="button" key={t} onClick={()=>toggleType(t)} className={"rounded-lg border px-3 py-2 text-sm "+(types.includes(t)?"border-blue-400 bg-blue-500/15 text-blue-200":"border-white/10")}>{t}</button>)}</div></div></div>
      <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900 p-4"><input type="checkbox" checked={coding} onChange={e=>setCoding(e.target.checked)} className="mt-1"/><Code2 className="text-blue-400"/><span><b>Enable coding round</b><span className="mt-1 block text-sm text-slate-400">Use this for software engineering, CS, IT, AI/ML or similar technical roles. The AI will add role-specific coding questions.</span></span></label>
      <div className="flex justify-end"><button onClick={generate} disabled={busy} className="flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-bold disabled:opacity-50"><Sparkles size={18}/>{busy?"Generating...":"Generate questions"}<ArrowRight size={18}/></button></div>
    </div>}
    {step===2&&<div className="mt-8">
      <div className="mb-4 flex items-center justify-between"><div><h2 className="text-2xl font-black">Review question set</h2><p className="text-sm text-slate-400">Edit, remove or add questions before publishing.</p></div><button onClick={addQ} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2"><Plus size={17}/> Add question</button></div>
      <div className="space-y-3">{questions.map((q,i)=><div key={i} className="rounded-2xl border border-white/10 bg-white/[.04] p-5">
        <div className="flex gap-3"><span className="mt-3 text-sm font-bold text-slate-500">Q{i+1}</span><textarea value={q.question} onChange={e=>updateQ(i,"question",e.target.value)} rows={2} className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3"/><button onClick={()=>setQuestions(v=>v.filter((_,n)=>n!==i))} className="h-11 rounded-xl border border-white/10 p-3 text-red-300"><Trash2 size={17}/></button></div>
        <div className="mt-3 grid gap-3 md:grid-cols-3"><input value={q.category||""} onChange={e=>updateQ(i,"category",e.target.value)} placeholder="Category" className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2"/><input type="number" min="1" max="20" value={q.maxScore||10} onChange={e=>updateQ(i,"maxScore",e.target.value)} className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2"/><label className="flex items-center gap-2 rounded-xl border border-white/10 px-3"><input type="checkbox" checked={Boolean(q.isCoding)} onChange={e=>updateQ(i,"isCoding",e.target.checked)}/> Coding question</label></div>
      </div>)}</div>
      <div className="mt-6 flex justify-between"><button onClick={()=>setStep(1)} className="rounded-xl border border-white/10 px-5 py-3">Back</button><button onClick={publish} disabled={busy} className="flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-bold disabled:opacity-50"><Check size={18}/>{busy?"Publishing...":"Save & publish"}</button></div>
    </div>}
    {step===3&&<div className="mt-10 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-8 text-center"><Check className="mx-auto h-12 w-12 text-emerald-300"/><h2 className="mt-4 text-3xl font-black">Interview is live</h2><p className="mt-2 text-slate-300">Share this universal link with candidates.</p><div className="mx-auto mt-6 flex max-w-2xl gap-2"><input readOnly value={link} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-3"/><button onClick={()=>{navigator.clipboard.writeText(link);toast.success("Copied")}} className="rounded-xl bg-white px-5 font-bold text-slate-950">Copy</button></div><Link href="/dashboard" className="mt-6 inline-block text-blue-300">Go to dashboard</Link></div>}
  </div>
}
