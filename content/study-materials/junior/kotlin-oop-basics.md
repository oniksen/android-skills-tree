<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">ООП основы</h1>
<p class="study-lead">
Объектно-ориентированное программирование помогает описывать сущности как объекты с состоянием и поведением. На junior-уровне важно понимать классы, объекты, конструкторы, наследование, интерфейсы и инкапсуляцию.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#class">Классы</a>
<a class="study-nav-link" href="#constructor">Конструкторы</a>
<a class="study-nav-link" href="#inheritance">Наследование</a>
<a class="study-nav-link" href="#interfaces">Интерфейсы</a>
<a class="study-nav-link" href="#encapsulation">Инкапсуляция</a>
<a class="study-nav-link" href="#abstract">Абстрактные классы</a>
<a class="study-nav-link" href="#check">Проверка</a>
</nav>

<section id="class" class="study-section">
<h2 class="study-section-title">1. Классы и объекты</h2>
<p>
Класс — это шаблон. Объект — конкретный экземпляр класса со своими значениями свойств.
</p>

```kotlin
class User(val name: String, var age: Int) 
}

val user = User("Ada", 25)
user.printInfo()

```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Свойство</strong>
Данные объекта: <code>name</code>, <code>age</code>.
</div>
<div class="study-mini">
<strong class="study-mini-title">Метод</strong>
Поведение объекта: <code>printInfo()</code>.
</div>
<div class="study-mini">
<strong class="study-mini-title">Экземпляр</strong>
Конкретный объект, созданный через конструктор.
</div>
<div class="study-mini">
<strong class="study-mini-title">Шаблон</strong>
Класс описывает, что будет у всех объектов этого типа.
</div>
</div>
</section>

<section id="constructor" class="study-section">
<h2 class="study-section-title">2. Конструкторы</h2>
<p>
Конструктор создаёт объект и инициализирует его свойства. В Kotlin основной конструктор часто объявляют прямо в заголовке класса.
</p>

```kotlin
class Book(val title: String) 
}

class Point(val x: Int, val y: Int)

```

<div class="study-note">
<strong>Запомнить:</strong> свойства, объявленные в конструкторе через <code>val</code> или <code>var</code>, становятся свойствами класса.
</div>
</section>

<section id="inheritance" class="study-section">
<h2 class="study-section-title">3. Наследование</h2>
<p>
Наследование позволяет одному классу переиспользовать и расширять поведение другого. В Kotlin классы по умолчанию финальные, поэтому базовый класс нужно пометить <code>open</code>.
</p>

```kotlin
open class Animal(val name: String) 

class Dog(name: String) : Animal(name) 

```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>open</code></strong>
Разрешает наследование или переопределение.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>override</code></strong>
Явно указывает, что метод переопределяется.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>:</code></strong>
Синтаксис наследования: <code>class Dog : Animal()</code>.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>super</code></strong>
Обращение к реализации базового класса.
</div>
</div>
</section>

<section id="interfaces" class="study-section">
<h2 class="study-section-title">4. Интерфейсы</h2>
<p>
Интерфейс описывает контракт: какие методы должен реализовать класс. Класс может реализовать несколько интерфейсов.
</p>

```kotlin
interface Clickable 

class Button : Clickable 
}

```

<div class="study-note">
<strong>Отличие от наследования:</strong> интерфейс описывает поведение, а не состояние. Наследование повторно использует реализацию базового класса.
</div>
</section>

<section id="encapsulation" class="study-section">
<h2 class="study-section-title">5. Инкапсуляция</h2>
<p>
Инкапсуляция скрывает внутренние детали и защищает состояние объекта. Внешний код работает через публичные методы.
</p>

```kotlin
class BankAccount(private var balance: Int) 

    fun getBalance(): Int = balance
}

```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>private</code></strong>
Доступно только внутри класса.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>protected</code></strong>
Доступно классу и наследникам.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>public</code></strong>
Доступно всем. Обычно используется по умолчанию.
</div>
<div class="study-mini">
<strong class="study-mini-title">Методы доступа</strong>
Через методы можно проверять данные перед изменением состояния.
</div>
</div>
</section>

<section id="abstract" class="study-section">
<h2 class="study-section-title">6. Абстрактные классы</h2>
<p>
Абстрактный класс нельзя создать напрямую. Он задаёт общую структуру, а наследники реализуют абстрактные методы.
</p>

```kotlin
abstract class Shape 

class Circle(val radius: Double) : Shape() 

```

<div class="study-note study-warn">
<strong>Частая путаница:</strong> абстрактный класс может иметь состояние и реализацию, а интерфейс в базовом виде описывает контракт.
</div>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">7. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу объяснить, что такое класс и объект.</label>
<label><input type="checkbox" /> Понимаю, как работает конструктор.</label>
<label><input type="checkbox" /> Знаю, зачем нужен <code>open</code> для наследования.</label>
<label><input type="checkbox" /> Могу отличить интерфейс от абстрактного класса.</label>
<label><input type="checkbox" /> Понимаю, как инкапсуляция защищает состояние.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Класс</th><td><code>class User(val name: String)</code></td></tr>
<tr><th>Наследование</th><td><code>class Dog : Animal()</code></td></tr>
<tr><th>Переопределение</th><td><code>override fun sound()</code></td></tr>
<tr><th>Интерфейс</th><td><code>interface Clickable</code></td></tr>
<tr><th>Абстрактный класс</th><td><code>abstract class Shape</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и базовые принципы ООП.
</footer>
