"use client";

import type { ComponentType } from "react";
import type { StudySectionBlock } from "../model/parse-study-document";
import StudyCards from "./StudyCards";
import StudyNote from "./StudyNote";
import StudyProse from "./StudyProse";
import StudyQa from "./StudyQa";

type BlockOf<Kind extends StudySectionBlock["type"]> = Extract<
  StudySectionBlock,
  { type: Kind }
>;

export interface StudyBlockRenderProps<
  Kind extends StudySectionBlock["type"] = StudySectionBlock["type"],
> {
  block: BlockOf<Kind>;
  /** Sources section: Markdown link lists become pills. */
  sources: boolean;
}

/**
 * The one place where a section block type becomes a React component.
 *
 * `satisfies` keyed by `StudySectionBlock["type"]` makes an omitted or
 * misspelled entry a type error, so a new block type cannot ship unrendered.
 * Adding a block: extend the union in `parse-study-document.ts`, add an entry
 * here, and cover it in `study-block-renderer.test.tsx`.
 */
export const STUDY_BLOCK_RENDERERS = {
  markdown: ({ block, sources }: StudyBlockRenderProps<"markdown">) => (
    <StudyProse markdown={block.content} sources={sources} />
  ),
  cards: ({ block }: StudyBlockRenderProps<"cards">) => (
    <StudyCards items={block.items} />
  ),
  note: ({ block }: StudyBlockRenderProps<"note">) => (
    <StudyNote content={block.content} variant={block.variant} />
  ),
  qa: ({ block }: StudyBlockRenderProps<"qa">) => (
    <StudyQa items={block.items} />
  ),
} satisfies {
  [Kind in StudySectionBlock["type"]]: ComponentType<
    StudyBlockRenderProps<Kind>
  >;
};

export function StudyBlockRenderer({
  block,
  sources,
}: {
  block: StudySectionBlock;
  sources: boolean;
}) {
  // The registry is exhaustive over `block.type`; the cast only narrows the
  // props to the variant this block already is.
  const Renderer = STUDY_BLOCK_RENDERERS[block.type] as ComponentType<
    StudyBlockRenderProps<typeof block.type>
  >;

  return <Renderer block={block} sources={sources} />;
}
