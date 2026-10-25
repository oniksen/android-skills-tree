import fs from "node:fs";
import { execSync } from "node:child_process";

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

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const version = pkg.version;
const rcBranch = `rc/${version}`;

const current = sh("git branch --show-current");
if (current !== rcBranch) {
  try {
    sh(`git show-ref --verify --quiet refs/heads/${rcBranch}`);
    run(`git checkout ${rcBranch}`);
  } catch {
    run(`git checkout -b ${rcBranch}`);
  }
}

if (push) {
  run(`git push -u origin ${rcBranch}`);
  console.log(`Release candidate branch pushed: ${rcBranch}`);
  console.log(`CI will create v${version}-rc.N`);
} else {
  console.log(`Created/checked out ${rcBranch}. Push with \`git push -u origin ${rcBranch}\` to trigger the pre-release.`);
}
