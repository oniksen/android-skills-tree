import StudyCodeBlock from "../components/StudyCodeBlock";

const basicStructure = `package com.example.app

import kotlin.math.sqrt

fun main() {
    println("Hello, Kotlin")
}`;

const semicolons = `val name = "Ada"
val age = 25

// Точка с запятой обычно не нужна
val title = "Kotlin"; val count = 3 // можно, но не принято`;

const strings = `val name = "Ada"
val greeting = "Привет, $name"
val length = "Kotlin".length

val multiline = """
    Первая строка
    Вторая строка
""".trimIndent()`;

const comments = `// однострочный комментарий

/*
  многострочный
  комментарий
*/

/**
 * Документация для функции
 */`;

const numbers = `val decimal = 1_000_000
val hex = 0xFF
val binary = 0b1010

val double = 3.14
val float = 3.14f`;

const naming = `val userName = "Ada"
val maxRetryCount = 3

fun calculateTotal(price: Int, quantity: Int): Int {
    return price * quantity
}`;

export default function KotlinSyntaxStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Kotlin · Junior</p>
        <h1 className="study-title">Синтаксис Kotlin</h1>
        <p className="study-lead">
          Синтаксис Kotlin лаконичнее Java, но сохраняет читаемость. На junior-уровне важно понимать структуру файла, пакеты, импорты, строки, комментарии и базовые правила оформления кода.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#structure">Структура</a>
        <a className="study-nav-link" href="#packages">Пакеты</a>
        <a className="study-nav-link" href="#strings">Строки</a>
        <a className="study-nav-link" href="#comments">Комментарии</a>
        <a className="study-nav-link" href="#numbers">Числа</a>
        <a className="study-nav-link" href="#naming">Именование</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="structure" className="study-section">
        <h2 className="study-section-title">1. Структура файла</h2>
        <p>
          Kotlin-файл обычно начинается с объявления пакета, затем идут импорты и объявления функций, классов или свойств.
        </p>
        <StudyCodeBlock code={basicStructure} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title"><code>package</code></strong>
            Группирует код и влияет на полное имя классов.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>import</code></strong>
            Подключает классы и функции из других пакетов.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>fun main()</code></strong>
            Точка входа в консольное приложение.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>println</code></strong>
            Выводит строку в консоль.
          </div>
        </div>
      </section>

      <section id="packages" className="study-section">
        <h2 className="study-section-title">2. Пакеты и импорты</h2>
        <p>
          Пакет помогает организовать код по смыслу. Импорт позволяет использовать типы без полного имени.
        </p>
        <StudyCodeBlock code={basicStructure} />
        <div className="study-note">
          <strong>Запомнить:</strong> пакет — это не папка в строгом смысле, но обычно структура пакетов совпадает со структурой директорий.
        </div>
      </section>

      <section id="semicolons" className="study-section">
        <h2 className="study-section-title">3. Точка с запятой</h2>
        <p>
          В Kotlin точка с запятой обычно не нужна. Компилятор понимает конец выражения по переводу строки.
        </p>
        <StudyCodeBlock code={semicolons} />
        <div className="study-note study-warn">
          <strong>Стиль:</strong> не ставь точку с запятой в конце строк. Это делает код менее читаемым и не принято в Kotlin.
        </div>
      </section>

      <section id="strings" className="study-section">
        <h2 className="study-section-title">4. Строки и шаблоны</h2>
        <p>
          Строки пишут в двойных кавычках. В них можно подставлять переменные и выражения.
        </p>
        <StudyCodeBlock code={strings} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title"><code>&quot;$name&quot;</code></strong>
            Подстановка значения переменной.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>&quot;${'$'}&#123;...&#125;&quot;</code></strong>
            Подстановка выражения.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>&quot;&quot;&quot;...&quot;&quot;&quot;</code></strong>
            Многострочная строка.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>trimIndent()</code></strong>
            Убирает лишние отступы у многострочной строки.
          </div>
        </div>
      </section>

      <section id="comments" className="study-section">
        <h2 className="study-section-title">5. Комментарии</h2>
        <p>
          Комментарии объясняют код, но не должны заменять понятные имена. В Kotlin есть однострочные, многострочные и документирующие комментарии.
        </p>
        <StudyCodeBlock code={comments} />
      </section>

      <section id="numbers" className="study-section">
        <h2 className="study-section-title">6. Числа и базовые литералы</h2>
        <p>
          Числа можно записывать в разных форматах. Подчёркивание помогает читать длинные числа.
        </p>
        <StudyCodeBlock code={numbers} />
      </section>

      <section id="naming" className="study-section">
        <h2 className="study-section-title">7. Именование</h2>
        <p>
          Хорошие имена делают код самодокументируемым. В Kotlin принято использовать camelCase для переменных и функций.
        </p>
        <StudyCodeBlock code={naming} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title">Переменные</strong>
            <code>userName</code>, <code>maxRetryCount</code>.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Функции</strong>
            Глагол + объект: <code>calculateTotal</code>.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Классы</strong>
            PascalCase: <code>UserProfile</code>.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Константы</strong>
            <code>MAX_ATTEMPTS</code>.
          </div>
        </div>
      </section>

      <section id="check" className="study-section">
        <h2 className="study-section-title">8. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу объяснить структуру Kotlin-файла.</label>
          <label><input type="checkbox" /> Понимаю, зачем нужны пакеты и импорты.</label>
          <label><input type="checkbox" /> Знаю, что точка с запятой обычно не нужна.</label>
          <label><input type="checkbox" /> Могу использовать строковые шаблоны.</label>
          <label><input type="checkbox" /> Понимаю правила именования.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>Пакет</th><td><code>package com.example.app</code></td></tr>
            <tr><th>Импорт</th><td><code>import kotlin.math.sqrt</code></td></tr>
            <tr><th>Точка входа</th><td><code>fun main() &#123; ... &#125;</code></td></tr>
            <tr><th>Шаблон строки</th><td><code>&quot;Привет, $name&quot;</code></td></tr>
            <tr><th>Многострочная строка</th><td><code>&quot;&quot;&quot;...&quot;&quot;&quot;</code></td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на базовый синтаксис Kotlin.
      </footer>
    </>
  );
}
