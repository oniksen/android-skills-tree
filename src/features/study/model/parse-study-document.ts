/**
 * Turns a study material Markdown file into a typed document:
 * `meta` (hero copy) + sections (H2) + typed blocks inside them.
 *
 * The document format is described in STUDY_MATERIALS_FORMATTING.txt.
 * Parsing is line based only for structure (headings, :::cards, quotes);
 * every text block is handed to react-markdown untouched.
 */

import { getStudyInterviewTopics } from "@/data/study-interview-questions";

export interface StudyDocumentMeta {
  title: string;
  level: string;
  category: string;
  language: string;
  summary: string;
  footer: string;
}

export interface StudyCardItem {
  title: string;
  content: string;
}

export interface StudyQaItem {
  question: string;
  answer: string;
}

export type StudyNoteVariant = "note" | "warn";

export type StudySectionBlock =
  | { type: "markdown"; content: string }
  | { type: "cards"; items: StudyCardItem[] }
  | { type: "note"; variant: StudyNoteVariant; content: string }
  | { type: "qa"; items: StudyQaItem[] };

export interface StudySection {
  id: string;
  title: string;
  /** Sources sections render their link lists as pills. */
  isSources: boolean;
  blocks: StudySectionBlock[];
}

export interface StudyDocument {
  meta: StudyDocumentMeta;
  sections: StudySection[];
}

export interface ParseStudyDocumentOptions {
  grade?: string;
  materialId?: string;
}

const HEADING = /^(#{1,6})\s+(.+?)\s*$/;
const META_LINE = /^\*\*([^*:]{1,40}):\*\*\s*(.*?)\s*$/;
const FENCE = /^\s*(`{3,}|~{3,})/;
const CARDS_OPEN = /^:::cards\s*$/;
const QA_OPEN = /^:::qa\s*$/;
const CARDS_CLOSE = /^:::\s*$/;
const QA_ITEM = /^\*\*(.+?)\*\*\s*(?:[—–:-]\s*)?(.*)$/;
const NOTE_MARKER = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$/i;
const CONTENTS_TITLE = /^(содержание|оглавление|contents)$/i;
const SOURCES_TITLE = /источник/i;

interface Heading {
  level: number;
  title: string;
  index: number;
}

/** An open fenced code block: markdown closes it only with the same marker. */
interface Fence {
  char: "`" | "~";
  length: number;
}

function fenceMarker(line: string): Fence | null {
  const marker = FENCE.exec(line)?.[1];
  if (!marker) return null;
  return { char: marker[0] === "`" ? "`" : "~", length: marker.length };
}

/** Opens a fence, or closes it when the marker matches the opening one. */
function toggleFence(fence: Fence | null, marker: Fence): Fence | null {
  if (!fence) return marker;
  if (marker.char === fence.char && marker.length >= fence.length) return null;
  return fence;
}

const GRADE_LABELS: Record<string, string> = {
  junior: "Junior",
  middle: "Middle",
  "strong-middle": "Strong Middle",
  senior: "Senior",
};

export function gradeLabel(grade?: string): string {
  if (!grade) return "";
  return GRADE_LABELS[grade] ?? grade;
}

export function normalizeDocumentMarkdown(markdown: string): string {
  return markdown.replace(/\r\n?/g, "\n");
}

/** Collects markdown headings outside fenced code blocks. */
export function collectHeadings(lines: string[]): Heading[] {
  const headings: Heading[] = [];
  let fence: Fence | null = null;

  lines.forEach((line, index) => {
    const marker = fenceMarker(line);
    if (marker) {
      fence = toggleFence(fence, marker);
      return;
    }
    if (fence) return;
    const match = line.match(HEADING);
    if (!match) return;
    headings.push({
      level: match[1].length,
      title: match[2].trim(),
      index,
    });
  });

  return headings;
}

/** Shifts heading levels (used for legacy files where H1 was a section). */
export function shiftHeadings(lines: string[], delta: number): string[] {
  let fence: Fence | null = null;
  return lines.map((line) => {
    const marker = fenceMarker(line);
    if (marker) {
      fence = toggleFence(fence, marker);
      return line;
    }
    if (fence) return line;
    const match = line.match(HEADING);
    if (!match) return line;
    const level = Math.min(6, Math.max(1, match[1].length + delta));
    return `${"#".repeat(level)} ${match[2]}`;
  });
}

/** Drops backticks, emphasis and link targets — safe for plain-text labels. */
export function stripMarkdownInline(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseMeta(lines: string[], grade?: string): StudyDocumentMeta {
  const meta: StudyDocumentMeta = {
    title: "",
    level: "",
    category: "",
    language: "",
    summary: "",
    footer: "",
  };

  for (const line of lines) {
    const match = line.match(META_LINE);
    if (!match) continue;
    const key = match[1].trim().toLowerCase();
    const value = match[2].trim();
    if (key === "уровень" || key === "level") meta.level = value;
    if (key === "категория" || key === "category") meta.category = value;
    if (key === "язык" || key === "language") meta.language = value;
    if (key === "кратко" || key === "summary") meta.summary = value;
    if (key === "футер" || key === "footer") meta.footer = value;
  }

  if (!meta.level) meta.level = gradeLabel(grade);
  return meta;
}

function isContentsTitle(title: string): boolean {
  return CONTENTS_TITLE.test(stripMarkdownInline(title));
}

function parseCardItems(lines: string[]): StudyCardItem[] {
  const items: StudyCardItem[] = [];
  let current: StudyCardItem | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("- ")) {
      if (current) items.push(current);
      const body = line.slice(2).trim();
      const match = body.match(/^\*\*(.+?)\*\*\s*(?:[—–:-]\s*)?(.*)$/);
      current = match
        ? { title: match[1].trim(), content: match[2].trim() }
        : { title: "", content: body };
      continue;
    }

    if (current) {
      current.content = `${current.content} ${line}`.trim();
    }
  }

  if (current) items.push(current);
  return items.filter((item) => item.title || item.content);
}

/**
 * Parses one `:::qa` directive: `- **Question?** — answer` per line.
 *
 * An item without a bold question or without an answer is dropped, so a bare
 * question never reaches the page as an empty collapsible block. Continuation
 * lines are joined into the answer, like card bodies.
 */
function parseQaItems(lines: string[]): StudyQaItem[] {
  const items: StudyQaItem[] = [];
  let current: StudyQaItem | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("- ")) {
      if (current) items.push(current);
      const body = line.slice(2).trim();
      const match = body.match(QA_ITEM);
      current = match
        ? { question: match[1].trim(), answer: match[2].trim() }
        : { question: "", answer: body };
      continue;
    }

    if (current) {
      current.answer = `${current.answer} ${line}`.trim();
    }
  }

  if (current) items.push(current);
  return items.filter((item) => item.question && item.answer);
}

function parseNote(lines: string[]): StudySectionBlock {
  let variant: StudyNoteVariant = "note";
  let body = lines;

  const marker = (lines[0] ?? "").trim().match(NOTE_MARKER);
  if (marker) {
    const kind = marker[1].toUpperCase();
    variant = kind === "WARNING" || kind === "CAUTION" ? "warn" : "note";
    body = lines.slice(1);
  } else if ((lines[0] ?? "").trim().startsWith("⚠")) {
    variant = "warn";
  }

  return { type: "note", variant, content: body.join("\n").trim() };
}

/**
 * Splits one collected quote into the notes it really contains.
 *
 * A line that is nothing but a `[!NOTE]`-style marker starts the next note,
 * so an alert written below the first line does not leak into the text as a
 * literal `[!WARNING]`. Markers inside a fenced block are code, not markers.
 * Chunks that are empty after trimming are dropped; everything else keeps its
 * order and inner blank lines.
 */
function splitNoteChunks(lines: string[]): string[][] {
  const chunks: string[][] = [];
  let current: string[] = [];
  let fence: Fence | null = null;

  for (const line of lines) {
    const marker = fenceMarker(line);
    if (marker) {
      fence = toggleFence(fence, marker);
      current.push(line);
      continue;
    }

    if (!fence && current.length > 0 && NOTE_MARKER.test(line.trim())) {
      chunks.push(current);
      current = [line];
      continue;
    }

    current.push(line);
  }

  chunks.push(current);
  return chunks.filter((chunk) => chunk.join("\n").trim() !== "");
}

/**
 * Finds the line that closes a `:::cards` directive.
 *
 * `:::` is only a closer outside fenced code, so a snippet that happens to
 * contain the marker cannot end the directive early.
 */
function findDirectiveEnd(lines: string[], from: number): number {
  let fence: Fence | null = null;

  for (let index = from; index < lines.length; index += 1) {
    const marker = fenceMarker(lines[index]);
    if (marker) {
      fence = toggleFence(fence, marker);
      continue;
    }
    if (!fence && CARDS_CLOSE.test(lines[index])) return index;
  }

  return -1;
}

/**
 * Splits a section body into typed blocks. Everything that is not a
 * `:::cards` / `:::qa` directive or a blockquote stays raw Markdown.
 */
export function parseStudySectionBody(markdown: string): StudySectionBlock[] {
  const lines = normalizeDocumentMarkdown(markdown).split("\n");
  const blocks: StudySectionBlock[] = [];
  let buffer: string[] = [];
  let fence: Fence | null = null;

  const flushMarkdown = () => {
    const content = buffer.join("\n").trim();
    if (content) blocks.push({ type: "markdown", content });
    buffer = [];
  };

  let index = 0;
  while (index < lines.length) {
    const line = lines[index];

    const marker = fenceMarker(line);
    if (marker) {
      fence = toggleFence(fence, marker);
      buffer.push(line);
      index += 1;
      continue;
    }

    if (!fence && QA_OPEN.test(line)) {
      const end = findDirectiveEnd(lines, index + 1);
      if (end !== -1) {
        flushMarkdown();
        blocks.push({
          type: "qa",
          items: parseQaItems(lines.slice(index + 1, end)),
        });
        index = end + 1;
        continue;
      }

      // Unclosed directive: drop the opener, keep the body as ordinary Markdown.
      index += 1;
      continue;
    }

    if (!fence && CARDS_OPEN.test(line)) {
      const end = findDirectiveEnd(lines, index + 1);
      if (end !== -1) {
        flushMarkdown();
        blocks.push({
          type: "cards",
          items: parseCardItems(lines.slice(index + 1, end)),
        });
        index = end + 1;
        continue;
      }

      // Unclosed directive: drop the opener so a raw `:::cards` marker never
      // reaches the page, and keep the body as ordinary Markdown.
      index += 1;
      continue;
    }

    if (!fence && line.startsWith(">")) {
      const quote: string[] = [];
      while (index < lines.length) {
        if (lines[index].startsWith(">")) {
          quote.push(lines[index].replace(/^>\s?/, ""));
          index += 1;
          continue;
        }
        const isBlank = lines[index].trim() === "";
        if (isBlank && (lines[index + 1] ?? "").startsWith(">")) {
          // A blank line followed by a new `> [!WARNING]`-style marker starts
          // the next note; without this, two adjacent alerts merge and the
          // second marker leaks into the first note's text.
          const nextLine = (lines[index + 1] ?? "").replace(/^>\s?/, "").trim();
          if (NOTE_MARKER.test(nextLine)) break;
          quote.push("");
          index += 1;
          continue;
        }
        break;
      }
      flushMarkdown();
      for (const chunk of splitNoteChunks(quote)) blocks.push(parseNote(chunk));
      continue;
    }

    buffer.push(line);
    index += 1;
  }

  flushMarkdown();
  return blocks;
}

interface SectionRange {
  title: string;
  body: string[];
}

function buildSections(lines: string[], ranges: SectionRange[]): StudySection[] {
  const sections: StudySection[] = [];

  for (const range of ranges) {
    if (!range.title || isContentsTitle(range.title)) continue;
    sections.push({
      id: `sec-${sections.length + 1}`,
      title: range.title,
      isSources: SOURCES_TITLE.test(stripMarkdownInline(range.title)),
      blocks: parseStudySectionBody(range.body.join("\n")),
    });
  }

  return sections;
}

export function parseStudyDocument(
  markdown: string,
  options: ParseStudyDocumentOptions = {},
): StudyDocument | null {
  const lines = normalizeDocumentMarkdown(markdown).split("\n");
  const headings = collectHeadings(lines);
  const h1s = headings.filter((heading) => heading.level === 1);
  if (h1s.length === 0) return null;

  const titleHeading = h1s[0];
  // Legacy files used H1 for both the title and every section. New files keep
  // a single H1 and use H2 for sections; both shapes are accepted until the
  // content migration is finished.
  const legacy = h1s.length >= 2;
  const firstSectionIndex = legacy
    ? h1s[1].index
    : (headings.find(
        (heading) => heading.level === 2 && heading.index > titleHeading.index,
      )?.index ?? lines.length);

  const meta = parseMeta(
    lines.slice(titleHeading.index + 1, firstSectionIndex),
    options.grade,
  );
  meta.title = titleHeading.title;

  const sectionHeadings = headings.filter((heading) =>
    legacy
      ? heading.level === 1 && heading.index > titleHeading.index
      : heading.level === 2 && heading.index > titleHeading.index,
  );

  const ranges: SectionRange[] = sectionHeadings.map((heading, position) => {
    const end =
      position + 1 < sectionHeadings.length
        ? sectionHeadings[position + 1].index
        : lines.length;
    const body = lines.slice(heading.index + 1, end);
    return {
      title: heading.title,
      body: legacy ? shiftHeadings(body, 1) : body,
    };
  });

  const document: StudyDocument = {
    meta,
    sections: buildSections(lines, ranges),
  };
  attachStudyInterviewQuestions(document, options);
  return document;
}

function attachStudyInterviewQuestions(
  document: StudyDocument,
  options: ParseStudyDocumentOptions,
): void {
  if (!options?.materialId) return;
  const topics = getStudyInterviewTopics(options.materialId);
  if (!topics.length) return;
  const qaSections = document.sections.filter((section) =>
    section.blocks.some(
      (block) =>
        block.type === "markdown" &&
        /Вопросы на собеседовании/i.test(block.content),
    ),
  );
  qaSections.forEach((section, index) => {
    const topic = topics[index];
    if (!topic) return;
    section.blocks.push({
      type: "qa",
      items: topic.questions.map((item) => ({
        question: item.question,
        answer: item.answer,
      })),
    });
  });
}

export function studyEyebrow(meta: StudyDocumentMeta): string {
  const parts = [meta.category || meta.language, meta.level].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "Учебный материал";
}

export function studyLead(meta: StudyDocumentMeta): string {
  if (meta.summary) return meta.summary;
  if (meta.category) {
    return `Учебный конспект по категории «${meta.category}»${
      meta.level ? ` для уровня ${meta.level}` : ""
    }.`;
  }
  return `Учебный конспект по теме «${stripMarkdownInline(meta.title)}»${
    meta.level ? ` для уровня ${meta.level}` : ""
  }.`;
}

export function studyFooterText(meta: StudyDocumentMeta): string {
  if (meta.footer) return meta.footer;
  const level = meta.level ? ` для уровня ${meta.level}` : "";
  const language = meta.language
    ? ` Примеры ориентированы на ${meta.language}.`
    : "";
  return `Учебный конспект${level}.${language}`;
}
