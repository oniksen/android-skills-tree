import type { JSX } from "react";

/**
 * Single source of truth for study material blocks.
 *
 * The renderer never writes `study-*` class names by hand: it resolves a
 * block kind through `blockClass()` (see `components/*`). `study-blocks.test.ts`
 * checks both directions — every class in `STUDY_BLOCK` exists in globals.css
 * and every `study-*` class in globals.css is declared here.
 */
export const STUDY_BLOCK = {
  page: "study-page",
  topbar: "study-topbar",
  back: "study-back",
  article: "study-article",
  markdown: "study-markdown",
  hero: "study-hero",
  eyebrow: "study-eyebrow",
  title: "study-title",
  lead: "study-lead",
  nav: "study-nav",
  navLink: "study-nav-link",
  section: "study-section",
  sectionTitle: "study-section-title",
  subtitle: "study-subtitle",
  subtitleMinor: "study-subtitle--minor",
  list: "study-list",
  note: "study-note",
  noteWarn: "study-note--warn",
  checklist: "study-checklist",
  checkItem: "study-check-item",
  tableWrap: "study-table-wrap",
  table: "study-table",
  codeWrap: "study-code-wrap",
  codeBar: "study-code-bar",
  codeLang: "study-code-lang",
  code: "study-code",
  copy: "study-copy",
  copyCopied: "study-copy--copied",
  cards: "study-cards",
  card: "study-card",
  cardTitle: "study-card-title",
  pills: "study-pills",
  pill: "study-pill",
  figure: "study-figure",
  caption: "study-figure-caption",
  divider: "study-divider",
  footer: "study-footer",
} as const;

export type StudyBlockClass = (typeof STUDY_BLOCK)[keyof typeof STUDY_BLOCK];

/** HTML element a block can be rendered as. */
export type StudyBlockTag = keyof JSX.IntrinsicElements;

/**
 * Contract for one block kind.
 *
 * `tags` lists every element the class actually lands on: `list` is a `<ul>`
 * for Markdown bullets and an `<ol>` for numbered lists, so the registry must
 * not claim a single tag. Everything else renders exactly one tag.
 */
export interface StudyBlockDefinition {
  tags: readonly [StudyBlockTag, ...StudyBlockTag[]];
  /** Class applied to the rendered element. */
  className: StudyBlockClass;
  /** A standalone container or an inline element inside prose. */
  layout: "block" | "inline";
}

export const STUDY_BLOCK_MAP = {
  page: { tags: ["div"], className: STUDY_BLOCK.page, layout: "block" },
  topbar: { tags: ["div"], className: STUDY_BLOCK.topbar, layout: "block" },
  back: { tags: ["a"], className: STUDY_BLOCK.back, layout: "inline" },
  article: { tags: ["article"], className: STUDY_BLOCK.article, layout: "block" },
  markdown: { tags: ["div"], className: STUDY_BLOCK.markdown, layout: "block" },
  hero: { tags: ["header"], className: STUDY_BLOCK.hero, layout: "block" },
  eyebrow: { tags: ["p"], className: STUDY_BLOCK.eyebrow, layout: "block" },
  title: { tags: ["h1"], className: STUDY_BLOCK.title, layout: "block" },
  lead: { tags: ["p"], className: STUDY_BLOCK.lead, layout: "block" },
  nav: { tags: ["nav"], className: STUDY_BLOCK.nav, layout: "block" },
  navLink: { tags: ["a"], className: STUDY_BLOCK.navLink, layout: "inline" },
  section: { tags: ["section"], className: STUDY_BLOCK.section, layout: "block" },
  sectionTitle: {
    tags: ["h2"],
    className: STUDY_BLOCK.sectionTitle,
    layout: "block",
  },
  /**
   * Markdown H1–H3 inside a section body render as `<h3>`; H4–H6 render as
   * `<h4>` together with `subtitleMinor`.
   */
  subtitle: {
    tags: ["h3", "h4"],
    className: STUDY_BLOCK.subtitle,
    layout: "block",
  },
  /** Markdown H4–H6 add the minor variant on top of `subtitle`. */
  subtitleMinor: {
    tags: ["h4"],
    className: STUDY_BLOCK.subtitleMinor,
    layout: "block",
  },
  list: { tags: ["ul", "ol"], className: STUDY_BLOCK.list, layout: "block" },
  note: { tags: ["div"], className: STUDY_BLOCK.note, layout: "block" },
  noteWarn: { tags: ["div"], className: STUDY_BLOCK.noteWarn, layout: "block" },
  checklist: { tags: ["ul"], className: STUDY_BLOCK.checklist, layout: "block" },
  checkItem: { tags: ["li"], className: STUDY_BLOCK.checkItem, layout: "block" },
  tableWrap: {
    tags: ["div"],
    className: STUDY_BLOCK.tableWrap,
    layout: "block",
  },
  table: { tags: ["table"], className: STUDY_BLOCK.table, layout: "block" },
  codeWrap: {
    tags: ["div"],
    className: STUDY_BLOCK.codeWrap,
    layout: "block",
  },
  codeBar: { tags: ["div"], className: STUDY_BLOCK.codeBar, layout: "block" },
  codeLang: {
    tags: ["span"],
    className: STUDY_BLOCK.codeLang,
    layout: "inline",
  },
  code: { tags: ["pre"], className: STUDY_BLOCK.code, layout: "block" },
  copy: { tags: ["button"], className: STUDY_BLOCK.copy, layout: "inline" },
  copyCopied: {
    tags: ["button"],
    className: STUDY_BLOCK.copyCopied,
    layout: "inline",
  },
  cards: { tags: ["div"], className: STUDY_BLOCK.cards, layout: "block" },
  card: { tags: ["div"], className: STUDY_BLOCK.card, layout: "block" },
  cardTitle: { tags: ["p"], className: STUDY_BLOCK.cardTitle, layout: "block" },
  pills: { tags: ["ul"], className: STUDY_BLOCK.pills, layout: "block" },
  pill: { tags: ["a"], className: STUDY_BLOCK.pill, layout: "inline" },
  figure: { tags: ["figure"], className: STUDY_BLOCK.figure, layout: "block" },
  caption: {
    tags: ["figcaption"],
    className: STUDY_BLOCK.caption,
    layout: "inline",
  },
  divider: { tags: ["hr"], className: STUDY_BLOCK.divider, layout: "block" },
  footer: { tags: ["footer"], className: STUDY_BLOCK.footer, layout: "block" },
} as const satisfies Record<string, StudyBlockDefinition>;

export type StudyBlockKind = keyof typeof STUDY_BLOCK_MAP;

/** Class for a block kind, e.g. `blockClass("note")` -> "study-note". */
export function blockClass(kind: StudyBlockKind): StudyBlockClass {
  return STUDY_BLOCK_MAP[kind].className;
}
