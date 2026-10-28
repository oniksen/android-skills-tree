<header class="study-hero">
<p class="study-eyebrow">Android · Junior</p>
<h1 class="study-title">Проект и модули</h1>
<p class="study-lead">
Android-проект состоит из модулей, исходного кода, ресурсов и конфигурации сборки. На junior-уровне важно понимать структуру директорий, назначение <code>src/main</code>, <code>src/test</code>, <code>src/androidTest</code> и роль build-файлов.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#tree">Структура</a>
<a class="study-nav-link" href="#src">src-директории</a>
<a class="study-nav-link" href="#modules">Модули</a>
<a class="study-nav-link" href="#build">Build-файлы</a>
<a class="study-nav-link" href="#check">Проверка</a>
</nav>

<section id="tree" class="study-section">
<h2 class="study-section-title">1. Структура проекта</h2>
<p>
В простом приложении основной модуль называется <code>app</code>. Вокруг него находятся настройки Gradle и wrapper.
</p>

```kotlin
MyAndroidProject/
├── app/
│   ├── build.gradle.kts
│   └── src/
│       ├── main/
│       ├── test/
│       └── androidTest/
├── gradle/
├── build.gradle.kts
├── settings.gradle.kts
└── gradle.properties

```

</section>

<section id="src" class="study-section">
<h2 class="study-section-title">2. src-директории</h2>
<p>
Исходный код и ресурсы разделяются по типам задач. Это помогает держать проект организованным.
</p>

```kotlin
src/main/kotlin   # исходный код
src/main/res      # ресурсы
src/main/AndroidManifest.xml
src/test          # unit-тесты JVM
src/androidTest   # инструментальные тесты

```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>src/main</code></strong>
Код и ресурсы, которые попадают в приложение.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>src/test</code></strong>
Локальные JVM-тесты, запускаются без эмулятора.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>src/androidTest</code></strong>
Инструментальные тесты на устройстве или эмуляторе.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>AndroidManifest.xml</code></strong>
Объявляет компоненты, разрешения и настройки приложения.
</div>
</div>
</section>

<section id="modules" class="study-section">
<h2 class="study-section-title">3. Модули</h2>
<p>
Модуль — самостоятельная часть проекта со своими исходниками и конфигурацией сборки. Модули помогают разделять ответственность.
</p>

```kotlin
// settings.gradle.kts
include(":app", ":core", ":feature")

// app/build.gradle.kts
dependencies 

```

<div class="study-note">
<strong>Запомнить:</strong> <code>implementation(project(&quot;:core&quot;))</code> подключает другой модуль проекта.
</div>
</section>

<section id="build" class="study-section">
<h2 class="study-section-title">4. Build-файлы</h2>
<p>
Конфигурация сборки разделена по уровням: проект, модуль и каталог версий.
</p>

```kotlin
// Корневой build.gradle.kts — общие плагины
// app/build.gradle.kts — настройки модуля
// gradle/libs.versions.toml — версии зависимостей

```

<table class="study-table">
<thead>
<tr>
<th>Файл</th>
<th>Роль</th>
</tr>
</thead>
<tbody>
<tr><td><code>settings.gradle.kts</code></td><td>Состав проекта и репозитории.</td></tr>
<tr><td>Корневой <code>build.gradle.kts</code></td><td>Общие плагины и настройки.</td></tr>
<tr><td><code>app/build.gradle.kts</code></td><td>Настройки модуля, SDK, зависимости.</td></tr>
<tr><td><code>gradle/libs.versions.toml</code></td><td>Централизованные версии.</td></tr>
</tbody>
</table>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">5. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу объяснить назначение <code>src/main</code>, <code>src/test</code> и <code>src/androidTest</code>.</label>
<label><input type="checkbox" /> Понимаю разницу между модулем и проектом.</label>
<label><input type="checkbox" /> Знаю, где находятся настройки модуля.</label>
<label><input type="checkbox" /> Могу объяснить роль <code>settings.gradle.kts</code>.</label>
<label><input type="checkbox" /> Понимаю, зачем разделять код и ресурсы.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Код приложения</th><td><code>app/src/main/kotlin</code></td></tr>
<tr><th>Ресурсы</th><td><code>app/src/main/res</code></td></tr>
<tr><th>Unit-тесты</th><td><code>app/src/test</code></td></tr>
<tr><th>Инструментальные тесты</th><td><code>app/src/androidTest</code></td></tr>
<tr><th>Настройки модуля</th><td><code>app/build.gradle.kts</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на структуру Android-проекта.
</footer>
