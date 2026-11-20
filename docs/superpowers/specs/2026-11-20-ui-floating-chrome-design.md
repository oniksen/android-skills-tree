# Дизайн: плавающие панели навигации и шапки

- Дата: 2026-11-20
- Статус: на согласование
- Документ: `docs/superpowers/specs/2026-11-20-ui-floating-chrome-design.md`
- Связанный список задач: `docs/superpowers/plans/2026-11-20-ui-floating-chrome-tasks.md`

## 1. Задача

Перевести левое меню и верхнюю шапку приложения на «плавающие карточки»:

- панели не примыкают к краям окна — отступ 12 px;
- скругление 16 px, тонкая рамка, мягкая тень, фон `var(--surface)`;
- визуальный язык — как у кнопки «Вернуться к дереву» (`study-back-float`) и как у панелей современного Telegram Web;
- на мобильных шапка тоже становится карточкой, нижняя навигация уже сделана карточкой и остаётся без изменений.

## 2. Границы

**Делаем:**

- общий токен карточки `app-card` в `globals.css`;
- плавающий сайдбар (десктоп ≥ 840 px) и планшетный рельс (600–839 px);
- плавающую шапку на всех ширинах, ширина выровнена по контенту страницы;
- общий токен отступа шапки и перевод study-страниц на него;
- проверку обеих тем и всех ключевых ширин.

**Не делаем:**

- не меняем состав и порядок пунктов меню, роутинг, права доступа;
- не меняем цветовую схему, шрифты, содержимое страниц;
- не трогаем `study-back-float` визуально (он — эталон, а не объект правки);
- не меняем мобильную нижнюю навигацию;
- не трогаем данные, Firestore, study-материалы и сгенерированный реестр.

**Anti-goals (считаем провалом):**

- контент уезжает под шапку или обрезается;
- теряется доступ к пунктам меню на низких экранах;
- study-оглавление и якоря перестают учитывать высоту шапки;
- шапка и меню выглядят как «полоски», а не карточки;
- меняется вертикальный ритм страниц сильнее, чем на 12 px.

## 3. Текущее состояние

`src/shared/ui/Header.tsx`:

- корень — `flex min-h-dvh` (`:215`);
- десктопное меню — `sticky top-0 self-start h-dvh w-64 border-r bg-slate-950/90 backdrop-blur-xl` (`:218`);
- планшетный рельс — аналогичный, `w-max`, `border-r` (`:245`);
- шапка — `sticky top-0 border-b bg-slate-950/90` с внутренним `h-14` и градиентной линией внизу (`:260`, `:295`);
- шапка живёт внутри правой колонки (`div.flex.min-h-dvh.flex-1`, `:258`), поэтому её ширина = ширина контента минус сайдбар;
- мобильная нижняя навигация — уже плавающая карточка `rounded-2xl` (`:312–333`).

`src/app/globals.css`:

- `.study-back-float` (`:498`) — эталон: `border: 1px solid var(--surface-border)`, `background: var(--surface)`, `box-shadow: 0 8px 24px rgb(0 0 0 / 0.14)`, hover — акцентный цвет;
- высота шапки зашита как `56px` в 6 местах: `:487`, `:500`, `:700`, `:701`, `:717`, `:721`, `:1181`;
- токены темы: `--bg`, `--surface`, `--surface-border` (`:253–329`).

Следствие: любое изменение высоты шапки (12 px внешнего отступа) обязано пройти через один токен, иначе поедут sticky-оглавление study, `scroll-margin-top` якорей и кнопка возврата.

## 4. Визуальные решения

| Параметр | Значение |
|---|---|
| Отступ от края окна | 12 px |
| Радиус панелей | 16 px (`rounded-2xl`) |
| Фон панели | `var(--surface)` (как у `study-back-float`) |
| Рамка | `1px solid var(--surface-border)` |
| Тень | `0 8px 24px rgb(0 0 0 / 0.14)` |
| Внутренние разделители | `border-white/[0.06]` |
| Ширина сайдбара | карточка 256 px, колонка 280 px (12 + 256 + 12) |
| Высота шапки | 56 px + 12 px сверху |
| Blur | не нужен: карточки непрозрачные |

Активные пункты меню, бейджи и иконки не меняются. `rounded-md` у активного пункта можно поднять до `rounded-lg`, но это необязательно (см. спорные вопросы).

## 5. Изменения по файлам

### 5.1 `src/app/globals.css`

1. В `:root` внутри `@layer base` (рядом с `--bg`, `--surface`, `:254–267`) добавить:

```css
--app-chrome-gap: 12px;
--app-header-height: 56px;
--app-header-offset: calc(var(--app-header-height) + var(--app-chrome-gap));
```

2. После `@utility card-surface` (`:396`) добавить:

```css
@utility app-card {
  border: 1px solid var(--surface-border);
  border-radius: 1rem;
  background: var(--surface);
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.14);
}
```

3. После того как шапка станет карточкой (задача T3), заменить `56px` в study-стилях:

| Строка | Было | Стало |
|---|---|---|
| 487 | `calc(100dvh - 56px - env(safe-area-inset-top))` | `calc(100dvh - var(--app-header-offset) - env(safe-area-inset-top))` |
| 500 | `calc(56px + env(safe-area-inset-top) + 12px)` | `calc(var(--app-header-offset) + env(safe-area-inset-top) + 12px)` |
| 700 | `calc(56px + env(safe-area-inset-top))` | `calc(var(--app-header-offset) + env(safe-area-inset-top))` |
| 701 | `calc(100dvh - 56px - env(safe-area-inset-top))` | `calc(100dvh - var(--app-header-offset) - env(safe-area-inset-top))` |
| 717 | `calc(56px + env(safe-area-inset-top) + 12px)` | `calc(var(--app-header-offset) + env(safe-area-inset-top) + 12px)` |
| 721 | `calc(56px + env(safe-area-inset-top) + 12px)` | `calc(var(--app-header-offset) + env(safe-area-inset-top) + 12px)` |
| 1181 | `calc(56px + env(safe-area-inset-top) + 8px)` | `calc(var(--app-header-offset) + env(safe-area-inset-top) + 8px)` |

4. Удалить неиспользуемое правило `.header-blur` (`:456–461`), если класс убран из `Header.tsx`.

### 5.2 `src/shared/ui/Header.tsx` — сайдбар (≥ 840 px)

Было (`:217–240`): `<nav className="hidden nav-lg:flex sticky top-0 self-start h-dvh z-40 w-64 ... border-r ...">`.
Стало:

```tsx
<nav
  aria-label="Основная навигация"
  className="hidden nav-lg:flex sticky top-0 z-40 h-dvh w-[17.5rem] shrink-0 px-3 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3"
>
  <div className="app-card flex h-full w-full flex-col overflow-hidden">
    {/* без изменений: бренд h-14, список пунктов, футер статуса */}
  </div>
</nav>
```

Внутренние разделители бренда и футера: `border-slate-700/70` → `border-white/[0.06]`.

### 5.3 `src/shared/ui/Header.tsx` — планшетный рельс (600–839 px)

```tsx
<nav
  aria-label="Основная навигация"
  className="hidden nav-md:flex nav-lg:hidden sticky top-0 z-40 h-dvh w-max shrink-0 p-3"
>
  <div className="app-card flex h-full flex-col items-stretch gap-1 overflow-y-auto px-3 py-4">
    {/* пункты меню без изменений */}
  </div>
</nav>
```

### 5.4 `src/shared/ui/Header.tsx` — шапка

Добавить рядом с `isTree` (`:209`):

```tsx
const headerWidthClass = isQuiz || isStudy ? "max-w-none" : isTree ? "max-w-[2000px]" : "max-w-6xl";
```

Было (`:260–296`): `sticky`-полоса с `border-b` и градиентной линией.
Стало:

```tsx
<header className="sticky top-0 z-50 px-3 pt-[max(env(safe-area-inset-top),0.75rem)]">
  <div
    className={`app-card mx-auto flex h-14 w-full items-center justify-between gap-4 px-4 ${headerWidthClass}`}
  >
    {/* существующий контент: бренд, Prompt, бейджи, login */}
  </div>
</header>
```

Градиентную линию (`:295`) удалить. `header-blur` больше не используется.

### 5.5 Мобильные (< 600 px)

- шапка — та же карточка с inset 12 px;
- нижняя навигация не меняется (`:312–333`), проверить только отсутствие пересечения с контентом.

### 5.6 Чего не касаемся

- `mainClassName` и ширина `main` (`:298–307`) остаются как есть;
- `LevelTabs`, `TreeToolbar` и страницы Tree — без правок.

## 6. Спорные вопросы и варианты

| # | Вопрос | Варианты | Рекомендация |
|---|---|---|---|
| 1 | Имя ветки | `feat/ui-refinements`; `feat/ui-polish`; переименовать `main` | `feat/ui-refinements` от `main`. Переименовывать `main` нельзя: он отслеживает `origin/main`, от него работает semantic-release |
| 2 | Ширина шапки | по max-width контента; на всё окно; фиксированные 2000 px | по контенту: `6xl` / `2000px` для `/tree` / `none` для study и quiz |
| 3 | Радиус | 12 px (классический Telegram); 16 px; 20 px; pill | 16 px |
| 4 | Фон панелей | `var(--surface)`; `var(--bg)` + blur (как сейчас) | `var(--surface)`: совпадает с эталонной кнопкой, нет «просвечивания» контента |
| 5 | Градиентная линия под шапкой | убрать; оставить внутри карточки | убрать: ломает силуэт карточки |
| 6 | Тень | `0 8px 24px rgb(0 0 0 / 0.14)`; без тени; сильнее | как у кнопки «Вернуться к дереву» |
| 7 | Мобильная шапка | карточка с inset 12 px; оставить full-bleed | карточка: один язык на всех ширинах |
| 8 | Активный пункт меню | оставить `rounded-md`; поднять до `rounded-lg` | оставить: не входит в задачу |

## 7. Критерии приёмки

1. Десктоп 1440: меню — карточка 256 px, отступы 12 px со всех сторон; шапка — карточка 1152 px по центру, высота 56 px, отступ сверху 12 px.
2. `/tree/junior` на 1920: шапка 2000 px, выровнена с `main`; на 2560 — то же.
3. При скролле карточка шапки остаётся сверху, контент уходит под неё, зазора-«дыры» нет.
4. Study-страница: кнопка «Вернуться к дереву» на 12 px ниже шапки; sticky-оглавление не перекрывается; переход по якорю не прячет заголовок под шапкой.
5. Мобильные 390 и 768: шапка — карточка, нижняя навигация не пересекается с контентом, горизонтального скролла нет.
6. Обе темы (light/dark): фон, рамка, тень читаемы.
7. `npm run lint`, `npm run typecheck` — чисто; `npm test` — те же 8 предсуществующих падений в `currency`/`weights`/`scoring`/`quiz-questions`, новых нет.

## 8. Риски

- `sticky` + `z-index`: шапка `z-50` должна перекрывать сайдбар `z-40`; проверить модалки и тосты.
- Высокие страницы: карточка меню `h-dvh` может обрезать футер — список пунктов скроллится внутри.
- Study-отступы: забытая замена `56px` даёт наложение на 12 px.
- Выравнивание шапки и `main` на `/tree` зависит от одинаковых `max-w`; менять их нужно вместе.
- Тень на светлой теме может выглядеть грязно — проверить light.

## 9. Процесс выполнения

- Ветка: `feat/ui-refinements` от `main` (создаёт оркестратор до первой задачи).
- Реализация: sub-агент на модели `opencode-go/beam-free`.
- Ревью между задачами: sub-агент на модели `opencode-go/deepseek-v4.1-flash#low`, только чтение и вердикт, без правок.
- Каждый шаг задачи отмечается `[x]` сразу после выполнения в файле задач.
- Коммиты — conventional (`feat:` / `fix:`), без тегов и версий.
- При провале ревью правки вносит тот же реализатор (через `sessionID`), затем повторное ревью.

## 10. Проверка

```powershell
npm run lint
npm run typecheck
npm test
```

Визуальная матрица: `/dashboard`, `/tree/junior`, `/achievements`, study-страница скилла — ширины 390, 768, 1440, 2560; обе темы. Замеры через headless Chrome: координаты и размеры карточек меню и шапки.

## 11. Liquid glass (расширение, 2026-11-21)

Пункт 4 раздела 4 в части «фон панелей = `var(--surface)`» заменяется на стеклянный материал.

**Решения:**

- фон панелей — полупрозрачный `--glass-bg` с `backdrop-filter: blur(18px) saturate(150%)`;
- свет: `--glass-bg` = surface 62 %, ambient 38/28/18 % (coral/amber/cyan); тьма: 60 %, ambient 32/22/18 %;
- кромка — 1px `--glass-border`, верхний внутренний блик `--glass-highlight`, градиентное кольцо `::before`, шум 120×120 SVG при 5 %;
- амбиентный слой `body::after` (`z-index: -2`) под сеткой — без него стекло не читается на однотонном фоне;
- `glass-panel` применяется к шапке, десктопному меню, планшетному рельсу и мобильной нижней навигации;
- study-карточка: 93 % surface, без `backdrop-filter` (высота материала ~142 000 px — blur на таком слое недопустим), кромка и блик те же;
- фолбэки: без `backdrop-filter` → непрозрачный `--surface`; `prefers-reduced-transparency` → без blur; touch → blur 12 px;
- реальное преломление (AGSL-подобное) в CSS недоступно; шейдерный слой WebGL2 вынесен в отдельный возможный этап, в текущей итерации не используется.

**Проверка:** замеры `backdrop-filter`, `prefers-reduced-transparency` (эмуляция Chrome), отсутствие blur у study, скриншоты 390/1440/2560 в обеих темах.
