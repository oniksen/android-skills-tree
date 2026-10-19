import { beforeEach, describe, expect, it, vi } from "vitest";

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
  addAchievementIfNotExists: vi.fn(),
  addAchievementsIfNotExists: vi.fn(),
}));

vi.mock("@/adapters/firestore-client/streak-commands", () => ({
  syncStreak: vi.fn().mockResolvedValue(null),
}));

import { getUserProgress } from "@/lib/firestore";

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
    (getUserProgress as ReturnType<typeof vi.fn>).mockResolvedValue({
      currentLevelId: "senior",
      unlockedLevelIds: ["junior", "middle", "strong-middle", "senior"],
      totalScore: 1000,
    });
    const { checkLevelUp } = await import("./firestore-actions");
    const res = await checkLevelUp();
    expect(res).toBeNull();
  });

  it("null если категория не набрала порог", async () => {
    (getUserProgress as ReturnType<typeof vi.fn>).mockResolvedValue({
      currentLevelId: "junior",
      unlockedLevelIds: ["junior"],
      totalScore: 0,
    });
    // readAssessmentMap returns empty → category score 0 < threshold
    mocks.getDocs.mockResolvedValue({ forEach: () => {}, docs: [] });
    const { checkLevelUp } = await import("./firestore-actions");
    const res = await checkLevelUp();
    expect(res).toBeNull();
  });
});
