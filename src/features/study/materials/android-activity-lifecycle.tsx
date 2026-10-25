import StudyCodeBlock from "../components/StudyCodeBlock";

const lifecycle = `class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
    }

    override fun onStart() { super.onStart() }
    override fun onResume() { super.onResume() }
    override fun onPause() { super.onPause() }
    override fun onStop() { super.onStop() }
    override fun onDestroy() { super.onDestroy() }
}`;

const stateSave = `override fun onSaveInstanceState(outState: Bundle) {
    super.onSaveInstanceState(outState)
    outState.putString("username", username)
}

override fun onRestoreInstanceState(savedInstanceState: Bundle) {
    super.onRestoreInstanceState(savedInstanceState)
    username = savedInstanceState.getString("username")
}`;

const rotation = `// При повороте Activity пересоздаётся.
// ViewModel помогает сохранить данные.`;

export default function AndroidActivityLifecycleStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Android · Junior</p>
        <h1 className="study-title">Activity Lifecycle</h1>
        <p className="study-lead">
        Жизненный цикл Activity описывает, через какие состояния проходит экран при запуске, сворачивании, повороте и закрытии. На junior-уровне важно понимать основные методы и сохранение состояния.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#methods">Методы</a>
        <a className="study-nav-link" href="#flow">Порядок</a>
        <a className="study-nav-link" href="#state">Состояние</a>
        <a className="study-nav-link" href="#rotation">Поворот</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="methods" className="study-section">
        <h2 className="study-section-title">1. Основные методы</h2>
        <p>
          Activity проходит через набор callback-методов. Каждый метод отвечает за определённый этап жизни экрана.
        </p>
        <StudyCodeBlock code={lifecycle} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title"><code>onCreate</code></strong>
            Создание Activity и инициализация.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>onStart</code></strong>
            Экран становится видимым.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>onResume</code></strong>
            Экран активен и принимает ввод.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>onPause</code></strong>
            Экран частично виден.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>onStop</code></strong>
            Экран больше не виден.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>onDestroy</code></strong>
            Activity уничтожается.
          </div>
        </div>
      </section>

      <section id="flow" className="study-section">
        <h2 className="study-section-title">2. Порядок при запуске</h2>
        <div className="study-diagram">
          <div className="study-flow">
            <div className="study-node"><b>onCreate</b></div>
            <div className="study-arrow">→</div>
            <div className="study-node"><b>onStart</b></div>
            <div className="study-arrow">→</div>
            <div className="study-node"><b>onResume</b></div>
          </div>
        </div>
      </section>

      <section id="state" className="study-section">
        <h2 className="study-section-title">3. Сохранение состояния</h2>
        <p>
          При пересоздании Activity можно сохранить небольшое состояние через <code>Bundle</code>.
        </p>
        <StudyCodeBlock code={stateSave} />
        <div className="study-note">
          <strong>Запомнить:</strong> <code>Bundle</code> подходит для небольших данных. Для сложного состояния используют <code>ViewModel</code>.
        </div>
      </section>

      <section id="rotation" className="study-section">
        <h2 className="study-section-title">4. Поворот экрана</h2>
        <p>
          При повороте Activity обычно пересоздаётся. Данные в памяти могут потеряться, если не сохранить их.
        </p>
        <StudyCodeBlock code={rotation} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title"><code>onSaveInstanceState</code></strong>
            Сохраняет небольшое состояние.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>ViewModel</code></strong>
            Хранит данные, переживающие пересоздание.
          </div>
        </div>
      </section>

      <section id="check" className="study-section">
        <h2 className="study-section-title">5. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу назвать основные методы жизненного цикла.</label>
          <label><input type="checkbox" /> Понимаю порядок при запуске Activity.</label>
          <label><input type="checkbox" /> Знаю, как сохранить небольшое состояние.</label>
          <label><input type="checkbox" /> Понимаю, что происходит при повороте экрана.</label>
          <label><input type="checkbox" /> Знаю назначение ViewModel.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>Создание</th><td><code>onCreate</code></td></tr>
            <tr><th>Видимость</th><td><code>onStart</code></td></tr>
            <tr><th>Активность</th><td><code>onResume</code></td></tr>
            <tr><th>Частичная видимость</th><td><code>onPause</code></td></tr>
            <tr><th>Невидимость</th><td><code>onStop</code></td></tr>
            <tr><th>Уничтожение</th><td><code>onDestroy</code></td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на Activity lifecycle.
      </footer>
    </>
  );
}
