import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "src", "app", "globals.css"), "utf8");

describe("wide-screen layout css", () => {
  it("centres the study layout next to its table of contents", () => {
    expect(css).toContain("max-width: calc(72rem + 280px)");
  });

  it("keeps the shared wide content grid", () => {
    expect(css).toContain("@utility content-grid-wide");
  });
});
