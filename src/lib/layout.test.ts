import { describe, expect, it } from "vitest";
import { pageWidthFor } from "./layout";

describe("pageWidthFor", () => {
  it("marks tree pages as wide", () => {
    expect(pageWidthFor("/tree/junior")).toBe("wide");
    expect(pageWidthFor("/tree/senior/skill/senior-arch")).toBe("wide");
  });

  it("keeps study pages separate even under /tree", () => {
    expect(pageWidthFor("/tree/junior/skill/junior-osnovy-perem/study")).toBe(
      "study",
    );
    expect(pageWidthFor("/tree/junior/category/junior-osnovy/study")).toBe(
      "study",
    );
  });

  it("gives the category detail page the full-width detail layout", () => {
    expect(pageWidthFor("/tree/junior/category/junior-osnovy")).toBe("detail");
  });

  it("marks the collection pages as wide", () => {
    for (const path of [
      "/dashboard",
      "/roadmap",
      "/projects",
      "/shop",
      "/achievements",
      "/profile",
    ]) {
      expect(pageWidthFor(path)).toBe("wide");
    }
  });

  it("gives quiz and login their own widths", () => {
    expect(pageWidthFor("/quiz")).toBe("quiz");
    expect(pageWidthFor("/login")).toBe("default");
  });
});
