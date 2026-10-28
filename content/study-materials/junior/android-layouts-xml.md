<header class="study-hero">
<p class="study-eyebrow">Android · Junior</p>
<h1 class="study-title">Layouts XML</h1>
<p class="study-lead">
XML-layouts описывают интерфейс Android-приложения. На junior-уровне важно понимать базовые контейнеры: FrameLayout, LinearLayout, ConstraintLayout и разницу между View и ViewGroup.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#basics">Основы</a>
<a class="study-nav-link" href="#frame">FrameLayout</a>
<a class="study-nav-link" href="#linear">LinearLayout</a>
<a class="study-nav-link" href="#constraint">ConstraintLayout</a>
<a class="study-nav-link" href="#check">Проверка</a>
</nav>

<section id="basics" class="study-section">
<h2 class="study-section-title">1. Основы XML-разметки</h2>
<p>
Каждый элемент — это View или ViewGroup. ViewGroup содержит другие элементы.
</p>

```kotlin
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello" />
</LinearLayout>
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>match_parent</code></strong>
Занять всё доступное пространство.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>wrap_content</code></strong>
Размер по содержимому.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>View</code></strong>
Отдельный элемент интерфейса.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>ViewGroup</code></strong>
Контейнер для других View.
</div>
</div>
</section>

<section id="frame" class="study-section">
<h2 class="study-section-title">2. FrameLayout</h2>
<p>
FrameLayout помещает дочерние элементы друг над другом. Удобен для простых перекрытий.
</p>

```kotlin
<FrameLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <ImageView ... />
    <TextView ... />
</FrameLayout>
```

</section>

<section id="linear" class="study-section">
<h2 class="study-section-title">3. LinearLayout</h2>
<p>
LinearLayout располагает элементы в строку или столбец. Веса (<code>layout_weight</code>) помогают распределить пространство.
</p>

```kotlin
<LinearLayout
    android:orientation="horizontal"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <Button android:layout_width="0dp" android:layout_weight="1" ... />
    <Button android:layout_width="0dp" android:layout_weight="1" ... />
</LinearLayout>
```

</section>

<section id="constraint" class="study-section">
<h2 class="study-section-title">4. ConstraintLayout</h2>
<p>
ConstraintLayout позволяет создавать сложные интерфейсы с помощью ограничений между элементами.
</p>

```kotlin
<androidx.constraintlayout.widget.ConstraintLayout ...>
    <TextView
        android:id="@+id/title"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent" />
</androidx.constraintlayout.widget.ConstraintLayout>
```

<div class="study-note">
<strong>Запомнить:</strong> ConstraintLayout часто заменяет вложенные LinearLayout и уменьшает глубину дерева View.
</div>
</section>

<section class="study-section">
<h2 class="study-section-title">RelativeLayout</h2>
<p>RelativeLayout располагает элементы относительно друг друга или родителя. Он гибок, но при сложных экранах может быть менее предсказуемым, чем ConstraintLayout.</p>

```xml
<RelativeLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <Button
        android:id="@+id/button"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"
        android:text="Кнопка" />
</RelativeLayout>
```
</section>

<section class="study-section">
<h2 class="study-section-title">ViewGroup и View</h2>
<p><code>View</code> — базовый элемент интерфейса, а <code>ViewGroup</code> — контейнер, который содержит другие View. Любой экран строится из дерева View и ViewGroup.</p>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">5. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу объяснить разницу между <code>match_parent</code> и <code>wrap_content</code>.</label>
<label><input type="checkbox" /> Понимаю, что такое ViewGroup.</label>
<label><input type="checkbox" /> Знаю, когда использовать LinearLayout.</label>
<label><input type="checkbox" /> Понимаю назначение ConstraintLayout.</label>
<label><input type="checkbox" /> Могу прочитать простую XML-разметку.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Контейнер перекрытия</th><td><code>FrameLayout</code></td></tr>
<tr><th>Линейный контейнер</th><td><code>LinearLayout</code></td></tr>
<tr><th>Контейнер с ограничениями</th><td><code>ConstraintLayout</code></td></tr>
<tr><th>По ширине родителя</th><td><code>match_parent</code></td></tr>
<tr><th>По содержимому</th><td><code>wrap_content</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на XML-layouts Android.
</footer>
