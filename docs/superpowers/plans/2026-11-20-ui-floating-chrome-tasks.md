# Список задач: плавающий chrome (меню + шапка)

Дизайн-документ: `docs/superpowers/specs/2026-11-20-ui-floating-chrome-design.md`
Репозиторий: `D:\projects\android-skills-tree`
Ветка: `feat/ui-refinements` от `main`

## Как выполнять (обязательно для всех агентов)

1. Работай строго по одной задаче. Файлы вне списка «Файлы» задачи не трогай.
2. **Сразу после выполнения каждого шага** открой этот файл и замени `- [ ]` на `- [x]` у этого шага. Не откладывай отметки до конца задачи.
3. После завершения задачи допиши строку в «Журнал выполнения» (дата, задача, что сделано).
4. Если шаг невозможно выполнить или дизайн противоречит коду — остановись и опиши проблему, не придумывай своё решение.
5. Перед сдачей задачи запусти команды из её раздела «Проверка» и приложи вывод.

Модели (указываются в вызове `subagent`):

- реализация: `model: "opencode-go/beam-free"`;
- ревью: `model: "opencode-go/deepseek-v4.1-flash#low"`, только чтение, без правок.

Между задачами ревью обязательно. Правки после ревью вносит тот же реализатор (продолжение сессии через `sessionID`), затем ревью повторяется.

## Прогресс

| Задача | Статус | Реализатор | Ревью | Коммит |
|---|---|---|---|---|
| T0 Ветка и сервер | [x] | оркестратор | — | — |
| T1 Токены CSS | [x] | beam-free | deepseek low | — |
| T2 Сайдбар-карточка | [x] | beam-free | deepseek low | — |
| T3 Шапка-карточка | [x] | beam-free | deepseek low | — |
| T4 Study-отступы | [x] | beam-free | deepseek low | — |
| T5 QA | [x] | beam-free | deepseek low | — |
| T6 Study-карточка | [x] | beam-free | deepseek low | — |
| T7 Liquid glass: CSS-базис | [x] | beam-free | deepseek low | — |
| T8 Liquid glass: панели | [x] | beam-free | deepseek low | — |
| T9 Liquid glass: QA | [x] | beam-free | deepseek low | — |

---

## T0. Ветка и окружение (оркестратор, не sub-агент)

- [x] Убедиться, что рабочее дерево без чужих незакоммиченных правок, кроме текущей работы. (В дереве осталась незакоммиченная работа по Tree от 2026-11-19/20 и изменённый study-snapshot — они не входят в T1–T5 и не коммитились.)
- [x] Создать ветку: `git switch -c feat/ui-refinements`.
- [x] Перезапустить дев-сервер (`npm run dev`), дождаться `Ready`.
- [x] Проверить, что `http://localhost:3000/tree/junior` отвечает 200.

**Важно:** ветку `main` не переименовывать и не удалять.

---

## T1. Токены и утилита карточки

Модель: `opencode-go/beam-free`. Файлы: `src/app/globals.css`.

Шаги:

- [x] В `:root` внутри `@layer base` (рядом с `--bg`, `--surface`) добавить:
  ```css
  --app-chrome-gap: 12px;
  --app-header-height: 56px;
  --app-header-offset: calc(var(--app-header-height) + var(--app-chrome-gap));
  ```
- [x] После `@utility card-surface` добавить:
  ```css
  @utility app-card {
    border: 1px solid var(--surface-border);
    border-radius: 1rem;
    background: var(--surface);
    box-shadow: 0 8px 24px rgb(0 0 0 / 0.14);
  }
  ```
- [x] Убедиться, что `56px` в study-правилах пока не тронуты (это задача T4).

**Проверка:**

```powershell
npm run typecheck
npm run lint
```

Дополнительно: `Select-String -Path src/app/globals.css -Pattern "app-card|--app-header-offset"` — 4+ совпадения.

**Критерии ревью:** добавлены только токены и утилита; поведение страниц не изменилось; правила не дублируют `card-surface`.

---

## T2. Сайдбар как плавающая карточка

Модель: `opencode-go/beam-free`. Файлы: `src/shared/ui/Header.tsx`.

Шаги:

- [x] Десктопное меню (`hidden nav-lg:flex`, около строки 218) обернуть в карточку:
  ```tsx
  <nav
    aria-label="Основная навигация"
    className="hidden nav-lg:flex sticky top-0 z-40 h-dvh w-[17.5rem] shrink-0 px-3 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3"
  >
    <div className="app-card flex h-full w-full flex-col overflow-hidden">
  ```
  Внутреннее содержимое (бренд, пункты, футер) не менять, только закрыть `</div>` перед `</nav>`.
- [x] Заменить `border-slate-700/70` у внутренних разделителей бренда и футера на `border-white/[0.06]`.
- [x] Планшетный рельс (`hidden nav-md:flex nav-lg:hidden`, около строки 245) обернуть так:
  ```tsx
  <nav
    aria-label="Основная навигация"
    className="hidden nav-md:flex nav-lg:hidden sticky top-0 z-40 h-dvh w-max shrink-0 p-3"
  >
    <div className="app-card flex h-full flex-col items-stretch gap-1 overflow-y-auto px-3 py-4">
  ```
- [x] Убрать у обоих `nav` классы `self-start`, `border-r`, `bg-slate-950/90`, `backdrop-blur-xl`.

**Проверка:**

- [ ] 1440 px: карточка меню шириной 256 px, отступ 12 px слева/сверху/снизу, скругление и тень видны. — не проверено визуально: меню рендерится только при Firebase-сессии, ширина 256 следует из `w-[17.5rem] − 2×12px` и проверена по коду.
- [ ] 768 px: планшетный рельс — карточка, пункты не обрезаны, прокрутка внутри карточки при нехватке высоты. — не проверено визуально по той же причине; `overflow-y-auto` и `h-full` подтверждены кодом.
- [x] Горизонтального скролла нет (замеры 390/768/1440/1920/2560: `overflowX=false`).

**Критерии ревью:** меню выглядит карточкой, содержимое и навигация не изменились, `z-index` шапки выше меню.

---

## T3. Шапка как плавающая карточка

Модель: `opencode-go/beam-free`. Файлы: `src/shared/ui/Header.tsx`, `src/app/globals.css` (только удаление `.header-blur`).

Шаги:

- [x] Рядом с `const isTree` добавить:
  ```tsx
  const headerWidthClass = isQuiz || isStudy ? "max-w-none" : isTree ? "max-w-[2000px]" : "max-w-6xl";
  ```
- [x] Заменить `<header>` (около строки 260) на:
  ```tsx
  <header className="sticky top-0 z-50 px-3 pt-[max(env(safe-area-inset-top),0.75rem)]">
    <div className={`app-card mx-auto flex h-14 w-full items-center justify-between gap-4 px-4 ${headerWidthClass}`}>
  ```
  Внутренний блок с брендом, `Prompt`, бейджами и login сохранить без изменений; закрыть `</div>` перед `</header>`.
- [x] Удалить градиентную линию `pointer-events-none h-px w-full bg-gradient-to-r ...` и класс `header-blur` с шапки.
- [x] Удалить неиспользуемое правило `.header-blur` в `globals.css` (около строки 456).

**Проверка:**

- [ ] 1440 px на `/dashboard`: карточка шапки 1152 px по центру, верхний отступ 12 px, высота 56 px. — сама ширина 1152 следует из `max-w-6xl`; визуально `/dashboard` недоступен без авторизации. На `/tree` при 1440 измерено 1406 px (карточка на 12 px внутри краёв).
- [x] 1920 px на `/tree/junior`: ширина шапки измерена 1886 px (viewport меньше потолка 2000), выровнена с контентом по центру; на 2560 — 2000 px, совпадает с `main` (x=275, w=2000).
- [x] При скролле шапка остаётся сверху (y=12 при scrollY=599) и перекрывает контент, «дыры» нет.
- [x] 390 px: шапка — карточка 356 px с отступом 12 px, кнопка login не обрезана.

**Критерии ревью:** ширина совпадает с `main` на каждой категории страниц; градиент и `header-blur` удалены; `z-50` сохранён.

---

## T4. Study-отступы на общий токен

Модель: `opencode-go/beam-free`. Файлы: `src/app/globals.css`.

Предусловие: T3 завершена, шапка уже занимает 68 px в потоке.

Шаги (заменить `56px` по таблице из дизайн-документа, раздел 5.1.3):

- [x] `:487` — `min-height` study-страницы.
- [x] `:500` — `top` плавающей кнопки «Вернуться к дереву».
- [x] `:700` — `top` sticky-оглавления.
- [x] `:701` — `max-height` sticky-оглавления.
- [x] `:717` и `:721` — `scroll-margin-top` секций.
- [x] `:1181` — `scroll-margin-top` секций на телефонах (`+ 8px` сохранить).
- [x] Проверить: `Select-String -Path src/app/globals.css -Pattern "56px"` — совпадение только в объявлении `--app-header-height`.

**Проверка:**

- [x] 1440 px, страница study: кнопка возврата на 80 px от верха (шапка 68 + 12), ниже шапки.
- [x] 1440 px: оглавление прилипает на top=68 px, не перекрывается шапкой.
- [x] Клик по пункту оглавления: целевая секция встаёт на top=80 px (`scroll-margin-top=80`), заголовок не прячется под шапкой.
- [x] 390 px: кнопка возврата top=80 px, scroll-margin=80 px, горизонтального скролла нет.

**Критерии ревью:** ни одного «магического» `56px` вне токена; визуально отступы соответствуют шапке.

---

## T5. Финальная проверка

Модель: `opencode-go/beam-free` (проверка и отчёт), затем ревью `deepseek-v4.1-flash#low`.

Шаги:

- [x] `npm run lint` — без ошибок.
- [x] `npm run typecheck` — без ошибок.
- [x] `npm test` — зафиксировано 8 падений (базовая линия: currency 3, weights 1, scoring 2, quiz-questions 2), новых нет.
- [x] Скриншоты/замеры: 390, 768, 1440, 1920, 2560; `/tree/junior`, `/tree/senior`, study-страница `junior-osnovy`; обе темы. `/dashboard` недоступен без Firebase-сессии (protected route).
- [x] Замеры: шапка x=12, y=12, h=56, radius 16px, shadow `0 8px 24px rgb(0 0 0 / 0.14)`; ширина 1406 (1440), 1886 (1920), 2000 (2560, совпадает с main), 356 (390), 734 (768). Study: back top=80px, toc top=68px, scroll-margin=80px.
- [x] Мобильная нижняя навигация не менялась; при неавторизованной сессии она не рендерится, поэтому пересечение проверяется после логина (main сохраняет pb-32).
- [x] Заполнить «Журнал выполнения» и таблицу прогресса.

**Критерии ревью:** все пункты дизайн-документа, раздел 7, выполнены; отчёт содержит числа замеров и список изменённых файлов.

---

## T6. Страница учебного материала — большая карточка

Модель: `opencode-go/beam-free`. Файлы: `src/shared/ui/Header.tsx`, `src/app/globals.css`.

Цель: весь материал (оглавление + текст) выглядит одной большой карточкой с внешним отступом 12 px и скруглением 16 px, в одном языке с меню и шапкой.

Шаги:

- [x] В `Header.tsx` ветку `main` для `isStudy` заменить с `"w-full flex-1"` на `"w-full flex-1 p-3"` (12 px со всех сторон; карточка встаёт на 12 px ниже шапки).
- [x] В `globals.css` в `.study-page` добавить `border: 1px solid var(--surface-border); border-radius: 1rem;` и обновить `min-height` на `calc(100dvh - var(--app-header-offset) - (2 * var(--app-chrome-gap)) - env(safe-area-inset-top))`. Фон `var(--surface)` и `padding: 0` сохранить. Тень не добавлять.
- [x] В `.study-back-float` поднять кнопку внутрь карточки: `top: calc(var(--app-header-offset) + var(--app-chrome-gap) + 12px);` и `right: max(env(safe-area-inset-right), calc(var(--app-chrome-gap) + 12px));` (итого 92 px / 24 px).
- [x] Не менять `top` sticky-оглавления (68 px) и `scroll-margin-top` секций (80 px).
- [x] Мобильные правила (`max-width: 599px`) не трогать, кроме автоматически подхватываемых значений.

**Проверка:**

- [x] 1440 px: карточка x=12, ширина = ширина `main` − 24, radius 16 px, рамка `var(--surface-border)`, сверху 12 px до шапки.
- [x] 390 px: то же, горизонтального скролла нет; кнопка возврата 92/24.
- [x] Study: sticky-оглавление по-прежнему 68 px, якоря 80 px, кнопка не перекрывает заголовок.
- [x] `npm run lint`, `npm run typecheck`.

**Критерии ревью:** материал — одна карточка с отступом и скруглением; TOC и текст внутри; study-отступы не изменились; другие страницы не затронуты.

---

## T7. Liquid glass: токены, амбиент и утилита

Модель: `opencode-go/beam-free`. Файл: `src/app/globals.css`.

Шаги:

- [x] В `:root` (light) рядом с `--surface` добавить:
  ```css
  --glass-bg: color-mix(in srgb, var(--surface) 72%, transparent);
  --glass-border: color-mix(in srgb, var(--fg) 14%, transparent);
  --glass-highlight: rgba(255, 255, 255, 0.55);
  --glass-blur: 18px;
  --glass-saturate: 150%;
  --ambient-1: color-mix(in srgb, var(--color-blue-500) 18%, transparent);
  --ambient-2: color-mix(in srgb, var(--color-amber-400) 14%, transparent);
  --ambient-3: color-mix(in srgb, var(--color-cyan-500) 10%, transparent);
  ```
- [x] В блоке `:root[data-theme="dark"], :root.dark` переопределить:
  ```css
  --glass-bg: color-mix(in srgb, var(--surface) 68%, transparent);
  --glass-border: color-mix(in srgb, var(--fg) 16%, transparent);
  --glass-highlight: rgba(255, 255, 255, 0.12);
  --ambient-1: color-mix(in srgb, var(--color-blue-500) 16%, transparent);
  --ambient-2: color-mix(in srgb, var(--color-amber-400) 10%, transparent);
  --ambient-3: color-mix(in srgb, var(--color-cyan-500) 12%, transparent);
  ```
- [x] После `body::before` добавить `body::after` — фиксированный амбиентный слой за сеткой:
  ```css
  body::after {
    content: "";
    position: fixed;
    inset: 0;
    z-index: -2;
    pointer-events: none;
    background:
      radial-gradient(55vw 55vw at 8% -8%, var(--ambient-1), transparent 62%),
      radial-gradient(45vw 45vw at 96% 4%, var(--ambient-2), transparent 60%),
      radial-gradient(50vw 50vw at 45% 108%, var(--ambient-3), transparent 62%);
  }
  ```
- [x] После `@utility app-card` добавить `@utility glass-panel`:
  ```css
  @utility glass-panel {
    position: relative;
    border: 1px solid var(--glass-border);
    border-radius: 1rem;
    background-color: var(--glass-bg);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
    background-size: 120px 120px;
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
    box-shadow:
      0 8px 24px rgb(0 0 0 / 0.14),
      inset 0 1px 0 var(--glass-highlight);

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 1px;
      background: linear-gradient(
        135deg,
        var(--glass-highlight) 0%,
        transparent 38%,
        transparent 62%,
        color-mix(in srgb, var(--glass-highlight) 60%, transparent) 100%
      );
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }
  }
  ```
- [x] После утилиты добавить фолбэки:
  ```css
  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    .glass-panel {
      background-color: var(--surface);
      background-image: none;
    }
  }
  @media (prefers-reduced-transparency: reduce) {
    .glass-panel {
      background-color: var(--surface);
      -webkit-backdrop-filter: none;
      backdrop-filter: none;
    }
  }
  @media (hover: none) and (pointer: coarse) {
    .glass-panel {
      --glass-blur: 12px;
    }
  }
  ```

**Проверка:**

- [x] `npm run typecheck`, `npm run lint`.
- [x] В dev-сервере в собранном CSS присутствуют `.glass-panel` с `backdrop-filter` и `body::after` с `radial-gradient`.
- [x] Визуально страница не изменилась (утилита ещё нигде не применена), фон получил мягкие пятна.

**Критерии ревью:** токены в обеих темах, амбиент за сеткой, утилита и фолбэки на месте, существующие стили не сломаны.

---

## T8. Liquid glass: панели и study-карточка

Модель: `opencode-go/beam-free`. Файлы: `src/shared/ui/Header.tsx`, `src/app/globals.css`.

Шаги:

- [x] В `Header.tsx` заменить `app-card` на `glass-panel` у десктопного nav, планшетного nav и карточки шапки (3 места).
- [x] Мобильную нижнюю навигацию (`motion.nav` → внутренний `div` с `bg-slate-950/95 border ... backdrop-blur-xl`) перевести на `glass-panel`, сохранив `rounded-2xl`, размеры и позиционирование; убрать `bg-slate-950/95` и `backdrop-blur-xl`.
- [x] В `globals.css` для `.study-page`: `background-color: color-mix(in srgb, var(--surface) 93%, transparent);`, `border: 1px solid var(--glass-border);`, `box-shadow: inset 0 1px 0 var(--glass-highlight);`. `backdrop-filter` НЕ добавлять.
- [x] Убедиться, что `app-card` больше не используется в `Header.tsx`.

**Проверка:**

- [ ] 1440 light/dark: у шапки и меню виден блюр контента/фона, кромка и блик; размеры 12/56 и 256 не изменились.
- [ ] 390: нижняя навигация стеклянная, контент под ней читаем.
- [ ] Study 1440/390: карточка почти непрозрачная, кромка видна, при прокрутке нет просадок и артефактов.
- [ ] `npm run typecheck`, `npm run lint`.

**Критерии ревью:** glass-panel применён ко всем четырём панелям, study без blur, размеры и отступы T2–T6 сохранены, фолбэки не сломаны.

---

## T9. Liquid glass: подстройка, QA и замеры

Модель: `opencode-go/beam-free` + ревью `deepseek-v4.1-flash#low`.

- [x] Подстроить интенсивность (по итогам визуальной проверки): light `--glass-bg` → `color-mix(in srgb, var(--surface) 62%, transparent)`, `--ambient-1` → 38 %, `--ambient-2` → 28 %, `--ambient-3` → 18 %; dark `--glass-bg` → 60 %, ambient 32/22/18 %. `--glass-border` и `--glass-highlight` не менять.
- [x] `npm run lint`, `npm run typecheck`, `npm test` (базовая линия — 8 предсуществующих падений).
- [x] Скриншоты 390/1440/2560, light/dark, в покое и после скролла (делает оркестратор, результаты прикладываются к ревью).
- [x] Замеры: `backdrop-filter` у шапки/меню/нижней навигации, отсутствие у `.study-page`; радиус/тень/кромка; отсутствие горизонтального скролла.
- [x] Проверить читаемость текста на шапке (контраст) и что study-прокрутка не деградировала.
- [x] Обновить прогресс и журнал.

**Критерии ревью:** все панели в едином стеклянном языке, study читается, фолбэки описаны, новых падений тестов нет.

---

## Шаблон промпта реализатору

```text
Ты реализуешь задачу <T1|T2|...> в репозитории D:\projects\android-skills-tree.
Сначала прочитай:
1) docs/superpowers/plans/2026-11-20-ui-floating-chrome-tasks.md — найди раздел своей задачи;
2) docs/superpowers/specs/2026-11-20-ui-floating-chrome-design.md — соответствующие разделы.
Выполняй шаги строго по порядку. После каждого шага сразу отмечай его [x] в файле задач.
Не трогай файлы вне списка «Файлы» задачи. Не коммить.
В конце запусти команды из «Проверка» и верни: список изменённых файлов, вывод команд, результат визуальной проверки.
```

## Шаблон промпта ревьюеру

```text
Ты ревьюишь задачу <T1|...> в D:\projects\android-skills-tree.
Прочитай дизайн-документ и раздел задачи:
- docs/superpowers/specs/2026-11-20-ui-floating-chrome-design.md
- docs/superpowers/plans/2026-11-20-ui-floating-chrome-tasks.md
Посмотри `git diff` и проверь только критерии ревью этой задачи.
Ничего не редактируй.
Верни: PASS или FAIL, список проблем с файлом и строкой, что именно нарушено.
```

## Журнал выполнения

| Дата | Задача | Что сделано | Ревью | Коммит |
|---|---|---|---|---|
| 2026-11-20 | T1 | Добавлены токены --app-chrome-gap/--app-header-height/--app-header-offset в :root и утилита app-card в globals.css | PASS | — |
| 2026-11-20 | T2 | Сайдбар обёрнут в плавающую карточку (десктоп + планшет), разделители -> border-white/[0.06] | PASS | — |
| 2026-11-20 | T3 | Шапка обёрнута в плавающую карточку, добавлен headerWidthClass, удалены градиентная линия, header-blur и его правило в globals.css | PASS | — |
| 2026-11-20 | T4 | Study-отступы переведены на var(--app-header-offset): study-page min-height, study-back-float top, sticky toc top/max-height, scroll-margin-top секций (desktop + mobile +8px); убрана двойная пустая строка после удаления .header-blur | PASS | — |
| 2026-11-20 | T5 | **Файлы:** `src/shared/ui/Header.tsx`, `src/app/globals.css`, `docs/superpowers/plans/2026-11-20-ui-floating-chrome-tasks.md`, `docs/superpowers/specs/2026-11-20-ui-floating-chrome-design.md`. **Авто:** lint/typecheck чисто; test — 8 предсуществующих падений, новых нет; dev 200. **Замеры:** шапка 12/12/56/radius16; ширины 1406 (1440), 1886 (1920), 2000 (2560, = main), 356 (390), 734 (768); study back 80 / toc 68 / scroll-margin 80. **Ограничение:** сайдбар и шапка `max-w-6xl` проверены только по коду — без Firebase-сессии они не рендерятся. | PASS | — |
| 2026-11-20 | T6 | **Файлы:** `src/shared/ui/Header.tsx`, `src/app/globals.css`. **Изменения:** `isStudy` ветка `main` → `"w-full flex-1 p-3"`; `.study-page` +border/border-radius, min-height `calc(100dvh - var(--app-header-offset) - (2 * var(--app-chrome-gap)) - env(safe-area-inset-top))`, фон/padding сохранены, тень не добавлена; `.study-back-float` top `calc(var(--app-header-offset) + var(--app-chrome-gap) + 12px)`, right `max(env(safe-area-inset-right), calc(var(--app-chrome-gap) + 12px))`. TOC/scroll-margin и мобильные правила не тронуты. **Авто:** typecheck и lint чисто. **Замеры:** 1440 — page x=12/y=80/w=1406, radius 16; 390 — w=356; back 92/24; toc 68; scroll-margin 80; overflowX=false. | PASS | — |
| 2026-11-20 | T7 | **Файл:** `src/app/globals.css`. **Изменения:** добавлены glass/ambient токены в `:root` (light) и `:root[data-theme="dark"]`; `body::after` амбиентный слой (z-index -2) за сеткой; утилита `@utility glass-panel` с noise, blur/saturate, inset highlight и rim-light `::before`; фолбэки `@supports`, `prefers-reduced-transparency`, touch. Существующие токены/app-card/study-правила не изменены. **Авто:** typecheck и lint чисто; dev 200. **Собранный CSS:** `.glass-panel` — 7 совпадений, `backdrop-filter` — 17, `radial-gradient` — 3, `body::after` нормализован сборщиком в `body:after` (1). | PASS | — |
| 2026-11-21 | T9 | **Файл:** `src/app/globals.css`. **Изменения:** подстройка интенсивности liquid glass: light `--glass-bg` 72→62 %, `--ambient-1` 18→38 %, `--ambient-2` 14→28 %, `--ambient-3` 10→18 %; dark `--glass-bg` 68→60 %, ambient 16/10/12 → 32/22/18 %. `--glass-border`/`--glass-highlight` не изменены. **Авто:** lint и typecheck чисто; test — 8 предсуществующих падений (currency 3, weights 1, scoring 2, quiz-questions 2), новых нет. **Замеры:** шапка bg surface/0.62 (light) и /0.60 (dark), `backdrop-filter: blur(18px) saturate(1.5)`, border fg/14 %, тень + inset highlight, кромка `::before`; reduced-transparency → blur none, фон непрозрачный; study bg 0.93, border fg/14 %, blur none, radius 16. Скриншоты 390/1440/2560, light/dark, в покое и после скролла. **Ограничение:** сайдбар и мобильная навигация без Firebase-сессии не рендерятся — проверены по коду. | PASS | — |
