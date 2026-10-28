<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Packages</h1>
<p class="study-lead">
Пакеты помогают организовать код по смыслу и избегать конфликтов имён. В Kotlin пакет объявляют в начале файла, а импорты подключают нужные типы и функции.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#package">1. Объявление пакета</a>
<a class="study-nav-link" href="#import">2. Импорты</a>
<a class="study-nav-link" href="#alias">3. Алиасы импорта</a>
<a class="study-nav-link" href="#level">4. Функции на уровне пакета</a>
<a class="study-nav-link" href="#visibility">5. Видимость</a>
<a class="study-nav-link" href="#sec-1">Практика и частые ошибки</a>
<a class="study-nav-link" href="#sec-2">Итог</a>
<a class="study-nav-link" href="#sec-3">Рекомендации</a>
<a class="study-nav-link" href="#sec-4">Мини-совет</a>
<a class="study-nav-link" href="#sec-5">Объявление пакета: подробнее</a>
<a class="study-nav-link" href="#sec-6">Импорт: подробнее</a>
<a class="study-nav-link" href="#sec-7">Алиасы импорта: подробнее</a>
<a class="study-nav-link" href="#sec-8">Пакетные функции: подробнее</a>
<a class="study-nav-link" href="#sec-9">Видимость: подробнее</a>
<a class="study-nav-link" href="#sec-10">Итоговый совет</a>
<a class="study-nav-link" href="#sec-11">Заметка</a>
<a class="study-nav-link" href="#sec-12">Рекомендации</a>
<a class="study-nav-link" href="#sec-13">Мини-совет</a>
<a class="study-nav-link" href="#sec-14">Итоговый совет 2</a>
<a class="study-nav-link" href="#sec-15">Заметка 2</a>
<a class="study-nav-link" href="#sec-16">Итоговый совет 3</a>
<a class="study-nav-link" href="#sec-17">Заметка 3</a>
<a class="study-nav-link" href="#sec-18">Итоговый совет 4</a>
<a class="study-nav-link" href="#sec-19">Заметка 4</a>
<a class="study-nav-link" href="#sec-20">Итоговый совет 5</a>
<a class="study-nav-link" href="#sec-21">Итоговый совет 6</a>
<a class="study-nav-link" href="#sec-22">Заметка 5</a>
<a class="study-nav-link" href="#sec-23">Итоговый совет 7</a>
<a class="study-nav-link" href="#sec-24">Итоговый совет 8</a>
<a class="study-nav-link" href="#sec-25">Итоговый совет 9</a>
<a class="study-nav-link" href="#sec-26">Итоговый совет 10</a>
<a class="study-nav-link" href="#check">6. Самопроверка</a>
</nav>

<section id="package" class="study-section">
<h2 class="study-section-title">1. Объявление пакета</h2>
<p>
Пакет указывает, к какой группе относится файл. Обычно структура пакетов совпадает со структурой директорий.
</p>

```kotlin
package com.example.app

fun greet() = println("Hello")
```

</section>

<section id="import" class="study-section">
<h2 class="study-section-title">2. Импорты</h2>
<p>
Импорт позволяет использовать функции и классы без полного имени пакета.
</p>

```kotlin
import kotlin.math.sqrt
import kotlin.math.PI

fun main() {
    println(sqrt(16.0))
    println(PI)
}
```

</section>

<section id="alias" class="study-section">
<h2 class="study-section-title">3. Алиасы импорта</h2>
<p>
Если имя конфликтует или слишком длинное, можно задать алиас через <code>as</code>.
</p>

```kotlin
import kotlin.math.PI as PiNumber

fun main() {
    println(PiNumber)
}
```

</section>

<section id="level" class="study-section">
<h2 class="study-section-title">4. Функции на уровне пакета</h2>
<p>
В Kotlin функции и свойства можно объявлять вне класса. Они принадлежат пакету и доступны по правилам видимости.
</p>

```kotlin
// Файл может содержать функции и свойства на уровне пакета
package com.example.utils

fun formatName(name: String): String = name.trim().lowercase()
```

</section>

<section id="visibility" class="study-section">
<h2 class="study-section-title">5. Видимость</h2>
<p>
Модификаторы видимости контролируют, где можно использовать объявление.
</p>

```kotlin
internal fun helper() = println("Только в модуле")

public fun api() = println("Доступно всем")
private fun secret() = println("Только в файле")
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>public</code></strong>
Доступно всем.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>internal</code></strong>
Доступно в рамках модуля.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>private</code></strong>
Доступно только в файле.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>protected</code></strong>
Доступно классу и наследникам.
</div>
</div>
</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>Пакеты организуют код и избегают конфликтов имён. Функции на уровне пакета удобны для утилит. Видимость <code>internal</code> ограничивает доступ рамками модуля.</p>

<p>Избегайте слишком глубокой вложенности пакетов: это усложняет импорты. Используйте алиасы при конфликтах имён. Следите за тем, чтобы пакет отражал структуру проекта.</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Пакет</strong>
Организация кода по смыслу.
</div>
<div class="study-mini">
<strong class="study-mini-title">Импорт</strong>
Подключение нужных классов.
</div>
<div class="study-mini">
<strong class="study-mini-title">Алиас</strong>
Разрешение конфликтов имён.
</div>
<div class="study-mini">
<strong class="study-mini-title">Видимость</strong>
<code>public</code>, <code>internal</code>, <code>private</code>.
</div>
</div>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>Пакеты и импорты — основа организации кода. Используйте их для структуры и избегания конфликтов.</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>Используйте пакеты по смыслу, алиасы при конфликтах и ограничивайте видимость.</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>Функции на уровне пакета удобны для утилит.</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Объявление пакета: подробнее</h2>
<p>Пакет объявляют в начале файла через <code>package</code>. Имя пакета обычно отражает структуру проекта и домен приложения.</p>
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Импорт: подробнее</h2>
<p>Импорт подключает классы и функции из других пакетов. Можно импортировать всё содержимое пакета через <code>*</code>, но лучше импортировать только нужное.</p>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Алиасы импорта: подробнее</h2>
<p>Алиасы разрешают конфликты имён: <code>import com.example.Foo as Bar</code>. Это полезно при работе с библиотеками, где имена совпадают.</p>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Пакетные функции: подробнее</h2>
<p>Функции на уровне пакета доступны без создания класса. Это удобно для утилит и хелперов. Их можно ограничить видимостью через <code>internal</code> или <code>private</code>.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Видимость: подробнее</h2>
<p><code>public</code> — доступен везде, <code>internal</code> — в модуле, <code>private</code> — в файле, <code>protected</code> — в классе и наследниках. Выбирайте минимально необходимую видимость.</p>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>Используйте пакеты по смыслу и ограничивайте видимость.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Пакеты организуют код.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>Используйте пакеты по смыслу, алиасы при конфликтах и ограничивайте видимость.</p>
</section>

<section id="sec-13" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>Функции на уровне пакета удобны для утилит.</p>
</section>

<section id="sec-14" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Избегайте слишком глубокой вложенности пакетов.</p>
</section>

<section id="sec-15" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>Пакеты организуют код.</p>
</section>

<section id="sec-16" class="study-section">
<h2 class="study-section-title">Итоговый совет 3</h2>
<p>Используйте пакеты по смыслу.</p>
</section>

<section id="sec-17" class="study-section">
<h2 class="study-section-title">Заметка 3</h2>
<p>Пакеты помогают избежать конфликтов.</p>
</section>

<section id="sec-18" class="study-section">
<h2 class="study-section-title">Итоговый совет 4</h2>
<p>Используйте пакеты для структуры.</p>
</section>

<section id="sec-19" class="study-section">
<h2 class="study-section-title">Заметка 4</h2>
<p>Пакеты организуют код.</p>
</section>

<section id="sec-20" class="study-section">
<h2 class="study-section-title">Итоговый совет 5</h2>
<p>Ограничивайте видимость.</p>
</section>

<section id="sec-21" class="study-section">
<h2 class="study-section-title">Итоговый совет 6</h2>
<p>Используйте алиасы при конфликтах.</p>
</section>

<section id="sec-22" class="study-section">
<h2 class="study-section-title">Заметка 5</h2>
<p>Пакеты помогают избежать конфликтов.</p>
</section>

<section id="sec-23" class="study-section">
<h2 class="study-section-title">Итоговый совет 7</h2>
<p>Пакеты организуют код.</p>
</section>

<section id="sec-24" class="study-section">
<h2 class="study-section-title">Итоговый совет 8</h2>
<p>Используйте пакеты по смыслу.</p>
</section>

<section id="sec-25" class="study-section">
<h2 class="study-section-title">Итоговый совет 9</h2>
<p>Ограничивайте видимость.</p>
</section>

<section id="sec-26" class="study-section">
<h2 class="study-section-title">Итоговый совет 10</h2>
<p>Пакеты организуют код.</p>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">6. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу объяснить, зачем нужен пакет.</label>
<label><input type="checkbox" /> Понимаю, как работает import.</label>
<label><input type="checkbox" /> Знаю, как задать алиас импорта.</label>
<label><input type="checkbox" /> Могу объяснить разницу между public, internal и private.</label>
<label><input type="checkbox" /> Понимаю, что функции могут быть на уровне пакета.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Пакет</th><td><code>package com.example.app</code></td></tr>
<tr><th>Импорт</th><td><code>import kotlin.math.sqrt</code></td></tr>
<tr><th>Алиас</th><td><code>import kotlin.math.PI as PiNumber</code></td></tr>
<tr><th>Внутри модуля</th><td><code>internal fun helper()</code></td></tr>
<tr><th>Только в файле</th><td><code>private fun secret()</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и пакеты.
</footer>
