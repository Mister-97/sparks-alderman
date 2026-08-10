import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .order("key", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}
