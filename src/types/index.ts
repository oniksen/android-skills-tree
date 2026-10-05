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
