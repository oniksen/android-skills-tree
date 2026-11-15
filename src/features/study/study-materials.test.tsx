import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import StudyMarkdownRenderer from "./components/StudyMarkdownRenderer";
import { STUDY_MATERIALS } from "./study-materials.generated";

const materials = Object.values(STUDY_MATERIALS);

describe("учебные материалы", () => {
  it("содержит хотя бы один материал", () => {
    expect(materials.length).toBeGreaterThan(0);
  });

  for (const material of materials) {
    it(`${material.id}: рендерится без raw HTML`, () => {
      const html = renderToStaticMarkup(
        <StudyMarkdownRenderer
          content={material.content}
          grade={material.grade}
        />,
      );

      expect(html).toContain('class="study-hero"');
      expect(html).toContain('class="study-section"');
      expect(html).not.toContain("&lt;div");
      expect(html).not.toContain("&lt;table");
      expect(html).not.toContain(":::cards");
      expect(html).not.toContain("[!WARNING]");
      expect(html).not.toContain("[!CAUTION]");
    });
  }
});
