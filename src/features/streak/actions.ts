"use server";

import { requireUid } from "@/adapters/auth/session";
import {
  applyAutoFreezes,
  syncStreak,
} from "@/adapters/firestore-admin/streak-commands";
import type { AutoFreezeReport } from "@/core/domain/streak";

export async function syncStreakAction(): Promise<boolean> {
  const uid = await requireUid();
  return (await syncStreak(uid)) !== null;
}

export async function applyAutoFreezesAction(): Promise<AutoFreezeReport | null> {
  const uid = await requireUid();
  return applyAutoFreezes(uid);
}
