"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import StudyCodeBlock from "./StudyCodeBlock";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(text: string) {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function gradeLabel(grade?: string) {
  const labels: Record<string, string> = {
    junior: "Junior",
    middle: "Middle",
    "strong-middle": "Strong Middle",
    senior: "Senior",
  };
  return grade ? labels[grade] ?? grade : "";
}

function parseStudyMeta(lines: string[]) {
  const meta = {
    level: "",
    category: "",
    language: "",
    summary: "",
    footer: "",
  };

  for (const line of lines) {
    const match = line.match(/^\*\*([^:*]+):\*\*\s*(.+?)\s*$/);
    if (!match) continue;
    const key = match[1].trim().toLowerCase();
    const value = match[2].trim();
    if (key === "уровень" || key === "level") meta.level = value;
    if (key === "категория" || key === "category") meta.category = value;
    if (key === "язык" || key === "language") meta.language = value;
    if (key === "кратко" || key === "summary") meta.summary = value;
    if (key === "футер" || key === "footer") meta.footer = value;
  }

  return meta;
}

export function applyStudyPattern(content: string, grade?: string): string {
  const lines = content.split(/\r?\n/);
  const h1Indices = lines
    .map((line, index) => (line.startsWith("# ") ? index : -1))
    .filter((index) => index >= 0);

  if (h1Indices.length < 2) return content;

  const title = lines[h1Indices[0]].slice(2).trim();
  const meta = parseStudyMeta(lines.slice(h1Indices[0] + 1, h1Indices[1]));
  const level = meta.level || gradeLabel(grade);
  const category = meta.category;
  const language = meta.language;
  const eyebrowParts = [category || language, level].filter(Boolean);
  const eyebrow =
    eyebrowParts.length > 0
      ? eyebrowParts.map(escapeHtml).join(" · ")
      : "Учебный материал";
  const lead = meta.summary
    ? inline(meta.summary)
    : category
      ? `Учебный конспект по категории «${escapeHtml(category)}»${level ? ` для уровня ${escapeHtml(level)}` : ""}.`
      : `Учебный конспект по теме «${escapeHtml(title)}»${level ? ` для уровня ${escapeHtml(level)}` : ""}.`;
  const footer = meta.footer
    ? inline(meta.footer)
    : `Учебный конспект${level ? ` для уровня ${escapeHtml(level)}` : ""}.${language ? ` Примеры ориентированы на ${escapeHtml(language)}.` : ""}`;
  const sectionIndices = h1Indices.slice(1);
  const sections = sectionIndices.map((startIndex, sectionNumber) => {
    const endIndex =
      sectionNumber + 1 < sectionIndices.length
        ? sectionIndices[sectionNumber + 1]
        : lines.length;
    const heading = lines[startIndex].slice(2).trim();
    const rawBody = lines.slice(startIndex + 1, endIndex);

    const transformedLines: string[] = [];
    let sourcePills: string[] = [];
    let inSources = false;

    const flushPills = () => {
      if (sourcePills.length > 0) {
        transformedLines.push(
          `<div class="study-flow">\n${sourcePills.join("\n")}\n</div>`,
        );
        sourcePills = [];
      }
    };

    for (const line of rawBody) {
      if (line.startsWith("## ")) {
        flushPills();
        const title = line.slice(3).trim();
        if (/источник/i.test(title)) inSources = true;
        else inSources = false;
        transformedLines.push(
          `<h3 class="study-subtitle">${inline(title)}</h3>\n`,
        );
        continue;
      }
      if (line.startsWith("### ")) {
        flushPills();
        transformedLines.push(
          `<p class="study-small"><strong>${inline(line.slice(4).trim())}</strong></p>\n`,
        );
        continue;
      }

      if (inSources) {
        const match = line.match(/^- \[([^\]]+)\]\(([^)]+)\)$/);
        if (match) {
          sourcePills.push(
            `<a class="study-pill" href="${match[2]}" target="_blank" rel="noopener noreferrer">${inline(match[1])}</a>`,
          );
          continue;
        }
      }

      flushPills();
      transformedLines.push(line);
    }
    flushPills();

    const body = transformedLines.join("\n").trim();

    return { heading, body };
  });

  const nav = sections
    .map(
      (section, index) =>
        `<a class="study-nav-link" href="#sec-${index + 1}">${inline(section.heading)}</a>`,
    )
    .join("\n");

  const renderedSections = sections
    .map(
      (section, index) =>
        `<section id="sec-${index + 1}" class="study-section">\n<h2 class="study-section-title">${inline(section.heading)}</h2>\n\n${section.body}\n</section>`,
    )
    .join("\n\n");

  return `<header class="study-hero">
<p class="study-eyebrow">${eyebrow}</p>
<h1 class="study-title">${inline(title)}</h1>
<p class="study-lead">
${lead}
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
${nav}
</nav>

${renderedSections}

<footer class="study-footer">
${footer}
</footer>`;
}

export default function StudyMarkdownRenderer({
  content,
  grade,
}: {
  content: string;
  grade?: string;
}) {
  const transformed = applyStudyPattern(content, grade);

  return (
    <div className="study-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          pre: ({ children }) => <>{children}</>,
          table: ({ children, ...props }) => (
            <table className="study-table" {...props}>
              {children}
            </table>
          ),
          ul: ({ children, ...props }) => (
            <ul className="study-list" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="study-list" {...props}>
              {children}
            </ol>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = Boolean(className);
            if (!isBlock) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            const text = String(children).replace(/\n$/, "");
            return <StudyCodeBlock code={text}>{children}</StudyCodeBlock>;
          },
        }}
      >
        {transformed}
      </ReactMarkdown>
    </div>
  );
}
