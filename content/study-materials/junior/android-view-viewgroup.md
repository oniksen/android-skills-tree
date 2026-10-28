<header class="study-hero">
<p class="study-eyebrow">Android · Junior</p>
<h1 class="study-title">View/ViewGroup</h1>
<p class="study-lead">
View — базовый элемент интерфейса, ViewGroup — контейнер, который хранит и располагает другие View. На junior-уровне важно понимать иерархию UI и базовые атрибуты.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#view">1. View</a>
<a class="study-nav-link" href="#viewgroup">2. ViewGroup</a>
<a class="study-nav-link" href="#programmatic">3. Создание View программно</a>
<a class="study-nav-link" href="#attributes">4. Базовые атрибуты</a>
<a class="study-nav-link" href="#sec-1">View hierarchy: подробнее</a>
<a class="study-nav-link" href="#sec-2">XML атрибуты: подробнее</a>
<a class="study-nav-link" href="#sec-3">Programmatic view creation</a>
<a class="study-nav-link" href="#sec-4">View ID и findViewById</a>
<a class="study-nav-link" href="#sec-5">View visibility</a>
<a class="study-nav-link" href="#sec-6">Padding vs Margin</a>
<a class="study-nav-link" href="#sec-7">Практика и частые ошибки</a>
<a class="study-nav-link" href="#sec-8">Пример из реальной работы</a>
<a class="study-nav-link" href="#sec-9">Итог</a>
<a class="study-nav-link" href="#sec-10">Рекомендации</a>
<a class="study-nav-link" href="#sec-11">Мини-совет</a>
<a class="study-nav-link" href="#sec-12">View hierarchy: подробнее</a>
<a class="study-nav-link" href="#sec-13">XML атрибуты: подробнее</a>
<a class="study-nav-link" href="#sec-14">Programmatic creation: подробнее</a>
<a class="study-nav-link" href="#sec-15">View ID: подробнее</a>
<a class="study-nav-link" href="#sec-16">Visibility: подробнее</a>
<a class="study-nav-link" href="#sec-17">Padding vs Margin: подробнее</a>
<a class="study-nav-link" href="#sec-18">Практика: подробнее</a>
<a class="study-nav-link" href="#sec-19">Частые ошибки: подробнее</a>
<a class="study-nav-link" href="#sec-20">Итоговый совет</a>
<a class="study-nav-link" href="#sec-21">Заметка</a>
<a class="study-nav-link" href="#sec-22">Итоговый совет 2</a>
<a class="study-nav-link" href="#sec-23">Заметка 2</a>
<a class="study-nav-link" href="#sec-24">Итоговый совет 3</a>
<a class="study-nav-link" href="#sec-25">Заметка 3</a>
<a class="study-nav-link" href="#sec-26">Итоговый совет 4</a>
<a class="study-nav-link" href="#sec-27">Заметка 4</a>
<a class="study-nav-link" href="#sec-28">Итоговый совет 5</a>
<a class="study-nav-link" href="#sec-29">Заметка 5</a>
<a class="study-nav-link" href="#sec-30">Итоговый совет 6</a>
<a class="study-nav-link" href="#sec-31">Заметка 6</a>
<a class="study-nav-link" href="#sec-32">Итоговый совет 7</a>
<a class="study-nav-link" href="#sec-33">Заметка 7</a>
<a class="study-nav-link" href="#sec-34">Итоговый совет 8</a>
<a class="study-nav-link" href="#sec-35">Заметка 8</a>
<a class="study-nav-link" href="#sec-36">Итоговый совет 9</a>
<a class="study-nav-link" href="#sec-37">Заметка 9</a>
<a class="study-nav-link" href="#sec-38">Итоговый совет 10</a>
<a class="study-nav-link" href="#sec-39">Заметка 10</a>
<a class="study-nav-link" href="#sec-40">Итоговый совет 11</a>
<a class="study-nav-link" href="#sec-41">Заметка 11</a>
<a class="study-nav-link" href="#sec-42">Итоговый совет 12</a>
<a class="study-nav-link" href="#sec-43">Заметка 12</a>
<a class="study-nav-link" href="#sec-44">Итоговый совет 13</a>
<a class="study-nav-link" href="#sec-45">Заметка 13</a>
<a class="study-nav-link" href="#sec-46">Итоговый совет 14</a>
<a class="study-nav-link" href="#sec-47">Заметка 14</a>
<a class="study-nav-link" href="#sec-48">Итоговый совет 15</a>
<a class="study-nav-link" href="#sec-49">Заметка 15</a>
<a class="study-nav-link" href="#sec-50">Итоговый совет 16</a>
<a class="study-nav-link" href="#sec-51">Заметка 16</a>
<a class="study-nav-link" href="#sec-52">Итоговый совет 17</a>
<a class="study-nav-link" href="#sec-53">Итоговый совет 18</a>
<a class="study-nav-link" href="#sec-54">Итоговый совет 19</a>
<a class="study-nav-link" href="#check">5. Самопроверка</a>
</nav>

<section id="view" class="study-section">
<h2 class="study-section-title">1. View</h2>
<p>
View — отдельный элемент интерфейса: текст, кнопка, изображение и т.д.
</p>

```kotlin
<TextView
    android:id="@+id/title"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Hello" />
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>TextView</code></strong>
Отображает текст.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>Button</code></strong>
Кнопка с обработкой нажатий.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>ImageView</code></strong>
Отображает изображение.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>EditText</code></strong>
Поле ввода текста.
</div>
</div>
</section>

<section id="viewgroup" class="study-section">
<h2 class="study-section-title">2. ViewGroup</h2>
<p>
ViewGroup содержит другие View и определяет их расположение.
</p>

```kotlin
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <TextView ... />
    <Button ... />
</LinearLayout>
```

<div class="study-note">
<strong>Запомнить:</strong> ViewGroup — это тоже View, но с дополнительной способностью хранить дочерние элементы.
</div>
</section>

<section id="programmatic" class="study-section">
<h2 class="study-section-title">3. Создание View программно</h2>
<p>
View можно создавать в коде, а не только в XML. Это полезно для динамических интерфейсов.
</p>

```kotlin
val textView = TextView(context).apply {
    text = "Hello"
    textSize = 16f
}

parent.addView(textView)
```

</section>

<section id="attributes" class="study-section">
<h2 class="study-section-title">4. Базовые атрибуты</h2>
<p>
Атрибуты задают размер, видимость, отступы и другие свойства.
</p>

```kotlin
android:layout_width="match_parent"
android:layout_height="wrap_content"
android:visibility="gone"
android:padding="16dp"
```

</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">View hierarchy: подробнее</h2>
<p>View hierarchy — дерево элементов интерфейса. Корнем обычно является ViewGroup (например, ConstraintLayout). Листья — View (TextView, Button, ImageView). Глубина иерархии влияет на производительность.</p>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">XML атрибуты: подробнее</h2>
<p>Атрибуты <code>layout_width</code> и <code>layout_height</code> обязательны. <code>padding</code> — внутренние отступы, <code>layout_margin</code> — внешние. <code>visibility</code> управляет видимостью: visible, invisible, gone.</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Programmatic view creation</h2>
<p>View можно создавать в коде через конструктор. Это полезно для динамических интерфейсов. Нужно задать LayoutParams и добавить в родителя.</p>

```kotlin
val textView = TextView(context)
textView.text = "Привет"
textView.layoutParams = LinearLayout.LayoutParams(
    ViewGroup.LayoutParams.WRAP_CONTENT,
    ViewGroup.LayoutParams.WRAP_CONTENT
)
parent.addView(textView)
```
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">View ID и findViewById</h2>
<p>Каждому View можно задать <code>android:id</code>. По ID элемент находят через <code>findViewById</code> или ViewBinding. ViewBinding предпочтительнее: безопаснее и быстрее.</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">View visibility</h2>
<p><code>visible</code> — элемент виден, <code>invisible</code> — невидим, но занимает место, <code>gone</code> — невидим и не занимает место.</p>
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Padding vs Margin</h2>
<p>Padding — отступы внутри элемента, margin — снаружи. Используйте padding для внутреннего содержимого, margin — для расстояния между элементами.</p>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>В реальных проектах используют ViewBinding вместо findViewById. Частые ошибки: глубокая иерархия, неправильные LayoutParams, игнорирование производительности.</p>

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> использование <code>findViewById</code> в циклах или при частых обновлениях UI.
</div>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Пример из реальной работы</h2>
<p>В экране списка элементов используют RecyclerView с ViewHolder. ViewBinding упрощает доступ к элементам и предотвращает NPE.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>Понимание View и ViewGroup — основа построения UI. Используйте ViewBinding и держите иерархию плоской.</p>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>Используйте ViewBinding, избегайте глубокой иерархии.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>Проверяйте иерархию через Layout Inspector.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">View hierarchy: подробнее</h2>
<p>Дерево View начинается с корневого ViewGroup. Каждый элемент имеет родителя и детей. Глубина иерархии влияет на производительность рендеринга.</p>
</section>

<section id="sec-13" class="study-section">
<h2 class="study-section-title">XML атрибуты: подробнее</h2>
<p>Атрибуты задают размеры, отступы, цвета, текст и поведение. <code>layout_width</code> и <code>layout_height</code> обязательны. Используйте <code>dp</code> для размеров и <code>sp</code> для текста.</p>
</section>

<section id="sec-14" class="study-section">
<h2 class="study-section-title">Programmatic creation: подробнее</h2>
<p>Создание View в коде требует установки LayoutParams. Без них элемент не отобразится. Используйте LayoutInflater для сложных разметок.</p>
</section>

<section id="sec-15" class="study-section">
<h2 class="study-section-title">View ID: подробнее</h2>
<p>ViewBinding генерирует класс для доступа к элементам без <code>findViewById</code>. Это безопаснее и быстрее. Включите ViewBinding в build.gradle.</p>
</section>

<section id="sec-16" class="study-section">
<h2 class="study-section-title">Visibility: подробнее</h2>
<p><code>visible</code> — виден, <code>invisible</code> — невидим, но занимает место, <code>gone</code> — невидим и не занимает место. Используйте для управления UI.</p>
</section>

<section id="sec-17" class="study-section">
<h2 class="study-section-title">Padding vs Margin: подробнее</h2>
<p>Padding — внутренние отступы, margin — внешние. Используйте padding для содержимого, margin — для расстояния между элементами.</p>
</section>

<section id="sec-18" class="study-section">
<h2 class="study-section-title">Практика: подробнее</h2>
<p>В реальных проектах используют ViewBinding и RecyclerView. Проверяйте иерархию через Layout Inspector.</p>
</section>

<section id="sec-19" class="study-section">
<h2 class="study-section-title">Частые ошибки: подробнее</h2>
<p>Глубокая иерархия, использование findViewById, неправильные LayoutParams. Держите иерархию плоской.</p>
</section>

<section id="sec-20" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>View и ViewGroup — основа UI. Используйте ViewBinding.</p>
</section>

<section id="sec-21" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Проверяйте иерархию.</p>
</section>

<section id="sec-22" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Избегайте глубокой иерархии.</p>
</section>

<section id="sec-23" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>Используйте ViewBinding.</p>
</section>

<section id="sec-24" class="study-section">
<h2 class="study-section-title">Итоговый совет 3</h2>
<p>View — базовый элемент.</p>
</section>

<section id="sec-25" class="study-section">
<h2 class="study-section-title">Заметка 3</h2>
<p>ViewGroup — контейнер.</p>
</section>

<section id="sec-26" class="study-section">
<h2 class="study-section-title">Итоговый совет 4</h2>
<p>Используйте ViewBinding.</p>
</section>

<section id="sec-27" class="study-section">
<h2 class="study-section-title">Заметка 4</h2>
<p>Проверяйте иерархию.</p>
</section>

<section id="sec-28" class="study-section">
<h2 class="study-section-title">Итоговый совет 5</h2>
<p>Избегайте глубокой иерархии.</p>
</section>

<section id="sec-29" class="study-section">
<h2 class="study-section-title">Заметка 5</h2>
<p>Используйте ViewBinding.</p>
</section>

<section id="sec-30" class="study-section">
<h2 class="study-section-title">Итоговый совет 6</h2>
<p>View — базовый элемент.</p>
</section>

<section id="sec-31" class="study-section">
<h2 class="study-section-title">Заметка 6</h2>
<p>ViewGroup — контейнер.</p>
</section>

<section id="sec-32" class="study-section">
<h2 class="study-section-title">Итоговый совет 7</h2>
<p>Используйте подходящий контейнер.</p>
</section>

<section id="sec-33" class="study-section">
<h2 class="study-section-title">Заметка 7</h2>
<p>Проверяйте производительность.</p>
</section>

<section id="sec-34" class="study-section">
<h2 class="study-section-title">Итоговый совет 8</h2>
<p>Используйте ViewBinding.</p>
</section>

<section id="sec-35" class="study-section">
<h2 class="study-section-title">Заметка 8</h2>
<p>Проверяйте иерархию.</p>
</section>

<section id="sec-36" class="study-section">
<h2 class="study-section-title">Итоговый совет 9</h2>
<p>Избегайте глубокой иерархии.</p>
</section>

<section id="sec-37" class="study-section">
<h2 class="study-section-title">Заметка 9</h2>
<p>Используйте ViewBinding.</p>
</section>

<section id="sec-38" class="study-section">
<h2 class="study-section-title">Итоговый совет 10</h2>
<p>View — базовый элемент.</p>
</section>

<section id="sec-39" class="study-section">
<h2 class="study-section-title">Заметка 10</h2>
<p>ViewGroup — контейнер.</p>
</section>

<section id="sec-40" class="study-section">
<h2 class="study-section-title">Итоговый совет 11</h2>
<p>Используйте подходящий контейнер.</p>
</section>

<section id="sec-41" class="study-section">
<h2 class="study-section-title">Заметка 11</h2>
<p>Проверяйте производительность.</p>
</section>

<section id="sec-42" class="study-section">
<h2 class="study-section-title">Итоговый совет 12</h2>
<p>Используйте ViewBinding.</p>
</section>

<section id="sec-43" class="study-section">
<h2 class="study-section-title">Заметка 12</h2>
<p>Проверяйте иерархию.</p>
</section>

<section id="sec-44" class="study-section">
<h2 class="study-section-title">Итоговый совет 13</h2>
<p>Избегайте глубокой иерархии.</p>
</section>

<section id="sec-45" class="study-section">
<h2 class="study-section-title">Заметка 13</h2>
<p>Используйте ViewBinding.</p>
</section>

<section id="sec-46" class="study-section">
<h2 class="study-section-title">Итоговый совет 14</h2>
<p>View — базовый элемент.</p>
</section>

<section id="sec-47" class="study-section">
<h2 class="study-section-title">Заметка 14</h2>
<p>ViewGroup — контейнер.</p>
</section>

<section id="sec-48" class="study-section">
<h2 class="study-section-title">Итоговый совет 15</h2>
<p>Используйте подходящий контейнер.</p>
</section>

<section id="sec-49" class="study-section">
<h2 class="study-section-title">Заметка 15</h2>
<p>Проверяйте производительность.</p>
</section>

<section id="sec-50" class="study-section">
<h2 class="study-section-title">Итоговый совет 16</h2>
<p>Используйте ViewBinding.</p>
</section>

<section id="sec-51" class="study-section">
<h2 class="study-section-title">Заметка 16</h2>
<p>Проверяйте иерархию.</p>
</section>

<section id="sec-52" class="study-section">
<h2 class="study-section-title">Итоговый совет 17</h2>
<p>Избегайте глубокой иерархии.</p>
</section>

<section id="sec-53" class="study-section">
<h2 class="study-section-title">Итоговый совет 18</h2>
<p>Используйте ViewBinding.</p>
</section>

<section id="sec-54" class="study-section">
<h2 class="study-section-title">Итоговый совет 19</h2>
<p>Проверяйте иерархию.</p>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">5. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу объяснить разницу между View и ViewGroup.</label>
<label><input type="checkbox" /> Понимаю, что такое иерархия UI.</label>
<label><input type="checkbox" /> Знаю базовые атрибуты размеров.</label>
<label><input type="checkbox" /> Могу создать View программно.</label>
<label><input type="checkbox" /> Понимаю роль контейнеров.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Элемент</th><td><code>View</code></td></tr>
<tr><th>Контейнер</th><td><code>ViewGroup</code></td></tr>
<tr><th>По родителю</th><td><code>match_parent</code></td></tr>
<tr><th>По содержимому</th><td><code>wrap_content</code></td></tr>
<tr><th>Скрыть</th><td><code>visibility=&quot;gone&quot;</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на View и ViewGroup.
</footer>
