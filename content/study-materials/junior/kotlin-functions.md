<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Функции</h1>
<p class="study-lead">
Функция — именованный блок кода, который выполняет задачу. Функции помогают переиспользовать код, делать его читаемым и тестировать отдельные части программы. В Kotlin функции объявляют через <code>fun</code>.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#basics">Основы</a>
<a class="study-nav-link" href="#return">Возврат</a>
<a class="study-nav-link" href="#args">Аргументы</a>
<a class="study-nav-link" href="#expression">Expression body</a>
<a class="study-nav-link" href="#check">Проверка</a>
</nav>

<section id="basics" class="study-section">
<h2 class="study-section-title">1. Объявление и вызов</h2>
<p>
Функция имеет имя, параметры и тело. Параметры описывают входные данные, а тело содержит действия.
</p>

```kotlin
fun greet(name: String) {
    println("Привет, $name")
}

fun main() {
    greet("Ada")
}
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Имя</strong>
Должно описывать действие: <code>greet</code>, <code>calculateTotal</code>.
</div>
<div class="study-mini">
<strong class="study-mini-title">Параметры</strong>
Входные значения с типами: <code>name: String</code>.
</div>
<div class="study-mini">
<strong class="study-mini-title">Тело</strong>
Блок кода в фигурных скобках.
</div>
<div class="study-mini">
<strong class="study-mini-title">Вызов</strong>
Имя функции и аргументы в скобках: <code>greet(&quot;Ada&quot;)</code>.
</div>
</div>
</section>

<section id="return" class="study-section">
<h2 class="study-section-title">2. Возвращаемое значение</h2>
<p>
Функция может вернуть результат. Тип результата указывают после параметров через двоеточие.
</p>

```kotlin
fun sum(a: Int, b: Int): Int {
    return a + b
}

val result = sum(2, 3)
```


```kotlin
fun printMessage(text: String): Unit {
    println(text)
}

fun log(text: String) {
    println(text)
}
```

<div class="study-note">
<strong>Запомнить:</strong> если функция ничего не возвращает, её тип результата <code>Unit</code>. Компилятор часто позволяет не писать <code>: Unit</code> явно.
</div>
</section>

<section id="expression" class="study-section">
<h2 class="study-section-title">3. Expression body</h2>
<p>
Если функция состоит из одного выражения, можно записать её короче с помощью <code>=</code>.
</p>

```kotlin
fun double(x: Int): Int = x * 2

fun isEven(x: Int): Boolean = x % 2 == 0
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Когда использовать</strong>
Простые вычисления, проверки, преобразования.
</div>
<div class="study-mini">
<strong class="study-mini-title">Когда не использовать</strong>
Если логика сложная и требует нескольких шагов.
</div>
</div>
</section>

<section id="args" class="study-section">
<h2 class="study-section-title">4. Аргументы</h2>
<p>
Параметры могут иметь значения по умолчанию. Также можно вызывать функцию с именованными аргументами, чтобы код был понятнее.
</p>

```kotlin
fun createUser(name: String, isAdmin: Boolean = false) {
    println("$name, admin=$isAdmin")
}

createUser("Ada")
createUser("Grace", true)
```


```kotlin
fun connect(host: String, port: Int, useTls: Boolean) { ... }

connect(
    host = "example.com",
    port = 443,
    useTls = true,
)
```

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> перепутать порядок аргументов. Именованные аргументы помогают этого избежать.
</div>
</section>

<section id="principles" class="study-section">
<h2 class="study-section-title">5. Как писать хорошие функции</h2>
<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Одна задача</strong>
Функция должна делать одно понятное действие.
</div>
<div class="study-mini">
<strong class="study-mini-title">Понятные имена</strong>
Имя должно объяснять результат или действие.
</div>
<div class="study-mini">
<strong class="study-mini-title">Маленький размер</strong>
Сложную логику лучше разбить на несколько функций.
</div>
<div class="study-mini">
<strong class="study-mini-title">Тестируемость</strong>
Функции с явными входами и выходами проще проверять.
</div>
</div>
</section>

<section class="study-section">
<h2 class="study-section-title">Single-expression functions</h2>
<p>Если функция состоит из одного выражения, её можно записать в одну строку со знаком <code>=</code>. Тип результата можно указать явно или дать компилятору вывести его автоматически.</p>

```kotlin
fun double(x: Int) = x * 2

fun isAdult(age: Int): Boolean = age >= 18

fun greet(name: String) = "Привет, $name"
```
</section>

<section class="study-section">
<h2 class="study-section-title">Перегрузка функций</h2>
<p>Функции можно перегружать: давать одинаковое имя при разных параметрах. Компилятор выбирает подходящий вариант по типам аргументов.</p>

```kotlin
fun print(value: Int) = println("Int: $value")
fun print(value: String) = println("String: $value")
```
</section>

<section class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>Делайте функции короткими и понятными, избегайте побочных эффектов без необходимости. Если функция становится длинной, разделите её на несколько небольших функций с понятными именами.</p>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">6. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу объявить функцию с параметрами и результатом.</label>
<label><input type="checkbox" /> Понимаю разницу между <code>return</code> и expression body.</label>
<label><input type="checkbox" /> Знаю, как задать значение аргумента по умолчанию.</label>
<label><input type="checkbox" /> Могу вызвать функцию с именованными аргументами.</label>
<label><input type="checkbox" /> Понимаю, зачем разбивать код на функции.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Объявить функцию</th><td><code>fun name(param: Type): ResultType</code></td></tr>
<tr><th>Вернуть значение</th><td><code>return value</code></td></tr>
<tr><th>Короткая функция</th><td><code>fun double(x: Int): Int = x * 2</code></td></tr>
<tr><th>Аргумент по умолчанию</th><td><code>fun f(x: Int = 0)</code></td></tr>
<tr><th>Именованный аргумент</th><td><code>f(x = 10)</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и базовые функции.
</footer>
