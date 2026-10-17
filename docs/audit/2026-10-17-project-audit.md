# Аудит проекта: структура и модули

- **Дата:** 2026-10-17
- **Ветка:** `docs/audit-clean-architecture`
- **Репозиторий:** `android-skills-tree`

## 1. Назначение

Android-skills-tree — трекер навыков Android-разработчика. Пользователь отмечает
подтемы навыков, за это начисляются XP и кристаллы, ведётся streaks (серия дней) и
выдаются достижения. Контент (навыки, категории, уровни, проекты, магазин,
достижения) статичен и лежит в коде; пользовательский прогресс хранится в Firebase
Firestore.

## 2. Стек

| Слой | Технология |
|------|------------|
| Фреймворк | Next.js 16 (App Router), React 19 |
| Язык | TypeScript 5 (`strict: true`) |
| Данные | Firebase 12 (Firestore + Auth, клиентский SDK) |
| Стили | Tailwind CSS v4 |
| Анимации | `motion` 13 |
| Иконки | `lucide-react` |
| Тесты | Vitest 4 |
| Линт | ESLint 9 (`eslint-config-next`) |

`package.json` — единственный источник команд: `dev`, `build`, `start`, `lint`,
`typecheck`, `test`, `icons`.

## 3. Структура каталогов

```
android-skills-tree/
├── src/
│   ├── app/                 # маршруты App Router (тонкие)
│   ├── actions/auth.ts      # server actions login/logout
│   ├── components/          # UI по фичам
│   ├── data/                # статический каталог контента
│   ├── hooks/               # клиентские Firestore-хуки
│   ├── lib/                 # доменная логика + инфраструктура (смешаны)
│   ├── types/index.ts       # общие типы
│   └── proxy.ts             # защита маршрутов (аналог middleware)
├── scripts/generate-icons.mjs
├── docs/                    # планы и спеки
├── public/
└── конфиги: next.config.ts, tsconfig.json, eslint.config.mjs,
            vitest.config.mts, postcss.config.mjs
```

## 4. Маршрутизация (`src/app`)

| Маршрут | Файл | Назначение |
|---------|------|------------|
| `/` | `page.tsx` | лендинг/редирект |
| `/login` | `login/page.tsx` | вход/регистрация (клиентский) |
| `/dashboard` | `(app)/dashboard/page.tsx` | сводка прогресса |
| `/tree` | `(app)/tree/page.tsx` | дерево навыков |
| `/tree/[slug]` | `(app)/tree/[slug]/page.tsx` | уровень по slug |
| `/tree/[slug]/skill/[skillId]` | `.../skill/[skillId]/page.tsx` | карточка навыка |
| `/roadmap` | `(app)/roadmap/page.tsx` | пробелы/план |
| `/projects` | `(app)/projects/page.tsx` | проекты |
| `/shop` | `(app)/shop/page.tsx` | магазин |
| `/achievements` | `(app)/achievements/page.tsx` | достижения |
| `/profile` | `(app)/profile/page.tsx` | профиль |
| — | `(app)/layout.tsx` | общий layout защищённой группы |
| — | `manifest.ts` | PWA-манифест |

Все страницы группы `(app)` — серверные компоненты, которые только проверяют
сессию (`getCurrentUser()`) и рендерят клиентский компонент. **Данные с сервера
не читаются.**

## 5. Модули

### 5.1 `src/data` — статический каталог (1 858 строк)

| Файл | Содержимое |
|------|-----------|
| `skills.ts` (1549) | ~227 навыков с подтемами, сложностью, `sortOrder`, `requiredForLevelUp` |
| `categories.ts` | категории, привязаны к уровням |
| `levels.ts` | уровни (junior → senior), пороги, число проектов |
| `projects.ts` | проекты по уровням |
| `shop.ts` | товары магазина (в т.ч. streak-freeze) |
| `achievements.ts` | определения достижений |
| `index.ts` | агрегирующие селекторы (`getLevelWithDetails`, `getSkillsByCategoryId`, …) |

### 5.2 `src/lib` — доменная логика + инфраструктура (смешаны)

**Чистая доменная логика (без побочных эффектов, покрыта тестами):**
- `scoring.ts` — `calcSkillScore`, `calcCategoryScore`, `calcTotalScore`, `calcLevelScore`.
- `weights.ts` — веса сложности, множители уровней, `LEVEL_UP_THRESHOLD`, максимумы.
- `achievement-conditions.ts` — `evaluateAchievements`, `selectMissingAwards`, ключи.
- `streak.ts` — расчёт серий (частично чистая + побочные эффекты).
- `currency.ts` — награды кристаллами + `buyItem` (побочный эффект).
- `profile.ts` — агрегация профиля.
- `roadmap-sort.ts` — сортировка пунктов роадмапа.
- `theme.ts`, `viewport.ts` — утилиты UI.

**Инфраструктура доступа к данным (импортируют `firebase`):**
- `firebase.ts` — инициализация клиентского Firebase (хардкод-fallback ключи).
- `firestore.ts` — CRUD по подколлекциям `users/{uid}/{progress,assessments,projects,achievements}`.
- `firestore-actions.ts` — `"use client"`-оркестрации: `checkLevelUp`, `backfillTotalScore`,
  `checkAchievements`, `resetLevelProgress`, `toggleProjectCompletion`.
- `queries.ts` — тонкая обёртка над `getAssessmentMap` (избыточна).
- `auth.ts` — серверная работа с cookie сессии (сырой uid).

> **Дублирование:** `getUserProgress`, `updateUserProgress`, `getProjectProgressMap`
> реализованы и в `firestore.ts`, и в `firestore-actions.ts`.

### 5.3 `src/hooks` — клиентские Firestore-хуки

`useFirebaseAuth`, `useUserProgress`, `useCurrency`, `useStreak`, `useAssessments`,
`useProjectProgress`, `useAchievements`, `useSkillDetail`.

Шесть хуков используют `onSnapshot` (realtime-листенеры). Мутации частью идут
напрямую через клиентский SDK (`setDoc`/`updateDoc`), частью — через
`firestore-actions`.

### 5.4 `src/components` — UI по фичам

`dashboard/`, `tree/`, `roadmap/`, `projects/`, `shop/`, `achievements/`,
`profile/`, `shared/` (+ `shared/skeletons`). Крупнейший файл —
`shared/Header.tsx` (425 строк).

### 5.5 Аутентификация

- `login/page.tsx` (клиент): `signInWithEmailAndPassword` / `createUserWithEmailAndPassword`
  → вызывает server action `login(uid)`.
- `actions/auth.ts` (server): `login(uid)` / `logout()`.
- `lib/auth.ts`: cookie `firebase-session` = **сырой uid**.
- `proxy.ts`: редирект неавторизованных с защищённых маршрутов.

## 6. Переменные окружения

Файл `.env.local` (в `.gitignore`, `*.env*`) содержит:

| Переменная | Назначение | Используется? |
|-----------|------------|---------------|
| `AUTH_SECRET` | секрет для подписи сессии | **нет** |
| `ADMIN_EMAIL` | админ-email | **нет** |
| `ADMIN_PASSWORD_HASH` | хеш админ-пароля | **нет** |

`NEXT_PUBLIC_FIREBASE_*` — читаются в `firebase.ts` с **захардкоженными fallback**:

| Переменная | Fallback в коде |
|-----------|-----------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyBdj4zq4AM5ENYZ3XZk9refsOJaeUBed7A` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `android-dev-skill-tree.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `android-dev-skill-tree` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `android-dev-skill-tree.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `916873454999` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:916873454999:web:...` |

`.env.example` в репозитории отсутствует.

## 7. Тесты

Vitest, тесты co-located (`*.test.ts`): `scoring`, `weights`, `streak`, `currency`,
`achievement-conditions`, `firestore`, `firestore-actions`, `profile`, `roadmap-sort`,
`viewport`, `theme`, а также `app/app-icons.test.ts`, `app/globals-theme.test.ts`.
Команда — `npm test` (одноразовый прогон).

## 8. Состояние проверок (baseline на 2026-10-17)

| Команда | Результат |
|---------|-----------|
| `npm run typecheck` | ✅ без ошибок |
| `npm test` | ✅ 13 файлов, 154 теста |
| `npm run lint` | ❌ 4 ошибки (предсуществующие) |

Ошибки линта — `react-hooks/set-state-in-effect` в
`useAchievements.ts:20`, `useAssessments.ts:41`, `useProjectProgress.ts:22`,
`useUserProgress.ts:33` (синхронный `setState` в эффекте). Не связаны с аудитом,
но должны быть устранены в фазах 2–3 при переносе хуков на порты.

## 9. Наблюдения (сводно)

1. **Смешение слоёв:** доменная логика (`scoring`, `weights`) и инфраструктура
   (`firestore`, `firebase`, `auth`) лежат в одном `src/lib` без границ.
2. **Дублирование** функций доступа к Firestore между `firestore.ts` и `firestore-actions.ts`.
3. **Тонкие индирекции:** `queries.ts` дублирует имя `getAssessmentMap`.
4. **Логика размазана по хукам:** пересчёт `totalScore` и достижений — в `useUserProgress`.
5. **Серверная сторона почти не участвует:** все чтения и записи на клиенте.
6. **Смертвые секреты** и хардкод-ключи в конфиге.
7. **Нет `firestore.rules` / `firebase.json`** в репозитории (см. security-audit).
