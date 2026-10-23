import StudyCodeBlock from "../components/StudyCodeBlock";

const gradleFiles = `settings.gradle.kts        # состав проекта
build.gradle.kts          # корневой: плагины и общие настройки
app/build.gradle.kts      # настройки модуля
gradle/libs.versions.toml # каталог версий`;

const moduleConfig = `plugins {
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
}`;

const dependencies = `dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation(project(":core"))
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
}`;

const dependencyTypes = `implementation("lib")        // нужна текущему модулю
api("lib")                 // нужна и потребителям библиотеки
testImplementation("lib")  // только для unit-тестов
androidTestImplementation("lib") // только для инструментальных тестов`;

const tasks = `./gradlew assembleDebug
./gradlew testDebugUnitTest
./gradlew connectedDebugAndroidTest
./gradlew tasks`;

export default function AndroidGradleStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Android · Junior</p>
        <h1 className="study-title">Gradle</h1>
        <p className="study-lead">
        Gradle — система сборки Android-проекта. Она разрешает зависимости, компилирует код, обрабатывает ресурсы и создаёт APK/AAB. На junior-уровне важно понимать build-файлы, зависимости и базовые задачи.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#files">Файлы</a>
        <a className="study-nav-link" href="#config">Конфигурация</a>
        <a className="study-nav-link" href="#deps">Зависимости</a>
        <a className="study-nav-link" href="#tasks">Задачи</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="files" className="study-section">
        <h2 className="study-section-title">1. Основные файлы</h2>
        <p>
          Конфигурация сборки разделена по уровням: проект, модуль и каталог версий.
        </p>
        <StudyCodeBlock code={gradleFiles} />
        <table className="study-table">
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

      <section id="config" className="study-section">
        <h2 className="study-section-title">2. Конфигурация модуля</h2>
        <p>
          В <code>app/build.gradle.kts</code> задают namespace, SDK, версию приложения и плагины.
        </p>
        <StudyCodeBlock code={moduleConfig} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title"><code>namespace</code></strong>
            Пакет для сгенерированного кода, включая <code>R</code>.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>compileSdk</code></strong>
            API, против которого компилируется код.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>minSdk</code></strong>
            Минимальная поддерживаемая версия Android.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>targetSdk</code></strong>
            Версия, под поведение которой адаптировано приложение.
          </div>
        </div>
      </section>

      <section id="deps" className="study-section">
        <h2 className="study-section-title">3. Зависимости</h2>
        <p>
          Зависимости подключают библиотеки и другие модули проекта. Конфигурация определяет, где зависимость доступна.
        </p>
        <StudyCodeBlock code={dependencies} />
        <StudyCodeBlock code={dependencyTypes} />
        <div className="study-note">
          <strong>Запомнить:</strong> <code>implementation</code> — обычный выбор. <code>api</code> используют в библиотечных модулях, когда типы зависимости должны быть видны потребителям.
        </div>
      </section>

      <section id="tasks" className="study-section">
        <h2 className="study-section-title">4. Gradle-задачи</h2>
        <p>
          Через Gradle Wrapper запускают сборку, тесты и другие задачи.
        </p>
        <StudyCodeBlock code={tasks} />
        <table className="study-table">
          <tbody>
            <tr><th>Debug APK</th><td><code>./gradlew assembleDebug</code></td></tr>
            <tr><th>Unit-тесты</th><td><code>./gradlew testDebugUnitTest</code></td></tr>
            <tr><th>Инструментальные тесты</th><td><code>./gradlew connectedDebugAndroidTest</code></td></tr>
            <tr><th>Список задач</th><td><code>./gradlew tasks</code></td></tr>
          </tbody>
        </table>
      </section>

      <section id="check" className="study-section">
        <h2 className="study-section-title">5. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу найти <code>app/build.gradle.kts</code>.</label>
          <label><input type="checkbox" /> Понимаю разницу между <code>implementation</code> и <code>api</code>.</label>
          <label><input type="checkbox" /> Знаю, где задаются <code>minSdk</code> и <code>targetSdk</code>.</label>
          <label><input type="checkbox" /> Могу запустить debug-сборку через Wrapper.</label>
          <label><input type="checkbox" /> Понимаю роль <code>gradle/libs.versions.toml</code>.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>Собрать debug APK</th><td><code>./gradlew assembleDebug</code></td></tr>
            <tr><th>Запустить unit-тесты</th><td><code>./gradlew testDebugUnitTest</code></td></tr>
            <tr><th>Зависимость модуля</th><td><code>implementation(project(&quot;:core&quot;))</code></td></tr>
            <tr><th>Тестовая зависимость</th><td><code>testImplementation(...)</code></td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на Gradle Kotlin DSL.
      </footer>
    </>
  );
}
