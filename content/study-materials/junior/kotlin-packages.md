<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Packages</h1>
<p class="study-lead">
Пакеты помогают организовать код по смыслу и избегать конфликтов имён. В Kotlin пакет объявляют в начале файла, а импорты подключают нужные типы и функции.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#package">Пакет</a>
<a class="study-nav-link" href="#import">Импорты</a>
<a class="study-nav-link" href="#alias">Алиасы</a>
<a class="study-nav-link" href="#level">Package-level</a>
<a class="study-nav-link" href="#visibility">Видимость</a>
<a class="study-nav-link" href="#check">Проверка</a>
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

fun main() 

```

</section>

<section id="alias" class="study-section">
<h2 class="study-section-title">3. Алиасы импорта</h2>
<p>
Если имя конфликтует или слишком длинное, можно задать алиас через <code>as</code>.
</p>

```kotlin
import kotlin.math.PI as PiNumber

fun main() 

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
