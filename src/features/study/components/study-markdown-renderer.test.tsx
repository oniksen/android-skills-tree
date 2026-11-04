import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import StudyMarkdownRenderer from "./StudyMarkdownRenderer";

const CONTENT = `# Переменные

**Уровень:** Junior
**Категория:** Основы программирования
**Язык:** Kotlin
**Кратко:** Краткое описание материала.

## 1. Объявление переменной

Текст раздела.

:::cards
- **Имя** — понятное имя переменной.
- **Тип** — тип значения.
:::

> [!WARNING]
> Не вызывайте до инициализации.

- [ ] Первый пункт самопроверки.
- [ ] Второй пункт самопроверки.

| Тип | Размер |
|---|---|
| \`Int\` | 32 бита |

### 1.1. Пример кода

\`\`\`kotlin
val x = 1
\`\`\`

## 2. Итог

Текст.

![Схема работы](https://example.com/scheme.png)

## Источники и документация

### Документация

- [Properties](https://kotlinlang.org/docs/properties.html)
`;

function render(): string {
  return renderToStaticMarkup(<StudyMarkdownRenderer content={CONTENT} grade="junior" />);
}

describe("StudyMarkdownRenderer", () => {
  it("рисует hero, навигацию и секции", () => {
    const html = render();

    expect(html).toContain('class="study-hero"');
    expect(html).toContain('class="study-title"');
    expect(html).toContain("Основы программирования · Junior");
    expect(html).toContain('href="#sec-1"');
    expect(html).toContain('href="#sec-2"');
    expect(html).toContain('class="study-section"');
    expect(html).toContain('class="study-section-title"');
    expect(html).toContain('id="sec-1-title"');
    // Numbered titles must stay text, not turn into an ordered list.
    expect(html).toContain("1. Объявление переменной</h2>");
  });

  it("превращает :::cards в сетку карточек", () => {
    const html = render();

    expect(html).toContain('class="study-cards"');
    expect(html).toContain('class="study-card"');
    expect(html).toContain('class="study-card-title"');
    expect((html.match(/class="study-card"/g) ?? []).length).toBe(2);
  });

  it("рисует предупреждение вариантом note--warn", () => {
    const html = render();

    expect(html).toContain("study-note--warn");
    expect(html).not.toContain("[!WARNING]");
  });

  it("превращает task list в чек-лист", () => {
    const html = render();

    expect(html).toContain('class="study-checklist"');
    expect(html).toContain('class="study-check-item"');
    expect((html.match(/class="study-check-item"/g) ?? []).length).toBe(2);
  });

  it("оборачивает таблицу в скроллируемый контейнер", () => {
    const html = render();

    expect(html).toContain('class="study-table-wrap"');
    expect(html).toContain('class="study-table"');
    expect(html).toContain('role="region"');
  });

  it("рендерит блок кода с языком и кнопкой копирования", () => {
    const html = render();

    expect(html).toContain('class="study-code-wrap"');
    expect(html).toContain('class="study-code-lang">kotlin');
    expect(html).toContain('class="study-copy"');
    expect(html).toContain('class="hljs-keyword">val');
  });

  it("рендерит ссылки источников пилюлями", () => {
    const html = render();

    expect(html).toContain('class="study-pills"');
    expect(html).toContain('class="study-pill"');
    expect(html).toContain('href="https://kotlinlang.org/docs/properties.html"');
  });

  it("рендерит картинку как figure с подписью", () => {
    const html = render();

    expect(html).toContain('class="study-figure"');
    expect(html).toContain('class="study-figure-caption">Схема работы');
    expect(html).toContain('alt="Схема работы"');
  });

  it("не оставляет raw HTML в тексте", () => {
    const html = render();

    expect(html).not.toContain("&lt;div");
    expect(html).not.toContain("&lt;table");
  });

  it("не падает на файле без H1", () => {
    const html = renderToStaticMarkup(
      <StudyMarkdownRenderer content="Просто текст без заголовка." />,
    );

    expect(html).toContain('class="study-markdown"');
    expect(html).toContain("Просто текст без заголовка.");
  });
});
