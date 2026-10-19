# План миграции: Clean Architecture

- **Дата:** 2026-10-17
- **Spec:** `docs/superpowers/specs/2026-10-17-clean-architecture-design.md`
- **Принцип:** каждая фаза завершается зелёными `npm run lint`,
  `npm run typecheck`, `npm test` и коммитом. Поведение приложения сохраняется,
  кроме явно указанных улучшений безопасности.

## Решения по открытым вопросам

- [x] `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH`: **удалены** как мёртвая конфигурация
      (в коде не используются). Admin-доступ в будущем — через Firebase custom
      claims / allowlist UID, проверяемый на сервере, а не через password hash в env.

---

## Фаза 0 — Документы

- [x] `docs/audit/2026-10-17-project-audit.md`
- [x] `docs/audit/2026-10-17-security-audit.md`
- [x] `docs/audit/2026-10-17-firestore-audit.md`
- [x] `docs/superpowers/specs/2026-10-17-clean-architecture-design.md`
- [x] `docs/superpowers/plans/2026-10-17-clean-architecture-migration.md` (этот файл)

**Критерий:** документы созданы и закоммичены; spec согласован пользователем.

---

## Фаза 1 — Shared kernel (без смены поведения)

Цель: устранить конфигурационные и дублирующие проблемы, не двигая слои.

- [x] 1. `src/adapters/env/client.ts` + `server.ts` — zod-валидация
      `NEXT_PUBLIC_FIREBASE_*` и `AUTH_SECRET`.
- [x] 2. `.env.example` с полным списком переменных и комментариями.
- [x] 3. `src/lib/firebase.ts` — убран хардкод-fallback; читает из env-модуля.
- [x] 4. `src/adapters/firestore-client/paths.ts` — константы путей коллекций.
- [x] 5. Устранено дублирование `firestore.ts` ↔ `firestore-actions.ts`; удалён
      мёртвый код (`queries.ts`, `saveAssessment`, `getAssessmentMap`,
      `getUserAssessments`, `getUserProjectProgress`, `createDefaultUserProgress`,
      `toggleProjectCompletion`/`deleteProjectProgress` из `firestore.ts`).
- [x] 6. Добавлены `firebase.json`, `.firebaserc`, `firestore.indexes.json`
      (правила — Фаза 5).
- [x] 7. Исправлены 4 lint-ошибки `react-hooks/set-state-in-effect` в хуках
      (signed-out состояние выведено на рендер).
- [x] 8. `ADMIN_EMAIL`/`ADMIN_PASSWORD_HASH` удалены из `.env.local`.

**Проверка:** `lint` ✅ `typecheck` ✅ `test` (154) ✅ `build` ✅.
**Критерий:** поведение идентично; ключи только из env; дублей нет.

---

## Фаза 2 — Порты + клиентский адаптер (чтение)

Цель: хуки читают через интерфейсы, а не напрямую из `firebase`.

1. `src/ports/*` — интерфейсы read-контрактов (`ProgressRepository`,
   `AssessmentRepository`, `ProjectRepository`, `AchievementRepository`,
   `StreakRepository`, `CurrencyRepository`, `IdentityService`, `Clock`).
2. `src/adapters/firestore-client/*-repository.ts` — реализации read + `onSnapshot`.
3. Хуки (`useUserProgress`, `useCurrency`, `useStreak`, `useAssessments`,
   `useProjectProgress`, `useAchievements`) переводятся на порты
   (через локальную провязку в `features/*/hooks`).
4. `src/adapters/firestore-client/converters.ts` — типизированные конвертеры +
   zod-нормализация читаемых документов.

**Проверка:** `npm run lint && npm run typecheck && npm test`;
ручной smoke-тест страниц dashboard/tree/shop/achievements.
**Критерий:** `features` не импортируют `firebase`; чтение работает как раньше.

---

## Фаза 3 — Домен + use-cases

Цель: вынести бизнес-логику в `core`, покрыть тестами против fake-портов.

1. `src/core/domain/*` — перенести `scoring`, `weights`, `achievement-conditions`,
   `streak` (чистая часть), `currency`, `profile`, `roadmap-sort`.
2. `src/core/use-cases/*` — `SaveAssessment`, `CheckLevelUp`, `EvaluateAchievements`,
   `BuyItem`, `SyncStreak`, `ResetLevel`, `ToggleProject`; принимают порты как
   зависимости (dependency injection).
3. Тесты use-cases — in-memory fake-порты; существующие `*.test.ts` переносятся
   рядом с модулями и остаются зелёными.
4. `app/` продолжает работать на старой провязке до фазы 4 (стеклянная граница).

**Проверка:** `npm run lint && npm run typecheck && npm test`.
**Критерий:** доменная логика без зависимостей от Firebase/Next; тесты use-cases зелёные.

---

## Фаза 4 — Server-authoritative записи + аутентификация

Цель: все мутации — на сервере; сессия неподделываема.

1. `src/adapters/firestore-admin/*` — Admin SDK, write-реализации портов;
   `src/adapters/firestore-admin/admin-app.ts` инициализируется из серверных env.
2. `src/adapters/auth/session.ts` — подпись/проверка JWT (`jose`, `AUTH_SECRET`).
3. `src/adapters/auth/firebase-admin-auth.ts` — `verifyIdToken`.
4. `features/auth/actions/login.ts` — принимает **ID-token**, не uid;
   `features/auth/actions/logout.ts`.
5. `features/*/actions/*` — server actions для всех мутаций, вызывают use-cases
   с Admin-портами.
6. Убрать клиентские записи: `useAssessments.toggleSubtopic`,
   `currency.buyItem`, `streak.syncStreak/applyAutoFreezes`,
   `firestore-actions.*` → серверные use-cases.
7. `proxy.ts` и `getCurrentUser` переходят на проверку подписанного JWT.
8. `checkLevelUp` — транзакция; `resetLevelProgress` — `writeBatch`;
   timestamps — `serverTimestamp()`.

**Проверка:** `npm run lint && npm run typecheck && npm test`;
ручные сценарии: вход, отметка подтемы, покупка, сброс уровня, streak.
**Критерий:** клиент не пишет в Firestore; сессия подписана и проверяется.

---

## Фаза 5 — Firestore hardening + заголовки

1. `firestore.rules` — `read` только своих данных, `write` запрещён клиенту.
2. `firestore.indexes.json` — по необходимости (сейчас составных запросов нет).
3. `next.config.ts` — security-заголовки (CSP с доменами Firebase, HSTS, nosniff,
   Referrer-Policy).
4. Финальный аудит соответствия spec; обновление памяти Serena.
5. Обновить `AGENTS.md`/`README.md` по новой структуре (если потребуется).

**Проверка:** `npm run lint && npm run typecheck && npm test`;
деплой правил Firestore; smoke-тест в браузере.
**Критерий:** правила в репозитории; заголовки выставлены; уязвимости S1–S6 закрыты.

---

## Порядок и зависимости

```
Ф0 ─▶ Ф1 ─▶ Ф2 ─▶ Ф3 ─▶ Ф4 ─▶ Ф5
```

Ф2–Ф3 можно частично вести параллельно; Ф4 зависит от Ф3 (use-cases) и Ф1 (env).
Каждая фаза — отдельный коммит (или серия коммитов) в ветке
`docs/audit-clean-architecture`.
