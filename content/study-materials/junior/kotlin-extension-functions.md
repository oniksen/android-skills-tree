<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Extension Functions</h1>
<p class="study-lead">
Extension functions позволяют добавлять новые функции к существующим классам без наследования. Это делает код выразительнее и позволяет создавать удобные утилиты.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#basics">1. Что такое extension function</a>
<a class="study-nav-link" href="#property">2. Extension properties</a>
<a class="study-nav-link" href="#nullable">3. Nullable receiver</a>
<a class="study-nav-link" href="#priority">4. Приоритет членов класса</a>
<a class="study-nav-link" href="#scope">5. Практический пример</a>
<a class="study-nav-link" href="#sec-1">Nullable-приёмники</a>
<a class="study-nav-link" href="#sec-2">Конвенции вызова</a>
<a class="study-nav-link" href="#sec-3">Практика и частые ошибки</a>
<a class="study-nav-link" href="#sec-4">Итог</a>
<a class="study-nav-link" href="#sec-5">Внутренние extension функции</a>
<a class="study-nav-link" href="#sec-6">Конвенции вызова: подробнее</a>
<a class="study-nav-link" href="#sec-7">Мини-совет</a>
<a class="study-nav-link" href="#sec-8">Примеры из стандартной библиотеки</a>
<a class="study-nav-link" href="#sec-9">Итог</a>
<a class="study-nav-link" href="#sec-10">Мини-совет</a>
<a class="study-nav-link" href="#sec-11">Заметка</a>
<a class="study-nav-link" href="#sec-12">Итоговый совет</a>
<a class="study-nav-link" href="#check">6. Самопроверка</a>
</nav>

<section id="basics" class="study-section">
<h2 class="study-section-title">1. Что такое extension function</h2>
<p>
Extension function объявляется как обычная функция, но перед именем указывается тип-приёмник. Внутри функции объект доступен через <code>this</code>.
</p>

```kotlin
fun String.addExclamation(): String {
    return this + "!"
}

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
fun String?.safeLength(): Int {
    return this?.length ?: 0
}

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
class User(val name: String) {
    fun printName() = println("member: $name")
}

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
fun List<Int>.sumEven(): Int {
    return this.filter { it % 2 == 0 }.sum()
}
```

</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Nullable-приёмники</h2>
<p>Extension-функцию можно объявить для nullable-типа. Внутри такой функции <code>this</code> может быть null, поэтому вызовы нужно делать безопасно.</p>

```kotlin
fun String?.orEmptyCustom(): String = this ?: ""

fun main() {
    val text: String? = null
    println(text.orEmptyCustom())
}
```
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Конвенции вызова</h2>
<p>Extension-функции вызывают как обычные методы объекта. Если есть конфликт с членом класса, приоритет у члена класса. Расширения не имеют доступа к приватным полям класса.</p>

```kotlin
class User(val name: String)

fun User.displayName(): String = "Пользователь: $name"

fun main() {
    val user = User("Ada")
    println(user.displayName())
}
```
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>Extension-функции не имеют доступа к приватным полям класса. Они разрешаются статически: если есть член класса с тем же именем, он имеет приоритет. Используйте расширения для добавления удобных методов к существующим типам, но не злоупотребляйте ими.</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Когда использовать</strong>
Добавление удобных методов к стандартным типам.
</div>
<div class="study-mini">
<strong class="study-mini-title">Когда не использовать</strong>
Для логики, которая принадлежит классу.
</div>
<div class="study-mini">
<strong class="study-mini-title">Осторожно</strong>
Конфликт с членами класса: приоритет у члена.
</div>
<div class="study-mini">
<strong class="study-mini-title">Nullable receiver</strong>
Можно объявлять расширения для nullable-типов.
</div>
</div>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>Extension-функции — мощный инструмент для расширения API без наследования. Используйте их осознанно и следите за читаемостью.</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Внутренние extension функции</h2>
<p>Расширения могут быть приватными для модуля или файла. Это позволяет добавлять вспомогательные методы без засорения публичного API. Используйте <code>private</code> или <code>internal</code> для ограничения видимости.</p>
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Конвенции вызова: подробнее</h2>
<p>Расширения вызываются как методы объекта, но разрешаются статически. Это значит, что выбор функции происходит на этапе компиляции по типу переменной, а не по реальному объекту во время выполнения.</p>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>Не злоупотребляйте расширениями: они могут усложнить чтение кода, если их слишком много. Добавляйте только действительно полезные методы.</p>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Примеры из стандартной библиотеки</h2>
<p>Стандартная библиотека Kotlin активно использует расширения: <code>String.toIntOrNull()</code>, <code>List.filter()</code>, <code>Iterable.map()</code>. Это делает API удобным и читаемым.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>Extension-функции позволяют расширять API без наследования. Используйте их для удобства, но не злоупотребляйте.</p>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>Для расширений используйте понятные имена и ограничивайте видимость при необходимости.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Расширения не меняют исходный класс, а добавляют новые методы на уровне синтаксиса.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>Используйте расширения для повышения читаемости, но не для скрытия сложной логики.</p>
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
