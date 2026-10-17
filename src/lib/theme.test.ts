import { describe, it, expect } from "vitest";
import {
  DEFAULT_PREFERENCE,
  NO_FLASH_SCRIPT,
  THEME_COLORS,
  THEME_STORAGE_KEY,
  isThemePreference,
  parseStoredTheme,
  resolveTheme,
} from "@/lib/theme";

describe("isThemePreference", () => {
  it("accepts the three preferences", () => {
    expect(isThemePreference("light")).toBe(true);
    expect(isThemePreference("dark")).toBe(true);
    expect(isThemePreference("system")).toBe(true);
  });

  it("rejects other values", () => {
    expect(isThemePreference("blue")).toBe(false);
    expect(isThemePreference(null)).toBe(false);
    expect(isThemePreference(undefined)).toBe(false);
    expect(isThemePreference(1)).toBe(false);
  });
});

describe("parseStoredTheme", () => {
  it("returns a valid stored value", () => {
    expect(parseStoredTheme("dark")).toBe("dark");
  });

  it("falls back to the default for invalid or missing values", () => {
    expect(parseStoredTheme(null)).toBe(DEFAULT_PREFERENCE);
    expect(parseStoredTheme("garbage")).toBe(DEFAULT_PREFERENCE);
    expect(DEFAULT_PREFERENCE).toBe("system");
  });
});

describe("resolveTheme", () => {
  it("resolves explicit preferences regardless of system", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("follows the system preference", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });
});

describe("THEME_COLORS", () => {
  it("exposes a color per resolved theme", () => {
    expect(THEME_COLORS.light).toBe("#faf9f5");
    expect(THEME_COLORS.dark).toBe("#16140f");
  });
});

describe("NO_FLASH_SCRIPT", () => {
  it("reads the storage key and handles system", () => {
    expect(NO_FLASH_SCRIPT).toContain(THEME_STORAGE_KEY);
    expect(NO_FLASH_SCRIPT).toContain("prefers-color-scheme: dark");
    expect(NO_FLASH_SCRIPT).toContain("data-theme");
  });
});
