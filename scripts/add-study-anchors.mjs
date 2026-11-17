import fs from "node:fs";
import path from "node:path";

/**
 * One-off migration: puts an explicit `{#anchor}` on every heading that
 * belongs in the study table of contents.
 *
 * Safe to rerun: headings that already end with an anchor are left alone, and
 * the used ids are seeded from the file, so a second run cannot produce
 * duplicates. Run from the repository root:
 *
 *   node scripts/add-study-anchors.mjs
 */

const ROOT = process.cwd();
const MATERIALS = path.join(ROOT, "content", "study-materials");

const TRANSLIT = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

const HEADING = /^(#{1,6})\s+(.+?)\s*$/;
const FENCE = /^\s*(`{3,}|~{3,})/;
const EXISTING_ANCHOR = /\s*\{#([a-z0-9]+(?:-[a-z0-9]+)*)\}\s*$/;
const CARDS_OPEN = /^:::cards\s*$/;
const CARDS_CLOSE = /^:::\s*$/;
const NUMBER_PREFIX = /^\d+(?:\.\d+)*\.?\s*/;

function slugify(title) {
  const plain = title
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const latin = [...plain.toLowerCase()]
    .map((char) => (Object.hasOwn(TRANSLIT, char) ? TRANSLIT[char] : char))
    .join("");

  const slug = latin
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64)
    .replace(/-+$/g, "");

  return slug || "topic";
}

function uniqueSlug(base, used) {
  if (!used.has(base)) {
    used.add(base);
    return base;
  }

  let suffix = 2;
  while (used.has(`${base}-${suffix}`)) suffix += 1;
  const slug = `${base}-${suffix}`;
  used.add(slug);
  return slug;
}

function collectAnchors(lines) {
  const used = new Set();

  for (const line of lines) {
    const match = EXISTING_ANCHOR.exec(line);
    if (match) used.add(match[1]);
  }

  return used;
}

function sectionLevel(lines) {
  let fence = null;
  let h1 = 0;

  for (const line of lines) {
    const fenceMatch = FENCE.exec(line);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!fence) fence = marker[0];
      else if (marker[0] === fence) fence = null;
      continue;
    }
    if (fence) continue;

    const heading = HEADING.exec(line);
    if (heading && heading[1].length === 1) h1 += 1;
  }

  return h1 > 1 ? 1 : 2;
}

function migrate(file) {
  const raw = fs.readFileSync(file, "utf8");
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  const lines = raw.split(/\r?\n/);
  const level = sectionLevel(lines);
  const used = collectAnchors(lines);
  const isLegacy = level === 1;

  let fence = null;
  let inCards = false;
  let skippedTitle = false;
  let added = 0;

  const next = lines.map((line) => {
    if (inCards) {
      if (CARDS_CLOSE.test(line)) inCards = false;
      return line;
    }

    const fenceMatch = FENCE.exec(line);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!fence) fence = marker[0];
      else if (marker[0] === fence) fence = null;
      return line;
    }
    if (fence) return line;

    if (CARDS_OPEN.test(line)) {
      inCards = true;
      return line;
    }

    const heading = HEADING.exec(line);
    if (!heading) return line;

    const headingLevel = heading[1].length;
    const title = heading[2].trim();

    if (isLegacy && headingLevel === 1 && !skippedTitle) {
      skippedTitle = true;
      return line;
    }

    const isSection = headingLevel === level;
    const isSubsection = headingLevel === level + 1;
    if (!isSection && !(isSubsection && NUMBER_PREFIX.test(title))) {
      return line;
    }

    if (EXISTING_ANCHOR.test(title)) return line;

    const base = slugify(title.replace(NUMBER_PREFIX, ""));
    const anchor = uniqueSlug(base, used);
    added += 1;
    return `${"#".repeat(headingLevel)} ${title} {#${anchor}}`;
  });

  fs.writeFileSync(file, next.join(eol), "utf8");
  return added;
}

function materialFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return materialFiles(full);
    if (entry.name.endsWith(".md")) return [full];
    return [];
  });
}

const files = materialFiles(MATERIALS);
if (files.length === 0) {
  console.error("No study materials found under content/study-materials.");
  process.exit(1);
}

for (const file of files) {
  const added = migrate(file);
  console.log(`${path.relative(ROOT, file)}: +${added} anchors`);
}
