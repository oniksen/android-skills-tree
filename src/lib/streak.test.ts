import { describe, expect, it } from "vitest";
import { collectMissedDays, computeStreaks } from "@/lib/streak";

// Опорный день — середина января: за пределами этого диапазона в некоторых
// странах меняется переход на летнее время, а shiftDay работает по локальному календарю.
const BASE = Date.UTC(2026, 0, 15);

function day(offset: number): string {
  const d = new Date(BASE + offset * 86_400_000);
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const date = String(d.getUTCDate()).padStart(2, "0");
  return `${d.getUTCFullYear()}-${month}-${date}`;
}

const TODAY = day(0);

describe("computeStreaks", () => {
  it("считает стрик подряд идущих активных дней до сегодня", () => {
    expect(computeStreaks([day(-3), day(-2), day(-1), TODAY], [], TODAY).currentStreak).toBe(4);
  });

  it("не учитывает сегодня, пока в него не зашли", () => {
    expect(computeStreaks([day(-3), day(-2), day(-1)], [], TODAY).currentStreak).toBe(3);
  });

  it("обнуляется если пропущены и сегодня и вчера", () => {
    expect(computeStreaks([day(-3), day(-2)], [], TODAY).currentStreak).toBe(0);
  });

  it("замороженный день продолжает стрик так же как активный", () => {
    const activeOnly = computeStreaks([day(-3), day(-2), day(-1)], [], TODAY);
    const withFreeze = computeStreaks([day(-3), day(-2)], [day(-1)], TODAY);

    expect(withFreeze.currentStreak).toBe(activeOnly.currentStreak);
  });

  it("замороженный день заменяет пропуск в середине отрезка", () => {
    const withGap = computeStreaks([day(-4), day(-3)], [], TODAY);
    const withFreezes = computeStreaks([day(-4), day(-3)], [day(-2), day(-1)], TODAY);

    expect(withGap.currentStreak).toBe(0);
    expect(withFreezes.currentStreak).toBe(4);
  });

  it("дубли дня в активных и замороженных не дают двойного стрика", () => {
    expect(computeStreaks([day(-1), TODAY], [day(-1), TODAY], TODAY).currentStreak).toBe(2);
  });

  it("пустая история даёт нули", () => {
    expect(computeStreaks([], [], TODAY)).toEqual({ currentStreak: 0, longestStreak: 0 });
  });

  it("рекорд не уменьшается после разрыва", () => {
    const broken = computeStreaks([day(-10), day(-9), day(-8), day(-3)], [], TODAY);

    expect(broken.currentStreak).toBe(0);
    expect(broken.longestStreak).toBe(3);
  });

  it("рекорд учитывает лучший отрезок из всех", () => {
    const result = computeStreaks(
      [day(-10), day(-9), day(-8), day(-7), day(-2), day(-1), TODAY],
      [],
      TODAY,
    );

    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(4);
  });

  it("не зависит от порядка и дублей во входных данных", () => {
    const straight = computeStreaks([day(-2), day(-1), TODAY], [], TODAY);
    const shuffled = computeStreaks([TODAY, day(-1), TODAY, day(-2), day(-1)], [], TODAY);

    expect(shuffled).toEqual(straight);
  });

  it("завтрашний день из данных не влияет на сегодняшний стрик", () => {
    expect(computeStreaks([day(-1), TODAY, day(1)], [], TODAY).currentStreak).toBe(2);
  });
});

describe("collectMissedDays", () => {
  it("пуст когда вчера был активен", () => {
    expect(collectMissedDays([day(-1)], [], TODAY)).toEqual([]);
  });

  it("пуст для нового пользователя без единого дня", () => {
    expect(collectMissedDays([], [], TODAY)).toEqual([]);
  });

  it("пуст если пропуск уже закрыт заморозкой", () => {
    expect(collectMissedDays([day(-2)], [day(-1)], TODAY)).toEqual([]);
  });

  it("не считает сегодня пропуском", () => {
    expect(collectMissedDays([day(-1)], [], TODAY)).toEqual([]);
  });

  it("находит один пропущенный день", () => {
    expect(collectMissedDays([day(-2)], [], TODAY)).toEqual([day(-1)]);
  });

  it("останавливается на первом покрытом дне", () => {
    expect(collectMissedDays([day(-6), day(-3)], [], TODAY)).toEqual([day(-2), day(-1)]);
  });

  it("возвращает пропуски в хронологическом порядке от первого ко дню последнего захода", () => {
    expect(collectMissedDays([day(-6)], [], TODAY)).toEqual([
      day(-5),
      day(-4),
      day(-3),
      day(-2),
      day(-1),
    ]);
  });

  it("не ограничивает длину пропуска", () => {
    expect(collectMissedDays([day(-40)], [], TODAY)).toHaveLength(39);
  });
});

describe("заморозки покрывают пропуски по порядку", () => {
  function applyBudget(activeDays: string[], frozenDays: string[], freezes: number) {
    const missed = collectMissedDays(activeDays, frozenDays, TODAY);
    return {
      frozen: [...frozenDays, ...missed.slice(0, freezes)],
      unfunded: missed.length - Math.min(missed.length, freezes),
    };
  }

  it("хватает заморозок — стрик непрерывен до последнего захода", () => {
    const budget = applyBudget([day(-3)], [], 2);

    expect(budget.frozen).toEqual([day(-2), day(-1)]);
    expect(budget.unfunded).toBe(0);
    expect(computeStreaks([day(-3)], budget.frozen, TODAY).currentStreak).toBe(3);
  });

  it("заморозок не хватает — стрик начинается заново с сегодняшнего дня", () => {
    const activeDays = [day(-5), day(-4), day(-3), TODAY];
    const budget = applyBudget(activeDays, [], 1);

    expect(budget.frozen).toEqual([day(-2)]);
    expect(budget.unfunded).toBe(1);

    const streaks = computeStreaks(activeDays, budget.frozen, TODAY);
    expect(streaks.currentStreak).toBe(1);
    expect(streaks.longestStreak).toBe(4);
  });

  it("закрываются самые давные пропуски, а не самые свежие", () => {
    expect(collectMissedDays([day(-6), TODAY], [], TODAY)).toEqual([
      day(-5),
      day(-4),
      day(-3),
      day(-2),
      day(-1),
    ]);

    const budget = applyBudget([day(-6), TODAY], [], 2);
    expect(budget.frozen).toEqual([day(-5), day(-4)]);
    expect(budget.unfunded).toBe(3);
  });

  it("без заморозок пропуски остаются незакрытыми", () => {
    const budget = applyBudget([day(-3)], [], 0);

    expect(budget.frozen).toEqual([]);
    expect(budget.unfunded).toBe(2);
    expect(computeStreaks([day(-3)], budget.frozen, TODAY).currentStreak).toBe(0);
  });

  it("повторный запуск не тратит заморозки второй раз", () => {
    const first = applyBudget([day(-3)], [], 3);

    expect(first.unfunded).toBe(0);
    expect(collectMissedDays([day(-3)], first.frozen, TODAY)).toEqual([]);
  });
});
