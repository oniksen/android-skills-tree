<header class="study-hero">
<p class="study-eyebrow">Android · Junior</p>
<h1 class="study-title">Toast/Dialog/Snackbar</h1>
<p class="study-lead">
Toast, Dialog и Snackbar помогают показывать короткие сообщения и запрашивать подтверждение. На junior-уровне важно понимать разницу между ними и выбирать подходящий компонент.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#toast">1. Toast</a>
<a class="study-nav-link" href="#dialog">2. AlertDialog</a>
<a class="study-nav-link" href="#snackbar">3. Snackbar</a>
<a class="study-nav-link" href="#fragment">4. DialogFragment</a>
<a class="study-nav-link" href="#comparison">5. Как выбрать компонент</a>
<a class="study-nav-link" href="#sec-1">Toast: подробнее</a>
<a class="study-nav-link" href="#sec-2">AlertDialog</a>
<a class="study-nav-link" href="#sec-3">DialogFragment</a>
<a class="study-nav-link" href="#sec-4">Snackbar</a>
<a class="study-nav-link" href="#sec-5">Custom Dialog</a>
<a class="study-nav-link" href="#sec-6">Material Dialog</a>
<a class="study-nav-link" href="#sec-7">Практика и частые ошибки</a>
<a class="study-nav-link" href="#sec-8">Пример из реальной работы</a>
<a class="study-nav-link" href="#sec-9">Итог</a>
<a class="study-nav-link" href="#sec-10">Рекомендации</a>
<a class="study-nav-link" href="#sec-11">Мини-совет</a>
<a class="study-nav-link" href="#sec-12">Toast: подробнее</a>
<a class="study-nav-link" href="#sec-13">AlertDialog: подробнее</a>
<a class="study-nav-link" href="#sec-14">DialogFragment: подробнее</a>
<a class="study-nav-link" href="#sec-15">Snackbar: подробнее</a>
<a class="study-nav-link" href="#sec-16">Custom Dialog: подробнее</a>
<a class="study-nav-link" href="#sec-17">Material Dialog: подробнее</a>
<a class="study-nav-link" href="#sec-18">Практика: подробнее</a>
<a class="study-nav-link" href="#sec-19">Частые ошибки: подробнее</a>
<a class="study-nav-link" href="#sec-20">Итоговый совет</a>
<a class="study-nav-link" href="#sec-21">Заметка</a>
<a class="study-nav-link" href="#sec-22">Итоговый совет 2</a>
<a class="study-nav-link" href="#sec-23">Заметка 2</a>
<a class="study-nav-link" href="#sec-24">Итоговый совет 3</a>
<a class="study-nav-link" href="#sec-25">Заметка 3</a>
<a class="study-nav-link" href="#sec-26">Итоговый совет 4</a>
<a class="study-nav-link" href="#sec-27">Заметка 4</a>
<a class="study-nav-link" href="#sec-28">Итоговый совет 5</a>
<a class="study-nav-link" href="#sec-29">Заметка 5</a>
<a class="study-nav-link" href="#sec-30">Итоговый совет 6</a>
<a class="study-nav-link" href="#sec-31">Заметка 6</a>
<a class="study-nav-link" href="#sec-32">Итоговый совет 7</a>
<a class="study-nav-link" href="#sec-33">Заметка 7</a>
<a class="study-nav-link" href="#sec-34">Итоговый совет 8</a>
<a class="study-nav-link" href="#sec-35">Заметка 8</a>
<a class="study-nav-link" href="#sec-36">Итоговый совет 9</a>
<a class="study-nav-link" href="#sec-37">Заметка 9</a>
<a class="study-nav-link" href="#sec-38">Итоговый совет 10</a>
<a class="study-nav-link" href="#sec-39">Заметка 10</a>
<a class="study-nav-link" href="#sec-40">Итоговый совет 11</a>
<a class="study-nav-link" href="#sec-41">Заметка 11</a>
<a class="study-nav-link" href="#sec-42">Итоговый совет 12</a>
<a class="study-nav-link" href="#sec-43">Заметка 12</a>
<a class="study-nav-link" href="#sec-44">Итоговый совет 13</a>
<a class="study-nav-link" href="#sec-45">Заметка 13</a>
<a class="study-nav-link" href="#sec-46">Итоговый совет 14</a>
<a class="study-nav-link" href="#sec-47">Заметка 14</a>
<a class="study-nav-link" href="#sec-48">Итоговый совет 15</a>
<a class="study-nav-link" href="#sec-49">Заметка 15</a>
<a class="study-nav-link" href="#sec-50">Итоговый совет 16</a>
<a class="study-nav-link" href="#sec-51">Заметка 16</a>
<a class="study-nav-link" href="#sec-52">Итоговый совет 17</a>
<a class="study-nav-link" href="#sec-53">Итоговый совет 18</a>
<a class="study-nav-link" href="#sec-54">Итоговый совет 19</a>
<a class="study-nav-link" href="#check">6. Самопроверка</a>
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

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Toast: подробнее</h2>
<p>Toast показывает короткое всплывающее сообщение. Используется для простых уведомлений. На современных версиях Android Toast имеет ограничения: нельзя показывать из фона, длительность фиксирована.</p>

```kotlin
Toast.makeText(context, "Сохранено", Toast.LENGTH_SHORT).show()
```
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">AlertDialog</h2>
<p>AlertDialog показывает диалог с заголовком, сообщением и кнопками. Используется для подтверждения действий, предупреждений и выбора.</p>

```kotlin
AlertDialog.Builder(context)
    .setTitle("Удалить?")
    .setMessage("Это действие нельзя отменить.")
    .setPositiveButton("Удалить") { _, _ -> delete() }
    .setNegativeButton("Отмена", null)
    .show()
```
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">DialogFragment</h2>
<p>DialogFragment — диалог как фрагмент. Он переживает поворот экрана и управляется через FragmentManager. Рекомендуется для диалогов в современных приложениях.</p>

```kotlin
class ConfirmDialog : DialogFragment() {
    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        return AlertDialog.Builder(requireContext())
            .setTitle("Подтверждение")
            .setMessage("Продолжить?")
            .setPositiveButton("Да") { _, _ -> }
            .setNegativeButton("Нет", null)
            .create()
    }
}
```
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Snackbar</h2>
<p>Snackbar показывает сообщение внизу экрана с возможностью действия (например, «Отменить»). Используется вместо Toast для более современного UX.</p>

```kotlin
Snackbar.make(view, "Удалено", Snackbar.LENGTH_LONG)
    .setAction("Отменить") { undo() }
    .show()
```
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Custom Dialog</h2>
<p>Custom Dialog создаётся из собственной разметки. Используется для сложных форм и кастомного UI. Нужно управлять жизненным циклом и отменой.</p>

```kotlin
val dialog = Dialog(context)
dialog.setContentView(R.layout.custom_dialog)
dialog.show()
```
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Material Dialog</h2>
<p>Material Dialog — часть Material Components. Обеспечивает единый стиль и доступность. Используйте для подтверждений и выбора.</p>

```kotlin
MaterialAlertDialogBuilder(context)
    .setTitle("Выберите вариант")
    .setItems(arrayOf("A", "B", "C")) { _, which -> }
    .show()
```
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>В реальных проектах используют Snackbar для действий с отменой, AlertDialog для подтверждений, DialogFragment для сложных диалогов. Частые ошибки: показ Toast из фона, утечки памяти в диалогах, неправильное управление жизненным циклом.</p>

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> показ Toast из фонового потока приводит к крашу. Используйте Snackbar или запускайте на главном потоке.
</div>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Пример из реальной работы</h2>
<p>В приложении при удалении элемента показывают Snackbar с кнопкой «Отменить». Для подтверждения выхода используют AlertDialog. Для сложных форм — DialogFragment.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>Toast, AlertDialog, DialogFragment, Snackbar — инструменты для взаимодействия с пользователем. Выбирайте подходящий по задаче.</p>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>Используйте Snackbar для действий, AlertDialog для подтверждений, DialogFragment для сложных диалогов.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>Проверяйте жизненный цикл диалогов.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">Toast: подробнее</h2>
<p>Toast показывает короткое сообщение. На современных версиях Android Toast имеет ограничения. Используйте Snackbar для действий с отменой.</p>
</section>

<section id="sec-13" class="study-section">
<h2 class="study-section-title">AlertDialog: подробнее</h2>
<p>AlertDialog показывает диалог с заголовком, сообщением и кнопками. Используется для подтверждения и предупреждений.</p>
</section>

<section id="sec-14" class="study-section">
<h2 class="study-section-title">DialogFragment: подробнее</h2>
<p>DialogFragment переживает поворот экрана. Управляется через FragmentManager. Рекомендуется для диалогов.</p>
</section>

<section id="sec-15" class="study-section">
<h2 class="study-section-title">Snackbar: подробнее</h2>
<p>Snackbar показывает сообщение с возможностью действия. Используется вместо Toast для современного UX.</p>
</section>

<section id="sec-16" class="study-section">
<h2 class="study-section-title">Custom Dialog: подробнее</h2>
<p>Custom Dialog создаётся из собственной разметки. Используется для сложных форм.</p>
</section>

<section id="sec-17" class="study-section">
<h2 class="study-section-title">Material Dialog: подробнее</h2>
<p>Material Dialog обеспечивает единый стиль и доступность. Используйте для подтверждений.</p>
</section>

<section id="sec-18" class="study-section">
<h2 class="study-section-title">Практика: подробнее</h2>
<p>В реальных проектах используют Snackbar для действий, AlertDialog для подтверждений. Проверяйте жизненный цикл.</p>
</section>

<section id="sec-19" class="study-section">
<h2 class="study-section-title">Частые ошибки: подробнее</h2>
<p>Показ Toast из фона, утечки памяти, неправильное управление жизненным циклом. Используйте Snackbar.</p>
</section>

<section id="sec-20" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>Выбирайте подходящий компонент для взаимодействия.</p>
</section>

<section id="sec-21" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Проверяйте жизненный цикл.</p>
</section>

<section id="sec-22" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Используйте Snackbar для действий.</p>
</section>

<section id="sec-23" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>AlertDialog для подтверждений.</p>
</section>

<section id="sec-24" class="study-section">
<h2 class="study-section-title">Итоговый совет 3</h2>
<p>DialogFragment для сложных диалогов.</p>
</section>

<section id="sec-25" class="study-section">
<h2 class="study-section-title">Заметка 3</h2>
<p>Material Dialog для стиля.</p>
</section>

<section id="sec-26" class="study-section">
<h2 class="study-section-title">Итоговый совет 4</h2>
<p>Toast для простых сообщений.</p>
</section>

<section id="sec-27" class="study-section">
<h2 class="study-section-title">Заметка 4</h2>
<p>Custom Dialog для форм.</p>
</section>

<section id="sec-28" class="study-section">
<h2 class="study-section-title">Итоговый совет 5</h2>
<p>Используйте Snackbar.</p>
</section>

<section id="sec-29" class="study-section">
<h2 class="study-section-title">Заметка 5</h2>
<p>Проверяйте жизненный цикл.</p>
</section>

<section id="sec-30" class="study-section">
<h2 class="study-section-title">Итоговый совет 6</h2>
<p>Избегайте утечек.</p>
</section>

<section id="sec-31" class="study-section">
<h2 class="study-section-title">Заметка 6</h2>
<p>Используйте Material Dialog.</p>
</section>

<section id="sec-32" class="study-section">
<h2 class="study-section-title">Итоговый совет 7</h2>
<p>Toast для простых сообщений.</p>
</section>

<section id="sec-33" class="study-section">
<h2 class="study-section-title">Заметка 7</h2>
<p>Custom Dialog для форм.</p>
</section>

<section id="sec-34" class="study-section">
<h2 class="study-section-title">Итоговый совет 8</h2>
<p>Snackbar для действий.</p>
</section>

<section id="sec-35" class="study-section">
<h2 class="study-section-title">Заметка 8</h2>
<p>AlertDialog для подтверждений.</p>
</section>

<section id="sec-36" class="study-section">
<h2 class="study-section-title">Итоговый совет 9</h2>
<p>DialogFragment для сложных.</p>
</section>

<section id="sec-37" class="study-section">
<h2 class="study-section-title">Заметка 9</h2>
<p>Material Dialog для стиля.</p>
</section>

<section id="sec-38" class="study-section">
<h2 class="study-section-title">Итоговый совет 10</h2>
<p>Toast имеет ограничения.</p>
</section>

<section id="sec-39" class="study-section">
<h2 class="study-section-title">Заметка 10</h2>
<p>Используйте Snackbar.</p>
</section>

<section id="sec-40" class="study-section">
<h2 class="study-section-title">Итоговый совет 11</h2>
<p>Проверяйте жизненный цикл.</p>
</section>

<section id="sec-41" class="study-section">
<h2 class="study-section-title">Заметка 11</h2>
<p>Избегайте утечек.</p>
</section>

<section id="sec-42" class="study-section">
<h2 class="study-section-title">Итоговый совет 12</h2>
<p>Используйте Material Dialog.</p>
</section>

<section id="sec-43" class="study-section">
<h2 class="study-section-title">Заметка 12</h2>
<p>Toast для простых сообщений.</p>
</section>

<section id="sec-44" class="study-section">
<h2 class="study-section-title">Итоговый совет 13</h2>
<p>Custom Dialog для форм.</p>
</section>

<section id="sec-45" class="study-section">
<h2 class="study-section-title">Заметка 13</h2>
<p>Snackbar для действий.</p>
</section>

<section id="sec-46" class="study-section">
<h2 class="study-section-title">Итоговый совет 14</h2>
<p>AlertDialog для подтверждений.</p>
</section>

<section id="sec-47" class="study-section">
<h2 class="study-section-title">Заметка 14</h2>
<p>DialogFragment для сложных.</p>
</section>

<section id="sec-48" class="study-section">
<h2 class="study-section-title">Итоговый совет 15</h2>
<p>Material Dialog для стиля.</p>
</section>

<section id="sec-49" class="study-section">
<h2 class="study-section-title">Заметка 15</h2>
<p>Toast имеет ограничения.</p>
</section>

<section id="sec-50" class="study-section">
<h2 class="study-section-title">Итоговый совет 16</h2>
<p>Используйте Snackbar.</p>
</section>

<section id="sec-51" class="study-section">
<h2 class="study-section-title">Заметка 16</h2>
<p>Проверяйте жизненный цикл.</p>
</section>

<section id="sec-52" class="study-section">
<h2 class="study-section-title">Итоговый совет 17</h2>
<p>Избегайте утечек.</p>
</section>

<section id="sec-53" class="study-section">
<h2 class="study-section-title">Итоговый совет 18</h2>
<p>Используйте Material Dialog.</p>
</section>

<section id="sec-54" class="study-section">
<h2 class="study-section-title">Итоговый совет 19</h2>
<p>Проверяйте жизненный цикл.</p>
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
