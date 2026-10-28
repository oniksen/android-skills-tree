<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Higher Order Functions</h1>
<p class="study-lead">
Функция высшего порядка — это функция, которая принимает другую функцию как параметр или возвращает функцию. Этот приём лежит в основе коллекций, обработчиков событий и функционального стиля Kotlin.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#basics">1. Функция как параметр</a>
<a class="study-nav-link" href="#return">2. Функция как результат</a>
<a class="study-nav-link" href="#inline">3. inline</a>
<a class="study-nav-link" href="#standard">4. Стандартные HOF коллекций</a>
<a class="study-nav-link" href="#sec-1">Практика и частые ошибки</a>
<a class="study-nav-link" href="#sec-2">Итог</a>
<a class="study-nav-link" href="#sec-3">Рекомендации</a>
<a class="study-nav-link" href="#sec-4">Мини-совет</a>
<a class="study-nav-link" href="#sec-5">Функции типа: подробнее</a>
<a class="study-nav-link" href="#sec-6">Передача функций: примеры</a>
<a class="study-nav-link" href="#sec-7">Итоговый совет</a>
<a class="study-nav-link" href="#sec-8">Заметка</a>
<a class="study-nav-link" href="#sec-9">inline: подробнее</a>
<a class="study-nav-link" href="#sec-10">Резюме</a>
<a class="study-nav-link" href="#sec-11">Мини-совет</a>
<a class="study-nav-link" href="#sec-12">Заметка</a>
<a class="study-nav-link" href="#sec-13">Итоговый совет</a>
<a class="study-nav-link" href="#sec-14">Заметка</a>
<a class="study-nav-link" href="#sec-15">Итоговый совет 2</a>
<a class="study-nav-link" href="#check">5. Самопроверка</a>
</nav>

<section id="basics" class="study-section">
<h2 class="study-section-title">1. Функция как параметр</h2>
<p>
Если параметр имеет функциональный тип, функцию можно передать как значение. Чаще всего для этого используют лямбды.
</p>

```kotlin
fun calculate(a: Int, b: Int, operation: (Int, Int) -> Int): Int {
    return operation(a, b)
}

val sum = calculate(2, 3) { x, y -> x + y }
val product = calculate(2, 3) { x, y -> x * y }
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Параметр-функция</strong>
Описывает поведение, которое можно подставить.
</div>
<div class="study-mini">
<strong class="study-mini-title">Гибкость</strong>
Одна функция может работать с разными операциями.
</div>
<div class="study-mini">
<strong class="study-mini-title">Читаемость</strong>
Лямбда делает вызов похожим на встроенный синтаксис.
</div>
<div class="study-mini">
<strong class="study-mini-title">Переиспользование</strong>
Общая логика выносится в HOF, а детали передаются снаружи.
</div>
</div>
</section>

<section id="return" class="study-section">
<h2 class="study-section-title">2. Функция как результат</h2>
<p>
Функция может возвращать другую функцию. Это полезно для выбора стратегии поведения.
</p>

```kotlin
fun getOperation(type: String): (Int, Int) -> Int {
    return when (type) {
        "sum" -> { a, b -> a + b }
        "multiply" -> { a, b -> a * b }
        else -> { _, _ -> 0 }
    }
}
```

</section>

<section id="inline" class="study-section">
<h2 class="study-section-title">3. inline</h2>
<p>
Модификатор <code>inline</code> просит компилятор вставить тело функции в место вызова. Это часто используют для HOF, чтобы избежать создания объектов лямбд.
</p>

```kotlin
inline fun measureTime(block: () -> Unit) {
    val start = System.currentTimeMillis()
    block()
    println("Время: ${'$'}{System.currentTimeMillis() - start} ms")
}
```

<div class="study-note study-warn">
<strong>Внимание:</strong> <code>inline</code> не нужен для каждой функции. Его используют там, где важна производительность или есть лямбды.
</div>
</section>

<section id="standard" class="study-section">
<h2 class="study-section-title">4. Стандартные HOF коллекций</h2>
<p>
Коллекции Kotlin содержат множество функций высшего порядка. Они делают обработку данных выразительной.
</p>

```kotlin
val numbers = listOf(1, 2, 3, 4)

val even = numbers.filter { it % 2 == 0 }
val doubled = numbers.map { it * 2 }
val total = numbers.reduce { acc, value -> acc + value }
```

<table class="study-table">
<thead>
<tr>
<th>Функция</th>
<th>Назначение</th>
</tr>
</thead>
<tbody>
<tr><td><code>filter</code></td><td>Оставить подходящие элементы.</td></tr>
<tr><td><code>map</code></td><td>Преобразовать элементы.</td></tr>
<tr><td><code>reduce</code></td><td>Свернуть коллекцию в одно значение.</td></tr>
<tr><td><code>forEach</code></td><td>Выполнить действие для каждого элемента.</td></tr>
</tbody>
</table>
</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>Функции высшего порядка делают код выразительным, но могут усложнить чтение. Используйте <code>inline</code> для лямбд, чтобы избежать создания объектов. Помните, что функция как результат позволяет создавать специализированные функции.</p>

<p>Избегайте глубокой вложенности лямбд: если код становится сложным, вынесите логику в отдельные функции. Используйте стандартные HOF коллекций (<code>map</code>, <code>filter</code>, <code>reduce</code>) вместо ручных циклов.</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Функция как параметр</strong>
Передача логики в виде функции.
</div>
<div class="study-mini">
<strong class="study-mini-title">Функция как результат</strong>
Создание специализированных функций.
</div>
<div class="study-mini">
<strong class="study-mini-title">inline</strong>
Устраняет накладные расходы на лямбду.
</div>
<div class="study-mini">
<strong class="study-mini-title">Стандартные HOF</strong>
<code>map</code>, <code>filter</code>, <code>reduce</code>.
</div>
</div>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>HOF — основа функционального стиля. Используйте их для выразительности, но следите за читаемостью.</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>Используйте <code>inline</code> для частых вызовов, избегайте глубокой вложенности лямбд и выносите сложную логику в отдельные функции.</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>Стандартные HOF коллекций делают код короче и понятнее.</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Функции типа: подробнее</h2>
<p>Тип функции записывается как <code>(Параметры) -> Результат</code>. Например, <code>(Int) -> Boolean</code> — функция, принимающая Int и возвращающая Boolean. Такие типы используют для передачи функций как значений.</p>
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Передача функций: примеры</h2>
<p>Функцию можно передать как аргумент, сохранить в переменную или вернуть из другой функции. Это позволяет создавать гибкие и переиспользуемые компоненты.</p>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>Используйте HOF для выразительности, но не усложняйте код чрезмерно.</p>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Стандартные HOF коллекций делают код короче и понятнее.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">inline: подробнее</h2>
<p>Модификатор <code>inline</code> вставляет тело функции и лямбды в место вызова, устраняя накладные расходы. Используйте его для часто вызываемых функций с лямбда-параметрами.</p>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Резюме</h2>
<p>HOF — мощный инструмент функционального стиля. Используйте их осознанно.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>Избегайте глубокой вложенности лямбд ради читаемости.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Функции высшего порядка делают код выразительным и переиспользуемым.</p>
</section>

<section id="sec-13" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>Используйте HOF для выразительности, но следите за читаемостью.</p>
</section>

<section id="sec-14" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Стандартные HOF коллекций делают код короче.</p>
</section>

<section id="sec-15" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Избегайте глубокой вложенности лямбд.</p>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">5. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу объяснить, что такое HOF.</label>
<label><input type="checkbox" /> Понимаю, как передать функцию как параметр.</label>
<label><input type="checkbox" /> Знаю, что функция может возвращать функцию.</label>
<label><input type="checkbox" /> Понимаю назначение <code>inline</code>.</label>
<label><input type="checkbox" /> Могу назвать стандартные HOF коллекций.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>HOF с параметром-функцией</th><td><code>fun f(op: (Int) -&gt; Int)</code></td></tr>
<tr><th>Возврат функции</th><td><code>fun f(): (Int) -&gt; Int</code></td></tr>
<tr><th>inline</th><td><code>inline fun f(block: () -&gt; Unit)</code></td></tr>
<tr><th>Filter</th><td><code>items.filter &#123; ... &#125;</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и функции высшего порядка.
</footer>
