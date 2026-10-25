import StudyCodeBlock from "../components/StudyCodeBlock";

const basicLambda = `val numbers = listOf(1, 2, 3)

numbers.forEach { number ->
    println(number)
}`;

const trailingLambda = `fun perform(action: () -> Unit) {
    println("До действия")
    action()
    println("После действия")
}

perform {
    println("Выполняем действие")
}`;

const itParameter = `val names = listOf("Ada", "Grace")

names.forEach {
    println(it.uppercase())
}`;

const lambdaType = `val sum: (Int, Int) -> Int = { a, b -> a + b }

val result = sum(2, 3)`;

const closure = `fun makeCounter(): () -> Int {
    var count = 0
    return { count++ }
}

val counter = makeCounter()
println(counter()) // 0
println(counter()) // 1`;

export default function KotlinLambdaStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Kotlin · Junior</p>
        <h1 className="study-title">Lambda</h1>
        <p className="study-lead">
        Лямбда — анонимная функция, которую можно передавать как значение. В Kotlin лямбды часто используют в коллекциях, обработчиках и функциях высшего порядка.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#basics">Основы</a>
        <a className="study-nav-link" href="#trailing">Trailing lambda</a>
        <a className="study-nav-link" href="#it">Параметр it</a>
        <a className="study-nav-link" href="#types">Типы</a>
        <a className="study-nav-link" href="#closure">Замыкание</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="basics" className="study-section">
        <h2 className="study-section-title">1. Что такое лямбда</h2>
        <p>
          Лямбда записывается в фигурных скобках. Слева от <code>-&gt;</code> параметры, справа — тело.
        </p>
        <StudyCodeBlock code={basicLambda} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title">Параметры</strong>
            Входные значения лямбды.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Тело</strong>
            Последнее выражение возвращается как результат.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Передача</strong>
            Лямбду можно передать в функцию.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Короткая форма</strong>
            Если один параметр, можно использовать <code>it</code>.
          </div>
        </div>
      </section>

      <section id="trailing" className="study-section">
        <h2 className="study-section-title">2. Trailing lambda</h2>
        <p>
          Если последний параметр функции — лямбда, её можно вынести за скобки вызова. Это делает код похожим на встроенный синтаксис языка.
        </p>
        <StudyCodeBlock code={trailingLambda} />
      </section>

      <section id="it" className="study-section">
        <h2 className="study-section-title">3. Параметр it</h2>
        <p>
          Если у лямбды один параметр, Kotlin позволяет не называть его явно. Тогда параметр называется <code>it</code>.
        </p>
        <StudyCodeBlock code={itParameter} />
        <div className="study-note study-warn">
          <strong>Совет:</strong> используй <code>it</code> только в коротких лямбдах. Если логика сложная, лучше назвать параметр явно.
        </div>
      </section>

      <section id="types" className="study-section">
        <h2 className="study-section-title">4. Тип лямбды</h2>
        <p>
          Тип лямбды записывается как <code>(Параметры) -&gt; Результат</code>. Это позволяет передавать функции как значения.
        </p>
        <StudyCodeBlock code={lambdaType} />
      </section>

      <section id="closure" className="study-section">
        <h2 className="study-section-title">5. Замыкание</h2>
        <p>
          Лямбда может захватывать переменные из внешней области видимости. Такое замыкание сохраняет доступ к ним даже после выхода из функции.
        </p>
        <StudyCodeBlock code={closure} />
        <div className="study-note">
          <strong>Запомнить:</strong> замыкание полезно для счётчиков, фабрик функций и обработчиков.
        </div>
      </section>

      <section id="check" className="study-section">
        <h2 className="study-section-title">6. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу написать простую лямбду.</label>
          <label><input type="checkbox" /> Понимаю, что такое trailing lambda.</label>
          <label><input type="checkbox" /> Знаю, когда использовать <code>it</code>.</label>
          <label><input type="checkbox" /> Могу прочитать тип <code>(Int) -&gt; Int</code>.</label>
          <label><input type="checkbox" /> Понимаю, что такое замыкание.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>Лямбда</th><td><code>{'{ x -> x * 2 }'}</code></td></tr>
            <tr><th>Trailing lambda</th><td><code>foo &#123; ... &#125;</code></td></tr>
            <tr><th>Один параметр</th><td><code>it</code></td></tr>
            <tr><th>Тип функции</th><td><code>(Int, Int) -&gt; Int</code></td></tr>
            <tr><th>Замыкание</th><td>Захват внешней переменной</td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и лямбды.
      </footer>
    </>
  );
}
