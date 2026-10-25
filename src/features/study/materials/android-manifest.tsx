import StudyCodeBlock from "../components/StudyCodeBlock";

const manifestExample = `<manifest xmlns:android="http://schemas.android.com/apk/res/android">
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
</manifest>`;

const sdkVersions = `android {
    defaultConfig {
        minSdk = 24
        targetSdk = 35
    }
}`;

const runtimeCheck = `if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
    // API 33+
}`;

export default function AndroidManifestStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Android · Junior</p>
        <h1 className="study-title">AndroidManifest</h1>
        <p className="study-lead">
        <code>AndroidManifest.xml</code> описывает приложение для системы Android: компоненты, разрешения, intent-фильтры и базовые настройки. На junior-уровне важно понимать структуру манифеста и влияние SDK-версий.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#structure">Структура</a>
        <a className="study-nav-link" href="#components">Компоненты</a>
        <a className="study-nav-link" href="#permissions">Разрешения</a>
        <a className="study-nav-link" href="#sdk">SDK</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="structure" className="study-section">
        <h2 className="study-section-title">1. Базовая структура</h2>
        <p>
          Манифест объявляет приложение и его компоненты. Система Android использует его для запуска и безопасности.
        </p>
        <StudyCodeBlock code={manifestExample} />
      </section>

      <section id="components" className="study-section">
        <h2 className="study-section-title">2. Компоненты приложения</h2>
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title">Activity</strong>
            Экраны приложения.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Service</strong>
            Фоновая работа.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">BroadcastReceiver</strong>
            Реакция на системные события.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">ContentProvider</strong>
            Доступ к данным приложения.
          </div>
        </div>
      </section>

      <section id="permissions" className="study-section">
        <h2 className="study-section-title">3. Разрешения</h2>
        <p>
          Разрешения объявляют доступ к чувствительным возможностям: интернет, камера, местоположение и другие.
        </p>
        <StudyCodeBlock code={manifestExample} />
        <div className="study-note">
          <strong>Запомнить:</strong> опасные разрешения часто требуют запроса во время выполнения, а не только объявления в манифесте.
        </div>
      </section>

      <section id="intent-filters" className="study-section">
        <h2 className="study-section-title">4. Intent-фильтры</h2>
        <p>
          Intent-фильтр показывает системе, какие интенты может обработать компонент. Например, launcher-activity запускается из drawer.
        </p>
        <StudyCodeBlock code={manifestExample} />
      </section>

      <section id="sdk" className="study-section">
        <h2 className="study-section-title">5. SDK-версии</h2>
        <p>
          <code>minSdk</code> задаёт минимальную поддерживаемую версию Android, а <code>targetSdk</code> — версию, под поведение которой адаптировано приложение.
        </p>
        <StudyCodeBlock code={sdkVersions} />
        <StudyCodeBlock code={runtimeCheck} />
        <div className="study-note">
          <strong>Запомнить:</strong> новые API используют через проверку <code>Build.VERSION.SDK_INT</code>.
        </div>
      </section>

      <section id="check" className="study-section">
        <h2 className="study-section-title">6. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу объяснить назначение AndroidManifest.</label>
          <label><input type="checkbox" /> Понимаю разницу между <code>minSdk</code> и <code>targetSdk</code>.</label>
          <label><input type="checkbox" /> Знаю, что такое intent-фильтр.</label>
          <label><input type="checkbox" /> Могу объяснить, как объявляются разрешения.</label>
          <label><input type="checkbox" /> Понимаю, зачем нужна проверка SDK_INT.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>Разрешение</th><td><code>&lt;uses-permission ... /&gt;</code></td></tr>
            <tr><th>Activity</th><td><code>&lt;activity android:name=&quot;.MainActivity&quot; /&gt;</code></td></tr>
            <tr><th>Launcher-фильтр</th><td><code>MAIN + LAUNCHER</code></td></tr>
            <tr><th>Минимальная ОС</th><td><code>minSdk</code></td></tr>
            <tr><th>Целевая ОС</th><td><code>targetSdk</code></td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на AndroidManifest.
      </footer>
    </>
  );
}
