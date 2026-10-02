"use client";
import Link from "next/link";
import { ArrowRight, Bot, Code2, FileText, Gauge, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  [Bot, "Live AI interviewer", "Runs a timed voice-led interview from your approved question set."],
  [FileText, "JD + CV intelligence", "Questions are generated from the role and can use candidate CV context."],
  [Gauge, "Question-level scoring", "Every answer is scored with category breakdowns, strengths and gaps."],
  [Code2, "Optional coding round", "Enable coding only for software, CS, IT and AI-related roles."],
  [ShieldCheck, "Company-scoped data", "Recruiter workspaces, private CV storage and isolated candidate results."],
  [Sparkles, "Export-ready results", "Download CSV or sync completed candidate data to your Sheet/Drive webhook."],
];

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,.24),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,.20),transparent_30%)]" />
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center gap-3 font-black tracking-tight text-xl"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500">IO</span> InterviewOS</Link>
          <div className="flex gap-3"><Link href="/login" className="rounded-xl border border-white/15 px-4 py-2 text-sm">Company login</Link><Link href="/login?mode=signup" className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-950">Start hiring</Link></div>
        </nav>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 pb-24 pt-16 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">Production-ready structured AI interviews</span>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">From job description to scored interview — in one link.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Recruiters define the role and time. InterviewOS generates editable questions, accepts candidate CVs, runs the timed interview, scores every answer and stores the transcript and report.</p>
            <div className="mt-9 flex flex-wrap gap-4"><Link href="/login?mode=signup" className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-bold hover:bg-blue-400">Create company workspace <ArrowRight size={18}/></Link><a href="#workflow" className="rounded-xl border border-white/15 px-6 py-3 font-semibold">See workflow</a></div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[.06] p-5 shadow-2xl backdrop-blur">
            <div className="rounded-2xl bg-slate-900 p-5">
              <div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">AI Engineer Interview</p><p className="mt-1 text-2xl font-bold">Candidate evaluation</p></div><span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">Completed</span></div>
              <div className="mt-6 grid grid-cols-3 gap-3">{["Technical 84","Problem solving 79","Communication 88"].map(x=><div key={x} className="rounded-xl bg-white/5 p-4 text-sm">{x}</div>)}</div>
              <div className="mt-5 rounded-xl border border-white/10 p-4"><p className="text-sm text-slate-400">Overall score</p><p className="mt-2 text-4xl font-black">84<span className="text-lg text-slate-500">/100</span></p><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[84%] rounded-full bg-blue-500"/></div></div>
            </div>
          </div>
        </div>
      </section>
      <section id="workflow" className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-blue-400">Complete workflow</p>
        <h2 className="mt-3 text-4xl font-black">Built for the full interview lifecycle</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{features.map(([Icon,t,d])=><div key={t} className="rounded-2xl border border-white/10 bg-white/[.04] p-6"><Icon className="text-blue-400"/><h3 className="mt-5 text-xl font-bold">{t}</h3><p className="mt-2 leading-7 text-slate-400">{d}</p></div>)}</div>
      </section>
    </main>
  );
}
