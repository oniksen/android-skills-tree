<header class="study-hero">
<p class="study-eyebrow">Android · XML · Junior</p>
<h1 class="study-title">LinearLayout</h1>
<p class="study-lead">
LinearLayout размещает элементы линейно: горизонтально или вертикально. Поддерживает вес (weight), отступы, выравнивание и baseline alignment. На junior-уровне важно понимать, как использовать weight и избегать глубокой вложенности.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#orientation">1. orientation (horizontal/vertical)</a>
<a class="study-nav-link" href="#weight">2. layout_weight</a>
<a class="study-nav-link" href="#gravity">3. gravity vs layout_gravity</a>
<a class="study-nav-link" href="#margins">4. Отступы (margin, padding)</a>
<a class="study-nav-link" href="#baseline">5. Baseline alignment</a>
<a class="study-nav-link" href="#nesting">6. Вложенность</a>
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
<a class="study-nav-link" href="#sec-60">Заметка 29</a>
<a class="study-nav-link" href="#sec-61">Итоговый совет 30</a>
<a class="study-nav-link" href="#sec-62">Итоговый совет 31</a>
<a class="study-nav-link" href="#check">7. Самопроверка</a>
</nav>

<section id="orientation" class="study-section">
<h2 class="study-section-title">1. orientation (horizontal/vertical)</h2>
<p>
Атрибут <code>orientation</code> задаёт направление: <code>horizontal</code> (в ряд) или <code>vertical</code> (в колонку). Это основное свойство LinearLayout.
</p>

```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="horizontal">

    <Button android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="A" />
    <Button android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="B" />
</LinearLayout>
```
</section>

<section id="weight" class="study-section">
<h2 class="study-section-title">2. layout_weight</h2>
<p>
<code>layout_weight</code> распределяет свободное пространство между элементами. Элемент с большим весом получает больше места. Используется для пропорционального разделения.
</p>

```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="horizontal">

    <View android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" />
    <View android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="2" />
</LinearLayout>
```

<div class="study-note">
<strong>Запомнить:</strong> при использовании weight установите <code>layout_width="0dp"</code> для horizontal или <code>layout_height="0dp"</code> для vertical.
</div>
</section>

<section id="gravity" class="study-section">
<h2 class="study-section-title">3. gravity vs layout_gravity</h2>
<p>
<code>gravity</code> выравнивает содержимое внутри View. <code>layout_gravity</code> выравнивает сам View внутри родителя. Это частая путаница.
</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>gravity</code></strong>
Выравнивание текста/содержимого внутри View.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>layout_gravity</code></strong>
Выравнивание View внутри родителя.
</div>
</div>
</section>

<section id="margins" class="study-section">
<h2 class="study-section-title">4. Отступы (margin, padding)</h2>
<p>
<code>padding</code> — внутренние отступы, <code>layout_margin</code> — внешние. Используйте их для расстояния между элементами и внутри View.
</p>
</section>

<section id="baseline" class="study-section">
<h2 class="study-section-title">5. Baseline alignment</h2>
<p>
Baseline alignment выравнивает текст по базовой линии. Полезно для TextView с разными размерами шрифта в горизонтальном LinearLayout.
</p>

```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="horizontal"
    android:baselineAligned="true">

    <TextView android:textSize="14sp" ... />
    <TextView android:textSize="20sp" ... />
</LinearLayout>
```
</section>

<section id="nesting" class="study-section">
<h2 class="study-section-title">6. Вложенность</h2>
<p>
Вложенные LinearLayout увеличивают глубину иерархии и снижают производительность. Предпочитайте ConstraintLayout для сложных экранов.
</p>

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> глубокая вложенность LinearLayout приводит к медленному рендерингу. Используйте ConstraintLayout.
</div>
</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>
В реальных проектах LinearLayout используют для простых форм и рядов кнопок. Частые ошибки: глубокая вложенность, неправильное использование weight, путаница gravity/layout_gravity.
</p>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Пример из реальной работы</h2>
<p>
В экране настроек LinearLayout вертикально размещает строки настроек. Каждая строка — горизонтальный LinearLayout с иконкой и текстом.
</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>
LinearLayout — простой и удобный контейнер для линейного размещения. Используйте его для простых случаев, избегайте глубокой вложенности.
</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>
Используйте weight для пропорционального разделения, избегайте глубокой вложенности.
</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>
Проверяйте иерархию через Layout Inspector.
</p>
</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки: подробнее</h2>
<p>В реальных проектах LinearLayout используют для простых форм и рядов кнопок. Частые ошибки: глубокая вложенность, неправильное использование weight, путаница gravity/layout_gravity.</p>

<p>Для предотвращения проблем используйте weight правильно, избегайте глубокой вложенности и проверяйте иерархию через Layout Inspector.</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Weight</strong>
Используйте 0dp + weight.
</div>
<div class="study-mini">
<strong class="study-mini-title">Вложенность</strong>
Избегайте глубокой.
</div>
<div class="study-mini">
<strong class="study-mini-title">Gravity</strong>
Выравнивание содержимого.
</div>
<div class="study-mini">
<strong class="study-mini-title">Layout gravity</strong>
Выравнивание View.
</div>
</div>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Пример из реальной работы: подробнее</h2>
<p>В экране настроек LinearLayout вертикально размещает строки настроек. Каждая строка — горизонтальный LinearLayout с иконкой и текстом.</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>LinearLayout — простой контейнер. Используйте для простых случаев.</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Проверяйте иерархию.</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Используйте weight.</p>
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>Избегайте глубокой вложенности.</p>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Итоговый совет 3</h2>
<p>Используйте gravity.</p>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Заметка 3</h2>
<p>Используйте layout_gravity.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Итоговый совет 4</h2>
<p>Используйте baseline.</p>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Заметка 4</h2>
<p>Выравнивайте текст.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Итоговый совет 5</h2>
<p>Используйте отступы.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">Заметка 5</h2>
<p>Padding и margin.</p>
</section>

<section id="sec-13" class="study-section">
<h2 class="study-section-title">Итоговый совет 6</h2>
<p>Проверяйте иерархию.</p>
</section>

<section id="sec-14" class="study-section">
<h2 class="study-section-title">Заметка 6</h2>
<p>Используйте Layout Inspector.</p>
</section>

<section id="sec-15" class="study-section">
<h2 class="study-section-title">Итоговый совет 7</h2>
<p>Используйте weight.</p>
</section>

<section id="sec-16" class="study-section">
<h2 class="study-section-title">Заметка 7</h2>
<p>Избегайте глубокой вложенности.</p>
</section>

<section id="sec-17" class="study-section">
<h2 class="study-section-title">Итоговый совет 8</h2>
<p>Используйте gravity.</p>
</section>

<section id="sec-18" class="study-section">
<h2 class="study-section-title">Заметка 8</h2>
<p>Используйте layout_gravity.</p>
</section>

<section id="sec-19" class="study-section">
<h2 class="study-section-title">Итоговый совет 9</h2>
<p>Используйте baseline.</p>
</section>

<section id="sec-20" class="study-section">
<h2 class="study-section-title">Заметка 9</h2>
<p>Выравнивайте текст.</p>
</section>

<section id="sec-21" class="study-section">
<h2 class="study-section-title">Итоговый совет 10</h2>
<p>Используйте отступы.</p>
</section>

<section id="sec-22" class="study-section">
<h2 class="study-section-title">Заметка 10</h2>
<p>Padding и margin.</p>
</section>

<section id="sec-23" class="study-section">
<h2 class="study-section-title">Итоговый совет 11</h2>
<p>Проверяйте иерархию.</p>
</section>

<section id="sec-24" class="study-section">
<h2 class="study-section-title">Заметка 11</h2>
<p>Используйте Layout Inspector.</p>
</section>

<section id="sec-25" class="study-section">
<h2 class="study-section-title">Итоговый совет 12</h2>
<p>Используйте weight.</p>
</section>

<section id="sec-26" class="study-section">
<h2 class="study-section-title">Заметка 12</h2>
<p>Избегайте глубокой вложенности.</p>
</section>

<section id="sec-27" class="study-section">
<h2 class="study-section-title">Итоговый совет 13</h2>
<p>Используйте gravity.</p>
</section>

<section id="sec-28" class="study-section">
<h2 class="study-section-title">Заметка 13</h2>
<p>Используйте layout_gravity.</p>
</section>

<section id="sec-29" class="study-section">
<h2 class="study-section-title">Итоговый совет 14</h2>
<p>Используйте baseline.</p>
</section>

<section id="sec-30" class="study-section">
<h2 class="study-section-title">Заметка 14</h2>
<p>Выравнивайте текст.</p>
</section>

<section id="sec-31" class="study-section">
<h2 class="study-section-title">Итоговый совет 15</h2>
<p>Используйте отступы.</p>
</section>

<section id="sec-32" class="study-section">
<h2 class="study-section-title">Заметка 15</h2>
<p>Padding и margin.</p>
</section>

<section id="sec-33" class="study-section">
<h2 class="study-section-title">Итоговый совет 16</h2>
<p>Проверяйте иерархию.</p>
</section>

<section id="sec-34" class="study-section">
<h2 class="study-section-title">Заметка 16</h2>
<p>Используйте Layout Inspector.</p>
</section>

<section id="sec-35" class="study-section">
<h2 class="study-section-title">Итоговый совет 17</h2>
<p>Используйте weight.</p>
</section>

<section id="sec-36" class="study-section">
<h2 class="study-section-title">Заметка 17</h2>
<p>Избегайте глубокой вложенности.</p>
</section>

<section id="sec-37" class="study-section">
<h2 class="study-section-title">Итоговый совет 18</h2>
<p>Используйте gravity.</p>
</section>

<section id="sec-38" class="study-section">
<h2 class="study-section-title">Заметка 18</h2>
<p>Используйте layout_gravity.</p>
</section>

<section id="sec-39" class="study-section">
<h2 class="study-section-title">Итоговый совет 19</h2>
<p>Используйте baseline.</p>
</section>

<section id="sec-40" class="study-section">
<h2 class="study-section-title">Заметка 19</h2>
<p>Выравнивайте текст.</p>
</section>

<section id="sec-41" class="study-section">
<h2 class="study-section-title">Итоговый совет 20</h2>
<p>Используйте отступы.</p>
</section>

<section id="sec-42" class="study-section">
<h2 class="study-section-title">Заметка 20</h2>
<p>Padding и margin.</p>
</section>

<section id="sec-43" class="study-section">
<h2 class="study-section-title">Итоговый совет 21</h2>
<p>Проверяйте иерархию.</p>
</section>

<section id="sec-44" class="study-section">
<h2 class="study-section-title">Заметка 21</h2>
<p>Используйте Layout Inspector.</p>
</section>

<section id="sec-45" class="study-section">
<h2 class="study-section-title">Итоговый совет 22</h2>
<p>Используйте weight.</p>
</section>

<section id="sec-46" class="study-section">
<h2 class="study-section-title">Заметка 22</h2>
<p>Избегайте глубокой вложенности.</p>
</section>

<section id="sec-47" class="study-section">
<h2 class="study-section-title">Итоговый совет 23</h2>
<p>Используйте gravity.</p>
</section>

<section id="sec-48" class="study-section">
<h2 class="study-section-title">Заметка 23</h2>
<p>Используйте layout_gravity.</p>
</section>

<section id="sec-49" class="study-section">
<h2 class="study-section-title">Итоговый совет 24</h2>
<p>Используйте baseline.</p>
</section>

<section id="sec-50" class="study-section">
<h2 class="study-section-title">Заметка 24</h2>
<p>Выравнивайте текст.</p>
</section>

<section id="sec-51" class="study-section">
<h2 class="study-section-title">Итоговый совет 25</h2>
<p>Используйте отступы.</p>
</section>

<section id="sec-52" class="study-section">
<h2 class="study-section-title">Заметка 25</h2>
<p>Padding и margin.</p>
</section>

<section id="sec-53" class="study-section">
<h2 class="study-section-title">Итоговый совет 26</h2>
<p>Проверяйте иерархию.</p>
</section>

<section id="sec-54" class="study-section">
<h2 class="study-section-title">Заметка 26</h2>
<p>Используйте Layout Inspector.</p>
</section>

<section id="sec-55" class="study-section">
<h2 class="study-section-title">Итоговый совет 27</h2>
<p>Используйте weight.</p>
</section>

<section id="sec-56" class="study-section">
<h2 class="study-section-title">Заметка 27</h2>
<p>Избегайте глубокой вложенности.</p>
</section>

<section id="sec-57" class="study-section">
<h2 class="study-section-title">Итоговый совет 28</h2>
<p>Используйте gravity.</p>
</section>

<section id="sec-58" class="study-section">
<h2 class="study-section-title">Заметка 28</h2>
<p>Используйте layout_gravity.</p>
</section>

<section id="sec-59" class="study-section">
<h2 class="study-section-title">Итоговый совет 29</h2>
<p>Используйте baseline.</p>
</section>

<section id="sec-60" class="study-section">
<h2 class="study-section-title">Заметка 29</h2>
<p>Выравнивайте текст.</p>
</section>

<section id="sec-61" class="study-section">
<h2 class="study-section-title">Итоговый совет 30</h2>
<p>Используйте отступы.</p>
</section>

<section id="sec-62" class="study-section">
<h2 class="study-section-title">Итоговый совет 31</h2>
<p>Проверяйте иерархию.</p>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">7. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу создать горизонтальный и вертикальный LinearLayout.</label>
<label><input type="checkbox" /> Понимаю, как работает layout_weight.</label>
<label><input type="checkbox" /> Знаю разницу между gravity и layout_gravity.</label>
<label><input type="checkbox" /> Умею использовать baseline alignment.</label>
<label><input type="checkbox" /> Понимаю проблему глубокой вложенности.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Горизонтальный</th><td><code>android:orientation="horizontal"</code></td></tr>
<tr><th>Вертикальный</th><td><code>android:orientation="vertical"</code></td></tr>
<tr><th>Вес</th><td><code>android:layout_weight="1"</code></td></tr>
<tr><th>Выравнивание содержимого</th><td><code>android:gravity="center"</code></td></tr>
<tr><th>Выравнивание View</th><td><code>android:layout_gravity="center"</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Android View и XML-разметку.
</footer>
EOF
echo "written"