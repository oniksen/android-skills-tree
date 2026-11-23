# План: актуализация навыков и учебные материалы Junior

Спецификация: `docs/superpowers/specs/2026-11-23-skills-and-junior-materials-design.md`
Ветка: `feat/skills-and-materials-research`

## Рамки (жёсткие)

- Правятся только: `src/data/skills/*.ts`, `src/data/categories.ts`,
  `src/data/roadmap-links.ts`, `src/data/quiz-questions/*.ts`,
  `src/core/domain/currency.test.ts`, `content/study-materials/junior/*`.
- Не трогаем: `junior-osnovy`, оба готовых `.md`, UI, рендерер, `study-blocks.ts`.
- Не удаляем и не переименовываем существующие `skill.id`.
- Материалы генерируются только для Junior.

## Модели

| Шаг | Модель | Причина |
|---|---|---|
| Рефакторинг навыков 4 грейдов + проверка курса | `opencode-go/gemini-4-argon` | архитектурные решения, нужна целостность курса |
| Генерация текстов материалов | `opencode-go/beam-free` | $0, объём большой |
| Проверка форматирования | `opencode-go/deepseek-v4.1-flash#low` | дешёвая точечная правка |
| Оркестрация, склейка, отчёты | основная сессия | не читает сгенерированные `.md` целиком |

## Фаза 1 — навыки (все грейды)

1. Правки по матрице раздела 4 спецификации.
2. Новые `skill.id`:
   - Junior: `junior-android-notifications`, `junior-ui-compose-basics`,
     `junior-async-flow`, `junior-nav-content-provider`
   - Middle: `middle-tools-google-play-services`, `middle-di-koin`,
     `middle-networking-graphql`, `middle-tools-lint`
   - Strong Middle: `strong-arch-convention-plugins`
   - Senior: `senior-platform-ai`
3. `sortOrder` внутри категории — без дублей.
4. `requiredForLevelUp: true` для `junior-ui-compose-basics` и `junior-async-flow`
   (ядро современного Junior); остальные новые — `false`.
5. Вопрос в `quiz-questions/<grade>.ts` для каждого нового id (question + rubric).
6. Новые рёбра в `roadmap-links.ts` только внутри грейда, без циклов.
7. Пересчитать числа в `currency.test.ts`; набор из 8 наград не менять.
8. Проверка: `npm run typecheck` && `npm test`.

## Фаза 2 — генерация материалов Junior

Порядок: сначала маленькие категории (проверяем качество и правила), затем крупные.

| Волна | Категория | Части |
|---|---|---|
| 1 | `junior-test`, `junior-tools`, `junior-nav` | по 1 |
| 2 | `junior-data`, `junior-async` | по 2 |
| 3 | `junior-arch`, `junior-ui` | по 2 |
| 4 | `junior-android` | 3 |

Каждый субагент:

- пишет `content/study-materials/junior/.parts/<id>-p<N>.md`;
- получает номер первой секции (`## N.`), чтобы нумерация склеилась;
- часть 1 содержит `# Заголовок` + метаданные;
- последняя часть содержит `## Итоговая самопроверка категории` и
  `## Источники и документация`;
- строго `STUDY_MATERIALS_FORMATTING.txt`: один H1, якоря `{#latin-id}`, языки фенсов
  только `kotlin|xml|java|json|bash|text|sql|gradle|yaml`, `:::cards` закрыт,
  таблицы `<= 4` колонок с разделителем, без HTML, `>= 700` слов на навык.

Склейка (оркестратор, один вызов на категорию):

```powershell
$p = "content/study-materials/junior/.parts"
Get-Content -Raw (Get-ChildItem "$p/<id>-p*.md" | Sort-Object Name) |
  Set-Content -NoNewline "content/study-materials/junior/<id>.md"
Remove-Item -Recurse -Force $p
```

## Фаза 3 — проверка

1. Скрипт-валидатор (0 токенов): HTML-теги, незакрытые фенсы/`:::cards`, `>4` колонок,
   невалидные/дублирующиеся якоря, объём.
2. `opencode-go/deepseek-v4.1-flash#low` — по одному субагенту на файл, исправления
   только через `edit`, без переписывания файла.
3. `npm run generate:materials`.
4. `npm run lint`, `npm run typecheck`, `npm test`.

## Фаза 4 — привязка и сдача

1. `studyMaterial` для 8 категорий в `src/data/categories.ts`.
2. Повторный `npm run generate:materials` + полный прогон проверок.
3. Коммит conventional-сообщением (без тегов и версий).
