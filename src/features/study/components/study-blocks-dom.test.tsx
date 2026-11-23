import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  blockClass,
  STUDY_BLOCK_MAP,
  type StudyBlockDefinition,
} from "../model/study-blocks";
import { renderFixture, renderFixturePage } from "./study-html-fixture";
import StudyMarkdownRenderer from "./StudyMarkdownRenderer";

type Registry = Record<string, StudyBlockDefinition>;

/** Class → every HTML tag it was actually rendered as. */
const TAGS_OF_CLASS = new Map<string, Set<string>>();

function collect(markup: string) {
  for (const [, tag, , classes] of markup.matchAll(/<([a-z0-9]+)([^>]*?)class="([^"]*)"/g)) {
    for (const cls of classes.split(/\s+/)) {
      if (!cls.startsWith("study-")) continue;
      const set = TAGS_OF_CLASS.get(cls) ?? new Set<string>();
      set.add(tag);
      TAGS_OF_CLASS.set(cls, set);
    }
  }
}

/**
 * Registry entries say which elements a class can land on. The manual tag
 * allowlist in `study-blocks.test.ts` accepts any real HTML tag, so it cannot
 * notice a `note: { tags: ["blockquote"] }` that renders `<div>`.
 */
function classProblems(
  tagsOfClass: Map<string, Set<string>>,
  registry: Registry = STUDY_BLOCK_MAP,
): string[] {
  const problems: string[] = [];

  for (const [cls, seen] of tagsOfClass) {
    const declared: string[] = [
      ...new Set(
        Object.values(registry)
          .filter((definition) => definition.className === cls)
          .flatMap((definition) => [...definition.tags]),
      ),
    ];
    if ([...seen].some((tag) => !declared.includes(tag))) {
      problems.push(`${cls} — реестр: ${declared.join(",")}, DOM: ${[...seen].join(",")}`);
    }
  }

  return problems;
}

/** Kinds whose class never appeared in the statically rendered markup. */
function uncoveredKinds(
  tagsOfClass: Map<string, Set<string>>,
  registry: Registry = STUDY_BLOCK_MAP,
): string[] {
  // `study-copy--copied` is only added to the copy button after a click.
  const NEVER_STATIC = new Set(["copyCopied"]);

  return Object.entries(registry)
    .filter(
      ([kind, definition]) =>
        !NEVER_STATIC.has(kind) && !tagsOfClass.has(definition.className),
    )
    .map(([kind]) => `kind не покрыт: ${kind}`);
}

collect(renderFixture());
// Page shell: `page` and `article` never appear in the fragment.
collect(renderFixturePage());
// Fallback for a file without H1: the `markdown` container.
collect(renderToStaticMarkup(<StudyMarkdownRenderer content="просто текст" />));
// `StudySkeleton` is not collected: the page shell renders directly under
// `renderToStaticMarkup` (no `next/link` mock needed), and the loading state
// intentionally paints `hero`/`section`/`article` on `<div>`s rather than on
// the semantic tags the registry promises. It is a placeholder, not material
// markup, so mixing it in would weaken the contract instead of checking it.

describe("реестр блоков против реального DOM", () => {
  it("классы в DOM объявлены реестром с теми же тегами", () => {
    expect(classProblems(TAGS_OF_CLASS)).toEqual([]);
  });

  it("ловит расхождение реестра с DOM", () => {
    const drifted = {
      note: {
        tags: ["blockquote"],
        className: blockClass("note"),
        layout: "block",
      },
    } satisfies Registry;

    expect(
      classProblems(new Map([["study-note", new Set(["div"])]]), drifted),
    ).toEqual(["study-note — реестр: blockquote, DOM: div"]);
  });

  it("каждый kind реестра встречается в статической разметке", () => {
    expect(uncoveredKinds(TAGS_OF_CLASS)).toEqual([]);
  });
});
