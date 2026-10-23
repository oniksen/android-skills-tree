import StudyCodeBlock from "../components/StudyCodeBlock";

const basicTypes = `val age: Int = 25
val price: Double = 19.99
val title: String = "Kotlin"
val isActive: Boolean = true`;

const numberTypes = `val byteValue: Byte = 127
val shortValue: Short = 1000
val intValue: Int = 1_000_000
val longValue: Long = 9_000_000_000L

val floatValue: Float = 3.14f
val doubleValue: Double = 3.14159`;

const strings = `val name = "Ada"
val greeting = "Привет, $name"
val multiline = """
    Первая строка
    Вторая строка
""".trimIndent()`;

const arrays = `val numbers = arrayOf(1, 2, 3)
val names = arrayOf("Ada", "Grace")

val first = numbers[0]
numbers[1] = 10`;

const nullable = `val nickname: String? = null
val length = nickname?.length ?: 0

val nonNullName: String = "Kotlin"`;

const inference = `val count = 10 // Int
val message = "Hello" // String
val enabled = true // Boolean`;

export default function KotlinTypesStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Kotlin · Junior</p>
        <h1 className="study-title">Типы данных</h1>
        <p className="study-lead">
        Тип данных определяет, какие значения может хранить переменная и какие операции с ней допустимы. В Kotlin есть числовые типы, строки, булевы значения, массивы и nullable-типы. На junior-уровне важно понимать базовые типы и безопасную работу с null.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#numbers">Числа</a>
        <a className="study-nav-link" href="#strings">Строки</a>
        <a className="study-nav-link" href="#boolean">Boolean</a>
        <a className="study-nav-link" href="#arrays">Массивы</a>
        <a className="study-nav-link" href="#nullable">Null safety</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="numbers" className="study-section">
        <h2 className="study-section-title">1. Числовые типы</h2>
        <p>
          Kotlin различает целые и дробные числа. Выбор типа влияет на память, точность и удобство работы.
        </p>
        <StudyCodeBlock code={basicTypes} />
        <StudyCodeBlock code={numberTypes} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title"><code>Byte</code>, <code>Short</code>, <code>Int</code>, <code>Long</code></strong>
            Целые числа разного размера. Чаще всего используют <code>Int</code>.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>Float</code>, <code>Double</code></strong>
            Дробные числа. <code>Double</code> точнее и используется чаще.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Суффиксы</strong>
            <code>L</code> для Long, <code>f</code> для Float.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Разделители</strong>
            Подчёркивание помогает читать большие числа: <code>1_000_000</code>.
          </div>
        </div>
      </section>

      <section id="strings" className="study-section">
        <h2 className="study-section-title">2. Строки</h2>
        <p>
          <code>String</code> хранит текст. В Kotlin строки поддерживают шаблоны и многострочный текст.
        </p>
        <StudyCodeBlock code={strings} />
        <div className="study-note">
          <strong>Запомнить:</strong> <code>$name</code> подставляет значение переменной в строку. Для сложных выражений используют <code>${'$'}&#123;...&#125;</code>.
        </div>
      </section>

      <section id="boolean" className="study-section">
        <h2 className="study-section-title">3. Boolean</h2>
        <p>
          <code>Boolean</code> хранит одно из двух значений: <code>true</code> или <code>false</code>. Этот тип часто используется в условиях и флагах.
        </p>
        <StudyCodeBlock code={basicTypes} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title"><code>true</code></strong>
            Условие выполнено, функция включена, данные загружены.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>false</code></strong>
            Условие не выполнено, функция выключена, данных нет.
          </div>
        </div>
      </section>

      <section id="arrays" className="study-section">
        <h2 className="study-section-title">4. Массивы</h2>
        <p>
          Массив хранит набор значений одного типа. Доступ к элементам идёт по индексу, начиная с нуля.
        </p>
        <StudyCodeBlock code={arrays} />
        <div className="study-note study-warn">
          <strong>Частая ошибка:</strong> обращение по индексу, которого нет в массиве. Например, у массива из 3 элементов нет индекса 3.
        </div>
      </section>

      <section id="nullable" className="study-section">
        <h2 className="study-section-title">5. Null safety</h2>
        <p>
          По умолчанию переменная не может быть <code>null</code>. Если значение может отсутствовать, тип помечают знаком <code>?</code>.
        </p>
        <StudyCodeBlock code={nullable} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title"><code>String</code></strong>
            Не может быть null. Безопасный вариант по умолчанию.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>String?</code></strong>
            Может быть null. Требует аккуратной проверки.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>?.</code></strong>
            Безопасный вызов: если значение null, результат тоже null.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>?:</code></strong>
            Оператор Элвиса: подставляет значение по умолчанию.
          </div>
        </div>
      </section>

      <section id="inference" className="study-section">
        <h2 className="study-section-title">6. Вывод типа</h2>
        <p>
          Компилятор часто понимает тип по значению. Явный тип полезен для читаемости и публичных API.
        </p>
        <StudyCodeBlock code={inference} />
        <div className="study-note">
          <strong>Практика:</strong> используй вывод типа для локальных переменных, а явный тип — для свойств класса и функций, которые видны другим модулям.
        </div>
      </section>

      <section id="check" className="study-section">
        <h2 className="study-section-title">7. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу назвать основные числовые типы Kotlin.</label>
          <label><input type="checkbox" /> Понимаю разницу между <code>String</code> и <code>String?</code>.</label>
          <label><input type="checkbox" /> Знаю, как обратиться к элементу массива.</label>
          <label><input type="checkbox" /> Могу объяснить операторы <code>?.</code> и <code>?:</code>.</label>
          <label><input type="checkbox" /> Понимаю, когда тип можно не указывать явно.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>Целое число</th><td><code>val x: Int = 10</code></td></tr>
            <tr><th>Дробное число</th><td><code>val x: Double = 3.14</code></td></tr>
            <tr><th>Строка</th><td><code>val x: String = &quot;text&quot;</code></td></tr>
            <tr><th>Массив</th><td><code>val x = arrayOf(1, 2, 3)</code></td></tr>
            <tr><th>Nullable-строка</th><td><code>val x: String? = null</code></td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и базовые типы данных.
      </footer>
    </>
  );
}
