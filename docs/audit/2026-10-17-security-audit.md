# Аудит безопасности

- **Дата:** 2026-10-17
- **Область:** аутентификация/сессии, доступ к Firestore, конфигурация и секреты,
  доверие к клиенту, заголовки безопасности.
- **Метод:** статический анализ кодовой базы (без эксплуатации на живом окружении).

## Сводка находок

| # | Severity | Находка | Где |
|---|----------|---------|-----|
| S1 | 🔴 Critical | Подделка сессии: cookie = сырой `uid`, доверие к uid с клиента | `lib/auth.ts`, `app/actions/auth.ts` |
| S2 | 🔴 Critical | Правила безопасности Firestore отсутствуют в репозитории | корень репо |
| S3 | 🟠 High | Игровое состояние авторитетно на клиенте (XP, кристаллы, уровни, достижения) | `lib/firestore-actions.ts`, `hooks/*` |
| S4 | 🟠 High | Захардкоженные конфиги Firebase как fallback | `lib/firebase.ts:8-13` |
| S5 | 🟡 Medium | Мёртвые секреты без `.env.example`; нет валидации env | `.env.local` |
| S6 | 🟡 Medium | Нет заголовков безопасности (CSP и др.) | `next.config.ts` |
| S7 | 🟡 Medium | Server action `login(uid)` вызывается напрямую и без проверки токена | `app/actions/auth.ts:6` |
| S8 | 🟢 Low | Нет серверного rate-limiting/аудита входов | — |
| S9 | 🟢 Low | Секреты/ключи в открытом виде в `.env.local` (локально) | `.env.local` |

---

## S1. Подделка сессии (Critical)

**Что не так.** Сессия — это cookie `firebase-session`, значение которой равно
「сырому」 Firebase `uid`. Cookie не подписана и никак не проверяется:

```ts
// src/lib/auth.ts
cookieStore.set(SESSION_COOKIE_NAME, uid, { httpOnly: true, ... });
// src/lib/auth.ts
return session?.value ?? null;   // доверяем строке
```

Server action принимает `uid` прямо от клиента:

```ts
// src/app/login/page.tsx
await login(userCredential.user.uid);
// src/app/actions/auth.ts
export async function login(uid: string) { await setSessionCookie(uid); ... }
```

**Последствия.** Любой может установить cookie `firebase-session=<чужой uid>` и
получить доступ к защищённым страницам; либо вызвать server action `login` с
произвольным uid. Проверка подлинности Firebase полностью обходится.
`AUTH_SECRET` в `.env.local` для подписи **не используется**.

**Рекомендация.**
1. Клиент получает `user.getIdToken()` и передаёт **ID-token** в server action.
2. Сервер проверяет токен через Firebase Admin `verifyIdToken()`, извлекает `uid`.
3. Сессия = подписанный JWT (`jose`, HS256, `AUTH_SECRET`; поля `sub`, `iat`, `exp`),
   хранится в httpOnly/secure/sameSite cookie.
4. `getCurrentUser` и `proxy.ts` проверяют **подпись и срок** JWT, а не наличие строки.

## S2. Отсутствуют правила Firestore (Critical)

В репозитории нет ни `firestore.rules`, ни `firebase.json`, ни `.firebaserc`,
ни `firestore.indexes.json`. Правила управляются вне репозитория (или открыты).
Это делает модель доступа непроверяемой и невоспроизводимой: невозможно
отревьюить, кто и что может читать/писать.

**Рекомендация.** Добавить в репозиторий `firestore.rules` с принципом:
- `read` — только владельцу: `request.auth.uid == userId`;
- `write` — **запрещён всем** (записи идут серверным Admin SDK в обход правил);
- отдельно перечислить коллекции `users/{uid}/{progress,assessments,projects,achievements,currency,streak}`.
Добавить `firebase.json` + `firestore.indexes.json` и деплой правил через CI.

## S3. Клиент авторитетен в игровом состоянии (High)

Все мутации прогресса выполняются из браузера: `checkLevelUp`, `backfillTotalScore`,
`checkAchievements`, `resetLevelProgress`, покупка в магазине (`buyItem`) и т.д.
Клиент сам решает, сколько XP/кристаллов начислить и когда поднять уровень.
Это позволяет накрутить `totalScore`, открыть уровни и достижения, купить
товары без списания баланса.

**Рекомендация.** Перенести все записи (`Firestore`) в доверенный серверный слой
(server actions + Firebase Admin SDK). Клиент только читает. Расчёт баллов,
уровней, достижений и баланса кристаллов — на сервере из серверного источника.

## S4. Захардкоженные конфиги Firebase (High)

```ts
// src/lib/firebase.ts
apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSy...",
projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "android-dev-skill-tree",
```

`NEXT_PUBLIC_*` ключи не являются секретом, но хардкод-fallback маскирует
некорректную конфигурацию окружения (приложение молча работает с «чужим»
проектом) и засоряет исходники. API-keys должны быть ограничены (HTTP referrers /
API restrictions) в Google Cloud Console.

**Рекомендация.** Убрать fallback; сделать env обязательными и валидируемыми;
добавить `.env.example`; проверить ограничения ключа в GCP.

## S5. Секреты и конфигурация (Medium)

`.env.local` не в git (`.gitignore: .env*`), это хорошо. Но:
- `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` **не используются** — мёртвая
  конфигурация, повышающая риск случайной утечки и путаницы.
- Нет `.env.example` — новый разработчик не знает требуемый набор переменных.
- Нет валидации env на старте.

**Рекомендация.** Ввести модуль `adapters/env` с zod-валидацией; добавить
`.env.example`; определиться с `ADMIN_*` (использовать для admin-бутстрапа или
удалить); хранить секреты в Vercel/GCP Secret Manager.

## S6. Заголовки безопасности (Medium)

`next.config.ts` пуст: нет `Content-Security-Policy`, `X-Content-Type-Options`,
`Referrer-Policy`, HSTS и т.п.

**Рекомендация.** Настроить `headers()` в `next.config.ts` (либо через платформу):
CSP (учесть Firebase домены connect-src), `X-Content-Type-Options: nosniff`,
`Referrer-Policy`, HSTS.

## S7. Server action `login(uid)` без проверки токена (Medium)

Даже вне S1, сам факт публичного server action, принимающего идентификатор
пользователя из клиента, опасен: action можно вызвать напрямую, минуя UI.
Должен принимать только проверяемый Firebase ID-token.

## S8–S9. Прочее (Low)

- Нет серверного rate-limiting и журнала попыток входа (частично компенсируется
  Firebase Auth).
- Ключи хранятся в открытом виде в локальном `.env.local` (норма для dev, но не
  коммитить и не публиковать).

---

## Положительные практики

- `.env*` в `.gitignore`; секреты не в git.
- Cookie `httpOnly`, `secure` в проде, `sameSite=lax`.
- Серверные страницы группы `(app)` дополнительно проверяют сессию (`getCurrentUser`).
- Пароли аутентификации обрабатывает Firebase Auth (не хранятся в проекте).

## Приоритеты устранения

1. **S1 + S7** — проверка ID-token + подписанная сессия (блокирует обход всей аутентификации).
2. **S2** — правила Firestore в репозитории (read own / deny write).
3. **S3** — server-authoritative записи (защита игровой экономики).
4. **S4 + S5 + S6** — конфигурация, секреты, заголовки.
