<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Lambda</h1>
<p class="study-lead">
Лямбда — анонимная функция, которую можно передавать как значение. В Kotlin лямбды часто используют в коллекциях, обработчиках и функциях высшего порядка.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#basics">Основы</a>
<a class="study-nav-link" href="#trailing">Trailing lambda</a>
<a class="study-nav-link" href="#it">Параметр it</a>
<a class="study-nav-link" href="#types">Типы</a>
<a class="study-nav-link" href="#closure">Замыкание</a>
<a class="study-nav-link" href="#check">Проверка</a>
</nav>

<section id="basics" class="study-section">
<h2 class="study-section-title">1. Что такое лямбда</h2>
<p>
Лямбда записывается в фигурных скобках. Слева от <code>-&gt;</code> параметры, справа — тело.
</p>

```kotlin
val numbers = listOf(1, 2, 3)

numbers.forEach { number ->
    println(number)
}
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Параметры</strong>
Входные значения лямбды.
</div>
<div class="study-mini">
<strong class="study-mini-title">Тело</strong>
Последнее выражение возвращается как результат.
</div>
<div class="study-mini">
<strong class="study-mini-title">Передача</strong>
Лямбду можно передать в функцию.
</div>
<div class="study-mini">
<strong class="study-mini-title">Короткая форма</strong>
Если один параметр, можно использовать <code>it</code>.
</div>
</div>
</section>

<section id="trailing" class="study-section">
<h2 class="study-section-title">2. Trailing lambda</h2>
<p>
Если последний параметр функции — лямбда, её можно вынести за скобки вызова. Это делает код похожим на встроенный синтаксис языка.
</p>

```kotlin
fun perform(action: () -> Unit) {
    println("До действия")
    action()
    println("После действия")
}

perform {
    println("Выполняем действие")
}
```

</section>

<section id="it" class="study-section">
<h2 class="study-section-title">3. Параметр it</h2>
<p>
Если у лямбды один параметр, Kotlin позволяет не называть его явно. Тогда параметр называется <code>it</code>.
</p>

```kotlin
val names = listOf("Ada", "Grace")

names.forEach {
    println(it.uppercase())
}
```

<div class="study-note study-warn">
<strong>Совет:</strong> используй <code>it</code> только в коротких лямбдах. Если логика сложная, лучше назвать параметр явно.
</div>
</section>

<section id="types" class="study-section">
<h2 class="study-section-title">4. Тип лямбды</h2>
<p>
Тип лямбды записывается как <code>(Параметры) -&gt; Результат</code>. Это позволяет передавать функции как значения.
</p>

```kotlin
val sum: (Int, Int) -> Int = { a, b -> a + b }

val result = sum(2, 3)
```

</section>

<section id="closure" class="study-section">
<h2 class="study-section-title">5. Замыкание</h2>
<p>
Лямбда может захватывать переменные из внешней области видимости. Такое замыкание сохраняет доступ к ним даже после выхода из функции.
</p>

```kotlin
fun makeCounter(): () -> Int {
    var count = 0
    return { count++ }
}

val counter = makeCounter()
println(counter()) // 0
println(counter()) // 1
```

<div class="study-note">
<strong>Запомнить:</strong> замыкание полезно для счётчиков, фабрик функций и обработчиков.
</div>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">6. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу написать простую лямбду.</label>
<label><input type="checkbox" /> Понимаю, что такое trailing lambda.</label>
<label><input type="checkbox" /> Знаю, когда использовать <code>it</code>.</label>
<label><input type="checkbox" /> Могу прочитать тип <code>(Int) -&gt; Int</code>.</label>
<label><input type="checkbox" /> Понимаю, что такое замыкание.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Лямбда</th><td><code>'}</code></td></tr>
<tr><th>Trailing lambda</th><td><code>foo &#123; ... &#125;</code></td></tr>
<tr><th>Один параметр</th><td><code>it</code></td></tr>
<tr><th>Тип функции</th><td><code>(Int, Int) -&gt; Int</code></td></tr>
<tr><th>Замыкание</th><td>Захват внешней переменной</td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и лямбды.
</footer>
