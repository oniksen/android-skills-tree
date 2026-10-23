# Спецификация: учебные материалы для навыков

Дата: 2026-10-23

## Цель

Добавить к навыкам (skills) учебные материалы, которые открываются по иконке рядом с названием навыка в карточке скила. Материал отображается на отдельной странице, стилизованной под проект и реагирующей на текущую тему (light/dark/system).

## Маршрут

- Путь: `/tree/[slug]/skill/[skillId]/study`
- Страница валидирует уровень, принадлежность скила уровню и наличие материала.
- Если материала нет — `notFound()`.

## Привязка материала к блоку (категории)

В `src/data/categories.ts` у интерфейса `Category` есть поле:

```ts
studyMaterial?: string; // id материала в реестре
```

У скила с материалом:

```ts
{
  id: "junior-android-studio",
  ...
  studyMaterial: "android-project-structure",
}
```

Материал также может быть привязан к отдельному навыку через `Skill.studyMaterial` (маршрут `/tree/[slug]/skill/[skillId]/study`).

## Реестр материалов

Файл `src/features/study/study-materials.ts`:

```ts
export interface StudyMaterial {
  id: string;
  title: string;
  component: ComponentType;
}

export const studyMaterials: Record<string, StudyMaterial> = { ... };
export function getStudyMaterial(id?: string | null): StudyMaterial | undefined;
```

Каждый материал — отдельный компонент в `src/features/study/materials/<id>.tsx`, который регистрируется в реестре.

## Компоненты

- `src/features/study/components/StudyMaterialPage.tsx` — обёртка страницы: ссылка «Назад к навыку» и контейнер `study-article`.
- `src/features/study/components/StudyCodeBlock.tsx` — блок кода с кнопкой копирования.
- Материал — обычный React-компонент, использующий только `study-*` классы.

## Обязательные CSS-классы

Все цвета должны использовать CSS-переменные проекта (`--bg`, `--fg`, `--surface`, `--surface-border`, `--color-*`, `--study-*`), чтобы тема менялась автоматически. Запрещены жёстко заданные цвета вне `--study-code-*`.

Основные классы:
- `study-page`, `study-back`, `study-article`
- `study-hero`, `study-eyebrow`, `study-title`, `study-lead`
- `study-nav`, `study-nav-link`
- `study-section`, `study-section-title`, `study-subtitle`
- `study-grid`, `study-mini`, `study-mini-title`
- `study-code-wrap`, `study-copy`, `study-code`, `study-tree`
- `study-diagram`, `study-flow`, `study-node`, `study-arrow`
- `study-note`, `study-warn`
- `study-table`
- `study-pill`
- `study-checklist`
- `study-footer`, `study-muted`, `study-small`, `study-tag`

## Иконка в карточке блока/навыка

В `CategoryCard` и `CategoryCardReadonly` иконка `BookOpen` показывается рядом с названием категории, если передан `studyHref`:

```
studyHref={category.studyMaterial ? `/tree/${slug}/category/${categoryId}/study` : undefined}
```

Аналогично для навыка в `SkillDetailContent`:

```
studyHref={skill.studyMaterial ? `/tree/${slug}/skill/${skillId}/study` : undefined}
```

## Интеграция нового материала (шаги)

1. Создать `src/features/study/materials/<id>.tsx` с компонентом, использующим `study-*` классы.
2. Добавить запись в `studyMaterials` в `src/features/study/study-materials.ts`.
3. Добавить `studyMaterial: "<id>"` к нужной категории в `src/data/categories.ts` (или к навыку в `src/data/skills.ts`).
4. Проверить `npm run lint`, `npm run typecheck`, `npm test`.

## Квиз-вопросы

Вопросы хранятся в `src/data/quiz-questions.ts` сгруппированными по `skillId`:

```ts
export const quizQuestionsBySkill: Record<string, QuizQuestion[]> = { ... };
```

Каждый вопрос содержит `skillId` и `grade: QuizGrade` (`junior`, `middle`, `strong-middle`, `senior`).
Доступны `allQuizQuestions`, `getQuizQuestionsBySkill(skillId)`, `getGradeLevelOrder(grade)`.

Правила показа:
- Пользователю не показываются вопросы с грейдом выше его текущего уровня.
- Вопросы с грейдом ниже или равного текущему показываются.
- Грейд текущего вопроса отображается в интерфейсе квиза.

## Правила макета страницы

- Страница материала занимает всю ширину контейнера, без `max-width`.
- Горизонтальные отступы небольшие: `16px` на десктопе, `12px` на мобильных.
- Кнопка «Назад» находится в верхней строке слева (`study-topbar`), в углу страницы и ведёт на страницу дерева.
- Цвета только через переменные; для акцентных фонов (`hero`, `note`, `tag`) использовать `--study-accent-bg` и `--study-accent-text`, чтобы они адаптировались к теме.
- Muted-текст использовать `--color-slate-400`, чтобы оставаться читаемым в тёмной теме.
- Шапка (hero) компактная, без тяжёлой тени в тёмной теме.

## Проверка

- `npm run lint`
- `npm run typecheck`
- `npm test`
- Ручная проверка: светлая/тёмная/системная тема на странице материала, мобильная версия.
