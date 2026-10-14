import { afterEach, describe, expect, it, vi } from "vitest";
import { MOBILE_BREAKPOINT, isDesktopViewport, skillDetailHref } from "./viewport";

function mockMatchMedia(matches: boolean) {
  const matchMedia = vi.fn().mockReturnValue({ matches });
  vi.stubGlobal("window", { matchMedia });
  return matchMedia;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("isDesktopViewport", () => {
  it("returns true when there is no window (server render)", () => {
    expect(isDesktopViewport()).toBe(true);
  });

  it("queries the viewport against the mobile breakpoint", () => {
    const matchMedia = mockMatchMedia(true);
    expect(isDesktopViewport()).toBe(true);
    expect(matchMedia).toHaveBeenCalledWith(`(min-width: ${MOBILE_BREAKPOINT}px)`);
  });

  it("returns false on a mobile viewport", () => {
    mockMatchMedia(false);
    expect(isDesktopViewport()).toBe(false);
  });

  it("falls back to desktop when matchMedia is unavailable", () => {
    vi.stubGlobal("window", {});
    expect(isDesktopViewport()).toBe(true);
  });
});

describe("skillDetailHref", () => {
  it("builds the nested skill detail path", () => {
    expect(skillDetailHref("junior", "junior-kotlin-sintaks")).toBe(
      "/tree/junior/skill/junior-kotlin-sintaks",
    );
  });
});
