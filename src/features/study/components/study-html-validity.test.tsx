import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { STUDY_MATERIALS } from "../study-materials.generated";
import { renderFixture, renderFixturePage } from "./study-html-fixture";
import {
  hasExactClass,
  studyHtmlMessages as messagesOf,
  validateStudyMarkup as validate,
} from "./study-html-validator";
import StudyMarkdownRenderer from "./StudyMarkdownRenderer";

/**
 * The word `NaN` may legitimately appear in a material about numbers, so in
 * real content only check where the renderer interpolates a value: `class`
 * attributes (`class="study-…undefined"`).
 */
function placeholderLeaks(html: string): string[] {
  return [...html.matchAll(/class="([^"]*)"/g)]
    .map(([, value]) => value)
    .filter((value) => /undefined|NaN/.test(value));
}

describe("hasExactClass", () => {
  it("не путает класс с его префиксным соседом", () => {
    expect(hasExactClass('<div class="study-cards">', "study-card")).toBe(false);
    expect(hasExactClass('<div class="study-cards">', "study-cards")).toBe(true);
    expect(hasExactClass('<h2 class="study-section-title">', "study-section")).toBe(false);
    expect(hasExactClass('<div class="study-table-wrap">', "study-table")).toBe(false);
    expect(hasExactClass('<div class="study-code-wrap">', "study-code")).toBe(false);
    expect(hasExactClass('<ul class="study-pills">', "study-pill")).toBe(false);
    expect(hasExactClass('<figcaption class="study-figure-caption">', "study-figure")).toBe(false);
  });

  it("находит класс в составном значении атрибута", () => {
    const html = '<div class="study-note study-note--warn">';

    expect(hasExactClass(html, "study-note")).toBe(true);
    expect(hasExactClass(html, "study-note--warn")).toBe(true);
    expect(hasExactClass('<div class="study-note--warn">', "study-note")).toBe(false);
  });
});

describe("HTML учебных материалов", () => {
  it("валиден для синтетического фикстура со всеми типами блоков", async () => {
    const html = renderFixture();
    const report = await validate(html);

    expect(messagesOf(report)).toEqual([]);
    expect(report.valid).toBe(true);
  });

  it("валиден каркас страницы с тем же фикстуром", async () => {
    const report = await validate(renderFixturePage());

    expect(messagesOf(report)).toEqual([]);
    expect(report.valid).toBe(true);
  });

  it("валиден fallback без H1", async () => {
    const html = renderToStaticMarkup(
      <StudyMarkdownRenderer content="Просто текст без заголовка." />,
    );
    const report = await validate(html);

    expect(messagesOf(report)).toEqual([]);
    expect(report.valid).toBe(true);
    expect(hasExactClass(html, "study-markdown")).toBe(true);
  });

  it("фикстур содержит каждый тип блока", () => {
    const html = renderFixture();

    for (const className of [
      "study-hero",
      "study-eyebrow",
      "study-title",
      "study-lead",
      "study-layout",
      "study-content",
      "study-toc",
      "study-toc-rail",
      "study-toc-compact",
      "study-toc-summary",
      "study-toc-list",
      "study-toc-group",
      "study-toc-link",
      "study-section",
      "study-section-title",
      "study-subtitle",
      "study-subtitle--minor",
      "study-list",
      "study-cards",
      "study-card",
      "study-card-title",
      "study-note",
      "study-note--warn",
      "study-checklist",
      "study-check-item",
      "study-table-wrap",
      "study-table",
      "study-code-wrap",
      "study-code-bar",
      "study-code-lang",
      "study-code",
      "study-copy",
      "study-figure",
      "study-figure-caption",
      "study-pills",
      "study-pill",
      "study-divider",
      "study-footer",
    ]) {
      expect(hasExactClass(html, className), className).toBe(true);
    }
  });

  it("фикстур не содержит raw markdown-маркеров", () => {
    const html = renderFixture();

    for (const marker of [":::cards", ":::", "[!NOTE]", "[!TIP]", "[!IMPORTANT]", "[!WARNING]", "[!CAUTION]", "undefined", "NaN"]) {
      expect(html, marker).not.toContain(marker);
    }

    expect(placeholderLeaks(html)).toEqual([]);
  });

  it("подписывает навигацию, таблицы, рисунки и кнопку копирования", () => {
    const html = renderFixture();

    expect(html).toContain('aria-label="Содержание материала"');
    expect(html).toContain('aria-label="Таблица"');
    expect(html).toContain("aria-label=\"Копировать");
    expect(html).toContain('class="study-figure-caption">Схема работы компилятора');
    expect(html).toContain('aria-labelledby="obyavlenie-peremennoy-title"');
  });

  for (const material of Object.values(STUDY_MATERIALS)) {
    it(`${material.id}: валидный HTML`, async () => {
      const html = renderToStaticMarkup(
        <StudyMarkdownRenderer content={material.content} grade={material.grade} />,
      );
      const report = await validate(html);

      expect(messagesOf(report)).toEqual([]);
      expect(report.valid).toBe(true);
    });

    it(`${material.id}: нет raw markdown-маркеров`, () => {
      const html = renderToStaticMarkup(
        <StudyMarkdownRenderer content={material.content} grade={material.grade} />,
      );

      expect(hasExactClass(html, "study-hero")).toBe(true);
      expect(hasExactClass(html, "study-section")).toBe(true);
      expect(hasExactClass(html, "study-title")).toBe(true);
      for (const marker of [":::cards", ":::", "[!NOTE]", "[!TIP]", "[!IMPORTANT]", "[!WARNING]", "[!CAUTION]"]) {
        expect(html, marker).not.toContain(marker);
      }
      // `undefined`/`NaN` may be real prose here; only rendered values count.
      expect(placeholderLeaks(html)).toEqual([]);
    });
  }

  it("валидатор действительно ловит невалидный HTML", async () => {
    expect((await validate("<p><figure></figure></p>")).valid).toBe(false);
    expect((await validate("<ul><div>текст</div></ul>")).valid).toBe(false);
  });
});
