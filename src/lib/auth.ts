import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "firebase-session";
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function setSessionCookie(uid: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, uid, {
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

export async function getCurrentUser(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value ?? null;
}

export async function requireAuth(): Promise<string> {
  const uid = await getCurrentUser();
  if (!uid) {
    throw new Error("Not authenticated");
  }
  return uid;
}
