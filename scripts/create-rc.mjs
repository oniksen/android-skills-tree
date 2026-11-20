import { execSync } from "node:child_process";
import { resolveNextVersion } from "./release-version.mjs";

const args = process.argv.slice(2);
const opts = {};
for (const arg of args) {
  if (arg.startsWith("--")) {
    const [key, value] = arg.split("=");
    opts[key.slice(2)] = value ?? true;
  }
}
const push = Boolean(opts.push);

function run(command) {
  execSync(command, { stdio: "inherit" });
}

function sh(command) {
  return execSync(command, { encoding: "utf8" }).trim();
}

const status = sh("git status --porcelain");
if (status) {
  console.error("Working tree is not clean. Commit or stash changes first.");
  process.exit(1);
}

const { current, next, level } = resolveNextVersion();
if (!next) {
  console.error(
    `No feat/fix/perf commits since v${current}; nothing to release yet.`,
  );
  process.exit(1);
}

const rcBranch = `rc/${next}`;

const branch = sh("git branch --show-current");
if (branch !== rcBranch) {
  try {
    sh(`git show-ref --verify --quiet refs/heads/${rcBranch}`);
    run(`git checkout ${rcBranch}`);
  } catch {
    run(`git checkout -b ${rcBranch}`);
  }
}

console.log(`Last release: v${current} · next: v${next} (${level})`);

if (push) {
  run(`git push -u origin ${rcBranch}`);
  console.log(`Release candidate branch pushed: ${rcBranch}`);
  console.log(`CI will create v${next}-rc.N`);
} else {
  console.log(
    `Created/checked out ${rcBranch}. Push with \`git push -u origin ${rcBranch}\` to trigger the pre-release.`,
  );
}
