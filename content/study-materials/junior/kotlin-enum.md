<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Enum</h1>
<p class="study-lead">
<code>enum class</code> описывает фиксированный набор значений. Enum удобен для статусов, направлений, уровней и других ограниченных наборов. В Kotlin enum может иметь свойства, методы и реализовывать интерфейсы.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#basics">Основы</a>
<a class="study-nav-link" href="#properties">Свойства</a>
<a class="study-nav-link" href="#methods">Методы</a>
<a class="study-nav-link" href="#when">when</a>
<a class="study-nav-link" href="#interfaces">Интерфейсы</a>
<a class="study-nav-link" href="#check">Проверка</a>
</nav>

<section id="basics" class="study-section">
<h2 class="study-section-title">1. Базовый enum</h2>
<p>
Enum создаёт набор именованных констант. Каждое значение — объект enum-класса.
</p>

```kotlin
enum class Direction 

val direction = Direction.NORTH

```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Константы</strong>
Фиксированный набор значений.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>name</code></strong>
Имя константы в виде строки.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>ordinal</code></strong>
Порядковый номер константы.
</div>
<div class="study-mini">
<strong class="study-mini-title">Типобезопасность</strong>
Нельзя передать произвольную строку вместо enum.
</div>
</div>
</section>

<section id="properties" class="study-section">
<h2 class="study-section-title">2. Свойства enum</h2>
<p>
Enum может хранить данные. Каждой константе передают значения в конструктор.
</p>

```kotlin
enum class Color(val hex: String) 

println(Color.RED.hex)

```

</section>

<section id="methods" class="study-section">
<h2 class="study-section-title">3. Методы enum</h2>
<p>
В enum можно объявлять методы и свойства, как в обычном классе.
</p>

```kotlin
enum class Status 

println(Status.DONE.isFinished())

```

</section>

<section id="when" class="study-section">
<h2 class="study-section-title">4. Enum и when</h2>
<p>
<code>when</code> по enum может быть исчерпывающим: если покрыты все значения, <code>else</code> не обязателен.
</p>

```kotlin
fun describe(direction: Direction): String 
}

```

<div class="study-note">
<strong>Запомнить:</strong> исчерпывающий <code>when</code> помогает компилятору проверить, что все случаи обработаны.
</div>
</section>

<section id="interfaces" class="study-section">
<h2 class="study-section-title">5. Реализация интерфейсов</h2>
<p>
Enum может реализовывать интерфейс, как обычный класс.
</p>

```kotlin
interface Printable 

enum class Level : Printable 

```

</section>

<section id="check" class="study-section">
<h2 class="study-section-title">6. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу объяснить, зачем нужен enum.</label>
<label><input type="checkbox" /> Понимаю разницу между <code>name</code> и <code>ordinal</code>.</label>
<label><input type="checkbox" /> Знаю, как добавить свойства в enum.</label>
<label><input type="checkbox" /> Могу использовать enum в <code>when</code>.</label>
<label><input type="checkbox" /> Понимаю, что enum может реализовывать интерфейс.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Объявить enum</th><td><code>enum class Status &#123; NEW, DONE &#125;</code></td></tr>
<tr><th>Свойство</th><td><code>enum class Color(val hex: String)</code></td></tr>
<tr><th>Имя значения</th><td><code>Status.NEW.name</code></td></tr>
<tr><th>Порядок</th><td><code>Status.NEW.ordinal</code></td></tr>
<tr><th>Исчерпывающий when</th><td>Все значения enum</td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и enum.
</footer>
