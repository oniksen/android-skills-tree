<header class="study-hero">
<p class="study-eyebrow">Android · Junior</p>
<h1 class="study-title">Gradle</h1>
<p class="study-lead">
Gradle — система сборки Android-проекта. Она разрешает зависимости, компилирует код, обрабатывает ресурсы и создаёт APK/AAB. На junior-уровне важно понимать build-файлы, зависимости и базовые задачи.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#files">Файлы</a>
<a class="study-nav-link" href="#config">Конфигурация</a>
<a class="study-nav-link" href="#deps">Зависимости</a>
<a class="study-nav-link" href="#tasks">Задачи</a>
<a class="study-nav-link" href="#check">Проверка</a>
</nav>

<section id="files" class="study-section">
<h2 class="study-section-title">1. Основные файлы</h2>
<p>
Конфигурация сборки разделена по уровням: проект, модуль и каталог версий.
</p>

```kotlin
settings.gradle.kts        # состав проекта
build.gradle.kts          # корневой: плагины и общие настройки
app/build.gradle.kts      # настройки модуля
gradle/libs.versions.toml # каталог версий

```

<table class="study-table">
<thead>
<tr>
<th>Файл</th>
<th>Роль</th>
</tr>
</thead>
<tbody>
<tr><td><code>settings.gradle.kts</code></td><td>Какие модули входят в проект.</td></tr>
<tr><td>Корневой <code>build.gradle.kts</code></td><td>Общие плагины и настройки.</td></tr>
<tr><td><code>app/build.gradle.kts</code></td><td>Настройки модуля, SDK, зависимости.</td></tr>
<tr><td><code>gradle/libs.versions.toml</code></td><td>Централизованные версии.</td></tr>
</tbody>
</table>
</section>

<section id="config" class="study-section">
<h2 class="study-section-title">2. Конфигурация модуля</h2>
<p>
В <code>app/build.gradle.kts</code> задают namespace, SDK, версию приложения и плагины.
</p>

```kotlin
plugins 

android 
}

```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>namespace</code></strong>
Пакет для сгенерированного кода, включая <code>R</code>.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>compileSdk</code></strong>
API, против которого компилируется код.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>minSdk</code></strong>
Минимальная поддерживаемая версия Android.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>targetSdk</code></strong>
Версия, под поведение которой адаптировано приложение.
</div>
</div>
</section>

<section id="deps" class="study-section">
<h2 class="study-section-title">3. Зависимости</h2>
<p>
Зависимости подключают библиотеки и другие модули проекта. Конфигурация определяет, где зависимость доступна.
</p>

```kotlin
dependencies 

```


```kotlin
implementation("lib")        // нужна текущему модулю
api("lib")                 // нужна и потребителям библиотеки
testImplementation("lib")  // только для unit-тестов
androidTestImplementation("lib") // только для инструментальных тестов

```

<div class="study-note">
<strong>Запомнить:</strong> <code>implementation</code> — обычный выбор. <code>api</code> используют в библиотечных модулях, когда типы зависимости должны быть видны потребителям.
</div>
</section>

<section id="tasks" class="study-section">
<h2 class="study-section-title">4. Gradle-задачи</h2>
<p>
Через Gradle Wrapper запускают сборку, тесты и другие задачи.
</p>

```kotlin
./gradlew assembleDebug
./gradlew testDebugUnitTest
./gradlew connectedDebugAndroidTest
./gradlew tasks

```

<table class="study-table">
<tbody>
<tr><th>Debug APK</th><td><code>./gradlew assembleDebug</code></td></tr>
<tr><th>Unit-тесты</th><td><code>./gradlew testDebugUnitTest</code></td></tr>
<tr><th>Инструментальные тесты</th><td><code>./gradlew connectedDebugAndroidTest</code></td></tr>
<tr><th>Список задач</th><td><code>./gradlew tasks</code></td></tr>
</tbody>
</table>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">5. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу найти <code>app/build.gradle.kts</code>.</label>
<label><input type="checkbox" /> Понимаю разницу между <code>implementation</code> и <code>api</code>.</label>
<label><input type="checkbox" /> Знаю, где задаются <code>minSdk</code> и <code>targetSdk</code>.</label>
<label><input type="checkbox" /> Могу запустить debug-сборку через Wrapper.</label>
<label><input type="checkbox" /> Понимаю роль <code>gradle/libs.versions.toml</code>.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Собрать debug APK</th><td><code>./gradlew assembleDebug</code></td></tr>
<tr><th>Запустить unit-тесты</th><td><code>./gradlew testDebugUnitTest</code></td></tr>
<tr><th>Зависимость модуля</th><td><code>implementation(project(&quot;:core&quot;))</code></td></tr>
<tr><th>Тестовая зависимость</th><td><code>testImplementation(...)</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Gradle Kotlin DSL.
</footer>
