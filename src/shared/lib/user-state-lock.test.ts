import { beforeEach, describe, expect, it } from "vitest";
import { runExclusive } from "./user-state-lock";

describe("runExclusive", () => {
  beforeEach(() => {
    // nothing
  });

  it("runs tasks for the same uid sequentially", async () => {
    const order: string[] = [];
    let resolveFirst: (() => void) | null = null;

    const first = runExclusive("u1", async () => {
      order.push("first-start");
      await new Promise<void>((resolve) => {
        resolveFirst = resolve;
      });
      order.push("first-end");
      return "first";
    });

    // second should not start until first resolves
    const second = runExclusive("u1", async () => {
      order.push("second-start");
      order.push("second-end");
      return "second";
    });

    // give microtasks a chance
    await new Promise((r) => setTimeout(r, 0));
    expect(order).toEqual(["first-start"]);

    resolveFirst!();
    const [a, b] = await Promise.all([first, second]);
    expect(a).toBe("first");
    expect(b).toBe("second");
    expect(order).toEqual(["first-start", "first-end", "second-start", "second-end"]);
  });

  it("runs tasks for different uids concurrently", async () => {
    let resolveA: (() => void) | null = null;
    let resolveB: (() => void) | null = null;

    const a = runExclusive("ua", async () => {
      await new Promise<void>((resolve) => {
        resolveA = resolve;
      });
      return "a";
    });

    const b = runExclusive("ub", async () => {
      await new Promise<void>((resolve) => {
        resolveB = resolve;
      });
      return "b";
    });

    await new Promise((r) => setTimeout(r, 0));
    // both started
    expect(resolveA).not.toBeNull();
    expect(resolveB).not.toBeNull();

    resolveA!();
    resolveB!();
    const [ra, rb] = await Promise.all([a, b]);
    expect(ra).toBe("a");
    expect(rb).toBe("b");
  });

  it("a rejected task does not break the chain for the next task", async () => {
    const first = runExclusive("u2", async () => {
      throw new Error("boom");
    });

    await expect(first).rejects.toThrow("boom");

    const second = await runExclusive("u2", async () => "ok");
    expect(second).toBe("ok");
  });

  it("cleans up the map entry after the chain drains", async () => {
    const r = await runExclusive("u3", async () => "done");
    expect(r).toBe("done");
    // starting a new task after completion should run immediately
    const start = Date.now();
    const r2 = await runExclusive("u3", async () => "again");
    expect(r2).toBe("again");
    expect(Date.now() - start).toBeLessThan(50);
  });
});
