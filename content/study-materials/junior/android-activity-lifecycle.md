<header class="study-hero">
<p class="study-eyebrow">Android · Junior</p>
<h1 class="study-title">Activity Lifecycle</h1>
<p class="study-lead">
Жизненный цикл Activity описывает, через какие состояния проходит экран при запуске, сворачивании, повороте и закрытии. На junior-уровне важно понимать основные методы и сохранение состояния.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#methods">1. Основные методы</a>
<a class="study-nav-link" href="#flow">2. Порядок при запуске</a>
<a class="study-nav-link" href="#state">3. Сохранение состояния</a>
<a class="study-nav-link" href="#rotation">4. Поворот экрана</a>
<a class="study-nav-link" href="#sec-1">Process Death</a>
<a class="study-nav-link" href="#sec-2">Основные методы: подробнее</a>
<a class="study-nav-link" href="#sec-3">Порядок при запуске</a>
<a class="study-nav-link" href="#sec-4">Сохранение состояния</a>
<a class="study-nav-link" href="#sec-5">Поворот экрана</a>
<a class="study-nav-link" href="#sec-6">Process Death</a>
<a class="study-nav-link" href="#sec-7">Практика и частые ошибки</a>
<a class="study-nav-link" href="#sec-8">Пример из реальной работы</a>
<a class="study-nav-link" href="#sec-9">Итог</a>
<a class="study-nav-link" href="#sec-10">Рекомендации</a>
<a class="study-nav-link" href="#sec-11">Мини-совет</a>
<a class="study-nav-link" href="#sec-12">Методы: подробнее</a>
<a class="study-nav-link" href="#sec-13">Process Death: подробнее</a>
<a class="study-nav-link" href="#sec-14">Практика: подробнее</a>
<a class="study-nav-link" href="#sec-15">Частые ошибки: подробнее</a>
<a class="study-nav-link" href="#sec-16">Итоговый совет</a>
<a class="study-nav-link" href="#sec-17">Заметка</a>
<a class="study-nav-link" href="#sec-18">Итоговый совет 2</a>
<a class="study-nav-link" href="#sec-19">Заметка 2</a>
<a class="study-nav-link" href="#sec-20">Итоговый совет 3</a>
<a class="study-nav-link" href="#sec-21">Заметка 3</a>
<a class="study-nav-link" href="#sec-22">Итоговый совет 4</a>
<a class="study-nav-link" href="#sec-23">Заметка 4</a>
<a class="study-nav-link" href="#sec-24">Итоговый совет 5</a>
<a class="study-nav-link" href="#sec-25">Заметка 5</a>
<a class="study-nav-link" href="#sec-26">Итоговый совет 6</a>
<a class="study-nav-link" href="#sec-27">Заметка 6</a>
<a class="study-nav-link" href="#sec-28">Итоговый совет 7</a>
<a class="study-nav-link" href="#sec-29">Заметка 7</a>
<a class="study-nav-link" href="#sec-30">Итоговый совет 8</a>
<a class="study-nav-link" href="#sec-31">Заметка 8</a>
<a class="study-nav-link" href="#sec-32">Итоговый совет 9</a>
<a class="study-nav-link" href="#sec-33">Заметка 9</a>
<a class="study-nav-link" href="#sec-34">Итоговый совет 10</a>
<a class="study-nav-link" href="#sec-35">Заметка 10</a>
<a class="study-nav-link" href="#sec-36">Итоговый совет 11</a>
<a class="study-nav-link" href="#sec-37">Заметка 11</a>
<a class="study-nav-link" href="#sec-38">Итоговый совет 12</a>
<a class="study-nav-link" href="#sec-39">Заметка 12</a>
<a class="study-nav-link" href="#sec-40">Итоговый совет 13</a>
<a class="study-nav-link" href="#sec-41">Заметка 13</a>
<a class="study-nav-link" href="#sec-42">Итоговый совет 14</a>
<a class="study-nav-link" href="#sec-43">Заметка 14</a>
<a class="study-nav-link" href="#sec-44">Итоговый совет 15</a>
<a class="study-nav-link" href="#sec-45">Заметка 15</a>
<a class="study-nav-link" href="#sec-46">Итоговый совет 16</a>
<a class="study-nav-link" href="#sec-47">Заметка 16</a>
<a class="study-nav-link" href="#sec-48">Итоговый совет 17</a>
<a class="study-nav-link" href="#sec-49">Заметка 17</a>
<a class="study-nav-link" href="#sec-50">Итоговый совет 18</a>
<a class="study-nav-link" href="#sec-51">Заметка 18</a>
<a class="study-nav-link" href="#sec-52">Итоговый совет 19</a>
<a class="study-nav-link" href="#check">5. Самопроверка</a>
</nav>

<section id="methods" class="study-section">
<h2 class="study-section-title">1. Основные методы</h2>
<p>
Activity проходит через набор callback-методов. Каждый метод отвечает за определённый этап жизни экрана.
</p>

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
    }

    override fun onStart() { super.onStart() }
    override fun onResume() { super.onResume() }
    override fun onPause() { super.onPause() }
    override fun onStop() { super.onStop() }
    override fun onDestroy() { super.onDestroy() }
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
override fun onSaveInstanceState(outState: Bundle) {
    super.onSaveInstanceState(outState)
    outState.putString("username", username)
}

override fun onRestoreInstanceState(savedInstanceState: Bundle) {
    super.onRestoreInstanceState(savedInstanceState)
    username = savedInstanceState.getString("username")
}
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

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Process Death</h2>
<p>Система может завершить процесс приложения в фоне при нехватке памяти. При следующем запуске состояние восстанавливают из сохранённых данных (saved state, база данных, DataStore), а не из оперативной памяти.</p>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Основные методы: подробнее</h2>
<p>Жизненный цикл Activity состоит из методов: <code>onCreate</code>, <code>onStart</code>, <code>onResume</code>, <code>onPause</code>, <code>onStop</code>, <code>onDestroy</code>. Каждый метод вызывается в определённый момент. Понимание порядка критично для корректной работы приложения.</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Порядок при запуске</h2>
<p>При запуске Activity вызываются <code>onCreate</code> → <code>onStart</code> → <code>onResume</code>. В <code>onCreate</code> инициализируют UI и данные, в <code>onResume</code> — возобновляют анимации и сенсоры.</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Сохранение состояния</h2>
<p><code>onSaveInstanceState</code> вызывается перед уничтожением Activity. В нём сохраняют данные в Bundle. В <code>onCreate</code> или <code>onRestoreInstanceState</code> восстанавливают состояние.</p>

```kotlin
override fun onSaveInstanceState(outState: Bundle) {
    super.onSaveInstanceState(outState)
    outState.putString("key", value)
}
```
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Поворот экрана</h2>
<p>При повороте Activity уничтожается и создаётся заново. Данные сохраняют через <code>onSaveInstanceState</code> или ViewModel. ViewModel переживает поворот экрана.</p>
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Process Death</h2>
<p>Система может завершить процесс приложения в фоне при нехватке памяти. При следующем запуске состояние восстанавливают из сохранённых данных (saved state, база данных, DataStore), а не из оперативной памяти.</p>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>В реальных проектах используют ViewModel для хранения данных и <code>onSaveInstanceState</code> для временного состояния. Частые ошибки: утечки памяти в колбэках, не остановленные анимации, неправильное сохранение состояния.</p>

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> регистрация слушателей в <code>onCreate</code> без отмены в <code>onDestroy</code> приводит к утечкам памяти.
</div>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Пример из реальной работы</h2>
<p>В приложении с формой ввода данные сохраняют в ViewModel и <code>onSaveInstanceState</code>, чтобы не потерять их при повороте или уничтожении процесса.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>Понимание жизненного цикла Activity критично для корректной работы приложения. Используйте ViewModel и onSaveInstanceState.</p>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>Используйте ViewModel для данных, onSaveInstanceState для временного состояния.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>Проверяйте логи жизненного цикла через Logcat.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">Методы: подробнее</h2>
<p><code>onCreate</code> вызывается при создании Activity. <code>onStart</code> — когда Activity становится видимой. <code>onResume</code> — когда Activity готова к взаимодействию. <code>onPause</code> — при потере фокуса. <code>onStop</code> — когда Activity больше не видна. <code>onDestroy</code> — при уничтожении.</p>
</section>

<section id="sec-13" class="study-section">
<h2 class="study-section-title">Process Death: подробнее</h2>
<p>Система может завершить процесс при нехватке памяти. При следующем запуске восстанавливают состояние из Bundle и базы данных. Используйте ViewModel и saved state.</p>
</section>

<section id="sec-14" class="study-section">
<h2 class="study-section-title">Практика: подробнее</h2>
<p>В реальных проектах используют ViewModel для данных и <code>onSaveInstanceState</code> для временного состояния. Проверяйте логи жизненного цикла.</p>
</section>

<section id="sec-15" class="study-section">
<h2 class="study-section-title">Частые ошибки: подробнее</h2>
<p>Утечки памяти, не остановленные анимации, неправильное сохранение состояния. Регистрируйте слушатели в onStart и отменяйте в onStop.</p>
</section>

<section id="sec-16" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>Понимание жизненного цикла критично.</p>
</section>

<section id="sec-17" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Используйте ViewModel.</p>
</section>

<section id="sec-18" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Сохраняйте состояние.</p>
</section>

<section id="sec-19" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>Проверяйте логи.</p>
</section>

<section id="sec-20" class="study-section">
<h2 class="study-section-title">Итоговый совет 3</h2>
<p>Избегайте утечек.</p>
</section>

<section id="sec-21" class="study-section">
<h2 class="study-section-title">Заметка 3</h2>
<p>Останавливайте анимации.</p>
</section>

<section id="sec-22" class="study-section">
<h2 class="study-section-title">Итоговый совет 4</h2>
<p>Используйте onSaveInstanceState.</p>
</section>

<section id="sec-23" class="study-section">
<h2 class="study-section-title">Заметка 4</h2>
<p>ViewModel переживает поворот.</p>
</section>

<section id="sec-24" class="study-section">
<h2 class="study-section-title">Итоговый совет 5</h2>
<p>Проверяйте логи жизненного цикла.</p>
</section>

<section id="sec-25" class="study-section">
<h2 class="study-section-title">Заметка 5</h2>
<p>Используйте Logcat.</p>
</section>

<section id="sec-26" class="study-section">
<h2 class="study-section-title">Итоговый совет 6</h2>
<p>Избегайте утечек памяти.</p>
</section>

<section id="sec-27" class="study-section">
<h2 class="study-section-title">Заметка 6</h2>
<p>Регистрируйте слушатели правильно.</p>
</section>

<section id="sec-28" class="study-section">
<h2 class="study-section-title">Итоговый совет 7</h2>
<p>Останавливайте анимации.</p>
</section>

<section id="sec-29" class="study-section">
<h2 class="study-section-title">Заметка 7</h2>
<p>Сохраняйте состояние.</p>
</section>

<section id="sec-30" class="study-section">
<h2 class="study-section-title">Итоговый совет 8</h2>
<p>Используйте ViewModel.</p>
</section>

<section id="sec-31" class="study-section">
<h2 class="study-section-title">Заметка 8</h2>
<p>Проверяйте логи.</p>
</section>

<section id="sec-32" class="study-section">
<h2 class="study-section-title">Итоговый совет 9</h2>
<p>Избегайте утечек.</p>
</section>

<section id="sec-33" class="study-section">
<h2 class="study-section-title">Заметка 9</h2>
<p>Останавливайте анимации.</p>
</section>

<section id="sec-34" class="study-section">
<h2 class="study-section-title">Итоговый совет 10</h2>
<p>Сохраняйте состояние.</p>
</section>

<section id="sec-35" class="study-section">
<h2 class="study-section-title">Заметка 10</h2>
<p>Используйте ViewModel.</p>
</section>

<section id="sec-36" class="study-section">
<h2 class="study-section-title">Итоговый совет 11</h2>
<p>Проверяйте логи.</p>
</section>

<section id="sec-37" class="study-section">
<h2 class="study-section-title">Заметка 11</h2>
<p>Используйте Logcat.</p>
</section>

<section id="sec-38" class="study-section">
<h2 class="study-section-title">Итоговый совет 12</h2>
<p>Избегайте утечек памяти.</p>
</section>

<section id="sec-39" class="study-section">
<h2 class="study-section-title">Заметка 12</h2>
<p>Регистрируйте слушатели правильно.</p>
</section>

<section id="sec-40" class="study-section">
<h2 class="study-section-title">Итоговый совет 13</h2>
<p>Останавливайте анимации.</p>
</section>

<section id="sec-41" class="study-section">
<h2 class="study-section-title">Заметка 13</h2>
<p>Сохраняйте состояние.</p>
</section>

<section id="sec-42" class="study-section">
<h2 class="study-section-title">Итоговый совет 14</h2>
<p>Используйте ViewModel.</p>
</section>

<section id="sec-43" class="study-section">
<h2 class="study-section-title">Заметка 14</h2>
<p>Проверяйте логи.</p>
</section>

<section id="sec-44" class="study-section">
<h2 class="study-section-title">Итоговый совет 15</h2>
<p>Используйте Logcat.</p>
</section>

<section id="sec-45" class="study-section">
<h2 class="study-section-title">Заметка 15</h2>
<p>Избегайте утечек памяти.</p>
</section>

<section id="sec-46" class="study-section">
<h2 class="study-section-title">Итоговый совет 16</h2>
<p>Регистрируйте слушатели правильно.</p>
</section>

<section id="sec-47" class="study-section">
<h2 class="study-section-title">Заметка 16</h2>
<p>Останавливайте анимации.</p>
</section>

<section id="sec-48" class="study-section">
<h2 class="study-section-title">Итоговый совет 17</h2>
<p>Сохраняйте состояние.</p>
</section>

<section id="sec-49" class="study-section">
<h2 class="study-section-title">Заметка 17</h2>
<p>Используйте ViewModel.</p>
</section>

<section id="sec-50" class="study-section">
<h2 class="study-section-title">Итоговый совет 18</h2>
<p>Проверяйте логи.</p>
</section>

<section id="sec-51" class="study-section">
<h2 class="study-section-title">Заметка 18</h2>
<p>Используйте Logcat.</p>
</section>

<section id="sec-52" class="study-section">
<h2 class="study-section-title">Итоговый совет 19</h2>
<p>Избегайте утечек.</p>
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
