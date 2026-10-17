"use server";

import { revalidatePath } from "next/cache";
import { setSessionCookie, type SessionPayload } from "@/adapters/auth/session";
import { verifyIdToken } from "@/adapters/auth/firebase-admin-auth";

export async function login(idToken: string): Promise<void> {
  const user = await verifyIdToken(idToken);
  const payload: SessionPayload = { uid: user.uid, email: user.email };
  await setSessionCookie(payload);
  revalidatePath("/");
}
