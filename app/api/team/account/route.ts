import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { hashPassword, verifyPassword } from "@/lib/password";
import { getCurrentAdminEmail } from "@/lib/current-admin";

export async function PUT(req: NextRequest) {
  const email = await getCurrentAdminEmail();
  if (!email) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const { data: admin } = await supabase
    .from("admin_users")
    .select("password_hash")
    .eq("email", email)
    .maybeSingle();

  if (!admin || !verifyPassword(currentPassword, admin.password_hash)) {
    return NextResponse.json(
      { error: "Current password is incorrect." },
      { status: 401 }
    );
  }

  await supabase
    .from("admin_users")
    .update({ password_hash: hashPassword(newPassword) })
    .eq("email", email);

  return NextResponse.json({ ok: true });
}
