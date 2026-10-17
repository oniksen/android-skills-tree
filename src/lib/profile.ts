export interface ProfileInputs {
  xp: number;
  levelName: string;
  crystals: number;
  currentStreak: number;
  longestStreak: number;
  assessedSkills: number;
  totalSkills: number;
  completedProjects: number;
  totalProjects: number;
}

export interface MatchableAchievement {
  id: string;
  matches: (achievement: {
    type: string;
    metadata: Record<string, unknown>;
  }) => boolean;
}

export interface ProfileSummary extends ProfileInputs {
  earnedAchievements: number;
  totalAchievements: number;
  earnedAchievementIds: string[];
}

export function summarizeProfile(
  inputs: ProfileInputs,
  catalog: MatchableAchievement[],
  earned: { type: string; metadata: Record<string, unknown> }[],
): ProfileSummary {
  const earnedAchievementIds = catalog
    .filter((def) => earned.some((achievement) => def.matches(achievement)))
    .map((def) => def.id);

  return {
    ...inputs,
    earnedAchievements: earnedAchievementIds.length,
    totalAchievements: catalog.length,
    earnedAchievementIds,
  };
}
