import { HtmlValidate, type Report } from "html-validate";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { STUDY_MATERIALS } from "../study-materials.generated";
import StudyMarkdownRenderer from "./StudyMarkdownRenderer";

/**
 * The renderer produces a page fragment, not a document: wrap it in the
 * smallest valid shell so html-validate can check the real DOM it emits.
 */
function documentFor(body: string): string {
  return `<!DOCTYPE html><html lang="ru"><head><title>test</title></head><body>${body}</body></html>`;
}

const htmlvalidate = new HtmlValidate({
  extends: ["html-validate:recommended"],
  rules: {
    // react-dom/server serialises booleans as `disabled=""` and voids as
    // `<input/>`; both are serializer artefacts, not authored markup.
    "attribute-boolean-style": "off",
    "void-style": "off",
    // GFM table alignment arrives as `style="text-align:right"` from the
    // Markdown pipeline; there is no class-based equivalent to switch to.
    "no-inline-style": "off",
  },
});

async function validate(markup: string): Promise<Report> {
  return htmlvalidate.validateString(documentFor(markup));
}

function messagesOf(report: Report): string[] {
  return report.results.flatMap((result) =>
    result.messages.map(
      (message) => `${message.ruleId} (${message.line}:${message.column}) ${message.message}`,
    ),
  );
}

/** Covers every block type the pipeline can emit. */
const FIXTURE = `# Переменные в Kotlin

**Уровень:** Junior
**Категория:** Основы программирования
**Язык:** Kotlin
**Кратко:** Как объявлять переменные и чем отличаются \`val\` и \`var\`.

## 1. Объявление переменной

Текст раздела с [внешней ссылкой](https://kotlinlang.org/docs/properties.html) и \`кодом\`.

### 1.1. Подраздел

:::cards
- **Имя** — понятное имя переменной.
- **Тип** — тип значения.
:::

> [!NOTE]
> Обычная заметка с \`inline\` кодом.

> [!WARNING]
> Предупреждение о вызове до инициализации.

- [ ] Первый пункт самопроверки.
- [x] Второй пункт самопроверки.

| Тип | Размер |
|---|---|
| \`Int\` | 32 бита |

\`\`\`kotlin
val x = 1
\`\`\`

![Схема работы компилятора](https://example.com/scheme.png)

---

## Источники и документация

### Официальная документация

- [Properties](https://kotlinlang.org/docs/properties.html)
`;

function renderFixture(): string {
  return renderToStaticMarkup(
    <StudyMarkdownRenderer content={FIXTURE} grade="junior" />,
  );
}

describe("HTML учебных материалов", () => {
  it("валиден для синтетического фикстура со всеми типами блоков", async () => {
    const html = renderFixture();
    const report = await validate(html);

    expect(messagesOf(report)).toEqual([]);
    expect(report.valid).toBe(true);
  });

  it("фикстур содержит каждый тип блока", () => {
    const html = renderFixture();

    for (const className of [
      "study-hero",
      "study-nav",
      "study-section",
      "study-cards",
      "study-card",
      "study-note",
      "study-note--warn",
      "study-checklist",
      "study-table-wrap",
      "study-table",
      "study-code-wrap",
      "study-code",
      "study-figure",
      "study-figure-caption",
      "study-pills",
      "study-pill",
      "study-footer",
    ]) {
      expect(html, className).toContain(className);
    }
  });

  it("фикстур не содержит raw markdown-маркеров", () => {
    const html = renderFixture();

    for (const marker of [":::cards", "[!NOTE]", "[!TIP]", "[!IMPORTANT]", "[!WARNING]", "[!CAUTION]", "undefined", "NaN"]) {
      expect(html, marker).not.toContain(marker);
    }
  });

  it("подписывает навигацию, таблицы, рисунки и кнопку копирования", () => {
    const html = renderFixture();

    expect(html).toContain('aria-label="Содержание"');
    expect(html).toContain('aria-label="Таблица"');
    expect(html).toContain("aria-label=\"Копировать");
    expect(html).toContain('class="study-figure-caption">Схема работы компилятора');
    expect(html).toContain('aria-labelledby="sec-1-title"');
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

      expect(html).toContain('class="study-hero"');
      expect(html).toContain('class="study-section"');
      expect(html).toContain('class="study-title"');
      for (const marker of [":::cards", "[!NOTE]", "[!TIP]", "[!IMPORTANT]", "[!WARNING]", "[!CAUTION]", "undefined", "NaN"]) {
        expect(html, marker).not.toContain(marker);
      }
    });
  }
});
