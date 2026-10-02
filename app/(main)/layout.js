"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/supabase-rest";
import { BarChart3, LogOut, PlusCircle } from "lucide-react";

export default function MainLayout({children}) {
  const router=useRouter();
  return <div className="min-h-screen bg-slate-950">
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="font-black text-xl">InterviewOS</Link>
        <nav className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm hover:bg-white/5"><BarChart3 size={17}/> Dashboard</Link>
          <Link href="/dashboard/create-interview" className="flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-bold"><PlusCircle size={17}/> New interview</Link>
          <button onClick={()=>{auth.signOut();router.push("/login")}} className="rounded-xl p-2 hover:bg-white/5" title="Sign out"><LogOut size={18}/></button>
        </nav>
      </div>
    </header>
    <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
  </div>
}
