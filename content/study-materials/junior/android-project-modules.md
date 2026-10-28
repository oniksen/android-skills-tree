<header class="study-hero">
<p class="study-eyebrow">Android · Junior</p>
<h1 class="study-title">Проект и модули</h1>
<p class="study-lead">
Android-проект состоит из модулей, исходного кода, ресурсов и конфигурации сборки. На junior-уровне важно понимать структуру директорий, назначение <code>src/main</code>, <code>src/test</code>, <code>src/androidTest</code> и роль build-файлов.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#tree">1. Структура проекта</a>
<a class="study-nav-link" href="#src">2. src-директории</a>
<a class="study-nav-link" href="#modules">3. Модули</a>
<a class="study-nav-link" href="#build">4. Build-файлы</a>
<a class="study-nav-link" href="#sec-1">Сборка APK и AAB</a>
<a class="study-nav-link" href="#sec-2">Модули: подробнее</a>
<a class="study-nav-link" href="#sec-3">Build-файлы: подробнее</a>
<a class="study-nav-link" href="#sec-4">Сборка APK и AAB: подробнее</a>
<a class="study-nav-link" href="#sec-5">Практика и частые ошибки</a>
<a class="study-nav-link" href="#sec-6">Пример из реальной работы</a>
<a class="study-nav-link" href="#sec-7">Итог</a>
<a class="study-nav-link" href="#sec-8">Ресурсы и манифест в модулях</a>
<a class="study-nav-link" href="#sec-9">Тестирование модулей</a>
<a class="study-nav-link" href="#sec-10">Рекомендации</a>
<a class="study-nav-link" href="#sec-11">Итоговый совет</a>
<a class="study-nav-link" href="#sec-12">Заметка</a>
<a class="study-nav-link" href="#sec-13">Пример структуры большого проекта</a>
<a class="study-nav-link" href="#sec-14">Частые ошибки: подробнее</a>
<a class="study-nav-link" href="#sec-15">Итоговый совет</a>
<a class="study-nav-link" href="#sec-16">Итоговый совет 2</a>
<a class="study-nav-link" href="#sec-17">Заметка</a>
<a class="study-nav-link" href="#sec-18">Итоговый совет 2</a>
<a class="study-nav-link" href="#sec-19">Заметка 2</a>
<a class="study-nav-link" href="#check">5. Самопроверка</a>
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
dependencies {
    implementation(project(":core"))
    implementation(project(":feature"))
}
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

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Сборка APK и AAB</h2>
<p>APK — устанавливаемый пакет, AAB — формат публикации для Google Play. Gradle-задачи <code>assemble</code> и <code>bundle</code> формируют эти артефакты. Для публикации обычно используют AAB.</p>

```kotlin
./gradlew assembleDebug
./gradlew assembleRelease
./gradlew bundleRelease
```
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Модули: подробнее</h2>
<p>Модуль — самостоятельная часть проекта со своими исходниками, ресурсами и конфигурацией сборки. Разделение на модули помогает изолировать функциональность, ускорять сборку и переиспользовать код. В типичном проекте есть модуль <code>app</code> (приложение), модули <code>feature-*</code> (экраны и сценарии), модули <code>core-*</code> (сеть, база данных, дизайн-система) и модули <code>library</code> (общие утилиты).</p>

<p>Зависимости между модулями объявляют в <code>build.gradle.kts</code>. <code>implementation(project(":core"))</code> делает модуль доступным внутри текущего модуля, но не транзитивно. <code>api(project(":core"))</code> используется в библиотечных модулях, когда типы зависимости должны быть видны потребителям.</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>:app</code></strong>
Точка входа приложения, собирается в APK/AAB.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>:feature-*</code></strong>
Экраны и пользовательские сценарии.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>:core-*</code></strong>
Сеть, база данных, дизайн-система.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>:library</code></strong>
Общие утилиты без зависимости от Android.
</div>
</div>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Build-файлы: подробнее</h2>
<p>Корневой <code>build.gradle.kts</code> объявляет плагины и общие настройки. <code>settings.gradle.kts</code> определяет состав проекта. В каждом модуле свой <code>build.gradle.kts</code> с SDK, зависимостями и вариантами сборки. Каталог версий <code>libs.versions.toml</code> централизует версии зависимостей и плагинов.</p>

<div class="study-note">
<strong>Запомнить:</strong> централизация версий упрощает обновление и снижает риск несовместимости.
</div>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Сборка APK и AAB: подробнее</h2>
<p>APK — устанавливаемый пакет для устройств. AAB — формат публикации для Google Play, который позволяет генерировать оптимизированные APK для разных устройств. Gradle-задачи <code>assembleDebug</code>, <code>assembleRelease</code> и <code>bundleRelease</code> формируют артефакты в <code>app/build/outputs/</code>.</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Debug APK</strong>
Для разработки и тестирования.
</div>
<div class="study-mini">
<strong class="study-mini-title">Release APK</strong>
Подписанный пакет для распространения.
</div>
<div class="study-mini">
<strong class="study-mini-title">AAB</strong>
Для публикации в Google Play.
</div>
<div class="study-mini">
<strong class="study-mini-title">Где искать</strong>
<code>app/build/outputs/apk/</code> и <code>app/build/outputs/bundle/</code>.
</div>
</div>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>В реальных проектах часто разделяют код на feature-модули и core-модули. Это ускоряет сборку и позволяет переиспользовать код. Частые ошибки: циклические зависимости между модулями, неправильное использование <code>api</code> вместо <code>implementation</code>, смешивание логики в одном модуле.</p>

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> циклическая зависимость: модуль A зависит от B, а B — от A. Gradle не позволит собрать такой проект.
</div>
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Пример из реальной работы</h2>
<p>В e-commerce приложении могут быть модули: <code>:app</code>, <code>:feature-catalog</code>, <code>:feature-cart</code>, <code>:core-network</code>, <code>:core-database</code>, <code>:core-ui</code>. Каждый модуль отвечает за свою часть, что упрощает разработку и тестирование.</p>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>Понимание структуры проекта и модулей — основа работы с Android. Разделяйте код на модули, централизуйте версии и используйте правильные типы зависимостей.</p>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Ресурсы и манифест в модулях</h2>
<p>Каждый модуль может иметь свои ресурсы и манифест. Модуль-библиотека объявляет <code>AndroidManifest.xml</code> с минимальными данными, а модуль приложения — полный манифест с компонентами и разрешениями.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Тестирование модулей</h2>
<p>Модули можно тестировать независимо. Unit-тесты в <code>src/test</code> проверяют логику, инструментальные тесты в <code>src/androidTest</code> — UI и интеграцию. Это ускоряет разработку и упрощает отладку.</p>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>Разделяйте код на модули по функциональности, централизуйте версии, используйте <code>implementation</code> по умолчанию. Избегайте циклических зависимостей.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>Хорошая структура модулей ускоряет сборку и упрощает поддержку.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Модули — основа масштабируемого проекта.</p>
</section>

<section id="sec-13" class="study-section">
<h2 class="study-section-title">Пример структуры большого проекта</h2>
<p>В большом проекте модули могут включать <code>:core-network</code>, <code>:core-database</code>, <code>:core-ui</code>, <code>:feature-auth</code>, <code>:feature-profile</code>. Это ускоряет сборку и упрощает тестирование. Каждый модуль имеет свои тесты и ресурсы.</p>
</section>

<section id="sec-14" class="study-section">
<h2 class="study-section-title">Частые ошибки: подробнее</h2>
<p>Циклические зависимости, неправильное использование <code>api</code>, смешивание логики в одном модуле — всё это усложняет поддержку. Разделяйте ответственность и используйте <code>implementation</code> по умолчанию.</p>
</section>

<section id="sec-15" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>Хорошая модульная структура — основа масштабируемого проекта.</p>
</section>

<section id="sec-16" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Разделяйте код на модули по функциональности.</p>
</section>

<section id="sec-17" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Модули ускоряют сборку и упрощают поддержку.</p>
</section>

<section id="sec-18" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Разделяйте код на модули.</p>
</section>

<section id="sec-19" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>Модули упрощают поддержку.</p>
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
