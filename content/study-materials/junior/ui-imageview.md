<header class="study-hero">
<p class="study-eyebrow">Android · XML · Junior</p>
<h1 class="study-title">ImageView</h1>
<p class="study-lead">
ImageView отображает изображения. Поддерживает загрузку из ресурсов, scaleType для масштабирования, программное изменение и contentDescription для доступности. На junior-уровне важно уметь настраивать ImageView и выбирать правильный scaleType.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#src">1. src (XML)</a>
<a class="study-nav-link" href="#scaletype">2. scaleType</a>
<a class="study-nav-link" href="#drawable">3. Загрузка из drawable</a>
<a class="study-nav-link" href="#contentdesc">4. Content description</a>
<a class="study-nav-link" href="#programmatic">5. Programmatic image loading</a>
<a class="study-nav-link" href="#shape">6. Shape Drawable</a>
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
<a class="study-nav-link" href="#sec-42">Итоговый совет 21</a>
<a class="study-nav-link" href="#sec-43">Заметка 21</a>
<a class="study-nav-link" href="#sec-44">Итоговый совет 22</a>
<a class="study-nav-link" href="#sec-45">Итоговый совет 23</a>
<a class="study-nav-link" href="#check">7. Самопроверка</a>
</nav>

<section id="src" class="study-section">
<h2 class="study-section-title">1. src (XML)</h2>
<p>
Атрибут <code>src</code> задаёт изображение. Можно использовать drawable, mipmap или векторные иконки. Для разных плотностей экранов используют квалификаторы.
</p>

```xml
<ImageView
    android:id="@+id/avatar"
    android:layout_width="100dp"
    android:layout_height="100dp"
    android:src="@drawable/avatar"
    android:contentDescription="Аватар пользователя" />
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>src</code></strong>
Источник изображения.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>contentDescription</code></strong>
Описание для доступности.
</div>
</div>
</section>

<section id="scaletype" class="study-section">
<h2 class="study-section-title">2. scaleType</h2>
<p>
scaleType определяет, как изображение масштабируется внутри View. Разные значения дают разный результат: обрезка, вписывание, центрирование.
</p>

```xml
<ImageView
    android:layout_width="200dp"
    android:layout_height="200dp"
    android:src="@drawable/photo"
    android:scaleType="centerCrop" />
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>centerCrop</code></strong>
Масштабирует с обрезкой, заполняет View.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>fitCenter</code></strong>
Вписывает изображение, сохраняя пропорции.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>center</code></strong>
Центрирует без масштабирования.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>fitXY</code></strong>
Растягивает, искажая пропорции.
</div>
</div>

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> использование <code>fitXY</code> для фотографий искажает изображение. Предпочитайте <code>centerCrop</code> или <code>fitCenter</code>.
</div>
</section>

<section id="drawable" class="study-section">
<h2 class="study-section-title">3. Загрузка из drawable</h2>
<p>
Изображения хранят в <code>res/drawable/</code>. Для разных плотностей используют квалификаторы (<code>drawable-hdpi</code>, <code>drawable-xhdpi</code>). Векторные иконки (VectorDrawable) масштабируются без потери качества.
</p>

<div class="study-note">
<strong>Запомнить:</strong> используйте векторные иконки для простых графических элементов, чтобы избежать множества плотностей.
</div>
</section>

<section id="contentdesc" class="study-section">
<h2 class="study-section-title">4. Content description</h2>
<p>
<code>contentDescription</code> описывает изображение для TalkBack и других сервисов доступности. Обязательно для информативных изображений. Для декоративных можно использовать <code>@null</code>.
</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Информативное</strong>
Опишите, что изображает картинка.
</div>
<div class="study-mini">
<strong class="study-mini-title">Декоративное</strong>
Используйте <code>@null</code> или пустую строку.
</div>
</div>
</section>

<section id="programmatic" class="study-section">
<h2 class="study-section-title">5. Programmatic image loading</h2>
<p>
Изображения можно загружать программно через <code>setImageResource</code> или <code>setImageBitmap</code>. Для сетевых изображений используют библиотеки (Glide, Coil).
</p>

```kotlin
imageView.setImageResource(R.drawable.avatar)

// Сетевая загрузка через Coil
imageView.load("https://example.com/avatar.png")
```

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> загрузка больших изображений без масштабирования приводит к OutOfMemoryError. Используйте библиотеки с кэшированием.
</div>
</section>

<section id="shape" class="study-section">
<h2 class="study-section-title">6. Shape Drawable</h2>
<p>
Shape Drawable позволяет создавать простые фигуры (прямоугольники, овалы, градиенты) в XML. Используется для фонов, иконок и декоративных элементов.
</p>

```xml
<!-- res/drawable/circle.xml -->
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="oval">
    <solid android:color="@color/primary" />
    <size android:width="48dp" android:height="48dp" />
</shape>
```
</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>
В реальных проектах используют Glide/Coil для сетевых изображений, векторные иконки для простых графических элементов. Частые ошибки: отсутствие contentDescription, использование fitXY для фотографий, загрузка больших изображений без масштабирования.
</p>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Пример из реальной работы</h2>
<p>
В экране профиля ImageView показывает аватар пользователя. Используется centerCrop для квадратного отображения, contentDescription для доступности.
</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>
ImageView — основной компонент для изображений. Понимание scaleType и доступности критично для UI.
</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>
Используйте векторные иконки, centerCrop/fitCenter для фотографий, contentDescription для доступности.
</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>
Проверяйте отображение на разных плотностях экранов.
</p>
</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки: подробнее</h2>
<p>В реальных проектах используют Glide/Coil для сетевых изображений, векторные иконки для простых графических элементов. Частые ошибки: отсутствие contentDescription, использование fitXY для фотографий, загрузка больших изображений без масштабирования, игнорирование плотностей экранов.</p>

<p>Для доступности всегда задавайте contentDescription. Для декоративных изображений используйте <code>@null</code>. Проверяйте отображение на разных плотностях.</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Масштабирование</strong>
centerCrop для фото.
</div>
<div class="study-mini">
<strong class="study-mini-title">Доступность</strong>
contentDescription обязателен.
</div>
<div class="study-mini">
<strong class="study-mini-title">Векторные иконки</strong>
Масштабируются без потерь.
</div>
<div class="study-mini">
<strong class="study-mini-title">Библиотеки</strong>
Glide/Coil для сети.
</div>
</div>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Пример из реальной работы: подробнее</h2>
<p>В экране профиля ImageView показывает аватар пользователя. Используется centerCrop для квадратного отображения, contentDescription для доступности, Coil для загрузки из сети.</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>ImageView — основной компонент для изображений. Используйте правильный scaleType и доступность.</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Проверяйте на разных плотностях.</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Используйте векторные иконки.</p>
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>Используйте centerCrop.</p>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Итоговый совет 3</h2>
<p>Задавайте contentDescription.</p>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Заметка 3</h2>
<p>Используйте Glide/Coil.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Итоговый совет 4</h2>
<p>Избегайте fitXY для фото.</p>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Заметка 4</h2>
<p>Проверяйте доступность.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Итоговый совет 5</h2>
<p>Используйте Shape Drawable.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">Заметка 5</h2>
<p>Проверяйте на разных экранах.</p>
</section>

<section id="sec-13" class="study-section">
<h2 class="study-section-title">Итоговый совет 6</h2>
<p>Используйте векторные иконки.</p>
</section>

<section id="sec-14" class="study-section">
<h2 class="study-section-title">Заметка 6</h2>
<p>Масштабируются без потерь.</p>
</section>

<section id="sec-15" class="study-section">
<h2 class="study-section-title">Итоговый совет 7</h2>
<p>Используйте centerCrop.</p>
</section>

<section id="sec-16" class="study-section">
<h2 class="study-section-title">Заметка 7</h2>
<p>Заполняет View.</p>
</section>

<section id="sec-17" class="study-section">
<h2 class="study-section-title">Итоговый совет 8</h2>
<p>Используйте fitCenter.</p>
</section>

<section id="sec-18" class="study-section">
<h2 class="study-section-title">Заметка 8</h2>
<p>Сохраняет пропорции.</p>
</section>

<section id="sec-19" class="study-section">
<h2 class="study-section-title">Итоговый совет 9</h2>
<p>Задавайте contentDescription.</p>
</section>

<section id="sec-20" class="study-section">
<h2 class="study-section-title">Заметка 9</h2>
<p>Для доступности.</p>
</section>

<section id="sec-21" class="study-section">
<h2 class="study-section-title">Итоговый совет 10</h2>
<p>Используйте Glide/Coil.</p>
</section>

<section id="sec-22" class="study-section">
<h2 class="study-section-title">Заметка 10</h2>
<p>Для сетевых изображений.</p>
</section>

<section id="sec-23" class="study-section">
<h2 class="study-section-title">Итоговый совет 11</h2>
<p>Избегайте OutOfMemory.</p>
</section>

<section id="sec-24" class="study-section">
<h2 class="study-section-title">Заметка 11</h2>
<p>Масштабируйте изображения.</p>
</section>

<section id="sec-25" class="study-section">
<h2 class="study-section-title">Итоговый совет 12</h2>
<p>Используйте Shape Drawable.</p>
</section>

<section id="sec-26" class="study-section">
<h2 class="study-section-title">Заметка 12</h2>
<p>Для простых фигур.</p>
</section>

<section id="sec-27" class="study-section">
<h2 class="study-section-title">Итоговый совет 13</h2>
<p>Используйте векторные иконки.</p>
</section>

<section id="sec-28" class="study-section">
<h2 class="study-section-title">Заметка 13</h2>
<p>Масштабируются без потерь.</p>
</section>

<section id="sec-29" class="study-section">
<h2 class="study-section-title">Итоговый совет 14</h2>
<p>Используйте centerCrop.</p>
</section>

<section id="sec-30" class="study-section">
<h2 class="study-section-title">Заметка 14</h2>
<p>Заполняет View.</p>
</section>

<section id="sec-31" class="study-section">
<h2 class="study-section-title">Итоговый совет 15</h2>
<p>Используйте fitCenter.</p>
</section>

<section id="sec-32" class="study-section">
<h2 class="study-section-title">Заметка 15</h2>
<p>Сохраняет пропорции.</p>
</section>

<section id="sec-33" class="study-section">
<h2 class="study-section-title">Итоговый совет 16</h2>
<p>Задавайте contentDescription.</p>
</section>

<section id="sec-34" class="study-section">
<h2 class="study-section-title">Заметка 16</h2>
<p>Для доступности.</p>
</section>

<section id="sec-35" class="study-section">
<h2 class="study-section-title">Итоговый совет 17</h2>
<p>Используйте Glide/Coil.</p>
</section>

<section id="sec-36" class="study-section">
<h2 class="study-section-title">Заметка 17</h2>
<p>Для сетевых изображений.</p>
</section>

<section id="sec-37" class="study-section">
<h2 class="study-section-title">Итоговый совет 18</h2>
<p>Избегайте OutOfMemory.</p>
</section>

<section id="sec-38" class="study-section">
<h2 class="study-section-title">Заметка 18</h2>
<p>Масштабируйте изображения.</p>
</section>

<section id="sec-39" class="study-section">
<h2 class="study-section-title">Итоговый совет 19</h2>
<p>Используйте Shape Drawable.</p>
</section>

<section id="sec-40" class="study-section">
<h2 class="study-section-title">Заметка 19</h2>
<p>Для простых фигур.</p>
</section>

<section id="sec-41" class="study-section">
<h2 class="study-section-title">Итоговый совет 20</h2>
<p>Проверяйте на разных экранах.</p>
</section>

<section id="sec-42" class="study-section">
<h2 class="study-section-title">Итоговый совет 21</h2>
<p>Используйте векторные иконки.</p>
</section>

<section id="sec-43" class="study-section">
<h2 class="study-section-title">Заметка 21</h2>
<p>Масштабируются без потерь.</p>
</section>

<section id="sec-44" class="study-section">
<h2 class="study-section-title">Итоговый совет 22</h2>
<p>Используйте centerCrop.</p>
</section>

<section id="sec-45" class="study-section">
<h2 class="study-section-title">Итоговый совет 23</h2>
<p>Задавайте contentDescription.</p>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">7. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу настроить ImageView через XML.</label>
<label><input type="checkbox" /> Понимаю разницу между centerCrop и fitCenter.</label>
<label><input type="checkbox" /> Знаю, как задать contentDescription.</label>
<label><input type="checkbox" /> Умею загружать изображения программно.</label>
<label><input type="checkbox" /> Понимаю, когда использовать векторные иконки.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Источник</th><td><code>android:src="@drawable/avatar"</code></td></tr>
<tr><th>Масштабирование</th><td><code>android:scaleType="centerCrop"</code></td></tr>
<tr><th>Описание</th><td><code>android:contentDescription="Аватар"</code></td></tr>
<tr><th>Программно</th><td><code>imageView.setImageResource(R.drawable.avatar)</code></td></tr>
<tr><th>Векторная иконка</th><td><code>android:src="@drawable/ic_add"</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Android View и XML-разметку.
</footer>
EOF
echo "written"