import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "sparks_team_session";
const SESSION_LENGTH_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function sign(value: string) {
  const secret = process.env.SESSION_SECRET!;
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createSessionCookieValue(email: string) {
  const expires = Date.now() + SESSION_LENGTH_MS;
  const payload = `${expires}.${Buffer.from(email).toString("base64url")}`;
  return `${payload}.${sign(payload)}`;
}

function verify(value: string | undefined) {
  if (!value) return null;
  const lastDot = value.lastIndexOf(".");
  if (lastDot === -1) return null;

  const payload = value.slice(0, lastDot);
  const signature = value.slice(lastDot + 1);
  const expected = sign(payload);

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  const [expiresStr, emailB64] = payload.split(".");
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || expires <= Date.now()) return null;
  if (!emailB64) return null;

  return { email: Buffer.from(emailB64, "base64url").toString() };
}

export function isValidSessionCookieValue(value: string | undefined) {
  return verify(value) !== null;
}

export function getSessionEmail(value: string | undefined) {
  return verify(value)?.email ?? null;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE_SECONDS = SESSION_LENGTH_MS / 1000;
