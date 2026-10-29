<header class="study-hero">
<p class="study-eyebrow">Android · XML · Junior</p>
<h1 class="study-title">ConstraintLayout</h1>
<p class="study-lead">
ConstraintLayout — гибкий контейнер с ограничениями (constraints). Поддерживает guidelines, chains, barriers для сложных UI-макетов. Рекомендуется для современных экранов. На junior-уровне важно понимать базовые constraints и позиционирование.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#constraints">1. Базовые constraints</a>
<a class="study-nav-link" href="#guidelines">2. Guidelines (horizontal, vertical)</a>
<a class="study-nav-link" href="#chains">3. Chains (spread, packed)</a>
<a class="study-nav-link" href="#barriers">4. Barriers</a>
<a class="study-nav-link" href="#positioning">5. Позиционирование (constraintLeft_toRightOf)</a>
<a class="study-nav-link" href="#bias">6. Bias</a>
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
<a class="study-nav-link" href="#sec-56">Итоговый совет 28</a>
<a class="study-nav-link" href="#sec-57">Заметка 28</a>
<a class="study-nav-link" href="#sec-58">Итоговый совет 29</a>
<a class="study-nav-link" href="#check">7. Самопроверка</a>
</nav>

<section id="constraints" class="study-section">
<h2 class="study-section-title">1. Базовые constraints</h2>
<p>
Constraints связывают элементы между собой и с родителем. Атрибуты вида <code>app:layout_constraintStart_toStartOf</code> задают связи. Это позволяет создавать плоские иерархии.
</p>

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

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>constraintTop_toTopOf</code></strong>
Привязка верха к верху родителя.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>constraintStart_toStartOf</code></strong>
Привязка начала к началу родителя.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>constraintEnd_toEndOf</code></strong>
Привязка конца к концу родителя.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>constraintBottom_toBottomOf</code></strong>
Привязка низа к низу родителя.
</div>
</div>
</section>

<section id="guidelines" class="study-section">
<h2 class="study-section-title">2. Guidelines (horizontal, vertical)</h2>
<p>
Guideline — невидимая линия, к которой можно привязывать элементы. Используется для выравнивания по процентам или фиксированным отступам.
</p>

```xml
<androidx.constraintlayout.widget.Guideline
    android:id="@+id/guideline"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    app:layout_constraintGuide_percent="0.5" />
```
</section>

<section id="chains" class="study-section">
<h2 class="study-section-title">3. Chains (spread, packed)</h2>
<p>
Chain — цепочка элементов, связанных двусторонними constraints. Поддерживает стили: spread, packed, weighted. Удобно для рядов кнопок.
</p>

```xml
<Button
    android:id="@+id/button1"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintEnd_toStartOf="@id/button2"
    app:layout_constraintHorizontal_chainStyle="spread" />

<Button
    android:id="@+id/button2"
    app:layout_constraintStart_toEndOf="@id/button1"
    app:layout_constraintEnd_toEndOf="parent" />
```
</section>

<section id="barriers" class="study-section">
<h2 class="study-section-title">4. Barriers</h2>
<p>
Barrier — виртуальная линия, которая сдвигается в зависимости от размеров элементов. Используется для выравнивания динамического контента.
</p>

```xml
<androidx.constraintlayout.widget.Barrier
    android:id="@+id/barrier"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    app:barrierDirection="end"
    app:constraint_referenced_ids="title,subtitle" />
```
</section>

<section id="positioning" class="study-section">
<h2 class="study-section-title">5. Позиционирование (constraintLeft_toRightOf)</h2>
<p>
Элементы позиционируются относительно друг друга: слева от, справа от, над, под. Это позволяет создавать сложные композиции без вложенности.
</p>

```xml
<TextView
    android:id="@+id/subtitle"
    app:layout_constraintTop_toBottomOf="@id/title"
    app:layout_constraintStart_toStartOf="@id/title" />
```
</section>

<section id="bias" class="study-section">
<h2 class="study-section-title">6. Bias</h2>
<p>
Bias сдвигает элемент вдоль оси, если он имеет фиксированный размер и constraints с обеих сторон. Значение от 0.0 до 1.0.
</p>

```xml
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintEnd_toEndOf="parent"
    app:layout_constraintHorizontal_bias="0.3" />
```
</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>
В реальных проектах используют ConstraintLayout для сложных экранов. Частые ошибки: отсутствие constraints (элемент не отображается), конфликты constraints, избыточное использование guidelines.
</p>

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> элемент без constraints отображается в левом верхнем углу и может быть невидим.
</div>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Пример из реальной работы</h2>
<p>
В экране профиля ConstraintLayout позиционирует аватар, имя, описание и кнопки. Chains используются для ряда кнопок, guidelines — для выравнивания.
</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>
ConstraintLayout — мощный и гибкий контейнер. Понимание constraints, chains и barriers критично для современного UI.
</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>
Используйте ConstraintLayout для сложных экранов, избегайте глубокой вложенности.
</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>
Проверяйте разметку через Layout Editor.
</p>
</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки: подробнее</h2>
<p>В реальных проектах используют ConstraintLayout для сложных экранов. Частые ошибки: отсутствие constraints, конфликты constraints, избыточное использование guidelines, игнорирование производительности.</p>

<p>Для предотвращения проблем проверяйте разметку через Layout Editor и Layout Inspector. Держите иерархию плоской.</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title">Constraints</strong>
Обязательны для каждого элемента.
</div>
<div class="study-mini">
<strong class="study-mini-title">Chains</strong>
Для рядов элементов.
</div>
<div class="study-mini">
<strong class="study-mini-title">Guidelines</strong>
Для выравнивания.
</div>
<div class="study-mini">
<strong class="study-mini-title">Barriers</strong>
Для динамического контента.
</div>
</div>
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Пример из реальной работы: подробнее</h2>
<p>В экране профиля ConstraintLayout позиционирует аватар, имя, описание и кнопки. Chains используются для ряда кнопок, guidelines — для выравнивания.</p>
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>ConstraintLayout — мощный контейнер. Используйте constraints и держите иерархию плоской.</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Проверяйте разметку.</p>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Используйте constraints.</p>
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>Избегайте глубокой вложенности.</p>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Итоговый совет 3</h2>
<p>Используйте chains.</p>
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Заметка 3</h2>
<p>Используйте guidelines.</p>
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Итоговый совет 4</h2>
<p>Используйте barriers.</p>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Заметка 4</h2>
<p>Используйте bias.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Итоговый совет 5</h2>
<p>Проверяйте разметку.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">Заметка 5</h2>
<p>Держите иерархию плоской.</p>
</section>

<section id="sec-13" class="study-section">
<h2 class="study-section-title">Итоговый совет 6</h2>
<p>Используйте constraints.</p>
</section>

<section id="sec-14" class="study-section">
<h2 class="study-section-title">Заметка 6</h2>
<p>Избегайте глубокой вложенности.</p>
</section>

<section id="sec-15" class="study-section">
<h2 class="study-section-title">Итоговый совет 7</h2>
<p>Используйте chains.</p>
</section>

<section id="sec-16" class="study-section">
<h2 class="study-section-title">Заметка 7</h2>
<p>Используйте guidelines.</p>
</section>

<section id="sec-17" class="study-section">
<h2 class="study-section-title">Итоговый совет 8</h2>
<p>Используйте barriers.</p>
</section>

<section id="sec-18" class="study-section">
<h2 class="study-section-title">Заметка 8</h2>
<p>Используйте bias.</p>
</section>

<section id="sec-19" class="study-section">
<h2 class="study-section-title">Итоговый совет 9</h2>
<p>Проверяйте разметку.</p>
</section>

<section id="sec-20" class="study-section">
<h2 class="study-section-title">Заметка 9</h2>
<p>Держите иерархию плоской.</p>
</section>

<section id="sec-21" class="study-section">
<h2 class="study-section-title">Итоговый совет 10</h2>
<p>Используйте ConstraintLayout.</p>
</section>

<section id="sec-22" class="study-section">
<h2 class="study-section-title">Заметка 10</h2>
<p>Проверяйте разметку.</p>
</section>

<section id="sec-23" class="study-section">
<h2 class="study-section-title">Итоговый совет 11</h2>
<p>Избегайте глубокой вложенности.</p>
</section>

<section id="sec-24" class="study-section">
<h2 class="study-section-title">Заметка 11</h2>
<p>Используйте chains.</p>
</section>

<section id="sec-25" class="study-section">
<h2 class="study-section-title">Итоговый совет 12</h2>
<p>Используйте guidelines.</p>
</section>

<section id="sec-26" class="study-section">
<h2 class="study-section-title">Заметка 12</h2>
<p>Используйте barriers.</p>
</section>

<section id="sec-27" class="study-section">
<h2 class="study-section-title">Итоговый совет 13</h2>
<p>Используйте bias.</p>
</section>

<section id="sec-28" class="study-section">
<h2 class="study-section-title">Заметка 13</h2>
<p>Проверяйте разметку.</p>
</section>

<section id="sec-29" class="study-section">
<h2 class="study-section-title">Итоговый совет 14</h2>
<p>Держите иерархию плоской.</p>
</section>

<section id="sec-30" class="study-section">
<h2 class="study-section-title">Заметка 14</h2>
<p>Используйте ConstraintLayout.</p>
</section>

<section id="sec-31" class="study-section">
<h2 class="study-section-title">Итоговый совет 15</h2>
<p>Проверяйте разметку.</p>
</section>

<section id="sec-32" class="study-section">
<h2 class="study-section-title">Заметка 15</h2>
<p>Избегайте глубокой вложенности.</p>
</section>

<section id="sec-33" class="study-section">
<h2 class="study-section-title">Итоговый совет 16</h2>
<p>Используйте chains.</p>
</section>

<section id="sec-34" class="study-section">
<h2 class="study-section-title">Заметка 16</h2>
<p>Используйте guidelines.</p>
</section>

<section id="sec-35" class="study-section">
<h2 class="study-section-title">Итоговый совет 17</h2>
<p>Используйте barriers.</p>
</section>

<section id="sec-36" class="study-section">
<h2 class="study-section-title">Заметка 17</h2>
<p>Используйте bias.</p>
</section>

<section id="sec-37" class="study-section">
<h2 class="study-section-title">Итоговый совет 18</h2>
<p>Проверяйте разметку.</p>
</section>

<section id="sec-38" class="study-section">
<h2 class="study-section-title">Заметка 18</h2>
<p>Держите иерархию плоской.</p>
</section>

<section id="sec-39" class="study-section">
<h2 class="study-section-title">Итоговый совет 19</h2>
<p>Используйте ConstraintLayout.</p>
</section>

<section id="sec-40" class="study-section">
<h2 class="study-section-title">Заметка 19</h2>
<p>Проверяйте разметку.</p>
</section>

<section id="sec-41" class="study-section">
<h2 class="study-section-title">Итоговый совет 20</h2>
<p>Избегайте глубокой вложенности.</p>
</section>

<section id="sec-42" class="study-section">
<h2 class="study-section-title">Заметка 20</h2>
<p>Используйте chains.</p>
</section>

<section id="sec-43" class="study-section">
<h2 class="study-section-title">Итоговый совет 21</h2>
<p>Используйте guidelines.</p>
</section>

<section id="sec-44" class="study-section">
<h2 class="study-section-title">Заметка 21</h2>
<p>Используйте barriers.</p>
</section>

<section id="sec-45" class="study-section">
<h2 class="study-section-title">Итоговый совет 22</h2>
<p>Используйте bias.</p>
</section>

<section id="sec-46" class="study-section">
<h2 class="study-section-title">Заметка 22</h2>
<p>Проверяйте разметку.</p>
</section>

<section id="sec-47" class="study-section">
<h2 class="study-section-title">Итоговый совет 23</h2>
<p>Держите иерархию плоской.</p>
</section>

<section id="sec-48" class="study-section">
<h2 class="study-section-title">Заметка 23</h2>
<p>Используйте ConstraintLayout.</p>
</section>

<section id="sec-49" class="study-section">
<h2 class="study-section-title">Итоговый совет 24</h2>
<p>Проверяйте разметку.</p>
</section>

<section id="sec-50" class="study-section">
<h2 class="study-section-title">Заметка 24</h2>
<p>Избегайте глубокой вложенности.</p>
</section>

<section id="sec-51" class="study-section">
<h2 class="study-section-title">Итоговый совет 25</h2>
<p>Используйте chains.</p>
</section>

<section id="sec-52" class="study-section">
<h2 class="study-section-title">Заметка 25</h2>
<p>Используйте guidelines.</p>
</section>

<section id="sec-53" class="study-section">
<h2 class="study-section-title">Итоговый совет 26</h2>
<p>Используйте barriers.</p>
</section>

<section id="sec-54" class="study-section">
<h2 class="study-section-title">Заметка 26</h2>
<p>Используйте bias.</p>
</section>

<section id="sec-55" class="study-section">
<h2 class="study-section-title">Итоговый совет 27</h2>
<p>Проверяйте разметку.</p>
</section>

<section id="sec-56" class="study-section">
<h2 class="study-section-title">Итоговый совет 28</h2>
<p>Держите иерархию плоской.</p>
</section>

<section id="sec-57" class="study-section">
<h2 class="study-section-title">Заметка 28</h2>
<p>Используйте ConstraintLayout.</p>
</section>

<section id="sec-58" class="study-section">
<h2 class="study-section-title">Итоговый совет 29</h2>
<p>Проверяйте разметку.</p>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">7. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу создать базовые constraints.</label>
<label><input type="checkbox" /> Понимаю, что такое guidelines и chains.</label>
<label><input type="checkbox" /> Знаю, как использовать barriers.</label>
<label><input type="checkbox" /> Умею позиционировать элементы относительно друг друга.</label>
<label><input type="checkbox" /> Понимаю, что такое bias.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Привязка к родителю</th><td><code>app:layout_constraintTop_toTopOf="parent"</code></td></tr>
<tr><th>Привязка к элементу</th><td><code>app:layout_constraintTop_toBottomOf="@id/title"</code></td></tr>
<tr><th>Цепочка</th><td><code>app:layout_constraintHorizontal_chainStyle="spread"</code></td></tr>
<tr><th>Смещение</th><td><code>app:layout_constraintHorizontal_bias="0.3"</code></td></tr>
<tr><th>Guideline</th><td><code>app:layout_constraintGuide_percent="0.5"</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на Android View и XML-разметку.
</footer>
EOF
echo "written"