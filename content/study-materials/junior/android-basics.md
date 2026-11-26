# Основы Android-платформы

**Уровень:** Junior  
**Категория:** Android Basics  
**Язык:** Kotlin  
**Кратко:** Как устроен Android-проект, что такое Gradle, манифест, ресурсы и Context — база, без которой не работает ни одно приложение.

## 1. Android Studio {#android-studio}

Android Studio — официальная среда разработки Android-приложений, построенная на IntelliJ IDEA. Она объединяет редактор кода, систему сборки Gradle, эмулятор, отладчик, инспекторы макета и базы данных, профилировщик производительности и инструменты для работы с Firebase. Без Android Studio можно собрать APK из командной строки, но для повседневной разработки — написания кода, запуска, диагностики и публикации — это основной инструмент. Понимание возможностей IDE напрямую влияет на скорость разработки: правильная настройка проекта, умение читать логи и использовать отладчик сокращают поиск багов с часов до минут.

Android Studio развивается параллельно с Android SDK: каждая версия приносит поддержку новых API, языковых возможностей Kotlin, улучшения производительности редактора и новые инструменты профилирования. Стабильный канал обновлений рекомендуется для продакшен-работы, а Canary и Beta — для экспериментов с новыми функциями. При первом запуске IDE предлагает скачать Android SDK, создать эмулятор и настроить JDK — этот мастер стоит пройти внимательно, потому что от корректности этих настроек зависит, соберётся ли первый проект.

:::cards
- **Единая среда** — код, сборка, запуск, отладка и профилирование в одном окне.
- **Gradle-интеграция** — синхронизация зависимостей и задач сборки.
- **Инструменты диагностики** — Logcat, Debugger, Layout Inspector, Profiler.
- **Официальная поддержка** — гарантированная совместимость с новыми версиями SDK.
:::

> **Ключевая идея:** Android Studio — это не просто редактор. Это оркестратор всей цепочки разработки: от создания проекта до публикации в Google Play. Умение пользоваться её инструментами диагностики важнее, чем скорость набора кода.

### Установка и настройка Android Studio {#android-studio-install}

Установка начинается со скачивания дистрибутива с официального сайта developer.android.com. Доступны версии для Windows, macOS и Linux. На Windows рекомендуется устанавливать в путь без пробелов и кириллицы, чтобы избежать проблем со сборкой. При первом запуске срабатывает мастер настройки: он скачивает Android SDK, создаёт виртуальное устройство и настраивает JDK. Android Studio поставляется со встроенной JDK (JetBrains Runtime), поэтому отдельно ставить JDK не обязательно, хотя для некоторых инструментов командной строки удобно иметь отдельный JDK 17.

Ключевые настройки после установки:

- **SDK Manager** — установка версий Android SDK, build-tools, platform-tools, эмулятора. Рекомендуется держать актуальными последние стабильные platform и build-tools.
- **AVD Manager** — создание и управление виртуальными устройствами.
- **Gradle JDK** — версия JDK, которую использует Gradle. Должна совпадать с требованиями AGP (Android Gradle Plugin): для AGP 8.x нужен JDK 17.
- **Memory settings** — увеличение heap для IDE и Gradle, если проект большой. Файл `studio.vmoptions` и `gradle.properties`.
- **Keymap и плагины** — по вкусу, но полезно включить плагины для Compose, Firebase, Kotlin.

Типичная ошибка новичков — установить только последнюю версию SDK и не установить старые, на которых нужно тестировать приложение. Другая ошибка — игнорировать предупреждения о несовместимости JDK и AGP, что приводит к непонятным ошибкам синхронизации.

### Создание Android-проекта {#android-studio-create-project}

Создание проекта: File → New → New Project. Мастер предлагает шаблоны: Empty Views Activity, Empty Compose Activity, Basic Activity, Bottom Navigation Views Activity и другие. Выбор шаблона определяет стартовую разметку и зависимости. Для изучения основ обычно выбирают Empty Views Activity, чтобы видеть классическую структуру с XML-макетами и Activity.

Параметры проекта:

- **Name** — имя приложения, отображаемое пользователю.
- **Package name** — уникальный идентификатор приложения в формате обратного домена: `com.example.myapp`. Меняется редко, потому что от него зависят пути в коде и идентификатор в Google Play.
- **Save location** — путь к проекту на диске.
- **Language** — Kotlin или Java. Современный выбор — Kotlin.
- **Minimum SDK** — минимальная версия Android, на которой приложение запустится. Влияет на доступные API и охват аудитории.
- **Build configuration language** — Groovy DSL или Kotlin DSL. Рекомендуется Kotlin DSL (`build.gradle.kts`).

После создания проекта Android Studio запускает Gradle sync — скачивает зависимости и индексирует проект. Это может занять несколько минут при первом запуске. Если sync завершился с ошибкой, читайте сообщение в окне Build: чаще всего проблема в версии JDK, сети или отсутствующем SDK.

### Настройка и запуск эмулятора {#android-studio-emulator}

Эмулятор Android — виртуальное устройство, работающее на базе QEMU с аппаратной виртуализацией (AEHD или WHPX на Windows, KVM на Linux, Hypervisor.framework на macOS). Он позволяет тестировать приложение без физического устройства. Создаётся через AVD Manager: выбирается профиль устройства (Pixel, Nexus и т.д.), образ системы (релиз Android с нужным API level), и опционально Google Play.

Рекомендации по настройке:

- Используйте образы с Google APIs или Google Play, если нужны сервисы Google (Maps, Firebase, авторизация).
- Включите аппаратное ускорение графики (Hardware - GLES 2.0) для плавной работы.
- Выделите достаточно оперативной памяти (2-4 ГБ) и место на диске.
- Включите Quick Boot для быстрого старта между сессиями.

Запуск эмулятора: кнопка Run (зелёный треугольник) или Shift+F10. Android Studio соберёт APK, установит его на эмулятор и запустит главную Activity. Если эмулятор не стартует, проверьте включена ли виртуализация в BIOS и не конфликтует ли другой гипервизор (Docker, VirtualBox).

Типичная ошибка — запускать эмулятор с образом без Google Play и потом удивляться, что Firebase не работает. Другая — создавать AVD с API level выше, чем compileSdk, и получать ошибки совместимости.

### Запуск приложения на физическом устройстве {#android-studio-physical-device}

Запуск на реальном устройстве точнее отражает поведение приложения: производительность, сенсоры, камера, сеть. Для этого нужно:

1. Включить «Параметры разработчика» на устройстве: Settings → About phone → семь раз нажать на «Номер сборки».
2. Включить «Отладка по USB» в параметрах разработчика.
3. Подключить устройство к компьютеру по USB.
4. При первом подключении разрешить отладку с этого компьютера (появится диалог с RSA-ключом).
5. В Android Studio выбрать устройство в выпадающем списке и нажать Run.

Устройство должно быть видно в `adb devices`. Если устройство не определяется, проверьте драйверы (на Windows часто нужен драйвер производителя), кабель (некоторые кабели только для зарядки) и режим USB (должен быть «Передача файлов» или «Отладка»).

Беспроводная отладка доступна начиная с Android 11: Settings → Параметры разработчика → Беспроводная отладка. Подключение через `adb pair` и `adb connect`. Удобно для тестирования на устройстве, которое не хочется держать привязанным кабелем.

Типичная ошибка — запускать релизную сборку с minification на устройстве и не понимать, почему крашатся классы. Отладочная сборка (debug) должна использоваться при разработке.

### Структура проекта в IDE {#android-studio-project-structure}

Android Studio показывает проект в двух представлениях: Android (по умолчанию) и Project. Представление Android группирует файлы по типу: манифесты, java/kotlin код, ресурсы, Gradle-скрипты. Представление Project показывает реальную файловую структуру на диске.

Важные панели:

- **Project** — дерево файлов.
- **Logcat** — логи устройства.
- **Build** — результаты сборки и ошибки.
- **Terminal** — командная строка.
- **Device File Explorer** — файловая система устройства/эмулятора.
- **Database Inspector** — просмотр SQLite/Room баз.
- **Layout Inspector** — иерархия View.

Переключение между представлениями — в выпадающем списке над деревом проекта. Для понимания реальной структуры полезно периодически смотреть представление Project, потому что именно оно отражает то, что попадёт в репозиторий и сборку.

Типичная ошибка — искать файлы в представлении Android и не находить их, потому что они отфильтрованы. Например, build-файлы находятся в корне модуля, а не в папке «Gradle Scripts» в том виде, в котором ожидает новичок.

### Logcat {#android-studio-logcat}

Logcat — инструмент просмотра системных и приложенных логов. Каждая запись имеет уровень (Verbose, Debug, Info, Warn, Error, Assert), тег, процесс и PID. Фильтры позволяют отобрать записи по приложению, тегу, уровню или тексту.

Использование в коде:

```kotlin
import android.util.Log

class UserService {
    fun loadUser(id: Long) {
        Log.d("UserService", "Loading user $id")
        try {
            // загрузка
        } catch (e: Exception) {
            Log.e("UserService", "Failed to load user", e)
        }
    }
}
```

Рекомендации:

- Используйте теги, совпадающие с именем класса, чтобы фильтровать по компоненту.
- Не логируйте чувствительные данные (токены, пароли, персональные данные).
- В релизной сборке отключайте подробное логирование через ProGuard/R8 или условные вызовы.
- Используйте фильтры Logcat в Android Studio: по пакету приложения, по регулярному выражению.

Типичная ошибка — искать причину краша в коде, не посмотрев стектрейс в Logcat. Android всегда пишет стектрейс при необработанном исключении, и он содержит точную строку и класс. Другая ошибка — логировать в главном потоке часто и тяжело, что замедляет UI.

### Debugger {#android-studio-debugger}

Отладчик позволяет приостановить выполнение программы на точке останова (breakpoint) и изучить состояние: переменные, стек вызовов, выражения. Установка breakpoint — клик по номеру строки в редакторе. Запуск в режиме отладки — иконка жука или Shift+F9.

Возможности:

- **Line breakpoint** — остановка на конкретной строке.
- **Conditional breakpoint** — остановка только при условии (например, `id == 42`).
- **Logpoint** — запись в лог без остановки выполнения.
- **Exception breakpoint** — остановка при выбросе исключения определённого типа.
- **Evaluate expression** — вычисление произвольного выражения в текущем контексте.
- **Watches** — отслеживание переменных.

Пошаговое выполнение: Step Over (F8) — следующая строка, Step Into (F7) — зайти в метод, Step Out (Shift+F8) — выйти из метода. Resume (F9) — продолжить выполнение.

Типичная ошибка — ставить breakpoint внутри часто вызываемого метода (например, в `onDraw`) и получать «зависание» приложения. Другая — отлаживать релизную сборку с обфускацией: имена классов и методов будут нечитаемыми. Отлаживайте только debug-сборку.

### Layout Inspector {#android-studio-layout-inspector}

Layout Inspector показывает дерево View текущего экрана в реальном времени: иерархию, свойства (размеры, отступы, цвета), атрибуты. Доступен через Tools → Layout Inspector или автоматически при запуске debug-сборки. Полезен для диагностики проблем с разметкой: почему View не виден, почему размеры не такие, как ожидались, какая View перекрывает другую.

Возможности современного Layout Inspector (с поддержкой Compose):

- Просмотр дерева View/Compose.
- 3D-ротация для понимания наложения.
- Поиск по id или тексту.
- Снимок (snapshot) для офлайн-анализа.
- Отображение constraints ConstraintLayout.

Типичная ошибка — пытаться использовать Layout Inspector на релизной сборке: он работает только с debug. Другая — забывать, что Layout Inspector показывает состояние на момент снимка, и если View изменился динамически, нужно обновить снимок.

**Самопроверка:**
- [ ] Какие инструменты диагностики есть в Android Studio?
- [ ] Как включить отладку по USB на устройстве?
- [ ] Чем отличаются представления Android и Project?
- [ ] Как читать стектрейс в Logcat?
- [ ] Когда Layout Inspector недоступен?

### Вопросы на собеседовании

:::qa
- **Чем Logcat отличается от Debugger?** — Logcat пассивно показывает поток логов с уровнем, тегом и PID и содержит стектрейсы крашей; Debugger останавливает выполнение на breakpoint и позволяет шагать по коду и вычислять выражения в рантайме.
- **Зачем нужен Layout Inspector и почему он не работает на release-сборке?** — Он показывает дерево View/Compose текущего экрана со свойствами и помогает найти перекрывающий или неправильно измеренный View. Инструмент подключается к отладочному процессу, поэтому доступен только для debug-сборки.
- **Как найти утечку памяти через Profiler?** — В Memory Profiler снимают heap dump, ищут уцелевший после ухода с экрана экземпляр `Activity` и смотрят цепочку ссылок, которые его удерживают (синглтон, статическое поле, listener). Утечку подтверждают повторным дампом после принудительного GC.
- **Как отфильтровать логи в Logcat?** — Фильтруют по пакету приложения, тегу, уровню (Verbose…Assert) или регулярному выражению; тег обычно совпадает с именем класса. Это позволяет быстро найти стектрейс среди системных сообщений.
- **Почему нельзя ставить breakpoint в `onDraw`?** — `onDraw` вызывается каждый кадр, поэтому отладчик будет останавливаться десятки раз в секунду и «заморозит» отрисовку. Для таких мест используют conditional breakpoint или logpoint.
- **Что делать, если устройство не видно в `adb devices`?** — Нужно включить «Параметры разработчика» и «Отладку по USB», подтвердить RSA-диалог при первом подключении и проверить драйвер, кабель и режим USB («Передача файлов»).
:::

## 2. Проект и модули {#proekt-i-moduli}

Android-проект — это не просто набор файлов, а структурированная система модулей, ресурсов и конфигураций, управляемая Gradle. Понимание структуры проекта необходимо для навигации по чужому коду, добавления зависимостей, создания библиотечных модулей и правильной организации кода. Хаотичная структура приводит к дублированию, долгой сборке и сложности поддержки.

Проект состоит из одного или нескольких модулей. Каждый модуль — самостоятельная единица сборки со своим build-файлом, манифестом и ресурсами. Модули могут зависеть друг от друга, образуя граф зависимостей. Правильная модульная структура ускоряет сборку (Gradle кэширует неизменённые модули), улучшает переиспользование кода и изолирует ответственность.

:::cards
- **Модуль** — самостоятельная единица сборки со своим build.gradle.
- **app** — главный модуль, собирающийся в APK/AAB.
- **library** — переиспользуемый модуль, собирающийся в AAR.
- **src/** — исходники, ресурсы и тесты модуля.
:::

> **Ключевая идея:** Модульность — это не «разбить на папки», а чёткие границы зависимостей. Каждый модуль должен иметь одну ответственность и минимальное количество зависимостей от других модулей.

### Структура Android-проекта {#project-structure}

Типичный проект выглядит так:

```text
MyApp/
├── build.gradle.kts          (project-level)
├── settings.gradle.kts
├── gradle/
│   └── libs.versions.toml    (version catalog)
├── app/
│   ├── build.gradle.kts      (module-level)
│   └── src/
│       ├── main/
│       ├── test/
│       └── androidTest/
├── core/
│   └── ...
└── feature/
    └── ...
```

Корневые файлы:

- `settings.gradle.kts` — объявляет, какие модули входят в проект: `include(":app", ":core", ":feature:home")`.
- `build.gradle.kts` (project) — общие плагины и конфигурация для всех модулей (обычно пустой или с общими плагинами).
- `gradle/libs.versions.toml` — каталог версий зависимостей.

Корневая папка не содержит кода приложения — только конфигурацию. Код живёт в модулях.

Типичная ошибка — создавать файлы вне модулей (в корне проекта) и потом не понимать, почему они не компилируются. Всё, что компилируется, должно лежать внутри модуля в `src/`.

### Модуль app и library modules {#project-app-library}

**app-модуль** — главный модуль приложения, к которому применяется плагин `com.android.application`. Он собирается в APK или AAB и содержит точку входа (Application, главную Activity). В проекте обычно один app-модуль, хотя возможны несколько (например, для разных приложений на общем коде).

**library-модуль** — модуль с плагином `com.android.library`. Собирается в AAR (Android Archive) и не может запускаться самостоятельно. Используется для переиспользуемого кода: UI-компоненты, сетевой слой, база данных, утилиты. Библиотечный модуль может зависеть от других библиотечных модулей, но не от app.

Различия:

- app-модуль имеет `applicationId`, library — нет.
- app-модуль может иметь несколько build types с разными applicationIdSuffix.
- library-модуль публикует свой код через `api`/`implementation` зависимости.

Типичная ошибка — делать library-модуль зависимым от app-модуля, создавая циклическую зависимость. Направление зависимостей должно быть однонаправленным: app зависит от feature, feature зависит от core, core зависит от ничего.

### Директории src/main, src/test и src/androidTest {#project-src-dirs}

Каждый модуль содержит папку `src/` с исходными наборами (source sets):

- `src/main/` — основной код и ресурсы приложения. Содержит `java/` (или `kotlin/`), `res/`, `AndroidManifest.xml`, `assets/`.
- `src/test/` — юнит-тесты, выполняющиеся на JVM без Android (JUnit, MockK). Быстрые, не требуют эмулятора.
- `src/androidTest/` — инструментальные тесты, выполняющиеся на устройстве/эмуляторе (Espresso, Compose UI Test). Имеют доступ к Android API.

Gradle позволяет создавать дополнительные source sets: `src/debug/`, `src/release/`, `src/staging/` — для кода, специфичного для build type. Также можно создавать source sets для product flavors.

Типичная ошибка — класть тесты в `src/main`, из-за чего они попадают в релизную сборку. Или писать инструментальные тесты там, где достаточно юнит-тестов, что замедляет CI.

### Структура ресурсов res {#project-res}

Папка `res/` содержит все ресурсы приложения, организованные по типам:

```text
res/
├── layout/          # XML-макеты
├── drawable/        # изображения, векторы, shape
├── mipmap/          # иконки приложения
├── values/          # strings, colors, dimens, styles, themes
├── values-night/    # тёмная тема
├── values-ru/       # русская локализация
├── menu/            # меню
├── navigation/      # графы навигации
├── xml/             # прочие XML (preferences, file paths)
└── raw/             # произвольные файлы
```

Каждый тип ресурса имеет свой подкаталог. Имя файла должно состоять из строчных букв, цифр и подчёркиваний. Android генерирует класс `R`, в котором каждому ресурсу соответствует целочисленный идентификатор: `R.string.app_name`, `R.layout.activity_main`, `R.drawable.ic_logo`.

Типичная ошибка — использовать заглавные буквы или дефисы в именах ресурсов: сборка упадёт с ошибкой. Другая — класть большие файлы в `res/raw` и удивляться росту размера APK: для больших ассетов лучше использовать `assets/` или скачивание.

### Назначение build-файлов {#project-build-files}

В проекте два уровня build-файлов:

**Project-level `build.gradle.kts`** (корень) — объявляет плагины, доступные всем модулям, через блок `plugins` с `apply false`. Обычно содержит только версии AGP и Kotlin plugin. В современных проектах с Version Catalog этот файл минимален.

**Module-level `build.gradle.kts`** (внутри модуля) — основная конфигурация: `plugins`, `android { ... }`, `dependencies { ... }`. Здесь задаются compileSdk, minSdk, targetSdk, build types, product flavors, зависимости.

```gradle
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.myapp"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.myapp"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.0")
}
```

Типичная ошибка — путать project-level и module-level файлы и добавлять зависимости в корневой build.gradle. Зависимости добавляются только в module-level.

### Зависимости между модулями {#project-module-deps}

Модули могут зависеть друг от друга. Зависимость объявляется в module-level build.gradle:

```gradle
dependencies {
    implementation(project(":core"))
    implementation(project(":feature:home"))
}
```

Правила:

- Направление зависимостей — однонаправленное (DAG, без циклов). Gradle не соберёт проект с циклической зависимостью.
- `implementation(project(":core"))` — зависимость не транзитивна для потребителей этого модуля.
- `api(project(":core"))` — зависимость транзитивна: модули, зависящие от текущего, тоже получат core.

Рекомендуемая структура слоёв:

```text
app → feature → domain → data → core
```

Каждый слой зависит только от нижележащих. Эта структура ускоряет сборку: изменение в `core` пересобирает всё, изменение в `feature` — только app.

Типичная ошибка — делать все модули зависимыми от app, создавая спагетти. Другая — использовать `api` там, где достаточно `implementation`, что увеличивает время компиляции зависимых модулей.

### Сборка APK и AAB {#project-apk-aab}

**APK (Android Package)** — файл, устанавливаемый на устройство. Используется для тестирования и sideloading. Собирается командой `./gradlew assembleDebug` или `assembleRelease`.

**AAB (Android App Bundle)** — формат публикации в Google Play. Google Play сам генерирует оптимизированные APK для каждого устройства (по плотности экрана, архитектуре CPU, языку). Уменьшает размер загрузки. Собирается командой `./gradlew bundleRelease`.

Разница:

- APK содержит всё для всех конфигураций (универсальный) или одну конфигурацию.
- AAB — не устанавливается напрямую; нужен bundletool или Google Play.
- Для публикации в Google Play требуется AAB (с 2021 года).

Команды сборки:

```bash
./gradlew assembleDebug
./gradlew assembleRelease
./gradlew bundleRelease
./gradlew installDebug
```

Типичная ошибка — пытаться установить AAB на устройство напрямую через `adb install`. Нужно использовать bundletool или собрать APK из bundle. Другая — забывать подписывать релизную сборку: неподписанный APK не установится извне.

**Самопроверка:**
- [ ] Чем отличается app-модуль от library-модуля?
- [ ] Где лежат юнит-тесты и инструментальные тесты?
- [ ] Какой файл объявляет модули проекта?
- [ ] Чем AAB отличается от APK?
- [ ] Почему направление зависимостей должно быть однонаправленным?

### Вопросы на собеседовании

:::qa
- **Чем `src/main`, `src/test` и `src/androidTest` различаются?** — `src/main` содержит код и ресурсы приложения, `src/test` — быстрые JVM-юнит-тесты (JUnit, MockK) без Android, `src/androidTest` — инструментальные тесты (Espresso), которые запускаются на устройстве и имеют доступ к Android API.
- **Зачем выносить код в library-модуль?** — Модуль с плагином `com.android.library` собирается в AAR, переиспользует код и изолирует ответственность; Gradle кэширует неизменённые модули, поэтому ускоряется инкрементальная сборка. Направление зависимостей однонаправленное: `app → feature → core`.
- **Чем APK отличается от AAB?** — APK устанавливается на устройство, а AAB — формат публикации в Google Play, из которого Play генерирует оптимизированные APK под плотность экрана и архитектуру. AAB нельзя поставить через `adb install`: для локальной установки нужен bundletool или собранный APK.
- **Почему library-модуль не должен зависеть от app?** — Это создаёт циклическую зависимость, которую Gradle не соберёт. Зависимости идут только вниз по слоям: app зависит от feature, feature — от core, core — ни от чего.
- **Где объявляются зависимости проекта?** — В module-level `build.gradle.kts` в блоке `dependencies`; project-level файл лишь подключает плагины с `apply false`. Зависимость, добавленная в корневой файл, в модуль не попадёт.
- **Что такое `applicationId` и чем он отличается от `namespace`?** — `applicationId` — уникальный идентификатор приложения на устройстве и в Google Play, его можно менять для вариантов через `applicationIdSuffix`. `namespace` задаётся в build.gradle и с AGP 8.0 заменил атрибут `package` в манифесте для генерации `R` и кода.
:::

## 3. Gradle {#gradle}

Gradle — система автоматизации сборки, используемая Android-проектами. Android Gradle Plugin (AGP) добавляет Android-специфичные задачи: компиляция ресурсов, сборка APK, обфускация. Gradle читает build-скрипты, разрешает зависимости, выполняет задачи в правильном порядке и кэширует результаты. Понимание Gradle необходимо для настройки сборки, добавления зависимостей, создания build variants и диагностики проблем компиляции.

Gradle работает на JVM и использует Groovy или Kotlin DSL для описания сборки. Современные проекты переходят на Kotlin DSL (`build.gradle.kts`) для типобезопасности и автодополнения. Gradle поддерживает инкрементальную сборку и кэширование, что делает повторные сборки быстрыми.

:::cards
- **Gradle** — движок сборки и разрешения зависимостей.
- **AGP** — Android-плагин, добавляющий задачи сборки APK/AAB.
- **DSL** — язык описания сборки (Groovy или Kotlin).
- **Tasks** — атомарные шаги сборки, образующие граф.
:::

> **Ключевая идея:** Gradle — это не «магия, которая собирает APK». Это граф задач с зависимостями и кэшированием. Понимание этого графа позволяет ускорять сборку и находить причину ошибок.

### Роль Gradle и Android Gradle Plugin {#gradle-agp}

**Gradle** — универсальная система сборки. Он не знает об Android: он умеет выполнять задачи, разрешать зависимости, кэшировать результаты. Gradle-ядро одинаково для всех проектов (Java, Kotlin, Android, Spring).

**Android Gradle Plugin (AGP)** — плагин для Gradle, добавляющий Android-специфичные возможности: компиляция ресурсов (AAPT2), сборка манифеста, обработка DEX, создание APK/AAB, подпись, ProGuard/R8. AGP зависит от конкретной версии Gradle: AGP 8.x требует Gradle 8.x. Несовместимость версий — частая причина ошибок синхронизации.

Версии AGP и Gradle указываются в `gradle/wrapper/gradle-wrapper.properties` и в project-level build.gradle. При обновлении AGP нужно обновлять и Gradle wrapper.

Типичная ошибка — обновить AGP, не обновив Gradle wrapper, и получить ошибку совместимости. Другая — использовать AGP новее, чем поддерживает Android Studio.

### build.gradle(.kts): project vs module {#gradle-project-vs-module}

Project-level build.gradle (корень) конфигурирует сборку всего проекта: объявляет плагины с `apply false`, настраивает репозитории. В современных проектах (AGP 8+) репозитории объявляются в `settings.gradle.kts` через `dependencyResolutionManagement`.

Module-level build.gradle (внутри модуля) конфигурирует конкретный модуль: плагины, android-блок, зависимости. Именно здесь задаются compileSdk, minSdk, build types, flavors.

Различие важно: project-level применяется ко всем модулям, module-level — к одному. Попытка задать `compileSdk` в project-level приведёт к ошибке, потому что этот блок существует только в module-level.

Типичная ошибка — добавлять зависимости в project-level build.gradle. Зависимости всегда добавляются в module-level.

### Подключение зависимостей {#gradle-dependencies}

Зависимости объявляются в блоке `dependencies` module-level build.gradle:

```gradle
dependencies {
    implementation("androidx.core:core-ktx:1.13.0")
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
}
```

Формат зависимости: `group:artifact:version`. Gradle ищет артефакт в репозиториях (Maven Central, Google Maven). Конфигурация (`implementation`, `testImplementation`) определяет, для какой сборки и какого classpath доступна зависимость.

Типичные конфигурации:

- `implementation` — основная зависимость, не транзитивна для потребителей.
- `api` — транзитивная зависимость.
- `compileOnly` — только компиляция, не попадает в APK.
- `runtimeOnly` — только рантайм.
- `testImplementation` — для юнит-тестов.
- `androidTestImplementation` — для инструментальных тестов.
- `debugImplementation` — только для debug-сборки.

Типичная ошибка — использовать `implementation` для библиотеки, чьи типы видны в публичном API модуля. Тогда потребители модуля не смогут скомпилироваться. Нужно использовать `api`.

### implementation и api {#gradle-implementation-api}

Разница между `implementation` и `api` — в транзитивности:

- `implementation("lib")` — lib доступна только внутри текущего модуля. Модули, зависящие от текущего, не видят lib. Это ускоряет компиляцию и уменьшает classpath.
- `api("lib")` — lib доступна текущему модулю и всем, кто от него зависит. Используется, когда типы lib появляются в публичном API.

Пример: модуль `network` использует Retrofit. Если в публичных методах `network` возвращаются типы Retrofit (например, `Call<T>`), то зависимость должна быть `api`. Если Retrofit используется только внутри, — `implementation`.

Рекомендация: по умолчанию используйте `implementation`. Переходите на `api` только когда типы реально утекают в публичный API. Это уменьшает время компиляции и предотвращает утечку внутренних зависимостей.

Типичная ошибка — повсеместное использование `api` «на всякий случай». Это увеличивает classpath всех зависимых модулей и замедляет сборку.

### Плагины Gradle {#gradle-plugins}

Плагины расширяют Gradle новыми задачами и конфигурациями. Применяются в блоке `plugins`:

```gradle
plugins {
    id("com.android.application") version "8.4.0"
    id("org.jetbrains.kotlin.android") version "2.0.0"
    id("com.google.devtools.ksp") version "2.0.0-1.0.21"
}
```

В современных проектах версии плагинов указываются в Version Catalog:

```text
[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
```

И применяются:

```gradle
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}
```

Типы плагинов:

- Android-плагины: `com.android.application`, `com.android.library`, `com.android.dynamic-feature`.
- Kotlin-плагины: `kotlin-android`, `kotlin-jvm`, `kotlin-kapt`, `kotlin-parcelize`.
- Инструментальные: Hilt, KSP, Navigation Safe Args.

Типичная ошибка — применять плагин без указания версии, когда версия не задана в classpath. Другая — использовать устаревший `kapt` вместо KSP для процессоров аннотаций.

### Gradle tasks {#gradle-tasks}

Gradle-задача (task) — атомарный шаг сборки. Задачи образуют граф зависимостей: одна задача может зависеть от другой. Примеры Android-задач:

- `assembleDebug` — собрать debug APK.
- `bundleRelease` — собрать release AAB.
- `installDebug` — установить debug APK на устройство.
- `test` — запустить юнит-тесты.
- `connectedAndroidTest` — запустить инструментальные тесты.
- `clean` — удалить build-артефакты.
- `lint` — запустить линтинг.

Выполнение:

```bash
./gradlew tasks                    # список задач
./gradlew assembleDebug            # сборка
./gradlew test --tests "com.example.UserServiceTest"
./gradlew clean assembleDebug     # чистая сборка
```

Gradle кэширует результаты задач: если входы не изменились, задача помечается UP-TO-DATE и пропускается. Это ускоряет повторные сборки.

Типичная ошибка — запускать `clean` перед каждой сборкой «на всякий случай», что убивает кэш и замедляет сборку. Другая — не понимать, что `assemble` зависит от `compile`, `processResources` и других задач, и ошибка в любой из них ломает сборку.

### Build Types и Product Flavors {#gradle-build-types-flavors}

**Build Type** — вариант сборки с разными настройками: debug и release. Debug включает отладку, не обфусцирует код, использует debug-ключ подписи. Release обфусцирует, оптимизирует, требует релизного ключа.

```gradle
buildTypes {
    release {
        isMinifyEnabled = true
        proguardFiles(
            getDefaultProguardFile("proguard-android-optimize.txt"),
            "proguard-rules.pro"
        )
    }
    debug {
        applicationIdSuffix = ".debug"
        isDebuggable = true
    }
}
```

**Product Flavor** — вариант продукта: free/paid, dev/staging/prod. Каждый flavor может иметь свой applicationId, ресурсы, код (через source sets).

```gradle
flavorDimensions += "environment"
productFlavors {
    create("dev") {
        dimension = "environment"
        applicationIdSuffix = ".dev"
    }
    create("prod") {
        dimension = "environment"
    }
}
```

Комбинация build type и flavor даёт **build variant**: devDebug, devRelease, prodDebug, prodRelease. Gradle создаёт задачи для каждого варианта.

Типичная ошибка — создавать слишком много flavors без необходимости, усложняя матрицу сборки. Другая — забывать, что flavor-specific код кладётся в `src/dev/`, а не в `src/main`.

### Version Catalogs (libs.versions.toml) {#gradle-version-catalog}

Version Catalog — централизованный файл зависимостей `gradle/libs.versions.toml`. Он позволяет объявлять версии один раз и переиспользовать их во всех модулях.

```text
[versions]
kotlin = "2.0.0"
agp = "8.4.0"
coreKtx = "1.13.0"

[libraries]
androidx-core-ktx.group = "androidx.core"
androidx-core-ktx.name = "core-ktx"
androidx-core-ktx.version.ref = "coreKtx"
retrofit.group = "com.squareup.retrofit2"
retrofit.name = "retrofit"
retrofit.version = "2.11.0"
okhttp.group = "com.squareup.okhttp3"
okhttp.name = "okhttp"
okhttp.version = "4.12.0"

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }

[bundles]
networking = ["retrofit", "okhttp"]
```

Использование в build.gradle.kts:

```gradle
dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.bundles.networking)
}
```

Преимущества: единый источник версий, автодополнение в IDE, удобство обновления, возможность использовать bundle для группы зависимостей.

Типичная ошибка — дублировать версии в build.gradle, игнорируя catalog, что приводит к рассинхрону. Другая — не использовать `version.ref`, а хардкодить версии в `[libraries]`.

### Транзитивные зависимости {#gradle-transitive}

Транзитивная зависимость — зависимость вашей зависимости. Если модуль A зависит от B, а B зависит от C, то A получает C автоматически. Gradle разрешает граф зависимостей и скачивает все необходимые артефакты.

Проблемы:

- **Конфликты версий** — две зависимости требуют разные версии одной библиотеки. Gradle по умолчанию выбирает самую новую (latest). Это может привести к несовместимости.
- **Раздувание** — транзитивные зависимости добавляют много артефактов, увеличивая размер APK и время сборки.

Инструменты диагностики:

```bash
./gradlew app:dependencies --configuration implementation
./gradlew app:dependencyInsight --dependency okhttp
```

Управление:

- `exclude` — исключить транзитивную зависимость: `implementation("lib") { exclude(group = "com.unwanted") }`.
- Принудительная версия через `resolutionStrategy` или constraints в catalog.

Типичная ошибка — не проверять дерево зависимостей и удивляться, почему в APK попала библиотека, которую никто явно не подключал. Другая — исключать нужные транзитивные зависимости и получать `NoClassDefFoundError` в рантайме.

**Самопроверка:**
- [ ] Чем отличается `implementation` от `api`?
- [ ] Что такое build variant?
- [ ] Зачем нужен Version Catalog?
- [ ] Как посмотреть дерево зависимостей?
- [ ] Какую версию Gradle требует AGP 8.x?

### Вопросы на собеседовании

:::qa
- **В чём разница между `implementation` и `api`?** — `api` экспортирует зависимость потребителям модуля и добавляет её в их classpath, `implementation` оставляет её внутри модуля. По умолчанию используют `implementation`: это уменьшает classpath и ускоряет пересборку; `api` нужен, только когда типы библиотеки видны в публичном API.
- **Что такое build variant?** — Это комбинация build type (`debug`/`release`) и product flavor (`dev`/`prod`): например, `devDebug` или `prodRelease`. Gradle создаёт отдельные задачи и source sets для каждого варианта.
- **Чем build type отличается от product flavor?** — Build type задаёт режим сборки: отладка, `isMinifyEnabled`, ключ подписи. Flavor описывает вариант продукта (free/paid, dev/prod) со своим `applicationId` и ресурсами; flavor-специфичный код лежит в `src/dev/`, а не в `src/main`.
- **Зачем нужен Version Catalog?** — `gradle/libs.versions.toml` хранит версии и координаты в одном месте и даёт type-safe accessors вроде `libs.androidx.core.ktx`. Это устраняет дублирование версий по модулям и упрощает обновление.
- **Как исключить транзитивную зависимость?** — Через `exclude(group = "...", module = "...")` в объявлении зависимости или правило `resolutionStrategy`; дерево смотрят командой `./gradlew app:dependencies`. Исключать аккуратно: можно получить `NoClassDefFoundError` в рантайме.
- **Чем AGP отличается от Gradle?** — Gradle — универсальный движок с графом задач и кэшированием, а AGP — плагин, добавляющий Android-задачи (AAPT2, DEX, APK/AAB, R8). Версии должны совпадать: AGP 8.x требует Gradle 8.x и JDK 17.
:::

## 4. AndroidManifest {#androidmanifest}

AndroidManifest.xml — XML-файл, описывающий приложение для Android-системы. Он объявляет компоненты (Activity, Service, Receiver, Provider), запрашивает разрешения, указывает минимальную и целевую версии SDK, определяет иконку и название приложения. Без манифеста система не знает, что умеет приложение и как с ним взаимодействовать. Манифест читается системой при установке приложения и при запуске.

Манифест объединяется из нескольких источников: основной манифест модуля, манифесты библиотек (через manifest merger), и манифесты build variants. Итоговый манифест можно посмотреть в `app/build/intermediates/merged_manifest/`.

:::cards
- **Компоненты** — Activity, Service, Receiver, Provider объявляются здесь.
- **Разрешения** — что приложение просит у системы и пользователя.
- **Фильтры** — как приложение реагирует на Intent'ы.
- **Метаданные** — имя, иконка, тема, minSdk/targetSdk.
:::

> **Ключевая идея:** Манифест — это контракт между приложением и системой Android. Всё, что система должна знать о приложении (какие экраны есть, какие разрешения нужны, как реагировать на ссылки), объявляется здесь.

### Структура AndroidManifest.xml {#manifest-structure}

Базовая структура:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.MyApp">

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

Корневой элемент — `<manifest>`, внутри — `<uses-permission>`, `<uses-feature>`, `<application>`. В `<application>` объявляются компоненты. Атрибут `package` в современных проектах заменён на `namespace` в build.gradle: начиная с AGP 8.0 указание `package` в манифесте приводит к ошибке сборки.

Типичная ошибка — забывать объявить компонент в манифесте и получать `ActivityNotFoundException` или `ClassNotFoundException` при запуске. Другая — дублировать объявления, что приводит к конфликтам при merge.

### Объявление Activity и других компонентов {#manifest-components}

Все компоненты приложения должны быть объявлены в манифесте:

```xml
<activity android:name=".MainActivity" android:exported="true" />
<activity android:name=".DetailsActivity" />
<service android:name=".SyncService" />
<receiver android:name=".BootReceiver" android:exported="true" />
<provider
    android:name=".DataProvider"
    android:authorities="com.example.myapp.provider"
    android:exported="false" />
```

- `android:name` — полное имя класса (можно сократить до `.ClassName`, если package указан).
- `Activity` — экран с UI.
- `Service` — фоновая работа без UI.
- `BroadcastReceiver` — приём системных или приложенных сообщений.
- `ContentProvider` — доступ к данным приложения (контакты, файлы).

Типичная ошибка — забыть объявить Service или Receiver и удивляться, что они не запускаются. Другая — объявить компонент с неправильным именем пакета, что приводит к крашу при запуске.

### uses-permission {#manifest-uses-permission}

Разрешения запрашиваются через `<uses-permission>`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

Разрешения делятся на две категории:

- **Normal permissions** — выдаются автоматически при установке (INTERNET, ACCESS_NETWORK_STATE, VIBRATE). Не требуют запроса у пользователя.
- **Dangerous permissions** — требуют явного согласия пользователя во время работы (CAMERA, LOCATION, CONTACTS, STORAGE, MICROPHONE). Запрашиваются через `ActivityCompat.requestPermissions` или Activity Result API.

Типичная ошибка — объявить разрешение в манифесте, но не запросить его в рантайме для dangerous-разрешений, и получить SecurityException при использовании. Другая — запрашивать разрешения, которые не нужны, что снижает доверие пользователя.

### uses-feature {#manifest-uses-feature}

`<uses-feature>` объявляет аппаратные или программные возможности, от которых зависит приложение:

```xml
<uses-feature android:name="android.hardware.camera" android:required="true" />
<uses-feature
    android:name="android.hardware.camera.autofocus"
    android:required="false" />
<uses-feature
    android:name="android.hardware.location.gps"
    android:required="false" />
```

Google Play использует эти объявления для фильтрации: если устройство не имеет required-возможности, приложение не будет доступно для установки. `required="false"` означает, что приложение работает без этой возможности, но может её использовать.

Типичная ошибка — помечать все возможности как `required="true"`, что сужает аудиторию. Например, камера может быть опциональной, если приложение работает и без неё. Другая — не объявлять `uses-feature` для камеры, но запрашивать CAMERA-разрешение: Google Play может не отфильтровать устройства без камеры.

### Intent filters {#manifest-intent-filters}

Intent filter объявляет, какие Intent'ы может обработать компонент:

```xml
<activity android:name=".ShareActivity" android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.SEND" />
        <category android:name="android.intent.category.DEFAULT" />
        <data android:mimeType="text/plain" />
    </intent-filter>
</activity>
```

Система использует фильтры для неявных Intent'ов: когда приложение вызывает `startActivity(Intent(Intent.ACTION_SEND))`, система находит все Activity с подходящим фильтром и показывает chooser. Фильтр может содержать `<action>`, `<category>`, `<data>`.

Типичная ошибка — забывать `<category android:name="android.intent.category.DEFAULT" />` для неявных Intent'ов: без неё Activity не будет найдена. Другая — объявлять MAIN/LAUNCHER фильтр у нескольких Activity, что создаёт несколько иконок в лаунчере.

### android:exported {#manifest-exported}

Атрибут `android:exported` определяет, может ли компонент быть запущен другими приложениями:

- `exported="true"` — компонент доступен другим приложениям (через явные или неявные Intent'ы).
- `exported="false"` — только внутри приложения.

Начиная с Android 12 (API 31), для Activity, Service и Receiver с intent-filter атрибут `exported` обязателен. Если он не указан, сборка упадёт. Это изменение сделано ради безопасности: по умолчанию компоненты с фильтрами становились доступны всем, что часто приводило к утечкам данных.

Правило: если компонент имеет intent-filter и должен быть доступен извне — `exported="true"` (например, MAIN/LAUNCHER Activity, ShareActivity). Если фильтр нужен только для внутренних целей — `exported="false"`.

Типичная ошибка — ставить `exported="true"` у всех компонентов «на всякий случай», что открывает приложение для внешних атак. Другая — забывать обязательный атрибут и получать ошибку сборки на API 31+.

### minSdk и targetSdk {#manifest-minsdk-targetsdk}

Эти значения задаются в build.gradle, но отражаются в манифесте:

- **minSdk (minSdkVersion)** — минимальная версия Android, на которой приложение запустится. Определяет доступные API и охват аудитории. Чем ниже minSdk, тем больше устройств, но тем больше условий `if (Build.VERSION.SDK_INT >= ...)`.
- **targetSdk (targetSdkVersion)** — версия, под которую приложение оптимизировано. Система применяет поведенческие изменения, начиная с этой версии. Google Play требует targetSdk не ниже определённого уровня (актуально — не старше одного года).
- **compileSdk** — версия SDK, против которой компилируется код. Должна быть актуальной.

```gradle
android {
    compileSdk = 34
    defaultConfig {
        minSdk = 24
        targetSdk = 34
    }
}
```

Типичная ошибка — держать minSdk слишком низким (API 16) и писать много условий совместимости. Или держать targetSdk старым, что приводит к отклонению публикации в Google Play. Рекомендуется: minSdk — исходя из статистики пользователей (обычно 24-26), targetSdk — последняя стабильная версия.

### Назначение application и activity attributes {#manifest-app-activity-attrs}

Атрибуты `<application>` задают глобальные свойства приложения:

- `android:name` — класс Application (для инициализации).
- `android:icon` / `android:roundIcon` — иконки приложения.
- `android:label` — название приложения.
- `android:theme` — базовая тема.
- `android:allowBackup` — разрешить резервное копирование.
- `android:usesCleartextTraffic` — разрешить HTTP (не рекомендуется).
- `android:networkSecurityConfig` — конфигурация сетевой безопасности.

Атрибуты `<activity>`:

- `android:exported` — доступность извне.
- `android:launchMode` — режим запуска (standard, singleTop, singleTask, singleInstance).
- `android:screenOrientation` — фиксация ориентации.
- `android:configChanges` — изменения конфигурации, которые Activity обработает сама (без пересоздания).
- `android:windowSoftInputMode` — поведение при появлении клавиатуры.
- `android:theme` — тема конкретной Activity.

Типичная ошибка — использовать `android:configChanges="orientation|screenSize"` для «избежания» пересоздания Activity при повороте, что приводит к утечкам и некорректному отображению. Лучше правильно обрабатывать жизненный цикл.

### Manifest permissions vs runtime permissions {#manifest-runtime-permissions}

Разница между объявлением в манифесте и запросом в рантайме:

- **Manifest permission** (`<uses-permission>`) — декларация того, что приложение может использовать возможность. Обязательна для всех разрешений.
- **Runtime permission** — запрос согласия пользователя во время работы для dangerous-разрешений (начиная с Android 6.0, API 23).

Процесс:

1. Объявить в манифесте.
2. Проверить, выдано ли разрешение: `ContextCompat.checkSelfPermission(context, permission)`.
3. Если нет — запросить через `registerForActivityResult(ActivityResultContracts.RequestPermission())`.
4. Обработать результат в коллбэке.

```kotlin
val requestPermission = registerForActivityResult(
    ActivityResultContracts.RequestPermission()
) { granted ->
    if (granted) loadCamera() else showRationale()
}

// при необходимости
if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
    != PackageManager.PERMISSION_GRANTED
) {
    requestPermission.launch(Manifest.permission.CAMERA)
} else {
    loadCamera()
}
```

Типичная ошибка — объявить разрешение в манифесте и считать, что оно автоматически выдано. На Android 6+ dangerous-разрешения нужно запрашивать явно. Другая — не обрабатывать отказ пользователя и крашить приложение.

**Самопроверка:**
- [ ] Какие компоненты объявляются в манифесте?
- [ ] Чем normal permission отличается от dangerous?
- [ ] Зачем нужен `android:exported`?
- [ ] Что такое minSdk и targetSdk?
- [ ] Как запросить разрешение в рантайме?

### Вопросы на собеседовании

:::qa
- **Зачем с Android 12 обязателен `android:exported`?** — Начиная с API 31, Activity, Service и Receiver с intent-filter обязаны явно указать этот атрибут, иначе сборка упадёт. Изменение закрыло ситуацию, когда компонент с фильтром по умолчанию становился доступен другим приложениям.
- **Чем `<uses-permission>` отличается от runtime-запроса?** — Декларация в манифесте обязательна для всех разрешений, но dangerous (например, `CAMERA` или `ACCESS_FINE_LOCATION`) с Android 6.0 требуют ещё и согласия пользователя во время работы через `ActivityResultContracts.RequestPermission()`. Без запроса вызов упадёт с `SecurityException`.
- **Что такое `<intent-filter>` и зачем в нём `CATEGORY_DEFAULT`?** — Фильтр объявляет `<action>`, `<category>` и `<data>`, которые компонент умеет обрабатывать; по нему система находит обработчика implicit Intent. Без `android.intent.category.DEFAULT` Activity не будет найдена для неявного Intent'а.
- **Чем отличаются `minSdk`, `targetSdk` и `compileSdk`?** — `minSdk` задаёт минимальную версию Android и охват устройств, `targetSdk` — версию, под которую приложение оптимизировано и с которой система применяет поведенческие изменения, `compileSdk` — SDK, против которого компилируется код. Google Play требует актуальный `targetSdk`.
- **Почему не стоит добавлять `android:configChanges` «для всех случаев»?** — Атрибут отключает пересоздание Activity при указанных изменениях и вызывает `onConfigurationChanged()` вместо него, но тогда приложение само обновляет ресурсы и layout. Это легко приводит к утечкам и некорректному отображению.
- **Чем опасно `exported="true"` у всех компонентов?** — Экспортированный компонент может быть запущен другим приложением с произвольными extras и данными. Экспортируют только MAIN/LAUNCHER и реально нужные извне компоненты, остальным ставят `exported="false"`.
:::

## 5. Resources {#resources}

Система ресурсов Android позволяет выносить строки, цвета, размеры, изображения и темы из кода в XML-файлы. Это упрощает локализацию, поддержку разных экранов и тем, а также повторное использование. Ресурсы идентифицируются по имени и типу через класс `R`, генерируемый на этапе сборки. Правильная работа с ресурсами — основа поддерживаемого и доступного приложения.

Android выбирает подходящий ресурс на основе конфигурации устройства: язык, плотность экрана, ориентация, размер экрана, тёмная/светлая тема. Это позволяет одному приложению адаптироваться к разным устройствам без изменения кода.

:::cards
- **strings.xml** — тексты и локализация.
- **colors.xml** — цветовые ресурсы.
- **dimens.xml** — размеры и отступы.
- **drawables/mipmap** — графика и иконки.
- **themes/styles** — визуальное оформление.
:::

> **Ключевая идея:** Ресурсы — это не «файлы, которые где-то лежат». Это типизированная система с автоматическим выбором под конфигурацию устройства. Имя ресурса — это API, к которому обращается код.

### strings.xml и локализация {#resources-strings}

Строковые ресурсы хранятся в `res/values/strings.xml`:

```xml
<resources>
    <string name="app_name">Моё приложение</string>
    <string name="welcome_message">
    Добро пожаловать, %1$s!
</string>
    <string name="items_count">Товаров: %d</string>
    <plurals name="days">
        <item quantity="one">%d день</item>
        <item quantity="few">%d дня</item>
        <item quantity="many">%d дней</item>
    </plurals>
</resources>
```

Локализация: создайте папку `res/values-ru/`, `res/values-en/`, `res/values-de/` с переведёнными strings.xml. Android автоматически выберет ресурс по языку устройства. Если перевода нет — используется значение из `res/values/` (default).

Форматирование: используйте позиционные аргументы (`%1$s`, `%2$d`) для корректного порядка слов в разных языках. Для множественного числа — `<plurals>`.

Доступ из кода: `getString(R.string.welcome_message, userName)` или `resources.getString(...)`.

Типичная ошибка — хардкодить строки в коде или разметке вместо использования ресурсов. Это делает локализацию невозможной. Другая — использовать `resources.getString` без учёта контекста (например, в статическом методе без Context).

### colors.xml и color resources {#resources-colors}

Цветовые ресурсы хранятся в `res/values/colors.xml`:

```xml
<resources>
    <color name="primary">#FF6200EE</color>
    <color name="primary_dark">#FF3700B3</color>
    <color name="accent">#FF03DAC5</color>
    <color name="background">#FFFFFFFF</color>
    <color name="text_primary">#DE000000</color>
</resources>
```

Форматы: `#RGB`, `#ARGB`, `#RRGGBB`, `#AARRGGBB`. Цвета можно переопределять для тёмной темы в `res/values-night/colors.xml`.

Доступ из кода:

```kotlin
val color = ContextCompat.getColor(context, R.color.primary)
```

Из XML: `android:textColor="@color/text_primary"`.

Типичная ошибка — хардкодить цвета в разметке (`#FF0000`) вместо использования ресурсов. Это усложняет смену темы. Другая — путать `getColor` (устаревший) с `ContextCompat.getColor` (рекомендуемый).

### dimens.xml {#resources-dimens}

Размеры хранятся в `res/values/dimens.xml`:

```xml
<resources>
    <dimen name="margin_small">8dp</dimen>
    <dimen name="margin_medium">16dp</dimen>
    <dimen name="text_size_title">20sp</dimen>
    <dimen name="icon_size">24dp</dimen>
</resources>
```

Единицы:

- `dp` (density-independent pixels) — для размеров View, отступов, иконок. Масштабируется по плотности экрана.
- `sp` (scale-independent pixels) — для текста. Масштабируется по плотности и настройкам размера шрифта пользователя.
- `px` — физические пиксели, использовать не рекомендуется.

Доступ из кода:

```kotlin
val margin = resources.getDimensionPixelSize(R.dimen.margin_medium)
```

Типичная ошибка — использовать `px` или `sp` для отступов, что приводит к некорректному отображению на разных экранах. Другая — не создавать отдельные dimens для разных размеров экранов (sw600dp и т.д.).

### Drawables и mipmap {#resources-drawables-mipmap}

**Drawable** (`res/drawable/`) — изображения, векторы, shape, layer-list, selector. Поддерживаемые форматы: PNG, JPEG, WebP, SVG (через VectorDrawable). VectorDrawable предпочтителен: масштабируется без потери качества и меньше весит.

**Mipmap** (`res/mipmap-xxxhdpi/`) — иконки приложения (launcher icon). Раздельная папка нужна, чтобы лаунчер мог выбрать иконку нужной плотности независимо от плотности экрана устройства.

```xml
<!-- res/drawable/ic_check.xml -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FF000000"
        android:pathData="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41,-1.41z" />
</vector>
```

Использование: `android:src="@drawable/ic_check"` или `setImageResource(R.drawable.ic_check)`.

Типичная ошибка — класть иконку приложения в drawable вместо mipmap: лаунчер может показать размытую иконку. Другая — использовать растровые PNG вместо VectorDrawable, что увеличивает размер APK.

### Themes и styles {#resources-themes-styles}

**Style** — набор атрибутов, применяемый к View. **Theme** — style, применяемый ко всему приложению или Activity.

```xml
<style name="TextTitle" parent="TextAppearance.Material3.TitleLarge">
    <item name="android:textColor">@color/text_primary</item>
    <item name="android:textSize">@dimen/text_size_title</item>
</style>
```

Тема определяется в `res/values/themes.xml`:

```xml
<style name="Theme.MyApp" parent="Theme.Material3.DayNight.NoActionBar">
    <item name="colorPrimary">@color/primary</item>
    <item name="colorOnPrimary">@color/white</item>
    <item name="android:statusBarColor">@color/primary_dark</item>
</style>
```

Material3 (Material You) поддерживает динамические цвета: на Android 12+ тема может адаптироваться к обоям пользователя через `DynamicColors.applyToActivitiesIfAvailable(this)`.

Типичная ошибка — переопределять тему на каждой Activity, вместо использования одной базовой темы с переопределениями. Другая — использовать устаревшую тему AppCompat в проекте на Material3.

### Resource qualifiers {#resources-qualifiers}

Квалификаторы — суффиксы папок ресурсов, определяющие, для каких конфигураций они предназначены:

```text
values/              # default
values-ru/           # русский язык
values-night/        # тёмная тема
values-land/         # ландшафтная ориентация
values-sw600dp/      # экраны шириной >= 600dp (планшеты)
drawable-xhdpi/      # плотность xhdpi
drawable-night/      # тёмная тема (для изображений)
```

Android выбирает наиболее специфичный ресурс, подходящий под текущую конфигурацию. Порядок квалификаторов важен и регламентирован (MCC, MNC, язык, размер экрана, ориентация, плотность и т.д.).

Типичная ошибка — неправильный порядок квалификаторов в имени папки: Android проигнорирует папку. Другая — создавать слишком много вариантов, что усложняет поддержку.

### Ресурсы для ориентации и размеров экрана {#resources-orientation-size}

Для разных ориентаций и размеров экранов создаются отдельные ресурсы:

- `res/layout/` — портретная ориентация (default).
- `res/layout-land/` — ландшафтная ориентация.
- `res/layout-sw600dp/` — планшеты (smallest width >= 600dp).
- `res/values-sw600dp/` — размеры для планшетов.

Альтернативный подход — использовать один layout с ConstraintLayout и адаптивными constraints, что уменьшает дублирование. Но для кардинально разных раскладок (телефон vs планшет) отдельные layouts оправданы.

Типичная ошибка — фиксировать ориентацию через `android:screenOrientation="portrait"` вместо адаптации layout. Это ухудшает UX на планшетах и при повороте. Другая — дублировать layout без необходимости, когда достаточно одного адаптивного.

### Доступ к ресурсам из кода {#resources-access-code}

Ресурсы доступны через `Resources` объекта Context:

```kotlin
// строки
val appName = getString(R.string.app_name)
val welcome = getString(R.string.welcome_message, userName)

// цвета
val color = ContextCompat.getColor(this, R.color.primary)

// размеры
val margin = resources.getDimensionPixelSize(R.dimen.margin_medium)

// drawable
val icon = ContextCompat.getDrawable(this, R.drawable.ic_check)

// массивы
val items = resources.getStringArray(R.array.categories)
```

В Compose ресурсы доступны через `stringResource()`, `colorResource()`, `dimensionResource()`.

Типичная ошибка — обращаться к ресурсам до того, как Context доступен (например, в статическом инициализаторе или до `onCreate`). Другая — использовать `resources.getString` вместо `getString` в Activity, что работает, но менее идиоматично.

**Самопроверка:**
- [ ] Как создать локализацию для русского языка?
- [ ] Чем dp отличается от sp?
- [ ] Где хранятся иконки приложения?
- [ ] Как Android выбирает ресурс для устройства?
- [ ] Как получить цвет из ресурсов в коде?

### Вопросы на собеседовании

:::qa
- **Чем `dp` отличается от `sp`?** — `dp` масштабируется только по плотности экрана и используется для размеров и отступов, а `sp` дополнительно учитывает пользовательский масштаб шрифта. Текст поэтому всегда задают в `sp`, а `px` не рекомендуется.
- **Как Android выбирает ресурс под устройство?** — Система смотрит квалификаторы папок (`values-ru`, `values-night`, `values-sw600dp`, `drawable-xhdpi`) и берёт наиболее специфичный подходящий вариант, иначе default. Порядок квалификаторов регламентирован: ошибка в имени папки заставит Android проигнорировать её.
- **Почему строки нельзя хардкодить?** — Хардкод в коде или XML делает локализацию невозможной и не позволяет переопределить текст под конфигурацию. Строки лежат в `res/values/strings.xml`, переводы — в `values-<язык>`, а порядок слов и множественное число задаются позиционными аргументами (`%1$s`) и `<plurals>`.
- **Зачем иконку приложения класть в `res/mipmap`, а не в `drawable`?** — Отдельная mipmap-папка позволяет лаунчеру выбрать иконку нужной плотности независимо от плотности экрана устройства; иначе иконка может выглядеть размытой.
- **Чем style отличается от theme?** — Style — набор атрибутов для одного View, theme — style, применённый ко всему приложению или Activity и разрешающий ссылки `?attr/...`. Лучше одна базовая тема с переопределениями, чем настройка каждой Activity.
- **Как получить ресурс из кода?** — Через Context: `getString(R.string.app_name)`, `ContextCompat.getColor(...)` или `resources.getDimensionPixelSize(...)`. Обращаться к ресурсам можно, только когда Context уже доступен, — не в статическом инициализаторе.
:::

## 6. Context и Application {#context-i-application}

Context — один из центральных классов Android. Он предоставляет доступ к ресурсам, системным сервисам, файловой системе, базам данных, SharedPreferences и информации о приложении. Каждый компонент (Activity, Service, Application) является Context'ом. Неправильное использование Context — частая причина утечек памяти и крашей. Понимание разницы между Activity Context и Application Context критически важно для корректной работы приложения.

Context — это абстрактный класс, конкретные реализации: `Activity`, `Application`, `Service`. Все они наследуют `Context`, но имеют разный жизненный цикл и возможности. Выбор правильного Context зависит от задачи: для UI-операций нужен Activity Context, для долгоживущих операций — Application Context.

:::cards
- **Context** — шлюз к ресурсам и системным сервисам.
- **Activity Context** — привязан к экрану, имеет тему.
- **Application Context** — живёт всё время приложения.
- **Утечки** — хранение Activity Context в долгоживущих объектах.
:::

> **Ключевая идея:** Context — это не просто «ссылка на приложение». Это объект с жизненным циклом. Неправильный выбор Context приводит к утечкам памяти или крашам. Правило: используйте минимально необходимый Context с подходящим жизненным циклом.

### Назначение Context {#context-purpose}

Context предоставляет:

- Доступ к ресурсам: `getString()`, `getDrawable()`, `getColor()`.
- Доступ к системным сервисам: `getSystemService()`.
- Доступ к файловой системе: `getFilesDir()`, `getCacheDir()`, `openFileOutput()`.
- Информацию о приложении: `getPackageName()`, `getApplicationInfo()`.
- Запуск компонентов: `startActivity()`, `startService()`.
- Работу с SharedPreferences, базами данных, ContentResolver.

Context — это интерфейс к системе Android. Без него невозможно получить доступ к большинству возможностей платформы. Каждый компонент приложения (Activity, Service, Application) является Context'ом, поэтому в большинстве случаев Context уже доступен.

Типичная ошибка — создавать собственный Context или пытаться использовать null вместо реального Context. Context всегда должен быть получен из компонента или передан через параметр.

### Activity Context {#context-activity}

Activity Context привязан к конкретному экрану (Activity). Он имеет доступ к теме Activity, окну, View-иерархии. Живёт от создания Activity до её уничтожения.

Особенности:

- Имеет тему (можно получить `Theme`, `Resources` с учётом темы).
- Может показывать диалоги, Toast, Snackbar.
- Может запускать другие Activity.
- Уничтожается при уничтожении Activity.

Использование: для UI-операций, создания View, показа диалогов, доступа к теме. В большинстве случаев в Activity `this` и есть Activity Context.

Типичная ошибка — передавать Activity Context в долгоживущий объект (синглтон, ViewModel без учёта scope), что приводит к утечке Activity. Другая — использовать Activity Context для операций, не связанных с UI (сетевые запросы, БД), что привязывает их к жизненному циклу экрана.

### Application Context {#context-application}

Application Context привязан к процессу приложения и живёт всё время работы приложения. Получается через `getApplicationContext()` или `applicationContext`.

Особенности:

- Не имеет темы Activity (используется тема приложения).
- Не может показывать диалоги или UI, привязанные к окну.
- Безопасен для долгоживущих объектов.
- Доступен из любого компонента.

Использование: синглтоны, репозитории, базы данных, сетевой клиент, SharedPreferences, WorkManager. Всё, что живёт дольше одного экрана.

Типичная ошибка — использовать Application Context для создания View или показа диалогов: тема будет неправильной, а диалог не привяжется к окну. Другая — путать `getApplicationContext()` с `this` в Activity и использовать не тот Context.

### Получение ресурсов и системных сервисов {#context-resources-services}

Ресурсы:

```kotlin
val appName = context.getString(R.string.app_name)
val color = ContextCompat.getColor(context, R.color.primary)
val drawable = ContextCompat.getDrawable(context, R.drawable.ic_check)
```

Системные сервисы:

```kotlin
val locationManager =
    context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
val notificationManager =
    context.getSystemService(Context.NOTIFICATION_SERVICE)
        as NotificationManager
val clipboard =
    context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
val alarmManager =
    context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
```

В Kotlin есть расширения: `context.getSystemService<LocationManager>()`.

Типичная ошибка — вызывать `getSystemService` с неправильным именем сервиса и получать ClassCastException. Другая — не проверять на null результат `getSystemService` для сервисов, которые могут быть недоступны на некоторых устройствах.

### Получение доступа к файловой системе {#context-filesystem}

Context предоставляет доступ к файловой системе приложения:

```kotlin
// внутреннее хранилище (приватное для приложения)
val filesDir = context.filesDir          // /data/data/<package>/files
val cacheDir = context.cacheDir         // /data/data/<package>/cache

// запись файла
context.openFileOutput("data.txt", Context.MODE_PRIVATE).use { output ->
    output.write("hello".toByteArray())
}

// чтение файла
context.openFileInput("data.txt").use { input ->
    val text = input.bufferedReader().readText()
}

// внешнее хранилище (устаревший подход)
val externalDir = context.getExternalFilesDir(null)
```

Внутреннее хранилище приватно для приложения и удаляется при удалении приложения. Внешнее хранилище (`getExternalFilesDir`) на старых версиях доступно другим приложениям при наличии разрешений и тоже удаляется при удалении приложения.

Типичная ошибка — писать файлы во внешнее хранилище без проверки разрешений и доступности. Другая — не закрывать потоки (используйте `use`).

### Application class и инициализация приложения {#context-application-class}

Кастомный класс Application создаётся для инициализации приложения: настройка DI (Hilt/Koin), инициализация библиотек (Firebase, Crashlytics), глобальные конфигурации.

```kotlin
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        // инициализация
        Firebase.initializeApp(this)
        // Hilt инициализируется автоматически через @HiltAndroidApp
    }
}
```

Регистрация в манифесте:

```xml
<application
    android:name=".MyApp"
    android:icon="@mipmap/ic_launcher"
    android:label="@string/app_name">
    ...
</application>
```

Application.onCreate() вызывается один раз при создании процесса, до создания любой Activity. Это хорошее место для инициализации синглтонов и библиотек. Но не выполняйте здесь тяжёлую работу — это блокирует старт приложения.

Типичная ошибка — выполнять сетевые запросы или тяжёлые вычисления в Application.onCreate(), что замедляет запуск. Другая — забыть зарегистрировать Application в манифесте, из-за чего кастомный класс не используется.

### Выбор подходящего Context {#context-choosing}

Правила выбора:

- Для UI-операций (создание View, показ диалогов, Toast, Snackbar, доступ к теме) — Activity Context.
- Для долгоживущих операций (БД, сеть, SharedPreferences, файлы, WorkManager) — Application Context.
- В Adapter'ах (RecyclerView) — используйте Context из parent, но не храните его дольше, чем живёт список.
- В ViewModel — не храните Context вообще; если нужен, используйте Application Context через AndroidViewModel (не рекомендуется) или передавайте зависимости через DI.

```kotlin
// правильно: передача Application Context в репозиторий
class UserRepository(private val context: Context) {
    // использует context.applicationContext для файлов/БД
}

// неправильно: хранение Activity Context
class UserRepository(private val activity: Activity) { ... } // утечка
```

Типичная ошибка — передавать Activity Context туда, где нужен Application Context, и получать утечку. Другая — наоборот, использовать Application Context для UI и получать неправильную тему или краш при показе диалога.

### Утечки памяти при неправильном хранении Context {#context-memory-leaks}

Утечка памяти возникает, когда долгоживущий объект хранит ссылку на Activity Context, который должен быть уничтожен. Например:

```kotlin
// УТЕЧКА
object Cache {
    var context: Context? = null  // хранит Activity Context навсегда
}

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Cache.context = this  // Activity никогда не освободится
    }
}
```

Причины утечек:

- Статические поля, хранящие Context.
- Внутренние классы (не static), хранящие неявную ссылку на внешний класс.
- Listener'ы и callback'и, не отменённые при уничтожении.
- Handler'ы с отложенными сообщениями.

Способы предотвращения:

- Использовать Application Context в синглтонах.
- Использовать `WeakReference` для Context, если он действительно нужен.
- Отменять подписки в `onDestroy` / `onCleared` (ViewModel).
- Использовать LeakCanary для автоматического обнаружения утечек в debug-сборках.

Типичная ошибка — думать, что GC сам всё почистит. GC чистит только объекты без ссылок; если ссылка на Activity хранится в синглтоне, Activity не будет собран. Другая — игнорировать предупреждения LeakCanary.

**Самопроверка:**
- [ ] Чем Activity Context отличается от Application Context?
- [ ] Какой Context использовать в синглтоне?
- [ ] Почему хранение Activity Context в статическом поле приводит к утечке?
- [ ] Как инициализировать приложение через Application class?
- [ ] Что делает LeakCanary?

### Вопросы на собеседовании

:::qa
- **Чем Activity Context отличается от Application Context?** — Activity Context привязан к экрану, имеет тему, окно и View-иерархию и живёт до уничтожения Activity. Application Context привязан к процессу, живёт всё время работы приложения, но не имеет темы Activity и не может показывать диалоги.
- **Почему нельзя хранить Activity в синглтоне?** — Синглтон живёт дольше экрана, поэтому ссылка на Activity не даёт GC собрать её после поворота или ухода — это утечка памяти. В долгоживущих объектах используют `applicationContext`.
- **Что такое утечка Context и как её найти?** — Это ситуация, когда статическое поле, внутренний класс, незакрытый listener или Handler удерживает ссылку на уничтоженную Activity. LeakCanary в debug-сборке показывает цепочку ссылок, которая её держит.
- **Какой Context выбрать для диалога и для базы данных?** — Для UI (диалог, Toast, Snackbar, View с темой) нужен Activity Context; для БД, сети, SharedPreferences, файлов и WorkManager — Application Context, не привязанный к жизненному циклу экрана.
- **Зачем нужен кастомный класс `Application`?** — Он создаётся один раз при старте процесса до любой Activity, регистрируется в манифесте через `android:name` и служит для инициализации DI, Firebase и Crashlytics. Тяжёлую работу и сетевые запросы в `onCreate()` делать нельзя — это задерживает старт приложения.
- **Почему ViewModel не должна хранить Context?** — ViewModel переживает поворот экрана, а ссылка на Activity внутри неё привела бы к утечке. Зависимости передают через DI, а если Context реально нужен — берут `applicationContext`.
:::

## 7. Layouts XML {#layouts-xml}

XML-разметка — декларативный способ описания интерфейса Android-приложения. Файлы лежат в `res/layout/` (и его квалифицированных вариантах, например `res/layout-land/`), а в коде превращаются в дерево объектов через `LayoutInflater`. Главная идея: разметка описывает структуру и параметры, а система сама создаёт объекты `View` и `ViewGroup`, измеряет их и рисует на экране. Это платформенный механизм окна: он управляет иерархией, измерениями и отрисовкой, а не конкретными виджетами вроде `TextView` или `Button` — те описаны в категории UI Basics. Здесь фокус на контейнерах, измерениях и системе.

:::cards
- **Декларативность** — структура UI описывается XML, а не кодом.
- **LayoutInflater** — раздувает XML в дерево `View`/`ViewGroup`.
- **Квалификаторы** — разные layout для ориентации, размера экрана, языка.
- **Иерархия** — корневой `ViewGroup` содержит дочерние `View`.
:::

> **Ключевая идея:** XML-разметка — это дерево контейнеров и элементов. Понимание того, как система измеряет и размещает узлы этого дерева, важнее запоминания атрибутов отдельных виджетов.

### XML-разметка интерфейса {#xml-razmetka}

Каждый XML-файл разметки имеет один корневой элемент — обычно `ViewGroup` (например, `ConstraintLayout` или `LinearLayout`). Внутри располагаются дочерние `View` и другие `ViewGroup`. Атрибуты задают размеры, отступы, выравнивание и идентификаторы.

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <View
        android:id="@+id/header"
        android:layout_width="match_parent"
        android:layout_height="48dp" />
</LinearLayout>
```

Раздувание происходит в `onCreate` Activity через `setContentView(R.layout.activity_main)` или во Fragment через `inflater.inflate(...)`. `LayoutInflater` рекурсивно обходит XML и создаёт объекты, применяя атрибуты. Тяжёлые разметки с глубокой вложенностью замедляют старт экрана, поэтому важно держать иерархию плоской.

Типичные ошибки: использовать `match_parent` там, где нужен `wrap_content` (и наоборот), дублировать корневой контейнер, забывать `xmlns:android`. Правило: корень — один контейнер, а вложенные контейнеры добавляются только по необходимости.

### View и ViewGroup {#view-viewgroup-v-razmetke}

`View` — базовый класс любого элемента интерфейса (кнопка, текст, изображение). `ViewGroup` — подкласс `View`, который может содержать дочерние `View` (контейнер). Вся разметка — это дерево: корневой `ViewGroup` → дочерние `View`/`ViewGroup` → ... Листовые узлы (TextView, ImageView) рисуют контент; узлы-контейнеры только располагают детей.

Важно не путать: `ViewGroup` тоже является `View` и участвует в измерениях и отрисовке. При измерении контейнер сначала измеряет детей (вызов `measure`), затем вычисляет свои размеры, затем размещает детей (вызов `layout`). Это два прохода: measure и layout. Понимание этого цикла помогает находить причины медленной отрисовки.

### FrameLayout {#framelayout}

`FrameLayout` — простейший контейнер: все дети накладываются друг на друга в левый верхний угол (или по `layout_gravity`). Используется для наложения (overlay), контейнера одного элемента, shimmer-эффектов, фрагментов. Лёгкий и быстрый, поэтому предпочтителен, когда нужен один ребёнок или простое наложение.

```xml
<FrameLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <ImageView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:scaleType="centerCrop" />

    <ProgressBar
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center" />
</FrameLayout>
```

Типичная ошибка: использовать `FrameLayout` для сложных раскладок, где нужен порядок — дети будут перекрывать друг друга. Для линейного расположения используйте `LinearLayout`, для сложных зависимостей — `ConstraintLayout`.

### LinearLayout {#linearlayout}

`LinearLayout` располагает детей в один ряд — вертикально или горизонтально. Поддерживает `layout_weight` для распределения свободного места. Прост и понятен, но глубокая вложенность `LinearLayout` (особенно с `weight`) приводит к многократному измерению и тормозам.

```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="horizontal">

    <Button
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_weight="1"
        android:text="Отмена" />

    <Button
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_weight="1"
        android:text="OK" />
</LinearLayout>
```

С `layout_weight` контейнер делает два прохода измерения: сначала измеряет детей без веса, затем распределяет остаток. Поэтому не злоупотребляйте весами во вложенных контейнерах. Для двух кнопок в ряд `LinearLayout` уместен; для сложных экранов — `ConstraintLayout`.

### ConstraintLayout {#constraintlayout}

`ConstraintLayout` — гибкий контейнер, где каждый ребёнок позиционируется относительно других детей, родителя или направляющих (guidelines). Позволяет строить плоские иерархии без вложенности, что ускоряет измерение и отрисовку. Поддерживает цепочки (chains), барьеры (barriers), guidelines, bias.

```xml
<androidx.constraintlayout.widget.ConstraintLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:id="@+id/title"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />

    <Button
        android:id="@+id/action"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        app:layout_constraintTop_toBottomOf="@id/title"
        app:layout_constraintEnd_toEndOf="parent" />
</androidx.constraintlayout.widget.ConstraintLayout>
```

Размер `0dp` (match constraints) означает «занять всё доступное место с учётом constraints». Это рекомендуемый способ вместо `match_parent` для детей `ConstraintLayout`. Визуальный редактор Android Studio генерирует такие constraints автоматически.

### RelativeLayout (legacy) {#relativelayout}

`RelativeLayout` позиционирует детей относительно друг друга и родителя (`android:layout_below`, `android:layout_toRightOf` и т.д.). Встречается в старом коде, но официально считается legacy: измерение `RelativeLayout` дорогое (множественные проходы), а гибкость ниже, чем у `ConstraintLayout`. Новый код пишут на `ConstraintLayout`; `RelativeLayout` изучают для чтения старых проектов и миграции.

Типичная проблема legacy-кода: глубоко вложенные `RelativeLayout` внутри `RelativeLayout`, что приводит к экспоненциальному росту времени измерения. При рефакторинге такие блоки заменяют на плоский `ConstraintLayout`.

### Вложенность ViewGroup {#vlozhennost-viewgroup}

Глубина дерева View напрямую влияет на производительность: каждый уровень добавляет проходы измерения (measure) и размещения (layout). Правило: держать иерархию как можно более плоской. Если вложенность превышает 3–4 уровня, это сигнал к рефакторингу в `ConstraintLayout` или к использованию `merge`/`include`.

`<include>` позволяет переиспользовать кусок разметки, а `<merge>` убирает лишний корневой контейнер при вставке:

```xml
<merge xmlns:android="http://schemas.android.com/apk/res/android">
    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content" />
</merge>
```

Тег `<ViewStub>` — ленивая загрузка части разметки: она не раздувается, пока не вызовут `inflate()`. Полезно для редко показываемых блоков (ошибки, пустые состояния).

### layout_width и layout_height {#layout-width-height}

Два обязательных атрибута любого `View`:
- `match_parent` — занять всё доступное место родителя.
- `wrap_content` — размер по содержимому.
- Конкретное значение в `dp` — фиксированный размер.

Дополнительно: `0dp` в `ConstraintLayout` означает «match constraints». Ошибки выбора: `match_parent` в ребёнке `ScrollView` (приводит к бесконечной высоте), `wrap_content` для корневого контейнера экрана (не заполнит экран). Единицы: `dp` для размеров, `sp` для текста (с учётом масштаба шрифта). Подробнее про единицы — категория UI Basics («Размеры и Accessibility»).

**Самопроверка:**
- [ ] Чем `match_parent` отличается от `wrap_content`?
- [ ] Когда выбрать `FrameLayout`, а когда `ConstraintLayout`?
- [ ] Почему глубокая вложенность вредит производительности?
- [ ] Для чего нужен тег `<merge>`?

### Вопросы на собеседовании

:::qa
- **Почему вредна глубокая вложенность `LinearLayout`?** — Каждый уровень добавляет проходы measure и layout, а `layout_weight` заставляет контейнер измерять детей дважды; при вложенности работа умножается и тормозит старт экрана. Иерархию стараются делать плоской.
- **Чем `ConstraintLayout` лучше `RelativeLayout`?** — `ConstraintLayout` позиционирует детей относительно других View, родителя или guidelines и позволяет избежать вложенности; измерение `RelativeLayout` требует дорогих множественных проходов. `RelativeLayout` считается legacy и нужен в основном для старого кода.
- **Что означает `0dp` в `ConstraintLayout`?** — Это «match constraints»: View занимает всё доступное место между привязанными сторонами. Для детей `ConstraintLayout` это рекомендуемая замена `match_parent`.
- **Для чего нужны `<include>`, `<merge>` и `<ViewStub>`?** — `<include>` переиспользует кусок разметки, `<merge>` убирает лишний корневой контейнер при вставке, а `<ViewStub>` лениво раздувает часть UI только после вызова `inflate()`. Все три помогают уменьшить глубину дерева.
- **Чем `match_parent` отличается от `wrap_content`?** — `match_parent` занимает всё доступное место родителя, `wrap_content` — размер по содержимому. `match_parent` у ребёнка `ScrollView` даёт бесконечную высоту, а `wrap_content` у корня экрана не заполнит экран.
- **Как устроены проходы measure и layout?** — Родитель вызывает `measure()` у детей с ограничениями MeasureSpec (EXACTLY, AT_MOST, UNSPECIFIED), затем в `layout()` размещает их, после чего идёт отрисовка. Понимание двух проходов помогает найти причину нулевого размера View.
:::

## 8. View и ViewGroup {#view-i-viewgroup}

`View` и `ViewGroup` — базовые классы классического UI Android. `View` отвечает за отрисовку и обработку касаний одного элемента; `ViewGroup` — за расположение дочерних. Важная часть этой темы на современной платформе — edge-to-edge: приложение рисуется от края до края экрана, а системные бары и клавиатура обрабатываются через `WindowInsets`. С Android 15 (API 35) edge-to-edge включён по умолчанию для приложений с `targetSdk 35`, поэтому учитывать инсеты обязательно. Конкретные виджеты (`TextView`, `Button`, `ImageView`) разобраны в категории UI Basics; здесь — системная модель: дерево, измерения, события, инсеты.

:::cards
- **Дерево** — корневой `ViewGroup` и дочерние `View`.
- **Измерение** — два прохода: measure и layout.
- **События** — касания и клики через listeners.
- **Инсеты** — системные бары и клавиатура через `WindowInsets`.
:::

> **Ключевая идея:** `View` — это не просто «кнопка на экране», а объект с жизненным циклом измерения, размещения и отрисовки, живущий внутри окна. Инсеты определяют, где именно он может рисоваться без перекрытия системой.

### Иерархия View {#view-hierarchy}

При запуске Activity система создаёт корневой `ViewGroup` (DecorView) и присоединяет к нему разметку из `setContentView`. Дерево выглядит так: `DecorView` → `LinearLayout` (action bar + content) → корневой контейнер из вашего layout → ваши View. Каждый узел знает своего родителя (`parent`) и список детей (`children`).

Измерение идёт сверху вниз: родитель вызывает `measure()` у детей, передавая ограничения (MeasureSpec: EXACTLY, AT_MOST, UNSPECIFIED). Затем layout размещает детей. Отрисовка (draw) идёт в порядке обхода дерева. Понимание этого цикла помогает диагностировать проблемы: «почему View не показывается» часто сводится к нулевому размеру на этапе measure.

### View и ViewGroup как классы {#view-i-viewgroup-klassy}

`View` — базовый класс для всех элементов: имеет размеры, фон, состояние (enabled, pressed, focused), обрабатывает касания. `ViewGroup` extends `View` и добавляет управление детьми: `addView`, `removeView`, `getChildAt`, `getChildCount`. Контейнер переопределяет `onMeasure` и `onLayout`, чтобы расположить детей.

Ключевое различие в ответственности: `View` рисует себя, `ViewGroup` рисует себя и располагает детей. При создании собственного компонента наследуются от `View` (если нужен один элемент) или от `ViewGroup` (если нужен контейнер). В современной разработке кастомные View встречаются реже благодаря Compose, но понимание модели необходимо для чтения старого кода и работы с инсетами.

### XML-атрибуты {#xml-attributy}

Атрибуты в XML маппятся на свойства View через конструктор с `AttributeSet`. Системные атрибуты (`android:layout_width`) обрабатываются базовым классом; кастомные — через `obtainStyledAttributes`. Атрибуты делятся на:
- Layout params (`android:layout_*`) — управляются родителем (ViewGroup.LayoutParams).
- View attributes (`android:background`, `android:visibility`) — управляются самим View.
- Style/theme attributes (`?attr/colorPrimary`) — разрешаются через тему.

Типичная ошибка: путать `layout_*` (зависят от родителя) и обычные атрибуты. Например, `android:gravity` у `LinearLayout` управляет выравниванием детей, а `android:layout_gravity` у ребёнка — его позицией внутри родителя.

### Создание View программно {#sozdanie-view-programmno}

View можно создавать без XML — через конструктор, передавая `Context`. Layout params задаются отдельно.

```kotlin
val button = Button(context).apply {
    text = "Отправить"
    setOnClickListener { submit() }
}

val params = LinearLayout.LayoutParams(
    LinearLayout.LayoutParams.WRAP_CONTENT,
    LinearLayout.LayoutParams.WRAP_CONTENT
).apply {
    marginStart = context.resources.getDimensionPixelSize(R.dimen.margin_small)
}

linearLayout.addView(button, params)
```

Программное создание полезно для динамических списков, но теряет преимущества XML (предпросмотр, разделение логики и разметки). Для списков предпочтительнее `RecyclerView` с XML-item layout. Важно: `LayoutParams` должны соответствовать типу родителя (для `ConstraintLayout` — `ConstraintLayout.LayoutParams`), иначе крах при добавлении.

### View ID и findViewById {#view-id-findviewbyid}

Каждый View может иметь id (`android:id="@+id/header"`). По id находят View через `findViewById<T>(R.id.header)` или View Binding. Id должны быть уникальны в пределах экрана (или поддерева, если ищут локально).

```kotlin
val header = findViewById<TextView>(R.id.header)
```

`findViewById` обходит дерево от корня — O(n) по числу View. В современном коде используют View Binding (категория UI Basics), который генерирует прямые ссылки и безопаснее. `findViewById` остаётся актуальным для библиотек и legacy-кода. Типичная ошибка: искать View до `setContentView` — получите null.

### Видимость View {#view-visibility}

Три состояния видимости:
- `VISIBLE` — виден и участвует в измерении/отрисовке (по умолчанию).
- `INVISIBLE` — не виден, но занимает место (участвует в measure/layout).
- `GONE` — не виден и не занимает место (не участвует в measure).

```kotlin
view.visibility = View.GONE
```

Выбор между `INVISIBLE` и `GONE` влияет на layout: `GONE` сдвигает другие элементы, `INVISIBLE` сохраняет отступ. Для анимаций появления часто используют `INVISIBLE` → `VISIBLE`, чтобы не пересчитывать layout. Типичная ошибка: анимировать `GONE`/`VISIBLE` напрямую — это вызывает пересчёт layout каждый кадр; лучше анимировать alpha и visibility.

### Padding и Margin {#padding-i-margin}

- **Padding** — внутренний отступ View (между границей и контентом). Управляется самим View, входит в его размеры (если не `clipToPadding`).
- **Margin** — внешний отступ между View и соседями. Управляется родителем через `LayoutParams`.

Оба задаются в `dp`. В RTL-режиме используют `paddingStart`/`paddingEnd` и `marginStart`/`marginEnd` вместо left/right, чтобы корректно отражать интерфейс. Типичная ошибка: ставить margin у корневого элемента экрана — он не даёт отступ от края окна корректно при edge-to-edge; для этого используют padding/insets.

### Обработка событий и listeners {#obrabotka-sobytiy}

View получает касания через `onTouchEvent` и преобразует их в высокоуровневые события. Основные listeners:
- `setOnClickListener` — клик (tap).
- `setOnLongClickListener` — долгое нажатие.
- `setOnTouchListener` — сырые касания (MotionEvent).
- `setOnFocusChangeListener` — получение/потеря фокуса.

```kotlin
button.setOnClickListener { viewModel.onSaveClicked() }
```

Касания диспетчеризуются сверху вниз (от родителя к ребёнку) и обрабатываются снизу вверх (ребёнок может перехватить через `onInterceptTouchEvent` в ViewGroup). Если ребёнок не обработал событие, оно всплывает к родителю. Типичная ошибка: ставить `clickable="true"` на контейнер и удивляться, что клики по детям не доходят, или наоборот — не делать контейнер кликабельным и терять клики.

### Edge-to-Edge и enableEdgeToEdge() {#edge-to-edge}

Edge-to-edge — режим, при котором приложение рисуется под системными барами (status bar, navigation bar) и от края до края экрана. Включается вызовом `enableEdgeToEdge()` в `onCreate` Activity (из `androidx.activity`):

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
    }
}
```

С Android 15 (API 35) для приложений с `targetSdk 35` edge-to-edge включён по умолчанию системой, поэтому `enableEdgeToEdge()` нужен только для совместимости со старыми версиями, а обработка инсетов обязательна — иначе контент окажется под барами. Вызов `enableEdgeToEdge()` настраивает цвета/прозрачность баров и делает их прозрачными/полупрозрачными в зависимости от темы. После включения нужно применить инсеты к корневой разметке, иначе текст и кнопки уедут под статус-бар и навигационную панель.

### WindowInsets и системные бары {#windowinsets}

`WindowInsets` — объект, описывающий отступы, которые система накладывает на окно: статус-бар, навигационная панель, вырезы (display cutouts), IME. Получают через `ViewCompat.setOnApplyWindowInsetsListener`:

```kotlin
ViewCompat.setOnApplyWindowInsetsListener(rootView) { view, insets ->
    val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
    view.updatePadding(
        top = systemBars.top,
        bottom = systemBars.bottom
    )
    insets
}
```

Системные бары (`Type.systemBars()`) включают status bar и navigation bar. Отступы нужно применять к корневому контейнеру (padding) или к конкретным элементам, чтобы контент не перекрывался. Важно: инсеты приходят асинхронно после первого layout, поэтому применять их нужно в listener, а не в `onCreate`. `WindowInsetsCompat` из `androidx.core` обеспечивает совместимость со старыми версиями.

### IME insets и отступы клавиатуры {#ime-insets}

Клавиатура (IME — Input Method Editor) тоже создаёт инсеты. Когда поле ввода получает фокус, IME insets увеличиваются, и контент должен сдвинуться, чтобы поле оставалось видимым. Обрабатывают через `Type.ime()`:

```kotlin
ViewCompat.setOnApplyWindowInsetsListener(rootView) { view, insets ->
    val ime = insets.getInsets(WindowInsetsCompat.Type.ime())
    val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
    view.updatePadding(
        bottom = maxOf(ime.bottom, systemBars.bottom)
    )
    insets
}
```

С Android 11+ система анимирует появление клавиатуры, и инсеты меняются плавно; можно подписаться на `WindowInsetsAnimationCompat` для синхронизации анимации контента с клавиатурой. Типичные ошибки: применять только `systemBars` и забывать про IME (поле уезжает под клавиатуру), использовать `android:windowSoftInputMode="adjustPan"` вместо insets (устаревший подход, ломается при edge-to-edge). Современный стандарт — insets.

**Самопроверка:**
- [ ] Как включить edge-to-edge и зачем это нужно на Android 15+?
- [ ] Как получить инсеты системных баров?
- [ ] Чем IME insets отличаются от system bars insets?
- [ ] Почему `findViewById` ищет View только после `setContentView`?

### Вопросы на собеседовании

:::qa
- **Чем `padding` отличается от `layout_margin`?** — Padding — внутренний отступ между границей View и содержимым, им управляет сам View; margin — внешний отступ до соседей, им управляет родитель через `LayoutParams`. В RTL используют `paddingStart`/`marginStart`.
- **Что происходит при `invalidate()` и `requestLayout()`?** — `invalidate()` помечает View нуждающимся в перерисовке и приводит к `onDraw` без пересчёта размеров; `requestLayout()` заново запускает measure и layout, если изменились размеры или положение. Для смены цвета достаточно `invalidate()`, для смены размеров — `requestLayout()`.
- **Почему `findViewById` заменили View Binding?** — `findViewById` обходит дерево (O(n)) и возвращает View, которую легко не найти и получить null; View Binding генерирует типобезопасные прямые ссылки и проверяет id на этапе компиляции. В библиотеках и legacy-коде `findViewById` ещё встречается.
- **Чем `INVISIBLE` отличается от `GONE`?** — `INVISIBLE` не рисуется, но занимает место и участвует в measure/layout, а `GONE` не занимает место и сдвигает соседей. Для анимации появления лучше `INVISIBLE` → `VISIBLE`, чтобы не пересчитывать layout каждый кадр.
- **Что такое `WindowInsets` и зачем их обрабатывать?** — Это отступы системы: статус-бар, навигационная панель, вырезы и клавиатура. Их применяют к корневой разметке через `ViewCompat.setOnApplyWindowInsetsListener`; с Android 15 edge-to-edge включён по умолчанию для `targetSdk 35`, и без инсетов контент уйдёт под бары.
- **Чем IME insets отличаются от `systemBars()`?** — `Type.ime()` описывает клавиатуру и меняется, когда поле ввода получает фокус, а `Type.systemBars()` — статус и навигационные бары. Если учитывать только бары, поле уедет под клавиатуру; инсеты приходят асинхронно после первого layout.
:::

## 9. Activity Lifecycle {#activity-lifecycle}

Activity — это окно приложения с собственным жизненным циклом, которым управляет система. Система создаёт, показывает, скрывает, уничтожает Activity в зависимости от действий пользователя и состояния устройства (поворот, звонок, нехватка памяти). Понимание цикла необходимо, чтобы сохранять данные, освобождать ресурсы и не терять состояние. Разница между изменением конфигурации (поворот) и смертью процесса (убийство системой) — ключевая для корректного восстановления.

:::cards
- **Создание** — `onCreate`/`onStart`/`onResume`.
- **Уход в фон** — `onPause`/`onStop`.
- **Уничтожение** — `onDestroy` (не гарантирован).
- **Сохранение** — `onSaveInstanceState` + восстановление.
:::

> **Ключевая идея:** Activity не контролирует своё уничтожение — системой. Ваша задача — сохранять состояние в `onSaveInstanceState` и восстанавливать его в `onCreate`, не полагаясь на `onDestroy`.

### onCreate и onStart {#oncreate-i-onstart}

`onCreate(savedInstanceState)` — первая точка входа: здесь вызывают `setContentView`, инициализируют View, подписываются на данные, восстанавливают состояние из `savedInstanceState`. Вызывается один раз при создании Activity. Тяжёлую работу здесь не делают, чтобы не задерживать показ первого кадра.

`onStart()` — Activity становится видимой пользователю (но ещё не в фокусе). Здесь начинают анимации, регистрируют receiver'ы, которые нужны только когда экран виден. После `onStart` следует `onResume`.

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContentView(R.layout.activity_main)
    viewModel = ViewModelProvider(this)[MainViewModel::class.java]
    savedInstanceState?.let { restoreState(it) }
}

override fun onStart() {
    super.onStart()
    registerReceiver(networkReceiver, filter)
}
```

Типичная ошибка: выполнять сетевой запрос в `onCreate` синхронно — ANR. Запросы запускают через ViewModel/coroutines.

### onResume {#onresume}

`onResume()` — Activity в фокусе и взаимодействует с пользователем. Здесь возобновляют камеру, анимации, воспроизведение, обновляют UI свежими данными. После `onResume` Activity находится в состоянии Resumed до `onPause`. Важно: `onResume` может вызываться многократно (при возврате из фона), поэтому код должен быть идемпотентным.

```kotlin
override fun onResume() {
    super.onResume()
    camera.startPreview()
    viewModel.refresh()
}
```

Типичная ошибка: запускать тяжёлые операции в `onResume` — они будут выполняться при каждом возврате на экран.

### onPause и onStop {#onpause-i-onstop}

`onPause()` — Activity теряет фокус (появился диалог, другое Activity поверх, экран выключился). Здесь нужно быстро освободить ресурсы, которые нельзя держать в фоне: камеру, датчики, анимации, приостановить воспроизведение. `onPause` должен быть быстрым — система ждёт его завершения перед показом следующего экрана.

`onStop()` — Activity больше не видна. Здесь останавливают фоновые задачи, связанные с экраном, отменяют корутины, отписываются от данных. `onStop` может не вызваться, если система убивает процесс.

```kotlin
override fun onPause() {
    super.onPause()
    camera.stopPreview()
}

override fun onStop() {
    super.onStop()
    lifecycleScope.coroutineContext.cancelChildren()
}
```

Типичная ошибка: освобождать ресурсы только в `onDestroy` — они будут держаться в фоне и расходовать батарею.

### onDestroy и его ограничения {#ondestroy}

`onDestroy()` вызывается перед уничтожением Activity. Но система не гарантирует его вызов: при нехватке памяти процесс может быть убит без `onDestroy` (process death). Поэтому нельзя полагаться на `onDestroy` для сохранения критичных данных или освобождения ресурсов, от которых зависит корректность. Освобождение ресурсов делайте в `onPause`/`onStop`, сохранение данных — в `onSaveInstanceState` и/или ViewModel/DataStore.

```kotlin
override fun onDestroy() {
    super.onDestroy()
    // только лёгкая очистка, не критичная
}
```

Типичная ошибка: предполагать, что `onDestroy` всегда вызывается, и чистить там базу данных или отправлять аналитику.

### onSaveInstanceState {#onsaveinstancestate}

`onSaveInstanceState(outState)` вызывается перед тем, как Activity может быть уничтожена системой (поворот, нехватка памяти). Здесь сохраняют лёгкое состояние UI в `Bundle`: текст в поле ввода, позиция скролла, выбранный элемент. Bundle ограничен по размеру (~1 МБ на все данные), поэтому большие объекты (списки, изображения) не кладут; их хранят в ViewModel или репозитории.

```kotlin
override fun onSaveInstanceState(outState: Bundle) {
    super.onSaveInstanceState(outState)
    outState.putString("draft_text", binding.input.text.toString())
    outState.putInt("scroll_position", layoutManager.findFirstVisibleItemPosition())
}
```

С Android 13+ `onSaveInstanceState` может вызываться чаще (predictive back). Сохраняемые данные должны быть примитивами или Parcelable. Типичная ошибка: пытаться сохранить в Bundle большой список — `TransactionTooLargeException`.

### Восстановление состояния после пересоздания {#vosstanovlenie-sostoyaniya}

При пересоздании Activity `onCreate` получает непустой `savedInstanceState`. Восстановление выполняется там:

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)
    savedInstanceState?.let { state ->
        binding.input.setText(state.getString("draft_text"))
        layoutManager.scrollToPosition(state.getInt("scroll_position"))
    }
}
```

Важно различать: `savedInstanceState` непустой при восстановлении после configuration change или process death, но null при первом запуске. Также `onRestoreInstanceState` вызывается после `onStart` — можно использовать его вместо `onCreate` для восстановления View-состояния (система сама восстанавливает View с id). Современный подход: хранить состояние в `ViewModel` (переживает configuration change, но не process death) и в `SavedStateHandle` (переживает и то, и другое).

### Изменения конфигурации {#configuration-changes}

Configuration change — изменение конфигурации устройства: поворот экрана, смена языка, подключение клавиатуры, смена темы (dark/light). Система по умолчанию уничтожает и пересоздаёт Activity, чтобы подгрузить альтернативные ресурсы (layout-land, values-ru). Это стандартное поведение.

```xml
<!-- AndroidManifest.xml -->
<activity
    android:name=".MainActivity"
    android:configChanges="orientation|screenSize" />
```

Указание `android:configChanges` отключает пересоздание для перечисленных изменений: система вызывает `onConfigurationChanged(newConfig)` вместо пересоздания. Используют для видео, игр, когда пересоздание нежелательно. Но тогда сами должны обновить UI (ресурсы, layout). Типичная ошибка: бездумно добавлять `configChanges` для всех случаев — теряется автоматическая загрузка альтернативных ресурсов.

### Пересоздание Activity при изменении конфигурации {#peresozdanie-activity}

При повороте: `onPause` → `onStop` → `onSaveInstanceState` → `onDestroy` → `onCreate` → `onStart` → `onRestoreInstanceState` → `onResume`. Новая Activity получает `savedInstanceState`. ViewModel переживает пересоздание: экземпляр хранится в `ViewModelStore` и возвращается новой Activity. Данные в обычных полях Activity теряются — поэтому их хранят в ViewModel/DataStore.

Типичная ошибка: держать ссылки на View/Context в ViewModel — утечка и крах при пересоздании. ViewModel не должна знать о View.

### Configuration Change vs Process Death {#cc-vs-process-death}

- **Configuration change** — процесс остаётся живым, Activity пересоздаётся. ViewModel переживает (если scope привязан к Activity и не уничтожен), SavedStateHandle переживает.
- **Process death** — процесс убит системой (нехватка памяти, долгий фон). При возврате пользователя система создаёт новый процесс и новую Activity с `savedInstanceState`. ViewModel теряется, но `savedInstanceState`/`SavedStateHandle` восстанавливаются.

Практическое следствие: данные, которые нельзя потерять (черновик, позиция), сохраняйте в `SavedStateHandle`/`onSaveInstanceState`; данные, которые можно перезагрузить (список с сервера), — в ViewModel с повторной загрузкой. Тестировать process death можно через «Don't keep activities» в настройках разработчика или `adb shell am kill`.

**Самопроверка:**
- [ ] Какие коллбэки вызываются при повороте экрана?
- [ ] Почему нельзя полагаться на `onDestroy`?
- [ ] Что сохраняют в `onSaveInstanceState`?
- [ ] Чем configuration change отличается от process death?

### Вопросы на собеседовании

:::qa
- **Какая последовательность колбэков при повороте экрана?** — `onPause` → `onStop` → `onSaveInstanceState` → `onDestroy`, затем у новой Activity `onCreate` → `onStart` → `onRestoreInstanceState` → `onResume`. Новая Activity получает `savedInstanceState`, а ViewModel переживает пересоздание.
- **Чем configuration change отличается от process death?** — При configuration change процесс жив, Activity пересоздаётся и ViewModel сохраняется; при process death процесс убит системой, ViewModel теряется, но `savedInstanceState` и `SavedStateHandle` восстанавливаются. Критичные данные кладут в `SavedStateHandle`.
- **Почему нельзя полагаться на `onDestroy()`?** — Система не гарантирует его вызов: при нехватке памяти процесс может быть убит без `onDestroy()`. Ресурсы освобождают в `onPause`/`onStop`, а данные сохраняют в `onSaveInstanceState`.
- **Что сохраняют в `onSaveInstanceState`?** — Лёгкое состояние UI (текст поля, позиция скролла) в `Bundle` с примитивами или Parcelable. Bundle ограничен примерно 1 МБ, большие списки и изображения вызывают `TransactionTooLargeException` — их хранят в ViewModel.
- **Почему `onPause` должен быть быстрым?** — Система ждёт окончания `onPause`, прежде чем показать следующий экран, поэтому там быстро освобождают камеру, датчики и анимации. Сетевой запрос запускают не здесь, а через ViewModel и корутины.
- **Чем опасно подавление пересоздания через `configChanges`?** — `android:configChanges="orientation|screenSize"` вызывает `onConfigurationChanged()` вместо пересоздания, но приложение само должно обновить ресурсы и layout. Бездумное использование ведёт к утечкам и неверному отображению.
:::

## 10. Intent и Activity Result API {#intent-i-activity-result-api}

`Intent` — объект-сообщение для запуска компонентов (Activity, Service, BroadcastReceiver) и передачи данных между ними. Activity Result API — современный способ получить результат от запущенной Activity (выбор файла, фото, разрешение). Также сюда относятся системный Share Sheet, App Shortcuts и SplashScreen API — системные точки входа и обмена данными, которые настраиваются через Intent и манифест.

:::cards
- **Intent** — сообщение для запуска компонента и передачи данных.
- **Explicit/Implicit** — явный (конкретный класс) или неявный (по action).
- **Result API** — типобезопасное получение результата через лаунчер.
- **Системные точки** — Share Sheet, Shortcuts, SplashScreen.
:::

> **Ключевая идея:** Intent — это не «вызов функции», а сообщение системе. Система находит подходящий компонент (явно или по фильтрам) и запускает его; результат возвращается асинхронно через Activity Result API.

### Explicit и implicit Intent {#explicit-implicit-intent}

- **Explicit Intent** — указывает конкретный класс компонента: `Intent(context, DetailsActivity::class.java)`. Используется для навигации внутри приложения.
- **Implicit Intent** — указывает action (и опционально data/category); система сама находит подходящий компонент среди установленных приложений. Используется для системных действий: открыть браузер, позвонить, отправить письмо, поделиться.

```kotlin
// Explicit
val intent = Intent(this, DetailsActivity::class.java)
startActivity(intent)

// Implicit
val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://example.com"))
startActivity(intent)
```

Перед запуском implicit Intent проверяйте, есть ли обработчик: `intent.resolveActivity(packageManager) != null`, иначе `ActivityNotFoundException`. На Android 11+ учитывайте package visibility (запросы `<queries>` в манифесте).

### Intent actions и categories {#intent-actions-categories}

Action — строка, описывающая, что нужно сделать: `ACTION_VIEW`, `ACTION_SEND`, `ACTION_DIAL`, `ACTION_MAIN`. Category уточняет тип компонента: `CATEGORY_LAUNCHER` (точка входа), `CATEGORY_DEFAULT` (обработчик implicit intent), `CATEGORY_BROWSABLE` (обработчик ссылок).

Intent filter в манифесте объявляет, какие action/category/data компонент умеет обрабатывать:

```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="example.com" />
</intent-filter>
```

Типичная ошибка: объявить filter без `CATEGORY_DEFAULT` — компонент не будет получать implicit intent. На Android 12+ `exported` обязателен при наличии intent-filter.

### Передача данных через extras {#intent-extras}

Данные передают через `putExtra(key, value)` — поддерживаются примитивы, String, Parcelable, Serializable, Bundle. Ключи принято именовать с префиксом пакета: `"com.example.app.EXTRA_ITEM_ID"`.

```kotlin
val intent = Intent(this, DetailsActivity::class.java).apply {
    putExtra(EXTRA_ITEM_ID, 42L)
    putExtra(EXTRA_TITLE, "Заголовок")
}
startActivity(intent)

// в DetailsActivity
val itemId = intent.getLongExtra(EXTRA_ITEM_ID, -1L)
```

Типичные ошибки: передавать большие объекты ( TransactionTooLargeException при ~1 МБ), использовать `Serializable` (медленно) вместо `Parcelable`, забывать проверять отсутствие ключа (значение по умолчанию). Для сложных данных передавайте id и загружайте из репозитория.

### Bundle {#bundle}

`Bundle` — контейнер для передачи данных между компонентами (Intent extras, Fragment arguments, SavedState). Поддерживает те же типы, что и extras. `Bundle` используется под капотом `Intent` (`intent.extras`).

```kotlin
val bundle = Bundle().apply {
    putString("title", "Заголовок")
    putLong("id", 42L)
}
intent.putExtras(bundle)

// чтение
val extras = intent.extras
val title = extras?.getString("title")
```

`Bundle` тоже ограничен по размеру. Для передачи между Activity используйте `Intent` extras (они хранятся в Bundle). Не кладите в Bundle объекты с внешними ссылками (Context, View) — утечка и крах при сериализации.

### ActivityResultLauncher {#activityresultlauncher}

`ActivityResultLauncher` — современная замена `startActivityForResult`/`onActivityResult`. Регистрируется через `registerForActivityResult(contract) { result -> ... }` до `STARTED` состояния (обычно в поле Activity/Fragment). Запускается через `launch(input)`.

```kotlin
private val pickImage = registerForActivityResult(
    ActivityResultContracts.GetContent()
) { uri: Uri? ->
    uri?.let { showImage(it) }
}

// запуск
pickImage.launch("image/*")
```

Лаунчер типобезопасен: контракт определяет вход и выход. Регистрация должна происходить до создания View (в поле класса), иначе исключение. Лаунчер переживает пересоздание Activity, если зарегистрирован корректно.

### Activity Result API {#activity-result-api}

Activity Result API (androidx.activity) предоставляет набор готовых контрактов:
- `StartActivityForResult` — общий случай (замена `startActivityForResult`).
- `RequestPermission` / `RequestMultiplePermissions` — разрешения.
- `GetContent`, `OpenDocument`, `CreateDocument` — выбор/создание файлов.
- `PickVisualMedia` — выбор фото/видео (Photo Picker).
- `TakePicture`, `TakeVideo` — съёмка камерой.

```kotlin
private val startForResult = registerForActivityResult(
    ActivityResultContracts.StartActivityForResult()
) { result ->
    if (result.resultCode == RESULT_OK) {
        val data = result.data?.getStringExtra("result")
    }
}
```

API решает проблемы старого подхода: нет коллизий requestCode, типобезопасность, корректная работа с process death и пересозданием. Рекомендуется использовать вместо `startActivityForResult`.

### Результат от системных приложений {#rezultat-sistemnyh}

Системные приложения (камера, галерея, файловый менеджер) возвращают результат через те же контракты. Пример — съёмка фото:

```kotlin
private val takePicture = registerForActivityResult(
    ActivityResultContracts.TakePicture()
) { success ->
    if (success) showPhoto(photoUri)
}

// запуск с URI для сохранения
takePicture.launch(photoUri)
```

Для `TakePicture` нужно заранее создать URI через FileProvider и передать; иначе фото не сохранится. Результат может быть отменён пользователем (`RESULT_CANCELED`) — всегда проверяйте `resultCode`. Также учитывайте, что системное приложение может быть убито системой — тогда результат не придёт; для критичных сценариев сохраняйте промежуточное состояние.

### PendingIntent {#pendingintent}

`PendingIntent` — обёртка над Intent, которая позволяет другому приложению (или системе) выполнить ваш Intent от вашего имени с вашими разрешениями. Используется в уведомлениях, виджетах, AlarmManager, Shortcuts.

```kotlin
val intent = Intent(context, MainActivity::class.java)
val pendingIntent = PendingIntent.getActivity(
    context, 0, intent,
    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
)
```

С Android 12 (API 31) обязателен флаг изменяемости: `FLAG_MUTABLE` или `FLAG_IMMUTABLE`. По умолчанию (и для безопасности) используют `FLAG_IMMUTABLE`, если PendingIntent не нужно модифицировать. `FLAG_UPDATE_CURRENT` обновляет extras при повторном создании. Типичная ошибка: не указывать флаг → `IllegalArgumentException` на Android 12+.

### Системный Share Sheet {#share-sheet}

Share Sheet — системный диалог «Поделиться», вызываемый через implicit Intent с action `ACTION_SEND` (или `ACTION_SEND_MULTIPLE`). Система показывает список приложений, умеющих принять данные.

```kotlin
val shareIntent = Intent(Intent.ACTION_SEND).apply {
    type = "text/plain"
    putExtra(Intent.EXTRA_TEXT, "Посмотрите: https://example.com")
    putExtra(Intent.EXTRA_SUBJECT, "Тема")
}

startActivity(Intent.createChooser(shareIntent, "Поделиться через"))
```

`Intent.createChooser` гарантирует показ системного диалога выбора, даже если настроено приложение по умолчанию. Тип (`type`) определяет, какие приложения появятся: `text/plain`, `image/*`, `application/pdf`. Для нескольких файлов — `ACTION_SEND_MULTIPLE` с `ArrayList<Uri>` в `EXTRA_STREAM`. URI должны быть content:// с предоставленным доступом (`FLAG_GRANT_READ_URI_PERMISSION`).

### App Shortcuts {#app-shortcuts}

App Shortcuts — ярлыки быстрого доступа к функциям приложения (долгое нажатие на иконку). Делятся на:
- **Статические** — объявляются в XML (`res/xml/shortcuts.xml`) и манифесте; неизменны во время работы.
- **Динамические** — создаются/обновляются в коде через `ShortcutManager`; могут меняться (например, последние чаты).
- **Pinned** — закреплённые пользователем на рабочем столе (требуют подтверждения).

```xml
<!-- res/xml/shortcuts.xml -->
<shortcuts xmlns:android="http://schemas.android.com/apk/res/android">
    <shortcut
        android:shortcutId="new_note"
        android:enabled="true"
        android:icon="@drawable/ic_add"
        android:shortcutShortLabel="@string/new_note">
        <intent
            android:action="android.intent.action.VIEW"
            android:targetPackage="com.example.app"
            android:targetClass="com.example.app.NewNoteActivity" />
    </shortcut>
</shortcuts>
```

В манифесте Activity: `<meta-data android:name="android.app.shortcuts" android:resource="@xml/shortcuts" />`. Динамические ярлыки создаются через `ShortcutInfo.Builder` и `ShortcutManager.addDynamicShortcuts()`. Статических ярлыков можно объявить не больше 4, а количество динамических ограничено `ShortcutManager.getMaxShortcutCountPerActivity()`. Типичная ошибка: создавать динамические ярлыки без проверки `isRequestPinShortcutSupported`.

### SplashScreen API {#splashscreen-api}

SplashScreen API (androidx.core:core-splashscreen) — стандартный экран запуска, заменяющий кастомные Splash Activity. Настраивается через тему: окно показывает иконку/фон до готовности первого кадра Activity.

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        val splashScreen = installSplashScreen()
        super.onCreate(savedInstanceState)
        splashScreen.setKeepOnScreenCondition { viewModel.isLoading.value }
        setContentView(R.layout.activity_main)
    }
}
```

В теме задают `windowSplashScreenBackground`, `windowSplashScreenAnimatedIcon`, `postSplashScreenTheme`. API автоматически закрывает splash, когда Activity готова к отрисовке (или по условию). Преимущества: нет отдельной Activity, корректная работа с process death и восстановлением, единый стиль. Типичная ошибка: держать splash слишком долго (больше 1–2 секунд) или выполнять тяжёлую инициализацию на главном потоке, из-за чего splash «зависает».

**Самопроверка:**
- [ ] Чем Explicit Intent отличается от Implicit?
- [ ] Как зарегистрировать ActivityResultLauncher?
- [ ] Зачем нужен `Intent.createChooser`?
- [ ] Какие бывают App Shortcuts и где они объявляются?
- [ ] Как настроить SplashScreen API?

### Вопросы на собеседовании

:::qa
- **Чем explicit Intent отличается от implicit?** — Explicit указывает конкретный класс, например `Intent(context, DetailsActivity::class.java)`, и используется внутри приложения; implicit задаёт action (`ACTION_VIEW`) и систему просят найти обработчика. Перед запуском implicit проверяют `resolveActivity()`, иначе `ActivityNotFoundException`.
- **Почему `startActivityForResult()` устарел?** — Его заменил Activity Result API: лаунчер регистрируют через `registerForActivityResult(contract) { ... }` до состояния STARTED, он типобезопасен, не требует `requestCode` и корректно работает при пересоздании и process death.
- **Зачем нужен `PendingIntent`?** — Это обёртка, позволяющая системе или другому приложению выполнить ваш Intent от вашего имени: в уведомлениях, виджетах и AlarmManager. С Android 12 обязателен `FLAG_IMMUTABLE` или `FLAG_MUTABLE`, иначе `IllegalArgumentException`.
- **Что передают через extras и почему туда нельзя класть большие объекты?** — `putExtra` принимает примитивы, String, Parcelable, Serializable и Bundle; ключи принято писать с префиксом пакета. Объекты больше примерно 1 МБ вызывают `TransactionTooLargeException`, поэтому передают id и загружают данные из репозитория.
- **Что делает `Intent.createChooser`?** — Он гарантирует показ системного диалога «Поделиться», даже если приложение по умолчанию уже выбрано; MIME-тип (`text/plain`, `image/*`) определяет список приложений. Для нескольких файлов используют `ACTION_SEND_MULTIPLE`.
- **Чем статические App Shortcuts отличаются от динамических?** — Статические объявляются в `res/xml/shortcuts.xml` и манифесте, динамические создаются через `ShortcutManager` и могут меняться во время работы; pinned-ярлыки закрепляет пользователь. Статических ярлыков можно не больше 4.
:::

## 11. Permissions {#permissions}

Модель разрешений Android разделяет возможности приложения и данные пользователя. Разрешения делятся на normal (выдаются при установке) и dangerous (требуют runtime-запроса). Начиная с Android 6.0 (API 23) dangerous-разрешения запрашиваются во время работы; отказ пользователя нужно обрабатывать gracefully. С каждой версией Android модель ужесточается (scoped storage, гранулярные медиа-разрешения, one-time permissions).

:::cards
- **Normal** — выдаются при установке, без запроса.
- **Dangerous** — требуют runtime-запроса и согласия пользователя.
- **Contracts** — `RequestPermission` / `RequestMultiplePermissions`.
- **Версии** — поведение меняется с каждой версией Android.
:::

> **Ключевая идея:** разрешение — это не «галочка в манифесте», а контракт с пользователем. Запрашивайте минимум, объясняйте зачем, и всегда имейте запасной путь при отказе.

### Назначение permissions {#naznachenie-permissions}

Разрешения ограничивают доступ приложения к чувствительным данным и возможностям: камера, микрофон, местоположение, контакты, хранилище, телефон, SMS. Они защищают пользователя от злоупотреблений и обеспечивают принцип минимально необходимых привилегий. Каждое разрешение объявляется в манифесте; dangerous-разрешения дополнительно требуют runtime-запроса.

Без объявления в манифесте приложение не получит разрешение даже при запросе. Некоторые разрешения доступны только системным приложениям или требуют специального подтверждения (например, `MANAGE_EXTERNAL_STORAGE`).

### Normal и Dangerous {#normal-dangerous}

- **Normal permissions** — низкий риск (например, `INTERNET`, `ACCESS_NETWORK_STATE`, `VIBRATE`). Выдаются автоматически при установке, пользователь не видит запроса.
- **Dangerous permissions** — высокий риск (например, `CAMERA`, `RECORD_AUDIO`, `ACCESS_FINE_LOCATION`, `READ_CONTACTS`, `READ_EXTERNAL_STORAGE`). Требуют runtime-запроса и явного согласия. Группируются по функциональности (camera, location, storage и т.д.); в одной группе разрешения запрашиваются вместе.

С Android 11+ некоторые разрешения стали one-time: пользователь может выдать разрешение «только в этот раз», и при следующем запуске придётся запрашивать снова. Также появились «приблизительное местоположение» (`ACCESS_COARSE_LOCATION`) и точное (`ACCESS_FINE_LOCATION`).

### Объявление разрешений в Manifest {#obyavlenie-v-manifest}

Все разрешения объявляются в `AndroidManifest.xml` через `<uses-permission>`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

Также можно объявить `<uses-feature>` для указания обязательных возможностей устройства (например, камера). Google Play фильтрует приложения по этим декларациям. Объявление разрешения не выдаёт его автоматически (для dangerous) — это только декларация намерения.

```xml
<uses-feature
    android:name="android.hardware.camera"
    android:required="true" />
```

Типичная ошибка: объявить разрешение, но забыть запросить его во время выполнения — приложение упадёт с `SecurityException`.

### Runtime permissions {#runtime-permissions}

С Android 6.0 dangerous-разрешения запрашиваются во время работы приложения. Проверка: `ContextCompat.checkSelfPermission(context, permission) == PackageManager.PERMISSION_GRANTED`. Если не выдано — запрашиваем. Лучше запрашивать разрешение в контексте действия пользователя (нажал «Сделать фото»), а не при старте приложения — так понятнее, зачем оно нужно.

```kotlin
if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
    != PackageManager.PERMISSION_GRANTED
) {
    // запросить
} else {
    openCamera()
}
```

Типичная ошибка: запрашивать все разрешения при первом запуске — пользователь отклонит и не вернётся. Запрашивайте по мере необходимости.

### RequestPermission и RequestMultiplePermissions {#request-permission-contracts}

Через Activity Result API:

```kotlin
private val requestCamera = registerForActivityResult(
    ActivityResultContracts.RequestPermission()
) { granted ->
    if (granted) openCamera() else showPermissionRationale()
}

private val requestLocation = registerForActivityResult(
    ActivityResultContracts.RequestMultiplePermissions()
) { result ->
    val fine = result[Manifest.permission.ACCESS_FINE_LOCATION] ?: false
    val coarse = result[Manifest.permission.ACCESS_COARSE_LOCATION] ?: false
    if (fine || coarse) startLocationUpdates()
}
```

`RequestPermission` — для одного разрешения, `RequestMultiplePermissions` — для нескольких (возвращает Map). Контракты автоматически обрабатывают диалог системы и возвращают результат. Запуск: `requestCamera.launch(Manifest.permission.CAMERA)`.

### Обработка предоставления и отказа {#obrabotka-rezultata-permissions}

При отказе пользователь может выбрать «Больше не спрашивать» (`shouldShowRequestPermissionRationale` вернёт false после второго отказа). Логика:
- Если разрешение выдано — выполняем действие.
- Если отказано, но `shouldShowRequestPermissionRationale` true — показываем объяснение и повторно запрашиваем.
- Если отказано и rationale false — пользователь запретил навсегда: направляем в настройки приложения (`Settings.ACTION_APPLICATION_DETAILS_SETTINGS`).

```kotlin
if (!granted) {
    if (shouldShowRequestPermissionRationale(Manifest.permission.CAMERA)) {
        showRationaleDialog()
    } else {
        openAppSettings()
    }
}
```

Типичная ошибка: при отказе просто ничего не делать или крашиться. Всегда имейте fallback (например, выбрать фото из галереи вместо камеры).

### Повторный запрос и rationale {#rationale-permissions}

Rationale — объяснение, зачем нужно разрешение, показываемое до системного диалога (или после отказа). Требования Google Play: запрашивать разрешение в контексте, объяснять причину, не блокировать приложение при отказе. Rationale реализуют через диалог или Snackbar с кнопкой «Разрешить».

```kotlin
private fun showRationale() {
    AlertDialog.Builder(this)
        .setTitle("Нужен доступ к камере")
        .setMessage("Камера нужна для съёмки фото профиля.")
        .setPositiveButton("Разрешить") { _, _ ->
            requestCamera.launch(Manifest.permission.CAMERA)
        }
        .setNegativeButton("Отмена", null)
        .show()
}
```

Повторный запрос после отказа возможен, если пользователь не выбрал «Больше не спрашивать». Если выбрал — только через настройки. Не спамьте запросами: после двух отказов система сама запретит повторные диалоги.

### Ограничения разрешений в разных версиях Android {#permissions-po-versiyam}

Модель разрешений эволюционирует:
- **Android 6.0 (API 23):** runtime permissions для dangerous.
- **Android 10 (API 29):** scoped storage — ограниченный доступ к общему хранилищу; `READ_EXTERNAL_STORAGE` даёт доступ только к медиа.
- **Android 11 (API 30):** one-time permissions, auto-reset разрешений для неиспользуемых приложений, package visibility.
- **Android 12 (API 31):** приблизительное/точное местоположение, Bluetooth-разрешения.
- **Android 13 (API 33):** гранулярные медиа-разрешения (`READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO`, `READ_MEDIA_AUDIO`) вместо `READ_EXTERNAL_STORAGE`; `POST_NOTIFICATIONS` (runtime) для уведомлений.
- **Android 14 (API 34):** частичный доступ к медиа (`READ_MEDIA_VISUAL_USER_SELECTED`), foreground service types обязательны.
- **Android 15 (API 35):** дальнейшее ужесточение доступа к фото/видео, edge-to-edge по умолчанию.

Практика: проверяйте `Build.VERSION.SDK_INT` и запрашивайте разрешения, соответствующие версии. Используйте Photo Picker, чтобы избежать разрешений на медиа вообще. Тестируйте на разных версиях (эмуляторы с разными API).

**Самопроверка:**
- [ ] Чем normal отличается от dangerous permission?
- [ ] Как проверить, выдано ли разрешение?
- [ ] Что делать при отказе с «Больше не спрашивать»?
- [ ] Какие новые разрешения появились в Android 13?

### Вопросы на собеседовании

:::qa
- **Чем normal permission отличается от dangerous?** — Normal (`INTERNET`, `VIBRATE`) выдаётся автоматически при установке; dangerous (`CAMERA`, `ACCESS_FINE_LOCATION`) с Android 6.0 требует runtime-согласия пользователя. Оба типа всё равно объявляют в манифесте через `<uses-permission>`.
- **Как обработать отказ «Больше не спрашивать»?** — После повторного отказа `shouldShowRequestPermissionRationale()` возвращает false и системный диалог больше не появится. Пользователя направляют в настройки через `Settings.ACTION_APPLICATION_DETAILS_SETTINGS` и сохраняют запасной путь (например, выбрать фото из галереи).
- **Что изменилось с уведомлениями в Android 13?** — Показ уведомлений потребовал dangerous-разрешения `POST_NOTIFICATIONS`, которое запрашивают через `ActivityResultContracts.RequestPermission()`; без него `notify()` тихо игнорируется. На Android 12 и ниже разрешение не нужно.
- **Как проверить и запросить разрешение?** — Сначала `ContextCompat.checkSelfPermission(...) == PackageManager.PERMISSION_GRANTED`, иначе `registerForActivityResult(ActivityResultContracts.RequestPermission())` и `launch(...)`. Запрашивают в контексте действия пользователя, а не при старте приложения.
- **Что такое one-time permission и auto-reset?** — С Android 11 пользователь может выдать разрешение «только в этот раз», а для давно неиспользуемых приложений разрешения сбрасываются автоматически. Поэтому статус проверяют перед каждым использованием, а не кэшируют навсегда.
- **Зачем в Android 13 появились гранулярные медиа-разрешения?** — `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO` и `READ_MEDIA_AUDIO` заменили широкое `READ_EXTERNAL_STORAGE`. Ещё лучше использовать Photo Picker и не запрашивать разрешение на медиа вообще.
:::

## 12. Task и Back Stack {#task-i-back-stack}

Task (задача) — это набор Activity, с которыми пользователь взаимодействует как с единым целым при выполнении одной цели: написать письмо, посмотреть фото, оформить заказ. Android держит задачи в виде стека Activity (Back Stack) и показывает пользователю верхнюю Activity экрана. Когда пользователь нажимает «Назад», верхняя Activity уничтожается и на экране появляется предыдущая. Понимание Task и Back Stack нужно, чтобы правильно проектировать навигацию: иначе пользователь может получить дублирующиеся экраны, зацикленные переходы или неожиданный выход из приложения.

Каждая задача имеет свой Back Stack — стек Activity, упорядоченный по времени запуска. Нижняя Activity — корень задачи (обычно launcher Activity), верхняя — текущий экран. Задачи изолированы друг от друга: если приложение A запускает Activity приложения B, система создаёт новую задачу для B (или помещает Activity в существующую задачу B, в зависимости от флагов). Переключение между задачами происходит через экран обзора (Recents), где каждая задача представлена карточкой. Задача живёт, пока в ней есть Activity; когда стек пустеет, задача уничтожается.

:::cards
- **Task** — логическая группа Activity, объединённая общей целью пользователя.
- **Back Stack** — стек Activity внутри задачи, упорядоченный по времени запуска.
- **Корень задачи** — первая Activity, с которой началась задача (обычно launcher).
- **Изоляция** — разные приложения и разные задачи не смешивают свои стеки без явных флагов.
:::

> **Ключевая идея:** Back Stack — это не просто «история нажатий Назад», а структура данных, которой управляет система. Разработчик влияет на неё через launchMode и флаги Intent, но не напрямую.

### Понятие Task {#task-concept}

Task появляется, когда пользователь запускает приложение с домашнего экрана: система создаёт новую задачу и помещает в неё launcher Activity. Все последующие Activity, запущенные из этой Activity (без специальных флагов), попадают в тот же Task и стек. Задача видна в Recents как карточка с названием приложения и последним скриншотом.

Важно различать Task и процесс: один процесс может обслуживать несколько задач, а одна задача может распределяться по нескольким процессам. Процесс — это исполнение кода, Task — это пользовательский контекст. Система может убить процесс для освобождения памяти, но Task и его Back Stack сохранятся (Activity будут пересозданы при возврате). Это различие объясняет, почему данные нельзя хранить в статических полях: процесс может быть уничтожен, а Task — нет.

### Back Stack {#back-stack}

Back Stack — стек объектов ActivityRecord, которыми управляет ActivityManager. Операции:

- `push` — при `startActivity()` новая Activity помещается наверх стека.
- `pop` — при нажатии «Назад» верхняя Activity завершается (`finish()`), и стек уменьшается.
- При уничтожении процесса стек сохраняется в системе и восстанавливается при повторном запуске.

Количество Activity в стеке ограничено только памятью. Длинные цепочки (A → B → C → D → …) создают глубокий стек, и кнопка «Назад» будет долго возвращать пользователя. Поэтому для глубоких иерархий используют Navigation Component или single-Activity архитектуру, где стеком управляет NavController, а не система.

### Поведение Back и Up {#back-vs-up}

Кнопка «Назад» (Back) и стрелка «Вверх» (Up) делают разное:

- **Back** — системная навигация: завершает текущую Activity и возвращает к предыдущей в Back Stack. Если стек пуст, приложение закрывается (или уходит в фон). Back работает на уровне задачи.
- **Up** — навигация внутри приложения: возвращает к логическому родителю текущего экрана, объявленному в манифесте через `android:parentActivityName` или в Navigation Graph. Up может создать новую задачу или пересоздать родителя, если его нет в стеке.

Практически: Back возвращает «откуда пришёл», Up — «к родителю в иерархии». На корневом экране Up обычно отсутствует, а Back закрывает приложение. Путаница между ними — частая причина багов: например, Up из глубокого экрана может создать дубликат родителя поверх существующего.

```kotlin
// Обработка Up в Activity
override fun onSupportNavigateUp(): Boolean {
    return findNavController(R.id.nav_host_fragment).navigateUp() || super.onSupportNavigateUp()
}
```

### launchMode (базовое понимание) {#launch-mode}

`launchMode` в манифесте определяет, как Activity помещается в задачу и стек при запуске. Четыре значения:

- **standard** (по умолчанию) — каждый `startActivity` создаёт новый экземпляр Activity и кладёт его наверх стека. Один экран может существовать в стеке несколько раз.
- **singleTop** — если Activity уже наверху стека, новый экземпляр не создаётся: вызывается `onNewIntent()` у существующего. Удобно для экранов, на которые можно перейти повторно (например, уведомление открывает тот же экран).
- **singleTask** — Activity становится корнем новой задачи (или переиспользуется существующая задача с ней). Все Activity поверх неё в стеке уничтожаются. Подходит для точек входа (главный экран).
- **singleInstance** — как singleTask, но задача содержит только эту Activity; другие Activity запускаются в отдельных задачах. Используется редко (например, для системных экранов).

```xml
<activity
    android:name=".MainActivity"
    android:launchMode="singleTask"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

Выбор launchMode влияет на поведение «Назад» и на то, сколько экземпляров Activity будет в памяти. По умолчанию используйте `standard`; переходите на `singleTop`/`singleTask` только при явной необходимости.

### Флаги Intent для управления запуском Activity {#intent-flags}

Флаги Intent позволяют управлять Task и стеком при конкретном запуске, не меняя манифест:

- `FLAG_ACTIVITY_NEW_TASK` — запустить Activity в новой задаче. Обязателен при запуске из Service/Receiver/уведомления (когда нет Activity-контекста).
- `FLAG_ACTIVITY_CLEAR_TOP` — если Activity уже есть в стеке, уничтожить все Activity поверх неё, а саму Activity пересоздать (или доставить ей Intent через `onNewIntent()`, если она запущена как `singleTop`). Часто комбинируют с `singleTop`.
- `FLAG_ACTIVITY_SINGLE_TOP` — аналог launchMode singleTop для одного запуска.
- `FLAG_ACTIVITY_NO_HISTORY` — Activity не остаётся в стеке: после ухода с неё она уничтожается.
- `FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS` — задача не появляется в Recents.
- `FLAG_ACTIVITY_CLEAR_TASK` — очистить весь стек задачи перед запуском (комбинируют с `NEW_TASK`).

```kotlin
val intent = Intent(context, DetailsActivity::class.java).apply {
    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
    putExtra("item_id", 42L)
}
context.startActivity(intent)
```

Комбинация `NEW_TASK + CLEAR_TASK` используется для «сброса» стека при логауте: пользователь не может вернуться на экраны, требующие авторизации.

### Возврат к предыдущей Activity {#return-to-previous}

Возврат реализуется тремя способами:

1. Системная кнопка «Назад» — по умолчанию завершает Activity (`finish()`). Можно переопределить `onBackPressed()` (устарел) или использовать `OnBackPressedDispatcher`:
   ```kotlin
   onBackPressedDispatcher.addCallback(this) {
       // кастомная логика, затем finish()
       finish()
   }
   ```
2. Программный возврат: `finish()` завершает текущую Activity и возвращает к предыдущей в стеке. `finishAffinity()` завершает все Activity с той же affinity (выход из приложения).
3. Возврат с результатом: `setResult(RESULT_OK, intent)` + `finish()`; вызывающий получает результат через Activity Result API.

Важно не вызывать `finish()` в `onCreate` до того, как Activity отобразится — это может привести к мерцанию. Если нужно сразу закрыть экран (например, нет прав), используйте `finish()` после `setContentView` или в `onResume`.

### Deep Links (назначение) {#deep-links}

Deep Link — URI, который открывает конкретный экран приложения: `myapp://product/42` или `https://example.com/product/42` (App Link). Назначение: переход извне (уведомление, письмо, браузер, другой app) сразу на нужный экран, минуя главную страницу.

Объявляются через intent-filter с `VIEW` action и `BROWSABLE` category:

```xml
<activity android:name=".ProductActivity" android:exported="true">
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="https"
              android:host="example.com"
              android:pathPrefix="/product" />
    </intent-filter>
</activity>
```

App Links (HTTPS с `autoVerify`) открываются напрямую без диалога выбора приложения, если домен верифицирован через Digital Asset Links. В коде извлекают параметры из Intent: `intent.data?.lastPathSegment`. Deep Link может создать новую задачу или поместить Activity в существующую — поведение зависит от launchMode и флагов.

### Типичные ошибки {#task-errors}

- Путать Back и Up, получая дублирующиеся родительские экраны.
- Использовать `singleTask`/`singleInstance` без понимания последствий для стека.
- Запускать Activity из Service/Receiver без `FLAG_ACTIVITY_NEW_TASK` — крах.
- Не обрабатывать `onNewIntent()` при `singleTop`/`CLEAR_TOP` — данные не обновляются.
- Делать слишком глубокий Back Stack без Navigation Component.
- Открывать Deep Link без проверки параметров — крах при невалидном URI.

**Самопроверка:**
- [ ] Чем отличается Back от Up?
- [ ] Когда нужен `FLAG_ACTIVITY_NEW_TASK`?
- [ ] Что делает `CLEAR_TOP`?
- [ ] Зачем нужен `onNewIntent()`?

### Вопросы на собеседовании

:::qa
- **Чем Back отличается от Up?** — Back — системная навигация: завершает текущую Activity и возвращает к предыдущей в Back Stack; Up возвращает к логическому родителю (`android:parentActivityName` или Navigation Graph) и может создать его заново. Back работает на уровне задачи, Up — внутри приложения.
- **Чем `singleTop` отличается от `singleTask`?** — `singleTop` не создаёт новую копию, если Activity уже на верху стека, и доставляет Intent в `onNewIntent()`; `singleTask` делает её корнем задачи и уничтожает всё, что лежало выше. По умолчанию используют `standard`.
- **Зачем нужен `FLAG_ACTIVITY_CLEAR_TOP`?** — Если Activity уже есть в стеке, флаг уничтожает все лежащие выше неё; сама Activity пересоздаётся или получает Intent через `onNewIntent()`, если она `singleTop`. Его часто комбинируют с `FLAG_ACTIVITY_NEW_TASK`.
- **Почему при запуске из Service или уведомления нужен `FLAG_ACTIVITY_NEW_TASK`?** — У Service и Receiver нет Activity-контекста, и без флага `startActivity()` упадёт. Для полного «сброса» стека при логауте используют `NEW_TASK` вместе с `FLAG_ACTIVITY_CLEAR_TASK`.
- **Чем Task отличается от процесса?** — Task — пользовательский контекст, стек Activity в Recents; процесс — исполнение кода. Система может убить процесс, но Back Stack сохранится и Activity воссоздадутся, поэтому данные нельзя держать только в статических полях.
- **Чем App Link отличается от обычного Deep Link?** — App Link — HTTPS-ссылка с `android:autoVerify="true"`, домен подтверждён через Digital Asset Links и открывается без диалога выбора; Deep Link вида `myapp://` может показать chooser. Параметры извлекают из `intent.data`.
:::

## 13. Main Thread и ANR {#main-thread-i-anr}

Android-приложение выполняется в одном процессе с одним главным потоком (Main Thread, он же UI Thread). Этот поток отвечает за отрисовку интерфейса и обработку всех пользовательских событий: нажатий, свайпов, ввода текста, анимаций. Если главный поток занят долгой операцией, UI «замерзает», а система может показать диалог ANR (Application Not Responding). Понимание модели выполнения — основа отзывчивого приложения.

Главный поток работает по принципу цикла сообщений (Message Loop / Looper): он берёт сообщения из очереди (MessageQueue) и выполняет их по очереди. Каждое сообщение — это небольшая порция работы: обработка нажатия, вызов `onDraw`, запуск Runnable через `post`. Пока очередь обрабатывается быстро, приложение отзывчиво. Если одно сообщение выполняется слишком долго, вся очередь стоит.

:::cards
- **Main Thread = UI Thread** — один поток рисует интерфейс и обрабатывает ввод.
- **Looper** — бесконечный цикл, читающий MessageQueue.
- **MessageQueue** — очередь задач, выполняемых последовательно.
- **ANR** — системный сигнал о том, что главный поток не отвечает.
:::

> **Ключевая идея:** В Android есть только один поток для UI. Любая долгая работа в нём блокирует весь интерфейс. Правило: главный поток — только для UI, всё остальное — в фоне.

### Main Thread и UI Thread {#main-ui-thread}

Main Thread создаётся при запуске процесса приложения (точнее, при создании ActivityThread). В нём выполняется `main()`, который запускает Looper. Все компоненты приложения (Activity, Service, BroadcastReceiver) по умолчанию работают в этом потоке, если не указано иное. Поэтому `onCreate`, `onResume`, `onClick` выполняются на главном потоке.

UI Thread — это то же самое, что Main Thread, просто с акцентом на отрисовку. Android Toolkit (View system) не потокобезопасен: изменять View можно только из главного потока. Попытка обновить TextView из фонового потока приведёт к `CalledFromWrongThreadException`. Исключение — некоторые методы помечены `@UiThread`/`@MainThread`, и Lint предупреждает о нарушениях.

Проверить, находимся ли мы на главном потоке:
```kotlin
val isMain = Looper.myLooper() == Looper.getMainLooper()
```

### Event Loop и обработка UI-событий {#event-loop}

Главный поток работает как цикл событий:

1. Система помещает событие (касание, таймер, сообщение от другого потока через `Handler`) в MessageQueue.
2. Looper берёт следующее сообщение и вызывает его обработчик.
3. Обработчик выполняется полностью; только после этого берётся следующее сообщение.
4. Параллельно Choreographer синхронизирует отрисовку с vsync (обычно 60/120 кадров в секунду): если очередь перегружена, кадры пропускаются — интерфейс «дёргается».

Важно: нет параллелизма внутри главного потока. Даже если событие «быстрое», оно ждёт завершения предыдущего. Поэтому один долгий обработчик блокирует всё: и нажатия, и анимации, и таймеры.

### Почему нельзя выполнять долгие операции в UI-потоке {#why-not-long-ops}

Долгая операция в главном потоке блокирует очередь сообщений. Последствия:

- Интерфейс не реагирует на нажатия (кнопки не нажимаются, скролл не работает).
- Анимации останавливаются, переходы между экранами «зависают».
- Система может показать ANR-диалог (через 5 секунд для Activity, 10 — для BroadcastReceiver, 20 — для Service).
- Lint и StrictMode предупреждают о сетевых/дисковых операциях в главном потоке (`NetworkOnMainThreadException` при сетевом вызове в главном потоке).

Правило простое: всё, что может занять больше ~16 мс (один кадр) или зависит от I/O, должно уходить в фон. Это включает: сетевые запросы, чтение/запись файлов и БД, парсинг больших JSON, шифрование, вычисления.

### Blocking operations {#blocking-operations}

Блокирующие операции — те, что заставляют поток ждать внешнего ресурса:

- **Сеть**: `HttpURLConnection`, Retrofit без корутин/коллбэков — блокирует поток до ответа сервера.
- **Диск/БД**: чтение файла, запрос к SQLite/Room без асинхронного API.
- **Синхронизация**: `CountDownLatch.await()`, `Thread.join()`, `Future.get()`.
- **Тяжёлые вычисления**: сортировка больших списков, обработка изображений, криптография.

Даже «быстрые» операции могут стать блокирующими при плохих условиях: медленная сеть, перегруженный диск, холодный кэш. Поэтому ориентируйтесь не на средний случай, а на худший.

StrictMode помогает ловить блокировки в debug-сборках:
```kotlin
StrictMode.setThreadPolicy(
    StrictMode.ThreadPolicy.Builder()
        .detectDiskReads()
        .detectDiskWrites()
        .detectNetwork()
        .penaltyLog()
        .build()
)
```

### Application Not Responding (ANR) {#anr}

ANR — системный диалог, который Android показывает, когда приложение не отвечает на пользовательский ввод. Таймауты:

- Activity: 5 секунд без ответа на входное событие (касание, клавиша).
- BroadcastReceiver: 10 секунд на выполнение `onReceive`.
- Service: 20 секунд на выполнение `onStartCommand`/`onBind` (для foreground — 5 секунд на `startForeground`).

При ANR система предлагает пользователю «Подождать» или «Закрыть приложение». Если пользователь выбирает «Закрыть», приложение убивается. ANR-события логируются в `/data/anr/`, но этот каталог недоступен приложению, поэтому трейсы снимают через `adb bugreport`; агрегированные ANR также видны в Google Play Console (Android Vitals).

ANR — это не краш (исключение), а системное решение о том, что поток «завис». Поэтому try/catch не поможет: нужно не допускать блокировки.

### Типичные причины ANR {#anr-causes}

- Сетевой запрос в главном потоке (особенно при холодном старте).
- Долгая работа с БД на главном потоке (запрос без индекса, большая таблица).
- Блокировка на `synchronized`/`lock` между главным и фоновым потоками (deadlock).
- Тяжёлый `onCreate`/`onResume` (инициализация, парсинг, загрузка ресурсов).
- Ожидание результата от другого процесса/компонента без таймаута.
- Чтение SharedPreferences в главном потоке (особенно `commit()` вместо `apply()`).
- Долгая отрисовка: слишком глубокая иерархия View, тяжёлый `onDraw`.

Диагностика: Android Studio Profiler (CPU), `adb shell cat /data/anr/traces.txt`, Play Console Vitals. Ищите в стеке вызовов главного потока место, где он «застрял».

### Перенос длительных операций в фоновые потоки {#background-threads}

Способы унести работу из главного потока:

- **Thread / ExecutorService**: низкоуровневый, подходит для простых задач.
  ```kotlin
  Executors.newSingleThreadExecutor().execute {
      val data = loadData() // фон
      runOnUiThread { showData(data) } // возврат в UI
  }
  ```
- **HandlerThread + Handler**: поток с Looper, удобен для последовательных задач.
- **Kotlin Coroutines**: `lifecycleScope.launch { withContext(Dispatchers.IO) { ... } }` — современный стандарт.
- **RxJava / Flow**: реактивные потоки с планировщиками.
- **WorkManager**: для отложенной/гарантированной работы (не для мгновенного UI).
- **ViewModel + repository**: бизнес-логика в ViewModel, данные через Flow/LiveData, которые автоматически доставляются на главный поток.

Правило возврата в UI: обновлять View только на главном потоке. Корутины с `Dispatchers.Main`, `runOnUiThread`, `view.post {}` — все эти механизмы гарантируют выполнение на UI-потоке.

### Типичные ошибки {#main-thread-errors}

- Сетевой запрос в `onCreate` Activity — ANR при медленной сети.
- Чтение БД в адаптере RecyclerView — лаги при скролле.
- Обновление View из фонового потока — краш `CalledFromWrongThreadException`.
- Использование `Thread.sleep()` в главном потоке «для ожидания».
- Забывать отменять корутины при уничтожении Activity — утечки и краши.
- Считать, что `AsyncTask` (устарел) решает проблему — он deprecated с API 30.

**Самопроверка:**
- [ ] Почему нельзя делать сетевой запрос в `onClick`?
- [ ] Какие таймауты у ANR для Activity и Service?
- [ ] Как проверить, на главном ли мы потоке?
- [ ] Чем `Dispatchers.IO` отличается от `Dispatchers.Main`?

### Вопросы на собеседовании

:::qa
- **Что такое ANR и через какое время он возникает?** — ANR (Application Not Responding) — системный диалог, когда главный поток не отвечает: 5 секунд на ввод для Activity, 10 — на `onReceive` BroadcastReceiver, 20 — на `onStartCommand`/`onBind` Service. Это не исключение, try/catch здесь не поможет.
- **Почему нельзя делать сетевой запрос в UI-потоке?** — Сеть блокирует поток: пока идёт ответ, очередь сообщений главного потока стоит, интерфейс замирает и может появиться ANR. В debug такой вызов ловится как `NetworkOnMainThreadException`; запросы уносят в `Dispatchers.IO`.
- **Как диагностировать ANR?** — Снимают `adb bugreport` (каталог `/data/anr/` приложению недоступен), смотрят трассировку главного потока в Android Studio Profiler и агрегированные данные в Play Console (Android Vitals). Ищут место, где поток «застрял».
- **Почему нельзя обновлять View из фонового потока?** — View-система не потокобезопасна: обращение не из главного потока даёт `CalledFromWrongThreadException`. Вернуться в UI помогают `Dispatchers.Main`, `runOnUiThread` и `view.post {}`.
- **Как устроен цикл сообщений главного потока?** — Looper берёт сообщения из MessageQueue и выполняет их строго по очереди: пока предыдущее не завершилось, следующее не начнётся. Choreographer синхронизирует отрисовку с vsync, поэтому работа дольше ~16 мс пропускает кадры.
- **Чем помогает StrictMode?** — В debug-сборке `StrictMode.ThreadPolicy` с `detectNetwork()`, `detectDiskReads()` и `penaltyLog()` пишет в логи блокирующие операции главного потока, не ломая приложение.
:::

## 14. Toast, Dialog и Snackbar {#toast-dialog-i-snackbar}

Приложение часто должно сообщить пользователю о результате действия: «Сохранено», «Ошибка сети», «Удалить элемент?». Android предлагает несколько стандартных способов: Toast (краткое всплывающее сообщение), AlertDialog (модальный диалог с кнопками), DialogFragment (диалог с жизненным циклом), Snackbar (сообщение с действием внизу экрана). Выбор зависит от важности сообщения, нужды в ответе пользователя и контекста.

Главное правило: не злоупотреблять. Каждое уведомление отвлекает пользователя. Используйте самый «лёгкий» подход, который решает задачу: Toast для подтверждения, Snackbar для действия с отменой, Dialog — только когда нужен явный ответ или критическое предупреждение.

:::cards
- **Toast** — краткое автоскрывающееся сообщение без действий.
- **AlertDialog** — модальный диалог с заголовком, текстом и кнопками.
- **DialogFragment** — диалог, переживающий поворот экрана.
- **Snackbar** — сообщение внизу экрана с опциональным действием.
:::

> **Ключевая идея:** Сообщение должно быть уместным по весу: лёгкое подтверждение — Toast/Snackbar, требующее решения — Dialog. Не используйте Dialog там, где достаточно Snackbar.

### Toast {#toast}

Toast — небольшое всплывающее сообщение внизу экрана, которое исчезает через несколько секунд. Не требует взаимодействия, не блокирует UI. Подходит для подтверждений: «Скопировано», «Сохранено», «Отправлено».

```kotlin
Toast.makeText(context, "Сохранено", Toast.LENGTH_SHORT).show()
```

Ограничения: нельзя добавить кнопку действия; сообщение может потеряться, если показать несколько подряд; на Android 12+ Toast'ы с кастомным View ограничены. Для кастомного содержимого используют `Toast.makeText(...).apply { view = customView }`, но это устаревает — предпочтительнее Snackbar.

Важно: Toast можно показывать из главного потока. Показ из фонового потока возможен, но не рекомендуется. Не используйте Toast для ошибок, требующих внимания: пользователь может не заметить.

### AlertDialog {#alert-dialog}

AlertDialog — модальный диалог с заголовком, сообщением и до трёх кнопок (positive, negative, neutral). Блокирует взаимодействие с остальным экраном, пока не закрыт. Подходит для подтверждений деструктивных действий и важных предупреждений.

```kotlin
AlertDialog.Builder(context)
    .setTitle("Удалить элемент?")
    .setMessage("Это действие нельзя отменить.")
    .setPositiveButton("Удалить") { _, _ -> deleteItem() }
    .setNegativeButton("Отмена", null)
    .setCancelable(false)
    .show()
```

Кнопки: positive (основное действие, справа в LTR), negative (отмена), neutral (третий вариант, например «Позже»). `setCancelable(false)` запрещает закрытие по кнопке «Назад» и по касанию вне диалога — используйте для критических решений. Не злоупотребляйте: модальный диалог прерывает поток пользователя.

### DialogFragment {#dialog-fragment}

DialogFragment — это Fragment, который отображается как диалог. Преимущество перед AlertDialog: переживает поворот экрана и изменения конфигурации, потому что состояние сохраняется через FragmentManager. AlertDialog, созданный напрямую, уничтожается при повороте и может вызвать утечку или краш.

```kotlin
class ConfirmDialog : DialogFragment() {
    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        return AlertDialog.Builder(requireContext())
            .setTitle("Удалить?")
            .setPositiveButton("Да") { _, _ -> listener?.onConfirm() }
            .setNegativeButton("Нет", null)
            .create()
    }

    interface Listener { fun onConfirm() }
    var listener: Listener? = null
}
```

Показ: `ConfirmDialog().show(parentFragmentManager, "confirm")`. Для передачи данных используйте arguments (Bundle), а не конструктор с параметрами. DialogFragment поддерживает кастомную разметку через `onCreateView` — удобно для сложных форм в диалоге.

### Snackbar {#snackbar}

Snackbar — сообщение внизу экрана, привязанное к корневому View (обычно CoordinatorLayout). Поддерживает действие (кнопку) и анимацию появления/исчезновения. Подходит для сообщений с возможностью отмены: «Удалено. Отменить?».

```kotlin
Snackbar.make(rootView, "Элемент удалён", Snackbar.LENGTH_LONG)
    .setAction("Отменить") { undoDelete() }
    .show()
```

Длительности: `LENGTH_SHORT` (1.5 с), `LENGTH_LONG` (2.75 с), `LENGTH_INDEFINITE` (до закрытия или действия). Snackbar автоматически сдвигается, если появляется FloatingActionButton или клавиатура (при использовании CoordinatorLayout). Для кастомного вида используйте `Snackbar` с собственным layout через `Snackbar.Callback` и `View`.

### Действия и обработка результата диалога {#dialog-actions}

Обработка результата:

- AlertDialog: коллбэки в `setPositiveButton` и т.д. выполняются при нажатии. Если действие асинхронное, запускайте его из коллбэка, но показывайте индикатор загрузки внутри диалога.
- DialogFragment: используйте интерфейс-слушатель, который реализует хост (Activity/Fragment), или передавайте результат через Fragment Result API:
  ```kotlin
  setFragmentResult("confirm", bundleOf("confirmed" to true))
  ```
  Вызывающий подписывается через `setFragmentResultListener`.
- Возврат из диалога: `dismiss()` закрывает диалог; `dismissAllowingStateLoss()` — если состояние уже сохранено.

Не храните бизнес-логику в диалоге: диалог только собирает решение пользователя, а действие выполняет ViewModel/Repository. Это упрощает тестирование и предотвращает утечки.

### Material Dialog components {#material-dialogs}

Material Components предлагает готовые диалоги:

- `MaterialAlertDialogBuilder` — Material-стилизованный AlertDialog с поддержкой тем, иконок, чекбоксов, радиокнопок, списков.
- `MaterialDatePicker` / `MaterialTimePicker` — выбор даты/времени в Material-стиле.
- `BottomSheetDialog` / `BottomSheetDialogFragment` — диалог, выезжающий снизу (удобен для действий на мобильных).

```kotlin
MaterialAlertDialogBuilder(context)
    .setTitle("Выберите цвет")
    .setSingleChoiceItems(arrayOf("Красный", "Синий", "Зелёный"), 0) { _, which ->
        // which — выбранный индекс
    }
    .setPositiveButton("OK", null)
    .show()
```

BottomSheetDialog подходит для меню действий («Поделиться», «Копировать») и форм, не требующих модального блокирования. Выбор между AlertDialog и BottomSheet зависит от дизайна приложения и рекомендаций Material Design 3.

### Выбор подходящего способа уведомления {#choosing-notification-ui}

Критерии выбора:

- **Toast**: короткое подтверждение без действия, не требующее внимания. Не использовать для ошибок.
- **Snackbar**: сообщение с опциональным действием (отмена), привязанное к экрану. Лучше Toast, когда нужна кнопка.
- **AlertDialog**: критическое подтверждение или выбор, блокирующий дальнейшие действия.
- **DialogFragment**: диалог, который должен пережить поворот (формы, сложный контент).
- **BottomSheet**: набор действий или форма в стиле Material.

Антипаттерны: показывать Dialog при каждой ошибке сети (лучше Snackbar + retry); использовать Toast для длинных текстов; показывать несколько Toast подряд (они ставятся в очередь). Для глобальных уведомлений (не привязанных к экрану) используйте системные Notifications.

### Типичные ошибки {#toast-dialog-errors}

- Показ Toast/Snackbar из фонового потока без `runOnUiThread`.
- Создание AlertDialog напрямую без DialogFragment — потеря при повороте.
- Хранение ссылки на Dialog в Activity — утечка при уничтожении.
- Использование `LENGTH_INDEFINITE` без кнопки закрытия — Snackbar не исчезает.
- Вызов `show()` на уже показанном DialogFragment — IllegalStateException.
- Игнорирование `setCancelable` для критических диалогов — пользователь закроет по «Назад».

**Самопроверка:**
- [ ] Когда использовать Snackbar вместо Toast?
- [ ] Зачем DialogFragment, если есть AlertDialog?
- [ ] Как передать результат из DialogFragment?
- [ ] Что будет, если показать Toast из фонового потока?

### Вопросы на собеседовании

:::qa
- **Чем Snackbar отличается от Toast?** — Toast — краткое сообщение без действий, которое нельзя отменить; Snackbar привязан к корневому View (обычно `CoordinatorLayout`), поддерживает кнопку действия и сам сдвигается при появлении `FloatingActionButton` или клавиатуры. Когда нужна кнопка «Отменить», выбирают Snackbar.
- **Почему DialogFragment предпочтительнее AlertDialog?** — AlertDialog, созданный напрямую, уничтожается при повороте экрана и может вызвать утечку; DialogFragment — Fragment, чьё состояние сохраняется FragmentManager, поэтому диалог переживает configuration change. Данные передают через arguments.
- **Как сохранить диалог при повороте экрана?** — Оформить его как `DialogFragment` и показывать через `show(parentFragmentManager, tag)`, а результат возвращать через Fragment Result API (`setFragmentResult` / `setFragmentResultListener`), а не прямой ссылкой на Activity.
- **Когда используют `setCancelable(false)`?** — Для критических решений, которые пользователь не должен закрыть кнопкой «Назад» или касанием вне диалога. В остальных случаях модальный диалог лучше не злоупотреблять — он прерывает поток работы.
- **Как передать результат диалога в ViewModel?** — Диалог только собирает решение: слушатель или Fragment Result API доставляет его хосту, а бизнес-логику выполняют ViewModel и Repository. Так диалог не удерживает ссылки и легко тестируется.
- **Какие уведомления считаются «лёгкими», а какие — модальными?** — Лёгкие: Toast для подтверждения и Snackbar для сообщения с действием; модальные: `AlertDialog` и BottomSheet, когда нужен явный ответ. Для уведомлений, не привязанных к экрану, используют системные Notifications.
:::

## 15. Notifications {#notifications}

Уведомление (Notification) — сообщение, которое приложение показывает вне своего UI: в шторке уведомлений, на экране блокировки, на часах. Используется для информирования о событиях (новое сообщение, завершённая загрузка, напоминание) и для удержания Foreground Service в живых. С Android 8.0 уведомления обязаны принадлежать каналу (NotificationChannel), а с Android 13 — требуют разрешения `POST_NOTIFICATIONS`. Правильная работа с уведомлениями — важная часть UX и надёжности приложения.

Уведомление собирается через `NotificationCompat.Builder` (для совместимости со старыми версиями), регистрируется канал, затем отправляется через `NotificationManager`. Для действий (открыть экран, ответить) используют `PendingIntent`. Foreground Service обязан показать уведомление в течение 5 секунд после запуска.

:::cards
- **Канал** — группа уведомлений с общими настройками (звук, вибрация, важность).
- **NotificationCompat.Builder** — совместимый билдер уведомления.
- **PendingIntent** — отложенное намерение, выполняемое по клику на уведомление.
- **Foreground Service** — служба, удерживающая уведомление, чтобы система не убила процесс.
:::

> **Ключевая идея:** Уведомление — это не просто «показать текст». Это контракт с системой: канал определяет поведение, PendingIntent — действие, а для foreground-службы уведомление обязательно.

### NotificationChannel и importance {#notification-channel}

С Android 8.0 (API 26) каждое уведомление должно принадлежать каналу. Канал создаётся один раз (при первом запуске или в Application), затем его настройки пользователь может изменить в системных настройках. Канал определяет: звук, вибрацию, световой индикатор, отображение на экране блокировки, важность (importance).

Уровни importance:
- `IMPORTANCE_HIGH` — звук + всплывающее окно (heads-up), для срочных (звонки, сообщения).
- `IMPORTANCE_DEFAULT` — звук, но без всплывающего окна.
- `IMPORTANCE_LOW` — без звука, только в шторке.
- `IMPORTANCE_MIN` — без звука и вибрации, свёрнуто.

```kotlin
val channel = NotificationChannel(
    "messages",
    "Сообщения",
    NotificationManager.IMPORTANCE_DEFAULT
).apply {
    description = "Уведомления о новых сообщениях"
}
notificationManager.createNotificationChannel(channel)
```

Канал нельзя «пересоздать» с новыми настройками: после создания важность и звук контролирует пользователь, а `deleteNotificationChannel()` не сбрасывает их — канал вернётся с прежними значениями. Поэтому создавайте каналы с разумными значениями по умолчанию и группируйте уведомления логически (отдельные каналы для сообщений, загрузок, напоминаний).

### NotificationCompat.Builder {#notification-builder}

`NotificationCompat.Builder` из AndroidX позволяет собирать уведомления, совместимые со всеми версиями Android. Обязательные поля: small icon, content title, content text, channel id (на Android 8+).

```kotlin
val notification = NotificationCompat.Builder(context, "messages")
    .setSmallIcon(R.drawable.ic_message)
    .setContentTitle("Новое сообщение")
    .setContentText("Привет! Как дела?")
    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
    .setContentIntent(pendingIntent)
    .setAutoCancel(true)
    .build()

notificationManager.notify(1, notification)
```

Дополнительные возможности: `setLargeIcon` (большая картинка), `setStyle` (BigText, Inbox, Picture), `addAction` (кнопки), `setProgress` (прогресс-бар для загрузок), `setOngoing` (нельзя смахнуть — для foreground service), `setGroup` (группировка). `setAutoCancel(true)` закрывает уведомление при клике. Идентификатор в `notify(id, ...)` нужен для обновления/отмены: повторный `notify` с тем же id обновляет уведомление.

### POST_NOTIFICATIONS и runtime-запрос (Android 13+) {#post-notifications}

С Android 13 (API 33) показ уведомлений требует разрешения `POST_NOTIFICATIONS` (dangerous permission). Без него `notify()` тихо игнорируется (на 13+) — уведомления не появляются. Нужно запросить разрешение во время выполнения, как другие dangerous permissions.

```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

```kotlin
val launcher = registerForActivityResult(
    ActivityResultContracts.RequestPermission()
) { granted ->
    if (granted) enableNotifications() else showRationale()
}

if (ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS)
    != PackageManager.PERMISSION_GRANTED
) {
    launcher.launch(Manifest.permission.POST_NOTIFICATIONS)
}
```

Рекомендации: запрашивайте разрешение в контексте (когда пользователь включает уведомления в настройках приложения), а не при первом запуске. Объясните ценность: «Уведомления помогут не пропустить сообщения». Обрабатывайте отказ: скройте переключатель или предложите включить в системных настройках. На Android 12 и ниже разрешение не требуется.

### PendingIntent в уведомлениях {#pending-intent-notifications}

PendingIntent — «отложенный» Intent, который выполняется системой от имени приложения в будущем (по клику на уведомление, по срабатыванию будильника, из виджета). В уведомлениях используется для `setContentIntent` и действий.

```kotlin
val intent = Intent(context, MessageActivity::class.java).apply {
    putExtra("message_id", 42L)
    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
}
val pendingIntent = PendingIntent.getActivity(
    context, 0, intent,
    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
)
```

С Android 12 (API 31) обязательно указывать mutability: `FLAG_IMMUTABLE` (рекомендуется, если extras не меняются) или `FLAG_MUTABLE` (если система должна добавить данные, например для ответа). `FLAG_UPDATE_CURRENT` обновляет extras при повторном создании с тем же requestCode. requestCode должен быть уникальным для разных уведомлений, иначе PendingIntent переиспользуется. `FLAG_IMMUTABLE` — безопаснее и предпочтительнее.

### Уведомление для Foreground Service {#foreground-service-notification}

Foreground Service выполняет долгую работу (воспроизведение музыки, отслеживание местоположения, загрузка файла) и обязан показать уведомление в течение 5 секунд после запуска, иначе система убьёт службу с ANR/крашем. Уведомление должно быть `ongoing` (нельзя смахнуть) и с низким приоритетом (чтобы не раздражать).

```kotlin
class UploadService : Service() {
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = NotificationCompat.Builder(this, "uploads")
            .setSmallIcon(R.drawable.ic_upload)
            .setContentTitle("Загрузка файла")
            .setOngoing(true)
            .build()
        startForeground(1001, notification)
        // ... работа ...
        return START_NOT_STICKY
    }
    override fun onBind(intent: Intent?): IBinder? = null
}
```

С Android 14 (API 34) foreground service требует объявления типа (`foregroundServiceType` в манифесте и при запуске) и соответствующего разрешения. Уведомление можно обновлять (прогресс-бар) через повторный `notify` с тем же id. По завершении работы вызывайте `stopForeground(STOP_FOREGROUND_REMOVE)` и `stopSelf()`.

### Группировка и стили уведомлений {#notification-grouping-styles}

Группировка: несколько уведомлений объединяются в одну «свёрнутую» карточку с возможностью развернуть. Используют `setGroup("group_key")` и summary-уведомление с `setGroupSummary(true)`.

```kotlin
// каждое уведомление
NotificationCompat.Builder(context, "messages")
    .setGroup("chat_group")
    ...

// summary
NotificationCompat.Builder(context, "messages")
    .setGroup("chat_group")
    .setGroupSummary(true)
    .setStyle(InboxStyle().addLine("Алиса: Привет").addLine("Боб: Как дела?"))
    .build()
```

Стили (`NotificationCompat.Style`): `BigTextStyle` (длинный текст), `BigPictureStyle` (картинка), `InboxStyle` (список строк), `MessagingStyle` (переписка с аватарами), `MediaStyle` (медиа-контролы). Стили расширяют уведомление при разворачивании. Выбирайте стиль по типу контента: сообщения — MessagingStyle, загрузка — прогресс-бар, новость — BigPictureStyle.

### Firebase Cloud Messaging (обзорно) {#fcm-overview}

FCM — сервис push-уведомлений от Google. Сервер отправляет сообщение на FCM, FCM доставляет его на устройство, где приложение (или система) показывает уведомление. Два типа сообщений:

- **Notification message**: FCM сам показывает уведомление, если приложение в фоне; если в foreground — доставляется в `onMessageReceived`.
- **Data message**: всегда доставляется в `onMessageReceived` (приложение само решает, что показать). Полезно для синхронизации данных.

Базовая интеграция: добавить зависимость `firebase-messaging`, создать сервис, наследующий `FirebaseMessagingService`, переопределить `onMessageReceived` и `onNewToken`. Токен устройства отправляется на ваш сервер для адресной отправки. FCM бесплатен, но требует Google Play Services (не работает на устройствах без них, например Huawei).

```kotlin
class MyMessagingService : FirebaseMessagingService() {
    override fun onMessageReceived(message: RemoteMessage) {
        message.notification?.let {
            showNotification(it.title, it.body)
        }
    }
    override fun onNewToken(token: String) {
        sendTokenToServer(token)
    }
}
```

Обработка в foreground: по умолчанию уведомления от FCM не показываются, когда приложение открыто — нужно показать вручную через NotificationManager. Учитывайте ограничения фонового выполнения (Doze, App Standby) — FCM с высоким приоритетом может их обходить для срочных сообщений.

### Типичные ошибки {#notifications-errors}

- Забыть создать канал на Android 8+ — уведомление не показывается (тихо).
- Не запросить `POST_NOTIFICATIONS` на Android 13+ — уведомления игнорируются.
- Использовать `FLAG_MUTABLE` без необходимости — риск подмены PendingIntent.
- Не вызвать `startForeground` в течение 5 секунд — ANR/краш службы.
- Показывать слишком много уведомлений без группировки — спам.
- Игнорировать `onNewToken` — уведомления перестают доходить после переустановки.

**Самопроверка:**
- [ ] Зачем нужен NotificationChannel?
- [ ] Как запросить POST_NOTIFICATIONS?
- [ ] Чем FLAG_IMMUTABLE отличается от FLAG_MUTABLE?
- [ ] Когда обязателен startForeground?

### Вопросы на собеседовании

:::qa
- **Зачем нужны NotificationChannel?** — С Android 8.0 (API 26) каждое уведомление обязано принадлежать каналу, который задаёт звук, вибрацию и importance; пользователь меняет эти настройки в системе. Канал нельзя пересоздать с новыми значениями — `deleteNotificationChannel()` не сбрасывает их.
- **Что даёт `POST_NOTIFICATIONS`?** — С Android 13 (API 33) показ уведомлений требует этого dangerous-разрешения, запрашиваемого через `ActivityResultContracts.RequestPermission()`. Без него `notify()` тихо игнорируется; на Android 12 и ниже разрешение не нужно.
- **Зачем в уведомлении нужен `PendingIntent`?** — Он задаёт действие по клику (`setContentIntent`) или кнопки (`addAction`) и выполняется системой от имени приложения. С Android 12 обязателен `FLAG_IMMUTABLE`, если extras не меняются, или `FLAG_MUTABLE`; requestCode должен быть уникальным.
- **Что обязательно для уведомления foreground-службы?** — `startForeground()` нужно вызвать в течение 5 секунд после запуска, уведомление делают `ongoing`; с Android 14 (API 34) объявляют `foregroundServiceType` и получают разрешение. По завершении вызывают `stopForeground(STOP_FOREGROUND_REMOVE)` и `stopSelf()`.
- **Как обновить уже показанное уведомление?** — Повторный `notify()` с тем же id обновляет его, например меняет прогресс-бар через `setProgress`. `setAutoCancel(true)` закрывает уведомление, когда пользователь по нему кликнул.
- **Чем Notification message отличается от Data message в FCM?** — Notification message показывает система FCM, когда приложение в фоне, а в foreground сообщение приходит в `onMessageReceived`. Data message всегда доставляется в `onMessageReceived`, и приложение само решает, что показать.
:::

## 16. Android Security Basics {#android-security-basics}

Безопасность Android-приложения строится на нескольких принципах: изоляция приложений (sandbox), минимальные разрешения, безопасное хранение данных, защищённая передача по сети, отсутствие секретов в коде, контроль exported-компонентов и аккуратное логирование. Нарушение любого из них может привести к утечке данных пользователя, компрометации аккаунта или обходу защиты. Безопасность — не отдельная фича, а свойство каждой строки кода.

Android построен так, что приложения изолированы друг от друга: каждое работает под своим Linux-пользователем (UID) и не имеет доступа к данным других. Но эта изоляция не спасает от ошибок самого разработчика: exported-компоненты, незащищённые файлы, секреты в APK, логи с токенами. Задача разработчика — не ослабить защиту, которую предоставляет система.

:::cards
- **Sandbox** — каждое приложение изолировано своим UID и правами файловой системы.
- **Минимальные разрешения** — запрашивайте только то, без чего функция не работает.
- **Безопасное хранение** — чувствительные данные в EncryptedSharedPreferences/Keystore.
- **Безопасная сеть** — только HTTPS с проверкой сертификата.
:::

> **Ключевая идея:** Безопасность Android — это комбинация защиты системы (sandbox, permissions) и дисциплины разработчика (не хранить секреты, не логировать токены, не экспортировать лишнее). Ошибка разработчика ломает защиту системы.

### Application Sandbox {#app-sandbox}

Каждое приложение получает уникальный Linux UID при установке. Файлы приложения (внутреннее хранилище `/data/data/<package>`) принадлежат этому UID, и другие приложения (с другими UID) не могут их прочитать. Это и есть Application Sandbox. Дополнительно: SELinux-политики ограничивают доступ к системным ресурсам, а permissions контролируют доступ к камере, контактам, местоположению.

Sandbox защищает от других приложений, но не от:
- root-доступа (на рутованных устройствах данные доступны);
- бэкапов (если `allowBackup="true"`, данные могут утечь через adb backup);
- самого приложения (баги, утечки через exported-компоненты);
- физического доступа к устройству (шифрование диска защищает при выключенном экране).

Поэтому sandbox — базовая защита, а не полная. Для чувствительных данных добавляйте шифрование и не полагайтесь только на UID-изоляцию.

### Принцип минимально необходимых разрешений {#least-privilege}

Запрашивайте только те разрешения, без которых функция не работает. Каждое лишнее разрешение — это потенциальная поверхность атаки и причина недоверия пользователя. Практики:

- Используйте системные пикеры (Photo Picker, Document Picker) вместо разрешений на медиа/файлы.
- Используйте `ACCESS_COARSE_LOCATION` вместо `FINE`, если достаточно приблизительного местоположения.
- Запрашивайте разрешения в контексте (когда пользователь включает функцию), а не при запуске.
- Объясняйте зачем: «Разрешение на камеру нужно для сканирования QR-кода».

С Android 11+ видимость установленных приложений ограничена (package visibility): чтобы видеть другие приложения, нужно объявить `<queries>` в манифесте. Это тоже часть принципа минимальных привилегий.

### Безопасное хранение пользовательских данных {#secure-storage}

Внутреннее хранилище (`Context.getFilesDir()`, `getSharedPreferences()`) защищено sandbox'ом, но данные хранятся в открытом виде. Для чувствительных данных (токены, пароли, персональные данные) используйте:

- **EncryptedSharedPreferences** (AndroidX Security) — шифрует ключи и значения через Android Keystore.
- **Android Keystore** — аппаратное/программное хранилище криптографических ключей; ключи не покидают Keystore.
- **EncryptedFile** — для шифрования файлов.

```kotlin
val masterKey = MasterKey.Builder(context)
    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
    .build()

val prefs = EncryptedSharedPreferences.create(
    context, "secret_prefs", masterKey,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)
prefs.edit().putString("token", authToken).apply()
```

> [!WARNING]
> Библиотека Jetpack Security Crypto (`EncryptedSharedPreferences`, `EncryptedFile`) объявлена deprecated. Пример выше — legacy-подход; для новых проектов рекомендуются Android Keystore напрямую или DataStore с собственным шифрованием.

Не храните чувствительные данные в обычных SharedPreferences, во внешнем хранилище (`getExternalFilesDir`) или в кэше. Внешнее хранилище доступно другим приложениям (на старых версиях) и пользователю через USB.

### HTTPS и проверка TLS-соединения {#https-tls}

Все сетевые соединения должны использовать HTTPS. Android по умолчанию запрещает cleartext (HTTP) трафик (с Android 9+ `usesCleartextTraffic` по умолчанию false). Дополнительно:

- Не отключайте проверку сертификата (`TrustManager` принимающий всё) — это сводит HTTPS к HTTP.
- Не используйте `android:usesCleartextTraffic="true"` в production.
- Для дополнительной защиты используйте Network Security Config: закрепление сертификата (certificate pinning), доверие только системным CA, запрет пользовательских CA.
- Проверяйте hostname (по умолчанию OkHttp/HttpURLConnection делают это).

```xml
<!-- res/xml/network_security_config.xml -->
<network-security-config>
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
    <domain-config>
        <domain includeSubdomains="true">api.example.com</domain>
        <pin-set expiration="2026-12-31">
            <pin digest="SHA-256">base64pin=</pin>
        </pin-set>
    </domain-config>
</network-security-config>
```

```xml
<application android:networkSecurityConfig="@xml/network_security_config" ... />
```

Certificate pinning защищает от компрометации CA, но требует аккуратного обновления (иначе приложение перестанет подключаться при смене сертификата).

### Необходимость исключать секреты из исходного кода {#no-secrets-in-code}

API-ключи, токены, пароли, приватные ключи нельзя хранить в исходном коде, ресурсах или конфигурационных файлах, которые попадают в APK. APK легко декомпилируется (apktool, jadx), и любой секрет извлекается за минуты. Правила:

- Секреты хранятся на сервере; клиент получает их через аутентифицированный API.
- Для ключей, которые всё же нужны на клиенте (например, Google Maps API key), ограничивайте их по package name + SHA-1 fingerprint в консоли провайдера.
- Не коммитьте секреты в Git: используйте `.gitignore`, переменные окружения, CI-секреты.
- Используйте `BuildConfig` с значениями из `local.properties`/CI, понимая, что они всё равно попадут в APK (это не защита, а удобство).
- Обфускация (R8/ProGuard) затрудняет чтение, но не защищает секреты — это не шифрование.

Если секрет утёк — считайте его скомпрометированным и отзовите (ротация ключей). Профилактика: сканирование репозитория на секреты (git-secrets, truffleHog) в CI.

### Безопасность exported-компонентов {#exported-components}

Компоненты (Activity, Service, Receiver, Provider), объявленные с `android:exported="true"`, доступны другим приложениям. Это нужно для интеграций (Share, Deep Links), но создаёт поверхность атаки:

- Другое приложение может запустить вашу Activity с произвольными extras.
- Может отправить broadcast вашему Receiver.
- Может обратиться к вашему ContentProvider.

Правила:
- По умолчанию `exported="false"` (с Android 12 явное объявление обязательно, если есть intent-filter).
- Экспортируйте только то, что действительно должно быть доступно извне.
- Валидируйте входные данные из Intent (extras, data URI) — не доверяйте им.
- Для FileProvider используйте `exported="false"` + `grantUriPermissions="true"`.
- Ограничивайте доступ через permissions: `android:permission` на компоненте.

```xml
<activity
    android:name=".ShareActivity"
    android:exported="true"
    android:permission="com.example.permission.SHARE">
    <intent-filter>
        <action android:name="android.intent.action.SEND" />
        <category android:name="android.intent.category.DEFAULT" />
        <data android:mimeType="text/plain" />
    </intent-filter>
</activity>
```

### Риски логирования чувствительных данных {#logging-sensitive}

Логи (`Log.d`, `Log.e`) доступны через `logcat`; разрешение `READ_LOGS` имеет protection level `signature|privileged|development`, поэтому обычное приложение не получит его ни на одной версии Android. В production логи не должны содержать:

- токены, пароли, ключи API;
- персональные данные (email, телефон, адрес);
- содержимое запросов/ответов с чувствительными полями;
- полные стеки трейсов с внутренними путями (информация для атакующего).

Практики:
- Используйте Timber или обёртку, которая отключает логи в release-сборке.
- Логируйте только идентификаторы (user id, request id), а не сами данные.
- Не логируйте тело HTTP-запросов в production (OkHttp logging interceptor только в debug).
- Удаляйте `android:debuggable="true"` из release-манифеста (по умолчанию false).

```kotlin
// Timber: в debug — логирует, в release — ничего
if (BuildConfig.DEBUG) {
    Timber.plant(Timber.DebugTree())
}
```

### Типичные ошибки {#security-errors}

- Хранить API-ключ в `strings.xml` или `BuildConfig` и считать его защищённым.
- Использовать `allowBackup="true"` для приложений с чувствительными данными.
- Отключать проверку сертификата в debug и забывать убрать в release.
- Логировать токен в `Log.d` «для отладки».
- Экспортировать ContentProvider без валидации входных URI.
- Использовать обычные SharedPreferences для токенов.

**Самопроверка:**
- [ ] Почему sandbox не защищает от root-доступа?
- [ ] Как безопасно хранить токен?
- [ ] Почему секрет в коде — не секрет?
- [ ] Какие компоненты должны быть exported="false"?

### Вопросы на собеседовании

:::qa
- **Что такое Application Sandbox?** — Каждое приложение получает уникальный Linux UID, а его файлы в `/data/data/<package>` принадлежат этому UID, поэтому другие приложения не могут их прочитать; дополнительно доступ ограничивают SELinux и permissions. Sandbox не защищает от root, бэкапов и ошибок самого приложения.
- **Почему нельзя хранить секреты в исходном коде?** — APK легко декомпилируется (apktool, jadx), поэтому API-ключи и токены в `strings.xml` или `BuildConfig` перестают быть секретами. Секреты держат на сервере, а клиентские ключи ограничивают по package name и SHA-1; обфускация R8 — не шифрование.
- **Чем опасно логирование персональных данных?** — Логи читаются через `logcat`, и токены, email или тела запросов в `Log.d` становятся утечкой; разрешение `READ_LOGS` обычному приложению не выдаётся, но логи попадают в bugreport. В release логи отключают, например через Timber, и оставляют только идентификаторы.
- **Как безопасно хранить токен?** — В Android Keystore или в DataStore с шифрованием; Jetpack Security Crypto (`EncryptedSharedPreferences`, `EncryptedFile`) объявлен deprecated и считается legacy-подходом. Нельзя класть токен в обычные SharedPreferences, внешнее хранилище или кэш.
- **Почему важен принцип минимальных разрешений?** — Каждое лишнее разрешение расширяет поверхность атаки и снижает доверие пользователя: лучше Photo Picker вместо доступа к медиа и `ACCESS_COARSE_LOCATION` вместо `FINE`. С Android 11 видимость других приложений ограничивается через `<queries>` в манифесте.
- **Чем опасно `exported="true"`?** — Экспортированный компонент доступен другим приложениям, которые могут передать произвольные extras или URI. По умолчанию ставят `exported="false"`, а входные данные экспортированных компонентов валидируют и ограничивают через `android:permission`.
:::

## Итоговая самопроверка категории {#itogovaya-samoproverka}

- [ ] Понимаю, как Task и Back Stack управляют навигацией и кнопкой «Назад».
- [ ] Знаю разницу между Back и Up и умею применять флаги Intent.
- [ ] Понимаю, почему нельзя выполнять долгие операции в Main Thread и что такое ANR.
- [ ] Умею показывать Toast, AlertDialog, DialogFragment и Snackbar и выбирать подходящий.
- [ ] Умею создавать NotificationChannel, собирать уведомление и запрашивать POST_NOTIFICATIONS.
- [ ] Понимаю модель безопасности Android: sandbox, минимальные разрешения, безопасное хранение и HTTPS.
- [ ] Не храню секреты в коде и не логирую чувствительные данные.

## Источники и документация {#istochniki-i-dokumentaciya}

### Официальная документация

- [Tasks and the back stack](https://developer.android.com/guide/components/activities/tasks-and-back-stack)
- [Understand ANRs](https://developer.android.com/topic/performance/vitals/anr)
- [Keep your app responsive](https://developer.android.com/training/articles/perf-anr)
- [Dialogs](https://developer.android.com/develop/ui/views/components/dialogs)
- [Notifications overview](https://developer.android.com/develop/ui/views/notifications)
- [Create a notification](https://developer.android.com/develop/ui/views/notifications/build-notification)
- [Notification channels](https://developer.android.com/develop/ui/views/notifications/channels)
- [Foreground services](https://developer.android.com/develop/background-work/services/foreground-services)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [App security best practices](https://developer.android.com/privacy-and-security/security-best-practices)
- [Network security config](https://developer.android.com/training/articles/security-config)
- [EncryptedSharedPreferences](https://developer.android.com/topic/security/data)

### Статьи

- [Android Vitals: ANR](https://developer.android.com/topic/performance/vitals/anr)
- [Background execution limits](https://developer.android.com/guide/background)
- [Permissions on Android](https://developer.android.com/training/permissions)
- [PendingIntent mutability](https://developer.android.com/guide/components/intents-filters#PendingIntent)
