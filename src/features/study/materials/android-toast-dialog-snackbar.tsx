import StudyCodeBlock from "../components/StudyCodeBlock";

const toast = `Toast.makeText(
    context,
    "Сохранено",
    Toast.LENGTH_SHORT
).show()`;

const alertDialog = `AlertDialog.Builder(context)
    .setTitle("Удалить?")
    .setMessage("Действие нельзя отменить")
    .setPositiveButton("Удалить") { _, _ -> deleteItem() }
    .setNegativeButton("Отмена", null)
    .show()`;

const snackbar = `Snackbar.make(
    rootView,
    "Изменения сохранены",
    Snackbar.LENGTH_LONG
).setAction("Отменить") {
    undo()
}.show()`;

const dialogFragment = `class ConfirmDialog : DialogFragment() {
    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        return AlertDialog.Builder(requireContext())
            .setTitle("Подтверждение")
            .setMessage("Продолжить?")
            .setPositiveButton("Да", null)
            .setNegativeButton("Нет", null)
            .create()
    }
}`;

export default function AndroidToastDialogSnackbarStudy() {
  return (
    <>
      <header className="study-hero">
        <p className="study-eyebrow">Android · Junior</p>
        <h1 className="study-title">Toast/Dialog/Snackbar</h1>
        <p className="study-lead">
        Toast, Dialog и Snackbar помогают показывать короткие сообщения и запрашивать подтверждение. На junior-уровне важно понимать разницу между ними и выбирать подходящий компонент.
        </p>
      </header>

      <nav className="study-nav" aria-label="Навигация">
        <a className="study-nav-link" href="#toast">Toast</a>
        <a className="study-nav-link" href="#dialog">Dialog</a>
        <a className="study-nav-link" href="#snackbar">Snackbar</a>
        <a className="study-nav-link" href="#fragment">DialogFragment</a>
        <a className="study-nav-link" href="#check">Проверка</a>
      </nav>

      <section id="toast" className="study-section">
        <h2 className="study-section-title">1. Toast</h2>
        <p>
          Toast показывает короткое сообщение, которое исчезает автоматически. Он не блокирует интерфейс.
        </p>
        <StudyCodeBlock code={toast} />
        <div className="study-note">
          <strong>Запомнить:</strong> Toast подходит для простых уведомлений, но не для важных действий.
        </div>
      </section>

      <section id="dialog" className="study-section">
        <h2 className="study-section-title">2. AlertDialog</h2>
        <p>
          Dialog блокирует взаимодействие до выбора пользователя. Его используют для подтверждения или выбора.
        </p>
        <StudyCodeBlock code={alertDialog} />
      </section>

      <section id="snackbar" className="study-section">
        <h2 className="study-section-title">3. Snackbar</h2>
        <p>
          Snackbar показывает сообщение внизу экрана и может содержать действие, например «Отменить».
        </p>
        <StudyCodeBlock code={snackbar} />
      </section>

      <section id="fragment" className="study-section">
        <h2 className="study-section-title">4. DialogFragment</h2>
        <p>
          DialogFragment сохраняет диалог при повороте экрана и лучше вписывается в жизненный цикл.
        </p>
        <StudyCodeBlock code={dialogFragment} />
      </section>

      <section id="comparison" className="study-section">
        <h2 className="study-section-title">5. Как выбрать компонент</h2>
        <div className="study-grid">
          <div className="study-mini">
            <strong className="study-mini-title">Toast</strong>
            Короткое уведомление без действий.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Dialog</strong>
            Подтверждение или выбор.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">Snackbar</strong>
            Сообщение с возможностью отмены.
          </div>
          <div className="study-mini">
            <strong className="study-mini-title">DialogFragment</strong>
            Диалог, устойчивый к пересозданию.
          </div>
        </div>
      </section>

      <section id="check" className="study-section">
        <h2 className="study-section-title">6. Самопроверка</h2>
        <div className="study-checklist">
          <label><input type="checkbox" /> Могу объяснить разницу между Toast и Snackbar.</label>
          <label><input type="checkbox" /> Понимаю, когда нужен Dialog.</label>
          <label><input type="checkbox" /> Знаю, как показать Toast.</label>
          <label><input type="checkbox" /> Понимаю назначение DialogFragment.</label>
          <label><input type="checkbox" /> Могу добавить действие в Snackbar.</label>
        </div>
        <h3 className="study-subtitle">Мини-шпаргалка</h3>
        <table className="study-table">
          <tbody>
            <tr><th>Короткое сообщение</th><td><code>Toast.makeText(...).show()</code></td></tr>
            <tr><th>Подтверждение</th><td><code>AlertDialog.Builder</code></td></tr>
            <tr><th>Сообщение с действием</th><td><code>Snackbar.make(...).setAction(...)</code></td></tr>
            <tr><th>Устойчивый диалог</th><td><code>DialogFragment</code></td></tr>
          </tbody>
        </table>
      </section>

      <footer className="study-footer">
        Учебный конспект для уровня Junior. Примеры ориентированы на Toast, Dialog и Snackbar.
      </footer>
    </>
  );
}
