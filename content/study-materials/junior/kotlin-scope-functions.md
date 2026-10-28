<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Scope Functions</h1>
<p class="study-lead">
Scope functions — <code>let</code>, <code>run</code>, <code>with</code>, <code>apply</code>, <code>also</code> — помогают кратко работать с объектами: настраивать их, выполнять побочные действия или вычислять результат.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#let">let</a>
<a class="study-nav-link" href="#run">run</a>
<a class="study-nav-link" href="#with">with</a>
<a class="study-nav-link" href="#apply">apply</a>
<a class="study-nav-link" href="#also">also</a>
<a class="study-nav-link" href="#check">Проверка</a>
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
