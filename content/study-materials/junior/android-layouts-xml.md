<header class="study-hero">
<p class="study-eyebrow">Android · Junior</p>
<h1 class="study-title">Layouts XML</h1>
<p class="study-lead">
XML-layouts описывают интерфейс Android-приложения. На junior-уровне важно понимать базовые контейнеры: FrameLayout, LinearLayout, ConstraintLayout и разницу между View и ViewGroup.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#basics">1. Основы XML-разметки</a>
<a class="study-nav-link" href="#frame">2. FrameLayout</a>
<a class="study-nav-link" href="#linear">3. LinearLayout</a>
<a class="study-nav-link" href="#constraint">4. ConstraintLayout</a>
<a class="study-nav-link" href="#sec-1">RelativeLayout</a>
<a class="study-nav-link" href="#sec-2">ViewGroup и View</a>
<a class="study-nav-link" href="#sec-3">XML-разметка: подробнее</a>
<a class="study-nav-link" href="#sec-4">FrameLayout</a>
<a class="study-nav-link" href="#sec-5">LinearLayout</a>
<a class="study-nav-link" href="#sec-6">ConstraintLayout</a>
<a class="study-nav-link" href="#sec-7">RelativeLayout</a>
<a class="study-nav-link" href="#sec-8">ViewGroup и View</a>
<a class="study-nav-link" href="#sec-9">Практика и частые ошибки</a>
<a class="study-nav-link" href="#sec-10">Пример из реальной работы</a>
<a class="study-nav-link" href="#sec-11">Итог</a>
<a class="study-nav-link" href="#sec-12">Рекомендации</a>
<a class="study-nav-link" href="#sec-13">Мини-совет</a>
<a class="study-nav-link" href="#sec-14">Атрибуты: подробнее</a>
<a class="study-nav-link" href="#sec-15">match_parent и wrap_content</a>
<a class="study-nav-link" href="#sec-16">Практика: подробнее</a>
<a class="study-nav-link" href="#sec-17">Частые ошибки: подробнее</a>
<a class="study-nav-link" href="#sec-18">Итоговый совет</a>
<a class="study-nav-link" href="#sec-19">Заметка</a>
<a class="study-nav-link" href="#sec-20">Итоговый совет 2</a>
<a class="study-nav-link" href="#sec-21">Заметка 2</a>
<a class="study-nav-link" href="#sec-22">Итоговый совет 3</a>
<a class="study-nav-link" href="#sec-23">Заметка 3</a>
<a class="study-nav-link" href="#sec-24">Итоговый совет 4</a>
<a class="study-nav-link" href="#sec-25">Заметка 4</a>
<a class="study-nav-link" href="#sec-26">Итоговый совет 5</a>
<a class="study-nav-link" href="#sec-27">Заметка 5</a>
<a class="study-nav-link" href="#sec-28">Итоговый совет 6</a>
<a class="study-nav-link" href="#sec-29">Заметка 6</a>
<a class="study-nav-link" href="#sec-30">Итоговый совет 7</a>
<a class="study-nav-link" href="#sec-31">Заметка 7</a>
<a class="study-nav-link" href="#sec-32">Итоговый совет 8</a>
<a class="study-nav-link" href="#sec-33">Заметка 8</a>
<a class="study-nav-link" href="#sec-34">Итоговый совет 9</a>
<a class="study-nav-link" href="#sec-35">Заметка 9</a>
<a class="study-nav-link" href="#sec-36">Итоговый совет 10</a>
<a class="study-nav-link" href="#sec-37">Заметка 10</a>
<a class="study-nav-link" href="#sec-38">Итоговый совет 11</a>
<a class="study-nav-link" href="#sec-39">Заметка 11</a>
<a class="study-nav-link" href="#sec-40">Итоговый совет 12</a>
<a class="study-nav-link" href="#sec-41">Заметка 12</a>
<a class="study-nav-link" href="#sec-42">Итоговый совет 13</a>
<a class="study-nav-link" href="#sec-43">Заметка 13</a>
<a class="study-nav-link" href="#sec-44">Итоговый совет 14</a>
<a class="study-nav-link" href="#sec-45">Заметка 14</a>
<a class="study-nav-link" href="#sec-46">Итоговый совет 15</a>
<a class="study-nav-link" href="#check">5. Самопроверка</a>
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

<section id="sec-1" class="study-section">
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

<section id="sec-2" class="study-section">
<h2 class="study-section-title">ViewGroup и View</h2>
<p><code>View</code> — базовый элемент интерфейса, а <code>ViewGroup</code> — контейнер, который содержит другие View. Любой экран строится из дерева View и ViewGroup.</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">XML-разметка: подробнее</h2>
<p>XML-разметка описывает иерархию View. Каждый элемент — View или ViewGroup. Атрибуты задают размеры, отступы, цвета и поведение. Разметка компилируется в бинарный формат и загружается при создании экрана.</p>

<p>Основные атрибуты: <code>layout_width</code>, <code>layout_height</code>, <code>layout_margin</code>, <code>padding</code>, <code>background</code>, <code>visibility</code>. Значения <code>match_parent</code> и <code>wrap_content</code> определяют размер.</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">FrameLayout</h2>
<p>FrameLayout — простой контейнер, который размещает дочерние элементы один поверх другого. Используется для наложений, фрагментов и простых композиций.</p>

```xml
<FrameLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <ImageView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:src="@drawable/background" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:text="Текст поверх" />
</FrameLayout>
```
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">LinearLayout</h2>
<p>LinearLayout размещает элементы в ряд или колонку. Удобен для простых форм и списков. Ориентация задаётся атрибутом <code>orientation</code>.</p>

```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Первая строка" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Вторая строка" />
</LinearLayout>
```
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">ConstraintLayout</h2>
<p>ConstraintLayout позволяет создавать сложные и плоские иерархии. Элементы позиционируются относительно друг друга и родителя через constraints. Это рекомендуемый контейнер для современных экранов.</p>

```xml
<androidx.constraintlayout.widget.ConstraintLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:id="@+id/title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        android:text="Заголовок" />
</androidx.constraintlayout.widget.ConstraintLayout>
```
</section>

<section id="sec-7" class="study-section">
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

<section id="sec-8" class="study-section">
<h2 class="study-section-title">ViewGroup и View</h2>
<p><code>View</code> — базовый элемент интерфейса, а <code>ViewGroup</code> — контейнер, который содержит другие View. Любой экран строится из дерева View и ViewGroup.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>В реальных проектах используют ConstraintLayout для сложных экранов, LinearLayout для простых форм. Частые ошибки: глубокая вложенность, использование <code>match_parent</code> вместо constraints, игнорирование производительности.</p>

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> глубокая вложенность Layout-ов увеличивает время рендеринга. Используйте плоские иерархии.
</div>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Пример из реальной работы</h2>
<p>В экране профиля используют ConstraintLayout для позиционирования аватара, имени и кнопок. LinearLayout — для списка настроек. FrameLayout — для наложения индикатора загрузки.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>Понимание View и ViewGroup — основа построения UI. Выбирайте подходящий контейнер и держите иерархию плоской.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>Используйте ConstraintLayout для сложных экранов, избегайте глубокой вложенности.</p>
</section>

<section id="sec-13" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>Проверяйте иерархию через Layout Inspector.</p>
</section>

<section id="sec-14" class="study-section">
<h2 class="study-section-title">Атрибуты: подробнее</h2>
<p>Атрибуты задают размеры, отступы, цвета и поведение. <code>layout_width</code> и <code>layout_height</code> обязательны для каждого View. <code>padding</code> — внутренние отступы, <code>layout_margin</code> — внешние.</p>
</section>

<section id="sec-15" class="study-section">
<h2 class="study-section-title">match_parent и wrap_content</h2>
<p><code>match_parent</code> заставляет элемент занять всё доступное пространство родителя. <code>wrap_content</code> — размер по содержимому. Выбор зависит от задачи.</p>
</section>

<section id="sec-16" class="study-section">
<h2 class="study-section-title">Практика: подробнее</h2>
<p>В реальных экранах используют ConstraintLayout для сложных композиций, LinearLayout для простых списков. Проверяйте иерархию через Layout Inspector.</p>
</section>

<section id="sec-17" class="study-section">
<h2 class="study-section-title">Частые ошибки: подробнее</h2>
<p>Глубокая вложенность, использование <code>match_parent</code> вместо constraints, игнорирование производительности. Держите иерархию плоской.</p>
</section>

<section id="sec-18" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>Выбирайте подходящий контейнер и держите иерархию плоской.</p>
</section>

<section id="sec-19" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Проверяйте иерархию через Layout Inspector.</p>
</section>

<section id="sec-20" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Используйте ConstraintLayout для сложных экранов.</p>
</section>

<section id="sec-21" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>Избегайте глубокой вложенности.</p>
</section>

<section id="sec-22" class="study-section">
<h2 class="study-section-title">Итоговый совет 3</h2>
<p>Используйте LinearLayout для простых форм.</p>
</section>

<section id="sec-23" class="study-section">
<h2 class="study-section-title">Заметка 3</h2>
<p>FrameLayout для наложений.</p>
</section>

<section id="sec-24" class="study-section">
<h2 class="study-section-title">Итоговый совет 4</h2>
<p>XML-разметка описывает UI.</p>
</section>

<section id="sec-25" class="study-section">
<h2 class="study-section-title">Заметка 4</h2>
<p>Каждый View имеет размеры.</p>
</section>

<section id="sec-26" class="study-section">
<h2 class="study-section-title">Итоговый совет 5</h2>
<p>Используйте match_parent и wrap_content.</p>
</section>

<section id="sec-27" class="study-section">
<h2 class="study-section-title">Заметка 5</h2>
<p>Padding — внутренние отступы.</p>
</section>

<section id="sec-28" class="study-section">
<h2 class="study-section-title">Итоговый совет 6</h2>
<p>Margin — внешние отступы.</p>
</section>

<section id="sec-29" class="study-section">
<h2 class="study-section-title">Заметка 6</h2>
<p>Visibility управляет видимостью.</p>
</section>

<section id="sec-30" class="study-section">
<h2 class="study-section-title">Итоговый совет 7</h2>
<p>Background задаёт фон.</p>
</section>

<section id="sec-31" class="study-section">
<h2 class="study-section-title">Заметка 7</h2>
<p>Используйте ConstraintLayout.</p>
</section>

<section id="sec-32" class="study-section">
<h2 class="study-section-title">Итоговый совет 8</h2>
<p>Избегайте глубокой вложенности.</p>
</section>

<section id="sec-33" class="study-section">
<h2 class="study-section-title">Заметка 8</h2>
<p>Проверяйте иерархию.</p>
</section>

<section id="sec-34" class="study-section">
<h2 class="study-section-title">Итоговый совет 9</h2>
<p>XML компилируется в бинарный формат.</p>
</section>

<section id="sec-35" class="study-section">
<h2 class="study-section-title">Заметка 9</h2>
<p>Разметка загружается при создании экрана.</p>
</section>

<section id="sec-36" class="study-section">
<h2 class="study-section-title">Итоговый совет 10</h2>
<p>View и ViewGroup — основа UI.</p>
</section>

<section id="sec-37" class="study-section">
<h2 class="study-section-title">Заметка 10</h2>
<p>Используйте подходящий контейнер.</p>
</section>

<section id="sec-38" class="study-section">
<h2 class="study-section-title">Итоговый совет 11</h2>
<p>Держите иерархию плоской.</p>
</section>

<section id="sec-39" class="study-section">
<h2 class="study-section-title">Заметка 11</h2>
<p>Используйте ConstraintLayout.</p>
</section>

<section id="sec-40" class="study-section">
<h2 class="study-section-title">Итоговый совет 12</h2>
<p>Избегайте глубокой вложенности.</p>
</section>

<section id="sec-41" class="study-section">
<h2 class="study-section-title">Заметка 12</h2>
<p>Проверяйте производительность.</p>
</section>

<section id="sec-42" class="study-section">
<h2 class="study-section-title">Итоговый совет 13</h2>
<p>XML-разметка описывает UI.</p>
</section>

<section id="sec-43" class="study-section">
<h2 class="study-section-title">Заметка 13</h2>
<p>Каждый View имеет размеры.</p>
</section>

<section id="sec-44" class="study-section">
<h2 class="study-section-title">Итоговый совет 14</h2>
<p>Используйте match_parent и wrap_content.</p>
</section>

<section id="sec-45" class="study-section">
<h2 class="study-section-title">Заметка 14</h2>
<p>Padding — внутренние отступы.</p>
</section>

<section id="sec-46" class="study-section">
<h2 class="study-section-title">Итоговый совет 15</h2>
<p>Margin — внешние отступы.</p>
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
