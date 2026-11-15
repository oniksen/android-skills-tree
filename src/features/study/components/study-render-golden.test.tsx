import { readFileSync } from "node:fs";
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
 * They must not be regenerated: any diff here is a rendering regression.
 */
const FIXTURES = join(process.cwd(), "src/features/study/components/__fixtures__/study-render");

/** Compare with LF endings so a Windows checkout does not break the baseline. */
const normalize = (value: string) => value.replace(/\r\n/g, "\n");

function golden(id: string): string {
  return readFileSync(join(FIXTURES, `${id}.html`), "utf8");
}

describe("study render golden", () => {
  for (const material of Object.values(STUDY_MATERIALS)) {
    it(`${material.id} renders byte-identically`, () => {
      const html = renderToStaticMarkup(
        <StudyMarkdownRenderer content={material.content} grade={material.grade} />,
      );

      expect(normalize(html)).toBe(normalize(golden(material.id)));
    });
  }

  it("html fixture renders byte-identically", () => {
    expect(normalize(renderFixture())).toBe(normalize(golden("fixture")));
  });
});
