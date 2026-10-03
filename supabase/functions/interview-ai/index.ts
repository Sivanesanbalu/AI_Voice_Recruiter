import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } }
);

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: cors });
}

function parseJson(raw: string) {
  const cleaned = String(raw || "").replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
  const starts = [cleaned.indexOf("{"), cleaned.indexOf("[")].filter((i) => i >= 0);
  const start = starts.length ? Math.min(...starts) : 0;
  const end = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
  return JSON.parse(end >= start ? cleaned.slice(start, end + 1) : cleaned);
}

async function openRouter(messages: unknown[], temperature = 0.2) {
  const { data, error } = await supabase
    .from("saas_secrets")
    .select("secret_value")
    .eq("name", "OPENROUTER_API_KEY")
    .single();
  if (error || !data?.secret_value) throw new Error("AI provider is not configured");

  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + data.secret_value,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://interviewos-ai.lovable.app",
      "X-Title": "InterviewOS",
    },
    body: JSON.stringify({
      model: "openrouter/auto",
      messages,
      temperature,
    }),
  });
  const body = await r.json();
  if (!r.ok) throw new Error(body?.error?.message || "OpenRouter request failed");
  return body?.choices?.[0]?.message?.content || "";
}

async function requireRecruiter(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const jwt = auth.replace(/^Bearer\s+/i, "");
  if (!jwt) throw new Error("Unauthorized");
  const { data, error } = await supabase.auth.getUser(jwt);
  if (error || !data?.user) throw new Error("Unauthorized");
  return data.user;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json();
    const action = body.action;

    if (action === "questions") {
      await requireRecruiter(req);
      const count = Math.max(4, Math.min(14, Math.round(Number(body.duration || 30) / 4)));
      const prompt = `Create a rigorous structured interview plan as JSON only. Use the job description as the source of truth. Avoid generic trivia, duplicate concepts, vague prompts, brainteasers, and yes/no questions. Prefer realistic prompts about decisions, trade-offs, debugging, system or process design, and prior evidence. Balance the requested categories and progress from foundation to applied reasoning.
Role: ${body.jobPosition}
Job description: ${body.jobDescription}
Duration: ${body.duration} minutes
Interview categories: ${(body.types || []).join(", ")}
Coding enabled: ${body.codingEnabled ? "yes" : "no"}

Return exactly {"questions":[...]}.
Each question item must have:
question:string,
category:string,
maxScore:number,
isCoding:boolean,
expectedSignals:string[],
rubric:{"excellent":string,"acceptable":string,"weak":string}

Generate about ${count} total questions. Questions must directly test the job description. Each question should target observable job evidence and have a clear rubric. Do not include coding questions unless coding is enabled. If coding is enabled, include 1-2 practical role-specific coding questions that can reasonably be completed in the allotted time.`;
      const raw = await openRouter([{ role: "user", content: prompt }], 0.3);
      const parsed = parseJson(raw);
      return json({ questions: Array.isArray(parsed) ? parsed : (parsed.questions || []) });
    }

    if (action === "cv") {
      const { data: session, error: se } = await supabase.rpc("candidate_get_session", {
        p_token: body.token,
        p_session_id: body.sessionId,
      });
      if (se || !session) throw new Error("Invalid candidate session");

      const prompt = "Extract factual interview context from this candidate CV. Return JSON only with keys summary, skills (array), experienceHighlights (array), education (array), projects (array), certifications (array), strengthsToProbe (array), claimsToVerify (array), roleRelevantEvidence (array). Do not invent facts, dates, employers, projects, metrics, certifications, or skills. Never infer protected or sensitive traits. Keep explicit CV claims separate from items that should be verified in the interview.";
      let content: unknown = prompt;
      if (body.mimeType === "text/plain") {
        const base64 = String(body.fileData || "").split(",").pop() || "";
        const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const text = new TextDecoder().decode(bytes).slice(0, 30000);
        content = prompt + "\n\nCV TEXT:\n" + text;
      } else {
        content = [
          { type: "text", text: prompt },
          { type: "file", file: { filename: body.filename || "resume.pdf", file_data: body.fileData } },
        ];
      }
      try {
        const raw = await openRouter([{ role: "user", content }], 0.2);
        return json({ profile: parseJson(raw) });
      } catch (e) {
        return json({
          profile: {
            summary: "CV uploaded successfully. Automated extraction was unavailable for this file format.",
            skills: [], experienceHighlights: [], education: [], projects: [],
            strengthsToProbe: [], claimsToVerify: []
          },
          warning: e instanceof Error ? e.message : "CV analysis unavailable"
        });
      }
    }

    if (action === "evaluate") {
      const { data: interview, error: ie } = await supabase.rpc("public_get_interview", { p_token: body.token });
      const { data: session, error: se } = await supabase.rpc("candidate_get_session", {
        p_token: body.token,
        p_session_id: body.sessionId,
      });
      if (ie || se || !interview || !session) throw new Error("Invalid interview session");

      const prompt = `You are a rigorous interview evaluator. Score only evidence present in candidate answers. Do not infer protected traits, personality, or hiring suitability.
ROLE: ${interview.title}
JOB DESCRIPTION: ${interview.jobDescription}
CV PROFILE: ${JSON.stringify(session.cvProfile || {})}
QUESTIONS: ${JSON.stringify(interview.questions || [])}
TRANSCRIPT: ${JSON.stringify(body.transcript || [])}
CODING ANSWER: ${body.codingAnswer || ""}
CODING LANGUAGE: ${body.codingLanguage || ""}

Return JSON only:
{
 "overallScore":0-100,
 "codingScore":0-100 or null,
 "scoreBreakdown":{"Technical":0-100,"Communication":0-100,"Problem Solving":0-100,"Experience":0-100},
 "questionScores":[{"questionId":"uuid","question":"text","category":"text","answer":"candidate answer","score":number,"maxScore":number,"reasoning":"brief evidence-based reason","strengths":["..."],"gaps":["..."]}],
 "summary":"concise recruiter summary",
 "strengths":["..."],
 "gaps":["..."],
 "followUpTopics":["..."]
}
Keep each question score within its maxScore. Weight overall score by maxScore. Do not recommend hiring or rejecting.`;

      const raw = await openRouter([{ role: "user", content: prompt }], 0.1);
      const evaluation = parseJson(raw);
      const { error: ce } = await supabase.rpc("candidate_complete_session", {
        p_token: body.token,
        p_session_id: body.sessionId,
        p_duration_seconds: Number(body.durationSeconds || 0),
        p_transcript: body.transcript || [],
        p_evaluation: evaluation,
        p_coding_answer: body.codingAnswer || null,
        p_coding_language: body.codingLanguage || null,
      });
      if (ce) throw ce;
      return json({ ok: true, evaluation });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return json({ error: message }, /Unauthorized/.test(message) ? 401 : 500);
  }
});