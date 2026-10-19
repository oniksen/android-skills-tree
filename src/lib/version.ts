const REPO = process.env.GITHUB_REPOSITORY ?? "oniksen/android-skills-tree";

export async function getLatestReleaseVersion(): Promise<string | null> {
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
  } catch {
    return null;
  }
}
