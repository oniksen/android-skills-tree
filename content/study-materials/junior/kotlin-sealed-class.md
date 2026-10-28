<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Sealed Class</h1>
<p class="study-lead">
<code>sealed class</code> и <code>sealed interface</code> ограничивают иерархию наследования. Все прямые подтипы известны на этапе компиляции. Это удобно для моделирования состояний и исчерпывающего <code>when</code>.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#basics">1. Зачем нужен sealed</a>
<a class="study-nav-link" href="#when">2. Исчерпывающий when</a>
<a class="study-nav-link" href="#interface">3. Sealed interface</a>
<a class="study-nav-link" href="#enum">4. Sealed class и enum</a>
<a class="study-nav-link" href="#sec-1">Паттерн «ограниченные подтипы»</a>
<a class="study-nav-link" href="#sec-2">Практика и частые ошибки</a>
<a class="study-nav-link" href="#sec-3">Итог</a>
<a class="study-nav-link" href="#sec-4">Рекомендации</a>
<a class="study-nav-link" href="#sec-5">Мини-совет</a>
<a class="study-nav-link" href="#sec-6">Синтаксис sealed class: подробнее</a>
<a class="study-nav-link" href="#sec-7">sealed interface: подробнее</a>
<a class="study-nav-link" href="#sec-8">when exhaustive: подробнее</a>
<a class="study-nav-link" href="#sec-9">Итоговый совет</a>
<a class="study-nav-link" href="#sec-10">Заметка</a>
<a class="study-nav-link" href="#sec-11">Сравнение с enum: подробнее</a>
<a class="study-nav-link" href="#sec-12">Паттерн: подробнее</a>
<a class="study-nav-link" href="#sec-13">Итоговый совет 2</a>
<a class="study-nav-link" href="#sec-14">Заметка 2</a>
<a class="study-nav-link" href="#sec-15">Итоговый совет 3</a>
<a class="study-nav-link" href="#sec-16">Заметка 3</a>
<a class="study-nav-link" href="#sec-17">Итоговый совет 4</a>
<a class="study-nav-link" href="#sec-18">Заметка 3</a>
<a class="study-nav-link" href="#check">5. Самопроверка</a>
</nav>

<section id="basics" class="study-section">
<h2 class="study-section-title">1. Зачем нужен sealed</h2>
<p>
Sealed-класс позволяет описать закрытый набор подтипов. Компилятор знает все варианты, поэтому может проверить полноту <code>when</code>.
</p>

```kotlin
sealed class Result {
    data class Success(val value: String) : Result()
    data class Error(val message: String) : Result()
    object Loading : Result()
}
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Ограниченная иерархия</strong>
Подтипы известны заранее.
</div>
<div class="study-mini">
<strong class="study-mini-title">Типобезопасность</strong>
Нельзя создать неожиданный подтип вне модуля.
</div>
<div class="study-mini">
<strong class="study-mini-title">Моделирование состояний</strong>
Удобно для UI-состояний, результатов и событий.
</div>
<div class="study-mini">
<strong class="study-mini-title">Исчерпываемость</strong>
<code>when</code> может не требовать <code>else</code>.
</div>
</div>
</section>

<section id="when" class="study-section">
<h2 class="study-section-title">2. Исчерпывающий when</h2>
<p>
Если <code>when</code> покрывает все подтипы sealed-класса, компилятор проверит полноту.
</p>

```kotlin
fun handle(result: Result): String {
    return when (result) {
        is Result.Success -> "Успех: ${'$'}{result.value}"
        is Result.Error -> "Ошибка: ${'$'}{result.message}"
        Result.Loading -> "Загрузка..."
    }
}
```


```kotlin
sealed class Status {
    object New : Status()
    object Done : Status()
}

fun label(status: Status): String {
    return when (status) {
        Status.New -> "Новый"
        Status.Done -> "Готово"
    }
}
```

</section>

<section id="interface" class="study-section">
<h2 class="study-section-title">3. Sealed interface</h2>
<p>
<code>sealed interface</code> позволяет описывать закрытый набор реализаций без ограничений наследования классов.
</p>

```kotlin
sealed interface UiState {
    data class Content(val text: String) : UiState
    object Empty : UiState
    object Loading : UiState
}
```

</section>

<section id="enum" class="study-section">
<h2 class="study-section-title">4. Sealed class и enum</h2>
<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Enum</strong>
Подходит для простых констант с общим набором свойств.
</div>
<div class="study-mini">
<strong class="study-mini-title">Sealed class</strong>
Подходит для подтипов с разными данными и поведением.
</div>
</div>
<div class="study-note">
<strong>Пример:</strong> состояние экрана лучше моделировать через sealed class, потому что у разных состояний разные данные.
</div>
</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Паттерн «ограниченные подтипы»</h2>
<p>Sealed-классы ограничивают набор возможных подтипов. Это удобно для моделирования состояний экрана, результатов операций и событий, когда нужно обработать все варианты в <code>when</code>.</p>

```kotlin
sealed interface ScreenState {
    data object Loading : ScreenState
    data class Content(val items: List<String>) : ScreenState
    data class Error(val message: String) : ScreenState
}

fun render(state: ScreenState): String = when (state) {
    ScreenState.Loading -> "Загрузка..."
    is ScreenState.Content -> "Элементов: ${state.items.size}"
    is ScreenState.Error -> "Ошибка: ${state.message}"
}
```
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>Sealed-классы ограничивают иерархию: все подтипы известны на этапе компиляции. Это позволяет делать исчерпывающий <code>when</code> без <code>else</code>. Используйте sealed для моделирования состояний и результатов операций.</p>

<p>Избегайте слишком больших иерархий: sealed лучше подходит для небольших и стабильных наборов типов. Для динамических наборов используйте обычные классы или интерфейсы.</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Исчерпывающий when</strong>
Компилятор проверяет все ветки.
</div>
<div class="study-mini">
<strong class="study-mini-title">Безопасность</strong>
Новые подтипы не скомпилируются без обновления when.
</div>
<div class="study-mini">
<strong class="study-mini-title">Состояния</strong>
Удобно моделировать Loading, Content, Error.
</div>
<div class="study-mini">
<strong class="study-mini-title">vs enum</strong>
Sealed допускает разные типы данных в подтипах.
</div>
</div>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>Sealed-классы делают код безопаснее и выразительнее. Используйте их для моделирования состояний.</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>Используйте sealed для небольших иерархий и исчерпывающих when.</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>Sealed interface удобен для контрактов без общей реализации.</p>
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Синтаксис sealed class: подробнее</h2>
<p>Sealed-класс объявляют с модификатором <code>sealed</code>. Все подтипы должны быть в том же пакете или вложенными. Это ограничивает набор возможных типов на этапе компиляции.</p>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">sealed interface: подробнее</h2>
<p>Sealed interface позволяет создавать иерархии без общей реализации. Это удобно для контрактов и состояний, где каждый подтип независим.</p>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">when exhaustive: подробнее</h2>
<p>При использовании sealed в <code>when</code> компилятор проверяет, что все подтипы обработаны. Это исключает пропуск вариантов и делает код безопаснее.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>Используйте sealed для моделирования состояний и результатов.</p>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Sealed-классы делают код безопаснее.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Сравнение с enum: подробнее</h2>
<p>Enum подходит для простых констант, sealed — для сложных иерархий с разными данными. Выбирайте по задаче.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">Паттерн: подробнее</h2>
<p>Паттерн «ограниченные подтипы» позволяет моделировать состояния экрана и результаты операций. Это делает код предсказуемым.</p>
</section>

<section id="sec-13" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Используйте sealed для небольших иерархий.</p>
</section>

<section id="sec-14" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>Sealed interface удобен для контрактов.</p>
</section>

<section id="sec-15" class="study-section">
<h2 class="study-section-title">Итоговый совет 3</h2>
<p>Используйте sealed для безопасности.</p>
</section>

<section id="sec-16" class="study-section">
<h2 class="study-section-title">Заметка 3</h2>
<p>Sealed делает код безопаснее.</p>
</section>

<section id="sec-17" class="study-section">
<h2 class="study-section-title">Итоговый совет 4</h2>
<p>Используйте sealed для состояний.</p>
</section>

<section id="sec-18" class="study-section">
<h2 class="study-section-title">Заметка 3</h2>
<p>Sealed делает код безопаснее.</p>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">5. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу объяснить, зачем нужен sealed class.</label>
<label><input type="checkbox" /> Понимаю разницу между sealed class и enum.</label>
<label><input type="checkbox" /> Знаю, что такое исчерпывающий when.</label>
<label><input type="checkbox" /> Могу смоделировать состояние экрана через sealed class.</label>
<label><input type="checkbox" /> Понимаю, когда использовать sealed interface.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Sealed class</th><td><code>sealed class Result</code></td></tr>
<tr><th>Подтип</th><td><code>data class Success(...) : Result()</code></td></tr>
<tr><th>Объект-подтип</th><td><code>object Loading : Result()</code></td></tr>
<tr><th>Проверка типа</th><td><code>is Result.Success</code></td></tr>
<tr><th>Исчерпывающий when</th><td>Все подтипы</td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и sealed classes.
</footer>
