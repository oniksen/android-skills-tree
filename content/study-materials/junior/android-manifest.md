<header class="study-hero">
<p class="study-eyebrow">Android · Junior</p>
<h1 class="study-title">AndroidManifest</h1>
<p class="study-lead">
<code>AndroidManifest.xml</code> описывает приложение для системы Android: компоненты, разрешения, intent-фильтры и базовые настройки. На junior-уровне важно понимать структуру манифеста и влияние SDK-версий.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#structure">Структура</a>
<a class="study-nav-link" href="#components">Компоненты</a>
<a class="study-nav-link" href="#permissions">Разрешения</a>
<a class="study-nav-link" href="#sdk">SDK</a>
<a class="study-nav-link" href="#check">Проверка</a>
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

<section class="study-section">
<h2 class="study-section-title">App-level и System-level</h2>
<p>Манифест описывает свойства конкретного приложения: компоненты, разрешения, идентификатор пакета. System-level настройки (например, политики устройства или системные разрешения) задаются на уровне ОС или MDM и не объявляются в манифесте приложения.</p>
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
