<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Null Safety</h1>
<p class="study-lead">
В Kotlin переменная по умолчанию не может хранить <code>null</code>. Это помогает избежать <code>NullPointerException</code>. Если значение может отсутствовать, тип помечают знаком <code>?</code>, а для работы с ним используют безопасные операторы.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#nullable">Nullable-типы</a>
<a class="study-nav-link" href="#safe-call">Безопасный вызов</a>
<a class="study-nav-link" href="#elvis">Оператор Элвиса</a>
<a class="study-nav-link" href="#assertion">!!</a>
<a class="study-nav-link" href="#let">let</a>
<a class="study-nav-link" href="#cast">Безопасное приведение</a>
<a class="study-nav-link" href="#check">Проверка</a>
</nav>

<section id="nullable" class="study-section">
<h2 class="study-section-title">1. Nullable и non-null типы</h2>
<p>
<code>String</code> не может быть null. <code>String?</code> может быть null. Это различие проверяется компилятором.
</p>

```kotlin
val name: String = "Kotlin"
val nickname: String? = null
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>String</code></strong>
Значение обязано существовать.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>String?</code></strong>
Значение может быть null.
</div>
</div>
</section>

<section id="safe-call" class="study-section">
<h2 class="study-section-title">2. Безопасный вызов ?.</h2>
<p>
Если объект может быть null, используй <code>?.</code>. Если объект null, результат тоже будет null, но приложение не упадёт.
</p>

```kotlin
val length = nickname?.length
val upper = nickname?.uppercase()
```

<div class="study-note">
<strong>Запомнить:</strong> <code>?.</code> удобен для цепочек вызовов: <code>user?.address?.city</code>.
</div>
</section>

<section id="elvis" class="study-section">
<h2 class="study-section-title">3. Оператор Элвиса ?:</h2>
<p>
Оператор <code>?:</code> подставляет значение по умолчанию, если левая часть равна null.
</p>

```kotlin
val displayName = nickname ?: "Гость"
val length = nickname?.length ?: 0
```

</section>

<section id="assertion" class="study-section">
<h2 class="study-section-title">4. Оператор !!</h2>
<p>
<code>!!</code> утверждает, что значение не null. Если это не так, будет выброшено исключение.
</p>

```kotlin
val forcedLength = nickname!!.length // опасно
```

<div class="study-note study-warn">
<strong>Осторожно:</strong> используй <code>!!</code> только тогда, когда уверен в значении. В обычном коде лучше использовать <code>?:</code>, <code>?.let</code> или явную проверку.
</div>
</section>

<section id="let" class="study-section">
<h2 class="study-section-title">5. let для nullable-значений</h2>
<p>
<code>let</code> позволяет выполнить блок только тогда, когда значение не null.
</p>

```kotlin
nickname?.let { value ->
    println("Ник: $value")
}
```

</section>

<section id="cast" class="study-section">
<h2 class="study-section-title">6. Безопасное приведение типов</h2>
<p>
<code>as?</code> пытается привести значение к типу. Если приведение невозможно, результат будет null, а не исключение.
</p>

```kotlin
val value: Any = "Kotlin"
val text = value as? String
val number = value as? Int
```

</section>

<section id="platform" class="study-section">
<h2 class="study-section-title">7. Платформенные типы</h2>
<p>
При вызове Java-кода Kotlin может не знать, может ли значение быть null. Такой тип называют платформенным и обозначают <code>String!</code>.
</p>

```kotlin
// Java-метод может вернуть тип платформы
val javaName = javaObject.name // String!
```

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> считать платформенный тип безопасным. Если Java-метод может вернуть null, лучше явно обработать его через <code>?:</code> или проверку.
</div>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">8. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу объяснить разницу между <code>String</code> и <code>String?</code>.</label>
<label><input type="checkbox" /> Понимаю, как работает <code>?.</code>.</label>
<label><input type="checkbox" /> Знаю, зачем нужен оператор <code>?:</code>.</label>
<label><input type="checkbox" /> Понимаю риск использования <code>!!</code>.</label>
<label><input type="checkbox" /> Знаю, что такое платформенный тип.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Nullable-тип</th><td><code>val x: String? = null</code></td></tr>
<tr><th>Безопасный вызов</th><td><code>x?.length</code></td></tr>
<tr><th>Значение по умолчанию</th><td><code>x ?: &quot;default&quot;</code></td></tr>
<tr><th>Опасное утверждение</th><td><code>x!!</code></td></tr>
<tr><th>Безопасное приведение</th><td><code>x as? String</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Kotlin и null safety.
</footer>
