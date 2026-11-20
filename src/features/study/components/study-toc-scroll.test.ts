import { describe, expect, it } from "vitest";
import {
  easeOutCubic,
  scrollTargetTop,
  TOC_SCROLL_DURATION,
} from "./study-toc-scroll";

describe("study toc scroll helpers", () => {
  it("держит положительную длительность", () => {
    expect(TOC_SCROLL_DURATION).toBeGreaterThan(0);
    expect(TOC_SCROLL_DURATION).toBeLessThan(400);
  });

  it("easeOutCubic идёт от 0 к 1 без рывков", () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);

    let previous = 0;
    for (let step = 1; step <= 10; step += 1) {
      const value = easeOutCubic(step / 10);
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });

  it("вычитает scroll-margin-top и не уходит выше нуля", () => {
    expect(scrollTargetTop(100, 500, 68)).toBe(532);
    expect(scrollTargetTop(-900, 0, 68)).toBe(0);
  });
});
