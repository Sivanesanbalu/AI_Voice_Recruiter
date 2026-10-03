import { createClient } from "@supabase/supabase-js";
export const SUPABASE_URL="https://tprodidywabvkimvdgzi.supabase.co";
export const SUPABASE_KEY="sb_publishable_7c0UFjnCOJM-qxCgms0nMA_hCXGOLOo";
export const supabase=createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true}});
export const AI_URL=`${SUPABASE_URL}/functions/v1/interview-ai`;
