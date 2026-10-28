<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Типы данных</h1>
<p class="study-lead">
Тип данных определяет, какие значения может хранить переменная и какие операции с ней допустимы. В Kotlin есть числовые типы, строки, булевы значения, массивы и nullable-типы. На junior-уровне важно понимать базовые типы и безопасную работу с null.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#numbers">Числа</a>
<a class="study-nav-link" href="#strings">Строки</a>
<a class="study-nav-link" href="#boolean">Boolean</a>
<a class="study-nav-link" href="#arrays">Массивы</a>
<a class="study-nav-link" href="#nullable">Null safety</a>
<a class="study-nav-link" href="#check">Проверка</a>
</nav>

<section id="numbers" class="study-section">
<h2 class="study-section-title">1. Числовые типы</h2>
<p>
Kotlin различает целые и дробные числа. Выбор типа влияет на память, точность и удобство работы.
</p>

```kotlin
val age: Int = 25
val price: Double = 19.99
val title: String = "Kotlin"
val isActive: Boolean = true
```


```kotlin
val byteValue: Byte = 127
val shortValue: Short = 1000
val intValue: Int = 1_000_000
val longValue: Long = 9_000_000_000L

val floatValue: Float = 3.14f
val doubleValue: Double = 3.14159
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>Byte</code>, <code>Short</code>, <code>Int</code>, <code>Long</code></strong>
Целые числа разного размера. Чаще всего используют <code>Int</code>.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>Float</code>, <code>Double</code></strong>
Дробные числа. <code>Double</code> точнее и используется чаще.
</div>
<div class="study-mini">
<strong class="study-mini-title">Суффиксы</strong>
<code>L</code> для Long, <code>f</code> для Float.
</div>
<div class="study-mini">
<strong class="study-mini-title">Разделители</strong>
Подчёркивание помогает читать большие числа: <code>1_000_000</code>.
</div>
</div>
</section>

<section id="strings" class="study-section">
<h2 class="study-section-title">2. Строки</h2>
<p>
<code>String</code> хранит текст. В Kotlin строки поддерживают шаблоны и многострочный текст.
</p>

```kotlin
val name = "Ada"
val greeting = "Привет, $name"
val multiline = """
    Первая строка
    Вторая строка
""".trimIndent()
```

<div class="study-note">
<strong>Запомнить:</strong> <code>$name</code> подставляет значение переменной в строку. Для сложных выражений используют <code>$&#123;...&#125;</code>.
</div>
</section>

<section id="boolean" class="study-section">
<h2 class="study-section-title">3. Boolean</h2>
<p>
<code>Boolean</code> хранит одно из двух значений: <code>true</code> или <code>false</code>. Этот тип часто используется в условиях и флагах.
</p>

```kotlin
val age: Int = 25
val price: Double = 19.99
val title: String = "Kotlin"
val isActive: Boolean = true
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>true</code></strong>
Условие выполнено, функция включена, данные загружены.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>false</code></strong>
Условие не выполнено, функция выключена, данных нет.
</div>
</div>
</section>

<section id="arrays" class="study-section">
<h2 class="study-section-title">4. Массивы</h2>
<p>
Массив хранит набор значений одного типа. Доступ к элементам идёт по индексу, начиная с нуля.
</p>

```kotlin
val numbers = arrayOf(1, 2, 3)
val names = arrayOf("Ada", "Grace")

val first = numbers[0]
numbers[1] = 10
```

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> обращение по индексу, которого нет в массиве. Например, у массива из 3 элементов нет индекса 3.
</div>
</section>

<section id="nullable" class="study-section">
<h2 class="study-section-title">5. Null safety</h2>
<p>
По умолчанию переменная не может быть <code>null</code>. Если значение может отсутствовать, тип помечают знаком <code>?</code>.
</p>

```kotlin
val nickname: String? = null
val length = nickname?.length ?: 0

val nonNullName: String = "Kotlin"
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>String</code></strong>
Не может быть null. Безопасный вариант по умолчанию.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>String?</code></strong>
Может быть null. Требует аккуратной проверки.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>?.</code></strong>
Безопасный вызов: если значение null, результат тоже null.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>?:</code></strong>
Оператор Элвиса: подставляет значение по умолчанию.
</div>
</div>
</section>

<section id="inference" class="study-section">
<h2 class="study-section-title">6. Вывод типа</h2>
<p>
Компилятор часто понимает тип по значению. Явный тип полезен для читаемости и публичных API.
</p>

```kotlin
val count = 10 // Int
val message = "Hello" // String
val enabled = true // Boolean
```

<div class="study-note">
<strong>Практика:</strong> используй вывод типа для локальных переменных, а явный тип — для свойств класса и функций, которые видны другим модулям.
</div>
</section>

<section class="study-section">
<h2 class="study-section-title">Преобразование типов и частые ошибки</h2>
<p>В Kotlin нет неявного преобразования чисел: <code>Int</code> не превращается в <code>Long</code> автоматически. Для преобразования используют методы <code>toInt()</code>, <code>toLong()</code>, <code>toDouble()</code>. Строки можно превращать в числа через <code>toIntOrNull()</code>, чтобы избежать исключений.</p>

```kotlin
val number: Int = 10
val longNumber: Long = number.toLong()

val text = "42"
val parsed = text.toIntOrNull() ?: 0
```

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> сравнение <code>Int</code> и <code>Long</code> без преобразования или вызов <code>toInt()</code> для некорректной строки. Используйте безопасные варианты и проверяйте входные данные.
</div>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">7. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу назвать основные числовые типы Kotlin.</label>
<label><input type="checkbox" /> Понимаю разницу между <code>String</code> и <code>String?</code>.</label>
<label><input type="checkbox" /> Знаю, как обратиться к элементу массива.</label>
<label><input type="checkbox" /> Могу объяснить операторы <code>?.</code> и <code>?:</code>.</label>
<label><input type="checkbox" /> Понимаю, когда тип можно не указывать явно.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Целое число</th><td><code>val x: Int = 10</code></td></tr>
<tr><th>Дробное число</th><td><code>val x: Double = 3.14</code></td></tr>
<tr><th>Строка</th><td><code>val x: String = &quot;text&quot;</code></td></tr>
<tr><th>Массив</th><td><code>val x = arrayOf(1, 2, 3)</code></td></tr>
<tr><th>Nullable-строка</th><td><code>val x: String? = null</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и базовые типы данных.
</footer>
