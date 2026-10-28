<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Extension Functions</h1>
<p class="study-lead">
Extension functions позволяют добавлять новые функции к существующим классам без наследования. Это делает код выразительнее и позволяет создавать удобные утилиты.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#basics">Основы</a>
<a class="study-nav-link" href="#property">Extension properties</a>
<a class="study-nav-link" href="#nullable">Nullable receiver</a>
<a class="study-nav-link" href="#priority">Приоритет</a>
<a class="study-nav-link" href="#check">Проверка</a>
</nav>

<section id="basics" class="study-section">
<h2 class="study-section-title">1. Что такое extension function</h2>
<p>
Extension function объявляется как обычная функция, но перед именем указывается тип-приёмник. Внутри функции объект доступен через <code>this</code>.
</p>

```kotlin
fun String.addExclamation(): String 

val result = "Hello".addExclamation()

```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Тип-приёмник</strong>
Класс, к которому добавляется функция: <code>String</code>.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>this</code></strong>
Ссылка на объект, у которого вызвали функцию.
</div>
<div class="study-mini">
<strong class="study-mini-title">Вызов</strong>
Выглядит как метод: <code>&quot;Hello&quot;.addExclamation()</code>.
</div>
<div class="study-mini">
<strong class="study-mini-title">Ограничение</strong>
Extension function не имеет доступа к private-членам класса.
</div>
</div>
</section>

<section id="property" class="study-section">
<h2 class="study-section-title">2. Extension properties</h2>
<p>
Можно добавлять не только функции, но и свойства. Обычно они вычисляются через getter.
</p>

```kotlin
val String.lastChar: Char
    get() = this[length - 1]

println("Kotlin".lastChar)

```

</section>

<section id="nullable" class="study-section">
<h2 class="study-section-title">3. Nullable receiver</h2>
<p>
Extension function может быть объявлена для nullable-типа. Тогда её можно вызывать у null.
</p>

```kotlin
fun String?.safeLength(): Int 

val length = null.safeLength()

```

<div class="study-note">
<strong>Запомнить:</strong> внутри функции <code>this</code> может быть null, поэтому нужно использовать безопасные вызовы.
</div>
</section>

<section id="priority" class="study-section">
<h2 class="study-section-title">4. Приоритет членов класса</h2>
<p>
Если у класса уже есть метод с таким же именем, вызывается метод класса, а не extension function.
</p>

```kotlin
class User(val name: String) 

fun User.printName() = println("extension: $name")

User("Ada").printName() // member: Ada

```

</section>

<section id="scope" class="study-section">
<h2 class="study-section-title">5. Практический пример</h2>
<p>
Extension functions часто используют для утилит над коллекциями, строками и доменными объектами.
</p>

```kotlin
fun List<Int>.sumEven(): Int .sum()
}

```

</section>

<section id="check" class="study-section">
<h2 class="study-section-title">6. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу объяснить, что такое extension function.</label>
<label><input type="checkbox" /> Понимаю, как объявить функцию для типа-приёмника.</label>
<label><input type="checkbox" /> Знаю, что extension function не имеет доступа к private-членам.</label>
<label><input type="checkbox" /> Понимаю, как работает nullable receiver.</label>
<label><input type="checkbox" /> Знаю, что метод класса имеет приоритет над extension.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Extension function</th><td><code>fun String.foo(): String</code></td></tr>
<tr><th>Extension property</th><td><code>val String.bar: Char get() = ...</code></td></tr>
<tr><th>Nullable receiver</th><td><code>fun String?.safeLength()</code></td></tr>
<tr><th>Вызов</th><td><code>&quot;text&quot;.foo()</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и extension functions.
</footer>
