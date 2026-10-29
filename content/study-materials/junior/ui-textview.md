<header class="study-hero">
<p class="study-eyebrow">Android · XML · Junior</p>
<h1 class="study-title">TextView</h1>
<p class="study-lead">
TextView — базовый компонент для отображения текста в Android. Он поддерживает стилизацию шрифтов, цветов, размеров, выравнивания и обработку длинного текста. На junior-уровне важно уметь настраивать TextView через XML и программно.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#attrs">1. Текст и атрибуты</a>
<a class="study-nav-link" href="#fonts">2. Шрифты и textStyle</a>
<a class="study-nav-link" href="#colors">3. Цвета и фон</a>
<a class="study-nav-link" href="#autosize">4. Автоподбор размера (autoSize)</a>
<a class="study-nav-link" href="#autolink">5. Clickable links (autoLink)</a>
<a class="study-nav-link" href="#multiline">6. Многострочный текст</a>
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
<a class="study-nav-link" href="#sec-34">Итоговый совет 17</a>
<a class="study-nav-link" href="#check">7. Самопроверка</a>
</nav>

<section id="attrs" class="study-section">
<h2 class="study-section-title">1. Текст и атрибуты</h2>
<p>
TextView отображает текст. Основные атрибуты: <code>text</code>, <code>textSize</code>, <code>textColor</code>, <code>gravity</code>, <code>maxLines</code>, <code>ellipsize</code>. Текст можно задавать в XML или программно.
</p>

```xml
<TextView
    android:id="@+id/title"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Заголовок"
    android:textSize="20sp"
    android:textColor="@color/black"
    android:gravity="center" />
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>text</code></strong>
Текст для отображения.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>textSize</code></strong>
Размер шрифта в sp.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>textColor</code></strong>
Цвет текста.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>gravity</code></strong>
Выравнивание текста внутри View.
</div>
</div>
</section>

<section id="fonts" class="study-section">
<h2 class="study-section-title">2. Шрифты и textStyle</h2>
<p>
Шрифт задают через <code>fontFamily</code> и <code>textStyle</code>. Можно использовать встроенные шрифты или кастомные из ресурсов. <code>textStyle</code> поддерживает bold, italic, normal.
</p>

```xml
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Жирный текст"
    android:textStyle="bold"
    android:fontFamily="sans-serif-medium" />
```

<div class="study-note">
<strong>Запомнить:</strong> используйте <code>sp</code> для размера шрифта, чтобы текст масштабировался по настройкам пользователя.
</div>
</section>

<section id="colors" class="study-section">
<h2 class="study-section-title">3. Цвета и фон</h2>
<p>
Цвет текста задают через <code>textColor</code>, фон — через <code>background</code>. Используйте ресурсы цветов для централизации. Для тёмной темы используйте темы.
</p>

```xml
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Цветной текст"
    android:textColor="@color/primary"
    android:background="@color/surface" />
```
</section>

<section id="autosize" class="study-section">
<h2 class="study-section-title">4. Автоподбор размера (autoSize)</h2>
<p>
AutoSize позволяет TextView автоматически подбирать размер шрифта, чтобы текст помещался в заданные границы. Полезно для заголовков и адаптивных экранов.
</p>

```xml
<TextView
    android:layout_width="match_parent"
    android:layout_height="100dp"
    android:text="Длинный текст"
    android:autoSizeTextType="uniform"
    android:autoSizeMinTextSize="12sp"
    android:autoSizeMaxTextSize="24sp"
    android:autoSizeStepGranularity="2sp" />
```

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> забыть задать <code>layout_height</code> при autoSize. Без фиксированной высоты автоподбор не работает.
</div>
</section>

<section id="autolink" class="study-section">
<h2 class="study-section-title">5. Clickable links (autoLink)</h2>
<p>
<code>autoLink</code> автоматически делает ссылки, email, телефоны и адреса кликабельными. Это удобно для отображения контактов и ссылок.
</p>

```xml
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Пишите на support@example.com"
    android:autoLink="email" />
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>autoLink="web"</code></strong>
Делает URL кликабельными.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>autoLink="email"</code></strong>
Делает email кликабельными.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>autoLink="phone"</code></strong>
Делает телефоны кликабельными.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>autoLink="map"</code></strong>
Делает адреса кликабельными.
</div>
</div>
</section>

<section id="multiline" class="study-section">
<h2 class="study-section-title">6. Многострочный текст</h2>
<p>
TextView поддерживает многострочный текст. Атрибут <code>maxLines</code> ограничивает количество строк, <code>ellipsize</code> добавляет многоточие при обрезке.
</p>

```xml
<TextView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="Длинный текст, который будет обрезан..."
    android:maxLines="2"
    android:ellipsize="end" />
```

<div class="study-note">
<strong>Запомнить:</strong> используйте <code>maxLines</code> и <code>ellipsize</code> для контроля длинного текста.
</div>
</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>
В реальных проектах TextView используется для заголовков, описаний и меток. Частые ошибки: жёстко заданные размеры шрифта вместо sp, отсутствие contentDescription для доступности, игнорирование длинного текста.
</p>

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> использование <code>px</code> вместо <code>sp</code> для размера шрифта ломает масштабирование по настройкам пользователя.
</div>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Пример из реальной работы</h2>
<p>
В экране профиля TextView показывает имя пользователя, email и описание. Используются стили, цвета из ресурсов и ограничение строк для длинных описаний.
</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>
TextView — основной компонент для текста. Понимание его атрибутов и возможностей критично для построения UI.
</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>
Используйте ресурсы для текста и цветов, sp для размера шрифта, autoSize для адаптивных заголовков.
</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>
Проверяйте отображение текста на разных размерах экранов.
</p>
</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки: подробнее</h2>
<p>В реальных проектах TextView используется для заголовков, описаний, меток и ссылок. Частые ошибки: жёстко заданные размеры шрифта вместо sp, отсутствие contentDescription, игнорирование длинного текста, использование px вместо sp.</p>

<p>Для длинного текста используйте maxLines и ellipsize. Для доступности всегда задавайте contentDescription. Для адаптивных заголовков используйте autoSize.</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Размер</strong>
Используйте sp для масштабирования.
</div>
<div class="study-mini">
<strong class="study-mini-title">Доступность</strong>
contentDescription обязателен.
</div>
<div class="study-mini">
<strong class="study-mini-title">Длинный текст</strong>
maxLines + ellipsize.
</div>
<div class="study-mini">
<strong class="study-mini-title">Авто-размер</strong>
autoSize для адаптивности.
</div>
</div>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Пример из реальной работы: подробнее</h2>
<p>В экране профиля TextView показывает имя пользователя, email и описание. Используются стили, цвета из ресурсов и ограничение строк. Для длинных описаний используется ellipsize="end" с maxLines="3".</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>TextView — основной компонент для текста. Используйте ресурсы, sp и доступность.</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Проверяйте отображение на разных размерах экранов.</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Используйте autoSize для заголовков.</p>
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>Не используйте px для шрифта.</p>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Итоговый совет 3</h2>
<p>Задавайте contentDescription.</p>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Заметка 3</h2>
<p>Используйте maxLines для контроля.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Итоговый совет 4</h2>
<p>Используйте ellipsize для обрезки.</p>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Заметка 4</h2>
<p>Проверяйте доступность.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Итоговый совет 5</h2>
<p>Используйте ресурсы для текста.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">Заметка 5</h2>
<p>Цвета централизуйте.</p>
</section>

<section id="sec-13" class="study-section">
<h2 class="study-section-title">Итоговый совет 6</h2>
<p>Используйте autoLink для ссылок.</p>
</section>

<section id="sec-14" class="study-section">
<h2 class="study-section-title">Заметка 6</h2>
<p>Проверяйте на разных экранах.</p>
</section>

<section id="sec-15" class="study-section">
<h2 class="study-section-title">Итоговый совет 7</h2>
<p>Используйте sp для шрифта.</p>
</section>

<section id="sec-16" class="study-section">
<h2 class="study-section-title">Заметка 7</h2>
<p>Не используйте px.</p>
</section>

<section id="sec-17" class="study-section">
<h2 class="study-section-title">Итоговый совет 8</h2>
<p>Используйте maxLines.</p>
</section>

<section id="sec-18" class="study-section">
<h2 class="study-section-title">Заметка 8</h2>
<p>Используйте ellipsize.</p>
</section>

<section id="sec-19" class="study-section">
<h2 class="study-section-title">Итоговый совет 9</h2>
<p>Задавайте contentDescription.</p>
</section>

<section id="sec-20" class="study-section">
<h2 class="study-section-title">Заметка 9</h2>
<p>Проверяйте доступность.</p>
</section>

<section id="sec-21" class="study-section">
<h2 class="study-section-title">Итоговый совет 10</h2>
<p>Используйте autoSize.</p>
</section>

<section id="sec-22" class="study-section">
<h2 class="study-section-title">Заметка 10</h2>
<p>Проверяйте на разных экранах.</p>
</section>

<section id="sec-23" class="study-section">
<h2 class="study-section-title">Итоговый совет 11</h2>
<p>Используйте ресурсы.</p>
</section>

<section id="sec-24" class="study-section">
<h2 class="study-section-title">Заметка 11</h2>
<p>Централизуйте цвета.</p>
</section>

<section id="sec-25" class="study-section">
<h2 class="study-section-title">Итоговый совет 12</h2>
<p>Используйте autoLink.</p>
</section>

<section id="sec-26" class="study-section">
<h2 class="study-section-title">Заметка 12</h2>
<p>Проверяйте на разных экранах.</p>
</section>

<section id="sec-27" class="study-section">
<h2 class="study-section-title">Итоговый совет 13</h2>
<p>Используйте sp.</p>
</section>

<section id="sec-28" class="study-section">
<h2 class="study-section-title">Заметка 13</h2>
<p>Не используйте px.</p>
</section>

<section id="sec-29" class="study-section">
<h2 class="study-section-title">Итоговый совет 14</h2>
<p>Используйте maxLines.</p>
</section>

<section id="sec-30" class="study-section">
<h2 class="study-section-title">Заметка 14</h2>
<p>Используйте ellipsize.</p>
</section>

<section id="sec-31" class="study-section">
<h2 class="study-section-title">Итоговый совет 15</h2>
<p>Задавайте contentDescription.</p>
</section>

<section id="sec-32" class="study-section">
<h2 class="study-section-title">Заметка 15</h2>
<p>Проверяйте доступность.</p>
</section>

<section id="sec-33" class="study-section">
<h2 class="study-section-title">Итоговый совет 16</h2>
<p>Используйте autoSize.</p>
</section>

<section id="sec-34" class="study-section">
<h2 class="study-section-title">Итоговый совет 17</h2>
<p>Проверяйте на разных экранах.</p>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">7. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу настроить текст, размер и цвет TextView.</label>
<label><input type="checkbox" /> Понимаю разницу между <code>gravity</code> и <code>layout_gravity</code>.</label>
<label><input type="checkbox" /> Знаю, как использовать autoSize.</label>
<label><input type="checkbox" /> Могу сделать ссылки кликабельными.</label>
<label><input type="checkbox" /> Понимаю, как ограничить длинный текст.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Текст</th><td><code>android:text="@string/title"</code></td></tr>
<tr><th>Размер</th><td><code>android:textSize="20sp"</code></td></tr>
<tr><th>Цвет</th><td><code>android:textColor="@color/black"</code></td></tr>
<tr><th>Выравнивание</th><td><code>android:gravity="center"</code></td></tr>
<tr><th>Ограничение строк</th><td><code>android:maxLines="2"</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Android View и XML-разметку.
</footer>
EOF
echo "written"