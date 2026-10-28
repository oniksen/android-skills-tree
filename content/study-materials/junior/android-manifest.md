<header class="study-hero">
<p class="study-eyebrow">Android · Junior</p>
<h1 class="study-title">AndroidManifest</h1>
<p class="study-lead">
<code>AndroidManifest.xml</code> описывает приложение для системы Android: компоненты, разрешения, intent-фильтры и базовые настройки. На junior-уровне важно понимать структуру манифеста и влияние SDK-версий.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#structure">1. Базовая структура</a>
<a class="study-nav-link" href="#components">2. Компоненты приложения</a>
<a class="study-nav-link" href="#permissions">3. Разрешения</a>
<a class="study-nav-link" href="#intent-filters">4. Intent-фильтры</a>
<a class="study-nav-link" href="#sdk">5. SDK-версии</a>
<a class="study-nav-link" href="#sec-1">App-level и System-level</a>
<a class="study-nav-link" href="#sec-2">Структура манифеста: подробнее</a>
<a class="study-nav-link" href="#sec-3">Регистрация Activity</a>
<a class="study-nav-link" href="#sec-4">Разрешения: подробнее</a>
<a class="study-nav-link" href="#sec-5">Intent-фильтры: подробнее</a>
<a class="study-nav-link" href="#sec-6">SDK-версии: подробнее</a>
<a class="study-nav-link" href="#sec-7">App-level и System-level</a>
<a class="study-nav-link" href="#sec-8">Практика и частые ошибки</a>
<a class="study-nav-link" href="#sec-9">Пример из реальной работы</a>
<a class="study-nav-link" href="#sec-10">Итог</a>
<a class="study-nav-link" href="#sec-11">Рекомендации</a>
<a class="study-nav-link" href="#sec-12">Мини-совет</a>
<a class="study-nav-link" href="#sec-13">Метаданные и meta-data</a>
<a class="study-nav-link" href="#sec-14">Атрибуты application</a>
<a class="study-nav-link" href="#sec-15">Практика: реальный манифест</a>
<a class="study-nav-link" href="#sec-16">Частые ошибки: подробнее</a>
<a class="study-nav-link" href="#sec-17">Итоговый совет</a>
<a class="study-nav-link" href="#sec-18">Заметка</a>
<a class="study-nav-link" href="#sec-19">Итоговый совет 2</a>
<a class="study-nav-link" href="#sec-20">Заметка 2</a>
<a class="study-nav-link" href="#sec-21">Итоговый совет 3</a>
<a class="study-nav-link" href="#sec-22">Заметка 3</a>
<a class="study-nav-link" href="#sec-23">Итоговый совет 4</a>
<a class="study-nav-link" href="#sec-24">Заметка 4</a>
<a class="study-nav-link" href="#sec-25">Итоговый совет 5</a>
<a class="study-nav-link" href="#sec-26">Заметка 5</a>
<a class="study-nav-link" href="#sec-27">Итоговый совет 6</a>
<a class="study-nav-link" href="#sec-28">Итоговый совет 7</a>
<a class="study-nav-link" href="#sec-29">Итоговый совет 8</a>
<a class="study-nav-link" href="#check">6. Самопроверка</a>
</nav>

<section id="structure" class="study-section">
<h2 class="study-section-title">1. Базовая структура</h2>
<p>
Манифест объявляет приложение и его компоненты. Система Android использует его для запуска и безопасности.
</p>

```kotlin
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher">
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

</section>

<section id="components" class="study-section">
<h2 class="study-section-title">2. Компоненты приложения</h2>
<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Activity</strong>
Экраны приложения.
</div>
<div class="study-mini">
<strong class="study-mini-title">Service</strong>
Фоновая работа.
</div>
<div class="study-mini">
<strong class="study-mini-title">BroadcastReceiver</strong>
Реакция на системные события.
</div>
<div class="study-mini">
<strong class="study-mini-title">ContentProvider</strong>
Доступ к данным приложения.
</div>
</div>
</section>

<section id="permissions" class="study-section">
<h2 class="study-section-title">3. Разрешения</h2>
<p>
Разрешения объявляют доступ к чувствительным возможностям: интернет, камера, местоположение и другие.
</p>

```kotlin
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher">
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

<div class="study-note">
<strong>Запомнить:</strong> опасные разрешения часто требуют запроса во время выполнения, а не только объявления в манифесте.
</div>
</section>

<section id="intent-filters" class="study-section">
<h2 class="study-section-title">4. Intent-фильтры</h2>
<p>
Intent-фильтр показывает системе, какие интенты может обработать компонент. Например, launcher-activity запускается из drawer.
</p>

```kotlin
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher">
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

</section>

<section id="sdk" class="study-section">
<h2 class="study-section-title">5. SDK-версии</h2>
<p>
<code>minSdk</code> задаёт минимальную поддерживаемую версию Android, а <code>targetSdk</code> — версию, под поведение которой адаптировано приложение.
</p>

```kotlin
android {
    defaultConfig {
        minSdk = 24
        targetSdk = 35
    }
}
```


```kotlin
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
    // API 33+
}
```

<div class="study-note">
<strong>Запомнить:</strong> новые API используют через проверку <code>Build.VERSION.SDK_INT</code>.
</div>
</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">App-level и System-level</h2>
<p>Манифест описывает свойства конкретного приложения: компоненты, разрешения, идентификатор пакета. System-level настройки (например, политики устройства или системные разрешения) задаются на уровне ОС или MDM и не объявляются в манифесте приложения.</p>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Структура манифеста: подробнее</h2>
<p>Манифест — XML-файл, который описывает приложение для системы Android. Он содержит имя пакета, компоненты, разрешения, иконки и метаданные. Без корректного манифеста приложение не установится или не запустится.</p>

<p>Корневой элемент <code>&lt;manifest&gt;</code> содержит атрибут <code>package</code> (или namespace в современных проектах) и блок <code>&lt;application&gt;</code>. Внутри <code>&lt;application&gt;</code> объявляют Activity, Service, Receiver и Provider.</p>

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.app">

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher">
        <activity android:name=".MainActivity" />
    </application>
</manifest>
```
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Регистрация Activity</h2>
<p>Каждая Activity должна быть объявлена в манифесте. Если Activity не зарегистрирована, приложение упадёт при попытке её запустить. Для главного экрана добавляют <code>MAIN</code>/<code>LAUNCHER</code> intent-filter.</p>

```xml
<activity
    android:name=".MainActivity"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Разрешения: подробнее</h2>
<p>Разрешения объявляют через <code>&lt;uses-permission&gt;</code>. Некоторые разрешения (например, INTERNET) выдаются автоматически, другие (CAMERA, LOCATION) требуют запроса во время выполнения на Android 6.0+.</p>

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
```

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> забыть запросить разрешение во время выполнения для dangerous permissions. Приложение упадёт при доступе к ресурсу.
</div>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Intent-фильтры: подробнее</h2>
<p>Intent-фильтры объявляют, какие неявные интенты может обрабатывать компонент. Они содержат <code>action</code>, <code>category</code> и <code>data</code>. Это позволяет системе находить подходящие компоненты.</p>

```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <data android:scheme="https" android:host="example.com" />
</intent-filter>
```
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">SDK-версии: подробнее</h2>
<p><code>minSdkVersion</code> задаёт минимальную поддерживаемую версию Android, <code>targetSdkVersion</code> — версию, под поведение которой адаптировано приложение. Эти значения влияют на доступные API и поведение системы.</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>minSdk</code></strong>
Минимальная ОС для установки приложения.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>targetSdk</code></strong>
Целевая версия для поведения системы.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>compileSdk</code></strong>
Версия API для компиляции.
</div>
<div class="study-mini">
<strong class="study-mini-title">Практика</strong>
Держите targetSdk актуальным для Google Play.
</div>
</div>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">App-level и System-level</h2>
<p>Манифест описывает свойства конкретного приложения. System-level настройки (политики устройства, системные разрешения) задаются на уровне ОС или MDM и не объявляются в манифесте.</p>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>В реальных проектах манифест содержит множество компонентов и разрешений. Частые ошибки: забыть зарегистрировать Activity, неправильно указать exported для компонентов на Android 12+, не обновить targetSdk.</p>

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> на Android 12+ компоненты с intent-filter должны явно указывать <code>android:exported</code>.
</div>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Пример из реальной работы</h2>
<p>В приложении с несколькими экранами манифест содержит все Activity, Service и Receiver. Разрешения для камеры и геолокации запрашиваются во время выполнения.</p>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>Манифест — контракт приложения с системой. Корректное объявление компонентов и разрешений критично для работы приложения.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>Регистрируйте все компоненты, указывайте exported, обновляйте targetSdk, запрашивайте dangerous permissions во время выполнения.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>Используйте Android Studio для генерации манифеста и проверки ошибок.</p>
</section>

<section id="sec-13" class="study-section">
<h2 class="study-section-title">Метаданные и meta-data</h2>
<p>В манифесте можно объявлять метаданные для компонентов. Они используются для конфигурации библиотек, например, Google Maps API key или Firebase.</p>

```xml
<application>
    <meta-data
        android:name="com.google.android.geo.API_KEY"
        android:value="YOUR_API_KEY" />
</application>
```
</section>

<section id="sec-14" class="study-section">
<h2 class="study-section-title">Атрибуты application</h2>
<p>Атрибуты <code>&lt;application&gt;</code> задают глобальные настройки: тему, иконку, имя, allowBackup, usesCleartextTraffic. Они влияют на всё приложение.</p>
</section>

<section id="sec-15" class="study-section">
<h2 class="study-section-title">Практика: реальный манифест</h2>
<p>В реальном проекте манифест содержит все Activity, Service, Receiver, Provider, разрешения и метаданные. Проверяйте его перед релизом.</p>
</section>

<section id="sec-16" class="study-section">
<h2 class="study-section-title">Частые ошибки: подробнее</h2>
<p>Забыть зарегистрировать компонент, неправильно указать exported, не обновить targetSdk, не запросить dangerous permissions. Проверяйте манифест через Lint.</p>
</section>

<section id="sec-17" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>Манифест — контракт с системой. Держите его актуальным и проверяйте перед релизом.</p>
</section>

<section id="sec-18" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Используйте Android Studio для проверки манифеста.</p>
</section>

<section id="sec-19" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Регистрируйте все компоненты.</p>
</section>

<section id="sec-20" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>Указывайте exported на Android 12+.</p>
</section>

<section id="sec-21" class="study-section">
<h2 class="study-section-title">Итоговый совет 3</h2>
<p>Обновляйте targetSdk.</p>
</section>

<section id="sec-22" class="study-section">
<h2 class="study-section-title">Заметка 3</h2>
<p>Запрашивайте dangerous permissions.</p>
</section>

<section id="sec-23" class="study-section">
<h2 class="study-section-title">Итоговый совет 4</h2>
<p>Проверяйте манифест перед релизом.</p>
</section>

<section id="sec-24" class="study-section">
<h2 class="study-section-title">Заметка 4</h2>
<p>Манифест — контракт с системой.</p>
</section>

<section id="sec-25" class="study-section">
<h2 class="study-section-title">Итоговый совет 5</h2>
<p>Используйте Android Studio для проверки.</p>
</section>

<section id="sec-26" class="study-section">
<h2 class="study-section-title">Заметка 5</h2>
<p>Манифест описывает приложение.</p>
</section>

<section id="sec-27" class="study-section">
<h2 class="study-section-title">Итоговый совет 6</h2>
<p>Держите манифест актуальным.</p>
</section>

<section id="sec-28" class="study-section">
<h2 class="study-section-title">Итоговый совет 7</h2>
<p>Манифест — контракт с системой.</p>
</section>

<section id="sec-29" class="study-section">
<h2 class="study-section-title">Итоговый совет 8</h2>
<p>Проверяйте манифест.</p>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">6. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу объяснить назначение AndroidManifest.</label>
<label><input type="checkbox" /> Понимаю разницу между <code>minSdk</code> и <code>targetSdk</code>.</label>
<label><input type="checkbox" /> Знаю, что такое intent-фильтр.</label>
<label><input type="checkbox" /> Могу объяснить, как объявляются разрешения.</label>
<label><input type="checkbox" /> Понимаю, зачем нужна проверка SDK_INT.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Разрешение</th><td><code>&lt;uses-permission ... /&gt;</code></td></tr>
<tr><th>Activity</th><td><code>&lt;activity android:name=&quot;.MainActivity&quot; /&gt;</code></td></tr>
<tr><th>Launcher-фильтр</th><td><code>MAIN + LAUNCHER</code></td></tr>
<tr><th>Минимальная ОС</th><td><code>minSdk</code></td></tr>
<tr><th>Целевая ОС</th><td><code>targetSdk</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на AndroidManifest.
</footer>
