import { execSync } from "node:child_process";
import { pathToFileURL } from "node:url";

/**
 * Resolves the next release version the same way semantic-release does:
 * the last stable tag plus the conventional commits since it.
 *
 * `package.json` is intentionally not read: semantic-release does not use it
 * either, and treating it as a second source of truth is what made local
 * `rc/` branches disagree with the tag CI created.
 */

function sh(command) {
  return execSync(command, { encoding: "utf8" }).trim();
}

function parseStable(tag) {
  const match = tag.match(/^v?(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function compareVersions(a, b) {
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return b[index] - a[index];
  }
  return 0;
}

export function getLatestStableTag() {
  const tags = sh('git tag --merged HEAD --list "v*"')
    .split(/\r?\n/)
    .map((tag) => tag.trim())
    .filter((tag) => parseStable(tag) !== null)
    .sort((a, b) => compareVersions(parseStable(a), parseStable(b)));

  return tags[0] ?? null;
}

export function bumpVersion([major, minor, patch], level) {
  if (level === "major") return `${major + 1}.0.0`;
  if (level === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

function detectLevel(messages) {
  let level = null;

  for (const message of messages) {
    const subject = message.split("\n")[0] ?? "";
    const breaking =
      /BREAKING[ -]CHANGE/i.test(message) || /^[a-z]+(\([^)]+\))?!:/i.test(subject);

    if (breaking) return "major";

    if (/^feat(\([^)]+\))?:/i.test(subject)) level = "minor";
    else if (/^(fix|perf)(\([^)]+\))?:/i.test(subject) && level === null) {
      level = "patch";
    }
  }

  return level;
}

/**
 * @returns {{ current: string, next: string | null, level: "major"|"minor"|"patch"|null }}
 */
export function resolveNextVersion() {
  try {
    sh("git fetch --tags --quiet");
  } catch {
    // Offline is fine: use whatever tags exist locally.
  }

  const tag = getLatestStableTag();
  const current = tag ? tag.replace(/^v/, "") : "0.0.0";
  const range = tag ? `${tag}..HEAD` : "HEAD";
  const log = sh(`git log ${range} --pretty=format:%s%x1f%b%x1e`);

  const messages = log
    .split("\x1e")
    .map((entry) => entry.replace(/\x1f/g, "\n").trim())
    .filter(Boolean);

  const level = detectLevel(messages);
  if (!level) return { current, next: null, level: null };

  const base = tag ? parseStable(tag) : [0, 0, 0];
  return { current, next: bumpVersion(base, level), level };
}

const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  const result = resolveNextVersion();
  if (!result.next) {
    console.log(
      `No release-worthy commits since v${result.current}; next release is undefined.`,
    );
  } else {
    console.log(
      `Last release: v${result.current} · next: v${result.next} (${result.level})`,
    );
  }
}
