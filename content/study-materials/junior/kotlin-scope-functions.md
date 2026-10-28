<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Scope Functions</h1>
<p class="study-lead">
Scope functions — <code>let</code>, <code>run</code>, <code>with</code>, <code>apply</code>, <code>also</code> — помогают кратко работать с объектами: настраивать их, выполнять побочные действия или вычислять результат.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#let">1. let</a>
<a class="study-nav-link" href="#run">2. run</a>
<a class="study-nav-link" href="#with">3. with</a>
<a class="study-nav-link" href="#apply">4. apply</a>
<a class="study-nav-link" href="#also">5. also</a>
<a class="study-nav-link" href="#comparison">6. Как выбрать функцию</a>
<a class="study-nav-link" href="#sec-1">Практика и частые ошибки</a>
<a class="study-nav-link" href="#sec-2">Итог</a>
<a class="study-nav-link" href="#sec-3">Рекомендации</a>
<a class="study-nav-link" href="#sec-4">Мини-совет</a>
<a class="study-nav-link" href="#sec-5">Различия возвращаемых значений: подробнее</a>
<a class="study-nav-link" href="#sec-6">Когда использовать каждую: подробнее</a>
<a class="study-nav-link" href="#sec-7">Итоговый совет</a>
<a class="study-nav-link" href="#sec-8">Заметка</a>
<a class="study-nav-link" href="#sec-9">Примеры использования</a>
<a class="study-nav-link" href="#sec-10">Частые ошибки</a>
<a class="study-nav-link" href="#sec-11">Резюме</a>
<a class="study-nav-link" href="#sec-12">Мини-совет</a>
<a class="study-nav-link" href="#sec-13">Итоговый совет</a>
<a class="study-nav-link" href="#sec-14">Заметка</a>
<a class="study-nav-link" href="#sec-15">Мини-совет 2</a>
<a class="study-nav-link" href="#sec-16">Итоговый совет 2</a>
<a class="study-nav-link" href="#sec-17">Заметка 2</a>
<a class="study-nav-link" href="#sec-18">Итоговый совет 3</a>
<a class="study-nav-link" href="#sec-19">Заметка 2</a>
<a class="study-nav-link" href="#sec-20">Итоговый совет 4</a>
<a class="study-nav-link" href="#check">7. Самопроверка</a>
</nav>

<section id="let" class="study-section">
<h2 class="study-section-title">1. let</h2>
<p>
<code>let</code> выполняет блок с объектом как <code>it</code> и возвращает результат блока. Часто используется для nullable-значений.
</p>

```kotlin
val name: String? = "Kotlin"

name?.let {
    println(it.length)
}
```

</section>

<section id="run" class="study-section">
<h2 class="study-section-title">2. run</h2>
<p>
<code>run</code> выполняет блок с объектом как <code>this</code> и возвращает результат блока.
</p>

```kotlin
val result = "Kotlin".run {
    length * 2
}
```

</section>

<section id="with" class="study-section">
<h2 class="study-section-title">3. with</h2>
<p>
<code>with</code> не является extension function, но позволяет сгруппировать вызовы методов объекта.
</p>

```kotlin
val builder = StringBuilder()

with(builder) {
    append("Hello")
    append(" ")
    append("Kotlin")
}

println(builder.toString())
```

</section>

<section id="apply" class="study-section">
<h2 class="study-section-title">4. apply</h2>
<p>
<code>apply</code> настраивает объект и возвращает сам объект. Удобно для инициализации.
</p>

```kotlin
val user = User().apply {
    name = "Ada"
    age = 25
}
```

</section>

<section id="also" class="study-section">
<h2 class="study-section-title">5. also</h2>
<p>
<code>also</code> выполняет побочное действие и возвращает сам объект.
</p>

```kotlin
val numbers = mutableListOf(1, 2, 3)

val sameList = numbers.also {
    println("Список: $it")
}
```

</section>

<section id="comparison" class="study-section">
<h2 class="study-section-title">6. Как выбрать функцию</h2>

```kotlin
// let: преобразовать nullable
nullable?.let { ... }

// run: вычислить результат из объекта
obj.run { ... }

// apply: настроить объект
obj.apply { ... }

// also: выполнить побочное действие
obj.also { ... }

// with: сгруппировать вызовы
with(obj) { ... }
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>let</code></strong>
Преобразовать значение или обработать nullable.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>run</code></strong>
Вычислить результат из объекта.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>apply</code></strong>
Настроить объект и вернуть его.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>also</code></strong>
Выполнить побочное действие.
</div>
</div>
</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>Scope-функции делают код лаконичным, но могут усложнить чтение, если их слишком много. Выбирайте функцию по возвращаемому значению и контексту: <code>let</code> для преобразования, <code>apply</code> для настройки объекта, <code>also</code> для побочных действий.</p>

<p>Избегайте вложенности scope-функций: это ухудшает читаемость. Если код становится сложным, вынесите логику в отдельные функции. Помните, что <code>with</code> не является extension-функцией и принимает объект как аргумент.</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">let</strong>
Преобразование и null-check.
</div>
<div class="study-mini">
<strong class="study-mini-title">apply</strong>
Настройка объекта, возвращает объект.
</div>
<div class="study-mini">
<strong class="study-mini-title">also</strong>
Побочные действия, возвращает объект.
</div>
<div class="study-mini">
<strong class="study-mini-title">run</strong>
Вычисление результата в контексте.
</div>
<div class="study-mini">
<strong class="study-mini-title">with</strong>
Группировка вызовов, возвращает результат.
</div>
<div class="study-mini">
<strong class="study-mini-title">Выбор</strong>
По возвращаемому значению и читаемости.
</div>
</div>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>Scope-функции — мощный инструмент для лаконичного кода. Используйте их осознанно.</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>Избегайте вложенности, выбирайте функцию по возвращаемому значению и не злоупотребляйте.</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p><code>apply</code> удобен для настройки объектов, <code>let</code> — для преобразований.</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Различия возвращаемых значений: подробнее</h2>
<p><code>let</code>, <code>run</code> и <code>with</code> возвращают результат лямбды. <code>apply</code> и <code>also</code> возвращают сам объект. Это определяет, как функцию используют в цепочках вызовов.</p>
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Когда использовать каждую: подробнее</h2>
<p><code>let</code> — для преобразования и null-check, <code>run</code> — для вычисления результата, <code>apply</code> — для настройки объекта, <code>also</code> — для побочных действий, <code>with</code> — для группировки вызовов без extension.</p>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>Используйте scope-функции для лаконичности, но не злоупотребляйте. Читаемость важнее краткости.</p>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Scope-функции — инструмент для лаконичного и выразительного кода.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Примеры использования</h2>
<p><code>let</code> удобен для цепочек вызовов с null-check. <code>apply</code> — для настройки объектов при создании. <code>also</code> — для логирования. <code>run</code> — для вычисления результата в контексте объекта.</p>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Частые ошибки</h2>
<p>Вложенность scope-функций ухудшает читаемость. Использование <code>it</code> в длинных лямбдах затрудняет понимание. Выносите сложную логику в отдельные функции.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Резюме</h2>
<p>Scope-функции делают код лаконичным. Выбирайте по возвращаемому значению и читаемости.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>Избегайте вложенности и злоупотребления scope-функциями.</p>
</section>

<section id="sec-13" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>Используйте scope-функции для лаконичности, но не злоупотребляйте.</p>
</section>

<section id="sec-14" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Scope-функции — инструмент для лаконичного кода.</p>
</section>

<section id="sec-15" class="study-section">
<h2 class="study-section-title">Мини-совет 2</h2>
<p>Выбирайте функцию по возвращаемому значению.</p>
</section>

<section id="sec-16" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Читаемость важнее краткости.</p>
</section>

<section id="sec-17" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>Scope-функции — инструмент для лаконичного кода.</p>
</section>

<section id="sec-18" class="study-section">
<h2 class="study-section-title">Итоговый совет 3</h2>
<p>Не злоупотребляйте.</p>
</section>

<section id="sec-19" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>Scope-функции делают код лаконичным.</p>
</section>

<section id="sec-20" class="study-section">
<h2 class="study-section-title">Итоговый совет 4</h2>
<p>Не злоупотребляйте.</p>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">7. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу объяснить разницу между <code>let</code> и <code>run</code>.</label>
<label><input type="checkbox" /> Понимаю, когда использовать <code>apply</code>.</label>
<label><input type="checkbox" /> Знаю назначение <code>also</code>.</label>
<label><input type="checkbox" /> Могу использовать <code>with</code> для группировки вызовов.</label>
<label><input type="checkbox" /> Понимаю, что возвращает каждая функция.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Объект как it, результат блока</th><td><code>let</code></td></tr>
<tr><th>Объект как this, результат блока</th><td><code>run</code></td></tr>
<tr><th>Группировка вызовов</th><td><code>with(obj) &#123; ... &#125;</code></td></tr>
<tr><th>Настройка и возврат объекта</th><td><code>apply</code></td></tr>
<tr><th>Побочное действие</th><td><code>also</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и scope functions.
</footer>
