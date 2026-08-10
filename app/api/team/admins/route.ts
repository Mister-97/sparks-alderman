import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { hashPassword } from "@/lib/password";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("admin_users")
    .select("email, created_at")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ admins: data });
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("admin_users").insert({
    email: email.trim().toLowerCase(),
    password_hash: hashPassword(password),
  });

  if (error) {
    const message = error.code === "23505" ? "That email already has an account." : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
