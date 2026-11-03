# Дизайн: пересчёт достижений по тирам

Дата: 2026-11-03
Ветка: `fix/achievement-reconciliation`
Тип изменения: `fix` (исправление данных и правил выдачи)

## 1. Задача

Сейчас достижения выдаются только при 100% прогрессе и никогда не пересчитываются после изменения данных. В результате в Firestore лежат достижения, которые уже не соответствуют прогрессу, а достижения, которые должны быть получены по новым правилам, отсутствуют.

Новое правило: **достижение считается полученным, как только достигнут первый тир — 7% прогресса**. Тир и процент до следующего тира считаются из текущего прогресса на лету и в Firestore не сохраняются.

Нужно:

1. Приводить коллекцию `users/{uid}/achievements` к состоянию, которое соответствует текущему прогрессу (добавлять недостающие, удалять лишние, чинить старые документы).
2. Делать это автоматически: раз за сессию и после каждого изменения прогресса.
3. Не терять `achievedAt` у достижений, которые остаются валидными.

## 2. Правила выдачи (зафиксировано)

Порог первого тира: `ACHIEVEMENT_TIERS[0].threshold === 7`.

| Тип | Когда считается полученным | Метаданные |
| --- | --- | --- |
| `category_perfect` | `calcCategoryCompletionPercent(cat.id) >= 7` | `category_id`, `category_name`, `level_id` |
| `level_master` | `calcLevelCompletionPercent(level.id) >= 7` | `level_id`, `level_name`, `level_slug` |
| `path_complete` | `calcTotalCompletionPercent(...) >= 7` | `{}` |
| `level_up` | уровень `to` есть в `unlockedLevelIds` (или равен `currentLevelId`) | `from_level`, `to_level` |
| `streak_<N>` | `longestStreak >= N`, где `N` из `STREAK_ACHIEVEMENT_DAYS` | `days` |

Дополнительно:

- Если прогресс упал ниже 7% (сняли подтемы или изменились данные), достижение удаляется при следующей синхронизации.
- `tier`, `tierProgress`, `total_score` в метаданные **не писать**. Они вычисляются в UI через `getAchievementProgress`. Старые значения в существующих документах не трогать.
- Названия типов не переименовывать: `category_perfect`, `level_master`, `path_complete`, `level_up`, `streak_<N>` остаются как есть (на них завязаны существующие документы и каталог).
- Дедупликация: `level_up` теперь ключуется по `to_level`, чтобы можно было хранить несколько повышений.

Важное следствие правила: `path_complete` тоже открывается на 7% от всего дерева. Если позже понадобится вернуть для него планку 100%, это меняется одной константой `PATH_COMPLETE_UNLOCK_THRESHOLD`.

## 3. Что уже известно про данные пользователя

UID: `OHu8aWkuNna2O0BbWvadrVo4Rm33` (проверено через Firestore REST).

Сейчас в `users/{uid}/achievements` ровно 2 документа:

- `category_perfect::junior-osnovy`
- `category_perfect::junior-kotlin`

Оба проходят порог 7% (прогресс ~22%), поэтому при реконсиляции они должны остаться с прежними датами.

Прогресс уровней/категорий (по текущим данным):

- `junior-osnovy` — ~22%
- `junior-kotlin` — ~22%
- `junior-android` — ~11%
- остальные категории Junior — 0%
- уровень Junior — ~8%
- весь путь — меньше 7%

Ожидаемый результат после первого запуска: 4 достижения.

- `category_perfect::junior-osnovy` (остаётся, дата 2026-10-06)
- `category_perfect::junior-kotlin` (остаётся, дата 2026-10-17)
- `category_perfect::junior-android` (добавляется, дата — сегодня)
- `level_master::junior` (добавляется, дата — сегодня)

`path_complete`, `level_up`, стрики — отсутствуют (прогресс/стрик ниже порогов; максимум стрика 6).

## 4. Изменения по файлам

Порядок реализации — сверху вниз. После каждого шага проект должен оставаться типобезопасным.

### 4.1 `src/core/domain/achievement-conditions.ts`

Изменить:

1. Добавить импорт `STREAK_ACHIEVEMENT_DAYS` из `@/core/domain/streak` и `ACHIEVEMENT_TIERS` из `@/core/domain/achievement-tiers`.
2. Добавить константы:

```ts
export const ACHIEVEMENT_UNLOCK_THRESHOLD = ACHIEVEMENT_TIERS[0].threshold;
export const PATH_COMPLETE_UNLOCK_THRESHOLD = ACHIEVEMENT_UNLOCK_THRESHOLD;

export interface AchievementContext {
  assessmentMap: AssessmentMap;
  longestStreak?: number;
  unlockedLevelIds?: string[];
}
```

3. В `ACHIEVEMENT_MATCH_KEY` добавить `level_up: "to_level"`.
4. Удалить из `AchievementAward` поля `tier` и `tierProgress` (они больше не заполняются).
5. Полностью заменить `evaluateAchievements`:

```ts
export function evaluateAchievements(context: AchievementContext): AchievementAward[] {
  const { assessmentMap, longestStreak = 0, unlockedLevelIds = [] } = context;
  const awards: AchievementAward[] = [];

  for (const cat of categories) {
    const progress = calcCategoryCompletionPercent(cat.id, assessmentMap);
    if (progress < ACHIEVEMENT_UNLOCK_THRESHOLD) continue;
    awards.push({
      type: "category_perfect",
      metadata: {
        category_id: cat.id,
        category_name: cat.name,
        level_id: cat.levelId,
      },
      matchKey: ACHIEVEMENT_MATCH_KEY.category_perfect,
      matchValue: cat.id,
    });
  }

  for (const level of levels) {
    const progress = calcLevelCompletionPercent(level.id, assessmentMap);
    if (progress < ACHIEVEMENT_UNLOCK_THRESHOLD) continue;
    awards.push({
      type: "level_master",
      metadata: {
        level_id: level.id,
        level_name: level.name,
        level_slug: level.slug,
      },
      matchKey: ACHIEVEMENT_MATCH_KEY.level_master,
      matchValue: level.id,
    });
  }

  const totalProgress = calcTotalCompletionPercent(assessmentMap);
  if (totalProgress >= PATH_COMPLETE_UNLOCK_THRESHOLD) {
    awards.push({ type: "path_complete", metadata: {} });
  }

  const unlocked = new Set(unlockedLevelIds);
  for (let i = 0; i < levels.length - 1; i += 1) {
    const from = levels[i];
    const to = levels[i + 1];
    if (!unlocked.has(to.id)) continue;
    awards.push({
      type: "level_up",
      metadata: { from_level: from.name, to_level: to.name },
      matchKey: ACHIEVEMENT_MATCH_KEY.level_up,
      matchValue: to.name,
    });
  }

  for (const days of STREAK_ACHIEVEMENT_DAYS) {
    if (longestStreak < days) continue;
    awards.push({ type: `streak_${days}`, metadata: { days } });
  }

  return awards;
}
```

6. `getAchievementProgress` принимает `def: { type: string; id: string; toLevelId?: string }`. Ветку `level_up` переписать без парсинга строки:

```ts
} else if (def.type === "level_up") {
  const nextLevel = def.toLevelId
    ? levels.find((level) => level.id === def.toLevelId)
    : undefined;
  const threshold = nextLevel ? getLevelMinScore(nextLevel.id) : 0;
  const totalScore = calcTotalScore(context.assessmentMap);
  progress = threshold > 0 ? Math.min((totalScore / threshold) * 100, 100) : 100;
}
```

Функции `isCategoryPerfect`, `isLevelMastered`, `achievementKey`, `selectMissingAwards`, `getAchievementProgress` оставить. Импорт `getAchievementTier/getTierProgress` из `achievement-tiers` пока нужен только для `getAchievementProgress`; импорт `ACHIEVEMENT_TIERS` нужен для порога.

### 4.2 `src/data/achievements.ts`

В интерфейс `AchievementDef` добавить необязательные поля:

```ts
fromLevelId?: string;
toLevelId?: string;
```

В цикле, который создаёт `level_up`, заполнить их:

```ts
fromLevelId: from.id,
toLevelId: to.id,
```

Условия (`condition`) не менять — это текст про конечную цель (100%), он остаётся.

### 4.3 `src/lib/firestore.ts`

Добавить `reconcileAchievements`. Существующие функции (`addAchievementsIfNotExists`, `addAchievementIfNotExists`, `deleteAchievementsByLevel`, `deleteCategoryPerfectAchievement`) **не удалять** — на них есть тесты; просто перестать вызывать их из логики выдачи.

```ts
export interface ReconcileAchievementsResult {
  added: number;
  removed: number;
  updated: number;
}

export async function reconcileAchievements(
  uid: string,
  awards: AchievementAward[],
): Promise<ReconcileAchievementsResult> {
  const achievementsRef = collection(db, ...userAchievementsPath(uid));
  const snap = await getDocs(achievementsRef);

  const desired = new Map<string, AchievementAward>();
  for (const award of awards) {
    desired.set(achievementKey(award.type, award.metadata), award);
  }

  const result: ReconcileAchievementsResult = { added: 0, removed: 0, updated: 0 };
  const kept = new Map<string, (typeof snap.docs)[number]>();

  for (const achievementDoc of snap.docs) {
    const data = achievementDoc.data() as {
      type?: unknown;
      metadata?: Record<string, unknown>;
    };

    if (typeof data.type !== "string") {
      await deleteDoc(achievementDoc.ref);
      result.removed += 1;
      continue;
    }

    const key = achievementKey(data.type, data.metadata);
    if (!desired.has(key) || kept.has(key)) {
      await deleteDoc(achievementDoc.ref);
      result.removed += 1;
      continue;
    }

    kept.set(key, achievementDoc);
  }

  for (const [key, award] of desired) {
    const existing = kept.get(key);

    if (!existing) {
      await setDoc(doc(achievementsRef, key), {
        type: award.type,
        metadata: award.metadata,
        achievedAt: new Date(),
      });
      result.added += 1;
      continue;
    }

    const existingData = existing.data() as {
      metadata?: Record<string, unknown>;
      achievedAt?: unknown;
    };
    const existingMetadata = existingData.metadata ?? {};
    const metadataChanged = Object.entries(award.metadata).some(
      ([field, value]) => existingMetadata[field] !== value,
    );
    const needsMove = existing.id !== key;

    if (!metadataChanged && !needsMove) continue;

    await setDoc(doc(achievementsRef, key), {
      type: award.type,
      metadata: { ...existingMetadata, ...award.metadata },
      achievedAt: existingData.achievedAt ?? new Date(),
    });
    result.updated += 1;

    if (needsMove) {
      await deleteDoc(existing.ref);
      result.removed += 1;
    }
  }

  return result;
}
```

Почему так:

- ключ документа = `achievementKey(...)`, чтобы потом можно было обновлять документ по id;
- старые документы с auto-id переносятся на ключевой id, дата сохраняется;
- метаданные сравниваются только по полям из `award.metadata`, поэтому старые `tier`/`total_score` не вызывают лишних записей;
- дубликаты и неизвестные типы удаляются.

### 4.4 `src/lib/firestore-actions.ts`

1. Импортировать `getStreak` рядом с `syncStreak` из `@/adapters/firestore-client/streak-commands`.
2. Импортировать `reconcileAchievements` из `@/lib/firestore`.
3. Убрать импорт `addAchievementIfNotExists` (и `addAchievementsIfNotExists`, если после правок он не используется).
4. Заменить `checkAchievements`:

```ts
export async function checkAchievements(
  uid: string,
  preloadedMap?: PreloadedAssessments,
) {
  const assessmentMap = await (preloadedMap ?? readAssessmentMap(uid));
  const [progress, streak] = await Promise.all([
    getUserProgress(uid),
    getStreak(uid),
  ]);

  const awards = evaluateAchievements({
    assessmentMap,
    longestStreak: streak?.longestStreak ?? 0,
    unlockedLevelIds:
      progress.unlockedLevelIds ?? [progress.currentLevelId],
  });

  await reconcileAchievements(uid, awards);
  return awards;
}
```

5. Добавить синхронизацию «раз за загрузку приложения»:

```ts
const achievementsSynced = new Set<string>();

export async function checkAchievementsOnce(
  uid: string,
  preloadedMap?: PreloadedAssessments,
) {
  if (achievementsSynced.has(uid)) return [];
  achievementsSynced.add(uid);
  try {
    return await checkAchievements(uid, preloadedMap);
  } catch (error) {
    achievementsSynced.delete(uid);
    throw error;
  }
}
```

6. В `checkLevelUp` удалить вызов `addAchievementIfNotExists(uid, "level_up", ...)`. Вместо него после `updateUserProgress(...)` вызвать `await checkAchievements(uid, assessmentMap);`. Возвращаемое значение функции не менять.

### 4.5 `src/hooks/useUserProgress.ts`

Заменить импорт `checkAchievements` на `checkAchievementsOnce` и вызвать его в существующем эффекте (там, где сейчас `checkAchievements(uid, assessments)`). Поведение: синхронизация выполняется один раз за загрузку приложения, а не на каждый маунт.

### 4.6 `src/hooks/useAssessments.ts`

1. Убрать импорты `deleteCategoryPerfectAchievement` и `isCategoryPerfect`.
2. В `toggleSubtopic` после сохранения прогресса вызывать синхронизацию **на любой тик и на снятие** (порог 7% может быть пересечён на обычной подтеме, а не только при завершении скилла):

```ts
void checkAchievements(uid, nextMap).catch((error) => {
  console.error("Error syncing achievements:", error);
  if (isPermissionDenied(error)) {
    toast.show("Для отслеживания прогресса обратитесь к администратору.");
  }
});
```

Удалить блок `if (justCompleted) { ... }` и блок с `deleteCategoryPerfectAchievement`. Переменную `justCompleted` из результата транзакции и из возврата функции оставить.

### 4.7 `src/hooks/useAchievements.ts`

Добавить в эффект (после настройки подписки) вызов `checkAchievementsOnce(uid)`, чтобы страница `/achievements`, открытая напрямую, тоже пересчитывала достижения. Ошибки обрабатывать как в остальных хуках: `console.error` + тост для `isPermissionDenied`/`isQuotaExceeded`.

### 4.8 `src/adapters/firestore-client/streak-commands.ts`

1. Удалить импорт `getAchievementTier`/`getTierProgress` и `updateDoc`, если они больше не используются.
2. `applyAutoFreezes`: в объект, возвращаемый транзакцией, добавить `longestStreak: number | null`.
   - ветка «нет пропусков» → `longestStreak: null`;
   - ветка «нет заморозок» → `longestStreak: null`;
   - успешная ветка → `longestStreak` из `computeStreaks`.
3. После транзакции вызывать `checkStreakAchievements(user.uid, result.longestStreak)` только если `result.longestStreak !== null`.
4. В `syncStreak`: `await checkStreakAchievements(user.uid, result.longestStreak);`.
5. `addStreakAchievementIfNotExists(uid, days)`: если документ с таким `type` уже есть — ничего не делать; иначе `setDoc` с `{ type, metadata: { days }, achievedAt: new Date() }`. Тир не писать.
6. `checkStreakAchievements(uid, longestStreak)`: если `longestStreak < STREAK_ACHIEVEMENT_DAYS[0]` — выйти; иначе для каждого `days <= longestStreak` вызвать `addStreakAchievementIfNotExists(uid, days)`.

### 4.9 `src/features/achievements/components/AchievementsClient.tsx`

Достать `longestStreak` из `useStreak()` и передавать в `getAchievementProgress` как `streakDays: longestStreak` (а не `currentStreak`). `currentStreak` оставить для `hint`.

## 5. Тесты (писать до реализации)

Все тесты — Vitest, описания на русском, файлы колокейтед.

### 5.1 `src/core/domain/achievement-conditions.test.ts`

Обновить все вызовы `evaluateAchievements(map)` на `evaluateAchievements({ assessmentMap: map })`.

Изменить/добавить проверки:

1. Пустая карта → `[]`.
2. `allCheckedMap([OSNOVY])` → есть `category_perfect` с `metadata.category_id === OSNOVY`.
3. Полная карта всех категорий → `category_perfect` ровно `categories.length`.
4. Первый тир: одна отмеченная подтема в большой категории **не** даёт `category_perfect` (прогресс < 7%). Проверять на `OSNOVY`: отметить только `skills.filter(...)[0].subtopics[0]`.
5. `allCheckedMap([OSNOVY])` → есть `level_master` для `junior` (уровень уже выше 7%).
6. Пустая карта → нет `level_master`, нет `path_complete`.
7. Полная карта всех категорий → есть `path_complete` с `metadata` без `total_score` (достаточно `toEqual({})`).
8. `level_up`: контекст `{ assessmentMap: {}, unlockedLevelIds: ["junior", "middle"] }` → одно достижение `level_up` с `from_level: "Junior"`, `to_level: "Middle"`. Для всех четырёх уровней — три достижения.
9. `achievementKey("level_up", { from_level: "Junior", to_level: "Middle" })` → `"level_up::Middle"`.
10. Стрики: `longestStreak: 6` → нет `streak_7`; `longestStreak: 7` → есть `streak_7`; `longestStreak: 100` → все 4.
11. `selectMissingAwards` — обновить вызовы `evaluateAchievements` на новый контекст.
12. Существующие тесты `isCategoryPerfect`/`isLevelMastered` не менять.

### 5.2 `src/lib/firestore.test.ts`

Обновить вызовы `evaluateAchievements` на контекст. Добавить `describe("reconcileAchievements")`:

1. Добавляет отсутствующее: пустой снапшот + одна награда → `setDoc` вызван 1 раз с `type`, `metadata`, `achievedAt` (Date).
2. Ничего не пишет, если документ уже совпадает по ключу и метаданным.
3. Удаляет документ, чей ключ не входит в желаемый набор.
4. Удаляет дубликат с тем же ключом (оставляет один).
5. Переносит legacy-документ с auto-id на ключевой id: `setDoc` получает `doc(ref, key)`, `deleteDoc` вызывается для старого ref, `achievedAt` совпадает со старым.
6. Обновляет метаданные, если поле из награды отличается, и сохраняет `achievedAt`.
7. Не перезаписывает документ из-за старых полей `tier`/`tierProgress`/`total_score`, которых нет в награде.

Мок `doc` в этом файле: `mocks.doc.mockImplementation((_ref, id) => ({ id: id ?? "auto-id" }))`, чтобы `setDoc(doc(ref, key))` и `existing.id !== key` работали.

### 5.3 `src/lib/firestore-actions.test.ts`

1. Добавить мок `@/adapters/firestore-client/streak-commands` с `getStreak: vi.fn().mockResolvedValue({ longestStreak: 0 })` и `syncStreak: vi.fn()`.
2. Добавить `mocks.getDoc.mockResolvedValue({ exists: () => true, data: () => ({ currentLevelId: "junior", unlockedLevelIds: ["junior"], totalScore: 0 }) })`.
3. `mocks.doc.mockImplementation((_ref, id) => ({ id: id ?? "auto-id" }))`.
4. Ожидания по `getDocs` оставить: с готовой картой — 1 вызов (achievements), без карты — 2 (assessments + achievements).
5. Проверка «по category_perfect на каждую категорию уровня» остаётся: фильтровать `setDoc` по `payload.type`.
6. `checkAchievements` возвращает массив наград из `evaluateAchievements`; фильтр по `category_perfect` даёт все `juniorCategoryIds`.

### 5.4 `src/lib/firestore-actions-levelup.test.ts`

В мок `@/lib/firestore` добавить `reconcileAchievements: vi.fn()`. В мок `streak-commands` добавить `getStreak: vi.fn().mockResolvedValue(null)`. Существующие проверки ранних выходов не менять.

### 5.5 Прочие тесты

`src/core/domain/profile.test.ts`, `scoring.test.ts`, `achievement-tiers` не трогать.

## 6. Проверка

Обязательные команды из корня проекта:

```
npm run lint
npm run typecheck
npm test
```

Ручная проверка (dev-сервер уже может быть запущен на `http://localhost:3000`):

1. Открыть `/profile` — должно быть `4/51`; в списке: «Основы программирования» (6 октября), «Kotlin Basics» (17 октября), «Android Basics», «Мастер уровня: Junior».
2. Открыть `/achievements` — те же 4 карточки получены, у остальных «Не получено».
3. Проверить Firestore REST/консоль: в `users/{uid}/achievements` 4 документа с id:
   - `category_perfect::junior-osnovy`
   - `category_perfect::junior-kotlin`
   - `category_perfect::junior-android`
   - `level_master::junior`
4. Снять одну подтему в `junior-android` до падения прогресса ниже 7% (если возможно) — достижение должно исчезнуть после синхронизации. Если проверить сложно, пропустить; это покрыто юнит-тестами.

## 7. Ограничения

- Никакого Firebase Admin SDK и service account. Только client SDK.
- Не добавлять зависимости.
- Не менять `src/features/study/study-materials.generated.ts` и другие сгенерированные файлы.
- Не создавать теги и релизы.
- Комментарии в коде — только неочевидные «почему», как в проекте.
- UI-тексты — на русском.
- Не переименовывать типы достижений и поля существующих документов.

## 8. Коммит

Один коммит после зелёных проверок:

```
fix: recalculate achievements from tier thresholds
```

Тело коммита (пример):

```
Achievements now unlock at the first progress tier (7%) and are reconciled
with current progress instead of only being added once. Legacy documents are
normalized to stable ids and invalid ones are removed.
```
