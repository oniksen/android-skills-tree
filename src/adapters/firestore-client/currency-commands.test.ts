import { beforeEach, describe, expect, it, vi } from "vitest";
import { buyItem } from "./currency-commands";

const mocks = vi.hoisted(() => ({
  doc: vi.fn(),
  runTransaction: vi.fn(),
}));

vi.mock("firebase/firestore", () => mocks);

vi.mock("@/lib/firebase", () => ({
  auth: { currentUser: { uid: "user-1" } },
  db: { name: "mock-db" },
}));

vi.mock("@/data/shop", () => ({
  getShopItem: (id: string) =>
    id === "freeze" ? { id: "freeze", price: 10 } : undefined,
}));

describe("buyItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.doc.mockReturnValue({ path: "users/user-1/currency/current" });
  });

  it("signed-out → signed-out", async () => {
    // override auth
    const firebase = await import("@/lib/firebase");
    (firebase.auth as { currentUser: unknown }).currentUser = null;
    const res = await buyItem("freeze");
    expect(res).toEqual({ ok: false, reason: "signed-out" });
    (firebase.auth as { currentUser: unknown }).currentUser = { uid: "user-1" };
  });

  it("unknown item → not-found", async () => {
    const res = await buyItem("nope");
    expect(res).toEqual({ ok: false, reason: "not-found" });
  });

  it("insufficient balance → not-enough, no write", async () => {
    mocks.runTransaction.mockImplementation(async (_db, cb) => {
      const tx = {
        get: vi.fn().mockResolvedValue({
          exists: () => true,
          data: () => ({ balance: 5, items: {} }),
        }),
        set: vi.fn(),
      };
      return cb(tx);
    });
    const res = await buyItem("freeze");
    expect(res).toEqual({ ok: false, reason: "not-enough" });
  });

  it("success → writes and returns ok", async () => {
    const setMock = vi.fn();
    mocks.runTransaction.mockImplementation(async (_db, cb) => {
      const tx = {
        get: vi.fn().mockResolvedValue({
          exists: () => true,
          data: () => ({ balance: 20, items: {} }),
        }),
        set: setMock,
      };
      return cb(tx);
    });
    const res = await buyItem("freeze");
    expect(res).toEqual({ ok: true });
    expect(setMock).toHaveBeenCalled();
  });

  it("permission-denied → permission-denied", async () => {
    mocks.runTransaction.mockRejectedValue({ code: "permission-denied" });
    const res = await buyItem("freeze");
    expect(res).toEqual({ ok: false, reason: "permission-denied" });
  });

  it("other error → error", async () => {
    mocks.runTransaction.mockRejectedValue(new Error("boom"));
    const res = await buyItem("freeze");
    expect(res).toEqual({ ok: false, reason: "error" });
  });
});
