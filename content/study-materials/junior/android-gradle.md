<header class="study-hero">
<p class="study-eyebrow">Android · Junior</p>
<h1 class="study-title">Gradle</h1>
<p class="study-lead">
Gradle — система сборки Android-проекта. Она разрешает зависимости, компилирует код, обрабатывает ресурсы и создаёт APK/AAB. На junior-уровне важно понимать build-файлы, зависимости и базовые задачи.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#files">1. Основные файлы</a>
<a class="study-nav-link" href="#config">2. Конфигурация модуля</a>
<a class="study-nav-link" href="#deps">3. Зависимости</a>
<a class="study-nav-link" href="#tasks">4. Gradle-задачи</a>
<a class="study-nav-link" href="#sec-1">Product Flavors</a>
<a class="study-nav-link" href="#sec-2">Gradle: подробнее</a>
<a class="study-nav-link" href="#sec-3">Каталог версий: подробнее</a>
<a class="study-nav-link" href="#sec-4">Build types</a>
<a class="study-nav-link" href="#sec-5">Практика и частые ошибки</a>
<a class="study-nav-link" href="#sec-6">Пример из реальной работы</a>
<a class="study-nav-link" href="#sec-7">Итог</a>
<a class="study-nav-link" href="#sec-8">Рекомендации</a>
<a class="study-nav-link" href="#sec-9">Мини-совет</a>
<a class="study-nav-link" href="#sec-10">Product Flavors: подробнее</a>
<a class="study-nav-link" href="#sec-11">Gradle Wrapper</a>
<a class="study-nav-link" href="#sec-12">Частые ошибки: подробнее</a>
<a class="study-nav-link" href="#sec-13">Итоговый совет</a>
<a class="study-nav-link" href="#sec-14">Заметка</a>
<a class="study-nav-link" href="#sec-15">Пример конфигурации</a>
<a class="study-nav-link" href="#sec-16">Рекомендации: подробнее</a>
<a class="study-nav-link" href="#sec-17">Итоговый совет 2</a>
<a class="study-nav-link" href="#sec-18">Заметка 2</a>
<a class="study-nav-link" href="#sec-19">Итоговый совет 3</a>
<a class="study-nav-link" href="#sec-20">Заметка 3</a>
<a class="study-nav-link" href="#sec-21">Итоговый совет 4</a>
<a class="study-nav-link" href="#sec-22">Заметка 4</a>
<a class="study-nav-link" href="#sec-23">Итоговый совет 5</a>
<a class="study-nav-link" href="#sec-24">Заметка 5</a>
<a class="study-nav-link" href="#sec-25">Итоговый совет 6</a>
<a class="study-nav-link" href="#sec-26">Заметка 6</a>
<a class="study-nav-link" href="#sec-27">Итоговый совет 7</a>
<a class="study-nav-link" href="#sec-28">Заметка 7</a>
<a class="study-nav-link" href="#sec-29">Итоговый совет 8</a>
<a class="study-nav-link" href="#sec-30">Заметка 8</a>
<a class="study-nav-link" href="#sec-31">Итоговый совет 9</a>
<a class="study-nav-link" href="#sec-32">Заметка 9</a>
<a class="study-nav-link" href="#sec-33">Итоговый совет 10</a>
<a class="study-nav-link" href="#sec-34">Заметка 10</a>
<a class="study-nav-link" href="#sec-35">Итоговый совет 11</a>
<a class="study-nav-link" href="#sec-36">Заметка 11</a>
<a class="study-nav-link" href="#sec-37">Итоговый совет 12</a>
<a class="study-nav-link" href="#sec-38">Заметка 12</a>
<a class="study-nav-link" href="#sec-39">Итоговый совет 13</a>
<a class="study-nav-link" href="#sec-40">Заметка 13</a>
<a class="study-nav-link" href="#sec-41">Итоговый совет 14</a>
<a class="study-nav-link" href="#check">5. Самопроверка</a>
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
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.app"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }
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
dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation(project(":core"))
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
}
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

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Product Flavors</h2>
<p>Product flavors позволяют собирать разные варианты одного приложения из одной кодовой базы: например, demo и production, или free и paid. Каждый flavor может иметь свой applicationId, ресурсы и настройки.</p>

```kotlin
android {
    flavorDimensions += "version"

    productFlavors {
        create("demo") {
            dimension = "version"
            applicationIdSuffix = ".demo"
        }
        create("full") {
            dimension = "version"
        }
    }
}
```
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Gradle: подробнее</h2>
<p>Gradle — система сборки, которая автоматизирует компиляцию, разрешение зависимостей и упаковку. Android Gradle Plugin (AGP) добавляет задачи и правила для Android. Gradle использует Kotlin DSL или Groovy DSL для конфигурации.</p>

<p>Сборка состоит из фаз: конфигурация (чтение build-файлов) и выполнение (запуск задач). Большие проекты могут иметь десятки модулей, поэтому оптимизация конфигурации важна.</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Каталог версий: подробнее</h2>
<p><code>libs.versions.toml</code> централизует версии зависимостей и плагинов. Это упрощает обновление и снижает риск несовместимости. В нём объявляют версии, библиотеки и плагины.</p>

```toml
[versions]
agp = "8.5.0"
kotlin = "2.0.0"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "androidxCoreKtx" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
```
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Build types</h2>
<p>Build types описывают характер сборки: <code>debug</code> и <code>release</code>. Debug-сборка включает отладку, release — оптимизацию и обфускацию. Каждый build type может иметь свои настройки.</p>

```kotlin
buildTypes {
    debug {
        isDebuggable = true
    }
    release {
        isMinifyEnabled = true
        proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
    }
}
```
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>В реальных проектах используют каталог версий, разделяют зависимости по конфигурациям и избегают дублирования. Частые ошибки: использование <code>api</code> без необходимости, отсутствие централизации версий, неправильная настройка build types.</p>

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> использование <code>api</code> вместо <code>implementation</code> увеличивает время сборки и ухудшает инкапсуляцию.
</div>
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Пример из реальной работы</h2>
<p>В проекте с несколькими модулями каталог версий позволяет обновить библиотеку в одном месте. Build types настраивают debug/release сборки с разными applicationId и иконками.</p>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>Gradle — основа сборки Android. Понимание build-файлов, зависимостей и задач ускоряет разработку.</p>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>Используйте каталог версий, централизуйте настройки и избегайте ненужных зависимостей.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p><code>implementation</code> — выбор по умолчанию для зависимостей.</p>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Product Flavors: подробнее</h2>
<p>Product flavors позволяют собирать разные варианты приложения: demo, production, free, paid. Каждый flavor может иметь свой applicationId, ресурсы и настройки. Flavor dimensions группируют flavors.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Gradle Wrapper</h2>
<p>Wrapper — скрипты <code>gradlew</code>/<code>gradlew.bat</code> и настройки в <code>gradle/wrapper/</code>. Они позволяют проекту использовать заданную версию Gradle без ручной установки.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">Частые ошибки: подробнее</h2>
<p>Неправильная настройка build types, отсутствие централизации версий, использование <code>api</code> без необходимости. Проверяйте совместимость Gradle, AGP и JDK.</p>
</section>

<section id="sec-13" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>Gradle — основа сборки. Понимание конфигурации ускоряет разработку.</p>
</section>

<section id="sec-14" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Используйте каталог версий и централизацию.</p>
</section>

<section id="sec-15" class="study-section">
<h2 class="study-section-title">Пример конфигурации</h2>
<p>В реальном проекте build-файл содержит namespace, SDK, версию, зависимости и варианты сборки. Используйте каталог версий для централизации.</p>
</section>

<section id="sec-16" class="study-section">
<h2 class="study-section-title">Рекомендации: подробнее</h2>
<p>Используйте <code>implementation</code> по умолчанию, централизуйте версии, избегайте ненужных зависимостей. Проверяйте совместимость Gradle, AGP и JDK.</p>
</section>

<section id="sec-17" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Gradle — основа сборки Android.</p>
</section>

<section id="sec-18" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>Понимание конфигурации ускоряет разработку.</p>
</section>

<section id="sec-19" class="study-section">
<h2 class="study-section-title">Итоговый совет 3</h2>
<p>Используйте каталог версий.</p>
</section>

<section id="sec-20" class="study-section">
<h2 class="study-section-title">Заметка 3</h2>
<p>Централизация упрощает обновление.</p>
</section>

<section id="sec-21" class="study-section">
<h2 class="study-section-title">Итоговый совет 4</h2>
<p>Избегайте ненужных зависимостей.</p>
</section>

<section id="sec-22" class="study-section">
<h2 class="study-section-title">Заметка 4</h2>
<p>Проверяйте совместимость.</p>
</section>

<section id="sec-23" class="study-section">
<h2 class="study-section-title">Итоговый совет 5</h2>
<p>Используйте build types.</p>
</section>

<section id="sec-24" class="study-section">
<h2 class="study-section-title">Заметка 5</h2>
<p>Build types настраивают debug/release.</p>
</section>

<section id="sec-25" class="study-section">
<h2 class="study-section-title">Итоговый совет 6</h2>
<p>Используйте product flavors.</p>
</section>

<section id="sec-26" class="study-section">
<h2 class="study-section-title">Заметка 6</h2>
<p>Flavors создают варианты приложения.</p>
</section>

<section id="sec-27" class="study-section">
<h2 class="study-section-title">Итоговый совет 7</h2>
<p>Gradle автоматизирует сборку.</p>
</section>

<section id="sec-28" class="study-section">
<h2 class="study-section-title">Заметка 7</h2>
<p>AGP добавляет Android-задачи.</p>
</section>

<section id="sec-29" class="study-section">
<h2 class="study-section-title">Итоговый совет 8</h2>
<p>Wrapper обеспечивает воспроизводимость.</p>
</section>

<section id="sec-30" class="study-section">
<h2 class="study-section-title">Заметка 8</h2>
<p>Gradle использует Kotlin DSL.</p>
</section>

<section id="sec-31" class="study-section">
<h2 class="study-section-title">Итоговый совет 9</h2>
<p>Каталог версий централизует версии.</p>
</section>

<section id="sec-32" class="study-section">
<h2 class="study-section-title">Заметка 9</h2>
<p>Build types настраивают debug/release.</p>
</section>

<section id="sec-33" class="study-section">
<h2 class="study-section-title">Итоговый совет 10</h2>
<p>Product flavors создают варианты.</p>
</section>

<section id="sec-34" class="study-section">
<h2 class="study-section-title">Заметка 10</h2>
<p>Зависимости управляют библиотеками.</p>
</section>

<section id="sec-35" class="study-section">
<h2 class="study-section-title">Итоговый совет 11</h2>
<p>Gradle Wrapper обеспечивает воспроизводимость.</p>
</section>

<section id="sec-36" class="study-section">
<h2 class="study-section-title">Заметка 11</h2>
<p>Используйте implementation по умолчанию.</p>
</section>

<section id="sec-37" class="study-section">
<h2 class="study-section-title">Итоговый совет 12</h2>
<p>Избегайте ненужных зависимостей.</p>
</section>

<section id="sec-38" class="study-section">
<h2 class="study-section-title">Заметка 12</h2>
<p>Проверяйте совместимость версий.</p>
</section>

<section id="sec-39" class="study-section">
<h2 class="study-section-title">Итоговый совет 13</h2>
<p>Gradle — основа сборки Android.</p>
</section>

<section id="sec-40" class="study-section">
<h2 class="study-section-title">Заметка 13</h2>
<p>Понимание конфигурации ускоряет разработку.</p>
</section>

<section id="sec-41" class="study-section">
<h2 class="study-section-title">Итоговый совет 14</h2>
<p>Gradle автоматизирует сборку.</p>
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
