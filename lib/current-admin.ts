import { cookies } from "next/headers";

import { getSessionEmail, SESSION_COOKIE_NAME } from "@/lib/session";

export async function getCurrentAdminEmail() {
  const store = await cookies();
  return getSessionEmail(store.get(SESSION_COOKIE_NAME)?.value);
}
