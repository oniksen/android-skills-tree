import StudyCodeBlock from "../components/StudyCodeBlock";

const basicSealed = `sealed class Result {
    data class Success(val value: String) : Result()
    data class Error(val message: String) : Result()
    object Loading : Result()
}`;

const whenSealed = `fun handle(result: Result): String {
    return when (result) {
        is Result.Success -> "Успех: ${'$'}{result.value}"
        is Result.Error -> "Ошибка: ${'$'}{result.message}"
        Result.Loading -> "Загрузка..."
    }
}`;

const sealedInterface = `sealed interface UiState {
    data class Content(val text: String) : UiState
    object Empty : UiState
    object Loading : UiState
}`;

const exhaustive = `sealed class Status {
    object New : Status()
    object Done : Status()
}

fun label(status: Status): String {
    return when (status) {
        Status.New -> "Новый"
        Status.Done -> "Готово"
    }
}`;

export default function KotlinSealedClassStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Kotlin · Junior</p>
        <h1 className="study-title">Sealed Class</h1>
        <p className="study-lead">
        <code>sealed class</code> и <code>sealed interface</code> ограничивают иерархию наследования. Все прямые подтипы известны на этапе компиляции. Это удобно для моделирования состояний и исчерпывающего <code>when</code>.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#basics">Основы</a>
        <a className="study-nav-link" href="#when">when</a>
        <a className="study-nav-link" href="#interface">Sealed interface</a>
        <a className="study-nav-link" href="#enum">Сравнение с enum</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="basics" className="study-section">
        <h2 className="study-section-title">1. Зачем нужен sealed</h2>
        <p>
          Sealed-класс позволяет описать закрытый набор подтипов. Компилятор знает все варианты, поэтому может проверить полноту <code>when</code>.
        </p>
        <StudyCodeBlock code={basicSealed} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title">Ограниченная иерархия</strong>
            Подтипы известны заранее.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Типобезопасность</strong>
            Нельзя создать неожиданный подтип вне модуля.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Моделирование состояний</strong>
            Удобно для UI-состояний, результатов и событий.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Исчерпываемость</strong>
            <code>when</code> может не требовать <code>else</code>.
          </div>
        </div>
      </section>

      <section id="when" className="study-section">
        <h2 className="study-section-title">2. Исчерпывающий when</h2>
        <p>
          Если <code>when</code> покрывает все подтипы sealed-класса, компилятор проверит полноту.
        </p>
        <StudyCodeBlock code={whenSealed} />
        <StudyCodeBlock code={exhaustive} />
      </section>

      <section id="interface" className="study-section">
        <h2 className="study-section-title">3. Sealed interface</h2>
        <p>
          <code>sealed interface</code> позволяет описывать закрытый набор реализаций без ограничений наследования классов.
        </p>
        <StudyCodeBlock code={sealedInterface} />
      </section>

      <section id="enum" className="study-section">
        <h2 className="study-section-title">4. Sealed class и enum</h2>
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title">Enum</strong>
            Подходит для простых констант с общим набором свойств.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Sealed class</strong>
            Подходит для подтипов с разными данными и поведением.
          </div>
        </div>
        <div className="study-note">
          <strong>Пример:</strong> состояние экрана лучше моделировать через sealed class, потому что у разных состояний разные данные.
        </div>
      </section>

      <section id="check" className="study-section">
        <h2 className="study-section-title">5. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу объяснить, зачем нужен sealed class.</label>
          <label><input type="checkbox" /> Понимаю разницу между sealed class и enum.</label>
          <label><input type="checkbox" /> Знаю, что такое исчерпывающий when.</label>
          <label><input type="checkbox" /> Могу смоделировать состояние экрана через sealed class.</label>
          <label><input type="checkbox" /> Понимаю, когда использовать sealed interface.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>Sealed class</th><td><code>sealed class Result</code></td></tr>
            <tr><th>Подтип</th><td><code>data class Success(...) : Result()</code></td></tr>
            <tr><th>Объект-подтип</th><td><code>object Loading : Result()</code></td></tr>
            <tr><th>Проверка типа</th><td><code>is Result.Success</code></td></tr>
            <tr><th>Исчерпывающий when</th><td>Все подтипы</td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и sealed classes.
      </footer>
    </>
  );
}
