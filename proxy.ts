import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { isValidSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/team/login" || pathname === "/api/team/login") {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!isValidSessionCookieValue(session)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/team/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/team/:path*", "/api/team/:path*"],
};
