import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  achievementKey,
  selectMissingAwards,
  type AchievementAward,
} from "@/core/domain/achievement-conditions";
import {
  userProgressPath,
  userProjectsPath,
  userAchievementsPath,
} from "@/adapters/firestore-client/paths";
import type { UserProgress } from "@/types";

// ============ User Progress ============

const DEFAULT_USER_PROGRESS: UserProgress = {
  currentLevelId: "junior",
  unlockedLevelIds: ["junior"],
  totalScore: 0,
};

export async function getUserProgress(uid: string): Promise<UserProgress> {
  const progressRef = doc(db, ...userProgressPath(uid));
  const snap = await getDoc(progressRef);

  if (!snap.exists()) {
    await setDoc(progressRef, DEFAULT_USER_PROGRESS);
    return DEFAULT_USER_PROGRESS;
  }

  return snap.data() as UserProgress;
}

export async function updateUserProgress(
  uid: string,
  data: Partial<UserProgress>,
) {
  const progressRef = doc(db, ...userProgressPath(uid));
  const snap = await getDoc(progressRef);

  if (!snap.exists()) {
    await setDoc(progressRef, { ...DEFAULT_USER_PROGRESS, ...data });
  } else {
    await updateDoc(progressRef, data);
  }
}

// ============ Project Progress ============

export async function getProjectProgressMap(
  uid: string,
): Promise<Record<string, boolean>> {
  const projectsRef = collection(db, ...userProjectsPath(uid));
  const snap = await getDocs(projectsRef);

  const map: Record<string, boolean> = {};
  snap.forEach((d) => {
    map[d.id] = d.data().completed;
  });
  return map;
}

// ============ Achievements ============

export async function addAchievementIfNotExists(
  uid: string,
  type: string,
  metadata: Record<string, unknown>,
  matchKey?: string,
  matchValue?: unknown,
) {
  const achievementsRef = collection(db, ...userAchievementsPath(uid));
  const snap = await getDocs(achievementsRef);

  const exists = snap.docs.some((doc) => {
    const data = doc.data();
    if (data.type !== type) return false;
    if (matchKey && matchValue !== undefined) {
      return data.metadata?.[matchKey] === matchValue;
    }
    return true;
  });

  if (!exists) {
    const newRef = doc(achievementsRef);
    await setDoc(newRef, {
      type,
      metadata,
      achievedAt: new Date(),
    });
  }
}

export async function addAchievementsIfNotExists(
  uid: string,
  awards: AchievementAward[],
) {
  if (awards.length === 0) return;

  const achievementsRef = collection(db, ...userAchievementsPath(uid));
  const snap = await getDocs(achievementsRef);

  const existingKeys = snap.docs.flatMap((d) => {
    const data = d.data() as { type?: string; metadata?: Record<string, unknown> };
    if (typeof data.type !== "string") return [];
    return [achievementKey(data.type, data.metadata)];
  });

  for (const award of selectMissingAwards(awards, existingKeys)) {
    await setDoc(doc(achievementsRef, achievementKey(award.type, award.metadata)), {
      type: award.type,
      metadata: award.metadata,
      achievedAt: new Date(),
    });
  }
}

export async function deleteAchievementsByLevel(uid: string, levelId: string) {
  const achievementsRef = collection(db, ...userAchievementsPath(uid));
  const snap = await getDocs(achievementsRef);

  for (const achievementDoc of snap.docs) {
    const data = achievementDoc.data() as {
      type?: string;
      metadata?: Record<string, unknown>;
    };
    const isLevelScoped =
      (data.type === "category_perfect" || data.type === "level_master") &&
      data.metadata?.level_id === levelId;
    const invalidatesPath = data.type === "path_complete";

    if (isLevelScoped || invalidatesPath) {
      await deleteDoc(achievementDoc.ref);
    }
  }
}

export async function deleteCategoryPerfectAchievement(uid: string, categoryId: string) {
  const achievementsRef = collection(db, ...userAchievementsPath(uid));
  const snap = await getDocs(achievementsRef);

  const revokedKey = achievementKey("category_perfect", { category_id: categoryId });

  for (const achievementDoc of snap.docs) {
    const data = achievementDoc.data() as {
      type?: string;
      metadata?: Record<string, unknown>;
    };
    if (typeof data.type !== "string") continue;
    if (achievementKey(data.type, data.metadata) !== revokedKey) continue;

    await deleteDoc(achievementDoc.ref);
  }
}
