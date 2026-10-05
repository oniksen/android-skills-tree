# Валюта «Кристаллы» и заморозка стрика

Дата: 2026-09-28
Статус: реализовано, частично заменено 2026-10-05
Актуальные решения: [`../specs/2026-10-05-crystals-by-skill-weight.md`](../specs/2026-10-05-crystals-by-skill-weight.md)

> **Заменено 2026-10-05:** награда теперь `round(вес / 2)` за полностью закрытый
> навык вместо Fibonacci-величины за подтему; леджер выплаты переехал из
> `assessments/{skillId}.claimed` в `currency/current.claimedSkills`; цена
> заморозки 20 💎 вместо 50; ручной выбор и активация замороженного дня удалены,
> трата автоматическая в хронологическом порядке.

## Цель

Начислять виртуальную валюту за закрытые подтемы, дать тратить её в магазине
и добавить первый товар — ручную заморозку стрика.

## Решения

- **Валюта**: «Кристаллы» 💎 (`CURRENCY_ICON`).
- **Сложность** определяется уровнем навыка через категорию, а не `maxWeight`
  (он равен 5 у всех 227 скиллов и бесполезен).
- **Размер награды** (Fibonacci): junior 2, middle 3, strong-middle 5, senior 8 💎
  за каждую отмеченную подтему. Итого по проекту: 6066 💎 = 121 заморозка.
- **Один раз навсегда**: в `users/{uid}/assessments/{skillId}` хранится
  `claimed: string[]`. Снятие чекбокса не отзывает и не возвращает 💎.
- **Товар**: «Заморозка стрика» ❄️, цена 50 💎, максимум 3 в инвентаре.
- **Вход в магазин**: кликабельный бейдж `💎 N` в шапке рядом с `🔥` плюс
  ссылка из попапа стрика. Шестого пункта в нижней навигации нет.
- **Активация** заморозки ручная, в недельной сетке стрика. Допустим ровно
  один кандидат: день перед началом текущей цепочки `activeDays ∪ frozenDays`,
  только в видимом окне последних 7 дней.
- `computeStreaks(active, frozen, today)` считает замороженные дни покрытыми.
- **Возврат**: заморозка не возвращается в инвентарь, если пользователь позднее
  отметил этот день активным. `🔥` имеет приоритет над `❄️`.
- **Согласованность**: изменение `StreakData` сделано `frozenDays?: string[]`
  (опционально), поэтому старые документы читаются без миграции.
- **Консистентность**: начисление 💎, покупка и заморозка — Firestore-транзакции.
  Офлайн-фолбэка нет: офлайн-отметка подтемы не сохранится, ошибка уйдёт
  в консоль, состояние не изменится.

## Структура данных

- `users/{uid}/currency/current`: `{ balance: number, items: Record<string, number>, updatedAt }`
- `users/{uid}/streaks/current`: `{ current, longest, lastActiveDate, activeDays, frozenDays }`
- `users/{uid}/assessments/{skillId}`: `{ subtopics, score, claimed, updatedAt }`

`items` сделан обобщённым (`Record<string, number>`), чтобы будущие товары
не требовали изменения схемы.

## Файлы

Типы и данные:
- `src/types/index.ts` — `StreakData.frozenDays`, `CurrencyData`
- `src/data/shop.ts` — каталог `SHOP_ITEMS`, иконки, `getShopItem`

Логика:
- `src/lib/currency.ts` — таблица наград, `getCrystalRewardForSkill`,
  `getFreezeCount`, транзакционный `buyItem`
- `src/lib/streak.ts` — `computeStreaks(active, frozen, today)`,
  `findFreezableDay`, `freezeStreakDay`

Хуки:
- `src/hooks/useCurrency.ts` — баланс, инвентарь, покупка
- `src/hooks/useStreak.ts` — `frozenDays`, `freezableDay`, `week`, `freezeDay`
- `src/hooks/useAssessments.ts` — начисление 💎 в транзакции, `lastAwarded`

UI:
- `src/components/shared/CurrencyBadge.tsx` — бейдж `💎 N`
- `src/components/shared/Header.tsx` — бейдж в шапке
- `src/components/shared/StreakPopover.tsx` — 4 состояния ячеек,
  ручная заморозка, строка инвентаря, ссылка в магазин
- `src/components/dashboard/StreakCard.tsx` — замороженные дни, счётчик
- `src/components/tree/SkillRow.tsx` — всплывающий `+N 💎`
- `src/app/shop/` + `src/components/shop/` — магазин
- `src/proxy.ts` — `/shop` в `protectedRoutes`

## Верификация

- `npx tsc --noEmit` — проходит.
- `npm run lint` — 4 pre-existing ошибки и 3 предупреждения в чужих файлах
  (`useAchievements`, `useAssessments` до изменений, `useProjectProgress`,
  `useUserProgress`, `SkillCheckbox`, `firestore-actions`). Новых не добавлено.
- `npm run build` — проходит, `/shop` собрана как динамический маршрут.
- Экономика сверена с данными: 63/69/39/56 скиллов, 403/432/244/343 подтемы,
  806/1296/1220/2744 💎. Все 227 скиллов резолвятся в уровень из
  `CRYSTAL_REWARDS`, фолбэк `DEFAULT_CRYSTAL_REWARD` не срабатывает.
- 20 кейсов `computeStreaks` и `findFreezableDay` проходят на вынесенных
  во временный файл чистых функциях.
