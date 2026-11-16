# Дизайн: полная унификация пайплайна Markdown → HTML страницы учебного материала

- **Дата:** 2026-11-15
- **Статус:** проект, к реализации
- **Базовая ветка:** `develop`
- **Рабочая ветка:** `feat/study-pipeline-unification` (создать от `develop`)
- **Оркестратор:** `opencode-go/deepseek-v4.1-flash` (DeepSeek V4.1 Flash 1017)
- **Субагенты:** `opencode-go/beam-free` (Beam Free)

## 1. Контекст

Сейчас в `develop` уже работает пайплайн:

```text
Markdown
  → parseStudyDocument()
  → StudyDocument { meta, sections[] }
  → StudySection
  → StudyProse / StudyCards / StudyNote
  → createStudyMarkdownComponents()
  → StudyMarkdownRenderer
  → StudyMaterialPage + StudyMaterialContent
  → HTML страницы
```

Фактическое состояние:

- `src/features/study/model/parse-study-document.ts` парсит H1/H2, meta, `:::cards`, blockquote-заметки и legacy-формат с несколькими H1.
- `src/features/study/model/study-blocks.ts` содержит `STUDY_BLOCK` и `STUDY_BLOCK_MAP`.
- `src/features/study/components/markdown-components.tsx` — реальный runtime-маппер Markdown-тегов в React-компоненты.
- `src/features/study/components/StudyMarkdownRenderer.tsx` собирает hero, nav, секции и footer.
- Роуты категории и навыка получают материал на сервере через `fetchStudyMaterial` и передают `content`/`grade` в клиентский renderer.

Что уже хорошо:

- классы `study-*` централизованы в `STUDY_BLOCK`;
- есть тесты парсера, рендера всех материалов и соответствия классов `globals.css`;
- поддержаны `:::cards`, notes, checklist, table wrap, code block, sources pills, figure, fallback без H1;
- generated registry не попадает в клиентский бандл.

Что осталось не унифицированным:

1. `STUDY_BLOCK_MAP` и `blockClass()` используются только в тестах. Компоненты пишут `STUDY_BLOCK.xxx` напрямую.
2. `tag` в `STUDY_BLOCK_MAP` не всегда совпадает с фактическим DOM:
   - `codeWrap` описан как `pre`, реально `div`;
   - `tableWrap` описан как `table`, реально `div`;
   - `figure` описан как `img`, реально `figure`;
   - `subtitle` описан как `h3`, но `h1/h2` в Markdown тоже рендерятся как `h3`.
3. Нет единого реестра «тип блока → React-компонент»: `StudySection` вручную делает `if` по `block.type`.
4. Нет теста, который проверяет, что итоговый HTML **валиден** как HTML-документ.
5. Нет единого контракта для добавления нового блочного типа: сейчас нужно править парсер, `StudySection`, `markdown-components` и, возможно, CSS.

## 2. Цель

Сделать один предсказуемый и расширяемый пайплайн:

```text
Markdown + :::cards
  → типизированный StudyDocument
  → единый реестр блоков
  → единый renderer блоков
  → валидный семантический HTML
```

При этом:

- не менять существующие CSS-классы `study-*`;
- не менять публичный API `StudyMarkdownRenderer` (`content`, `grade`);
- не менять routes и серверный `fetchStudyMaterial`;
- не трогать Firestore, state-документ и анимации ачивок;
- сохранить legacy-поддержку старых материалов и fallback без H1.

## 3. Не цели

- Не переписывать контент учебных материалов.
- Не добавлять новые визуальные блоки, кроме уже существующих.
- Не менять дизайн/тему.
- Не менять схему данных Firestore.
- Не делать деплой и не пушить ветку без отдельного решения.

## 4. Целевая архитектура

### 4.1. Слои

```text
model/parse-study-document.ts   — чистый парсер, без React
model/study-blocks.ts           — единый реестр block kind -> className/tag/layout
components/study-block-renderer.tsx — block type -> React component
components/markdown-components.tsx  — Markdown tag -> React component
components/StudyMarkdownRenderer.tsx — страница материала
components/StudyMaterialPage.tsx     — общий каркас
```

### 4.2. Единый реестр блоков

`model/study-blocks.ts` остаётся единственным местом, где объявлены классы `study-*`.

Предлагаемый контракт:

```ts
export type StudyBlockDefinition = {
  tag: keyof React.JSX.IntrinsicElements | string;
  className: StudyBlockClass;
  layout: "block" | "inline";
};
```

Требования:

- `STUDY_BLOCK` — плоский список классов (совместимость с существующими импортами).
- `STUDY_BLOCK_MAP` — реестр kind → definition.
- `blockClass(kind)` — единственный helper для получения класса в компонентах.
- `tag` должен соответствовать фактическому DOM или быть удалён, если не используется.
- `study-blocks.test.ts` продолжает проверять:
  - отсутствие дублей классов;
  - каждый класс из `STUDY_BLOCK` есть в `globals.css`;
  - каждый `study-*` класс из `globals.css` объявлен в `STUDY_BLOCK`;
  - у каждого definition есть непустой `tag`, валидный `layout` и класс `study-*`.

### 4.3. Реестр рендера блоков

Добавить `components/study-block-renderer.tsx`:

```tsx
const BLOCK_RENDERERS = {
  markdown: StudyProse,
  cards: StudyCards,
  note: StudyNote,
} satisfies Record<StudySectionBlock["type"], ComponentType<any>>;

export function StudyBlockRenderer({ block, sources }: Props) {
  const Component = BLOCK_RENDERERS[block.type];
  return <Component block={block} sources={sources} />;
}
```

Требования:

- `StudySection` больше не содержит `if (block.type === ...)`.
- Добавление нового типа блока = добавить поле в union + запись в `BLOCK_RENDERERS` + тест.
- TypeScript должен гарантировать полноту реестра через `satisfies`.

### 4.4. Markdown-компоненты

`createStudyMarkdownComponents` остаётся runtime-маппером Markdown-тегов.

Требования:

- все классы берутся через `STUDY_BLOCK` или `blockClass()`;
- никаких строк `"study-..."` вне `study-blocks.ts` и `globals.css`;
- `inline`-режим сохраняет поведение для заголовков и карточек;
- `sources`-режим превращает списки ссылок в pills;
- `pre`/`code` продолжают использовать `StudyCodeBlock`;
- blockquote продолжает превращаться в `StudyNote` (note/warn);
- table получает scroll wrapper с `role="region"` и `aria-label`.

### 4.5. Парсер `:::cards`

`parseStudySectionBody` должен остаться единственным местом, где распознаётся `:::cards`.

Требования:

- `:::cards` открывается только отдельной строкой;
- закрывается отдельной строкой `:::`;
- внутри поддерживаются `- **Заголовок** — текст` и продолжения строк;
- код-фенсы внутри секции не ломают парсинг;
- незакрытый `:::cards` не теряет весь остальной Markdown: блок остаётся markdown-контентом или корректно диагностируется в dev;
- несколько `:::cards` в одной секции поддерживаются;
- CRLF нормализуется.

### 4.6. Валидный HTML

Добавить dev-зависимость `html-validate` и тест:

`src/features/study/components/study-html-validity.test.tsx`

Тест должен:

1. Отрендерить каждый материал из `STUDY_MATERIALS` через
   `renderToStaticMarkup(<StudyMarkdownRenderer ... />)`.
2. Обернуть фрагмент в полноценный документ:

```ts
const document = `<!doctype html><html lang="ru"><head><title>test</title></head><body>${html}</body></html>`;
```

3. Прогнать через `HtmlValidate` с `html-validate:recommended`.
4. Проверить:
   - `report.valid === true`;
   - нет `:::cards`, `[!WARNING]`, `[!CAUTION]`;
   - нет `undefined`, `NaN`;
   - есть `study-hero`, `study-section`, `study-title`;
   - таблицы имеют `study-table-wrap`/`study-table`;
   - code block имеет `study-code-wrap`/`study-code`;
   - sources имеют `study-pills`/`study-pill`.
5. Плюс синтетический fixture, который покрывает все типы блоков:
   hero, nav, section, markdown, cards, note, warn-note, checklist,
   table, code, image, sources, footer.

Если `html-validate` даёт ложные срабатывания на React-разметку, правила отключаются точечно в конфиге теста, а не глобально.

## 5. Пошаговый план выполнения

### Этап 0 — подготовка (оркестратор)

1. Создать ветку от `develop`:

```bash
git switch develop
git switch -c feat/study-pipeline-unification
```

2. Зафиксировать baseline:

```bash
npm run lint
npm run typecheck
npm test
```

Ожидаемо: 8 pre-existing failures в data-driven тестах
(`weights`, `currency`, `scoring`, `quiz-questions`); они не относятся к задаче.

3. Записать в ledger:
   - baseline commit;
   - список pre-existing failures;
   - модель оркестратора и субагентов.

### Этап 1 — контракт реестра блоков (субагент Beam Free)

Задача субагенту:

- привести `study-blocks.ts` к единому контракту;
- исправить `tag`/`layout`/`className` так, чтобы они соответствовали реальному DOM;
- добавить/обновить `study-blocks.test.ts`;
- не менять компоненты, кроме механических замен на `blockClass()`, если это необходимо.

Критерии:

- `STUDY_BLOCK` не меняет существующие имена классов;
- `STUDY_BLOCK_MAP` валиден;
- тест CSS-консистентности проходит;
- `npm run lint`, `typecheck`, `test` проходят (кроме pre-existing).

### Этап 2 — реестр рендера блоков (субагент Beam Free)

Задача:

- добавить `components/study-block-renderer.tsx` с `BLOCK_RENDERERS`;
- переписать `StudySection` на `StudyBlockRenderer`;
- сохранить текущий вывод HTML;
- добавить unit-тест на полноту реестра и рендер каждого типа блока.

Критерии:

- `StudySection` не содержит ручных `if` по `block.type`;
- `satisfies Record<StudySectionBlock["type"], ...>` гарантирует полноту;
- существующие тесты `study-markdown-renderer.test.tsx` проходят;
- HTML-структура не меняется.

### Этап 3 — парсер `:::cards` и edge cases (субагент Beam Free)

Задача:

- усилить `parseStudySectionBody`:
  - несколько `:::cards`;
  - незакрытый блок;
  - `:::` внутри code fence;
  - пустые карточки;
  - продолжения строк;
  - CRLF;
- добавить тесты в `parse-study-document.test.ts`.

Критерии:

- валидные материалы рендерятся как раньше;
- новые edge-case тесты проходят;
- fallback не теряет остальной Markdown.

### Этап 4 — HTML validity + доступность (субагент Beam Free)

Задача:

- добавить `html-validate` в devDependencies;
- добавить `study-html-validity.test.tsx`;
- проверить все материалы и синтетический fixture;
- проверить aria/role:
  - nav `aria-label="Содержание"`;
  - table wrapper `role="region"`, `aria-label`;
  - figure caption;
  - copy button `aria-label`.

Критерии:

- `report.valid === true` для всех материалов;
- нет raw markdown-маркеров;
- тест не падает на pre-existing окружении;
- `npm run build` проходит.

### Этап 5 — документация и финальный review (оркестратор)

1. Обновить `AGENTS.md`:
   - единый block registry;
   - `StudyBlockRenderer`;
   - `html-validate` тест;
   - правило «новый блок = parser + registry + renderer + test».
2. Переместить/скопировать этот дизайн в
   `docs/superpowers/specs/2026-11-15-study-material-pipeline-unification.md`
   (после переключения в режим реализации).
3. Финальный review:
   - diff scope;
   - нет изменений в Firestore/анимациях;
   - все `study-*` классы только из реестра;
   - все материалы валидны;
   - `npm run lint`, `typecheck`, `test`, `build`.
4. Коммиты conventional commits. Не пушить и не деплоить без отдельного решения.

## 6. Процесс работы с агентами

### Оркестратор

Модель: `opencode-go/deepseek-v4.1-flash` (DeepSeek V4.1 Flash 1017).

Ответственность:

- создать ветку и вести ledger;
- писать task brief для каждого субагента;
- запускать **один** субагент за раз;
- после каждого этапа делать code review;
- запускать проверки;
- принимать/возвращать работу на доработку;
- делать коммиты после успешного review;
- не отдавать субагенту весь план — только его task brief.

### Субагенты

Модель: `opencode-go/beam-free`.

Правила для каждого субагента:

- свежая сессия;
- читать только свой brief и указанные файлы;
- не использовать субагентов;
- не коммитить и не пушить;
- запускать указанные проверки;
- писать отчёт в указанный файл;
- возвращать статус, файлы, одну строку тестов, риски.

### Review после каждого этапа

Чек-лист оркестратора:

1. Diff соответствует этапу, нет несвязанных файлов.
2. Не изменены Firestore, state-документ, анимации ачивок.
3. `StudyMarkdownRenderer` API не сломан.
4. Классы `study-*` не хардкодятся вне `study-blocks.ts`/CSS.
5. `:::cards` обрабатывается только парсером.
6. HTML валиден на всех материалах.
7. `npm run lint`, `typecheck`, `test`, `build` — с учётом 8 pre-existing failures.
8. Документация обновлена.

Если review находит проблему:

- вернуть задачу тому же субагенту с точным описанием;
- максимум 2 fix-раунда;
- если не сходится — оркестратор дробит задачу мельче или делает минимальный фикс сам под review.

## 7. Acceptance criteria

- [ ] Пайплайн `Markdown → StudyDocument → blocks → HTML` имеет один реестр блоков и один реестр рендера.
- [ ] `STUDY_BLOCK_MAP`/`blockClass` используются в runtime, а не только в тестах.
- [ ] `tag`/`layout` в реестре соответствуют фактическому DOM.
- [ ] `StudySection` не содержит ручных `if` по типам блоков.
- [ ] `:::cards` покрыт edge-case тестами.
- [ ] Все материалы проходят `html-validate`.
- [ ] Нет raw `:::cards`, `[!WARNING]`, `[!CAUTION]`, `undefined`, `NaN` в HTML.
- [ ] Все существующие тесты рендера и CSS-консистентности проходят.
- [ ] Firestore/анимации не затронуты.
- [ ] `npm run lint`, `typecheck`, `test`, `build` проходят (кроме 8 pre-existing).
- [ ] `AGENTS.md` и spec-документ обновлены.

## 8. Риски и mitigation

| Риск | Mitigation |
|------|------------|
| Изменится HTML-вывод и сломается визуал | Структурные тесты + рендер всех материалов + визуальная проверка |
| `html-validate` даёт false positives | Точечные rule overrides в тесте, не глобально |
| Субагент затронет Firestore/анимации | Явный scope в brief + review diff |
| `STUDY_BLOCK_MAP` начнут использовать неверно | Типы `StudyBlockKind`, `satisfies`, тесты полноты |
| Сломается legacy-материал с несколькими H1 | Отдельный тест legacy-формата и fallback без H1 |
| Generated registry попадёт в клиент | Не импортировать `study-materials.generated.ts` в клиентские компоненты; проверять diff |
| Новый блок забудут добавить в renderer | `satisfies Record<...>` + тест на каждый тип |

## 9. Branch / commit

- Ветка: `feat/study-pipeline-unification` от `develop`.
- Коммиты после каждого этапа:
  - `refactor: unify study block registry`
  - `refactor: add study block renderer registry`
  - `test: cover :::cards edge cases`
  - `test: validate study material HTML`
  - `docs: document study pipeline contract`
- Push/PR/merge — только после отдельного решения.

## 10. Итог реализации

Пайплайн реализован на ветке `feat/study-pipeline-unification` одним проходом.
Коммиты: `refactor: unify study block registry`, `refactor: add study block renderer
registry`, `test: cover :::cards edge cases`, `test: validate study material HTML`.

Отличия от проекта (все — следствие требований, а не смена цели):

1. Контракт блока — `tags: readonly [StudyBlockTag, ...]` вместо `tag: string`:
   `list` реально рендерится и как `<ul>`, и как `<ol>`, поэтому одиночный тег врал бы.
2. `role="group"` у обёртки таблицы вместо `role="region"`: несколько таблиц в материале
   повторяют одно имя, а `unique-landmark` из `html-validate:recommended` отклоняет
   повторяющиеся имена landmark-областей (проверено и для `<div role="region">`,
   и для нативного `<section aria-label>`).
3. В `html-validate` точечно отключены `attribute-boolean-style`, `void-style`
   (`react-dom/server` сериализует `disabled=""` и `<input/>`) и `no-inline-style`
   (выравнивание колонок GFM приходит как `style="text-align:right"`).
4. Тест валидности нашёл два реальных дефекта, исправленных отдельными RED→GREEN тестами:
   - одиночная картинка давала `<p><figure>` — недопустимая вложенность;
   - две соседние заметки (`> [!NOTE]` и `> [!WARNING]`) склеивались в одну, и второй
     маркер попадал в текст.
5. Фенсы отслеживаются одним helper'ом (`fenceMarker`/`toggleFence`): закрывает только
   маркер того же вида и не короче открывающего, поэтому ``` внутри примера с `~~~`
   не рассинхронизирует парсер и не выпускает raw `:::` на страницу.
6. Известное ограничение: картинка вместе с текстом в одном абзаце
   (`![A](a) текст`) по-прежнему даёт `<p><figure>`. Материалы так не пишут; попытка
   поймана тестом валидности, а не отрендерится молча.

Проверки: `npm run lint`, `npm run typecheck`, `npm test` (8 pre-existing падений в
data-driven тестах `weights`/`currency`/`scoring`/`quiz-questions` сохраняются), `npm run build`.

