import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { parseStudyDocument } from "../model/parse-study-document";
import StudySection from "./StudySection";
import { buildStudyToc, selectActiveId } from "./study-toc-model";

const DOC = `# Переменные

## 1. Переменные {#peremennye}

### 1.1. \`val\` и \`var\` {#val-var}

### Кратко

\`\`\`text
### не заголовок
\`\`\`

### 1.2. Объявление {#obyavlenie}

## 2. Без якоря

### 2.1. Без якоря {#bez-yakorya}

## Источники и документация {#istochniki}

### Официальная документация {#docs}
`;

describe("buildStudyToc", () => {
  it("строит группы и подпункты", () => {
    const document = parseStudyDocument(DOC)!;
    const groups = buildStudyToc(document.sections);

    expect(groups).toEqual([
      {
        id: "peremennye",
        title: "1. Переменные",
        items: [
          { id: "val-var", title: "1.1. val и var" },
          { id: "obyavlenie", title: "1.2. Объявление" },
        ],
      },
      {
        id: "sec-2",
        title: "2. Без якоря",
        items: [{ id: "bez-yakorya", title: "2.1. Без якоря" }],
      },
      { id: "istochniki", title: "Источники и документация", items: [] },
    ]);
  });

  it("поддерживает legacy-файл с подразделами H2", () => {
    const legacy = `# Заголовок

# 1. Синтаксис {#sintaksis}

## 1.1. Пакеты {#pakety}

## 1.2. Imports {#imports}
`;
    const groups = buildStudyToc(parseStudyDocument(legacy)!.sections);

    expect(groups[0]).toEqual({
      id: "sintaksis",
      title: "1. Синтаксис",
      items: [
        { id: "pakety", title: "1.1. Пакеты" },
        { id: "imports", title: "1.2. Imports" },
      ],
    });
  });

  it("секция берёт id из якоря и не показывает маркер", () => {
    const html = renderToStaticMarkup(
      <StudySection
        section={{
          id: "sec-1",
          title: "1. Переменные {#peremennye}",
          isSources: false,
          blocks: [],
        }}
      />,
    );

    expect(html).toContain('id="peremennye"');
    expect(html).toContain('aria-labelledby="peremennye-title"');
    expect(html).toContain('id="peremennye-title"');
    expect(html).not.toContain("{#");
  });
});

describe("selectActiveId", () => {
  const positions = [
    { domId: "section-1-title", tocId: "section-1", top: 100 },
    { domId: "topic-1", tocId: "topic-1", top: 300 },
    { domId: "topic-2", tocId: "topic-2", top: 700 },
    { domId: "section-2-title", tocId: "section-2", top: 1100 },
    { domId: "topic-3", tocId: "topic-3", top: 1400 },
  ];

  it("держит подпункт, пока линия чтения внутри его диапазона", () => {
    expect(selectActiveId(positions, 500)).toBe("topic-1");
    expect(selectActiveId(positions, 690)).toBe("topic-1");
    expect(selectActiveId(positions, 800)).toBe("topic-2");
  });

  it("не сбрасывает подсветку между заголовками", () => {
    expect(selectActiveId(positions, 1000)).toBe("topic-2");
  });

  it("при скролле вверх возвращает предыдущий пункт", () => {
    expect(selectActiveId(positions, 200)).toBe("section-1");
  });

  it("до первого заголовка подсвечивает первый пункт", () => {
    expect(selectActiveId(positions, 0)).toBe("section-1");
  });

  it("возвращает null для пустого документа", () => {
    expect(selectActiveId([], 500)).toBeNull();
  });
});
