import type { AchievementRepository } from "./achievement-repository";
import type { AssessmentRepository } from "./assessment-repository";
import type { AuthStateProvider } from "./auth-state-provider";
import type { CurrencyRepository } from "./currency-repository";
import type { ProgressRepository } from "./progress-repository";
import type { ProjectRepository } from "./project-repository";
import type { StreakRepository } from "./streak-repository";

export interface Services {
  auth: AuthStateProvider;
  progress: ProgressRepository;
  assessments: AssessmentRepository;
  projects: ProjectRepository;
  achievements: AchievementRepository;
  streak: StreakRepository;
  currency: CurrencyRepository;
}
