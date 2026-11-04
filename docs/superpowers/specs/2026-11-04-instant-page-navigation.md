# Дизайн-документ: мгновенное открытие страниц (навигация между разделами)

- **Дата:** 2026-11-04
- **Статус:** approved, реализация начата
- **Тип:** perf / UX (feat)
- **Ветка:** `feat/instant-page-navigation`
- **Путь:** `docs/superpowers/specs/2026-11-04-instant-page-navigation.md`
- **Связанные правила:** `AGENTS.md` → «Firestore listeners and quota», «Release workflow (GitHub)»
- **Затрагиваемые области:** `src/hooks`, `src/shared/lib`, `src/shared/ui/Header.tsx`, `src/app/(app)`, `src/features/study`, `src/lib/version.ts`

---

## 1. Проблема

При клике по пункту бокового/нижнего меню раздел открывается **непредсказуемо**: иногда мгновенно, иногда — долго, с скелетоном на весь экран. Одинаковые данные (прогресс, оценки, проекты) перезагружаются при каждом переходе.

### 1.1. Наблюдаемый симптом

- «Мгновенно» — при переключении грейдов внутри `/tree/[slug]` и между скиллами одного уровня.
- «Долго» — при любом переходе между пунктами меню (`/dashboard`, `/projects`, `/roadmap`, `/achievements`, `/shop`, `/profile`, `/quiz`).
- На `/profile` — самый долгий скелетон (зависят 7 источников данных).
- Скелетон может «залипнуть» навсегда при неудачном/зависшем переходе.

---

## 2. Трассировка текущего клика

1. **`<Link>`** (`src/shared/ui/Header.tsx:151,194,215`). Все пункты меню — dynamic-роуты, поэтому prefetch тянет **только сегмент до ближайшего `loading.tsx`**, не данные страницы (`node_modules/next/dist/docs/01-app/02-guides/prefetching.md:26-31,52-57`). Client-cache TTL для dynamic = **0** (`.../next-config-js/staleTimes.md:27-30`).
2. **`onClick` → `handleNavigate`** (`Header.tsx:259-261`) ставит `pending`.
3. **Через 120 мс** таймер (`Header.tsx:253-257`) ставит `readyPending`, и `{children}` — ещё валидная текущая страница — **подменяется** на `RoutePlaceholder` (`Header.tsx:362-366`).
4. **Сервер**: страница `await getCurrentUser()` (`src/adapters/auth/session.ts:64-67`) → `cookies()` → `jose.jwtVerify` → `redirect("/login")`. Параллельно `(app)/layout.tsx:5-12` может ждать GitHub API (`src/lib/version.ts:31-49`).
5. **RSC-payload** → React монтирует новую клиентскую страницу. Эффект-очистка старой страницы выполняется **раньше** эффектов новой (порядок passive-эффектов React), поэтому refcount слушателей падает до 0 → `unsub()` + `cache.delete(uid)`.
6. **Новая страница**: `useFirebaseAuth` стартует `loading: true` и создаёт свою подписку `onAuthStateChanged`; затем создаются `onSnapshot`-подписки; затем первый снапшот. До этого — скелетон (`DashboardClient.tsx:29`, `TreeClient.tsx:44`, `RoadmapClient.tsx:29`, `AchievementsClient.tsx:34`, `ProjectsClient.tsx:15`, `ShopClient.tsx:52`, `ProfileContent.tsx:56-78`, `SkillDetailPageClient.tsx:57`).

**Почему «иногда мгновенно»:** внутри `/tree/[slug]` компонент `TreeClient` имеет тот же тип на той же позиции дерева, React **переиспользует инстанс** при смене `slug` → хуки не перемонтируются → кэш жив. Любой переход между разделами меняет тип компонента → полный цикл 4–6.

---

## 3. Первопричины

### P0

| ID | Причина | Доказательство |
|----|---------|----------------|
| **C1** | «Shared listener cache» уничтожается при размонтировании последнего потребителя, то есть на **каждом** переходе между разделами. Кэш не переживает ни одну навигацию. | `useUserProgress.ts:89-96`, `useAssessments.ts:99-106`, `useProjectProgress.ts:78-85`, `useAchievements.ts:87-94`, `useCurrency.ts:84-91`, `useUserSettings.ts:83-90` |
| **C2** | Все страницы разделов — dynamic из-за `cookies()` в `getCurrentUser()`. Нет client-cache, нет полноценного prefetch → каждый клик = серверный round-trip. При этом сервер рендерит только клиентскую оболочку. | `dashboard/page.tsx:6`, `projects/page.tsx:6`, `roadmap/page.tsx:6`, `achievements/page.tsx:6`, `shop/page.tsx:6`, `profile/page.tsx:6`, `quiz/page.tsx:6` |
| **C3** | `useFirebaseAuth` создаёт **свою** подписку `onAuthStateChanged` на каждый экземпляр хука (на `/profile` — 8), и каждый стартует `loading: true` → подписка на Firestore не начинается до колбэка auth. | `src/hooks/useFirebaseAuth.ts:9-17`, `ProfileContent.tsx:46-53` |

### P1

| ID | Причина | Доказательство |
|----|---------|----------------|
| **C4** | `Header` сам подменяет контент скелетоном через 120 мс; `pending`/`readyPending` никогда не сбрасываются; при неудачном переходе скелетон остаётся навсегда; дублирует `loading.tsx`. | `Header.tsx:241-257,259-261,362-366` |
| **C5** | Скелетон гейтится по самому медленному слушателю на весь экран; статичный каркас (заголовок, табы, легенда) мог бы рисоваться сразу. Нет `loading.tsx` у `/profile`, `/quiz`, study-роутов. | компоненты из §2 п.6; `src/app/(app)/` (см. §9) |
| **C6** | `(app)/layout.tsx` блокирующе ждёт GitHub API без таймаута (`cache: force-cache`, `revalidate: 60`, до 2 запросов); в dev — синхронный `execSync("git rev-parse")`. | `(app)/layout.tsx:5-12`, `src/lib/version.ts:45-49`, `src/lib/version.server.ts:4-20` |
| **C7** | На каждый монтаж `useUserProgress` запускает `readAssessmentMap` + `backfillTotalScore` + `checkAchievementsOnce`; `useStreak` — `getStreak`. Лишние чтения/записи конкурируют с теми слушателями, которых ждёт скелетон. | `useUserProgress.ts:99-120`, `useStreak.ts:76-82`, `firestore-actions.ts:56-68,91-105` |

### P2

| ID | Причина | Доказательство |
|----|---------|----------------|
| **C8** | Реестр study-материалов (~1 МБ исходника) импортируется в **клиентский** хук; markdown парсится в браузере. | `src/features/study/study-material.ts:1`, `hooks/useStudyMaterial.ts`, `StudyMaterialContent.tsx`, `study-materials.generated.ts` (1 054 815 байт) |
| **C9** | Dev: StrictMode + teardown кэша = двойные подписки и двойные чтения. | следствие C1 |
| **C10** | Первая отрисовка навигации скрыта до `onAuthStateChanged` (`showNav = !loading && user`). | `Header.tsx:268-272` |

---

## 4. Цели, не-цели, метрики

### Цели

1. Повторный переход на любой раздел — **без полноэкранного скелетона** (данные берутся из памяти).
2. **Ноль** повторных `onSnapshot`-подписок на одни и те же данные в рамках сессии.
3. Один `onAuthStateChanged` на вкладку.
4. Навигация не должна «залипать» в скелетоне ни при каких ошибках.
5. Не увеличивать количество чтений Firestore; по возможности сократить.

### Не-цели

- Не менять модель данных, схему Firestore, security rules.
- Не менять публичные API хуков (`{ progress, loading, ... }` остаются).
- Не переводить приложение на `cacheComponents` / PPR.
- Не рефакторить UI-компоненты сверх необходимого.

### Метрики приёмки

| Метрика | Сейчас | Цель |
|---|---|---|
| Повторный клик по разделу (warm) | 300–2000+ мс скелетона | ≤ 150 мс, без полноэкранного скелетона |
| `onSnapshot` на раздел за сессию | N переходов + 1 | 1 |
| `onAuthStateChanged` на вкладку | 4–8 на страницу | 1 |
| Чтения Firestore на переключение таба | ~8–12 | 0 |
| Зависание скелетона при ошибке перехода | возможно | невозможно (есть сброс/таймаут) |
| `?_rsc=` при повторном заходе | всегда | 0 после Phase 5 (или попадание в client-cache) |

---

## 5. Архитектура решения

### 5.1. Было

```
Mount page ─► useFirebaseAuth (новая подписка) ─► onSnapshot ─► первый снапшот ─► render
                 ▲                                 ▲
           Unmount page: refcount=0 → unsub + cache.delete
```

### 5.2. Стало

```
Session start ─► auth-store (1 подписка) ─┐
                                         ▼
Mount page ─► live-store[key] ── есть data? ──► render сразу (loading=false)
                    │                                   ▲
                    └─ нет data → 1 подписка → снапшот ─┘
Unmount page: refcount=0 → слушатель остаётся (idle TTL / до sign-out)
```

Ключевые принципы:

1. **Слушатель живёт дольше компонента.** Один слушатель на `uid + домен` на вкладку — ровно правило из `AGENTS.md`.
2. **Снапшот доступен синхронно.** `useSyncExternalStore` + кэшированный объект снапшота → первый рендер уже с данными.
3. **Ошибка не стирает данные.** При ошибке сохраняем последний `data`, выставляем `error`, `loading=false`.
4. **Sign-out — единственная точка очистки** (`uid === null` → `disposeAll()`).

---

## 6. Детальный дизайн

### Phase 1 — `live-store` (P0, C1)

**Новый модуль:** `src/shared/lib/live-store.ts` (+ `live-store.test.ts`).

```ts
import type { Observer, Unsubscribe } from "@/ports/observation";

export interface LiveSnapshot<T> {
  data: T | undefined;
  loading: boolean;
  error: unknown | null;
}

export interface LiveStore<T> {
  /** стабильный объект снапшота для useSyncExternalStore */
  peek(key: string): LiveSnapshot<T>;
  /** подписка потребителя; start вызывается один раз на key */
  subscribe(
    key: string,
    start: (observer: Observer<T>) => Unsubscribe,
  ): Unsubscribe;
  /** серверный снапшот (SSR/hydration) */
  getServerSnapshot(): LiveSnapshot<T>;
  /** снять все слушатели (sign-out / тесты) */
  disposeAll(): void;
}

export function createLiveStore<T>(options?: {
  initialData?: T;
  /** сколько держать слушатель после ухода последнего потребителя; по умолчанию — до sign-out */
  idleTtlMs?: number;
}): LiveStore<T>;
```

Поведение:

- `subscribe(key, start)`:
  - нет entry → создать `{ snapshot: { data: initialData, loading: initialData === undefined, error: null }, listeners: new Set(), stop: null, idleTimer: null }`, вызвать `start({ next, error })` **один раз**;
  - есть entry с активным `idleTimer` → очистить таймер;
  - добавить listener; вернуть `unsubscribe`.
- `next(value)` → `snapshot = { data: value, loading: false, error: null }` + notify.
- `error(e)` → `snapshot = { data: snapshot.data, loading: false, error: e }` + notify.
- последний unsubscribe:
  - если `idleTtlMs` не задан → **ничего не делать** (слушатель до `disposeAll`);
  - иначе — таймер, по истечении `stop()` + `delete(key)`.
- `peek` возвращает **тот же объект**, пока не изменился (требование `useSyncExternalStore`).
- `getServerSnapshot` → `{ data: initialData, loading: initialData === undefined, error: null }`.

**React-биндинг:** `src/shared/lib/live-store.ts` (экспорт) или отдельный `use-live-store.ts`:

```ts
export function useLiveValue<T>(
  store: LiveStore<T>,
  key: string | null,
  start: (observer: Observer<T>) => Unsubscribe,
): LiveSnapshot<T> {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!key) return () => {};
      const unsubValue = store.subscribe(key, (obs) => start(obs));
      const unsubNotify = store.subscribeNotify(key, onChange); // или единый subscribe(cb)
      return () => { unsubNotify(); unsubValue(); };
    },
    [store, key, start],
  );
  const snapshot = useSyncExternalStore(
    subscribe,
    () => (key ? store.peek(key) : SERVER_EMPTY),
    () => (key ? store.getServerSnapshot() : SERVER_EMPTY),
  );
  return snapshot;
}
```

> Уточнение по API: у стора должен быть один метод `subscribe(key, start, onChange)` либо отдельный `subscribeNotify`; важно, чтобы `getSnapshot` был стабилен по ссылке.

**Интеграция в хуки** (публичный API не меняется):

| Файл | Что заменяем |
|---|---|
| `useUserProgress.ts` | `progressCache` → `createLiveStore<UserProgress>({ initialData: undefined })` |
| `useAssessments.ts` | `assessmentCache` → `createLiveStore<Record<string, AssessmentData>>` |
| `useProjectProgress.ts` | `projectCache` → `createLiveStore<Record<string, boolean>>` |
| `useAchievements.ts` | `achievementCache` → `createLiveStore<Achievement[]>` |
| `useCurrency.ts` | `currencyCache` → `createLiveStore<CurrencyData>` |
| `useUserSettings.ts` | `settingsCache` → `createLiveStore<UserSettings>` |

`start` = мемоизированная обёртка над `repository.subscribe(uid, obs)`; ключ = `uid`.

**Важно (toast):** ошибки сейчас показываются из `errorListener` хука. После переноса в стор оставляем `useEffect` в хуке, который реагирует на изменение `snapshot.error` и показывает toast один раз (ref-guard), сохраняя текущие тексты (`isPermissionDenied`, `isQuotaExceeded`).

**SSR:** `getServerSnapshot` обязателен — иначе hydration mismatch (хуки рендерятся на сервере как часть клиентской оболочки).

**Soak/очистка:** в `AuthProvider`/auth-store на `uid === null` → `liveStore.disposeAll()` для всех сторов.

---

### Phase 2 — единый auth-state (P0, C3)

**Новый модуль:** `src/shared/lib/auth-store.ts` (+ тест).

- Модульный синглтон: одна подписка `auth.subscribe` (обёртка над `onAuthStateChanged`), запускается при первом использовании.
- Состояние: `{ uid, email, loading }`, последнее известное значение хранится в модуле → при повторном монтаже отдаётся **синхронно**.
- `useFirebaseAuth()` становится тонкой обёрткой над `useSyncExternalStore` с `getServerSnapshot = { uid:null, email:null, loading:true }`.

**Ограничение (важно):** uid из cookie **нельзя** использовать для старта Firestore-подписок — Firestore авторизует запросы через Firebase Auth, а не через наш httpOnly-cookie. Поэтому подписки по-прежнему стартуют только после того, как Firebase восстановит сессию. Экономия — только на повторных монтажах (тик auth больше не повторяется).

**Sign-out:** `uid → null` → `disposeAll()` во всех live-store'ах, чтобы данные предыдущего пользователя не «протекли» в следующую сессию.

---

### Phase 3 — Header и loading-состояния (P1, C4, C5, C10)

**`src/shared/ui/Header.tsx`:**

- Удалить `ROUTE_SKELETONS`, `RoutePlaceholder`, `PendingNav`, `pending`, `readyPending`, `handleNavigate`, таймер 120 мс и подмену `{children}` (`Header.tsx:45-60,241-267,362-366`).
- Оставить `PendingIndicator` на `useLinkStatus` — это штатный, точечный индикатор (`.../use-link-status.md:76-83`).
- `showNav` оставить как есть (навигация не должна прыгать до готовности auth), но это перестаёт быть частью проблемы.

**Новые `loading.tsx`:**

- `src/app/(app)/profile/loading.tsx` → `ProfileSkeleton`
- `src/app/(app)/quiz/loading.tsx` → нейтральный скелетон (можно `Skeleton`-набор)
- `src/app/(app)/tree/[slug]/skill/[skillId]/study/loading.tsx` → skeleton в стиле статьи
- `src/app/(app)/tree/[slug]/category/[categoryId]/study/loading.tsx` → то же

**Почему удаляем placeholder, а не чиним:** `loading.tsx` + prefetch — штатный механизм; ручная подмена контента дублирует его, скрывает валидную страницу и создаёт состояние, из которого нет выхода при ошибке.

> Если после удаления возникнет «пустой» промежуток на медленной сети — вернуть **тонкий progress-bar** под header, не подменяя контент, и обязательно с таймаутом/сбросом.

---

### Phase 4 — статичный каркас страниц (P1, C5) — *опционально после Phase 1*

После Phase 1 скелетон появляется только при холодных данных. Дополнительно:

- Рендерить каркас (заголовок, табы, легенду, статические блоки) **всегда**;
- гейтить только data-зависимые части (либо оставить один компактный skeleton внутри карточки).

Файлы: `DashboardClient.tsx`, `TreeClient.tsx`, `RoadmapClient.tsx`, `AchievementsClient.tsx`, `ProjectsClient.tsx`, `ShopClient.tsx`, `ProfileContent.tsx`, `SkillDetailPageClient.tsx`.

Приёмка: при пустом кэше виден заголовок и структура, а не «весь экран — скелетон».

---

### Phase 5 — серверная часть (P1, C2, C6) — *архитектурное решение, требует подтверждения*

**5.1. Auth-guard в `proxy.ts`.**

- `src/proxy.ts` уже существует и защищает `/dashboard`, `/projects`, `/roadmap`, `/shop`, `/quiz` (в Next 16 `middleware` переименован в `proxy`, Node.js runtime по умолчанию: `.../file-conventions/proxy.md:11,221-224`). Добавляем `/achievements` и `/profile` — единственные защищённые страницы, которых нет в `protectedRoutes`.
- Проверяет cookie `firebase-session` через `verifySessionToken` (`src/adapters/auth/session.ts:25-38`), при отсутствии — `redirect('/login')` с сохранением исходного пути.
- `config.matcher`: только защищённые сегменты (`/dashboard/:path*`, `/tree/:path*`, `/projects/:path*`, `/roadmap/:path*`, `/achievements/:path*`, `/shop/:path*`, `/profile/:path*`, `/quiz/:path*`); исключить `_next`, `public`, `/login`, `/`, `manifest.webmanifest`, иконки.
- Из страниц убрать `getCurrentUser()`/`redirect()` → страницы становятся **static**: полный prefetch + client-cache 5 мин (`prefetching.md:52-55`) → переход без сервера.
- Security: реальная защита данных — Firestore rules; страницы содержат только клиентскую оболочку.

**5.2. Версия приложения вне блокирующего рендера.**

- `(app)/layout.tsx`: либо `Suspense` вокруг блока версии с заглушкой, либо вынести `getLatestReleaseVersion` в клиентский компонент/route handler.
- Убрать `execSync` из `version.server.ts` (dev-путь): заменить на `process.env`/`getDevelopmentVersion()` без спавна процесса.
- Кэш GitHub: `revalidate` оставить, но добавить `AbortSignal.timeout(2000)` и fallback `null` → `unknown`.

**5.3. Альтернатива (если менять auth-схему не хочется).**

- Оставить `getCurrentUser()`, включить `experimental.staleTimes: { dynamic: 30 }` → повторные заходы на раздел в течение 30 с из client-cache.
- Не устраняет первый заход на раздел и не устраняет необходимость Phase 1.

**Решение:** делаем 5.1 (proxy + static). `staleTimes` остаётся как страховка для dynamic-маршрутов `/tree/**`.

---

### Phase 6 — одноразовые синхронизации (P1, C7)

- `backfillTotalScore` — обернуть в `oncePerSession(uid, 'backfillTotalScore')` (модульный `Set` + `sessionStorage`, как `applyAutoFreezesOnce` в `useStreak.ts:84-107`).
- Запускать синхронизации **после** первого снапшота прогресса/оценок, а не параллельно со стартом слушателей.
- `useStreak`: добавить `fetchedAt` в кэш; если данные моложе 60 с — не делать `getStreak` повторно.

Ожидаемый эффект: −5…−8 чтений на переключение раздела.

---

### Phase 7 — study-материалы (P2, C8)

**Вариант A (рекомендуется, низкий риск):** страница (server component) достаёт материал из реестра и передаёт `content`/`grade` пропсами в клиентский рендерер.

- `StudyMaterialContent` принимает `content: string; grade: string` вместо `materialId`.
- `useStudyMaterial` (react-query) и `study-material.ts` остаются серверными.
- Эффект: реестр на 1 МБ покидает клиентский бандл.

**Вариант B (follow-up):** рендерить markdown на сервере, оставив клиентским только `StudyCodeBlock` (кнопка «копировать») как островок.

---

## 7. Изменения по файлам

| Файл | Действие | Phase |
|---|---|---|
| `src/shared/lib/live-store.ts` | **новый**: refcount-стор с keep-alive и SSR-снапшотом | 1 |
| `src/shared/lib/live-store.test.ts` | **новый**: unit-тесты | 1 |
| `src/hooks/useUserProgress.ts` | кэш → live-store; once-per-session backfill | 1, 6 |
| `src/hooks/useAssessments.ts` | кэш → live-store | 1 |
| `src/hooks/useProjectProgress.ts` | кэш → live-store | 1 |
| `src/hooks/useAchievements.ts` | кэш → live-store | 1 |
| `src/hooks/useCurrency.ts` | кэш → live-store | 1 |
| `src/hooks/useUserSettings.ts` | кэш → live-store | 1 |
| `src/shared/lib/auth-store.ts` | **новый**: один `onAuthStateChanged` | 2 |
| `src/hooks/useFirebaseAuth.ts` | обёртка над auth-store | 2 |
| `src/shared/lib/once-per-session.ts` | **новый** (или в `src/lib`) | 6 |
| `src/shared/ui/Header.tsx` | убрать placeholder-логику | 3 |
| `src/app/(app)/{profile,quiz}/loading.tsx` | **новые** | 3 |
| `src/app/(app)/tree/**/study/loading.tsx` | **новые** (2 шт.) | 3 |
| `src/app/(app)/**/page.tsx` | убрать `getCurrentUser` (Phase 5.1) | 5 |
| `src/proxy.ts` | расширить `protectedRoutes` (`+ /achievements`, `+ /profile`) | 5.1 |
| `src/app/(app)/layout.tsx` | версия вне блокирующего пути | 5.2 |
| `src/lib/version.ts` | timeout + безопасный fallback | 5.2 |
| `src/lib/version.server.ts` | убрать `execSync` | 5.2 |
| `src/hooks/useStreak.ts` | TTL кэша | 6 |
| `src/features/study/components/StudyMaterialContent.tsx` | props вместо id | 7 |
| `src/features/study/hooks/useStudyMaterial.ts` | удалить/оставить только серверное использование | 7 |

---

## 8. Тестовая стратегия

### 8.1. Unit (vitest, рядом с кодом)

`src/shared/lib/live-store.test.ts`:

1. `subscribe` дважды на один key → `start` вызван **один** раз.
2. Первый снапшот обновляет `data` и `loading=false`.
3. Повторная подписка после ухода всех потребителей (в пределах TTL) → `start` **не** вызывается, данные доступны сразу.
4. Истечение `idleTtlMs` → `stop` вызван, entry удалён.
5. `error` не обнуляет `data`, ставит `loading=false`.
6. `peek` возвращает стабильную ссылку до изменения.
7. `disposeAll` вызывает все `stop` и очищает снапшоты.
8. `getServerSnapshot` не зависит от состояния вкладки.

`src/shared/lib/auth-store.test.ts`:

1. Несколько подписчиков → один underlying `subscribe`.
2. Последнее состояние доступно синхронно после первого колбэка.
3. `uid=null` → `disposeAll` вызван у зависимых сторов.

`src/shared/lib/once-per-session.test.ts`: повторный вызов не проходит; сброс при смене uid.

### 8.2. Ручная матрица (обязательна к каждому PR)

| Сценарий | Ожидание |
|---|---|
| Cold load `/dashboard` → `/projects` → `/roadmap` → `/profile` | скелетон только на первом (холодном) заходе в каждый домен; дальше — данные сразу |
| Повторить проход 5 раз | контент появляется ≤ 150 мс, без полноэкранного скелетона |
| `/tree/junior` → `/tree/middle` → `/tree/junior` | без скелетона (как и раньше) |
| `/tree/junior` → скилл → другой скилл | без скелетона |
| `/profile` (все 7 источников) | нет «семи гейтов» при тёплом кэше |
| DevTools → Block request URL для `?_rsc=` + клик по табу | переход не «залипает»; после разблокировки — восстановление |
| Offline → клик по табу → Online | ошибок-тостов больше одной; скелетон не висит вечно (после Phase 4/ошибки) |
| Logout → Login другим пользователем | данные первого пользователя не видны; одна новая подписка на домен |
| Hard reload | один `onAuthStateChanged`, по одному `onSnapshot` на домен |

### 8.3. Инструментальные проверки

- DevTools → Network → фильтр `_rsc`: после Phase 5 повторные переходы без запросов.
- Временный dev-only лог в `live-store` (`console.debug` под `NODE_ENV !== "production"`): `subscribe/start/stop` с `key` — используется в ручной матрице и удаляется/остаётся под флагом.
- Firestore → Usage/эмулятор: число чтений на сессию до/после.

### 8.4. Команды верификации

```
npm run lint
npm run typecheck
npm test
npm run build      # дополнительно проверить, что страницы стали static (Phase 5)
```

---

## 9. Риски и меры

| Риск | Вероятность | Мера |
|---|---|---|
| Слушатели живут всю сессию → больше одновременных подписок | низкая | 6 доменов; лимит Firestore ~100; `disposeAll` при sign-out и `resource-exhausted` |
| `useSyncExternalStore` + SSR → hydration mismatch | средняя | `getServerSnapshot` = начальное состояние; тест |
| Стабильность `subscribe`/`getSnapshot` → лишние ре-рендеры | средняя | `useCallback` + кэшированный объект снапшота; dev-профайлер React |
| Перенос auth в proxy ломает редиректы | средняя | matcher только для защищённых сегментов; e2e-проверка `/login` → `/dashboard`; fallback — откат одной фазы |
| Статические страницы отдают оболочку без данных | — | данные и так клиентские; Firestore rules — граница безопасности |
| Кэш показывает данные прошлого пользователя | низкая | `disposeAll` на `uid=null` |
| Удаление Header-placeholder → «пусто» на медленной сети | низкая | `loading.tsx` для всех целей; progress-bar как fallback |
| `backfillTotalScore` не выполнится второй раз за сессию | низкая | это repair-операция; повтор — после reload (как `checkAchievementsOnce`) |

**Откат:** каждая фаза — отдельный коммит, независимый от предыдущих. `git revert <sha>` достаточно; миграции данных нет.

---

## 10. Порядок работ и коммиты

1. `npm run new:feat -- instant-page-navigation` — создаёт ветку `feat/instant-page-navigation`, бампит `package.json` до `1.5.0` и делает `chore: start v1.5.0`. Требует **чистого** рабочего дерева → сначала ветка, потом этот документ.
2. Этот документ добавляется в `docs/superpowers/specs/` первым коммитом на ветке.
3. Далее — по чек-листу ниже.

> Conventional commits, субъекты — как пользовательские release notes (AGENTS.md).

---

## 11. Чек-лист выполнения (CLI)

Легенда: `[ ]` — не начато, `[~]` — в работе, `[x]` — сделано и проверено (`lint` + `typecheck` + `test`), `[!]` — требует решения.

### Подготовка
- [x] `npm run new:feat -- instant-page-navigation` (ветка + bump 1.5.0) — `b6c1568`
- [x] Добавить документ в `docs/superpowers/specs/2026-11-04-instant-page-navigation.md` — `8710d5d`
- [ ] Baseline-замер: Network `_rsc`, число `onSnapshot`, время до контента на 5 переходах (нужна живая сессия)

### Phase 1 — live-store
- [x] `src/shared/lib/live-store.ts`
- [x] `src/shared/lib/live-store.test.ts` (11 сценариев: refcount, keep-alive, idle TTL, ошибка, `set`, `dispose`, server snapshot)
- [x] `src/shared/lib/use-live-store.ts` (`useSyncExternalStore` + `getServerSnapshot`)
- [x] Мигрировать `useUserProgress`
- [x] Мигрировать `useAssessments` (оптимистичный `store.set`)
- [x] Мигрировать `useProjectProgress`
- [x] Мигрировать `useAchievements`
- [x] Мигрировать `useCurrency`
- [x] Мигрировать `useUserSettings`
- [ ] Проверить отсутствие повторных `start` в ручной матрице
- [x] Коммит: `feat: keep user data subscriptions alive between tabs` — `0e47c7a`

### Phase 2 — единый auth-state
- [x] `src/shared/lib/auth-store.ts` + тест (6 сценариев)
- [x] `src/shared/lib/session-reset.ts` + тест (3 сценария)
- [x] `useFirebaseAuth` → обёртка (`getAuthStore` на провайдер)
- [x] `disposeAll` на sign-out (все 6 сторов + кэш streak)
- [x] `Header` больше не создаёт собственный `onAuthStateChanged`
- [x] Коммит: `perf: share a single auth state across the app` — `7920c07`

### Phase 3 — Header и loading-состояния
- [x] Убрать placeholder-логику из `Header.tsx` (удалены `prompt`-скелетоны, 120 мс, `pending`)
- [x] `profile/loading.tsx`
- [x] `quiz/loading.tsx`
- [x] `study` loading-состояния (2 шт.) + `StudySkeleton`
- [ ] Проверить отсутствие зависания при заблокированном `_rsc` (ручной сценарий)
- [x] Коммит: `fix: stop replacing the current page with a skeleton while navigating` — `1bbf3c3`

### Phase 4 — статичный каркас (опционально)
- [ ] Не требуется после Phase 1: при тёплом кэше `loading=false` с первого рендера. Оставлено на случай холодного кэша.

### Phase 5 — серверная часть
- [x] `src/proxy.ts`: `protectedRoutes` расширен (`/achievements`, `/profile`) — все защищённые страницы теперь покрыты proxy
- [x] Убрать `getCurrentUser`/`redirect` из 7 страниц
- [x] `generateStaticParams` для `/tree/[slug]` (4 грейда)
- [x] `npm run build`: `/dashboard`, `/projects`, `/roadmap`, `/achievements`, `/shop`, `/profile`, `/quiz` — static (○), `/tree/[slug]` — SSG (●)
- [x] `experimental.staleTimes` (`dynamic: 30`, `static: 300`) — страховка для dynamic `/tree/**`
- [x] Версия приложения вне блокирующего рендера: `AbortSignal.timeout(2s)` на GitHub-запросах
- [x] Убрать повторный `execSync` из `version.server.ts` (мемоизация на процесс)
- [x] Коммит: `perf: serve app pages from cache and guard routes before render`

### Phase 6 — одноразовые синхронизации
- [x] `once-per-session` helper + тест (5 сценариев, fallback при заблокированном storage)
- [x] `backfillTotalScore` под guard; при повторном монтаже не читает коллекцию
- [x] TTL кэша `useStreak` (60 c) + сброс при смене пользователя
- [x] Коммит: `perf: sync scores and achievements once per session` — `19c8cb2`

### Phase 7 — study-материалы
- [x] `StudyMaterialContent` принимает `content`/`grade`
- [x] Убрать реестр из клиентского импорта (удалён `useStudyMaterial`)
- [ ] Проверить размер чанка в build output (Turbopack не печатает размеры; проверить `next build --debug` при необходимости)
- [x] Коммит: `perf: load study material text on the server` — `4652354`

### Финал
- [x] `npm run lint` — чисто
- [x] `npm run typecheck` — чисто
- [x] `npm test` — 250 passed, 8 failed. Все 8 падают **до** изменений (проверено `git stash` на базовом коммите): `quiz-questions.test.ts` (2), `currency.test.ts` (3), `scoring.test.ts` (2), `weights.test.ts` (1) — устаревшие ожидания после изменения весов скиллов.
- [x] `npm run build` — успешно; страницы разделов остаются `ƒ dynamic` (см. Phase 5)
- [ ] Ручная матрица §8.2 полностью
- [ ] Сверить метрики §4 (до/после)
- [x] Откат line-ending churn в сгенерированном реестре — `81113ab`
- [ ] Обновить `AGENTS.md` (правило «keep-alive listener»: слушатель переживает навигацию)

---

## 11.1. Журнал коммитов

| Коммит | Что сделано |
|---|---|
| `b6c1568` | `chore: start v1.5.0` (ветка `feat/instant-page-navigation`) |
| `8710d5d` | docs: дизайн-документ |
| `0e47c7a` | Phase 1: `live-store`, миграция 6 хуков |
| `7920c07` | Phase 2: `auth-store`, `session-reset`, Header без своей подписки |
| `1bbf3c3` | Phase 3: Header без placeholder, `loading.tsx` для profile/quiz/study |
| `19c8cb2` | Phase 6: `once-per-session`, TTL streak |
| `4652354` | Phase 7: study-контент на сервере |
| `7d5a568` | Phase 5.2/5.3: `staleTimes`, таймаут версии, мемоизация sha |
| `67f379b` | Phase 5.1: proxy + static/SSG страницы без `cookies()` |
| `81113ab` | chore: откат line-ending churn в сгенерированном реестре |
| `b0f9232` | docs: журнал выполнения + правила в `AGENTS.md` |

---

## 12. Открытые вопросы

1. ~~Phase 5.1~~ — выполнено: proxy расширен, страницы разделов static/SSG.
2. ~~Phase 4~~ — не требуется после Phase 1.
3. ~~Тип ветки~~ — `feat` (1.5.0).
4. **Study (B):** рендерить markdown на сервере, оставив клиентским только кнопку «копировать»? Follow-up, не входит в текущий объём.
5. **Индикатор навигации:** оставлена только точка `useLinkStatus`. Progress-bar не добавлялся.

