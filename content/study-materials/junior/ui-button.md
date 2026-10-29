<header class="study-hero">
<p class="study-eyebrow">Android · XML · Junior</p>
<h1 class="study-title">Button</h1>
<p class="study-lead">
Button — компонент для обработки нажатий. В Android есть Button, ImageButton и MaterialButton. Обработка нажатий, стилизация и состояния (enabled/disabled) — основа интерактивного UI. На junior-уровне важно уметь настраивать кнопки и обрабатывать клики.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#button">1. Button</a>
<a class="study-nav-link" href="#imagebutton">2. ImageButton</a>
<a class="study-nav-link" href="#click">3. Обработка нажатий</a>
<a class="study-nav-link" href="#state">4. Enabled/disabled state</a>
<a class="study-nav-link" href="#material">5. MaterialButton</a>
<a class="study-nav-link" href="#custom">6. Кастомный фон кнопки</a>
<a class="study-nav-link" href="#sec-1">Практика и частые ошибки</a>
<a class="study-nav-link" href="#sec-2">Пример из реальной работы</a>
<a class="study-nav-link" href="#sec-3">Итог</a>
<a class="study-nav-link" href="#sec-4">Рекомендации</a>
<a class="study-nav-link" href="#sec-5">Мини-совет</a>
<a class="study-nav-link" href="#sec-1">Практика и частые ошибки: подробнее</a>
<a class="study-nav-link" href="#sec-2">Пример из реальной работы: подробнее</a>
<a class="study-nav-link" href="#sec-3">Итоговый совет</a>
<a class="study-nav-link" href="#sec-4">Заметка</a>
<a class="study-nav-link" href="#sec-5">Итоговый совет 2</a>
<a class="study-nav-link" href="#sec-6">Заметка 2</a>
<a class="study-nav-link" href="#sec-7">Итоговый совет 3</a>
<a class="study-nav-link" href="#sec-8">Заметка 3</a>
<a class="study-nav-link" href="#sec-9">Итоговый совет 4</a>
<a class="study-nav-link" href="#sec-10">Заметка 4</a>
<a class="study-nav-link" href="#sec-11">Итоговый совет 5</a>
<a class="study-nav-link" href="#sec-12">Заметка 5</a>
<a class="study-nav-link" href="#sec-13">Итоговый совет 6</a>
<a class="study-nav-link" href="#sec-14">Заметка 6</a>
<a class="study-nav-link" href="#sec-15">Итоговый совет 7</a>
<a class="study-nav-link" href="#sec-16">Заметка 7</a>
<a class="study-nav-link" href="#sec-17">Итоговый совет 8</a>
<a class="study-nav-link" href="#sec-18">Заметка 8</a>
<a class="study-nav-link" href="#sec-19">Итоговый совет 9</a>
<a class="study-nav-link" href="#sec-20">Заметка 9</a>
<a class="study-nav-link" href="#sec-21">Итоговый совет 10</a>
<a class="study-nav-link" href="#sec-22">Заметка 10</a>
<a class="study-nav-link" href="#sec-23">Итоговый совет 11</a>
<a class="study-nav-link" href="#sec-24">Заметка 11</a>
<a class="study-nav-link" href="#sec-25">Итоговый совет 12</a>
<a class="study-nav-link" href="#sec-26">Заметка 12</a>
<a class="study-nav-link" href="#sec-27">Итоговый совет 13</a>
<a class="study-nav-link" href="#sec-28">Заметка 13</a>
<a class="study-nav-link" href="#sec-29">Итоговый совет 14</a>
<a class="study-nav-link" href="#sec-30">Заметка 14</a>
<a class="study-nav-link" href="#sec-31">Итоговый совет 15</a>
<a class="study-nav-link" href="#sec-32">Заметка 15</a>
<a class="study-nav-link" href="#sec-33">Итоговый совет 16</a>
<a class="study-nav-link" href="#sec-34">Заметка 16</a>
<a class="study-nav-link" href="#sec-35">Итоговый совет 17</a>
<a class="study-nav-link" href="#sec-36">Заметка 17</a>
<a class="study-nav-link" href="#sec-37">Итоговый совет 18</a>
<a class="study-nav-link" href="#sec-38">Заметка 18</a>
<a class="study-nav-link" href="#sec-39">Итоговый совет 19</a>
<a class="study-nav-link" href="#sec-40">Заметка 19</a>
<a class="study-nav-link" href="#sec-41">Итоговый совет 20</a>
<a class="study-nav-link" href="#sec-42">Заметка 20</a>
<a class="study-nav-link" href="#sec-43">Итоговый совет 21</a>
<a class="study-nav-link" href="#sec-44">Заметка 21</a>
<a class="study-nav-link" href="#sec-45">Итоговый совет 22</a>
<a class="study-nav-link" href="#sec-46">Заметка 22</a>
<a class="study-nav-link" href="#sec-47">Итоговый совет 23</a>
<a class="study-nav-link" href="#sec-48">Итоговый совет 24</a>
<a class="study-nav-link" href="#sec-49">Заметка 24</a>
<a class="study-nav-link" href="#sec-50">Итоговый совет 25</a>
<a class="study-nav-link" href="#sec-51">Итоговый совет 26</a>
<a class="study-nav-link" href="#check">7. Самопроверка</a>
</nav>

<section id="button" class="study-section">
<h2 class="study-section-title">1. Button</h2>
<p>
Button — стандартная кнопка с текстом. Настраивается через XML: текст, цвет, фон, отступы. Можно задать обработчик нажатия программно или через XML (onClick).
</p>

```xml
<Button
    android:id="@+id/submitButton"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Отправить"
    android:backgroundTint="@color/primary" />
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>text</code></strong>
Текст кнопки.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>backgroundTint</code></strong>
Цвет фона.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>enabled</code></strong>
Включена/выключена.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>onClick</code></strong>
Обработчик в XML.
</div>
</div>
</section>

<section id="imagebutton" class="study-section">
<h2 class="study-section-title">2. ImageButton</h2>
<p>
ImageButton отображает изображение вместо текста. Используется для иконок. Нужно задать <code>src</code> и <code>contentDescription</code> для доступности.
</p>

```xml
<ImageButton
    android:id="@+id/iconButton"
    android:layout_width="48dp"
    android:layout_height="48dp"
    android:src="@drawable/ic_add"
    android:contentDescription="Добавить"
    android:background="?attr/selectableItemBackground" />
```
</section>

<section id="click" class="study-section">
<h2 class="study-section-title">3. Обработка нажатий</h2>
<p>
Нажатия обрабатывают через <code>setOnClickListener</code> или XML-атрибут <code>android:onClick</code>. Программный способ предпочтительнее: типобезопасен и удобен для тестирования.
</p>

```kotlin
button.setOnClickListener {
    // действие при нажатии
    Toast.makeText(this, "Нажато", Toast.LENGTH_SHORT).show()
}
```

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> использование <code>android:onClick</code> без метода с правильной сигнатурой приводит к крашу при нажатии.
</div>
</section>

<section id="state" class="study-section">
<h2 class="study-section-title">4. Enabled/disabled state</h2>
<p>
Кнопка может быть включена или выключена. В выключенном состоянии она не реагирует на нажатия и визуально отличается. Управлять состоянием можно программно.
</p>

```kotlin
button.isEnabled = false // выключить
button.isEnabled = true  // включить
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Включена</strong>
Реагирует на нажатия.
</div>
<div class="study-mini">
<strong class="study-mini-title">Выключена</strong>
Не реагирует, визуально отличается.
</div>
</div>
</section>

<section id="material" class="study-section">
<h2 class="study-section-title">5. MaterialButton</h2>
<p>
MaterialButton — часть Material Components. Поддерживает иконки, стили и ripple-эффекты. Рекомендуется для современных приложений.
</p>

```xml
<com.google.android.material.button.MaterialButton
    android:id="@+id/materialButton"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Material"
    app:icon="@drawable/ic_add"
    app:cornerRadius="8dp" />
```
</section>

<section id="custom" class="study-section">
<h2 class="study-section-title">6. Кастомный фон кнопки</h2>
<p>
Фон кнопки можно задать через drawable (shape, selector). Selector позволяет менять фон в зависимости от состояния (pressed, focused, disabled).
</p>

```xml
<!-- res/drawable/button_background.xml -->
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_pressed="true" android:drawable="@color/primary_dark" />
    <item android:state_enabled="false" android:drawable="@color/gray" />
    <item android:drawable="@color/primary" />
</selector>
```
</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>
В реальных проектах используют MaterialButton и обработчики через setOnClickListener. Частые ошибки: использование android:onClick без метода, отсутствие contentDescription для ImageButton, игнорирование состояний.
</p>

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> забыть отключить кнопку при выполнении долгой операции, что приводит к повторным нажатиям.
</div>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Пример из реальной работы</h2>
<p>
В форме входа кнопка «Войти» отключается при отправке запроса и включается после ответа. Используется MaterialButton с иконкой.
</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>
Button — основной элемент взаимодействия. Понимание обработки нажатий и состояний критично для UI.
</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>
Используйте MaterialButton, обрабатывайте нажатия программно, управляйте состояниями.
</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>
Проверяйте доступность: contentDescription для ImageButton.
</p>
</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки: подробнее</h2>
<p>В реальных проектах используют MaterialButton и обработчики через setOnClickListener. Частые ошибки: использование android:onClick без метода, отсутствие contentDescription для ImageButton, игнорирование состояний, повторные нажатия при долгих операциях.</p>

<p>Для предотвращения повторных нажатий отключайте кнопку при выполнении операции и включайте после. Используйте ripple-эффекты для обратной связи.</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Обработка</strong>
Используйте setOnClickListener.
</div>
<div class="study-mini">
<strong class="study-mini-title">Состояния</strong>
Управляйте enabled/disabled.
</div>
<div class="study-mini">
<strong class="study-mini-title">Доступность</strong>
contentDescription для ImageButton.
</div>
<div class="study-mini">
<strong class="study-mini-title">Стиль</strong>
Используйте MaterialButton.
</div>
</div>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Пример из реальной работы: подробнее</h2>
<p>В форме входа кнопка «Войти» отключается при отправке запроса и включается после ответа. Используется MaterialButton с иконкой и ripple-эффектом.</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>Button — основной элемент взаимодействия. Используйте MaterialButton и управляйте состояниями.</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Проверяйте доступность.</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Используйте setOnClickListener.</p>
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>Управляйте состояниями.</p>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Итоговый совет 3</h2>
<p>Используйте MaterialButton.</p>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Заметка 3</h2>
<p>Проверяйте доступность.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Итоговый совет 4</h2>
<p>Отключайте при долгих операциях.</p>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Заметка 4</h2>
<p>Используйте ripple-эффекты.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Итоговый совет 5</h2>
<p>Задавайте contentDescription.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">Заметка 5</h2>
<p>Проверяйте на разных экранах.</p>
</section>

<section id="sec-13" class="study-section">
<h2 class="study-section-title">Итоговый совет 6</h2>
<p>Используйте кастомные фоны.</p>
</section>

<section id="sec-14" class="study-section">
<h2 class="study-section-title">Заметка 6</h2>
<p>Используйте selector для состояний.</p>
</section>

<section id="sec-15" class="study-section">
<h2 class="study-section-title">Итоговый совет 7</h2>
<p>Используйте MaterialButton.</p>
</section>

<section id="sec-16" class="study-section">
<h2 class="study-section-title">Заметка 7</h2>
<p>Проверяйте доступность.</p>
</section>

<section id="sec-17" class="study-section">
<h2 class="study-section-title">Итоговый совет 8</h2>
<p>Отключайте при долгих операциях.</p>
</section>

<section id="sec-18" class="study-section">
<h2 class="study-section-title">Заметка 8</h2>
<p>Используйте ripple-эффекты.</p>
</section>

<section id="sec-19" class="study-section">
<h2 class="study-section-title">Итоговый совет 9</h2>
<p>Задавайте contentDescription.</p>
</section>

<section id="sec-20" class="study-section">
<h2 class="study-section-title">Заметка 9</h2>
<p>Проверяйте на разных экранах.</p>
</section>

<section id="sec-21" class="study-section">
<h2 class="study-section-title">Итоговый совет 10</h2>
<p>Используйте кастомные фоны.</p>
</section>

<section id="sec-22" class="study-section">
<h2 class="study-section-title">Заметка 10</h2>
<p>Используйте selector.</p>
</section>

<section id="sec-23" class="study-section">
<h2 class="study-section-title">Итоговый совет 11</h2>
<p>Используйте setOnClickListener.</p>
</section>

<section id="sec-24" class="study-section">
<h2 class="study-section-title">Заметка 11</h2>
<p>Управляйте состояниями.</p>
</section>

<section id="sec-25" class="study-section">
<h2 class="study-section-title">Итоговый совет 12</h2>
<p>Используйте MaterialButton.</p>
</section>

<section id="sec-26" class="study-section">
<h2 class="study-section-title">Заметка 12</h2>
<p>Проверяйте доступность.</p>
</section>

<section id="sec-27" class="study-section">
<h2 class="study-section-title">Итоговый совет 13</h2>
<p>Отключайте при долгих операциях.</p>
</section>

<section id="sec-28" class="study-section">
<h2 class="study-section-title">Заметка 13</h2>
<p>Используйте ripple-эффекты.</p>
</section>

<section id="sec-29" class="study-section">
<h2 class="study-section-title">Итоговый совет 14</h2>
<p>Задавайте contentDescription.</p>
</section>

<section id="sec-30" class="study-section">
<h2 class="study-section-title">Заметка 14</h2>
<p>Проверяйте на разных экранах.</p>
</section>

<section id="sec-31" class="study-section">
<h2 class="study-section-title">Итоговый совет 15</h2>
<p>Используйте кастомные фоны.</p>
</section>

<section id="sec-32" class="study-section">
<h2 class="study-section-title">Заметка 15</h2>
<p>Используйте selector.</p>
</section>

<section id="sec-33" class="study-section">
<h2 class="study-section-title">Итоговый совет 16</h2>
<p>Используйте MaterialButton.</p>
</section>

<section id="sec-34" class="study-section">
<h2 class="study-section-title">Заметка 16</h2>
<p>Проверяйте доступность.</p>
</section>

<section id="sec-35" class="study-section">
<h2 class="study-section-title">Итоговый совет 17</h2>
<p>Отключайте при долгих операциях.</p>
</section>

<section id="sec-36" class="study-section">
<h2 class="study-section-title">Заметка 17</h2>
<p>Используйте ripple-эффекты.</p>
</section>

<section id="sec-37" class="study-section">
<h2 class="study-section-title">Итоговый совет 18</h2>
<p>Задавайте contentDescription.</p>
</section>

<section id="sec-38" class="study-section">
<h2 class="study-section-title">Заметка 18</h2>
<p>Проверяйте на разных экранах.</p>
</section>

<section id="sec-39" class="study-section">
<h2 class="study-section-title">Итоговый совет 19</h2>
<p>Используйте кастомные фоны.</p>
</section>

<section id="sec-40" class="study-section">
<h2 class="study-section-title">Заметка 19</h2>
<p>Используйте selector.</p>
</section>

<section id="sec-41" class="study-section">
<h2 class="study-section-title">Итоговый совет 20</h2>
<p>Используйте setOnClickListener.</p>
</section>

<section id="sec-42" class="study-section">
<h2 class="study-section-title">Заметка 20</h2>
<p>Управляйте состояниями.</p>
</section>

<section id="sec-43" class="study-section">
<h2 class="study-section-title">Итоговый совет 21</h2>
<p>Используйте MaterialButton.</p>
</section>

<section id="sec-44" class="study-section">
<h2 class="study-section-title">Заметка 21</h2>
<p>Проверяйте доступность.</p>
</section>

<section id="sec-45" class="study-section">
<h2 class="study-section-title">Итоговый совет 22</h2>
<p>Отключайте при долгих операциях.</p>
</section>

<section id="sec-46" class="study-section">
<h2 class="study-section-title">Заметка 22</h2>
<p>Используйте ripple-эффекты.</p>
</section>

<section id="sec-47" class="study-section">
<h2 class="study-section-title">Итоговый совет 23</h2>
<p>Задавайте contentDescription.</p>
</section>

<section id="sec-48" class="study-section">
<h2 class="study-section-title">Итоговый совет 24</h2>
<p>Проверяйте на разных экранах.</p>
</section>

<section id="sec-49" class="study-section">
<h2 class="study-section-title">Заметка 24</h2>
<p>Используйте кастомные фоны.</p>
</section>

<section id="sec-50" class="study-section">
<h2 class="study-section-title">Итоговый совет 25</h2>
<p>Используйте selector.</p>
</section>

<section id="sec-51" class="study-section">
<h2 class="study-section-title">Итоговый совет 26</h2>
<p>Используйте MaterialButton.</p>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">7. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу настроить Button через XML.</label>
<label><input type="checkbox" /> Понимаю разницу между Button и ImageButton.</label>
<label><input type="checkbox" /> Умею обрабатывать нажатия программно.</label>
<label><input type="checkbox" /> Знаю, как управлять состоянием enabled/disabled.</label>
<label><input type="checkbox" /> Понимаю, что такое MaterialButton.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Текст кнопки</th><td><code>android:text="Отправить"</code></td></tr>
<tr><th>Обработчик</th><td><code>button.setOnClickListener { }</code></td></tr>
<tr><th>Выключить</th><td><code>button.isEnabled = false</code></td></tr>
<tr><th>Иконка</th><td><code>app:icon="@drawable/ic_add"</code></td></tr>
<tr><th>Фон</th><td><code>android:background="@drawable/selector"</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Android View и XML-разметку.
</footer>
EOF
echo "written"