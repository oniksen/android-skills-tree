import { execSync } from "node:child_process";
import { DEVELOPMENT_VERSION } from "./version";

// Resolved once per server process instead of on every layout render.
let cachedVersion: string | null = null;

export function getDevelopmentVersion(): string {
  if (cachedVersion) return cachedVersion;

  let sha = "local";
  try {
    sha = execSync("git rev-parse --short HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    // ignore; fall back to env or "local"
  }
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    sha = process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  } else if (process.env.GIT_COMMIT_SHA) {
    sha = process.env.GIT_COMMIT_SHA.slice(0, 7);
  }
  cachedVersion = `v${DEVELOPMENT_VERSION}-dev+${sha}`;
  return cachedVersion;
}
