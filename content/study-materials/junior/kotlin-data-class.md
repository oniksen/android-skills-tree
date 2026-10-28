<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Data Class</h1>
<p class="study-lead">
<code>data class</code> — класс для хранения данных. Компилятор автоматически генерирует <code>equals()</code>, <code>hashCode()</code>, <code>toString()</code>, <code>copy()</code> и функции для деструктуризации. Это делает код короче и безопаснее.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#basics">Основы</a>
<a class="study-nav-link" href="#equals">Равенство</a>
<a class="study-nav-link" href="#copy">copy</a>
<a class="study-nav-link" href="#destructure">Деструктуризация</a>
<a class="study-nav-link" href="#limits">Ограничения</a>
<a class="study-nav-link" href="#check">Проверка</a>
</nav>

<section id="basics" class="study-section">
<h2 class="study-section-title">1. Зачем нужен data class</h2>
<p>
Обычный класс для данных требует много шаблонного кода. <code>data class</code> генерирует его автоматически.
</p>

```kotlin
data class User(val name: String, val age: Int)

val user = User("Ada", 25)
println(user) // User(name=Ada, age=25)

```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>equals()</code></strong>
Сравнивает объекты по значениям свойств.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>hashCode()</code></strong>
Нужен для коллекций вроде <code>Set</code> и <code>Map</code>.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>toString()</code></strong>
Удобно выводит значения свойств.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>copy()</code></strong>
Создаёт копию с изменёнными свойствами.
</div>
</div>
</section>

<section id="equals" class="study-section">
<h2 class="study-section-title">2. Равенство и hashCode</h2>
<p>
Для <code>data class</code> равенство проверяется по значениям свойств, а не по ссылке.
</p>

```kotlin
val a = User("Ada", 25)
val b = User("Ada", 25)

println(a == b) // true
println(a.hashCode() == b.hashCode()) // true

```

<div class="study-note">
<strong>Запомнить:</strong> если два объекта имеют одинаковые свойства, <code>==</code> вернёт <code>true</code>.
</div>
</section>

<section id="copy" class="study-section">
<h2 class="study-section-title">3. copy()</h2>
<p>
<code>copy()</code> создаёт новый объект. Можно изменить только нужные свойства, остальные скопируются.
</p>

```kotlin
val original = User("Ada", 25)
val updated = original.copy(age = 26)

println(original) // User(name=Ada, age=25)
println(updated)  // User(name=Ada, age=26)

```

<div class="study-note study-warn">
<strong>Важно:</strong> <code>copy()</code> делает поверхностную копию. Вложенные изменяемые объекты могут разделиться между копиями.
</div>
</section>

<section id="destructure" class="study-section">
<h2 class="study-section-title">4. Деструктуризация</h2>
<p>
Data class генерирует функции <code>component1()</code>, <code>component2()</code> и так далее. Это позволяет распаковывать объект.
</p>

```kotlin
val (name, age) = User("Ada", 25)

println(name) // Ada
println(age)  // 25

```


```kotlin
val user = User("Ada", 25)

println(user.component1()) // Ada
println(user.component2()) // 25

```

</section>

<section id="limits" class="study-section">
<h2 class="study-section-title">5. Ограничения</h2>
<p>
Data class имеет требования к конструктору. Он должен содержать хотя бы один параметр, и параметры обычно должны быть <code>val</code> или <code>var</code>.
</p>

```kotlin
data class Point(val x: Int, val y: Int)

// data class должен иметь хотя бы один параметр в основном конструкторе
// параметры должны быть val или var

```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Минимум один параметр</strong>
Пустой data class не имеет смысла для генерации методов.
</div>
<div class="study-mini">
<strong class="study-mini-title">val или var</strong>
Свойства должны быть объявлены в основном конструкторе.
</div>
<div class="study-mini">
<strong class="study-mini-title">Не абстрактный</strong>
Data class не может быть abstract, open, sealed или inner.
</div>
<div class="study-mini">
<strong class="study-mini-title">Наследование</strong>
Может наследовать другие классы, но с ограничениями.
</div>
</div>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">6. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу объяснить, зачем нужен <code>data class</code>.</label>
<label><input type="checkbox" /> Понимаю разницу между <code>==</code> и сравнением по ссылке.</label>
<label><input type="checkbox" /> Знаю, как работает <code>copy()</code>.</label>
<label><input type="checkbox" /> Могу использовать деструктуризацию.</label>
<label><input type="checkbox" /> Понимаю ограничения data class.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Создать data class</th><td><code>data class User(val name: String)</code></td></tr>
<tr><th>Сравнить по значениям</th><td><code>a == b</code></td></tr>
<tr><th>Скопировать с изменениями</th><td><code>original.copy(age = 26)</code></td></tr>
<tr><th>Распаковать</th><td><code>val (name, age) = user</code></td></tr>
<tr><th>Вывести объект</th><td><code>println(user)</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и data class.
</footer>
