<header class="study-hero">
<p class="study-eyebrow">Android · Junior</p>
<h1 class="study-title">Activity Lifecycle</h1>
<p class="study-lead">
Жизненный цикл Activity описывает, через какие состояния проходит экран при запуске, сворачивании, повороте и закрытии. На junior-уровне важно понимать основные методы и сохранение состояния.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#methods">Методы</a>
<a class="study-nav-link" href="#flow">Порядок</a>
<a class="study-nav-link" href="#state">Состояние</a>
<a class="study-nav-link" href="#rotation">Поворот</a>
<a class="study-nav-link" href="#check">Проверка</a>
</nav>

<section id="methods" class="study-section">
<h2 class="study-section-title">1. Основные методы</h2>
<p>
Activity проходит через набор callback-методов. Каждый метод отвечает за определённый этап жизни экрана.
</p>

```kotlin
class MainActivity : AppCompatActivity() 

    override fun onStart() 
    override fun onResume() 
    override fun onPause() 
    override fun onStop() 
    override fun onDestroy() 
}

```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>onCreate</code></strong>
Создание Activity и инициализация.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>onStart</code></strong>
Экран становится видимым.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>onResume</code></strong>
Экран активен и принимает ввод.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>onPause</code></strong>
Экран частично виден.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>onStop</code></strong>
Экран больше не виден.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>onDestroy</code></strong>
Activity уничтожается.
</div>
</div>
</section>

<section id="flow" class="study-section">
<h2 class="study-section-title">2. Порядок при запуске</h2>
<div class="study-diagram">
<div class="study-flow">
<div class="study-node"><b>onCreate</b></div>
<div class="study-arrow">→</div>
<div class="study-node"><b>onStart</b></div>
<div class="study-arrow">→</div>
<div class="study-node"><b>onResume</b></div>
</div>
</div>
</section>

<section id="state" class="study-section">
<h2 class="study-section-title">3. Сохранение состояния</h2>
<p>
При пересоздании Activity можно сохранить небольшое состояние через <code>Bundle</code>.
</p>

```kotlin
override fun onSaveInstanceState(outState: Bundle) 

override fun onRestoreInstanceState(savedInstanceState: Bundle) 

```

<div class="study-note">
<strong>Запомнить:</strong> <code>Bundle</code> подходит для небольших данных. Для сложного состояния используют <code>ViewModel</code>.
</div>
</section>

<section id="rotation" class="study-section">
<h2 class="study-section-title">4. Поворот экрана</h2>
<p>
При повороте Activity обычно пересоздаётся. Данные в памяти могут потеряться, если не сохранить их.
</p>

```kotlin
// При повороте Activity пересоздаётся.
// ViewModel помогает сохранить данные.

```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>onSaveInstanceState</code></strong>
Сохраняет небольшое состояние.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>ViewModel</code></strong>
Хранит данные, переживающие пересоздание.
</div>
</div>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">5. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу назвать основные методы жизненного цикла.</label>
<label><input type="checkbox" /> Понимаю порядок при запуске Activity.</label>
<label><input type="checkbox" /> Знаю, как сохранить небольшое состояние.</label>
<label><input type="checkbox" /> Понимаю, что происходит при повороте экрана.</label>
<label><input type="checkbox" /> Знаю назначение ViewModel.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Создание</th><td><code>onCreate</code></td></tr>
<tr><th>Видимость</th><td><code>onStart</code></td></tr>
<tr><th>Активность</th><td><code>onResume</code></td></tr>
<tr><th>Частичная видимость</th><td><code>onPause</code></td></tr>
<tr><th>Невидимость</th><td><code>onStop</code></td></tr>
<tr><th>Уничтожение</th><td><code>onDestroy</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Activity lifecycle.
</footer>
