import { describe, expect, it } from "vitest";
import { isPermissionDenied } from "./permission-denied";

describe("isPermissionDenied", () => {
  it("true для объекта с code permission-denied", () => {
    expect(isPermissionDenied({ code: "permission-denied" })).toBe(true);
  });

  it("true для Error-подобного объекта", () => {
    const err = new Error("nope");
    (err as { code?: string }).code = "permission-denied";
    expect(isPermissionDenied(err)).toBe(true);
  });

  it("false для другого code", () => {
    expect(isPermissionDenied({ code: "not-found" })).toBe(false);
  });

  it("false для null/undefined/примитивов", () => {
    expect(isPermissionDenied(null)).toBe(false);
    expect(isPermissionDenied(undefined)).toBe(false);
    expect(isPermissionDenied("permission-denied")).toBe(false);
    expect(isPermissionDenied(42)).toBe(false);
  });

  it("false для объекта без code", () => {
    expect(isPermissionDenied({})).toBe(false);
  });
});
