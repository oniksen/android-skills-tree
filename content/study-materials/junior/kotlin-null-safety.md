<header class="study-hero">
<p class="study-eyebrow">Kotlin · Junior</p>
<h1 class="study-title">Null Safety</h1>
<p class="study-lead">
В Kotlin переменная по умолчанию не может хранить <code>null</code>. Это помогает избежать <code>NullPointerException</code>. Если значение может отсутствовать, тип помечают знаком <code>?</code>, а для работы с ним используют безопасные операторы.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#nullable">1. Nullable и non-null типы</a>
<a class="study-nav-link" href="#safe-call">2. Безопасный вызов ?.</a>
<a class="study-nav-link" href="#elvis">3. Оператор Элвиса ?:</a>
<a class="study-nav-link" href="#assertion">4. Оператор !!</a>
<a class="study-nav-link" href="#let">5. let для nullable-значений</a>
<a class="study-nav-link" href="#cast">6. Безопасное приведение типов</a>
<a class="study-nav-link" href="#platform">7. Платформенные типы</a>
<a class="study-nav-link" href="#sec-1">Практика и частые ошибки</a>
<a class="study-nav-link" href="#sec-2">Резюме</a>
<a class="study-nav-link" href="#sec-3">Платформенные типы: подробнее</a>
<a class="study-nav-link" href="#sec-4">Smart cast и проверки</a>
<a class="study-nav-link" href="#sec-5">Рекомендации</a>
<a class="study-nav-link" href="#sec-6">Null в коллекциях</a>
<a class="study-nav-link" href="#sec-7">Итог</a>
<a class="study-nav-link" href="#sec-8">Мини-совет</a>
<a class="study-nav-link" href="#check">8. Самопроверка</a>
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

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>Работа с null — одна из главных причин ошибок в Android-приложениях. Используйте безопасные вызовы и оператор Элвиса, избегайте <code>!!</code> без проверки. На границах с Java-кодом всегда учитывайте, что типы могут быть платформенными.</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Безопасный вызов</strong>
<code>user?.name</code> вернёт null, если user null.
</div>
<div class="study-mini">
<strong class="study-mini-title">Элвис</strong>
<code>user?.name ?: "Гость"</code> подставит значение по умолчанию.
</div>
<div class="study-mini">
<strong class="study-mini-title">Проверка</strong>
Используйте <code>if (value != null)</code> для smart cast.
</div>
<div class="study-mini">
<strong class="study-mini-title">Опасность</strong>
<code>!!</code> может привести к NullPointerException.
</div>
</div>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Резюме</h2>
<p>Null safety в Kotlin помогает избежать NullPointerException. Используйте nullable-типы осознанно и проверяйте значения на границах с Java.</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Платформенные типы: подробнее</h2>
<p>При вызове Java-кода Kotlin не знает, может ли значение быть null. Такие типы называют платформенными и обозначают как <code>T!</code>. Их нужно проверять явно или приводить к nullable/non-null типу при передаче в Kotlin-код.</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Smart cast и проверки</h2>
<p>После проверки на null компилятор автоматически приводит тип к non-null. Это позволяет обращаться к свойствам без безопасного вызова внутри блока.</p>

```kotlin
fun printLength(text: String?) {
    if (text != null) {
        println(text.length) // smart cast к String
    }
}
```
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>Используйте <code>let</code> для цепочек вызовов, <code>also</code> для побочных действий и избегайте <code>!!</code>. На границах с Java проверяйте null явно.</p>
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Null в коллекциях</h2>
<p>Коллекции могут содержать nullable-элементы. Используйте <code>filterNotNull()</code> для удаления null и <code>mapNotNull()</code> для преобразования с пропуском null.</p>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>Null safety — одна из сильных сторон Kotlin. Используйте nullable-типы осознанно, проверяйте границы с Java и избегайте <code>!!</code> без необходимости.</p>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>При работе с Java-библиотеками всегда проверяйте, может ли значение быть null, и преобразуйте платформенные типы явно.</p>
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
