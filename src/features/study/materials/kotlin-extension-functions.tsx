import StudyCodeBlock from "../components/StudyCodeBlock";

const basicExtension = `fun String.addExclamation(): String {
    return this + "!"
}

val result = "Hello".addExclamation()`;

const extensionProperty = `val String.lastChar: Char
    get() = this[length - 1]

println("Kotlin".lastChar)`;

const nullableReceiver = `fun String?.safeLength(): Int {
    return this?.length ?: 0
}

val length = null.safeLength()`;

const memberPriority = `class User(val name: String) {
    fun printName() = println("member: $name")
}

fun User.printName() = println("extension: $name")

User("Ada").printName() // member: Ada`;

const scope = `fun List<Int>.sumEven(): Int {
    return this.filter { it % 2 == 0 }.sum()
}`;

export default function KotlinExtensionFunctionsStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Kotlin · Junior</p>
        <h1 className="study-title">Extension Functions</h1>
        <p className="study-lead">
        Extension functions позволяют добавлять новые функции к существующим классам без наследования. Это делает код выразительнее и позволяет создавать удобные утилиты.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#basics">Основы</a>
        <a className="study-nav-link" href="#property">Extension properties</a>
        <a className="study-nav-link" href="#nullable">Nullable receiver</a>
        <a className="study-nav-link" href="#priority">Приоритет</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="basics" className="study-section">
        <h2 className="study-section-title">1. Что такое extension function</h2>
        <p>
          Extension function объявляется как обычная функция, но перед именем указывается тип-приёмник. Внутри функции объект доступен через <code>this</code>.
        </p>
        <StudyCodeBlock code={basicExtension} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title">Тип-приёмник</strong>
            Класс, к которому добавляется функция: <code>String</code>.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>this</code></strong>
            Ссылка на объект, у которого вызвали функцию.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Вызов</strong>
            Выглядит как метод: <code>&quot;Hello&quot;.addExclamation()</code>.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Ограничение</strong>
            Extension function не имеет доступа к private-членам класса.
          </div>
        </div>
      </section>

      <section id="property" className="study-section">
        <h2 className="study-section-title">2. Extension properties</h2>
        <p>
          Можно добавлять не только функции, но и свойства. Обычно они вычисляются через getter.
        </p>
        <StudyCodeBlock code={extensionProperty} />
      </section>

      <section id="nullable" className="study-section">
        <h2 className="study-section-title">3. Nullable receiver</h2>
        <p>
          Extension function может быть объявлена для nullable-типа. Тогда её можно вызывать у null.
        </p>
        <StudyCodeBlock code={nullableReceiver} />
        <div className="study-note">
          <strong>Запомнить:</strong> внутри функции <code>this</code> может быть null, поэтому нужно использовать безопасные вызовы.
        </div>
      </section>

      <section id="priority" className="study-section">
        <h2 className="study-section-title">4. Приоритет членов класса</h2>
        <p>
          Если у класса уже есть метод с таким же именем, вызывается метод класса, а не extension function.
        </p>
        <StudyCodeBlock code={memberPriority} />
      </section>

      <section id="scope" className="study-section">
        <h2 className="study-section-title">5. Практический пример</h2>
        <p>
          Extension functions часто используют для утилит над коллекциями, строками и доменными объектами.
        </p>
        <StudyCodeBlock code={scope} />
      </section>

      <section id="check" className="study-section">
        <h2 className="study-section-title">6. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу объяснить, что такое extension function.</label>
          <label><input type="checkbox" /> Понимаю, как объявить функцию для типа-приёмника.</label>
          <label><input type="checkbox" /> Знаю, что extension function не имеет доступа к private-членам.</label>
          <label><input type="checkbox" /> Понимаю, как работает nullable receiver.</label>
          <label><input type="checkbox" /> Знаю, что метод класса имеет приоритет над extension.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>Extension function</th><td><code>fun String.foo(): String</code></td></tr>
            <tr><th>Extension property</th><td><code>val String.bar: Char get() = ...</code></td></tr>
            <tr><th>Nullable receiver</th><td><code>fun String?.safeLength()</code></td></tr>
            <tr><th>Вызов</th><td><code>&quot;text&quot;.foo()</code></td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и extension functions.
      </footer>
    </>
  );
}
