# Аудит Firestore

- **Дата:** 2026-10-17
- **Цель:** описать фактическую модель данных, паттерны доступа и предложить
  улучшения без изменения схемы (решение согласовано).

## 1. Фактическая схема данных

Все данные изолированы по пользователю под `users/{uid}`:

```
users/{uid}/
├── progress/current        # UserProgress
├── assessments/{skillId}   # Assessment (по одному документу на навык)
├── projects/{projectId}    # ProjectProgress
├── achievements/{autoId}   # Achievement (авто-id)
├── currency/current        # CurrencyData
└── streaks/current         # StreakData
```

### Поля документов

| Путь | Поля |
|------|------|
| `progress/current` | `currentLevelId: string`, `unlockedLevelIds: string[]`, `totalScore: number` |
| `assessments/{skillId}` | `subtopics: Record<string, boolean>`, `score: number`, `updatedAt: Date` |
| `projects/{projectId}` | `completed: boolean`, `completedAt: Date \| null`, (в `resetLevelProgress` фильтр по `levelId`) |
| `achievements/{autoId}` | `type: string`, `metadata: Record<string, unknown>`, `achievedAt: Date` |
| `currency/current` | `balance: number`, `items: Record<string, number>`, `claimedSkills?: Record<string, string>`, `updatedAt: Date` |
| `streaks/current` | `activeDays: string[]`, `frozenDays: string[]`, `lastActiveDate: string`, `currentStreak: number`, `longestStreak: number`, `updatedAt: Date` |

> Примечание: коллекция серии называется `streaks` (во множественном числе),
> остальные — по имени сущности. Несогласованность именования.

## 2. Паттерны доступа (текущие)

### Чтение (realtime)
Шесть `onSnapshot`-листенеров на сессию:

| Хук | Слушает |
|-----|---------|
| `useUserProgress` | `progress/current` (doc) |
| `useCurrency` | `currency/current` (doc) |
| `useStreak` | `streaks/current` (doc) |
| `useAssessments` | `assessments` (**вся коллекция**) |
| `useProjectProgress` | `projects` (**вся коллекция**) |
| `useAchievements` | `achievements` (**вся коллекция**) |

Плюс `useUserProgress` при каждом входе вызывает `readAssessmentMap` +
`backfillTotalScore` + `checkAchievements` (дополнительные чтения всей коллекции
assessments и achievements).

### Запись
- `useAssessments.toggleSubtopic` — транзакция: обновляет `assessments/{skillId}`
  и `currency/current` (начисляет кристаллы, если навык завершён впервые).
- `currency.buyItem` — транзакция по `currency/current`.
- `streak.syncStreak` / `applyAutoFreezes` — транзакции по `streaks/current`
  и `currency/current`. **Молодцы: критичные операции уже в транзакциях.**
- `firestore-actions.checkLevelUp` — **не транзакция**: читает прогресс/оценки,
  затем пишет `progress/current` и достижение отдельными вызовами. Возможны гонки.
- `firestore-actions.resetLevelProgress` — циклы `deleteDoc` (N последовательных
  записей), не batch.

## 3. Проблемы и предложения

### 3.1 Дублирование слоя доступа
`getUserProgress`, `updateUserProgress`, `getProjectProgressMap` реализованы в
`src/lib/firestore.ts` **и** `src/lib/firestore-actions.ts`.

**Предложение.** Единый модуль путей + одна реализация на функцию; убрать мёртвый
код (`saveAssessment`, `toggleProjectCompletion`, `deleteProjectProgress`,
`createDefaultUserProgress`, `queries.ts` — используются ли они вообще).

### 3.2 Отсутствие констант путей и типизации
Строки `doc(db, "users", uid, "assessments", skillId)` разбросаны по файлам.

**Предложение.** Ввести `core`-константы путей и типизированные конвертеры
(`converter<T>()`), чтобы структура Firestore была описана в одном месте.

### 3.3 Смешанные клиентские записи
См. `security-audit` S3. В целевой архитектуре записи переносятся в серверный
слой; `firestore-actions.ts` (client) заменяется серверными сценариями.

### 3.4 Неатомарность `checkLevelUp`
Проверка условий и запись уровня/достижения не транзакционны.

**Предложение.** Обернуть в `runTransaction` (signal server-side) или в Admin
`runTransaction`, чтобы условия и запись были атомарны.

### 3.5 Батчинг удаления
`resetLevelProgress` удаляет документы в цикле.

**Предложение.** Использовать `writeBatch` (до 500 операций на батч).

### 3.6 Timestamps
Смешение `new Date()` на клиенте и потенциального `serverTimestamp()`. При
server-authoritative важно писать `FieldValue.serverTimestamp()` — доверенное
время сервера.

### 3.7 Полные коллекции в listeners
`assessments`/`projects`/`achievements` слушаются целиком. Сейчас объёмы небольшие
(~227 навыков), но каждое изменение документа → повторная доставка. Для будущего
масштаба:

**Предложение.**
- слушать только `doc` там, где нужен агрегат;
- либо вычислять агрегаты (`totalScore`, счётчики) на сервере и слушать один
  `progress/current`;
- при росте коллекций — пагинация/`limit()`.

### 3.8 Валидация на границе
Данные из Firestore кастуются через `as UserProgress` без проверки.

**Предложение.** Валидировать/нормализовать (zod) при чтении, чтобы некорректные
документы не ломали UI.

### 3.9 Индексы и правила
В репозитории нет `firestore.indexes.json` и `firestore.rules`. Текущие запросы —
чтение коллекций без `where`/`orderBy`, составные индексы пока не требуются, но
правила обязательны (см. `security-audit` S2).

## 4. Итог

- **Схему сохраняем** (миграция данных не нужна).
- **Немедленно:** правила Firestore в репозитории; устранение дублей и мёртвого кода;
  `writeBatch` в `resetLevelProgress`; транзакция в `checkLevelUp`.
- **В рамках server-authoritative:** все записи — через Admin SDK; агрегаты
  (`totalScore`, баланс, streak) считаются сервером; клиент только читает/слушает.
