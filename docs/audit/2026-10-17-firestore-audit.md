# Аудит и план оптимизации Firestore

- **Дата:** 2026-11-09
- **Статус:** фаза 0 закрыта (2026-11-09). Ранее уже были внедрены live-store,
  `oncePerSession`, единый auth store и оптимистичные обновления. Фаза 1
  закрыта частично (`writeBatch`, cleanup, streak/settings). Фаза 2
  (консолидация документов) не начата.
- **Цель:** зафиксировать фактическую модель данных, уже сделанные оптимизации
  и оставшиеся шаги по снижению количества чтений/записей без потери
  функциональности.

> Решение «не менять схему» остаётся в силе для фаз 0–1. Консолидация в один
> документ (фаза 2) — отдельное решение, требует миграции и явного согласования.

## 1. Фактическая схема данных

Все данные изолированы по пользователю под `users/{uid}`:

```text
users/{uid}/
├── progress/current          # UserProgress
├── assessments/{skillId}     # Assessment, один документ на навык
├── projects/{projectId}      # ProjectProgress
├── achievements/{docId}      # Achievement; новые — achievementKey, legacy — autoId
├── currency/current          # CurrencyData
├── streaks/current           # StreakData
└── settings/current          # UserSettings
```

### Поля документов

| Путь | Поля |
|------|------|
| `progress/current` | `currentLevelId: string`, `unlockedLevelIds: string[]`, `totalScore: number` |
| `assessments/{skillId}` | `subtopics: Record<string, boolean>`, `score: number`, `updatedAt: Date` |
| `projects/{projectId}` | `completed: boolean`, `completedAt: Date \| null` |
| `achievements/{docId}` | `type: string`, `metadata: Record<string, unknown>`, `achievedAt: Date` |
| `currency/current` | `balance: number`, `items: Record<string, number>`, `claimedSkills?: Record<string, string>`, `updatedAt: Date` |
| `streaks/current` | `activeDays: string[]`, `frozenDays: string[]`, `lastActiveDate: string`, `currentStreak: number`, `longestStreak: number`, `updatedAt: Date` |
| `settings/current` | `maxDailyQuestions: number`, `dailyCounts?: Record<string, number>`, `groqApiKey?: string`, `groqKeyLast4?: string`, `updatedAt: Date` |

Примечания:

- Коллекция серии называется `streaks` (множественное число), остальные — по
  имени сущности.
- Новые достижения пишутся с id = `achievementKey(type, metadata)`
  (`category_perfect::<id>`, `level_master::<id>`, `level_up::<to_level>`,
  `streak_<n>`, `path_complete`). Старые документы могут иметь autoId, поэтому
  `reconcileAchievements` до сих пор умеет «переезжать» на детерминированный id.

## 2. Паттерны доступа

### Чтение (realtime)

Шесть `onSnapshot`-подписок на пользователя, по одной на домен. Все они созданы
через `createLiveStore` и живут весь сеанс, поэтому переход между страницами не
пересоздаёт подписку.

| Хук | Слушает | Тип |
|-----|---------|-----|
| `useUserProgress` | `progress/current` | doc |
| `useAssessments` | `assessments` | вся коллекция |
| `useProjectProgress` | `projects` | вся коллекция |
| `useAchievements` | `achievements` | вся коллекция |
| `useCurrency` | `currency/current` | doc |
| `useUserSettings` | `settings/current` | doc |

`useStreak` **не** использует `onSnapshot`: он делает `getDoc` через
`getStreak` и кэширует результат на 60 секунд (`STREAK_TTL_MS`). Auto-freeze
запускается один раз за сессию.

Дополнительные разовые чтения:

- первый монтаж `useUserProgress` за сессию: `readAssessmentMap` +
  `backfillTotalScore` + `checkAchievementsOnce`;
- `checkAchievementsOnce` из `useAchievements` (защищён общим Set по uid);
- `checkLevelUp` после завершения навыка: `getUserProgress` +
  `readAssessmentMap` + `getProjectProgressMap` (если у следующего уровня есть
  требования по проектам).

### Запись

- `useAssessments.toggleSubtopic` — транзакция: `assessments/{skillId}` +
  `currency/current` (начисление кристаллов при первом завершении навыка).
  После транзакции — отдельный `setDoc(progress/current, { totalScore })`,
  затем `checkAchievements`, затем `syncStreak` (если включили субтопик).
- `buyItem` — транзакция по `currency/current`.
- `syncStreak` / `applyAutoFreezes` — транзакции по `streaks/current` и
  `currency/current`.
- `checkLevelUp` — **не транзакция**: читает прогресс/оценки/проекты, затем
  отдельно пишет `progress/current` и вызывает `checkAchievements`.
- `reconcileAchievements` — читает всю коллекцию достижений и пишет/удаляет
  документы последовательно.
- `updateUserProgress` — `getDoc` + `updateDoc`/`setDoc`.

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

## 4. Оставшиеся проблемы

### Статус после фазы 0

| Проблема | Статус |
|----------|--------|
| P0: сканы коллекции достижений | ✅ закрыто (cache + type-query fallback) |
| P0: `checkAchievements` на каждый тоггл | ✅ закрыто (award-key set diff) |
| P1: отдельная запись `totalScore` | ✅ закрыто (в транзакции) |
| P1: N assessment-документов | ⏳ остаётся, фаза 2 |
| P1: `checkLevelUp` не транзакционен | ⏳ остаётся |
| P2: мёртвый код достижений | ⏳ остаётся |
| P2: инфраструктура | ⏳ остаётся |

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
4. **`writeBatch`** для массовых записей/удалений достижений. ⏳ отложено до
   фазы 1: текущий reconcile последовательный, но чтения уже не сканируют
   коллекцию.
5. **`updateUserProgress` / `updateProgress`** — `setDoc(data, { merge: true })`
   **только с payload вызывающего**. ✅ Важно: не добавлять дефолты в merge,
   иначе частичное обновление перезапишет `currentLevelId`/`unlockedLevelIds`.
   Дефолты остаются в `getUserProgress`/progress-repository.
6. Удалить мёртвые функции достижений или перевести их на id. ⏳ отложено:
   `addAchievementIfNotExists`, `addAchievementsIfNotExists`,
   `deleteAchievementsByLevel`, `deleteCategoryPerfectAchievement` всё ещё
   не используются в production, но их тесты пока сохранены.

Фактический эффект: обычный тоггл — **2–4 чтения вместо `2A + 5`**; сканы
коллекции достижений в hot path отсутствуют. Проверки: `npm run lint`,
`npm run typecheck` — чисто; `npm test` — 301 passed, 8 pre-existing failures
в data-driven тестах (weights/currency/scoring/quiz-questions), не связанных
с Firestore.

### Фаза 1 — объединение чтений и cleanup

1. ~~In-memory кэш достижений~~ — ✅ сделано в фазе 0.
2. Добавить `writeBatch` в `reconcileAchievements` и удалить/перевести на id
   мёртвые функции достижений.
3. Перевести `useStreak` на общий live-store (или оставить TTL, но убрать
   дублирующие `getDoc` при монтировании нескольких компонентов).
4. Оценить `useUserSettings`: если realtime не нужен, заменить `onSnapshot` на
   `getDoc` + оптимистичное обновление store (минус один listener).
5. Добавить dev-счётчик вызовов `getDoc`/`getDocs`, чтобы измерять чтения до/после.

Ожидаемый эффект: меньше round-trip на запись, минус один listener;
предсказуемые чтения на старте.

### Фаза 2 — консолидация документов (опционально, с миграцией)

Ввести единый документ состояния `users/{uid}/state/current` (или расширить
`progress/current`) с картами:

```text
assessments: Record<skillId, { subtopics, score, updatedAt }>
projects:    Record<projectId, { completed, completedAt }>
achievements: Record<achievementKey, Achievement>
currency, streak, settings, progress — вложенными полями
```

Все хуки слушают **один документ**. Тоггл становится одной транзакцией:
**1 чтение + 1 запись**. Стартовая загрузка — **1–3 документа** вместо
`K + A + P`.

Миграция:

- идемпотентная функция при первом входе: если `state/current` нет — собрать из
  старых коллекций, записать, поставить `migratedAt`;
- старые коллекции не удалять сразу (rollback);
- проверить размер документа (лимит 1 MiB); при приближении — шардить
  assessments по уровням;
- обновить `firestore.rules`, тесты путей и моки.

Это единственный этап, который меняет ранее согласованное решение «без
изменения схемы». Он выполняется только если после фаз 0–1 метрики всё ещё
показывают высокий расход.

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
| Чтения на первый вход | `K + A + P + 5` | ≤ 10 (фаза 1), 1–3 (фаза 2) |
| `getDocs` в hot path | нет; только fallback достижений раз за сессию | 0 |
| Listeners на пользователя | 6 | 6 (фаза 1), 1 (фаза 2) |

Проверка после каждого этапа: `npm run lint`, `npm run typecheck`, `npm test`.
Дополнительно — Firebase Console → Usage и эмулятор Firestore для сравнения
чтений до/после.

## 7. Риски

- **Лимит документа 1 MiB** в фазе 2: нужен расчёт размера и план шардирования.
- **Миграция**: должна быть идемпотентной и обратимой; старые коллекции
  сохраняются до проверки.
- **Security rules**: новые пути должны быть разрешены; сейчас правила
  client-write, server-authoritative ещё не внедрён.
- **Тесты**: `firestore.test.ts`, `firestore-actions.test.ts`,
  `firestore-actions-levelup.test.ts` завязаны на пути и моки — обновить вместе
  с изменениями.
- **Консистентность**: объединение `totalScore` в транзакцию и удаление сканов
  не должны менять игровые правила (XP, кристаллы, streak, достижения).

## 8. Итог

- Фаза 0 закрыта: условный `checkAchievements`, кэш достижений вместо сканов,
  `totalScore` в транзакции, корректный partial merge прогресса.
- Фазы 0–1 не меняют схему и дают основной выигрыш в hot path.
- Фаза 2 — максимальный эффект по чтениям, но требует миграции и отдельного
  согласования.
- Фаза 3 — следующий уровень надёжности и защиты квоты.
- Следующий шаг — фаза 1: `writeBatch`, cleanup мёртвого кода, `useStreak` и
  `useUserSettings`.

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
| Фаза 1 | ⏳ следующая | `opencode-go/beam-free` | `opencode-go/deepseek-v4.1-flash` | `writeBatch`, cleanup мёртвого кода, `useStreak`/`useUserSettings` |
| Фаза 2 | ⏸ не начата | `opencode-go/beam-free` | `opencode-go/deepseek-v4.1-flash` | согласованная миграция на `state/current` или решение отложить |
| Фаза 3 | ⏸ не начата | `opencode-go/beam-free` | `opencode-go/deepseek-v4.1-flash` | инфраструктурные улучшения по отдельному согласованию |

Коммиты — conventional commits; после review и зелёных проверок оркестратор
делает коммит с понятным пользовательским сообщением.
