import StudyCodeBlock from "../components/StudyCodeBlock";

const forRange = `for (i in 1..5) {
    println(i)
}`;

const forDownTo = `for (i in 5 downTo 1 step 2) {
    println(i)
}`;

const forCollection = `val names = listOf("Ada", "Grace", "Linus")

for (name in names) {
    println(name)
}`;

const whileLoop = `var count = 0

while (count < 3) {
    println(count)
    count++
}`;

const doWhileLoop = `var input: String

do {
    print("Введите команду: ")
    input = readLine() ?: ""
} while (input != "exit")`;

const breakContinue = `for (i in 1..10) {
    if (i == 3) continue
    if (i == 7) break
    println(i)
}`;

const nestedLoops = `for (row in 1..3) {
    for (col in 1..3) {
        print("$row,$col ")
    }
    println()
}`;

export default function KotlinLoopsStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Kotlin · Junior</p>
        <h1 className="study-title">Циклы</h1>
        <p className="study-lead">
          Циклы позволяют повторять действия. В Kotlin есть <code>for</code>, <code>while</code> и <code>do-while</code>. На junior-уровне важно понимать обход диапазонов и коллекций, а также управление циклом через <code>break</code> и <code>continue</code>.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#for">for</a>
        <a className="study-nav-link" href="#while">while</a>
        <a className="study-nav-link" href="#do-while">do-while</a>
        <a className="study-nav-link" href="#control">Управление</a>
        <a className="study-nav-link" href="#nested">Вложенность</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="for" className="study-section">
        <h2 className="study-section-title">1. Цикл for</h2>
        <p>
          <code>for</code> обходит диапазоны, массивы и коллекции. В Kotlin нет классического <code>for (i = 0; i &lt; n; i++)</code>; вместо этого используют диапазоны.
        </p>
        <StudyCodeBlock code={forRange} />
        <StudyCodeBlock code={forDownTo} />
        <StudyCodeBlock code={forCollection} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title"><code>1..5</code></strong>
            Диапазон от 1 до 5 включительно.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>downTo</code></strong>
            Обход в обратном порядке.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>step</code></strong>
            Шаг обхода: <code>step 2</code> берёт каждое второе значение.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>in collection</code></strong>
            Обход элементов списка, массива или множества.
          </div>
        </div>
      </section>

      <section id="while" className="study-section">
        <h2 className="study-section-title">2. Цикл while</h2>
        <p>
          <code>while</code> повторяет блок, пока условие истинно. Условие проверяется до каждой итерации.
        </p>
        <StudyCodeBlock code={whileLoop} />
        <div className="study-note study-warn">
          <strong>Риск:</strong> если условие никогда не станет ложным, цикл будет бесконечным. Всегда проверяй, что переменная состояния меняется.
        </div>
      </section>

      <section id="do-while" className="study-section">
        <h2 className="study-section-title">3. Цикл do-while</h2>
        <p>
          <code>do-while</code> сначала выполняет блок, а затем проверяет условие. Значит, тело выполнится хотя бы один раз.
        </p>
        <StudyCodeBlock code={doWhileLoop} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title">while</strong>
            Сначала проверка, потом выполнение.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">do-while</strong>
            Сначала выполнение, потом проверка.
          </div>
        </div>
      </section>

      <section id="control" className="study-section">
        <h2 className="study-section-title">4. break и continue</h2>
        <p>
          <code>continue</code> пропускает текущую итерацию. <code>break</code> полностью завершает цикл.
        </p>
        <StudyCodeBlock code={breakContinue} />
        <div className="study-note">
          <strong>Совет:</strong> частое использование <code>break</code> и <code>continue</code> может усложнить чтение кода. Если цикл становится сложным, лучше вынести логику в функцию.
        </div>
      </section>

      <section id="nested" className="study-section">
        <h2 className="study-section-title">5. Вложенные циклы</h2>
        <p>
          Циклы можно вкладывать друг в друга. Это полезно для таблиц, матриц и перебора пар значений.
        </p>
        <StudyCodeBlock code={nestedLoops} />
        <div className="study-note study-warn">
          <strong>Внимание:</strong> вложенные циклы быстро увеличивают сложность. Для больших данных лучше искать более эффективный алгоритм.
        </div>
      </section>

      <section id="check" className="study-section">
        <h2 className="study-section-title">6. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу написать цикл <code>for</code> по диапазону.</label>
          <label><input type="checkbox" /> Понимаю разницу между <code>while</code> и <code>do-while</code>.</label>
          <label><input type="checkbox" /> Знаю, как работает <code>step</code> и <code>downTo</code>.</label>
          <label><input type="checkbox" /> Могу объяснить <code>break</code> и <code>continue</code>.</label>
          <label><input type="checkbox" /> Понимаю риск бесконечного цикла.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>Обойти от 1 до 5</th><td><code>for (i in 1..5)</code></td></tr>
            <tr><th>Обойти коллекцию</th><td><code>for (item in items)</code></td></tr>
            <tr><th>Повторять пока условие истинно</th><td><code>while (condition)</code></td></tr>
            <tr><th>Выполнить хотя бы один раз</th><td><code>do &#123; ... &#125; while (condition)</code></td></tr>
            <tr><th>Пропустить итерацию</th><td><code>continue</code></td></tr>
            <tr><th>Выйти из цикла</th><td><code>break</code></td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и базовые циклы.
      </footer>
    </>
  );
}
