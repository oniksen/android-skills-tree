# Навигация и компоненты Android

**Уровень:** Junior  
**Категория:** Навигация и компоненты  
**Язык:** Kotlin  
**Кратко:** Четыре базовых компонента приложения, навигация между экранами и выбор между Service и WorkManager.

## 1. Fragment {#fragment}

Fragment — переиспользуемый UI-компонент Android, у которого есть собственный жизненный цикл и который размещается внутри Activity. Идея в том, что один экран приложения можно разбить на независимые части: список, детали, форму ввода, панель фильтров. Каждая часть живёт в своём Fragment и может переиспользоваться в других Activity или на других экранах. Fragment не является самостоятельным компонентом приложения: он всегда привязан к Activity-хосту и не может существовать сам по себе. Именно поэтому все системные события (поворот экрана, уход в фон, уничтожение процесса) приходят сначала в Activity, а уже оттуда — во Fragment.

Fragment решает три задачи. Первая — модульность: один экран собирается из нескольких независимых блоков. Вторая — адаптивность: на телефоне список и детали показываются на отдельных экранах, на планшете — рядом. Третья — управление стеком экранов: FragmentManager хранит back stack, позволяя пользователю возвращаться кнопкой «Назад». Понимание Fragment необходимо, даже если вы пишете на Compose: многие библиотеки и старый код до сих пор используют View-систему.

:::cards
- **Модульность** — экран собирается из независимых блоков, каждый со своим состоянием.
- **Адаптивность** — один и тот же Fragment показывается по-разному на телефонах и планшетах.
- **Back stack** — FragmentManager хранит стек переходов и поддерживает кнопку «Назад».
- **Хост** — Fragment всегда живёт внутри Activity и не запускается сам по себе.
:::

> **Ключевая идея:** Fragment — это не «маленькая Activity», а часть экрана со своим жизненным циклом и собственным View. Путать эти две сущности — частая причина утечек памяти и багов при повороте.

### Создание Fragment {#fragment-create}

Чтобы создать Fragment, наследуются от `androidx.fragment.app.Fragment` и переопределяют `onCreateView`, где раздувают layout. Современный и рекомендованный подход — использовать ViewBinding и создавать разметку в `onCreateView`, а инициализировать View — в `onViewCreated`. Это разделяет создание разметки и её настройку.

```kotlin
class ProfileFragment : Fragment(R.layout.fragment_profile) {
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentProfileBinding.bind(view)
        binding.titleText.text = "Профиль"
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
```

Fragment без UI (headless) создаётся без разметки и используется для хранения логики, которая должна переживать поворот экрана: например, загрузка данных. В современном коде эту роль чаще выполняет ViewModel, но headless Fragment всё ещё встречается в старых проектах.

Типичные ошибки: хранить ссылку на View после `onDestroyView`, обращаться к `binding` из фонового потока, выполнять тяжёлую работу прямо в `onCreateView`. Правило: `onCreateView` должен только раздувать разметку, а вся логика — в `onViewCreated` или во ViewModel.

### Жизненный цикл Fragment {#fragment-lifecycle}

Жизненный цикл Fragment сложнее, чем у Activity, потому что у него есть два уровня: сам Fragment и его View. Основные коллбэки:

- `onAttach(context)` — Fragment привязан к Activity-хосту.
- `onCreate(savedInstanceState)` — Fragment создан, но View ещё нет. Здесь инициализируют не-UI данные.
- `onCreateView` — создаётся View (раздувается layout).
- `onViewCreated` — View готов, можно настраивать слушатели и наблюдатели.
- `onStart`, `onResume` — Fragment становится видимым и активным.
- `onPause`, `onStop` — Fragment уходит в фон.
- `onDestroyView` — View уничтожается, но сам Fragment может ещё жить.
- `onDestroy` — Fragment уничтожается.
- `onDetach` — Fragment отвязывается от Activity.

Важно: Fragment может пережить уничтожение своего View. Например, при помещении в back stack вызывается `onDestroyView`, но `onDestroy` — нет. Поэтому данные, которые должны пережить смену экрана, хранят не в View, а в ViewModel или в arguments.

### FragmentManager {#fragment-manager}

`FragmentManager` — это движок, который управляет Fragment'ами внутри контейнера: добавляет, удаляет, заменяет, держит back stack. В Activity используют `supportFragmentManager`, во Fragment — `childFragmentManager` для вложенных Fragment'ов и `parentFragmentManager` для обращения к родителю.

```kotlin
val fragmentManager = supportFragmentManager
val current = fragmentManager.findFragmentById(R.id.container)
```

Никогда не создавайте Fragment напрямую через конструктор с аргументами — используйте фабричный метод или arguments. FragmentManager восстанавливает Fragment при повороте экрана через рефлексию, вызывая пустой конструктор, поэтому конструктор с параметрами приведёт к краху при восстановлении.

### FragmentTransaction {#fragment-transaction}

`FragmentTransaction` описывает набор операций над Fragment'ами. Транзакция создаётся через `beginTransaction()`, в неё добавляют операции, затем вызывают `commit()` или `commitNow()`.

```kotlin
supportFragmentManager.beginTransaction()
    .replace(R.id.container, DetailsFragment())
    .addToBackStack("details")
    .commit()
```

`commit()` ставит транзакцию в очередь главного потока и выполняет асинхронно. `commitNow()` выполняет синхронно и не позволяет добавить в back stack. `commitAllowingStateLoss()` выполняет даже после сохранения состояния — использовать только в крайних случаях, иначе потеряются данные пользователя.

### add, replace и remove {#fragment-add-replace-remove}

Три базовые операции:

- `add(containerId, fragment)` — добавляет Fragment в контейнер, не удаляя другие. Используется для нескольких Fragment в одном контейнере.
- `replace(containerId, fragment)` — удаляет все Fragment'ы из контейнера и добавляет новый. Это самая частая операция для навигации.
- `remove(fragment)` — удаляет конкретный Fragment.

`replace` удобен для переключения экранов, но он уничтожает View предыдущего Fragment (вызывает `onDestroyView`). Если нужно сохранить состояние View, используют `add` + `hide`/`show`, но это усложняет управление памятью.

### Передача аргументов через Bundle {#fragment-arguments-bundle}

Аргументы передают через `Bundle`, устанавливая свойство `arguments` до добавления Fragment в менеджер. Данные должны быть примитивами или Parcelable.

```kotlin
class DetailsFragment : Fragment(R.layout.fragment_details) {
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val itemId = arguments?.getLong("item_id") ?: return
        // загрузить данные по itemId
    }
}

// при создании
val fragment = DetailsFragment().apply {
    arguments = bundleOf("item_id" to 42L)
}
```

Лучше обернуть создание в фабричный метод `newInstance(...)`, чтобы не забыть аргументы:

```kotlin
companion object {
    fun newInstance(itemId: Long): DetailsFragment =
        DetailsFragment().apply {
            arguments = bundleOf("item_id" to itemId)
        }
}
```

### View Lifecycle и его отличие от Fragment Lifecycle {#fragment-view-lifecycle}

У Fragment есть два жизненных цикла: `lifecycle` самого Fragment и `viewLifecycleOwner.lifecycle` его View. View живёт от `onCreateView` до `onDestroyView`, а Fragment может жить дольше (например, в back stack). Поэтому наблюдатели LiveData и Flow нужно привязывать к `viewLifecycleOwner`, а не к самому Fragment — иначе они продолжат работать после уничтожения View и вызовут утечку или крах.

```kotlin
viewLifecycleOwner.lifecycleScope.launch {
    viewModel.uiState.collect { state -> render(state) }
}
```

Типичная ошибка — использовать `lifecycleScope` Fragment вместо `viewLifecycleOwner.lifecycleScope` для UI-обновлений. Это приводит к обращению к уничтоженному View.

### Взаимодействие Activity и Fragment {#fragment-activity-interaction}

Activity — хост Fragment. Общие варианты взаимодействия:

- Activity вызывает методы Fragment через `findFragmentById` / `findFragmentByTag`.
- Fragment обращается к Activity через `requireActivity()` или интерфейс обратного вызова.
- Современный способ — Fragment Result API: Fragment отправляет результат, другой Fragment или Activity его получает.

```kotlin
// отправка результата
setFragmentResult("request_key", bundleOf("result" to "ok"))

// получение
setFragmentResultListener("request_key") { _, bundle ->
    val result = bundle.getString("result")
}
```

Ещё один способ — общая ViewModel, привязанная к Activity: `by activityViewModels()`. Это удобно для обмена данными между Fragment'ами без прямых ссылок.

Типичные ошибки взаимодействия: хранить ссылку на Activity в поле Fragment (утечка), вызывать `requireActivity()` до `onAttach`, передавать данные через конструктор Fragment.

**Самопроверка:**
- [ ] Какие коллбэки вызываются при повороте экрана?
- [ ] Чем `viewLifecycleOwner` отличается от `lifecycle` Fragment?
- [ ] Почему нельзя передавать аргументы через конструктор Fragment?
- [ ] Когда использовать `commit()` и когда `commitNow()`?

### Вопросы на собеседовании

:::qa
- **Чем `viewLifecycleOwner` отличается от жизненного цикла самого Fragment?** — `viewLifecycleOwner` живёт только пока есть View — от `onCreateView` до `onDestroyView`, а Fragment может оставаться в back stack и после этого. Наблюдателей LiveData и корутины для UI привязывают к `viewLifecycleOwner`, иначе они продолжат работать с уничтоженной View и вызовут утечку или крах.
- **Почему binding надо обнулять в `onDestroyView()`?** — View в `onDestroyView` уничтожается, а сам Fragment ещё жив, поэтому оставленная ссылка на binding удерживает мёртвую View и ведёт к утечке памяти. После `_binding = null` обращение к `binding` даст `NullPointerException`, что вовремя покажет ошибку.
- **Чем `Fragment Result API` лучше прямых ссылок между Fragment'ами?** — `setFragmentResult()` и `setFragmentResultListener()` связывают отправителя и получателя через ключ вместо прямых ссылок друг на друга и на Activity. Это снижает связность и риск утечек, а результат доставляется через общий `FragmentManager`, даже если экраны не знают о существовании друг друга.
- **В чём разница между `childFragmentManager` и `parentFragmentManager`?** — `childFragmentManager` управляет вложенными Fragment'ами внутри текущего, а `parentFragmentManager` — менеджером родителя (или Activity для корневого Fragment). Неверный выбор приведёт к транзакции в чужом контейнере и неправильному back stack.
- **Почему нельзя передавать данные через конструктор Fragment?** — При восстановлении система создаёт Fragment через рефлексию пустым конструктором, поэтому конструктор с параметрами упадёт после поворота экрана или смерти процесса. Данные кладут в `arguments` (`Bundle`), обычно через фабричный метод `newInstance()`.
- **Чем `commit()` отличается от `commitNow()`?** — `commit()` ставит `FragmentTransaction` в очередь и выполняет её асинхронно на главном потоке, поддерживая `addToBackStack()`. `commitNow()` выполняется синхронно, но не позволяет добавить транзакцию в back stack.
- **Что происходит со View Fragment при `replace()` и помещении в back stack?** — `replace()` удаляет предыдущий Fragment из контейнера и вызывает у него `onDestroyView()`, но не `onDestroy` — сам Fragment остаётся в back stack. Поэтому состояние, переживающее возврат, хранят в ViewModel или `arguments`, а не в полях View.
:::

## 2. Navigation Component {#navigation-component}

Navigation Component — библиотека Jetpack для навигации между экранами (destinations) по декларативному графу. Она заменяет ручное управление FragmentTransaction и back stack, давая единый способ навигации, передачи аргументов, deep links и интеграции с Bottom Navigation. Компонент состоит из трёх частей: Navigation Graph (XML), NavHost (контейнер) и NavController (движок навигации).

Navigation Component не отменяет Fragment — он управляет ими под капотом. Destinations могут быть Fragment, Activity или кастомными. Граф описывает, куда можно перейти и какие аргументы передать, а NavController выполняет переходы и ведёт back stack.

:::cards
- **Граф** — XML-описание экранов и переходов между ними.
- **NavHost** — контейнер, в котором отображается текущий destination.
- **NavController** — движок: выполняет навигацию, хранит back stack.
- **Safe Args** — генерация типобезопасных классов для аргументов.
:::

> **Ключевая идея:** Navigation Component переносит навигацию из кода в декларативный граф. Это уменьшает баги с back stack и делает переходы предсказуемыми.

### Navigation Graph XML {#nav-graph-xml}

Граф навигации — XML-файл в `res/navigation/`, корневой элемент `<navigation>`. Каждый экран — `<fragment>` или `<activity>` с `android:id` и `android:name`. Переходы описываются тегом `<action>`.

```xml
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/nav_graph"
    app:startDestination="@id/homeFragment">

    <fragment
        android:id="@+id/homeFragment"
        android:name="com.example.app.HomeFragment"
        android:label="Home">
        <action
            android:id="@+id/action_home_to_details"
            app:destination="@id/detailsFragment" />
    </fragment>

    <fragment
        android:id="@+id/detailsFragment"
        android:name="com.example.app.DetailsFragment"
        android:label="Details" />
</navigation>
```

Граф можно редактировать визуально в Android Studio. Рекомендуется держать один граф на фичу или один корневой граф с вложенными.

### NavController {#nav-controller}

`NavController` — объект, который выполняет навигацию. Получают его через `findNavController()` в Fragment или Activity, либо через `NavHostFragment.findNavController(fragment)`.

```kotlin
val navController = findNavController()
navController.navigate(R.id.action_home_to_details)
```

NavController хранит back stack destination'ов и предоставляет `navigateUp()` и `popBackStack()`. Навигацию лучше вызывать из ViewModel через события, а не напрямую из View, чтобы не дублировать логику.

### NavHostFragment {#nav-host-fragment}

`NavHostFragment` — Fragment-контейнер, который отображает текущий destination из графа. Объявляется в layout Activity:

```xml
<fragment
    android:id="@+id/nav_host_fragment"
    android:name="androidx.navigation.fragment.NavHostFragment"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    app:defaultNavHost="true"
    app:navGraph="@navigation/nav_graph" />
```

`app:defaultNavHost="true"` делает NavHost обработчиком системной кнопки «Назад». Без этого back stack будет управляться вручную.

### Переходы между destinations {#nav-transitions}

Переходы выполняются через `navigate()` с id action или destination. Можно передавать `NavOptions` для настройки анимаций и поведения back stack.

```kotlin
val options = NavOptions.Builder()
    .setEnterAnim(R.anim.slide_in_right)
    .setExitAnim(R.anim.slide_out_left)
    .setPopEnterAnim(R.anim.slide_in_left)
    .setPopExitAnim(R.anim.slide_out_right)
    .build()

findNavController().navigate(R.id.detailsFragment, null, options)
```

Анимации переходов задаются также в XML через `<action app:enterAnim=.../>`. Рекомендуется держать анимации в графе, чтобы не дублировать.

### Передача аргументов {#nav-arguments}

Аргументы объявляются в графе через `<argument>` с типом и значением по умолчанию. Значения передаются в Bundle при навигации.

```xml
<fragment
    android:id="@+id/detailsFragment"
    android:name="com.example.app.DetailsFragment">
    <argument
        android:name="itemId"
        app:argType="long" />
</fragment>
```

```kotlin
val args = DetailsFragmentArgs.fromBundle(requireArguments())
val itemId = args.itemId
```

Типы аргументов: integer, long, float, boolean, string, reference, enum, Parcelable, Serializable. Обязательные аргументы не имеют defaultValue.

### Safe Args {#nav-safe-args}

Safe Args — плагин Gradle, генерирующий типобезопасные классы `*Args` и `*Directions`. Включается в `build.gradle`:

```gradle
plugins {
    id "androidx.navigation.safeargs.kotlin"
}
```

Сгенерированные классы избавляют от ручной работы с Bundle и ключами, предотвращая опечатки. Навигация с аргументами:

```kotlin
val action = HomeFragmentDirections.actionHomeToDetails(itemId = 42L)
findNavController().navigate(action)
```

Safe Args рекомендуется использовать всегда, когда есть аргументы: ошибки типов ловятся на этапе компиляции.

### Back Stack в Navigation Component {#nav-back-stack}

NavController ведёт back stack destination'ов. `popBackStack()` возвращает на предыдущий экран, `navigateUp()` учитывает иерархию (up vs back). Отдельного `addToBackStack` в графе нет: NavController кладёт destination в стек при каждом переходе.

Важные нюансы: `app:popUpTo`/`app:popUpToInclusive` на action, наоборот, удаляют destinations из back stack перед переходом. Поведение «Назад» на стартовом destination завершает Activity. Глубокие стеки лучше ограничивать через `popUpTo` до корня, иначе накапливаются дубликаты.

### Deep Links {#nav-deep-links}

Deep links позволяют открывать конкретный экран по URI. Объявляются в графе:

```xml
<deepLink app:uri="https://example.com/items/{itemId}" />
```

И в манифесте Activity:

```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="example.com" />
</intent-filter>
```

NavController автоматически разбирает URI и переходит на нужный destination с аргументами. Поддерживаются и явные deep links (explicit), например через `PendingIntent` из уведомления.

### Bottom Navigation {#nav-bottom-navigation}

Navigation Component интегрируется с `BottomNavigationView`: `NavigationUI.setupWithNavController(bottomNav, navController)` связывает пункты меню с destination'ами графа по id. Пункты меню должны иметь те же id, что и destination'ы.

```kotlin
val bottomNav = findViewById<BottomNavigationView>(R.id.bottom_nav)
NavigationUI.setupWithNavController(bottomNav, navController)
```

Это даёт автоматическое переключение экранов и сохранение back stack для каждой вкладки (с Navigation 2.4+).

**Мостик к Middle:** В Jetpack Compose навигация строится через `NavHost` из `androidx.navigation:navigation-compose`, где destinations — composable-функции, а не Fragment'ы. Маршруты задаются строками или, в новых версиях, type-safe маршрутами (сериализуемые классы/объекты) — это убирает строковые ключи и делает навигацию проверяемой компилятором. Принципы (граф, NavController, back stack, deep links, Safe Args) остаются теми же; меняется только способ описания экранов.

**Самопроверка:**
- [ ] Из чего состоит Navigation Component?
- [ ] Зачем нужен `app:defaultNavHost="true"`?
- [ ] Как Safe Args предотвращает ошибки?
- [ ] Чем `navigateUp()` отличается от `popBackStack()`?

### Вопросы на собеседовании

:::qa
- **Зачем нужен граф навигации вместо ручных `FragmentTransaction`?** — Граф в `res/navigation/` декларативно описывает экраны и переходы, а `NavController` берёт на себя back stack. Это убирает дублирование транзакций в коде и делает навигацию предсказуемой.
- **Что дают type-safe маршруты и Safe Args?** — Плагин Safe Args генерирует классы `*Args` и `*Directions`, заменяя ручные ключи `Bundle`, поэтому опечатки и неверные типы ловятся на этапе компиляции. В Compose ту же роль играют сериализуемые объекты маршрутов вместо строковых путей.
- **Как передать аргументы между экранами?** — Аргументы объявляются в графе тегом `<argument>` с типом, а значение передаётся через сгенерированный `*Directions`-класс или `Bundle`. Получатель читает их через `DetailsFragmentArgs.fromBundle(requireArguments())`.
- **Чем `popUpTo` отличается от `navigate()`?** — `navigate()` добавляет destination в back stack, а `app:popUpTo` с `popUpToInclusive` на action, наоборот, выталкивает экраны из стека перед переходом. Так предотвращают накопление дубликатов, например возвращаясь к корневому экрану.
- **Как работает deep link?** — В графе объявляется `<deepLink app:uri="...">`, а в манифесте Activity — `<intent-filter>` с действием `VIEW` и категорией `BROWSABLE`. `NavController` сам разбирает URI и открывает нужный destination с аргументами; явный deep link может прийти из `PendingIntent` уведомления.
- **Чем `navigateUp()` отличается от `popBackStack()`?** — `navigateUp()` учитывает иерархию графа и работает как «Up», а `popBackStack()` просто снимает верхний destination как кнопка «Назад». На стартовом destination «Назад» завершает Activity.
- **Зачем у `NavHostFragment` указывать `app:defaultNavHost="true"`?** — Флаг делает NavHost обработчиком системной кнопки «Назад», чтобы она управляла back stack графа. Без него навигация не перехватывает «Назад» и её придётся обрабатывать вручную.
:::

## 3. Service {#service}

Service — компонент приложения для выполнения операций без пользовательского интерфейса: воспроизведение музыки, синхронизация данных, отслеживание местоположения, загрузка файлов. Service работает в главном потоке процесса (если не создать отдельный поток), поэтому тяжёлую работу нужно выносить в корутины или фоновые потоки. Service не создаёт окна и не взаимодействует с пользователем напрямую — для этого нужен Foreground Service с уведомлением.

Service бывает двух видов: Started (запускается через `startService`/`startForegroundService`) и Bound (привязывается через `bindService`). Started Service работает до тех пор, пока сам не вызовет `stopSelf()` или его не остановят. Bound Service живёт, пока есть хотя бы один клиент.

:::cards
- **Без UI** — Service выполняет работу в фоне без экрана.
- **Started** — запускается явно и работает до остановки.
- **Bound** — привязывается к клиенту и живёт пока клиент подключён.
- **Foreground** — видимый пользователю через уведомление, не убивается системой.
:::

> **Ключевая идея:** Service — это не «фоновый поток», а компонент с собственным жизненным циклом. Тяжёлую работу всё равно нужно выполнять в отдельном потоке или корутине.

### Назначение Service {#service-purpose}

Service нужен, когда операция должна выполняться независимо от видимости экрана: воспроизведение аудио в фоне, загрузка файла, периодическая синхронизация. Если операция привязана к экрану — используйте ViewModel и корутины. Если нужно выполнить разовую отложенную работу с гарантией выполнения — WorkManager (см. ниже).

Service объявляется в манифесте:

```xml
<service
    android:name=".PlaybackService"
    android:exported="false" />
```

### Started Service {#service-started}

Started Service запускается через `startService()` (или `startForegroundService()` для foreground). Система вызывает `onStartCommand()`, где запускается работа. Service должен сам остановиться через `stopSelf()` или быть остановлен через `stopService()`.

```kotlin
class DownloadService : Service() {
    override fun onStartCommand(
        intent: Intent?,
        flags: Int,
        startId: Int
    ): Int {
        // запуск загрузки в корутине
        return START_NOT_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
```

Возвращаемое значение `onStartCommand` определяет поведение при убийстве процесса:
- `START_STICKY` — Service перезапустится с null intent.
- `START_NOT_STICKY` — не перезапускать.
- `START_REDELIVER_INTENT` — перезапустить с тем же intent.

### Bound Service {#service-bound}

Bound Service предоставляет интерфейс для взаимодействия через `IBinder`. Клиент (Activity) привязывается через `bindService()` и получает binder. Service живёт, пока есть привязанные клиенты.

```kotlin
class LocalService : Service() {
    private val binder = LocalBinder()

    inner class LocalBinder : Binder() {
        fun getService(): LocalService = this@LocalService
    }

    override fun onBind(intent: Intent): IBinder = binder
}
```

Bound Service удобен для локального взаимодействия в рамках одного процесса. Для межпроцессного взаимодействия используют AIDL или Messenger.

### Жизненный цикл Service {#service-lifecycle}

- `onCreate()` — Service создан (один раз).
- `onStartCommand()` — при каждом вызове `startService`.
- `onBind()` — при привязке клиента.
- `onUnbind()` — при отключении последнего клиента.
- `onDestroy()` — Service уничтожается.

Если Service и started, и bound, он уничтожается только когда остановлен (`stopSelf`/`stopService`) И нет привязанных клиентов.

### Foreground Service {#service-foreground}

Foreground Service выполняет работу, заметную пользователю, и показывает уведомление. Система не убивает его при нехватке памяти (в отличие от обычного). Запускается через `startForegroundService()` и в течение 5 секунд должен вызвать `startForeground()`.

```kotlin
class PlaybackService : Service() {
    override fun onStartCommand(
        intent: Intent?,
        flags: Int,
        startId: Int
    ): Int {
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Воспроизведение")
            .setSmallIcon(R.drawable.ic_play)
            .build()
        startForeground(1, notification)
        // запуск воспроизведения
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
```

Foreground Service обязателен для длительных операций в фоне начиная с Android 8.0 (Oreo): обычный Service убивается через несколько минут после ухода приложения в фон.

### Foreground Service types (Android 14+) {#service-foreground-types}

Начиная с Android 14 (API 34), Foreground Service должен указывать тип работы через атрибут `android:foregroundServiceType` в манифесте и matching-разрешение. Типы: `camera`, `connectedDevice`, `dataSync`, `health`, `location`, `mediaPlayback`, `mediaProjection`, `microphone`, `phoneCall`, `remoteMessaging`, `shortService`, `specialUse`, `systemExempted`.

```xml
<service
    android:name=".PlaybackService"
    android:foregroundServiceType="mediaPlayback"
    android:exported="false" />

<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission
    android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />
```

В коде тип передаётся в `startForeground()`:

```kotlin
startForeground(
    1,
    notification,
    ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK
)
```

Несоответствие типа и разрешения приводит к `SecurityException`, а отсутствие типа в манифесте — к `MissingForegroundServiceTypeException`. Тип `shortService` ограничен 3 минутами и не требует специального разрешения — подходит для коротких задач.

### Уведомление для Foreground Service {#service-notification}

Уведомление создаётся через `NotificationCompat.Builder` и канал уведомлений (NotificationChannel, обязателен с Android 8.0). Уведомление должно быть информативным и позволять пользователю остановить работу (например, кнопка «Стоп»). Плохая практика — уведомление без возможности остановки или с вводящим в заблуждение текстом.

### Ограничения фонового выполнения Android {#service-background-limits}

С Android 8.0 background execution limits: приложение в фоне не может запускать обычный Service (`startService` бросит `IllegalStateException`). Разрешены: Foreground Service (с уведомлением), WorkManager, JobScheduler, AlarmManager. Также действуют ограничения на фоновый доступ к местоположению, камере, микрофону. Нарушение приводит к краху или отзыву разрешения системой.

### WorkManager vs Service {#service-vs-workmanager}

WorkManager — рекомендованный API для отложенной и гарантированной фоновой работы. Сравнение:

- Service: немедленное выполнение, контроль потока, подходит для длительных операций в реальном времени (музыка, навигация). Требует Foreground Service для работы в фоне.
- WorkManager: отложенная работа с гарантией выполнения, переживает перезагрузку, учитывает ограничения (зарядка, сеть). Не подходит для длительной работы в реальном времени.

Правило выбора: нужна длительная работа с UI-индикацией → Foreground Service. Нужна надёжная отложенная задача → WorkManager. Нужна немедленная короткая задача в фоне → корутина в ViewModel или `lifecycleScope`.

**Самопроверка:**
- [ ] Чем Started отличается от Bound Service?
- [ ] Зачем Foreground Service показывает уведомление?
- [ ] Какие типы Foreground Service есть в Android 14+?
- [ ] Когда выбрать WorkManager вместо Service?

### Вопросы на собеседовании

:::qa
- **Чем started Service отличается от bound?** — Started Service запускается через `startService()` и живёт до `stopSelf()`/`stopService()`, даже если клиентов нет. Bound привязывается через `bindService()` и работает, пока есть хотя бы один клиент с `IBinder`; если Service и started, и bound, он уничтожается только после остановки и отключения всех клиентов.
- **Почему с Android 8.0 запрещено запускать обычный Service в фоне?** — Background execution limits не дают фоновому приложению вызвать `startService()`: система бросит `IllegalStateException`. Это сделано ради экономии батареи, поэтому для заметной пользователю работы нужен Foreground Service, а для отложенной — WorkManager или JobScheduler.
- **Когда выбрать WorkManager вместо Service?** — WorkManager подходит для отложенной гарантированной работы: она переживает перезагрузку и учитывает ограничения вроде сети и зарядки. Для длительной работы в реальном времени с индикацией (музыка, навигация) нужен Foreground Service, а для мгновенной короткой задачи — корутина в ViewModel.
- **Зачем Foreground Service показывает уведомление?** — Уведомление делает длительную работу видимой пользователю и даёт ему возможность остановить её, такой Service система не убивает при нехватке памяти. Канал уведомлений обязателен с Android 8.0.
- **Что нужно сделать после `startForegroundService()`?** — Примерно в течение 5 секунд нужно вызвать `startForeground()` с уведомлением, иначе система остановит приложение. На Android 14+ (API 34) дополнительно обязательны `android:foregroundServiceType` в манифесте и соответствующее разрешение.
- **Как возвращаемое значение `onStartCommand()` влияет на перезапуск Service?** — `START_STICKY` перезапускает Service с null intent, `START_NOT_STICKY` не перезапускает, а `START_REDELIVER_INTENT` возвращает тот же intent. Выбор зависит от того, можно ли потерять команду при убийстве процесса.
- **Выполняется ли код Service в фоновом потоке?** — Нет: по умолчанию колбэки Service идут в главном потоке процесса, поэтому тяжёлую работу выносят в корутины или отдельные потоки. Иначе главный поток блокируется и возникает ANR.
:::

## 4. BroadcastReceiver {#broadcastreceiver}

BroadcastReceiver — компонент для приёма широковещательных сообщений (broadcasts) от системы или других приложений. Используется для реакции на системные события: загрузка завершена, изменение сети, низкий заряд батареи, подключение наушников. BroadcastReceiver не имеет UI и живёт только на время обработки сообщения.

Broadcasts бывают явные (адресованы конкретному компоненту) и неявные (по action). С Android 8.0 неявные broadcasts ограничены для приложений в фоне — это важное ограничение, о котором часто забывают.

:::cards
- **Приёмник** — получает сообщения по action.
- **onReceive** — единственный коллбэк, выполняется в главном потоке.
- **Manifest** — регистрация для статических receiver'ов.
- **Dynamic** — регистрация во время работы приложения.
:::

> **Ключевая идея:** BroadcastReceiver — это «слушатель событий», а не место для длительной работы. Весь код в `onReceive` должен выполняться быстро.

### Назначение BroadcastReceiver {#broadcast-purpose}

BroadcastReceiver нужен для реакции на события системы или приложения без постоянного опроса. Примеры: показать уведомление при завершении загрузки, обновить UI при появлении сети, запустить синхронизацию при зарядке. Для периодических задач лучше использовать WorkManager, а для событий в рамках приложения — Flow/SharedFlow.

### onReceive() {#broadcast-onreceive}

`onReceive(context, intent)` — единственный метод, который вызывается при получении broadcast. Он выполняется в главном потоке процесса (UI thread), поэтому должен завершиться быстро (система даёт около 10 секунд, но рекомендуется миллисекунды). Длительные операции нужно передавать в Service или WorkManager.

```kotlin
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            // запустить фоновую работу
            // через WorkManager
            val work = OneTimeWorkRequestBuilder<SyncWorker>().build()
            WorkManager.getInstance(context).enqueue(work)
        }
    }
}
```

### Регистрация в Manifest {#broadcast-manifest}

Статическая регистрация в манифесте позволяет получать broadcasts даже когда приложение не запущено (для разрешённых implicit broadcasts).

```xml
<receiver
    android:name=".BootReceiver"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.BOOT_COMPLETED" />
    </intent-filter>
</receiver>

<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
```

С Android 8.0 многие implicit broadcasts не доставляются manifest-registered receiver'ам (например, `ACTION_PACKAGE_ADDED` для чужих пакетов). Исключения: `BOOT_COMPLETED`, `ACTION_LOCALE_CHANGED` и некоторые другие.

### Динамическая регистрация {#broadcast-dynamic}

Динамическая регистрация через `registerReceiver()` работает только пока приложение запущено и компонент (Activity/Service) активен. Используется для событий, актуальных только во время работы приложения (например, `ACTION_BATTERY_CHANGED`).

```kotlin
val connectivity = getSystemService(ConnectivityManager::class.java)

val callback = object : ConnectivityManager.NetworkCallback() {
    override fun onAvailable(network: Network) {
        // сеть доступна
    }
}

connectivity.registerDefaultNetworkCallback(callback)

// при уничтожении
connectivity.unregisterNetworkCallback(callback)
```

Не забывайте вызывать `unregisterReceiver` в `onDestroy`/`onStop`, иначе утечка. Начиная с Android 14 (targetSdk 34) для динамической регистрации нужно указывать флаг экспорта: `RECEIVER_EXPORTED` или `RECEIVER_NOT_EXPORTED`.

### Системные Broadcast {#broadcast-system}

Система рассылает broadcasts при изменении состояния: `ACTION_BOOT_COMPLETED`, `ACTION_BATTERY_LOW`, `ACTION_POWER_CONNECTED`, `CONNECTIVITY_CHANGE`, `ACTION_AIRPLANE_MODE_CHANGED`. Слушать их можно только если они разрешены для вашего сценария и вы запросили нужные разрешения. Некоторые требуют специальных разрешений (например, `RECEIVE_BOOT_COMPLETED`).

### Экспортируемые и неэкспортируемые receiver {#broadcast-exported}

`android:exported` определяет, могут ли другие приложения отправлять broadcast вашему receiver. Если receiver имеет intent-filter, `exported` по умолчанию `true` (на старых версиях) — это опасно. Явно указывайте `exported="false"` для внутренних receiver'ов. С Android 12 (API 31) `exported` обязателен при наличии intent-filter.

### Ограничения implicit broadcasts {#broadcast-implicit-limits}

С Android 8.0 (Oreo) приложение в фоне не получает большинство implicit broadcasts через manifest-registered receivers. Это сделано для экономии батареи. Разрешённые исключения перечислены в документации. Обход: использовать явные broadcasts, WorkManager, JobScheduler или foreground Service.

Для периодических задач используйте `WorkManager` с `Constraints` (сеть, зарядка), а не `BroadcastReceiver`.

### Время выполнения onReceive и ограничения длительных операций {#broadcast-onreceive-time}

`onReceive` выполняется в главном потоке и должен завершиться за миллисекунды. Если нужно выполнить длительную работу, используйте `goAsync()`, который даёт дополнительное время (около 30 секунд) на фоновом потоке, или передайте работу в Service/WorkManager. Не вызывайте сетевые запросы или тяжёлые вычисления прямо в `onReceive`.

```kotlin
override fun onReceive(context: Context, intent: Intent) {
    val pendingResult = goAsync()
    CoroutineScope(Dispatchers.IO).launch {
        try {
            doWork(context)
        } finally {
            pendingResult.finish()
        }
    }
}
```

### Упорядоченные broadcasts {#broadcast-ordered}

Упорядоченный broadcast (`sendOrderedBroadcast`) доставляется receiver'ам по приоритету. Каждый receiver может прервать цепочку через `abortBroadcast()` или передать результат следующему через `setResultData()`. Используется системой (например, для SMS) и редко в обычных приложениях. Требует аккуратного управления приоритетами, иначе возникают конфликты между приложениями.

### Локальные broadcasts внутри приложения {#broadcast-local}

Для событий внутри одного приложения системные broadcasts избыточны и ограничены. Современный подход — использовать `SharedFlow`/`StateFlow` или `Channel` в общем репозитории/ViewModel. Это быстрее, типобезопасно и не зависит от ограничений ОС. `LocalBroadcastManager` устарел и не рекомендуется для нового кода.

### Типичные ошибки {#broadcast-errors}

Частые ошибки при работе с BroadcastReceiver:

- Выполнять сетевые запросы или тяжёлые вычисления в `onReceive` — ANR или убийство процесса.
- Забывать вызывать `unregisterReceiver` — утечка receiver'а.
- Не указывать `exported` на Android 12+ — ошибка сборки.
- Регистрировать manifest-receiver для запрещённых implicit broadcasts и ожидать их доставку.
- Использовать `goAsync()` без вызова `finish()` — утечка pending result.
- Делать receiver exported без необходимости — другие приложения могут отправлять ему сообщения.

**Самопроверка:**
- [ ] Почему onReceive должен быть быстрым?
- [ ] Когда использовать manifest, а когда динамическую регистрацию?
- [ ] Что изменилось с implicit broadcasts в Android 8.0?
- [ ] Зачем указывать exported?

### Вопросы на собеседовании

:::qa
- **Чем регистрация в манифесте отличается от динамической?** — Manifest-registered receiver может получить broadcast даже когда приложение не запущено, но с Android 8.0 большинство implicit broadcasts ему не доставляется. Динамическая регистрация через `registerReceiver()` работает только пока жив компонент и удобна для событий, актуальных во время работы приложения; её нужно снимать через `unregisterReceiver()`.
- **Почему с Android 8.0 ограничены implicit broadcasts?** — Для экономии батареи система не доставляет фоновым приложениям большинство неявных broadcasts через манифест; исключения вроде `BOOT_COMPLETED` и `ACTION_LOCALE_CHANGED` перечислены в документации. Вместо них используют явные broadcasts, WorkManager, JobScheduler или foreground Service.
- **Зачем при динамической регистрации указывать `RECEIVER_EXPORTED` или `RECEIVER_NOT_EXPORTED`?** — Начиная с Android 14 (targetSdk 34) флаг экспорта обязателен и явно определяет, может ли receiver получать сообщения от других приложений. Для внутренних событий используют `RECEIVER_NOT_EXPORTED`, чтобы не открывать receiver внешним приложениям.
- **Что делает `goAsync()` и зачем вызывать `finish()`?** — `goAsync()` позволяет продолжить обработку broadcast в фоновом потоке после возврата из `onReceive()`, не блокируя главный. Работа должна закончиться вызовом `pendingResult.finish()`, иначе результат останется незавершённым и возможна утечка.
- **Почему `onReceive()` должен быть быстрым?** — `onReceive()` вызывается в главном потоке, и система ожидает быстрого возврата: ориентир миллисекунды, жёсткий предел около 10 секунд. Сетевые запросы и тяжёлые вычисления прямо в нём грозят ANR, поэтому работу передают в WorkManager, Service или `goAsync()`.
- **Чем `android:exported` отличается от флагов динамической регистрации?** — `android:exported` в манифесте определяет, может ли другое приложение отправить broadcast статическому receiver, и с Android 12 (API 31) атрибут обязателен при наличии `intent-filter`. Для динамических receiver ту же роль играют `RECEIVER_EXPORTED` и `RECEIVER_NOT_EXPORTED`.
- **Почему для событий внутри приложения лучше `SharedFlow`/`StateFlow`, а не broadcasts?** — Они типобезопасны, быстрее и не зависят от ограничений ОС на broadcasts. `LocalBroadcastManager` устарел, а системные broadcasts для внутренних событий избыточны.
:::

## 5. ContentProvider Basics {#contentprovider-basics}

ContentProvider — компонент для предоставления доступа к структурированным данным приложения другим приложениям или внутри своего. Это абстракция над хранилищем (БД, файлы) с единым интерфейсом через URI. Системные провайдеры (контакты, медиа, календарь) доступны через ContentResolver без написания собственного провайдера. В современных приложениях собственные ContentProvider создаются редко; чаще используют Room и делятся данными через FileProvider или Photo Picker.

:::cards
- **Провайдер** — абстракция над хранилищем данных.
- **ContentResolver** — клиент для обращения к провайдеру.
- **URI** — адрес данных в формате content://authority/path.
- **Photo Picker** — современный способ выбора медиа без разрешений.
:::

> **Ключевая идея:** ContentProvider — это контракт доступа к данным. В современной разработке чаще используют готовые системные провайдеры и FileProvider, а не пишут свои.

### Назначение ContentProvider {#contentprovider-purpose}

ContentProvider нужен для безопасного шаринга данных между приложениями: контакты, медиафайлы, документы. Внутри одного приложения данные обычно хранят в Room/SQLite, а ContentProvider используют только когда нужно отдать данные наружу (например, через FileProvider для отправки файла в другое приложение). Создание собственного провайдера требует реализации методов `query`, `insert`, `update`, `delete`, `getType`.

### ContentResolver и URI {#contentresolver-uri}

Доступ к данным идёт через `ContentResolver`, получаемый из Context. Адрес данных — URI вида `content://authority/path/id`.

```kotlin
val cursor = contentResolver.query(
    ContactsContract.Contacts.CONTENT_URI,
    arrayOf(ContactsContract.Contacts.DISPLAY_NAME),
    null, null, null
)
cursor?.use {
    while (it.moveToNext()) {
        val name = it.getString(0)
        Log.d("Contacts", name)
    }
}
```

URI состоит из схемы `content://`, authority (имя провайдера) и пути. `ContentUris.withAppendedId()` добавляет id. Всегда закрывайте Cursor через `use` или `close()`.

### Системные провайдеры {#contentprovider-system}

Android предоставляет системные провайдеры:
- Контакты: `ContactsContract` (разрешение `READ_CONTACTS`).
- Медиа: `MediaStore` (фото, видео, аудио).
- Календарь: `CalendarContract`.
- Документы: Storage Access Framework (`ACTION_OPEN_DOCUMENT`).

Для чтения контактов нужно разрешение `READ_CONTACTS`; для записи — `WRITE_CONTACTS`.

### Photo Picker {#contentprovider-photo-picker}

Photo Picker (Android 13+; на Android 11+ доступен через Google Play Services, ниже — fallback на `ACTION_OPEN_DOCUMENT`) — современный способ выбора фото/видео без запроса разрешений на медиа. Пользователь выбирает файлы в системном UI, а приложение получает URI с временным доступом.

```kotlin
val pickMedia = registerForActivityResult(
    ActivityResultContracts.PickVisualMedia()
) { uri ->
    uri?.let { showImage(it) }
}

// запуск
pickMedia.launch(
    PickVisualMediaRequest(
        ActivityResultContracts.PickVisualMedia.ImageOnly
    )
)
```

Photo Picker не требует `READ_EXTERNAL_STORAGE`/`READ_MEDIA_*`, что упрощает работу с разрешениями и повышает приватность. Рекомендуется использовать его вместо прямого доступа к MediaStore.

### Разрешения на чтение медиа {#contentprovider-media-permissions}

С Android 13 (API 33) введены гранулярные разрешения: `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO`, `READ_MEDIA_AUDIO` вместо общего `READ_EXTERNAL_STORAGE`. На Android 14+ добавлен `READ_MEDIA_VISUAL_USER_SELECTED` для частичного доступа. Рекомендуется использовать Photo Picker, чтобы избежать запросов разрешений вообще. Если нужен прямой доступ, запрашивайте только нужные типы и обрабатывайте отказ.

### Безопасность exported-провайдеров {#contentprovider-exported-security}

Если ContentProvider объявлен с `android:exported="true"`, другие приложения могут обращаться к нему. Это опасно: утечка данных, SQL-инъекции через selection, обход проверок. Правила:
- По умолчанию `exported="false"` для внутренних провайдеров.
- Для FileProvider (шаринг файлов) используйте `android:exported="false"` и `android:grantUriPermissions="true"`.
- Валидируйте входные URI и selection, не конкатенируйте пользовательский ввод в SQL.
- Ограничивайте доступ через permissions: `android:readPermission`/`android:writePermission`.

```xml
<provider
    android:name="androidx.core.content.FileProvider"
    android:authorities="${applicationId}.fileprovider"
    android:exported="false"
    android:grantUriPermissions="true">
    <meta-data
        android:name="android.support.FILE_PROVIDER_PATHS"
        android:resource="@xml/file_paths" />
</provider>
```

### MIME-типы и множественные результаты {#contentprovider-mime}

Провайдер сообщает тип возвращаемых данных через `getType(uri)`. Для одиночной записи тип начинается с `vnd.android.cursor.item/`, для множества — `vnd.android.cursor.dir/`. Это позволяет клиентам (например, другим приложениям) понять, как отображать данные. При запросе через ContentResolver можно указать сортировку, проекцию (какие колонки нужны) и фильтр selection с аргументами selectionArgs — это защищает от SQL-инъекций, если использовать параметризованные запросы.

### Batch-операции и транзакции {#contentprovider-batch}

Для массовых изменений используют `ContentResolver.applyBatch()` с массивом `ContentProviderOperation`. Это позволяет выполнить несколько операций атомарно (в одной транзакции) и получить результаты всех. Удобно для синхронизации данных: вставить новые записи, обновить изменённые, удалить устаревшие — всё за один вызов.

### Типичные ошибки {#contentprovider-errors}

Частые ошибки при работе с ContentProvider:

- Забыть закрыть Cursor — утечка ресурсов и крах при большом числе запросов.
- Конкатенировать пользовательский ввод в SQL-запрос — SQL-инъекция.
- Открывать exported-провайдер без необходимости — утечка данных.
- Использовать `READ_EXTERNAL_STORAGE` на Android 13+ вместо гранулярных разрешений.
- Не обрабатывать отсутствие разрешения и падать с SecurityException.
- Путать URI разных провайдеров и получать пустой результат.

Дополнительно: при работе с MediaStore на Android 10+ учитывайте Scoped Storage — прямые пути к файлам недоступны, используйте URI и ContentResolver. Для шаринга файлов с другими приложениями всегда используйте FileProvider с `grantUriPermissions`, а не прямые file:// URI (они запрещены с Android 7.0 и вызывают FileUriExposedException).

**Самопроверка:**
- [ ] Зачем нужен Photo Picker?
- [ ] Какие разрешения на медиа нужны на Android 13+?
- [ ] Почему exported-провайдер опасен?

### Вопросы на собеседовании

:::qa
- **Зачем нужен ContentProvider?** — Он даёт единый контракт доступа к структурированным данным и позволяет безопасно делиться ими между приложениями, скрывая хранилище вроде БД или файлов. Системные провайдеры контактов, медиа и календаря доступны через `ContentResolver` без написания своего провайдера.
- **Из чего состоит `content://` URI и что такое authority?** — URI вида `content://authority/path/id` включает схему `content://`, authority — имя провайдера из `android:authorities`, путь и при необходимости id. `ContentResolver` находит провайдера по authority, а `ContentUris.withAppendedId()` добавляет id записи.
- **Что возвращает `ContentResolver.query()`?** — `Cursor` со строками результата или `null`, если запрос не удался, и его обязательно закрывают через `use` или `close()`. Данные читают после `moveToNext()`, а проекцию, `selection` с `selectionArgs` и сортировку задают аргументами запроса.
- **Зачем нужны URI permissions и `grantUriPermissions`?** — Они дают другому приложению временный доступ к конкретному URI без постоянного разрешения: FileProvider с `android:grantUriPermissions="true"` раздаёт файлы через `content://` вместо запрещённых с Android 7.0 `file://`. Право передаётся флагом `FLAG_GRANT_READ_URI_PERMISSION` в Intent.
- **Почему опасно объявлять провайдер `exported="true"`?** — Другие приложения смогут читать и менять данные, а непроверенный `selection` откроет путь к SQL-инъекции. Для внутренних провайдеров ставят `exported="false"`, доступ ограничивают `android:readPermission` и `android:writePermission`, а входящие URI валидируют.
- **Что даёт Photo Picker и почему он предпочтительнее прямого доступа к медиа?** — Photo Picker, доступный с Android 13+, а на 11+ через Google Play Services, показывает системный UI выбора, а приложение получает URI с временным доступом. Он не требует `READ_MEDIA_*` или `READ_EXTERNAL_STORAGE`, поэтому проще по разрешениям и приватнее.
- **Что означают типы `vnd.android.cursor.item/` и `vnd.android.cursor.dir/`?** — Провайдер возвращает их из `getType(uri)`: первый означает одиночную запись, второй — набор записей. Клиент по MIME-типу понимает, как отображать результат.
:::

## Итоговая самопроверка категории {#itogovaya-samoproverka}

- [ ] Умею создавать Fragment и управлять его жизненным циклом.
- [ ] Понимаю разницу между Fragment Lifecycle и View Lifecycle.
- [ ] Могу настроить Navigation Graph и перейти между destinations с аргументами.
- [ ] Знаю, когда использовать Foreground Service, а когда WorkManager.
- [ ] Понимаю ограничения implicit broadcasts и умею регистрировать receiver.
- [ ] Умею читать данные через ContentResolver и использовать Photo Picker.

## Источники и документация {#istochniki-i-dokumentaciya}

### Официальная документация

- [Fragments](https://developer.android.com/guide/fragments)
- [Navigation Component](https://developer.android.com/guide/navigation)
- [Services](https://developer.android.com/guide/components/services)
- [Foreground services](https://developer.android.com/develop/background-work/services/foreground-services)
- [BroadcastReceiver](https://developer.android.com/guide/components/broadcasts)
- [Content providers](https://developer.android.com/guide/topics/providers/content-providers)
- [Photo Picker](https://developer.android.com/training/data-storage/shared/photopicker)
- [WorkManager](https://developer.android.com/topic/libraries/architecture/workmanager)

### Статьи

- [Android 14 foreground service types](https://developer.android.com/about/versions/14/changes/fgs-types-required)
- [Background execution limits](https://developer.android.com/guide/background)
- [Media permissions](https://developer.android.com/training/data-storage/shared/media)
