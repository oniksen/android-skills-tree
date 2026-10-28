<header class="study-hero">
<p class="study-eyebrow">Android · Junior</p>
<h1 class="study-title">Toast/Dialog/Snackbar</h1>
<p class="study-lead">
Toast, Dialog и Snackbar помогают показывать короткие сообщения и запрашивать подтверждение. На junior-уровне важно понимать разницу между ними и выбирать подходящий компонент.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#toast">Toast</a>
<a class="study-nav-link" href="#dialog">Dialog</a>
<a class="study-nav-link" href="#snackbar">Snackbar</a>
<a class="study-nav-link" href="#fragment">DialogFragment</a>
<a class="study-nav-link" href="#check">Проверка</a>
</nav>

<section id="toast" class="study-section">
<h2 class="study-section-title">1. Toast</h2>
<p>
Toast показывает короткое сообщение, которое исчезает автоматически. Он не блокирует интерфейс.
</p>

```kotlin
Toast.makeText(
    context,
    "Сохранено",
    Toast.LENGTH_SHORT
).show()
```

<div class="study-note">
<strong>Запомнить:</strong> Toast подходит для простых уведомлений, но не для важных действий.
</div>
</section>

<section id="dialog" class="study-section">
<h2 class="study-section-title">2. AlertDialog</h2>
<p>
Dialog блокирует взаимодействие до выбора пользователя. Его используют для подтверждения или выбора.
</p>

```kotlin
AlertDialog.Builder(context)
    .setTitle("Удалить?")
    .setMessage("Действие нельзя отменить")
    .setPositiveButton("Удалить") { _, _ -> deleteItem() }
    .setNegativeButton("Отмена", null)
    .show()
```

</section>

<section id="snackbar" class="study-section">
<h2 class="study-section-title">3. Snackbar</h2>
<p>
Snackbar показывает сообщение внизу экрана и может содержать действие, например «Отменить».
</p>

```kotlin
Snackbar.make(
    rootView,
    "Изменения сохранены",
    Snackbar.LENGTH_LONG
).setAction("Отменить") {
    undo()
}.show()
```

</section>

<section id="fragment" class="study-section">
<h2 class="study-section-title">4. DialogFragment</h2>
<p>
DialogFragment сохраняет диалог при повороте экрана и лучше вписывается в жизненный цикл.
</p>

```kotlin
class ConfirmDialog : DialogFragment() {
    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        return AlertDialog.Builder(requireContext())
            .setTitle("Подтверждение")
            .setMessage("Продолжить?")
            .setPositiveButton("Да", null)
            .setNegativeButton("Нет", null)
            .create()
    }
}
```

</section>

<section id="comparison" class="study-section">
<h2 class="study-section-title">5. Как выбрать компонент</h2>
<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Toast</strong>
Короткое уведомление без действий.
</div>
<div class="study-mini">
<strong class="study-mini-title">Dialog</strong>
Подтверждение или выбор.
</div>
<div class="study-mini">
<strong class="study-mini-title">Snackbar</strong>
Сообщение с возможностью отмены.
</div>
<div class="study-mini">
<strong class="study-mini-title">DialogFragment</strong>
Диалог, устойчивый к пересозданию.
</div>
</div>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">6. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу объяснить разницу между Toast и Snackbar.</label>
<label><input type="checkbox" /> Понимаю, когда нужен Dialog.</label>
<label><input type="checkbox" /> Знаю, как показать Toast.</label>
<label><input type="checkbox" /> Понимаю назначение DialogFragment.</label>
<label><input type="checkbox" /> Могу добавить действие в Snackbar.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Короткое сообщение</th><td><code>Toast.makeText(...).show()</code></td></tr>
<tr><th>Подтверждение</th><td><code>AlertDialog.Builder</code></td></tr>
<tr><th>Сообщение с действием</th><td><code>Snackbar.make(...).setAction(...)</code></td></tr>
<tr><th>Устойчивый диалог</th><td><code>DialogFragment</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Toast, Dialog и Snackbar.
</footer>
