# Инструменты Android-разработчика

**Уровень:** Junior  
**Категория:** Инструменты  
**Язык:** Kotlin  
**Кратко:** Рабочий минимум инструментов: Git, отладка, сборки, ADB и управление зависимостями.

## 1. Git {#git}

Git — распределённая система контроля версий. Она хранит историю изменений кода, позволяет работать в ветках, откатывать ошибки и синхронизироваться с удалённым репозиторием. Для Android-разработчика Git — основной инструмент: проекты в Android Studio создаются с инициализированным репозиторием, а код отправляется на GitHub/GitLab через Pull Request.

> **Ключевая идея:** коммиты должны быть небольшими и осмысленными, а сообщения — описывать, что изменилось и зачем. Это упрощает поиск ошибок и ревью.

### 1.1. git init и clone {#git-init-i-clone}

`git init` создаёт новый репозиторий в текущей папке: появляется скрытая директория `.git`, в которой хранится вся история и конфигурация. Обычно используется при старте нового проекта, если репозиторий ещё не создан.

```bash
git init
```

`git clone` копирует существующий удалённый репозиторий на локальный компьютер вместе с историей и всеми ветками.

```bash
git clone https://github.com/user/project.git
cd project
```

После `clone` локальная ветка `main` (или `master`) уже привязана к удалённой, поэтому `push` и `pull` работают без дополнительной настройки.

Типичная ошибка: клонировать репозиторий в папку, которая уже содержит файлы, и получить конфликт. Лучше клонировать в пустую директорию.

### 1.2. git status и diff {#git-status-i-diff}

`git status` показывает, какие файлы изменены, какие добавлены в индекс (staging) и какие не отслеживаются. Это первая команда, которую стоит вызывать перед любыми действиями.

```bash
git status
```

`git diff` показывает конкретные изменения в файлах, ещё не добавленных в индекс.

```bash
git diff
git diff --staged
```

Первый вариант сравнивает рабочую директорию с индексом, второй — индекс с последним коммитом. Это позволяет проверить, что именно попадёт в коммит.

Типичная ошибка: коммитить без просмотра `diff` и случайно включить отладочные `println` или локальные конфиги.

### 1.3. git add и commit {#git-add-i-commit}

`git add` помещает изменения в индекс (staging area) — подготовленный набор изменений для следующего коммита.

```bash
git add MainActivity.kt
git add .
```

`git commit` создаёт новый коммит из содержимого индекса с сообщением.

```bash
git commit -m "feat: добавить экран входа"
```

Хорошая практика — коммитить логически связанные изменения отдельно: один коммит — одна задача. Это упрощает `git revert` и `git bisect`.

Самопроверка: после `git commit` вызовите `git status` — рабочая директория должна быть чистой (или содержать только неотслеживаемые файлы).

### 1.4. git push и pull {#git-push-i-pull}

`git push` отправляет локальные коммиты в удалённый репозиторий.

```bash
git push origin main
```

`git pull` получает изменения из удалённого репозитория и сразу пытается слить их с текущей веткой.

```bash
git pull origin main
```

`pull` эквивалентен `fetch` + `merge`. Если в локальной и удалённой ветках есть расходящиеся изменения, Git попытается выполнить merge; при конфликте попросит разрешить его вручную.

Типичная ошибка: делать `push --force` в общую ветку (`main`) — это перезаписывает историю и ломает работу других разработчиков. `--force` допустим только в личных feature-ветках.

### 1.5. git fetch {#git-fetch}

`git fetch` загружает изменения из удалённого репозитория, но не меняет рабочую директорию и текущую ветку. Это безопасный способ посмотреть, что изменилось у коллег.

```bash
git fetch origin
git log --oneline origin/main
```

После `fetch` можно сравнить локальную ветку с удалённой и решить, нужно ли делать `merge` или `rebase`. Использование `fetch` перед `pull` помогает избежать неожиданных конфликтов.

### 1.6. branch и switch {#branch-i-switch}

Ветка (branch) — отдельная линия разработки. `git branch` создаёт или показывает ветки.

```bash
git branch
git branch feature/login
```

`git switch` переключается между ветками (современная замена `git checkout` для веток).

```bash
git switch feature/login
git switch -c feature/signup
```

Флаг `-c` создаёт ветку и сразу переключается на неё. Правило именования: `feature/...`, `fix/...`, `chore/...`. Работа в отдельной ветке защищает `main` от незавершённого кода.

Типичная ошибка: коммитить напрямую в `main` в командном проекте. Всегда создавайте feature-ветку.

### 1.7. merge {#merge}

`git merge` объединяет изменения из одной ветки в текущую.

```bash
git switch main
git merge feature/login
```

Если изменения не пересекаются, Git выполнит fast-forward merge (линейная история). Если в обеих ветках есть новые коммиты, создастся merge-коммит с двумя родителями.

Для Android-проектов часто используют `--no-ff`, чтобы сохранить историю feature-ветки:

```bash
git merge --no-ff feature/login
```

### 1.8. Разрешение merge conflicts {#razreshenie-merge-conflicts}

Конфликт возникает, когда Git не может автоматически объединить изменения в одних и тех же строках. Файл помечается как конфликтующий, а внутри появляются маркеры:

```text
<<<<<<< HEAD
val timeout = 30
=======
val timeout = 60
>>>>>>> feature/network
```

Разрешение конфликта: выбрать нужный вариант (или объединить), удалить маркеры, добавить файл в индекс и завершить merge.

```bash
git add NetworkConfig.kt
git commit
```

В Android Studio конфликты удобно разрешать через встроенный инструмент (Merge Conflicts). Типичная ошибка: оставить маркеры `<<<<<<<` в коде — проект перестанет компилироваться.

### 1.9. .gitignore {#gitignore}

Файл `.gitignore` перечисляет пути и шаблоны файлов, которые Git должен игнорировать: локальные конфиги, сборочные артефакты, секреты.

```text
*.iml
.gradle/
local.properties
build/
.idea/
```

Для Android-проектов стандартный `.gitignore` создаётся автоматически при создании проекта в Android Studio. Важно: если файл уже попал в репозиторий, добавление в `.gitignore` не удалит его — нужно выполнить `git rm --cached`.

### 1.10. Pull Request и Code Review {#pull-request-i-code-review}

Pull Request (PR) — запрос на слияние feature-ветки в основную ветку через веб-интерфейс GitHub/GitLab. Перед созданием PR проверяют, что ветка актуальна с `main`, тесты проходят, а код отформатирован.

Базовый процесс:
1. Запушить feature-ветку.
2. Создать PR с описанием изменений.
3. Дождаться ревью коллег.
4. Внести правки, если нужно.
5. Слить PR после одобрения.

Code Review — проверка кода коллегами: корректность, читаемость, соответствие архитектуре, отсутствие секретов. Для Junior-разработчика ревью — главный способ учиться стандартам проекта.

> **Ключевая идея:** PR должен быть небольшим (до ~300 строк изменений). Большие PR сложно ревьюить, и в них чаще пропускают ошибки.

**Самопроверка раздела Git:**
- [ ] Умею создать репозиторий и клонировать существующий.
- [ ] Проверяю изменения через `git status` и `git diff` перед коммитом.
- [ ] Работаю в отдельных feature-ветках.
- [ ] Знаю, как разрешить merge-конфликт.
- [ ] Понимаю назначение `.gitignore` и PR.

### Вопросы на собеседовании


## 2. Logcat и Debugging {#logcat-i-debugging}

Logcat — окно Android Studio, в котором отображаются системные и прикладные логи. Debugging — пошаговое выполнение кода с остановками на breakpoints. Вместе эти инструменты позволяют находить причину крашей и логических ошибок.

> **Ключевая идея:** логи помогают понять, что произошло, а отладчик — почему. Используйте логи для наблюдения за потоком, отладчик — для исследования состояния в конкретный момент.

### 2.1. Уровни логирования {#urovni-logirovaniya}

Android использует пять основных уровней логов (плюс `ASSERT`/`Log.wtf`), от самого подробного к самому критичному:

- `VERBOSE` — детальная трассировка, обычно отключена в проде.
- `DEBUG` — отладочная информация для разработчика.
- `INFO` — важные события жизненного цикла.
- `WARN` — потенциальные проблемы.
- `ERROR` — ошибки и исключения.

Выбор уровня влияет на читаемость логов: в продакшен-сборках оставляют `WARN`/`ERROR`, чтобы не засорять вывод и не раскрывать внутренности.

### 2.2. Log.d, Log.i, Log.w и Log.e {#log-d-i-w-e}

Класс `android.util.Log` предоставляет статические методы для каждого уровня.

```kotlin
import android.util.Log

class UserRepository {
    fun loadUser(id: String) {
        Log.d("UserRepo", "Загрузка пользователя id=$id")
        try {
            // ...
            Log.i("UserRepo", "Пользователь загружен")
        } catch (e: Exception) {
            Log.e("UserRepo", "Ошибка загрузки", e)
        }
    }
}
```

Третий аргумент `Log.e` — объект `Throwable`, который добавляет стек вызовов. Тег (первый аргумент) обычно совпадает с именем класса, чтобы удобно фильтровать.

Типичная ошибка: логировать чувствительные данные (токены, пароли) — это угроза безопасности.

### 2.3. Timber для удобного и безопасного логирования {#timber}

Timber — библиотека, оборачивающая `Log` и автоматически подставляющая тег (имя класса) и контролирующую вывод в зависимости от сборки.

```kotlin
// build.gradle.kts
implementation("com.jakewharton.timber:timber:5.0.1")
```

Инициализация в `Application`:

```kotlin
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree())
        }
    }
}
```

Использование:

```kotlin
Timber.d("Загрузка пользователя id=%s", id)
Timber.e(exception, "Ошибка сети")
```

В release-сборке, если не посадить `DebugTree`, логи не выводятся — это защищает от утечки информации.

### 2.4. Фильтрация Logcat {#filtraciya-logcat}

В окне Logcat доступны фильтры по уровню, тегу, имени пакета и регулярному выражению. Полезные приёмы:

- Фильтр по пакету приложения: `package:com.example.app`.
- Фильтр по тегу: `tag:UserRepo`.
- Исключение шумных логов: `-tag:System.out`.
- Сохранение фильтра как пресета для повторного использования.

Фильтрация экономит время: без неё Logcat забит системными сообщениями. В Android Studio 2023+ доступен улучшенный Logcat с поиском и подсветкой.

### 2.5. Stack Trace {#stack-trace}

Stack trace — стек вызовов, который печатается при исключении. Он показывает цепочку методов от точки возникновения ошибки до точки входа.

```text
java.lang.NullPointerException: ...
    at com.example.app.UserRepository.loadUser(UserRepository.kt:12)
    at com.example.app.UserViewModel.load(UserViewModel.kt:25)
    at com.example.app.MainActivity.onCreate(MainActivity.kt:18)
```

Читать stack trace нужно сверху вниз: первая строка с именем вашего пакета указывает место ошибки. Строки с `android.*` и `kotlin.*` — системный код, обычно пропускаются.

### 2.6. Breakpoints {#breakpoints}

Breakpoint — точка остановки выполнения программы. Устанавливается кликом по левой границе редактора рядом с номером строки. При достижении breakpoint приложение приостанавливается, и можно исследовать состояние.

Типы breakpoints:
- Line breakpoint — остановка на строке.
- Method breakpoint — вход/выход из метода (медленнее).
- Field watchpoint — изменение поля.
- Exception breakpoint — остановка при выбросе исключения (очень полезно для `NullPointerException`).

Exception breakpoint настраивается через `View Breakpoints` и позволяет остановиться в момент выброса исключения, даже если оно перехватывается.

### 2.7. Step Into, Step Over и Step Out {#step-into-over-out}

После остановки на breakpoint доступны команды навигации:

- `Step Over (F8)` — выполнить текущую строку и перейти к следующей в том же методе.
- `Step Into (F7)` — зайти внутрь вызываемого метода.
- `Step Out (Shift+F8)` — выйти из текущего метода в вызывающий.
- `Resume (F9)` — продолжить выполнение до следующего breakpoint.

Используйте `Step Over` для перехода по строкам, `Step Into` — когда нужно исследовать внутренности вызова. `Force Step Into` позволяет зайти в стандартные библиотеки.

### 2.8. Watches и Evaluate Expression {#watches-i-evaluate}

Watches — панель, в которой можно добавить выражения для постоянного наблюдения: `user.name`, `list.size`, `count > 0`. Значения обновляются при каждой остановке.

`Evaluate Expression (Alt+F8)` позволяет выполнить произвольный код в контексте текущей точки остановки:

```kotlin
repository.cache.size()
user?.profile?.email
```

Это удобно для проверки гипотез без перекомпиляции. Важно: выражения не должны иметь побочных эффектов (изменять состояние), иначе отладка исказит поведение.

### 2.9. Поиск причины исключения {#poisk-prichiny-isklyucheniya}

Алгоритм диагностики краша:

1. Найти stack trace в Logcat (фильтр по `ERROR`).
2. Определить первую строку с вашим пакетом — это место ошибки.
3. Поставить breakpoint на эту строку и воспроизвести сценарий.
4. Проверить значения переменных через Watches/Evaluate.
5. Проверить входные данные: null, пустые коллекции, неверный индекс.

Частые причины: `NullPointerException` (обращение к null), `IndexOutOfBoundsException` (выход за границы списка), `ClassCastException` (неверное приведение типа), `NetworkOnMainThreadException` (сеть в главном потоке).

### 2.10. App Inspection и Network Inspector {#app-inspection-i-network-inspector}

App Inspection — набор инструментов Android Studio для инспекции состояния приложения во время выполнения:

- **Database Inspector** — просмотр таблиц Room/SQLite, выполнение SQL-запросов.
- **Network Inspector** — перехват HTTP-запросов и ответов (Retrofit/OkHttp) с заголовками и телом.
- **Background Task Inspector** — WorkManager задачи.

Network Inspector особенно полезен при отладке API: видно URL, метод, заголовки, код ответа, тело запроса и ответа, время. Не требует сторонних прокси вроде Charles.

> [!WARNING]
> Network Inspector работает с OkHttp (и Retrofit на его основе) и HttpsURLConnection. Если используется другой клиент, запросы не будут перехвачены.

**Самопроверка раздела Logcat и Debugging:**
- [ ] Умею читать Logcat и фильтровать по тегу/пакету.
- [ ] Подключаю Timber и понимаю разницу debug/release.
- [ ] Умею читать stack trace и находить первую строку своего кода.
- [ ] Ставлю breakpoints и использую Step Over/Into/Out.
- [ ] Использую App Inspection и Network Inspector для диагностики.

### Вопросы на собеседовании


## 3. Build Variants и APK/AAB {#build-variants-i-apk-aab}

Build variants — механизм Gradle/AGP для создания разных версий одного приложения (debug/release, free/paid) из одного кода. APK и AAB — форматы артефактов для установки и публикации.

> **Ключевая идея:** Build Types определяют, как собирается код (оптимизация, отладка), а Product Flavors — для кого он собирается (бесплатная/платная версия, dev/prod окружение).

### 3.1. Build Types (debug и release) {#build-types-debug-i-release}

Build Type — набор настроек сборки. По умолчанию AGP создаёт `debug` и `release`.

```gradle
android {
    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}
```

`debug`-сборка не оптимизирована, содержит отладочные символы и устанавливается с суффиксом `.debug`, чтобы не конфликтовать с release. `release` минифицируется и подписывается release-ключом.

### 3.2. Product Flavors {#product-flavors}

Product Flavor — вариант продукта с собственными настройками: `applicationId`, ресурсы, константы.

```gradle
android {
    flavorDimensions += "environment"
    productFlavors {
        create("dev") {
            dimension = "environment"
            applicationIdSuffix = ".dev"
            buildConfigField("String", "API_URL", "\"https://dev.api.example.com\"")
        }
        create("prod") {
            dimension = "environment"
            buildConfigField("String", "API_URL", "\"https://api.example.com\"")
        }
    }
}
```

Flavors полезны для разных окружений (dev/stage/prod) или тарифов (free/premium). Каждый flavor может иметь собственную папку ресурсов `src/dev/`.

### 3.3. Build Variants {#build-variants}

Build Variant — комбинация Build Type и Product Flavor: `devDebug`, `devRelease`, `prodDebug`, `prodRelease`. Android Studio показывает их в панели Build Variants.

Количество вариантов = число build types × число flavors. Варианты позволяют тестировать release-логику на dev-окружении и собирать prod-release для публикации.

Типичная ошибка: создавать слишком много flavors, что усложняет матрицу сборок и тестирование.

### 3.4. Signing Configs {#signing-configs}

Signing Config — конфигурация подписи APK/AAB. Debug-сборка подписывается автоматически debug-ключом. Release должна быть подписана release-ключом, хранящимся в безопасном месте.

```gradle
android {
    signingConfigs {
        create("release") {
            storeFile = file("release.keystore")
            storePassword = System.getenv("STORE_PASSWORD")
            keyAlias = "release"
            keyPassword = System.getenv("KEY_PASSWORD")
        }
    }
    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
        }
    }
}
```

Пароли не хранят в коде — используют переменные окружения или Gradle properties. Потеря release-ключа делает невозможным обновление приложения в Google Play.

### 3.5. BuildConfig {#buildconfig}

BuildConfig — автогенерируемый класс с константами сборки: `DEBUG`, `APPLICATION_ID`, `BUILD_TYPE`, `FLAVOR`, а также пользовательские поля через `buildConfigField`.

```kotlin
if (BuildConfig.DEBUG) {
    Timber.plant(Timber.DebugTree())
}

val apiUrl = BuildConfig.API_URL
```

В AGP 8.0+ BuildConfig по умолчанию отключён; его включают флагом:

```gradle
android {
    buildFeatures {
        buildConfig = true
    }
}
```

### 3.6. Назначение APK {#naznachenie-apk}

APK (Android Package) — установочный файл приложения. Содержит код, ресурсы, манифест и сертификат. Используется для прямой установки на устройство и тестирования.

```bash
./gradlew assembleRelease
```

Артефакт появляется в `app/build/outputs/apk/release/`. APK универсален, но содержит код для всех архитектур (arm64, x86), из-за чего размер больше.

### 3.7. Назначение Android App Bundle (AAB) {#naznachenie-aab}

AAB — формат публикации в Google Play. Play Store генерирует из него оптимизированные APK под конкретное устройство (только нужная архитектура, плотность экрана, язык), что уменьшает размер загрузки.

```bash
./gradlew bundleRelease
```

Артефакт: `app/build/outputs/bundle/release/app-release.aab`. С 2021 года AAB обязателен для новых приложений в Google Play. Локально AAB не устанавливается напрямую — нужен `bundletool`.

### 3.8. R8 и ProGuard (назначение) {#r8-i-proguard}

R8 — инструмент сжатия, обфускации и оптимизации кода, встроенный в AGP. ProGuard — его предшественник, файлы правил совместимы.

Назначение:
- Удаление неиспользуемого кода (tree-shaking).
- Обфускация имён классов/методов (защита от реверс-инжиниринга).
- Оптимизация байт-кода.

Правила хранятся в `proguard-rules.pro`. Для библиотек, использующих рефлексию (Retrofit, Room, Gson), нужны `keep`-правила, иначе R8 удалит нужный код и приложение упадёт в release.

> [!WARNING]
> Всегда тестируйте release-сборку на реальном устройстве: ошибки ProGuard/R8 проявляются только после минификации.

### Тестирование сборок {#testirovanie-sborok}

Каждый build variant должен проходить тесты. В Gradle можно запускать тесты для конкретного варианта: `./gradlew testDevDebugUnitTest`. Инструментальные тесты запускаются на эмуляторе: `./gradlew connectedDevDebugAndroidTest`.

Различия между вариантами (разные URL, флаги) нужно покрывать тестами, иначе ошибка в конфигурации проявится только в продакшене. Полезно иметь smoke-тест, проверяющий, что `BuildConfig.API_URL` указывает на ожидаемый хост.

Перед релизом обязательно собирают release-вариант и прогоняют основные сценарии на реальном устройстве, потому что минификация и оптимизация могут изменить поведение.

### Как выбрать стратегию сборок {#strategiya-sborok}

На старте проекта достаточно двух build types (`debug` и `release`) без flavors. Flavors добавляют, когда появляются реальные различия: отдельный backend для разработки, платная версия, white-label. Каждый новый flavor удваивает матрицу сборок и требует тестирования, поэтому добавлять их нужно осознанно.

Важно разделять конфигурацию окружения (URL, ключи аналитики) и конфигурацию продукта (бренд, иконка). Для окружения часто достаточно `buildConfigField` в build type, а flavors оставляют для действительно разных продуктов.

Release-сборку нужно собирать и устанавливать на устройство регулярно, а не только перед публикацией. Это позволяет рано обнаружить проблемы с ProGuard, подписью и ресурсами. В CI настраивают отдельный job для `assembleRelease` и `bundleRelease`.

### Типичные ошибки и рекомендации {#oshibki-build-variants}

- Смешивать окружения в одном flavor: использовать продакшен-URL в dev-сборке. Всегда проверяйте `BuildConfig.API_URL` перед релизом.
- Хранить пароли keystore в `build.gradle.kts`. Используйте переменные окружения или `local.properties`, добавленный в `.gitignore`.
- Включать `isMinifyEnabled = true` без тестирования release. R8 может удалить классы, используемые через рефлексию.
- Забывать про `applicationIdSuffix` для debug, из-за чего debug и release не устанавливаются параллельно.
- Публиковать APK вместо AAB в Google Play — с 2021 года новые приложения принимаются только в формате AAB.
- Не делать `clean` перед release-сборкой: старые артефакты могут попасть в релиз.

**Самопроверка раздела Build Variants:**
- [ ] Отличаю Build Type от Product Flavor.
- [ ] Понимаю, как формируется Build Variant.
- [ ] Умею настраивать Signing Config через переменные окружения.
- [ ] Знаю разницу APK и AAB и команды сборки.
- [ ] Понимаю назначение R8/ProGuard и необходимость тестирования release.

### Вопросы на собеседовании


## 4. ADB Basics {#adb-basics}

ADB (Android Debug Bridge) — клиент-серверный инструмент для взаимодействия с Android-устройством или эмулятором: установка приложений, просмотр логов, выполнение команд, передача файлов. Состоит из клиента (команда `adb`), сервера (демон) и adbd на устройстве.

> **Ключевая идея:** ADB работает через USB или Wi-Fi и требует включённой «Отладки по USB» на устройстве. Это базовый инструмент диагностики вне Android Studio.

### 4.1. Назначение ADB {#naznachenie-adb}

ADB позволяет:
- Устанавливать/удалять APK.
- Просматривать логи (`adb logcat`).
- Выполнять shell-команды на устройстве.
- Передавать файлы (`push`/`pull`).
- Перезагружать устройство, управлять пакетами.

Используется в скриптах CI, при тестировании на физических устройствах и при отладке без IDE.

### 4.2. adb devices {#adb-devices}

Показывает список подключённых устройств и эмуляторов.

```bash
adb devices
```

Вывод:

```text
List of devices attached
emulator-5554   device
R58M...         device
```

Статусы: `device` (готово), `offline` (потеряно соединение), `unauthorized` (не подтверждена отладка на устройстве). Если устройство не появляется — проверить кабель, драйверы, разрешение на устройстве.

### 4.3. adb install и adb uninstall {#adb-install-i-uninstall}

Установка APK на устройство:

```bash
adb install app-release.apk
adb install -r app-release.apk
```

Флаг `-r` переустанавливает, сохраняя данные. Удаление пакета:

```bash
adb uninstall com.example.app
```

Для нескольких устройств указывают серийный номер:

```bash
adb -s emulator-5554 install app.apk
```

### 4.4. adb shell {#adb-shell}

Открывает интерактивную оболочку на устройстве или выполняет одну команду.

```bash
adb shell
adb shell ls /data/data/com.example.app
adb shell pm list packages | grep example
```

На нерутованном устройстве `adb shell ls /data/data/com.example.app` вернёт `Permission denied`: каталог данных приложения недоступен shell-пользователю. Для debug-сборки доступ даёт `run-as`: `adb shell run-as com.example.app ls`.

Полезные команды внутри shell:
- `pm` — управление пакетами (установка/удаление/очистка данных).
- `am` — запуск Activity/Service (`am start -n com.example.app/.MainActivity`).
- `dumpsys` — состояние системных сервисов.
- `settings` — изменение системных настроек.

### 4.5. adb logcat {#adb-logcat}

Выводит логи устройства в терминал. Можно фильтровать по тегу и уровню.

```bash
adb logcat
adb logcat -s MyApp:D
adb logcat *:E
adb logcat -c
```

`-c` очищает буфер логов. Удобно использовать при воспроизведении бага: очистить, выполнить сценарий, посмотреть вывод.

### 4.6. Перезапуск и управление устройством {#perezapusk-i-upravlenie}

ADB умеет управлять состоянием устройства:

```bash
adb reboot
adb reboot recovery
adb shell input keyevent 26
adb shell svc wifi disable
```

Первая команда перезагружает устройство, вторая — в recovery. `input keyevent` эмулирует нажатия (26 — кнопка питания). Полезно для автоматизации тестов и диагностики.

### 4.7. Установка APK через ADB {#ustanovka-apk-cherez-adb}

Типичный сценарий CI/ручного тестирования:

```bash
./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.example.app/.MainActivity
```

Если установка падает с `INSTALL_FAILED_UPDATE_INCOMPATIBLE`, значит APK подписан другим ключом — нужно удалить старую версию: `adb uninstall com.example.app`.

### 4.8. Базовая диагностика подключения устройства {#diagnostika-podklyucheniya}

Если устройство не определяется:
1. Проверить, включена ли «Отладка по USB» и «Установка через USB».
2. Проверить кабель и порт (некоторые кабели только для зарядки).
3. Перезапустить ADB-сервер: `adb kill-server && adb start-server`.
4. На Windows — установить драйверы производителя (OEM USB drivers).
5. Проверить, не занято ли устройство другим процессом (например, Android Studio).

Для беспроводной отладки (Android 11+): `adb pair ip:port` затем `adb connect ip:port`.

### Передача файлов и работа с хранилищем {#fayly-adb}

ADB позволяет передавать файлы между компьютером и устройством:

```bash
adb push local.txt /sdcard/local.txt
adb pull /sdcard/screenshot.png ./screenshot.png
```

Это удобно для загрузки тестовых данных, баз данных, медиафайлов. При работе с защищёнными директориями (например, `/data/data/...`) нужны права root, которые на обычных устройствах недоступны. В таком случае используют `run-as` для debug-сборок:

```bash
adb shell run-as com.example.app cat databases/app.db > app.db
```

### Беспроводная отладка {#wireless-adb}

Начиная с Android 11, ADB поддерживает беспроводное подключение без кабеля. Процесс:

```bash
adb pair 192.168.1.10:37000
adb connect 192.168.1.10:41000
```

Код сопряжения отображается на устройстве. Беспроводная отладка удобна для тестирования на реальных устройствах, когда USB-порт занят или недоступен, но требует нахождения в одной Wi-Fi-сети.

### Безопасность и надёжность при работе с ADB {#bezopasnost-adb}

ADB открывает мощный доступ к устройству, поэтому его нельзя оставлять включённым на production-устройствах и в публичных сетях. После отладки отключайте «Отладку по USB» или используйте беспроводную отладку только в доверенной сети.

При работе с несколькими устройствами полезно задавать переменную окружения `ANDROID_SERIAL`, чтобы не указывать `-s` в каждой команде. В CI-скриптах всегда явно указывайте серийный номер, чтобы избежать выполнения команд не на том устройстве.

ADB также позволяет очищать данные приложения (`adb shell pm clear com.example.app`) — это удобно при тестировании первого запуска и onboarding-сценариев без переустановки APK.

### Практические сценарии использования ADB {#scenarii-adb}

ADB незаменим при работе с несколькими устройствами и при автоматизации. Например, можно написать скрипт, который собирает debug-APK, устанавливает его на все подключённые устройства и запускает главное Activity. Это удобно перед ручным тестированием.

При отладке сетевых проблем ADB позволяет пробросить порты: `adb reverse tcp:8080 tcp:8080` делает локальный сервер на компьютере доступным приложению на устройстве по `localhost`. Обратная операция `adb forward` пробрасывает порт устройства на компьютер.

Для снятия скриншотов и записи экрана используют `adb exec-out screencap -p > screen.png` и `adb shell screenrecord /sdcard/demo.mp4`. Это полезно для баг-репортов и документации.

### Типичные ошибки и рекомендации {#oshibki-adb}

- Забывать про флаг `-s` при нескольких подключённых устройствах — команда выполнится на первом в списке.
- Использовать кабель только для зарядки, из-за которого устройство не определяется.
- Не подтверждать диалог отладки на устройстве — статус останется `unauthorized`.
- Путать пакетное имя с именем APK-файла при `adb uninstall`.
- Запускать `adb logcat` без очистки буфера и тонуть в старых логах.
- Забывать, что `adb shell` выполняется от имени shell-пользователя, а не root — часть файлов недоступна.

**Самопроверка раздела ADB:**
- [ ] Умею проверить список устройств и их статусы.
- [ ] Устанавливаю и удаляю APK через ADB.
- [ ] Использую `adb shell` и базовые команды `pm`/`am`.
- [ ] Читаю логи через `adb logcat` с фильтрами.
- [ ] Диагностирую проблемы подключения.

### Вопросы на собеседовании


## 5. Dependencies и Version Catalogs {#dependencies-i-version-catalogs}

Управление зависимостями — подключение библиотек, разрешение версий, диагностика конфликтов. Version Catalogs (стабильны с Gradle 7.4, в 7.0 — экспериментально) централизуют версии в `libs.versions.toml`. Android Lint, Ktlint и Detekt — инструменты статического анализа.

> **Ключевая идея:** храните версии в одном месте (Version Catalog) и регулярно обновляйте зависимости. Статический анализ запускайте в CI, чтобы ловить проблемы до ревью.

### 5.1. Подключение Android-библиотек {#podklyuchenie-bibliotek}

Зависимости объявляются в `build.gradle.kts` модуля в блоке `dependencies`.

```gradle
dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
}
```

Конфигурации:
- `implementation` — зависимость доступна только внутри модуля: её и её транзитивные зависимости видно в runtime-сборке, но не в compile-classpath потребителя; наружу виден только `api`.
- `api` — зависимость доступна потребителям модуля (для library-модулей).
- `compileOnly` — только для компиляции (например, аннотации).
- `runtimeOnly` — только во время выполнения.
- `testImplementation` / `androidTestImplementation` — для тестов.

### 5.2. Поиск библиотек в Maven Central и Google Maven {#poisk-v-maven}

Библиотеки публикуются в репозиториях: Google Maven (`maven.google.com`) — AndroidX, AGP, Firebase; Maven Central (`search.maven.org`) — большинство open-source. В `settings.gradle.kts` объявляются репозитории:

```gradle
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
    }
}
```

Поиск версий: официальный сайт библиотеки, Maven Central search, AndroidX release notes. Избегайте непроверенных репозиториев — риск безопасности.

### 5.3. Version Catalogs {#version-catalogs}

Version Catalog — централизованный каталог зависимостей в `gradle/libs.versions.toml`. Позволяет переиспользовать версии между модулями и обновлять их в одном месте.

Включение (AGP/Gradle): каталог подхватывается автоматически, если файл существует в `gradle/`. В `build.gradle.kts`:

```gradle
dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.material)
}
```

### 5.4. libs.versions.toml {#libs-versions-toml}

Структура файла:

```text
[versions]
agp = "8.5.0"
kotlin = "2.0.0"
coreKtx = "1.13.1"
material = "1.12.0"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
material = { group = "com.google.android.material", name = "material", version.ref = "material" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
```

Ссылки из Gradle: `libs.androidx.core.ktx`, `libs.material`, `libs.plugins.android.application`. Томл-имена с дефисами превращаются в вложенные свойства.

### 5.5. Прямые и транзитивные зависимости {#pryamye-i-tranzitivnye}

Прямая зависимость — та, что вы подключили явно. Транзитивная — подтягивается автоматически зависимостями ваших зависимостей. Например, `retrofit` тянет `okhttp` и `okio`.

Проблемы возникают при конфликте версий: если две библиотеки требуют разные версии одной транзитивной зависимости. Gradle по умолчанию выбирает новейшую (version conflict resolution), но это может сломать совместимость.

### 5.6. Обновление версий библиотек {#obnovlenie-versiy}

Регулярное обновление снижает уязвимости и баги. Инструменты:
- Android Studio: `Project Structure` → `Suggestions` показывает доступные обновления.
- Gradle Versions Plugin: `./gradlew dependencyUpdates`.
- Dependabot/Renovate в GitHub для автоматических PR.

Обновляйте по одной библиотеке, запуская тесты после каждой. Мажорные версии могут содержать breaking changes — читайте release notes.

### 5.7. Базовая диагностика конфликтов зависимостей {#diagnostika-konfliktov}

Команды для анализа:

```bash
./gradlew app:dependencies --configuration releaseRuntimeClasspath
./gradlew app:dependencyInsight --dependency okhttp
```

Первая выводит дерево зависимостей, вторая — почему выбрана конкретная версия и кто её запросил. При `Duplicate class` ошибках исключайте транзитивную зависимость:

```gradle
implementation("some:lib:1.0") {
    exclude(group = "com.example", module = "conflicting")
}
```

Также полезно включить `failOnVersionConflict()` в строгих проектах.

### 5.8. Назначение Android Lint, Ktlint и Detekt {#android-lint-ktlint-detekt}

- **Android Lint** — статический анализатор Android-проектов (встроен в AGP). Проверяет корректность XML-разметки, использования API, доступность, производительность, безопасность. Запуск: `./gradlew lint`.

- **Ktlint** — линтер и форматтер Kotlin-кода по официальному стилю. Проверяет отступы, импорты, длину строк, именование. Запуск: `./gradlew ktlintCheck`, автофикс: `./gradlew ktlintFormat`.

- **Detekt** — статический анализатор Kotlin с настраиваемыми правилами: сложность, размер функций, code smells, потенциальные баги. Конфигурация в `detekt.yml`. Запуск: `./gradlew detekt`.

Все три запускаются в CI и могут блокировать merge при ошибках. Lint проверяет Android-специфику, Ktlint — стиль, Detekt — качество архитектуры.

### Безопасность зависимостей {#bezopasnost-dependencies}

Подключение библиотеки — это доверие чужому коду. Перед добавлением новой зависимости проверьте: активность проекта, количество звёзд/форков, дату последнего релиза, наличие известных уязвимостей (GitHub Security Advisories, Snyk).

Избегайте библиотек с транзитивными зависимостями, которые дублируют уже подключённые (например, несколько версий Kotlin stdlib). Это раздувает APK и может привести к конфликтам.

В корпоративных проектах часто используют внутренний Maven-репозиторий (Nexus/Artifactory) с проверенными артефактами. Это защищает от supply-chain атак и обеспечивает воспроизводимость сборок.

### Практика обновления и поддержки зависимостей {#praktika-dependencies}

В реальном проекте зависимости обновляются по расписанию, а не спонтанно. Разумная практика — раз в спринт запускать `dependencyUpdates`, просматривать changelog и обновлять patch/minor версии. Мажорные обновления планируют отдельно, потому что они часто требуют изменения кода.

Для каждой библиотеки полезно фиксировать причину подключения в комментарии или в `libs.versions.toml` (через комментарий). Это помогает через полгода понять, нужна ли ещё эта зависимость.

При удалении библиотеки обязательно проверяйте, не осталось ли её классов в коде и не используется ли она транзитивно другими модулями. Команда `./gradlew app:dependencies` помогает убедиться, что зависимость действительно исчезла из графа.

### Типичные ошибки и рекомендации {#oshibki-dependencies}

- Использовать `api` вместо `implementation` без необходимости — это увеличивает время компиляции зависимых модулей.
- Дублировать версии в нескольких модулях вместо Version Catalog — обновление превращается в кошмар.
- Игнорировать предупреждения о конфликтах версий — приложение может упасть в рантайме.
- Подключать библиотеки из непроверенных репозиториев.
- Отключать Lint/Ktlint/Detekt локально, чтобы «быстрее собрать» — проблемы всплывут в CI или у коллег.
- Не проверять release-сборку после обновления зависимостей.

**Самопроверка раздела Dependencies:**
- [ ] Подключаю библиотеки через `implementation`/`api`.
- [ ] Использую Version Catalog и `libs.versions.toml`.
- [ ] Понимаю разницу прямых и транзитивных зависимостей.
- [ ] Умею анализировать дерево зависимостей и конфликты.
- [ ] Знаю назначение Android Lint, Ktlint и Detekt.

### Вопросы на собеседовании


## Итоговая самопроверка категории {#itogovaya-samoproverka}

- [ ] Умею работать с Git: ветки, коммиты, push/pull, разрешение конфликтов.
- [ ] Читаю Logcat и использую отладчик (breakpoints, step, watches).
- [ ] Понимаю build variants, подписи, APK и AAB.
- [ ] Использую ADB для установки приложений и диагностики.
- [ ] Управляю зависимостями через Version Catalog.
- [ ] Запускаю Android Lint, Ktlint и Detekt.
- [ ] Публикую изменения через Pull Request с code review.

## Источники и документация {#istochniki-i-dokumentaciya}

### Официальная документация

- [Git — документация](https://git-scm.com/doc)
- [Android Studio — отладка](https://developer.android.com/studio/debug)
- [Logcat](https://developer.android.com/studio/debug/logcat)
- [Build variants](https://developer.android.com/build/build-variants)
- [App bundles](https://developer.android.com/guide/app-bundle)
- [ADB](https://developer.android.com/studio/command-line/adb)
- [Dependencies and version catalogs](https://developer.android.com/build/dependencies)
- [Lint](https://developer.android.com/studio/write/lint)
- [Detekt](https://github.com/detekt/detekt)
- [Ktlint](https://ktlint.github.io/)

### Статьи

- [ProGuard/R8](https://developer.android.com/build/shrink-code)
- [Signing your app](https://developer.android.com/studio/publish/app-signing)
- [Timber](https://github.com/JakeWharton/timber)
- [Network Inspector](https://developer.android.com/studio/debug/network-profiler)
