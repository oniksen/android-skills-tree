import fs from "node:fs";
import { execSync } from "node:child_process";

const args = process.argv.slice(2);
const opts = {};
const positional = [];
for (const arg of args) {
  if (arg.startsWith("--")) {
    const [key, value] = arg.split("=");
    opts[key.slice(2)] = value ?? true;
  } else {
    positional.push(arg);
  }
}

const type = opts.type === "fix" ? "fix" : "feat";
const slugInput = opts.slug || positional[0];
const base = opts.base || "main";
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
const [major, minor, patch] = pkg.version.split(".").map(Number);
const nextVersion =
  type === "feat"
    ? `${major}.${minor + 1}.0`
    : `${major}.${minor}.${patch + 1}`;

const slug = (slugInput || `${type}-${Date.now()}`)
  .toLowerCase()
  .replace(/[^a-z0-9-]+/g, "-")
  .replace(/^-+|-+$/g, "");
const branch = `${type}/${slug}`;

try {
  sh(`git show-ref --verify --quiet refs/heads/${branch}`);
  console.error(`Branch already exists: ${branch}`);
  process.exit(1);
} catch {
  // branch does not exist
}

run(`git checkout ${base}`);
try {
  run(`git pull --ff-only origin ${base}`);
} catch {
  console.warn(`Could not fast-forward ${base}; continuing with local ${base}.`);
}
run(`git checkout -b ${branch}`);

pkg.version = nextVersion;
fs.writeFileSync("package.json", `${JSON.stringify(pkg, null, 2)}\n`);
run("git add package.json");
run(`git commit -m "chore: start v${nextVersion}"`);

if (push) {
  run(`git push -u origin ${branch}`);
}

console.log(`Started ${type} work: v${nextVersion} on branch ${branch}`);
console.log("Next: develop locally, then run `npm run rc` to create a release candidate.");
