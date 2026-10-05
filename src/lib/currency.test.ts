import { describe, expect, it } from "vitest";
import { skills } from "@/data/skills";
import { categories } from "@/data/categories";
import { getShopItem, STREAK_FREEZE_ITEM_ID } from "@/data/shop";
import { getCrystalRewardForSkill } from "@/lib/currency";
import { getSkillWeight } from "@/lib/weights";

function levelIdOfCategory(categoryId: string) {
  return categories.find((c) => c.id === categoryId)?.levelId as string;
}

function totalRewardForLevel(levelId: string) {
  return skills
    .filter((s) => levelIdOfCategory(s.categoryId) === levelId)
    .reduce((sum, s) => sum + getCrystalRewardForSkill(s.id), 0);
}

describe("награда за навык", () => {
  it("равна половине веса навыка", () => {
    for (const skill of skills) {
      expect(getCrystalRewardForSkill(skill.id), `скилл ${skill.id}`).toBe(
        Math.round(getSkillWeight(skill.id) / 2),
      );
    }
  });

  it("даёт весь диапазон заявленных значений 2..15", () => {
    const rewards = skills.map((s) => getCrystalRewardForSkill(s.id));
    expect(Math.min(...rewards)).toBe(2);
    expect(Math.max(...rewards)).toBe(15);
  });

  it("неизвестный навык не даёт награды", () => {
    expect(getCrystalRewardForSkill("no-such-skill")).toBe(0);
  });

  it("чем тяжелее навык, тем больше награда", () => {
    const byWeight = [...new Set(skills.map((s) => getSkillWeight(s.id)))]
      .sort((a, b) => a - b)
      .map((weight) => {
        const skill = skills.find((s) => getSkillWeight(s.id) === weight)!;
        return getCrystalRewardForSkill(skill.id);
      });

    for (let i = 1; i < byWeight.length; i += 1) {
      expect(byWeight[i], `вес ${byWeight[i]}`).toBeGreaterThanOrEqual(byWeight[i - 1]);
    }
  });

  it("внутри одного уровня тяжёлый навык дороже лёгкого", () => {
    for (const category of categories) {
      const own = skills.filter((s) => s.categoryId === category.id);
      const easy = own.find((s) => s.difficulty === "easy");
      const hard = own.find((s) => s.difficulty === "hard");
      if (easy && hard) {
        expect(getCrystalRewardForSkill(hard.id), category.id).toBeGreaterThan(
          getCrystalRewardForSkill(easy.id),
        );
      }
    }
  });

  it("одна и та же тема дороже на старшем уровне", () => {
    const easyJunior = skills.find(
      (s) => s.difficulty === "easy" && levelIdOfCategory(s.categoryId) === "junior",
    )!;
    const hardSenior = skills.find(
      (s) => s.difficulty === "hard" && levelIdOfCategory(s.categoryId) === "senior",
    )!;

    expect(getCrystalRewardForSkill(hardSenior.id)).toBeGreaterThan(
      getCrystalRewardForSkill(easyJunior.id),
    );
  });
});

describe("экономика кристаллов", () => {
  it("всего начисляется 1634 кристалла за полное прохождение", () => {
    const total = skills.reduce((sum, s) => sum + getCrystalRewardForSkill(s.id), 0);
    expect(total).toBe(1634);
  });

  it("сумма по уровням сходится с общим итогом", () => {
    const perLevel = ["junior", "middle", "strong-middle", "senior"].reduce(
      (sum, levelId) => sum + totalRewardForLevel(levelId),
      0,
    );
    const total = skills.reduce((sum, s) => sum + getCrystalRewardForSkill(s.id), 0);
    expect(perLevel).toBe(total);
  });

  it("за уровень начисляется 161 / 403 / 314 / 756 кристаллов", () => {
    expect(totalRewardForLevel("junior")).toBe(161);
    expect(totalRewardForLevel("middle")).toBe(403);
    expect(totalRewardForLevel("strong-middle")).toBe(314);
    expect(totalRewardForLevel("senior")).toBe(756);
  });

  it("использует ровно 8 различных наград", () => {
    const distinct = new Set(skills.map((s) => getCrystalRewardForSkill(s.id)));
    expect([...distinct].sort((a, b) => a - b)).toEqual([2, 3, 5, 6, 8, 9, 10, 15]);
  });

  it("заморозка стоит 20 кристаллов и недоступна за один самый дорогой навык", () => {
    const freeze = getShopItem(STREAK_FREEZE_ITEM_ID)!;
    expect(freeze.price).toBe(20);
    expect(freeze.maxOwned).toBe(3);

    const bestReward = Math.max(...skills.map((s) => getCrystalRewardForSkill(s.id)));
    expect(bestReward).toBeLessThan(freeze.price);
  });

  it("на полное прохождение хватает примерно на 81 заморозку", () => {
    const total = skills.reduce((sum, s) => sum + getCrystalRewardForSkill(s.id), 0);
    const price = getShopItem(STREAK_FREEZE_ITEM_ID)!.price;
    expect(Math.floor(total / price)).toBe(81);
  });
});