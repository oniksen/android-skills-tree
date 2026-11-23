# Дашборд и профиль: семантическая реорганизация (вариант A)

**Дата:** 2026-11-23  
**Статус:** на утверждении  
**Область:** `src/features/dashboard`, `src/features/profile`, `src/core/domain`, скелетоны страниц.

## 1. Зачем

Сейчас профиль информационнее дашборда и во многом повторяет его:

| Факт | Где показывается сейчас |
|---|---|
| Текущий уровень | Dashboard (`LevelProgressCard`), Profile (`ProfileHeroCard`) |
| XP / «до следующего уровня» | Dashboard (`LevelProgressCard`), Profile (`ProfileHeroCard`, ProgressRing) |
| Стрик (текущий + рекорд) | Dashboard (`StreakCard`), Profile (`StreakCard`, `ProfileHeroCard`) |
| Навыки X/Y | Dashboard (`QuickStats`), Profile (`PageSummaryCard` «Навыки») |
| Проекты X/Y | Dashboard (`QuickStats`), Profile (`PageSummaryCard` «Проекты») |
| Кристаллы / заморозки | Profile (`PageSummaryCard` «Кристаллы», `StreakCard`), глобальный `CurrencyBadge` |
| Достижения | Profile (`ProfileAchievements`), страница `/achievements` |

Дополнительно блок «Что нужно для уровня» на Dashboard показывает только XP, хотя
`checkLevelUp` (`src/lib/firestore-actions.ts`) требует четыре условия. Сейчас блок вводит
в заблуждение.

**Цель:** семантическая чистота. У каждого факта один «дом»; страницы получают ясные роли;
Dashboard становится информативнее, Profile — легче и сфокусированнее.

## 2. Цели, не-цели, анти-цели

**Цели**
- Закрепить за Dashboard роль **«прогресс и следующий шаг»**.
- Закрепить за Profile роль **«аккаунт, коллекция и настройки»**.
- Убрать дублирующиеся блоки, а не просто перенести их.
- Сделать чек-лист повышения уровня полным и совпадающим с `checkLevelUp`.
- Сохранить текущий визуальный язык (Tailwind v4, `card-surface`, `PageHero`, `PageSummaryCard`).

**Не-цели**
- Не менять правила игры (XP, кристаллы, стрики, достижения, пороги).
- Не менять схему Firestore и хуки/слушатели.
- Не редизайнить страницу `/achievements` и её каталог.
- Не трогать глобальный Header, кроме случаев, если тест поймает регрессию.
- Не менять `/dashboard` и `/profile` маршруты и `protectedRoutes`.

**Анти-цели**
- Одинаковые блоки на двух страницах.
- Profile, превращённый в пустую страницу без пользы.
- Dashboard, превращённый в дубль страницы `/achievements` или `/shop`.

## 3. Принцип «один дом»

1. Каждый **блок** имеет ровно одну страницу-владельца.
2. Допустимы только два вида повторов:
   - **ссылка** на каноническую страницу (`→ /achievements`, `→ /shop`);
   - **компактный preview**, который показывает *другой срез* данных, а не копию блока
     (например, `QuickStats` даёт «проекты X/Y», а детали — на `/projects`).
3. Глобальные индикаторы в шапке (`StreakBadge`, `CurrencyBadge`) — это chrome, а не
   контентные блоки; они остаются и не считаются дублем.
4. Название текущего уровня — это идентичность пользователя, поэтому допустимо в обоих
   hero. Все **числовые** метрики прогресса (XP, проценты, «осталось N») живут только
   на Dashboard.

## 4. Целевая структура страниц

### 4.1 Dashboard — «Прогресс и следующий шаг»

Порядок сверху вниз:

1. **Hero** — `PageHero` «Дашборд» + `LevelProgressCard` в `aside`:
   текущий уровень, `ProgressRing` (процент до следующего), «осталось N XP».
   `ProgressRing` и `levelProgressPercent` переезжают сюда из профиля.
2. **`LevelRequirementsCard`** (новый, заменяет `NextMilestone`):
   полный чек-лист из четырёх условий перехода на следующий уровень:
   - все категории текущего уровня ≥ 80% (`current/target` категорий);
   - общий XP ≥ `getLevelMinScore(nextLevel.id)`;
   - обязательные навыки следующего уровня оценены (`current/target`);
   - выполнено проектов ≥ `nextLevel.requiredProjectCount`.
   Условия с нулевым требованием (например, `requiredProjectCount === 0` или нет
   обязательных навыков) не выводятся. Когда всё выполнено — состояние `READY`.
3. **`QuickStats`** — навыки X/Y, проекты X/Y (без изменений).
4. **`StreakCard`** — текущий стрик, рекорд, заморозки, неделя (единственное место).
5. **Кристаллы** — `PageSummaryCard` «Кристаллы»: баланс 💎 + ссылка «в магазин →»
   (переносится из профиля).

Сетка: hero на всю ширину; ниже `md:grid-cols-2 2xl:grid-cols-3`. Четыре карточки
пунктов 2–5 дают 3 + 1 на `2xl` и 2 + 2 на `md`.

Достижения на Dashboard намеренно не выводятся: у них уже есть два разных среза —
полученная коллекция в Profile и полный каталог на `/achievements`. Третий взгляд
на той же странице нарушил бы принцип «один дом».

### 4.2 Profile — «Аккаунт, коллекция и настройки»

1. **`ProfileHeroCard`** (упрощённый): аватар-инициал, e-mail, уровень как бейдж
   идентичности. Убираются: `ProgressRing`, XP, кристаллы, стрик, рекорд,
   «до уровня осталось». Опционально — ссылка «мой прогресс →» на `/dashboard`.
2. **`ProfileAchievements`** — полученные достижения (коллекция), полный список без
   `limit`; ссылка «все достижения →» уже есть в компоненте.
3. **`ProfileSettingsCard`** — без изменений: Groq-ключ, лимит вопросов, тема, выход.

Сетка: hero на всю ширину; `md:grid-cols-2 xl:grid-cols-12`, достижения
`xl:col-span-8`, настройки `xl:col-span-4`.

## 5. Куда переезжает каждый блок

| Блок | Сейчас | После |
|---|---|---|
| `LevelProgressCard` | Dashboard | Dashboard (единственный дом уровня/XP) |
| `ProgressRing` + `levelProgressPercent` | Profile hero | Dashboard `LevelProgressCard` |
| `NextMilestone` | Dashboard | Удаляется, заменяется `LevelRequirementsCard` |
| `QuickStats` | Dashboard | Dashboard |
| `StreakCard` | Dashboard **и** Profile | Только Dashboard |
| `PageSummaryCard` «Навыки» | Profile | Удаляется (дубль `QuickStats`) |
| `PageSummaryCard` «Проекты» | Profile | Удаляется (дубль `QuickStats`) |
| `PageSummaryCard` «Кристаллы» | Profile | Dashboard (+ ссылка в `/shop`) |
| `ProfileAchievements` | Profile | Profile (коллекция полученных; без изменений в API) |
| `ProfileSettingsCard` | Profile | Profile |

## 6. Изменения по файлам

### 6.1 Домен

**Новый `src/core/domain/level-requirements.ts`**

```ts
export interface LevelRequirement {
  id: "categories" | "xp" | "skills" | "projects";
  label: string;
  done: boolean;
  current?: number;
  target?: number;
}

export function getLevelUpRequirements(params: {
  currentLevelId: string;
  nextLevelId: string;
  assessmentMap: Record<string, AssessmentData>;
  projectMap: Record<string, boolean>;
}): LevelRequirement[];
```

Правила вычисления **точно повторяют** `checkLevelUp`:
- `categories`: `getCategoriesByLevelId(currentLevelId)`, каждая категория
  `calcCategoryScore(id, assessmentMap) >= getCategoryMaxScore(id) * LEVEL_UP_THRESHOLD`;
- `xp`: `calcTotalScore(assessmentMap) >= getLevelMinScore(nextLevelId)`;
- `skills`: `getSkillsByLevelId(nextLevelId).filter(s => s.requiredForLevelUp)`, у каждого
  `(assessmentMap[s.id]?.score ?? 0) >= 1`; если список пуст — пункт не добавляется;
- `projects`: `Object.values(projectMap).filter(Boolean).length >= nextLevel.requiredProjectCount`;
  при `requiredProjectCount === 0` пункт не добавляется.

Использовать `getCategoriesByLevelId`, `getSkillsByLevelId`, `getCategoryMaxScore`,
`getLevelMinScore`, `LEVEL_UP_THRESHOLD`, `calcCategoryScore`, `calcTotalScore`.
Тип `AssessmentData` — из `src/types`.

**`src/core/domain/achievement-conditions.ts`** — не меняется. `getAchievementProgress`
для `level_up` считает прогресс только по XP, тогда как награда выдаётся по
`unlockedLevelIds` (после всех гейтов `checkLevelUp`). Это известное расхождение
существующей страницы `/achievements`; в рамках этой задачи оно не исправляется (см. §8).

**`src/core/domain/profile.ts`** — `summarizeProfile` остаётся: он по-прежнему даёт
`earnedAchievementIds` для профиля. Доменные поля `xp`, `crystals`, `currentStreak`,
`skills`, `projects` больше не рендерятся, но передаются как есть (они уже доступны из
общего `useUserState`, без новых слушателей). Удалять `profile.ts`/`profile.test.ts` не нужно.

### 6.2 Dashboard

- **`DashboardClient.tsx`**:
  - добавить `useCurrency()` (баланс кристаллов);
  - вычислять `nextLevel` и `nextThreshold` как сейчас;
  - вызывать `getLevelUpRequirements({...})`;
  - `canLevelUp` = все пункты `done`;
  - заменить `NextMilestone` на `LevelRequirementsCard`;
  - добавить карточку кристаллов (`PageSummaryCard` + ссылка `/shop`).
- **`LevelProgressCard.tsx`**: заменить/дополнить полосу `ProgressRing`, используя
  `levelProgressPercent` (перенос с профиля).
- **`LevelRequirementsCard.tsx`** (новый): чек-лист. Для каждого пункта — маркер
  `[x]/[ ]`, `label`, при наличии `current/target` — `current/target`. Состояние `READY`
  переиспользует визуал текущего `NextMilestone` (`[ READY ] условия выполнены`).
- **`NextMilestone.tsx`**: удалить (единственный импорт — `DashboardClient`).

### 6.3 Profile

- **`ProfileContent.tsx`**:
  - удалить `StreakCard`, `skillsCard`, `projectsCard`, `crystalsCard` и их разметку;
  - `summarizeProfile` оставить: он даёт `earnedAchievementIds` / `earnedAchievements` /
    `totalAchievements` для коллекции. `useCurrency`/`useStreak` остаются источниками
    для `summarizeProfile` и читают тот же `useUserState`, без новых слушателей;
  - `ProfileHeroCard` получает только identity-поля;
  - `ProfileAchievements` остаётся без `limit` (полная коллекция);
  - сетка: hero (12), достижения (8), настройки (4).
- **`ProfileHeroCard.tsx`**: упростить props до `email`, `levelName`, `levelColor`,
  `headingId` (+ опциональная ссылка на `/dashboard`). Удалить `xp`, `nextLevelName`,
  `nextThreshold`, `crystals`, `currentStreak`, `longestStreak`, `levelProgressPercent`,
  `pluralDays`. Если `ProgressRing`/`levelProgressPercent` переехали на Dashboard —
  импорт из профиля убрать.
- **`ProfileAchievements.tsx`**: API не меняется; `limit` остаётся опциональным, но
  профиль передаёт `undefined`. `summarizeProfile`/`longestStreak` продолжают питать
  прогресс по тирам.

### 6.4 Скелетоны

- **`DashboardSkeleton.tsx`**: hero + 4 карточки (чек-лист, статистика, стрик,
  кристаллы). Сохранить `aria-busy` и текущие классы каркаса.
- **`ProfileSkeleton.tsx`**: для `variant="page"` — hero, достижения (8), настройки (4);
  убрать четыре `StatSkeleton`. Для `variant="modal"` — hero + настройки (модалка
  остаётся рабочей, хотя в коде не вызывается).

### 6.5 Что не трогаем

- `Header.tsx`, `NAV_ITEMS`, `protectedRoutes`, маршруты.
- `StreakCard.tsx` (общий компонент) — используется только Dashboard после изменений.
- `page.tsx` обеих страниц — остаются тонкими обёртками.
- `/achievements`, `/shop`, `/tree`, `/roadmap` — без изменений.

## 7. Тесты и проверка

**Обязательные новые тесты**
- `src/core/domain/level-requirements.test.ts` — зеркалит
  `src/lib/firestore-actions-levelup.test.ts`: категория ниже порога, достигнутый XP,
  обязательные навыки, проекты, максимальный уровень/пустые требования.

**Компонентный тест (рекомендуется)**
- `LevelRequirementsCard.test.tsx`: рендерит 4 пункта, отмечает `done`, показывает
  `current/target`, переключается в `READY`.

**Проверка**
- `npm run lint`, `npm run typecheck`, `npm test`.
- Визуально: 390 / 768 / 1440 / 1920 px, обе темы.
- Убедиться, что на Profile не осталось `StreakCard`, карточек навыков/проектов/кристаллов,
  а на Dashboard нет `NextMilestone`.

## 8. Крайние случаи и риски

- **Максимальный уровень (Senior):** `nextLevel === null` → `LevelRequirementsCard`
  не рендерится, hero показывает «Максимальный уровень достигнут!».
- **`requiredForLevelUp`-навыков нет** или `requiredProjectCount === 0`: соответствующие
  пункты чек-листа не показываются, чтобы не было «0/0».
- **Расхождение с `checkLevelUp`:** helper обязан использовать те же формулы и пороги;
  drift-тест зеркалит условия и ловит несовпадение. `checkLevelUp` в
  `src/lib/firestore-actions.ts` в этой задаче **не рефакторится**: это критический
  write-path, его вынос в общую функцию — отдельная задача. При изменении правил игры
  менять оба места.
- **Кристаллы vs `CurrencyBadge`:** карточка на Dashboard — детальный вид со ссылкой в
  магазин; бейдж в шапке остаётся глобальным индикатором.
- **Достижения:** Profile показывает полученную коллекцию, `/achievements` — полный
  каталог. Dashboard их не показывает — это два разных среза, без третьего дубля.
- **Известное расхождение `level_up`-прогресса:** `getAchievementProgress` считает
  прогресс уровня по XP, а награда выдаётся по `unlockedLevelIds`, поэтому на
  `/achievements` возможен «100% при неполученной ачивке». Это существующее поведение;
  его исправление — отдельная задача, вне текущего объёма.
- **`ProfileModal`:** в коде не вызывается; после упрощения профиля остаётся рабочим в
  одноколоночном режиме.

### 8.1 Решения по итогам ревью

- Блок достижений на Dashboard не добавляется: третий срез достижений нарушал бы
  «один дом», а корректная семантика «следующего достижения» требует отдельного
  пересмотра прогресса достижений (порог разблокировки 7%, `level_up` по XP против
  `unlockedLevelIds`).
- `checkLevelUp` не рефакторится; новый домен-helper независим и покрыт drift-тестом.

## 9. Что остаётся на усмотрение исполнителя

- Точные отступы/размеры карточек и порядок пунктов внутри `LevelRequirementsCard`
  (предлагаемый порядок: категории → XP → навыки → проекты).
- Нужна ли ссылка «мой прогресс →» в упрощённом `ProfileHeroCard`.
- Добавлять ли иконки к пунктам чек-листа (например, `Check`/`X` из `lucide-react`).
- Оставлять ли `ProgressBar` в `LevelProgressCard` вместе с `ProgressRing` или только ring.

## 10. Рассмотренные подходы

- **A. Семантический сплит (выбран).** Dashboard — прогресс и следующий шаг; Profile —
  аккаунт/коллекция/настройки. Убирает дубли, делает Dashboard информативнее.
- **B. Минимальный перенос.** Перенести «Навыки» и «Кристаллы», стрик оставить на обеих
  страницах. Меньше правок, но дубли и дисбаланс сохраняются — против цели.
- **C. Радикальный.** Profile — только аккаунт и настройки, все метрики (включая hero)
  на Dashboard. Максимально чисто, но Profile теряет коллекцию достижений и становится
  слишком пустым.

Выбран A: устраняет дубли, сохраняет у профиля осмысленное содержимое и не превращает
Dashboard в свалку.

## 11. Обновление (2026-11-23): шапка — единственный дом стрика и кристаллов

После реализации выяснилось, что оговорка §3 «бейджи шапки — chrome, не дубль» на
практике читается как дублирование: на Dashboard одновременно видны `StreakCard`
и `StreakBadge`/`StreakPopover`, а карточка «Кристаллы» повторяет `CurrencyBadge`
и ведёт в тот же `/shop`.

Решение (вариант 1):
- Шапка — единственный дом стрика и кристаллов: `StreakBadge` + `StreakPopover`
  (неделя, рекорд, заморозки, магазин) и `CurrencyBadge` (баланс, `/shop`).
- С Dashboard удалены `StreakCard` и карточка «Кристаллы»; компонент `StreakCard`
  удалён как неиспользуемый.
- Dashboard остаётся: hero с `LevelProgressCard`, `LevelRequirementsCard`, `QuickStats`.
- Оговорка §3 и пункты 4–5 §4.1 считаются заменёнными этим разделом.

Следствие: `ProfileContent` по-прежнему вызывает `useCurrency`/`useStreak` только
для полей `summarizeProfile`, которые не рендерятся. Это невизуальный запас, а не
дублирование на экране; отдельного изменения не требует.
