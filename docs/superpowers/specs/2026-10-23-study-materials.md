# Спецификация: учебные материалы для навыков

Дата: 2026-10-23  
Обновлено: 2026-10-31 — Markdown-пайплайн, универсальный hero, pill-ссылки.

## Цель

Учебные материалы открываются по иконке `BookOpen` рядом с названием категории или навыка и показываются на отдельной странице. Материал хранится как Markdown в репозитории, автоматически превращается в React-страницу со стилями `study-*` и синхронизируется в Firestore.

## Архитектура

1. Источник: `content/study-materials/<grade>/<id>.md`.
2. `scripts/generate-study-materials-registry.mjs` собирает `src/features/study/study-materials.generated.ts`.
3. Клиентский хук `useStudyMaterial(id)` читает материал из generated registry.
4. `StudyMarkdownRenderer` вызывает `applyStudyPattern(content, grade)`.
5. `ReactMarkdown` + `rehypeRaw` + `rehypeHighlight` рендерит HTML, таблицы, списки и код.
6. Страница: `/tree/[slug]/category/[categoryId]/study` или `/tree/[slug]/skill/[skillId]/study`.

## Данные

`StudyMaterialContent`:

```ts
export interface StudyMaterialContent {
  id: string;
  title: string;
  grade: string;
  categoryId: string;
  content: string;
}
```

`grade` используется как fallback для уровня в hero, если в Markdown нет `**Уровень:**`.

## Привязка материала

В `src/data/categories.ts`:

```ts
studyMaterial?: string; // id материала в реестре
```

В `src/data/skills/<grade>.ts`:

```ts
studyMaterial?: string;
```

Иконка в карточках:

```tsx
studyHref={category.studyMaterial ? `/tree/${slug}/category/${categoryId}/study` : undefined}
studyHref={skill.studyMaterial ? `/tree/${slug}/skill/${skillId}/study` : undefined}
```

## Markdown-контракт

- Требуется **не менее 2 H1**. Иначе `applyStudyPattern` возвращает исходный Markdown без преобразований.
- Первый H1 становится `study-title`.
- Метаданные в шапке между первым и вторым H1 парсятся для hero/lead/footer.
- Остальные H1 становятся `study-section` с `study-nav`.
- H2 становится `study-subtitle`.
- H3 становится `study-small`.
- H2 с `Источник` в названии и следующие строки `- [Title](url)` становятся кликабельными `study-pill`.
- Необработанные HTML-блоки требуют пустых строк вокруг себя.
- В заголовках код пишется только через backticks; renderer экранирует `<`, `>`, `&`.

Метаданные:

```markdown
**Уровень:** Junior
**Категория:** Основы программирования
**Язык:** Kotlin
**Кратко:** <одно предложение для lead; optional>
**Футер:** <текст footer; optional>
```

Hero собирается так:
- Eyebrow: `Категория · Уровень`; если категории нет — `Язык · Уровень`; если нет ничего — `Учебный материал`.
- Lead: `**Кратко:**` или генерируется по категории/теме и уровню.
- Footer: `**Футер:**` или генерируется по уровню и языку.

## Поддерживаемые блоки

Использовать только эти классы и CSS-переменные проекта:
`study-hero`, `study-eyebrow`, `study-title`, `study-lead`, `study-nav`, `study-nav-link`,
`study-section`, `study-section-title`, `study-subtitle`, `study-grid`, `study-mini`,
`study-mini-title`, `study-note`, `study-note study-warn`, `study-table`, `study-flow`,
`study-node`, `study-arrow`, `study-pill`, `study-checklist`, `study-footer`, `study-muted`,
`study-small`, `study-tag`, `study-code`, `study-tree`, `study-diagram`.

## Шаблон нового материала

```markdown
# <Название темы>

**Уровень:** Junior
**Категория:** <категория>
**Язык:** Kotlin
**Кратко:** <одно предложение для lead; optional>

## Содержание

1. [<Раздел>](#1-...)

---

# 1. <Раздел>

... H2/H3, code fences, study-* HTML blocks ...

# Итоговая самопроверка категории

...

## Источники и документация

### <Группа>
- [Title](https://...)
```

## Маршруты

- Путь категории: `/tree/[slug]/category/[categoryId]/study`
- Путь навыка: `/tree/[slug]/skill/[skillId]/study`
- Страница валидирует уровень, принадлежность и наличие `studyMaterial`.
- Если материала нет — `notFound()`.

## Компоненты

- `StudyMaterialPage` — обёртка страницы: ссылка «Назад» и контейнер `study-article`.
- `StudyMaterialContent` — загрузка по `materialId` и рендер `StudyMarkdownRenderer`.
- `StudyMarkdownRenderer` — применяет `applyStudyPattern` и рендерит Markdown.
- `StudyCodeBlock` — блок кода с кнопкой копирования.

## Правила страницы

- Страница материала занимает всю ширину контейнера.
- Цвета только через CSS-переменные.
- Muted-текст использует `--color-slate-400`.
- Hero компактный, без тяжёлой тени в тёмной теме.

## Команды

- Регенерация реестра: `npm run generate:materials`
- Синхронизация в Firestore: `npm run upload:study`
- Проверка: `npm run lint`, `npm run typecheck`, `npm test`

## Known limitations

- Legacy HTML-материалы обходят `applyStudyPattern`, если в них меньше 2 H1.
- `categoryId` в registry повторяет `id`; для привязки используется `studyMaterial`, а не `categoryId`.
- Чекбоксы в материалах только визуальные, без сохранения.
- Не редактировать `study-materials.generated.ts` руками.
- Имя файла `<id>.md` должно совпадать с `studyMaterial` в данных.
- `npm run prebuild` регенерирует registry перед сборкой.
filePath">
/Users/oniksen/Documents/pet-projects/android-skills-tree/docs/superpowers/specs/2026-10-23-study-materials.md