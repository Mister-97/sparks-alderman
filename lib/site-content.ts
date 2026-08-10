import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function getSiteContent(key: string, fallback = "") {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("site_content")
    .select("content")
    .eq("key", key)
    .maybeSingle();

  return data?.content || fallback;
}
