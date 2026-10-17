import { FieldValue } from "firebase-admin/firestore";
import { fsPath, getAdminDb } from "@/adapters/firestore-admin/admin-app";
import { readAssessmentMap } from "@/adapters/firestore-admin/queries";
import {
  addAchievementsIfNotExists,
  deleteCategoryPerfectAchievement,
} from "@/adapters/firestore-admin/achievements";
import { checkLevelUp, type LevelUpResult } from "@/adapters/firestore-admin/progress";
import { syncStreak } from "@/adapters/firestore-admin/streak-commands";
import { computeAssessmentToggle } from "@/core/use-cases/compute-assessment-toggle";
import { calcSkillScore, calcTotalScore } from "@/core/domain/scoring";
import {
  evaluateAchievements,
  isCategoryPerfect,
} from "@/core/domain/achievement-conditions";
import {
  userAssessmentPath,
  userCurrencyPath,
  userProgressPath,
} from "@/adapters/firestore-client/paths";
import { skills } from "@/data/skills";
import type { CurrencyData } from "@/types";

export interface ToggleSubtopicResult {
  justCompleted: boolean;
  awarded: number;
  levelUp: LevelUpResult | null;
}

export async function toggleSubtopic(
  uid: string,
  skillId: string,
  subtopicName: string,
): Promise<ToggleSubtopicResult> {
  const db = getAdminDb();
  const assessmentRef = db.doc(fsPath(userAssessmentPath(uid, skillId)));
  const currencyRef = db.doc(fsPath(userCurrencyPath(uid)));

  try {
    const result = await db.runTransaction(async (tx) => {
      const [assessmentSnap, currencySnap] = await Promise.all([
        tx.get(assessmentRef),
        tx.get(currencyRef),
      ]);

      const storedSubtopics =
        (assessmentSnap.data()?.subtopics as Record<string, boolean> | undefined) ??
        {};
      const currency = (currencySnap.data() ?? {}) as Partial<CurrencyData>;
      const balance = typeof currency.balance === "number" ? currency.balance : 0;
      const claimedSkills =
        currency.claimedSkills && typeof currency.claimedSkills === "object"
          ? (currency.claimedSkills as Record<string, string>)
          : {};

      const { nextSubtopics, nextValue, justCompleted, awarded } =
        computeAssessmentToggle({
          skillId,
          subtopicName,
          storedSubtopics,
          claimedSkills,
        });
      const newScore = calcSkillScore(skillId, nextSubtopics);

      tx.set(
        assessmentRef,
        {
          subtopics: nextSubtopics,
          score: newScore,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      if (awarded > 0) {
        tx.set(
          currencyRef,
          {
            balance: balance + awarded,
            claimedSkills: { ...claimedSkills, [skillId]: new Date().toISOString() },
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
      }

      return { nextValue, justCompleted, awarded };
    });

    const assessmentMap = await readAssessmentMap(uid);
    const totalScore = calcTotalScore(assessmentMap);

    await db.doc(fsPath(userProgressPath(uid))).set({ totalScore }, { merge: true });

    if (result.justCompleted) {
      await addAchievementsIfNotExists(
        uid,
        evaluateAchievements(assessmentMap),
      );
    }

    const categoryId = skills.find((s) => s.id === skillId)?.categoryId;
    if (
      categoryId &&
      !result.nextValue &&
      !isCategoryPerfect(categoryId, assessmentMap)
    ) {
      await deleteCategoryPerfectAchievement(uid, categoryId);
    }

    if (result.nextValue) {
      await syncStreak(uid);
    }

    const levelUp = await checkLevelUp(uid);

    return {
      justCompleted: result.justCompleted,
      awarded: result.awarded,
      levelUp,
    };
  } catch (error) {
    console.error("Error saving assessment:", error);
    return { justCompleted: false, awarded: 0, levelUp: null };
  }
}
