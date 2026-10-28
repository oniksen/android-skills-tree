<header class="study-hero">
<p class="study-eyebrow">Android · Kotlin · Junior</p>
<h1 class="study-title">Как устроен Android-проект</h1>
<p class="study-lead">
Краткий учебный конспект: папки и модули, ресурсы, тесты, Gradle, версии SDK, build types, product flavors, APK/AAB, подпись и R8. Примеры используют Kotlin DSL — файлы <code>.gradle.kts</code>.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#structure">Структура</a>
<a class="study-nav-link" href="#modules">Модули</a>
<a class="study-nav-link" href="#tests">Тесты</a>
<a class="study-nav-link" href="#resources">Ресурсы</a>
<a class="study-nav-link" href="#gradle">Gradle и SDK</a>
<a class="study-nav-link" href="#variants">Варианты сборки</a>
<a class="study-nav-link" href="#packages">APK/AAB</a>
<a class="study-nav-link" href="#release">Release</a>
<a class="study-nav-link" href="#check">Проверка знаний</a>
</nav>

<section id="structure" class="study-section">
<h2 class="study-section-title">1. Структура проекта</h2>
<p>Проект — это набор модулей и настроек сборки. В простом приложении основной модуль обычно называется <code>app</code>.</p>

```kotlin
MyAndroidProject/
├── app/
│   ├── build.gradle.kts       # настройки модуля
│   └── src/
│       ├── main/
│       │   ├── java/ или kotlin/  # исходный код
│       │   ├── res/               # ресурсы Android
│       │   ├── assets/            # файлы как есть
│       │   └── AndroidManifest.xml
│       ├── test/              # локальные тесты JVM
│       └── androidTest/       # тесты на устройстве
├── gradle/
│   └── libs.versions.toml     # версии зависимостей (если используется)
├── build.gradle.kts           # общие плагины/настройки
├── settings.gradle.kts        # состав проекта и репозитории
├── gradle.properties
├── gradlew / gradlew.bat      # Gradle Wrapper
└── gradle/wrapper/
```

<div class="study-grid">
<div class="study-mini"><strong class="study-mini-title"><code>src/main</code></strong>Код и ресурсы, которые входят в приложение.</div>
<div class="study-mini"><strong class="study-mini-title"><code>src/test</code></strong>Тесты, которые обычно запускаются на компьютере без эмулятора.</div>
<div class="study-mini"><strong class="study-mini-title"><code>src/androidTest</code></strong>Тесты, которым нужен Android runtime: устройство или эмулятор.</div>
<div class="study-mini"><strong class="study-mini-title"><code>AndroidManifest.xml</code></strong>Объявляет компоненты приложения и важные разрешения/настройки.</div>
</div>
<p class="study-small study-muted">Папка <code>java</code> может содержать Kotlin-файлы — название историческое. Конкретная структура зависит от проекта и используемых технологий.</p>


<section id="modules" class="study-section">
<h2 class="study-section-title">2. Модули и зависимости</h2>
<p>Модуль — самостоятельная часть проекта со своими исходниками и конфигурацией сборки.</p>
<div class="study-grid">
<div class="study-mini"><strong class="study-mini-title"><code>:app</code></strong>Android-приложение, которое можно собрать в APK или AAB.</div>
<div class="study-mini"><strong class="study-mini-title"><code>:core</code> или <code>:design</code></strong>Часто Android-библиотека, которую используют другие модули.</div>
<div class="study-mini"><strong class="study-mini-title">Kotlin/JVM library</strong>Общая Kotlin-логика без зависимости от Android API.</div>
<div class="study-mini"><strong class="study-mini-title">Зависимость модуля</strong>Позволяет одному модулю использовать классы другого.</div>
</div>

```kotlin
// settings.gradle.kts
include(":app", ":core")

// app/build.gradle.kts
dependencies {
    implementation(project(":core"))
}
```

<p>Зависимость может быть внешней библиотекой (например, JUnit) или другим модулем проекта. <code>implementation</code> — обычный способ подключить то, что нужно внутри текущего модуля. <code>api</code> используют в библиотечном модуле, когда типы зависимости должны быть видны потребителям этой библиотеки; без такой необходимости выбирайте <code>implementation</code>.</p>
</section>

<section id="tests" class="study-section">
<h2 class="study-section-title">3. Тесты и test-зависимости</h2>
<p>Тестовая зависимость нужна тестовому коду, а не обязательно самому приложению. Gradle-конфигурация определяет, где именно библиотека доступна.</p>
<table class="study-table">
<thead>
<tr><th>Конфигурация</th><th>Для чего</th></tr>
</thead>
<tbody>
<tr><td><code>testImplementation</code></td><td>Локальные тесты из <code>src/test</code>, обычно выполняются на JVM.</td></tr>
<tr><td><code>androidTestImplementation</code></td><td>Инструментальные тесты из <code>src/androidTest</code>, запускаются на Android-устройстве/эмуляторе.</td></tr>
<tr><td><code>implementation</code></td><td>Зависимость основного кода приложения.</td></tr>
</tbody>
</table>
<p><strong>JUnit</strong> — библиотека для написания и запуска тестов. Она предоставляет аннотацию <code>@Test</code> и проверки вроде <code>assertEquals</code>.</p>

```kotlin
dependencies {
    testImplementation("junit:junit:4.13.2")
}
```


```kotlin
class Calculator {
    fun sum(a: Int, b: Int) = a + b
}

class CalculatorTest {
    @Test
    fun sum_returnsTotal() {
        assertEquals(5, Calculator().sum(2, 3))
    }
}
```

<p>Почему не <code>implementation</code>? Потому что JUnit здесь нужен только для тестов. Он не должен становиться обычной зависимостью кода приложения.</p>
<div class="study-diagram">
<div class="study-flow">
<div class="study-node"><b>src/main</b><br />Код приложения</div>
<div class="study-arrow">→</div>
<div class="study-node"><b>APK / AAB</b><br />Приложение</div>
</div>
<div style=} />
<div class="study-flow">
<div class="study-node"><b>src/test</b><br />JUnit</div>
<div class="study-arrow">→</div>
<div class="study-node"><b>testDebugUnitTest</b><br />Тесты на JVM</div>
</div>
</div>

```kotlin
./gradlew testDebugUnitTest
./gradlew connectedDebugAndroidTest
```

<p class="study-small study-muted">Вторая команда требует подключённого устройства или запущенного эмулятора. В конкретном проекте названия задач могут зависеть от вариантов сборки.</p>
</section>

<section id="resources" class="study-section">
<h2 class="study-section-title">4. Ресурсы и qualifiers</h2>
<p>Ресурсы — изображения, строки, цвета, темы, XML-файлы и другие данные, которые Android хранит отдельно от исходного кода. Ресурсы из <code>res/</code> получают идентификаторы в классе <code>R</code>.</p>
<table class="study-table">
<thead>
<tr><th>Папка</th><th>Типичное содержимое</th></tr>
</thead>
<tbody>
<tr><td><code>drawable/</code></td><td>Изображения и drawable XML.</td></tr>
<tr><td><code>mipmap/</code></td><td>Иконки приложения для разных плотностей.</td></tr>
<tr><td><code>layout/</code></td><td>XML-разметки View-based интерфейса.</td></tr>
<tr><td><code>values/</code></td><td>Строки, цвета, размеры, стили и темы.</td></tr>
<tr><td><code>xml/</code></td><td>Произвольные XML-конфигурации, поддерживаемые приложением.</td></tr>
<tr><td><code>assets/</code></td><td>Файлы, доступ к которым часто получают по пути/имени, без ID из <code>R</code>.</td></tr>
</tbody>
</table>
<p><strong>Resource qualifier</strong> — суффикс в имени папки ресурсов, который указывает, для какой конфигурации устройства подходит ресурс. Android выбирает наиболее подходящий вариант.</p>

```kotlin
res/
├── values/strings.xml       # значения по умолчанию
├── values-ru/strings.xml    # русская локализация
├── values-night/themes.xml # ресурсы для тёмной темы
├── layout/                 # обычная ориентация/конфигурация
├── layout-land/            # альбомная ориентация
├── drawable-hdpi/          # графика для плотности hdpi
└── values-sw600dp/         # устройства с smallest width от 600 dp
```


```kotlin
<!-- res/values/strings.xml -->
<string name="welcome">Welcome</string>

<!-- res/values-ru/strings.xml -->
<string name="welcome">Добро пожаловать</string>

// Kotlin
val title = getString(R.string.welcome)
```

<p>Код обращается к одному ID — <code>R.string.welcome</code>. Android подставляет подходящий ресурс, например перевод для русского языка. Для каждого альтернативного ресурса желательно иметь корректный вариант по умолчанию.</p>
<div class="study-note">
<strong>Запомнить:</strong> <code>res/</code> — типизированные Android-ресурсы с ID в <code>R</code>; <code>assets/</code> — файлы, которые приложение читает как файлы.
</div>
</section>

<section id="gradle" class="study-section">
<h2 class="study-section-title">5. Gradle, настройки и версии SDK</h2>
<p><strong>Gradle</strong> — система сборки: она разрешает зависимости, компилирует код, обрабатывает ресурсы и формирует артефакты. Android Gradle Plugin (AGP) добавляет задачи и правила, специфичные для Android.</p>
<table class="study-table">
<thead>
<tr><th>Файл</th><th>Роль</th></tr>
</thead>
<tbody>
<tr><td><code>settings.gradle.kts</code></td><td>Какие модули входят в проект, настройки репозиториев.</td></tr>
<tr><td>Корневой <code>build.gradle.kts</code></td><td>Объявления плагинов и настройки, общие для проекта.</td></tr>
<tr><td><code>app/build.gradle.kts</code></td><td>Настройки конкретного модуля, SDK, зависимости, варианты сборки.</td></tr>
<tr><td><code>gradle/libs.versions.toml</code></td><td>Централизованный каталог версий зависимостей и плагинов, если проект его использует.</td></tr>
<tr><td><code>gradle.properties</code></td><td>Свойства Gradle и параметры сборки.</td></tr>
</tbody>
</table>

```kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.notes"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.notes"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }
}
```

<p>Это иллюстрация конфигурации: конкретные версии SDK и набор плагинов зависят от проекта и версии Android Gradle Plugin.</p>
<div class="study-grid">
<div class="study-mini"><strong class="study-mini-title"><code>namespace</code></strong>Пакет для сгенерированного кода, включая класс <code>R</code>.</div>
<div class="study-mini"><strong class="study-mini-title"><code>applicationId</code></strong>Идентификатор приложения для Android и магазинов приложений.</div>
<div class="study-mini"><strong class="study-mini-title"><code>compileSdk</code></strong>Версия Android API, с которой компилятор сверяет доступные API.</div>
<div class="study-mini"><strong class="study-mini-title"><code>minSdk</code></strong>Минимальная версия Android, на которой приложение заявлено как совместимое.</div>
<div class="study-mini"><strong class="study-mini-title"><code>targetSdk</code></strong>Версия API, под поведение которой приложение адаптировано. Влияет на некоторые совместимые изменения поведения Android.</div>
<div class="study-mini"><strong class="study-mini-title"><code>versionCode</code> / <code>versionName</code></strong>Внутренний целочисленный номер версии и отображаемая строка версии.</div>
</div>
<h3 class="study-subtitle">Что значит «компилировать против SDK»?</h3>
<p>При <code>compileSdk = 35</code> компилятор получает описания Android API уровня 35 и может распознавать соответствующие классы и методы. Это <strong>не</strong> означает, что приложение запускается только на Android 15. Минимальная ОС определяется прежде всего <code>minSdk</code>, а новые API при необходимости проверяют во время выполнения.</p>

```kotlin
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
    // API 34+: вызов API, требующего Android 14 или новее
}
```

<p class="study-small study-muted">Константа и пример здесь показывают общий принцип: используйте проверку той версии API, которая требуется конкретному вызову, и учитывайте доступность библиотек.</p>
<div class="study-diagram">
<div class="study-flow">
<div class="study-node"><b>compileSdk</b><br />С чем компилируем</div>
<div class="study-arrow">≠</div>
<div class="study-node"><b>minSdk</b><br />Самая старая поддерживаемая ОС</div>
<div class="study-arrow">≠</div>
<div class="study-node"><b>targetSdk</b><br />Целевое поведение платформы</div>
</div>
</div>
</section>

<section id="variants" class="study-section">
<h2 class="study-section-title">6. Build types, product flavors и build variants</h2>
<p>Эти настройки позволяют получать разные сборки из одной кодовой базы — например, отладочную и релизную, тестовую и производственную.</p>
<div class="study-grid">
<div class="study-mini"><strong class="study-mini-title">Build type</strong>Описывает характер сборки. Обычно есть <code>debug</code> и <code>release</code>.</div>
<div class="study-mini"><strong class="study-mini-title">Product flavor</strong>Описывает вариант продукта: например, <code>demo</code> и <code>full</code>, или <code>staging</code> и <code>production</code>.</div>
<div class="study-mini"><strong class="study-mini-title">Build variant</strong>Комбинация flavor и build type, если flavors настроены.</div>
<div class="study-mini"><strong class="study-mini-title">Примеры</strong><code>demoDebug</code>, <code>demoRelease</code>, <code>productionDebug</code>, <code>productionRelease</code>.</div>
</div>
<div class="study-diagram">
<p class="study-small study-muted" style=}>Пример матрицы вариантов</p>
<table class="study-table">
<thead>
<tr><th>Flavor ↓ / Type →</th><th><code>debug</code></th><th><code>release</code></th></tr>
</thead>
<tbody>
<tr><th><code>demo</code></th><td><span class="study-pill">demoDebug</span></td><td><span class="study-pill">demoRelease</span></td></tr>
<tr><th><code>production</code></th><td><span class="study-pill">productionDebug</span></td><td><span class="study-pill">productionRelease</span></td></tr>
</tbody>
</table>
</div>

```kotlin
android {
    flavorDimensions += "environment"

    productFlavors {
        create("demo") {
            dimension = "environment"
            applicationIdSuffix = ".demo"
        }
        create("production") {
            dimension = "environment"
        }
    }

    buildTypes {
        getByName("debug") {
            isDebuggable = true
        }
        getByName("release") {
            isMinifyEnabled = true
        }
    }
}
```

<p>Фрагмент — пример идеи, а не готовая универсальная конфигурация. В реальном проекте проверьте совместимость с используемой версией AGP. <code>applicationIdSuffix</code> позволяет установить demo-версию рядом с основной, если у них разные идентификаторы.</p>
</section>

<section id="packages" class="study-section">
<h2 class="study-section-title">7. APK и AAB: что собирает Android-проект</h2>
<div class="study-grid">
<div class="study-mini"><strong class="study-mini-title">APK</strong>Устанавливаемый пакет Android. Его можно установить на устройство напрямую, если подпись и совместимость подходят.</div>
<div class="study-mini"><strong class="study-mini-title">AAB</strong>Android App Bundle — формат публикации. Google Play использует его, чтобы сформировать подходящие APK для устройств.</div>
</div>
<div class="study-diagram">
<div class="study-flow">
<div class="study-node"><b>Исходники</b><br />Kotlin + ресурсы</div>
<div class="study-arrow">→</div>
<div class="study-node"><b>Gradle / AGP</b><br />Компиляция и обработка</div>
<div class="study-arrow">→</div>
<div class="study-node"><b>APK или AAB</b><br />Артефакт сборки</div>
</div>
</div>

```kotlin
./gradlew assembleDebug
./gradlew assembleRelease
./gradlew bundleRelease
```

<p>Обычно результаты находятся в <code>app/build/outputs/apk/</code> и <code>app/build/outputs/bundle/</code>. Точный путь зависит от модуля и варианта сборки.</p>
</section>

<section id="release" class="study-section">
<h2 class="study-section-title">8. Подпись, R8 и Gradle Wrapper</h2>
<h3 class="study-subtitle">Подпись приложения</h3>
<p>Подпись связывает пакет с ключом разработчика и позволяет Android проверять целостность пакета и совместимость обновлений. Чтобы обновить уже установленное приложение, обычно нужно подписать новую версию совместимым ключом.</p>
<div class="study-note">
При публикации через Google Play обычно используется Play App Signing: разработчик загружает AAB, подписанный upload key, а Google Play подписывает APK, которые получает пользователь, ключом приложения. Эти ключи выполняют разные роли.
</div>
<p>В Android Studio обычно можно открыть <strong>Build → Generate Signed Bundle / APK</strong>. Не храните приватные ключи и пароли в открытом виде в Git или в публичном репозитории.</p>
<h3 class="study-subtitle">R8</h3>
<p>R8 может уменьшать размер приложения, оптимизировать код и переименовывать классы/методы (обфускация). В release-сборке его часто включают настройкой <code>isMinifyEnabled = true</code>; ресурсы также могут сокращаться отдельной настройкой.</p>

```kotlin
buildTypes {
    release {
        isMinifyEnabled = true
        // При необходимости подключают правила keep.
    }
}
```

<p>Если приложение работает в debug, но ломается в release, проверьте правила R8, особенно при использовании reflection, сериализации или библиотек, которым нужны сохраняемые имена классов. Обфускация не защищает секреты, встроенные в приложение.</p>
<h3 class="study-subtitle">Gradle Wrapper</h3>
<p>Wrapper — скрипты <code>gradlew</code>/<code>gradlew.bat</code> и настройки в <code>gradle/wrapper/</code>, которые позволяют проекту использовать заданную версию Gradle без ручной установки именно этой версии.</p>

```kotlin
./gradlew assembleDebug
./gradlew testDebugUnitTest
./gradlew tasks
```

<p>Это помогает разработчикам и CI собирать проект на согласованной версии Gradle. Но сборка всё равно зависит от совместимости Gradle, Android Gradle Plugin, JDK и установленных SDK.</p>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">9. Самопроверка</h2>
<p class="study-small study-muted">Отметьте пункты, которые уже можете объяснить без подсказки.</p>
<div class="study-checklist">
<label><input type="checkbox" /> Могу объяснить назначение <code>src/main</code>, <code>src/test</code> и <code>src/androidTest</code>.</label>
<label><input type="checkbox" /> Понимаю разницу между <code>implementation</code>, <code>testImplementation</code> и <code>androidTestImplementation</code>.</label>
<label><input type="checkbox" /> Могу привести пример qualifier, например <code>values-ru</code> или <code>layout-land</code>.</label>
<label><input type="checkbox" /> Не путаю <code>compileSdk</code>, <code>minSdk</code> и <code>targetSdk</code>.</label>
<label><input type="checkbox" /> Могу найти в проекте <code>app/build.gradle.kts</code> и объяснить основные поля.</label>
<label><input type="checkbox" /> Понимаю разницу между build type, flavor и variant.</label>
<label><input type="checkbox" /> Могу объяснить APK/AAB, подпись приложения, назначение R8 и Gradle Wrapper.</label>
<label><input type="checkbox" /> Могу запустить debug-сборку и локальные unit-тесты через Wrapper.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Нужно собрать debug APK</th><td><code>./gradlew assembleDebug</code></td></tr>
<tr><th>Нужно запустить локальные тесты</th><td><code>./gradlew testDebugUnitTest</code></td></tr>
<tr><th>Нужно собрать bundle для публикации</th><td><code>./gradlew bundleRelease</code></td></tr>
<tr><th>Где настройки модуля</th><td><code>app/build.gradle.kts</code></td></tr>
<tr><th>Где ресурсы</th><td><code>app/src/main/res/</code></td></tr>
<tr><th>Где unit-тесты</th><td><code>app/src/test/</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">Учебный конспект для уровня Junior. Команды и примеры приведены для распространённого Gradle Kotlin DSL; сверяйте их с конфигурацией конкретного проекта.</footer>
