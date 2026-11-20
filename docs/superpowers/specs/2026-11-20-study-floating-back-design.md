# Плавающая кнопка «Назад к дереву» на странице учебного материала

Дата: 2026-11-20
Ветка: `feat/study-floating-back` (создаётся командой `npm run new:feat -- study-floating-back`)
Итоговый путь в репозитории: `docs/superpowers/specs/2026-11-20-study-floating-back-design.md`

## 1. Задача

Страница учебного материала (`/tree/[slug]/category/[categoryId]/study` и
`/tree/[slug]/skill/[skillId]/study`) сейчас показывает обычную ссылку
«← Назад к дереву» в строке над статьёй. При прокрутке она уезжает вверх, и вернуться
к дереву можно только через меню приложения.

Нужно: единственная кнопка возврата, которая **всегда** доступна в правом верхнем углу
вьюпорта. В покое — крестик в круглой карточке; при наведении (и фокусе с клавиатуры)
карточка раскрывается в пилюлю с текущей подписью. Клик ведёт на `backHref`.

## 2. Поведение (единственный источник правды)

| Состояние | Вид |
|---|---|
| Покой, мышь/клавиатура | Круг 44×44, крестик 18×18, фон `--surface`, рамка `--surface-border`, тень |
| Наведение курсора | Пружинно раскрывается вправо: крестик + подпись (`backLabel`) |
| Фокус с клавиатуры (`:focus-visible`) | То же раскрытие + голубое кольцо фокуса |
| Тач-устройство (`@media (hover: none)`) | Всегда круг 44×44, подпись скрыта; тап сразу ведёт на `backHref` |
| Нажатие (мышь) | Лёгкое сжатие `scale(0.96)` через CSS `:active` |
| `prefers-reduced-motion: reduce` | Раскрытие/сжатие без анимации |
| Печать | Кнопка скрыта |
| Загрузка (`loading.tsx`) | На том же месте круглый скелетон-заглушка, не ссылка |

Геометрия:

- `position: fixed`, `top: calc(56px + env(safe-area-inset-top) + 12px)` (шапка приложения — 56 px, sticky, `z-50`).
- `right: max(env(safe-area-inset-right), 16px)`, `z-index: 40` (ниже шапки, выше контента).
- Кнопка не двигается при скролле; контент проходит под ней.
- На странице появляется **сверху отступ 56 px**, чтобы на первом экране герой не начинался под кнопкой.
  Это заменяет высоту удаляемого топбара.

Подпись — ровно `backLabel` (в обоих маршрутах уже передаётся `"Назад к дереву"`),
без отдельного текста в компоненте. `title` не добавляем: раскрытие и есть подсказка.

## 3. Рассмотренные подходы

1. **CSS-only на `<Link>`**: `:hover` + `:focus-visible` + `max-width` transition. Дёшево и без JS,
   но ширина раскрытия фиксированная, анимация линейная, и «красивых» пружин нет.
2. **Клиентский компонент на `motion` (выбран)**: состояние `hovered/focused`, `motion.span`
   с пружиной, `useReducedMotion()`. Больше кода и клиентского JS, зато точная пружинная
   анимация, управляемое раскрытие и место для будущих штрихов.
3. **Sticky-полоса с прежней ссылкой**: не перекрывает первую строку, но занимает полосу
   на всю ширину и не даёт кнопку в углу — не соответствует задаче.

Выбран вариант 2, потому что нужны выразительные анимации.

## 4. Изменения по файлам

### 4.1 Новый файл `src/features/study/components/StudyBackButton.tsx`

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { blockClass } from "../model/study-blocks";

const FLOAT = blockClass("backFloat");
const LABEL = blockClass("backFloatLabel");

const SPRING = { type: "spring", stiffness: 420, damping: 32, mass: 0.7 } as const;

export default function StudyBackButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduced = useReducedMotion();
  const open = hovered || focused;

  return (
    <Link
      href={href}
      aria-label={label}
      className={FLOAT}
      onPointerEnter={(event) => {
        // Наведение имеет смысл только для мыши/пера; на тач подпись скрыта CSS.
        if (event.pointerType !== "touch") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <X className="h-[18px] w-[18px] shrink-0" aria-hidden />
      <motion.span
        className={LABEL}
        initial={false}
        animate={{
          width: open ? "auto" : 0,
          opacity: open ? 1 : 0,
          marginLeft: open ? 8 : 0,
        }}
        transition={reduced ? { duration: 0 } : SPRING}
      >
        {label}
      </motion.span>
    </Link>
  );
}
```

Важно:

- `initial={false}` — на сервере кнопка сразу в свёрнутом виде, без вспышки и без
  анимации появления. Входной анимации при монтировании **нет**: кнопка должна быть
  видна и кликабельна до гидратации.
- `width: "auto"` — Motion сам измеряет ширину подписи и анимирует к ней.
- `aria-label` на ссылке + `aria-hidden` на крестике. Видимый текст дублирует `aria-label`,
  это нормально: скринридер прочитает одно имя.
- Компонент клиентский только из-за состояния наведения; данные не грузит.

### 4.2 `src/features/study/components/StudyMaterialPage.tsx`

Убрать топбар и `ArrowLeft`, поставить кнопку:

```tsx
import { blockClass } from "../model/study-blocks";
import StudyBackButton from "./StudyBackButton";

export default function StudyMaterialPage({
  backHref,
  backLabel = "Назад",
  children,
}: {
  backHref: string;
  backLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={blockClass("page")}>
      <StudyBackButton href={backHref} label={backLabel} />
      <article className={blockClass("article")}>{children}</article>
    </div>
  );
}
```

Никаких других ссылок «Назад» на странице быть не должно.

### 4.3 `src/features/study/model/study-blocks.ts`

Удалить `topbar` и `back` из `STUDY_BLOCK` и `STUDY_BLOCK_MAP`.
Добавить:

```ts
backFloat: "study-back-float",
backFloatLabel: "study-back-float-label",
```

```ts
backFloat: { tags: ["a"], className: STUDY_BLOCK.backFloat, layout: "block" },
backFloatLabel: {
  tags: ["span"],
  className: STUDY_BLOCK.backFloatLabel,
  layout: "inline",
},
```

Теги обязаны совпадать с реальным DOM: `Link` рендерит `<a>`, `motion.span` — `<span>`.
`study-blocks.test.ts` падает, если класс из CSS не объявлен в реестре или наоборот.

### 4.4 `src/app/globals.css`

Удалить целиком:

- `.study-topbar` (строки ~485–489);
- `.study-back`, `.study-back:hover`, `.study-back:focus-visible` (~491–509);
- `.study-topbar` внутри `@media (max-width: 599px)` (~1105–1107).

В `.study-page` заменить `padding: 0;` на `padding: 56px 0 0;`. В мобильной медиа-секции
у `.study-page` убрать `padding: 0;` (или заменить на `padding: 56px 0 0;`), чтобы отступ
не сбрасывался на телефоне.

Добавить новый блок (рядом с правилами страницы, до `/* Hero */`):

```css
/* Floating back control -------------------------------------------------- */

.study-back-float {
  position: fixed;
  top: calc(56px + env(safe-area-inset-top) + 12px);
  right: max(env(safe-area-inset-right), 16px);
  z-index: 40;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  min-width: 44px;
  padding: 0 13px;
  overflow: hidden;
  border: 1px solid var(--surface-border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--color-slate-500);
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.14);
  text-decoration: none;
  transition: color 0.15s ease, transform 0.12s ease, box-shadow 0.15s ease;
}

.study-back-float:hover,
.study-back-float:focus-visible {
  color: var(--study-accent-text);
  box-shadow: 0 10px 28px rgb(0 0 0 / 0.18);
}

.study-back-float:active {
  transform: scale(0.96);
}

.study-back-float:focus-visible {
  outline: 2px solid var(--color-blue-600);
  outline-offset: 3px;
}

.study-back-float-label {
  display: inline-block;
  overflow: hidden;
  max-width: calc(100vw - 96px);
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
}

@media (hover: none) {
  .study-back-float-label {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .study-back-float {
    transition: none;
  }
}

@media print {
  .study-back-float {
    display: none;
  }
}
```

`--surface`, `--surface-border`, `--color-slate-500`, `--study-accent-text`,
`--color-blue-600` уже объявлены в `:root` и в тёмной теме — новых переменных не заводить.

### 4.5 `src/shared/ui/skeletons/StudySkeleton.tsx`

Заменить блок топбара:

```tsx
<div className={blockClass("topbar")}>
  <Skeleton className="h-4 w-32" />
</div>
```

на декоративную заглушку в том же фиксированном месте:

```tsx
<div className={blockClass("backFloat")} aria-hidden>
  <Skeleton className="h-[18px] w-[18px] rounded-full" />
</div>
```

Это не ссылка и не интерактивный элемент: во время загрузки возврат недоступен,
но место не «прыгает». `aria-hidden` обязателен.

### 4.6 Тесты

1. Новый `src/features/study/components/study-back-button.test.tsx`:
   - `renderToStaticMarkup(<StudyBackButton href="/tree/junior" label="Назад к дереву" />)`
     содержит `href="/tree/junior"`, `aria-label="Назад к дереву"` и текст подписи;
   - в разметке есть класс кнопки и `<svg>` крестика с `aria-hidden`.

   Интерактивных тестов нет: в проекте нет jsdom/RTL, `vitest.config.mts` — `environment: "node"`.

2. `src/features/study/components/study-blocks-dom.test.tsx`: обновить комментарий на строке ~71 —
   вместо `page`, `topbar`, `back`, `article` перечислить `page`, `backFloat`, `backFloatLabel`, `article`.
   Логику не менять: `backFloat`/`backFloatLabel` попадут в статическую разметку через
   `renderFixturePage()`, поэтому `uncoveredKinds` пройдёт.

3. `src/features/study/components/study-html-fixture.tsx` менять не нужно: он уже рендерит
   `StudyMaterialPage`, а значит новую кнопку.

4. Если `motion` в node-тестах неожиданно упадёт на SSR, не отключать тест: заменить
   `useReducedMotion()` на CSS-ветку `@media (prefers-reduced-motion: reduce)` и убрать хук.
   Это допустимое понижение, но только после фактической ошибки.

## 5. Порядок работ и ветка

```bash
git status                                  # должен быть чистым
npm run new:feat -- study-floating-back     # создаёт ветку и коммит "chore: start vX.Y.0"
```

Скрипт `scripts/start-work.mjs` сам: переключается на `main`, делает `git pull --ff-only`,
создаёт `feat/study-floating-back`, поднимает минорную версию в `package.json` и коммитит.
Если рабочее дерево грязное — сначала закоммитить/спрятать.

Затем на ветке:

1. Положить этот документ в `docs/superpowers/specs/2026-11-20-study-floating-back-design.md`.
2. Коммит: `docs: add floating back button design`.
3. Реализовать пункты 4.1–4.6.
4. Коммит: `feat(study): show persistent back button on study pages`.

Пушить ветку не обязательно; релизный цикл — отдельно (`npm run rc`), не запускать.

## 6. Проверка (обязательно перед «готово»)

```bash
npm run lint
npm run typecheck
npm test
```

Node: `npm test` требует `^22.22` или `>=24.8`; lint/typecheck работают с 20.9.

Ручной чек-лист:

- [ ] Оба study-маршрута показывают крестик справа сверху сразу, без вспышки.
- [ ] При скролле кнопка на месте, контент проходит под ней, шапка её не перекрывает.
- [ ] Наведение раскрывает «Назад к дереву» пружиной; уход курсора сворачивает.
- [ ] Tab фокусирует кнопку, кольцо видно, подпись раскрыта, Enter ведёт на `/tree/<slug>`.
- [ ] В DevTools с эмуляцией touch (или на телефоне) подписи нет, круг 44×44, тап ведёт назад.
- [ ] Светлая и тёмная темы: фон, рамка, тень, цвет крестика читаемы.
- [ ] Reduced motion: раскрытие мгновенное, без пружины.
- [ ] Первый экран не начинается под кнопкой (отступ 56 px работает).
- [ ] На странице нет старой ссылки `← Назад к дереву` и классов `study-topbar` / `study-back`.
- [ ] Скелетон загрузки показывает круглую заглушку на месте кнопки.

## 7. Границы

Не входит: изменение шапки, мобильного нижнего меню, навигации дерева, текстов подписи,
аналитики, сторибука. Не добавлять вторую кнопку «назад» и не менять `backHref`.
Не трогать `StudyToc`, `Header`, `proxy.ts`.

## 8. Решения, принятые без отдельного согласования

- Крестик не поворачивается и не меняется на стрелку: X симметричен, поворот ничего не даёт.
- Входной анимации при монтировании нет — иначе кнопка была бы невидима до гидратации.
- `title` не дублирует подпись.
- Подпись на тач-устройствах скрыта по `@media (hover: none)`, а не по JS: меньше кода,
  и SSR сразу отдаёт правильный вид.
- Тень и цвет крестика — на существующих переменных темы; новых токенов нет.
