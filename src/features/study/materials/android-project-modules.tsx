import StudyCodeBlock from "../components/StudyCodeBlock";

const projectTree = `MyAndroidProject/
├── app/
│   ├── build.gradle.kts
│   └── src/
│       ├── main/
│       ├── test/
│       └── androidTest/
├── gradle/
├── build.gradle.kts
├── settings.gradle.kts
└── gradle.properties`;

const srcDirs = `src/main/kotlin   # исходный код
src/main/res      # ресурсы
src/main/AndroidManifest.xml
src/test          # unit-тесты JVM
src/androidTest   # инструментальные тесты`;

const modules = `// settings.gradle.kts
include(":app", ":core", ":feature")

// app/build.gradle.kts
dependencies {
    implementation(project(":core"))
    implementation(project(":feature"))
}`;

const buildFiles = `// Корневой build.gradle.kts — общие плагины
// app/build.gradle.kts — настройки модуля
// gradle/libs.versions.toml — версии зависимостей`;

export default function AndroidProjectModulesStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Android · Junior</p>
        <h1 className="study-title">Проект и модули</h1>
        <p className="study-lead">
        Android-проект состоит из модулей, исходного кода, ресурсов и конфигурации сборки. На junior-уровне важно понимать структуру директорий, назначение <code>src/main</code>, <code>src/test</code>, <code>src/androidTest</code> и роль build-файлов.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#tree">Структура</a>
        <a className="study-nav-link" href="#src">src-директории</a>
        <a className="study-nav-link" href="#modules">Модули</a>
        <a className="study-nav-link" href="#build">Build-файлы</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="tree" className="study-section">
        <h2 className="study-section-title">1. Структура проекта</h2>
        <p>
          В простом приложении основной модуль называется <code>app</code>. Вокруг него находятся настройки Gradle и wrapper.
        </p>
        <StudyCodeBlock code={projectTree} />
      </section>

      <section id="src" className="study-section">
        <h2 className="study-section-title">2. src-директории</h2>
        <p>
          Исходный код и ресурсы разделяются по типам задач. Это помогает держать проект организованным.
        </p>
        <StudyCodeBlock code={srcDirs} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title"><code>src/main</code></strong>
            Код и ресурсы, которые попадают в приложение.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>src/test</code></strong>
            Локальные JVM-тесты, запускаются без эмулятора.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>src/androidTest</code></strong>
            Инструментальные тесты на устройстве или эмуляторе.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>AndroidManifest.xml</code></strong>
            Объявляет компоненты, разрешения и настройки приложения.
          </div>
        </div>
      </section>

      <section id="modules" className="study-section">
        <h2 className="study-section-title">3. Модули</h2>
        <p>
          Модуль — самостоятельная часть проекта со своими исходниками и конфигурацией сборки. Модули помогают разделять ответственность.
        </p>
        <StudyCodeBlock code={modules} />
        <div className="study-note">
          <strong>Запомнить:</strong> <code>implementation(project(&quot;:core&quot;))</code> подключает другой модуль проекта.
        </div>
      </section>

      <section id="build" className="study-section">
        <h2 className="study-section-title">4. Build-файлы</h2>
        <p>
          Конфигурация сборки разделена по уровням: проект, модуль и каталог версий.
        </p>
        <StudyCodeBlock code={buildFiles} />
        <table className="study-table">
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

      <section id="check" className="study-section">
        <h2 className="study-section-title">5. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу объяснить назначение <code>src/main</code>, <code>src/test</code> и <code>src/androidTest</code>.</label>
          <label><input type="checkbox" /> Понимаю разницу между модулем и проектом.</label>
          <label><input type="checkbox" /> Знаю, где находятся настройки модуля.</label>
          <label><input type="checkbox" /> Могу объяснить роль <code>settings.gradle.kts</code>.</label>
          <label><input type="checkbox" /> Понимаю, зачем разделять код и ресурсы.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>Код приложения</th><td><code>app/src/main/kotlin</code></td></tr>
            <tr><th>Ресурсы</th><td><code>app/src/main/res</code></td></tr>
            <tr><th>Unit-тесты</th><td><code>app/src/test</code></td></tr>
            <tr><th>Инструментальные тесты</th><td><code>app/src/androidTest</code></td></tr>
            <tr><th>Настройки модуля</th><td><code>app/build.gradle.kts</code></td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на структуру Android-проекта.
      </footer>
    </>
  );
}
