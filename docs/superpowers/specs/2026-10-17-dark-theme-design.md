# Дизайн: тёмная тема, светлая тема и системный режим

Дата: 2026-10-17

## Цель

Добавить в приложение переключатель оформления с тремя режимами: **светлый**,
**тёмный** и **системный**. Текущий UI светлый, реализован через «вывернутую»
палитру Tailwind (`bg-slate-950` = кремовый `#faf9f5`, `text-white` = тёмный
`#1a1915`). Тёмная тема должна применяться без переписывания 36+ компонентов.

## Ключевое ограничение среды

- Tailwind CSS v4: цвета объявлены в `@theme` в `src/app/globals.css` и
  компилируются в CSS-переменные `--color-*`; утилиты ссылаются на
  `var(--color-*)`. Значит, переопределив переменные в скоупе
  `:root[data-theme="dark"]`, мы меняем вид всех существующих классов без правок
  в компонентах.
- `dark:`-варианты, `prefers-color-scheme` и какие-либо theme-провайдеры в проекте
  отсутствуют. `TextColor`/фон заданы и хардкодом в `globals.css` (body,
  скроллбар, `::selection`, сетка, `card-surface`, `term-panel`).
- Vitest настроен на окружение `node` и шаблон `src/**/*.test.ts` (без `tsx`,
  без jsdom). Поэтому автотестами покрываем только чистую логику и содержимое
  CSS; компоненты проверяем вручную в `npm run dev`.
- `src/app/app-icons.test.ts` и иконки приложения остаются без изменений.

## Архитектура

1. **CSS-переменные** — источник истины для обеих тем. Светлая тема живёт в
   `@theme` и `:root`; тёмная — в `:root[data-theme="dark"], :root.dark`,
   где переопределяются те же переменные.
2. **Разрешённая тема** всегда конкретна: CSS знает только
   `data-theme="light"` и `data-theme="dark"`. «Системный» — это JS-понятие:
   провайдер читает `matchMedia("(prefers-color-scheme: dark)")` и переводит его
   в `light`/`dark`.
3. **Предпочтение** (`light|dark|system`) хранится в `localStorage` под ключом
   `theme`, по умолчанию `system`.
4. **No-flash**: инлайн-скрипт в `<head>` до первой отрисовки выставляет
   `data-theme` и `color-scheme` на `<html>`.
5. **Переключатель**: иконка-кнопка в правой группе топ-бара `Header.tsx`,
   меню из трёх пунктов. Своя SVG-иконка кнопки + lucide `Sun/Moon/Monitor`
   в пунктах меню.

## 1. Палитра

### 1.1 Нейтральная шкала (тёмный скоуп)

Зеркалим светлую шкалу: page-фон становится тёмным (`slate-950`), основной текст
светлым (`white`).

| Переменная | Светлая (`@theme`) | Тёмная (override) |
|---|---|---|
| `--color-white` | `#1a1915` | `#f2f0e9` |
| `--color-slate-50` | `#141310` | `#faf9f5` |
| `--color-slate-100` | `#1f1e1a` | `#f2f0e9` |
| `--color-slate-200` | `#2e2d28` | `#e9e6dc` |
| `--color-slate-300` | `#4a4842` | `#dbd8cc` |
| `--color-slate-400` | `#6f6c64` | `#b0ac9f` |
| `--color-slate-500` | `#8f8b7e` | `#8f8b7e` |
| `--color-slate-600` | `#b9b5a8` | `#6f6c64` |
| `--color-slate-700` | `#dbd8cc` | `#3a3831` |
| `--color-slate-800` | `#e9e6dc` | `#2a2823` |
| `--color-slate-900` | `#f2f0e9` | `#201e1a` |
| `--color-slate-950` | `#faf9f5` | `#16140f` |

### 1.2 Акценты, используемые как текст

На тёмном фоне тёмные оттенки, служащие цветом текста/иконок, теряют контраст
(нужно ≥ 4.5:1). В тёмном скоупе переопределяются только те оттенки, что реально
используются (по данным `rg`):

| Переменная | Светлая | Тёмная |
|---|---|---|
| `--color-blue-300` | `#a34c2f` | `#f0c3b0` |
| `--color-blue-400` | `#b9552f` | `#dd8263` |
| `--color-blue-500` | `#d97757` | `#d97757` |
| `--color-blue-600` | `#c15f3c` | `#e08968` |
| `--color-emerald-400` | `#34774f` | `#7fc99f` |
| `--color-emerald-500` | `#3f8f5f` | `#5fb886` |
| `--color-emerald-600` | `#2f6b47` | `#6fbf8f` |
| `--color-green-400` | `#34774f` | `#7fc99f` |
| `--color-orange-400` | `#c26a2e` | `#e0995c` |
| `--color-orange-500` | `#a8551f` | `#dd8a4f` |
| `--color-orange-600` | (default) | `#e89a5c` |
| `--color-cyan-600` | (default) | `#4fb0b0` |
| `--color-cyan-500` | `#1f5f5f` | `#3f9d9d` |
| `--color-sky-300` | `#4a86a8` | `#7fb0cf` |
| `--color-amber-400` | `#a9761a` | `#e0b451` |
| `--color-amber-500` | `#8f6212` | `#e0b451` |
| `--color-amber-600` | `#7a530f` | `#d9a93f` |
| `--color-yellow-400` | `#b08a1f` | `#dcb455` |
| `--color-yellow-500` | `#96740f` | `#d9b23f` |
| `--color-purple-400` | `#8a4fa0` | `#bd8fd6` |
| `--color-red-300` | `#b4453b` | `#e58b80` |
| `--color-red-400` | `#a63a30` | `#e07a6e` |
| `--color-red-500` | `#8f2f27` | `#e07a6e` |

Оттенки, используемые только как фон/границы (`bg-*`, `border-*`,
`from/to/via-*`), сохраняют светлые значения — на тёмном фоне они читаются.

### 1.3 Семантические переменные для хардкода

Хардкод из `globals.css` заменяется на переменные, определённые в `:root` и
переопределённые в тёмном скоупе:

| Переменная | Светлая | Тёмная |
|---|---|---|
| `--bg` | `#faf9f5` | `#16140f` |
| `--fg` | `#1a1915` | `#f2f0e9` |
| `--surface` | `#fdfcf9` | `#1c1b17` |
| `--surface-border` | `rgba(26,25,21,0.12)` | `rgba(242,240,233,0.10)` |
| `--panel-border` | `rgba(26,25,21,0.2)` | `rgba(242,240,233,0.18)` |
| `--grid-line` | `rgba(26,25,21,0.035)` | `rgba(242,240,233,0.04)` |
| `--scroll-track` | `#f0eee6` | `#201e1a` |
| `--scroll-thumb` | `#dbd8cc` | `#3a3831` |
| `--scroll-thumb-hover` | `#c9c5b6` | `#4a4842` |
| `--focus-ring` | `rgba(193,95,60,0.7)` | `rgba(224,138,104,0.8)` |
| `--selection-bg` | `rgba(217,119,87,0.28)` | `rgba(217,119,87,0.30)` |

`prompt`-утилита (`#c15f3c`) переводится на `var(--color-blue-600)`, чтобы
флипаться автоматически. `text-gradient`, `shine` остаются как есть (коралловый
градиент читается в обеих темах).

## 2. Модуль логики `src/lib/theme.ts`

Чистые функции и константы (без DOM, тестируются в node):

```ts
export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
export const DEFAULT_PREFERENCE: ThemePreference = "system";

export function isThemePreference(v: unknown): v is ThemePreference;
export function parseStoredTheme(raw: string | null): ThemePreference;
export function resolveTheme(p: ThemePreference, prefersDark: boolean): ResolvedTheme;

export const THEME_COLORS: Record<ResolvedTheme, string>; // light #faf9f5, dark #16140f
export const NO_FLASH_SCRIPT: string; // IIFE-строка для <head>
```

`NO_FLASH_SCRIPT` читает `localStorage[THEME_STORAGE_KEY]`, разрешает `system`
через `matchMedia`, выставляет `document.documentElement.dataset.theme` и
`style.colorScheme`. Обёрнут в `try/catch`, чтобы не падать при запрете
localStorage.

## 3. No-flash и метаданные

- `src/app/layout.tsx`: `<html ... suppressHydrationWarning>`. No-flash скрипт
  вставляется через `<Script id="theme-init" strategy="beforeInteractive"
  dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />` из `next/script`
  (по локальным докам Next 16 `beforeInteractive` инжектится в `<head>` и
  выполняется до гидратации). Дерево оборачивается в `<ThemeProvider>`.
- В `globals.css` базовый жёсткий `color-scheme: light` убирается (color-scheme
  ставит no-flash-скрипт и провайдер); добавляется запасное
  `:root { color-scheme: light }` и `:root[data-theme="dark"] { color-scheme: dark }`.
- `viewport.themeColor` становится массивом двух записей с медиа-условиями
  `prefers-color-scheme` (light `#faf9f5` / dark `#16140f`) — покрывает
  системный режим по умолчанию.
- При явном (не системном) предпочтении `ThemeProvider` создаёт/обновляет
  «голый» `<meta name="theme-color">` (без `media`), который перекрывает
  медиа-пару; при возврате в `system` — удаляет его.
- `manifest.ts` оставляет `theme_color/background_color = #faf9f5` —
  ограничение PWA-манифеста (не динамический), фиксируется как известное.

## 4. Провайдер `src/components/shared/ThemeProvider.tsx`

Client-компонент, контекст:

```ts
interface ThemeContextValue {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (p: ThemePreference) => void;
}
export function useTheme(): ThemeContextValue;
export default function ThemeProvider({ children }: { children: React.ReactNode });
```

Поведение:
- На монтировании читает `preference` из `localStorage` (через `parseStoredTheme`),
  `resolvedTheme` — из уже проставленного `document.documentElement.dataset.theme`
  (иначе `resolveTheme`).
- Эффект применения: `dataset.theme`, `style.colorScheme`, `<meta theme-color>`.
- Эффект для `system`: подписка на `matchMedia` change; при
  `preference === "system"` обновляет `resolvedTheme`.
- `setTheme(p)`: пишет в `localStorage`, ставит `preference` и `resolvedTheme`.

## 5. Переключатель и иконка

- **`src/components/shared/ThemeIcon.tsx`** — своя SVG (24×24): солнце для
  `light`, полумесяц для `dark`; `stroke="currentColor"`, `aria-hidden`.
  Используется в кнопке (глиф по `resolvedTheme`).
- **`src/components/shared/ThemeToggle.tsx`** — client. Кнопка с
  `aria-label="Тема оформления"`, `aria-haspopup="menu"`, `aria-expanded`.
  По клику — поповер (`role="menu"`) с тремя `menuitemradio`
  (иконки lucide `Sun`, `Moon`, `Monitor`; подписи «Светлая», «Тёмная»,
  «Системная»; `aria-checked`). Закрытие по Escape и клику вне; фокус
  возвращается на кнопку. Анимация появления — `motion`.
- **Место:** `src/components/shared/Header.tsx`, правый кластер действий
  (первым элементом, до `StreakBadge`), виден независимо от статуса загрузки
  авторизации. Работает во всех трёх раскладках (сайдбар `nav-lg`, рейл
  `nav-md`, нижний бар на телефоне).
- На `/login` переключателя нет, но тема применяется (общий CSS + no-flash).

## 6. Доступность

- Кнопка: `aria-label`, `aria-haspopup="menu"`, `aria-expanded`.
- Меню: `role="menu"`, пункты `role="menuitemradio"` + `aria-checked`.
- Управление: `Enter/Space` открывает, `Escape` закрывает, клик вне закрывает,
  фокус возвращается на кнопку.
- Уважается `prefers-reduced-motion` (общее правило в `globals.css`).

## 7. Тестирование

- `src/lib/theme.test.ts` — `isThemePreference`, `parseStoredTheme`,
  `resolveTheme` (4 комбинации), `THEME_COLORS`, `NO_FLASH_SCRIPT` (содержит
  ключ хранилища и учитывает system).
- `src/app/globals-theme.test.ts` — чтение `globals.css`: наличие селектора
  `[data-theme="dark"]`, наличие в нём `--color-slate-950`, отсутствие
  жёсткого `color-scheme: light` вне скоупа по умолчанию, использование
  `var(--bg)` в `body`.
- Компоненты — ручная проверка в `npm run dev` по матрице: 3 раскладки ×
  (light/dark/system), отсутствие вспышки при перезагрузке, `theme-color`.
- Финал: `npm run lint`, `npm run typecheck`, `npm test`.

## 8. Файлы

Создать:
- `src/lib/theme.ts`, `src/lib/theme.test.ts`
- `src/app/globals-theme.test.ts`
- `src/components/shared/ThemeProvider.tsx`
- `src/components/shared/ThemeIcon.tsx`
- `src/components/shared/ThemeToggle.tsx`

Изменить:
- `src/app/globals.css` — семантические переменные, тёмный скоуп, var-ификация.
- `src/app/layout.tsx` — `suppressHydrationWarning`, no-flash `<script>`,
  `ThemeProvider`, `viewport.themeColor`.
- `src/components/shared/Header.tsx` — вставить `<ThemeToggle />` в действия.

Не трогать: все компоненты-потребители цветов (36 файлов), `icon.svg`,
`app-icons.test.ts`, `manifest.ts`.
