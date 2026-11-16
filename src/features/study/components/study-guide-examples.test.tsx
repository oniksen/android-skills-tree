import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  hasExactClass,
  studyHtmlMessages,
  validateStudyMarkup,
} from "./study-html-validator";
import StudyMarkdownRenderer from "./StudyMarkdownRenderer";

/**
 * The guide is the contract authors read, so its examples must be renderable
 * and valid. Each snippet below is copied verbatim from
 * STUDY_MATERIALS_FORMATTING.txt; the first test fails if the guide drifts.
 */
const CODE_EXAMPLE = ["```kotlin", 'val name = "Alex"', "```"].join("\n");

const TABLE_EXAMPLE = [
  "| Тип | Размер | Назначение |",
  "|---|---|---|",
  "| `Int` | 32 бита | Основной целочисленный тип |",
  "| `Long` | 64 бита | Большие целые числа |",
].join("\n");

const CARDS_EXAMPLE = [
  ":::cards",
  "- **Имя** — понятное имя описывает назначение: `userName`, а не `x`.",
  "- **Значение** — можно вычислить или получить от пользователя.",
  "- **Тип** — Kotlin знает тип переменной.",
  ":::",
].join("\n");

const NOTE_EXAMPLE = "> **Запомнить:** выбирайте `val` по умолчанию.";

const WARNING_EXAMPLE = [
  "> [!WARNING]",
  "> Вызов `lateinit`-свойства до инициализации бросает",
  "> `UninitializedPropertyAccessException`.",
].join("\n");

const ALERTS_EXAMPLE = [
  "> [!NOTE]",
  "> Обычная заметка.",
  "",
  "> [!TIP]",
  "> Подсказка.",
].join("\n");

const CHECKLIST_EXAMPLE = [
  "- [ ] Первый пункт самопроверки.",
  "- [ ] Второй пункт.",
  "- [x] Уже отмеченный пункт.",
].join("\n");

const IMAGE_EXAMPLE =
  "![Схема жизненного цикла](https://example.com/lifecycle.png)";

const EXAMPLES = {
  code: CODE_EXAMPLE,
  table: TABLE_EXAMPLE,
  cards: CARDS_EXAMPLE,
  note: NOTE_EXAMPLE,
  warning: WARNING_EXAMPLE,
  alerts: ALERTS_EXAMPLE,
  checklist: CHECKLIST_EXAMPLE,
  image: IMAGE_EXAMPLE,
};

/** A valid material assembled only from the guide's own examples. */
const MATERIAL = [
  "# Переменные в Kotlin",
  "",
  "**Уровень:** Junior",
  "**Категория:** Основы программирования",
  "**Язык:** Kotlin",
  "**Кратко:** Примеры из гайда STUDY_MATERIALS_FORMATTING.txt.",
  "",
  "## 1. Код",
  "",
  CODE_EXAMPLE,
  "",
  "## 2. Таблица",
  "",
  TABLE_EXAMPLE,
  "",
  "## 3. Карточки",
  "",
  CARDS_EXAMPLE,
  "",
  "## 4. Заметки",
  "",
  NOTE_EXAMPLE,
  "",
  WARNING_EXAMPLE,
  "",
  ALERTS_EXAMPLE,
  "",
  "## 5. Самопроверка",
  "",
  CHECKLIST_EXAMPLE,
  "",
  "## 6. Рисунок",
  "",
  IMAGE_EXAMPLE,
  "",
].join("\n");

const GUIDE = readFileSync(
  new URL("../../../../STUDY_MATERIALS_FORMATTING.txt", import.meta.url),
  "utf8",
).replace(/\r\n?/g, "\n");

const HTML = renderToStaticMarkup(
  <StudyMarkdownRenderer content={MATERIAL} grade="junior" />,
);

describe("примеры из гайда", () => {
  it("скопированы из STUDY_MATERIALS_FORMATTING.txt", () => {
    for (const [name, example] of Object.entries(EXAMPLES)) {
      expect(GUIDE, name).toContain(example);
    }
  });

  it("дают валидный HTML", async () => {
    const report = await validateStudyMarkup(HTML);

    expect(studyHtmlMessages(report)).toEqual([]);
    expect(report.valid).toBe(true);
  });

  it("дают ожидаемые блоки и классы", () => {
    for (const className of [
      "study-hero",
      "study-title",
      "study-section",
      "study-section-title",
      "study-code-wrap",
      "study-code-lang",
      "study-code",
      "study-copy",
      "study-table-wrap",
      "study-table",
      "study-cards",
      "study-card",
      "study-card-title",
      "study-note",
      "study-note--warn",
      "study-checklist",
      "study-check-item",
      "study-figure",
      "study-figure-caption",
    ]) {
      expect(hasExactClass(HTML, className), className).toBe(true);
    }

    expect(HTML).toContain('class="hljs language-kotlin"');
    expect(HTML).toContain("Схема жизненного цикла");
  });

  it("не оставляют на странице сырых маркеров", () => {
    for (const marker of [
      ":::cards",
      ":::",
      "[!NOTE]",
      "[!TIP]",
      "[!WARNING]",
      "[!CAUTION]",
    ]) {
      expect(HTML, marker).not.toContain(marker);
    }
  });

  it("подписывают таблицу, как обещает гайд", () => {
    expect(HTML).toContain('role="group"');
    expect(HTML).toContain('aria-label="Таблица"');
    expect(HTML).toContain('tabindex="0"');
    expect(HTML).toContain(
      'class="study-figure-caption">Схема жизненного цикла',
    );
  });

  it("разделяют два алерта на две заметки", () => {
    const notes = HTML.match(/class="study-note"/g) ?? [];
    const warnings = HTML.match(/class="study-note study-note--warn"/g) ?? [];

    // Plain note + NOTE + TIP: three plain notes, one of them from the pair.
    expect(notes.length).toBe(3);
    expect(warnings.length).toBe(1);
  });
});
