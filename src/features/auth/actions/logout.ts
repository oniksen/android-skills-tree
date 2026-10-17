"use server";

import { revalidatePath } from "next/cache";
import { clearSessionCookie } from "@/adapters/auth/session";

export async function logout(): Promise<void> {
  await clearSessionCookie();
  revalidatePath("/");
}
