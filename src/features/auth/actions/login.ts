"use server";

import { revalidatePath } from "next/cache";
import { setSessionCookie, type SessionPayload } from "@/adapters/auth/session";

export async function login(uid: string, email: string | null): Promise<void> {
  const payload: SessionPayload = { uid, email };
  await setSessionCookie(payload);
  revalidatePath("/");
}
