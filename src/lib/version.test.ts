import { describe, it, expect, vi, beforeEach } from "vitest";
import { getLatestReleaseVersion } from "./version";

describe("getLatestReleaseVersion", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("returns tag_name from latest stable release", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ tag_name: "v1.2.3" }),
      })
    );
    expect(await getLatestReleaseVersion()).toBe("v1.2.3");
  });

  it("falls back to tags when stable release is unavailable", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ name: "v0.9.0" }],
      });
    vi.stubGlobal("fetch", fetchMock);
    expect(await getLatestReleaseVersion()).toBe("v0.9.0");
  });

  it("returns null when no release or tag exists", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) })
    );
    expect(await getLatestReleaseVersion()).toBeNull();
  });

  it("returns the latest prerelease when requested", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { tag_name: "v1.3.0", prerelease: false },
        { tag_name: "v1.3.0-preview.1", prerelease: true },
      ],
    });
    vi.stubGlobal("fetch", fetchMock);
    expect(await getLatestReleaseVersion({ prerelease: true })).toBe(
      "v1.3.0-preview.1"
    );
  });

  it("falls back to stable release when no prerelease exists", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ tag_name: "v1.2.3", prerelease: false }],
    });
    vi.stubGlobal("fetch", fetchMock);
    expect(await getLatestReleaseVersion({ prerelease: true })).toBe("v1.2.3");
  });
});
