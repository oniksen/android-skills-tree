import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { STUDY_CODE_LANGUAGES } from "./study-languages";

/**
 * The language section of the authoring guide must describe exactly the
 * languages the renderer ships grammars for. Otherwise an author copies a
 * language from the guide and gets an unhighlighted block.
 */
const GUIDE = readFileSync(
  new URL("../../../../STUDY_MATERIALS_FORMATTING.txt", import.meta.url),
  "utf8",
).replace(/\r\n?/g, "\n");

const LINES = GUIDE.split("\n");

const SECTION_START = "8. КОД";
const SECTION_END = "9. ЗАМЕТКИ";

/** Lines between two numbered guide headings (headings excluded). */
function languageSection(): string[] {
  const start = LINES.findIndex((line) => line.startsWith(SECTION_START));
  if (start === -1) throw new Error(`в гайде нет заголовка «${SECTION_START}»`);

  const end = LINES.findIndex(
    (line, index) => index > start && line.startsWith(SECTION_END),
  );
  if (end === -1) throw new Error(`в гайде нет заголовка «${SECTION_END}»`);

  return LINES.slice(start + 1, end);
}

/** Languages listed on the `Языки: …` line of the section. */
function documentedLanguages(section: string[]): string[] {
  const line = section.find((entry) => entry.startsWith("Языки:"));
  if (!line) throw new Error("в разделе 8 нет строки «Языки:»");

  return line
    .slice("Языки:".length)
    .split(/[,\s]+/)
    .map((word) => word.replace(/[.;:]+$/, "").trim())
    .filter(Boolean);
}

/** Info strings of every opening fence in the section. */
function fencedLanguages(section: string[]): string[] {
  const languages: string[] = [];
  let open: { char: string; length: number } | null = null;

  for (const line of section) {
    const match = /^(\s*)(`{3,}|~{3,})(.*)$/.exec(line);
    if (!match) continue;

    const marker = match[2];
    const info = match[3].trim();

    if (!open) {
      open = { char: marker[0], length: marker.length };
      if (info) languages.push(info.split(/\s+/)[0]);
      continue;
    }

    if (
      marker[0] === open.char &&
      marker.length >= open.length &&
      info === ""
    ) {
      open = null;
    }
  }

  return languages;
}

describe("гайд STUDY_MATERIALS_FORMATTING.txt", () => {
  it("перечисляет ровно языки STUDY_CODE_LANGUAGES", () => {
    expect([...documentedLanguages(languageSection())].sort()).toEqual(
      [...STUDY_CODE_LANGUAGES].sort(),
    );
  });

  it("упоминает каждый язык из STUDY_CODE_LANGUAGES", () => {
    const section = languageSection().join("\n");

    for (const language of STUDY_CODE_LANGUAGES) {
      expect(section, language).toMatch(new RegExp(`\\b${language}\\b`));
    }
  });

  it("не показывает в примерах язык вне STUDY_CODE_LANGUAGES", () => {
    const used = fencedLanguages(languageSection());

    expect(used.length).toBeGreaterThan(0);
    for (const language of used) {
      expect(STUDY_CODE_LANGUAGES, language).toContain(language);
    }
  });
});
