const REPO = process.env.GITHUB_REPOSITORY ?? "oniksen/android-skills-tree";

interface GetLatestReleaseVersionOptions {
  prerelease?: boolean;
}

export async function getLatestReleaseVersion(
  options: GetLatestReleaseVersionOptions = {}
): Promise<string | null> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "android-skills-tree",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const fetchOpts = {
    headers,
    cache: "force-cache" as const,
    next: { revalidate: 3600, tags: ["github-release"] },
  };

  try {
    if (!options.prerelease) {
      const releaseRes = await fetch(
        `https://api.github.com/repos/${REPO}/releases/latest`,
        fetchOpts
      );
      if (releaseRes.ok) {
        const data = (await releaseRes.json()) as { tag_name?: string };
        if (data.tag_name) return data.tag_name;
      }

      const tagsRes = await fetch(
        `https://api.github.com/repos/${REPO}/tags?per_page=1`,
        fetchOpts
      );
      if (tagsRes.ok) {
        const data = (await tagsRes.json()) as { name?: string }[];
        if (Array.isArray(data) && data[0]?.name) return data[0].name;
      }

      return null;
    }

    const releasesRes = await fetch(
      `https://api.github.com/repos/${REPO}/releases?per_page=30`,
      fetchOpts
    );
    if (releasesRes.ok) {
      const releases = (await releasesRes.json()) as {
        tag_name?: string;
        prerelease?: boolean;
      }[];
      const prerelease = releases.find((release) => release.prerelease);
      if (prerelease?.tag_name) return prerelease.tag_name;

      const stable = releases.find((release) => !release.prerelease);
      if (stable?.tag_name) return stable.tag_name;
    }

    const releaseRes = await fetch(
      `https://api.github.com/repos/${REPO}/releases/latest`,
      fetchOpts
    );
    if (releaseRes.ok) {
      const data = (await releaseRes.json()) as { tag_name?: string };
      if (data.tag_name) return data.tag_name;
    }

    return null;
  } catch {
    return null;
  }
}


export function normalizeReleaseVersion(tag: string | null | undefined): string {
  if (!tag) return "unknown";
  const match = tag.match(/v?(\d+\.\d+\.\d+)/);
  return match ? `v${match[1]}` : tag;
}
