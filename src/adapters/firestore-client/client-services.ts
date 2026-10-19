import { createFirebaseAuthStateProvider } from "@/adapters/auth/firebase-auth-state";
import { createAchievementRepository } from "./achievement-repository";
import { createAssessmentRepository } from "./assessment-repository";
import { createCurrencyRepository } from "./currency-repository";
import { createProgressRepository } from "./progress-repository";
import { createProjectRepository } from "./project-repository";
import { createStreakRepository } from "./streak-repository";
import type { Services } from "@/ports/services";

export function createClientServices(): Services {
  return {
    auth: createFirebaseAuthStateProvider(),
    progress: createProgressRepository(),
    assessments: createAssessmentRepository(),
    projects: createProjectRepository(),
    achievements: createAchievementRepository(),
    streak: createStreakRepository(),
    currency: createCurrencyRepository(),
  };
}
