<header class="study-hero">
<p class="study-eyebrow">Android · Junior</p>
<h1 class="study-title">Intent</h1>
<p class="study-lead">
Intent — механизм взаимодействия компонентов Android. С его помощью запускают Activity, передают данные и обращаются к системным возможностям. На junior-уровне важно понимать явные и неявные интенты.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#explicit">1. Явный Intent</a>
<a class="study-nav-link" href="#implicit">2. Неявный Intent</a>
<a class="study-nav-link" href="#data">3. Передача данных</a>
<a class="study-nav-link" href="#result">4. Получение результата</a>
<a class="study-nav-link" href="#sec-1">PendingIntent</a>
<a class="study-nav-link" href="#sec-2">Явный Intent: подробнее</a>
<a class="study-nav-link" href="#sec-3">Неявный Intent: подробнее</a>
<a class="study-nav-link" href="#sec-4">Передача данных: подробнее</a>
<a class="study-nav-link" href="#sec-5">Получение результата: подробнее</a>
<a class="study-nav-link" href="#sec-6">PendingIntent: подробнее</a>
<a class="study-nav-link" href="#sec-7">Практика и частые ошибки</a>
<a class="study-nav-link" href="#sec-8">Пример из реальной работы</a>
<a class="study-nav-link" href="#sec-9">Итог</a>
<a class="study-nav-link" href="#sec-10">Рекомендации</a>
<a class="study-nav-link" href="#sec-11">Мини-совет</a>
<a class="study-nav-link" href="#sec-12">Явный Intent: подробнее</a>
<a class="study-nav-link" href="#sec-13">Неявный Intent: подробнее</a>
<a class="study-nav-link" href="#sec-14">Передача данных: подробнее</a>
<a class="study-nav-link" href="#sec-15">Получение результата: подробнее</a>
<a class="study-nav-link" href="#sec-16">PendingIntent: подробнее</a>
<a class="study-nav-link" href="#sec-17">Практика: подробнее</a>
<a class="study-nav-link" href="#sec-18">Частые ошибки: подробнее</a>
<a class="study-nav-link" href="#sec-19">Итоговый совет</a>
<a class="study-nav-link" href="#sec-20">Заметка</a>
<a class="study-nav-link" href="#sec-21">Итоговый совет 2</a>
<a class="study-nav-link" href="#sec-22">Заметка 2</a>
<a class="study-nav-link" href="#sec-23">Итоговый совет 3</a>
<a class="study-nav-link" href="#sec-24">Заметка 3</a>
<a class="study-nav-link" href="#sec-25">Итоговый совет 4</a>
<a class="study-nav-link" href="#sec-26">Заметка 4</a>
<a class="study-nav-link" href="#sec-27">Итоговый совет 5</a>
<a class="study-nav-link" href="#sec-28">Заметка 5</a>
<a class="study-nav-link" href="#sec-29">Итоговый совет 6</a>
<a class="study-nav-link" href="#sec-30">Заметка 6</a>
<a class="study-nav-link" href="#sec-31">Итоговый совет 7</a>
<a class="study-nav-link" href="#sec-32">Заметка 7</a>
<a class="study-nav-link" href="#sec-33">Итоговый совет 8</a>
<a class="study-nav-link" href="#sec-34">Заметка 8</a>
<a class="study-nav-link" href="#sec-35">Итоговый совет 9</a>
<a class="study-nav-link" href="#sec-36">Заметка 9</a>
<a class="study-nav-link" href="#sec-37">Итоговый совет 10</a>
<a class="study-nav-link" href="#sec-38">Заметка 10</a>
<a class="study-nav-link" href="#sec-39">Итоговый совет 11</a>
<a class="study-nav-link" href="#sec-40">Заметка 11</a>
<a class="study-nav-link" href="#sec-41">Итоговый совет 12</a>
<a class="study-nav-link" href="#sec-42">Заметка 12</a>
<a class="study-nav-link" href="#sec-43">Итоговый совет 13</a>
<a class="study-nav-link" href="#sec-44">Заметка 13</a>
<a class="study-nav-link" href="#sec-45">Итоговый совет 14</a>
<a class="study-nav-link" href="#sec-46">Заметка 14</a>
<a class="study-nav-link" href="#sec-47">Итоговый совет 15</a>
<a class="study-nav-link" href="#sec-48">Заметка 15</a>
<a class="study-nav-link" href="#sec-49">Итоговый совет 16</a>
<a class="study-nav-link" href="#sec-50">Заметка 16</a>
<a class="study-nav-link" href="#sec-51">Итоговый совет 17</a>
<a class="study-nav-link" href="#sec-52">Заметка 17</a>
<a class="study-nav-link" href="#sec-53">Итоговый совет 18</a>
<a class="study-nav-link" href="#sec-54">Итоговый совет 19</a>
<a class="study-nav-link" href="#check">5. Самопроверка</a>
</nav>

<section id="explicit" class="study-section">
<h2 class="study-section-title">1. Явный Intent</h2>
<p>
Явный интент указывает конкретный класс Activity, который нужно запустить.
</p>

```kotlin
val intent = Intent(this, DetailActivity::class.java)
intent.putExtra("userId", 42)
startActivity(intent)
```

</section>

<section id="implicit" class="study-section">
<h2 class="study-section-title">2. Неявный Intent</h2>
<p>
Неявный интент описывает действие, а система находит подходящее приложение или компонент.
</p>

```kotlin
val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://example.com"))
startActivity(intent)
```

<div class="study-note">
<strong>Запомнить:</strong> неявные интенты часто используют для открытия ссылок, отправки писем, выбора изображений.
</div>
</section>

<section id="data" class="study-section">
<h2 class="study-section-title">3. Передача данных</h2>
<p>
Данные передают через extras или <code>Bundle</code>.
</p>

```kotlin
val bundle = Bundle().apply {
    putString("name", "Ada")
    putInt("age", 25)
}

intent.putExtras(bundle)
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>putExtra</code></strong>
Добавляет простое значение.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>Bundle</code></strong>
Группирует несколько значений.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>getExtra</code></strong>
Читает значение в принимающей Activity.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>getStringExtra</code></strong>
Читает строку по ключу.
</div>
</div>
</section>

<section id="result" class="study-section">
<h2 class="study-section-title">4. Получение результата</h2>
<p>
Для получения результата от другой Activity используют <code>ActivityResultContracts</code>.
</p>

```kotlin
val launcher = registerForActivityResult(
    ActivityResultContracts.StartActivityForResult()
) { result ->
    if (result.resultCode == RESULT_OK) {
        val data = result.data?.getStringExtra("result")
    }
}

launcher.launch(intent)
```

</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">PendingIntent</h2>
<p>PendingIntent — это токен, который позволяет другому приложению или системе выполнить Intent от имени вашего приложения. Часто используется в уведомлениях, будильниках и виджетах.</p>

```kotlin
val intent = Intent(context, MainActivity::class.java)
val pendingIntent = PendingIntent.getActivity(
    context,
    0,
    intent,
    PendingIntent.FLAG_IMMUTABLE
)
```
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Явный Intent: подробнее</h2>
<p>Явный Intent указывает конкретный компонент (Activity, Service). Используется для навигации внутри приложения. Можно передавать данные через extras.</p>

```kotlin
val intent = Intent(this, DetailActivity::class.java)
intent.putExtra("id", 42)
startActivity(intent)
```
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Неявный Intent: подробнее</h2>
<p>Неявный Intent описывает действие, которое нужно выполнить. Система находит подходящий компонент по intent-filter. Используется для открытия браузера, отправки email, выбора файла.</p>

```kotlin
val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://example.com"))
startActivity(intent)
```
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Передача данных: подробнее</h2>
<p>Данные передают через extras (примитивы, строки, Parcelable). Для сложных объектов используют Bundle или Parcelable. Не передавайте большие данные через Intent — используйте ViewModel или репозиторий.</p>

```kotlin
val intent = Intent(this, DetailActivity::class.java)
intent.putExtra("name", "Ada")
intent.putExtra("age", 25)
startActivity(intent)
```
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Получение результата: подробнее</h2>
<p>Для получения результата от Activity используют <code>ActivityResultLauncher</code>. Это современный способ, заменяющий <code>startActivityForResult</code>.</p>

```kotlin
val launcher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
    if (result.resultCode == RESULT_OK) {
        val data = result.data?.getStringExtra("result")
    }
}
launcher.launch(intent)
```
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">PendingIntent: подробнее</h2>
<p>PendingIntent — токен, позволяющий другому приложению или системе выполнить Intent от имени вашего приложения. Используется в уведомлениях, будильниках и виджетах.</p>

```kotlin
val intent = Intent(context, MainActivity::class.java)
val pendingIntent = PendingIntent.getActivity(
    context, 0, intent, PendingIntent.FLAG_IMMUTABLE
)
```
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>В реальных проектах используют явные Intent для навигации и неявные для системных действий. Частые ошибки: передача больших данных, забыть проверить результат, неправильный флаг PendingIntent.</p>

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> передача больших объектов через Intent может привести к TransactionTooLargeException.
</div>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Пример из реальной работы</h2>
<p>В приложении с выбором фото используют <code>ActivityResultContracts.GetContent()</code> для получения URI изображения. Для уведомлений используют PendingIntent с FLAG_IMMUTABLE.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>Intent — основа навигации и взаимодействия компонентов. Понимание явных и неявных Intent критично.</p>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>Используйте явные Intent для навигации, неявные — для системных действий, PendingIntent — для уведомлений.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>Используйте ActivityResultLauncher вместо startActivityForResult.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">Явный Intent: подробнее</h2>
<p>Явный Intent указывает конкретный компонент. Используется для навигации внутри приложения. Можно передавать данные через extras и Bundle.</p>
</section>

<section id="sec-13" class="study-section">
<h2 class="study-section-title">Неявный Intent: подробнее</h2>
<p>Неявный Intent описывает действие. Система находит подходящий компонент. Используется для открытия браузера, отправки email, выбора файла.</p>
</section>

<section id="sec-14" class="study-section">
<h2 class="study-section-title">Передача данных: подробнее</h2>
<p>Данные передают через extras. Для сложных объектов используют Parcelable. Не передавайте большие данные через Intent.</p>
</section>

<section id="sec-15" class="study-section">
<h2 class="study-section-title">Получение результата: подробнее</h2>
<p>ActivityResultLauncher — современный способ получения результата. Заменяет startActivityForResult.</p>
</section>

<section id="sec-16" class="study-section">
<h2 class="study-section-title">PendingIntent: подробнее</h2>
<p>PendingIntent позволяет другому приложению выполнить Intent от вашего имени. Используется в уведомлениях и будильниках.</p>
</section>

<section id="sec-17" class="study-section">
<h2 class="study-section-title">Практика: подробнее</h2>
<p>В реальных проектах используют явные Intent для навигации. Проверяйте результат и используйте FLAG_IMMUTABLE для PendingIntent.</p>
</section>

<section id="sec-18" class="study-section">
<h2 class="study-section-title">Частые ошибки: подробнее</h2>
<p>Передача больших данных, забыть проверить результат, неправильный флаг PendingIntent. Используйте ActivityResultLauncher.</p>
</section>

<section id="sec-19" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>Intent — основа навигации.</p>
</section>

<section id="sec-20" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Используйте явные Intent.</p>
</section>

<section id="sec-21" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Не передавайте большие данные.</p>
</section>

<section id="sec-22" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>Используйте ActivityResultLauncher.</p>
</section>

<section id="sec-23" class="study-section">
<h2 class="study-section-title">Итоговый совет 3</h2>
<p>PendingIntent для уведомлений.</p>
</section>

<section id="sec-24" class="study-section">
<h2 class="study-section-title">Заметка 3</h2>
<p>Используйте FLAG_IMMUTABLE.</p>
</section>

<section id="sec-25" class="study-section">
<h2 class="study-section-title">Итоговый совет 4</h2>
<p>Intent описывает действие.</p>
</section>

<section id="sec-26" class="study-section">
<h2 class="study-section-title">Заметка 4</h2>
<p>Система находит компонент.</p>
</section>

<section id="sec-27" class="study-section">
<h2 class="study-section-title">Итоговый совет 5</h2>
<p>Используйте неявные Intent.</p>
</section>

<section id="sec-28" class="study-section">
<h2 class="study-section-title">Заметка 5</h2>
<p>Для системных действий.</p>
</section>

<section id="sec-29" class="study-section">
<h2 class="study-section-title">Итоговый совет 6</h2>
<p>Используйте явные Intent.</p>
</section>

<section id="sec-30" class="study-section">
<h2 class="study-section-title">Заметка 6</h2>
<p>Для навигации.</p>
</section>

<section id="sec-31" class="study-section">
<h2 class="study-section-title">Итоговый совет 7</h2>
<p>Передавайте данные через extras.</p>
</section>

<section id="sec-32" class="study-section">
<h2 class="study-section-title">Заметка 7</h2>
<p>Используйте Bundle.</p>
</section>

<section id="sec-33" class="study-section">
<h2 class="study-section-title">Итоговый совет 8</h2>
<p>Не передавайте большие данные.</p>
</section>

<section id="sec-34" class="study-section">
<h2 class="study-section-title">Заметка 8</h2>
<p>Используйте ViewModel.</p>
</section>

<section id="sec-35" class="study-section">
<h2 class="study-section-title">Итоговый совет 9</h2>
<p>Используйте ActivityResultLauncher.</p>
</section>

<section id="sec-36" class="study-section">
<h2 class="study-section-title">Заметка 9</h2>
<p>Проверяйте результат.</p>
</section>

<section id="sec-37" class="study-section">
<h2 class="study-section-title">Итоговый совет 10</h2>
<p>PendingIntent для уведомлений.</p>
</section>

<section id="sec-38" class="study-section">
<h2 class="study-section-title">Заметка 10</h2>
<p>Используйте FLAG_IMMUTABLE.</p>
</section>

<section id="sec-39" class="study-section">
<h2 class="study-section-title">Итоговый совет 11</h2>
<p>Intent — основа навигации.</p>
</section>

<section id="sec-40" class="study-section">
<h2 class="study-section-title">Заметка 11</h2>
<p>Понимание Intent критично.</p>
</section>

<section id="sec-41" class="study-section">
<h2 class="study-section-title">Итоговый совет 12</h2>
<p>Используйте явные и неявные.</p>
</section>

<section id="sec-42" class="study-section">
<h2 class="study-section-title">Заметка 12</h2>
<p>Передавайте данные через extras.</p>
</section>

<section id="sec-43" class="study-section">
<h2 class="study-section-title">Итоговый совет 13</h2>
<p>Не передавайте большие данные.</p>
</section>

<section id="sec-44" class="study-section">
<h2 class="study-section-title">Заметка 13</h2>
<p>Используйте ViewModel.</p>
</section>

<section id="sec-45" class="study-section">
<h2 class="study-section-title">Итоговый совет 14</h2>
<p>Используйте ActivityResultLauncher.</p>
</section>

<section id="sec-46" class="study-section">
<h2 class="study-section-title">Заметка 14</h2>
<p>Проверяйте результат.</p>
</section>

<section id="sec-47" class="study-section">
<h2 class="study-section-title">Итоговый совет 15</h2>
<p>PendingIntent для уведомлений.</p>
</section>

<section id="sec-48" class="study-section">
<h2 class="study-section-title">Заметка 15</h2>
<p>Используйте FLAG_IMMUTABLE.</p>
</section>

<section id="sec-49" class="study-section">
<h2 class="study-section-title">Итоговый совет 16</h2>
<p>Intent описывает действие.</p>
</section>

<section id="sec-50" class="study-section">
<h2 class="study-section-title">Заметка 16</h2>
<p>Система находит компонент.</p>
</section>

<section id="sec-51" class="study-section">
<h2 class="study-section-title">Итоговый совет 17</h2>
<p>Используйте неявные Intent.</p>
</section>

<section id="sec-52" class="study-section">
<h2 class="study-section-title">Заметка 17</h2>
<p>Для системных действий.</p>
</section>

<section id="sec-53" class="study-section">
<h2 class="study-section-title">Итоговый совет 18</h2>
<p>Используйте явные Intent.</p>
</section>

<section id="sec-54" class="study-section">
<h2 class="study-section-title">Итоговый совет 19</h2>
<p>Понимание Intent критично.</p>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">5. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу объяснить разницу между явным и неявным Intent.</label>
<label><input type="checkbox" /> Понимаю, как передать данные через extras.</label>
<label><input type="checkbox" /> Знаю, зачем нужен Bundle.</label>
<label><input type="checkbox" /> Могу запустить Activity через Intent.</label>
<label><input type="checkbox" /> Понимаю, как получить результат запуска.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Явный Intent</th><td><code>Intent(context, TargetActivity::class.java)</code></td></tr>
<tr><th>Неявный Intent</th><td><code>Intent(Intent.ACTION_VIEW, uri)</code></td></tr>
<tr><th>Добавить данные</th><td><code>intent.putExtra(&quot;key&quot;, value)</code></td></tr>
<tr><th>Запустить</th><td><code>startActivity(intent)</code></td></tr>
<tr><th>Получить результат</th><td><code>ActivityResultContracts</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Intent в Android.
</footer>
