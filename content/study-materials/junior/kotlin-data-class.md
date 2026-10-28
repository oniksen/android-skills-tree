<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Data Class</h1>
<p class="study-lead">
<code>data class</code> — класс для хранения данных. Компилятор автоматически генерирует <code>equals()</code>, <code>hashCode()</code>, <code>toString()</code>, <code>copy()</code> и функции для деструктуризации. Это делает код короче и безопаснее.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#basics">1. Зачем нужен data class</a>
<a class="study-nav-link" href="#equals">2. Равенство и hashCode</a>
<a class="study-nav-link" href="#copy">3. copy()</a>
<a class="study-nav-link" href="#destructure">4. Деструктуризация</a>
<a class="study-nav-link" href="#limits">5. Ограничения</a>
<a class="study-nav-link" href="#sec-1">Сравнение с обычным классом</a>
<a class="study-nav-link" href="#sec-2">Практика и частые ошибки</a>
<a class="study-nav-link" href="#sec-3">Итог</a>
<a class="study-nav-link" href="#sec-4">Деструктуризация: подробнее</a>
<a class="study-nav-link" href="#sec-5">Ограничения val параметров</a>
<a class="study-nav-link" href="#sec-6">Мини-совет</a>
<a class="study-nav-link" href="#sec-7">Равенство: подробнее</a>
<a class="study-nav-link" href="#sec-8">Итог</a>
<a class="study-nav-link" href="#sec-9">Мини-совет</a>
<a class="study-nav-link" href="#check">6. Самопроверка</a>
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

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Сравнение с обычным классом</h2>
<p>Обычный класс не генерирует <code>equals</code>, <code>hashCode</code> и <code>toString</code> автоматически. Data class делает это за вас, что экономит время и снижает количество ошибок. Если нужна только хранение данных, data class — лучший выбор.</p>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>Не используйте data class для классов с изменяемым состоянием или сложной логикой. Помните, что <code>copy()</code> создаёт поверхностную копию: вложенные объекты не копируются глубоко. Проверяйте равенство через <code>==</code>, а не <code>===</code>.</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Когда использовать</strong>
DTO, модели данных, результаты запросов.
</div>
<div class="study-mini">
<strong class="study-mini-title">Когда не использовать</strong>
Классы с бизнес-логикой или изменяемым состоянием.
</div>
<div class="study-mini">
<strong class="study-mini-title">Осторожно</strong>
<code>copy()</code> не делает глубокую копию вложенных объектов.
</div>
<div class="study-mini">
<strong class="study-mini-title">Равенство</strong>
<code>==</code> сравнивает содержимое, <code>===</code> — ссылку.
</div>
</div>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>Data class — удобный инструмент для моделей данных. Используйте его для простых структур и избегайте в сложной логике.</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Деструктуризация: подробнее</h2>
<p>Деструктуризация позволяет извлекать свойства в отдельные переменные. Под капотом генерируются функции <code>component1()</code>, <code>component2()</code> и т.д. Порядок свойств важен.</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Ограничения val параметров</h2>
<p>Параметры data class по умолчанию <code>val</code>. Если нужна изменяемость, используйте <code>var</code>, но это усложняет равенство и hashCode. Для моделей данных лучше оставлять <code>val</code>.</p>
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>Используйте data class для простых моделей и избегайте вложенных изменяемых объектов без необходимости.</p>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Равенство: подробнее</h2>
<p>Сгенерированный <code>equals</code> сравнивает все свойства. Если нужно частичное сравнение, реализуйте <code>equals</code> вручную или используйте обычный класс.</p>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>Data class экономит время и снижает ошибки. Используйте его для простых моделей и избегайте сложной логики внутри.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>Для DTO и моделей ответов API data class — отличный выбор. Для сущностей с бизнес-логикой используйте обычные классы.</p>
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
