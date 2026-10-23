export const USERS = "users" as const;
export const PROGRESS = "progress" as const;
export const ASSESSMENTS = "assessments" as const;
export const PROJECTS = "projects" as const;
export const ACHIEVEMENTS = "achievements" as const;
export const CURRENCY = "currency" as const;
export const STREAKS = "streaks" as const;
export const SETTINGS = "settings" as const;
export const CURRENT = "current" as const;

export function userProgressPath(uid: string): [string, ...string[]] {
  return [USERS, uid, PROGRESS, CURRENT];
}

export function userAssessmentsPath(uid: string): [string, ...string[]] {
  return [USERS, uid, ASSESSMENTS];
}

export function userAssessmentPath(uid: string, skillId: string): [string, ...string[]] {
  return [USERS, uid, ASSESSMENTS, skillId];
}

export function userProjectsPath(uid: string): [string, ...string[]] {
  return [USERS, uid, PROJECTS];
}

export function userProjectPath(uid: string, projectId: string): [string, ...string[]] {
  return [USERS, uid, PROJECTS, projectId];
}

export function userAchievementsPath(uid: string): [string, ...string[]] {
  return [USERS, uid, ACHIEVEMENTS];
}

export function userCurrencyPath(uid: string): [string, ...string[]] {
  return [USERS, uid, CURRENCY, CURRENT];
}

export function userStreakPath(uid: string): [string, ...string[]] {
  return [USERS, uid, STREAKS, CURRENT];
}

export function userSettingsPath(uid: string): [string, ...string[]] {
  return [USERS, uid, SETTINGS, CURRENT];
}
