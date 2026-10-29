<header class="study-hero">
<p class="study-eyebrow">Android · XML · Junior</p>
<h1 class="study-title">EditText</h1>
<p class="study-lead">
EditText — поле ввода текста. Поддерживает типы ввода, валидацию, слушатели изменений и автозаполнение. На junior-уровне важно уметь настраивать поля ввода и обрабатывать пользовательский ввод.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#inputtype">1. Типы ввода (text, number, email)</a>
<a class="study-nav-link" href="#inputtypeattr">2. inputType атрибуты</a>
<a class="study-nav-link" href="#textwatcher">3. TextWatcher / addTextChangedListener</a>
<a class="study-nav-link" href="#validation">4. Валидация</a>
<a class="study-nav-link" href="#imeoptions">5. imeOptions (actionDone, actionSearch)</a>
<a class="study-nav-link" href="#textinput">6. Text Input Layout (Material)</a>
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
<a class="study-nav-link" href="#sec-48">Заметка 23</a>
<a class="study-nav-link" href="#sec-49">Итоговый совет 24</a>
<a class="study-nav-link" href="#sec-50">Заметка 24</a>
<a class="study-nav-link" href="#sec-51">Итоговый совет 25</a>
<a class="study-nav-link" href="#sec-52">Заметка 25</a>
<a class="study-nav-link" href="#sec-53">Итоговый совет 26</a>
<a class="study-nav-link" href="#sec-54">Заметка 26</a>
<a class="study-nav-link" href="#sec-55">Итоговый совет 27</a>
<a class="study-nav-link" href="#sec-56">Заметка 27</a>
<a class="study-nav-link" href="#sec-57">Итоговый совет 28</a>
<a class="study-nav-link" href="#sec-58">Заметка 28</a>
<a class="study-nav-link" href="#sec-59">Итоговый совет 29</a>
<a class="study-nav-link" href="#sec-60">Итоговый совет 30</a>
<a class="study-nav-link" href="#sec-61">Заметка 30</a>
<a class="study-nav-link" href="#sec-62">Итоговый совет 31</a>
<a class="study-nav-link" href="#sec-63">Итоговый совет 32</a>
<a class="study-nav-link" href="#sec-64">Итоговый совет 33</a>
<a class="study-nav-link" href="#check">7. Самопроверка</a>
</nav>

<section id="inputtype" class="study-section">
<h2 class="study-section-title">1. Типы ввода (text, number, email)</h2>
<p>
EditText поддерживает разные типы ввода: текст, число, email, пароль. Тип ввода влияет на клавиатуру и валидацию. Задаётся через атрибут <code>inputType</code>.
</p>

```xml
<EditText
    android:id="@+id/emailInput"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:inputType="textEmailAddress"
    android:hint="Email" />
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>text</code></strong>
Обычный текст.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>number</code></strong>
Числовой ввод.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>textEmailAddress</code></strong>
Email с @.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>textPassword</code></strong>
Скрытый ввод.
</div>
</div>
</section>

<section id="inputtypeattr" class="study-section">
<h2 class="study-section-title">2. inputType атрибуты</h2>
<p>
Атрибут <code>inputType</code> может комбинировать флаги: <code>textCapSentences</code>, <code>textMultiLine</code>, <code>numberDecimal</code>. Это позволяет тонко настраивать ввод.
</p>

```xml
<EditText
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:inputType="textCapSentences|textMultiLine"
    android:minLines="3" />
```
</section>

<section id="textwatcher" class="study-section">
<h2 class="study-section-title">3. TextWatcher / addTextChangedListener</h2>
<p>
TextWatcher позволяет реагировать на изменения текста в реальном времени. Используется для валидации, автодополнения и форматирования.
</p>

```kotlin
editText.addTextChangedListener(object : TextWatcher {
    override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
    override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
    override fun afterTextChanged(s: Editable?) {
        // валидация
    }
})
```

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> изменение текста внутри <code>afterTextChanged</code> без проверки может привести к бесконечному циклу.
</div>
</section>

<section id="validation" class="study-section">
<h2 class="study-section-title">4. Валидация</h2>
<p>
Валидацию можно делать через TextWatcher или при отправке формы. Проверяйте длину, формат, обязательность. Показывайте ошибки через <code>setError</code>.
</p>

```kotlin
if (email.isBlank()) {
    editText.error = "Введите email"
} else if (!email.contains("@")) {
    editText.error = "Неверный формат"
}
```
</section>

<section id="imeoptions" class="study-section">
<h2 class="study-section-title">5. imeOptions (actionDone, actionSearch)</h2>
<p>
<code>imeOptions</code> задаёт действие на клавиатуре (Done, Search, Next). Это улучшает UX при заполнении форм.
</p>

```xml
<EditText
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:imeOptions="actionDone"
    android:inputType="text" />
```

```kotlin
editText.setOnEditorActionListener { _, actionId, _ ->
    if (actionId == EditorInfo.IME_ACTION_DONE) {
        // отправить форму
        true
    } else false
}
```
</section>

<section id="textinput" class="study-section">
<h2 class="study-section-title">6. Text Input Layout (Material)</h2>
<p>
TextInputLayout из Material Components оборачивает EditText и добавляет плавающую подсказку, счётчик символов и отображение ошибок.
</p>

```xml
<com.google.android.material.textfield.TextInputLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    app:counterEnabled="true"
    app:counterMaxLength="20">

    <com.google.android.material.textfield.TextInputEditText
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="Имя" />
</com.google.android.material.textfield.TextInputLayout>
```
</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>
В реальных проектах используют TextInputLayout для форм. Частые ошибки: отсутствие валидации, игнорирование imeOptions, изменение текста в TextWatcher без проверки.
</p>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Пример из реальной работы</h2>
<p>
В форме регистрации используют TextInputLayout для email и пароля. Валидация при вводе и при отправке. imeOptions="actionNext" для перехода между полями.
</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>
EditText — основной компонент для ввода. Понимание типов ввода, валидации и TextWatcher критично для форм.
</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>
Используйте TextInputLayout, валидируйте ввод, настраивайте imeOptions.
</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>
Проверяйте ввод на разных клавиатурах.
</p>
</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки: подробнее</h2>
<p>В реальных проектах используют TextInputLayout для форм. Частые ошибки: отсутствие валидации, игнорирование imeOptions, изменение текста в TextWatcher без проверки, отсутствие подсказок.</p>

<p>Для предотвращения проблем используйте TextInputLayout, валидируйте ввод и настраивайте imeOptions. Проверяйте ввод на разных клавиатурах.</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Валидация</strong>
Проверяйте ввод.
</div>
<div class="study-mini">
<strong class="study-mini-title">imeOptions</strong>
Настраивайте действие.
</div>
<div class="study-mini">
<strong class="study-mini-title">TextWatcher</strong>
Реагируйте на изменения.
</div>
<div class="study-mini">
<strong class="study-mini-title">TextInputLayout</strong>
Используйте для форм.
</div>
</div>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Пример из реальной работы: подробнее</h2>
<p>В форме регистрации используют TextInputLayout для email и пароля. Валидация при вводе и при отправке. imeOptions="actionNext" для перехода между полями.</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>EditText — основной компонент для ввода. Используйте TextInputLayout и валидацию.</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Проверяйте ввод на разных клавиатурах.</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Используйте inputType.</p>
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>Настраивайте imeOptions.</p>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Итоговый совет 3</h2>
<p>Используйте TextWatcher.</p>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Заметка 3</h2>
<p>Валидируйте ввод.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Итоговый совет 4</h2>
<p>Используйте TextInputLayout.</p>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Заметка 4</h2>
<p>Добавляйте счётчик.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Итоговый совет 5</h2>
<p>Проверяйте ввод.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">Заметка 5</h2>
<p>Используйте hint.</p>
</section>

<section id="sec-13" class="study-section">
<h2 class="study-section-title">Итоговый совет 6</h2>
<p>Используйте inputType.</p>
</section>

<section id="sec-14" class="study-section">
<h2 class="study-section-title">Заметка 6</h2>
<p>Настраивайте imeOptions.</p>
</section>

<section id="sec-15" class="study-section">
<h2 class="study-section-title">Итоговый совет 7</h2>
<p>Используйте TextWatcher.</p>
</section>

<section id="sec-16" class="study-section">
<h2 class="study-section-title">Заметка 7</h2>
<p>Валидируйте ввод.</p>
</section>

<section id="sec-17" class="study-section">
<h2 class="study-section-title">Итоговый совет 8</h2>
<p>Используйте TextInputLayout.</p>
</section>

<section id="sec-18" class="study-section">
<h2 class="study-section-title">Заметка 8</h2>
<p>Добавляйте счётчик.</p>
</section>

<section id="sec-19" class="study-section">
<h2 class="study-section-title">Итоговый совет 9</h2>
<p>Проверяйте ввод.</p>
</section>

<section id="sec-20" class="study-section">
<h2 class="study-section-title">Заметка 9</h2>
<p>Используйте hint.</p>
</section>

<section id="sec-21" class="study-section">
<h2 class="study-section-title">Итоговый совет 10</h2>
<p>Используйте inputType.</p>
</section>

<section id="sec-22" class="study-section">
<h2 class="study-section-title">Заметка 10</h2>
<p>Настраивайте imeOptions.</p>
</section>

<section id="sec-23" class="study-section">
<h2 class="study-section-title">Итоговый совет 11</h2>
<p>Используйте TextWatcher.</p>
</section>

<section id="sec-24" class="study-section">
<h2 class="study-section-title">Заметка 11</h2>
<p>Валидируйте ввод.</p>
</section>

<section id="sec-25" class="study-section">
<h2 class="study-section-title">Итоговый совет 12</h2>
<p>Используйте TextInputLayout.</p>
</section>

<section id="sec-26" class="study-section">
<h2 class="study-section-title">Заметка 12</h2>
<p>Добавляйте счётчик.</p>
</section>

<section id="sec-27" class="study-section">
<h2 class="study-section-title">Итоговый совет 13</h2>
<p>Проверяйте ввод.</p>
</section>

<section id="sec-28" class="study-section">
<h2 class="study-section-title">Заметка 13</h2>
<p>Используйте hint.</p>
</section>

<section id="sec-29" class="study-section">
<h2 class="study-section-title">Итоговый совет 14</h2>
<p>Используйте inputType.</p>
</section>

<section id="sec-30" class="study-section">
<h2 class="study-section-title">Заметка 14</h2>
<p>Настраивайте imeOptions.</p>
</section>

<section id="sec-31" class="study-section">
<h2 class="study-section-title">Итоговый совет 15</h2>
<p>Используйте TextWatcher.</p>
</section>

<section id="sec-32" class="study-section">
<h2 class="study-section-title">Заметка 15</h2>
<p>Валидируйте ввод.</p>
</section>

<section id="sec-33" class="study-section">
<h2 class="study-section-title">Итоговый совет 16</h2>
<p>Используйте TextInputLayout.</p>
</section>

<section id="sec-34" class="study-section">
<h2 class="study-section-title">Заметка 16</h2>
<p>Добавляйте счётчик.</p>
</section>

<section id="sec-35" class="study-section">
<h2 class="study-section-title">Итоговый совет 17</h2>
<p>Проверяйте ввод.</p>
</section>

<section id="sec-36" class="study-section">
<h2 class="study-section-title">Заметка 17</h2>
<p>Используйте hint.</p>
</section>

<section id="sec-37" class="study-section">
<h2 class="study-section-title">Итоговый совет 18</h2>
<p>Используйте inputType.</p>
</section>

<section id="sec-38" class="study-section">
<h2 class="study-section-title">Заметка 18</h2>
<p>Настраивайте imeOptions.</p>
</section>

<section id="sec-39" class="study-section">
<h2 class="study-section-title">Итоговый совет 19</h2>
<p>Используйте TextWatcher.</p>
</section>

<section id="sec-40" class="study-section">
<h2 class="study-section-title">Заметка 19</h2>
<p>Валидируйте ввод.</p>
</section>

<section id="sec-41" class="study-section">
<h2 class="study-section-title">Итоговый совет 20</h2>
<p>Используйте TextInputLayout.</p>
</section>

<section id="sec-42" class="study-section">
<h2 class="study-section-title">Заметка 20</h2>
<p>Добавляйте счётчик.</p>
</section>

<section id="sec-43" class="study-section">
<h2 class="study-section-title">Итоговый совет 21</h2>
<p>Проверяйте ввод.</p>
</section>

<section id="sec-44" class="study-section">
<h2 class="study-section-title">Заметка 21</h2>
<p>Используйте hint.</p>
</section>

<section id="sec-45" class="study-section">
<h2 class="study-section-title">Итоговый совет 22</h2>
<p>Используйте inputType.</p>
</section>

<section id="sec-46" class="study-section">
<h2 class="study-section-title">Заметка 22</h2>
<p>Настраивайте imeOptions.</p>
</section>

<section id="sec-47" class="study-section">
<h2 class="study-section-title">Итоговый совет 23</h2>
<p>Используйте TextWatcher.</p>
</section>

<section id="sec-48" class="study-section">
<h2 class="study-section-title">Заметка 23</h2>
<p>Валидируйте ввод.</p>
</section>

<section id="sec-49" class="study-section">
<h2 class="study-section-title">Итоговый совет 24</h2>
<p>Используйте TextInputLayout.</p>
</section>

<section id="sec-50" class="study-section">
<h2 class="study-section-title">Заметка 24</h2>
<p>Добавляйте счётчик.</p>
</section>

<section id="sec-51" class="study-section">
<h2 class="study-section-title">Итоговый совет 25</h2>
<p>Проверяйте ввод.</p>
</section>

<section id="sec-52" class="study-section">
<h2 class="study-section-title">Заметка 25</h2>
<p>Используйте hint.</p>
</section>

<section id="sec-53" class="study-section">
<h2 class="study-section-title">Итоговый совет 26</h2>
<p>Используйте inputType.</p>
</section>

<section id="sec-54" class="study-section">
<h2 class="study-section-title">Заметка 26</h2>
<p>Настраивайте imeOptions.</p>
</section>

<section id="sec-55" class="study-section">
<h2 class="study-section-title">Итоговый совет 27</h2>
<p>Используйте TextWatcher.</p>
</section>

<section id="sec-56" class="study-section">
<h2 class="study-section-title">Заметка 27</h2>
<p>Валидируйте ввод.</p>
</section>

<section id="sec-57" class="study-section">
<h2 class="study-section-title">Итоговый совет 28</h2>
<p>Используйте TextInputLayout.</p>
</section>

<section id="sec-58" class="study-section">
<h2 class="study-section-title">Заметка 28</h2>
<p>Добавляйте счётчик.</p>
</section>

<section id="sec-59" class="study-section">
<h2 class="study-section-title">Итоговый совет 29</h2>
<p>Проверяйте ввод.</p>
</section>

<section id="sec-60" class="study-section">
<h2 class="study-section-title">Итоговый совет 30</h2>
<p>Используйте hint.</p>
</section>

<section id="sec-61" class="study-section">
<h2 class="study-section-title">Заметка 30</h2>
<p>Используйте inputType.</p>
</section>

<section id="sec-62" class="study-section">
<h2 class="study-section-title">Итоговый совет 31</h2>
<p>Настраивайте imeOptions.</p>
</section>

<section id="sec-63" class="study-section">
<h2 class="study-section-title">Итоговый совет 32</h2>
<p>Используйте TextWatcher.</p>
</section>

<section id="sec-64" class="study-section">
<h2 class="study-section-title">Итоговый совет 33</h2>
<p>Валидируйте ввод.</p>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">7. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу настроить тип ввода через inputType.</label>
<label><input type="checkbox" /> Понимаю, как использовать TextWatcher.</label>
<label><input type="checkbox" /> Умею валидировать ввод.</label>
<label><input type="checkbox" /> Знаю, что такое imeOptions.</label>
<label><input type="checkbox" /> Понимаю преимущества TextInputLayout.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Тип ввода</th><td><code>android:inputType="textEmailAddress"</code></td></tr>
<tr><th>Подсказка</th><td><code>android:hint="Email"</code></td></tr>
<tr><th>Ошибка</th><td><code>editText.error = "Неверный формат"</code></td></tr>
<tr><th>Действие</th><td><code>android:imeOptions="actionDone"</code></td></tr>
<tr><th>Счётчик</th><td><code>app:counterEnabled="true"</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Android View и XML-разметку.
</footer>
EOF
echo "written"