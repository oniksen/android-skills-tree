import StudyCodeBlock from "../components/StudyCodeBlock";

const basicEnum = `enum class Direction {
    NORTH, SOUTH, EAST, WEST
}

val direction = Direction.NORTH`;

const enumWithProperties = `enum class Color(val hex: String) {
    RED("#FF0000"),
    GREEN("#00FF00"),
    BLUE("#0000FF")
}

println(Color.RED.hex)`;

const enumMethods = `enum class Status {
    NEW, IN_PROGRESS, DONE;

    fun isFinished(): Boolean = this == DONE
}

println(Status.DONE.isFinished())`;

const whenEnum = `fun describe(direction: Direction): String {
    return when (direction) {
        Direction.NORTH -> "Север"
        Direction.SOUTH -> "Юг"
        Direction.EAST -> "Восток"
        Direction.WEST -> "Запад"
    }
}`;

const enumInterface = `interface Printable {
    fun print()
}

enum class Level : Printable {
    JUNIOR, MIDDLE, SENIOR;

    override fun print() = println(name)
}`;

export default function KotlinEnumStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Kotlin · Junior</p>
        <h1 className="study-title">Enum</h1>
        <p className="study-lead">
        <code>enum class</code> описывает фиксированный набор значений. Enum удобен для статусов, направлений, уровней и других ограниченных наборов. В Kotlin enum может иметь свойства, методы и реализовывать интерфейсы.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#basics">Основы</a>
        <a className="study-nav-link" href="#properties">Свойства</a>
        <a className="study-nav-link" href="#methods">Методы</a>
        <a className="study-nav-link" href="#when">when</a>
        <a className="study-nav-link" href="#interfaces">Интерфейсы</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="basics" className="study-section">
        <h2 className="study-section-title">1. Базовый enum</h2>
        <p>
          Enum создаёт набор именованных констант. Каждое значение — объект enum-класса.
        </p>
        <StudyCodeBlock code={basicEnum} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title">Константы</strong>
            Фиксированный набор значений.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>name</code></strong>
            Имя константы в виде строки.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>ordinal</code></strong>
            Порядковый номер константы.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Типобезопасность</strong>
            Нельзя передать произвольную строку вместо enum.
          </div>
        </div>
      </section>

      <section id="properties" className="study-section">
        <h2 className="study-section-title">2. Свойства enum</h2>
        <p>
          Enum может хранить данные. Каждой константе передают значения в конструктор.
        </p>
        <StudyCodeBlock code={enumWithProperties} />
      </section>

      <section id="methods" className="study-section">
        <h2 className="study-section-title">3. Методы enum</h2>
        <p>
          В enum можно объявлять методы и свойства, как в обычном классе.
        </p>
        <StudyCodeBlock code={enumMethods} />
      </section>

      <section id="when" className="study-section">
        <h2 className="study-section-title">4. Enum и when</h2>
        <p>
          <code>when</code> по enum может быть исчерпывающим: если покрыты все значения, <code>else</code> не обязателен.
        </p>
        <StudyCodeBlock code={whenEnum} />
        <div className="study-note">
          <strong>Запомнить:</strong> исчерпывающий <code>when</code> помогает компилятору проверить, что все случаи обработаны.
        </div>
      </section>

      <section id="interfaces" className="study-section">
        <h2 className="study-section-title">5. Реализация интерфейсов</h2>
        <p>
          Enum может реализовывать интерфейс, как обычный класс.
        </p>
        <StudyCodeBlock code={enumInterface} />
      </section>

      <section id="check" className="study-section">
        <h2 className="study-section-title">6. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу объяснить, зачем нужен enum.</label>
          <label><input type="checkbox" /> Понимаю разницу между <code>name</code> и <code>ordinal</code>.</label>
          <label><input type="checkbox" /> Знаю, как добавить свойства в enum.</label>
          <label><input type="checkbox" /> Могу использовать enum в <code>when</code>.</label>
          <label><input type="checkbox" /> Понимаю, что enum может реализовывать интерфейс.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>Объявить enum</th><td><code>enum class Status &#123; NEW, DONE &#125;</code></td></tr>
            <tr><th>Свойство</th><td><code>enum class Color(val hex: String)</code></td></tr>
            <tr><th>Имя значения</th><td><code>Status.NEW.name</code></td></tr>
            <tr><th>Порядок</th><td><code>Status.NEW.ordinal</code></td></tr>
            <tr><th>Исчерпывающий when</th><td>Все значения enum</td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и enum.
      </footer>
    </>
  );
}
