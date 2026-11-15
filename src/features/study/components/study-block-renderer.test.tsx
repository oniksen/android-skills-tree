import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { StudySectionBlock } from "../model/parse-study-document";
import {
  STUDY_BLOCK_RENDERERS,
  StudyBlockRenderer,
} from "./study-block-renderer";

const BLOCK_TYPES: StudySectionBlock["type"][] = ["markdown", "cards", "note"];

function render(block: StudySectionBlock, sources = false): string {
  return renderToStaticMarkup(
    <StudyBlockRenderer block={block} sources={sources} />,
  );
}

describe("StudyBlockRenderer", () => {
  it("реестр покрывает все типы блоков и ничего лишнего", () => {
    expect(Object.keys(STUDY_BLOCK_RENDERERS).sort()).toEqual(
      [...BLOCK_TYPES].sort(),
    );
  });

  it("рендерит markdown-блок как прозу", () => {
    const html = render({ type: "markdown", content: "**Текст** и `код`." });

    expect(html).toContain("<p>");
    expect(html).toContain("<strong>Текст</strong>");
  });

  it("рендерит markdown-блок источников пилюлями", () => {
    const html = render(
      { type: "markdown", content: "- [Документация](https://example.com)" },
      true,
    );

    expect(html).toContain('class="study-pills"');
    expect(html).toContain('class="study-pill"');
  });

  it("рендерит cards", () => {
    const html = render({
      type: "cards",
      items: [{ title: "Имя", content: "Описание." }],
    });

    expect(html).toContain('class="study-cards"');
    expect(html).toContain('class="study-card-title">Имя');
  });

  it("ничего не рендерит для пустого :::cards", () => {
    const html = render({ type: "cards", items: [] });

    expect(html).toBe("");
  });

  it("рендерит заметку", () => {
    const html = render({ type: "note", variant: "note", content: "Текст." });

    expect(html).toContain('class="study-note"');
    expect(html).not.toContain("study-note--warn");
  });

  it("рендерит предупреждение вариантом note--warn", () => {
    const html = render({ type: "note", variant: "warn", content: "Текст." });

    expect(html).toContain("study-note study-note--warn");
  });
});
