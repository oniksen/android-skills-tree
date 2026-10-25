import StudyCodeBlock from "../components/StudyCodeBlock";

const basicFunction = `fun greet(name: String) {
    println("Привет, $name")
}

fun main() {
    greet("Ada")
}`;

const returnValue = `fun sum(a: Int, b: Int): Int {
    return a + b
}

val result = sum(2, 3)`;

const expressionBody = `fun double(x: Int): Int = x * 2

fun isEven(x: Int): Boolean = x % 2 == 0`;

const defaultArgs = `fun createUser(name: String, isAdmin: Boolean = false) {
    println("$name, admin=$isAdmin")
}

createUser("Ada")
createUser("Grace", true)`;

const namedArgs = `fun connect(host: String, port: Int, useTls: Boolean) { ... }

connect(
    host = "example.com",
    port = 443,
    useTls = true,
)`;

const unit = `fun printMessage(text: String): Unit {
    println(text)
}

fun log(text: String) {
    println(text)
}`;

export default function KotlinFunctionsStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Kotlin · Junior</p>
        <h1 className="study-title">Функции</h1>
        <p className="study-lead">
          Функция — именованный блок кода, который выполняет задачу. Функции помогают переиспользовать код, делать его читаемым и тестировать отдельные части программы. В Kotlin функции объявляют через <code>fun</code>.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#basics">Основы</a>
        <a className="study-nav-link" href="#return">Возврат</a>
        <a className="study-nav-link" href="#args">Аргументы</a>
        <a className="study-nav-link" href="#expression">Expression body</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="basics" className="study-section">
        <h2 className="study-section-title">1. Объявление и вызов</h2>
        <p>
          Функция имеет имя, параметры и тело. Параметры описывают входные данные, а тело содержит действия.
        </p>
        <StudyCodeBlock code={basicFunction} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title">Имя</strong>
            Должно описывать действие: <code>greet</code>, <code>calculateTotal</code>.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Параметры</strong>
            Входные значения с типами: <code>name: String</code>.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Тело</strong>
            Блок кода в фигурных скобках.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Вызов</strong>
            Имя функции и аргументы в скобках: <code>greet(&quot;Ada&quot;)</code>.
          </div>
        </div>
      </section>

      <section id="return" className="study-section">
        <h2 className="study-section-title">2. Возвращаемое значение</h2>
        <p>
          Функция может вернуть результат. Тип результата указывают после параметров через двоеточие.
        </p>
        <StudyCodeBlock code={returnValue} />
        <StudyCodeBlock code={unit} />
        <div className="study-note">
          <strong>Запомнить:</strong> если функция ничего не возвращает, её тип результата <code>Unit</code>. Компилятор часто позволяет не писать <code>: Unit</code> явно.
        </div>
      </section>

      <section id="expression" className="study-section">
        <h2 className="study-section-title">3. Expression body</h2>
        <p>
          Если функция состоит из одного выражения, можно записать её короче с помощью <code>=</code>.
        </p>
        <StudyCodeBlock code={expressionBody} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title">Когда использовать</strong>
            Простые вычисления, проверки, преобразования.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Когда не использовать</strong>
            Если логика сложная и требует нескольких шагов.
          </div>
        </div>
      </section>

      <section id="args" className="study-section">
        <h2 className="study-section-title">4. Аргументы</h2>
        <p>
          Параметры могут иметь значения по умолчанию. Также можно вызывать функцию с именованными аргументами, чтобы код был понятнее.
        </p>
        <StudyCodeBlock code={defaultArgs} />
        <StudyCodeBlock code={namedArgs} />
        <div className="study-note study-warn">
          <strong>Частая ошибка:</strong> перепутать порядок аргументов. Именованные аргументы помогают этого избежать.
        </div>
      </section>

      <section id="principles" className="study-section">
        <h2 className="study-section-title">5. Как писать хорошие функции</h2>
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title">Одна задача</strong>
            Функция должна делать одно понятное действие.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Понятные имена</strong>
            Имя должно объяснять результат или действие.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Маленький размер</strong>
            Сложную логику лучше разбить на несколько функций.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Тестируемость</strong>
            Функции с явными входами и выходами проще проверять.
          </div>
        </div>
      </section>

      <section id="check" className="study-section">
        <h2 className="study-section-title">6. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу объявить функцию с параметрами и результатом.</label>
          <label><input type="checkbox" /> Понимаю разницу между <code>return</code> и expression body.</label>
          <label><input type="checkbox" /> Знаю, как задать значение аргумента по умолчанию.</label>
          <label><input type="checkbox" /> Могу вызвать функцию с именованными аргументами.</label>
          <label><input type="checkbox" /> Понимаю, зачем разбивать код на функции.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>Объявить функцию</th><td><code>fun name(param: Type): ResultType</code></td></tr>
            <tr><th>Вернуть значение</th><td><code>return value</code></td></tr>
            <tr><th>Короткая функция</th><td><code>fun double(x: Int): Int = x * 2</code></td></tr>
            <tr><th>Аргумент по умолчанию</th><td><code>fun f(x: Int = 0)</code></td></tr>
            <tr><th>Именованный аргумент</th><td><code>f(x = 10)</code></td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и базовые функции.
      </footer>
    </>
  );
}
