import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { serverEnv } from "@/adapters/env/server";

const SESSION_COOKIE_NAME = "firebase-session";
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const secret = new TextEncoder().encode(serverEnv.AUTH_SECRET);

export interface SessionPayload {
  uid: string;
  email: string | null;
}

export async function createSessionToken(
  payload: SessionPayload,
): Promise<string> {
  return new SignJWT({ uid: payload.uid, email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.uid !== "string") return null;
    return {
      uid: payload.uid,
      email: typeof payload.email === "string" ? payload.email : null,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = await createSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function getCurrentUser(): Promise<string | null> {
  const session = await getSession();
  return session?.uid ?? null;
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }
  return session;
}

export async function requireUid(): Promise<string> {
  return (await requireSession()).uid;
}

export { SESSION_COOKIE_NAME };
