import OpenAI from "openai";

export function parseJson(text) {
  const cleaned = String(text || "").replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
  const candidates = [cleaned.indexOf("{"), cleaned.indexOf("[")].filter((i) => i >= 0);
  const start = candidates.length ? Math.min(...candidates) : 0;
  const end = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
  return JSON.parse(end >= start ? cleaned.slice(start, end + 1) : cleaned);
}

export function aiClient() {
  if (!process.env.OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is not configured");
  return new OpenAI({ baseURL:"https://openrouter.ai/api/v1", apiKey:process.env.OPENROUTER_API_KEY });
}

export async function verifyRecruiter(req) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const authorization = req.headers.get("authorization");
  if (!url || !key || !authorization?.startsWith("Bearer ")) throw new Error("Unauthorized");
  const response = await fetch(url + "/auth/v1/user", {
    headers:{ apikey:key, Authorization:authorization }
  });
  if (!response.ok) throw new Error("Unauthorized");
  return response.json();
}

export const model = () => process.env.AI_MODEL || "openrouter/free";
