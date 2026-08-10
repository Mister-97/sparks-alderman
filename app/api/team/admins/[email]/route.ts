import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getCurrentAdminEmail } from "@/lib/current-admin";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  const { email } = await params;
  const target = decodeURIComponent(email).toLowerCase();
  const currentEmail = await getCurrentAdminEmail();

  if (target === currentEmail) {
    return NextResponse.json(
      { error: "You can't remove your own account." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  const { count } = await supabase
    .from("admin_users")
    .select("id", { count: "exact", head: true });

  if ((count || 0) <= 1) {
    return NextResponse.json(
      { error: "Can't remove the last remaining admin." },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("admin_users").delete().eq("email", target);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
