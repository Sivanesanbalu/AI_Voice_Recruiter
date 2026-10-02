import { NextResponse } from "next/server";
import { verifyRecruiter } from "@/lib/server-ai";

export async function POST(req){
  try{
    const user=await verifyRecruiter(req);
    const token=req.headers.get("authorization");
    const {companyId}=await req.json();
    const url="https://tprodidywabvkimvdgzi.supabase.co", key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwcm9kaWR5d2FidmtpbXZkZ3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3Nzc2NzMsImV4cCI6MjEwNjM1MzY3M30.BvJR1f3LGhz-0Zr57SKhk-ggl86e96LrUubvKQnm1H4";
    const headers={apikey:key,Authorization:token,"Content-Type":"application/json"};
    const member=await fetch(url+"/rest/v1/saas_company_members?select=company_id&company_id=eq."+encodeURIComponent(companyId)+"&user_id=eq."+encodeURIComponent(user.id),{headers}).then(r=>r.json());
    if(!member?.length) throw new Error("Not authorized for this company");
    const cfg=await fetch(url+"/rest/v1/saas_integrations?select=*&company_id=eq."+encodeURIComponent(companyId),{headers}).then(r=>r.json());
    if(!cfg?.[0]?.drive_enabled||!cfg[0].drive_webhook_url) throw new Error("Drive/Sheet webhook is not enabled");
    const ints=await fetch(url+"/rest/v1/saas_interviews?select=id,title&company_id=eq."+encodeURIComponent(companyId),{headers}).then(r=>r.json());
    const ids=ints.map(x=>x.id);
    if(!ids.length) return NextResponse.json({ok:true,count:0});
    const sessions=await fetch(url+"/rest/v1/saas_sessions?select=*&interview_id=in.("+ids.join(",")+")&status=eq.completed",{headers}).then(r=>r.json());
    const payload=sessions.map(s=>({...s,interview_title:ints.find(i=>i.id===s.interview_id)?.title||""}));
    const out=await fetch(cfg[0].drive_webhook_url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({source:"InterviewOS",companyId,exportedAt:new Date().toISOString(),results:payload})});
    if(!out.ok) throw new Error("Connected webhook returned HTTP "+out.status);
    return NextResponse.json({ok:true,count:payload.length});
  }catch(e){return NextResponse.json({error:e.message||"Sync failed"},{status:/Unauthorized/.test(e.message)?401:500})}
}
