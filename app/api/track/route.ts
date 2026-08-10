import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

const FORM_KEYS = ["volunteer", "join", "contact"];

export async function POST(req: NextRequest) {
  const { formKey } = await req.json();

  if (!FORM_KEYS.includes(formKey)) {
    return NextResponse.json({ error: "Invalid form key." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  await supabase.from("form_views").insert({ form_key: formKey });

  return NextResponse.json({ ok: true });
}
