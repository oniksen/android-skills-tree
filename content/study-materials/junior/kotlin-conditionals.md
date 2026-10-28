<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Условные конструкции</h1>
<p class="study-lead">
Условные конструкции позволяют программе выбирать поведение в зависимости от данных. В Kotlin для этого используют <code>if</code> и <code>when</code>. На junior-уровне важно понимать оба варианта, логические операторы и читаемость ветвления.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#if">if</a>
<a class="study-nav-link" href="#when">when</a>
<a class="study-nav-link" href="#boolean">Логика</a>
<a class="study-nav-link" href="#nested">Вложенность</a>
<a class="study-nav-link" href="#check">Проверка</a>
</nav>

<section id="if" class="study-section">
<h2 class="study-section-title">1. if как инструкция и выражение</h2>
<p>
<code>if</code> выполняет блок кода, если условие истинно. В Kotlin <code>if</code> может быть и выражением: возвращать значение.
</p>

```kotlin
val score = 85

if (score >= 60) {
    println("Зачёт")
} else {
    println("Не зачёт")
}
```


```kotlin
val result = if (score >= 60) "Зачёт" else "Не зачёт"
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Условие</strong>
Выражение, которое возвращает <code>true</code> или <code>false</code>.
</div>
<div class="study-mini">
<strong class="study-mini-title">Блок then</strong>
Выполняется, если условие истинно.
</div>
<div class="study-mini">
<strong class="study-mini-title">Блок else</strong>
Выполняется, если условие ложно. В выражении else обязателен.
</div>
<div class="study-mini">
<strong class="study-mini-title">Выражение</strong>
<code>if</code> возвращает значение последнего выражения в выбранной ветке.
</div>
</div>
</section>

<section id="when" class="study-section">
<h2 class="study-section-title">2. when</h2>
<p>
<code>when</code> удобен, когда нужно сравнить одно значение с несколькими вариантами. Он читается лучше длинной цепочки <code>if/else</code>.
</p>

```kotlin
val day = 3

when (day) {
    1 -> println("Понедельник")
    2 -> println("Вторник")
    3 -> println("Среда")
    else -> println("Другой день")
}
```


```kotlin
val type = when (score) {
    in 90..100 -> "Отлично"
    in 70..89 -> "Хорошо"
    in 60..69 -> "Удовлетворительно"
    else -> "Не зачёт"
}
```

<div class="study-note">
<strong>Запомнить:</strong> <code>when</code> можно использовать как инструкцию и как выражение. В варианте-выражении все ветки должны покрывать возможные значения или содержать <code>else</code>.
</div>
</section>

<section id="boolean" class="study-section">
<h2 class="study-section-title">3. Логические операторы</h2>
<p>
Условия строят из сравнений и логических операторов. Это база для любой бизнес-логики.
</p>

```kotlin
val hasInternet = true
val isLoggedIn = false

if (hasInternet && isLoggedIn) {
    println("Можно загрузить данные")
}

if (!isLoggedIn) {
    println("Нужно войти")
}
```

<table class="study-table">
<thead>
<tr>
<th>Оператор</th>
<th>Значение</th>
<th>Пример</th>
</tr>
</thead>
<tbody>
<tr><td><code>&amp;&amp;</code></td><td>И</td><td><code>a &amp;&amp; b</code></td></tr>
<tr><td><code>||</code></td><td>Или</td><td><code>a || b</code></td></tr>
<tr><td><code>!</code></td><td>Не</td><td><code>!a</code></td></tr>
<tr><td><code>==</code></td><td>Равно</td><td><code>x == 5</code></td></tr>
<tr><td><code>!=</code></td><td>Не равно</td><td><code>x != 5</code></td></tr>
<tr><td><code>in</code></td><td>Входит в диапазон</td><td><code>x in 1..10</code></td></tr>
</tbody>
</table>
</section>

<section id="nested" class="study-section">
<h2 class="study-section-title">4. Вложенность и читаемость</h2>
<p>
Вложенные условия работают, но быстро усложняют код. На junior-уровне важно научиться видеть, когда условие можно упростить.
</p>

```kotlin
if (hasInternet) {
    if (isLoggedIn) {
        println("Загружаем профиль")
    } else {
        println("Показываем экран входа")
    }
} else {
    println("Нет сети")
}
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Ранний выход</strong>
Иногда лучше проверить отрицательный случай и вернуться из функции.
</div>
<div class="study-mini">
<strong class="study-mini-title">Именованные условия</strong>
Сложное условие можно вынести в <code>val</code> с понятным именем.
</div>
<div class="study-mini">
<strong class="study-mini-title">when вместо цепочки</strong>
Если сравнивается одно значение, <code>when</code> обычно читается лучше.
</div>
<div class="study-mini">
<strong class="study-mini-title">Не смешивать</strong>
Не делай слишком длинные условия без скобок и пояснений.
</div>
</div>
</section>

<section id="mistakes" class="study-section">
<h2 class="study-section-title">5. Частые ошибки</h2>
<div class="study-note study-warn">
<strong>Ошибка 1:</strong> использовать <code>=</code> вместо <code>==</code> в условии.
</div>
<div class="study-note study-warn">
<strong>Ошибка 2:</strong> забывать <code>else</code> в <code>if</code>-выражении.
</div>
<div class="study-note study-warn">
<strong>Ошибка 3:</strong> делать слишком глубокую вложенность без нужды.
</div>
<div class="study-note study-warn">
<strong>Ошибка 4:</strong> писать условия, которые всегда истинны или всегда ложны.
</div>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">6. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу объяснить разницу между <code>if</code> и <code>when</code>.</label>
<label><input type="checkbox" /> Понимаю, когда <code>if</code> возвращает значение.</label>
<label><input type="checkbox" /> Знаю операторы <code>&amp;&amp;</code>, <code>||</code>, <code>!</code>, <code>in</code>.</label>
<label><input type="checkbox" /> Могу упростить вложенное условие.</label>
<label><input type="checkbox" /> Понимаю, зачем нужен <code>else</code> в <code>when</code>-выражении.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Проверить одно условие</th><td><code>if (x &gt; 0) ... else ...</code></td></tr>
<tr><th>Выбрать из нескольких вариантов</th><td><code>when (x) &#123; 1 -&gt; ... else -&gt; ... &#125;</code></td></tr>
<tr><th>Вернуть значение из if</th><td><code>val r = if (x &gt; 0) &quot;yes&quot; else &quot;no&quot;</code></td></tr>
<tr><th>Проверить диапазон</th><td><code>x in 1..10</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и базовые условные конструкции.
</footer>
