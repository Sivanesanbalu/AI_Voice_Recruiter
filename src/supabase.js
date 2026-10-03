import { createClient } from "@supabase/supabase-js";
const url="https://tprodidywabvkimvdgzi.supabase.co";
const key="sb_publishable_7c0UFjnCOJM-qxCgms0nMA_hCXGOLOo";
export const supabase=createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true}});
export const AI_URL=`${url}/functions/v1/interview-ai`;
