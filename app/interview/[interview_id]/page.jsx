"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { publicRpc, uploadCv } from "@/lib/supabase-rest";
import { Clock, FileText, Loader2, Mic, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function CandidateEntry(){
  const {interview_id:token}=useParams(); const router=useRouter();
  const [interview,setInterview]=useState(null); const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [file,setFile]=useState(null); const [busy,setBusy]=useState(false); const [error,setError]=useState("");
  useEffect(()=>{(async()=>{try{const data=await publicRpc("public_get_interview",{p_token:token}); if(!data) throw new Error("This interview link is invalid or closed.");setInterview(data)}catch(e){setError(e.message)}})()},[token]);
  async function toDataUrl(file){ return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}
  async function start(){
    if(!name.trim()||!email.includes("@")){toast.error("Enter your name and email.");return}
    if(!file){toast.error("Upload your CV before starting.");return}
    setBusy(true);
    try{
      const sessionId=await publicRpc("candidate_start_session",{p_token:token,p_name:name,p_email:email});
      const cvPath=await uploadCv(token,sessionId,file);
      let cvProfile={};
      try{
        const fileData=await toDataUrl(file);
        const r=await fetch("/api/ai/cv",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filename:file.name,mimeType:file.type,fileData})});
        const j=await r.json();cvProfile=j.profile||{};
      }catch{}
      await publicRpc("candidate_set_cv",{p_token:token,p_session_id:sessionId,p_cv_path:cvPath,p_cv_profile:cvProfile});
      localStorage.setItem("interview_session_"+token,sessionId);
      router.push("/interview/"+token+"/start");
    }catch(e){toast.error(e.message)}finally{setBusy(false)}
  }
  if(error) return <main className="grid min-h-screen place-items-center px-6"><div className="max-w-lg rounded-3xl border border-red-400/20 bg-red-500/10 p-8 text-center"><h1 className="text-2xl font-black">Interview unavailable</h1><p className="mt-3 text-slate-300">{error}</p></div></main>;
  if(!interview) return <main className="grid min-h-screen place-items-center"><Loader2 className="animate-spin"/></main>;
  return <main className="mx-auto max-w-3xl px-6 py-12">
    <div className="rounded-3xl border border-white/10 bg-white/[.04] p-8">
      <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-bold text-blue-400">AI INTERVIEW</p><h1 className="mt-2 text-3xl font-black">{interview.title}</h1></div><span className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm"><Clock size={16}/>{interview.durationMinutes} min</span></div>
      <p className="mt-5 whitespace-pre-line leading-7 text-slate-400">{String(interview.jobDescription||"").slice(0,600)}{String(interview.jobDescription||"").length>600?"…":""}</p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">{[
        [Mic,"Voice-led","AI asks approved questions aloud"],
        [FileText,"CV-aware","Your CV is used as interview context"],
        [ShieldCheck,"Structured scoring","Every answer is scored separately"]
      ].map(([Icon,t,d])=><div key={t} className="rounded-xl border border-white/10 p-4"><Icon className="text-blue-400"/><b className="mt-3 block">{t}</b><span className="mt-1 block text-xs leading-5 text-slate-400">{d}</span></div>)}</div>
      <div className="mt-8 space-y-4">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"/>
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email address" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"/>
        <label className="block rounded-xl border border-dashed border-white/20 bg-slate-900 p-5"><span className="font-bold">Upload CV</span><span className="mt-1 block text-sm text-slate-400">PDF, DOCX or TXT · max 10 MB</span><input type="file" accept=".pdf,.docx,.txt" onChange={e=>setFile(e.target.files?.[0]||null)} className="mt-3 block w-full text-sm"/></label>
        <div className="rounded-xl bg-amber-500/10 p-4 text-sm text-amber-100">Use a quiet place and allow microphone access. The timer starts when you enter the interview room.</div>
        <button onClick={start} disabled={busy} className="w-full rounded-xl bg-blue-500 px-5 py-3 font-black disabled:opacity-50">{busy?"Preparing interview...":"Start interview"}</button>
      </div>
    </div>
  </main>
}
