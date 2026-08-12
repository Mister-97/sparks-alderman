import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getSessionEmail, SESSION_COOKIE_NAME } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function unauthorized(pathname: string, request: NextRequest) {
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/team/login", request.url));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/team/login" || pathname === "/api/team/login") {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const email = getSessionEmail(session);
  if (!email) {
    return unauthorized(pathname, request);
  }

  // Re-check against the admin_users table on every request, not just the
  // cookie signature, so a removed admin loses access immediately instead
  // of keeping a valid session for up to 7 days.
  const supabase = getSupabaseAdmin();
  const { data: admin } = await supabase
    .from("admin_users")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (!admin) {
    return unauthorized(pathname, request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/team/:path*", "/api/team/:path*"],
};
