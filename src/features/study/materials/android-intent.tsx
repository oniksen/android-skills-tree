import StudyCodeBlock from "../components/StudyCodeBlock";

const explicitIntent = `val intent = Intent(this, DetailActivity::class.java)
intent.putExtra("userId", 42)
startActivity(intent)`;

const implicitIntent = `val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://example.com"))
startActivity(intent)`;

const bundle = `val bundle = Bundle().apply {
    putString("name", "Ada")
    putInt("age", 25)
}

intent.putExtras(bundle)`;

const resultApi = `val launcher = registerForActivityResult(
    ActivityResultContracts.StartActivityForResult()
) { result ->
    if (result.resultCode == RESULT_OK) {
        val data = result.data?.getStringExtra("result")
    }
}

launcher.launch(intent)`;

export default function AndroidIntentStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Android · Junior</p>
        <h1 className="study-title">Intent</h1>
        <p className="study-lead">
        Intent — механизм взаимодействия компонентов Android. С его помощью запускают Activity, передают данные и обращаются к системным возможностям. На junior-уровне важно понимать явные и неявные интенты.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#explicit">Явный Intent</a>
        <a className="study-nav-link" href="#implicit">Неявный Intent</a>
        <a className="study-nav-link" href="#data">Передача данных</a>
        <a className="study-nav-link" href="#result">Результат</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="explicit" className="study-section">
        <h2 className="study-section-title">1. Явный Intent</h2>
        <p>
          Явный интент указывает конкретный класс Activity, который нужно запустить.
        </p>
        <StudyCodeBlock code={explicitIntent} />
      </section>

      <section id="implicit" className="study-section">
        <h2 className="study-section-title">2. Неявный Intent</h2>
        <p>
          Неявный интент описывает действие, а система находит подходящее приложение или компонент.
        </p>
        <StudyCodeBlock code={implicitIntent} />
        <div className="study-note">
          <strong>Запомнить:</strong> неявные интенты часто используют для открытия ссылок, отправки писем, выбора изображений.
        </div>
      </section>

      <section id="data" className="study-section">
        <h2 className="study-section-title">3. Передача данных</h2>
        <p>
          Данные передают через extras или <code>Bundle</code>.
        </p>
        <StudyCodeBlock code={bundle} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title"><code>putExtra</code></strong>
            Добавляет простое значение.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>Bundle</code></strong>
            Группирует несколько значений.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>getExtra</code></strong>
            Читает значение в принимающей Activity.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>getStringExtra</code></strong>
            Читает строку по ключу.
          </div>
        </div>
      </section>

      <section id="result" className="study-section">
        <h2 className="study-section-title">4. Получение результата</h2>
        <p>
          Для получения результата от другой Activity используют <code>ActivityResultContracts</code>.
        </p>
        <StudyCodeBlock code={resultApi} />
      </section>

      <section id="check" className="study-section">
        <h2 className="study-section-title">5. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу объяснить разницу между явным и неявным Intent.</label>
          <label><input type="checkbox" /> Понимаю, как передать данные через extras.</label>
          <label><input type="checkbox" /> Знаю, зачем нужен Bundle.</label>
          <label><input type="checkbox" /> Могу запустить Activity через Intent.</label>
          <label><input type="checkbox" /> Понимаю, как получить результат запуска.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>Явный Intent</th><td><code>Intent(context, TargetActivity::class.java)</code></td></tr>
            <tr><th>Неявный Intent</th><td><code>Intent(Intent.ACTION_VIEW, uri)</code></td></tr>
            <tr><th>Добавить данные</th><td><code>intent.putExtra(&quot;key&quot;, value)</code></td></tr>
            <tr><th>Запустить</th><td><code>startActivity(intent)</code></td></tr>
            <tr><th>Получить результат</th><td><code>ActivityResultContracts</code></td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на Intent в Android.
      </footer>
    </>
  );
}
