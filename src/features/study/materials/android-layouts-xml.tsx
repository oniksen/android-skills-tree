import StudyCodeBlock from "../components/StudyCodeBlock";

const basicLayout = `<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello" />
</LinearLayout>`;

const frameLayout = `<FrameLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <ImageView ... />
    <TextView ... />
</FrameLayout>`;

const linearLayout = `<LinearLayout
    android:orientation="horizontal"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <Button android:layout_width="0dp" android:layout_weight="1" ... />
    <Button android:layout_width="0dp" android:layout_weight="1" ... />
</LinearLayout>`;

const constraintLayout = `<androidx.constraintlayout.widget.ConstraintLayout ...>
    <TextView
        android:id="@+id/title"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent" />
</androidx.constraintlayout.widget.ConstraintLayout>`;

export default function AndroidLayoutsXmlStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Android · Junior</p>
        <h1 className="study-title">Layouts XML</h1>
        <p className="study-lead">
        XML-layouts описывают интерфейс Android-приложения. На junior-уровне важно понимать базовые контейнеры: FrameLayout, LinearLayout, ConstraintLayout и разницу между View и ViewGroup.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#basics">Основы</a>
        <a className="study-nav-link" href="#frame">FrameLayout</a>
        <a className="study-nav-link" href="#linear">LinearLayout</a>
        <a className="study-nav-link" href="#constraint">ConstraintLayout</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="basics" className="study-section">
        <h2 className="study-section-title">1. Основы XML-разметки</h2>
        <p>
          Каждый элемент — это View или ViewGroup. ViewGroup содержит другие элементы.
        </p>
        <StudyCodeBlock code={basicLayout} />
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title"><code>match_parent</code></strong>
            Занять всё доступное пространство.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>wrap_content</code></strong>
            Размер по содержимому.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>View</code></strong>
            Отдельный элемент интерфейса.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title"><code>ViewGroup</code></strong>
            Контейнер для других View.
          </div>
        </div>
      </section>

      <section id="frame" className="study-section">
        <h2 className="study-section-title">2. FrameLayout</h2>
        <p>
          FrameLayout помещает дочерние элементы друг над другом. Удобен для простых перекрытий.
        </p>
        <StudyCodeBlock code={frameLayout} />
      </section>

      <section id="linear" className="study-section">
        <h2 className="study-section-title">3. LinearLayout</h2>
        <p>
          LinearLayout располагает элементы в строку или столбец. Веса (<code>layout_weight</code>) помогают распределить пространство.
        </p>
        <StudyCodeBlock code={linearLayout} />
      </section>

      <section id="constraint" className="study-section">
        <h2 className="study-section-title">4. ConstraintLayout</h2>
        <p>
          ConstraintLayout позволяет создавать сложные интерфейсы с помощью ограничений между элементами.
        </p>
        <StudyCodeBlock code={constraintLayout} />
        <div className="study-note">
          <strong>Запомнить:</strong> ConstraintLayout часто заменяет вложенные LinearLayout и уменьшает глубину дерева View.
        </div>
      </section>

      <section id="check" className="study-section">
        <h2 className="study-section-title">5. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу объяснить разницу между <code>match_parent</code> и <code>wrap_content</code>.</label>
          <label><input type="checkbox" /> Понимаю, что такое ViewGroup.</label>
          <label><input type="checkbox" /> Знаю, когда использовать LinearLayout.</label>
          <label><input type="checkbox" /> Понимаю назначение ConstraintLayout.</label>
          <label><input type="checkbox" /> Могу прочитать простую XML-разметку.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>Контейнер перекрытия</th><td><code>FrameLayout</code></td></tr>
            <tr><th>Линейный контейнер</th><td><code>LinearLayout</code></td></tr>
            <tr><th>Контейнер с ограничениями</th><td><code>ConstraintLayout</code></td></tr>
            <tr><th>По ширине родителя</th><td><code>match_parent</code></td></tr>
            <tr><th>По содержимому</th><td><code>wrap_content</code></td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на XML-layouts Android.
      </footer>
    </>
  );
}
