import {
  doc,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  userProgressPath,
  userAssessmentsPath,
  userProjectsPath,
  userAchievementsPath,
  userCurrencyPath,
  userStreakPath,
  userSettingsPath,
  userStatePath,
} from "./paths";
import { achievementKey } from "@/core/domain/achievement-conditions";
import { calcSkillScore } from "@/core/domain/scoring";
import type { Observer, Unsubscribe } from "@/ports/observation";
import type {
  Achievement,
  AssessmentData,
  CurrencyData,
  ProjectProgress,
  StreakData,
  UserProgress,
  UserSettings,
  UserState,
} from "@/types";

export const STATE_SCHEMA_VERSION = 1;

export const DEFAULT_USER_PROGRESS: UserProgress = {
  currentLevelId: "junior",
  unlockedLevelIds: ["junior"],
  totalScore: 0,
};

export function defaultUserState(): UserState {
  return {
    schemaVersion: STATE_SCHEMA_VERSION,
    progress: {
      currentLevelId: "junior",
      unlockedLevelIds: ["junior"],
      totalScore: 0,
    },
    assessments: {},
    projects: {},
    achievements: {},
    currency: { balance: 0, items: {}, updatedAt: new Date() },
    streak: {
      activeDays: [],
      frozenDays: [],
      lastActiveDate: "",
      currentStreak: 0,
      longestStreak: 0,
      updatedAt: new Date(),
    },
    settings: { maxDailyQuestions: 5, updatedAt: new Date() },
  };
}

export const DEFAULT_USER_STATE: UserState = defaultUserState();

// ---- helpers ----

function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

function toDate(value: unknown, fallback: Date = new Date()): Date {
  if (isDate(value)) return value;
  if (value && typeof value === "object") {
    const v = value as { toDate?: () => Date };
    if (typeof v.toDate === "function") {
      try {
        const d = v.toDate();
        if (d instanceof Date && !isNaN(d.getTime())) return d;
      } catch {
        // fall through
      }
    }
  }
  if (typeof value === "number") {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d;
  }
  return fallback;
}

function toNullableDate(value: unknown): Date | null {
  if (value === null || value === undefined) return null;
  return toDate(value);
}

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && !isNaN(value) ? value : fallback;
}

function normalizeAssessment(key: string, raw: unknown): AssessmentData {
  const r = asObject(raw);
  const score = asNumber(r.score, 0);
  const subtopics =
    r.subtopics && typeof r.subtopics === "object" && !Array.isArray(r.subtopics)
      ? (r.subtopics as Record<string, boolean>)
      : undefined;
  // keep score as stored; if missing but subtopics present, callers may have computed
  const out: AssessmentData = { score, subtopics };
  if (r.updatedAt !== undefined) out.updatedAt = toDate(r.updatedAt);
  // ensure id not needed on AssessmentData
  void key;
  return out;
}

function normalizeProject(key: string, raw: unknown): ProjectProgress {
  const r = asObject(raw);
  return {
    projectId: asString(r.projectId, key) || key,
    completed: r.completed === true,
    completedAt: toNullableDate(r.completedAt),
  };
}

function normalizeAchievement(key: string, raw: unknown): Achievement {
  const r = asObject(raw);
  const metadata =
    r.metadata && typeof r.metadata === "object" && !Array.isArray(r.metadata)
      ? (r.metadata as Record<string, unknown>)
      : {};
  return {
    id: asString(r.id, key) || key,
    type: asString(r.type, ""),
    metadata,
    achievedAt: r.achievedAt !== undefined ? toDate(r.achievedAt) : new Date(),
    tier: (r.tier as string | null | undefined) ?? null,
    tierProgress:
      typeof r.tierProgress === "number" ? r.tierProgress : undefined,
  };
}

export function normalizeUserState(raw: unknown): UserState {
  try {
    const r = asObject(raw);
    const def = defaultUserState();

    // progress
    const rp = asObject(r.progress);
    const progress: UserProgress = {
      currentLevelId: asString(rp.currentLevelId, def.progress.currentLevelId),
      unlockedLevelIds: asArray(rp.unlockedLevelIds)
        .filter((x) => typeof x === "string") as string[],
      totalScore: asNumber(rp.totalScore, 0),
    };
    if (progress.unlockedLevelIds.length === 0) {
      progress.unlockedLevelIds = [...def.progress.unlockedLevelIds];
    }

    // assessments
    const assessments: Record<string, AssessmentData> = {};
    const ra = asObject(r.assessments);
    for (const key of Object.keys(ra)) {
      assessments[key] = normalizeAssessment(key, ra[key]);
    }

    // projects
    const projects: Record<string, ProjectProgress> = {};
    const rproj = asObject(r.projects);
    for (const key of Object.keys(rproj)) {
      projects[key] = normalizeProject(key, rproj[key]);
    }

    // achievements
    const achievements: Record<string, Achievement> = {};
    const rach = asObject(r.achievements);
    for (const key of Object.keys(rach)) {
      achievements[key] = normalizeAchievement(key, rach[key]);
    }

    // currency
    const rc = asObject(r.currency);
    const currency: CurrencyData = {
      balance: asNumber(rc.balance, 0),
      items:
        rc.items && typeof rc.items === "object" && !Array.isArray(rc.items)
          ? (rc.items as Record<string, number>)
          : {},
      claimedSkills:
        rc.claimedSkills && typeof rc.claimedSkills === "object" && !Array.isArray(rc.claimedSkills)
          ? (rc.claimedSkills as Record<string, string>)
          : undefined,
      updatedAt:
        rc.updatedAt !== undefined ? toDate(rc.updatedAt) : new Date(),
    };

    // streak
    const rs = asObject(r.streak);
    const streak: StreakData = {
      activeDays: asArray(rs.activeDays).filter((x) => typeof x === "string") as string[],
      frozenDays: asArray(rs.frozenDays).filter((x) => typeof x === "string") as string[],
      lastActiveDate: asString(rs.lastActiveDate, ""),
      currentStreak: asNumber(rs.currentStreak, 0),
      longestStreak: asNumber(rs.longestStreak, 0),
      updatedAt: rs.updatedAt !== undefined ? toDate(rs.updatedAt) : new Date(),
    };

    // settings
    const rset = asObject(r.settings);
    const settings: UserSettings = {
      groqApiKey: typeof rset.groqApiKey === "string" ? rset.groqApiKey : undefined,
      groqKeyLast4: typeof rset.groqKeyLast4 === "string" ? rset.groqKeyLast4 : undefined,
      maxDailyQuestions: asNumber(rset.maxDailyQuestions, 5),
      dailyCounts:
        rset.dailyCounts && typeof rset.dailyCounts === "object" && !Array.isArray(rset.dailyCounts)
          ? (rset.dailyCounts as Record<string, number>)
          : undefined,
      updatedAt: rset.updatedAt !== undefined ? toDate(rset.updatedAt) : new Date(),
    };

    const schemaVersion =
      typeof r.schemaVersion === "number" ? r.schemaVersion : STATE_SCHEMA_VERSION;

    const migratedAt =
      r.migratedAt !== undefined ? toDate(r.migratedAt) : undefined;

    return {
      schemaVersion,
      migratedAt,
      progress,
      assessments,
      projects,
      achievements,
      currency,
      streak,
      settings,
    };
  } catch {
    return defaultUserState();
  }
}

// ---- legacy read ----

export async function readLegacyUserState(uid: string): Promise<UserState> {
  const state = defaultUserState();

  const [
    progressSnap,
    currencySnap,
    streakSnap,
    settingsSnap,
    assessmentsSnap,
    projectsSnap,
    achievementsSnap,
  ] = await Promise.all([
    getDoc(doc(db, ...userProgressPath(uid))),
    getDoc(doc(db, ...userCurrencyPath(uid))),
    getDoc(doc(db, ...userStreakPath(uid))),
    getDoc(doc(db, ...userSettingsPath(uid))),
    getDocs(collection(db, ...userAssessmentsPath(uid))),
    getDocs(collection(db, ...userProjectsPath(uid))),
    getDocs(collection(db, ...userAchievementsPath(uid))),
  ]);

  // progress
  if (progressSnap.exists()) {
    const data = progressSnap.data() as Partial<UserProgress>;
    state.progress = {
      currentLevelId: asString(data.currentLevelId, state.progress.currentLevelId),
      unlockedLevelIds: Array.isArray(data.unlockedLevelIds)
        ? (data.unlockedLevelIds as string[])
        : state.progress.unlockedLevelIds,
      totalScore: asNumber(data.totalScore, 0),
    };
  }

  // currency
  if (currencySnap.exists()) {
    const data = currencySnap.data() as Record<string, unknown>;
    state.currency = {
      balance: asNumber(data.balance, 0),
      items:
        data.items && typeof data.items === "object" && !Array.isArray(data.items)
          ? (data.items as Record<string, number>)
          : {},
      claimedSkills:
        data.claimedSkills && typeof data.claimedSkills === "object" && !Array.isArray(data.claimedSkills)
          ? (data.claimedSkills as Record<string, string>)
          : undefined,
      updatedAt: data.updatedAt !== undefined ? toDate(data.updatedAt) : new Date(),
    };
  }

  // streak
  if (streakSnap.exists()) {
    const data = streakSnap.data() as Record<string, unknown>;
    state.streak = {
      activeDays: asArray(data.activeDays).filter((x) => typeof x === "string") as string[],
      frozenDays: asArray(data.frozenDays).filter((x) => typeof x === "string") as string[],
      lastActiveDate: asString(data.lastActiveDate, ""),
      currentStreak: asNumber(data.currentStreak, 0),
      longestStreak: asNumber(data.longestStreak, 0),
      updatedAt: data.updatedAt !== undefined ? toDate(data.updatedAt) : new Date(),
    };
  }

  // settings
  if (settingsSnap.exists()) {
    const data = settingsSnap.data() as Record<string, unknown>;
    state.settings = {
      groqApiKey: typeof data.groqApiKey === "string" ? data.groqApiKey : undefined,
      groqKeyLast4: typeof data.groqKeyLast4 === "string" ? data.groqKeyLast4 : undefined,
      maxDailyQuestions: asNumber(data.maxDailyQuestions, 5),
      dailyCounts:
        data.dailyCounts && typeof data.dailyCounts === "object" && !Array.isArray(data.dailyCounts)
          ? (data.dailyCounts as Record<string, number>)
          : undefined,
      updatedAt: data.updatedAt !== undefined ? toDate(data.updatedAt) : new Date(),
    };
  }

  // assessments collection
  assessmentsSnap.forEach((d) => {
    const data = d.data() as Record<string, unknown>;
    const subtopics =
      data.subtopics && typeof data.subtopics === "object" && !Array.isArray(data.subtopics)
        ? (data.subtopics as Record<string, boolean>)
        : undefined;
    let score = asNumber(data.score, 0);
    if (data.score === undefined && subtopics) {
      try {
        score = calcSkillScore(d.id, subtopics);
      } catch {
        score = 0;
      }
    }
    const assessment: AssessmentData = { score, subtopics };
    if (data.updatedAt !== undefined) assessment.updatedAt = toDate(data.updatedAt);
    state.assessments[d.id] = assessment;
  });

  // projects collection
  projectsSnap.forEach((d) => {
    const data = d.data() as Record<string, unknown>;
    state.projects[d.id] = {
      projectId: d.id,
      completed: data.completed === true,
      completedAt: toNullableDate(data.completedAt),
    };
  });

  // achievements collection
  achievementsSnap.forEach((d) => {
    const data = d.data() as Record<string, unknown>;
    const type = asString(data.type, "");
    const metadata =
      data.metadata && typeof data.metadata === "object" && !Array.isArray(data.metadata)
        ? (data.metadata as Record<string, unknown>)
        : {};
    const key = achievementKey(type, metadata);
    state.achievements[key] = {
      id: key,
      type,
      metadata,
      achievedAt:
        data.achievedAt !== undefined ? toDate(data.achievedAt) : new Date(),
      tier: (data.tier as string | null | undefined) ?? null,
      tierProgress:
        typeof data.tierProgress === "number" ? data.tierProgress : undefined,
    };
  });

  state.schemaVersion = STATE_SCHEMA_VERSION;
  return state;
}

// ---- migrate ----

export async function migrateUserState(uid: string): Promise<UserState> {
  const ref = doc(db, ...userStatePath(uid));

  const snap = await getDoc(ref);
  if (snap.exists()) {
    const state = normalizeUserState(snap.data());
    userStateCache.set(uid, state);
    return state;
  }

  const legacy = await readLegacyUserState(uid);
  const toWrite: UserState = {
    ...legacy,
    schemaVersion: STATE_SCHEMA_VERSION,
    migratedAt: new Date(),
  };

  let result: UserState = toWrite;
  try {
    await runTransaction(db, async (tx) => {
      const s = await tx.get(ref);
      if (s.exists()) {
        result = normalizeUserState(s.data());
        return;
      }
      tx.set(ref, toWrite);
      result = toWrite;
    });
  } catch (error) {
    console.error("migrateUserState write failed:", error);
    userStateCache.set(uid, legacy);
    return legacy;
  }

  userStateCache.set(uid, result);
  return result;
}

// ---- cache ----

const userStateCache = new Map<string, UserState>();
const userStateInFlight = new Map<string, Promise<UserState>>();

export function clearUserStateCache(): void {
  userStateCache.clear();
  userStateInFlight.clear();
}

export async function ensureUserState(uid: string): Promise<UserState> {
  const cached = userStateCache.get(uid);
  if (cached) return cached;

  const inFlight = userStateInFlight.get(uid);
  if (inFlight) return inFlight;

  const promise = (async () => {
    try {
      const state = await migrateUserState(uid);
      userStateCache.set(uid, state);
      return state;
    } finally {
      userStateInFlight.delete(uid);
    }
  })();

  userStateInFlight.set(uid, promise);
  return promise;
}

export async function readUserState(uid: string): Promise<UserState> {
  try {
    const snap = await getDoc(doc(db, ...userStatePath(uid)));
    if (snap.exists()) {
      const state = normalizeUserState(snap.data());
      userStateCache.set(uid, state);
      return state;
    }
  } catch {
    // fall through
  }
  return ensureUserState(uid);
}

// ---- subscribe ----

interface StateSubscription {
  observers: Set<Observer<UserState>>;
  stop: Unsubscribe | null;
  migrating: boolean;
}

const stateSubscriptions = new Map<string, StateSubscription>();

export function subscribeUserState(
  uid: string,
  observer: Observer<UserState>,
): Unsubscribe {
  let entry = stateSubscriptions.get(uid);
  if (!entry) {
    entry = { observers: new Set(), stop: null, migrating: false };
    stateSubscriptions.set(uid, entry);

    const ref = doc(db, ...userStatePath(uid));
    const firestoreUnsub = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          const state = normalizeUserState(snapshot.data());
          userStateCache.set(uid, state);
          entry!.observers.forEach((o) => o.next(state));
          return;
        }
        // missing doc -> migrate once
        if (entry!.migrating) return;
        entry!.migrating = true;
        migrateUserState(uid)
          .then((state) => {
            userStateCache.set(uid, state);
            entry!.observers.forEach((o) => o.next(state));
          })
          .catch((error) => {
            entry!.observers.forEach((o) => o.error?.(error));
          })
          .finally(() => {
            entry!.migrating = false;
          });
      },
      (error) => {
        entry!.observers.forEach((o) => o.error?.(error));
      },
    );
    entry.stop = firestoreUnsub;
  }

  entry.observers.add(observer);

  // emit cached state synchronously if available
  const cached = userStateCache.get(uid);
  if (cached) {
    // defer to avoid calling during subscribe? Call async via microtask
    Promise.resolve().then(() => observer.next(cached));
  }

  return () => {
    entry!.observers.delete(observer);
    if (entry!.observers.size === 0) {
      entry!.stop?.();
      stateSubscriptions.delete(uid);
    }
  };
}