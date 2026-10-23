import StudyCodeBlock from "../components/StudyCodeBlock";

const nullableType = `val name: String = "Kotlin"
val nickname: String? = null`;

const safeCall = `val length = nickname?.length
val upper = nickname?.uppercase()`;

const elvis = `val displayName = nickname ?: "Гость"
val length = nickname?.length ?: 0`;

const notNullAssertion = `val forcedLength = nickname!!.length // опасно`;

const safeCast = `val value: Any = "Kotlin"
val text = value as? String
val number = value as? Int`;

const letBlock = `nickname?.let { value ->
    println("Ник: $value")
}`;

const platformType = `// Java-метод может вернуть тип платформы
val javaName = javaObject.name // String!`;

export default function KotlinNullSafetyStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Kotlin · Junior</p>
        <h1 className="study-title">Null Safety</h1>
        <p className="study-lead">
        В Kotlin переменная по умолчанию не может хранить <code>null</code>. Это помогает избежать <code>NullPointerException</code>. Если значение может отсутствовать, тип помечают знаком <code>?</code>, а для работы с ним используют безопасные операторы.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#nullable">Nullable-типы</a>
        <a className="study-nav-link" href="#safe-call">Безопасный вызов</a>
        <a className="study-nav-link" href="#elvis">Оператор Элвиса</a>
        <a className="study-nav-link" href="#assertion">!!</a>
        <a className="study-nav-link" href="#let">let</a>
        <a className="study-nav-link" href="#cast">Безопасное приведение</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="nullable" className="study-section">
        <h2 className="study-section-title">1. Nullable и non-null типы</h2>
        <p>
          <code>String</code> не может быть null. <code>String?</code> может быть null. Это различие проверяется компилятором.
        </p>
        <StudyCodeBlock code={nullableType} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title"><code>String</code></strong>
            Значение обязано существовать.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>String?</code></strong>
            Значение может быть null.
          </div>
        </div>
      </section>

      <section id="safe-call" className="study-section">
        <h2 className="study-section-title">2. Безопасный вызов ?.</h2>
        <p>
          Если объект может быть null, используй <code>?.</code>. Если объект null, результат тоже будет null, но приложение не упадёт.
        </p>
        <StudyCodeBlock code={safeCall} />
        <div className="study-note">
          <strong>Запомнить:</strong> <code>?.</code> удобен для цепочек вызовов: <code>user?.address?.city</code>.
        </div>
      </section>

      <section id="elvis" className="study-section">
        <h2 className="study-section-title">3. Оператор Элвиса ?:</h2>
        <p>
          Оператор <code>?:</code> подставляет значение по умолчанию, если левая часть равна null.
        </p>
        <StudyCodeBlock code={elvis} />
      </section>

      <section id="assertion" className="study-section">
        <h2 className="study-section-title">4. Оператор !!</h2>
        <p>
          <code>!!</code> утверждает, что значение не null. Если это не так, будет выброшено исключение.
        </p>
        <StudyCodeBlock code={notNullAssertion} />
        <div className="study-note study-warn">
          <strong>Осторожно:</strong> используй <code>!!</code> только тогда, когда уверен в значении. В обычном коде лучше использовать <code>?:</code>, <code>?.let</code> или явную проверку.
        </div>
      </section>

      <section id="let" className="study-section">
        <h2 className="study-section-title">5. let для nullable-значений</h2>
        <p>
          <code>let</code> позволяет выполнить блок только тогда, когда значение не null.
        </p>
        <StudyCodeBlock code={letBlock} />
      </section>

      <section id="cast" className="study-section">
        <h2 className="study-section-title">6. Безопасное приведение типов</h2>
        <p>
          <code>as?</code> пытается привести значение к типу. Если приведение невозможно, результат будет null, а не исключение.
        </p>
        <StudyCodeBlock code={safeCast} />
      </section>

      <section id="platform" className="study-section">
        <h2 className="study-section-title">7. Платформенные типы</h2>
        <p>
          При вызове Java-кода Kotlin может не знать, может ли значение быть null. Такой тип называют платформенным и обозначают <code>String!</code>.
        </p>
        <StudyCodeBlock code={platformType} />
        <div className="study-note study-warn">
          <strong>Частая ошибка:</strong> считать платформенный тип безопасным. Если Java-метод может вернуть null, лучше явно обработать его через <code>?:</code> или проверку.
        </div>
      </section>

      <section id="check" className="study-section">
        <h2 className="study-section-title">8. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу объяснить разницу между <code>String</code> и <code>String?</code>.</label>
          <label><input type="checkbox" /> Понимаю, как работает <code>?.</code>.</label>
          <label><input type="checkbox" /> Знаю, зачем нужен оператор <code>?:</code>.</label>
          <label><input type="checkbox" /> Понимаю риск использования <code>!!</code>.</label>
          <label><input type="checkbox" /> Знаю, что такое платформенный тип.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>Nullable-тип</th><td><code>val x: String? = null</code></td></tr>
            <tr><th>Безопасный вызов</th><td><code>x?.length</code></td></tr>
            <tr><th>Значение по умолчанию</th><td><code>x ?: &quot;default&quot;</code></td></tr>
            <tr><th>Опасное утверждение</th><td><code>x!!</code></td></tr>
            <tr><th>Безопасное приведение</th><td><code>x as? String</code></td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и null safety.
      </footer>
    </>
  );
}
