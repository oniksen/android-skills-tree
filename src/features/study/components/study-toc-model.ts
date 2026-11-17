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

/** One observed heading: DOM id and the TOC entry it highlights. */
export interface StudyTocTarget {
  domId: string;
  tocId: string;
}

/**
 * Picks the TOC entry for the reading position.
 *
 * Observed targets are non-nested: the section's own `<h2>` maps to the group
 * id, and subsections map to themselves. The last visible target in document
 * order wins, so a visible subsection beats the section heading that contains
 * it. No visible heading clears the highlight instead of freezing the previous
 * one on an unrelated part of the page.
 */
export function selectActiveId(
  targets: readonly StudyTocTarget[],
  visible: ReadonlySet<string>,
): string | null {
  for (let index = targets.length - 1; index >= 0; index -= 1) {
    const target = targets[index];
    if (visible.has(target.domId)) return target.tocId;
  }

  return null;
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
