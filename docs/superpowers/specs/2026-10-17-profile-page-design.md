# Дизайн: страница профиля

Дата: 2026-10-17
Ветка: `feat/profile-page`

## Цель

Добавить экран «Профиль» с данными аккаунта, статистикой прогресса, компактным
блоком достижений, ссылками на разделы и настройками. В него **переносятся** из
шапки управление аккаунтом (выход) и выбор темы оформления.

Поведение зависит от размера экрана:

- **< 600px (`nav-md`, нижний бар):** пункт меню «профиль» — обычная ссылка на
  отдельную страницу `/profile`.
- **≥ 600px (рейл `nav-md` и сайдбар `nav-lg`):** пункт меню открывает
  модальное окно поверх текущей страницы (URL не меняется).

## Ключевые ограничения среды

- Tailwind CSS v4, кастомные брейкпоинты объявлены в `src/app/globals.css`:
  `--breakpoint-nav-md: 600px`, `--breakpoint-nav-lg: 840px`. Граница «мобила /
  большой экран» для профиля — **600px**.
- `Header.tsx` рендерит все три раскладки одновременно, видимость переключает
  CSS (`hidden`, `nav-md:flex`, `nav-lg:flex`, `nav-md:hidden`). Значит
  «ссылка на мобиле / кнопка на десктопе» реализуется разными компонентами
  раскладок, а не JS-условием по ширине.
- UI-текст и кодовая база — русский + `font-mono`-стилистика, палитра
  «вывернута» (`bg-slate-950` — фон, `text-white` — текст). Тёмная тема уже
  реализована через `:root[data-theme="dark"]`.
- Firestore-хуки (`useUserProgress`, `useCurrency`, `useStreak`,
  `useAchievements`, `useAssessments`, `useProjectProgress`) — клиентские;
  страницы группы `(app)` — серверные с `getCurrentUser()`.
- Vitest: окружение `node`, шаблон `src/**/*.test.ts` (без `tsx` и `jsdom`).
  Автотестами покрываем только чистую логику; компоненты и адаптив — вручную
  в `npm run dev`.

## Архитектура

1. **Один контент — две оболочки.** `ProfileContent` (client) — единый источник
   разметки профиля. Его рендерят:
   - `ProfilePageClient` внутри маршрута `/profile` (страница для < 600px и
     фолбэк при прямом заходе на десктопе);
   - `ProfileModal` в `Header` (модалка для ≥ 600px).
2. **Триггер зависит от раскладки.** В `NAV_ITEMS` добавляется пункт
   `{ href: "/profile", label: "профиль", icon: CircleUser }`.
   - `MobileNavItem` для него рендерит `<Link href="/profile">`.
   - `DesktopNavItem` и `TabletNavItem` рендерят `<button>` → `onOpenProfile()`.
3. **Состояние модалки** живёт в `Header` (`profileOpen`), там же закрытие по
   Esc и смена брейкпоинта.
4. **Домен в `src/lib`.** Чистая функция `summarizeProfile(...)` собирает сводку
   из сырых значений и каталога достижений — её тестируем.

## 1. Навигация и адаптив

- `NAV_ITEMS` расширяется пунктом «профиль» (последним). Мобильный нижний бар:
  `grid-cols-5` → `grid-cols-6`.
- `activeHref` для пункта «профиль»:
  - на мобиле — по `pathname === "/profile"`;
  - на десктопе/планшете — «активен», пока открыта модалка (`profileOpen`).
    Пункт при этом не является навигацией, поэтому остаётся подсвеченным как
    действие.
- Пункт «профиль» в раскладках десктопа/планшета: `<button type="button">` с
  теми же стилями активного/неактивного состояния, что и у ссылок
  (`DesktopNavItem`/`TabletNavItem`). `PendingIndicator` (завязан на
  `useLinkStatus`) в кнопке не используется.
- `ROUTE_SKELETONS` получает `"/profile": ProfileSkeleton` — мгновенный
  скелетон при навигации на мобиле.

## 2. Роут `/profile`

`src/app/(app)/profile/page.tsx` (server):

```tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ProfilePageClient from "@/components/profile/ProfilePageClient";

export default async function ProfilePage() {
  const uid = await getCurrentUser();
  if (!uid) redirect("/login");
  return <ProfilePageClient />;
}
```

`ProfilePageClient` (client) оборачивает `ProfileContent` в контейнер страницы
(заголовок-«# Профиль» и отступы, как у других страниц). Прямой заход на
`/profile` на десктопе рендерит ту же страницу (осознанный фолбэк).

## 3. Состав `ProfileContent`

Клиентский компонент, самодостаточный (данные тянет хуками). Секции:

1. **Шапка** — аватар-инициал (первая буква email), email (из `useFirebaseAuth`),
   имя текущего уровня (из `useUserProgress` + `levels`).
2. **Статистика** (`ProfileStats`) — сетка карточек:
   - XP (`totalScore`), текущий уровень;
   - кристаллы (`useCurrency().currency.balance`);
   - стрик: текущий / рекорд (`useStreak`);
   - освоено навыков: `assessedSkills / totalSkills`;
   - проекты: `completedProjects / totalProjects`;
   - достижения: `earned / total`.
3. **Достижения** (`ProfileAchievements`) — компактная сетка заработанных
   значков; незаработанные приглушены. Использует `getAchievementCatalog()` и
   `useAchievements()`. Заголовок со счётчиком `[N/M]` и ссылка «все
   достижения» → `/achievements`.
4. **Ссылки на разделы** (`ProfileLinks`) — компактный список: dashboard, tree,
   projects, roadmap, achievements, shop.
5. **Настройки** — блок «оформление» (`ThemeSetting`: сегмент-контрол из трёх
   вариантов «Светлая/Тёмная/Системная» через `useTheme()`) и кнопка «выход».

Логика выхода переносится из `Header.handleLogout` в `ProfileContent`
(`signOut(auth)` → серверный `logout()` → `router.push("/")` →
`router.refresh()`).

## 4. Модалка `ProfileModal`

Client-компонент, паттерн из `CelebrationModal`:

- `createPortal` в `document.body`, `AnimatePresence` + `motion` (масштаб/фейд
  появления), оверлей `bg-slate-950/70 backdrop-blur-md`.
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` заголовка модалки.
- Закрытие: Esc, клик по оверлею, кнопка закрытия в шапке окна.
- При открытии: перевод фокуса внутрь окна; блокировка скролла
  (`document.body.style.overflow = "hidden"` с восстановлением при закрытии);
  при закрытии — возврат фокуса на кнопку-триггер (реф передаётся из `Header`).
- Уважается `prefers-reduced-motion` (общее правило в `globals.css`).
- Если ширина падает ниже 600px при открытой модалке — модалка закрывается
  (`matchMedia("(min-width: 600px)")` слушатель), чтобы пользователь перешёл на
  страницу.

## 5. Модуль `src/lib/profile.ts`

Чистые функции без DOM (тестируются в `node`):

```ts
export interface ProfileInputs {
  xp: number;
  levelName: string;
  crystals: number;
  currentStreak: number;
  longestStreak: number;
  assessedSkills: number;
  totalSkills: number;
  completedProjects: number;
  totalProjects: number;
}

export interface MatchableAchievement {
  id: string;
  matches: (a: { type: string; metadata: Record<string, unknown> }) => boolean;
}

export interface ProfileSummary extends ProfileInputs {
  earnedAchievements: number;
  totalAchievements: number;
  earnedAchievementIds: string[];
}

export function summarizeProfile(
  inputs: ProfileInputs,
  catalog: MatchableAchievement[],
  earned: { type: string; metadata: Record<string, unknown> }[],
): ProfileSummary;
```

Структурный тип `MatchableAchievement` совпадает с `AchievementDef` из
`src/data/achievements.ts`, поэтому `lib` не зависит от `data`.

## 6. Изменения `Header.tsx` и темы

- Из правого кластера шапки **удаляются** `<ThemeToggle />` и кнопка logout.
  Остаются бейджи стрика/кристаллов и ссылка login для гостя.
- Добавляется пункт «профиль» в навигацию всех трёх раскладок (см. §1) и
  состояние `profileOpen`, рендер `ProfileModal`.
- `ThemeToggle.tsx` становится мёртвым — **удалить**. `ThemeIcon` остаётся и
  переиспользуется в `ThemeSetting` (иконка блока «оформление»).

## 7. Скелетон

Новый `src/components/shared/skeletons/ProfileSkeleton.tsx` (по образцу
`DashboardSkeleton`, из `Skeleton`), экспорт в
`src/components/shared/skeletons/index.ts`.

## 8. Доступность

- Модалка: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`; Esc/клик по
  фону закрывают; фокус входит в окно и возвращается на триггер.
- Пункт-кнопка «профиль» на десктопе: `aria-haspopup="dialog"`,
  `aria-expanded={profileOpen}`.
- Сегмент-контрол темы: `role="radiogroup"` / `role="radio"` +
  `aria-checked`, навигация стрелками (логика ролей переиспользуется из
  текущего `ThemeToggle`).
- Кнопка выхода: понятный `aria-label`, отделена от навигации.

## 9. Тестирование

- `src/lib/profile.test.ts` — `summarizeProfile`: подсчёт заработанных id и
  счётчиков, пустой каталог/список, значения по умолчанию для нулевых данных.
- Компоненты и адаптив — ручная матрица в `npm run dev`:
  - < 600px: пункт ведёт на `/profile`, страница рендерится, выхода и темы в
    шапке нет;
  - ≥ 600px (рейл и сайдбар): пункт открывает модалку, URL не меняется,
    Esc/фон/крестик закрывают, фокус возвращается, скролл заблокирован;
  - guest vs user; переключение темы из профиля; выход из профиля.
- Финал: `npm run lint`, `npm run typecheck`, `npm test`.

## 10. Файлы

Создать:
- `src/app/(app)/profile/page.tsx`
- `src/components/profile/ProfilePageClient.tsx`
- `src/components/profile/ProfileContent.tsx`
- `src/components/profile/ProfileModal.tsx`
- `src/components/profile/ProfileStats.tsx`
- `src/components/profile/ProfileAchievements.tsx`
- `src/components/profile/ProfileLinks.tsx`
- `src/components/profile/ThemeSetting.tsx`
- `src/components/profile/index.ts`
- `src/components/shared/skeletons/ProfileSkeleton.tsx`
- `src/lib/profile.ts`, `src/lib/profile.test.ts`

Изменить:
- `src/components/shared/Header.tsx` — навигация, `profileOpen`, `ProfileModal`,
  удаление темы/выхода.
- `src/components/shared/skeletons/index.ts` — экспорт `ProfileSkeleton`.
- `src/hooks/useFirebaseAuth.ts` — добавить возврат `email`.

Примечание: карта `ROUTE_SKELETONS` живёт в `Header.tsx`, отдельный файл не
нужен.

Удалить:
- `src/components/shared/ThemeToggle.tsx` (заменён `ThemeSetting`).

Не трогать: страницу `/achievements` и её компоненты, `ThemeProvider`,
`src/lib/theme.ts`, `globals.css`, палитры тем.

## 11. Ветка и рабочий процесс

Первым шагом реализации: `git checkout -b feat/profile-page` от `main`.
Всю работу вести в этой ветке; завершение (merge/PR) — отдельным решением
пользователя.
