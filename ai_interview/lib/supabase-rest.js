const URL = "https://tprodidywabvkimvdgzi.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwcm9kaWR5d2FidmtpbXZkZ3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3Nzc2NzMsImV4cCI6MjEwNjM1MzY3M30.BvJR1f3LGhz-0Zr57SKhk-ggl86e96LrUubvKQnm1H4";

export const configReady = () => Boolean(URL && KEY);

export function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("interview_access_token") || "";
}

export function setSession(session) {
  if (typeof window === "undefined") return;
  if (session && session.access_token) {
    localStorage.setItem("interview_access_token", session.access_token);
    localStorage.setItem("interview_refresh_token", session.refresh_token || "");
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("interview_access_token");
  localStorage.removeItem("interview_refresh_token");
}

async function request(path, options = {}, token = getToken()) {
  if (!configReady()) throw new Error("Supabase environment variables are not configured.");
  const res = await fetch(URL + path, {
    ...options,
    headers: {
      apikey: KEY,
      Authorization: "Bearer " + (token || KEY),
      "Content-Type": "application/json",
      Prefer: options.prefer || "return=representation",
      ...(options.headers || {}),
    },
  });
  const textBody = await res.text();
  let data = null;
  try { data = textBody ? JSON.parse(textBody) : null; } catch { data = textBody; }
  if (!res.ok) throw new Error((data && (data.message || data.msg || data.error_description || data.error)) || textBody || "Request failed");
  return data;
}

export const auth = {
  async signIn(email, password) {
    const data = await request("/auth/v1/token?grant_type=password", {
      method: "POST", body: JSON.stringify({ email, password })
    }, "");
    setSession(data);
    return data;
  },
  async signUp(email, password) {
    const data = await request("/auth/v1/signup", {
      method: "POST", body: JSON.stringify({ email, password })
    }, "");
    if (data && data.access_token) setSession(data);
    return data;
  },
  async user() { return request("/auth/v1/user", { method: "GET" }); },
  signOut() { clearSession(); }
};

export async function rest(table, opts = {}) {
  const method = opts.method || "GET";
  const query = opts.query || "";
  return request("/rest/v1/" + table + (query ? "?" + query : ""), {
    method,
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    prefer: opts.prefer
  });
}

export async function rpc(name, body, token = getToken()) {
  return request("/rest/v1/rpc/" + name, { method:"POST", body:JSON.stringify(body) }, token);
}

export async function publicRpc(name, body) {
  return request("/rest/v1/rpc/" + name, { method:"POST", body:JSON.stringify(body) }, "");
}

export async function uploadCv(token, sessionId, file) {
  if (!configReady()) throw new Error("Supabase environment variables are not configured.");
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = token + "/" + sessionId + "/" + Date.now() + "-" + safe;
  const res = await fetch(URL + "/storage/v1/object/interview-cvs/" + path, {
    method:"POST",
    headers:{ apikey:KEY, Authorization:"Bearer " + KEY, "Content-Type":file.type || "application/octet-stream", "x-upsert":"false" },
    body:file
  });
  if (!res.ok) throw new Error(await res.text());
  return path;
}

export async function ensureCompany() {
  const user = await auth.user();
  let memberships = await rest("saas_company_members", {
    query:"select=company_id,role&user_id=eq." + encodeURIComponent(user.id)
  });
  if (memberships && memberships.length) return memberships[0].company_id;
  const email = user.email || "Recruiter";
  const company = await rest("saas_companies", {
    method:"POST",
    body:{ name:(email.split("@")[0] || "Recruiting") + " Workspace", created_by:user.id }
  });
  const companyId = company[0].id;
  await rest("saas_company_members", {
    method:"POST", body:{ company_id:companyId, user_id:user.id, role:"owner" }
  });
  return companyId;
}

export { URL as SUPABASE_URL, KEY as SUPABASE_KEY };
