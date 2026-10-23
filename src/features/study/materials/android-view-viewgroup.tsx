import StudyCodeBlock from "../components/StudyCodeBlock";

const basicView = `<TextView
    android:id="@+id/title"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Hello" />`;

const viewGroup = `<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <TextView ... />
    <Button ... />
</LinearLayout>`;

const programmatic = `val textView = TextView(context).apply {
    text = "Hello"
    textSize = 16f
}

parent.addView(textView)`;

const attributes = `android:layout_width="match_parent"
android:layout_height="wrap_content"
android:visibility="gone"
android:padding="16dp"`;

export default function AndroidViewViewGroupStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Android · Junior</p>
        <h1 className="study-title">View/ViewGroup</h1>
        <p className="study-lead">
        View — базовый элемент интерфейса, ViewGroup — контейнер, который хранит и располагает другие View. На junior-уровне важно понимать иерархию UI и базовые атрибуты.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#view">View</a>
        <a className="study-nav-link" href="#viewgroup">ViewGroup</a>
        <a className="study-nav-link" href="#programmatic">Программно</a>
        <a className="study-nav-link" href="#attributes">Атрибуты</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="view" className="study-section">
        <h2 className="study-section-title">1. View</h2>
        <p>
          View — отдельный элемент интерфейса: текст, кнопка, изображение и т.д.
        </p>
        <StudyCodeBlock code={basicView} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title"><code>TextView</code></strong>
            Отображает текст.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>Button</code></strong>
            Кнопка с обработкой нажатий.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>ImageView</code></strong>
            Отображает изображение.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>EditText</code></strong>
            Поле ввода текста.
          </div>
        </div>
      </section>

      <section id="viewgroup" className="study-section">
        <h2 className="study-section-title">2. ViewGroup</h2>
        <p>
          ViewGroup содержит другие View и определяет их расположение.
        </p>
        <StudyCodeBlock code={viewGroup} />
        <div className="study-note">
          <strong>Запомнить:</strong> ViewGroup — это тоже View, но с дополнительной способностью хранить дочерние элементы.
        </div>
      </section>

      <section id="programmatic" className="study-section">
        <h2 className="study-section-title">3. Создание View программно</h2>
        <p>
          View можно создавать в коде, а не только в XML. Это полезно для динамических интерфейсов.
        </p>
        <StudyCodeBlock code={programmatic} />
      </section>

      <section id="attributes" className="study-section">
        <h2 className="study-section-title">4. Базовые атрибуты</h2>
        <p>
          Атрибуты задают размер, видимость, отступы и другие свойства.
        </p>
        <StudyCodeBlock code={attributes} />
      </section>

      <section id="check" className="study-section">
        <h2 className="study-section-title">5. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу объяснить разницу между View и ViewGroup.</label>
          <label><input type="checkbox" /> Понимаю, что такое иерархия UI.</label>
          <label><input type="checkbox" /> Знаю базовые атрибуты размеров.</label>
          <label><input type="checkbox" /> Могу создать View программно.</label>
          <label><input type="checkbox" /> Понимаю роль контейнеров.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>Элемент</th><td><code>View</code></td></tr>
            <tr><th>Контейнер</th><td><code>ViewGroup</code></td></tr>
            <tr><th>По родителю</th><td><code>match_parent</code></td></tr>
            <tr><th>По содержимому</th><td><code>wrap_content</code></td></tr>
            <tr><th>Скрыть</th><td><code>visibility=&quot;gone&quot;</code></td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на View и ViewGroup.
      </footer>
    </>
  );
}
