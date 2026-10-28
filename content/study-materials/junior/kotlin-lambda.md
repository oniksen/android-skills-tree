<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Lambda</h1>
<p class="study-lead">
Лямбда — анонимная функция, которую можно передавать как значение. В Kotlin лямбды часто используют в коллекциях, обработчиках и функциях высшего порядка.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#basics">1. Что такое лямбда</a>
<a class="study-nav-link" href="#trailing">2. Trailing lambda</a>
<a class="study-nav-link" href="#it">3. Параметр it</a>
<a class="study-nav-link" href="#types">4. Тип лямбды</a>
<a class="study-nav-link" href="#closure">5. Замыкание</a>
<a class="study-nav-link" href="#sec-1">Практика и частые ошибки</a>
<a class="study-nav-link" href="#sec-2">Итог</a>
<a class="study-nav-link" href="#sec-3">Типы функций: подробнее</a>
<a class="study-nav-link" href="#sec-4">Рекомендации</a>
<a class="study-nav-link" href="#sec-5">Мини-совет</a>
<a class="study-nav-link" href="#sec-6">Замыкания: подробнее</a>
<a class="study-nav-link" href="#sec-7">Итог</a>
<a class="study-nav-link" href="#sec-8">Мини-совет</a>
<a class="study-nav-link" href="#sec-9">Итоговый совет</a>
<a class="study-nav-link" href="#sec-10">Заметка</a>
<a class="study-nav-link" href="#sec-11">Итоговый совет</a>
<a class="study-nav-link" href="#check">6. Самопроверка</a>
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

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>Лямбды делают код лаконичным, но могут усложнить чтение, если их слишком много. Используйте trailing lambda для последнего аргумента, чтобы код выглядел как встроенный блок. Помните про захват переменных: замыкание сохраняет ссылку на переменную, а не её значение на момент создания.</p>

<p>Избегайте длинных лямбд: если тело больше 3–4 строк, вынесите его в отдельную функцию. Используйте <code>it</code> только для коротких выражений; для сложной логики лучше явно назвать параметр.</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Коротко</strong>
Используйте <code>it</code> для простых преобразований.
</div>
<div class="study-mini">
<strong class="study-mini-title">Явно</strong>
Называйте параметр, если логика сложная.
</div>
<div class="study-mini">
<strong class="study-mini-title">Trailing</strong>
Последняя лямбда выносится за скобки.
</div>
<div class="study-mini">
<strong class="study-mini-title">Замыкание</strong>
Лямбда захватывает переменную, а не значение.
</div>
</div>

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> изменение захваченной переменной в цикле. Каждая лямбда увидит финальное значение, а не значение на момент создания.
</div>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>Лямбды — основа функционального стиля в Kotlin. Используйте их для краткости, но следите за читаемостью и захватом переменных.</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Типы функций: подробнее</h2>
<p>Тип лямбды записывается как <code>(Параметры) -> Результат</code>. Например, <code>(Int, Int) -> Int</code> — функция двух целых, возвращающая целое. Такие типы используют для передачи функций как значений.</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>Используйте лямбды для кратких преобразований и фильтрации. Для сложной логики выносите код в именованные функции. Следите за захватом переменных в циклах.</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>Trailing lambda делает код похожим на встроенный синтаксис. Используйте её для последнего аргумента-функции.</p>
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Замыкания: подробнее</h2>
<p>Замыкание захватывает переменную из внешней области видимости. Это позволяет создавать функции, которые помнят состояние. Будьте осторожны с изменяемыми переменными в циклах.</p>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>Лямбды и замыкания — основа функционального стиля. Используйте их для краткости и читаемости.</p>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>Используйте trailing lambda для последнего аргумента-функции, чтобы код выглядел чище.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>Лямбды делают код лаконичным. Следите за читаемостью и захватом переменных.</p>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Используйте лямбды для кратких преобразований и фильтрации коллекций.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>Следите за читаемостью при использовании лямбд.</p>
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
