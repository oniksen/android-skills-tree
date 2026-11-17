import { renderToStaticMarkup } from "react-dom/server";
import StudyMarkdownRenderer from "./StudyMarkdownRenderer";
import StudyMaterialPage from "./StudyMaterialPage";

/**
 * One Markdown source that exercises every block the pipeline can emit.
 *
 * Shared by `study-html-validity.test.tsx` (HTML validity) and
 * `study-blocks-dom.test.tsx` (registry against the real DOM). It lives in a
 * plain module, not in a test file: importing `*.test.tsx` from another test
 * registers that file's whole suite a second time.
 */
export const FIXTURE = `# Переменные в Kotlin

**Уровень:** Junior
**Категория:** Основы программирования
**Язык:** Kotlin
**Кратко:** Как объявлять переменные и чем отличаются \`val\` и \`var\`.

## 1. Объявление переменной {#obyavlenie-peremennoy}

Текст раздела с [внешней ссылкой](https://kotlinlang.org/docs/properties.html) и \`кодом\`.

- Маркированный пункт списка.
- Ещё один маркированный пункт.

1. Первый шаг нумерованного списка.
2. Второй шаг нумерованного списка.
   - Вложенный пункт второго шага.
   - Ещё один вложенный пункт.

### 1.1. Подраздел {#podrazdel}

#### 1.1.1. Детали подраздела

:::cards
- **Имя** — понятное имя переменной.
- **Тип** — тип значения.
:::

> [!NOTE]
> Обычная заметка с \`inline\` кодом.

> [!WARNING]
> Предупреждение о вызове до инициализации.

> [!TIP]
> Заметка с блоком кода внутри:
>
> \`\`\`text
> val answer = 42
> \`\`\`

- [ ] Первый пункт самопроверки.
- [x] Второй пункт самопроверки.

| Тип | Размер |
|---|---|
| \`Int\` | 32 бита |

| Слева | По центру | Справа |
|:---|:---:|---:|
| \`val\` | \`var\` | \`const\` |

\`\`\`kotlin
val x = 1
\`\`\`

\`\`\`text
Вывод программы в консоли.
\`\`\`

![Схема работы компилятора](https://example.com/scheme.png)

---

## Источники и документация

### Официальная документация

- [Properties](https://kotlinlang.org/docs/properties.html)
`;

/** Fixture rendered the way a study page renders it. */
export function renderFixture(): string {
  return renderToStaticMarkup(
    <StudyMarkdownRenderer content={FIXTURE} grade="junior" />,
  );
}

/** Fixture rendered inside the page shell (topbar, back link, article). */
export function renderFixturePage(): string {
  return renderToStaticMarkup(
    <StudyMaterialPage backHref="/tree/junior" backLabel="Назад">
      <StudyMarkdownRenderer content={FIXTURE} grade="junior" />
    </StudyMaterialPage>,
  );
}
