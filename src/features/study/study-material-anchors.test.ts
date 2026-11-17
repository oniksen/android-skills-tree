import { describe, expect, it } from "vitest";
import { parseStudyHeadingAnchor } from "./components/markdown-components";
import { collectHeadings, parseStudyDocument } from "./model/parse-study-document";
import { STUDY_MATERIALS } from "./study-materials.generated";

const ANCHOR = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

describe.each(Object.values(STUDY_MATERIALS))("якоря: $id", (material) => {
  it("у каждого раздела есть явный якорь, все якоря уникальны", () => {
    const document = parseStudyDocument(material.content, {
      grade: material.grade,
    })!;
    const anchors: string[] = [];

    for (const section of document.sections) {
      const { anchor } = parseStudyHeadingAnchor(section.title);
      expect(anchor, section.title).not.toBeNull();
      anchors.push(anchor!);

      for (const block of section.blocks) {
        if (block.type !== "markdown") continue;

        for (const heading of collectHeadings(block.content.split("\n"))) {
          if (heading.level !== 3) continue;

          const parsed = parseStudyHeadingAnchor(heading.title);
          if (parsed.anchor) anchors.push(parsed.anchor);
        }
      }
    }

    for (const anchor of anchors) expect(anchor).toMatch(ANCHOR);
    expect(new Set(anchors).size).toBe(anchors.length);
  });
});
