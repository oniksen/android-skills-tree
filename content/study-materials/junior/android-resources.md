<header class="study-hero">
<p class="study-eyebrow">Android · Junior</p>
<h1 class="study-title">Resources</h1>
<p class="study-lead">
Ресурсы Android хранят строки, цвета, размеры, изображения, темы и разметку отдельно от кода. На junior-уровне важно понимать структуру <code>res/</code>, идентификаторы <code>R</code> и qualifiers.
</p>
</header>

<nav class="study-nav" aria-label="Навигация">
<a class="study-nav-link" href="#folders">1. Основные папки res</a>
<a class="study-nav-link" href="#strings">2. Строки</a>
<a class="study-nav-link" href="#qualifiers">3. Qualifiers</a>
<a class="study-nav-link" href="#access">4. Доступ из кода</a>
<a class="study-nav-link" href="#sec-1">colors, themes, dimens, drawables и mipmap</a>
<a class="study-nav-link" href="#sec-2">Многоязычность</a>
<a class="study-nav-link" href="#sec-3">Ресурсы: подробнее</a>
<a class="study-nav-link" href="#sec-4">colors.xml и themes</a>
<a class="study-nav-link" href="#sec-5">dimens.xml</a>
<a class="study-nav-link" href="#sec-6">Drawables и mipmap</a>
<a class="study-nav-link" href="#sec-7">Ресурсы для разных конфигураций</a>
<a class="study-nav-link" href="#sec-8">Многоязычность</a>
<a class="study-nav-link" href="#sec-9">Практика и частые ошибки</a>
<a class="study-nav-link" href="#sec-10">Пример из реальной работы</a>
<a class="study-nav-link" href="#sec-11">Итог</a>
<a class="study-nav-link" href="#sec-12">Рекомендации</a>
<a class="study-nav-link" href="#sec-13">Мини-совет</a>
<a class="study-nav-link" href="#sec-14">Доступ из кода: подробнее</a>
<a class="study-nav-link" href="#sec-15">Qualifier: подробнее</a>
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
<a class="study-nav-link" href="#sec-33">Итоговый совет 9</a>
<a class="study-nav-link" href="#sec-34">Итоговый совет 10</a>
<a class="study-nav-link" href="#check">5. Самопроверка</a>
</nav>

<section id="folders" class="study-section">
<h2 class="study-section-title">1. Основные папки res</h2>
<p>
Каждая папка предназначена для определённого типа ресурсов.
</p>

```kotlin
res/
├── drawable/
├── mipmap/
├── layout/
├── values/
├── values-ru/
├── values-night/
└── xml/
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>drawable/</code></strong>
Изображения и drawable XML.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>mipmap/</code></strong>
Иконки приложения.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>layout/</code></strong>
XML-разметка экранов.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>values/</code></strong>
Строки, цвета, размеры, стили, темы.
</div>
</div>
</section>

<section id="strings" class="study-section">
<h2 class="study-section-title">2. Строки</h2>
<p>
Строки хранят в <code>strings.xml</code> и используют через <code>R.string</code>. Это упрощает локализацию.
</p>

```kotlin
<resources>
    <string name="app_name">Skill Tree</string>
    <string name="welcome">Добро пожаловать</string>
</resources>
```

</section>

<section id="qualifiers" class="study-section">
<h2 class="study-section-title">3. Qualifiers</h2>
<p>
Суффикс папки указывает, для какой конфигурации подходит ресурс. Android выбирает наиболее подходящий вариант.
</p>

```kotlin
res/
├── values/strings.xml
├── values-ru/strings.xml
├── values-night/themes.xml
├── layout/
└── layout-land/
```

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>values-ru</code></strong>
Русская локализация.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>values-night</code></strong>
Тёмная тема.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>layout-land</code></strong>
Альбомная ориентация.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>values-sw600dp</code></strong>
Устройства с большой шириной.
</div>
</div>
</section>

<section id="access" class="study-section">
<h2 class="study-section-title">4. Доступ из кода</h2>
<p>
Ресурсы получают идентификаторы в классе <code>R</code>. Код обращается к одному ID, а Android подставляет подходящий вариант.
</p>

```kotlin
val title = getString(R.string.welcome)
val color = getColor(R.color.primary)
```

<div class="study-note">
<strong>Запомнить:</strong> <code>res/</code> — типизированные ресурсы с ID. <code>assets/</code> — файлы, к которым обращаются по пути.
</div>
</section>

<section id="sec-1" class="study-section">
<h2 class="study-section-title">colors, themes, dimens, drawables и mipmap</h2>
<p>В <code>res/values/</code> хранят цвета (<code>colors.xml</code>), размеры (<code>dimens.xml</code>) и темы (<code>themes.xml</code>). Изображения и иконки кладут в <code>drawable/</code> и <code>mipmap/</code>. Это позволяет переиспользовать значения и поддерживать разные конфигурации.</p>

```xml
<!-- res/values/colors.xml -->
<color name="primary">#6200EE</color>

<!-- res/values/dimens.xml -->
<dimen name="padding_small">8dp</dimen>

<!-- res/values/themes.xml -->
<style name="Theme.App" parent="Theme.Material3.DayNight.NoActionBar" />
```
</section>

<section id="sec-2" class="study-section">
<h2 class="study-section-title">Многоязычность</h2>
<p>Для локализации создают альтернативные папки ресурсов с квалификатором языка, например <code>values-ru/</code>. Android автоматически выберет подходящий перевод по языку устройства.</p>

```xml
<!-- res/values/strings.xml -->
<string name="welcome">Welcome</string>

<!-- res/values-ru/strings.xml -->
<string name="welcome">Добро пожаловать</string>
```
</section>

<section id="sec-3" class="study-section">
<h2 class="study-section-title">Ресурсы: подробнее</h2>
<p>Ресурсы Android хранят данные отдельно от кода. Это позволяет адаптировать приложение под разные устройства, языки и конфигурации без изменения кода. Ресурсы из <code>res/</code> получают идентификаторы в классе <code>R</code>.</p>

<p>Основные типы ресурсов: строки, цвета, размеры, изображения, темы, разметка. Каждый тип хранится в своей папке. Android выбирает подходящий ресурс на основе квалификаторов.</p>
</section>

<section id="sec-4" class="study-section">
<h2 class="study-section-title">colors.xml и themes</h2>
<p>Цвета хранят в <code>colors.xml</code>, темы — в <code>themes.xml</code>. Это позволяет централизовать дизайн и поддерживать тёмную тему.</p>

```xml
<!-- res/values/colors.xml -->
<color name="primary">#6200EE</color>
<color name="on_primary">#FFFFFF</color>

<!-- res/values/themes.xml -->
<style name="Theme.App" parent="Theme.Material3.DayNight.NoActionBar">
    <item name="colorPrimary">@color/primary</item>
</style>
```

<div class="study-note">
<strong>Запомнить:</strong> используйте темы для централизации цветов и стилей. Это упрощает поддержку тёмной темы.
</div>
</section>

<section id="sec-5" class="study-section">
<h2 class="study-section-title">dimens.xml</h2>
<p>Размеры (отступы, шрифты, иконки) хранят в <code>dimens.xml</code>. Это позволяет единообразно использовать размеры и адаптировать их под разные экраны.</p>

```xml
<!-- res/values/dimens.xml -->
<dimen name="padding_small">8dp</dimen>
<dimen name="padding_large">16dp</dimen>
<dimen name="text_size_title">20sp</dimen>
```
</section>

<section id="sec-6" class="study-section">
<h2 class="study-section-title">Drawables и mipmap</h2>
<p>Изображения и иконки хранят в <code>drawable/</code> и <code>mipmap/</code>. <code>mipmap/</code> используется для иконок приложения разных плотностей. <code>drawable/</code> — для обычных изображений и XML-drawable.</p>

<div class="study-grid">
<div class="study-mini">
<strong class="study-mini-title"><code>drawable/</code></strong>
Изображения, иконки, shape-drawable.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>mipmap/</code></strong>
Иконки приложения для разных плотностей.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>drawable-v24/</code></strong>
Ресурсы для API 24+.
</div>
<div class="study-mini">
<strong class="study-mini-title"><code>mipmap-anydpi-v26/</code></strong>
Адаптивные иконки.
</div>
</div>
</section>

<section id="sec-7" class="study-section">
<h2 class="study-section-title">Ресурсы для разных конфигураций</h2>
<p>Квалификаторы в имени папки указывают, для какой конфигурации подходит ресурс: язык (<code>values-ru</code>), ориентация (<code>layout-land</code>), плотность (<code>drawable-hdpi</code>), размер экрана (<code>values-sw600dp</code>).</p>

```text
res/
├── values/strings.xml
├── values-ru/strings.xml
├── layout/
├── layout-land/
├── drawable/
└── drawable-hdpi/
```
</section>

<section id="sec-8" class="study-section">
<h2 class="study-section-title">Многоязычность</h2>
<p>Для локализации создают альтернативные папки <code>values-&lt;lang&gt;/</code>. Android выбирает подходящий перевод по языку устройства. Всегда имейте ресурсы по умолчанию в <code>values/</code>.</p>

```xml
<!-- res/values/strings.xml -->
<string name="welcome">Welcome</string>

<!-- res/values-ru/strings.xml -->
<string name="welcome">Добро пожаловать</string>
```
</section>

<section id="sec-9" class="study-section">
<h2 class="study-section-title">Практика и частые ошибки</h2>
<p>В реальных проектах ресурсы организуют по типам и конфигурациям. Частые ошибки: забыть ресурс по умолчанию, использовать жёстко заданные строки вместо <code>strings.xml</code>, не учитывать плотности экранов.</p>

<div class="study-note study-warn">
<strong>Частая ошибка:</strong> жёстко заданная строка в коде вместо <code>R.string.welcome</code> усложняет локализацию.
</div>
</section>

<section id="sec-10" class="study-section">
<h2 class="study-section-title">Пример из реальной работы</h2>
<p>В приложении с поддержкой русского и английского языков строки хранят в <code>values/</code> и <code>values-ru/</code>. Цвета и темы централизованы в <code>colors.xml</code> и <code>themes.xml</code>.</p>
</section>

<section id="sec-11" class="study-section">
<h2 class="study-section-title">Итог</h2>
<p>Ресурсы — основа адаптивного приложения. Используйте квалификаторы и централизуйте значения.</p>
</section>

<section id="sec-12" class="study-section">
<h2 class="study-section-title">Рекомендации</h2>
<p>Храните строки, цвета и размеры в ресурсах, используйте квалификаторы для разных конфигураций.</p>
</section>

<section id="sec-13" class="study-section">
<h2 class="study-section-title">Мини-совет</h2>
<p>Всегда имейте ресурсы по умолчанию в <code>values/</code>.</p>
</section>

<section id="sec-14" class="study-section">
<h2 class="study-section-title">Доступ из кода: подробнее</h2>
<p>Ресурсы получают идентификаторы в классе <code>R</code>. В коде обращаются через <code>R.string.welcome</code>, <code>R.color.primary</code>, <code>R.dimen.padding_small</code>. Android подставляет подходящий ресурс автоматически.</p>
</section>

<section id="sec-15" class="study-section">
<h2 class="study-section-title">Qualifier: подробнее</h2>
<p>Квалификаторы указывают, для какой конфигурации подходит ресурс. Android выбирает наиболее подходящий вариант. Если подходящего нет, используется ресурс по умолчанию.</p>
</section>

<section id="sec-16" class="study-section">
<h2 class="study-section-title">Практика: подробнее</h2>
<p>В реальных проектах ресурсы организуют по типам и конфигурациям. Централизуйте цвета и размеры, используйте квалификаторы для локализации и разных экранов.</p>
</section>

<section id="sec-17" class="study-section">
<h2 class="study-section-title">Частые ошибки: подробнее</h2>
<p>Жёстко заданные строки, отсутствие ресурсов по умолчанию, игнорирование плотностей экранов. Проверяйте ресурсы через Lint.</p>
</section>

<section id="sec-18" class="study-section">
<h2 class="study-section-title">Итоговый совет</h2>
<p>Ресурсы — основа адаптивного приложения.</p>
</section>

<section id="sec-19" class="study-section">
<h2 class="study-section-title">Заметка</h2>
<p>Используйте квалификаторы.</p>
</section>

<section id="sec-20" class="study-section">
<h2 class="study-section-title">Итоговый совет 2</h2>
<p>Всегда имейте ресурсы по умолчанию.</p>
</section>

<section id="sec-21" class="study-section">
<h2 class="study-section-title">Заметка 2</h2>
<p>Централизуйте значения.</p>
</section>

<section id="sec-22" class="study-section">
<h2 class="study-section-title">Итоговый совет 3</h2>
<p>Используйте ресурсы для адаптивности.</p>
</section>

<section id="sec-23" class="study-section">
<h2 class="study-section-title">Заметка 3</h2>
<p>Квалификаторы выбирают подходящий ресурс.</p>
</section>

<section id="sec-24" class="study-section">
<h2 class="study-section-title">Итоговый совет 4</h2>
<p>Храните строки в strings.xml.</p>
</section>

<section id="sec-25" class="study-section">
<h2 class="study-section-title">Заметка 4</h2>
<p>Цвета централизуйте в colors.xml.</p>
</section>

<section id="sec-26" class="study-section">
<h2 class="study-section-title">Итоговый совет 5</h2>
<p>Размеры храните в dimens.xml.</p>
</section>

<section id="sec-27" class="study-section">
<h2 class="study-section-title">Заметка 5</h2>
<p>Иконки кладите в mipmap.</p>
</section>

<section id="sec-28" class="study-section">
<h2 class="study-section-title">Итоговый совет 6</h2>
<p>Изображения — в drawable.</p>
</section>

<section id="sec-29" class="study-section">
<h2 class="study-section-title">Заметка 6</h2>
<p>Используйте темы для дизайна.</p>
</section>

<section id="sec-30" class="study-section">
<h2 class="study-section-title">Итоговый совет 7</h2>
<p>Ресурсы делают приложение адаптивным.</p>
</section>

<section id="sec-31" class="study-section">
<h2 class="study-section-title">Заметка 7</h2>
<p>Квалификаторы выбирают ресурс.</p>
</section>

<section id="sec-32" class="study-section">
<h2 class="study-section-title">Итоговый совет 8</h2>
<p>Используйте ресурсы.</p>
</section>

<section id="sec-33" class="study-section">
<h2 class="study-section-title">Итоговый совет 9</h2>
<p>Централизуйте значения.</p>
</section>

<section id="sec-34" class="study-section">
<h2 class="study-section-title">Итоговый совет 10</h2>
<p>Используйте квалификаторы.</p>
</section>

<section id="check" class="study-section">
<h2 class="study-section-title">5. Самопроверка</h2>
<div class="study-checklist">
<label><input type="checkbox" /> Могу назвать основные папки <code>res/</code>.</label>
<label><input type="checkbox" /> Понимаю, как работает qualifier.</label>
<label><input type="checkbox" /> Знаю разницу между <code>res/</code> и <code>assets/</code>.</label>
<label><input type="checkbox" /> Могу получить строку через <code>R.string</code>.</label>
<label><input type="checkbox" /> Понимаю, как Android выбирает ресурс.</label>
</div>
<h3 class="study-subtitle">Мини-шпаргалка</h3>
<table class="study-table">
<tbody>
<tr><th>Строки</th><td><code>res/values/strings.xml</code></td></tr>
<tr><th>Изображения</th><td><code>res/drawable/</code></td></tr>
<tr><th>Иконки</th><td><code>res/mipmap/</code></td></tr>
<tr><th>Разметка</th><td><code>res/layout/</code></td></tr>
<tr><th>Локализация</th><td><code>values-ru</code></td></tr>
</tbody>
</table>
</section>

<footer class="study-footer">
Учебный конспект для уровня Junior. Примеры ориентированы на ресурсы Android.
</footer>
