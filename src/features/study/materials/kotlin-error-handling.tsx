import StudyCodeBlock from "../components/StudyCodeBlock";

const tryCatch = `fun parseNumber(text: String): Int? {
    return try {
        text.toInt()
    } catch (e: NumberFormatException) {
        println("Это не число: $text")
        null
    } finally {
        println("Попытка завершена")
    }
}`;

const nullHandling = `val nickname: String? = null

val length = nickname?.length ?: 0

val forced = nickname!! // опасно: может бросить исключение`;

const runCatching = `val result = runCatching {
    "42".toInt()
}

val value = result.getOrNull()
val error = result.exceptionOrNull()`;

const whenResult = `fun divide(a: Int, b: Int): Result<Int> {
    return if (b == 0) {
        Result.failure(IllegalArgumentException("Деление на ноль"))
    } else {
        Result.success(a / b)
    }
}`;

export default function KotlinErrorHandlingStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Kotlin · Junior</p>
        <h1 className="study-title">Обработка ошибок</h1>
        <p className="study-lead">
        Ошибки и исключительные ситуации нужно обрабатывать аккуратно. В Kotlin для этого используют <code>try/catch/finally</code>, безопасные вызовы для null и подходы вроде <code>runCatching</code>. На junior-уровне важно понимать базовые механизмы и не прятать ошибки без причины.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#try-catch">try/catch</a>
        <a className="study-nav-link" href="#null">Null safety</a>
        <a className="study-nav-link" href="#result">Result</a>
        <a className="study-nav-link" href="#mistakes">Ошибки</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="try-catch" className="study-section">
        <h2 className="study-section-title">1. try, catch, finally</h2>
        <p>
          <code>try</code> содержит код, который может выбросить исключение. <code>catch</code> обрабатывает конкретный тип ошибки. <code>finally</code> выполняется всегда.
        </p>
        <StudyCodeBlock code={tryCatch} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title"><code>try</code></strong>
            Блок, где может произойти ошибка.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>catch</code></strong>
            Обработка конкретного типа исключения.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>finally</code></strong>
            Код, который выполняется в любом случае.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Результат</strong>
            <code>try/catch</code> может возвращать значение.
          </div>
        </div>
      </section>

      <section id="null" className="study-section">
        <h2 className="study-section-title">2. Работа с null</h2>
        <p>
          Многие ошибки в Kotlin связаны с null. Безопасные вызовы и оператор Элвиса помогают избежать <code>NullPointerException</code>.
        </p>
        <StudyCodeBlock code={nullHandling} />
        <div className="study-note study-warn">
          <strong>Осторожно:</strong> оператор <code>!!</code> принудительно считает значение не-null. Если значение окажется null, приложение упадёт.
        </div>
      </section>

      <section id="result" className="study-section">
        <h2 className="study-section-title">3. Result и runCatching</h2>
        <p>
          Вместо выброса исключения можно вернуть результат, который содержит либо значение, либо ошибку. Это делает обработку явной.
        </p>
        <StudyCodeBlock code={runCatching} />
        <StudyCodeBlock code={whenResult} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title"><code>runCatching</code></strong>
            Выполняет блок и оборачивает результат.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>getOrNull()</code></strong>
            Возвращает значение или null.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>exceptionOrNull()</code></strong>
            Возвращает ошибку или null.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>Result</code></strong>
            Явный способ передать успех или ошибку.
          </div>
        </div>
      </section>

      <section id="mistakes" className="study-section">
        <h2 className="study-section-title">4. Частые ошибки</h2>
        <div className="study-note study-warn">
          <strong>Ошибка 1:</strong> ловить слишком общий <code>Exception</code> и терять причину.
        </div>
        <div className="study-note study-warn">
          <strong>Ошибка 2:</strong> использовать <code>!!</code> без проверки.
        </div>
        <div className="study-note study-warn">
          <strong>Ошибка 3:</strong> игнорировать ошибку и продолжать работу с некорректными данными.
        </div>
        <div className="study-note study-warn">
          <strong>Ошибка 4:</strong> ловить ошибку, но не логировать и не показывать пользователю.
        </div>
      </section>

      <section id="check" className="study-section">
        <h2 className="study-section-title">5. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу объяснить разницу между <code>try</code>, <code>catch</code> и <code>finally</code>.</label>
          <label><input type="checkbox" /> Понимаю, как работают <code>?.</code> и <code>?:</code>.</label>
          <label><input type="checkbox" /> Знаю риск использования <code>!!</code>.</label>
          <label><input type="checkbox" /> Могу использовать <code>runCatching</code>.</label>
          <label><input type="checkbox" /> Понимаю, почему нельзя молча глотать ошибки.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>Перехватить ошибку</th><td><code>try &#123; ... &#125; catch (e: Exception) &#123; ... &#125;</code></td></tr>
            <tr><th>Безопасный вызов</th><td><code>obj?.property</code></td></tr>
            <tr><th>Значение по умолчанию</th><td><code>value ?: defaultValue</code></td></tr>
            <tr><th>Обернуть результат</th><td><code>runCatching &#123; ... &#125;</code></td></tr>
            <tr><th>Получить значение</th><td><code>result.getOrNull()</code></td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и базовую обработку ошибок.
      </footer>
    </>
  );
}
