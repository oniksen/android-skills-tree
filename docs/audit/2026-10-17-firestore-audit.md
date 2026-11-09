# Аудит и план оптимизации Firestore

- **Дата:** 2026-11-09
- **Статус:** фазы 0, 1 и 2 закрыты (2026-11-09). Фаза 3 (инфраструктура)
  отложена. Документ обновлён под state-document модель.
- **Цель:** зафиксировать фактическую модель данных, уже сделанные оптимизации
  и оставшиеся шаги по снижению количества чтений/записей без потери
  функциональности.

> Фазы 0–2 выполнены. Фаза 2 консолидировала состояние в `users/{uid}/state/current`;
> legacy-коллекции сохранены для отката. Фаза 3 (инфраструктура) отложена.

## 1. Фактическая схема данных (Phase 2: state document)

Источник истины — один документ состояния на пользователя:

```text
users/{uid}/state/current     # UserState (всё состояние)
```

Старые коллекции `progress/current`, `assessments`, `projects`, `achievements`,
`currency/current`, `streaks/current`, `settings/current` сохранены как
legacy-данные для миграции/отката и **больше не пишутся** приложением.

### Поля документа `state/current` (`UserState`)

| Поле | Тип | Описание |
|------|-----|----------|
| `progress` | `UserProgress` | `currentLevelId`, `unlockedLevelIds`, `totalScore` |
| `assessments` | `Record<skillId, Assessment>` | `subtopics`, `score`, `updatedAt` |
| `projects` | `Record<projectId, ProjectProgress>` | `completed`, `completedAt` |
| `achievements` | `Record<achievementKey, Achievement>` | `id`, `type`, `metadata`, `achievedAt` |
| `currency` | `CurrencyData` | `balance`, `items`, `claimedSkills`, `updatedAt` |
| `streak` | `StreakData` | `activeDays`, `frozenDays`, `lastActiveDate`, `currentStreak`, `longestStreak`, `updatedAt` |
| `settings` | `UserSettings` | `maxDailyQuestions`, `dailyCounts`, `groqApiKey`, `groqKeyLast4`, `updatedAt` |
| `migratedAt` | `Date` (опц.) | штамп идемпотентной ленивой миграции |

Примечания:

- Новые достижения пишутся с ключом = `achievementKey(type, metadata)`
  (`category_perfect::<id>`, `level_master::<id>`, `level_up::<to_level>`,
  `streak_<n>`, `path_complete`). Legacy autoId-документы мигрируются в
  детерминированные ключи при первом чтении.
- `readLegacyUserState` (`src/adapters/firestore-client/state.ts`) — единственный
  читатель legacy-коллекций.

## 2. Паттерны доступа (Phase 2)

### Чтение (realtime)

Один `onSnapshot` на документ `users/{uid}/state/current` через
`useUserState` + `userStateStore`. Все доменные хуки читают из одного снапшота.

| Хук | Читает из |
|-----|-----------|
| `useUserProgress` | `state.progress` |
| `useAssessments` | `state.assessments` |
| `useProjectProgress` | `state.projects` |
| `useAchievements` | `state.achievements` |
| `useCurrency` | `state.currency` |
| `useStreak` | `state.streak` |
| `useUserSettings` | `state.settings` |

`useStreak` читает `state.streak` из общего снапшота; `getStreak`/`syncStreak`
используют `readUserState`/транзакцию по `state/current`.

Дополнительные разовые чтения:

- ленивая миграция при первом входе (`readLegacyUserState`) — один раз;
- `checkAchievementsOnce` (защищён общим Set по uid);
- `checkLevelUp` после завершения навыка читает `state/current` через
  `readUserState` (один `getDoc`).

### Запись

- `useAssessments.toggleSubtopic` — одна транзакция по `state/current`:
  assessment + currency + progress.totalScore (начисление кристаллов при
  первом завершении навыка). После транзакции `checkAchievements` вызывается
  только при изменении набора award-ключей, затем `syncStreak` (если включили
  субтопик).
- `buyItem` — транзакция по `state/current` (currency).
- `syncStreak` / `applyAutoFreezes` — транзакции по `state/current`.
- `checkLevelUp` — читает state, затем пишет `state/current` (progress) и
  вызывает `checkAchievements`.
- `reconcileAchievements` — пишет/удаляет достижения в `state/current`
  (`updateDoc`).
- `updateUserProgress` / `updateProgress` — `setDoc({ progress }, { merge: true })`
  только с payload вызывающего.
- `useUserSettings` — запись `setDoc({ settings }, { merge: true })` +
  оптимистичное обновление live-store.

## 3. Что уже сделано

- **Shared live-store** (`src/shared/lib/live-store.ts`,
  `use-live-store.ts`): одна подписка на `uid + домен` на сессию,
  `useSyncExternalStore`, сохранение последнего снапшота при ошибке.
- **`oncePerSession`**: backfill total score и `checkAchievements` больше не
  повторяются на каждом маунте страницы.
- **Единый auth store** (`auth-store.ts`): один `onAuthStateChanged` на
  приложение вместо подписки в каждом хуке.
- **Session reset** при смене пользователя: `disposeAll` для всех live-store и
  очистка кэшей.
- **Оптимистичное обновление** assessments после транзакции.
- **Обработка `permission-denied` и `resource-exhausted`** с тостами.
- **`firestore.rules`** и `firestore.indexes.json` уже есть в репозитории
  (правила: read/write только своих данных; индексы пока не требуются).
- **Фаза 0 (2026-11-09):**
  - `checkAchievements` вызывается только при изменении набора award-ключей
    (`category_perfect`/`level_master`/`path_complete`, порог 7%), а не на
    каждый тоггл;
  - `totalScore` пишется в той же транзакции, что assessment + currency;
  - `reconcileAchievements` использует per-uid cache достижений из live-store,
    `getDocs` — только fallback один раз за сессию;
  - `addStreakAchievementIfNotExists` больше не сканирует коллекцию: cache по
    типу, type-query как fallback, детерминированный id для новых записей;
  - `updateUserProgress` / `updateProgress` мержат только payload вызывающего,
    без перезаписи `currentLevelId`/`unlockedLevelIds` дефолтами.
- **Фаза 1 (2026-11-09):**
  - `reconcileAchievements` пишет/удаляет через `writeBatch` (до 500 операций);
  - удалены мёртвые achievement-хелперы (`addAchievementIfNotExists`,
    `addAchievementsIfNotExists`, `deleteAchievementsByLevel`,
    `deleteCategoryPerfectAchievement`) и их тесты;
  - одновременные `getStreak` дедуплицируются через `streakInFlight`;
  - `useUserSettings` больше не держит realtime-listener: один `getDoc` +
    оптимистичное обновление live-store;
  - dev read counter отложен (не добавлен, чтобы не шуметь в production).
- **Фаза 2 (2026-11-09):**
  - введён единый документ `users/{uid}/state/current` (`UserState`);
  - ленивая идемпотентная миграция из legacy-коллекций (`readLegacyUserState`,
    штамп `migratedAt`);
  - все хуки читают один документ; тоггл — одна транзакция `state/current`;
  - мутации достижений/streak сериализованы per-uid через `runExclusive`
    (in-memory lock) — убирает гонку внутри вкладки;
  - удалены legacy-репозитории/порты и achievement-cache;
  - legacy-коллекции сохранены как migration/rollback данные.

## 4. Оставшиеся проблемы

### Статус после фаз 0–1

| Проблема | Статус |
|----------|--------|
| P0: сканы коллекции достижений | ✅ закрыто (state document; legacy cache удалён) |
| P0: `checkAchievements` на каждый тоггл | ✅ закрыто (award-key set diff) |
| P1: отдельная запись `totalScore` | ✅ закрыто (в транзакции) |
| P1: N assessment-документов | ✅ закрыто (Phase 2: один документ) |
| P1: `checkLevelUp` не транзакционен | ⏳ остаётся (Phase 3) |
| P2: мёртвый код достижений | ✅ закрыто |
| P2: инфраструктура | ⏳ частично: settings listener убран, streak dedupe; offline/App Check остаются |

Обозначения: `K` — число assessment-документов (до ~227), `A` — число
достижений, `P` — число проектов.

### P0. Сканы коллекции достижений — ✅ закрыто

До фазы 0 `reconcileAchievements` (`src/lib/firestore.ts`) делал `getDocs` по
всей коллекции достижений. Он вызывается из `checkAchievements`, а тот — из
`toggleSubtopic` на **каждый** клик по чекбоксу. Дополнительно
`addStreakAchievementIfNotExists` (`streak-commands.ts`) сканировал ту же
коллекцию при каждом `syncStreak`.

Было на один тоггл:

- включение субтопика: транзакция `2` + `checkAchievements` (`A + 2`) +
  `syncStreak` (`A + 1`) = **`2A + 5`**;
- выключение: **`A + 4`**.

При `A = 20` это ~45 и ~24 чтения на один клик.

После фазы 0: cache достижений, fallback `getDocs` один раз за сессию,
`addStreakAchievementIfNotExists` использует cache/type-query вместо скана.

### P0. `checkAchievements` на каждый тоггл — ✅ закрыто

Достижения меняются при пересечении 7% порогов
`category_perfect`/`level_master`/`path_complete` или порогов streak. Теперь
`toggleSubtopic` вычисляет набор award-ключей локально и вызывает
`checkAchievements` только при его изменении.

### P1. Отдельная запись `totalScore` — ✅ закрыто

`toggleSubtopic` держит транзакцию на assessment + currency, а `totalScore`
теперь пишется в `progress/current` в той же транзакции. Отдельного `setDoc`
больше нет.

### P1. N assessment-документов

Стартовая загрузка читает `K` документов коллекции `assessments`. Это самый
дорогой источник чтений при первом входе:

`progress 1 + assessments K + achievements A + projects P + currency 1 +
settings 1 + streak 1` ≈ **`K + A + P + 5`**.

### P1. `checkLevelUp` не транзакционен

Проверка условий и запись уровня/достижения разнесены. Возможны гонки при
быстрых кликах или нескольких вкладках.

### P2. Мёртвый код в слое достижений

`addAchievementIfNotExists`, `addAchievementsIfNotExists`,
`deleteAchievementsByLevel`, `deleteCategoryPerfectAchievement` сейчас не
вызываются из production-кода (только тесты). Их можно удалить или перевести
на детерминированные id, чтобы не поддерживать сканы.

### P2. Инфраструктура

- Нет offline persistence (`enableIndexedDbPersistence`).
- Нет App Check.
- Нет серверной агрегации: клиент сам считает `totalScore`, достижения и
  level-up.
- Timestamps смешаны: клиентский `new Date()` вместо `serverTimestamp()`.
- Данные из Firestore кастуются через `as T` без валидации.

## 5. План оптимизации

### Фаза 0 — быстрые выигрыши (без миграции) — ✅ выполнено

1. **Условный `checkAchievements`.** ✅ В `toggleSubtopic` вызывается только при
   award-key set diff (изменение набора category_perfect/level_master/path_complete, порог 7%). На обычный
   тоггл обновляется только `totalScore`.
2. **Детерминированные id вместо сканов.** ✅
   - `reconcileAchievements` использует per-uid cache достижений из live-store;
     `getDocs` — только fallback один раз за сессию.
   - `addStreakAchievementIfNotExists` проверяет cache по типу, при его
     отсутствии — type-query, затем пишет детерминированный
     `streak_<n>`; legacy autoId не дублируется.
   - Удаление достижений в reconcile идёт по известным id.
3. **`totalScore` в ту же транзакцию**, что и assessment + currency. ✅
4. **`writeBatch`** для массовых записей/удалений достижений. ✅ выполнено в
   фазе 1 (батчи до 500 операций).
5. **`updateUserProgress` / `updateProgress`** — `setDoc(data, { merge: true })`
   **только с payload вызывающего**. ✅ Важно: не добавлять дефолты в merge,
   иначе частичное обновление перезапишет `currentLevelId`/`unlockedLevelIds`.
   Дефолты остаются в `getUserProgress`/progress-repository.
6. Удалить мёртвые функции достижений или перевести их на id. ✅ выполнено в
   фазе 1: `addAchievementIfNotExists`, `addAchievementsIfNotExists`,
   `deleteAchievementsByLevel`, `deleteCategoryPerfectAchievement` удалены
   вместе с тестами.

Фактический эффект: обычный тоггл — **2–4 чтения вместо `2A + 5`**; сканы
коллекции достижений в hot path отсутствуют. Проверки: `npm run lint`,
`npm run typecheck` — чисто; `npm test` — 301 passed, 8 pre-existing failures
в data-driven тестах (weights/currency/scoring/quiz-questions), не связанных
с Firestore.

### Фаза 1 — объединение чтений и cleanup — ✅ выполнено

1. ~~In-memory кэш достижений~~ — ✅ сделано в фазе 0.
2. `writeBatch` в `reconcileAchievements` + удаление мёртвых функций достижений.
   ✅ Батчи до 500 операций, хелперы и их тесты удалены.
3. `useStreak`: оставлен TTL-кэш, добавлен `streakInFlight` для дедупликации
   одновременных `getDoc`. ✅
4. `useUserSettings`: realtime-listener заменён на один `getDoc` +
   оптимистичное обновление store. ✅ Минус один listener.
5. Dev-счётчик вызовов `getDoc`/`getDocs` — ⏳ отложен: не добавляли
   instrumentation в production-код.

Фактический эффект: меньше round-trip на запись, 5 listeners вместо 6,
предсказуемые чтения на старте.

### Фаза 2 — консолидация документов — ✅ выполнено

Введён единый документ состояния `users/{uid}/state/current` (`UserState`) с
картами:

```text
assessments: Record<skillId, { subtopics, score, updatedAt }>
projects:    Record<projectId, { completed, completedAt }>
achievements: Record<achievementKey, Achievement>
currency, streak, settings, progress — вложенными полями
```

Все доменные хуки читают **один документ** через `useUserState`. Тоггл —
одна транзакция по `state/current`: **1 чтение + 1 запись**. Стартовая
загрузка — **1 документ** вместо `K + A + P`.

Миграция:

- идемпотентная функция при первом входе: если `state/current` нет — собрать из
  старых коллекций, записать, поставить `migratedAt`;
- старые коллекции сохранены как migration/rollback данные и больше не пишутся;
- runtime-проверка размера документа не добавлена; лимит 1 MiB остаётся
  риском, шардирование assessments по уровням — fallback на будущее;
- `firestore.rules` покрывают новый путь через `users/{uid}/{document=**}`;
- legacy-репозитории, порты и achievement-cache удалены.

Это единственный этап, который изменил ранее согласованное решение «без
изменения схемы». Он выполнен после фаз 0–1, когда метрики всё ещё показывали
высокий расход на старте.

### Фаза 3 — инфраструктура

- Cloud Functions/Firestore triggers для достижений и level-up
  (server-authoritative): клиент пишет только assessment.
- Offline persistence (IndexedDB, multi-tab).
- App Check для защиты квоты.
- Мониторинг Usage, budget alerts, логирование `resource-exhausted`.
- `serverTimestamp()` для доверенного времени.
- Валидация/normalize прочитанных документов.

## 6. Метрики успеха

| Метрика | Сейчас | Цель |
|---------|--------|------|
| Чтения на обычный тоггл | `2–4` (было `A + 4 … 2A + 5`) | ≤ 3 |
| Чтения на первый вход | `1–3` (state document) | 1–3 (фаза 2) |
| `getDocs` в hot path | нет; legacy читается только при миграции | 0 |
| Listeners на пользователя | 1 | 1 |

Проверка после каждого этапа: `npm run lint`, `npm run typecheck`, `npm test`.
Дополнительно — Firebase Console → Usage и эмулятор Firestore для сравнения
чтений до/после.

## 7. Риски

- **Лимит документа 1 MiB**: runtime-проверка размера не добавлена; шардирование
  assessments по уровням остаётся fallback, если данные приблизятся к лимиту.
- **Миграция**: идемпотентная, выполняется при первом чтении; старые коллекции
  сохранены для отката и больше не пишутся.
- **Security rules**: путь `state/current` покрыт правилом
  `users/{uid}/{document=**}`; server-authoritative запись всё ещё не внедрена.
- **Тесты**: тесты Firestore переведены на state-документ; legacy-пути
  проверяются только в `state.test.ts` (миграция).
- **Консистентность**: XP, кристаллы, streak и достижения теперь меняются в
  одном документе; операции с достижениями/streak сериализованы per-uid внутри
  вкладки. Cross-tab race между `updateDoc(achievements)` и транзакцией streak
  остаётся; его закрывает Phase 3 (server-authoritative/Cloud Functions).

## 8. Итог

- Фаза 0 закрыта: условный `checkAchievements`, кэш достижений вместо сканов,
  `totalScore` в транзакции, корректный partial merge прогресса.
- Фаза 1 закрыта: `writeBatch`, cleanup мёртвого кода, дедупликация streak,
  удаление settings-listener; dev read counter отложен.
- Фаза 2 закрыта: консолидация в `users/{uid}/state/current`, ленивая
  миграция, удаление legacy-репозиториев и achievement-cache; legacy-коллекции
  сохранены для отката.
- Фаза 3 отложена: инфраструктура (Cloud Functions, offline, App Check).
- Следующий шаг — решение по фазе 3.

## 9. Процесс реализации: subagent-driven

Реализация плана выполняется через субагентов. Оркестратор (текущая сессия)
декомпозирует фазу на независимые задачи, запускает их последовательно и
проверяет результат после каждого этапа.

### Роли и модели

| Роль | Модель | Ответственность |
|------|--------|-----------------|
| Оркестратор | `opencode-go/deepseek-v4.1-flash` | декомпозиция, постановка задач, review, финальная верификация, обновление плана |
| Субагент-реализатор | `opencode-go/beam-free` | написание кода и тестов в рамках одной задачи, запуск локальных проверок |

Правила:

- Каждая задача субагента имеет точный scope: файлы, ожидаемое поведение,
  тесты и критерии готовности. Свежая сессия субагента не помнит контекст,
  поэтому в prompt передаются все нужные ссылки и ограничения.
- Субагенты не запускаются параллельно на одних и тех же файлах. Если задачи
  независимы, допускается параллельный запуск в отдельных worktree.
- Субагент не коммитит и не пушит изменения; коммит делает оркестратор после
  успешного review.
- После каждого этапа оркестратор переключается обратно на
  `opencode-go/deepseek-v4.1-flash` и проводит review.

### Review после этапа

Обязательный чек-лист:

1. Diff соответствует задаче; нет несвязанных изменений.
2. Чтения/записи действительно сократились по заявленным метрикам.
3. `npm run lint`, `npm run typecheck`, `npm test` проходят.
4. Нет регрессий в XP, кристаллах, streak, достижениях и level-up.
5. Обновлены тесты путей/моков, если менялись Firestore-пути.
6. План и статус фазы обновлены в этом документе.

Если review находит проблему, создаётся fix-задача для
`opencode-go/beam-free`; цикл повторяется до прохождения чек-листа.

### Порядок этапов

| Этап | Статус | Реализатор | Review | Выход |
|------|--------|------------|--------|-------|
| Фаза 0 | ✅ выполнено | `opencode-go/beam-free` | `opencode-go/deepseek-v4.1-flash` | нет сканов достижений в hot path, обычный тоггл 2–4 чтения |
| Фаза 1 | ✅ выполнено | `opencode-go/beam-free` | `opencode-go/deepseek-v4.1-flash` | `writeBatch`, cleanup мёртвого кода, 5 listeners, streak dedupe |
| Фаза 2 | ✅ выполнено | `opencode-go/beam-free` | `opencode-go/deepseek-v4.1-flash` | state document, ленивая миграция, cleanup legacy |
| Фаза 3 | ⏸ отложена | `opencode-go/beam-free` | `opencode-go/deepseek-v4.1-flash` | инфраструктурные улучшения по отдельному согласованию |

Коммиты — conventional commits; после review и зелёных проверок оркестратор
делает коммит с понятным пользовательским сообщением.
