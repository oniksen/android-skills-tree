<header class="study-hero">
<p class="study-eyebrow">Android · Junior</p>
<h1 class="study-title">Intent</h1>
<p class="study-lead">
Intent — механизм взаимодействия компонентов Android. С его помощью запускают Activity, передают данные и обращаются к системным возможностям. На junior-уровне важно понимать явные и неявные интенты.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#explicit">Явный Intent</a>
<a class="study-nav-link" href="#implicit">Неявный Intent</a>
<a class="study-nav-link" href="#data">Передача данных</a>
<a class="study-nav-link" href="#result">Результат</a>
<a class="study-nav-link" href="#check">Проверка</a>
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
val bundle = Bundle().apply 

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
) 
}

launcher.launch(intent)

```

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
