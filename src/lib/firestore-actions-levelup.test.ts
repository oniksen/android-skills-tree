import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AssessmentData, ProjectProgress } from "@/types";
import type { Skill } from "@/data/skills";
import { getSkillsByLevelId } from "@/data/skills";
import { getCategoriesByLevelId } from "@/data/categories";
import { getCategoryMaxScore } from "@/core/domain/weights";
import {
  getLevelUpRequirements,
  getNextLevel,
} from "@/core/domain/level-requirements";

const mocks = vi.hoisted(() => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  runTransaction: vi.fn(),
}));

vi.mock("firebase/firestore", () => mocks);

vi.mock("@/lib/firebase", () => ({
  auth: { currentUser: { uid: "user-1" } },
  db: { name: "mock-db" },
}));

vi.mock("@/lib/firestore", () => ({
  getUserProgress: vi.fn(),
  updateUserProgress: vi.fn(),
  getProjectProgressMap: vi.fn(),
  reconcileAchievements: vi.fn(),
}));

vi.mock("@/adapters/firestore-client/streak-commands", () => ({
  getStreak: vi.fn().mockResolvedValue(null),
  syncStreak: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/adapters/firestore-client/state", () => ({
  readUserState: vi.fn(),
  ensureUserState: vi.fn(),
}));

const JUNIOR = "junior";

function completedSkill(skill: Skill, score = 1): AssessmentData {
  return {
    score,
    subtopics: Object.fromEntries(skill.subtopics.map((name) => [name, true])),
  };
}

function completedLevelAssessment(
  levelId: string,
): Record<string, AssessmentData> {
  return Object.fromEntries(
    getSkillsByLevelId(levelId).map((skill) => [
      skill.id,
      completedSkill(skill),
    ]),
  );
}

function project(projectId: string, completed: boolean): ProjectProgress {
  return {
    projectId,
    completed,
    completedAt: completed ? new Date(0) : null,
  };
}

function completedProjects(count: number): Record<string, ProjectProgress> {
  return Object.fromEntries(
    Array.from({ length: count }, (_, index) => {
      const projectId = `project-${index + 1}`;
      return [projectId, project(projectId, true)];
    }),
  );
}

type LevelUpFixture = {
  name: string;
  assessments: Record<string, AssessmentData>;
  projects: Record<string, ProjectProgress>;
  expectedUnmet: string[];
};

function levelUpFixtures(nextLevel: NonNullable<ReturnType<typeof getNextLevel>>): LevelUpFixture[] {
  const allJunior = completedLevelAssessment(JUNIOR);

  // Keep the weakest category's required skill complete but drop its optional
  // skills, so the category gate fails while the required-skill gate stays
  // satisfied.
  const weakestCategory = getCategoriesByLevelId(JUNIOR).reduce(
    (weakest, category) =>
      getCategoryMaxScore(category.id) < getCategoryMaxScore(weakest.id)
        ? category
        : weakest,
  );
  const categoryBelowThreshold = Object.fromEntries(
    getSkillsByLevelId(JUNIOR)
      .filter(
        (skill) =>
          skill.categoryId !== weakestCategory.id || skill.requiredForLevelUp,
      )
      .map((skill) => [skill.id, completedSkill(skill)]),
  );

  // All subtopics stay complete (categories pass) but the required skills of
  // one category report score 0, so only the skills gate fails.
  const missingRequiredSkills = Object.fromEntries(
    getSkillsByLevelId(JUNIOR).map((skill) => [
      skill.id,
      skill.categoryId === "junior-kotlin" && skill.requiredForLevelUp
        ? { ...completedSkill(skill), score: 0 }
        : completedSkill(skill),
    ]),
  );

  return [
    {
      name: "all gates are met",
      assessments: allJunior,
      projects: completedProjects(nextLevel.requiredProjectCount),
      expectedUnmet: [],
    },
    {
      name: `the XP gate passes but ${weakestCategory.id} stays below the category threshold`,
      assessments: categoryBelowThreshold,
      projects: completedProjects(nextLevel.requiredProjectCount),
      expectedUnmet: ["categories"],
    },
    {
      name: "required current-level skills have no score",
      assessments: missingRequiredSkills,
      projects: completedProjects(nextLevel.requiredProjectCount),
      expectedUnmet: ["skills"],
    },
    {
      name: "fewer projects are completed than required",
      assessments: allJunior,
      projects: completedProjects(nextLevel.requiredProjectCount - 1),
      expectedUnmet: ["projects"],
    },
  ];
}

describe("checkLevelUp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.collection.mockImplementation((...s: unknown[]) => ({ path: s.slice(1).join("/") }));
    mocks.doc.mockReturnValue({ name: "doc-ref" });
    mocks.getDocs.mockResolvedValue({ forEach: () => {} });
    mocks.setDoc.mockResolvedValue(undefined);
    mocks.updateDoc.mockResolvedValue(undefined);
  });

  it("null при максимальном уровне", async () => {
    const stateMod = await import("@/adapters/firestore-client/state");
    (stateMod.readUserState as ReturnType<typeof vi.fn>).mockResolvedValue({
      progress: {
        currentLevelId: "senior",
        unlockedLevelIds: ["junior", "middle", "strong-middle", "senior"],
        totalScore: 1000,
      },
      assessments: {},
      projects: {},
    });
    const { checkLevelUp } = await import("./firestore-actions");
    const res = await checkLevelUp();
    expect(res).toBeNull();
  });

  it("null если категория не набрала порог", async () => {
    const stateMod = await import("@/adapters/firestore-client/state");
    (stateMod.readUserState as ReturnType<typeof vi.fn>).mockResolvedValue({
      progress: {
        currentLevelId: "junior",
        unlockedLevelIds: ["junior"],
        totalScore: 0,
      },
      assessments: {},
      projects: {},
    });
    mocks.getDocs.mockResolvedValue({ forEach: () => {}, docs: [] });
    const { checkLevelUp } = await import("./firestore-actions");
    const res = await checkLevelUp();
    expect(res).toBeNull();
  });

  const nextLevel = getNextLevel(JUNIOR);
  if (!nextLevel) throw new Error("junior must have a next level");

  it.each(levelUpFixtures(nextLevel))(
    "agrees with getLevelUpRequirements when $name",
    async (fixture) => {
      const stateMod = await import("@/adapters/firestore-client/state");
      (stateMod.readUserState as ReturnType<typeof vi.fn>).mockResolvedValue({
        progress: {
          currentLevelId: JUNIOR,
          unlockedLevelIds: [JUNIOR],
          totalScore: 0,
        },
        assessments: fixture.assessments,
        projects: fixture.projects,
      });

      const requirements = getLevelUpRequirements({
        currentLevelId: JUNIOR,
        nextLevel,
        assessmentMap: fixture.assessments,
        projectMap: Object.fromEntries(
          Object.entries(fixture.projects).map(([id, progress]) => [
            id,
            progress.completed,
          ]),
        ),
      });

      expect(
        requirements
          .filter((requirement) => !requirement.done)
          .map((requirement) => requirement.id),
      ).toEqual(fixture.expectedUnmet);

      const allDone = requirements.every((requirement) => requirement.done);

      const { checkLevelUp } = await import("./firestore-actions");
      const result = await checkLevelUp();

      expect(result !== null).toBe(allDone);
    },
  );
});
