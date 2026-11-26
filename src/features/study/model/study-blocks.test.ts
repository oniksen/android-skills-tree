import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { STUDY_BLOCK, STUDY_BLOCK_MAP, blockClass } from "./study-blocks";

const css = fs.readFileSync(
  new URL("../../../app/globals.css", import.meta.url),
  "utf8",
);

const SRC_DIR = new URL("../../../", import.meta.url);

/** Every TypeScript source file under src, minus the registry and the tests. */
function sourceFiles(dir: URL): URL[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const child = new URL(
      `${entry.name}${entry.isDirectory() ? "/" : ""}`,
      dir,
    );
    if (entry.isDirectory()) return sourceFiles(child);
    if (!/\.tsx?$/.test(entry.name)) return [];
    if (entry.name.includes(".test.")) return [];
    if (entry.name === "study-blocks.ts") return [];
    return [child];
  });
}

/** HTML elements the study pipeline is allowed to emit. */
const HTML_TAGS = [
  "a",
  "article",
  "blockquote",
  "button",
  "details",
  "div",
  "figcaption",
  "figure",
  "footer",
  "h1",
  "h2",
  "h3",
  "h4",
  "header",
  "hr",
  "li",
  "nav",
  "ol",
  "p",
  "pre",
  "section",
  "span",
  "summary",
  "table",
  "ul",
];

function cssClasses(): Set<string> {
  const matches = css.match(/\.(study-[a-zA-Z0-9_-]+)/g) ?? [];
  return new Set(matches.map((match) => match.slice(1)));
}

describe("реестр блоков учебных материалов", () => {
  it("не содержит повторяющихся классов", () => {
    const values = Object.values(STUDY_BLOCK);
    expect(new Set(values).size).toBe(values.length);
  });

  it("объявляет все классы, которые используются в CSS", () => {
    const declared = new Set<string>(Object.values(STUDY_BLOCK));
    const missing = [...cssClasses()].filter(
      (className) => !declared.has(className),
    );

    expect(missing).toEqual([]);
  });

  it("описывает каждый класс в globals.css", () => {
    const defined = cssClasses();
    const missing = [...Object.values(STUDY_BLOCK)].filter(
      (className) => !defined.has(className),
    );

    expect(missing).toEqual([]);
  });

  it("возвращает класс по виду блока", () => {
    expect(blockClass("note")).toBe("study-note");
    expect(blockClass("cards")).toBe("study-cards");
    expect(blockClass("qaItem")).toBe("study-qa-item");
    expect(blockClass("table")).toBe("study-table");
  });

  it("описывает у каждого блока теги и раскладку", () => {
    for (const [kind, definition] of Object.entries(STUDY_BLOCK_MAP)) {
      expect(definition.tags.length, kind).toBeGreaterThan(0);
      expect(["block", "inline"], kind).toContain(definition.layout);
      expect(definition.className, kind).toMatch(/^study-/);
    }
  });

  it("использует только реальные HTML-теги", () => {
    for (const [kind, definition] of Object.entries(STUDY_BLOCK_MAP)) {
      for (const tag of definition.tags) {
        expect(HTML_TAGS, `${kind} -> ${tag}`).toContain(tag);
      }
    }
  });

  it("рендерит упорядоченный и маркированный список одним классом", () => {
    expect(STUDY_BLOCK_MAP.list.tags).toEqual(["ul", "ol"]);
  });

  it("у каждого класса реестра есть ровно один kind", () => {
    const classes = Object.values(STUDY_BLOCK_MAP).map((d) => d.className);
    expect(new Set(classes)).toEqual(new Set(Object.values(STUDY_BLOCK)));
  });

  it("не читает STUDY_BLOCK напрямую в компонентах — только blockClass", () => {
    const offenders = sourceFiles(SRC_DIR)
      .filter((file) => /\bSTUDY_BLOCK\b/.test(fs.readFileSync(file, "utf8")))
      .map((file) => file.pathname.split("/src/").at(-1));

    expect(offenders).toEqual([]);
  });
});
