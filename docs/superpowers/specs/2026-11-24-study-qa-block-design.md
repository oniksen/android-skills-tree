# Дизайн: блок «Вопросы на собеседовании» (`:::qa`) в учебных материалах

- **Дата:** 2026-11-24
- **Статус:** реализовано (2026-11-24)
- **Ветка:** `feat/study-qa-block` (от `main`, `519dd95`)
- **Связанные документы:** `STUDY_MATERIALS_FORMATTING.txt` (гайд автора),
  `docs/superpowers/specs/2026-11-15-study-material-pipeline-unification.md`,
  `docs/superpowers/specs/2026-11-16-study-pipeline-hardening.md`
- **Предыдущее обсуждение:** план и вердикт в `docs/superpowers/plans/2026-11-24-java-legacy-integration.md` (другая фича; ветка `feat/java-legacy-skills`)

---

## 1. Зачем

В конце разделов Junior-материалов есть блоки «Вопросы на собеседовании»: читатель
видит список вопросов, но ответов нет, поэтому блок работает как оглавление, а не как
тренажёр. Нужно:

1. научить пайплайн `Markdown → HTML` превращать такой блок в контейнер, где **каждый
   вопрос — нативный раскрывающийся `<details>` с ответом**;
2. перенести существующие вопросы на новый синтаксис и **написать ответы**;
3. добавить такие же блоки в остальные существующие материалы, с **реальными
   вопросами, которые задают на собеседованиях** по этим темам;
4. зафиксировать синтаксис в `STUDY_MATERIALS_FORMATTING.txt`, чтобы при появлении
   материалов других грейдов (Middle / Strong Middle / Senior) он применялся сразу,
   без доработки рендерера.

### Решения, принятые заказчиком

| № | Решение |
|---|---|
| 1 | Синтаксис — директива `:::qa`, по образцу `:::cards` |
| 2 | Ответы пишутся сразу, с оформлением (инлайн-код, жирный, ссылки) |
| 3 | В гайде новый раздел **10** с перенумерацией старых 10–17 → 11–18 |
| 4 | Кнопки «показать все» нет; ответы скрыты по умолчанию (без атрибута `open`) |
| 5 | Блоки добавляются и в остальные существующие материалы, с реальными вопросами |

---

## 2. Текущее состояние (фактура, проверено)

### 2.1. Материалы

В репозитории **10 материалов, все уровня Junior** (`content/study-materials/junior/*.md`).
Материалы `middle/`, `strong-middle/`, `senior/` были удалены в коммите `519dd95` (были
заглушками на 5 строк). Таким образом «другие существующие учебные материалы» — это
9 остальных Junior-файлов. Гайд и рендерер при этом уже рассчитаны на 4 грейда, поэтому
новый блок автоматически будет работать и для будущих грейдов.

### 2.2. Существующие блоки вопросов

`### Вопросы на собеседовании` встречается **только** в `kotlin-basics.md`:
13 блоков, **134 вопроса**, ответов нет ни у одного. Пример (строки 768–779):

```markdown
### Вопросы на собеседовании

1. Чем Kotlin-файл отличается от Java-класса с точки зрения структуры?
2. Обязательно ли помещать каждый класс в отдельный `.kt`-файл?
...
9. Что проверяет оператор `in`?
```

`kotlin-basics.md` — legacy-формат с несколькими H1: секции заданы `# 1. …`, а
`### Вопросы на собеседовании` внутри секции после `shiftHeadings(body, 1)`
рендерится как `h4.study-subtitle.study-subtitle--minor`. Заголовок сохраняем.

В остальных 9 файлах самопроверка оформлена иначе (`**Самопроверка:**`,
`### Самопроверка: …`, `## Итоговая самопроверка категории`), блоков интервью-вопросов
нет.

### 2.3. Пайплайн (как устроено сейчас)

```
content/study-materials/<grade>/<id>.md
  → scripts/generate-study-materials-registry.mjs
  → src/features/study/study-materials.generated.ts
  → parseStudyDocument()               (parse-study-document.ts)
      → parseStudySectionBody()        (блоки: markdown | cards | note)
  → StudyMarkdownRenderer → StudySection → StudyBlockRenderer
  → StudyProse / StudyInline → renderMarkdown() (markdown-pipeline.ts)
  → createStudyMarkdownComponents()   (markdown-components.tsx)
```

Ключевые контракты, которые нельзя сломать:

- `STUDY_BLOCK` / `STUDY_BLOCK_MAP` в `study-blocks.ts` — **единственное место**, где
  объявляются `study-*` классы; компоненты получают класс только через `blockClass(kind)`.
  `study-blocks.test.ts` проверяет 1:1 соответствие реестра и `globals.css`.
- `STUDY_BLOCK_RENDERERS` в `study-block-renderer.tsx` типизирован
  `satisfies Record<StudySectionBlock["type"], …>`: новый тип блока без рендерера —
  ошибка компиляции.
- HTML-валидность: `study-html-validity.test.tsx` прогоняет каждый материал через
  `html-validate:recommended` и синтетический фикстур `study-html-fixture.tsx`.
- Побайтовый golden: `components/__fixtures__/study-render/*.html`, обновляется только
  через `npm run study:golden` и только при намеренном изменении разметки/контента.
- Структурный снимок: `model/__snapshots__/study-document-structure.test.ts.snap`
  хранит типы блоков по секциям.
- `study-guide-examples.test.tsx` требует, чтобы **примеры из гайда были скопированы
  дословно**, рендерились и давали валидный HTML.
- `study-formatting-guide.test.ts` ищет в гайде заголовки `8. КОД` и `9. ЗАМЕТКИ` —
  новый раздел 10 их не задевает.

---

## 3. Markdown-контракт `:::qa`

### 3.1. Синтаксис

```markdown
### Вопросы на собеседовании

:::qa
- **В чём разница между `String` и `String?`?** — `String?` может хранить `null`, компилятор обязывает явно обработать отсутствие значения.
- **Что делает оператор `?.`?** — вызывает метод или свойство только если получатель не `null`, иначе возвращает `null`.
- **Что происходит при вызове `!!` на `null`?** — бросается `NullPointerException`; используйте `?.` или `?:`.
:::
```

Один пункт = один вопрос + ответ на одной строке. Разделитель — `**Вопрос?** — ответ`
(допускается `–`, `-`, `:` после жирного, как в `:::cards`).

### 3.2. Правила для автора

| Правило | Обоснование |
|---|---|
| Открывашка ровно `:::qa`, закрывашка ровно `:::` | совпадает с `:::cards` |
| Пункт обязательно начинается с `- **Вопрос?** — ответ` | парсер отбрасывает пункты без ответа |
| 5–8 вопросов на блок | читаемость; для kotlin-basics сохраняем все 134 существующих |
| В ответе разрешены `код`, **жирный**, *курсив*, [ссылки](url) | ответ идёт через `StudyProse` |
| В ответе **запрещены** блоки: списки, таблицы, фенсы, заметки, `:::cards` | пункт — одна строка, переносы склеиваются в абзац |
| `:::qa` только на верхнем уровне секции | внутри `> `-заметки директива не работает |
| Незакрытая `:::qa` | открывашка выбрасывается, тело остаётся Markdown, сырой маркер на страницу не попадает |
| Пустая директива | ничего не рендерится (как `:::cards`) |
| Заголовок `### Вопросы на собеседовании` остаётся | даёт подзаголовок и якорь в оглавлении; сам блок — директива |

### 3.3. HTML-контракт

```html
<div class="study-qa">
  <details class="study-qa-item">
    <summary class="study-qa-question">В чём разница между <code>String</code> и <code>String?</code>?</summary>
    <div class="study-qa-answer"><p>Ответ с инлайн-кодом.</p></div>
  </details>
  …
</div>
```

- `<details>` **без атрибута `open`** → ответы скрыты по умолчанию (требование №4).
- Нативный `<details>/<summary>`: клавиатура, скринридеры, без JS и без состояния.
- `<summary>` — первый ребёнок `<details>` (требование `html-validate`).
- Кнопки «показать все» и кастомного JS-тоггла нет (требование №4).
- Блок не создаёт заголовков → оглавление (`StudyToc`) и якоря не меняются.

---

## 4. Изменения в коде

### 4.1. `src/features/study/model/parse-study-document.ts`

```ts
export interface StudyQaItem {
  question: string;
  answer: string;
}

export type StudySectionBlock =
  | { type: "markdown"; content: string }
  | { type: "cards"; items: StudyCardItem[] }
  | { type: "note"; variant: StudyNoteVariant; content: string }
  | { type: "qa"; items: StudyQaItem[] };          // NEW
```

- `const QA_OPEN = /^:::qa\s*$/;`
- `parseQaItems(lines)` — по образцу `parseCardItems`, но поля `question`/`answer`,
  и `filter(item => item.question && item.answer)`.
- В `parseStudySectionBody()` добавить ветку рядом с `CARDS_OPEN`:

```ts
if (!fence && QA_OPEN.test(line)) {
  const end = findDirectiveEnd(lines, index + 1);   // тот же помощник
  if (end !== -1) {
    flushMarkdown();
    blocks.push({ type: "qa", items: parseQaItems(lines.slice(index + 1, end)) });
    index = end + 1;
    continue;
  }
  index += 1;   // незакрытая: роняем открывашку, тело остаётся Markdown
  continue;
}
```

`findDirectiveEnd()` уже учитывает fence-код (`:::` внутри фенса не закрывает
директиву) — переиспользуется без правок. Порядок проверок: `QA_OPEN` до `CARDS_OPEN`
(не пересекаются), обе после проверки fence.

### 4.2. `src/features/study/model/study-blocks.ts`

```ts
export const STUDY_BLOCK = {
  …
  qa: "study-qa",
  qaItem: "study-qa-item",
  qaQuestion: "study-qa-question",
  qaAnswer: "study-qa-answer",
} as const;

export const STUDY_BLOCK_MAP = {
  …
  qa:         { tags: ["div"],     className: STUDY_BLOCK.qa,         layout: "block" },
  qaItem:     { tags: ["details"], className: STUDY_BLOCK.qaItem,     layout: "block" },
  qaQuestion: { tags: ["summary"], className: STUDY_BLOCK.qaQuestion, layout: "block" },
  qaAnswer:   { tags: ["div"],     className: STUDY_BLOCK.qaAnswer,   layout: "block" },
} as const satisfies …;
```

`details` и `summary` уже разрешены в `HTML_TAGS` в `study-blocks.test.ts`.

### 4.3. `src/app/globals.css`

Новая секция после `/* Cards */`:

```css
/* Interview Q&A --------------------------------------------------------- */

.study-qa {
  display: grid;
  gap: 8px;
  margin: 1rem 0;
}

.study-qa-item {
  min-width: 0;
  border: 1px solid var(--surface-border);
  border-radius: 11px;
  background: var(--bg);
  padding: 0 12px;
}

.study-qa-question {
  cursor: pointer;
  font-weight: 600;
  line-height: 1.5;
  min-height: 44px;
  padding: 12px 0;
}

.study-qa-answer {
  padding: 0 0 12px;
  color: var(--color-slate-500);
  font-size: 0.92rem;
}

.study-qa-answer > :first-child { margin-top: 0; }
.study-qa-answer > :last-child  { margin-bottom: 0; }
```

Все переменные уже используются в этом файле. На телефоне блок остаётся edge-to-edge
без боковых границ контейнера (как остальные блоки), `<details>` не скроллится сам.

### 4.4. `src/features/study/components/StudyQa.tsx` (новый)

По образцу `StudyCards.tsx`:

```tsx
"use client";
import { memo } from "react";
import { blockClass } from "../model/study-blocks";
import type { StudyQaItem } from "../model/parse-study-document";
import StudyInline from "./StudyInline";
import StudyProse from "./StudyProse";

const QA = blockClass("qa");
const ITEM = blockClass("qaItem");
const QUESTION = blockClass("qaQuestion");
const ANSWER = blockClass("qaAnswer");

function StudyQa({ items }: { items: StudyQaItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className={QA}>
      {items.map((item, index) => (
        <details key={`${item.question}-${index}`} className={ITEM}>
          <summary className={QUESTION}>
            <StudyInline text={item.question} />
          </summary>
          <div className={ANSWER}>
            <StudyProse markdown={item.answer} />
          </div>
        </details>
      ))}
    </div>
  );
}
export default memo(StudyQa);
```

`StudyInline` экранирует ведущие `#`/`>`/`-`/`1.` — вопросы с кавычек не начинаются,
но защита сохраняется. `StudyProse` даёт ответу инлайн-разметку.

### 4.5. `src/features/study/components/study-block-renderer.tsx`

```ts
import StudyQa from "./StudyQa";
…
  qa: ({ block }: StudyBlockRenderProps<"qa">) => (
    <StudyQa items={block.items} />
  ),
```

`satisfies` гарантирует исчерпывающий маппинг; `StudySection` и
`StudyMarkdownRenderer` **не меняются**.

### 4.6. Чего НЕ трогаем

- `markdown-pipeline.ts` (единый `unified()`, кэш деревьев) — не нужен новый процессор.
- `markdown-components.tsx` — `:::qa` разбирается до Markdown, компоненты не участвуют.
- `StudyToc` / `study-toc-model.ts` — директивы не создают заголовков.
- `scripts/generate-study-materials-registry.mjs` — читает файлы как есть, правки не требует.
- UI маршруты, Firebase, данные скиллов, `src/data/*`.

---

## 5. Изменения в `STUDY_MATERIALS_FORMATTING.txt`

### 5.1. Новый раздел 10 и перенумерация

| Было | Стало |
|---|---|
| 10. КАРТОЧКИ | 11. КАРТОЧКИ |
| 11. ИСТОЧНИКИ | 12. ИСТОЧНИКИ |
| 12. ИТОГОВАЯ САМОПРОВЕРКА | 13. ИТОГОВАЯ САМОПРОВЕРКА |
| 13. ЗАПРЕТЫ | 14. ЗАПРЕТЫ |
| 14. ОБЪЁМ И СОДЕРЖАНИЕ | 15. ОБЪЁМ И СОДЕРЖАНИЕ |
| 15. ПРОВЕРКА ПЕРЕД КОММИТОМ | 16. ПРОВЕРКА ПЕРЕД КОММИТОМ |
| 16. ЧТО ДЕЛАЕТ РЕНДЕРЕР | 17. ЧТО ДЕЛАЕТ РЕНДЕРЕР |
| 17. ЕСЛИ ЧТО-ТО НЕ ЗАКРЫТО | 18. ЕСЛИ ЧТО-ТО НЕ ЗАКРЫТО |
| — | **10. ВОПРОСЫ И ОТВЕТЫ (`:::qa`)** |

Разделы 1–9 остаются как есть: `study-formatting-guide.test.ts` ищет `8. КОД` и
`9. ЗАМЕТКИ`, они не смещаются.

### 5.2. Все внутренние ссылки, которые надо поправить

| Строка (сейчас) | Было | Станет |
|---|---|---|
| 15 | «правило нарушено — раздел 17» | раздел 18 |
| 135 | «подписью под рисунком (раздел 16)» | раздел 17 |
| 136 | «Картинки без alt запрещены (раздел 13)» | раздел 14 |
| 185 | «таблица не собирается (раздел 17)» | раздел 18 |
| 253 | «см. разделы 10 и 13» | разделы 11 и 14 |
| 332 | «получится невалидный HTML (раздел 17)» | раздел 18 |
| 338 | «запрещены (раздел 17)» | раздел 18 |

Ссылки на разделы 6 и 9 не меняются. Также в преамбуле (строки 13–15) добавить
`:::qa` в перечень открываемых конструкций.

### 5.3. Содержание нового раздела 10

- Назначение: блок подготовки к собеседованию в конце каждого содержательного раздела.
- Пример (дословно переносится в `study-guide-examples.test.tsx`).
- Таблица правил из п. 3.2.
- Явное указание: заголовок `### Вопросы на собеседовании` сохраняется;
  `:::qa` не попадает в оглавление; ответы скрыты по умолчанию.
- Требование «реальные вопросы по теме раздела, без выдуманных фактов».

### 5.4. Правки в других разделах

- **1. СТРУКТУРА ФАЙЛА** — показать `### Вопросы на собеседовании` + `:::qa` перед
  разделом источников.
- **13 → 14. ЗАПРЕТЫ** — `:::qa` внутри заметки; пункт без ответа; блоки (списки/код/
  таблицы) в ответе; незакрытая директива.
- **15 → 16. ПРОВЕРКА ПЕРЕД КОММИТОМ** — «`:::qa` закрыт, у каждого вопроса есть ответ».
- **16 → 17. ЧТО ДЕЛАЕТ РЕНДЕРЕР** — строки:

  ```
  :::qa                          div.study-qa > details.study-qa-item >
                                 summary.study-qa-question +
                                 div.study-qa-answer
  ```

- **17 → 18. ЕСЛИ ЧТО-ТО НЕ ЗАКРЫТО** — две строки:

  ```
  :::qa без закрывающего :::    открывашка выброшена, тело остаётся
                                 обычным Markdown, сырой маркер не виден
  пункт :::qa без ответа        пункт не попадает на страницу
  :::qa внутри заметки          маркеры останутся видимым текстом
  ```

- **13 → 14** и **12 → 13**: уточнить, что блок вопросов ставится **до** итоговой
  самопроверки / источников, а не вместо них.

---

## 6. Тесты и эталоны

| Файл | Что добавить |
|---|---|
| `model/parse-study-document.test.ts` | разбор `:::qa`; ответы с `` `кодом` `` и ссылкой; пункт без ответа отбрасывается; незакрытая директива; `:::` внутри фенса не закрывает; пустая директива; соседство с `:::cards` |
| `components/study-block-renderer.test.tsx` | `qa` → `<details>` × N, `<summary>` с вопросом, ответ в `.study-qa-answer`, **нет атрибута `open`** |
| `model/study-blocks.test.ts` | новых классов в реестре достаточно: существующие тесты на 1:1 соответствие CSS и на теги сработают автоматически; добавить явную проверку `blockClass("qaItem")` → `study-qa-item` |
| `components/study-blocks-dom.test.tsx` | новые классы в списке ожидаемых |
| `components/study-html-fixture.tsx` | `:::qa`-блок в `FIXTURE` (все типы блоков) |
| `components/study-html-validity.test.tsx` | 4 новых класса в список; `:::qa` в список сырых маркеров; проверка валидности `<details>/<summary>` на реальных материалах |
| `components/study-guide-examples.test.tsx` | `QA_EXAMPLE` дословно из гайда → `EXAMPLES` + `MATERIAL`; новые классы в `дают ожидаемые блоки и классы`; `:::qa` в `не оставляют на странице сырых маркеров` |
| `components/study-render-golden.test.tsx` | без правок; эталоны обновляются скриптом |
| `model/__snapshots__/study-document-structure.test.ts.snap` | обновить: в секциях появятся типы `qa` |

### Политика эталонов (важно)

- `npm run study:golden` запускается **только после** намеренного изменения контента
  и разметки; далее обязательный `git diff` по `__fixtures__/study-render/`.
  Ожидаются изменения во **всех 10** `*.html` (контент правится везде) плюс
  `fixture.html`. Изменение эталона материала без правки его `.md` — регрессия.
- Снимок структуры обновляется точечно `npx vitest run … -u` с последующим review diff.
- `study-guide-examples.test.tsx` защищает от расхождения гайда и кода: пример из гайда
  обязан быть дословно тем же, что рендерится.

### Проверки

```
npm run generate:materials
npm run study:golden        # + обязательный review diff
npm run lint
npm run typecheck
npm test
npm run build
```

`npm test` включает `html-validate:recommended` для каждого материала — `<summary>`
внутри `<details>` и `<div>` с `<p>` валидны.

---

## 7. Контент-план

### 7.1. Сводка

| Материал | Содержательных разделов | Блоков `:::qa` | Вопросов |
|---|---|---|---|
| `kotlin-basics.md` | 13 (legacy H1-секции) | 13 (конвертация) | 134 существующих + ответы |
| `android-basics.md` | 16 | 16 (новые) | ~96 |
| `ui-basics.md` | 11 | 11 | ~66 |
| `architecture-basics.md` | 9 | 9 | ~54 |
| `osnovy-programmirovaniya-kotlin.md` | 9 | 9 | ~54 |
| `data-and-storage-basics.md` | 8 | 8 | ~48 |
| `asynchronous-basics.md` | 7 | 7 | ~42 |
| `navigaciya-i-komponenty.md` | 5 | 5 | ~30 |
| `tools-basics.md` | 5 | 5 | ~30 |
| `testing-basics.md` | 3 | 3 | ~18 |
| **Итого** | **86** | **86** | **~572** |

Ориентир для новых блоков: **5–8 вопросов на раздел**, 6 по умолчанию. Блок ставится
в конце содержательного раздела: после подразделов и практики/самопроверки, **до**
`### Дополнительные официальные источники`, `---` и следующего раздела. Заголовок
`### Вопросы на собеседовании` добавляется в 9 файлах (в `kotlin-basics.md` уже есть).

### 7.2. Принципы отбора вопросов и написания ответов

- Вопрос должен быть **реально задаваемым** на собеседовании Junior/Middle Android:
  сравнение близких понятий, объяснение механизма, «что произойдёт, если…», типичная
  ошибка, выбор API под задачу. Не «что такое X по определению» и не выдуманные API.
- Вопрос привязан к **теме конкретного раздела** и покрывает подтемы скилла из
  `src/data/skills/junior.ts`; не дублирует соседние разделы.
- Ответ: **1–3 предложения**,factually точный, без воды; обязательно `инлайн-код` для
  API-имен, при уместности — ссылка на официальную документацию. Ответ черпается из
  текста того же раздела и официальных docs; **нельзя выдумывать** поведение,
  версии API и ограничения.
- Запрещено в ответе: списки, таблицы, фенсы кода, `> `-заметки, `:::cards`, картинки.
- Якорь существующего заголовка не переименовывается; новые H3-заголовки
  «Вопросы на собеседовании» **без якоря** (служебный подзаголовок, по правилам гайда
  раздел 2) — в оглавление не попадают, дублирования нет.
- В legacy-файле `kotlin-basics.md` уровни заголовков не меняем (`###` остаётся `###`,
  после `shiftHeadings` рендерится `h4`).

### 7.3. Каталог реальных вопросов по разделам

Ниже — representative вопросы, которые реально задают по этим темам. Служат
отправной точкой; итоговый набор 5–8 на раздел формируется из этого каталога,
подтем скилла и официальной документации.

**`android-basics.md`** (16 разделов)
- Android Studio: «Чем Logcat отличается от Debugger?», «Зачем нужен Layout Inspector?», «Как найти утечку памяти через Profiler?»
- Проект и модули: «Чем `src/main`, `src/test` и `src/androidTest` различаются?», «Зачем выносить код в library module?», «Чем APK отличается от AAB?»
- Gradle: «В чём разница `implementation` и `api`?», «Что такое buildTypes и productFlavors?», «Зачем Version Catalog?», «Как исключить транзитивную зависимость?»
- AndroidManifest: «Зачем `android:exported` с Android 12?», «Чем `uses-permission` отличается от runtime permission?», «Что такое `<intent-filter>`?»
- Resources: «Чем `dp` отличается от `sp`?», «Как работают resource qualifiers?», «Почему строки нельзя хардкодить?»
- Context и Application: «Чем Activity Context отличается от Application Context?», «Почему нельзя хранить Activity в синглтоне?», «Что такое утечка Context?»
- Layouts XML: «Почему глубокая вложенность LinearLayout вредна?», «Чем ConstraintLayout лучше RelativeLayout?», «Что означает `0dp` в ConstraintLayout?»
- View и ViewGroup: «Чем `padding` отличается от `layout_margin`?», «Что происходит при `invalidate()` и `requestLayout()`?», «Почему `findViewById` заменили View Binding?»
- Activity Lifecycle: «Какая последовательность колбэков при повороте экрана?», «Чем configuration change отличается от process death?», «Почему `onDestroy()` не гарантирован?»
- Intent и Activity Result API: «Чем explicit Intent отличается от implicit?», «Почему `startActivityForResult()` deprecated?», «Зачем нужен PendingIntent?»
- Permissions: «Чем normal permission отличается от dangerous?», «Как обработать отказ «больше не спрашивать»?», «Что изменилось с уведомлениями в Android 13?»
- Task и Back Stack: «Чем Back отличается от Up?», «Чем `singleTop` отличается от `singleTask`?», «Зачем `FLAG_ACTIVITY_CLEAR_TOP`?»
- Main Thread и ANR: «Что такое ANR и через какое время он возникает?», «Почему нельзя делать сетевой запрос в UI-потоке?», «Как диагностировать ANR?»
- Toast, Dialog и Snackbar: «Чем Snackbar отличается от Toast?», «Почему DialogFragment предпочтительнее AlertDialog?», «Как сохранить диалог при повороте экрана?»
- Notifications: «Зачем нужны NotificationChannel?», «Что даёт `POST_NOTIFICATIONS`?», «Зачем PendingIntent в уведомлении?»
- Android Security Basics: «Что такое Application Sandbox?», «Почему нельзя хранить секреты в исходном коде?», «Чем опасно логирование персональных данных?»

**`architecture-basics.md`** (9)
- MVC / MVP / MVVM: «Чем MVP отличается от MVVM?», «Почему во MVC Activity часто становится «толстым» контроллером?», «Кто владеет состоянием в MVVM?»
- LiveData: «Чем LiveData отличается от StateFlow?», «Почему LiveData lifecycle-aware?», «Что происходит с observers при повороте экрана?»
- ViewModel: «Почему ViewModel переживает configuration change?», «Почему ViewModel не должна держать ссылку на View/Context?», «Чем `viewModelScope` отличается от `GlobalScope`?»
- Repository: «Зачем нужен слой Repository?», «Как выбрать между cache-first и network-first?», «Почему UI не должен работать с DTO напрямую?»
- UI State / UDF: «Что такое immutable UI State?», «Что означает «state вниз, events вверх»?», «Как моделировать Loading / Success / Error?», «Зачем одноразовые UI-эффекты отдельно от состояния?»
- DI Basics: «Зачем DI в Android?», «Чем constructor injection отличается от field injection?», «Что такое Service Locator и чем он хуже?»

**`asynchronous-basics.md`** (7)
- Thread: «Чем Thread отличается от корутины?», «В чём разница concurrency и parallelism?», «Почему доступ к общим данным из потоков опасен?»
- Handler / Looper: «Зачем нужен Looper и почему main thread не «завершается»?», «Что делает `Handler.postDelayed()`?», «Зачем `removeCallbacks()` при уничтожении экрана?», «Чем `Handler` связан с `MessageQueue`?»
- Coroutines Basics: «В чём разница `launch` и `async`?», «Что делает `runBlocking` и почему его избегают в production?», «Что такое Job и structured concurrency?»
- Dispatchers: «Чем `Dispatchers.IO` отличается от `Dispatchers.Default`?», «Почему `suspend`-функция сама не переключает поток?», «Когда нужен `withContext`?»
- Suspend & Cancellation: «Чем suspension отличается от blocking?», «Что такое кооперативная отмена?», «Почему `CancellationException` нельзя «глушить»?»
- Flow Basics: «Чем холодный Flow отличается от горячего?», «Чем Flow от `suspend`-функции?», «Зачем `StateFlow` во ViewModel?», «В чём разница `collect` и `launchIn`?»

**`data-and-storage-basics.md`** (8)
- SharedPreferences / DataStore: «Чем `commit()` отличается от `apply()`?», «Почему DataStore предпочтительнее SharedPreferences?», «Почему SharedPreferences может заблокировать главный поток?»
- Files & Storage: «Чем internal storage отличается от app-specific external?», «Что такое Scoped Storage?», «Зачем `ContentResolver` и SAF?»
- SQLite / SQL: «Зачем `PRIMARY KEY` и `FOREIGN KEY`?», «Чем `WHERE` от `HAVING`?», «Что делает `JOIN`?», «Зачем транзакции?»
- Room: «Почему Room проверяет SQL на этапе компиляции?», «Зачем миграции и что будет без них?», «Чем `suspend` DAO от DAO с Flow?», «Что такое `@Transaction`?»
- JSON: «Чем Gson отличается от kotlinx.serialization?», «Как обработать отсутствующее поле?», «Почему nullable-поля API опасны?»
- HTTP / REST: «Чем `GET` отличается от `POST`, `PUT` и `PATCH`?», «Что означает 4xx vs 5xx?», «Зачем idempotency?»
- Retrofit: «Зачем `ConverterFactory`?», «Чем `@Path` от `@Query`?», «В чём разница `Call<T>` и `suspend`-функции?», «Зачем `HttpLoggingInterceptor`?»
- DTO & Mapping: «Зачем отдельная domain-модель?», «Почему DTO нельзя отдавать в UI?», «Как обработать nullable-поля ответа?»

**`navigaciya-i-komponenty.md`** (5)
- Fragment: «Чем `viewLifecycleOwner` отличается от жизненного цикла Fragment?», «Почему binding надо обнулять в `onDestroyView()`?», «Чем Fragment Result API лучше прямых ссылок?», «В чём разница `childFragmentManager` и `parentFragmentManager`?»
- Navigation Component: «Зачем graph и type-safe routes?», «Как передать аргументы между экранами?», «Чем `popUpTo` отличается от `navigate`?», «Как работает deep link?»
- Service: «Чем started service отличается от bound?», «Почему фоновые сервисы ограничены с Android 8?», «Когда выбрать WorkManager вместо Service?», «Зачем foreground service уведомление?»
- BroadcastReceiver: «Чем manifest-registration отличается от dynamic?», «Почему implicit broadcast ограничены?», «Зачем `RECEIVER_EXPORTED` / `RECEIVER_NOT_EXPORTED`?», «Что делает `goAsync()`?»
- ContentProvider: «Зачем ContentProvider?», «Что такое `content://` URI и authority?», «Зачем URI permissions?», «Что возвращает `ContentResolver.query()`?»

**`osnovy-programmirovaniya-kotlin.md`** (9)
- Переменные: «Чем `val` отличается от `const val`?», «Когда нужен `lateinit`, а когда `lazy`?», «Чем свойство отличается от поля?»
- Типы данных: «Чем `Int` отличается от `Long`?», «Почему `toInt()` нужен явно?», «Что такое `Any`, `Unit` и `Nothing`?», «Как работает type inference?»
- Условные: «Чем `when` лучше `switch`?», «Почему `if` в Kotlin — выражение?», «Что такое short-circuit evaluation?»
- Циклы: «Чем `..` отличается от `until`?», «Зачем `downTo` и `step`?», «Как работает `break` с меткой?»
- Функции: «Зачем параметры по умолчанию и именованные аргументы?», «Что такое expression body?», «Чем `vararg` и spread operator?», «Зачем локальные функции?»
- ООП: «Почему классы в Kotlin `final` по умолчанию?», «Чем первичный конструктор от вторичного?», «Чем абстрактный класс от интерфейса?», «Что такое композиция vs наследование?»
- Коллекции: «Чем `List` отличается от `MutableList`?», «Когда выбрать `Set`, а когда `Map`?», «Чем `filter` от `map`?», «Почему read-only ≠ immutable?»
- Обработка ошибок: «Чем `Exception` от `Error`?», «Зачем `finally`?», «Чем `runCatching` от `try/catch`?», «Почему `!!` — плохая практика?», «Зачем sealed class для результата?»
- Алгоритмы: «Что такое Big O?», «Чем O(n) от O(n²)?», «Когда линейный поиск хуже бинарного?», «Как оценить вложенные циклы?»

**`testing-basics.md`** (3)
- JUnit: «Чем unit-тест отличается от instrumentation-теста?», «Зачем `@Before` / `@After`?», «Что такое assertions и зачем `assertThrows`?», «Почему тест должен быть изолированным?»
- Espresso: «Зачем `onView()` и `ViewMatchers`?», «Что такое IdlingResource?», «Чем `perform()` от `check()`?», «Почему тесты на UI нестабильны?»
- Test Doubles / MockK: «Чем stub, mock, fake и spy отличаются?», «Чем `every` от `coEvery`?», «Зачем `verify`?», «Почему не надо мокать то, чем не владеешь?»

**`tools-basics.md`** (5)
- Git: «Чем `merge` отличается от `rebase`?», «Чем `reset` от `revert`?», «Зачем `cherry-pick`?», «Как читать конфликт при обновлении ветки?»
- Logcat & Debugging: «Как отфильтровать лог по tag и priority?», «Чем breakpoint от watchpoint?», «Зачем `Log.wtf`?», «Как воспроизвести баг только на release-сборке?»
- Build Variants / APK / AAB: «Чем debug от release buildType?», «Зачем productFlavors?», «Почему Google Play требует AAB?», «Что такое signing config?»
- ADB: «Зачем `adb shell`?», «Чем `adb install -r` от обычной установки?», «Как снять скриншот / записать видео?», «Что делает `adb logcat -c`?»
- Dependencies / Version Catalogs: «Чем `implementation` от `api`?», «Зачем `libs.versions.toml`?», «Как найти конфликт версий зависимостей?», «Что такое transitive dependency?»

**`ui-basics.md`** (11)
- TextView: «Зачем `sp`, а не `dp`, для текста?», «Чем `maxLines` от `ellipsize`?», «Как работает AutoSize TextView?», «Зачем `contentDescription`?»
- Button: «Чем `setOnClickListener` от `View.OnClickListener`?», «Как защититься от double tap?», «Зачем enabled/disabled state?», «Чем MaterialButton от Button?»
- ImageView: «Чем `src` от `srcCompat`?», «Что делает `scaleType="centerCrop"`?», «Чем Coil/Glide от ручной загрузки?», «Зачем placeholder и error?»
- EditText: «Зачем `inputType`?», «Как работает `TextWatcher`?», «Чем `TextInputLayout` от простого EditText?», «Как валидировать ввод?»
- LinearLayout: «Почему `layout_weight` дорог по производительности?», «Чем `gravity` от `layout_gravity`?», «Когда избегать вложенных LinearLayout?»
- ConstraintLayout: «Зачем chains и barriers?», «Что такое bias?», «Чем guideline от barrier?», «Почему `0dp` = match constraints?»
- View Binding: «Чем View Binding от findViewById и Data Binding?», «Почему binding надо обнулять во Fragment?», «Что будет при обращении к binding после `onDestroyView()`?»
- RecyclerView: «Зачем ViewHolder?», «Что делает DiffUtil / ListAdapter?», «Чем `LayoutManager` от `Adapter`?», «Почему нельзя хранить позицию вместо stable id?»
- Styles / Themes: «Чем style от theme?», «Как работает наследование стилей?», «Что такое theme attribute `?attr/…`?», «Зачем Material 3 и Dynamic Color?»
- Dimensions & Accessibility: «Чем `dp`, `sp` и `px`?», «Зачем touch target 48dp?», «Как TalkBack читает `contentDescription`?», «Что ломается при системном масштабе шрифта?»
- Compose Basics: «Чем `@Composable` отличается от View?», «Что такое recomposition?», «Зачем `remember` и `mutableStateOf`?», «Чем `LazyColumn` от `Column`?», «Как встроить Compose в XML-экран?»

**`kotlin-basics.md`** — не придумываем новые вопросы: конвертируем 134 существующих
(они уже сформулированы как реальные интервью-вопросы) и пишем ответы по тексту
соответствующего раздела.

### 7.4. Пример готового блока (шаблон для автора)

```markdown
### Вопросы на собеседовании

:::qa
- **Чем `implementation` отличается от `api` в Gradle?** — `api` экспортирует зависимость потребителям модуля и попадает в их classpath, `implementation` скрывает её и не пересобирает потребителей при изменении.
- **Зачем нужен Version Catalog?** — он централизует версии в `libs.versions.toml` и даёт type-safe accessors, чтобы не дублировать координаты по модулям.
- **Как исключить транзитивную зависимость?** — через `exclude group`/`exclude module` в `implementation` или правило `resolutionStrategy`.
:::
```

---

## 8. Порядок реализации (фазы)

| Фаза | Содержание | Результат |
|---|---|---|
| **A. Пайплайн** | п. 4.1–4.5 + тесты парсера/рендерера/реестра/фикстура | новый блок рендерится, старые тесты зелёные |
| **B. Гайд** | п. 5: новый раздел 10, перенумерация, все ссылки, таблица маппинга, запреты, чек-лист; `study-guide-examples.test.tsx` | гайд = контракт, пример из гайда рендерится |
| **C. kotlin-basics** | конвертация 13 блоков, 134 ответа | первый материал с ответами |
| **D. Остальные 9 материалов** | по 5–8 Q&A на раздел по каталогу п. 7.3 | 73 новых блока |
| **E. Эталоны и верификация** | `generate:materials`, `study:golden` + review diff, снимок структуры, lint/typecheck/test/build | зелёный пайплайн |

Фазы C и D — независимый контент; при необходимости разбиваются на подзадачи по
одному материалу и выполняются параллельными агентами после фазы A (синтаксис уже
зафиксирован). Каждый агент получает: шаблон п. 7.4, каталог вопросов своего файла,
правило «не менять якоря», команду `npm run generate:materials`.

---

## 9. Риски и mitigations

| Риск | Митигация |
|---|---|
| Перенумерация гайда ломает `study-formatting-guide.test.ts` | тест ищет `8. КОД` / `9. ЗАМЕТКИ`; новые номера начинаются с 10; проверить все 7 внутренних ссылок по таблице п. 5.2 |
| `html-validate` ругается на `<summary>` | `<summary>` — первый ребёнок `<details>`; прогнать `study-html-validity.test.tsx` до контента |
| Golden-эталоны «подгоняются» под тест | только `npm run study:golden` + обязательный review diff; изменения ожидаются во всех 10 файлах, т.к. контент меняется везде |
| Контент меняет снимок структуры | обновить `.snap` точечно, проверить, что добавились только `qa`-типы |
| Регенерация реестра приносит шум CRLF→LF | ожидаемо для двух файлов (`kotlin-basics`, `osnovy-programmirovaniya-kotlin`); закоммитить как часть regenerated changes, не «подчищать» руками |
| Ответы содержат выдуманные факты/версии | правило п. 7.2; ответ берётся из текста раздела + официальных docs; ревью контента |
| Дублирование заголовков в оглавлении | новые H3 «Вопросы на собеседовании» **без якоря** → в TOC не попадают |
| Производительность: +~570 `StudyProse` | каждый ответ — короткая строка, кэш деревьев `markdown-pipeline` (128) переиспользует разбор; измерить `study-render.bench.tsx` до/после; при росте — рендерить ответы как `StudyInline` без абзаца |
| Изменение веса/экономики кристаллов | контент не трогает `src/data/skills/*`, значит `currency.test.ts` не затрагивается |

---

## 10. Не входит в этот дизайн

- Кнопка «показать все», сохранение состояния раскрытия, localStorage (п. 4 решения).
- Перенос/переписывание существующих блоков «Самопроверка» — они остаются как есть.
- Создание материалов для Middle / Strong Middle / Senior (сейчас их нет); гайд
  и рендерер готовы к ним, но контент — отдельная задача.
- Изменения в `src/data/*`, маршрутах, Firebase, кэшировании study-страниц.
- Автогенерация вопросов из подтем скилла (все вопросы авторские, по каталогу).

---

## 11. Критерии готовности

- [ ] `:::qa` разбирается, рендерится `<div.study-qa > details > summary + div>`, ответы скрыты.
- [ ] Реестр блоков и `globals.css` синхронны; новых `study-*` строк в компонентах нет.
- [ ] Гайд содержит раздел 10, перенумерацию 11–18 и все ссылки поправлены; пример из гайда рендерится и валиден.
- [ ] 86 блоков вопросов: 13 конвертировано, 73 добавлено; у каждого вопроса есть ответ.
- [ ] `npm run generate:materials`, `npm run study:golden` (diff отревьюен), `lint`, `typecheck`, `test`, `build` — зелёные.
- [ ] Якоря разделов не переименованы, оглавление не задвоилось.

---

## 12. Результат внедрения

| Метрика | Значение |
|---|---|
| Блоков `:::qa` | 86 (13 конвертировано, 73 добавлено) |
| Вопросов с ответами | 617 (`kotlin-basics` 134, `android-basics` 96, `ui-basics` 77, `architecture-basics` 68, `osnovy-programmirovaniya-kotlin` 54, `data-and-storage-basics` 48, `asynchronous-basics` 42, `tools-basics` 40, `navigaciya-i-komponenty` 35, `testing-basics` 23) |
| Открытых `<details>` по умолчанию | 0 (атрибут `open` не используется) |
| Изменено файлов | 34 (+1644 / −431 строки), включая 11 golden-эталонов и snapshot |

Golden-эталоны и снимок структуры обновлены **намеренно** после правки контента;
`git diff` по `__fixtures__/study-render/` отревьюен: расхождения — только новые
заголовки, контейнеры `study-qa` и свёрнутые пары вопрос/ответ.

Проверки: `npm run generate:materials`, `npm run study:golden`, `npm run lint`,
`npm run typecheck`, `npm test` (71 файл, 568 passed, 1 skipped), `npm run build` —
все зелёные.
