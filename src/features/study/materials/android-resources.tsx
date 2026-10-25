import StudyCodeBlock from "../components/StudyCodeBlock";

const resourcesTree = `res/
├── drawable/
├── mipmap/
├── layout/
├── values/
├── values-ru/
├── values-night/
└── xml/`;

const strings = `<resources>
    <string name="app_name">Skill Tree</string>
    <string name="welcome">Добро пожаловать</string>
</resources>`;

const qualifiers = `res/
├── values/strings.xml
├── values-ru/strings.xml
├── values-night/themes.xml
├── layout/
└── layout-land/`;

const access = `val title = getString(R.string.welcome)
val color = getColor(R.color.primary)`;

export default function AndroidResourcesStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Android · Junior</p>
        <h1 className="study-title">Resources</h1>
        <p className="study-lead">
        Ресурсы Android хранят строки, цвета, размеры, изображения, темы и разметку отдельно от кода. На junior-уровне важно понимать структуру <code>res/</code>, идентификаторы <code>R</code> и qualifiers.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#folders">Папки</a>
        <a className="study-nav-link" href="#strings">Строки</a>
        <a className="study-nav-link" href="#qualifiers">Qualifiers</a>
        <a className="study-nav-link" href="#access">Доступ</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="folders" className="study-section">
        <h2 className="study-section-title">1. Основные папки res</h2>
        <p>
          Каждая папка предназначена для определённого типа ресурсов.
        </p>
        <StudyCodeBlock code={resourcesTree} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title"><code>drawable/</code></strong>
            Изображения и drawable XML.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>mipmap/</code></strong>
            Иконки приложения.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>layout/</code></strong>
            XML-разметка экранов.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>values/</code></strong>
            Строки, цвета, размеры, стили, темы.
          </div>
        </div>
      </section>

      <section id="strings" className="study-section">
        <h2 className="study-section-title">2. Строки</h2>
        <p>
          Строки хранят в <code>strings.xml</code> и используют через <code>R.string</code>. Это упрощает локализацию.
        </p>
        <StudyCodeBlock code={strings} />
      </section>

      <section id="qualifiers" className="study-section">
        <h2 className="study-section-title">3. Qualifiers</h2>
        <p>
          Суффикс папки указывает, для какой конфигурации подходит ресурс. Android выбирает наиболее подходящий вариант.
        </p>
        <StudyCodeBlock code={qualifiers} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title"><code>values-ru</code></strong>
            Русская локализация.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>values-night</code></strong>
            Тёмная тема.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>layout-land</code></strong>
            Альбомная ориентация.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>values-sw600dp</code></strong>
            Устройства с большой шириной.
          </div>
        </div>
      </section>

      <section id="access" className="study-section">
        <h2 className="study-section-title">4. Доступ из кода</h2>
        <p>
          Ресурсы получают идентификаторы в классе <code>R</code>. Код обращается к одному ID, а Android подставляет подходящий вариант.
        </p>
        <StudyCodeBlock code={access} />
        <div className="study-note">
          <strong>Запомнить:</strong> <code>res/</code> — типизированные ресурсы с ID. <code>assets/</code> — файлы, к которым обращаются по пути.
        </div>
      </section>

      <section id="check" className="study-section">
        <h2 className="study-section-title">5. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу назвать основные папки <code>res/</code>.</label>
          <label><input type="checkbox" /> Понимаю, как работает qualifier.</label>
          <label><input type="checkbox" /> Знаю разницу между <code>res/</code> и <code>assets/</code>.</label>
          <label><input type="checkbox" /> Могу получить строку через <code>R.string</code>.</label>
          <label><input type="checkbox" /> Понимаю, как Android выбирает ресурс.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>Строки</th><td><code>res/values/strings.xml</code></td></tr>
            <tr><th>Изображения</th><td><code>res/drawable/</code></td></tr>
            <tr><th>Иконки</th><td><code>res/mipmap/</code></td></tr>
            <tr><th>Разметка</th><td><code>res/layout/</code></td></tr>
            <tr><th>Локализация</th><td><code>values-ru</code></td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на ресурсы Android.
      </footer>
    </>
  );
}
