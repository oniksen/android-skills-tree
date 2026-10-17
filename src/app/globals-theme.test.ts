import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const css = readFileSync(resolve(process.cwd(), "src", "app", "globals.css"), "utf8");

describe("globals.css theming", () => {
  it("defines a dark theme scope", () => {
    expect(css).toContain('[data-theme="dark"]');
  });

  it("overrides the neutral scale inside the dark scope", () => {
    expect(css).toContain("--color-slate-950: #16140f;");
    expect(css).toContain("--color-white: #f2f0e9;");
  });

  it("drives body from semantic variables", () => {
    expect(css).toContain("background-color: var(--bg);");
    expect(css).toContain("color: var(--fg);");
  });

  it("declares a color-scheme per theme", () => {
    expect(css).toContain("color-scheme: light;");
    expect(css).toContain("color-scheme: dark;");
  });
});
