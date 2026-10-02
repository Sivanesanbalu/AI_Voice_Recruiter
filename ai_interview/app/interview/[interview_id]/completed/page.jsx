"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { publicRpc } from "@/lib/supabase-rest";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function Completed(){
  const {interview_id:token}=useParams();const [session,setSession]=useState(null);
  useEffect(()=>{(async()=>{const id=localStorage.getItem("interview_session_"+token);if(id){try{setSession(await publicRpc("candidate_get_session",{p_token:token,p_session_id:id}))}catch{}}})()},[token]);
  return <main className="grid min-h-screen place-items-center px-6"><div className="max-w-xl rounded-3xl border border-white/10 bg-white/[.04] p-10 text-center">{!session?<Loader2 className="mx-auto animate-spin"/>:<><CheckCircle2 className="mx-auto h-16 w-16 text-emerald-400"/><h1 className="mt-5 text-3xl font-black">Interview completed</h1><p className="mt-3 leading-7 text-slate-400">Thank you, {session.candidateName}. Your answers and interview transcript have been submitted to the recruiting team.</p><p className="mt-5 text-sm text-slate-500">You can close this page now.</p></>}</div></main>
}
