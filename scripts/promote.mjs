import { execSync } from "node:child_process";

const args = process.argv.slice(2);
const opts = {};
for (const arg of args) {
  if (arg.startsWith("--")) {
    const [key, value] = arg.split("=");
    opts[key.slice(2)] = value ?? true;
  }
}
const merge = Boolean(opts.merge);

function run(command) {
  execSync(command, { stdio: "inherit" });
}

function sh(command) {
  return execSync(command, { encoding: "utf8" }).trim();
}

try {
  sh("gh --version");
} catch {
  console.error("GitHub CLI (gh) is required for promote.");
  process.exit(1);
}

try {
  sh("git fetch --all --prune --quiet");
} catch {
  // Continue with the branches that are already known locally.
}

/** Current branch, or the most recently updated rc/* branch. */
function resolveRcBranch() {
  const current = sh("git branch --show-current");
  if (current.startsWith("rc/")) return current;

  const refs = sh(
    "git for-each-ref --sort=-committerdate --format=%(refname:short) refs/heads refs/remotes/origin",
  );
  const seen = new Set();
  for (const ref of refs.split(/\r?\n/)) {
    const name = ref.trim().replace(/^origin\//, "");
    if (!name.startsWith("rc/") || seen.has(name)) continue;
    seen.add(name);
    return name;
  }

  return null;
}

const rcBranch = resolveRcBranch();
if (!rcBranch) {
  console.error(
    "No rc/* branch found. Create one with `npm run rc` before promoting.",
  );
  process.exit(1);
}

const version = rcBranch.slice("rc/".length);
const prTitle = `Release v${version}`;
const prBody = `Promote release candidate ${rcBranch} to main.`;

try {
  run(
    `gh pr create --base main --head ${rcBranch} --title "${prTitle}" --body "${prBody}"`,
  );
} catch {
  console.warn("PR may already exist; continuing.");
}

if (merge) {
  run(`gh pr merge ${rcBranch} --squash --delete-branch`);
  console.log(`Merged ${rcBranch} into main. CI will create the stable release.`);
} else {
  console.log(
    `PR created for ${rcBranch}. Merge it to trigger the stable release.`,
  );
}
