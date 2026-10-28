<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Переменные</h1>
<p class="study-lead">
Переменная — это имя, под которым программа хранит значение. В Kotlin переменные объявляют через <code>val</code> или <code>var</code>. Этот конспект покрывает базовый уровень: объявление, вывод типа, область видимости и константы.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#basics">Основы</a>
<a class="study-nav-link" href="#val-var">val и var</a>
<a class="study-nav-link" href="#types">Типы</a>
<a class="study-nav-link" href="#scope">Область видимости</a>
<a class="study-nav-link" href="#constants">Константы</a>
<a class="study-nav-link" href="#check">Проверка</a>
</nav>

<section id="basics" class="study-section">
<h2 class="study-section-title">1. Зачем нужны переменные</h2>
<p>
Переменная позволяет сохранить значение и использовать его несколько раз. Без переменных пришлось бы повторять одно и то же значение или вычисление.
</p>

```kotlin
val name = "Kotlin"
var count = 0

count = count + 1

println(name)
println(count)

```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Имя</strong>
Понятное имя описывает, что хранит переменная: <code>userName</code>, а не <code>x</code>.
</div>
<div class="study-mini">
<strong class="study-mini-title">Значение</strong>
Значение можно вычислить, получить от пользователя или прочитать из ресурса.
</div>
<div class="study-mini">
<strong class="study-mini-title">Изменяемость</strong>
Нужно заранее решить, можно ли менять значение после создания.
</div>
<div class="study-mini">
<strong class="study-mini-title">Тип</strong>
Kotlin знает тип переменной: число, строка, булево значение и другие.
</div>
</div>
</section>

<section id="val-var" class="study-section">
<h2 class="study-section-title">2. val и var</h2>
<p>
<code>val</code> создаёт неизменяемую ссылку: после присваивания значение нельзя заменить. <code>var</code> создаёт изменяемую переменную.
</p>

```kotlin
val name = "Kotlin"
var count = 0

count = count + 1

println(name)
println(count)

```

<div class="study-note">
<strong>Правило для junior-уровня:</strong> по умолчанию используй <code>val</code>. Переходи на <code>var</code> только тогда, когда значение действительно должно меняться.
</div>
<table class="study-table">
<thead>
<tr>
<th>Ключевое слово</th>
<th>Можно переприсвоить?</th>
<th>Когда использовать</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>val</code></td>
<td>Нет</td>
<td>Большинство значений, результаты вычислений, параметры функций.</td>
</tr>
<tr>
<td><code>var</code></td>
<td>Да</td>
<td>Счётчики, накопление результата, состояние, которое меняется.</td>
</tr>
</tbody>
</table>
</section>

<section id="types" class="study-section">
<h2 class="study-section-title">3. Типы и вывод типа</h2>
<p>
Kotlin умеет выводить тип по значению. Если тип неочевиден, его можно указать явно.
</p>

```kotlin
val age: Int = 25
val title = "Android" // тип выводится как String

val pi: Double = 3.14

```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>Int</code></strong>
Целые числа: <code>1</code>, <code>42</code>, <code>-7</code>.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>String</code></strong>
Текст в кавычках: <code>&quot;Hello&quot;</code>.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>Boolean</code></strong>
Логическое значение: <code>true</code> или <code>false</code>.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>Double</code></strong>
Дробные числа: <code>3.14</code>.
</div>
</div>
<p class="study-small study-muted">
Явный тип полезен для публичного API, сложных выражений и случаев, где компилятор не может однозначно вывести тип.
</p>
</section>

<section id="scope" class="study-section">
<h2 class="study-section-title">4. Область видимости</h2>
<p>
Переменная доступна только там, где она объявлена. Локальная переменная внутри функции не видна снаружи.
</p>

```kotlin
fun printUser() 

// localName здесь недоступна

```

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> попытка использовать переменную вне блока, где она объявлена. Компилятор подскажет, что имя не найдено.
</div>
</section>

<section id="constants" class="study-section">
<h2 class="study-section-title">5. Константы</h2>
<p>
Для значений, известных на этапе компиляции, используют <code>const val</code>. Обычно их помещают на верхний уровень файла или в <code>object</code>.
</p>

```kotlin
const val APP_NAME = "Skill Tree"

object Config 

```

<p class="study-small study-muted">
<code>const val</code> подходит для простых типов: строки, числа, булевы значения. Для вычисляемых значений используй обычный <code>val</code>.
</p>
</section>

<section id="nullable" class="study-section">
<h2 class="study-section-title">6. Nullable-переменные</h2>
<p>
В Kotlin переменная по умолчанию не может хранить <code>null</code>. Если значение может отсутствовать, тип помечают знаком <code>?</code>.
</p>

```kotlin
val nickname: String? = null
val length = nickname?.length ?: 0

```

<div class="study-note">
<strong>Запомнить:</strong> <code>?.</code> безопасно обращается к свойству, а <code>?:</code> подставляет значение по умолчанию.
</div>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">7. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу объяснить разницу между <code>val</code> и <code>var</code>.</label>
<label><input type="checkbox" /> Понимаю, когда тип указывают явно, а когда его выводит компилятор.</label>
<label><input type="checkbox" /> Знаю, что такое область видимости переменной.</label>
<label><input type="checkbox" /> Могу отличить <code>const val</code> от обычного <code>val</code>.</label>
<label><input type="checkbox" /> Понимаю, как Kotlin работает с <code>null</code>.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Нужно значение, которое не меняется</th><td><code>val x = 10</code></td></tr>
<tr><th>Нужно значение, которое меняется</th><td><code>var x = 10</code></td></tr>
<tr><th>Нужен тип явно</th><td><code>val x: Int = 10</code></td></tr>
<tr><th>Нужна константа времени компиляции</th><td><code>const val X = 10</code></td></tr>
<tr><th>Значение может быть null</th><td><code>val x: String? = null</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и базовые понятия программирования.
</footer>
