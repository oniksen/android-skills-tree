import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { STUDY_MATERIALS } from "../study-materials.generated";
import StudyMarkdownRenderer from "./StudyMarkdownRenderer";
import { renderFixture } from "./study-html-fixture";

/**
 * Byte-for-byte baseline of the Markdown rendering path.
 *
 * The fixtures in `__fixtures__/study-render` were captured before the client
 * pipeline replaced `<ReactMarkdown>` with a module-level unified processor.
 * They must not be regenerated to make a test pass: the fixture changes only
 * deliberately, through `npm run study:golden`, and the diff is reviewed.
 * Anything else is a rendering regression.
 */
const FIXTURES = join(process.cwd(), "src/features/study/components/__fixtures__/study-render");

/** `npm run study:golden` flips this to rewrite the baseline instead of checking it. */
const UPDATE = process.env.STUDY_GOLDEN_UPDATE === "1";

/** Compare with LF endings so a Windows checkout does not break the baseline. */
const normalize = (value: string) => value.replace(/\r\n/g, "\n");

function golden(id: string): string {
  return readFileSync(join(FIXTURES, `${id}.html`), "utf8");
}

function expectGolden(id: string, html: string): void {
  if (UPDATE) {
    writeFileSync(join(FIXTURES, `${id}.html`), normalize(html), "utf8");
    return;
  }

  expect(normalize(html)).toBe(normalize(golden(id)));
}

describe("study render golden", () => {
  for (const material of Object.values(STUDY_MATERIALS)) {
    it(`${material.id} renders byte-identically`, () => {
      const html = renderToStaticMarkup(
        <StudyMarkdownRenderer content={material.content} grade={material.grade} />,
      );

      expectGolden(material.id, html);
    });
  }

  it("html fixture renders byte-identically", () => {
    expectGolden("fixture", renderFixture());
  });
});
