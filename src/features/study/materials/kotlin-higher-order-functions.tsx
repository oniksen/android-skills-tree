import StudyCodeBlock from "../components/StudyCodeBlock";

const basicHof = `fun calculate(a: Int, b: Int, operation: (Int, Int) -> Int): Int {
    return operation(a, b)
}

val sum = calculate(2, 3) { x, y -> x + y }
val product = calculate(2, 3) { x, y -> x * y }`;

const functionAsReturn = `fun getOperation(type: String): (Int, Int) -> Int {
    return when (type) {
        "sum" -> { a, b -> a + b }
        "multiply" -> { a, b -> a * b }
        else -> { _, _ -> 0 }
    }
}`;

const inline = `inline fun measureTime(block: () -> Unit) {
    val start = System.currentTimeMillis()
    block()
    println("Время: ${'$'}{System.currentTimeMillis() - start} ms")
}`;

const standardHof = `val numbers = listOf(1, 2, 3, 4)

val even = numbers.filter { it % 2 == 0 }
val doubled = numbers.map { it * 2 }
val total = numbers.reduce { acc, value -> acc + value }`;

export default function KotlinHigherOrderFunctionsStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Kotlin · Junior</p>
        <h1 className="study-title">Higher Order Functions</h1>
        <p className="study-lead">
        Функция высшего порядка — это функция, которая принимает другую функцию как параметр или возвращает функцию. Этот приём лежит в основе коллекций, обработчиков событий и функционального стиля Kotlin.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#basics">Основы</a>
        <a className="study-nav-link" href="#return">Возврат функции</a>
        <a className="study-nav-link" href="#inline">inline</a>
        <a className="study-nav-link" href="#standard">Стандартные HOF</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="basics" className="study-section">
        <h2 className="study-section-title">1. Функция как параметр</h2>
        <p>
          Если параметр имеет функциональный тип, функцию можно передать как значение. Чаще всего для этого используют лямбды.
        </p>
        <StudyCodeBlock code={basicHof} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title">Параметр-функция</strong>
            Описывает поведение, которое можно подставить.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Гибкость</strong>
            Одна функция может работать с разными операциями.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Читаемость</strong>
            Лямбда делает вызов похожим на встроенный синтаксис.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Переиспользование</strong>
            Общая логика выносится в HOF, а детали передаются снаружи.
          </div>
        </div>
      </section>

      <section id="return" className="study-section">
        <h2 className="study-section-title">2. Функция как результат</h2>
        <p>
          Функция может возвращать другую функцию. Это полезно для выбора стратегии поведения.
        </p>
        <StudyCodeBlock code={functionAsReturn} />
      </section>

      <section id="inline" className="study-section">
        <h2 className="study-section-title">3. inline</h2>
        <p>
          Модификатор <code>inline</code> просит компилятор вставить тело функции в место вызова. Это часто используют для HOF, чтобы избежать создания объектов лямбд.
        </p>
        <StudyCodeBlock code={inline} />
        <div className="study-note study-warn">
          <strong>Внимание:</strong> <code>inline</code> не нужен для каждой функции. Его используют там, где важна производительность или есть лямбды.
        </div>
      </section>

      <section id="standard" className="study-section">
        <h2 className="study-section-title">4. Стандартные HOF коллекций</h2>
        <p>
          Коллекции Kotlin содержат множество функций высшего порядка. Они делают обработку данных выразительной.
        </p>
        <StudyCodeBlock code={standardHof} />
        <table className="study-table">
          <thead>
            <tr>
              <th>Функция</th>
              <th>Назначение</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>filter</code></td><td>Оставить подходящие элементы.</td></tr>
            <tr><td><code>map</code></td><td>Преобразовать элементы.</td></tr>
            <tr><td><code>reduce</code></td><td>Свернуть коллекцию в одно значение.</td></tr>
            <tr><td><code>forEach</code></td><td>Выполнить действие для каждого элемента.</td></tr>
          </tbody>
        </table>
      </section>

      <section id="check" className="study-section">
        <h2 className="study-section-title">5. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу объяснить, что такое HOF.</label>
          <label><input type="checkbox" /> Понимаю, как передать функцию как параметр.</label>
          <label><input type="checkbox" /> Знаю, что функция может возвращать функцию.</label>
          <label><input type="checkbox" /> Понимаю назначение <code>inline</code>.</label>
          <label><input type="checkbox" /> Могу назвать стандартные HOF коллекций.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>HOF с параметром-функцией</th><td><code>fun f(op: (Int) -&gt; Int)</code></td></tr>
            <tr><th>Возврат функции</th><td><code>fun f(): (Int) -&gt; Int</code></td></tr>
            <tr><th>inline</th><td><code>inline fun f(block: () -&gt; Unit)</code></td></tr>
            <tr><th>Filter</th><td><code>items.filter &#123; ... &#125;</code></td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и функции высшего порядка.
      </footer>
    </>
  );
}
