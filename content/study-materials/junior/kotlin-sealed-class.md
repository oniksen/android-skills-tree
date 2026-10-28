<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Sealed Class</h1>
<p class="study-lead">
<code>sealed class</code> и <code>sealed interface</code> ограничивают иерархию наследования. Все прямые подтипы известны на этапе компиляции. Это удобно для моделирования состояний и исчерпывающего <code>when</code>.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#basics">Основы</a>
<a class="study-nav-link" href="#when">when</a>
<a class="study-nav-link" href="#interface">Sealed interface</a>
<a class="study-nav-link" href="#enum">Сравнение с enum</a>
<a class="study-nav-link" href="#check">Проверка</a>
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

<section class="study-section">
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
