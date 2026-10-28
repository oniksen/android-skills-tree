<header class="study-hero">
<p class="study-eyebrow">Android · Junior</p>
<h1 class="study-title">View/ViewGroup</h1>
<p class="study-lead">
View — базовый элемент интерфейса, ViewGroup — контейнер, который хранит и располагает другие View. На junior-уровне важно понимать иерархию UI и базовые атрибуты.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#view">View</a>
<a class="study-nav-link" href="#viewgroup">ViewGroup</a>
<a class="study-nav-link" href="#programmatic">Программно</a>
<a class="study-nav-link" href="#attributes">Атрибуты</a>
<a class="study-nav-link" href="#check">Проверка</a>
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
val textView = TextView(context).apply 

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
