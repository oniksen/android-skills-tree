import { describe, it, expect, vi, beforeEach } from "vitest";
import { getLatestReleaseVersion } from "./version";

describe("getLatestReleaseVersion", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("returns tag_name from latest release", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ tag_name: "v1.2.3" }),
      })
    );
    expect(await getLatestReleaseVersion()).toBe("v1.2.3");
  });

  it("falls back to tags when release is unavailable", async () => {
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
});
