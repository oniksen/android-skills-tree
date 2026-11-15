export interface UserProgress {
  currentLevelId: string;
  unlockedLevelIds: string[];
  totalScore: number;
}

export interface Assessment {
  skillId: string;
  score: number;
  subtopics?: Record<string, boolean>;
  updatedAt: Date;
}

export interface AssessmentData {
  score: number;
  subtopics?: Record<string, boolean>;
  updatedAt?: Date;
}

export interface UserState {
  schemaVersion: number;
  migratedAt?: Date;
  progress: UserProgress;
  assessments: Record<string, AssessmentData>;
  projects: Record<string, ProjectProgress>;
  achievements: Record<string, Achievement>;
  currency: CurrencyData;
  streak: StreakData;
  settings: UserSettings;
}

export interface ProjectProgress {
  projectId: string;
  completed: boolean;
  completedAt: Date | null;
}

export interface Achievement {
  id: string;
  type: string;
  metadata: Record<string, unknown>;
  achievedAt: Date;
  tier?: string | null;
  tierProgress?: number;
}

export interface StreakData {
  activeDays: string[];
  frozenDays: string[];
  lastActiveDate: string;
  currentStreak: number;
  longestStreak: number;
  updatedAt: Date;
}

export interface CurrencyData {
  balance: number;
  items: Record<string, number>;
  claimedSkills?: Record<string, string>;
  updatedAt: Date;
}

export interface UserSettings {
  groqApiKey?: string;
  groqKeyLast4?: string;
  maxDailyQuestions?: number;
  dailyCounts?: Record<string, number>;
  updatedAt: Date;
}
