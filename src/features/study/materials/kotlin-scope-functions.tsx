import StudyCodeBlock from "../components/StudyCodeBlock";

const letScope = `val name: String? = "Kotlin"

name?.let {
    println(it.length)
}`;

const runScope = `val result = "Kotlin".run {
    length * 2
}`;

const withScope = `val builder = StringBuilder()

with(builder) {
    append("Hello")
    append(" ")
    append("Kotlin")
}

println(builder.toString())`;

const applyScope = `val user = User().apply {
    name = "Ada"
    age = 25
}`;

const alsoScope = `val numbers = mutableListOf(1, 2, 3)

val sameList = numbers.also {
    println("Список: $it")
}`;

const comparison = `// let: преобразовать nullable
nullable?.let { ... }

// run: вычислить результат из объекта
obj.run { ... }

// apply: настроить объект
obj.apply { ... }

// also: выполнить побочное действие
obj.also { ... }

// with: сгруппировать вызовы
with(obj) { ... }`;

export default function KotlinScopeFunctionsStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Kotlin · Junior</p>
        <h1 className="study-title">Scope Functions</h1>
        <p className="study-lead">
        Scope functions — <code>let</code>, <code>run</code>, <code>with</code>, <code>apply</code>, <code>also</code> — помогают кратко работать с объектами: настраивать их, выполнять побочные действия или вычислять результат.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#let">let</a>
        <a className="study-nav-link" href="#run">run</a>
        <a className="study-nav-link" href="#with">with</a>
        <a className="study-nav-link" href="#apply">apply</a>
        <a className="study-nav-link" href="#also">also</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="let" className="study-section">
        <h2 className="study-section-title">1. let</h2>
        <p>
          <code>let</code> выполняет блок с объектом как <code>it</code> и возвращает результат блока. Часто используется для nullable-значений.
        </p>
        <StudyCodeBlock code={letScope} />
      </section>

      <section id="run" className="study-section">
        <h2 className="study-section-title">2. run</h2>
        <p>
          <code>run</code> выполняет блок с объектом как <code>this</code> и возвращает результат блока.
        </p>
        <StudyCodeBlock code={runScope} />
      </section>

      <section id="with" className="study-section">
        <h2 className="study-section-title">3. with</h2>
        <p>
          <code>with</code> не является extension function, но позволяет сгруппировать вызовы методов объекта.
        </p>
        <StudyCodeBlock code={withScope} />
      </section>

      <section id="apply" className="study-section">
        <h2 className="study-section-title">4. apply</h2>
        <p>
          <code>apply</code> настраивает объект и возвращает сам объект. Удобно для инициализации.
        </p>
        <StudyCodeBlock code={applyScope} />
      </section>

      <section id="also" className="study-section">
        <h2 className="study-section-title">5. also</h2>
        <p>
          <code>also</code> выполняет побочное действие и возвращает сам объект.
        </p>
        <StudyCodeBlock code={alsoScope} />
      </section>

      <section id="comparison" className="study-section">
        <h2 className="study-section-title">6. Как выбрать функцию</h2>
        <StudyCodeBlock code={comparison} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title"><code>let</code></strong>
            Преобразовать значение или обработать nullable.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>run</code></strong>
            Вычислить результат из объекта.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>apply</code></strong>
            Настроить объект и вернуть его.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>also</code></strong>
            Выполнить побочное действие.
          </div>
        </div>
      </section>

      <section id="check" className="study-section">
        <h2 className="study-section-title">7. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу объяснить разницу между <code>let</code> и <code>run</code>.</label>
          <label><input type="checkbox" /> Понимаю, когда использовать <code>apply</code>.</label>
          <label><input type="checkbox" /> Знаю назначение <code>also</code>.</label>
          <label><input type="checkbox" /> Могу использовать <code>with</code> для группировки вызовов.</label>
          <label><input type="checkbox" /> Понимаю, что возвращает каждая функция.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>Объект как it, результат блока</th><td><code>let</code></td></tr>
            <tr><th>Объект как this, результат блока</th><td><code>run</code></td></tr>
            <tr><th>Группировка вызовов</th><td><code>with(obj) &#123; ... &#125;</code></td></tr>
            <tr><th>Настройка и возврат объекта</th><td><code>apply</code></td></tr>
            <tr><th>Побочное действие</th><td><code>also</code></td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и scope functions.
      </footer>
    </>
  );
}
