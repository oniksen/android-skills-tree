/**
 * Single source of truth for study material blocks.
 *
 * The renderer never writes `study-*` class names by hand: it resolves a
 * block kind through `STUDY_BLOCK_MAP`. `study-blocks.test.ts` checks both
 * directions — every class in `STUDY_BLOCK` exists in globals.css and every
 * `study-*` class in globals.css is declared here.
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

export interface StudyBlockDefinition {
  /** Markdown/HTML tag the block is rendered from. */
  tag: string;
  /** Class applied to the rendered element. */
  className: StudyBlockClass;
  /** A standalone container or an inline element inside prose. */
  layout: "block" | "inline";
}

export const STUDY_BLOCK_MAP = {
  page: { tag: "div", className: STUDY_BLOCK.page, layout: "block" },
  topbar: { tag: "div", className: STUDY_BLOCK.topbar, layout: "block" },
  back: { tag: "a", className: STUDY_BLOCK.back, layout: "inline" },
  article: { tag: "article", className: STUDY_BLOCK.article, layout: "block" },
  hero: { tag: "header", className: STUDY_BLOCK.hero, layout: "block" },
  eyebrow: { tag: "p", className: STUDY_BLOCK.eyebrow, layout: "block" },
  title: { tag: "h1", className: STUDY_BLOCK.title, layout: "block" },
  lead: { tag: "p", className: STUDY_BLOCK.lead, layout: "block" },
  nav: { tag: "nav", className: STUDY_BLOCK.nav, layout: "block" },
  navLink: { tag: "a", className: STUDY_BLOCK.navLink, layout: "inline" },
  section: { tag: "section", className: STUDY_BLOCK.section, layout: "block" },
  sectionTitle: {
    tag: "h2",
    className: STUDY_BLOCK.sectionTitle,
    layout: "block",
  },
  subtitle: { tag: "h3", className: STUDY_BLOCK.subtitle, layout: "block" },
  subtitleMinor: {
    tag: "h4",
    className: STUDY_BLOCK.subtitleMinor,
    layout: "block",
  },
  list: { tag: "ul", className: STUDY_BLOCK.list, layout: "block" },
  note: { tag: "blockquote", className: STUDY_BLOCK.note, layout: "block" },
  noteWarn: { tag: "blockquote", className: STUDY_BLOCK.noteWarn, layout: "block" },
  checklist: { tag: "ul", className: STUDY_BLOCK.checklist, layout: "block" },
  checkItem: { tag: "li", className: STUDY_BLOCK.checkItem, layout: "block" },
  tableWrap: {
    tag: "table",
    className: STUDY_BLOCK.tableWrap,
    layout: "block",
  },
  table: { tag: "table", className: STUDY_BLOCK.table, layout: "block" },
  codeWrap: { tag: "pre", className: STUDY_BLOCK.codeWrap, layout: "block" },
  codeBar: { tag: "div", className: STUDY_BLOCK.codeBar, layout: "block" },
  codeLang: { tag: "span", className: STUDY_BLOCK.codeLang, layout: "inline" },
  code: { tag: "pre", className: STUDY_BLOCK.code, layout: "block" },
  copy: { tag: "button", className: STUDY_BLOCK.copy, layout: "inline" },
  copyCopied: {
    tag: "button",
    className: STUDY_BLOCK.copyCopied,
    layout: "inline",
  },
  cards: { tag: "div", className: STUDY_BLOCK.cards, layout: "block" },
  card: { tag: "div", className: STUDY_BLOCK.card, layout: "block" },
  cardTitle: { tag: "p", className: STUDY_BLOCK.cardTitle, layout: "block" },
  pills: { tag: "ul", className: STUDY_BLOCK.pills, layout: "block" },
  pill: { tag: "a", className: STUDY_BLOCK.pill, layout: "inline" },
  figure: { tag: "img", className: STUDY_BLOCK.figure, layout: "block" },
  caption: {
    tag: "figcaption",
    className: STUDY_BLOCK.caption,
    layout: "inline",
  },
  divider: { tag: "hr", className: STUDY_BLOCK.divider, layout: "block" },
  footer: { tag: "footer", className: STUDY_BLOCK.footer, layout: "block" },
  markdown: { tag: "div", className: STUDY_BLOCK.markdown, layout: "block" },
} as const satisfies Record<string, StudyBlockDefinition>;

export type StudyBlockKind = keyof typeof STUDY_BLOCK_MAP;

/** Class for a block kind, e.g. `blockClass("note")` -> "study-note". */
export function blockClass(kind: StudyBlockKind): string {
  return STUDY_BLOCK_MAP[kind].className;
}
