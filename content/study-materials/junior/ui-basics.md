# UI в Android: View и Jetpack Compose

**Уровень:** Junior  
**Категория:** UI Basics (XML)  
**Язык:** Kotlin  
**Кратко:** Классические View, адаптивная разметка, Material 3 и первые шаги в Jetpack Compose.

## 1. TextView {#textview}

TextView — базовый элемент для отображения текста в Android. В мире View это `android.widget.TextView`, который описывается в XML-разметке и настраивается атрибутами. В Jetpack Compose та же задача решается composable-функцией `Text`, где текст, стиль и поведение передаются параметрами, а не атрибутами. Понимание классического TextView важно: большинство существующих проектов и библиотек построены на View, а Compose часто встраивается в них через `ComposeView`.

> **Ключевая идея:** текст в Android — это не просто строка, а объект с метриками, стилем и правилами переноса. Настройки шрифта, размера и цвета должны жить в ресурсах и теме, а не в коде.

### 1.1. Основные XML-атрибуты {#textview-basic-attrs}

Основные атрибуты TextView задают содержимое и базовое поведение. `android:text` принимает строку или ссылку на строковый ресурс (`@string/...`). `android:id` нужен для доступа из кода. `android:layout_width` и `android:layout_height` определяют размер; для текста обычно `wrap_content`. `android:padding` задаёт внутренние отступы, `android:gravity` — выравнивание текста внутри View.

```xml
<TextView
    android:id="@+id/titleText"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/app_name"
    android:padding="16dp"
    android:gravity="center" />
```

В Compose эквивалент — параметры `Text`: `text`, `modifier = Modifier.padding(...)`, `textAlign`. Идентификатор не нужен, так как состояние хранится в переменных Kotlin.

```kotlin
Text(
    text = stringResource(R.string.app_name),
    modifier = Modifier.padding(16.dp),
    textAlign = TextAlign.Center
)
```

Типичная ошибка: жёстко задавать текст через `android:text="Hello"` вместо строкового ресурса — тогда строку нельзя перевести и переиспользовать.

### 1.2. Размер и цвет текста {#textview-size-color}

Размер задаётся в `sp` (масштабируемые пиксели), чтобы учитывать настройки шрифта пользователя. Атрибут `android:textSize="16sp"`. Цвет — `android:textColor="@color/..."` или напрямую `#RRGGBB`. Лучше использовать цветовые атрибуты темы (`?attr/colorOnSurface`), чтобы поддерживать тёмную тему.

```xml
<TextView
    android:textSize="16sp"
    android:textColor="?attr/colorOnSurface" />
```

В Compose размер и цвет передаются явно или через `MaterialTheme.typography`:

```kotlin
Text(
    text = "Заголовок",
    style = MaterialTheme.typography.titleMedium,
    color = MaterialTheme.colorScheme.onSurface
)
```

Типичная ошибка: использовать `dp` вместо `sp` для текста — тогда текст не масштабируется при изменении размера шрифта в системе.

### 1.3. Typeface и textStyle {#textview-typeface}

`android:textStyle` задаёт начертание: `normal`, `bold`, `italic`. `android:fontFamily` указывает семейство шрифтов (системное или из ресурсов `font/`). `android:typeface` — устаревший способ выбора `sans`, `serif`, `monospace`.

```xml
<TextView
    android:textStyle="bold|italic"
    android:fontFamily="@font/roboto_medium" />
```

В Compose начертание и шрифт задаются через `FontWeight`, `FontStyle`, `fontFamily`:

```kotlin
Text(
    text = "Жирный курсив",
    fontWeight = FontWeight.Bold,
    fontStyle = FontStyle.Italic,
    fontFamily = FontFamily(Font(R.font.roboto_medium))
)
```

Лучше выносить шрифты в `TypeScale` темы Material 3 и обращаться к `MaterialTheme.typography`, чтобы не дублировать значения.

### 1.4. Многострочный текст {#textview-multiline}

TextView по умолчанию переносит текст по словам на несколько строк. Управлять межстрочным интервалом можно через `android:lineSpacingMultiplier` (множитель) и `android:lineSpacingExtra` (дополнительные dp). `android:breakStrategy` и `android:hyphenationFrequency` влияют на качество переноса на новых версиях Android.

```xml
<TextView
    android:lineSpacingMultiplier="1.2"
    android:lineSpacingExtra="4dp" />
```

В Compose межстрочный интервал задаётся параметром `lineHeight` в `TextStyle`:

```kotlin
Text(
    text = "Длинный текст...",
    style = MaterialTheme.typography.bodyMedium.copy(lineHeight = 24.sp)
)
```

Типичная ошибка: ожидать, что `maxLines` ограничивает высоту контейнера, а не количество строк — при `maxLines="2"` текст всё равно может занимать больше места, если строки высокие.

### 1.5. maxLines и ellipsize {#textview-maxlines-ellipsize}

`android:maxLines` ограничивает количество отображаемых строк. `android:ellipsize` добавляет многоточие при обрезке: `end`, `start`, `middle`, `marquee`. Часто комбинируют `maxLines="1"` и `ellipsize="end"` для однострочных заголовков.

```xml
<TextView
    android:maxLines="2"
    android:ellipsize="end" />
```

В Compose то же делают через `maxLines` и `overflow`:

```kotlin
Text(
    text = "Очень длинный заголовок",
    maxLines = 2,
    overflow = TextOverflow.Ellipsis
)
```

`marquee` в View требует `android:singleLine="true"` (устаревший) и фокуса; в современном коде лучше использовать анимацию отдельно.

### 1.6. AutoSize TextView {#textview-autosize}

AutoSize позволяет тексту автоматически уменьшаться, чтобы поместиться в заданные границы. В XML включают `android:autoSizeTextType="uniform"` и задают `android:autoSizeMinTextSize`, `android:autoSizeMaxTextSize`, `android:autoSizeStepGranularity`. Контейнер должен иметь фиксированные размеры.

```xml
<TextView
    android:layout_width="200dp"
    android:layout_height="60dp"
    android:autoSizeTextType="uniform"
    android:autoSizeMinTextSize="12sp"
    android:autoSizeMaxTextSize="24sp"
    android:autoSizeStepGranularity="2sp" />
```

В Compose автоподбор размера появился в новых версиях через `BasicText` с `autoSize` или через `Modifier`-расширения библиотек; часто проще управлять размером через состояние и `onTextLayout`.

Типичная ошибка: включать AutoSize при `wrap_content` — тогда текст не будет уменьшаться, так как границы не ограничены.

### 1.7. Выделение и обработка ссылок {#textview-links}

`android:autoLink` автоматически превращает телефоны, email, URL и адреса в кликабельные ссылки. `android:linksClickable="true"` включает обработку. Для сложных сценариев используют `SpannableString` и `ClickableSpan`, а также `Linkify.addLinks`.

```kotlin
val spannable = SpannableString("Позвонить +7 999 000-00-00")
val phoneMatcher = Pattern.compile("\\+7\\s?\\d[\\d\\s-]+")
Linkify.addLinks(spannable, phoneMatcher, "tel:")
textView.text = spannable
textView.movementMethod = LinkMovementMethod.getInstance()
```

В Compose ссылки оформляют через `AnnotatedString` и `LinkAnnotation` (или `ClickableText` в старых версиях):

```kotlin
val annotated = buildAnnotatedString {
    append("Открыть ")
    withLink(LinkAnnotation.Url("https://developer.android.com")) {
        append("документацию")
    }
}
Text(text = annotated)
```

Типичная ошибка: забыть установить `movementMethod = LinkMovementMethod.getInstance()` — тогда ссылки не реагируют на нажатия.

### Типичные ошибки TextView

- Использование `px` или `dp` для размера шрифта вместо `sp`.
- Жёстко заданный текст и цвета без ресурсов и тем.
- `contentDescription` нужен для ImageView и иконок, а не для текстовых View — TalkBack читает сам текст.
- Игнорирование `maxLines`/`ellipsize` в списках, из-за чего строки «прыгают».
- Смешивание `autoLink` и ручных span'ов без `movementMethod`.

### Самопроверка TextView

- [ ] Я могу задать текст, размер, цвет и шрифт через XML и через Compose.
- [ ] Я понимаю разницу между `dp` и `sp`.
- [ ] Я умею ограничивать текст многоточием.
- [ ] Я знаю, как сделать кликабельную ссылку в View и в Compose.
- [ ] Я использую строковые ресурсы, а не литералы.

### Вопросы на собеседовании

:::qa
- **Чем `sp` отличается от `dp` и почему размер текста задают в `sp`?** — `dp` не зависит от плотности экрана, а `sp` дополнительно учитывает пользовательский масштаб шрифта. Если задать размер в `dp`, текст не будет увеличиваться при изменении настройки размера шрифта в системе, что ухудшает доступность.
- **Чем `maxLines` отличается от `ellipsize`?** — `maxLines` ограничивает количество отображаемых строк, а `ellipsize` определяет, как отметить обрезанный текст: многоточием в конце, начале или середине. Их часто комбинируют: `maxLines="1"` с `ellipsize="end"` для однострочных заголовков.
- **Как работает AutoSize TextView и когда он не сработает?** — `android:autoSizeTextType="uniform"` автоматически уменьшает размер текста, чтобы он поместился в заданные границы, в диапазоне `autoSizeMinTextSize`/`autoSizeMaxTextSize`. Он не сработает с `wrap_content`, когда границы не ограничены, — контейнер должен иметь фиксированный размер.
- **Нужен ли `contentDescription` для TextView?** — нет: TalkBack читает сам текст TextView, поэтому `contentDescription` нужен ImageView и иконкам без текста. Лишнее описание у текстового View создаёт дублирующую озвучку.
- **Как сделать кликабельную ссылку в TextView?** — через `android:autoLink` и `linksClickable="true"` для простых телефонов и URL либо через `SpannableString` с `ClickableSpan` и `Linkify.addLinks` для сложных сценариев. В View обязательно нужно установить `movementMethod = LinkMovementMethod.getInstance()`, иначе ссылки не реагируют на нажатия.
- **Как задать межстрочный интервал в TextView?** — в XML используют `android:lineSpacingMultiplier` (множитель) и `android:lineSpacingExtra` (дополнительный отступ), в Compose — параметр `lineHeight` в `TextStyle`. Выбор зависит от того, нужен ли пропорциональный или фиксированный отступ.
- **Почему не стоит хардкодить текст через `android:text="Hello"`?** — такую строку нельзя перевести и переиспользовать, поэтому текст выносят в ресурс `@string/...`. Это упрощает локализацию и поддержку приложения.
:::

## 2. Button {#button}

Button — элемент для запуска действия по нажатию. В View это `android.widget.Button` (наследник TextView) или `MaterialButton` из Material Components. В Compose — composable `Button`, принимающий `onClick` и содержимое (обычно `Text`/`Icon`). Кнопка — центральный элемент взаимодействия, поэтому важно правильно обрабатывать состояния и повторные нажатия.

> **Ключевая идея:** кнопка не должна выполнять долгую работу прямо в обработчике клика. Обработчик только фиксирует намерение пользователя и передаёт его во ViewModel/состояние; сама кнопка отражает состояние (enabled/disabled, прогресс).

### 2.1. Button {#button-basic}

Обычная кнопка отображает текст и реагирует на нажатие. В XML достаточно тега `Button` с атрибутами текста и размера.

```xml
<Button
    android:id="@+id/submitButton"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="@string/submit" />
```

В Compose кнопка описывается декларативно:

```kotlin
Button(onClick = { viewModel.submit() }) {
    Text(stringResource(R.string.submit))
}
```

Стиль по умолчанию берётся из темы: цвет фона, форма, высота. Не стоит переопределять цвета вручную без причины.

### 2.2. ImageButton {#button-imagebutton}

`ImageButton` отображает картинку вместо текста и ведёт себя как кнопка. В XML используют `android:src` для иконки. Важно задать `contentDescription` для доступности.

```xml
<ImageButton
    android:id="@+id/closeButton"
    android:layout_width="48dp"
    android:layout_height="48dp"
    android:src="@drawable/ic_close"
    android:contentDescription="@string/close" />
```

В Compose для кликабельной иконки используют `IconButton`:

```kotlin
IconButton(onClick = { dismiss() }) {
    Icon(Icons.Default.Close, contentDescription = stringResource(R.string.close))
}
```

Типичная ошибка: делать `ImageButton` без `contentDescription` — TalkBack не сможет описать действие.

### 2.3. MaterialButton {#button-materialbutton}

`MaterialButton` из Material Components поддерживает дополнительные стили: `filled`, `outlined`, `text`, `tonal`. Управляется атрибутами `app:cornerRadius`, `app:strokeColor`, `app:icon`, `app:iconGravity`. Material 3 расширяет набор стилей и динамические цвета.

```xml
<com.google.android.material.button.MaterialButton
    android:id="@+id/actionButton"
    style="@style/Widget.Material3.Button.OutlinedButton"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/action"
    app:icon="@drawable/ic_add"
    app:cornerRadius="12dp" />
```

В Compose Material 3 предоставляет `Button`, `OutlinedButton`, `TextButton`, `FilledTonalButton`, `ElevatedButton`:

```kotlin
OutlinedButton(onClick = { }) {
    Icon(Icons.Default.Add, contentDescription = null)
    Spacer(Modifier.width(8.dp))
    Text("Добавить")
}
```

### 2.4. setOnClickListener {#button-click-listener}

Обработка нажатия в View задаётся через `setOnClickListener`:

```kotlin
submitButton.setOnClickListener { view ->
    viewModel.submit()
}
```

Лямбда получает View, но часто параметр не используется. Важно не захватывать тяжёлые объекты в замыкание, чтобы избежать утечек.

В Compose обработчик передаётся параметром `onClick`:

```kotlin
Button(onClick = { viewModel.submit() }) {
    Text("Отправить")
}
```

Поскольку composable пересоздаётся при рекомпозиции, лямбда должна быть стабильной; тяжёлую логику выносят в ViewModel.

### 2.5. Enabled и disabled state {#button-enabled-state}

Состояние кнопки управляется `android:enabled` в XML и `isEnabled` в коде. Отключённая кнопка не реагирует на клики и визуально приглушается (зависит от темы). Важно отключать кнопку, пока форма невалидна или идёт запрос.

```kotlin
submitButton.isEnabled = isFormValid && !isLoading
```

В Compose:

```kotlin
Button(
    onClick = { viewModel.submit() },
    enabled = isFormValid && !isLoading
) {
    Text("Отправить")
}
```

Типичная ошибка: оставлять кнопку активной во время сетевого запроса — пользователь может нажать несколько раз и отправить дубликаты.

### 2.6. Обработка повторных нажатий {#button-debounce}

Быстрые повторные нажатия могут привести к дублированию действий (двойной платёж, двойной переход). В View применяют debounce: запоминают время последнего клика и игнорируют клики в течение интервала.

```kotlin
var lastClickTime = 0L
button.setOnClickListener {
    val now = System.currentTimeMillis()
    if (now - lastClickTime < 500L) return@setOnClickListener
    lastClickTime = now
    viewModel.submit()
}
```

В Compose можно использовать аналогичную проверку в `onClick` или применять `Modifier.pointerInput` с `detectTapGestures`. Часто проще управлять состоянием через `isLoading` и отключать кнопку на время выполнения.

Типичная ошибка: полагаться только на визуальное отключение кнопки без блокировки логики — обработчик всё равно может вызваться повторно из-за гонки.

### 2.7. Стилизация кнопок средствами темы {#button-theme-styling}

Внешний вид кнопок лучше настраивать через тему: `colorPrimary`, `colorOnPrimary`, `shapeAppearanceSmallComponent`, а также стили `Widget.Material3.Button`. Это обеспечивает единообразие и поддержку динамических цветов.

```xml
<style name="Theme.MyApp" parent="Theme.Material3.DayNight.NoActionBar">
    <item name="colorPrimary">@color/purple_500</item>
    <item name="shapeAppearanceSmallComponent">@style/Shape.Small</item>
</style>
```

В Compose стилизация идёт через `MaterialTheme` и параметры `ButtonDefaults`:

```kotlin
Button(
    onClick = { },
    colors = ButtonDefaults.buttonColors(
        containerColor = MaterialTheme.colorScheme.primary
    ),
    shape = MaterialTheme.shapes.small
) {
    Text("OK")
}
```

Типичная ошибка: хардкодить цвета и скругления в каждом месте — при смене темы придётся менять везде.

### Типичные ошибки Button

- Выполнение долгой работы прямо в `setOnClickListener`.
- Отсутствие защиты от повторных нажатий.
- Кнопки без `contentDescription` (для иконок).
- Игнорирование состояния `enabled`.
- Ручная стилизация вместо темы.

### Самопроверка Button

- [ ] Я умею создать Button и ImageButton в XML и Compose.
- [ ] Я обрабатываю клики через setOnClickListener / onClick.
- [ ] Я управляю состоянием enabled/disabled.
- [ ] Я защищаю от двойного нажатия.
- [ ] Я стилизую кнопки через тему, а не хардкодом.

### Вопросы на собеседовании

:::qa
- **Чем отличается `setOnClickListener` от `View.OnClickListener`?** — `View.OnClickListener` — это интерфейс с методом `onClick`, а `setOnClickListener` — метод View, который этот интерфейс устанавливает. В Kotlin обычно передают лямбду: `button.setOnClickListener { ... }`, что короче анонимного объекта.
- **Как защититься от двойного нажатия на кнопку?** — запоминают время последнего клика и игнорируют повторные нажатия в течение интервала (debounce) либо отключают кнопку на время операции через `isEnabled = false`. Надёжнее блокировать именно логику, а не только визуальное состояние, иначе гонка приведёт к дублированию действия.
- **Зачем нужно состояние enabled/disabled у кнопки?** — отключённая кнопка (`android:enabled` / `isEnabled`) не реагирует на клики и визуально приглушается. Её отключают, пока форма невалидна или идёт запрос, чтобы пользователь не отправил данные повторно.
- **Чем `MaterialButton` отличается от обычного `Button`?** — `MaterialButton` из Material Components поддерживает стили `filled`, `outlined`, `text`, `tonal`, атрибуты `app:cornerRadius`, `app:icon`, `app:iconGravity` и читает цвета из темы Material 3. Обычный `Button` — наследник TextView с базовым оформлением из темы.
- **Какая кнопка нужна для кликабельной иконки и почему?** — `ImageButton` в View или `IconButton` в Compose: они отображают drawable вместо текста. Обязательно задавайте `contentDescription`, иначе TalkBack не сможет описать действие.
- **Почему не стоит выполнять долгую работу прямо в обработчике клика?** — обработчик должен только зафиксировать намерение пользователя и передать его во ViewModel или состояние. Долгая работа в `setOnClickListener` блокирует главный поток и может привести к ANR.
- **Как стилизовать кнопки так, чтобы поддержать смену темы?** — через атрибуты темы (`colorPrimary`, `shapeAppearanceSmallComponent`) и готовые стили `Widget.Material3.Button`, а не хардкодом цветов в разметке. В Compose для этого используют `MaterialTheme` и `ButtonDefaults`.
:::

## 3. ImageView {#imageview}

ImageView отображает изображения из ресурсов, файлов и сети. В View это `android.widget.ImageView`; в Compose — composable `Image` (или `AsyncImage` из Coil). Изображения — частый источник проблем с памятью и производительностью, поэтому важно понимать масштабирование, загрузку и кэширование.

> **Ключевая идея:** никогда не держите большие битмапы в памяти без масштабирования и кэширования. Для сетевых изображений используйте Coil (Compose) или Glide (legacy), а не ручную загрузку.

### 3.1. Загрузка изображений из drawable {#imageview-drawable}

Из ресурсов `res/drawable` изображение загружается через `android:src` или программно `setImageResource`.

```xml
<ImageView
    android:id="@+id/logoImage"
    android:layout_width="120dp"
    android:layout_height="120dp"
    android:src="@drawable/ic_logo" />
```

```kotlin
imageView.setImageResource(R.drawable.ic_logo)
```

В Compose:

```kotlin
Image(
    painter = painterResource(R.drawable.ic_logo),
    contentDescription = stringResource(R.string.logo)
)
```

Типичная ошибка: класть большие PNG в `drawable` без плотностей — они масштабируются и потребляют лишнюю память.

### 3.2. src и srcCompat {#imageview-src-srccompat}

`android:src` работает для растровых изображений и векторов на API 21+. Для поддержки векторных drawable на старых версиях используют `app:srcCompat` вместе с `AppCompatImageView` (или автоматически при использовании AppCompat). В Compose векторы обрабатываются через `painterResource` без дополнительных атрибутов.

```xml
<ImageView
    android:layout_width="24dp"
    android:layout_height="24dp"
    app:srcCompat="@drawable/ic_star" />
```

Типичная ошибка: использовать `android:src` для вектора на minSdk < 21 — получите `Resources.NotFoundException`.

### 3.3. scaleType {#imageview-scaletype}

`android:scaleType` определяет, как изображение подгоняется под границы ImageView: `fitXY`, `fitStart`, `fitCenter`, `fitEnd`, `center`, `centerCrop`, `centerInside`, `matrix`. Выбор зависит от того, нужно ли заполнить контейнер или сохранить пропорции.

```xml
<ImageView
    android:layout_width="match_parent"
    android:layout_height="200dp"
    android:scaleType="centerCrop"
    android:src="@drawable/photo" />
```

В Compose аналог — параметр `contentScale`:

```kotlin
Image(
    painter = painterResource(R.drawable.photo),
    contentDescription = null,
    contentScale = ContentScale.Crop,
    modifier = Modifier.height(200.dp).fillMaxWidth()
)
```

### 3.4. centerCrop и fitCenter {#imageview-centercrop-fitcenter}

`centerCrop` масштабирует изображение так, чтобы заполнить контейнер, обрезая края — подходит для аватарок и карточек. `fitCenter` вписывает изображение целиком, сохраняя пропорции, оставляя пустые поля — подходит для логотипов и иконок.

```xml
<!-- Аватарка -->
<ImageView android:scaleType="centerCrop" ... />

<!-- Логотип -->
<ImageView android:scaleType="fitCenter" ... />
```

В Compose:

```kotlin
Image(contentScale = ContentScale.Crop) // centerCrop
Image(contentScale = ContentScale.Fit)  // fitCenter
```

Типичная ошибка: использовать `fitXY` для фотографий — изображение исказится по пропорциям.

### 3.5. Изменение изображения программно {#imageview-programmatic}

Изображение можно менять в коде: `setImageResource`, `setImageDrawable`, `setImageBitmap`. Для динамических иконок (например, лайк) используют `setImageResource` или меняют drawable в зависимости от состояния.

```kotlin
likeButton.setOnClickListener {
    isLiked = !isLiked
    imageView.setImageResource(
        if (isLiked) R.drawable.ic_liked else R.drawable.ic_like
    )
}
```

В Compose изображение зависит от состояния:

```kotlin
val icon = if (isLiked) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder
Icon(icon, contentDescription = null)
```

Типичная ошибка: хранить `Bitmap` в Activity/Fragment и пересоздавать его при каждом изменении конфигурации — утечка памяти и мерцание.

### 3.6. contentDescription {#imageview-contentdescription}

`contentDescription` описывает изображение для служб специальных возможностей (TalkBack). Для декоративных изображений ставят пустую строку или `null` (в Compose — `contentDescription = null`), чтобы TalkBack их пропускал.

```xml
<ImageView
    android:src="@drawable/avatar"
    android:contentDescription="@string/user_avatar" />
```

```kotlin
Image(
    painter = painterResource(R.drawable.avatar),
    contentDescription = stringResource(R.string.user_avatar)
)
```

Типичная ошибка: оставлять `contentDescription` не заданным — TalkBack прочитает имя ресурса, что бесполезно пользователю.

### 3.7. Загрузка изображений из сети с помощью Coil {#imageview-coil}

Coil — современный загрузчик изображений для Android, построенный на Kotlin Coroutines. Это основной рекомендуемый инструмент для Compose-проектов. Добавляют зависимость `io.coil-kt.coil3:coil-compose`, затем используют `AsyncImage`.

```gradle
implementation("io.coil-kt.coil3:coil-compose:3.6.3")
```

```kotlin
AsyncImage(
    model = "https://example.com/photo.jpg",
    contentDescription = "Фото товара",
    placeholder = painterResource(R.drawable.placeholder),
    error = painterResource(R.drawable.error),
    contentScale = ContentScale.Crop
)
```

Coil автоматически кэширует изображения в памяти и на диске, поддерживает трансформации и отмену запросов при уходе из композиции. В View-проектах Coil также можно использовать через `imageView.load(url)`.

Типичная ошибка: загружать изображения через `HttpURLConnection` и ручное декодирование bitmap — это медленно, без кэша и с риском OOM.

### 3.8. Glide (понимание legacy-проектов) {#imageview-glide}

Glide — популярный загрузчик, часто встречается в существующих проектах. API: `Glide.with(context).load(url).placeholder(...).error(...).into(imageView)`. Glide тоже кэширует в память и на диск.

```kotlin
Glide.with(context)
    .load(url)
    .placeholder(R.drawable.placeholder)
    .error(R.drawable.error)
    .centerCrop()
    .into(imageView)
```

В новых проектах и в Compose предпочтительнее Coil: он легче, написан на Kotlin, лучше интегрируется с Compose и корутинами. Glide остаётся актуальным для поддержки legacy-кода.

Типичная ошибка: смешивать Glide и Coil в одном проекте без необходимости — дублирование кэшей и зависимостей.

### 3.9. Placeholder и error-изображения {#imageview-placeholder-error}

Placeholder показывается, пока изображение загружается; error — если загрузка не удалась. Оба улучшают UX и скрывают пустоты. В Coil задаются через параметры `placeholder` и `error` (painter) или через `ImageRequest.Builder`.

```kotlin
AsyncImage(
    model = ImageRequest.Builder(context)
        .data(url)
        .crossfade(true)
        .build(),
    placeholder = painterResource(R.drawable.placeholder),
    error = painterResource(R.drawable.error),
    contentDescription = null
)
```

В Glide — методы `.placeholder()` и `.error()`. `crossfade(true)` — это API Coil, он добавляет плавное появление; в Glide аналог — `.transition(...)` или `.crossFade()`.

Типичная ошибка: не задавать placeholder для больших изображений — экран «прыгает» при появлении картинки.

### 3.10. Кэширование изображений в памяти и на диске {#imageview-caching}

Загрузчики кэшируют декодированные битмапы в памяти (LruCache) и исходные файлы на диске. Coil использует `MemoryCache` и `DiskCache`, настраиваемые через `ImageLoader`. Ключ кэша строится из URL и параметров трансформации.

```kotlin
val imageLoader = ImageLoader.Builder(context)
    .memoryCachePolicy(CachePolicy.ENABLED)
    .diskCachePolicy(CachePolicy.ENABLED)
    .respectCacheHeaders(false)
    .build()
```

При недостатке памяти система может очистить кэш; при нехватке места на диске старые файлы удаляются по LRU. Важно не кэшировать чувствительные изображения (например, аватарки с токеном в URL) без учёта ключа.

Типичная ошибка: отключать кэш для часто используемых изображений — каждая загрузка будет заново качать файл и декодировать битмап, нагружая сеть и CPU.

### Типичные ошибки ImageView

- Загрузка больших изображений без масштабирования → OOM.
- Использование `fitXY` для фотографий.
- Отсутствие `contentDescription`.
- Ручная загрузка вместо Coil/Glide.
- Игнорирование placeholder/error.
- Смешивание загрузчиков.

### Самопроверка ImageView

- [ ] Я понимаю разницу scaleType (centerCrop vs fitCenter).
- [ ] Я умею загружать изображения из drawable и сети.
- [ ] Я знаю, когда использовать Coil, а когда Glide.
- [ ] Я задаю placeholder и error.
- [ ] Я понимаю, как работает кэш памяти и диска.
- [ ] Я не забываю contentDescription.

### Вопросы на собеседовании

:::qa
- **Чем `android:src` отличается от `app:srcCompat`?** — `android:src` работает с растровыми изображениями и векторами на API 21+, а `app:srcCompat` вместе с `AppCompatImageView` добавляет поддержку векторных drawable на более старых версиях. На minSdk < 21 использование `android:src` для вектора приведёт к `Resources.NotFoundException`.
- **Что делает `scaleType="centerCrop"` и чем он отличается от `fitCenter`?** — `centerCrop` масштабирует изображение так, чтобы заполнить контейнер, обрезая края, и подходит для аватарок. `fitCenter` вписывает изображение целиком с сохранением пропорций, оставляя поля, и подходит для логотипов. В Compose это `ContentScale.Crop` и `ContentScale.Fit`.
- **Почему нельзя использовать `fitXY` для фотографий?** — `fitXY` растягивает изображение по обеим осям независимо, искажая пропорции. Для фотографий выбирают `centerCrop` или `fitCenter`.
- **Чем Coil/Glide лучше ручной загрузки изображений?** — они кэшируют изображения в памяти и на диске, масштабируют битмапы и отменяют запросы при уходе с экрана. Ручная загрузка через `HttpURLConnection` и декодирование без кэша медленная и грозит OOM. Coil рекомендуется для Compose (`AsyncImage`), Glide — для legacy View-проектов.
- **Зачем нужны placeholder и error-изображения?** — placeholder показывается, пока изображение загружается, а error — если загрузка не удалась. Они скрывают пустоты и предотвращают «прыжки» интерфейса, особенно для больших изображений; в Coil задаются параметрами `placeholder` и `error`.
- **Нужен ли `contentDescription` для ImageView?** — да, для осмысленных изображений он описывает картинку для TalkBack. Для декоративных изображений ставят `null` в Compose или `@null` в XML, чтобы диктор их пропускал, иначе он прочитает имя ресурса.
- **Как устроено кэширование в загрузчиках изображений?** — декодированные битмапы хранятся в памяти (`MemoryCache` у Coil, LruCache у Glide), а исходные файлы — на диске (`DiskCache`). Ключ кэша строится из URL и параметров трансформаций, а при нехватке памяти старые записи удаляются по LRU.
:::

## 4. EditText {#edittext}

EditText — поле ввода текста. В View это `android.widget.EditText` (наследник TextView). В Compose — `TextField`/`OutlinedTextField` с состоянием. Поля ввода требуют правильной настройки типа данных, валидации и поведения клавиатуры.

> **Ключевая идея:** значение поля должно жить в состоянии (ViewModel/remember), а не в самом View. View только отображает состояние и отправляет события изменения.

### 4.1. EditText и основные атрибуты {#edittext-basic}

Основные атрибуты: `android:hint` (подсказка), `android:text`, `android:maxLength`, `android:maxLines`, `android:inputType`. Размер и отступы наследуются от TextView.

```xml
<EditText
    android:id="@+id/nameField"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:hint="@string/name_hint"
    android:maxLength="50"
    android:maxLines="1" />
```

В Compose:

```kotlin
var name by remember { mutableStateOf("") }
OutlinedTextField(
    value = name,
    onValueChange = { name = it },
    label = { Text("Имя") },
    singleLine = true
)
```

Типичная ошибка: читать значение через `editText.text.toString()` в момент клика, а не хранить состояние — при пересоздании Activity значение теряется.

### 4.2. inputType {#edittext-inputtype}

`android:inputType` задаёт тип данных и поведение клавиатуры: `text`, `textEmailAddress`, `number`, `phone`, `textPassword`, `textMultiLine`. Можно комбинировать флаги, например `text|textCapSentences`.

```xml
<EditText
    android:inputType="textEmailAddress" />
<EditText
    android:inputType="number" />
<EditText
    android:inputType="textPassword" />
```

В Compose тип ввода задаётся через `KeyboardOptions`:

```kotlin
OutlinedTextField(
    value = email,
    onValueChange = { email = it },
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
)
```

Типичная ошибка: использовать `inputType="number"` для телефонов — теряются плюсы и скобки; для телефонов нужен `phone`.

### 4.3. TextWatcher и addTextChangedListener {#edittext-textwatcher}

`TextWatcher` позволяет реагировать на изменения текста: `beforeTextChanged`, `onTextChanged`, `afterTextChanged`. Часто используют `afterTextChanged` для валидации.

```kotlin
editText.addTextChangedListener(object : TextWatcher {
    override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
    override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
    override fun afterTextChanged(s: Editable?) {
        validate(s?.toString().orEmpty())
    }
})
```

В Compose изменение обрабатывается в `onValueChange`, что проще и безопаснее:

```kotlin
OutlinedTextField(
    value = name,
    onValueChange = { newValue ->
        name = newValue
        validate(newValue)
    }
)
```

Типичная ошибка: добавлять несколько `TextWatcher` и забывать удалять их — утечки и дублирование вызовов.

### 4.4. Базовая валидация ввода {#edittext-validation}

Валидация проверяет длину, формат, обязательность. В View часто делают в `afterTextChanged` или при отправке формы. Важно показывать ошибку рядом с полем, а не только тостом.

```kotlin
fun validateEmail(value: String): Boolean {
    return value.contains("@") && value.length >= 5
}
```

В Compose валидацию удобно выносить в ViewModel и отражать в состоянии:

```kotlin
val isValid = email.isNotBlank() && email.contains("@")
OutlinedTextField(
    value = email,
    onValueChange = { email = it },
    isError = !isValid && email.isNotEmpty(),
    supportingText = {
        if (!isValid && email.isNotEmpty()) Text("Некорректный email")
    }
)
```

Типичная ошибка: валидировать только при отправке формы — пользователь не видит ошибки до нажатия кнопки.

### 4.5. imeOptions и действия клавиатуры {#edittext-imeoptions}

`android:imeOptions` задаёт действие на клавиатуре: `actionDone`, `actionSearch`, `actionGo`, `actionNext`, `actionSend`. Обработка — через `setOnEditorActionListener`.

```xml
<EditText
    android:inputType="text"
    android:imeOptions="actionSearch" />
```

```kotlin
editText.setOnEditorActionListener { _, actionId, _ ->
    if (actionId == EditorInfo.IME_ACTION_SEARCH) {
        viewModel.search(editText.text.toString())
        true
    } else false
}
```

В Compose:

```kotlin
OutlinedTextField(
    value = query,
    onValueChange = { query = it },
    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
    keyboardActions = KeyboardActions(onSearch = { viewModel.search(query) })
)
```

Типичная ошибка: забыть `singleLine`/`maxLines="1"` — клавиатура покажет перенос строки вместо действия.

### 4.6. TextInputLayout и TextInputEditText {#edittext-textinputlayout}

`TextInputLayout` из Material Components оборачивает `EditText`/`TextInputEditText` и добавляет плавающую подсказку (hint), счётчик символов, иконки и оформление (outlined/filled). Это стандарт для Material-форм.

```xml
<com.google.android.material.textfield.TextInputLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:hint="@string/name"
    app:counterEnabled="true"
    app:counterMaxLength="50">

    <com.google.android.material.textfield.TextInputEditText
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:inputType="text" />
</com.google.android.material.textfield.TextInputLayout>
```

В Compose эквивалент — `OutlinedTextField`/`TextField` с параметрами `label`, `supportingText`, `trailingIcon`.

Типичная ошибка: использовать обычный `EditText` внутри `TextInputLayout` — потеряются некоторые функции (например, корректный hint).

### 4.7. Обработка ошибок ввода {#edittext-error-handling}

Ошибку показывают через `setError` у EditText или `error` у TextInputLayout. Ошибка должна исчезать при исправлении ввода.

```kotlin
if (name.isBlank()) {
    nameInput.error = getString(R.string.error_empty_name)
} else {
    nameInput.error = null
}
```

В TextInputLayout:

```kotlin
textInputLayout.error = if (name.isBlank()) "Введите имя" else null
```

В Compose:

```kotlin
OutlinedTextField(
    value = name,
    onValueChange = { name = it },
    isError = hasError,
    supportingText = { if (hasError) Text("Введите имя") }
)
```

Типичная ошибка: показывать ошибку через `Toast`/`Snackbar` вместо поля — пользователь не понимает, какое поле неверно.

### Типичные ошибки EditText

- Хранение значения только в View, без состояния.
- Неправильный `inputType` (например, number для телефона).
- Отсутствие валидации и сообщений об ошибках.
- Забытый `imeOptions`/обработчик действия.
- Использование обычного EditText вместо TextInputEditText в TextInputLayout.

### Самопроверка EditText

- [ ] Я умею создать поле ввода в XML и Compose.
- [ ] Я правильно задаю inputType и imeOptions.
- [ ] Я использую TextWatcher / onValueChange.
- [ ] Я валидирую ввод и показываю ошибки у поля.
- [ ] Я храню значение в состоянии, а не только в View.

### Вопросы на собеседовании

:::qa
- **Зачем задавать `android:inputType` у EditText?** — `inputType` определяет тип данных и подсказывает клавиатуре, какую раскладку показать: `textEmailAddress`, `number`, `phone`, `textPassword`. Это упрощает ввод и валидацию; в Compose аналог — `KeyboardOptions` с `KeyboardType`.
- **В чём ошибка использования `inputType="number"` для телефонного номера?** — `number` допускает только цифры, поэтому плюс, скобки и пробелы будут потеряны. Для телефонов нужен `inputType="phone"`.
- **Как работает `TextWatcher` и зачем он нужен?** — `TextWatcher` реагирует на изменения текста через `beforeTextChanged`, `onTextChanged` и `afterTextChanged`; последний часто используют для валидации. В Compose изменение обрабатывают в `onValueChange`. Важно удалять watcher, чтобы не копить дублирующиеся вызовы и утечки.
- **Чем `TextInputLayout` отличается от обычного `EditText`?** — `TextInputLayout` из Material Components оборачивает `TextInputEditText` и добавляет плавающую подсказку, счётчик символов, иконки и оформление (outlined/filled) с показом ошибок. Внутри него нужно использовать именно `TextInputEditText`, иначе часть функций, например корректный hint, потеряется.
- **Как валидировать ввод и показывать ошибку пользователю?** — проверяют значение в `afterTextChanged` / `onValueChange` или при отправке формы и показывают ошибку рядом с полем через `setError`, `TextInputLayout.error` или `isError` в Compose. Сообщение должно исчезать при исправлении ввода. Одного тоста недостаточно: пользователю не видно, какое именно поле неверно.
- **Где должно жить значение поля ввода?** — в состоянии: ViewModel для View или `remember { mutableStateOf("") }` для Compose, а не только в самом View. Если читать `editText.text` лишь в момент клика, значение потеряется при пересоздании Activity.
- **Что такое `imeOptions` и зачем оно нужно?** — `imeOptions` задаёт действие на клавиатуре (`actionDone`, `actionSearch`, `actionSend`), которое обрабатывают через `setOnEditorActionListener`. Чтобы клавиатура показала действие вместо переноса строки, поле должно быть однострочным (`maxLines="1"`).
:::

## 5. LinearLayout {#linearlayout}

LinearLayout — самый простой и предсказуемый контейнер Android: он раскладывает дочерние View строго в одну строку (горизонтально) или в один столбец (вертикально). Никаких ограничений и привязок: порядок дочерних элементов в XML определяет их порядок на экране. За эту простоту платят вложенностью: сложные экраны на LinearLayout превращаются в дерево вложенных контейнеров, что ухудшает производительность и читаемость. Поэтому LinearLayout хорош для простых форм, тулбаров, строк с иконкой и текстом, а для сложных макетов переходят на ConstraintLayout или Compose.

:::cards
- **orientation** — направление раскладки: horizontal или vertical.
- **layout_weight** — распределение свободного места между детьми.
- **gravity / layout_gravity** — выравнивание содержимого и самого View.
- **Вложенность** — основной риск: глубокие деревья замедляют отрисовку.
:::

> **Ключевая идея:** LinearLayout — это «линейка»: один ряд или одна колонка. Если нужно разместить элементы в двух измерениях одновременно, почти всегда лучше выбрать другой контейнер.

### orientation {#linearlayout-orientation}

Атрибут `android:orientation` задаёт направление: `horizontal` (по умолчанию) или `vertical`. В горизонтальном режиме дети идут слева направо, в вертикальном — сверху вниз. Ориентация влияет на то, как интерпретируются `layout_width`/`layout_height` и `layout_weight`: вес распределяет место вдоль направления раскладки.

```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Заголовок" />

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Подзаголовок" />
</LinearLayout>
```

Частая ошибка — забыть указать ориентацию и получить неожиданный горизонтальный ряд. Другая ошибка — смешивать `match_parent` по ширине во внутренних элементах вертикального LinearLayout: это не ломает разметку, но мешает корректной работе `layout_weight`.

### layout_weight {#linearlayout-weight}

`layout_weight` задаёт вес дочернего элемента при распределении свободного пространства. Родитель вычисляет оставшееся место (после учёта размеров детей с фиксированными/`wrap_content` размерами) и делит его между детьми пропорционально весам. Сумма весов по умолчанию равна сумме указанных значений, но можно задать `android:weightSum` явно — это полезно для точного контроля.

Правило производительности: если элемент использует вес, его размер вдоль направления раскладки должен быть `0dp` (или `0px`), а не `wrap_content`/`match_parent`. Иначе LinearLayout делает двойной проход измерения (measure), что замедляет отрисовку, особенно в списках.

```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="horizontal"
    android:weightSum="3">

    <Button
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_weight="1"
        android:text="Отмена" />

    <Button
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_weight="2"
        android:text="Подтвердить" />
</LinearLayout>
```

Типичные ошибки: использовать `wrap_content` вместе с весом (двойной measure), забывать `weightSum` при необходимости равных долей, ставить вес у всех детей без фиксированных размеров — тогда делить нечего.

### gravity и layout_gravity {#linearlayout-gravity}

Эти два атрибута часто путают. `android:gravity` управляет тем, как содержимое View выравнивается внутри самого View (текст в TextView, иконка в ImageView). `android:layout_gravity` управляет тем, как сам View выравнивается внутри родителя. В LinearLayout `layout_gravity` работает только поперёк направления раскладки: в вертикальном LinearLayout можно выровнять ребёнка по горизонтали (`center_horizontal`, `end`), в горизонтальном — по вертикали (`center_vertical`, `bottom`).

```xml
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_gravity="center_horizontal"
    android:text="По центру" />
```

Для выравнивания вдоль направления раскладки `layout_gravity` не работает — для этого используют веса или отступы. Запомнить правило: `gravity` — «как лежит текст внутри кнопки», `layout_gravity` — «как кнопка лежит в контейнере».

### Margin и Padding {#linearlayout-margin-padding}

`padding` — внутренний отступ View (расстояние от границы до содержимого), задаётся на самом View. `layout_margin` — внешний отступ (расстояние до соседей/родителя), задаётся в параметрах макета. В современном коде используют directional-атрибуты: `layout_marginStart`, `layout_marginEnd`, `paddingStart`, `paddingEnd` — они учитывают направление письма (RTL) и предпочтительнее `left`/`right`.

Значения хранят в `res/values/dimens.xml`, а не захардкоживают в разметке: это обеспечивает консистентность и позволяет адаптировать под разные экраны. Для разделения детей в LinearLayout можно использовать `android:divider` и `android:showDividers` вместо пустых View-разделителей — это чище и экономит элементы.

```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:divider="@drawable/divider_horizontal"
    android:orientation="vertical"
    android:showDividers="middle" />
```

### Baseline alignment {#linearlayout-baseline}

При размещении текстовых элементов в одной строке (например, заголовок и подпись разного размера) их базовые линии должны совпадать, иначе текст выглядит «прыгающим». LinearLayout по умолчанию выравнивает базовые линии детей (`android:baselineAligned="true"`). Атрибут `android:baselineAlignedChildIndex` указывает, какой дочерний элемент использовать как эталон базовой линии (по умолчанию — первый с текстом).

```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:baselineAligned="true"
    android:orientation="horizontal">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textSize="24sp"
        android:text="Заголовок" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="подпись" />
</LinearLayout>
```

Если базовая линия не важна (например, иконки и текст), отключите `baselineAligned="false"` — это сэкономит проход измерения.

### Вложенные LinearLayout {#linearlayout-nested}

Типичный паттерн — вертикальный LinearLayout, внутри которого строки реализованы горизонтальными LinearLayout. Это работает и читается, но каждая вложенность добавляет проходы измерения: родитель измеряет детей, дети измеряют своих детей. На простых экранах это незаметно, в списках (RecyclerView) — заметно.

```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal">

        <ImageView ... />
        <TextView ... />
    </LinearLayout>

    <TextView ... />
</LinearLayout>
```

### Когда стоит избегать избыточной вложенности {#linearlayout-avoid-nesting}

Признаки проблемы: глубина дерева больше 3–4 уровней, Lint-предупреждение `TooDeepLayout`, тормоза при прокрутке. Решения: заменить вложенные LinearLayout на один ConstraintLayout (плоская иерархия), использовать `merge`-тег при include, перейти на Compose. Правило: если вы видите LinearLayout внутри LinearLayout внутри LinearLayout — почти всегда можно переписать проще. Но не стоит переписывать ради переписывания: если экран простой и работает быстро, оставьте как есть.

**Самопроверка:**
- [ ] Как `layout_weight` делит свободное место и почему нужен `0dp`?
- [ ] Чем `gravity` отличается от `layout_gravity`?
- [ ] В каком направлении работает `layout_gravity` в LinearLayout?
- [ ] Зачем нужен `baselineAligned`?
- [ ] Когда вложенность LinearLayout становится проблемой?

### Вопросы на собеседовании

:::qa
- **Почему `layout_weight` «дорог» по производительности?** — при весе размер элемента вдоль направления раскладки должен быть `0dp`: иначе LinearLayout сначала измеряет детей с их естественным размером, а затем пересчитывает оставшееся место, то есть делает двойной проход `measure`. В списках это заметно тормозит отрисовку.
- **Чем `gravity` отличается от `layout_gravity`?** — `android:gravity` выравнивает содержимое внутри самого View, например текст в TextView, а `android:layout_gravity` — сам View внутри родителя. Проще запомнить так: `gravity` — как текст лежит в кнопке, `layout_gravity` — как кнопка лежит в контейнере.
- **В каком направлении работает `layout_gravity` в LinearLayout?** — только поперёк направления раскладки: в вертикальном LinearLayout по горизонтали (`center_horizontal`, `end`), в горизонтальном по вертикали (`center_vertical`, `bottom`). Для выравнивания вдоль направления используют веса или отступы.
- **Когда стоит избегать вложенных LinearLayout?** — когда глубина дерева превышает 3–4 уровня, появляется Lint-предупреждение `TooDeepLayout` или тормозит прокрутка. Тогда вложенные контейнеры заменяют одним ConstraintLayout с плоской иерархией или переходят на Compose.
- **Чем отличаются `padding` и `layout_margin`?** — `padding` — внутренний отступ между границей View и его содержимым, `layout_margin` — внешний отступ до соседей или родителя. Предпочтительнее directional-атрибуты `paddingStart` и `layout_marginEnd`, которые учитывают RTL.
- **Зачем нужен `android:baselineAligned`?** — он выравнивает базовые линии текстовых элементов в одной строке, чтобы заголовок и подпись разного размера выглядели ровно. Если текст рядом не важен, например иконка с надписью, атрибут отключают, экономя проход измерения.
- **Зачем задавать `android:weightSum`?** — атрибут задаёт суммарный вес, относительно которого делится свободное место; без него за сумму принимается сумма весов всех детей. Это позволяет, например, отдать детям только часть ширины, оставив место другим элементам.
:::

## 6. ConstraintLayout {#constraintlayout}

ConstraintLayout — контейнер, в котором каждый дочерний элемент позиционируется относительно родителя и других элементов с помощью ограничений (constraints). Главное преимущество — плоская иерархия: сложный экран можно описать одним контейнером без вложенных LinearLayout. ConstraintLayout — рекомендуемый контейнер для XML-интерфейсов, он поддерживает адаптивность, анимации (MotionLayout) и хорошо работает с редактором макетов в Android Studio.

:::cards
- **Constraints** — привязка сторон/центров элемента к другим элементам или родителю.
- **bias** — смещение элемента между двумя противоположными ограничениями.
- **Guidelines / Barriers** — виртуальные линии и динамические границы.
- **Chains** — группировка элементов в ряд/колонку с распределением места.
:::

> **Ключевая идея:** в ConstraintLayout позиция элемента определяется не порядком в XML, а набором ограничений. Каждый элемент должен иметь минимум два ограничения — по горизонтали и по вертикали, иначе он «упадёт» в угол (0,0).

### Базовые constraints {#constraintlayout-basic}

Ограничение задаётся атрибутом вида `app:layout_constraint<Сторона>_to<Сторона>Of="<id или parent>"`. Например, `app:layout_constraintStart_toStartOf="parent"` привязывает начало элемента к началу родителя. Стороны: Start/End/Top/Bottom. Отдельного атрибута для центрирования нет: привязывают обе противоположные стороны к родителю.

```xml
<TextView
    android:id="@+id/title"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintTop_toTopOf="parent"
    android:text="Заголовок" />
```

Если задать только горизонтальное ограничение, элемент всё равно будет иметь вертикальную позицию 0 (верхний край) и Lint предупредит о missing constraint. Всегда проверяйте, что у каждого View есть ограничения по обеим осям.

### Привязка сторон и центров {#constraintlayout-sides-centers}

Элемент можно привязать к родителю, к другому элементу или к центру. Привязка к центру родителя: `Start_toStartOf="parent"` + `End_toEndOf="parent"` (горизонталь) и аналогично по вертикали. Привязка к другому элементу: `Start_toEndOf="@id/icon"` помещает элемент справа от иконки с учётом margin.

```xml
<ImageView
    android:id="@+id/icon"
    android:layout_width="24dp"
    android:layout_height="24dp"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintTop_toTopOf="parent" />

<TextView
    android:id="@+id/label"
    android:layout_width="0dp"
    android:layout_height="wrap_content"
    android:layout_marginStart="8dp"
    app:layout_constraintStart_toEndOf="@id/icon"
    app:layout_constraintEnd_toEndOf="parent"
    app:layout_constraintTop_toTopOf="@id/icon"
    android:text="Подпись" />
```

`layout_marginStart`/`End` работают как отступы между связанными элементами. Для выравнивания по базовой линии текста используйте `app:layout_constraintBaseline_toBaselineOf="@id/..."`.

### Horizontal и vertical bias {#constraintlayout-bias}

Когда элемент ограничен с двух противоположных сторон (например, start и end родителя), он располагается по умолчанию по центру между ними. Атрибут `app:layout_constraintHorizontal_bias` (0.0–1.0) смещает элемент: 0 — к началу, 1 — к концу, 0.5 — по центру. Аналогично `app:layout_constraintVertical_bias`. Это удобно для позиционирования кнопок и панелей без жёстких отступов.

```xml
<Button
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintEnd_toEndOf="parent"
    app:layout_constraintHorizontal_bias="0.2"
    app:layout_constraintTop_toTopOf="parent"
    android:text="Смещена влево" />
```

Bias работает только при наличии обоих противоположных ограничений. Если ограничение только с одной стороны, bias игнорируется.

### Guidelines {#constraintlayout-guidelines}

Guideline — невидимая линия-помощник, к которой можно привязывать элементы. Бывает вертикальной и горизонтальной, задаётся фиксированным отступом (`layout_constraintGuide_begin`/`end`) или процентом (`layout_constraintGuide_percent`). Guidelines не занимают места и не отрисовываются, но служат опорными линиями для выравнивания.

```xml
<androidx.constraintlayout.widget.Guideline
    android:id="@+id/guideline"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    app:layout_constraintGuide_percent="0.4" />
```

Типичное применение: колонка формы, где лейблы выровнены по guideline, а поля ввода — справа от него; или адаптивная разметка, где процентный guideline делит экран на зоны.

### Chains {#constraintlayout-chains}

Chain — группа элементов, связанных двусторонними ограничениями (A→B, B→A), образующая ряд или колонку с распределением места. Стиль цепочки задаётся на головном (первом) элементе атрибутом `app:layout_constraintHorizontal_chainStyle` (или vertical): `spread` (равномерно с отступами по краям), `spread_inside` (крайние прижаты к краям), `packed` (сгруппированы по центру). Элементы цепочки могут иметь веса через `layout_constraintHorizontal_weight`.

```xml
<Button
    android:id="@+id/btn1"
    android:layout_width="0dp"
    android:layout_height="wrap_content"
    app:layout_constraintHorizontal_chainStyle="spread"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintEnd_toStartOf="@id/btn2" />

<Button
    android:id="@+id/btn2"
    android:layout_width="0dp"
    android:layout_height="wrap_content"
    app:layout_constraintStart_toEndOf="@id/btn1"
    app:layout_constraintEnd_toEndOf="parent" />
```

Цепочки удобны для рядов кнопок и навигационных панелей. Ошибка — забыть двустороннюю связь: без `End_toStartOf` у первого элемента цепочка не образуется.

### Barriers {#constraintlayout-barriers}

Barrier — виртуальный элемент, чья позиция вычисляется как край (max/min) набора других элементов. Полезен, когда размеры элементов динамичны: например, текстовые метки разной длины, а поле ввода должно начинаться правее самой длинной метки. Barrier не имеет фиксированной позиции; он «прилипает» к краю указанных View.

```xml
<androidx.constraintlayout.widget.Barrier
    android:id="@+id/barrier"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    app:barrierDirection="end"
    app:constraint_referenced_ids="label1,label2" />
```

Затем другой элемент привязывается к barrier: `app:layout_constraintStart_toEndOf="@id/barrier"`. Barrier обновляется автоматически при изменении размеров меток.

### Размеры 0dp (match constraints) {#constraintlayout-0dp}

В ConstraintLayout значение `0dp` для ширины/высоты означает «match constraints»: размер определяется ограничениями, а не родителем. Это отличается от `match_parent` (для дочерних View ConstraintLayout он не поддерживается и трактуется как `match_constraint`, то есть ограничения соблюдаются) и `wrap_content`. Используйте `0dp`, когда элемент должен растягиваться между двумя ограничениями.

```xml
<TextView
    android:layout_width="0dp"
    android:layout_height="wrap_content"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintEnd_toEndOf="parent"
    android:text="На всю ширину" />
```

Тонкость: `match_parent` для детей ConstraintLayout не поддерживается и трактуется как `0dp`, поэтому Lint рекомендует явный `0dp` с ограничениями — так элемент корректно участвует в chains и barriers. `wrap_content` с ограничениями сохраняет естественный размер. Если элемент должен иметь минимальный или максимальный размер, используйте `app:layout_constraintWidth_min`/`max` и аналогичные для высоты — это позволяет сочетать гибкость constraints с контролем размера.

### Работа с вложенными интерфейсами {#constraintlayout-nested}

ConstraintLayout может содержать другие ConstraintLayout (или любые контейнеры) для изоляции повторно используемых блоков. Но цель — минимизировать вложенность: каждый уровень добавляет измерения. Используйте `include` с `merge` для переиспользуемых фрагментов разметки, Group для управления видимостью набора элементов, Layer для применения трансформаций к группе.

```xml
<androidx.constraintlayout.widget.Group
    android:id="@+id/errorGroup"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:visibility="gone"
    app:constraint_referenced_ids="errorIcon,errorText" />
```

Group не позиционирует элементы — только управляет их видимостью. Для анимаций переходов между состояниями экрана используется MotionLayout (надстройка над ConstraintLayout).

**Самопроверка:**
- [ ] Что произойдёт, если у View нет ограничений по одной из осей?
- [ ] Чем `0dp` отличается от `match_parent` в ConstraintLayout?
- [ ] Для чего нужны Guidelines и Barriers?
- [ ] Как задаётся стиль chain?
- [ ] Что делает Group?

### Вопросы на собеседовании

:::qa
- **Что означает `0dp` в ConstraintLayout?** — `0dp` для ширины или высоты означает «match constraints»: размер вычисляется из ограничений с двух сторон, а не из содержимого. Это отличается от `match_parent`, который для детей ConstraintLayout трактуется как `0dp`, и от `wrap_content`.
- **Что такое bias и когда он работает?** — `app:layout_constraintHorizontal_bias` и `app:layout_constraintVertical_bias` смещают элемент между двумя противоположными ограничениями: 0 — к началу, 0.5 — по центру, 1 — к концу. Без двух противоположных ограничений bias игнорируется.
- **Чем Guideline отличается от Barrier?** — Guideline — фиксированная невидимая линия, задаваемая отступом или процентом, к которой привязывают элементы. Barrier вычисляет позицию динамически как край (max/min) набора других View, поэтому следует за самой длинной меткой.
- **Зачем нужны chains и как задать их стиль?** — Chain объединяет элементы двусторонними ограничениями и распределяет между ними место; стиль задаётся на первом элементе через `app:layout_constraintHorizontal_chainStyle`: `spread`, `spread_inside` или `packed`. Обязательна связь `End_toStartOf` у первого элемента, иначе цепочка не образуется.
- **Что произойдёт, если у View нет ограничения по одной из осей?** — элемент «упадёт» в начало координат (0,0) по этой оси, а Lint предупредит о пропущенном ограничении. Каждый View должен иметь минимум по одному ограничению по горизонтали и вертикали.
- **Чем Group отличается от Layer в ConstraintLayout?** — Group управляет только видимостью набора элементов через `constraint_referenced_ids`, но не позиционирует их. Layer применяет трансформации, например поворот или масштаб, к группе View.
- **Зачем нужна привязка по базовой линии?** — `app:layout_constraintBaseline_toBaselineOf` выравнивает базовые линии текста двух View, чтобы подписи разного размера смотрелись ровно. Это аналог `baselineAligned` у LinearLayout.
:::

## 7. View Binding {#view-binding}

View Binding — механизм генерации классов-обёрток для XML-разметки, обеспечивающий типобезопасный доступ к View. Вместо `findViewById` вы получаете сгенерированный класс с полями для каждого View с `android:id`. Это устраняет приведение типов, null-риски и ошибки времени выполнения: если id удалён из XML, проект просто не скомпилируется. View Binding включён в Android Gradle Plugin и не требует аннотаций или дополнительных зависимостей.

:::cards
- **Типобезопасность** — поля имеют конкретные типы View, ошибки ловятся на этапе компиляции.
- **Null-безопасность** — View, присутствующие во всех конфигурациях, не nullable.
- **Производительность** — нет поиска во время выполнения.
- **Простота** — включение одной строкой в Gradle, без аннотаций.
:::

> **Ключевая идея:** View Binding заменяет `findViewById` и синтетические свойства Kotlin, давая автогенерированный класс с полями-View. Это самый простой и быстрый способ получить безопасный доступ к разметке.

### Включение View Binding в Gradle {#view-binding-gradle}

Включение выполняется в файле `build.gradle.kts` модуля (app). В блоке `android` добавляется `buildFeatures { viewBinding = true }`. После синхронизации Gradle для каждого layout-файла генерируется binding-класс. Включение распространяется на все layout-файлы модуля; отдельные файлы можно исключить атрибутом `tools:viewBindingIgnore="true"` на корневом элементе разметки.

```kotlin
android {
    buildFeatures {
        viewBinding = true
    }
}
```

```xml
<LinearLayout
    xmlns:tools="http://schemas.android.com/tools"
    tools:viewBindingIgnore="true"
    ... />
```

Если View Binding нужен только в части модулей, включайте его в каждом нужном модуле отдельно. Включение на уровне проекта не поддерживается. При включении View Binding в модуле с большим числом layout-файлов время сборки немного возрастает, но это компенсируется отсутствием ошибок времени выполнения и упрощением рефакторинга.

### Генерация binding-классов {#view-binding-generation}

Имя класса выводится из имени файла разметки: `activity_main.xml` → `ActivityMainBinding`, `fragment_profile.xml` → `FragmentProfileBinding`, `item_user.xml` → `ItemUserBinding`. Класс содержит: поле `root` (корневой View) и поля для каждого View с `android:id` (имя поля — camelCase от id, например `titleText` для `title_text`). View, присутствующие во всех конфигурациях (портрет/альбом), имеют не-nullable тип; View, существующие только в некоторых конфигурациях, становятся nullable.

Сгенерированные классы лежат в `build/generated/data_binding_base_class_source_out` и не должны редактироваться вручную. При изменении XML пересоберите проект, чтобы обновить binding. Если binding-класс не появился, проверьте, что файл разметки начинается с корневого тега View, а не с `<merge>` без включения.

### Доступ к View в Activity {#view-binding-activity}

В Activity binding создаётся через статический метод `inflate` и устанавливается как content view. Ссылку на binding хранят в свойстве, чтобы обращаться к View в течение жизни Activity.

```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.titleText.text = "Привет"
        binding.submitButton.setOnClickListener { submit() }
    }
}
```

Альтернатива — `binding = ActivityMainBinding.bind(view)`, если View уже создан (например, во Fragment). В Activity предпочтителен `inflate`, так как он создаёт и View, и binding одновременно.

### Использование во Fragment {#view-binding-fragment}

Во Fragment разметка создаётся в `onCreateView`, а binding — через `inflate` с переданным inflater и container. В `onViewCreated` настраивают слушатели. Важно: Fragment может пережить уничтожение View, поэтому binding нужно обнулить в `onDestroyView`, чтобы не держать ссылку на уничтоженный View.

```kotlin
class ProfileFragment : Fragment() {
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.titleText.text = "Профиль"
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
```

Паттерн с nullable `_binding` и не-nullable `binding` (через get()) — стандартный способ безопасной работы с binding во Fragment.

### Жизненный цикл binding во Fragment {#view-binding-fragment-lifecycle}

Binding живёт от `onCreateView` (создание View) до `onDestroyView` (уничтожение View). Сам Fragment может жить дольше (в back stack), поэтому обращение к `binding` после `onDestroyView` приведёт к утечке или крашу. Правила:

- Настраивайте View только в `onViewCreated` и позже.
- Обнуляйте `_binding` в `onDestroyView`.
- Наблюдатели LiveData/Flow привязывайте к `viewLifecycleOwner`, чтобы они останавливались вместе с View.
- Не передавайте `binding` во внешние объекты, живущие дольше View.

```kotlin
viewLifecycleOwner.lifecycleScope.launch {
    viewModel.state.collect { binding.titleText.text = it.title }
}
```

Типичная ошибка — хранить binding в поле без обнуления или обращаться к нему из коллбэка, вызванного после уничтожения View.

### Отличие View Binding от findViewById {#view-binding-vs-findviewbyid}

`findViewById` ищет View во время выполнения по id, возвращает nullable-тип (или требует приведения в старом коде) и может вернуть null, если id нет в разметке. Ошибка обнаруживается только при запуске. View Binding генерирует поля на этапе компиляции: если id удалён, код не скомпилируется. Кроме того, View Binding быстрее (нет поиска в дереве) и безопаснее (нет приведения типов). `findViewById` всё ещё встречается в старом коде и в простых случаях, но для новых проектов рекомендуется View Binding.

### Отличие View Binding от Data Binding {#view-binding-vs-data-binding}

Data Binding — более мощная библиотека: поддерживает выражения в XML (`android:text="@{user.name}"`), двустороннюю привязку, наблюдаемые объекты, BindingAdapter'ы. View Binding — только типобезопасный доступ к View, без логики в разметке. Data Binding требует аннотаций и медленнее компилируется; View Binding быстрее и проще. Выбирайте Data Binding, если нужна привязка данных и логика в XML; иначе — View Binding. Часто их используют вместе: View Binding для простых экранов, Data Binding для сложных форм с валидацией.

**Самопроверка:**
- [ ] Как включить View Binding в модуле?
- [ ] Как называется сгенерированный класс для `item_user.xml`?
- [ ] Как правильно работать с binding во Fragment?
- [ ] Зачем обнулять `_binding` в `onDestroyView`?
- [ ] Когда нужен Data Binding вместо View Binding?

### Вопросы на собеседовании

:::qa
- **Чем View Binding лучше `findViewById`?** — `findViewById` ищет View в дереве во время выполнения и возвращает nullable-тип или требует приведения, поэтому ошибка проявляется только в рантайме. View Binding генерирует типобезопасные поля на этапе компиляции: если id удалён из XML, проект не соберётся. Он также быстрее, потому что не ищет View в дереве.
- **Чем View Binding отличается от Data Binding?** — View Binding даёт только типобезопасный доступ к View, а Data Binding поддерживает выражения в XML (`@{user.name}`), двухстороннюю привязку и BindingAdapter'ы. Data Binding требует аннотаций и дольше компилируется; если логика в разметке не нужна, выбирают View Binding. Их можно использовать вместе.
- **Как называется сгенерированный класс для `item_user.xml`?** — `ItemUserBinding`: имя выводится из имени layout-файла в camelCase. Класс содержит поле `root` и поля для каждого View с `android:id`, например `titleText` для `title_text`.
- **Почему в Fragment нужно обнулять binding в `onDestroyView`?** — View Fragment уничтожается раньше самого Fragment, например при уходе в back stack, а binding хранит на него ссылку. Если не обнулить `_binding` в `onDestroyView`, получится утечка View или краш при обращении к уничтоженной иерархии.
- **Что будет при обращении к `binding` после `onDestroyView`?** — геттер `_binding!!` бросит `NullPointerException`, если обратиться к View после обнуления, а если не обнулять, приложение будет держать ссылку на мёртвый View. Поэтому используют паттерн nullable `_binding` и не-nullable `binding`, а обращения привязывают к `viewLifecycleOwner`.
- **Как включить View Binding и можно ли исключить отдельный layout?** — в `build.gradle.kts` добавляют `buildFeatures { viewBinding = true }`. Отдельный layout исключают атрибутом `tools:viewBindingIgnore="true"` на корневом элементе; включение действует на уровне модуля.
- **Чем `inflate` отличается от `bind` у binding-класса?** — `inflate(layoutInflater)` создаёт и View, и binding; он используется в Activity вместе с `setContentView(binding.root)`. Метод `bind(view)` привязывает binding к уже существующему View.
:::

## 8. RecyclerView Basics {#recyclerview-basics}

RecyclerView — компонент для отображения прокручиваемых списков и сеток с переиспользованием View (recycling). Вместо создания View для каждого элемента списка, RecyclerView создаёт только видимые элементы плюс небольшой буфер, а при прокрутке переиспользует их, подставляя новые данные. Это позволяет отображать списки из тысяч элементов без потери производительности. RecyclerView состоит из нескольких частей: сам RecyclerView, Adapter, ViewHolder и LayoutManager — каждая отвечает за свою задачу.

:::cards
- **RecyclerView** — контейнер со скроллом и пулом переиспользуемых View.
- **Adapter** — связывает данные со списком и создаёт ViewHolder.
- **ViewHolder** — хранит ссылки на View одного элемента.
- **LayoutManager** — располагает элементы (список, сетка, staggered).
:::

> **Ключевая идея:** RecyclerView разделяет «как расположить элементы» (LayoutManager), «как привязать данные» (Adapter) и «как хранить ссылки на View» (ViewHolder). Эта декомпозиция делает список гибким и производительным.

### RecyclerView {#recyclerview-component}

RecyclerView — это ViewGroup с поддержкой скролла, пулом View (RecycledViewPool) и анимациями изменений. Он не знает, как расположить элементы — это задача LayoutManager. По умолчанию RecyclerView не имеет LayoutManager, поэтому без его установки список не отобразится. Минимальная настройка: указать LayoutManager (в XML или коде) и Adapter.

```xml
<androidx.recyclerview.widget.RecyclerView
    android:id="@+id/recyclerView"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    app:layoutManager="androidx.recyclerview.widget.LinearLayoutManager" />
```

```kotlin
val recyclerView = findViewById<RecyclerView>(R.id.recyclerView)
recyclerView.layoutManager = LinearLayoutManager(this)
recyclerView.adapter = UserAdapter()
```

Для оптимизации вложенных списков (RecyclerView внутри RecyclerView) используйте общий `RecycledViewPool`. Для фиксированного размера элементов вызовите `setHasFixedSize(true)` — это отключает повторное измерение при изменениях данных.

### Adapter {#recyclerview-adapter}

Adapter наследуется от `RecyclerView.Adapter<VH>` и реализует три метода:

- `onCreateViewHolder(parent, viewType)` — создаёт ViewHolder (раздувает layout элемента).
- `onBindViewHolder(holder, position)` — привязывает данные к ViewHolder по позиции.
- `getItemCount()` — возвращает количество элементов.

Adapter не хранит данные напрямую (хотя может), лучше передавать список извне. Для разных типов элементов переопределяют `getItemViewType`. Никогда не выполняйте тяжёлую работу в `onBindViewHolder` — он вызывается часто при прокрутке.

```kotlin
class UserAdapter(
    private val users: List<User>,
    private val onClick: (User) -> Unit
) : RecyclerView.Adapter<UserAdapter.UserViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UserViewHolder {
        val binding = ItemUserBinding.inflate(
            LayoutInflater.from(parent.context), parent, false
        )
        return UserViewHolder(binding, onClick)
    }

    override fun onBindViewHolder(holder: UserViewHolder, position: Int) {
        holder.bind(users[position])
    }

    override fun getItemCount(): Int = users.size

    class UserViewHolder(
        private val binding: ItemUserBinding,
        private val onClick: (User) -> Unit
    ) : RecyclerView.ViewHolder(binding.root) {
        fun bind(user: User) {
            binding.nameText.text = user.name
            binding.root.setOnClickListener { onClick(user) }
        }
    }
}
```

### ViewHolder {#recyclerview-viewholder}

ViewHolder хранит ссылки на View элемента списка, чтобы не искать их при каждом bind. В современном коде ViewHolder использует View Binding. ViewHolder создаётся один раз для видимых элементов и переиспользуется при прокрутке — поэтому в нём нельзя хранить состояние, привязанное к конкретному элементу (оно перезапишется при bind). Состояние элемента хранят в данных, а ViewHolder лишь отображает их.

Типичные ошибки: хранить ссылку на данные внутри ViewHolder, забывать очищать слушатели (например, CheckBox) при bind — это приводит к срабатыванию старых обработчиков на переиспользованном View. Всегда сбрасывайте состояние в `bind` перед установкой нового.

### LayoutManager {#recyclerview-layoutmanager}

LayoutManager отвечает за позиционирование элементов и скролл. Основные реализации:

- `LinearLayoutManager` — вертикальный или горизонтальный список.
- `GridLayoutManager` — сетка с заданным числом колонок (spanCount).
- `StaggeredGridLayoutManager` — сетка с элементами разной высоты (masonry).

LayoutManager можно задать в XML через `app:layoutManager` или в коде. GridLayoutManager поддерживает разный span для разных позиций через `SpanSizeLookup` — удобно для заголовков секций во всю ширину.

```kotlin
recyclerView.layoutManager = GridLayoutManager(context, 2).apply {
    spanSizeLookup = object : GridLayoutManager.SpanSizeLookup() {
        override fun getSpanSize(position: Int): Int =
            if (position == 0) 2 else 1
    }
}
```

### LinearLayoutManager и GridLayoutManager {#recyclerview-linear-grid}

`LinearLayoutManager(context, orientation, reverseLayout)` — orientation `VERTICAL`/`HORIZONTAL`, `reverseLayout` переворачивает порядок (полезно для чатов). `GridLayoutManager(context, spanCount)` — сетка; `spanCount` можно менять динамически. Оба поддерживают `scrollToPosition`, `smoothScrollToPosition`, `findFirstVisibleItemPosition` и другие методы для программного управления прокруткой.

Частая ошибка — создавать новый LayoutManager при каждом обновлении адаптера; LayoutManager создаётся один раз. Другая — забывать `setHasFixedSize(true)` при фиксированном размере элементов.

### Передача списка данных {#recyclerview-data}

Данные передают в адаптер через конструктор или через метод `submitList` (у ListAdapter). При ручном управлении списком обновляют внутренний список и вызывают `notifyDataSetChanged()` или более точные методы: `notifyItemInserted`, `notifyItemRemoved`, `notifyItemChanged`, `notifyItemMoved`. Точные уведомления дают анимации и лучше производительность.

```kotlin
fun updateUsers(newUsers: List<User>) {
    users = newUsers
    notifyDataSetChanged() // грубо, но работает
}
```

Лучше использовать `DiffUtil` (через ListAdapter), который сам вычисляет разницу и вызывает точные уведомления. При передаче списка убедитесь, что не мутируете один и тот же список, который уже отображается — это приводит к рассинхрону.

### Обработка нажатий на элементы {#recyclerview-clicks}

Нажатия обрабатывают в ViewHolder, передавая колбэк из адаптера. Используйте `bindingAdapterPosition` (или `absoluteAdapterPosition`) вместо `position` параметра `onBindViewHolder` — позиция может измениться после bind (например, при вставке элемента). Проверяйте, что позиция валидна (`!= RecyclerView.NO_POSITION`).

```kotlin
binding.root.setOnClickListener {
    val pos = bindingAdapterPosition
    if (pos != RecyclerView.NO_POSITION) onClick(users[pos])
}
```

Для долгих нажатий используйте `setOnLongClickListener`. Для нажатий на отдельные элементы внутри item (кнопка «удалить») ставьте слушатель в `bind` и передавайте событие через отдельный колбэк. Избегайте создания анонимных слушателей в `onBindViewHolder` без очистки — это может привести к утечкам и срабатыванию старых обработчиков.

### ListAdapter и DiffUtil {#recyclerview-listadapter-diffutil}

`ListAdapter` — подкласс RecyclerView.Adapter, работающий со списком через `submitList`. Он использует `DiffUtil` для вычисления разницы между старым и новым списком в фоновом потоке (через AsyncListDiffer) и автоматически вызывает точные уведомления с анимациями. Для этого нужно реализовать `DiffUtil.ItemCallback<T>` с двумя методами: `areItemsTheSame` (сравнение по id) и `areContentsTheSame` (сравнение содержимого).

```kotlin
class UserAdapter : ListAdapter<User, UserAdapter.UserViewHolder>(DIFF_CALLBACK) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UserViewHolder {
        val binding = ItemUserBinding.inflate(
            LayoutInflater.from(parent.context), parent, false
        )
        return UserViewHolder(binding)
    }

    override fun onBindViewHolder(holder: UserViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    class UserViewHolder(private val binding: ItemUserBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(user: User) {
            binding.nameText.text = user.name
        }
    }

    companion object {
        val DIFF_CALLBACK = object : DiffUtil.ItemCallback<User>() {
            override fun areItemsTheSame(oldItem: User, newItem: User): Boolean =
                oldItem.id == newItem.id

            override fun areContentsTheSame(oldItem: User, newItem: User): Boolean =
                oldItem == newItem
        }
    }
}

// использование
adapter.submitList(newUsers)
```

ListAdapter предпочтительнее ручного управления: меньше кода, правильные анимации, нет ошибок с индексами. `submitList` с тем же списком (по ссылке) ничего не сделает — передавайте новый список.

### Сравнение с LazyColumn (Jetpack Compose) {#recyclerview-vs-lazycolumn}

LazyColumn — аналог RecyclerView в Jetpack Compose: ленивый список с переиспользованием (composition) элементов. Сравнение:

- API: RecyclerView требует Adapter/ViewHolder/LayoutManager и XML-разметку элемента; LazyColumn — декларативный: `LazyColumn { items(list) { Item(it) } }`. Меньше шаблонного кода.
- Состояние: в RecyclerView состояние элемента хранится в данных и вручную синхронизируется; в Compose состояние — часть composable, управляется через `remember`/state hoisting.
- Ключи: RecyclerView использует `getItemId`/DiffUtil; LazyColumn — параметр `key` в `items`, что даёт стабильную идентификацию без DiffUtil.
- Анимации: RecyclerView — `DefaultItemAnimator` и ручные уведомления; LazyColumn — `Modifier.animateItem()` (в новых версиях) и автоматические анимации.
- Производительность: оба переиспользуют элементы; RecyclerView чуть эффективнее на очень больших списках и сложных item-типах, Compose проще в поддержке.
- Взаимодействие: RecyclerView живёт в View-системе и легко встраивается в старый код; LazyColumn — в Compose, но может быть встроен в XML через `ComposeView`.

Рекомендация: новые экраны на Compose — LazyColumn; поддержка legacy и сложные списки с кастомными LayoutManager — RecyclerView. Обе технологии стоит знать, так как в реальных проектах они сосуществуют.

**Самопроверка:**
- [ ] За что отвечает каждый из компонентов RecyclerView?
- [ ] Почему нельзя хранить состояние элемента в ViewHolder?
- [ ] Чем `bindingAdapterPosition` лучше параметра `position`?
- [ ] Какие методы DiffUtil.ItemCallback нужно реализовать?
- [ ] Когда выбрать LazyColumn вместо RecyclerView?

### Вопросы на собеседовании

:::qa
- **Зачем нужен ViewHolder?** — он хранит ссылки на View элемента, чтобы не вызывать `findViewById` при каждом `onBindViewHolder`. ViewHolder создаётся один раз и переиспользуется при прокрутке, поэтому в нём нельзя хранить состояние конкретного элемента — оно перезапишется при следующем bind.
- **Что делает `DiffUtil` и чем полезен `ListAdapter`?** — `DiffUtil` вычисляет разницу между старым и новым списком и вызывает точные уведомления, например `notifyItemInserted`, вместо `notifyDataSetChanged()`. `ListAdapter` делает это автоматически через `submitList` в фоне и требует реализации `DiffUtil.ItemCallback` с методами `areItemsTheSame` и `areContentsTheSame`.
- **Чем `LayoutManager` отличается от `Adapter`?** — LayoutManager позиционирует элементы и управляет скроллом (`LinearLayoutManager`, `GridLayoutManager`), а Adapter связывает данные со списком: создаёт ViewHolder и привязывает к нему данные. Без LayoutManager список не отобразится.
- **Почему нельзя хранить позицию вместо стабильного id?** — позиция элемента меняется при вставке или удалении, поэтому колбэк с устаревшей `position` из `onBindViewHolder` может обратиться не к тому элементу. Используют `bindingAdapterPosition` с проверкой на `RecyclerView.NO_POSITION` и данные со стабильным id.
- **Что даёт вызов `setHasFixedSize(true)`?** — RecyclerView пересчитывает размеры элементов при каждом изменении данных, даже если они фиксированные. Для списка с одинаковой высотой элементов этот вызов отключает лишние измерения.
- **Почему в `onBindViewHolder` нельзя делать тяжёлую работу?** — метод вызывается часто при прокрутке для каждого переиспользуемого элемента. Любая загрузка или вычисление на главном потоке приведёт к просадкам fps, поэтому такие операции выносят в фон или подготавливают данные заранее.
- **Чем `LazyColumn` отличается от RecyclerView?** — LazyColumn — декларативный аналог в Compose: он тоже создаёт только видимые элементы, но не требует Adapter и ViewHolder, а для стабильной идентификации использует `key` в `items` вместо DiffUtil. Для новых Compose-экранов выбирают LazyColumn, для legacy-кода и кастомных LayoutManager — RecyclerView.
:::

## 9. Styles, Themes и Material 3 {#styles-themes-i-material-3}

Styles и Themes — это механизм единого оформления Android-приложения. Style описывает набор атрибутов для одного View или группы однотипных View: цвет текста, размер, отступы, фон, скругление. Theme — это глобальный набор атрибутов, который применяется ко всему приложению или отдельной Activity и из которого View'ы наследуют значения по умолчанию. Без стилей и тем каждый экран пришлось бы оформлять вручную, а смена брендинга превратилась бы в поиск по всем XML-файлам. Стили и темы делают оформление централизованным, переиспользуемым и адаптивным к светлой/тёмной теме и динамическим цветам.

:::cards
- **Style** — набор атрибутов для конкретного View или группы однотипных компонентов.
- **Theme** — глобальная палитра и типографика, применяемая ко всему приложению или Activity.
- **Наследование** — стили и темы строятся на основе родительских, переопределяя только нужное.
- **Material 3** — современная дизайн-система Google с динамическими цветами и токенами.
:::

> **Ключевая идея:** Style оформляет один компонент, Theme оформляет всё приложение. Theme attributes (`?attr/...`) — это «переменные» темы, которые View читают во время отрисовки, поэтому они автоматически подстраиваются под светлую/тёмную тему и Dynamic Color.

### Styles и Themes {#styles-i-themes}

Style объявляется в `res/values/styles.xml` (или `themes.xml`) как ресурс `<style name="...">`. Внутри перечисляются атрибуты `<item name="android:textSize">16sp</item>`. Style применяется к View через атрибут `style="@style/MyStyle"`. Theme — это тоже style, но с именем, начинающимся с `Theme.` (например, `Theme.MyApp`), и он назначается в манифесте: `android:theme="@style/Theme.MyApp"` для application или activity.

Разница в том, что style применяется точечно к конкретному View, а theme — глобально и определяет значения по умолчанию для всех View. Например, theme задаёт `colorPrimary`, и все MaterialButton'ы в приложении автоматически используют этот цвет, если их style не переопределяет. Theme также задаёт `textAppearance` по умолчанию, `windowBackground`, `statusBarColor` и другие атрибуты окна.

### Наследование стилей {#nasledovanie-stiley}

Стили поддерживают наследование. Явное наследование: `<style name="TitleText" parent="TextAppearance.Material3.TitleLarge">`. Неявное: если имя стиля содержит точку, например `TextAppearance.MyApp.Title`, Android ищет родителя `TextAppearance.MyApp` и далее `TextAppearance`. Это удобно для группировки: `Widget.MyApp.Button`, `Widget.MyApp.Button.Primary`.

Наследование позволяет переопределять только нужные атрибуты, не дублируя остальные. При переходе на Material 3 большинство стилей наследуются от готовых `TextAppearance.Material3.*` и `Widget.Material3.*`, что даёт консистентный вид и автоматически поддерживает Dynamic Color и тёмную тему.

### Цветовые и типографические ресурсы {#cvetovye-i-tipograficheskie-resursy}

Цвета хранятся в `res/values/colors.xml` как `<color name="primary">#6750A4</color>`. В Material 3 цвета организованы в роли: primary, onPrimary, primaryContainer, onPrimaryContainer, secondary, tertiary, error, background, surface и т.д. Эти роли описаны в теме и используются через `?attr/colorPrimary`. Роли `on*` обозначают цвет текста/иконок на фоне соответствующего цвета, что гарантирует контраст.

Типографика задаётся в `res/values/styles.xml` через `TextAppearance`: размер, вес, межстрочный интервал, регистр. Material 3 предоставляет готовую шкалу: displayLarge/medium/small, headline, title, body, label — каждая с large/medium/small. Использование готовой шкалы гарантирует консистентность и доступность (масштабирование шрифтов), а также правильные отступы и высоту строк.

### Material 3 {#material-3}

Material Design 3 (Material You) — текущая дизайн-система Google. Отличия от Material 2: динамические цвета, обновлённые компоненты (MaterialButton, TopAppBar, NavigationBar), скруглённые формы, новые токены. В Android Material 3 подключается зависимостью `com.google.android.material:material:1.12.x` и использованием темы `Theme.Material3.*`.

Ключевые компоненты: MaterialButton (вместо Button), TextInputLayout/TextInputEditText (вместо EditText), TopAppBar, NavigationBar, Card, Chip, FloatingActionButton. Они автоматически читают цветовые роли из темы и поддерживают состояния (pressed, focused, disabled, error). Переход с Material 2 на Material 3 требует замены тем и компонентов, но даёт современный вид и Dynamic Color.

### Dynamic Color (Material You) {#dynamic-color-material-you}

Dynamic Color — возможность генерировать палитру приложения из обоев пользователя (Android 12+). Включается одной строкой в `Application.onCreate()`: `DynamicColors.applyToActivitiesIfAvailable(this)`. После этого `colorPrimary` и другие роли будут вычислены из обоев, и приложение визуально сольётся с системой.

Требования: Material 3 theme, minSdk 31 для полной поддержки (на более старых версиях используется статическая палитра). Рекомендуется предусмотреть fallback-палитру в теме для устройств без Dynamic Color, чтобы приложение выглядело корректно везде. Dynamic Color не должен ломать читаемость: роли `on*` подбираются автоматически с учётом контраста.

### Светлая и тёмная тема DayNight {#svetlaya-i-temnaya-tema-daynight}

DayNight — тема, автоматически переключающаяся между светлой и тёмной версией в зависимости от системной настройки. Используется `Theme.Material3.DayNight.NoActionBar` (или `.Light`/`.Dark` для фиксированного варианта). Цветовые роли в dark-версии переопределяются в `res/values-night/colors.xml` или через квалификатор `night` для любых ресурсов.

Пользователь может принудительно выбрать тему через `AppCompatDelegate.setDefaultNightMode(MODE_NIGHT_YES/NO/FOLLOW_SYSTEM)`. Важно: при смене темы Activity пересоздаётся (configuration change), поэтому состояние должно сохраняться через ViewModel/SavedStateHandle, а не в View.

### MaterialButton и TextInputLayout {#materialbutton-i-textinputlayout}

MaterialButton заменяет обычный Button: поддерживает `app:cornerRadius`, `app:icon`, стили filled/outlined/text, состояния. TextInputLayout оборачивает TextInputEditText и добавляет плавающую подсказку (hint), счётчик символов, иконки и отображение ошибок через свойство `error`.

```xml
<com.google.android.material.button.MaterialButton
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Отправить"
    app:cornerRadius="12dp" />

<com.google.android.material.textfield.TextInputLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    app:errorEnabled="true">

    <com.google.android.material.textfield.TextInputEditText
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="Email" />
</com.google.android.material.textfield.TextInputLayout>
```

### Использование theme attributes {#ispolzovanie-theme-attributes}

Theme attributes — это ссылки на значения из текущей темы: `?attr/colorPrimary`, `?attr/colorOnSurface`, `?textAppearanceTitleLarge`. Они предпочтительнее жёстко заданных цветов, потому что автоматически подстраиваются под светлую/тёмную тему и Dynamic Color. Используйте `android:textColor="?attr/colorOnSurface"` вместо `@color/black`. Для текста лучше использовать `android:textAppearance="?attr/textAppearanceBodyLarge"`.

### Отличие style от theme {#otlichie-style-ot-theme}

Style применяется к одному View через `style="..."` и переопределяет конкретные атрибуты. Theme применяется глобально и задаёт значения по умолчанию и цветовые роли. Style может наследовать от theme attributes. Практическое правило: если атрибут должен меняться в зависимости от темы — используйте theme attribute; если это одноразовое оформление конкретного компонента — style. Theme задаёт «что», style — «как именно этот View отличается от дефолта».

**Типичные ошибки:**
- Жёстко задавать цвета (`@color/black`) вместо theme attributes — ломает тёмную тему и Dynamic Color.
- Смешивать Material 2 и Material 3 компоненты в одном экране — визуальная несогласованность.
- Забывать fallback-палитру при использовании Dynamic Color — на старых устройствах приложение выглядит «голым».
- Использовать `Theme.MaterialComponents` вместо `Theme.Material3` — теряются новые токены.
- Переопределять theme attributes в style без необходимости — теряется консистентность.

**Короткая самопроверка:**
- [ ] Умею создать theme и назначить её в манифесте.
- [ ] Понимаю разницу между style и theme.
- [ ] Знаю, как включить Dynamic Color.
- [ ] Умею использовать DayNight theme.
- [ ] Использую theme attributes вместо жёстких цветов.

### Вопросы на собеседовании

:::qa
- **Чем style отличается от theme?** — Style применяется точечно к одному View через `style="@style/..."` и переопределяет конкретные атрибуты. Theme назначается глобально в манифесте и задаёт значения по умолчанию и цветовые роли для всех View; по сути theme — тот же style, но с именем `Theme.*`.
- **Как работает наследование стилей?** — через атрибут `parent`, например `parent="TextAppearance.Material3.TitleLarge"`, или неявно по точке в имени: `Widget.MyApp.Button` наследует от `Widget.MyApp`. Это позволяет переопределить только нужные атрибуты, не дублируя остальные.
- **Что такое theme attribute `?attr/…` и зачем он нужен?** — это ссылка на значение из текущей темы, например `?attr/colorOnSurface` или `?textAppearanceTitleLarge`. В отличие от жёсткого `@color/black`, такой атрибут автоматически подстраивается под светлую и тёмную тему и Dynamic Color.
- **Что даёт Material 3 и чем он отличается от Material 2?** — Material 3 (Material You) добавляет динамические цвета, обновлённые компоненты (`MaterialButton`, `TopAppBar`, `NavigationBar`), скруглённые формы и новые токены. Подключается зависимостью `com.google.android.material:material` и темой `Theme.Material3.*`.
- **Как включить Dynamic Color?** — вызовом `DynamicColors.applyToActivitiesIfAvailable(this)` в `Application.onCreate()` при Material 3 теме. Палитра вычисляется из обоев пользователя на Android 12+, а на более старых версиях используется статическая палитра, поэтому нужен fallback.
- **Что такое DayNight-тема?** — тема `Theme.Material3.DayNight.*` автоматически переключает светлую и тёмную версии ресурсов в зависимости от системной настройки; цвета переопределяются в `values-night`. При смене темы Activity пересоздаётся, поэтому состояние хранят в ViewModel или SavedStateHandle.
- **Почему лучше не хардкодить цвета в разметке?** — жёстко заданный `@color/black` ломает тёмную тему и Dynamic Color, а также ухудшает контраст. Используют theme attributes (`?attr/colorPrimary`) и роли `on*` для текста на соответствующем фоне.
:::

## 10. Размеры и Accessibility {#razmery-i-accessibility}

Размеры и доступность — основа адаптивного интерфейса. Приложение должно корректно выглядеть на разных экранах и плотностях, а также быть usable для людей с ограниченными возможностями (TalkBack, крупный шрифт, высокий контраст). Игнорирование этих аспектов приводит к обрезанному тексту, нечитаемым мелким элементам и недоступности для части пользователей.

:::cards
- **dp/sp** — единицы, независимые от плотности экрана.
- **dimens** — централизованное хранение размеров.
- **contentDescription** — текстовое описание для TalkBack.
- **Touch targets** — минимальный размер кликабельной области.
:::

> **Ключевая идея:** Размеры задавайте в dp/sp и храните в dimens.xml, а текстовые элементы всегда снабжайте contentDescription — это минимум доступности.

### px, dp и sp {#px-dp-i-sp}

px (pixels) — физические пиксели экрана, зависят от плотности. dp (density-independent pixels) — абстрактная единица, привязанная к плотности 160 dpi: на экране 320 dpi 1 dp = 2 px. sp (scale-independent pixels) — как dp, но учитывает пользовательский масштаб шрифта. Правило: размеры View и отступы — в dp, размеры текста — в sp. Использование px приводит к тому, что на разных устройствах элементы выглядят по-разному.

### Density и Display Metrics {#density-i-display-metrics}

Density — количество пикселей на дюйм (dpi). Android классифицирует устройства: ldpi, mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi. DisplayMetrics содержит `density` (множитель: mdpi=1.0, hdpi=1.5, xhdpi=2.0) и `scaledDensity` (для sp). В коде конвертацию выполняют через `TypedValue.applyDimension` или готовые extension-функции. Не храните пиксельные значения в коде — они не переносимы.

```kotlin
val px = TypedValue.applyDimension(
    TypedValue.COMPLEX_UNIT_DIP, 16f, resources.displayMetrics
)
```

### Использование dimens resources {#ispolzovanie-dimens-resources}

Размеры хранятся в `res/values/dimens.xml`: `<dimen name="spacing_medium">16dp</dimen>`. Это позволяет менять размеры в одном месте и использовать квалификаторы (`values-sw600dp`) для разных экранов. Обращение в XML: `@dimen/spacing_medium`, в коде: `resources.getDimensionPixelSize(R.dimen.spacing_medium)`. Важно: `getDimension` возвращает float в px, `getDimensionPixelSize` — int в px с округлением.

### Разные размеры и плотности экранов {#raznye-razmery-i-plotnosti-ekranov}

Android-устройства имеют разные размеры экранов (small, normal, large, xlarge) и плотности. Используйте квалификаторы ресурсов: `values-w600dp` для планшетов, `values-land` для альбомной ориентации. ConstraintLayout и гибкие размеры (`0dp` = match constraints) помогают адаптироваться. Избегайте жёстких размеров для контейнеров — используйте `wrap_content`/`match_parent` и веса.

### contentDescription {#contentdescription}

`contentDescription` — текстовое описание View для TalkBack. Обязателен для ImageView, ImageButton, иконок без текста. Для декоративных элементов укажите `android:contentDescription="@null"` или `importantForAccessibility="no"`, чтобы TalkBack их пропускал. Описания должны быть осмысленными («Фото профиля», а не «Картинка») и локализованы через strings.xml.

### Touch target size {#touch-target-size}

Минимальный размер кликабельной области — 48dp (рекомендация Material). Если визуальный элемент меньше (например, иконка 24dp), увеличьте touch target через padding или `minWidth`/`minHeight`. Проверяйте с помощью Layout Inspector или инструмента Accessibility Scanner. Маленькие touch targets — частая причина промахов и неудобства, особенно для пользователей с моторными ограничениями.

### Базовое понимание TalkBack {#bazovoe-ponimanie-talkback}

TalkBack — экранный диктор Android, озвучивающий UI для слабовидящих пользователей. Он навигирует по фокусируемым элементам и читает их contentDescription/текст. Для поддержки TalkBack: логичный порядок фокуса, осмысленные описания, группировка связанных элементов через `android:screenReaderFocusable` и `accessibilityTraversalBefore/After`. Тестируйте приложение с включённым TalkBack на реальном устройстве.

### Поддержка системного масштабирования шрифта {#podderzhka-sistemnogo-masshtabirovaniya-shrifta}

Пользователь может увеличить размер шрифта в системных настройках. Используйте sp для текста и избегайте жёстких высот контейнеров, которые обрежут увеличенный текст. Проверяйте UI при максимальном масштабе шрифта. Для критически важных элементов (кнопки) можно использовать `android:autoSizeTextType`, чтобы текст подбирал размер под контейнер, но лучше адаптировать layout.

Дополнительно стоит помнить, что доступность — это не только TalkBack и шрифты. Цветовой контраст должен соответствовать рекомендациям WCAG (минимум 4.5:1 для обычного текста). Используйте theme attributes, которые уже подобраны с учётом контраста, и проверяйте контраст через Accessibility Scanner. Группируйте связанные элементы с помощью `android:screenReaderFocusable` и `android:focusable`, чтобы TalkBack не читал каждый элемент по отдельности, а воспринимал логические блоки. Для сложных компонентов (кастомные View) реализуйте `AccessibilityNodeInfo` и семантику. Тестируйте на реальных устройствах с включённым TalkBack, а не только в эмуляторе: поведение может отличаться.

При работе с разными плотностями экранов помните, что ресурсы квалификаторов (`drawable-xhdpi`, `values-sw600dp`) выбираются системой автоматически. Не создавайте отдельные layout'ы для каждой плотности — используйте гибкие размеры и один layout с квалификаторами размеров. Для иконок используйте векторные drawable (VectorDrawable): они масштабируются без потери качества и не требуют наборов под каждую плотность. Это экономит размер APK и упрощает поддержку.

**Типичные ошибки:**
- Использование px вместо dp/sp — разный вид на разных устройствах.
- Хранение размеров прямо в разметке вместо dimens.xml — сложно поддерживать.
- Отсутствие contentDescription у иконок — TalkBack читает «Кнопка» без смысла.
- Touch targets меньше 48dp — неудобно и недоступно.
- Жёсткие высоты контейнеров, обрезающие увеличенный шрифт.

**Короткая самопроверка:**
- [ ] Умею конвертировать dp в px и обратно.
- [ ] Храню размеры в dimens.xml.
- [ ] Добавляю contentDescription к иконкам.
- [ ] Обеспечиваю touch targets не меньше 48dp.
- [ ] Тестирую UI с увеличенным шрифтом.

### Вопросы на собеседовании

:::qa
- **Чем отличаются `px`, `dp` и `sp`?** — `px` — физические пиксели и зависят от плотности, `dp` — независимые от плотности единицы, приравненные к 1 px при 160 dpi, а `sp` — как dp, но дополнительно учитывает масштаб шрифта пользователя. Размеры View задают в dp, размер текста — в sp.
- **Почему нельзя использовать `px` в разметке?** — на устройствах с разной плотностью один и тот же размер в пикселях выглядит по-разному: на hdpi элемент станет физически меньше. Для конвертации в коде используют `TypedValue.applyDimension`, но лучше хранить значения в dp.
- **Зачем минимальный touch target 48dp?** — рекомендация Material: кликабельная область должна быть не меньше 48dp, иначе пользователю трудно попасть по элементу, особенно при моторных ограничениях. Если иконка 24dp, область увеличивают через padding или `minWidth`/`minHeight`.
- **Как TalkBack использует `contentDescription`?** — TalkBack — экранный диктор, который навигирует по фокусируемым элементам и озвучивает их текст или `contentDescription`. Для ImageView и иконок без текста описание обязательно, а для декоративных элементов ставят `@null`, чтобы диктор их пропускал.
- **Что ломается при системном масштабе шрифта?** — если размер задан в `dp` или у контейнера жёсткая высота, увеличенный шрифт обрезается или выходит за границы. Поэтому текст задают в `sp`, избегают фиксированных высот и проверяют UI при максимальном масштабе.
- **Зачем хранить размеры в `dimens.xml`?** — это централизует значения и позволяет задавать разные размеры для экранов через квалификаторы, например `values-sw600dp`. В XML обращаются через `@dimen/...`, в коде — через `resources.getDimensionPixelSize()`.
- **Как улучшить доступность экрана помимо contentDescription?** — обеспечивают логичный порядок фокуса, группируют связанные элементы через `android:screenReaderFocusable`, проверяют контраст, минимум 4.5:1 по WCAG, и тестируют с Accessibility Scanner и включённым TalkBack на реальном устройстве.
:::

## 11. Jetpack Compose Basics {#jetpack-compose-basics}

Jetpack Compose — современный декларативный UI-фреймворк для Android. Вместо XML-разметки и ручного обновления View вы описываете, как интерфейс должен выглядеть при данном состоянии, а Compose сам перерисовывает изменённые части. Это уменьшает boilerplate, устраняет findViewById и делает UI предсказуемым. Compose совместим с существующим View-кодом: его можно внедрять постепенно через ComposeView.

:::cards
- **Декларативность** — UI описывается как функция от состояния.
- **Composable** — функция, помеченная @Composable, описывающая часть интерфейса.
- **State** — изменение состояния автоматически вызывает перерисовку.
- **Interoperability** — Compose работает рядом с XML через ComposeView.
:::

> **Ключевая идея:** В Compose UI — это функция от состояния. Изменилось состояние — Compose сам перерисует нужные части. Никакого findViewById и ручного обновления View.

### @Composable и composable-функции {#composable-i-composable-funkcii}

Функция, помеченная `@Composable`, описывает часть интерфейса и может вызывать другие composable-функции. Она не возвращает View, а описывает «что нарисовать». Composable-функции должны быть быстрыми, идемпотентными и без побочных эффектов (side effects выносят в отдельные механизмы). Имена composable-функций пишут с заглавной буквы, как существительные.

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Привет, $name")
}
```

### Column, Row, Box {#column-row-box}

Базовые контейнеры: Column — вертикальный стек, Row — горизонтальный, Box — наложение элементов друг на друга (как FrameLayout). Они принимают `modifier` и параметры выравнивания (`horizontalAlignment`, `verticalArrangement`). Вложенность контейнеров заменяет вложенность ViewGroup, но благодаря декларативности код читается линейно.

```kotlin
Column(
    modifier = Modifier.fillMaxSize(),
    verticalArrangement = Arrangement.Center,
    horizontalAlignment = Alignment.CenterHorizontally
) {
    Text("Заголовок")
    Button(onClick = {}) { Text("OK") }
}
```

### Modifier и порядок модификаторов {#modifier-i-poryadok-modifikatorov}

`Modifier` — цепочка модификаций: размер, отступы, фон, кликабельность, скролл. Порядок модификаторов важен: они применяются слева направо, каждый оборачивает результат предыдущего. Например, `Modifier.padding(8.dp).clickable {}` — отступ внутри кликабельной области; `Modifier.clickable {}.padding(8.dp)` — кликабельна только область после отступа. Правило: сначала размер/отступы, потом визуальные эффекты, потом взаимодействие — но всегда думайте о том, что должно быть кликабельным.

### Text, Button, Image, TextField {#text-button-image-textfield}

Базовые компоненты: `Text` отображает текст, `Button` — кликабельную кнопку со слотом для содержимого, `Image` — изображение (painter), `TextField`/`OutlinedTextField` — поле ввода. TextField управляется состоянием: значение и обработчик изменения передаются явно (`value`, `onValueChange`), что делает компонент stateless и предсказуемым.

```kotlin
var name by remember { mutableStateOf("") }
OutlinedTextField(
    value = name,
    onValueChange = { name = it },
    label = { Text("Имя") }
)
```

### LazyColumn и items {#lazycolumn-i-items}

`LazyColumn` — ленивый вертикальный список, аналог RecyclerView: создаёт элементы только для видимой части экрана. Внутри используется DSL: `items(list) { item -> ... }`. Для больших списков это эффективнее, чем Column с forEach. Поддерживает `itemsIndexed`, ключи для стабильности и анимации.

```kotlin
LazyColumn {
    items(users) { user ->
        Text(user.name)
    }
}
```

### remember и mutableStateOf {#remember-i-mutablestateof}

`remember { mutableStateOf(initial) }` создаёт состояние, которое переживает рекомпозицию (перерисовку) функции. `mutableStateOf` — наблюдаемый контейнер; при изменении `.value` Compose автоматически перерисовывает зависимые части. Делегат `by` позволяет обращаться к значению как к обычной переменной. `remember` хранит значение пока composable находится в композиции; при уходе со экрана состояние теряется (для долгоживущего состояния используют ViewModel).

### @Preview {#preview}

`@Preview` позволяет видеть composable в Android Studio без запуска на устройстве. Можно указать тему, размер экрана, локаль, шрифт. Превью — это только инструмент разработки, в рантайме не участвует. Для динамических данных создают превью с фейковыми данными.

```kotlin
@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    Greeting("Android")
}
```

### ComposeView в XML-экране {#composeview-v-xml-ekrane}

`ComposeView` — View, в котором можно разместить composable-дерево внутри XML-экрана. Это позволяет внедрять Compose постепенно в существующее приложение: один экран может быть на XML, а его часть — на Compose. В Activity/Fragment вызывают `composeView.setContent { ... }`. ComposeView требует, чтобы на экране был Compose-контекст (тема), обычно задаваемый через `ComposeView` + `MaterialTheme`.

```kotlin
val composeView = findViewById<ComposeView>(R.id.compose_view)
composeView.setContent {
    MaterialTheme {
        Greeting("Compose")
    }
}
```

**Мостик к Middle.** Базовые Compose-навыки Junior — это фундамент. На уровне Middle углубляются три направления: `middle-ui-compose` (продвинутые layout'ы, анимации, кастомные компоненты, performance), `middle-ui-state` (state hoisting, ViewModel + Compose, rememberSaveable, derivedStateOf), `middle-ui-sideeffects` (LaunchedEffect, DisposableEffect, SideEffect, rememberCoroutineScope). Junior-уровня достаточно, чтобы писать простые экраны; для production-приложений нужен Middle.

Дополнительно стоит понимать, что Compose использует композицию (composition) и рекомпозицию (recomposition). Рекомпозиция — это повторный вызов composable-функции при изменении состояния, от которого она зависит. Compose отслеживает чтение состояния (state reads) и перерисовывает только те части дерева, которые действительно изменились. Это делает UI эффективным, но требует дисциплины: composable-функции должны быть чистыми (pure), без побочных эффектов, и не должны выполнять тяжёлую работу. Тяжёлые вычисления выносят в ViewModel или используют `remember` с ключами.

Для работы со списками в Compose важно использовать стабильные ключи (`key = { it.id }`) в `items`, чтобы Compose мог корректно отслеживать элементы при изменениях (добавление, удаление, перемещение). Без ключей Compose использует позицию, что может привести к анимационным артефактам и потере состояния элементов. Также помните про `rememberSaveable` — он сохраняет состояние при configuration change и process death, в отличие от обычного `remember`, который живёт только в рамках композиции.

При внедрении Compose в существующий проект через ComposeView важно обеспечить тему: используйте `MaterialTheme` с цветами из вашей темы или `MdcTheme` для совместимости с Material Components. Иначе Compose-компоненты будут выглядеть несогласованно с остальным экраном. ComposeView также должен иметь корректные размеры (`match_parent` или фиксированные), иначе композиция может не отрисоваться.

**Типичные ошибки:**
- Выполнять побочные эффекты прямо в composable-функции — приводит к повторным вызовам и багам.
- Неправильный порядок модификаторов — кликабельная область не совпадает с визуальной.
- Хранить состояние в composable без remember — состояние сбрасывается при рекомпозиции.
- Использовать Column для длинных списков вместо LazyColumn — проблемы с производительностью.
- Забывать setContent и theme в ComposeView — пустой экран или крах.

**Короткая самопроверка:**
- [ ] Умею создать composable-функцию.
- [ ] Понимаю Column, Row, Box и Modifier.
- [ ] Знаю порядок модификаторов.
- [ ] Умею использовать remember и mutableStateOf.
- [ ] Могу встроить Compose в XML через ComposeView.

### Вопросы на собеседовании

:::qa
- **Чем `@Composable` отличается от View?** — composable-функция не создаёт и не возвращает View, а описывает интерфейс как функцию от состояния; Compose сам рисует и обновляет нужные части. Функции должны быть быстрыми, идемпотентными и без побочных эффектов, а их имена пишут с заглавной буквы.
- **Что такое рекомпозиция?** — это повторный вызов composable-функции, когда изменилось состояние, которое она читала. Compose отслеживает чтения состояния и перерисовывает только затронутые части дерева, поэтому тяжёлую работу выносят из composable.
- **Зачем нужны `remember` и `mutableStateOf`?** — `mutableStateOf` создаёт наблюдаемый контейнер: при изменении `.value` Compose перерисовывает зависимые части. `remember` сохраняет это значение между рекомпозициями, но теряет его при уходе composable из композиции, поэтому для долгоживущего состояния используют ViewModel или `rememberSaveable`.
- **Чем `LazyColumn` отличается от `Column`?** — `Column` размещает всех детей сразу, а `LazyColumn` создаёт только видимые элементы, как RecyclerView. Для длинных списков LazyColumn эффективнее, а для стабильной идентификации в `items` передают `key = { it.id }`.
- **Как встроить Compose в XML-экран?** — добавляют `ComposeView` в разметку и вызывают `composeView.setContent { MaterialTheme { ... } }` в Activity или Fragment. Нужно обеспечить тему и корректные размеры View, иначе композиция может не отрисоваться.
- **Почему порядок модификаторов важен?** — модификаторы применяются слева направо, и каждый оборачивает результат предыдущего. Например, `Modifier.padding(8.dp).clickable {}` делает отступ внутри кликабельной области, а обратный порядок оставляет кликабельной только область после отступа.
- **Чем `remember` отличается от `rememberSaveable`?** — `remember` хранит значение, только пока composable находится в композиции, и теряет его при повороте экрана. `rememberSaveable` сохраняет состояние через SavedInstanceState и переживает configuration change и process death.
:::

## Итоговая самопроверка категории {#itogovaya-samoproverka}

- [ ] Умею оформлять текстовые компоненты: размер, цвет, maxLines, ellipsize.
- [ ] Могу создать кнопку, обработать нажатие и управлять состоянием enabled.
- [ ] Загружаю изображения из drawable и сети (Coil), задаю scaleType и contentDescription.
- [ ] Работаю с EditText: inputType, TextWatcher, TextInputLayout, валидация.
- [ ] Строю разметку на LinearLayout и ConstraintLayout, понимаю веса и constraints.
- [ ] Использую View Binding в Activity и Fragment с правильным жизненным циклом.
- [ ] Настраиваю RecyclerView: Adapter, ViewHolder, LayoutManager, DiffUtil.
- [ ] Применяю темы и стили, Material 3, Dynamic Color и DayNight.
- [ ] Задаю размеры в dp/sp, обеспечиваю touch targets и contentDescription.
- [ ] Пишу базовые экраны на Jetpack Compose: composable, контейнеры, состояние, списки.

## Источники и документация {#istochniki-i-dokumentaciya}

### Официальная документация

- [Styles and themes](https://developer.android.com/develop/ui/views/theming/themes)
- [Material Design 3](https://m3.material.io/develop/android/mdc-android)
- [Dynamic color](https://developer.android.com/develop/ui/views/theming/dynamic-colors)
- [Dark theme](https://developer.android.com/develop/ui/views/theming/darktheme)
- [Accessibility](https://developer.android.com/guide/topics/ui/accessibility)
- [Support different screen sizes](https://developer.android.com/guide/practices/screens_support)
- [Jetpack Compose](https://developer.android.com/develop/ui/compose)
- [Compose layouts](https://developer.android.com/develop/ui/compose/layouts)
- [State in Compose](https://developer.android.com/develop/ui/compose/state)
- [Compose lists](https://developer.android.com/develop/ui/compose/lists)
- [Compose interoperability](https://developer.android.com/develop/ui/compose/migrate/interoperability-apis)

### Статьи

- [Material 3 color system](https://m3.material.io/styles/color/overview)
- [Compose thinking](https://developer.android.com/develop/ui/compose/mental-model)
- [Touch target size](https://developer.android.com/guide/topics/ui/accessibility/apps#large-controls)
- [Font scaling](https://developer.android.com/develop/ui/compose/accessibility/scalable-content)
- [Compose preview](https://developer.android.com/develop/ui/compose/tooling/previews)
