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
const merge = Boolean(opts.merge);

function run(command) {
  execSync(command, { stdio: "inherit" });
}

function sh(command) {
  return execSync(command, { encoding: "utf8" }).trim();
}

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const version = pkg.version;
const rcBranch = `rc/${version}`;

try {
  sh("gh --version");
} catch {
  console.error("GitHub CLI (gh) is required for promote.");
  process.exit(1);
}

const prTitle = `Release v${version}`;
const prBody = `Promote release candidate ${rcBranch} to main.`;

try {
  run(`gh pr create --base main --head ${rcBranch} --title "${prTitle}" --body "${prBody}"`);
} catch {
  console.warn("PR may already exist; continuing.");
}

if (merge) {
  run(`gh pr merge ${rcBranch} --squash --delete-branch`);
  console.log(`Merged ${rcBranch} into main. CI will create stable release v${version}.`);
} else {
  console.log(`PR created for ${rcBranch}. Merge it to trigger the stable release.`);
}
