# Kotlin Basics

**Уровень:** Junior  
**Категория:** Kotlin Basics  
**Язык:** Kotlin

## Содержание

1. [Синтаксис Kotlin](#1-синтаксис-kotlin)
2. [Null Safety](#2-null-safety)
3. [Data Class](#3-data-class)
4. [Properties и Accessors](#4-properties-и-accessors)
5. [Object и Companion Object](#5-object-и-companion-object)
6. [Extension Functions](#6-extension-functions)
7. [Lambda](#7-lambda)
8. [Higher Order Functions](#8-higher-order-functions)
9. [Scope Functions](#9-scope-functions)
10. [Enum](#10-enum)
11. [Sealed Class и Sealed Interface](#11-sealed-class-и-sealed-interface)
12. [Packages и Visibility Modifiers](#12-packages-и-visibility-modifiers)
13. [Generics Basics](#13-generics-basics)

---

# 1. Синтаксис Kotlin {#sintaksis-kotlin}

Kotlin — статически типизированный язык программирования, предназначенный для создания приложений под различные платформы, включая JVM, Android, JavaScript, Native и WebAssembly.

Его синтаксис сочетает объектно-ориентированный и функциональный подходы. Язык поддерживает классы, интерфейсы, функции, лямбды, свойства, расширения и другие конструкции.

Понимание базового синтаксиса необходимо для чтения чужого кода и написания собственных программ.

## 1.1. Структура Kotlin-файла {#struktura-kotlin-fayla}

Исходный код Kotlin обычно хранится в файлах с расширением `.kt`.

В отличие от Java, Kotlin не требует размещать каждый класс в отдельном файле. Один файл может содержать несколько классов, интерфейсов, функций и переменных.

Простейший Kotlin-файл:

```kotlin
package com.example.app

import kotlin.math.max

const val APP_NAME = "Study Platform"

class User(
    val name: String,
    val age: Int
)

fun getGreeting(user: User): String {
    return "Привет, ${user.name}!"
}

fun main() {
    val user = User("Alex", 25)

    println(getGreeting(user))
}
```

Разберём основные части файла.

### Package

```kotlin
package com.example.app
```

Объявление пакета определяет логическую принадлежность файла к определённой части проекта.

Пакеты помогают организовывать исходный код и избегать конфликтов имён.

Например:

```text
com.example.app
com.example.app.data
com.example.app.domain
com.example.app.ui
```

Объявление `package` должно находиться в начале файла, перед импортами.

Если пакет не указан, файл относится к корневому пакету без имени.

### Imports

```kotlin
import kotlin.math.max
```

Импорт позволяет использовать декларации из других пакетов без указания их полного имени.

```kotlin
val result = max(10, 20)
```

Без импорта можно было бы написать:

```kotlin
val result = kotlin.math.max(10, 20)
```

Импортировать можно классы, интерфейсы, функции, свойства, объекты и другие декларации.

### Top-level declarations

В Kotlin функции и свойства можно объявлять непосредственно на уровне файла:

```kotlin
val appName = "Study Platform"

fun printAppName() {
    println(appName)
}
```

Для этого не требуется создавать класс, как это часто делают в Java.

Такие декларации называются top-level declarations.

Они принадлежат пакету, в котором находится файл.

### Точка входа программы

Для консольной программы стандартная точка входа — функция `main`:

```kotlin
fun main() {
    println("Hello, Kotlin!")
}
```

Также можно принимать аргументы командной строки:

```kotlin
fun main(args: Array<String>) {
    args.forEach { println(it) }
}
```

В Android-приложениях точкой входа приложения является не обычная функция `main`, а компоненты платформы, объявленные в AndroidManifest, например `Application` или `Activity`.

## 1.2. Строки и шаблонные строки {#stroki-i-shablonnye-stroki}

Строковый тип Kotlin — `String`.

```kotlin
val language = "Kotlin"
val message = "Hello, world!"
```

Строки записываются в двойных кавычках.

Строки в Kotlin неизменяемые (*immutable*): нельзя заменить отдельный символ уже существующей строки.

```kotlin
val name = "Kotlin"

// Ошибка компиляции:
// name[0] = 'J'
```

При необходимости создаётся новая строка:

```kotlin
val name = "Kotlin"
val newName = "J" + name.substring(1)

println(newName) // Jotlin
```

### Конкатенация

Строки можно объединять оператором `+`:

```kotlin
val firstName = "Alex"
val lastName = "Smith"

val fullName = firstName + " " + lastName
```

Но для вставки значений в строку предпочтительнее использовать шаблоны.

### Шаблонные строки

Kotlin позволяет вставлять переменные в строку с помощью `$`:

```kotlin
val name = "Alex"
val age = 25

val message = "Меня зовут $name, мне $age лет"

println(message)
```

Если требуется вычислить выражение, используются фигурные скобки `${}`:

```kotlin
val firstName = "Alex"
val lastName = "Smith"

val message = "Полное имя: ${firstName.uppercase()} $lastName"
```

Внутри `${}` можно использовать вызовы функций, свойства и более сложные выражения.

### Многострочные строки

Для создания многострочных строк используются тройные кавычки:

```kotlin
val text = """
    Kotlin — современный язык.
    Он поддерживает:
    - ООП
    - функциональное программирование
    - корутины
""".trimIndent()

println(text)
```

`trimIndent()` удаляет общий отступ строк.

Также доступен `trimMargin()`:

```kotlin
val json = """
    |{
    |  "name": "Alex",
    |  "age": 25
    |}
""".trimMargin()
```

По умолчанию символом разделения отступа является `|`, но его можно изменить.

### Экранирование символов

В обычных строках специальные символы записываются через обратную косую черту:

```kotlin
val text = "Первая строка\nВторая строка"
val tab = "Имя:\tAlex"
val quote = "Он сказал: \"Привет!\""
val slash = "C:\\Users\\Alex"
```

Основные управляющие последовательности:

| Последовательность | Значение |
|---|---|
| `\n` | Перевод строки |
| `\t` | Табуляция |
| `\r` | Возврат каретки |
| `\"` | Двойная кавычка |
| `\'` | Одинарная кавычка |
| `\\` | Обратная косая черта |
| `\$` | Символ `$` без шаблонизации |

## 1.3. Комментарии {#kommentarii}

Комментарии — текст в исходном коде, который не участвует в выполнении программы.

Они используются для объяснения сложных решений, указания важных ограничений и документирования API.

### Однострочные комментарии

Объявляются через `//`.

```kotlin
// Получаем имя пользователя.
val userName = "Alex"

println(userName) // Выводим имя.
```

Всё после `//` до конца строки считается комментарием.

### Многострочные комментарии

Объявляются через `/* ... */`.

```kotlin
/*
    Здесь можно написать
    несколько строк
    комментария.
*/
```

Kotlin поддерживает вложенные многострочные комментарии:

```kotlin
/*
    Внешний комментарий.

    /*
        Внутренний комментарий.
    */
*/
```

Это полезно, когда необходимо временно закомментировать блок кода, который уже содержит многострочные комментарии.

### KDoc

KDoc — формат документирования деклараций Kotlin.

Он похож на Javadoc и начинается с `/**`.

```kotlin
/**
 * Вычисляет итоговую стоимость заказа.
 *
 * @param price Исходная стоимость.
 * @param discountPercent Размер скидки в процентах.
 * @return Стоимость после применения скидки.
 */
fun calculatePrice(
    price: Double,
    discountPercent: Double
): Double {
    return price - price * discountPercent / 100
}
```

Основные теги KDoc:

| Тег | Назначение |
|---|---|
| `@param` | Описание параметра |
| `@return` | Описание возвращаемого значения |
| `@throws` | Описание исключения |
| `@property` | Описание свойства |
| `@see` | Ссылка на связанную декларацию |
| `@sample` | Ссылка на пример использования |

KDoc особенно полезен для публичных классов, интерфейсов и функций, которыми будут пользоваться другие разработчики.

Не стоит документировать очевидные вещи комментариями вроде `// Увеличиваем счётчик`. Комментарии должны объяснять причину решения или важные особенности поведения.

## 1.4. Точка с запятой и её необязательность {#tochka-s-zapyatoy-i-ee-neobyazatelnost}

В Kotlin точка с запятой обычно не нужна.

```kotlin
val name = "Alex"
val age = 25

println(name)
println(age)
```

Завершение инструкции определяется окончанием строки или другими правилами синтаксиса.

В одной строке можно разместить несколько инструкций через `;`:

```kotlin
val name = "Alex"; val age = 25
```

Но такой стиль обычно ухудшает читаемость.

Предпочтительный вариант:

```kotlin
val name = "Alex"
val age = 25
```

Точку с запятой обычно используют только в редких случаях, когда несколько выражений действительно необходимо записать на одной строке.

## 1.5. Выражения и инструкции {#vyrazheniya-i-instruktsii}

В Kotlin важно различать выражения (*expressions*) и инструкции (*statements*).

**Выражение** — конструкция, которая вычисляется и имеет значение.

Например:

```kotlin
val sum = 10 + 20
```

`10 + 20` — выражение, результатом которого является `30`.

Другой пример:

```kotlin
val max = if (10 > 20) {
    10
} else {
    20
}
```

`if` здесь тоже выражение: результат одной из ветвей присваивается переменной.

К выражениям относятся:

- вызовы функций;
- арифметические операции;
- обращения к свойствам;
- `if`;
- `when`;
- `try`;
- некоторые другие конструкции языка.

**Инструкция** — конструкция, которая выполняет действие, но не предназначена для использования как обычное значение.

Например:

```kotlin
val age = 25

if (age >= 18) {
    println("Совершеннолетний")
}
```

Объявление переменной и цикл `for` являются инструкциями.

Присваивание в Kotlin не является выражением:

```kotlin
var count = 0

count = 10
```

Нельзя использовать присваивание там, где ожидается значение:

```kotlin
// Так писать нельзя:
// val result = (count = 10)
```

### `if` как выражение

В Java `if` — управляющая конструкция, а для условного выбора значения существует тернарный оператор.

В Kotlin `if` непосредственно возвращает результат:

```kotlin
val age = 20

val category = if (age >= 18) "Взрослый" else "Ребёнок"
```

Если `if` используется как выражение, все возможные ветви должны возвращать значение совместимого типа.

### `when` как выражение

```kotlin
val score = 85

val grade = when {
    score >= 90 -> "Отлично"
    score >= 70 -> "Хорошо"
    score >= 50 -> "Удовлетворительно"
    else -> "Не сдал"
}
```

Результат `when` присваивается переменной `grade`.

### `try` как выражение

`try` тоже может возвращать значение:

```kotlin
val number = try {
    "123".toInt()
} catch (e: NumberFormatException) {
    0
}
```

Если преобразование успешно, `number` будет равен `123`. Если произошла ошибка, результатом станет `0`.

### Зачем понимать разницу

Это влияет на то, как можно записывать код.

Например, результат выражения можно:

- сохранить в переменную;
- передать в качестве аргумента;
- вернуть из функции;
- использовать как часть другого выражения.

Понимание выражений позволяет использовать идиоматичный синтаксис Kotlin вместо механического переноса конструкций из Java.

## 1.6. Проверка типа (`is`, `!is`) {#proverka-tipa-is-is}

Оператор `is` проверяет, принадлежит ли объект определённому типу.

```kotlin
val value: Any = "Kotlin"

if (value is String) {
    println("Это строка")
}
```

Результатом проверки является `Boolean`.

Оператор `!is` выполняет противоположную проверку:

```kotlin
val value: Any = 100

if (value !is String) {
    println("Это не строка")
}
```

Проверка типов полезна, когда функция принимает общий тип, например `Any`, но должна по-разному обрабатывать разные значения.

```kotlin
fun describe(value: Any): String {
    return when (value) {
        is String -> "Строка длиной ${value.length}"
        is Int -> "Целое число"
        is Boolean -> "Логическое значение"
        else -> "Неизвестный тип"
    }
}
```

### Проверка типа наследника

```kotlin
open class Animal

class Dog : Animal()

fun process(animal: Animal) {
    if (animal is Dog) {
        println("Это собака")
    }
}
```

`is` учитывает наследование: объект наследника также является экземпляром базового типа.

## 1.7. Smart Casts {#smart-casts}

Smart Cast — механизм Kotlin, при котором компилятор автоматически уточняет тип значения после проверки.

Без Smart Cast пришлось бы выполнять явное приведение:

```kotlin
fun printLength(value: Any) {
    if (value is String) {
        val text = value as String
        println(text.length)
    }
}
```

В Kotlin это не требуется:

```kotlin
fun printLength(value: Any) {
    if (value is String) {
        println(value.length)
    }
}
```

После проверки `value is String` компилятор понимает, что внутри блока значение можно использовать как `String`.

### Smart Cast после отрицательной проверки

```kotlin
fun printLength(value: Any) {
    if (value !is String) {
        return
    }

    println(value.length)
}
```

Если выполнение дошло до `println`, значит, значение точно является строкой.

### Smart Cast с логическими операторами

```kotlin
fun printLength(value: Any) {
    if (value is String && value.length > 5) {
        println(value.length)
    }
}
```

Во второй части выражения после `&&` компилятор уже знает, что `value` — строка.

### Smart Cast для nullable-значений

```kotlin
fun printName(name: String?) {
    if (name != null) {
        println(name.uppercase())
    }
}
```

После проверки `name != null` компилятор считает значение non-nullable внутри соответствующей области.

### Когда Smart Cast невозможен

Компилятор должен быть уверен, что значение не изменится между проверкой и использованием.

Smart Cast обычно доступен для:

- локальных `val`;
- локальных `var`, если компилятор может доказать, что они не изменяются между проверкой и использованием;
- свойств с гарантированно стабильным доступом.

Он может быть недоступен для:

- изменяемых свойств (`var`) с потенциально изменяемым значением;
- свойств с пользовательским getter;
- открытых свойств, которые могут быть переопределены;
- значений, которые могут измениться из другого потока или через внешнюю ссылку.

Пример:

```kotlin
class User(
    var name: String?
) {
    fun printName() {
        if (name != null) {
            // Smart Cast может быть недоступен,
            // потому что name — изменяемое свойство.
            println(name.length)
        }
    }
}
```

Более безопасный вариант:

```kotlin
class User(
    var name: String?
) {
    fun printName() {
        val currentName = name

        if (currentName != null) {
            println(currentName.length)
        }
    }
}
```

Теперь `currentName` — локальный `val`, который не переназначается.

## 1.8. Проверка принадлежности диапазону (`in`, `!in`) {#proverka-prinadlezhnosti-diapazonu-in-in}

Оператор `in` проверяет, принадлежит ли значение диапазону или коллекции.

```kotlin
val age = 25

if (age in 18..65) {
    println("Рабочий возраст")
}
```

Диапазон `18..65` включает обе границы.

`!in` проверяет обратное условие:

```kotlin
val score = 120

if (score !in 0..100) {
    println("Некорректный балл")
}
```

### Диапазоны без верхней границы

`until` позволяет создать диапазон, не включающий последнее значение:

```kotlin
for (number in 0 until 5) {
    println(number)
}
```

Результат: `0, 1, 2, 3, 4`.

В современных версиях Kotlin для этого также существует оператор `..<`:

```kotlin
val range = 0..<5
```

### Принадлежность коллекции

`in` можно использовать для проверки наличия элемента в коллекции:

```kotlin
val allowedRoles = setOf("ADMIN", "MODERATOR")

val userRole = "ADMIN"

if (userRole in allowedRoles) {
    println("Доступ разрешён")
}
```

### Использование в `when`

```kotlin
val score = 85

val grade = when (score) {
    in 90..100 -> "A"
    in 80..89 -> "B"
    in 70..79 -> "C"
    in 60..69 -> "D"
    in 0..59 -> "F"
    else -> "Некорректный балл"
}
```

## Практика

1. Создай Kotlin-файл с `package`, `import`, top-level переменной и функцией `main`.
2. Создай многострочную строку с использованием `trimIndent()`.
3. Напиши KDoc для функции, принимающей имя и возвращающей приветствие.
4. Перепиши несколько примеров с точками с запятой без них.
5. Покажи разницу между выражением и инструкцией на собственных примерах.
6. Напиши функцию, принимающую `Any`, и определяющую тип значения через `is`.
7. Используй `when` для обработки `String`, `Int` и `Boolean`.
8. Напиши функцию, которая использует Smart Cast после проверки типа.
9. Покажи пример, в котором Smart Cast не работает для изменяемого свойства.
10. Используй `in` и `!in` для проверки диапазона и принадлежности коллекции.

## Самопроверка

- [ ] Понимаю структуру Kotlin-файла.
- [ ] Знаю назначение `package` и `import`.
- [ ] Понимаю, что такое top-level declarations.
- [ ] Умею использовать шаблонные и многострочные строки.
- [ ] Знаю разницу между однострочными комментариями, блочными комментариями и KDoc.
- [ ] Понимаю, почему точка с запятой обычно не нужна.
- [ ] Могу отличить выражение от инструкции.
- [ ] Умею использовать `is` и `!is`.
- [ ] Понимаю, как работает Smart Cast.
- [ ] Знаю ограничения Smart Cast.
- [ ] Умею использовать `in`, `!in`, `..`, `until` и `..<`.

### Вопросы на собеседовании

:::qa
- **Чем Kotlin-файл отличается от Java-класса с точки зрения структуры?** — В Kotlin один файл может содержать несколько классов, интерфейсов и функций верхнего уровня, а Java-файл обычно содержит один публичный класс с именем файла.
- **Обязательно ли помещать каждый класс в отдельный `.kt`-файл?** — Нет, в одном `.kt`-файле можно объявить несколько классов; число публичных классов на файл не ограничено.
- **Что такое top-level function?** — Функция, объявленная вне класса на уровне файла; на JVM она компилируется в статический метод класса с суффиксом `Kt`.
- **В чём разница между выражением и инструкцией?** — Выражение имеет значение и может стоять в правой части присваивания, инструкция выполняет действие и значения не возвращает.
- **Почему в Kotlin `if` может возвращать значение?** — Потому что `if` в Kotlin — выражение: последнее выражение выбранной ветки становится его результатом, поэтому `val x = if (ok) 1 else 0` допустимо.
- **Что такое Smart Cast и когда компилятор его выполняет?** — Это автоматическое приведение типа после проверки `is` или `!= null`, когда компилятор доказывает, что значение не изменится между проверкой и использованием.
- **Почему Smart Cast может не работать для `var`-свойства?** — Потому что `var` может измениться между проверкой и использованием в том числе из другого потока, а для свойства с кастомным геттером гарантий нет.
- **Чем отличаются `is` и `as`?** — `is` проверяет тип и возвращает `Boolean`, а `as` выполняет приведение и бросает `ClassCastException` при несовпадении; безопасный вариант — `as?`.
- **Что проверяет оператор `in`?** — Принадлежность значения диапазону, коллекции или объекту с методом `contains`, например `x in 1..10`.
:::

### Дополнительные официальные источники

- [Basic syntax](https://kotlinlang.org/docs/basic-syntax.html)
- [Coding conventions](https://kotlinlang.org/docs/coding-conventions.html)
- [Strings](https://kotlinlang.org/docs/strings.html)
- [Control flow](https://kotlinlang.org/docs/control-flow.html)
- [Type checks and casts](https://kotlinlang.org/docs/typecasts.html)
- [Ranges and progressions](https://kotlinlang.org/docs/ranges.html)
- [Documenting Kotlin code (KDoc)](https://kotlinlang.org/docs/kotlin-doc.html)

---

# 2. Null Safety {#null-safety}

Null Safety — механизм Kotlin, который позволяет явно выражать возможность отсутствия значения и предотвращать большое количество ошибок, связанных с `null`.

В Java и многих других языках переменная ссылочного типа может содержать `null`, даже если разработчик этого не ожидает. При обращении к такому объекту возникает `NullPointerException`.

Kotlin включает информацию о nullable-значениях непосредственно в систему типов.

Это позволяет обнаруживать многие потенциальные ошибки на этапе компиляции.

## 2.1. Nullable и non-null типы {#nullable-i-non-null-tipy}

В Kotlin типы по умолчанию non-nullable.

```kotlin
val name: String = "Alex"
```

Переменная `name` не может содержать `null`.

```kotlin
// Ошибка компиляции:
// val name: String = null
```

Если переменная может не иметь значения, используется nullable-тип:

```kotlin
val name: String? = null
```

Знак `?` после имени типа означает, что значение может быть либо объектом соответствующего типа, либо `null`.

### Сравнение

```kotlin
val firstName: String = "Alex"
val lastName: String? = null
```

Типы:

- `String` — строка, которая гарантированно существует;
- `String?` — строка, которая может отсутствовать.

Это разные типы, поэтому напрямую передать nullable-строку в функцию, ожидающую обычную строку, нельзя.

```kotlin
fun printName(name: String) {
    println(name)
}

val userName: String? = null

// Ошибка компиляции:
// printName(userName)
```

Сначала необходимо обработать возможность `null`.

### Nullable-типы для разных значений

```kotlin
val age: Int? = null
val isAuthorized: Boolean? = null
val user: User? = null
val users: List<User>? = null
```

Знак `?` относится к типу непосредственно перед ним.

Поэтому:

```kotlin
val users: List<User?> = emptyList()
```

означает список, в котором элементы могут быть `null`.

А:

```kotlin
val users: List<User>? = null
```

означает, что сам список может отсутствовать, но его элементы обязаны быть `User`.

Это важное различие:

| Тип | Значение |
|---|---|
| `List<User>` | Список существует, все элементы — User |
| `List<User?>` | Список существует, элементы могут быть null |
| `List<User>?` | Список может отсутствовать |
| `List<User?>?` | Может отсутствовать и список, и отдельные элементы |

### Nullable-примитивы

```kotlin
val age: Int? = null
```

На JVM nullable-примитивы могут представляться boxed-объектами, потому что обычное примитивное значение не может содержать `null`.

На уровне исходного кода Kotlin при этом сохраняет единый и понятный синтаксис.

## 2.2. Safe call operator (`?.`) {#safe-call-operator}

Safe call operator позволяет обращаться к свойству или методу nullable-объекта без риска вызвать функцию на `null`.

```kotlin
val name: String? = null

val length = name?.length

println(length) // null
```

Если `name` не равен `null`, будет получена длина строки.

Если равен `null`, всё выражение вернёт `null`.

### Вызов функции

```kotlin
val name: String? = "Alex"

println(name?.uppercase())
```

Безопасный вызов аналогичен следующему условию:

```kotlin
val result = if (name != null) {
    name.uppercase()
} else {
    null
}
```

### Цепочка безопасных вызовов

```kotlin
class Address(
    val city: String
)

class User(
    val name: String,
    val address: Address?
)

val user = User(
    name = "Alex",
    address = Address("Helsinki")
)

val city = user.address?.city

println(city)
```

Если `address` отсутствует, результат `city` будет `null`.

Можно строить более длинные цепочки:

```kotlin
val cityName = user.address?.city?.uppercase()
```

Если любой nullable-объект в цепочке отсутствует, последующие операции не выполняются.

### Safe call с изменением значения

```kotlin
var name: String? = null

name?.let {
    println(it)
}
```

Если `name` равен `null`, тело `let` не будет вызвано.

## 2.3. Elvis operator (`?:`) {#elvis-operator}

Elvis operator позволяет задать значение по умолчанию, если выражение слева равно `null`.

```kotlin
val name: String? = null

val displayName = name ?: "Unknown"

println(displayName) // Unknown
```

Если `name` не равен `null`, возвращается его значение.

Если равен `null`, используется правая часть выражения.

### Получение значения по умолчанию

```kotlin
val age: Int? = null

val userAge = age ?: 0
```

### Комбинация с Safe Call

```kotlin
val name: String? = null

val length = name?.length ?: 0
```

Если имя отсутствует, длина будет равна нулю.

### Ранний выход через Elvis

Elvis operator можно использовать вместе с `return`:

```kotlin
fun printUserName(name: String?) {
    val actualName = name ?: return

    println(actualName)
}
```

Если `name` равен `null`, функция сразу завершается.

Также можно выбросить исключение:

```kotlin
fun getUserName(name: String?): String {
    return name ?: throw IllegalArgumentException(
        "Имя пользователя отсутствует"
    )
}
```

Это полезно, когда значение обязательно для выполнения операции.

## 2.4. Not-null assertion (`!!`) {#not-null-assertion}

Оператор `!!` принудительно преобразует nullable-значение в non-nullable.

```kotlin
val name: String? = "Alex"

val actualName: String = name!!

println(actualName.length)
```

Если значение равно `null`, возникнет `NullPointerException`.

```kotlin
val name: String? = null

// Вызовет NullPointerException:
// println(name!!.length)
```

### Почему `!!` опасен

Он отключает проверку nullability в конкретном месте программы.

Разработчик фактически говорит компилятору: «Я гарантирую, что здесь не будет null».

Если гарантия неверна, приложение завершится с ошибкой.

Плохой вариант:

```kotlin
fun getLength(name: String?): Int {
    return name!!.length
}
```

Более безопасный вариант:

```kotlin
fun getLength(name: String?): Int {
    return name?.length ?: 0
}
```

Или, если отсутствие значения является ошибкой:

```kotlin
fun getLength(name: String?): Int {
    val actualName = requireNotNull(name) {
        "Имя не должно быть null"
    }

    return actualName.length
}
```

`!!` следует использовать только в ситуациях, где отсутствие значения действительно невозможно и это обосновано архитектурой программы.

В обычной прикладной логике чаще можно обойтись без него.

## 2.5. Safe cast (`as?`) {#safe-cast-as}

Оператор `as` выполняет явное приведение типа.

```kotlin
val value: Any = "Kotlin"

val text = value as String
```

Если объект не является указанным типом, обычное приведение выбрасывает `ClassCastException`.

```kotlin
val value: Any = 100

// Ошибка во время выполнения:
// val text = value as String
```

Для безопасного приведения существует оператор `as?`.

```kotlin
val value: Any = 100

val text = value as? String

println(text) // null
```

Если преобразование возможно, возвращается объект нужного типа.

Если нет — `null`.

Поэтому результат `as?` всегда имеет nullable-тип.

### Практический пример

```kotlin
fun getStringLength(value: Any): Int? {
    val text = value as? String

    return text?.length
}
```

Использование:

```kotlin
println(getStringLength("Kotlin")) // 6
println(getStringLength(100)) // null
```

### Safe cast и обычный cast

| Оператор | Поведение при несовместимом типе |
|---|---|
| `as` | Выбрасывает `ClassCastException` |
| `as?` | Возвращает `null` |

Для ситуаций, в которых тип заранее неизвестен, обычно безопаснее использовать `as?` или проверку `is`.

## 2.6. `let` для обработки nullable-значений {#let-dlya-obrabotki-nullable-znacheniy}

`let` — функция стандартной библиотеки Kotlin, которая позволяет выполнить блок кода с объектом в качестве аргумента.

В сочетании с `?.` она часто используется для работы с nullable-значениями.

```kotlin
val name: String? = "Alex"

name?.let { value ->
    println(value.uppercase())
}
```

Если `name` не равен `null`, блок выполнится.

Внутри блока `value` имеет тип `String`, а не `String?`.

Можно использовать неявное имя параметра `it`:

```kotlin
name?.let {
    println(it.uppercase())
}
```

### Преобразование результата

`let` возвращает результат своего блока:

```kotlin
val name: String? = "Alex"

val length = name?.let {
    it.length
}

println(length) // 4
```

Тип результата здесь `Int?`, потому что исходная строка может отсутствовать.

### Несколько операций с nullable-значением

```kotlin
fun printUserInfo(name: String?) {
    name?.let {
        println("Имя: $it")
        println("Длина: ${it.length}")
        println("Верхний регистр: ${it.uppercase()}")
    }
}
```

### Когда использовать `let`

Он полезен, если нужно:

- выполнить несколько действий только при наличии значения;
- создать временную переменную;
- преобразовать объект в другой тип;
- избежать повторных обращений к nullable-переменной.

Не следует использовать `let` для каждой операции с nullable-значениями. Иногда обычный `if` делает код понятнее.

## 2.7. Smart Cast и проверка на null {#smart-cast-i-proverka-na-null}

Kotlin умеет автоматически уточнять тип после проверки значения.

```kotlin
fun printName(name: String?) {
    if (name != null) {
        println(name.uppercase())
    }
}
```

Внутри условия `name` рассматривается как `String`.

Это называется Smart Cast.

### Проверка и ранний выход

```kotlin
fun printName(name: String?) {
    if (name == null) {
        return
    }

    println(name.uppercase())
}
```

После раннего выхода компилятор понимает, что дальнейший код выполняется только при наличии значения.

### Smart Cast и логические операторы

```kotlin
fun printLength(name: String?) {
    if (name != null && name.length > 5) {
        println(name.length)
    }
}
```

Вторая часть условия безопасна, потому что при `&&` она вычисляется только тогда, когда первая часть истинна.

### Ограничения Smart Cast

Компилятор должен быть уверен, что переменная не изменится после проверки.

Поэтому Smart Cast может быть недоступен для изменяемых свойств класса:

```kotlin
class User {
    var name: String? = null

    fun printName() {
        if (name != null) {
            // Компилятор не всегда может гарантировать,
            // что name не изменится между проверкой и использованием.
        }
    }
}
```

Решение — сохранить значение в локальную переменную:

```kotlin
class User {
    var name: String? = null

    fun printName() {
        val currentName = name

        if (currentName != null) {
            println(currentName.uppercase())
        }
    }
}
```

## 2.8. Платформенные типы при взаимодействии с Java {#platformennye-tipy-pri-vzaimodeystvii-s-java}

Kotlin имеет строгую систему null safety, но при взаимодействии с Java не всегда может точно определить, может ли возвращаемое значение быть `null`.

В Java типы ссылок по умолчанию не содержат такой информации.

Рассмотрим Java-класс:

```java
public class UserProvider {

    public String getName() {
        return null;
    }
}
```

При вызове из Kotlin компилятор не может автоматически узнать, что `getName()` возвращает `null`.

Для таких Java-типов используется понятие **platform type**.

В диагностических сообщениях компилятора такой тип может обозначаться как `String!`.

Это обозначение не используется напрямую в исходном Kotlin-коде.

### Использование platform type

```kotlin
val provider = UserProvider()

val name = provider.name
```

Компилятор позволяет использовать результат достаточно свободно, потому что информация о nullability отсутствует.

Но реальное значение может оказаться `null`.

Если присвоить его non-nullable-переменной:

```kotlin
val name: String = provider.name
```

и Java вернёт `null`, во время выполнения может возникнуть `NullPointerException`.

### Безопасная обработка

Лучше явно указать ожидаемую nullability:

```kotlin
val name: String? = provider.name
```

Теперь код Kotlin обязан обработать возможное отсутствие значения:

```kotlin
println(name?.uppercase())
```

### Аннотации nullability

Java может использовать аннотации, указывающие, что значение допускает или не допускает `null`.

В зависимости от используемых аннотаций и их распознавания Kotlin получает более точную информацию:

```java
import org.jetbrains.annotations.Nullable;

public class UserProvider {

    @Nullable
    public String getName() {
        return null;
    }
}
```

Теперь Kotlin понимает, что результат может быть nullable.

При работе с Java-библиотеками необходимо учитывать:

- наличие аннотаций nullability;
- документацию API;
- возможность возврата `null`;
- возможность передачи `null` через Java-код в Kotlin-коллекции и методы.

### Почему Null Safety не гарантирует полного отсутствия NPE

Null Safety значительно сокращает количество ошибок, но не исключает их полностью.

NPE всё ещё может возникать из-за:

- оператора `!!`;
- Java interop и platform types;
- некорректной инициализации объектов;
- утечки `this` во время конструктора;
- некорректной работы с generic-типами и Java-кодом.

Поэтому важно правильно проектировать API и не полагаться только на проверки компилятора.

## Практика

1. Создай nullable и non-nullable переменные типа `String`.
2. Создай функцию, принимающую `String?`, и безопасно выведи длину строки.
3. Используй `?.` для доступа к свойству nullable-объекта.
4. Используй Elvis operator для значения по умолчанию.
5. Напиши функцию, которая завершает выполнение через `return`, если параметр равен `null`.
6. Покажи разницу между `!!` и `?.`.
7. Используй `as?` для безопасного преобразования `Any` в `String`.
8. Обработай nullable-значение через `let`.
9. Используй Smart Cast после проверки на `null`.
10. Объясни, почему Kotlin не всегда может выполнить Smart Cast для `var`-свойства.
11. Изучи Java-класс без аннотаций nullability и объясни, почему его методы возвращают platform types.

## Самопроверка

- [ ] Понимаю разницу между nullable и non-nullable типами.
- [ ] Знаю, что означает знак `?` в Kotlin.
- [ ] Понимаю разницу между `List<User?>` и `List<User>?`.
- [ ] Умею использовать safe call `?.`.
- [ ] Умею использовать Elvis operator `?:`.
- [ ] Понимаю опасность оператора `!!`.
- [ ] Знаю разницу между `as` и `as?`.
- [ ] Умею использовать `let` для nullable-значений.
- [ ] Понимаю Smart Cast.
- [ ] Знаю, почему Smart Cast не всегда работает для изменяемых свойств.
- [ ] Понимаю, что такое platform types.
- [ ] Знаю, почему взаимодействие с Java может приводить к NPE.

### Вопросы на собеседовании

:::qa
- **Чем `String` отличается от `String?`?** — `String` гарантированно содержит объект, `String?` может быть `null`; компилятор запрещает передать `String?` туда, где ожидается `String`.
- **Что делает оператор `?.`?** — Вызывает метод или обращается к свойству только если получатель не `null`, иначе возвращает `null`.
- **В чём отличие `?:` от `!!`?** — `?:` возвращает значение по умолчанию для `null`, а `!!` принудительно снимает nullable и бросает `NullPointerException`, если значение равно `null`.
- **Что произойдёт при вызове `!!` на `null`?** — Будет брошен `NullPointerException`: оператор `!!` снимает с компилятора ответственность за проверку.
- **Чем `as` отличается от `as?`?** — `as` при несовпадении типа бросает `ClassCastException`, а `as?` возвращает `null`.
- **Как работает `let` в сочетании с `?.`?** — `value?.let { ... }` выполняет лямбду только для не-null значения и передаёт его как `it`, возвращая результат лямбды.
- **Что такое Smart Cast?** — Автоматическое сужение типа до non-null после проверки `!= null` или `is`, если компилятор уверен, что значение не изменится.
- **Почему Smart Cast может не работать с `var`-свойством?** — Потому что `var` может быть изменён между проверкой и использованием, в том числе из другого потока, поэтому гарантии нет.
- **Что такое platform type?** — Тип из Java-кода (`String!`), про nullable-ность которого Kotlin ничего не знает: компилятор разрешает оба варианта, а ошибка проявляется в рантайме.
- **Почему даже в Kotlin возможен `NullPointerException`?** — Из-за `!!`, platform-типов из Java, приведений без проверки и Java-библиотек, которые возвращают `null` из API без аннотаций.
:::

### Дополнительные официальные источники

- [Null safety](https://kotlinlang.org/docs/null-safety.html)
- [Type checks and casts](https://kotlinlang.org/docs/typecasts.html)
- [Calling Java from Kotlin](https://kotlinlang.org/docs/java-interop.html)
- [Nullability annotations in Java and Kotlin](https://kotlinlang.org/docs/java-to-kotlin-nullability-guide.html)

---

# 3. Data Class {#data-class}

`data class` — специальный вид класса Kotlin, предназначенный для представления данных.

Он избавляет разработчика от необходимости вручную реализовывать стандартные методы сравнения, копирования и преобразования объекта в строку.

Data-классы особенно часто встречаются в Android-разработке:

- модели пользователя;
- DTO для сетевых запросов;
- сущности базы данных;
- UI State;
- результаты операций;
- модели элементов списка.

## 3.1. Синтаксис `data class` {#sintaksis-data-class}

Для объявления класса данных используется ключевое слово `data`:

```kotlin
data class User(
    val name: String,
    val age: Int
)
```

Объект создаётся обычным способом:

```kotlin
val user = User(
    name = "Alex",
    age = 25
)
```

Главное отличие от обычного класса — компилятор автоматически генерирует ряд полезных методов.

Для data class генерируются:

- `equals()`;
- `hashCode()`;
- `toString()`;
- `componentN()`;
- `copy()`.

Генерация выполняется на основании свойств первичного конструктора.

### Основные требования

Чтобы класс мог быть объявлен через `data`, необходимо соблюдать условия:

1. Первичный конструктор должен содержать хотя бы один параметр.
2. Все параметры первичного конструктора должны быть объявлены через `val` или `var`.
3. Data class не может быть `abstract`, `open`, `sealed` или `inner`.

Правильно:

```kotlin
data class User(
    val name: String,
    val age: Int
)
```

Неправильно:

```kotlin
// Ошибка: нет параметров первичного конструктора.
// data class User()

// Ошибка: параметр не объявлен через val или var.
// data class User(name: String)

// Ошибка: data class не может быть open.
// open data class User(val name: String)
```

Data class может реализовывать интерфейсы:

```kotlin
interface Identifiable {
    val id: Int
}

data class User(
    override val id: Int,
    val name: String
) : Identifiable
```

### Data class и обычный класс

Обычный класс:

```kotlin
class User(
    val name: String,
    val age: Int
)
```

Data class:

```kotlin
data class User(
    val name: String,
    val age: Int
)
```

Во втором случае компилятор предоставляет дополнительные методы, основанные на свойствах первичного конструктора.

Это избавляет от большого количества шаблонного кода.

## 3.2. `copy()` и копирование объектов {#copy-i-kopirovanie-obektov}

Data class автоматически получает метод `copy()`.

Он создаёт новый объект того же класса, используя текущие значения свойств, если для них не переданы новые значения.

```kotlin
data class User(
    val name: String,
    val age: Int
)

val user = User("Alex", 25)

val updatedUser = user.copy(age = 26)

println(user)
// User(name=Alex, age=25)

println(updatedUser)
// User(name=Alex, age=26)
```

Исходный объект не изменился.

Был создан новый объект с другим значением `age`.

### Копирование без изменения свойств

```kotlin
val first = User("Alex", 25)

val second = first.copy()
```

`second` — отдельный экземпляр `User`.

```kotlin
println(first == second)  // true
println(first === second) // false
```

`==` проверяет структурное равенство.

`===` проверяет идентичность ссылок.

### Частичное копирование

Можно изменить только отдельные свойства:

```kotlin
val user = User(
    name = "Alex",
    age = 25
)

val updated = user.copy(
    age = 30
)
```

Остальные значения автоматически сохраняются.

### Shallow copy

`copy()` выполняет поверхностное копирование (*shallow copy*).

Это означает, что свойства-примитивы или неизменяемые значения копируются как значения, но ссылки на вложенные изменяемые объекты остаются общими.

Пример:

```kotlin
data class User(
    val name: String,
    val skills: MutableList<String>
)

val user = User(
    name = "Alex",
    skills = mutableListOf("Kotlin")
)

val copiedUser = user.copy()

copiedUser.skills.add("Android")

println(user.skills)
// [Kotlin, Android]

println(copiedUser.skills)
// [Kotlin, Android]
```

Оба объекта ссылаются на один и тот же список `skills`.

Это важная особенность, которую часто спрашивают на собеседованиях.

Если требуется независимая копия вложенной коллекции:

```kotlin
val copiedUser = user.copy(
    skills = user.skills.toMutableList()
)
```

Теперь списки разные.

### `copy()` не делает объект immutable

Даже если все свойства объявлены через `val`, вложенные объекты могут оставаться изменяемыми.

Поэтому неизменяемость data class зависит не только от `val`, но и от типов его свойств.

## 3.3. Деструктуризация (`componentN`) {#destrukturizatsiya-componentn}

Data class автоматически получает функции `componentN()`, которые соответствуют свойствам первичного конструктора.

```kotlin
data class User(
    val name: String,
    val age: Int,
    val city: String
)
```

Компилятор генерирует компоненты:

- `component1()` — `name`;
- `component2()` — `age`;
- `component3()` — `city`.

Их можно использовать напрямую:

```kotlin
val user = User("Alex", 25, "Helsinki")

println(user.component1()) // Alex
println(user.component2()) // 25
println(user.component3()) // Helsinki
```

Но чаще применяется деструктуризация.

```kotlin
val user = User("Alex", 25, "Helsinki")

val (name, age, city) = user

println(name)
println(age)
println(city)
```

Компилятор автоматически вызывает соответствующие `componentN()`.

### Пропуск элементов

Если часть значений не нужна, можно использовать `_`:

```kotlin
val (_, age, city) = user

println(age)
println(city)
```

### Деструктуризация в цикле

```kotlin
val users = listOf(
    User("Alex", 25, "Helsinki"),
    User("Maria", 30, "Berlin")
)

for ((name, age, city) in users) {
    println("$name, $age, $city")
}
```

### Деструктуризация Map

Map также предоставляет компоненты для пар ключ-значение:

```kotlin
val users = mapOf(
    1 to "Alex",
    2 to "Maria"
)

for ((id, name) in users) {
    println("$id: $name")
}
```

Порядок деструктуризации data class определяется порядком свойств в первичном конструкторе.

Поэтому изменение порядка свойств может повлиять на существующий код с деструктуризацией.

## 3.4. `equals()` и сравнение по значению {#equals-i-sravnenie-po-znacheniyu}

Обычный класс без переопределения `equals()` обычно сравнивается по идентичности объектов.

```kotlin
class User(
    val name: String,
    val age: Int
)

val first = User("Alex", 25)
val second = User("Alex", 25)

println(first == second) // false
```

Это два разных экземпляра, и обычный `equals()` не считает их равными.

Data class автоматически реализует структурное сравнение:

```kotlin
data class User(
    val name: String,
    val age: Int
)

val first = User("Alex", 25)
val second = User("Alex", 25)

println(first == second) // true
```

Объекты считаются равными, если значения свойств, участвующих в генерации `equals()`, совпадают.

### `==` и `===`

В Kotlin:

- `==` проверяет структурное равенство через `equals()`;
- `===` проверяет идентичность ссылок.

```kotlin
val first = User("Alex", 25)
val second = first.copy()

println(first == second)  // true
println(first === second) // false
```

### Какие свойства участвуют в сравнении

В `equals()` и `hashCode()` учитываются свойства первичного конструктора.

Свойства, объявленные только в теле класса, автоматически в сравнение не включаются.

```kotlin
data class User(
    val name: String
) {
    var age: Int = 0
}

val first = User("Alex")
val second = User("Alex")

first.age = 20
second.age = 30

println(first == second) // true
```

Хотя значения `age` различаются, объекты считаются равными.

Причина — `age` не входит в первичный конструктор.

Если свойство должно участвовать в сравнении, его следует добавить в первичный конструктор:

```kotlin
data class User(
    val name: String,
    val age: Int
)
```

## 3.5. `hashCode()` и `toString()` {#hashcode-i-tostring}

### `hashCode()`

`hashCode()` возвращает целочисленный хеш объекта.

Он используется различными структурами данных, например `HashSet` и `HashMap`.

Если два объекта равны через `equals()`, они обязаны иметь одинаковый `hashCode()`.

Обратное неверно: одинаковые хеш-коды не гарантируют равенство объектов.

```kotlin
data class User(
    val name: String,
    val age: Int
)

val first = User("Alex", 25)
val second = User("Alex", 25)

println(first.hashCode() == second.hashCode()) // true
```

### Почему важна согласованность `equals` и `hashCode`

Рассмотрим Set:

```kotlin
val users = hashSetOf(
    User("Alex", 25)
)

println(User("Alex", 25) in users) // true
```

Если объект равен другому по `equals()`, но имеет другой `hashCode()`, хеш-структуры могут работать некорректно.

Поэтому при ручной реализации `equals()` нужно согласованно реализовывать и `hashCode()`.

Data class делает это автоматически.

### `toString()`

`toString()` возвращает строковое представление объекта.

```kotlin
data class User(
    val name: String,
    val age: Int
)

val user = User("Alex", 25)

println(user)
```

Результат:

```text
User(name=Alex, age=25)
```

Это удобно при отладке и логировании.

Но не следует бездумно использовать `toString()` для объектов, содержащих пароли, токены и другие чувствительные данные: их значения могут попасть в логи.

## 3.6. Правила генерации методов {#pravila-generatsii-metodov}

Компилятор генерирует методы data class по определённым правилам.

| Метод | Назначение |
|---|---|
| `equals()` | Структурное сравнение |
| `hashCode()` | Хеш-код объекта |
| `toString()` | Читаемое строковое представление |
| `componentN()` | Получение свойств по порядку |
| `copy()` | Создание копии объекта |

В генерации участвуют свойства первичного конструктора.

### Свойства тела класса

```kotlin
data class User(
    val name: String
) {
    val isAdult: Boolean
        get() = false
}
```

`isAdult` не участвует в стандартных `equals()`, `hashCode()`, `copy()` и `componentN()`.

### Переопределение методов

Если в классе явно реализован `equals()`, `hashCode()` или `toString()` с подходящей сигнатурой, компилятор не генерирует собственную реализацию вместо него.

Если соответствующая реализация унаследована как `final`, она также может определять поведение вместо автоматически сгенерированной.

Для обычной разработки обычно не требуется вручную переопределять эти методы в data class.

## 3.7. Ограничения data class {#ogranicheniya-data-class}

Data class предназначен прежде всего для представления данных.

Он не может быть:

- `abstract`;
- `open`;
- `sealed`;
- `inner`.

У него должен быть первичный конструктор хотя бы с одним параметром, все параметры которого объявлены как `val` или `var`.

Также:

- `copy()` выполняет поверхностное копирование;
- свойства тела класса не участвуют в автоматически генерируемом сравнении;
- порядок `componentN()` зависит от порядка свойств первичного конструктора;
- data class не предназначен для автоматического создания глубокой копии графа объектов.

### Когда использовать data class

Подходящие случаи:

```kotlin
data class User(
    val id: Long,
    val name: String
)
```

```kotlin
data class Article(
    val title: String,
    val description: String
)
```

```kotlin
data class UserUiState(
    val isLoading: Boolean,
    val users: List<User>,
    val error: String?
)
```

Data class особенно удобен, когда важны значения объекта, а не его идентичность.

### Когда обычный класс предпочтительнее

Обычный класс может быть лучше, когда:

- идентичность объекта важнее его содержимого;
- состояние управляется сложной бизнес-логикой;
- автоматическое структурное сравнение не соответствует смыслу сущности;
- класс представляет сервис или поведение, а не данные.

Например, репозиторию обычно не требуется автоматический `copy()` и структурное сравнение.

## Практика

1. Создай `data class User` с полями `id`, `name`, `age`.
2. Создай два объекта с одинаковыми значениями и сравни их через `==` и `===`.
3. Используй `copy()` для изменения возраста пользователя.
4. Создай data class со списком навыков и проверь поведение поверхностного копирования.
5. Используй `component1()` и `component2()`.
6. Выполни деструктуризацию объекта.
7. Создай список пользователей и обойди его через деструктуризацию.
8. Добавь в тело data class свойство `isAdult` и проверь, участвует ли оно в `equals()`.
9. Используй data class в качестве ключа `HashMap`.
10. Объясни, почему два разных экземпляра могут считаться равными.

## Самопроверка

- [ ] Знаю, зачем нужен `data class`.
- [ ] Знаю требования к первичному конструктору.
- [ ] Могу перечислить генерируемые методы.
- [ ] Понимаю, как работает `copy()`.
- [ ] Знаю, что такое shallow copy.
- [ ] Понимаю назначение `componentN()`.
- [ ] Умею выполнять деструктуризацию.
- [ ] Понимаю разницу между `equals()` и `===`.
- [ ] Знаю, какие свойства участвуют в сравнении.
- [ ] Понимаю взаимосвязь `equals()` и `hashCode()`.
- [ ] Знаю ограничения data class.
- [ ] Могу объяснить, когда лучше использовать обычный класс.

### Вопросы на собеседовании

:::qa
- **Чем data class отличается от обычного класса?** — Компилятор дополнительно генерирует `equals()`, `hashCode()`, `toString()`, `copy()` и `componentN()` на основе свойств первичного конструктора.
- **Какие методы генерируются автоматически?** — `equals()`, `hashCode()`, `toString()`, `copy()` и по одному `componentN()` для каждого свойства первичного конструктора.
- **На основании каких свойств генерируются `equals()` и `hashCode()`?** — Только на свойствах, объявленных в первичном конструкторе; свойства из тела класса не участвуют.
- **Что такое `copy()`?** — Метод, создающий новый экземпляр с теми же значениями и позволяющий переопределить отдельные свойства именованными аргументами.
- **Выполняет ли `copy()` глубокое копирование?** — Нет, копирование поверхностное: ссылочные свойства по-прежнему указывают на те же объекты.
- **Что такое `componentN()`?** — Методы, сгенерированные для каждого свойства конструктора; они включают data class в деструктуризацию `val (a, b) = user`.
- **Чем отличаются `==` и `===`?** — `==` вызывает `equals()` и сравнивает содержимое, `===` сравнивает ссылки и истинен только для одного и того же объекта.
- **Участвуют ли свойства из тела класса в автоматическом сравнении?** — Нет, в сгенерированных `equals()`, `hashCode()` и `toString()` попадают только свойства первичного конструктора.
- **Можно ли объявить data class через `open`?** — Нет, data class не может быть `open`, `sealed` или `inner`: наследование запрещено, чтобы сохранить корректность сгенерированных методов.
- **Почему data class подходит для DTO и UI State?** — Сравнение по значению упрощает обновление состояния и тесты, а `copy()` удобно использовать для создания нового состояния с изменённым полем.
:::

### Дополнительные официальные источники

- [Data classes](https://kotlinlang.org/docs/data-classes.html)
- [Classes](https://kotlinlang.org/docs/classes.html)
- [Equality](https://kotlinlang.org/docs/equality.html)

---

# 4. Properties и Accessors {#properties-i-accessors}

В Kotlin свойства (*properties*) используются для представления данных объекта.

На первый взгляд они похожи на обычные поля классов, но имеют более гибкую модель доступа.

Каждое свойство может предоставлять getter, а изменяемое свойство — setter.

Это позволяет контролировать чтение и изменение данных, выполнять проверки, вычислять значения и скрывать внутреннюю реализацию.

## 4.1. Объявление свойств (`val` и `var`) {#obyavlenie-svoystv-val-i-var}

Свойства можно объявлять:

- внутри классов;
- внутри объектов;
- в `companion object`;
- на уровне файла;
- внутри интерфейсов.

### `val`

`val` объявляет свойство только для чтения.

```kotlin
class User {
    val name: String = "Alex"
}
```

После инициализации нельзя присвоить ему другое значение:

```kotlin
val user = User()

// Ошибка:
// user.name = "Maria"
```

### `var`

`var` объявляет изменяемое свойство:

```kotlin
class User {
    var age: Int = 25
}
```

Значение можно менять:

```kotlin
val user = User()

user.age = 26

println(user.age)
```

### Свойства в первичном конструкторе

```kotlin
class User(
    val name: String,
    var age: Int
)
```

Такая запись одновременно объявляет параметры конструктора и свойства объекта.

### Свойства на уровне файла

```kotlin
val appName = "Study Platform"

var launchCount = 0
```

Это top-level properties.

Они принадлежат пакету, а не отдельному экземпляру класса.

## 4.2. Getter и Setter {#getter-i-setter}

Getter и Setter — аксессоры (*accessors*), через которые выполняется чтение и изменение свойств.

### Getter

Getter вызывается при чтении свойства.

```kotlin
class User {
    val name: String = "Alex"
}
```

Логически обращение:

```kotlin
println(user.name)
```

эквивалентно вызову getter:

```kotlin
println(user.getName())
```

Это концептуальное представление. В исходном Kotlin-коде обычно используется синтаксис обращения к свойству.

### Setter

Setter вызывается при изменении свойства `var`.

```kotlin
class User {
    var age: Int = 25
}
```

Присваивание:

```kotlin
user.age = 30
```

выполняет setter.

У `val` setter отсутствует, потому что значение нельзя переназначить после инициализации.

### Аксессоры по умолчанию

Если пользовательские аксессоры не указаны, Kotlin генерирует их автоматически.

```kotlin
class Product {
    var price: Double = 100.0
}
```

По умолчанию:

- getter возвращает текущее значение свойства;
- setter записывает новое значение.

На JVM свойства обычно представлены методами доступа и хранящими значение полями в соответствии с правилами компиляции Kotlin.

Важно: синтаксис свойства в Kotlin — это не просто другое написание обычного поля.

## 4.3. Custom accessors {#custom-accessors}

Пользовательские аксессоры позволяют определить собственное поведение при чтении или изменении свойства.

### Custom getter

```kotlin
class Rectangle(
    val width: Int,
    val height: Int
) {
    val area: Int
        get() = width * height
}
```

Использование:

```kotlin
val rectangle = Rectangle(10, 20)

println(rectangle.area) // 200
```

Здесь `area` вычисляется каждый раз при обращении.

Отдельное хранимое поле для этого свойства не требуется.

### Getter с дополнительной логикой

```kotlin
class User(
    private val firstName: String,
    private val lastName: String
) {
    val fullName: String
        get() {
            return "$firstName $lastName"
        }
}
```

Getter может содержать несколько инструкций.

### Custom setter

```kotlin
class User {
    var age: Int = 0
        set(value) {
            require(value >= 0) {
                "Возраст не может быть отрицательным"
            }

            field = value
        }
}
```

`value` — новое значение, которое передаётся setter.

Присваивание:

```kotlin
val user = User()

user.age = 25
```

Вызовет пользовательский setter.

Если присвоить отрицательное число, возникнет исключение.

### Setter с преобразованием значения

```kotlin
class User {
    var name: String = ""
        set(value) {
            field = value.trim()
        }
}
```

Теперь строка очищается от пробелов при каждом присваивании.

```kotlin
val user = User()

user.name = "  Alex  "

println(user.name) // Alex
```

### Getter и Setter вместе

```kotlin
class Temperature {

    var celsius: Double = 0.0
        get() {
            println("Чтение температуры")
            return field
        }
        set(value) {
            require(value >= -273.15)
            field = value
        }
}
```

Getter и setter могут содержать различную логику.

Но лучше не размещать в них тяжёлые операции, сетевые запросы или сложные побочные эффекты.

Обращение к свойству должно оставаться предсказуемым.

## 4.4. Backing field (`field`) {#backing-field-field}

Backing field — внутреннее поле, в котором хранится значение свойства.

В пользовательском getter или setter к нему можно обратиться через специальное ключевое слово `field`.

```kotlin
class User {
    var name: String = ""
        set(value) {
            field = value.trim()
        }
}
```

Без `field` обращение к `name` внутри собственного setter вызвало бы рекурсивный вызов setter.

Неправильно:

```kotlin
class User {
    var name: String = ""
        set(value) {
            // Повторный вызов setter.
            // Приводит к бесконечной рекурсии.
            // name = value
        }
}
```

Правильно:

```kotlin
class User {
    var name: String = ""
        set(value) {
            field = value
        }
}
```

### `field` внутри getter

```kotlin
class Counter {

    var count: Int = 0
        get() {
            println("Текущее значение: $field")
            return field
        }
}
```

### Backing field и вычисляемое свойство

Не каждое свойство имеет backing field.

Например:

```kotlin
class Rectangle(
    val width: Int,
    val height: Int
) {
    val area: Int
        get() = width * height
}
```

`area` вычисляется на основе других свойств.

Отдельное значение для `area` не хранится.

В отличие от него:

```kotlin
class Counter {
    var count = 0
}
```

`count` хранит собственное состояние.

### Когда backing field создаётся автоматически

Компилятор создаёт backing field, когда свойству необходимо хранить значение.

Например:

- используются аксессоры по умолчанию;
- пользовательский getter или setter обращается к `field`;
- используется обычная инициализация хранимого свойства.

Вычисляемое свойство, getter которого не использует `field`, не требует отдельного backing field.

## 4.5. Visibility setter {#visibility-setter}

Getter всегда имеет ту же видимость, что и само свойство.

Но Setter можно сделать менее доступным.

```kotlin
class User {

    var age: Int = 0
        private set

    fun increaseAge() {
        age++
    }
}
```

Внешний код может читать `age`:

```kotlin
val user = User()

println(user.age)
```

Но не может изменить его напрямую:

```kotlin
// Ошибка:
// user.age = 30
```

Изменять значение можно только через методы самого класса.

### Пример с коллекцией

```kotlin
class UserDirectory {

    var users: List<String> = emptyList()
        private set

    fun addUser(name: String) {
        users = users + name
    }

    fun removeUser(name: String) {
        users = users - name
    }
}
```

Внешний код может получать список, но не может переназначить свойство.

### `internal set` и `protected set`

Setter может иметь и другие модификаторы:

```kotlin
class Account {

    var balance: Double = 0.0
        protected set
}
```

Это позволяет контролировать изменение свойства в зависимости от области видимости.

## 4.6. Разница между свойством и полем {#raznitsa-mezhdu-svoystvom-i-polem}

В Java поле — это непосредственно хранимое значение объекта.

В Kotlin свойство — более высокий уровень абстракции.

Свойство может:

- хранить значение;
- вычислять значение при каждом чтении;
- контролировать присваивание;
- предоставлять разные уровни доступа для getter и setter;
- не иметь backing field вообще.

Пример вычисляемого свойства:

```kotlin
class Rectangle(
    val width: Int,
    val height: Int
) {
    val perimeter: Int
        get() = 2 * (width + height)
}
```

Значение `perimeter` не хранится отдельно.

### Когда использовать свойства

Используй свойства для представления состояния объекта.

Используй функции, когда операция:

- выполняет сложное действие;
- имеет заметный побочный эффект;
- требует параметров;
- может завершиться ошибкой;
- выполняет длительную работу.

Например, `user.name` естественнее, чем `user.getName()`.

А вот `repository.loadUser(id)` лучше выражает полноценную операцию, чем искусственное свойство `repository.user`.

## Практика

1. Создай класс `User` со свойствами `name` и `age`.
2. Добавь custom getter для `fullName`.
3. Добавь custom setter, который удаляет пробелы из имени.
4. Реализуй проверку отрицательного возраста через setter.
5. Используй `field` внутри пользовательского аксессора.
6. Создай вычисляемое свойство `isAdult`.
7. Сделай setter свойства `balance` приватным.
8. Создай класс, который хранит список пользователей и управляет им через публичные методы.
9. Объясни, почему computed property не обязательно имеет backing field.
10. Объясни, почему присваивание `name = value` внутри setter может привести к рекурсии.

## Самопроверка

- [ ] Понимаю, что такое properties.
- [ ] Знаю разницу между `val` и `var` на уровне свойств.
- [ ] Понимаю роль getter и setter.
- [ ] Умею писать custom accessors.
- [ ] Понимаю назначение `field`.
- [ ] Знаю, когда создаётся backing field.
- [ ] Понимаю разницу между хранимым и вычисляемым свойством.
- [ ] Умею ограничивать видимость setter.
- [ ] Понимаю разницу между свойством и полем.

### Вопросы на собеседовании

:::qa
- **Что такое property в Kotlin?** — Объявление в классе, которое заменяет поле вместе с геттером и сеттером: обращение выглядит как к полю, но компилятор вызывает аксессоры.
- **Чем свойство отличается от поля?** — Свойство имеет геттер и, для `var`, сеттер; поле — просто ячейка памяти, доступная внутри класса через `field`.
- **Как работают getter и setter?** — Геттер вызывается при чтении `obj.x`, сеттер — при `obj.x = 1`; стандартные реализации можно заменить кастомными.
- **Когда вызывается custom getter?** — При каждом чтении свойства, поэтому вычисляемое свойство пересчитывается каждый раз, если результат не кэшировать.
- **Что такое backing field?** — Скрытое поле, которое компилятор создаёт для свойства, чтобы хранить значение между обращениями к аксессорам.
- **Для чего используется `field`?** — Чтобы обратиться к самому backing field внутри геттера или сеттера, не вызывая рекурсивно аксессор.
- **Почему нельзя обращаться к свойству напрямую внутри его setter?** — Потому что `x = value` внутри сеттера снова вызовет сеттер и приведёт к бесконечной рекурсии; нужно `field = value`.
- **Может ли свойство не иметь backing field?** — Да, если геттер вычисляет значение из других свойств и не использует `field`, например `val fullName get() = "$first $last"`.
- **Чем `private set` отличается от `private var`?** — `private set` оставляет геттер публичным и закрывает только запись, а `private var` делает невидимым всё свойство.
- **В чём преимущество вычисляемых свойств?** — Они не хранят дублирующие данные и всегда согласованы с источником, но пересчитываются при каждом обращении.
:::

### Дополнительные официальные источники

- [Properties](https://kotlinlang.org/docs/properties.html)
- [Visibility modifiers](https://kotlinlang.org/docs/visibility-modifiers.html)
- [Classes](https://kotlinlang.org/docs/classes.html)

---

# 5. Object и Companion Object {#object-i-companion-object}

Kotlin предоставляет специальный механизм `object`, который позволяет объявлять объекты без необходимости вручную создавать экземпляр класса.

Он используется для реализации singleton-объектов, временных анонимных реализаций интерфейсов и членов, логически связанных с классом.

Основные конструкции:

- object declaration;
- object expression;
- companion object.

## 5.1. Object declaration {#object-declaration}

Object declaration — объявление объекта с помощью ключевого слова `object`.

```kotlin
object AppConfig {
    val appName = "Study Platform"
    val version = "1.0.0"

    fun printInfo() {
        println("$appName ($version)")
    }
}
```

Использование:

```kotlin
AppConfig.printInfo()
```

Отдельно создавать экземпляр не требуется.

Объект уже существует и доступен по имени.

### Object declaration с интерфейсом

Объект может реализовывать интерфейс:

```kotlin
interface Logger {
    fun log(message: String)
}

object ConsoleLogger : Logger {
    override fun log(message: String) {
        println("[LOG] $message")
    }
}
```

Использование:

```kotlin
ConsoleLogger.log("Application started")
```

### Object declaration с наследованием

```kotlin
open class Animal {
    open fun makeSound() {
        println("Unknown sound")
    }
}

object DefaultAnimal : Animal() {
    override fun makeSound() {
        println("Default sound")
    }
}
```

Объект может наследовать класс или реализовывать интерфейсы по тем же основным правилам, что и обычный класс.

### Инициализация object declaration

Object declaration создаётся при первом обращении к нему.

Инициализация потокобезопасна.

Это означает, что при конкурентном первом доступе не должно возникнуть двух независимых экземпляров одного object declaration.

## 5.2. Singleton в Kotlin {#singleton-v-kotlin}

Singleton — паттерн проектирования, при котором существует только один экземпляр определённого типа.

В Kotlin object declaration предоставляет готовый механизм реализации singleton.

Без `object` пришлось бы самостоятельно контролировать создание единственного экземпляра.

```kotlin
object DatabaseConfig {
    const val DATABASE_NAME = "app.db"
    const val DATABASE_VERSION = 1

    fun printConfig() {
        println("$DATABASE_NAME, version $DATABASE_VERSION")
    }
}
```

Во всём приложении используется один объект `DatabaseConfig`.

### Singleton и состояние

Object declaration может хранить состояние:

```kotlin
object SessionManager {

    var currentUserId: Long? = null

    fun login(userId: Long) {
        currentUserId = userId
    }

    fun logout() {
        currentUserId = null
    }
}
```

Использование:

```kotlin
SessionManager.login(100)
println(SessionManager.currentUserId)
```

### Когда singleton полезен

Подходящие примеры:

- конфигурация приложения;
- неизменяемые наборы констант;
- объекты-утилиты;
- простые общие реестры;
- реализации интерфейсов без необходимости создавать экземпляры.

### Когда singleton может быть проблемой

Глобально доступный изменяемый объект создаёт общую точку изменения состояния.

Это может усложнить:

- тестирование;
- параллельное выполнение;
- изоляцию компонентов;
- управление временем жизни зависимостей;
- замену реализации.

Например, глобальный изменяемый `SessionManager` сложнее тестировать, чем отдельный объект с явно передаваемой зависимостью.

В Android-приложениях для сложных зависимостей часто предпочтительнее использовать Dependency Injection, а не создавать всё через singleton.

## 5.3. Object expression {#object-expression}

Object expression — выражение, которое создаёт анонимный объект.

В отличие от object declaration, оно не объявляет именованный singleton.

```kotlin
val logger = object {
    val name = "ConsoleLogger"

    fun log(message: String) {
        println("[$name] $message")
    }
}
```

Здесь создаётся объект с анонимным типом.

Его можно сохранить в переменную и обращаться к доступным членам:

```kotlin
logger.log("Application started")
```

### Реализация интерфейса без отдельного класса

Чаще всего object expression используется, когда требуется одноразовая реализация интерфейса.

```kotlin
interface ClickListener {
    fun onClick()
}
```

Создание объекта:

```kotlin
val listener = object : ClickListener {

    override fun onClick() {
        println("Кнопка нажата")
    }
}
```

Это позволяет реализовать интерфейс непосредственно в месте использования.

### Несколько интерфейсов

```kotlin
interface Logger {
    fun log(message: String)
}

interface Closeable {
    fun close()
}

val handler = object : Logger, Closeable {

    override fun log(message: String) {
        println(message)
    }

    override fun close() {
        println("Closed")
    }
}
```

### Доступ к внешним переменным

Object expression может обращаться к переменным внешней области видимости.

```kotlin
fun createCounter(): ClickListener {
    var count = 0

    return object : ClickListener {

        override fun onClick() {
            count++
            println("Нажатий: $count")
        }
    }
}
```

Объект сохраняет доступ к переменной `count`.

### Отличие от object declaration

Object expression:

- создаётся непосредственно в месте использования;
- может быть присвоен локальной переменной;
- не объявляет именованный singleton;
- подходит для одноразовых реализаций.

Object declaration:

- имеет собственное имя;
- объявляется отдельно;
- является singleton;
- инициализируется при первом обращении.

## 5.4. Companion object {#companion-object}

`companion object` — объект, объявленный внутри класса с ключевым словом `companion`.

Он позволяет создавать свойства и функции, которые логически связаны с классом, а не с конкретным экземпляром.

```kotlin
class User {

    companion object {
        const val DEFAULT_AGE = 18

        fun createGuest(): User {
            return User()
        }
    }
}
```

Вызов:

```kotlin
val guest = User.createGuest()

println(User.DEFAULT_AGE)
```

Создавать экземпляр `User` для вызова этих функций не требуется.

### Почему это не обычные static-члены

В Java существуют статические поля и методы класса.

В Kotlin `companion object` — настоящий объект, связанный с классом.

Его члены технически принадлежат самому объекту-компаньону, а не являются обычными instance-членами класса.

Это важное отличие.

На JVM с помощью `@JvmStatic` можно дополнительно генерировать настоящие статические методы или поля для совместимости с Java.

### Константы внутри companion object

```kotlin
class ApiConfig {

    companion object {
        const val BASE_URL = "https://api.example.com"
        const val TIMEOUT_SECONDS = 30
    }
}
```

Обращение:

```kotlin
println(ApiConfig.BASE_URL)
```

## 5.5. Обращение к членам companion object {#obraschenie-k-chlenam-companion-object}

Члены `companion object` можно использовать через имя содержащего класса.

```kotlin
class User {

    companion object {
        fun create(name: String): User {
            return User()
        }
    }
}

val user = User.create("Alex")
```

Не требуется писать:

```kotlin
User.Companion.create("Alex")
```

Хотя такой вариант тоже допустим для companion object без собственного имени.

### Доступ к private-членам класса

Companion object имеет доступ к приватным членам соответствующего класса.

Сам класс также может обращаться к приватным членам companion object.

```kotlin
class User(
    val name: String
) {

    companion object {
        private const val DEFAULT_NAME = "Guest"
    }

    fun printInfo() {
        println(name)
        println(DEFAULT_NAME)
    }
}
```

### Companion object как фабрика

Часто companion object используют для создания объектов:

```kotlin
class User private constructor(
    val name: String,
    val age: Int
) {

    companion object {

        fun create(name: String, age: Int): User {
            require(name.isNotBlank())
            require(age >= 0)

            return User(name, age)
        }

        fun createGuest(): User {
            return User("Guest", 0)
        }
    }
}
```

Использование:

```kotlin
val user = User.create("Alex", 25)
val guest = User.createGuest()
```

Это позволяет скрыть конструктор и контролировать создание экземпляров.

## 5.6. Именованный companion object {#imenovannyy-companion-object}

Имя companion object можно задать явно:

```kotlin
class User {

    companion object Factory {
        fun create(): User {
            return User()
        }
    }
}
```

Обращение через содержащий класс по-прежнему работает:

```kotlin
val user = User.create()
```

Можно обратиться непосредственно к объекту:

```kotlin
val factory = User.Factory

val anotherUser = factory.create()
```

Если имя не задано, объект получает имя `Companion`:

```kotlin
class User {
    companion object {
        fun create() = User()
    }
}

val companion = User.Companion
```

### Реализация интерфейса

Companion object тоже может реализовывать интерфейс:

```kotlin
interface Factory<T> {
    fun create(): T
}

class User : Factory<User> {

    override fun create(): User {
        return User()
    }

    companion object : Factory<User> {

        override fun create(): User {
            return User()
        }
    }
}
```

В реальных проектах фабричные методы и общие функции часто удобно размещать в companion object.

## 5.7. Отличие object от обычного класса {#otlichie-object-ot-obychnogo-klassa}

| `class` | `object declaration` | `object expression` |
|---|---|---|
| Описывает тип объектов | Создаёт единственный именованный объект | Создаёт анонимный объект |
| Можно создавать много экземпляров | Один экземпляр | Создаётся в месте использования |
| Есть имя класса | Есть имя объекта | Нет собственного имени типа |
| Может иметь конструктор | Не имеет обычного конструктора | Может реализовать типы через supertype |
| Обычное создание через конструктор | Обращение по имени объекта | Использование как выражения |

`companion object` — особый вариант object declaration, расположенный внутри класса.

### Когда что использовать

- `class` — когда нужны самостоятельные экземпляры сущности.
- `object` — когда нужен один общий экземпляр.
- `object expression` — когда нужна одноразовая реализация интерфейса или класса.
- `companion object` — когда нужно связать фабрику, константы или функции с конкретным классом.

## Практика

1. Создай `object AppConfig` с конфигурацией приложения.
2. Создай `object Logger`, реализующий интерфейс `Logger`.
3. Напиши интерфейс `ClickListener` и создай его реализацию через object expression.
4. Создай object expression, который изменяет внешнюю переменную.
5. Создай класс `User` с companion object.
6. Добавь в companion object константы.
7. Реализуй фабричный метод `createGuest()`.
8. Сделай companion object именованным.
9. Реализуй интерфейс `Factory<User>` через companion object.
10. Объясни, чем companion object отличается от статических методов Java.

## Самопроверка

- [ ] Понимаю синтаксис object declaration.
- [ ] Знаю, как Kotlin реализует singleton.
- [ ] Понимаю, когда объект инициализируется.
- [ ] Умею создать object expression.
- [ ] Понимаю доступ object expression к внешним переменным.
- [ ] Знаю назначение companion object.
- [ ] Умею обращаться к членам companion object через имя класса.
- [ ] Понимаю, что companion object — это объект, а не просто набор static-членов.
- [ ] Знаю, как объявить именованный companion object.
- [ ] Могу объяснить разницу между class, object declaration и object expression.

### Вопросы на собеседовании

:::qa
- **Что такое object declaration?** — `object Name { ... }` — объявление синглтона: единственный экземпляр создаётся лениво и потокобезопасно.
- **Как в Kotlin реализовать Singleton?** — Через `object`: экземпляр создаётся при первом обращении и гарантированно один на процесс без ручной синхронизации.
- **Когда инициализируется object declaration?** — Лениво, при первом обращении к любому его члену, потокобезопасно.
- **Что такое object expression?** — Анонимный объект вида `object : Interface { ... }`, создающий новый экземпляр в месте использования.
- **Для чего используют object expression в Android?** — Для одноразовых слушателей, компараторов и анонимных реализаций интерфейсов, когда именованный класс не нужен.
- **Что такое companion object?** — Объект внутри класса, члены которого доступны через имя класса и не привязаны к конкретному экземпляру.
- **Чем companion object отличается от static в Java?** — Это реальный объект с экземпляром: его можно передать как значение и заставить реализовать интерфейс; static — просто члены класса без объекта.
- **Можно ли реализовать интерфейс через companion object?** — Да, `companion object : Factory<User>` — тогда его можно передать туда, где ожидается `Factory`.
- **В чём разница между object и обычным классом?** — У `object` нет конструктора и существует один лениво созданный экземпляр, а экземпляры класса создаются через конструктор.
- **Почему чрезмерное использование singleton может усложнить тестирование?** — Глобальное состояние и жёсткая зависимость от конкретного экземпляра мешают подменить его заглушкой и делают тесты взаимозависимыми.
:::

### Дополнительные официальные источники

- [Object declarations and expressions](https://kotlinlang.org/docs/object-declarations.html)
- [Classes and objects](https://kotlinlang.org/docs/classes.html)
- [Calling Java from Kotlin](https://kotlinlang.org/docs/java-interop.html)

---

# 6. Extension Functions {#extension-functions}

Extension functions — механизм Kotlin, позволяющий добавлять функции к существующим типам без изменения исходного класса и без наследования.

Расширения особенно полезны, когда:

- необходимо добавить удобный метод к стороннему классу;
- нельзя изменить исходный код библиотеки;
- требуется вынести вспомогательную логику;
- нужно сделать API более выразительным;
- необходимо сгруппировать повторяющиеся операции.

В Kotlin существуют extension functions и extension properties.

## 6.1. Синтаксис extension functions {#sintaksis-extension-functions}

Для объявления extension function перед именем функции указывается тип, который расширяется.

```kotlin
fun String.firstChar(): Char {
    return this.first()
}
```

Здесь:

- `String` — тип-получатель;
- `firstChar` — имя расширения;
- `this` — объект, на котором вызывается функция.

Использование:

```kotlin
val name = "Kotlin"

println(name.firstChar()) // K
```

Вызов выглядит так, будто `firstChar()` является обычным методом `String`.

Но исходный класс `String` не изменился.

### Более практичный пример

```kotlin
fun String.isValidEmail(): Boolean {
    return contains("@") && contains(".")
}
```

Использование:

```kotlin
val email = "alex@example.com"

println(email.isValidEmail())
```

### Extension functions для собственных классов

```kotlin
data class User(
    val firstName: String,
    val lastName: String
)

fun User.fullName(): String {
    return "$firstName $lastName"
}
```

Использование:

```kotlin
val user = User("Alex", "Smith")

println(user.fullName())
```

Теперь функция вызывается через объект `User`, хотя она не объявлена внутри класса.

## 6.2. Receiver и receiver type {#receiver-i-receiver-type}

В extension function используется понятие receiver — объект, на котором вызывается расширение.

В объявлении:

```kotlin
fun String.isBlankOrShort(): Boolean {
    return isBlank() || length < 3
}
```

`String` — receiver type.

Внутри функции конкретный объект-получатель доступен через `this`.

```kotlin
fun String.printUppercase() {
    println(this.uppercase())
}
```

Поскольку `this` часто можно опускать:

```kotlin
fun String.printUppercase() {
    println(uppercase())
}
```

Оба варианта эквивалентны в данном контексте.

### Receiver и обычный параметр

Обычная функция:

```kotlin
fun getLength(text: String): Int {
    return text.length
}
```

Расширение:

```kotlin
fun String.getLength(): Int {
    return length
}
```

Вызовы отличаются:

```kotlin
getLength("Kotlin")

"Kotlin".getLength()
```

Extension function позволяет записывать операции в форме, естественной для конкретного типа.

### Несколько extension functions для одного типа

```kotlin
fun String.firstChar(): Char = first()

fun String.lastChar(): Char = last()

fun String.reversedText(): String = reversed()
```

Все три функции расширяют `String`.

Их можно разместить в одном файле или разделить по смыслу на отдельные файлы.

## 6.3. Extension properties {#extension-properties}

Kotlin позволяет объявлять расширяющие свойства.

```kotlin
val String.firstCharacter: Char
    get() = first()
```

Использование:

```kotlin
val text = "Kotlin"

println(text.firstCharacter)
```

В отличие от extension function, расширение выглядит как свойство.

### Вычисляемое расширение

```kotlin
val String.wordCount: Int
    get() = trim()
        .split(Regex("\\s+"))
        .count { it.isNotEmpty() }
```

Использование:

```kotlin
val text = "Kotlin is a programming language"

println(text.wordCount)
```

### Mutable extension property

Можно объявить расширяющее свойство `var`, но необходимо реализовать getter и setter:

```kotlin
data class House(
    val street: String
)

private val houseNumbers = mutableMapOf<House, Int>()

var House.number: Int
    get() = houseNumbers[this] ?: 1
    set(value) {
        houseNumbers[this] = value
    }
```

Здесь значение хранится во внешнем `Map`, а не в самом объекте.

Это связано с тем, что расширение не добавляет полей в исходный класс.

### Ограничение extension properties

Расширяющее свойство не может иметь собственного backing field.

Поэтому нельзя просто объявить:

```kotlin
// Не скомпилируется:
// var String.customValue: Int = 0
```

У расширения нет собственного места для хранения дополнительного состояния внутри расширяемого объекта.

Оно может только вычислять значение через getter и setter или использовать внешнее хранилище.

## 6.4. Nullable receiver {#nullable-receiver}

Extension function может расширять nullable-тип.

```kotlin
fun String?.orDefault(): String {
    return this ?: "Unknown"
}
```

Использование:

```kotlin
val name: String? = null

println(name.orDefault()) // Unknown
```

Это удобно, потому что внутри функции можно явно обработать `null`.

Другой пример:

```kotlin
fun String?.printIfNotNull() {
    if (this != null) {
        println(this)
    }
}
```

Вызов:

```kotlin
val name: String? = "Alex"

name.printIfNotNull()
```

Даже если переменная равна `null`, вызов допустим, поскольку receiver type объявлен как `String?`.

## 6.5. Вызов extension-функций {#vyzov-extension-funktsiy}

Расширения вызываются так же, как методы объекта:

```kotlin
fun Int.isPositive(): Boolean {
    return this > 0
}

val number = 10

println(number.isPositive())
```

Но расширение должно быть доступно в области видимости.

Если оно объявлено в другом пакете, его нужно импортировать:

```kotlin
import com.example.extensions.isPositive
```

Для расширений можно использовать импорт с alias:

```kotlin
import com.example.extensions.isPositive as positive
```

Теперь:

```kotlin
println(10.positive())
```

### Расширение в стандартных библиотеках

Kotlin сам активно использует extensions.

Например:

```kotlin
val name = "Kotlin"

println(name.uppercase())
println(name.take(3))
println(name.reversed())
```

Многие привычные операции стандартной библиотеки реализованы как функции-расширения.

## 6.6. Ограничения extension-функций {#ogranicheniya-extension-funktsiy}

Главное ограничение — расширения не добавляют реальные члены в исходный класс.

Они не получают особых привилегий и не меняют его структуру.

### Extension function не может обращаться к private-членам

```kotlin
class User(
    private val password: String
)

// Ошибка:
// fun User.printPassword() {
//     println(password)
// }
```

Расширение не является частью реализации `User`, поэтому не получает доступ к его приватному состоянию.

### Extensions не переопределяют методы

```kotlin
open class Animal

class Dog : Animal()

fun Animal.makeSound() {
    println("Unknown sound")
}

fun Dog.makeSound() {
    println("Woof")
}
```

Эти две функции — разные расширения, а не переопределение метода.

### Member function имеет приоритет

Если в классе есть функция с такой же сигнатурой, что и у extension function, при вызове используется функция-член класса.

```kotlin
class User {
    fun printInfo() {
        println("Member function")
    }
}

fun User.printInfo() {
    println("Extension function")
}

val user = User()

user.printInfo() // Member function
```

## 6.7. Статическое разрешение расширений {#staticheskoe-razreshenie-rasshireniy}

Extension functions разрешаются статически.

Это означает, что компилятор выбирает расширение по объявленному типу receiver, а не по фактическому типу объекта во время выполнения.

```kotlin
open class Animal

class Dog : Animal()

fun Animal.getType(): String {
    return "Animal"
}

fun Dog.getType(): String {
    return "Dog"
}
```

Теперь:

```kotlin
fun printType(animal: Animal) {
    println(animal.getType())
}

printType(Dog())
```

Результат:

```text
Animal
```

Почему?

Параметр функции `printType` объявлен как `Animal`.

Поэтому компилятор выбирает `Animal.getType()`, хотя фактический объект является `Dog`.

Это отличается от обычного динамического полиморфизма через `override`.

### Extension functions и virtual dispatch

Для обычного метода:

```kotlin
open class Animal {
    open fun getType() = "Animal"
}

class Dog : Animal() {
    override fun getType() = "Dog"
}

fun printType(animal: Animal) {
    println(animal.getType())
}
```

Вызов `printType(Dog())` выведет:

```text
Dog
```

Потому что `override` использует динамическое связывание.

Расширения такого поведения не имеют.

### Когда это важно

Статическое разрешение означает, что extensions удобно использовать для синтаксического расширения API, форматирования и вспомогательных операций.

Но не следует рассчитывать на них как на замену полиморфизма и переопределения методов.

## Практика

1. Создай extension function `String.isValidEmail()`.
2. Создай `Int.isEven()`, проверяющую чётность числа.
3. Напиши расширение `String?.orDefault()`.
4. Объяви extension property `String.wordCount`.
5. Создай расширение для собственного класса `User`.
6. Попробуй обратиться к private-свойству класса из extension function.
7. Объяви расширение с такой же сигнатурой, как метод класса, и проверь, какой вариант вызывается.
8. Создай `Animal` и `Dog`, добавь расширения обоих типов и проверь статическое разрешение.
9. Объясни, почему extension property не может иметь собственного backing field.

## Самопроверка

- [ ] Знаю синтаксис extension functions.
- [ ] Понимаю понятия receiver и receiver type.
- [ ] Умею объявлять extension properties.
- [ ] Понимаю ограничения backing field у расширяющих свойств.
- [ ] Умею создавать расширения для nullable-типов.
- [ ] Понимаю, как импортировать extension functions.
- [ ] Знаю, что extensions не изменяют исходный класс.
- [ ] Понимаю, почему расширение не имеет доступа к private-членам.
- [ ] Знаю, почему member function имеет приоритет.
- [ ] Понимаю статическое разрешение extensions.
- [ ] Могу объяснить отличие расширения от переопределённого метода.

### Вопросы на собеседовании

:::qa
- **Что такое extension function?** — Функция, объявленная вне класса, но вызываемая как его метод, например `fun String.lastChar(): Char = this[length - 1]`.
- **Добавляет ли расширение реальный метод в класс?** — Нет, компилятор генерирует статический метод с получателем первым аргументом; байткод исходного класса не меняется.
- **Что такое receiver?** — Тип перед точкой в объявлении `fun String.foo()`; внутри функции он доступен как `this`.
- **Может ли extension function обращаться к private-свойству?** — Нет, расширение имеет права обычного внешнего кода и видит только публичные члены класса.
- **Можно ли объявлять extension properties?** — Да, но без backing field: значение вычисляется геттером при каждом обращении.
- **Почему у extension property нет backing field?** — Потому что расширение не добавляет поле в класс — оно компилируется только в вызов геттера.
- **Что происходит, если extension function имеет ту же сигнатуру, что и метод класса?** — Побеждает метод класса: расширение не переопределяет уже существующие члены.
- **Используют ли extension functions динамический полиморфизм?** — Нет, реализация выбирается статически по объявленному типу получателя.
- **Что такое статическое разрешение расширений?** — Выбор функции на этапе компиляции по типу выражения, а не по конкретному объекту в рантайме.
- **Чем extension function отличается от наследования?** — Расширение не меняет класс и не создаёт подтип, а наследование создаёт новый тип и переопределяет поведение.
:::

### Дополнительные официальные источники

- [Extensions](https://kotlinlang.org/docs/extensions.html)
- [Properties](https://kotlinlang.org/docs/properties.html)
- [Visibility modifiers](https://kotlinlang.org/docs/visibility-modifiers.html)

---

# 7. Lambda {#lambda}

Lambda — анонимная функция, которую можно создать непосредственно в выражении, сохранить в переменную или передать другой функции.

Лямбды являются одной из основ функционального программирования в Kotlin.

Они широко применяются:

- при обработке коллекций;
- в обработчиках событий;
- при настройке объектов;
- в корутинах;
- в Android UI;
- в API библиотек.

## 7.1. Синтаксис lambda expression {#sintaksis-lambda-expression}

Простейшая лямбда:

```kotlin
val greet = {
    println("Hello!")
}
```

У неё нет параметров, а тело состоит из одной операции.

Вызов:

```kotlin
greet()
```

Лямбда может принимать параметры:

```kotlin
val sum = { a: Int, b: Int ->
    a + b
}
```

Вызов:

```kotlin
println(sum(10, 20)) // 30
```

Синтаксис лямбды:

```kotlin
{ параметры -> тело }
```

Стрелка `->` отделяет параметры от тела.

### Тип лямбды

Тип можно указать явно:

```kotlin
val sum: (Int, Int) -> Int = { a, b ->
    a + b
}
```

Здесь:

- первый `Int` — тип первого параметра;
- второй `Int` — тип второго параметра;
- последний `Int` — возвращаемый тип.

Если тип можно вывести из контекста, компилятор автоматически определит типы параметров.

### Лямбда без параметров

```kotlin
val onClick: () -> Unit = {
    println("Clicked")
}
```

Обозначение `() -> Unit` означает:

- параметров нет;
- возвращаемое значение — `Unit`.

### Возвращаемое значение

Результатом лямбды является последнее выражение её тела.

```kotlin
val square: (Int) -> Int = { number ->
    number * number
}
```

Внутри лямбды не требуется писать `return` для возвращения последнего выражения.

### Несколько выражений

```kotlin
val calculate: (Int, Int) -> Int = { a, b ->
    val sum = a + b

    println("Сумма: $sum")

    sum * 2
}
```

Последнее выражение `sum * 2` будет результатом лямбды.

## 7.2. Типы функций (`Function0`, `Function1`, `Function2` и др.) {#tipy-funktsiy-function0-function1-function2-i-dr}

Kotlin поддерживает функциональные типы (*function types*).

Они описывают параметры и результат функции.

Основные формы:

```kotlin
() -> Unit
```

Функция без аргументов, возвращающая `Unit`.

```kotlin
(Int) -> String
```

Функция, принимающая `Int` и возвращающая `String`.

```kotlin
(Int, Int) -> Int
```

Функция, принимающая два `Int` и возвращающая `Int`.

```kotlin
(String, Int) -> Boolean
```

Функция, принимающая `String` и `Int`, возвращающая `Boolean`.

### Function0

```kotlin
val action: () -> Unit = {
    println("Action")
}
```

Функциональный тип без параметров.

### Function1

```kotlin
val formatter: (String) -> Int = { text ->
    text.length
}
```

Один параметр.

### Function2

```kotlin
val comparator: (Int, Int) -> Boolean = { first, second ->
    first > second
}
```

Два параметра.

### Общая форма

В Kotlin тип функции записывается так:

```kotlin
(A, B, C) -> R
```

Где:

- `A`, `B`, `C` — типы входных параметров;
- `R` — тип результата.

Функции разных арностей представлены соответствующими функциональными интерфейсами стандартной библиотеки, например `Function0`, `Function1`, `Function2`.

На уровне повседневного Kotlin-кода обычно используют короткую запись `(A) -> B`, а не работают непосредственно с этими интерфейсами.

### Nullable function types

Сам тип функции тоже может быть nullable:

```kotlin
val callback: (() -> Unit)? = null
```

Это отличается от функции, которая возвращает nullable-значение:

```kotlin
val callback: () -> String? = {
    null
}
```

В первом случае может отсутствовать сама функция.

Во втором функция существует, но её результат может быть `null`.

## 7.3. Неявный параметр `it` {#neyavnyy-parametr-it}

Если лямбда принимает ровно один параметр, его имя можно не объявлять явно.

Kotlin предоставляет неявное имя `it`.

```kotlin
val names = listOf("Alex", "Maria", "John")

val lengths = names.map {
    it.length
}
```

Это эквивалентно:

```kotlin
val lengths = names.map { name ->
    name.length
}
```

`it` часто используется в коротких выражениях.

```kotlin
val numbers = listOf(1, 2, 3, 4)

val evenNumbers = numbers.filter {
    it % 2 == 0
}
```

### Когда лучше указывать имя явно

Если логика становится сложной, лучше задать понятное имя:

```kotlin
val adultUsers = users.filter { user ->
    user.age >= 18
}
```

Это повышает читаемость.

### Ограничение `it`

`it` автоматически доступен только тогда, когда лямбда имеет ровно один параметр.

Для двух параметров необходимо указать их явно:

```kotlin
val sum = { first: Int, second: Int ->
    first + second
}
```

## 7.4. Trailing lambda {#trailing-lambda}

Trailing lambda — синтаксис, позволяющий вынести лямбду за круглые скобки вызова функции, если лямбда является последним параметром.

Например:

```kotlin
fun execute(action: () -> Unit) {
    action()
}
```

Обычный вызов:

```kotlin
execute({
    println("Hello")
})
```

С trailing lambda:

```kotlin
execute {
    println("Hello")
}
```

Это одна из распространённых особенностей Kotlin.

### Функция с несколькими параметрами

```kotlin
fun repeatAction(
    count: Int,
    action: (Int) -> Unit
) {
    repeat(count) { index ->
        action(index)
    }
}
```

Вызов:

```kotlin
repeatAction(3) { index ->
    println("Итерация $index")
}
```

Лямбда вынесена за скобки, потому что является последним параметром.

### Trailing lambda в Android

Такая запись часто используется в Android API:

```kotlin
button.setOnClickListener {
    println("Кнопка нажата")
}
```

Вызов выглядит компактно, потому что лямбда является последним аргументом метода.

## 7.5. Замыкания (closures) {#zamykaniya-closures}

Замыкание — лямбда или другая функция, которая использует переменные из внешней области видимости.

```kotlin
fun createCounter(): () -> Int {
    var counter = 0

    return {
        counter++
        counter
    }
}
```

Вызов:

```kotlin
val counter = createCounter()

println(counter()) // 1
println(counter()) // 2
println(counter()) // 3
```

Лямбда сохраняет доступ к `counter`, даже после завершения `createCounter()`.

Это и есть захват переменной из внешнего контекста.

### Захват неизменяемых значений

```kotlin
fun createGreeting(name: String): () -> String {
    return {
        "Привет, $name!"
    }
}
```

Лямбда сохраняет доступ к параметру `name`.

### Изменение захваченных переменных

```kotlin
var total = 0

val add = { number: Int ->
    total += number
}

add(10)
add(20)

println(total) // 30
```

Лямбда может изменять захваченные изменяемые переменные.

### Почему замыкания важны

Они позволяют:

- хранить состояние между вызовами;
- создавать функции с заранее настроенными параметрами;
- реализовывать callback;
- передавать поведение между компонентами;
- создавать обработчики событий.

При этом важно помнить, что замыкание может удерживать ссылки на внешние объекты.

В Android-приложениях это имеет значение для управления временем жизни объектов и предотвращения утечек памяти.

## 7.6. Лямбды с несколькими параметрами {#lyambdy-s-neskolkimi-parametrami}

Лямбда может принимать несколько параметров.

```kotlin
val calculate: (Int, Int) -> Int = { a, b ->
    a * b
}
```

Использование:

```kotlin
println(calculate(5, 10)) // 50
```

Параметры можно назвать как угодно:

```kotlin
val buildFullName: (String, String) -> String = {
    firstName, lastName ->

    "$firstName $lastName"
}
```

### Деструктуризация параметра

Если лямбда принимает один объект с компонентами, можно использовать деструктуризацию:

```kotlin
val map = mapOf(
    1 to "Alex",
    2 to "Maria"
)

map.forEach { (id, name) ->
    println("$id: $name")
}
```

Здесь лямбда получает одну пару `Map.Entry`, которая раскладывается на ключ и значение.

## 7.7. Анонимные функции {#anonimnye-funktsii}

Анонимная функция — функция без имени, объявленная с помощью `fun` непосредственно в выражении.

```kotlin
val sum = fun(a: Int, b: Int): Int {
    return a + b
}
```

Использование:

```kotlin
println(sum(10, 20))
```

### Анонимная функция и lambda

Обе конструкции позволяют создавать функциональные значения.

Лямбда:

```kotlin
val sum = { a: Int, b: Int ->
    a + b
}
```

Анонимная функция:

```kotlin
val sum = fun(a: Int, b: Int): Int {
    return a + b
}
```

### Отличия

| Lambda | Анонимная функция |
|---|---|
| Краткий синтаксис | Более похожа на обычную функцию |
| Тип результата часто выводится автоматически | Можно явно задавать возвращаемый тип |
| `return` может быть нелокальным при использовании inline-функции | `return` завершает саму анонимную функцию |
| Trailing lambda применим | Trailing lambda-синтаксис для анонимных функций не поддерживается |

### Анонимная функция с expression body

```kotlin
val square = fun(number: Int): Int = number * number
```

### Анонимная функция в качестве аргумента

```kotlin
val numbers = listOf(1, 2, 3, 4)

val even = numbers.filter(
    fun(number): Boolean {
        return number % 2 == 0
    }
)
```

На практике обычные лямбды используются значительно чаще, но понимание анонимных функций помогает разобраться в поведении `return`.

## 7.8. Локальный и нелокальный `return` {#lokalnyy-i-nelokalnyy-return}

В Kotlin поведение `return` зависит от того, где находится лямбда и какой функции она передана.

### Локальный return с меткой

```kotlin
val numbers = listOf(1, 2, 3, 4)

numbers.forEach {
    if (it == 3) {
        return@forEach
    }

    println(it)
}
```

`return@forEach` завершает только текущую итерацию лямбды и переходит к следующему элементу.

Это аналогично `continue` для данного вызова `forEach`.

### Return из лямбды через метку

Можно создать собственную метку:

```kotlin
numbers.forEach action@{ number ->
    if (number == 3) {
        return@action
    }

    println(number)
}
```

### Нелокальный return

Внутри лямбды, переданной inline-функции, обычный `return` может завершить внешнюю именованную функцию.

```kotlin
fun processNumbers() {
    val numbers = listOf(1, 2, 3, 4)

    numbers.forEach { number ->
        if (number == 3) {
            return
        }

        println(number)
    }

    println("Завершено")
}
```

При обработке числа `3` выполнится `return`, который завершит всю функцию `processNumbers()`.

Строка `"Завершено"` не будет выведена.

Это называется нелокальным возвратом (*non-local return*).

Он возможен, поскольку `forEach` является inline-функцией.

### Return в обычной лямбде

В обычной лямбде, переданной не-inline функции, нелокальный `return` недопустим.

```kotlin
fun execute(action: () -> Unit) {
    action()
}

fun process() {
    execute {
        // Обычный return здесь недопустим,
        // поскольку execute не является inline.
        println("Action")
    }
}
```

Для завершения только лямбды можно использовать метку:

```kotlin
fun process() {
    execute {
        println("Before")

        return@execute

        // Этот код не выполнится.
    }

    println("After")
}
```

### Return в анонимной функции

В анонимной функции `return` завершает саму анонимную функцию:

```kotlin
fun process() {
    val action = fun() {
        println("Before return")
        return
    }

    action()

    println("After action")
}
```

Результат:

```text
Before return
After action
```

Здесь `return` не завершает внешнюю функцию `process()`.

### Краткое сравнение

| Конструкция | Поведение |
|---|---|
| `return` в именованной функции | Завершает эту функцию |
| `return@forEach` | Завершает текущую лямбду |
| `return@customLabel` | Завершает лямбду с указанной меткой |
| `return` в лямбде inline-функции | Может завершить внешнюю функцию |
| `return` в анонимной функции | Завершает анонимную функцию |

При чтении Kotlin-кода особенно важно различать `return` и `return@label`.

Они могут кардинально менять поток выполнения программы.

## Практика

1. Создай лямбду, которая выводит сообщение.
2. Создай лямбду, принимающую два `Int` и возвращающую сумму.
3. Явно укажи типы нескольких функциональных значений.
4. Используй `it` для обработки списка строк.
5. Перепиши лямбду с `it` на явное имя параметра.
6. Вызови функцию с помощью trailing lambda.
7. Создай функцию, возвращающую другую функцию.
8. Напиши замыкание, которое хранит и увеличивает счётчик.
9. Создай лямбду с двумя параметрами и деструктуризируй пару.
10. Перепиши лямбду в виде анонимной функции.
11. Используй `return@forEach` для пропуска элемента.
12. Покажи пример нелокального `return` внутри `forEach`.
13. Объясни, почему обычный `return` нельзя использовать в любой произвольной лямбде.

## Самопроверка

- [ ] Понимаю синтаксис lambda expression.
- [ ] Умею объявлять функциональные типы.
- [ ] Знаю назначение Function0, Function1 и Function2.
- [ ] Понимаю, когда доступен неявный параметр `it`.
- [ ] Умею использовать trailing lambda.
- [ ] Понимаю, что такое closure.
- [ ] Знаю, что лямбда может захватывать и изменять внешние переменные.
- [ ] Умею создавать лямбды с несколькими параметрами.
- [ ] Понимаю разницу между лямбдами и анонимными функциями.
- [ ] Понимаю локальный и нелокальный `return`.
- [ ] Знаю, почему `return` ведёт себя особым образом в inline-функциях.

### Вопросы на собеседовании

:::qa
- **Что такое lambda expression?** — Анонимная функция в фигурных скобках, которую можно передать как значение, например `{ x: Int -> x + 1 }`.
- **Как записывается функциональный тип?** — Как `(Int, String) -> Boolean`: в скобках параметры, после стрелки — тип результата; при отсутствии результата используется `Unit`.
- **Что означает `(Int, Int) -> String`?** — Функцию с двумя параметрами типа `Int`, которая возвращает `String`.
- **Что такое `it`?** — Неявное имя единственного параметра лямбды, доступное, когда параметр не объявлен явно.
- **Что такое trailing lambda?** — Лямбда, вынесенная за круглые скобки вызова, когда она последний аргумент: `list.map { it * 2 }`.
- **Что такое closure?** — Лямбда, захватывающая переменные из окружающей области и сохраняющая доступ к ним после выхода из неё.
- **Может ли лямбда изменять переменные внешней функции?** — Да, в отличие от Java, Kotlin-лямбды могут изменять захваченные `var`-переменные.
- **Чем анонимная функция отличается от lambda?** — В анонимной функции можно явно указать тип возврата и имена параметров, а `return` внутри неё всегда локальный.
- **Что делает `return@forEach`?** — Возвращает управление из лямбды, а не из внешней функции, поэтому код после `forEach` продолжает выполняться.
- **Что такое non-local return?** — `return` из лямбды, который завершает внешнюю функцию; разрешён только в inline-функциях.
- **Почему обычный `return` работает внутри `forEach`, но не работает в любой другой функции с лямбдой?** — Потому что `forEach` — inline-функция: её лямбда встраивается в вызывающий код, и `return` становится возвратом из внешней функции.
:::

### Дополнительные официальные источники

- [Higher-order functions and lambdas](https://kotlinlang.org/docs/lambdas.html)
- [Inline functions](https://kotlinlang.org/docs/inline-functions.html)
- [Returns and jumps](https://kotlinlang.org/docs/returns.html)
- [Coding conventions](https://kotlinlang.org/docs/coding-conventions.html)

---

# 8. Higher Order Functions {#higher-order-functions}

Higher Order Function (HOF), или функция высшего порядка, — функция, которая принимает другую функцию в качестве параметра либо возвращает функцию в качестве результата.

Этот механизм позволяет передавать поведение как данные.

Он лежит в основе многих возможностей Kotlin:

- `map`, `filter`, `forEach`;
- callback;
- обработчики событий;
- конфигурационные DSL;
- функциональная композиция;
- асинхронные API.

## 8.1. Функция как параметр {#funktsiya-kak-parametr}

Рассмотрим обычную функцию:

```kotlin
fun calculate(a: Int, b: Int): Int {
    return a + b
}
```

Она выполняет конкретную операцию.

Теперь представим, что мы хотим передавать способ вычисления извне.

Для этого можно принять функциональный параметр:

```kotlin
fun calculate(
    a: Int,
    b: Int,
    operation: (Int, Int) -> Int
): Int {
    return operation(a, b)
}
```

Здесь `operation` — функция, принимающая два `Int` и возвращающая `Int`.

Использование:

```kotlin
val sum = calculate(10, 20) { a, b ->
    a + b
}

val multiplication = calculate(10, 20) { a, b ->
    a * b
}
```

Одна и та же функция `calculate` поддерживает разные операции.

### Передача разных вариантов поведения

```kotlin
fun execute(
    action: () -> Unit
) {
    println("Before")
    action()
    println("After")
}
```

Использование:

```kotlin
execute {
    println("Action")
}
```

Теперь `execute` сама управляет моментом вызова переданного поведения.

Это основной принцип callback.

### Практический пример

```kotlin
data class User(
    val name: String,
    val age: Int
)

fun processUsers(
    users: List<User>,
    predicate: (User) -> Boolean
): List<User> {
    return users.filter(predicate)
}
```

Использование:

```kotlin
val users = listOf(
    User("Alex", 25),
    User("Maria", 17),
    User("John", 30)
)

val adults = processUsers(users) {
    it.age >= 18
}
```

Функция не знает заранее, какие именно пользователи нужны.

Она получает правило фильтрации снаружи.

## 8.2. Функция как возвращаемое значение {#funktsiya-kak-vozvraschaemoe-znachenie}

Функции могут не только принимать другие функции, но и возвращать их.

```kotlin
fun getOperation(
    type: String
): (Int, Int) -> Int {

    return when (type) {
        "sum" -> { a, b -> a + b }
        "multiply" -> { a, b -> a * b }
        "subtract" -> { a, b -> a - b }
        else -> { _, _ -> 0 }
    }
}
```

Использование:

```kotlin
val operation = getOperation("sum")

println(operation(10, 20)) // 30
```

Возвращаемый тип:

```kotlin
(Int, Int) -> Int
```

Это функциональный тип, а не обычное значение `Int`.

### Функция-конфигуратор

```kotlin
fun createMultiplier(factor: Int): (Int) -> Int {
    return { number ->
        number * factor
    }
}
```

Использование:

```kotlin
val double = createMultiplier(2)
val triple = createMultiplier(3)

println(double(10)) // 20
println(triple(10)) // 30
```

Каждая возвращённая функция запоминает своё значение `factor`.

Это пример совместного использования HOF и closures.

## 8.3. Function types {#function-types}

Функциональный тип описывает сигнатуру функции.

```kotlin
() -> Unit
```

Нет параметров, результат — `Unit`.

```kotlin
(String) -> Int
```

Принимает строку и возвращает число.

```kotlin
(Int, Int) -> Boolean
```

Принимает два числа и возвращает логическое значение.

```kotlin
(User) -> String
```

Принимает пользователя и возвращает строку.

### Использование в классе

Функциональные типы можно использовать в свойствах:

```kotlin
class Button {

    var onClick: (() -> Unit)? = null

    fun click() {
        onClick?.invoke()
    }
}
```

Использование:

```kotlin
val button = Button()

button.onClick = {
    println("Clicked")
}

button.click()
```

### Типы функций в параметрах и возвращаемых значениях

```kotlin
fun execute(
    action: () -> String
): String {
    return action()
}
```

Здесь функция принимает другую функцию и возвращает результат её выполнения.

### Вызов функционального значения

Функцию можно вызвать двумя способами:

```kotlin
val greet: () -> Unit = {
    println("Hello")
}

greet()
greet.invoke()
```

Обычно используется короткая запись с круглыми скобками.

## 8.4. Передача именованных функций по ссылке (`::`) {#peredacha-imenovannyh-funktsiy-po-ssylke}

Если функция уже объявлена, её можно передать в качестве значения через оператор `::`.

Это называется callable reference.

```kotlin
fun isEven(number: Int): Boolean {
    return number % 2 == 0
}
```

Вместо создания лямбды:

```kotlin
val numbers = listOf(1, 2, 3, 4)

val evenNumbers = numbers.filter {
    isEven(it)
}
```

Можно передать ссылку на функцию:

```kotlin
val evenNumbers = numbers.filter(::isEven)
```

### Ссылка на функцию с параметрами

```kotlin
fun sum(a: Int, b: Int): Int {
    return a + b
}

val operation: (Int, Int) -> Int = ::sum
```

Использование:

```kotlin
println(operation(10, 20))
```

### Ссылка на метод объекта

```kotlin
class User(
    val name: String
) {
    fun printName() {
        println(name)
    }
}

val user = User("Alex")

val action: () -> Unit = user::printName

action()
```

`user::printName` — привязанная ссылка на метод конкретного объекта.

### Ссылка на конструктор

```kotlin
data class User(
    val name: String
)

val createUser: (String) -> User = ::User

val user = createUser("Alex")
```

Ссылка `::User` представляет конструктор класса как функциональное значение.

### Когда использовать callable references

Они удобны, когда существующая функция уже полностью соответствует требуемому функциональному типу.

Если требуется дополнительная логика или преобразование параметров, лучше использовать лямбду.

## 8.5. Функции-обработчики коллекций {#funktsii-obrabotchiki-kollektsiy}

Стандартная библиотека Kotlin активно использует функции высшего порядка.

### `forEach`

Выполняет действие для каждого элемента:

```kotlin
val names = listOf("Alex", "Maria", "John")

names.forEach { name ->
    println(name)
}
```

### `filter`

Оставляет элементы, удовлетворяющие условию:

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

val even = numbers.filter {
    it % 2 == 0
}
```

### `map`

Преобразует каждый элемент:

```kotlin
val names = listOf("Alex", "Maria")

val lengths = names.map {
    it.length
}
```

### `find`

Находит первый подходящий элемент:

```kotlin
val numbers = listOf(1, 2, 3, 4)

val result = numbers.find {
    it > 2
}
```

### `any`

Проверяет, есть ли хотя бы один подходящий элемент:

```kotlin
val hasEven = numbers.any {
    it % 2 == 0
}
```

### `all`

Проверяет, удовлетворяют ли условию все элементы:

```kotlin
val allPositive = numbers.all {
    it > 0
}
```

### `count`

Подсчитывает количество элементов, удовлетворяющих условию:

```kotlin
val evenCount = numbers.count {
    it % 2 == 0
}
```

### Цепочки операций

Функции высшего порядка можно комбинировать:

```kotlin
data class User(
    val name: String,
    val age: Int
)

val users = listOf(
    User("Alex", 25),
    User("Maria", 17),
    User("John", 30)
)

val adultNames = users
    .filter { it.age >= 18 }
    .map { it.name }
    .sorted()
```

Каждая операция получает результат предыдущей.

Это позволяет описывать преобразование данных декларативно.

### Функциональный стиль и обычные циклы

Через циклы:

```kotlin
val adultNames = mutableListOf<String>()

for (user in users) {
    if (user.age >= 18) {
        adultNames.add(user.name)
    }
}
```

Через функции высшего порядка:

```kotlin
val adultNames = users
    .filter { it.age >= 18 }
    .map { it.name }
```

Второй вариант компактнее и описывает, что нужно получить, а не последовательность ручных операций.

Но функциональный стиль не всегда автоматически быстрее или эффективнее по памяти. Некоторые цепочки создают промежуточные коллекции.

## 8.6. Lambda with receiver (базовое понимание) {#lambda-with-receiver-bazovoe-ponimanie}

Обычный функциональный тип:

```kotlin
(String) -> Unit
```

Функция принимает `String` как обычный параметр.

Функциональный тип с receiver:

```kotlin
String.() -> Unit
```

Он также работает со строкой, но внутри блока строка доступна как `this`.

Пример:

```kotlin
val action: String.() -> Unit = {
    println(uppercase())
}
```

Вызов:

```kotlin
action("Kotlin")
```

Внутри лямбды можно обращаться к членам `String` без явного параметра.

### Обычная функция и функция с receiver

Обычный вариант:

```kotlin
val formatter: (String) -> String = { text ->
    text.uppercase()
}
```

Вариант с receiver:

```kotlin
val formatter: String.() -> String = {
    uppercase()
}
```

Оба варианта принимают строку и возвращают результат.

Разница — способ доступа к объекту внутри блока.

### Вызов с receiver

```kotlin
val formatter: String.() -> String = {
    uppercase()
}

val result = formatter("kotlin")

println(result) // KOTLIN
```

Также можно использовать расширенный синтаксис вызова:

```kotlin
val result = "kotlin".formatter()
```

### Пример настройки объекта

```kotlin
class User {
    var name: String = ""
    var age: Int = 0
}

fun createUser(
    configuration: User.() -> Unit
): User {
    return User().apply(configuration)
}
```

Использование:

```kotlin
val user = createUser {
    name = "Alex"
    age = 25
}
```

Внутри блока `this` является объектом `User`.

Именно этот механизм часто лежит в основе DSL и конфигурационных API Kotlin.

## Практика

1. Напиши функцию, которая принимает другую функцию в качестве параметра.
2. Создай функцию, возвращающую `(Int) -> Int`.
3. Объяви несколько функциональных типов.
4. Сохрани лямбду в свойство класса и вызови её.
5. Передай именованную функцию через `::`.
6. Передай метод конкретного объекта через `object::method`.
7. Используй `::ClassName` для передачи конструктора.
8. Используй `filter`, `map`, `forEach` и `find`.
9. Объедини несколько операций обработки коллекции в цепочку.
10. Создай функцию, принимающую lambda with receiver.
11. Объясни разницу между `(String) -> Unit` и `String.() -> Unit`.

## Самопроверка

- [ ] Понимаю, что такое функция высшего порядка.
- [ ] Знаю, как передать функцию параметром.
- [ ] Умею вернуть функцию из другой функции.
- [ ] Умею объявлять функциональные типы.
- [ ] Понимаю, как работает callable reference `::`.
- [ ] Знаю, как передавать ссылки на методы и конструкторы.
- [ ] Понимаю, почему функции обработки коллекций являются HOF.
- [ ] Умею комбинировать `filter`, `map`, `forEach` и другие операции.
- [ ] Понимаю, что такое receiver function type.
- [ ] Могу объяснить отличие обычной лямбды от лямбды с receiver.

### Вопросы на собеседовании

:::qa
- **Что такое Higher Order Function?** — Функция, которая принимает другую функцию в параметрах или возвращает её.
- **Может ли функция возвращать другую функцию?** — Да, типом результата может быть функциональный тип: `fun make(): (Int) -> Int = { it + 1 }`.
- **Что обозначает тип `(Int) -> String`?** — Функцию одного `Int`-аргумента, возвращающую `String`.
- **Чем `() -> Unit` отличается от `Unit`?** — Первое — тип функции без аргументов и без результата, второе — тип самого результата, то есть отсутствие значения.
- **Что такое callable reference?** — Ссылка на существующую функцию, конструктор или свойство через `::`, например `::length`.
- **Что делает оператор `::`?** — Преобразует функцию, конструктор или свойство в значение функционального типа.
- **Как передать метод объекта в другую функцию?** — Через ссылку `obj::method` или лямбду `{ obj.method(it) }`.
- **Что такое lambda with receiver?** — Лямбда, внутри которой получатель доступен как `this`, например `StringBuilder.() -> Unit`.
- **Чем `String.() -> Unit` отличается от `(String) -> Unit`?** — В первом случае `String` — получатель (`this`), во втором — обычный параметр (`it`).
- **Почему `map` и `filter` относятся к функциям высшего порядка?** — Потому что принимают лямбду, задающую преобразование или условие отбора, и применяют её к элементам.
:::

### Дополнительные официальные источники

- [Higher-order functions and lambdas](https://kotlinlang.org/docs/lambdas.html)
- [Function references](https://kotlinlang.org/docs/reflection.html#function-references)
- [Collections overview](https://kotlinlang.org/docs/collections-overview.html)
- [Collection operations](https://kotlinlang.org/docs/collection-operations.html)

---

# 9. Scope Functions {#scope-functions}

Scope Functions — функции стандартной библиотеки Kotlin, которые позволяют выполнять блок кода в контексте определённого объекта.

Они создают временную область, внутри которой можно удобно обращаться к объекту и выполнять над ним операции.

В Kotlin существуют пять основных scope functions:

- `let`;
- `run`;
- `with`;
- `apply`;
- `also`.

Все они выполняют блок кода, но отличаются:

1. Способом доступа к объекту: через `this` или `it`.
2. Возвращаемым значением: результат блока или исходный объект.

## 9.1. `let` {#let}

`let` выполняет блок кода, передавая объект в качестве аргумента `it`.

Результатом является последнее выражение блока.

```kotlin
val name = "Kotlin"

val length = name.let {
    it.length
}

println(length) // 6
```

Здесь:

- контекстный объект доступен через `it`;
- результатом является `Int`, возвращённый из блока.

### Использование с nullable-значениями

```kotlin
val name: String? = "Alex"

name?.let {
    println(it.uppercase())
}
```

Если значение равно `null`, блок не будет выполнен.

### Преобразование объекта

```kotlin
data class User(
    val name: String,
    val age: Int
)

val user = User("Alex", 25)

val description = user.let {
    "${it.name}, ${it.age} лет"
}
```

### Когда использовать `let`

- Для обработки nullable-значений через `?.let`.
- Для преобразования объекта в другое значение.
- Когда объект удобнее передавать как аргумент `it`.
- Для создания временного контекста.

## 9.2. `run` {#run}

`run` выполняет блок кода, в котором контекстный объект доступен через `this`.

Возвращает результат последнего выражения блока.

```kotlin
val user = User("Alex", 25)

val description = user.run {
    "Имя: $name, возраст: $age"
}
```

Здесь `name` и `age` доступны напрямую через `this`.

Явная запись:

```kotlin
val description = user.run {
    "Имя: ${this.name}, возраст: ${this.age}"
}
```

### Использование для вычисления результата

```kotlin
val result = user.run {
    val adult = age >= 18

    if (adult) {
        "$name — совершеннолетний"
    } else {
        "$name — несовершеннолетний"
    }
}
```

### Non-extension `run`

Существует и вариант `run`, который вызывается без объекта:

```kotlin
val result = run {
    val first = 10
    val second = 20

    first + second
}
```

Он просто выполняет блок и возвращает результат.

### Когда использовать `run`

- Когда нужно выполнить несколько операций над объектом.
- Когда требуется вернуть вычисленный результат.
- Для локальной группировки вычислений.
- Для настройки объекта с одновременным вычислением результата.

## 9.3. `with` {#with}

`with` похож на `run`, но является обычной функцией, а не extension function.

Объект передаётся аргументом:

```kotlin
with(user) {
    println(name)
    println(age)
}
```

Внутри блока он доступен через `this`.

Возвращаемое значение — результат последнего выражения.

```kotlin
val description = with(user) {
    "$name, $age"
}
```

### Группировка операций

```kotlin
val result = with(StringBuilder()) {
    append("Hello")
    append(", ")
    append("Kotlin")

    toString()
}
```

### Когда использовать `with`

Когда нужно выполнить несколько операций с одним объектом, а сам объект не требуется возвращать из блока.

Например, при формировании строки или группировке обращений к свойствам и функциям объекта.

## 9.4. `apply` {#apply}

`apply` выполняет блок кода с контекстным объектом через `this`, но возвращает сам объект.

```kotlin
val user = User("Alex", 25).apply {
    println(name)
    println(age)
}
```

После выполнения блока переменная `user` содержит исходный объект.

### Настройка объекта

Это наиболее распространённый сценарий использования `apply`.

```kotlin
class User {
    var name: String = ""
    var age: Int = 0
}

val user = User().apply {
    name = "Alex"
    age = 25
}
```

`apply` позволяет компактно настроить объект сразу после создания.

### Цепочка вызовов

```kotlin
val users = mutableListOf<String>()
    .apply {
        add("Alex")
        add("Maria")
        add("John")
    }
```

После блока возвращается та же коллекция.

### Когда использовать `apply`

- При создании и настройке объектов.
- При инициализации коллекций.
- Когда нужно изменить объект и вернуть его же.
- Для последовательной конфигурации свойств.

## 9.5. `also` {#also}

`also` передаёт контекстный объект через `it`, а возвращает исходный объект.

```kotlin
val user = User("Alex", 25)

val result = user.also {
    println("Создан пользователь: ${it.name}")
}
```

`result` ссылается на тот же объект, что и `user`.

### Для побочных действий

```kotlin
val numbers = mutableListOf(1, 2, 3)

numbers
    .also {
        println("До обработки: $it")
    }
    .add(4)
```

`also` не предназначен для замены объекта, а используется для дополнительного действия над ним.

Например:

- логирования;
- отладки;
- записи диагностической информации;
- выполнения дополнительной проверки.

### Когда использовать `also`

Когда нужно выполнить дополнительное действие, не меняя результат выражения.

## 9.6. Контекстный объект: `this` vs `it` {#kontekstnyy-obekt-this-vs-it}

Основное отличие scope functions — способ доступа к объекту.

### `this`

Используется в:

- `run`;
- `with`;
- `apply`.

Пример:

```kotlin
user.apply {
    name = "Maria"
}
```

Можно обратиться напрямую к свойствам объекта.

### `it`

Используется в:

- `let`;
- `also`.

Пример:

```kotlin
user.let {
    println(it.name)
}
```

Объект передаётся в виде аргумента.

При необходимости `it` можно заменить на понятное имя:

```kotlin
user.let { currentUser ->
    println(currentUser.name)
}
```

### Когда удобнее `this`

`this` хорошо подходит, когда блок в основном работает с объектом:

```kotlin
User().apply {
    name = "Alex"
    age = 25
}
```

### Когда удобнее `it`

`it` полезен, когда объект используется как обычный аргумент функции:

```kotlin
user.also {
    logger.log(it.name)
}
```

А также когда нужно избежать неоднозначности нескольких вложенных контекстных объектов.

## 9.7. Возвращаемое значение каждой функции {#vozvraschaemoe-znachenie-kazhdoy-funktsii}

Это одно из главных различий, которое нужно знать.

| Функция | Контекстный объект | Возвращаемое значение | Extension function |
|---|---|---|---|
| `let` | `it` | Результат блока | Да |
| `run` | `this` | Результат блока | Да |
| `run` без объекта | Нет | Результат блока | Нет |
| `with` | `this` | Результат блока | Нет |
| `apply` | `this` | Исходный объект | Да |
| `also` | `it` | Исходный объект | Да |

Разберём разницу на одном объекте:

```kotlin
data class User(
    var name: String,
    var age: Int
)

val user = User("Alex", 25)
```

`let`:

```kotlin
val result = user.let {
    it.name.uppercase()
}
```

Результат — `String`.

`run`:

```kotlin
val result = user.run {
    name.uppercase()
}
```

Результат — `String`.

`with`:

```kotlin
val result = with(user) {
    name.uppercase()
}
```

Результат — `String`.

`apply`:

```kotlin
val result = user.apply {
    age++
}
```

Результат — сам `User`.

`also`:

```kotlin
val result = user.also {
    println(it.name)
}
```

Результат — сам `User`.

## 9.8. Выбор функции под конкретную задачу {#vybor-funktsii-pod-konkretnuyu-zadachu}

Все пять функций выполняют похожую операцию, но каждая имеет наиболее подходящие сценарии.

| Задача | Рекомендуемая функция |
|---|---|
| Обработать nullable-значение | `let` |
| Преобразовать объект в результат | `let` |
| Вычислить результат в контексте объекта | `run` |
| Сгруппировать операции над объектом | `with` |
| Настроить объект при создании | `apply` |
| Выполнить дополнительное действие над объектом | `also` |

### Пример: создание объекта

```kotlin
val user = User("Alex", 0).apply {
    age = 25
}
```

### Пример: обработка nullable-значения

```kotlin
val name: String? = "Alex"

val upperName = name?.let {
    it.uppercase()
}
```

### Пример: вычисление результата

```kotlin
val description = user.run {
    "$name, $age"
}
```

### Пример: логирование

```kotlin
val user = User("Alex", 25)
    .also {
        println("Создан пользователь: ${it.name}")
    }
```

### Не злоупотребляй scope functions

Чрезмерное использование этих функций может сделать код сложнее.

Особенно осторожно нужно относиться к вложенным вызовам:

```kotlin
user?.let {
    it.run {
        it.also {
            // Здесь уже сложно понять,
            // какой объект находится в it,
            // а какой доступен через this.
        }
    }
}
```

Не нужно оборачивать каждую операцию в `let`, `run` или `apply`.

Обычная переменная и последовательность вызовов часто читаются лучше.

## Практика

1. Используй `let` для преобразования строки в число.
2. Обработай nullable-строку через `?.let`.
3. Используй `run` для получения описания объекта.
4. Используй `with` для формирования строки из нескольких свойств.
5. Создай объект и настрой его через `apply`.
6. Используй `also` для логирования результата.
7. Для одного и того же объекта попробуй все пять scope functions.
8. Сравни возвращаемые значения `let`, `run`, `with`, `apply` и `also`.
9. Перепиши цепочку вложенных scope functions в более читаемый вариант.
10. Объясни, почему `apply` и `also` возвращают исходный объект.

## Самопроверка

- [ ] Знаю все пять scope functions.
- [ ] Понимаю, чем `let` отличается от `run`.
- [ ] Понимаю, чем `apply` отличается от `also`.
- [ ] Знаю, что `with` не является extension function.
- [ ] Понимаю, где используется `this`, а где `it`.
- [ ] Знаю возвращаемое значение каждой функции.
- [ ] Умею использовать `let` для nullable-значений.
- [ ] Умею использовать `apply` для настройки объектов.
- [ ] Умею использовать `also` для дополнительных действий.
- [ ] Могу выбрать подходящую scope function под конкретную задачу.
- [ ] Понимаю, почему чрезмерная вложенность scope functions ухудшает читаемость.

### Вопросы на собеседовании

:::qa
- **Что такое scope functions?** — Стандартные функции `let`, `run`, `with`, `apply` и `also`, выполняющие лямбду в контексте объекта.
- **Какие пять scope functions предоставляет Kotlin?** — `let`, `run`, `with`, `apply` и `also`.
- **Чем отличаются `let` и `also`?** — Обе получают объект как `it`, но `let` возвращает результат лямбды, а `also` — сам объект.
- **Чем отличаются `run` и `apply`?** — Обе используют `this`, но `run` возвращает результат лямбды, а `apply` — объект.
- **В чём разница между `run` и `with`?** — По смыслу они одинаковы: `with(obj) { ... }` эквивалентно `obj.run { ... }`; разница только в форме вызова.
- **Какие функции используют `this`, а какие — `it`?** — `run`, `with` и `apply` используют `this`, `let` и `also` — `it`.
- **Какие функции возвращают исходный объект?** — `apply` и `also`.
- **Какие функции возвращают результат лямбды?** — `let`, `run` и `with`.
- **Для чего обычно используется `apply`?** — Для конфигурации объекта при создании, например `TextView(context).apply { text = "Hi" }`: после лямбды возвращается сам объект.
- **Почему не следует чрезмерно использовать scope functions?** — Длинные цепочки `let`/`apply` маскируют поток управления; иногда явная локальная переменная читается понятнее.
:::

### Дополнительные официальные источники

- [Scope functions](https://kotlinlang.org/docs/scope-functions.html)
- [Higher-order functions and lambdas](https://kotlinlang.org/docs/lambdas.html)
- [Null safety](https://kotlinlang.org/docs/null-safety.html)

---

# 10. Enum {#enum}

`enum class` — специальный тип Kotlin, предназначенный для представления фиксированного набора возможных значений.

Перечисления полезны, когда переменная может находиться только в одном из заранее известных состояний или режимов.

Примеры:

- статус заказа;
- уровень сложности;
- направление движения;
- тип пользователя;
- состояние загрузки;
- режим отображения.

## 10.1. Синтаксис `enum class` {#sintaksis-enum-class}

Создание перечисления:

```kotlin
enum class Direction {
    NORTH,
    SOUTH,
    EAST,
    WEST
}
```

Теперь переменная типа `Direction` может содержать только одно из четырёх значений.

```kotlin
val direction = Direction.NORTH
```

Использование в `when`:

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

Если обработаны все значения enum, `when` является исчерпывающим, и `else` не требуется.

### Enum-константы

Каждая константа перечисления представляет отдельный singleton-экземпляр соответствующего enum-типа.

Например:

```kotlin
Direction.NORTH
Direction.SOUTH
```

Это фиксированные экземпляры, а не объекты, которые создаются произвольное количество раз.

## 10.2. Свойства и конструкторы enum {#svoystva-i-konstruktory-enum}

Enum может содержать конструктор и свойства.

```kotlin
enum class Difficulty(
    val title: String,
    val points: Int
) {
    EASY("Лёгкий", 10),
    MEDIUM("Средний", 20),
    HARD("Сложный", 30)
}
```

Использование:

```kotlin
val difficulty = Difficulty.MEDIUM

println(difficulty.title) // Средний
println(difficulty.points) // 20
```

### Конструктор enum

Параметры перечисления передаются при объявлении каждой константы:

```kotlin
enum class HttpStatus(
    val code: Int,
    val description: String
) {
    OK(200, "Success"),
    NOT_FOUND(404, "Not Found"),
    INTERNAL_ERROR(500, "Internal Server Error")
}
```

Создать дополнительный экземпляр `HttpStatus` через конструктор нельзя.

Можно получить только объявленные значения.

### Дополнительные свойства

Enum может иметь свойства в теле класса:

```kotlin
enum class Color(
    val hex: String
) {
    RED("#FF0000"),
    GREEN("#00FF00"),
    BLUE("#0000FF");

    val isPrimary: Boolean
        get() = true
}
```

Обрати внимание на точку с запятой после последней константы.

Она необходима, если после списка enum-констант объявляется тело класса с другими членами.

## 10.3. Методы enum {#metody-enum}

Enum может содержать обычные функции.

```kotlin
enum class Operation {
    ADD,
    SUBTRACT,
    MULTIPLY;

    fun execute(a: Int, b: Int): Int {
        return when (this) {
            ADD -> a + b
            SUBTRACT -> a - b
            MULTIPLY -> a * b
        }
    }
}
```

Использование:

```kotlin
val result = Operation.ADD.execute(10, 5)

println(result) // 15
```

### Разное поведение констант

Каждая enum-константа может иметь собственную реализацию абстрактного метода:

```kotlin
enum class Operation {

    ADD {
        override fun execute(a: Int, b: Int) = a + b
    },

    SUBTRACT {
        override fun execute(a: Int, b: Int) = a - b
    },

    MULTIPLY {
        override fun execute(a: Int, b: Int) = a * b
    };

    abstract fun execute(a: Int, b: Int): Int
}
```

Использование:

```kotlin
println(Operation.ADD.execute(10, 5))
println(Operation.MULTIPLY.execute(10, 5))
```

Этот подход позволяет связать поведение непосредственно с каждой константой.

## 10.4. Реализация интерфейсов {#realizatsiya-interfeysov}

Enum может реализовывать интерфейсы.

```kotlin
interface Describable {
    fun getDescription(): String
}

enum class Status : Describable {

    ACTIVE,
    BLOCKED,
    DELETED;

    override fun getDescription(): String {
        return when (this) {
            ACTIVE -> "Активен"
            BLOCKED -> "Заблокирован"
            DELETED -> "Удалён"
        }
    }
}
```

Использование:

```kotlin
val status: Describable = Status.ACTIVE

println(status.getDescription())
```

Enum может реализовывать несколько интерфейсов, но не может наследоваться от произвольного класса.

## 10.5. `name` и `ordinal` {#name-i-ordinal}

Каждая enum-константа имеет встроенные свойства:

- `name`;
- `ordinal`.

### `name`

Возвращает точное имя константы, указанное в объявлении.

```kotlin
enum class Status {
    NEW,
    IN_PROGRESS,
    COMPLETED
}

val status = Status.IN_PROGRESS

println(status.name) // IN_PROGRESS
```

### `ordinal`

Возвращает позицию константы в перечислении.

Индексация начинается с нуля.

```kotlin
println(Status.NEW.ordinal) // 0
println(Status.IN_PROGRESS.ordinal) // 1
println(Status.COMPLETED.ordinal) // 2
```

### Почему ordinal опасен для сохранения данных

Предположим, есть enum:

```kotlin
enum class Status {
    NEW,
    IN_PROGRESS,
    COMPLETED
}
```

Если сохранить `ordinal` в базу данных, то после изменения порядка констант значения начнут означать другое.

Например:

```kotlin
enum class Status {
    NEW,
    COMPLETED,
    IN_PROGRESS
}
```

Теперь `ordinal == 1` соответствует другому статусу.

Поэтому не следует использовать `ordinal` в качестве стабильного внешнего идентификатора.

Для хранения данных предпочтительнее использовать явное поле:

```kotlin
enum class Status(
    val code: String
) {
    NEW("new"),
    IN_PROGRESS("in_progress"),
    COMPLETED("completed")
}
```

Теперь порядок констант можно менять, не меняя внешний код статуса.

## 10.6. Перебор значений (`entries`) {#perebor-znacheniy-entries}

Kotlin предоставляет свойство `entries`, которое возвращает все значения enum в виде списка.

```kotlin
enum class Difficulty {
    EASY,
    MEDIUM,
    HARD
}
```

Получение всех значений:

```kotlin
val difficulties = Difficulty.entries
```

Перебор:

```kotlin
for (difficulty in Difficulty.entries) {
    println(difficulty)
}
```

Можно использовать `map`:

```kotlin
val names = Difficulty.entries.map {
    it.name
}
```

### `entries` и `values()`

Также существует функция `values()`:

```kotlin
val values = Difficulty.values()
```

Основная разница:

- `entries` возвращает список enum-констант;
- `values()` возвращает массив enum-констант.

Для современного Kotlin рекомендуется использовать `entries`, если нужен доступ ко всем значениям перечисления.

### `valueOf()`

Если нужно получить enum-константу по имени:

```kotlin
val status = Status.valueOf("COMPLETED")
```

Если передать неизвестное имя, будет выброшено `IllegalArgumentException`.

Безопасный вариант:

```kotlin
val status = runCatching {
    Status.valueOf("UNKNOWN")
}.getOrNull()
```

Можно также самостоятельно искать нужный элемент:

```kotlin
val status = Status.entries.find {
    it.name == "COMPLETED"
}
```

### `enumValueOf<T>()`

Существует generic-функция:

```kotlin
val status = enumValueOf<Status>("COMPLETED")
```

Она работает аналогично `valueOf()`.

## 10.7. Сравнение enum с другими способами моделирования состояний {#sravnenie-enum-s-drugimi-sposobami-modelirovaniya-sostoyaniy}

Enum подходит для ограниченного набора значений, у которых одинаковая структура.

Например:

```kotlin
enum class LoadingStatus {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR
}
```

Но если каждому состоянию нужно хранить разный набор данных, одного enum может быть недостаточно.

Рассмотрим загрузку пользователя:

```kotlin
enum class LoadingStatus {
    LOADING,
    SUCCESS,
    ERROR
}
```

Для `SUCCESS` нужно передать пользователя, а для `ERROR` — сообщение.

Enum можно дополнить внешними переменными, но это быстро усложняет модель.

Вместо этого лучше использовать sealed class:

```kotlin
sealed interface UserState {

    data object Loading : UserState

    data class Success(
        val user: User
    ) : UserState

    data class Error(
        val message: String
    ) : UserState
}
```

### Когда выбрать enum

Используй enum, когда:

- все варианты известны заранее;
- у вариантов одинаковая структура;
- достаточно одного фиксированного значения;
- нужно хранить свойства, общие для всех констант;
- не требуется создавать множество экземпляров одного варианта.

### Когда выбрать sealed class

Используй sealed class или sealed interface, когда:

- варианты могут содержать разные данные;
- у каждого состояния своя структура;
- требуется моделировать результаты операций;
- необходимо явно описать набор возможных состояний.

Подробное сравнение рассматривается в следующем разделе.

## Практика

1. Создай enum `Direction` с четырьмя направлениями.
2. Используй его в `when`.
3. Создай enum `Difficulty` со свойствами `title` и `points`.
4. Добавь метод, который возвращает описание константы.
5. Реализуй интерфейс через enum.
6. Создай enum, в котором каждая константа по-разному выполняет одну операцию.
7. Получи список всех элементов через `entries`.
8. Найди enum-константу по имени.
9. Создай явный код для каждой константы и объясни, почему это надёжнее `ordinal`.
10. Сравни enum для статуса загрузки с sealed class.

## Самопроверка

- [ ] Знаю синтаксис `enum class`.
- [ ] Понимаю, что enum-константы являются singleton-экземплярами.
- [ ] Умею добавлять свойства и конструкторы enum.
- [ ] Умею объявлять методы внутри enum.
- [ ] Понимаю, как разные константы могут реализовывать собственное поведение.
- [ ] Знаю, что enum может реализовывать интерфейсы.
- [ ] Понимаю назначение `name` и `ordinal`.
- [ ] Знаю, почему ordinal не подходит для стабильного хранения.
- [ ] Умею перебирать значения через `entries`.
- [ ] Знаю назначение `valueOf()`.
- [ ] Понимаю, когда лучше использовать enum, а когда sealed class.

### Вопросы на собеседовании

:::qa
- **Что такое enum class?** — Перечисление с фиксированным набором констант, каждая из которых является его единственным экземпляром.
- **Чем enum отличается от обычного класса?** — Константы перечисляются прямо в объявлении, у них есть `name` и `ordinal`, а компилятор генерирует `values()` и `valueOf()`.
- **Может ли enum иметь конструктор?** — Да, но только приватный: параметры передаются каждой константе при её объявлении.
- **Могут ли enum-константы иметь собственные свойства и поведение?** — Да, можно передать значения в конструктор и переопределить методы у отдельных констант.
- **Может ли enum реализовывать интерфейс?** — Да, enum class может реализовать интерфейс, и каждая константа способна по-своему переопределить его метод.
- **Что возвращает `name`?** — Имя константы в виде строки в точности так, как она записана в объявлении.
- **Что возвращает `ordinal`?** — Позицию константы в объявлении, начиная с нуля.
- **Почему не следует сохранять ordinal в базе данных?** — При правке перечисления порядок констант меняется, и сохранённые числа начнут соответствовать другим значениям.
- **Чем `entries` отличается от `values()`?** — `entries` — рекомендуемый в современном Kotlin способ получить все константы, `values()` — более старый аналог.
- **В каких случаях enum лучше заменить на sealed class?** — Когда варианты несут разные данные или их список может расширяться в других модулях.
:::

### Дополнительные официальные источники

- [Enum classes](https://kotlinlang.org/docs/enum-classes.html)
- [Sealed classes and interfaces](https://kotlinlang.org/docs/sealed-classes.html)
- [Control flow](https://kotlinlang.org/docs/control-flow.html)

---

# 11. Sealed Class и Sealed Interface {#sealed-class-i-sealed-interface}

`sealed class` и `sealed interface` позволяют объявлять ограниченные иерархии типов.

Это удобно, когда множество возможных вариантов заранее известно и должно контролироваться компилятором.

В Android-разработке такие конструкции часто используются для представления:

- состояний экрана;
- результатов сетевых запросов;
- событий;
- ошибок;
- типов навигации;
- результатов пользовательских действий.

## 11.1. Синтаксис sealed class {#sintaksis-sealed-class}

`sealed class` объявляется с помощью ключевого слова `sealed`.

```kotlin
sealed class UserState
```

Прямые наследники такого класса должны находиться в том же package и module.

Пример:

```kotlin
sealed class UserState {

    data object Loading : UserState()

    data class Success(
        val name: String
    ) : UserState()

    data class Error(
        val message: String
    ) : UserState()
}
```

Здесь определены три возможных состояния:

- `Loading`;
- `Success`;
- `Error`.

У каждого варианта может быть своя структура.

### Singleton-состояния

Для состояний, которым не нужны дополнительные данные, удобно использовать `object` или `data object`.

```kotlin
sealed class ScreenState {

    data object Loading : ScreenState()

    data object Empty : ScreenState()

    data object Unauthorized : ScreenState()
}
```

Каждое такое состояние представлено единственным объектом.

### Состояния с данными

Если состояние должно содержать информацию, используется обычный класс или data class.

```kotlin
sealed class ScreenState {

    data object Loading : ScreenState()

    data class Success(
        val users: List<User>
    ) : ScreenState()

    data class Error(
        val message: String,
        val code: Int
    ) : ScreenState()
}
```

Теперь каждое состояние имеет собственную структуру данных.

## 11.2. Синтаксис sealed interface {#sintaksis-sealed-interface}

`sealed interface` работает по похожему принципу, но вместо наследования от класса используется реализация интерфейса.

```kotlin
sealed interface PaymentResult {

    data class Success(
        val transactionId: String
    ) : PaymentResult

    data class Error(
        val message: String
    ) : PaymentResult

    data object Cancelled : PaymentResult
}
```

Реализации:

```kotlin
fun processPayment(): PaymentResult {
    return PaymentResult.Success("TX-100")
}
```

### Sealed interface и множественное наследование

Класс может реализовывать несколько интерфейсов.

Поэтому sealed interface удобно использовать, когда ограниченная иерархия должна сочетаться с другими интерфейсами.

```kotlin
interface Loggable {
    fun log()
}

sealed interface Result

data class Success(
    val value: String
) : Result, Loggable {

    override fun log() {
        println(value)
    }
}
```

Класс `Success` одновременно является реализацией `Result` и `Loggable`.

## 11.3. Ограничения наследования {#ogranicheniya-nasledovaniya}

Главная особенность sealed-типов — ограниченное множество прямых наследников.

Прямые наследники sealed class или реализации sealed interface должны находиться в том же пакете и модуле, где объявлен sealed-тип.

Они должны иметь именованные объявления. Локальные классы и анонимные объекты не могут быть прямыми наследниками sealed-типа.

Пример:

```kotlin
package com.example.domain

sealed interface Result

data object Success : Result

data object Error : Result
```

Следующий прямой наследник в другом package не разрешён:

```kotlin
package com.example.ui

// Не допускается, поскольку прямой наследник
// находится в другом package.

// data object Loading : Result
```

### Прямые и косвенные наследники

Важно различать прямого и косвенного наследника.

```kotlin
sealed interface Result

open class BaseResult : Result

class NetworkResult : BaseResult()
```

`BaseResult` — прямой наследник sealed interface.

`NetworkResult` — косвенный наследник.

Условия ограничения наследования применяются к прямым наследникам.

Если прямой наследник объявлен `open`, его последующие наследники могут располагаться в других местах в соответствии с обычными правилами наследования.

### Конструкторы sealed class

У sealed class конструктор может быть `protected` или `private`.

По умолчанию используется `protected`.

Это ограничивает возможность создания произвольных экземпляров и наследников.

## 11.4. Exhaustive when {#exhaustive-when}

Одно из важнейших преимуществ sealed-типов — возможность исчерпывающе обработать все варианты через `when`.

```kotlin
sealed interface UserState {

    data object Loading : UserState

    data class Success(
        val name: String
    ) : UserState

    data class Error(
        val message: String
    ) : UserState
}
```

Обработка:

```kotlin
fun render(state: UserState) {
    when (state) {

        UserState.Loading -> {
            println("Загрузка")
        }

        is UserState.Success -> {
            println("Привет, ${state.name}")
        }

        is UserState.Error -> {
            println("Ошибка: ${state.message}")
        }
    }
}
```

`else` не требуется, потому что все прямые варианты обработаны.

### Почему это важно

Предположим, позднее добавили новое состояние:

```kotlin
data object Empty : UserState
```

После этого компилятор может сообщить, что существующий `when` больше не является исчерпывающим.

Разработчик должен добавить обработку нового варианта.

Это предотвращает ситуации, когда новое состояние существует, но приложение не знает, как его отображать.

### `when` и enum

Enum также позволяет использовать exhaustive when.

```kotlin
enum class Status {
    LOADING,
    SUCCESS,
    ERROR
}
```

Но sealed class предоставляет большую гибкость структуры вариантов.

## 11.5. Сравнение с enum {#sravnenie-s-enum}

Enum и sealed-типы решают похожие, но не одинаковые задачи.

### Enum

```kotlin
enum class LoadingStatus {
    LOADING,
    SUCCESS,
    ERROR
}
```

Все возможные варианты — константы одного типа.

Каждый вариант представляет единственный экземпляр.

### Sealed class

```kotlin
sealed interface LoadingState {

    data object Loading : LoadingState

    data class Success(
        val data: String
    ) : LoadingState

    data class Error(
        val exception: Throwable
    ) : LoadingState
}
```

Каждый вариант может иметь различную структуру и хранить собственные данные.

### Таблица сравнения

| Enum | Sealed class / interface |
|---|---|
| Фиксированный набор констант | Ограниченная иерархия типов |
| Каждая константа — один экземпляр | Классовые варианты могут иметь много экземпляров |
| Все варианты имеют общую структуру | Разные варианты могут иметь разную структуру |
| Удобен для фиксированных режимов и статусов | Удобен для состояний с данными |
| Может иметь свойства и методы | Каждый наследник может иметь собственные свойства и методы |
| Поддерживает exhaustive when | Поддерживает exhaustive when |

### Практический выбор

Enum:

```kotlin
enum class Theme {
    LIGHT,
    DARK,
    SYSTEM
}
```

Все варианты отличаются только значением режима.

Sealed:

```kotlin
sealed interface LoginResult {

    data class Success(
        val user: User
    ) : LoginResult

    data object InvalidPassword : LoginResult

    data object UserNotFound : LoginResult

    data class NetworkError(
        val message: String
    ) : LoginResult
}
```

Здесь разные варианты содержат разные данные.

## 11.6. Моделирование состояний и результатов операций {#modelirovanie-sostoyaniy-i-rezultatov-operatsiy}

Sealed-типы особенно полезны при проектировании состояния приложения.

### Состояние загрузки экрана

```kotlin
sealed interface UsersUiState {

    data object Loading : UsersUiState

    data class Success(
        val users: List<User>
    ) : UsersUiState

    data object Empty : UsersUiState

    data class Error(
        val message: String
    ) : UsersUiState
}
```

Теперь экран может находиться только в одном из явно определённых состояний.

### Обработка состояния

```kotlin
fun render(state: UsersUiState) {
    when (state) {
        UsersUiState.Loading -> showLoading()

        is UsersUiState.Success -> {
            showUsers(state.users)
        }

        UsersUiState.Empty -> showEmpty()

        is UsersUiState.Error -> {
            showError(state.message)
        }
    }
}
```

### Результат операции

```kotlin
sealed interface RegistrationResult {

    data class Success(
        val userId: Long
    ) : RegistrationResult

    data object EmailAlreadyUsed : RegistrationResult

    data object InvalidPassword : RegistrationResult

    data class Failure(
        val message: String
    ) : RegistrationResult
}
```

Функция регистрации:

```kotlin
fun register(
    email: String,
    password: String
): RegistrationResult {

    if (email.isBlank()) {
        return RegistrationResult.EmailAlreadyUsed
    }

    if (password.length < 8) {
        return RegistrationResult.InvalidPassword
    }

    return RegistrationResult.Success(100L)
}
```

Обработка:

```kotlin
when (val result = register("alex@example.com", "password123")) {

    is RegistrationResult.Success -> {
        println("Создан пользователь ${result.userId}")
    }

    RegistrationResult.EmailAlreadyUsed -> {
        println("Email уже используется")
    }

    RegistrationResult.InvalidPassword -> {
        println("Слабый пароль")
    }

    is RegistrationResult.Failure -> {
        println(result.message)
    }
}
```

### Почему это лучше нескольких Boolean

Представим состояние:

```kotlin
data class UserState(
    val isLoading: Boolean,
    val isSuccess: Boolean,
    val isError: Boolean
)
```

Такой тип допускает противоречивые комбинации:

```kotlin
UserState(
    isLoading = true,
    isSuccess = true,
    isError = true
)
```

Что означает такое состояние?

С помощью sealed interface мы можем сделать варианты взаимоисключающими:

```kotlin
sealed interface UserState {

    data object Loading : UserState

    data object Success : UserState

    data class Error(
        val message: String
    ) : UserState
}
```

Теперь невозможно одновременно находиться в трёх этих состояниях.

Это важный принцип моделирования состояния: тип должен ограничивать количество некорректных комбинаций данных.

## Практика

1. Создай sealed class `UserState`.
2. Добавь состояния `Loading`, `Success` и `Error`.
3. Сделай `Success` data class с пользовательскими данными.
4. Обработай все состояния через `when`.
5. Добавь новое состояние `Empty` и проверь, что произойдёт с exhaustive when.
6. Создай sealed interface `PaymentResult`.
7. Добавь варианты успеха, ошибки и отмены.
8. Создай sealed-иерархию для результата авторизации.
9. Сравни одну модель состояния на Boolean-переменных и через sealed interface.
10. Объясни разницу между прямыми и косвенными наследниками sealed-типа.

## Самопроверка

- [ ] Знаю синтаксис sealed class.
- [ ] Знаю синтаксис sealed interface.
- [ ] Понимаю ограничения прямых наследников.
- [ ] Понимаю, что такое exhaustive when.
- [ ] Знаю, почему при добавлении нового варианта может потребоваться изменить when.
- [ ] Понимаю разницу между enum и sealed.
- [ ] Умею моделировать состояния экрана.
- [ ] Умею представлять результаты операций через sealed-типы.
- [ ] Понимаю, почему sealed-типы помогают избегать противоречивых состояний.

### Вопросы на собеседовании

:::qa
- **Что такое sealed class?** — Ограниченная иерархия, все прямые наследники которой известны компилятору и находятся в том же модуле.
- **Чем sealed interface отличается от sealed class?** — Интерфейс позволяет наследоваться от других классов и реализовывать несколько интерфейсов, а класс накладывает ограничения на конструктор.
- **Где должны находиться прямые наследники sealed-типа?** — В том же модуле и пакете, что и сам sealed-тип.
- **Что такое exhaustive when?** — `when`, обрабатывающий все варианты sealed-типа, благодаря чему ветка `else` не нужна.
- **Почему для sealed-типа можно не писать `else`?** — Компилятор знает полный список наследников и проверяет полноту ветвей.
- **Чем sealed class отличается от enum?** — У enum одна константа на значение без дополнительных данных, а наследники sealed — полноценные классы со своим состоянием.
- **Когда вариант sealed-типа должен быть data class?** — Когда он хранит данные и его нужно сравнивать по значению, например `data class Error(val message: String)`.
- **Почему sealed interface удобен для моделирования UI State?** — Позволяет описать состояния с разными данными и получить проверку полноты `when` на этапе компиляции.
- **Что такое прямой и косвенный наследник?** — Прямой объявлен непосредственно от sealed-типа, косвенный — через прямого; для проверки `when` важен именно прямой набор.
- **Почему несколько Boolean для описания состояния могут быть плохой моделью?** — Они допускают противоречивые комбинации вроде `isLoading && isError`, а sealed-тип делает невозможные состояния невыразимыми.
:::

### Дополнительные официальные источники

- [Sealed classes and interfaces](https://kotlinlang.org/docs/sealed-classes.html)
- [Data classes](https://kotlinlang.org/docs/data-classes.html)
- [Enum classes](https://kotlinlang.org/docs/enum-classes.html)
- [Control flow](https://kotlinlang.org/docs/control-flow.html)

---

# 12. Packages и Visibility Modifiers {#packages-i-visibility-modifiers}

Packages и Visibility Modifiers позволяют организовывать исходный код и контролировать доступность классов, функций и свойств.

Без разделения на пакеты большой проект быстро превращается в набор деклараций, в котором сложно ориентироваться.

Модификаторы доступа позволяют скрывать внутреннюю реализацию компонентов и формировать публичный API.

## 12.1. Объявление пакета {#obyavlenie-paketa}

Пакет определяется ключевым словом `package`.

```kotlin
package com.example.app.data
```

Объявление пакета должно находиться в начале файла.

Пример структуры проекта:

```text
src/
└── main/
    └── kotlin/
        └── com/
            └── example/
                └── app/
                    ├── data/
                    │   └── UserRepository.kt
                    ├── domain/
                    │   └── User.kt
                    └── ui/
                        └── UserScreen.kt
```

Файл `UserRepository.kt`:

```kotlin
package com.example.app.data

class UserRepository
```

Файл `User.kt`:

```kotlin
package com.example.app.domain

data class User(
    val id: Long,
    val name: String
)
```

Путь файла и имя package не связаны обязательным правилом компилятора.

Но обычно структура директорий соответствует пакетам, чтобы проект было проще поддерживать.

### Зачем нужны пакеты

Пакеты помогают:

- группировать связанные декларации;
- разделять разные части приложения;
- избегать конфликтов имён;
- управлять видимостью top-level объявлений;
- улучшать читаемость проекта.

## 12.2. Импорты (`import`) {#importy-import}

Для использования деклараций из другого пакета применяется `import`.

```kotlin
package com.example.app.ui

import com.example.app.domain.User

fun printUser(user: User) {
    println(user.name)
}
```

Без импорта пришлось бы использовать полное имя типа:

```kotlin
fun printUser(
    user: com.example.app.domain.User
) {
    println(user.name)
}
```

### Импорт функций

Импортировать можно не только классы:

```kotlin
package com.example.app.utils

fun formatName(name: String): String {
    return name.uppercase()
}
```

Использование:

```kotlin
import com.example.app.utils.formatName

val name = formatName("Alex")
```

### Импорт свойств

```kotlin
package com.example.app.config

const val APP_NAME = "Study Platform"
```

Импорт:

```kotlin
import com.example.app.config.APP_NAME
```

### Импорт всех деклараций пакета

Можно использовать `*`:

```kotlin
import com.example.app.utils.*
```

Это позволяет обращаться к доступным декларациям пакета без отдельных импортов.

Но не следует бездумно импортировать всё подряд: при большом количестве импортов могут возникать конфликты имён, а зависимости файла становятся менее очевидными.

### Default imports

Kotlin автоматически импортирует некоторые пакеты, поэтому их не требуется указывать вручную.

Например:

- `kotlin.*`;
- `kotlin.collections.*`;
- `kotlin.text.*`;
- `kotlin.ranges.*`;
- `kotlin.math.*`.

Для JVM дополнительно доступны импорты платформы, например `java.lang.*` и `kotlin.jvm.*`.

## 12.3. Алиасы импорта {#aliasy-importa}

Если в разных пакетах существуют декларации с одинаковыми именами, можно использовать alias.

Для этого применяется `as`.

Предположим, есть два класса `User`:

```kotlin
package com.example.app.domain

class User
```

```kotlin
package com.example.app.database

class User
```

Обычный импорт обоих классов создаст конфликт имени.

Можно использовать псевдоним:

```kotlin
import com.example.app.domain.User

import com.example.app.database.User as DatabaseUser
```

Теперь:

```kotlin
val domainUser = User()
val databaseUser = DatabaseUser()
```

### Алиасы для функций

```kotlin
import com.example.app.utils.formatDate as format

val result = format()
```

### Алиасы для extension functions

```kotlin
import com.example.app.extensions.isValid as validate
```

Использование:

```kotlin
val valid = "alex@example.com".validate()
```

### Когда использовать alias

- При конфликте одинаковых имён.
- Для различения типов из разных библиотек.
- Когда импортируемая функция имеет слишком общее имя.
- Для повышения читаемости в конкретном файле.

## 12.4. `public` {#public}

`public` — модификатор, который делает декларацию доступной из всех мест, где виден содержащий тип или пакет.

В Kotlin это значение по умолчанию.

```kotlin
public class User {

    public val name = "Alex"

    public fun printName() {
        println(name)
    }
}
```

Можно не писать `public`:

```kotlin
class User {

    val name = "Alex"

    fun printName() {
        println(name)
    }
}
```

Обе версии имеют одинаковую видимость.

### Публичный API

`public` часто используется для компонентов, которые должны быть доступны другим частям приложения или внешним пользователям библиотеки.

Например:

```kotlin
public interface UserRepository {
    fun getUser(id: Long): User?
}
```

Публичный API следует проектировать аккуратно, поскольку его изменения могут повлиять на множество потребителей.

## 12.5. `private` {#private}

`private` ограничивает доступ к декларации.

### Private на уровне файла

```kotlin
package com.example.app.utils

private const val MAX_RETRY_COUNT = 3

fun execute() {
    println(MAX_RETRY_COUNT)
}
```

`MAX_RETRY_COUNT` доступна только внутри данного файла.

Другой файл того же package не сможет обратиться к ней напрямую.

### Private внутри класса

```kotlin
class BankAccount {

    private var balance = 0.0

    fun deposit(amount: Double) {
        balance += amount
    }
}
```

Внешний код не может напрямую обратиться к `balance`.

```kotlin
val account = BankAccount()

account.deposit(100.0)

// Ошибка:
// println(account.balance)
```

### Private constructor

Конструктор тоже может иметь модификатор доступа:

```kotlin
class Database private constructor() {

    companion object {
        fun create(): Database {
            return Database()
        }
    }
}
```

Внешний код не может вызвать конструктор напрямую.

Создание объекта контролируется через фабричный метод.

### Для чего нужен private

- Скрывать внутренние детали реализации.
- Защищать состояние объектов.
- Уменьшать количество доступных точек взаимодействия.
- Сокращать публичный API.
- Ограничивать доступ к вспомогательным функциям.

## 12.6. `protected` {#protected}

`protected` разрешает доступ внутри класса и его наследников.

```kotlin
open class Animal {

    protected val name = "Unknown"

    protected fun printName() {
        println(name)
    }
}
```

Наследник:

```kotlin
class Dog : Animal() {

    fun sayName() {
        printName()
    }
}
```

Использование:

```kotlin
val dog = Dog()

dog.sayName()
```

Но внешний код не может напрямую обратиться к защищённому члену:

```kotlin
// Ошибка:
// println(dog.name)
```

### Особенности protected

- Используется для членов классов.
- Недоступен для top-level деклараций.
- Доступен внутри наследников.
- Не является полностью публичным API.

`protected` часто используется для свойств и методов базовых классов, которые должны быть доступны при расширении поведения.

## 12.7. `internal` {#internal}

`internal` делает декларацию доступной внутри одного Kotlin-модуля.

```kotlin
internal class UserMapper {

    internal fun map() {
        println("Mapping")
    }
}
```

### Что такое модуль

Модуль Kotlin — совокупность исходников, компилируемых вместе как единая единица.

В зависимости от сборки это может быть:

- Gradle-модуль;
- Maven-проект;
- IntelliJ IDEA module;
- единица компиляции Kotlin.

В Android-проекте отдельный Gradle-модуль часто компилируется независимо, поэтому `internal` полезен для ограничения API внутри него.

Например:

```text
:core:domain
:core:data
:feature:profile
:feature:settings
```

Если класс объявлен `internal` в `:core:domain`, его нельзя напрямую использовать из другого независимого Kotlin-модуля.

### Отличие internal от private

`private` на top-level уровне ограничивает доступ текущим файлом.

`internal` разрешает доступ всему модулю.

## 12.8. Видимость на уровне файла и класса {#vidimost-na-urovne-fayla-i-klassa}

Модификаторы доступа в Kotlin ведут себя немного по-разному в зависимости от места объявления.

### Top-level declarations

Для функций, классов, свойств и объектов, объявленных на уровне файла:

| Модификатор | Видимость |
|---|---|
| `public` | Везде, где доступна декларация |
| `internal` | В пределах текущего модуля |
| `private` | Только внутри файла |
| `protected` | Не поддерживается |

### Члены классов

Для свойств и функций внутри класса:

| Модификатор | Видимость |
|---|---|
| `public` | Везде, где доступен класс |
| `internal` | В пределах модуля |
| `private` | Внутри класса |
| `protected` | Внутри класса и наследников |

### Видимость setter

Setter свойства может иметь более ограниченную видимость, чем getter:

```kotlin
class User {

    var age = 0
        private set
}
```

Внешний код может читать значение, но не может переназначить его.

### По умолчанию public

Если модификатор не указан, используется `public`.

Это важно учитывать при проектировании библиотек и многомодульных приложений.

### Публичная декларация и типы её параметров

Нельзя предоставить публичный API, который раскрывает тип с более ограниченной видимостью.

Например:

```kotlin
internal class InternalUser

// Ошибка: публичная функция раскрывает internal-тип.
// public fun getUser(): InternalUser
```

Это необходимо, чтобы внешние потребители не получали доступ к типам, которые по контракту должны оставаться скрытыми.

## Практика

1. Создай несколько файлов с разными package.
2. Объяви классы и функции в разных пакетах.
3. Импортируй их через `import`.
4. Создай два класса с одинаковым именем и используй import alias.
5. Объяви top-level функцию с `private`.
6. Попробуй вызвать её из другого файла.
7. Создай класс с private-свойством и публичным методом доступа.
8. Создай базовый класс с protected-свойством и наследника.
9. Создай internal-класс и попробуй использовать его из другого модуля.
10. Сделай setter свойства приватным.
11. Объясни разницу между `private`, `protected` и `internal`.

## Самопроверка

- [ ] Понимаю назначение packages.
- [ ] Умею объявлять пакет.
- [ ] Знаю, как импортировать классы, функции и свойства.
- [ ] Умею использовать wildcard import.
- [ ] Знаю назначение import alias.
- [ ] Понимаю `public`.
- [ ] Понимаю `private` на уровне файла и класса.
- [ ] Понимаю `protected`.
- [ ] Понимаю `internal`.
- [ ] Знаю, что такое Kotlin-модуль.
- [ ] Понимаю разницу между видимостью top-level деклараций и членов класса.
- [ ] Умею ограничивать видимость setter.

### Вопросы на собеседовании

:::qa
- **Для чего нужны packages?** — Для организации кода и пространства имён; они также влияют на видимость `private` и `internal`.
- **Обязательно ли имя package должно соответствовать директории?** — Нет, компилятор это не проверяет, но соглашение рекомендуется соблюдать для навигации по проекту.
- **Что можно импортировать в Kotlin?** — Классы, функции, свойства, объекты и extension functions; из пакета `kotlin` члены импортируются автоматически.
- **Как работает import alias?** — `import com.example.User as ApiUser` даёт классу другое имя в файле и помогает разрешить конфликты.
- **Какой модификатор доступа используется по умолчанию?** — `public`: член виден везде, где виден содержащий его класс.
- **Чем `private` на уровне файла отличается от `private` внутри класса?** — На уровне файла объявление видно только в этом файле, внутри класса — только внутри класса.
- **Что означает `protected`?** — Видимость внутри класса и его наследников, но не в остальном пакете.
- **Что такое `internal`?** — Видимость в пределах одного модуля; на JVM реализуется через name mangling в именах.
- **Чем Kotlin-модуль отличается от package?** — Модуль — единица компиляции и граница `internal`, package — только пространство имён.
- **Почему публичный API не должен раскрывать internal-тип?** — Потому что потребители модуля не смогут получить доступ к такому типу, и публичная сигнатура окажется бесполезной.
:::

### Дополнительные официальные источники

- [Packages and imports](https://kotlinlang.org/docs/packages.html)
- [Visibility modifiers](https://kotlinlang.org/docs/visibility-modifiers.html)
- [Coding conventions](https://kotlinlang.org/docs/coding-conventions.html)

---

# 13. Generics Basics {#generics-basics}

Generics — механизм обобщённого программирования, позволяющий создавать классы и функции, которые работают с разными типами данных, сохраняя типобезопасность.

Без generics пришлось бы создавать отдельные реализации для разных типов или использовать слишком общий тип `Any`.

Generics позволяют написать одну реализацию, которая работает с различными типами без потери информации о типе данных.

Они активно используются в стандартной библиотеке Kotlin:

- `List<T>`;
- `Set<T>`;
- `Map<K, V>`;
- `MutableList<T>`;
- `Result<T>`;
- `Pair<A, B>`.

Также generics часто применяются при проектировании репозиториев, сервисов, контейнеров данных и API.

## 13.1. Параметры типов (`T`, `E`, `K`, `V`) {#parametry-tipov-t-e-k-v}

Параметр типа — условное обозначение типа, который будет определён при использовании класса или функции.

Обычно используют следующие имена:

| Обозначение | Типичное назначение |
|---|---|
| `T` | Type — произвольный тип |
| `E` | Element — элемент коллекции |
| `K` | Key — ключ |
| `V` | Value — значение |
| `R` | Return — возвращаемый результат |

Это соглашение об именовании, а не обязательные ключевые слова языка.

### Зачем нужны параметры типов

Предположим, нужно создать контейнер для хранения значения.

Без generics:

```kotlin
class Box {
    var value: Any? = null
}
```

Использование:

```kotlin
val box = Box()

box.value = "Kotlin"

val text = box.value as String
```

Проблема: тип значения не известен компилятору точно.

Придётся выполнять приведение типа.

С generics:

```kotlin
class Box<T>(
    val value: T
)
```

Использование:

```kotlin
val stringBox = Box("Kotlin")
val intBox = Box(100)
```

Компилятор определяет тип самостоятельно:

- `stringBox` — `Box<String>`;
- `intBox` — `Box<Int>`.

Теперь не требуется дополнительное приведение:

```kotlin
println(stringBox.value.uppercase())
println(intBox.value + 10)
```

### Типовой параметр и типовой аргумент

В объявлении:

```kotlin
class Box<T>
```

`T` — параметр типа.

При использовании:

```kotlin
val box: Box<String>
```

`String` — аргумент типа.

## 13.2. Generic-классы {#generic-klassy}

Generic-класс — класс, который принимает один или несколько параметров типа.

### Простой контейнер

```kotlin
class Box<T>(
    val value: T
)
```

Использование:

```kotlin
val stringBox = Box<String>("Hello")
val numberBox = Box<Int>(100)
val booleanBox = Box<Boolean>(true)
```

В большинстве случаев тип можно вывести:

```kotlin
val stringBox = Box("Hello")
val numberBox = Box(100)
```

### Generic-класс с несколькими параметрами

```kotlin
class PairContainer<A, B>(
    val first: A,
    val second: B
)
```

Использование:

```kotlin
val user = PairContainer(
    "Alex",
    25
)
```

Типы будут выведены как `String` и `Int`.

### Mutable generic-контейнер

```kotlin
class Storage<T>(
    initialValue: T
) {
    var value: T = initialValue

    fun update(newValue: T) {
        value = newValue
    }
}
```

Использование:

```kotlin
val storage = Storage("Kotlin")

storage.update("Android")

println(storage.value)
```

`Storage<String>` не позволит записать туда `Int`.

```kotlin
// Ошибка:
// storage.update(100)
```

Это и есть типобезопасность generics.

### Generic-классы с коллекциями

```kotlin
class UserRepository<T>(
    private val users: List<T>
) {
    fun getAll(): List<T> {
        return users
    }
}
```

Использование:

```kotlin
data class User(
    val id: Long,
    val name: String
)

val repository = UserRepository(
    listOf(
        User(1, "Alex"),
        User(2, "Maria")
    )
)
```

Компилятор выводит тип `T` как `User`.

## 13.3. Generic-функции {#generic-funktsii}

Параметры типов могут использоваться не только в классах, но и в функциях.

Для объявления generic-функции параметр типа указывается перед именем функции.

```kotlin
fun <T> printValue(value: T) {
    println(value)
}
```

Использование:

```kotlin
printValue("Kotlin")
printValue(100)
printValue(true)
```

Компилятор определяет тип `T` по переданному аргументу.

### Функция, возвращающая generic-значение

```kotlin
fun <T> identity(value: T): T {
    return value
}
```

Функция возвращает значение того же типа, который получила.

```kotlin
val name = identity("Alex")
val number = identity(100)
```

Типы результатов сохраняются:

- `name` — `String`;
- `number` — `Int`.

### Функция для создания списка

```kotlin
fun <T> singletonList(item: T): List<T> {
    return listOf(item)
}
```

Использование:

```kotlin
val names = singletonList("Alex")
val numbers = singletonList(100)
```

### Явное указание типа

Иногда можно указать аргумент типа явно:

```kotlin
val result = identity<String>("Kotlin")
```

Но если компилятор может определить тип самостоятельно, обычно это не требуется:

```kotlin
val result = identity("Kotlin")
```

### Generic extension function

Функции-расширения тоже могут быть generic:

```kotlin
fun <T> List<T>.printAll() {
    forEach {
        println(it)
    }
}
```

Использование:

```kotlin
listOf(1, 2, 3).printAll()

listOf("Alex", "Maria").printAll()
```

Одна функция работает со списками разных типов.

## 13.4. Ограничения типа (`T : SomeType`) {#ogranicheniya-tipa-t-sometype}

Иногда generic-коду недостаточно просто знать, что он работает с произвольным типом.

Например, нужно сравнивать значения или вызывать определённые методы.

Для этого можно задать ограничение типа (*type constraint*).

### Upper bound

```kotlin
fun <T : Number> printDouble(value: T) {
    println(value.toDouble())
}
```

`T : Number` означает, что в качестве `T` можно использовать только `Number` или его подтипы.

Например:

```kotlin
printDouble(10)
printDouble(10.5)
printDouble(100L)
```

Но строка не подходит:

```kotlin
// Ошибка:
// printDouble("Kotlin")
```

### Ограничение через интерфейс

```kotlin
interface Identifiable {
    val id: Long
}

fun <T : Identifiable> printId(value: T) {
    println(value.id)
}
```

Использование:

```kotlin
data class User(
    override val id: Long
) : Identifiable

printId(User(100))
```

Функция может обращаться к `id`, потому что компилятор знает, что любой допустимый `T` реализует `Identifiable`.

### Несколько ограничений

Если нужно указать несколько ограничений для одного типа, используется `where`.

```kotlin
fun <T> process(value: T)
    where T : CharSequence,
          T : Comparable<T> {

    println(value.length)
}
```

Теперь `T` должен одновременно реализовывать `CharSequence` и `Comparable<T>`.

### Ограничение на non-null типы

Если generic-параметр должен гарантированно быть non-nullable, используется `Any` как верхняя граница:

```kotlin
class Storage<T : Any>(
    val value: T
)
```

Теперь нельзя создать:

```kotlin
// Не скомпилируется:
// val storage = Storage<String?>(null)
```

### Поведение без ограничения

Если верхняя граница не указана, стандартным верхним типом является `Any?`.

Поэтому generic-параметр по умолчанию может быть nullable.

```kotlin
fun <T> printValue(value: T) {
    println(value)
}
```

`T` в этом случае не гарантирует non-nullable-значение.

## 13.5. Использование generic-коллекций {#ispolzovanie-generic-kollektsiy}

Стандартные коллекции Kotlin активно используют generics.

### List

```kotlin
val names: List<String> = listOf(
    "Alex",
    "Maria"
)
```

`List<String>` означает, что список содержит строки.

```kotlin
val firstName: String = names.first()
```

Не требуется преобразование из `Any`.

### MutableList

```kotlin
val numbers: MutableList<Int> = mutableListOf(
    1,
    2,
    3
)

numbers.add(4)
```

Список не позволяет добавлять значения другого типа:

```kotlin
// Ошибка:
// numbers.add("Hello")
```

### Set

```kotlin
val userIds: Set<Long> = setOf(
    1L,
    2L,
    3L
)
```

Все элементы должны быть `Long`.

### Map

```kotlin
val users: Map<Long, String> = mapOf(
    1L to "Alex",
    2L to "Maria"
)
```

`Map<K, V>` использует два параметра типа:

- `K` — тип ключа;
- `V` — тип значения.

### Generic-репозиторий

```kotlin
interface Repository<T> {
    fun getAll(): List<T>
    fun getById(id: Long): T?
}
```

Реализацию можно сделать общей для разных типов:

```kotlin
class InMemoryRepository<T : Identifiable>(
    private val items: List<T>
) : Repository<T> {

    override fun getAll(): List<T> {
        return items
    }

    override fun getById(id: Long): T? {
        return items.find {
            it.id == id
        }
    }
}
```

Теперь один репозиторий можно использовать для разных моделей, если они реализуют `Identifiable`.

```kotlin
data class User(
    override val id: Long,
    val name: String
) : Identifiable

data class Article(
    override val id: Long,
    val title: String
) : Identifiable
```

Примеры:

```kotlin
val userRepository = InMemoryRepository(
    listOf(
        User(1, "Alex"),
        User(2, "Maria")
    )
)

val articleRepository = InMemoryRepository(
    listOf(
        Article(1, "Kotlin Basics"),
        Article(2, "Android Architecture")
    )
)
```

Логика поиска переиспользуется, но типы данных остаются строгими.

## 13.6. Преимущества типобезопасности {#preimuschestva-tipobezopasnosti}

Generics помогают избежать ошибок, связанных с неправильным типом данных.

### Без generics

```kotlin
class Storage {
    private val values = mutableListOf<Any>()

    fun add(value: Any) {
        values.add(value)
    }

    fun get(index: Int): Any {
        return values[index]
    }
}
```

Использование:

```kotlin
val storage = Storage()

storage.add("Kotlin")
storage.add(100)

val value = storage.get(0) as String
```

Разработчик должен самостоятельно контролировать типы.

Если выполнить неправильное приведение, возможна ошибка выполнения.

### С generics

```kotlin
class Storage<T> {
    private val values = mutableListOf<T>()

    fun add(value: T) {
        values.add(value)
    }

    fun get(index: Int): T {
        return values[index]
    }
}
```

Использование:

```kotlin
val storage = Storage<String>()

storage.add("Kotlin")

val value: String = storage.get(0)
```

Теперь:

- тип данных известен компилятору;
- нельзя случайно добавить значение другого типа;
- не требуется ручное приведение;
- API становится понятнее;
- одна реализация подходит для разных типов.

### Generics и переиспользование кода

Без generics пришлось бы создавать:

```kotlin
class StringStorage
class IntStorage
class UserStorage
```

С generics достаточно одного класса:

```kotlin
class Storage<T>
```

Конкретный тип выбирается при использовании.

### Важное замечание: Type Erasure

На JVM информация о generic-аргументах в большинстве случаев стирается во время выполнения.

Это называется type erasure.

Например, нельзя напрямую проверить:

```kotlin
// Не разрешено:
// if (value is List<String>) { }
```

Потому что во время выполнения JVM не сохраняет полноценную информацию о типе элемента обычной generic-коллекции.

Но можно проверить саму коллекцию:

```kotlin
if (value is List<*>) {
    println(value.size)
}
```

`List<*>` означает список с неизвестным типом элементов.

Это базовое ограничение важно знать, хотя подробно механизмы стирания типов и variance изучаются на более высоком уровне.

### Когда нужны generics

Используй generics, когда:

- одна логика должна работать с разными типами;
- нужно сохранить конкретный тип входных и выходных данных;
- создаётся универсальный контейнер;
- разрабатывается общий интерфейс;
- нужно избежать `Any` и ручных cast;
- создаётся переиспользуемый компонент или API.

## Практика

1. Создай generic-класс `Box<T>`.
2. Создай экземпляры `Box<String>` и `Box<Int>`.
3. Напиши generic-класс `Storage<T>` с методами добавления и получения значения.
4. Создай generic-функцию `identity`.
5. Напиши функцию, принимающую `List<T>` и возвращающую количество элементов.
6. Используй generic extension function для вывода элементов списка.
7. Создай generic-класс с двумя параметрами типов.
8. Ограничь тип через `T : Number`.
9. Создай интерфейс `Identifiable` и функцию с ограничением `T : Identifiable`.
10. Используй `where` для задания нескольких ограничений.
11. Создай generic-репозиторий для `User` и `Article`.
12. Объясни, почему generics безопаснее, чем использование `Any`.
13. Объясни базовый смысл type erasure на JVM.

## Самопроверка

- [ ] Понимаю, зачем нужны generics.
- [ ] Знаю обозначения `T`, `E`, `K` и `V`.
- [ ] Понимаю разницу между параметром типа и аргументом типа.
- [ ] Умею создавать generic-классы.
- [ ] Умею создавать generic-функции.
- [ ] Понимаю автоматическое выведение generic-типов.
- [ ] Умею использовать generic extension functions.
- [ ] Понимаю ограничение типа `T : SomeType`.
- [ ] Умею использовать `where` для нескольких ограничений.
- [ ] Понимаю назначение `T : Any`.
- [ ] Умею использовать generic-коллекции.
- [ ] Понимаю, почему generics обеспечивают типобезопасность.
- [ ] Знаю базовое понятие type erasure.

### Вопросы на собеседовании

:::qa
- **Что такое generics?** — Обобщённое программирование: параметры типов позволяют переиспользовать код с разными типами без потери типобезопасности.
- **Для чего используется параметр типа `T`?** — Как заполнитель конкретного типа, который станет известен при использовании класса или функции.
- **В чём разница между `T`, `E`, `K` и `V`?** — Это соглашения об именах: `T` — тип, `E` — элемент, `K` — ключ, `V` — значение; на поведение они не влияют.
- **Как создать generic-класс?** — Например `class Box<T>(val value: T)`, затем `Box<String>("x")`.
- **Как создать generic-функцию?** — `fun <T> first(list: List<T>): T = list[0]`: параметр типа указывается сразу после `fun`.
- **Что такое upper bound?** — Ограничение параметра типа, например `T : Number`, сужающее множество допустимых типов.
- **Что означает `T : Number`?** — Параметр `T` должен быть подтипом `Number`, поэтому внутри доступны его методы.
- **Для чего используется `where`?** — Для нескольких ограничений, в том числе пользовательских интерфейсов: `where T : Number, T : Comparable<T>`.
- **Что означает `T : Any`?** — Явно делает параметр non-nullable; по умолчанию upper bound для `T` — `Any?`.
- **Почему generic-код безопаснее, чем использование `Any`?** — Компилятор проверяет типы и не требует приведений, которые могут упасть с `ClassCastException`.
- **Что означает `List<String>`?** — Список, гарантированно содержащий строки; попытка добавить другой тип не компилируется.
- **Чем отличаются `List<String>` и `List<Any>`?** — `List` ковариантен (`out E`), поэтому `List<String>` можно передать туда, где ожидается `List<Any>`, но не наоборот.
- **Что такое type erasure?** — На JVM параметры типов стираются при компиляции, поэтому `List<String>` и `List<Int>` в рантайме имеют один и тот же тип `List`.
- **Почему нельзя проверить `value is List<String>` во время выполнения на JVM?** — Из-за стирания типов информация о `String` отсутствует, и компилятор запрещает такую проверку.
:::

### Дополнительные официальные источники

- [Generics](https://kotlinlang.org/docs/generics.html)
- [Collections overview](https://kotlinlang.org/docs/collections-overview.html)
- [Type checks and casts](https://kotlinlang.org/docs/typecasts.html)
- [Kotlin type system](https://kotlinlang.org/spec/type-system.html)

---

# Итоговая самопроверка категории {#itogovaya-samoproverka-kategorii}

После изучения Kotlin Basics Junior-разработчик должен уметь читать и писать идиоматичный Kotlin-код, понимать ключевые возможности языка и применять их в небольших прикладных задачах.

## Синтаксис и система типов

- [ ] Понимаю структуру Kotlin-файла.
- [ ] Умею использовать package и import.
- [ ] Знаю разницу между выражениями и инструкциями.
- [ ] Умею работать со строковыми шаблонами.
- [ ] Понимаю Smart Cast.
- [ ] Умею использовать `is`, `!is`, `in` и `!in`.

## Null Safety

- [ ] Понимаю nullable и non-nullable типы.
- [ ] Умею использовать `?.` и `?:`.
- [ ] Понимаю риски `!!`.
- [ ] Умею использовать `as?`.
- [ ] Понимаю `let` при обработке nullable-значений.
- [ ] Знаю, что такое platform types.

## Классы и свойства

- [ ] Умею создавать data class.
- [ ] Понимаю `copy()`, `componentN()`, `equals()` и `hashCode()`.
- [ ] Знаю разницу между поверхностным и глубоким копированием.
- [ ] Понимаю properties и accessors.
- [ ] Умею писать custom getter и setter.
- [ ] Понимаю назначение backing field.
- [ ] Умею использовать visibility setter.

## Объекты и расширения

- [ ] Понимаю object declaration.
- [ ] Умею использовать object expression.
- [ ] Знаю назначение companion object.
- [ ] Понимаю разницу между singleton и обычным классом.
- [ ] Умею создавать extension functions.
- [ ] Понимаю ограничения extension properties.
- [ ] Знаю, что расширения разрешаются статически.

## Функциональные возможности

- [ ] Умею создавать лямбды.
- [ ] Понимаю функциональные типы.
- [ ] Умею использовать `it` и trailing lambda.
- [ ] Понимаю closures.
- [ ] Знаю разницу между lambda и anonymous function.
- [ ] Понимаю локальный и нелокальный `return`.
- [ ] Умею передавать функции через `::`.
- [ ] Понимаю функции высшего порядка.
- [ ] Умею использовать lambda with receiver.
- [ ] Знаю все пять scope functions.
- [ ] Могу выбрать подходящую scope function под задачу.

## Моделирование данных

- [ ] Умею создавать enum с конструктором, свойствами и методами.
- [ ] Знаю назначение `name`, `ordinal` и `entries`.
- [ ] Понимаю разницу между enum и sealed.
- [ ] Умею создавать sealed class и sealed interface.
- [ ] Понимаю exhaustive when.
- [ ] Могу моделировать состояния и результаты операций через sealed-типы.

## Организация кода и Generics

- [ ] Умею организовывать исходный код по пакетам.
- [ ] Знаю все четыре модификатора доступа.
- [ ] Понимаю разницу между private на уровне файла и класса.
- [ ] Понимаю назначение internal.
- [ ] Умею создавать generic-классы.
- [ ] Умею создавать generic-функции.
- [ ] Понимаю ограничения типа.
- [ ] Знаю назначение `where`.
- [ ] Понимаю преимущества типобезопасности generics.

---

# Итоговый проект {#itogovyy-proekt}

## Менеджер учебных навыков

Создай небольшую консольную программу для управления учебными навыками пользователя.

В проекте должны использоваться практически все возможности, рассмотренные в категории Kotlin Basics.

### 1. Модели данных

Создай перечисление уровней сложности:

```kotlin
enum class Difficulty(
    val title: String
) {
    EASY("Лёгкий"),
    MEDIUM("Средний"),
    HARD("Сложный")
}
```

Создай data class для навыка:

```kotlin
data class Skill(
    val id: Long,
    val name: String,
    val description: String,
    val difficulty: Difficulty,
    val isCompleted: Boolean = false
)
```

### 2. Результаты операций

Создай sealed interface:

```kotlin
sealed interface SkillResult {

    data class Success(
        val skill: Skill
    ) : SkillResult

    data object NotFound : SkillResult

    data class Error(
        val message: String
    ) : SkillResult
}
```

### 3. Репозиторий

Создай generic-интерфейс:

```kotlin
interface Repository<T> {

    fun getAll(): List<T>

    fun getById(id: Long): T?

    fun add(item: T)
}
```

Реализуй хранилище для навыков.

```kotlin
class SkillRepository : Repository<Skill> {

    private val skills = mutableListOf<Skill>()

    override fun getAll(): List<Skill> {
        return skills.toList()
    }

    override fun getById(id: Long): Skill? {
        return skills.find { it.id == id }
    }

    override fun add(item: Skill) {
        skills.add(item)
    }
}
```

### 4. Extension functions

Добавь расширения:

```kotlin
fun Skill.displayName(): String {
    return "${name} (${difficulty.title})"
}

fun Skill.isEasy(): Boolean {
    return difficulty == Difficulty.EASY
}
```

### 5. Scope functions

Используй `apply` для создания тестовых объектов:

```kotlin
val skill = Skill(
    id = 1,
    name = "Null Safety",
    description = "Работа с nullable-типами",
    difficulty = Difficulty.EASY
)
```

Дополнительно используй `also` для логирования добавления навыков.

### 6. Lambda и Higher Order Functions

Создай функцию фильтрации:

```kotlin
fun filterSkills(
    skills: List<Skill>,
    predicate: (Skill) -> Boolean
): List<Skill> {
    return skills.filter(predicate)
}
```

Использование:

```kotlin
val easySkills = filterSkills(skills) {
    it.difficulty == Difficulty.EASY
}
```

### 7. Object и Companion Object

Создай объект конфигурации:

```kotlin
object AppConfig {
    const val APP_NAME = "Skill Manager"
    const val MAX_SKILLS = 100
}
```

Добавь фабричный метод в companion object модели или отдельного класса, если он действительно нужен.

### 8. Properties и инкапсуляция

Реализуй менеджер, который позволяет читать список навыков, но не изменять его напрямую:

```kotlin
class SkillManager {

    private val repository = SkillRepository()

    val skills: List<Skill>
        get() = repository.getAll()

    fun addSkill(skill: Skill) {
        repository.add(skill)
    }
}
```

### 9. Обработка ошибок

Необходимо:

- проверять пустое название;
- проверять уникальность ID;
- корректно обрабатывать отсутствующий навык;
- не допускать некорректных значений сложности;
- использовать sealed result для представления результатов операций.

### 10. Функциональность программы

Реализуй:

1. Добавление навыков.
2. Удаление навыков.
3. Получение навыка по ID.
4. Вывод всех навыков.
5. Фильтрацию по сложности.
6. Поиск по названию.
7. Сортировку по названию.
8. Подсчёт закрытых навыков.
9. Проверку, все ли навыки закрыты.
10. Формирование статистики по уровням сложности.

## Критерии завершения

Проект можно считать завершённым, если:

- код разделён на логически связанные классы и функции;
- типы данных используются корректно;
- mutable-состояние не раскрывается напрямую наружу;
- повторяющаяся логика вынесена в функции;
- применяются data class, enum и sealed interface;
- расширения используются для компактных вспомогательных операций;
- generic-интерфейс не привязан к конкретной модели;
- все результаты операций обрабатываются явно;
- программа корректно работает с пустым списком и некорректным вводом.

---

# Итоговый список официальной документации Kotlin {#itogovyy-spisok-ofitsialnoy-dokumentatsii-kotlin}

Документация разбита по темам. Основной материал выше рассчитан на самостоятельное изучение, ссылки предназначены для уточнения поведения языка, знакомства с дополнительными возможностями и проверки API.

## Синтаксис Kotlin

- [Basic syntax](https://kotlinlang.org/docs/basic-syntax.html)
- [Coding conventions](https://kotlinlang.org/docs/coding-conventions.html)
- [Control flow](https://kotlinlang.org/docs/control-flow.html)
- [Type checks and casts](https://kotlinlang.org/docs/typecasts.html)
- [Ranges and progressions](https://kotlinlang.org/docs/ranges.html)
- [Documenting Kotlin code (KDoc)](https://kotlinlang.org/docs/kotlin-doc.html)

## Null Safety

- [Null safety](https://kotlinlang.org/docs/null-safety.html)
- [Type checks and casts](https://kotlinlang.org/docs/typecasts.html)
- [Calling Java from Kotlin](https://kotlinlang.org/docs/java-interop.html)
- [Nullability annotations in Java and Kotlin](https://kotlinlang.org/docs/java-to-kotlin-nullability-guide.html)

## Data Class

- [Data classes](https://kotlinlang.org/docs/data-classes.html)
- [Classes](https://kotlinlang.org/docs/classes.html)
- [Equality](https://kotlinlang.org/docs/equality.html)

## Properties и Accessors

- [Properties](https://kotlinlang.org/docs/properties.html)
- [Visibility modifiers](https://kotlinlang.org/docs/visibility-modifiers.html)

## Object и Companion Object

- [Object declarations and expressions](https://kotlinlang.org/docs/object-declarations.html)
- [Classes](https://kotlinlang.org/docs/classes.html)

## Extension Functions

- [Extensions](https://kotlinlang.org/docs/extensions.html)
- [Properties](https://kotlinlang.org/docs/properties.html)
- [Visibility modifiers](https://kotlinlang.org/docs/visibility-modifiers.html)

## Lambda

- [Higher-order functions and lambdas](https://kotlinlang.org/docs/lambdas.html)
- [Inline functions](https://kotlinlang.org/docs/inline-functions.html)
- [Returns and jumps](https://kotlinlang.org/docs/returns.html)

## Higher Order Functions

- [Higher-order functions and lambdas](https://kotlinlang.org/docs/lambdas.html)
- [Function references](https://kotlinlang.org/docs/reflection.html#function-references)
- [Collection operations](https://kotlinlang.org/docs/collection-operations.html)

## Scope Functions

- [Scope functions](https://kotlinlang.org/docs/scope-functions.html)
- [Higher-order functions and lambdas](https://kotlinlang.org/docs/lambdas.html)
- [Null safety](https://kotlinlang.org/docs/null-safety.html)

## Enum

- [Enum classes](https://kotlinlang.org/docs/enum-classes.html)
- [Sealed classes and interfaces](https://kotlinlang.org/docs/sealed-classes.html)
- [Control flow](https://kotlinlang.org/docs/control-flow.html)

## Sealed Class и Sealed Interface

- [Sealed classes and interfaces](https://kotlinlang.org/docs/sealed-classes.html)
- [Data classes](https://kotlinlang.org/docs/data-classes.html)
- [Enum classes](https://kotlinlang.org/docs/enum-classes.html)

## Packages и Visibility Modifiers

- [Packages and imports](https://kotlinlang.org/docs/packages.html)
- [Visibility modifiers](https://kotlinlang.org/docs/visibility-modifiers.html)
- [Coding conventions](https://kotlinlang.org/docs/coding-conventions.html)

## Generics Basics

- [Generics](https://kotlinlang.org/docs/generics.html)
- [Collections overview](https://kotlinlang.org/docs/collections-overview.html)
- [Type checks and casts](https://kotlinlang.org/docs/typecasts.html)
- [Kotlin type system specification](https://kotlinlang.org/spec/type-system.html)