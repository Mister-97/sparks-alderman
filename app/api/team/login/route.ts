import { NextRequest, NextResponse } from "next/server";

import {
  createSessionCookieValue,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { verifyPassword } from "@/lib/password";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  const supabase = getSupabaseAdmin();
  const { data: admin } = await supabase
    .from("admin_users")
    .select("email, password_hash, failed_attempts, locked_until")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (admin?.locked_until && new Date(admin.locked_until).getTime() > Date.now()) {
    const minutesLeft = Math.ceil(
      (new Date(admin.locked_until).getTime() - Date.now()) / 60000
    );
    return NextResponse.json(
      {
        error: `Too many failed attempts. Try again in ${minutesLeft} minute${
          minutesLeft === 1 ? "" : "s"
        }.`,
      },
      { status: 429 }
    );
  }

  const valid = admin && verifyPassword(password, admin.password_hash);

  if (!valid) {
    if (admin) {
      const attempts = (admin.failed_attempts || 0) + 1;
      const lockedUntil =
        attempts >= MAX_ATTEMPTS ? new Date(Date.now() + LOCKOUT_MS).toISOString() : null;
      await supabase
        .from("admin_users")
        .update({ failed_attempts: attempts, locked_until: lockedUntil })
        .eq("email", normalizedEmail);
    }
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  await supabase
    .from("admin_users")
    .update({ failed_attempts: 0, locked_until: null })
    .eq("email", normalizedEmail);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(normalizedEmail), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
