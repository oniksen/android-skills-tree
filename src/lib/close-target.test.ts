import { describe, expect, it } from "vitest";
import { closeTargetFor } from "./close-target";

describe("closeTargetFor", () => {
  it("closes a category page back to the tree", () => {
    expect(closeTargetFor("/tree/junior/category/junior-osnovy")).toEqual({
      href: "/tree/junior",
      label: "Назад к дереву",
    });
  });

  it("closes category study back to its category page", () => {
    expect(
      closeTargetFor("/tree/junior/category/junior-osnovy/study"),
    ).toEqual({
      href: "/tree/junior/category/junior-osnovy",
      label: "Назад к категории",
    });
  });

  it("closes skill study back to the tree", () => {
    expect(
      closeTargetFor("/tree/junior/skill/junior-kotlin-sintaks/study"),
    ).toEqual({
      href: "/tree/junior",
      label: "Назад к дереву",
    });
  });

  it("normalises a trailing slash", () => {
    expect(closeTargetFor("/tree/junior/category/junior-osnovy/")).toEqual({
      href: "/tree/junior",
      label: "Назад к дереву",
    });
  });

  it("has no close button on other pages", () => {
    for (const path of [
      "/",
      "/dashboard",
      "/tree/junior",
      "/tree/junior/skill/junior-kotlin-sintaks",
    ]) {
      expect(closeTargetFor(path), path).toBeNull();
    }
  });
});
