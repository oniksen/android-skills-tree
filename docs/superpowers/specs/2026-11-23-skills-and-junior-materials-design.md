# Актуализация дерева навыков и учебные материалы Junior — дизайн

Дата: 2026-11-23
Ветка: `feat/skills-and-materials-research`

## 1. Зачем

Дерево навыков выросло из старого среза Android-разработки. Ориентиры 2026 года
([roadmap.sh/android](https://roadmap.sh/android), Google Modern Android Development /
*Now in Android*, skydoves Android & KMP Roadmap) сместились: Jetpack Compose стал
основным UI, появились обязательные edge-to-edge и системные уведомления, а RxJava,
LiveData и GraphQL перешли в разряд «уметь читать legacy».

Цель: выровнять содержание грейдов по актуальному стеку, сохранив преемственность
Junior → Middle → Strong Middle → Senior, и закрыть Junior учебными материалами.

## 2. Границы

**Делаем**

1. Правки данных навыков во всех четырёх грейдах (`src/data/skills/*.ts`).
2. Поддержка инвариантов: `roadmap-links.ts`, `quiz-questions/*.ts`, числа в
   `currency.test.ts`.
3. Восемь учебных материалов для оставшихся категорий Junior + привязка
   `studyMaterial` в `src/data/categories.ts`.

**Не делаем**

- Не трогаем `junior-osnovy` и два готовых материала
  (`osnovy-programmirovaniya-kotlin.md`, `kotlin-basics.md`).
- Не генерируем материалы для Middle / Strong Middle / Senior.
- Не меняем UI, рендерер, `study-blocks.ts`, `globals.css`.

**Анти-цели**

- Не удалять и не переименовывать `skill.id` (вопросы квиза и прогресс пользователя
  в Firestore привязаны к id).
- Не открывать сгенерированные `.md` целиком в контексте оркестратора.

## 3. Ключевые ограничения (проверено по тестам)

| Ограничение | Где | Как соблюдаем |
|---|---|---|
| `>= 30%` навыков грейда `requiredForLevelUp` | `skills.test.ts` | новые навыки Junior/Middle помечаем `requiredForLevelUp: true` там, где это ядро |
| `>= 1` обязательный навык в каждой категории | `skills.test.ts` | проверяем после правок |
| Суммы кристаллов 161/403/314/756 и 1634 | `currency.test.ts` | пересчитываем значения, инвариант «8 наград» сохраняем |
| Рёбра графа: существуют, уникальны, same-grade, ацикличны | `roadmap-links.test.ts` | id не трогаем; новые рёбра только внутри грейда |
| Каждый `skillId` в квизе существует | `quiz-questions.test.ts` | добавляем вопросы для новых id |
| `npm test` валидирует HTML материалов | `study-html-validity.test.tsx` | генерируем строго по `STUDY_MATERIALS_FORMATTING.txt` |

## 4. Матрица изменений по грейдам

Только `name` / `description` / `subtopics` у существующих id + новые id.

### Junior

| Навык | Тип | Изменение |
|---|---|---|
| `junior-android-intent` | update | + App Shortcuts, SplashScreen API, Share Sheet |
| `junior-android-view` | update | + Edge-to-Edge, `enableEdgeToEdge()`, WindowInsets, IME insets |
| `junior-android-notifications` | **new** | каналы, `NotificationCompat`, `POST_NOTIFICATIONS` (13+), FGS-уведомление, FCM обзорно |
| `junior-ui-imageview` | update | + Coil, Glide (legacy), placeholder/error, кэш изображений |
| `junior-ui-style` → «Styles, Themes и Material 3» | update | + Material 3, Dynamic Color, DayNight |
| `junior-ui-compose-basics` | **new** | `@Composable`, Column/Row/Box, Modifier, базовые компоненты, LazyColumn, `remember`/`mutableStateOf`, `@Preview` |
| `junior-data-shared` | update | акцент на Preferences DataStore, SharedPreferences как legacy |
| `junior-data-retrofit` | update | + OkHttpClient, `HttpLoggingInterceptor`, таймауты |
| `junior-async-flow` | **new** | `flow {}`, `emit`, `collect`, Flow vs suspend, вводный `StateFlow`, cold/hot |
| `junior-arch-mvvm` | update | StateFlow как основной поток, LiveData — legacy |
| `junior-arch-di` | update | + Factory, Builder, Observer, Singleton (обзор) |
| `junior-nav-service` | update | + WorkManager vs Service, FGS types (14+) |
| `junior-nav-content-provider` | **new** | ContentResolver, системные провайдеры, Photo Picker |
| `junior-test-junit` | update | + `runTest`, тестирование suspend и ViewModel (базово) |
| `junior-tools-logcat` | update | + Timber, App Inspection / Network Inspector |
| `junior-tools-dependencies` | update | + Android Lint, Ktlint, Detekt (назначение) |

### Middle

| Навык | Тип | Изменение |
|---|---|---|
| `middle-ui-compose` | update | перевести на продвинутый уровень: Scaffold, LazyColumn/Grid с ключами, BottomSheet/Drawer/TabRow, CompositionLocal, интероп `AndroidView`/`ComposeView`, keys/contentType |
| `middle-coroutines-flow` | update | + RxJava/RxKotlin: обзор и интероп (legacy) |
| `middle-ui-navcompose` | update | + type-safe navigation (Kotlinx Serialization), nested graphs |
| `middle-test-unit` | update | + Robolectric |
| `middle-test-coroutines` | update | + Turbine |
| `middle-tools-crashlytics` → «Firebase: Crashlytics, Analytics и сервисы» | update | + Analytics, Remote Config, FCM, Auth (обзор) |
| `middle-tools-google-play-services` | **new** | Maps, FusedLocation, Play Services, In-App Billing, AdMob |
| `middle-di-koin` | **new** | модули, `single`/`factory`/`viewModel`, Koin Annotations |
| `middle-networking-graphql` | **new** | GraphQL, Apollo Android, Ktor Client (обзор) |
| `middle-tools-lint` | **new** | Detekt, Ktlint, Android Lint, baseline, CI-гейт |

### Strong Middle

| Навык | Тип | Изменение |
|---|---|---|
| `strong-arch-convention-plugins` | **new** | `build-logic`, convention plugins, version catalogs, границы модулей |
| `strong-security-ssl` | update | + Play Integrity API |

### Senior

| Навык | Тип | Изменение |
|---|---|---|
| `senior-platform-ai` | **new** | Gemini Nano / AICore, ML Kit, LiteRT, on-device inference |

## 5. Учебные материалы Junior (Вариант А — по категориям)

| Категория | Файл (`content/study-materials/junior/`) | Разделов |
|---|---|---|
| `junior-android` | `android-basics.md` | 16 |
| `junior-ui` | `ui-basics.md` | 11 |
| `junior-data` | `data-and-storage-basics.md` | 8 |
| `junior-async` | `asynchronous-basics.md` | 7 |
| `junior-arch` | `architecture-basics.md` | 9 |
| `junior-nav` | `navigaciya-i-komponenty.md` | 5 |
| `junior-test` | `testing-basics.md` | 3 |
| `junior-tools` | `tools-basics.md` | 5 |

Структура файла — как у эталона: `# Заголовок`, метаданные (`Уровень`, `Категория`,
`Язык`, `Кратко`), `## N. <Навык> {#anchor}` на каждый навык категории, в конце
`## Итоговая самопроверка категории` и `## Источники и документация`.

## 6. Конвейер (экономия токенов)

1. **Рефакторинг навыков** — субагент `opencode-go/gemini-4-argon`, точная
   спецификация из раздела 4, с прогоном `npm test`.
2. **Генерация** — субагенты `opencode-go/beam-free` ($0). Крупные категории режутся
   на части по 4–6 навыков; каждая часть пишется в
   `content/study-materials/junior/.parts/<id>-p<N>.md` (вложенная папка не попадает
   в реестр). Оркестратор склеивает части в итоговый файл.
3. **Проверка** — детерминированный скрипт (0 токенов) + субагент
   `opencode-go/deepseek-v4.1-flash#low` по одному на файл.
4. **Оркестратор не читает `.md`** — только отчёты тестов и скрипта.

## 7. Критерии готовности

- `npm run generate:materials`, `npm run lint`, `npm run typecheck`, `npm test` — зелёные.
- Каждая из 8 категорий Junior имеет `studyMaterial` в `src/data/categories.ts`.
- Все 10 новых `skill.id` имеют хотя бы один вопрос в `quiz-questions/*`.
- Ни один существующий `skill.id` не удалён и не переименован.
