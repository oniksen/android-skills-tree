"use server";

import { requireUid } from "@/adapters/auth/session";
import { toggleSubtopic } from "@/adapters/firestore-admin/assessment";
import {
  checkLevelUp,
  recalculate,
  resetLevelProgress,
  type LevelUpResult,
} from "@/adapters/firestore-admin/progress";
import type { ToggleSubtopicResult } from "@/adapters/firestore-admin/assessment";

export async function toggleSubtopicAction(
  skillId: string,
  subtopicName: string,
): Promise<ToggleSubtopicResult> {
  const uid = await requireUid();
  return toggleSubtopic(uid, skillId, subtopicName);
}

export async function checkLevelUpAction(): Promise<LevelUpResult | null> {
  const uid = await requireUid();
  return checkLevelUp(uid);
}

export async function resetLevelAction(levelId: string): Promise<boolean> {
  const uid = await requireUid();
  try {
    await resetLevelProgress(uid, levelId);
    return true;
  } catch (error) {
    console.error("Error resetting level:", error);
    return false;
  }
}

export async function recalculateAction(): Promise<void> {
  const uid = await requireUid();
  await recalculate(uid);
}
