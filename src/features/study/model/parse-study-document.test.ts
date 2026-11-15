import { describe, expect, it } from "vitest";
import {
  parseStudyDocument,
  parseStudySectionBody,
  shiftHeadings,
  stripMarkdownInline,
  studyEyebrow,
  studyLead,
} from "./parse-study-document";

const NEW_FORMAT = `# Переменные

**Уровень:** Junior
**Категория:** Основы программирования
**Язык:** Kotlin
**Кратко:** Краткое описание материала.

## 1. Объявление переменной

Текст с \`val\` и **жирным**.

### 1.1. \`val\` и \`var\`

Ещё текст.

## 2. Типы

| Тип | Размер |
|---|---|
| \`Int\` | 32 бита |

## Содержание

1. [Объявление](#1)

## Источники и документация

### Официальная документация

- [Properties](https://kotlinlang.org/docs/properties.html)
- [Basic syntax](https://kotlinlang.org/docs/basic-syntax.html)
`;

describe("parseStudyDocument", () => {
  it("извлекает заголовок, метаданные и разделы", () => {
    const document = parseStudyDocument(NEW_FORMAT, { grade: "junior" });

    expect(document).not.toBeNull();
    expect(document?.meta).toMatchObject({
      title: "Переменные",
      level: "Junior",
      category: "Основы программирования",
      language: "Kotlin",
      summary: "Краткое описание материала.",
    });
    expect(document?.sections.map((section) => section.title)).toEqual([
      "1. Объявление переменной",
      "2. Типы",
      "Источники и документация",
    ]);
    expect(document?.sections.map((section) => section.id)).toEqual([
      "sec-1",
      "sec-2",
      "sec-3",
    ]);
  });

  it("пропускает раздел содержания", () => {
    const document = parseStudyDocument(NEW_FORMAT);
    const titles = document?.sections.map((section) => section.title) ?? [];

    expect(titles.some((title) => /содержание/i.test(title))).toBe(false);
  });

  it("помечает раздел источников", () => {
    const document = parseStudyDocument(NEW_FORMAT);
    const sources = document?.sections.at(-1);

    expect(sources?.isSources).toBe(true);
    expect(document?.sections[0].isSources).toBe(false);
  });

  it("оставляет блоки markdown нетронутыми", () => {
    const document = parseStudyDocument(NEW_FORMAT);
    const blocks = document?.sections[1].blocks ?? [];

    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toMatchObject({ type: "markdown" });
    if (blocks[0].type === "markdown") {
      expect(blocks[0].content).toContain("| Тип | Размер |");
    }
  });

  it("поддерживает старый формат, где H1 — разделы", () => {
    const legacy = `# Старый материал

**Уровень:** Middle

# 1. Первый

Текст.

## 1.1. Подраздел

Ещё текст.

# 2. Второй

Текст.
`;
    const document = parseStudyDocument(legacy);

    expect(document?.meta.title).toBe("Старый материал");
    expect(document?.sections.map((section) => section.title)).toEqual([
      "1. Первый",
      "2. Второй",
    ]);
    const blocks = document?.sections[0].blocks ?? [];
    const markdown = blocks
      .filter((block) => block.type === "markdown")
      .map((block) => block.content)
      .join("\n");
    expect(markdown).toContain("### 1.1. Подраздел");
  });

  it("не считает заголовки внутри блока кода разделами", () => {
    const content = `# Тема

**Уровень:** Junior

## Раздел

\`\`\`kotlin
// # не заголовок
val x = 1
\`\`\`

## Второй

Текст.
`;
    const document = parseStudyDocument(content);

    expect(document?.sections).toHaveLength(2);
    expect(document?.sections[0].title).toBe("Раздел");
  });

  it("возвращает null, если в файле нет H1", () => {
    expect(parseStudyDocument("просто текст")).toBeNull();
  });

  it("подставляет уровень из grade, если он не указан", () => {
    const document = parseStudyDocument("# Тема\n\n## Раздел\n\nТекст.", {
      grade: "senior",
    });

    expect(document?.meta.level).toBe("Senior");
  });
});

describe("parseStudySectionBody", () => {
  it("превращает цитату в заметку", () => {
    const blocks = parseStudySectionBody(
      "Текст.\n\n> **Запомнить:** используйте `val`.\n\nЕщё текст.",
    );

    expect(blocks.map((block) => block.type)).toEqual([
      "markdown",
      "note",
      "markdown",
    ]);
    expect(blocks[1]).toMatchObject({
      type: "note",
      variant: "note",
      content: "**Запомнить:** используйте `val`.",
    });
  });

  it("распознаёт предупреждение и убирает маркер", () => {
    const blocks = parseStudySectionBody(
      "> [!WARNING]\n> Не вызывайте до инициализации.\n\nПосле.",
    );

    expect(blocks[0]).toMatchObject({
      type: "note",
      variant: "warn",
      content: "Не вызывайте до инициализации.",
    });
  });

  it("сохраняет пустые строки внутри заметки", () => {
    const blocks = parseStudySectionBody("> Первый абзац.\n>\n> Второй абзац.");

    expect(blocks[0]).toMatchObject({
      type: "note",
      content: "Первый абзац.\n\nВторой абзац.",
    });
  });

  it("разбирает директиву :::cards", () => {
    const blocks = parseStudySectionBody(`До.

:::cards
- **Имя** — понятное имя переменной.
- **Тип** — Kotlin знает тип.
- Без заголовка.
:::

После.`);

    expect(blocks.map((block) => block.type)).toEqual([
      "markdown",
      "cards",
      "markdown",
    ]);
    expect(blocks[1]).toMatchObject({
      type: "cards",
      items: [
        { title: "Имя", content: "понятное имя переменной." },
        { title: "Тип", content: "Kotlin знает тип." },
        { title: "", content: "Без заголовка." },
      ],
    });
  });

  it("склеивает перенесённые строки карточки", () => {
    const blocks = parseStudySectionBody(`:::cards
- **Имя** — первая часть
  вторая часть.
:::`);

    expect(blocks[0]).toMatchObject({
      type: "cards",
      items: [{ title: "Имя", content: "первая часть вторая часть." }],
    });
  });

  it("не трогает цитаты и директивы внутри блока кода", () => {
    const blocks = parseStudySectionBody(
      "```text\n> не заметка\n:::cards\n:::\n```",
    );

    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe("markdown");
  });

  it("не превращает незакрытую директиву в карточки", () => {
    const blocks = parseStudySectionBody(":::cards\n- **Имя** — текст.");

    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe("markdown");
  });
});

describe("вспомогательные функции", () => {
  it("сдвигает уровни заголовков, пропуская код", () => {
    const shifted = shiftHeadings(["## A", "```", "## B", "```", "### C"], 1);

    expect(shifted).toEqual(["### A", "```", "## B", "```", "#### C"]);
  });

  it("очищает инлайн-разметку", () => {
    expect(stripMarkdownInline("1. `val` и **var** [ссылка](https://x.y)")).toBe(
      "1. val и var ссылка",
    );
  });

  it("собирает eyebrow из категории и уровня", () => {
    expect(
      studyEyebrow({
        title: "Тема",
        level: "Junior",
        category: "Основы",
        language: "Kotlin",
        summary: "",
        footer: "",
      }),
    ).toBe("Основы · Junior");
  });

  it("собирает лид из summary или из темы", () => {
    const base = {
      title: "Тема",
      level: "Junior",
      category: "",
      language: "",
      summary: "",
      footer: "",
    };

    expect(studyLead(base)).toBe("Учебный конспект по теме «Тема» для уровня Junior.");
    expect(studyLead({ ...base, summary: "Коротко." })).toBe("Коротко.");
  });
});
