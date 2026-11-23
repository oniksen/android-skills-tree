import { describe, expect, it } from "vitest";
import { categoryHref, skillDetailHref } from "./viewport";

describe("categoryHref", () => {
  it("builds the category page path", () => {
    expect(categoryHref("junior", "junior-osnovy")).toBe(
      "/tree/junior/category/junior-osnovy",
    );
  });
});

describe("skillDetailHref", () => {
  it("points to the skill block on its category page", () => {
    expect(skillDetailHref("junior", "junior-kotlin-sintaks")).toBe(
      "/tree/junior/category/junior-kotlin#skill-junior-kotlin-sintaks",
    );
  });

  it("falls back to the tree for an unknown skill", () => {
    expect(skillDetailHref("junior", "no-such-skill")).toBe("/tree/junior");
  });
});
