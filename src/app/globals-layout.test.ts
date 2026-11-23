import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "src", "app", "globals.css"), "utf8");

describe("wide-screen layout css", () => {
  it("stretches the study layout across the available width", () => {
    expect(css).not.toContain("max-width: calc(72rem + 280px)");
    expect(css).not.toContain("max-width: 72rem");
  });

  it("keeps the desktop table of contents beside the article", () => {
    expect(css).toContain("@media (min-width: 1280px)");
    expect(css).toContain("grid-template-columns: 280px minmax(0, 1fr)");
  });

  it("keeps the shared wide content grid", () => {
    expect(css).toContain("@utility content-grid-wide");
  });

  it("keeps two columns on tablets before switching to auto-fill", () => {
    for (const file of [
      ["src", "features", "achievements", "components", "AchievementsClient.tsx"],
      ["src", "features", "projects", "components", "ProjectsClient.tsx"],
    ]) {
      const source = readFileSync(resolve(process.cwd(), ...file), "utf8");
      expect(source).toContain(
        "md:grid-cols-2 xl:grid-cols-[repeat(auto-fill,minmax(min(24rem,100%),1fr))]",
      );
    }
  });
});
