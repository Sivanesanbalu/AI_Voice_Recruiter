export const TYPES=["Technical","Experience","Problem Solving","Behavioral","Leadership"];
export const PRODUCTION_URL="https://interviewos-ai.lovable.app";

export function buildQuestionsPayload({job,jd,duration,types,coding}){
  return {
    action:"questions",
    jobPosition:String(job||"").trim(),
    jobDescription:String(jd||"").trim(),
    duration:Number(duration||30),
    types:Array.isArray(types)?types:[],
    codingEnabled:!!coding
  };
}

export function candidateUrl(token,origin=typeof window!=="undefined"?window.location.origin:PRODUCTION_URL){
  return origin.replace(/\/$/,"")+"/#interview/"+token;
}

export function fmtScore(v){
  const n=Number(v);
  return Number.isFinite(n)?Math.round(n)+"%":"—";
}

export function fmtDate(v){
  if(!v)return "—";
  const d=new Date(v);
  return Number.isNaN(d.getTime())?"—":d.toLocaleString();
}

export function fmtDuration(sec){
  const n=Number(sec);
  if(!Number.isFinite(n))return "—";
  const m=Math.floor(n/60),s=Math.max(0,Math.floor(n%60));
  return m+"m "+String(s).padStart(2,"0")+"s";
}

export function initials(nameOrEmail){
  const raw=String(nameOrEmail||"").trim();
  if(!raw)return "?";
  const base=raw.includes("@")&&!raw.includes(" ")?raw.split("@")[0].replace(/[._-]+/g," "):raw;
  const p=base.split(/\s+/).filter(Boolean);
  return ((p[0]?.[0]||"")+(p.length>1?(p[p.length-1]?.[0]||""):(p[0]?.[1]||""))).toUpperCase()||"?";
}

export function interviewCategories(i){
  return Array.isArray(i?.interview_types)?i.interview_types:Array.isArray(i?.settings?.categories)?i.settings.categories:[];
}

export function safeFilename(name){
  return String(name||"cv").replace(/[^a-zA-Z0-9._-]/g,"_");
}

export function validateWebhook(url){
  if(!url)return true;
  try{
    const u=new URL(url);
    return u.protocol==="https:"||u.protocol==="http:";
  }catch{return false}
}

export function csvEscape(v){
  const s=String(v??"");
  return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;
}
