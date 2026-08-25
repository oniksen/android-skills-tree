"use server";

import { setSessionCookie, clearSessionCookie } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function login(uid: string) {
  await setSessionCookie(uid);
  revalidatePath("/");
}

export async function logout() {
  await clearSessionCookie();
  revalidatePath("/");
}
