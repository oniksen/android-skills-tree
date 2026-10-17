import { FieldValue } from "firebase-admin/firestore";
import { fsPath, getAdminDb } from "@/adapters/firestore-admin/admin-app";
import { listAchievements } from "@/adapters/firestore-admin/queries";
import {
  achievementKey,
  selectMissingAwards,
  type AchievementAward,
} from "@/core/domain/achievement-conditions";
import { userAchievementsPath } from "@/adapters/firestore-client/paths";

export async function addAchievementsIfNotExists(
  uid: string,
  awards: AchievementAward[],
) {
  if (awards.length === 0) return;

  const db = getAdminDb();
  const existing = await listAchievements(uid);
  const existingKeys = existing.flatMap(({ data }) =>
    typeof data.type === "string" ? [achievementKey(data.type, data.metadata)] : [],
  );

  for (const award of selectMissingAwards(awards, existingKeys)) {
    await db
      .doc(fsPath([...userAchievementsPath(uid), achievementKey(award.type, award.metadata)]))
      .set({
        type: award.type,
        metadata: award.metadata,
        achievedAt: FieldValue.serverTimestamp(),
      });
  }
}

export async function addAchievementIfNotExists(
  uid: string,
  type: string,
  metadata: Record<string, unknown>,
  matchKey?: string,
  matchValue?: unknown,
) {
  const db = getAdminDb();
  const existing = await listAchievements(uid);

  const exists = existing.some(({ data }) => {
    if (data.type !== type) return false;
    if (matchKey && matchValue !== undefined) {
      return data.metadata?.[matchKey] === matchValue;
    }
    return true;
  });
  if (exists) return;

  await db.collection(fsPath(userAchievementsPath(uid))).add({
    type,
    metadata,
    achievedAt: FieldValue.serverTimestamp(),
  });
}

export async function deleteAchievementsByLevel(uid: string, levelId: string) {
  const db = getAdminDb();
  const batch = db.batch();
  let pending = 0;

  for (const { ref, data } of await listAchievements(uid)) {
    const isLevelScoped =
      (data.type === "category_perfect" || data.type === "level_master") &&
      data.metadata?.level_id === levelId;
    const invalidatesPath = data.type === "path_complete";

    if (isLevelScoped || invalidatesPath) {
      batch.delete(ref);
      pending += 1;
    }
  }

  if (pending > 0) await batch.commit();
}

export async function deleteCategoryPerfectAchievement(
  uid: string,
  categoryId: string,
) {
  const db = getAdminDb();
  const batch = db.batch();
  const revokedKey = achievementKey("category_perfect", {
    category_id: categoryId,
  });
  let pending = 0;

  for (const { ref, data } of await listAchievements(uid)) {
    if (typeof data.type !== "string") continue;
    if (achievementKey(data.type, data.metadata) !== revokedKey) continue;
    batch.delete(ref);
    pending += 1;
  }

  if (pending > 0) await batch.commit();
}
