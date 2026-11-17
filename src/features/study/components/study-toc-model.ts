import type { StudySection } from "../model/parse-study-document";
import {
  collectHeadings,
  normalizeDocumentMarkdown,
  stripMarkdownInline,
} from "../model/parse-study-document";
import { parseStudyHeadingAnchor } from "./markdown-components";

export interface StudyTocItem {
  id: string;
  title: string;
}

export interface StudyTocGroup {
  id: string;
  title: string;
  items: StudyTocItem[];
}

/**
 * Builds the table of contents from the parsed document.
 *
 * A section is always a group; its second level is every anchored H3 in the
 * section body. Anchors are read through `parseStudyHeadingAnchor`, so the
 * ids here are exactly the ids the heading components render. Legacy files
 * arrive with H2 subsections shifted to H3 by `parseStudyDocument`, so both
 * formats produce the same shape.
 */
export function buildStudyToc(sections: StudySection[]): StudyTocGroup[] {
  return sections.map((section) => {
    const sectionHeading = parseStudyHeadingAnchor(section.title);
    const items: StudyTocItem[] = [];

    if (!section.isSources) {
      for (const block of section.blocks) {
        if (block.type !== "markdown") continue;

        for (const heading of collectHeadings(
          normalizeDocumentMarkdown(block.content).split("\n"),
        )) {
          if (heading.level !== 3) continue;

          const parsed = parseStudyHeadingAnchor(heading.title);
          if (!parsed.anchor) continue;

          items.push({
            id: parsed.anchor,
            title: stripMarkdownInline(parsed.text),
          });
        }
      }
    }

    return {
      id: sectionHeading.anchor ?? section.id,
      title: stripMarkdownInline(sectionHeading.text),
      items,
    };
  });
}
