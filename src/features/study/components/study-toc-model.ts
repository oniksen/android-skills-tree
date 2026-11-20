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

/** A heading measured against the viewport. */
export interface StudyTocPosition extends StudyTocTarget {
  /** `getBoundingClientRect().top` relative to the viewport. */
  top: number;
}

/**
 * Picks the TOC entry for the reading position.
 *
 * Positions arrive in document order. The last heading that has already
 * crossed the reading line marks the section the reader is inside, so the
 * highlight stays on it through the whole section body instead of clearing
 * between two headings. Scrolling back up flips to the previous entry as soon
 * as its heading is below the line again.
 *
 * Before the first heading reaches the line the first entry is returned, so
 * the panel always answers "where am I" even on a very short page.
 */
export function selectActiveId(
  positions: readonly StudyTocPosition[],
  readingLine: number,
): string | null {
  let active: string | null = null;

  for (const position of positions) {
    if (position.top <= readingLine) active = position.tocId;
    else break;
  }

  return active ?? positions[0]?.tocId ?? null;
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
