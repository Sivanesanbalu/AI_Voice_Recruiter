"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, ensureCompany, getToken } from "@/lib/supabase-rest";
import { toast } from "sonner";

export default function LoginPage() {
  const router=useRouter(); const [mode,setMode]=useState("login");
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [busy,setBusy]=useState(false);
  useEffect(()=>{ const p=new URLSearchParams(window.location.search); if(p.get("mode")==="signup")setMode("signup"); if(getToken()) router.replace("/dashboard"); },[]);
  async function submit(e){
    e.preventDefault(); setBusy(true);
    try {
      const data = mode==="signup" ? await auth.signUp(email,password) : await auth.signIn(email,password);
      if(mode==="signup" && !data?.access_token){ toast.success("Account created. Check your email if confirmation is enabled."); setMode("login"); return; }
      await ensureCompany(); router.replace("/dashboard");
    } catch(e){ toast.error(e.message); } finally{ setBusy(false); }
  }
  return <main className="grid min-h-screen place-items-center px-6">
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[.05] p-8 shadow-2xl">
      <Link href="/" className="font-black text-xl">InterviewOS</Link>
      <h1 className="mt-8 text-3xl font-black">{mode==="login"?"Company login":"Create company workspace"}</h1>
      <p className="mt-2 text-slate-400">Use your recruiter account to manage interviews and candidate results.</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="work@email.com" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"/>
        <input type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"/>
        <button disabled={busy} className="w-full rounded-xl bg-blue-500 px-4 py-3 font-bold text-white disabled:opacity-50">{busy?"Working...":mode==="login"?"Login":"Create account"}</button>
      </form>
      <button onClick={()=>setMode(mode==="login"?"signup":"login")} className="mt-5 text-sm text-blue-300">{mode==="login"?"New company? Create an account":"Already have an account? Login"}</button>
    </div>
  </main>
}
