# Design: Clean Architecture для android-skills-tree

- **Дата:** 2026-10-17
- **Статус:** согласовано (подлежит ревью spec перед реализацией)
- **Связанные документы:** `docs/audit/2026-10-17-*.md`,
  `docs/superpowers/plans/2026-10-17-clean-architecture-migration.md`

## 1. Контекст и цель

Проект — трекер навыков с прогрессом в Firestore. Аудит выявил: смешение доменной
и инфраструктурной логики, дублирование, клиент как источник истины (подделываемая
сессия, произвольные записи), отсутствие правил безопасности и валидации.

**Цель:** привести кодовую базу к структуре, удобной для чтения человеком и
масштабирования, с явными границами и безопасным (server-authoritative) доступом
к данным.

**Принятые решения:**
1. Глубина — полная clean architecture с инверсией зависимостей.
2. Модель доступа — **server-authoritative**: все записи на сервере (Firebase Admin),
   клиент только читает/realtime.
3. Чтение — клиентское (Firestore SDK за интерфейсами портов).
4. Схема Firestore — **без изменений** (миграции данных нет).
5. Раскладка — **Hexagonal + feature-модули**.

## 2. Принципы

- Зависимости направлены внутрь: `app → features → ports ← adapters → core`.
- `core` (домен + use-cases) не знает ни о Next.js, ни о Firebase, ни о React.
- Направление импортов:
  - `core` → ничего (только стандартная библиотека/чистые типы);
  - `ports` → `core` (интерфейсы репозиториев, зависят от доменных типов);
  - `adapters` → `ports` + `core` (реализуют интерфейсы);
  - `features` → `ports` (и `shared`), **не** → `adapters`;
  - `app` → `features` + композиция/провязка адаптеров.
- Юнит-тесты для `core`/use-cases — против fake-реализаций портов (без Firebase).
- Никакого `firebase`-импорта в `core` и `features` (кроме точки провязки в `app`).

## 3. Целевая структура

```
src/
├── core/                              # домен, без фреймворков
│   ├── domain/
│   │   ├── progress/                  # UserProgress, правила уровней
│   │   ├── assessment/                # Assessment, subtopics, завершённость
│   │   ├── achievement/               # AchievementAward, условия, key
│   │   ├── streak/                    # StreakData, computeStreaks
│   │   ├── currency/                  # CurrencyData, награды, цена
│   │   ├── scoring/                   # calcSkillScore/Category/Total/Level
│   │   └── catalog/                   # доступ к статическому каталогу (обёртки над data/)
│   └── use-cases/                     # сценарии приложения (чистые + порты)
│       ├── save-assessment.ts
│       ├── check-level-up.ts
│       ├── evaluate-achievements.ts
│       ├── buy-item.ts
│       ├── sync-streak.ts
│       ├── reset-level.ts
│       └── toggle-project.ts
├── ports/                             # только интерфейсы
│   ├── progress-repository.ts
│   ├── assessment-repository.ts
│   ├── project-repository.ts
│   ├── achievement-repository.ts
│   ├── streak-repository.ts
│   ├── currency-repository.ts
│   ├── session-service.ts
│   ├── identity-service.ts            # verifyIdToken (server) / getCurrentUser (client)
│   └── clock.ts
├── adapters/
│   ├── firestore-client/              # read + onSnapshot (Firebase client SDK)
│   │   ├── paths.ts                   # единые пути коллекций
│   │   ├── converters.ts              # типизированные конвертеры
│   │   └── *-repository.ts
│   ├── firestore-admin/               # server-authoritative write (Admin SDK)
│   │   ├── admin-app.ts
│   │   └── *-repository.ts
│   ├── auth/
│   │   ├── session.ts                 # подпись/проверка JWT (jose)
│   │   └── firebase-admin-auth.ts     # verifyIdToken
│   └── env/
│       └── index.ts                   # zod-валидация переменных окружения
├── features/                          # UI по фичам
│   ├── auth/      components/  actions/  hooks/
│   ├── dashboard/ …
│   ├── tree/      …
│   ├── roadmap/   …
│   ├── projects/  …
│   ├── shop/      …
│   ├── achievements/ …
│   └── profile/   …
├── shared/
│   ├── ui/                            # дизайн-система (бывший components/shared)
│   ├── lib/                           # утилиты без домена (viewport, theme)
│   └── types/
├── data/                              # статический каталог — без изменений
└── app/                               # маршруты Next: композиция + провязка
```

## 4. Порты и адаптеры

Порты описывают **что** нужно домену, адаптеры — **как** это делается.

| Порт | Клиентский адаптер (чтение) | Серверный адаптер (запись) |
|------|------------------------------|-----------------------------|
| `ProgressRepository` | `firestore-client` (get/onSnapshot) | `firestore-admin` (write) |
| `AssessmentRepository` | чтение | write |
| `ProjectRepository` | чтение | write |
| `AchievementRepository` | чтение | write |
| `StreakRepository` | чтение | write |
| `CurrencyRepository` | чтение | write |
| `SessionService` | — | подписанный JWT cookie (jose) |
| `IdentityService` | `useFirebaseAuth` | `adminAuth.verifyIdToken` |
| `Clock` | `new Date()` | server timestamp |

Порты разделяют read- и write-контракты, чтобы клиентский bundle не тянул Admin SDK
(Admin-адаптеры импортируются только из server actions/`"use server"`).

## 5. Поток данных

```
Read (realtime):
  feature/hook ──▶ port (read) ──▶ firestore-client adapter ──▶ onSnapshot

Write (server-authoritative):
  feature/components ──▶ feature/actions ("use server")
        └─▶ use-case (core)
              ├─▶ domain-правила (scoring/achievement/currency/...)
              └─▶ port (write) ──▶ firestore-admin adapter ──▶ Firestore (Admin)
  возврат результата ──▶ клиентские listeners обновляются автоматически
```

Валидация входных данных server action — на границе (`zod`), доменные инварианты —
в use-case.

## 6. Аутентификация и безопасность (целевая)

1. **Вход:** клиент выполняет `signInWithEmailAndPassword` → `user.getIdToken()` →
   server action `login(idToken)`.
2. **Сервер:** `adminAuth.verifyIdToken(idToken)` → `uid` → выпуск подписанной сессии
   (JWT HS256, `AUTH_SECRET`, `sub=uid`, `iat`, `exp≈7д`) в httpOnly/secure/lax cookie.
3. **Проверка:** `proxy.ts` и `getCurrentUser()` верифицируют подпись и срок JWT;
   `requireAuth()` возвращает uid.
4. **Правила Firestore:** `read` только своих данных; `write` запрещён клиенту
   (записи — через Admin SDK в обход правил).
5. **Env:** обязательные переменные валидируются zod; `.env.example`; хардкод-ключи
   удаляются.
6. **Заголовки:** CSP и security-заголовки в `next.config.ts`.
7. `ADMIN_EMAIL`/`ADMIN_PASSWORD_HASH` — **открытый вопрос**: переиспользовать под
   admin-бутстрап/панель или удалить.

## 7. Firestore (без смены схемы)

- Единый модуль `adapters/firestore-client/paths.ts` + конвертеры.
- Удаление дублей (`firestore.ts` ↔ `firestore-actions.ts`) и мёртвого кода.
- `checkLevelUp` — в транзакции (Admin) для атомарности инвариантов.
- `resetLevelProgress` — `writeBatch` (гиперссылка).
- Агрегаты (`totalScore`, баланс, streak) пересчитываются сервером при записи.
- `firestore.rules`, `firebase.json`, `firestore.indexes.json` — в репозитории.

## 8. Соответствие «старое → новое»

| Было | Стало |
|------|-------|
| `src/lib/scoring.ts`, `weights.ts`, `achievement-conditions.ts` | `core/domain/{scoring,assessment,achievement}` |
| `src/lib/streak.ts`, `currency.ts`, `profile.ts`, `roadmap-sort.ts` | `core/domain/{streak,currency,progress}` + use-cases |
| `src/lib/firestore.ts`, `queries.ts` | `adapters/firestore-client/*` (read) |
| `src/lib/firestore-actions.ts` | `core/use-cases/*` + `features/*/actions` |
| `src/lib/firebase.ts` | `adapters/firestore-client` + `adapters/env` |
| `src/lib/auth.ts` | `adapters/auth/session.ts` |
| `src/app/actions/auth.ts` | `features/auth/actions` |
| `src/hooks/*` | `features/*/hooks` (через порты) |
| `src/components/<feature>/*` | `features/<feature>/components` |
| `src/components/shared/*` | `shared/ui` |
| `src/lib/{theme,viewport}.ts` | `shared/lib` |
| `src/types/index.ts` | `core/domain/*` + `shared/types` |

## 9. Стратегия миграции

Пофазно, с зелёными `lint`/`typecheck`/`test` на каждом шаге
(детали — в migration-плане):

0. Документы (этот spec + аудит).
1. Shared kernel: env-валидация, константы путей, удаление дублей (без смены поведения).
2. Порты + клиентский адаптер; хуки ходят через порты.
3. Домен + use-cases; тесты против fake-портов.
4. Server-authoritative записи (Admin) + ID-token + подписанная сессия.
5. Правила Firestore, индексы, заголовки, `.env.example`.

## 10. Тестирование

- `core/domain` и `core/use-cases` — юнит-тесты на Vitest против in-memory fake-портов.
- Существующие тесты переносятся вместе с модулями (сохраняются).
- Интеграционные проверки адаптеров — опционально (эмулятор Firestore) на более позднем этапе.

## 11. Риски и допущения

- **Admin SDK требует** сервисный аккаунт (server-only env; хранить в секретах).
- **Двойной источник истины** на переходном этапе (клиентские записи ещё живут) —
  снимается на фазе 4.
- **Bundle:** Admin-адаптеры не должны попасть в клиентский bundle (server actions/`"use server"`).
- Объём рефакторинга большой — миграция идёт фазами, поведение сохраняется.
