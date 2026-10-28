<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Enum</h1>
<p class="study-lead">
<code>enum class</code> описывает фиксированный набор значений. Enum удобен для статусов, направлений, уровней и других ограниченных наборов. В Kotlin enum может иметь свойства, методы и реализовывать интерфейсы.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#basics">1. Базовый enum</a>
<a class="study-nav-link" href="#properties">2. Свойства enum</a>
<a class="study-nav-link" href="#methods">3. Методы enum</a>
<a class="study-nav-link" href="#when">4. Enum и when</a>
<a class="study-nav-link" href="#interfaces">5. Реализация интерфейсов</a>
<a class="study-nav-link" href="#sec-1">Перечисления с параметрами</a>
<a class="study-nav-link" href="#sec-2">Практика и частые ошибки</a>
<a class="study-nav-link" href="#sec-3">Итог</a>
<a class="study-nav-link" href="#sec-4">Рекомендации</a>
<a class="study-nav-link" href="#sec-5">Мини-совет</a>
<a class="study-nav-link" href="#sec-6">Перечисления с параметрами: подробнее</a>
<a class="study-nav-link" href="#sec-7">Реализация интерфейсов: пример</a>
<a class="study-nav-link" href="#sec-8">Итоговый совет</a>
<a class="study-nav-link" href="#sec-9">Заметка</a>
<a class="study-nav-link" href="#sec-10">Методы enum: подробнее</a>
<a class="study-nav-link" href="#sec-11">ordinal и name: подробнее</a>
<a class="study-nav-link" href="#sec-12">Итоговый совет 2</a>
<a class="study-nav-link" href="#sec-13">Заметка 2</a>
<a class="study-nav-link" href="#sec-14">Итоговый совет 3</a>
<a class="study-nav-link" href="#sec-15">Заметка 3</a>
<a class="study-nav-link" href="#sec-16">Итоговый совет 4</a>
<a class="study-nav-link" href="#sec-17">Заметка 2</a>
<a class="study-nav-link" href="#sec-18">Итоговый совет 5</a>
<a class="study-nav-link" href="#check">6. Самопроверка</a>
</nav>

<section id="basics" class="study-section">
<h2 class="study-section-title">1. Базовый enum</h2>
<p>
Enum создаёт набор именованных констант. Каждое значение — объект enum-класса.
</p>

```kotlin
enum class Direction {
    NORTH, SOUTH, EAST, WEST
}

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
enum class Color(val hex: String) {
    RED("#FF0000"),
    GREEN("#00FF00"),
    BLUE("#0000FF")
}

println(Color.RED.hex)
```

</section>

<section id="methods" class="study-section">
<h2 class="study-section-title">3. Методы enum</h2>
<p>
В enum можно объявлять методы и свойства, как в обычном классе.
</p>

```kotlin
enum class Status {
    NEW, IN_PROGRESS, DONE;

    fun isFinished(): Boolean = this == DONE
}

println(Status.DONE.isFinished())
```

</section>

<section id="when" class="study-section">
<h2 class="study-section-title">4. Enum и when</h2>
<p>
<code>when</code> по enum может быть исчерпывающим: если покрыты все значения, <code>else</code> не обязателен.
</p>

```kotlin
fun describe(direction: Direction): String {
    return when (direction) {
        Direction.NORTH -> "Север"
        Direction.SOUTH -> "Юг"
        Direction.EAST -> "Восток"
        Direction.WEST -> "Запад"
    }
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
interface Printable {
    fun print()
}

enum class Level : Printable {
    JUNIOR, MIDDLE, SENIOR;

    override fun print() = println(name)
}
```

</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Перечисления с параметрами</h2>
<p>Константы enum могут хранить параметры и реализовывать логику. Это полезно для статусов, уровней доступа и других фиксированных наборов значений с дополнительными данными.</p>

```kotlin
enum class AccessLevel(val code: Int, val description: String) {
    GUEST(0, "Только просмотр"),
    USER(1, "Базовый доступ"),
    ADMIN(2, "Полный доступ");

    fun canEdit(): Boolean = this == ADMIN
}

fun main() {
    println(AccessLevel.ADMIN.description)
    println(AccessLevel.ADMIN.canEdit())
}
```
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>Enum используют для фиксированного набора значений. Добавляйте свойства и методы, чтобы хранить дополнительные данные. Реализация интерфейсов позволяет использовать enum как стратегию. Помните, что <code>ordinal</code> может измениться при добавлении констант, поэтому не храните его в базе данных.</p>

<p>Избегайте enum для динамических наборов значений: если список может меняться, используйте sealed class или обычный класс. Enum хорош для небольших и стабильных наборов.</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Свойства</strong>
Хранение дополнительных данных в константах.
</div>
<div class="study-mini">
<strong class="study-mini-title">Методы</strong>
Логика внутри enum.
</div>
<div class="study-mini">
<strong class="study-mini-title">Интерфейсы</strong>
Реализация контрактов.
</div>
<div class="study-mini">
<strong class="study-mini-title">ordinal</strong>
Индекс константы, не храните в БД.
</div>
</div>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>Enum — удобный инструмент для фиксированных наборов значений. Используйте его для статусов, уровней и типов.</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>Используйте enum для небольших стабильных наборов. Для динамических — sealed class.</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>Не храните <code>ordinal</code> в базе данных.</p>
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Перечисления с параметрами: подробнее</h2>
<p>Константы enum могут хранить параметры и реализовывать логику. Это полезно для статусов, уровней доступа и других фиксированных наборов значений с дополнительными данными.</p>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Реализация интерфейсов: пример</h2>
<p>Enum может реализовывать интерфейс, что позволяет использовать его как стратегию или набор поведений. Каждая константа может переопределять метод по-своему.</p>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>Используйте enum для небольших стабильных наборов значений.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Enum удобен для статусов, уровней и типов.</p>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Методы enum: подробнее</h2>
<p>В enum можно объявлять методы, которые доступны всем константам. Это позволяет инкапсулировать логику внутри перечисления.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">ordinal и name: подробнее</h2>
<p><code>ordinal</code> возвращает индекс константы, <code>name</code> — её имя. Не используйте <code>ordinal</code> для хранения в базе данных, так как он может измениться.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Избегайте хранения ordinal в базе данных.</p>
</section>

<section id="sec-13" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>Enum удобен для небольших наборов значений.</p>
</section>

<section id="sec-14" class="study-section">
<h2 class="study-section-title">Итоговый совет 3</h2>
<p>Используйте enum для статусов и уровней.</p>
</section>

<section id="sec-15" class="study-section">
<h2 class="study-section-title">Заметка 3</h2>
<p>Enum делает код выразительным.</p>
</section>

<section id="sec-16" class="study-section">
<h2 class="study-section-title">Итоговый совет 4</h2>
<p>Не храните ordinal в БД.</p>
</section>

<section id="sec-17" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>Enum удобен для статусов.</p>
</section>

<section id="sec-18" class="study-section">
<h2 class="study-section-title">Итоговый совет 5</h2>
<p>Используйте enum для небольших наборов.</p>
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
