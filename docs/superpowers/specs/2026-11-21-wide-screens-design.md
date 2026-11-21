# Дизайн: широкие экраны во всех разделах

- Дата: 2026-11-21
- Статус: утверждено
- Документ: `docs/superpowers/specs/2026-11-21-wide-screens-design.md`
- Связанный план: `docs/superpowers/plans/2026-11-21-wide-screens.md`

## 1. Задача

`/tree/[slug]` уже использует всю ширину: hero-строка с прогрессом уровня, тулбар
с табами и легендой, auto-fill сетка карточек. Остальные разделы остаются в
`max-w-6xl` (1152 px), поэтому на 1920–2560 px половина экрана пустует, а списки
и карточки вытянуты в одну колонку. Нужно распространить подход tree на все
существующие страницы и сохранить текущие раскладки до 1280 px.

## 2. Границы

**Делаем:**

- общий широкий контейнер и выравнивание шапки для приватных разделов;
- переиспользуемые `PageHero`, `PageSummaryCard`, `content-grid`;
- перестройку dashboard, roadmap, projects, shop, achievements, profile;
- адаптацию quiz, skill-detail, study и login;
- синхронные скелетоны и route-level `loading.tsx`.

**Не делаем:**

- данные, Firestore, роутинг, auth/proxy, состав навигации;
- цвета, темы и glass-токены;
- study-разметку, реестр материалов, golden-фикстуры, сгенерированные файлы;
- мобильные раскладки < 1280 px: существующие `sm:`/`md:` сетки сохраняются;
- незакоммиченную работу по tree не откатываем.

**Anti-goals (считаем провалом):**

- горизонтальный скролл на любой ширине;
- шапка и `main` с разным `max-w`;
- растянутая модалка профиля;
- скачок раскладки после загрузки из-за несовпадения скелетона;
- строки текста, растущие вместе с экраном;
- контент под sticky-шапкой.

## 3. Решения

### 3.1 Контейнеры

| Маршрут | `main` | Шапка |
|---|---|---|
| `/tree/**` (кроме study) | `max-w-[2000px]`, `nav-md:px-6` | `max-w-[2000px]` |
| `/dashboard`, `/roadmap`, `/projects`, `/shop`, `/achievements`, `/profile` | `max-w-[2000px]`, `nav-md:px-6` | `max-w-[2000px]` |
| `/quiz` | `max-w-[1200px]`, `p-3` | `max-w-[1200px]` |
| study | `max-w-none`, `p-3` | `max-w-none` |
| `/login` | свой wrapper `max-w-6xl` | Header не рендерится |

Ширина выбирается чистой функцией `pageWidthFor(pathname)` в `src/lib/layout.ts`
(`"wide" | "study" | "quiz" | "default"`) с тестом. `default` остаётся
`max-w-6xl`.

### 3.2 Компоненты

- `src/shared/ui/PageHero.tsx` — заголовок с префиксом, описание, `meta`,
  `leading` (аватар) и `aside`. На `xl` — `grid-cols-[minmax(0,1fr)_minmax(320px,380px)]`,
  как `LevelHero`.
- `src/shared/ui/PageSummaryCard.tsx` — `card-surface`, верхняя линия, title/meta,
  опциональный `ProgressBar`, список stats.
- `globals.css`: `@utility content-grid` (`minmax(min(24rem,100%),1fr)`) и
  `@utility content-grid-wide` (`minmax(min(34rem,100%),1fr)`).

### 3.3 Breakpoints

- `< 600 px` — mobile, без изменений.
- `600–1279 px` — как сейчас; новые колонки не добавляем.
- `>= 1280 px` (`xl`) — двухколоночный hero и широкие раскладки.
- `>= 1536 px` (`2xl`) — дополнительные колонки там, где контент позволяет.

`content-grid` на 1440 даёт 2 колонки, на 1536 — 3, на 2560 — 4.
`content-grid-wide` на 1280 — 1, на 1440–1920 — 2, на 2560 — 3. Числа — ожидаемый
результат auto-fill, а не жёсткая сетка.

### 3.4 Особые случаи

- **GapList:** незакоммиченный `openSkill`/deep-link сохраняется, меняются только
  обёртка и row-классы.
- **Study:** ограничивается вся контентная колонка, а не отдельные абзацы:
  `.study-hero`, `.study-section`, `.study-footer` получают
  `max-width: 72rem; margin-inline: auto`. На 1440 ширина не меняется, на 2560
  текст остаётся как на 1440. Код и таблицы скроллятся внутри себя.
- **Skill-detail:** `loading.tsx` входит в работу; `SkillDetailSkeleton` получает
  `wide` и передаёт его и страница, и `loading.tsx`.
- **Шапка/main:** проверяется одинаковый `max-w` и центрирование; стеклянная
  карточка шапки может быть на 12 px внутри своего padding, как на tree.
- **ProfileModal:** вызовов в коде нет. Оставляем рабочим: `ProfileContent`
  получает `variant?: "page" | "modal"` (default `"page"`), модалка передаёт
  `"modal"`. Визуально не проверяется.

## 4. Изменения по страницам

| Страница | Широкий слой | Мобильный слой |
|---|---|---|
| Dashboard | hero с `LevelProgressCard` в aside; ниже `md:grid-cols-2 2xl:grid-cols-3` из QuickStats, StreakCard, NextMilestone | порядок как сейчас |
| Roadmap | hero с focus-чипом и сводкой; тулбар сортировки; `GapList` в `content-grid-wide` | одна колонка |
| Projects | hero со сводкой «выполнено X/Y»; карточки уровней в `content-grid` | `space-y-3` |
| Shop | `xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]`: товар слева, таблица наград справа | стек |
| Achievements | hero со сводкой «открыто X/Y»; группы в `content-grid` | одна колонка |
| Profile | `xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]`: статистика и достижения / ссылки и настройки | одно колонка |
| Quiz | центрированная колонка `max-w-[1200px]` | как сейчас, на всю ширину |
| Skill detail | `max-w-4xl 2xl:max-w-5xl`; `wide` → `xl:grid-cols-2` (описание / подтемы) | одна колонка |
| Study | контентная колонка 72rem | без изменений |
| Login | на `lg` две колонки: бренд и пункты / терминальная карточка | центрированная карточка |

## 5. Порядок работ

1. `pageWidthFor` + Header + CSS-утилиты.
2. `PageHero` + `PageSummaryCard`.
3. Dashboard.
4. Roadmap.
5. Projects.
6. Shop.
7. Achievements.
8. Profile.
9. Quiz.
10. Skill detail.
11. Study.
12. Login.
13. QA: скелетоны, lint/typecheck/test/build, визуальные замеры.

## 6. Проверка

- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.
- Новый `src/lib/layout.test.ts` покрывает `pageWidthFor`.
- Визуально: 390/768/1440/1920/2560, обе темы; приватные страницы — с сессией.
- Замеры: header и main с одинаковым `max-w`; `overflowX = false`; study-колонка
  ≤ 72rem на 2560; skill-detail loading не прыгает.

## 7. Риски

- Рассинхрон Header/main у будущих маршрутов — закрывается тестом `pageWidthFor`.
- `GapList` в колонках 34rem: проверить badge/XP/полосу на 1440.
- Скелетоны обязаны повторять сетки.
- Study-тесты проверяют только имена классов, поэтому CSS-правки безопасны.

## 8. Решения, принятые при написании дизайна

- Контент study центрируется колонкой 72rem, а не режется по `ch` построчно.
- Login получает статический текст без цифр из данных.
- `ProjectCard` и модалка профиля не переделываются сверх `variant`.
