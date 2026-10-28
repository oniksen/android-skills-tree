<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Коллекции</h1>
<p class="study-lead">
Коллекции хранят группы значений. В Kotlin чаще всего используют <code>List</code>, <code>Set</code> и <code>Map</code>. На junior-уровне важно понимать разницу между неизменяемыми и изменяемыми коллекциями и базовые операции над ними.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#list">List</a>
<a class="study-nav-link" href="#set">Set</a>
<a class="study-nav-link" href="#map">Map</a>
<a class="study-nav-link" href="#operations">Операции</a>
<a class="study-nav-link" href="#mutable">Изменяемость</a>
<a class="study-nav-link" href="#check">Проверка</a>
</nav>

<section id="list" class="study-section">
<h2 class="study-section-title">1. List</h2>
<p>
<code>List</code> хранит упорядоченную последовательность элементов. Элементы могут повторяться, а доступ к ним идёт по индексу.
</p>

```kotlin
val names = listOf("Ada", "Grace", "Linus")
val mutableNames = mutableListOf("Ada")

mutableNames.add("Grace")
mutableNames.remove("Ada")

println(names[0])
println(mutableNames.size)

```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>listOf</code></strong>
Создаёт неизменяемый список.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>mutableListOf</code></strong>
Создаёт изменяемый список.
</div>
<div class="study-mini">
<strong class="study-mini-title">Индекс</strong>
Первый элемент имеет индекс <code>0</code>.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>size</code></strong>
Количество элементов в списке.
</div>
</div>
</section>

<section id="set" class="study-section">
<h2 class="study-section-title">2. Set</h2>
<p>
<code>Set</code> хранит только уникальные элементы. Порядок обычно не важен, а повторное добавление не меняет коллекцию.
</p>

```kotlin
val unique = setOf(1, 2, 2, 3)
println(unique) // [1, 2, 3]

val mutableSet = mutableSetOf("a", "b")
mutableSet.add("a")

```

<div class="study-note">
<strong>Запомнить:</strong> если нужно проверить наличие значения без дублей, <code>Set</code> часто подходит лучше, чем <code>List</code>.
</div>
</section>

<section id="map" class="study-section">
<h2 class="study-section-title">3. Map</h2>
<p>
<code>Map</code> хранит пары ключ-значение. Ключи уникальны, а значения можно искать по ключу.
</p>

```kotlin
val ages = mapOf("Ada" to 36, "Grace" to 45)
println(ages["Ada"])

val mutableAges = mutableMapOf<String, Int>()
mutableAges["Linus"] = 40

```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Ключ</strong>
Уникальный идентификатор: имя, id, код.
</div>
<div class="study-mini">
<strong class="study-mini-title">Значение</strong>
Данные, связанные с ключом.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>to</code></strong>
Создаёт пару: <code>&quot;Ada&quot; to 36</code>.
</div>
<div class="study-mini">
<strong class="study-mini-title">Доступ</strong>
<code>map[&quot;Ada&quot;]</code> возвращает значение или null.
</div>
</div>
</section>

<section id="operations" class="study-section">
<h2 class="study-section-title">4. Базовые операции</h2>
<p>
Коллекции поддерживают функции для фильтрации, преобразования и поиска. Они делают код короче и выразительнее.
</p>

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

val even = numbers.filter 
val doubled = numbers.map 
val found = numbers.find 
val hasEven = numbers.any 

```

<table class="study-table">
<thead>
<tr>
<th>Функция</th>
<th>Что делает</th>
</tr>
</thead>
<tbody>
<tr><td><code>filter</code></td><td>Оставляет элементы, подходящие условию.</td></tr>
<tr><td><code>map</code></td><td>Преобразует каждый элемент.</td></tr>
<tr><td><code>find</code></td><td>Находит первый подходящий элемент.</td></tr>
<tr><td><code>any</code></td><td>Проверяет, есть ли хотя бы один подходящий элемент.</td></tr>
<tr><td><code>all</code></td><td>Проверяет, подходят ли все элементы.</td></tr>
</tbody>
</table>
</section>

<section id="iteration" class="study-section">
<h2 class="study-section-title">5. Обход коллекций</h2>
<p>
Коллекции можно обходить циклом или функцией <code>forEach</code>.
</p>

```kotlin
for (name in names) 

names.forEach 

```

<div class="study-note">
<strong>Совет:</strong> для простого вывода используй <code>forEach</code>, а для сложной логики с <code>break</code> и <code>continue</code> — цикл <code>for</code>.
</div>
</section>

<section id="mutable" class="study-section">
<h2 class="study-section-title">6. Изменяемые и неизменяемые коллекции</h2>
<p>
Неизменяемая коллекция нельзя изменить после создания. Изменяемая позволяет добавлять и удалять элементы.
</p>

```kotlin
val list = listOf(1, 2, 3)
// list.add(4) // ошибка: список неизменяемый

val mutableList = mutableListOf(1, 2, 3)
mutableList.add(4)

```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>listOf</code></strong>
Неизменяемый список.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>mutableListOf</code></strong>
Изменяемый список.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>mapOf</code></strong>
Неизменяемый словарь.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>mutableMapOf</code></strong>
Изменяемый словарь.
</div>
</div>
<div class="study-note study-warn">
<strong>Частая ошибка:</strong> пытаться добавить элемент в <code>listOf</code>. Если коллекция должна меняться, создавай её через <code>mutableListOf</code>.
</div>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">7. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу объяснить разницу между <code>List</code>, <code>Set</code> и <code>Map</code>.</label>
<label><input type="checkbox" /> Понимаю разницу между <code>listOf</code> и <code>mutableListOf</code>.</label>
<label><input type="checkbox" /> Знаю, как обратиться к элементу по индексу или ключу.</label>
<label><input type="checkbox" /> Могу использовать <code>filter</code>, <code>map</code> и <code>find</code>.</label>
<label><input type="checkbox" /> Понимаю, когда нужен <code>Set</code> вместо <code>List</code>.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Список</th><td><code>listOf(&quot;a&quot;, &quot;b&quot;)</code></td></tr>
<tr><th>Множество</th><td><code>setOf(1, 2, 3)</code></td></tr>
<tr><th>Словарь</th><td><code>mapOf(&quot;a&quot; to 1)</code></td></tr>
<tr><th>Изменяемый список</th><td><code>mutableListOf(1, 2)</code></td></tr>
<tr><th>Отфильтровать</th><td><code>items.filter &#123; it &gt; 2 &#125;</code></td></tr>
<tr><th>Преобразовать</th><td><code>items.map &#123; it * 2 &#125;</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и базовые коллекции.
</footer>
