# Архитектура Android-приложения

**Уровень:** Junior  
**Категория:** Архитектура  
**Язык:** Kotlin  
**Кратко:** Как разделить приложение на слои, где хранить состояние экрана и почему MVVM с StateFlow стал стандартом.

## 1. MVC {#mvc}

MVC (Model-View-Controller) — один из старейших паттернов разделения ответственности. Он делит приложение на три роли: данные (Model), отображение (View) и управляющую логику (Controller). Главная идея — не смешивать бизнес-правила с кодом интерфейса, чтобы каждую часть можно было менять и тестировать отдельно. В Android MVC исторически возник сам по себе: Activity часто выступала и как View, и как Controller, а модели выносились в отдельные классы. Понимание MVC полезно не само по себе, а как отправная точка: большинство современных паттернов (MVP, MVVM) — это ответ на проблемы, которые проявляются при наивном применении MVC на Android.

### 1.1. Model {#mvc-model}

Model — это данные приложения и правила работы с ними. Сюда входят сущности (data-классы), валидация, преобразования, доступ к базе данных и сети. Model не должна знать ничего о View, Activity, Fragment или жизненном цикле Android. Она может быть чистым Kotlin-кодом, который легко тестировать на JVM без эмулятора.

```kotlin
data class User(
    val id: Long,
    val name: String,
    val email: String
)

class UserRepository(
    private val api: UserApi,
    private val dao: UserDao
) {
    suspend fun getUser(id: Long): User {
        val remote = api.fetchUser(id)
        dao.insert(remote.toEntity())
        return remote.toDomain()
    }
}
```

Model отвечает за «что есть» и «как получить/сохранить», но не за «как показать». Если в Model появляются вызовы `findViewById` или обращения к `Context` ради UI — это признак того, что ответственность протекла.

### 1.2. View {#mvc-view}

View — это слой отображения. В Android это XML-разметка, View-компоненты, а также Activity/Fragment, которые их наполняют. View должна быть пассивной: показать данные, собрать пользовательский ввод и передать его дальше. Она не принимает решений о бизнес-логике и не обращается к сети напрямую.

Пассивность View означает, что в ней остаются только вызовы вроде `textView.text = user.name` и установка слушателей кликов. Как только в View появляется условие вроде «если пользователь админ — показать кнопку удаления», часть бизнес-логики переехала не туда, и её стоит вынести в Controller/ViewModel.

### 1.3. Controller {#mvc-controller}

Controller принимает пользовательский ввод из View, обновляет Model и решает, какую View показать дальше. В Android роль Controller чаще всего играет сама Activity: она слушает клики, вызывает репозиторий, обновляет поля экрана. Именно поэтому в наивном MVC Activity быстро превращается в «бог-объект».

```kotlin
class UserActivity : AppCompatActivity() {
    private lateinit var repository: UserRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user)
        repository = UserRepository(ApiService.userApi, AppDatabase.userDao())

        findViewById<Button>(R.id.loadButton).setOnClickListener {
            lifecycleScope.launch {
                val user = repository.getUser(1L)
                findViewById<TextView>(R.id.nameText).text = user.name
            }
        }
    }
}
```

Здесь Activity одновременно является View (показывает данные) и Controller (обрабатывает клик и вызывает репозиторий). Это работает на маленьких экранах, но плохо масштабируется.

### 1.4. Взаимодействие компонентов {#mvc-interaction}

В классическом MVC взаимодействие идёт по кругу: пользователь действует во View → Controller получает событие → Controller меняет Model → Controller обновляет View. Иногда Model сама уведомляет наблюдателей (паттерн Observer), и тогда Controller не обязан вручную перерисовывать View.

На Android этот круг часто схлопывается: Activity и есть и View, и Controller, поэтому уведомления от Model приходят прямо в Activity, которая сама обновляет поля. Отсутствие явной границы между ролями — главная причина, по которой MVC в Android быстро деградирует в «всё в Activity».

### 1.5. Применение в Android {#mvc-android}

В простых приложениях (один-два экрана, мало логики) MVC допустима и даже удобна: меньше классов, меньше абстракций, проще читать. Activity хранит ссылки на View, вызывает репозиторий, обновляет UI. Для учебных проектов и прототипов это нормально.

Но как только появляются состояния экрана (загрузка/ошибка/успех), навигация, тесты и пересоздание при повороте, MVC начинает мешать: логика размазана по Activity, её нельзя вынести и протестировать отдельно. Тогда переходят к MVP или MVVM.

### 1.6. Проблема Massive Activity {#mvc-massive-activity}

Massive Activity («толстая Activity») — антипаттерн, когда один класс берёт на себя всё: привязку View, обработку кликов, валидацию, сетевые запросы, работу с БД, навигацию, сохранение состояния. Такая Activity может разрастись до тысяч строк и стать нечитаемой.

Последствия:
- Тестировать логику невозможно: она завязана на Android-компоненты и жизненный цикл.
- Любое изменение рискует сломать несвязанные части экрана.
- Утечки памяти: Activity хранит ссылки на долгоживущие объекты.
- Пересоздание при повороте теряет промежуточное состояние, если его не сохранить вручную.

Massive Activity — главный симптом того, что архитектура не отделила логику представления от UI.

### 1.7. Ограничения MVC в Android-приложениях {#mvc-limitations}

Android накладывает ограничения, с которыми классический MVC справляется плохо:
- Activity/Fragment имеют сложный жизненный цикл и могут пересоздаваться при смене конфигурации.
- View (разметка) привязана к конкретному компоненту, поэтому Controller не может легко пережить пересоздание.
- Тестирование Controller требует эмулятора, если он зависит от Android SDK.
- Нет встроенного механизма наблюдения за данными: приходится обновлять UI вручную в каждой точке изменения.

Именно эти ограничения привели к появлению MVP (вынос логики в Presenter с интерфейсом View) и MVVM (реактивное состояние через ViewModel и observable-потоки). MVC остаётся полезным как концептуальная модель, но в современном Android-коде в чистом виде почти не встречается.

**Типичные ошибки:**
- Класть сетевые запросы и SQL-запросы прямо в Activity.
- Хранить состояние экрана в полях Activity без учёта пересоздания.
- Считать, что MVC на Android = «всё в Activity».
- Игнорировать жизненный цикл при подписке на данные.

**Короткая самопроверка:**
- [ ] Могу назвать роли Model, View, Controller и дать пример каждой в Android.
- [ ] Понимаю, почему Activity часто становится и View, и Controller.
- [ ] Объясняю, что такое Massive Activity и чем он опасен.
- [ ] Знаю основные ограничения MVC на Android.

### Вопросы на собеседовании


## 2. MVP {#mvp}

MVP (Model-View-Presenter) развивает идею MVC: логика представления выносится в отдельный класс Presenter, а View становится тонким пассивным интерфейсом. Цель — сделать логику экрана тестируемой без эмулятора и убрать бизнес-правила из Activity/Fragment. В Android MVP был стандартом до появления Jetpack ViewModel и архитектурных компонентов; сейчас его чаще встретишь в legacy-проектах, но понимание паттерна помогает читать старый код и понимать эволюцию архитектуры.

### 2.1. Model {#mvp-model}

Model в MVP — те же данные и бизнес-правила, что и в MVC: сущности, репозитории, источники данных. Presenter обращается к Model через интерфейсы, а не к конкретным реализациям, что упрощает подмену в тестах.

```kotlin
interface UserRepository {
    suspend fun getUser(id: Long): User
}
```

Model остаётся независимой от Android и от View. Presenter зависит от абстракции, а не от конкретного репозитория — это и есть инверсия зависимостей в миниатюре.

### 2.2. View и её интерфейс {#mvp-view-interface}

Ключевое отличие MVP: View описывается интерфейсом. Activity/Fragment реализуют этот интерфейс и становятся «глупыми»: они только показывают данные и передают события в Presenter.

```kotlin
interface UserView {
    fun showLoading()
    fun showUser(user: User)
    fun showError(message: String)
}
```

Интерфейс делает View заменяемой: в тестах Presenter можно проверить с фейковой View, не создавая Activity. В production View реализует интерфейс и делегирует вызовы реальным View-компонентам.

### 2.3. Presenter {#mvp-presenter}

Presenter содержит логику представления: что делать при клике, как преобразовать данные Model в состояние экрана, когда показать загрузку или ошибку. Он не знает о Android View напрямую — только о интерфейсе View.

```kotlin
class UserPresenter(
    private val view: UserView,
    private val repository: UserRepository,
    private val scope: CoroutineScope
) {
    fun loadUser(id: Long) {
        view.showLoading()
        scope.launch {
            runCatching { repository.getUser(id) }
                .onSuccess { view.showUser(it) }
                .onFailure { view.showError(it.message ?: "Ошибка") }
        }
    }
}
```

Переживает ли Presenter пересоздание? Нет — в классическом MVP Presenter привязан к жизненному циклу View и создаётся заново при пересоздании Activity. Это один из недостатков.

### 2.4. Contract {#mvp-contract}

Contract — соглашение (обычно интерфейс или пара интерфейсов), которое фиксирует, что View умеет показывать и какие события отправляет Presenter. Часто Contract объединяет `View` и `Presenter` в одном файле для удобства.

```kotlin
interface UserContract {
    interface View {
        fun showLoading()
        fun showUser(user: User)
        fun showError(message: String)
    }
    interface Presenter {
        fun loadUser(id: Long)
        fun onRetry()
    }
}
```

Contract делает границу между слоями явной и помогает навигации по коду: открыв один файл, видно весь контракт экрана.

### 2.5. Передача событий между View и Presenter {#mvp-events}

События текут в обе стороны, но через чёткие каналы:
- View → Presenter: пользователь нажал кнопку, ввёл текст, прокрутил список. View вызывает метод Presenter (`presenter.loadUser(id)`).
- Presenter → View: показать данные, загрузку, ошибку. Presenter вызывает методы интерфейса View (`view.showUser(user)`).

```kotlin
class UserActivity : AppCompatActivity(), UserContract.View {
    private lateinit var presenter: UserContract.Presenter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user)
        presenter = UserPresenter(this, UserRepositoryImpl(), lifecycleScope)
        findViewById<Button>(R.id.loadButton).setOnClickListener {
            presenter.loadUser(1L)
        }
    }

    override fun showUser(user: User) {
        findViewById<TextView>(R.id.nameText).text = user.name
    }
    // ...
}
```

Важно: Presenter не должен обращаться к View после её уничтожения. Поэтому в MVP часто добавляют `attachView`/`detachView` и проверки, что View не null.

### 2.6. Тестируемость Presenter {#mvp-testability}

Главная выгода MVP — Presenter можно тестировать на JVM. Подменяем View фейком, репозиторий — фейком, вызываем метод Presenter и проверяем, какие методы View были вызваны и в каком порядке.

```kotlin
class FakeUserView : UserContract.View {
    val shownUsers = mutableListOf<User>()
    override fun showLoading() {}
    override fun showUser(user: User) { shownUsers.add(user) }
    override fun showError(message: String) {}
}

@Test
fun `loadUser shows user on success`() = runTest {
    val view = FakeUserView()
    val repo = FakeUserRepository()
    val presenter = UserPresenter(view, repo, this)
    presenter.loadUser(1L)
    advanceUntilIdle()
    assertEquals("Alex", view.shownUsers.first().name)
}
```

Такие тесты быстрые и не требуют эмулятора, потому что Presenter зависит только от интерфейсов.

### 2.7. Недостатки и ограничения MVP {#mvp-limitations}

MVP решает проблему тестируемости, но создаёт новые:
- Много boilerplate: интерфейсы View и Presenter, attach/detach, делегирование каждого вызова.
- Presenter привязан к жизненному циклу View: при повороте экрана Presenter пересоздаётся, состояние теряется (если не сохранить вручную).
- Риск утечек: если Presenter держит ссылку на View и не отписывается, Activity не может быть собрана сборщиком мусора.
- Двусторонние вызовы (View ↔ Presenter) могут привести к запутанному потоку данных при сложных экранах.
- Нет встроенной реактивности: обновление UI происходит через явные вызовы методов, а не через наблюдение за состоянием.

Из-за этих ограничений в современном Android MVP уступил место MVVM с ViewModel и StateFlow, где состояние переживает пересоздание и обновляет UI реактивно. Дополнительно: в MVP сложно организовать единый источник правды для состояния экрана — каждое изменение требует явного вызова метода View, что приводит к рассинхронизации при сложных сценариях.

### 2.8. MVP и жизненный цикл Android {#mvp-lifecycle-android}

В классическом MVP Presenter не переживает пересоздание Activity, поэтому состояние экрана теряется при повороте, если его не сохранить вручную. Чтобы снизить риск, Presenter создаётся в `onCreate` и привязывается к View через `attachView`, а в `onDestroy` вызывается `detachView`, обнуляющий ссылку. Это защищает от утечек и от вызовов уничтоженной View.

При сложных экранах Presenter может разрастись, и тогда его делят на несколько маленьких презентеров или переходят к MVVM. В legacy-коде часто встречается MVP с RxJava или корутинами: Presenter запускает асинхронную операцию и обновляет View через коллбэки. Такой код читается, но требует аккуратного управления отменой при уничтожении View.

**Типичные ошибки:**
- Держать сильную ссылку на View в Presenter без detach.
- Вызывать методы View после её уничтожения.
- Класть Android-зависимости (Context, Resources) в Presenter.
- Дублировать логику в View и Presenter.

**Короткая самопроверка:**
- [ ] Объясняю, зачем View описывается интерфейсом.
- [ ] Могу написать простой Presenter и фейковую View для теста.
- [ ] Знаю, почему Presenter не переживает поворот экрана.
- [ ] Понимаю основные недостатки MVP.

### Вопросы на собеседовании


## 3. MVVM {#mvvm}

MVVM (Model-View-ViewModel) — архитектурный паттерн, рекомендованный Google для Android. В нём логика представления живёт в ViewModel, которая переживает пересоздание Activity/Fragment, а UI обновляется реактивно через наблюдение за состоянием. В современном Android основной поток данных — StateFlow (или SharedFlow для событий), а View в Jetpack Compose или View-системе подписывается на него. LiveData остаётся в старых проектах. MVVM хорошо ложится на Unidirectional Data Flow: состояние спускается вниз, события поднимаются вверх.

### 3.1. Model {#mvvm-model}

Model — данные и бизнес-правила: сущности, репозитории, источники данных (сеть, БД, кеш). Model не зависит от ViewModel и UI. ViewModel обращается к Model через репозитории/интерфейсы.

```kotlin
data class Product(val id: Long, val title: String, val price: Int)

interface ProductRepository {
    suspend fun getProducts(): List<Product>
}
```

Разделение Model и ViewModel важно: Model описывает «мир данных», ViewModel — «что показать на этом экране». Смешивать их нельзя, иначе логика экрана протечёт в репозиторий.

### 3.2. View {#mvvm-view}

View — Activity/Fragment или Composable-функция. Она отображает состояние, приходящее из ViewModel, и отправляет пользовательские события (клики, ввод) в ViewModel. View не содержит бизнес-логики и не обращается к репозиториям напрямую.

В Compose View — это `@Composable`-функция, которая принимает состояние и коллбэки. Во View-системе — Activity/Fragment, которая подписывается на Flow/StateFlow и обновляет View-компоненты.

### 3.3. ViewModel {#mvvm-viewmodel-role}

ViewModel (androidx.lifecycle.ViewModel) — класс, который хранит UI-состояние и логику представления. Он переживает пересоздание Activity/Fragment при смене конфигурации (поворот, смена темы) и очищается только когда экран окончательно закрывается. ViewModel не должна ссылаться на View, Context (кроме Application) или жизненный цикл — только на абстракции данных.

```kotlin
sealed interface ProductUiState {
    data object Loading : ProductUiState
    data class Success(val products: List<Product>) : ProductUiState
    data class Error(val message: String) : ProductUiState
}

class ProductViewModel(
    private val repository: ProductRepository
) : ViewModel() {

    private val _state = MutableStateFlow<ProductUiState>(ProductUiState.Loading)
    val state: StateFlow<ProductUiState> = _state.asStateFlow()

    fun load() {
        viewModelScope.launch {
            _state.value = ProductUiState.Loading
            runCatching { repository.getProducts() }
                .onSuccess { _state.value = ProductUiState.Success(it) }
                .onFailure { _state.value = ProductUiState.Error(it.message ?: "Ошибка") }
        }
    }
}
```

### 3.4. Ответственность каждого слоя {#mvvm-responsibilities}

- Model: данные, правила, источники данных.
- ViewModel: состояние экрана, реакция на события пользователя, вызовы Model, преобразование данных в UI-состояние.
- View: отображение состояния, сбор ввода, навигация (по указанию ViewModel/событий).

Никакой слой не должен делать работу другого. Если ViewModel начинает вызывать `findViewById` или знать про `RecyclerView` — граница нарушена. Если View начинает сортировать список — тоже.

### 3.5. Поток данных между View и ViewModel {#mvvm-data-flow}

Данные текут в одну сторону: ViewModel публикует состояние → View подписывается и перерисовывается. Пользовательские действия идут в обратную сторону: View вызывает методы ViewModel (`viewModel.load()`, `viewModel.onItemClick(id)`). ViewModel обновляет состояние, и View автоматически получает новое значение.

```kotlin
viewLifecycleOwner.lifecycleScope.launch {
    viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.state.collect { state -> render(state) }
    }
}
```

Без `repeatOnLifecycle` сбор не остановится при уходе экрана в фон: корутина в `lifecycleScope` живёт до уничтожения View, и невидимый UI продолжает обновляться.

Такой поток предсказуем: состояние всегда приходит из одного места, и UI — функция от состояния.

### 3.6. Односторонняя передача событий {#mvvm-one-way-events}

События (одноразовые действия: показать Snackbar, перейти на другой экран, показать диалог) не должны смешиваться с состоянием. Для них используют отдельный поток — `SharedFlow` или `Channel`, который View собирает и обрабатывает один раз.

```kotlin
private val _events = MutableSharedFlow<ProductEvent>(extraBufferCapacity = 1)
val events: SharedFlow<ProductEvent> = _events.asSharedFlow()
```

Если использовать для событий StateFlow, повторное открытие экрана может повторно показать старый Snackbar. Разделение состояния (StateFlow) и событий (SharedFlow/Channel) — важная часть правильного MVVM.

### 3.7. Связь с Repository {#mvvm-repository}

ViewModel не работает с сетью/БД напрямую — она вызывает Repository, который скрывает детали источников данных. Это позволяет подменять Repository в тестах и менять реализацию (сеть → кеш) без изменения ViewModel.

```kotlin
class ProductViewModel(
    private val repository: ProductRepository
) : ViewModel() { ... }
```

Repository возвращает данные (часто через Flow или suspend-функции), ViewModel преобразует их в UI-состояние и публикует в StateFlow. Такая цепочка (Repository → ViewModel → View) — основа современного Android.

### 3.8. StateFlow как основной реактивный поток состояния {#mvvm-stateflow}

StateFlow — горячий поток, который хранит текущее значение и отдаёт его новым подписчикам сразу. Это идеальный контейнер для UI-состояния: всегда есть актуальное значение, подписка не теряет последнее состояние, обновления доставляются в контексте корутины, которая собирает поток через `collect`.

```kotlin
private val _uiState = MutableStateFlow<UiState>(UiState.Idle)
val uiState: StateFlow<UiState> = _uiState.asStateFlow()

fun onSearch(query: String) {
    _uiState.value = UiState.Loading
    viewModelScope.launch {
        val result = repository.search(query)
        _uiState.value = UiState.Success(result)
    }
}
```

В Compose подписка выглядит так:

```kotlin
@Composable
fun ProductScreen(viewModel: ProductViewModel = viewModel()) {
    val state by viewModel.state.collectAsState()
    when (state) {
        is ProductUiState.Loading -> CircularProgressIndicator()
        is ProductUiState.Success -> ProductList(state.products)
        is ProductUiState.Error -> Text(state.message)
    }
}
```

`collectAsState()` превращает StateFlow в Compose State, и UI автоматически перерисовывается при каждом новом значении. В View-системе используют `repeatOnLifecycle` + `collect`, чтобы подписка активировалась только когда экран виден.

### 3.9. LiveData как legacy-механизм в существующих проектах {#mvvm-livedata-legacy}

LiveData — lifecycle-aware контейнер данных из AndroidX. Он был стандартом до появления StateFlow и до сих пор встречается в проектах, написанных на View-системе с Java/Kotlin. LiveData автоматически учитывает жизненный цикл: подписка активна только когда View в состоянии STARTED/RESUMED, и автоматически отписывается при уничтожении.

В новых проектах предпочитают StateFlow: он часть Kotlin Coroutines, не привязан к Android lifecycle, работает с Compose через `collectAsState`, легко комбинируется с операторами Flow. LiveData остаётся в legacy-коде и при поддержке старых экранов; смешивать оба подхода на одном экране не рекомендуется. При миграции LiveData → StateFlow обычно заменяют `MutableLiveData` на `MutableStateFlow` и `observe` на `collect`.

**Типичные ошибки:**
- Хранить ссылку на View/Context в ViewModel.
- Использовать StateFlow для одноразовых событий (повторное срабатывание).
- Обновлять `_state.value` из фонового потока без учёта главного потока (StateFlow thread-safe, но логика должна быть согласована).
- Смешивать LiveData и StateFlow на одном экране без причины.
- Делать ViewModel слишком «толстой», дублируя логику Repository.

**Короткая самопроверка:**
- [ ] Объясняю роли Model, View, ViewModel.
- [ ] Знаю, как StateFlow обновляет UI через collectAsState.
- [ ] Отличаю состояние (StateFlow) от событий (SharedFlow/Channel).
- [ ] Понимаю, почему LiveData считается legacy.

### Вопросы на собеседовании


## 4. LiveData Basics {#livedata-basics}

LiveData — lifecycle-aware контейнер наблюдаемых данных из AndroidX. Он хранит значение и уведомляет активных наблюдателей при его изменении, при этом автоматически учитывая жизненный цикл: наблюдение активно только когда View находится в состоянии STARTED или RESUMED, и автоматически прекращается при уничтожении. В современных проектах LiveData считается legacy-технологией: для нового кода используют StateFlow и Flow. Но LiveData всё ещё широко встречается в существующих проектах на View-системе, поэтому умение её читать и поддерживать остаётся необходимым навыком.

### 4.1. LiveData и MutableLiveData {#livedata-mutablelivedata}

`LiveData<T>` — неизменяемый для внешних наблюдателей контейнер: снаружи можно только подписаться. `MutableLiveData<T>` — наследник, который позволяет изменять значение через `setValue`/`postValue`. Паттерн тот же, что со StateFlow: приватное изменяемое поле и публичное неизменяемое.

```kotlin
class UserViewModel : ViewModel() {
    private val _user = MutableLiveData<User>()
    val user: LiveData<User> = _user

    fun loadUser() {
        _user.value = User(1, "Alex")
    }
}
```

Снаружи `user` только читается — это защищает инварианты состояния.

### 4.2. observe() {#livedata-observe}

`observe(LifecycleOwner, Observer)` подписывает наблюдателя на изменения. Наблюдатель получает текущее значение сразу при подписке (если оно есть) и при каждом последующем изменении. Подписка привязана к жизненному циклу владельца.

```kotlin
viewModel.user.observe(viewLifecycleOwner) { user ->
    nameText.text = user.name
}
```

Используйте `viewLifecycleOwner` во Fragment, а не `this`, чтобы подписка корректно отменялась при уничтожении View. В Activity используйте `this`.

### 4.3. setValue() и postValue() {#livedata-setvalue-postvalue}

- `setValue(value)` обновляет значение и уведомляет наблюдателей синхронно. Можно вызывать только из главного потока.
- `postValue(value)` планирует обновление на главный поток из фонового. Если несколько `postValue` вызваны подряд, до главного потока дойдёт только последнее значение.

```kotlin
// из главного потока
_user.value = user

// из фонового потока
_user.postValue(user)
```

Путаница между ними — частая причина крашей «Cannot invoke setValue on a background thread» или потери обновлений.

### 4.4. Lifecycle-aware observation {#livedata-lifecycle-aware}

LiveData знает о состоянии LifecycleOwner. Наблюдатель получает обновления только когда владелец активен (STARTED/RESUMED). При переходе в STOPPED наблюдение приостанавливается; при возврате — возобновляется с последним значением. При DESTROYED наблюдатель удаляется автоматически.

Это избавляет от ручной отписки и защищает от обновления UI после уничтожения Activity. Именно эта особенность сделала LiveData популярной до появления Flow с `repeatOnLifecycle`.

### 4.5. Transformations.map и switchMap (назначение) {#livedata-transformations}

`Transformations.map(source) { ... }` создаёт новый LiveData, применяя функцию к каждому значению источника — аналог `map` для Flow. `Transformations.switchMap(source) { ... }` переключается на новый LiveData, возвращаемый функцией, при каждом изменении источника — аналог `flatMapLatest`.

```kotlin
val userName: LiveData<String> = Transformations.map(user) { it.name }
```

Они полезны для производных данных (например, форматированная строка из объекта). В современном коде их заменяют операторами Flow (`map`, `flatMapLatest`).

### 4.6. Ограничения LiveData {#livedata-limitations}

- Привязка к Android lifecycle: LiveData не работает вне Android-компонентов (например, в чистых модулях).
- Нет встроенных операторов комбинирования/фильтрации как у Flow.
- `postValue` теряет промежуточные значения при частых обновлениях.
- Проверка значения через `.value` неудобна и не реактивна.
- Плохо сочетается с Jetpack Compose: нет нативного `collectAsState` для LiveData (нужен `observeAsState`).
- Тестирование требует InstantTaskExecutorRule и главный поток.

Дополнительно: LiveData не поддерживает операторы вроде `combine`, `debounce`, `distinctUntilChanged` из коробки. Для сложных преобразований приходится писать собственные MediatorLiveData, что усложняет код. Flow даёт эти операторы стандартно, поэтому миграция на StateFlow упрощает поддержку.

### 4.7. LiveData как технология, встречающаяся в legacy-проектах {#livedata-legacy-projects}

В новых проектах LiveData практически не используют: StateFlow/Flow из Kotlin Coroutines стали стандартом, особенно с Jetpack Compose. Но LiveData остаётся в:
- старых экранах на View-системе;
- проектах, где архитектура строилась вокруг LiveData до 2020 года;
- библиотеках, возвращающих LiveData (например, Room поддерживает и Flow, и LiveData).

При поддержке такого кода: не смешивайте LiveData и StateFlow на одном экране без необходимости, при миграции заменяйте `MutableLiveData` на `MutableStateFlow`, `observe` — на `collect`/`collectAsState`, а `Transformations` — на операторы Flow. Понимание LiveData нужно, чтобы читать и безопасно менять legacy-код, а не для нового.

### 4.8. Тестирование LiveData {#livedata-testing}

Тестирование LiveData требует, чтобы наблюдение происходило на главном потоке. Для этого используют `InstantTaskExecutorRule` из `androidx.arch.core:core-testing`, который делает главный поток синхронным в тестах. Затем можно вызвать `getOrAwaitValue()` (расширение из примеров Google) или observeForever и проверить значение.

```kotlin
@get:Rule
val instantTaskExecutorRule = InstantTaskExecutorRule()

@Test
fun `user LiveData emits value`() {
    val vm = UserViewModel()
    vm.loadUser()
    assertEquals("Alex", vm.user.getOrAwaitValue().name)
}
```

В современных проектах тесты для StateFlow проще: достаточно `runTest` и чтения `.value`. Это ещё одна причина, почему LiveData считается legacy.

### 4.9. LiveData и Jetpack Compose {#livedata-compose}

В Compose для подписки на LiveData используют `observeAsState()` из `androidx.compose.runtime:runtime-livedata`. Он возвращает `State<T?>`, который обновляется при изменении LiveData. Это работает, но добавляет зависимость и менее удобно, чем нативный `collectAsState()` для StateFlow.

```kotlin
@Composable
fun UserScreen(viewModel: UserViewModel) {
    val user by viewModel.user.observeAsState()
    Text(user?.name ?: "Загрузка...")
}
```

В новых проектах, особенно на Compose, предпочитают StateFlow, чтобы не держать две модели реактивности. В legacy-коде на View-системе LiveData остаётся удобной благодаря lifecycle-aware observe.

**Типичные ошибки:**
- Вызывать `setValue` из фонового потока.
- Использовать `this` вместо `viewLifecycleOwner` во Fragment.
- Смешивать LiveData и StateFlow на одном экране.
- Полагаться на `.value` для чтения в фоне.
- Забывать InstantTaskExecutorRule в тестах.

**Короткая самопроверка:**
- [ ] Отличаю LiveData от MutableLiveData и знаю паттерн приватного изменяемого поля.
- [ ] Понимаю разницу setValue и postValue.
- [ ] Знаю, что observe привязан к lifecycle.
- [ ] Могу объяснить, почему LiveData — legacy и когда её ещё встретишь.

### Вопросы на собеседовании


## 5. ViewModel {#viewmodel}

ViewModel — компонент AndroidX (androidx.lifecycle.ViewModel), предназначенный для хранения UI-состояния и логики представления с сохранением при пересоздании Activity/Fragment. Он живёт дольше, чем View: переживает поворот экрана и смену конфигурации, но уничтожается при окончательном закрытии экрана или процесса. ViewModel — центральный элемент MVVM: именно в ней держат StateFlow с состоянием экрана и запускают корутины через viewModelScope.

### 5.1. Создание ViewModel {#viewmodel-create}

ViewModel создаётся наследованием от `ViewModel`. В конструктор передают зависимости (репозитории, use-case). Сам класс не должен ссылаться на View или Context.

```kotlin
class ProfileViewModel(
    private val repository: UserRepository
) : ViewModel() {

    private val _state = MutableStateFlow<ProfileUiState>(ProfileUiState.Loading)
    val state: StateFlow<ProfileUiState> = _state.asStateFlow()

    fun load(userId: Long) {
        viewModelScope.launch {
            _state.value = ProfileUiState.Loading
            runCatching { repository.getUser(userId) }
                .onSuccess { _state.value = ProfileUiState.Success(it) }
                .onFailure { _state.value = ProfileUiState.Error(it.message ?: "Ошибка") }
        }
    }
}
```

### 5.2. Получение ViewModel в Activity и Fragment {#viewmodel-obtain}

Для получения ViewModel используют делегаты `by viewModels()` (в Activity/Fragment) или `by activityViewModels()` (общая с Activity). ViewModel создаётся один раз на область видимости и переиспользуется при пересоздании.

```kotlin
class ProfileFragment : Fragment() {
    private val viewModel: ProfileViewModel by viewModels {
        ProfileViewModelFactory(repository)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel.load(1L)
    }
}
```

В Compose используют `viewModel()` из `androidx.lifecycle.viewmodel.compose`, который сам создаёт/находит ViewModel в ближайшем ViewModelStoreOwner.

### 5.3. Переживание Configuration Changes {#viewmodel-config-changes}

При смене конфигурации (поворот экрана, смена языка, тёмная тема) Activity/Fragment уничтожаются и создаются заново. ViewModel при этом сохраняется в `ViewModelStore`, привязанном к Activity/Fragment, и переиспользуется. Поэтому состояние в StateFlow и запущенные корутины (в viewModelScope) продолжают жить, а UI просто переподписывается при пересоздании.

Это ключевое преимущество ViewModel над хранением состояния в Activity: нет необходимости вручную сохранять и восстанавливать данные при повороте.

### 5.4. ViewModelScope {#viewmodel-scope}

`viewModelScope` — CoroutineScope, привязанный к жизненному циклу ViewModel. Корутины, запущенные в нём, автоматически отменяются, когда ViewModel очищается (экран закрыт). Это предотвращает утечки и работу с устаревшими данными.

```kotlin
fun refresh() {
    viewModelScope.launch {
        val data = repository.fetchLatest()
        _state.value = UiState.Success(data)
    }
}
```

Используйте `viewModelScope` для всех корутин в ViewModel. Не создавайте свой Scope без необходимости: можно потерять автоматическую отмену.

### 5.5. Передача зависимостей через ViewModel Factory {#viewmodel-factory}

ViewModel не создаётся через конструктор напрямую фреймворком — нужен `ViewModelProvider.Factory`. Фабрика знает, как создать ViewModel с зависимостями.

```kotlin
class ProfileViewModelFactory(
    private val repository: UserRepository
) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(ProfileViewModel::class.java)) {
            return ProfileViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
```

В проектах с DI (Hilt) фабрика генерируется автоматически (`@HiltViewModel`), и ViewModel получает зависимости через конструктор без ручной фабрики. На Junior-уровне важно понимать принцип: фреймворк создаёт ViewModel, а зависимости передаются через фабрику.

### 5.6. Shared ViewModel {#viewmodel-shared}

Shared ViewModel — одна ViewModel, общая для нескольких Fragment в рамках одной Activity. Она используется для обмена данными между экранами (например, выбор элемента в списке и отображение детали) без передачи через аргументы.

```kotlin
class SharedViewModel : ViewModel() {
    private val _selectedId = MutableStateFlow<Long?>(null)
    val selectedId: StateFlow<Long?> = _selectedId.asStateFlow()

    fun select(id: Long) { _selectedId.value = id }
}

// в обоих Fragment
private val shared: SharedViewModel by activityViewModels()
```

Shared ViewModel живёт, пока жива Activity, и доступна всем Fragment. Это удобно, но важно не превращать её в глобальное хранилище: данные должны относиться к конкретному потоку навигации.

### 5.7. Отличие жизненного цикла ViewModel от Activity и Fragment {#viewmodel-lifecycle-diff}

- Activity/Fragment: создаются и уничтожаются при каждом пересоздании (поворот, смена конфигурации) и при закрытии экрана.
- ViewModel: создаётся при первом запросе и живёт, пока Activity/Fragment (или навигационный back stack entry) окончательно не уничтожены. Переживает пересоздание.
- View (разметка): живёт между `onCreateView` и `onDestroyView` во Fragment — короче, чем сам Fragment.

Поэтому в ViewModel нельзя хранить ссылки на View, binding или Context, связанный с View: они могут устареть при пересоздании. Храните только данные и абстракции.

### 5.8. ViewModel не переживает Process Death {#viewmodel-process-death}

Важное ограничение: ViewModel переживает пересоздание при смене конфигурации, но не переживает убийство процесса системой (process death). Если ОС убьёт приложение в фоне из-за нехватки памяти, при возврате пользователь увидит новый процесс, и ViewModel создастся заново с начальным состоянием.

Для данных, которые должны пережить process death (например, введённый текст, позиция в списке), используют SavedStateHandle или сохранение в постоянное хранилище (DataStore, БД). Полагаться на ViewModel для критически важных данных нельзя.

### 5.9. SavedStateHandle (назначение) {#viewmodel-savedstatehandle}

`SavedStateHandle` — key-value хранилище, привязанное к ViewModel, которое сохраняется в Bundle при process death и восстанавливается при пересоздании. Оно позволяет ViewModel читать и записывать небольшие значения, переживающие убийство процесса.

```kotlin
class SearchViewModel(
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {
    val query: StateFlow<String> = savedStateHandle.getStateFlow("query", "")

    fun setQuery(value: String) {
        savedStateHandle["query"] = value
    }
}
```

`SavedStateHandle` удобен для идентификаторов, поисковых запросов, фильтров. Большие объекты и списки в него класть не стоит — Bundle ограничен по размеру. Для них используют постоянное хранилище.

### 5.10. Тестирование ViewModel {#viewmodel-testing}

ViewModel тестируется на JVM: подменяем репозиторий фейком и проверяем изменения StateFlow. Корутины запускаем через `runTest`, а для проверки нескольких эмиссий используют библиотеку Turbine.

```kotlin
@Test
fun `load sets success state`() = runTest {
    val vm = ProfileViewModel(FakeUserRepository())
    vm.load(1L)
    assertEquals(ProfileUiState.Success(User(1, "Alex")), vm.state.value)
}
```

Такие тесты быстрые и не требуют эмулятора, потому что ViewModel зависит только от абстракций. Это и есть главная выгода выноса логики из Activity в ViewModel.

**Типичные ошибки:**
- Хранить ссылку на View, binding или Activity в ViewModel.
- Считать, что ViewModel переживает убийство процесса.
- Создавать ViewModel через `ViewModelProvider` без фабрики при наличии зависимостей.
- Использовать `GlobalScope` вместо `viewModelScope`.
- Класть большие объекты в SavedStateHandle.

**Короткая самопроверка:**
- [ ] Могу создать ViewModel с зависимостью через фабрику.
- [ ] Понимаю, почему ViewModel переживает поворот, но не process death.
- [ ] Знаю назначение viewModelScope и SavedStateHandle.
- [ ] Объясняю, когда нужен Shared ViewModel.

### Вопросы на собеседовании


## 6. Repository {#repository}

Repository — паттерн доступа к данным, который скрывает от ViewModel и UI детали того, откуда приходят данные: сеть, локальная база, кэш, файлы или SharedPreferences. ViewModel работает только с интерфейсом Repository и не знает, как именно данные получаются и сохраняются. Это делает слои независимыми и позволяет подменять источники данных без изменения логики представления.

### 6.1. Назначение Repository {#naznachenie-repository}

Главная задача Repository — предоставить единый интерфейс для работы с данными конкретной сущности. Вместо того чтобы ViewModel напрямую вызывала Retrofit-интерфейс и Room DAO, она обращается к `UserRepository`, который сам решает, откуда взять данные. Благодаря этому логика представления не зависит от конкретной технологии хранения и передачи данных.

Repository также становится местом, где живёт политика данных: когда можно вернуть кэш, когда нужно обновить сеть, как объединить несколько источников. Без Repository эта политика размазывается по ViewModel и фрагментам, и её невозможно тестировать изолированно. С Repository политика сосредоточена в одном классе, который можно покрыть unit-тестами с фейковыми источниками.

### 6.2. Разделение data source и бизнес-логики {#razdelenie-data-source-i-biznes-logiki}

Data source — конкретный источник данных: Retrofit-сервис, Room DAO, DataStore, файловый кэш. Бизнес-логика — правила, по которым данные превращаются в то, что нужно UI: фильтрация, сортировка, объединение, валидация. Repository разделяет эти две вещи: он вызывает data source, но преобразует результат в доменную модель.

Важно не смешивать слои. Retrofit-модель (`UserDto`) не должна утекать в ViewModel: Repository маппит её в доменный `User`. Тогда смена формата API или схемы БД затрагивает только Repository и мапперы, а ViewModel и UI остаются нетронутыми. Это и есть разделение ответственности: data source знает о транспорте, Repository — о правилах работы с данными, ViewModel — о состоянии экрана.

### 6.3. Работа с сетью и локальной БД {#rabota-s-setyu-i-lokalnoy-bd}

Типичный сценарий: приложение должно показывать данные из локальной БД мгновенно, а затем обновлять их из сети. Repository координирует оба источника. Он не просто выбирает один из них, а выстраивает поток: сначала отдать локальные данные, потом запросить сеть и обновить локальное хранилище, после чего UI получит новые данные через тот же поток.

Для реактивного потока удобно возвращать `Flow`. Repository подписывается на DAO, который эмитит изменения таблицы, и параллельно запускает сетевой запрос, сохраняющий результат в ту же таблицу. UI наблюдает за одним потоком и автоматически получает обновления. Это исключает рассинхронизацию: один источник истины — база данных.

### 6.4. Интерфейс Repository {#interfeys-repository}

Repository всегда начинается с интерфейса. Интерфейс описывает контракт: какие операции доступны (получить, сохранить, удалить, наблюдать) и в каком виде возвращаются данные. ViewModel зависит от интерфейса, а не от реализации. Это позволяет подменить реализацию в тестах фейковым репозиторием без изменения кода ViewModel.

Интерфейс должен быть минимальным и выражать намерения, а не детали. Методы называют по бизнес-смыслу: `getProfile`, `observeOrders`, `markAsRead`. Не стоит протаскивать через интерфейс параметры Retrofit или Room — они не должны быть видны вне data-слоя.

```kotlin
interface UserRepository {
    suspend fun getUser(id: Int): User
    fun observeUser(id: Int): Flow<User>
    suspend fun saveUser(user: User)
}
```

### 6.5. Реализация Repository {#realizaciya-repository}

Реализация Repository получает зависимости (API, DAO, мапперы) через конструктор и реализует интерфейс. Внутри она выполняет маппинг, координацию источников и обработку ошибок. Реализация может быть одной на всё приложение или разделённой по сущностям — обычно один Repository на агрегат или группу связанных данных.

```kotlin
class UserRepositoryImpl(
    private val api: UserApi,
    private val dao: UserDao,
    private val mapper: UserMapper
) : UserRepository {

    override suspend fun getUser(id: Int): User {
        val dto = api.getUser(id)
        val user = mapper.toDomain(dto)
        dao.insert(mapper.toEntity(user))
        return user
    }

    override fun observeUser(id: Int): Flow<User> =
        dao.observeById(id).map { mapper.toDomain(it) }

    override suspend fun saveUser(user: User) {
        dao.insert(mapper.toEntity(user))
    }
}
```

Здесь Repository объединяет сеть и БД: `getUser` запрашивает сеть, маппит, сохраняет в БД и возвращает доменную модель. `observeUser` отдаёт поток из БД, поэтому после `getUser` UI автоматически получит обновлённые данные.

### 6.6. Преобразование ошибок источников данных {#preobrazovanie-oshibok}

Сетевой слой бросает `IOException` и `HttpException`, БД может бросать `SQLiteException`. Эти детали не должны доходить до ViewModel и UI: они привязаны к конкретной технологии и не несут бизнес-смысла. Repository перехватывает ошибки источников и преобразует их в доменные типы, понятные верхним слоям.

Удобно использовать sealed-класс результата. Тогда ViewModel проверяет тип и показывает пользователю понятное сообщение, а не стектрейс.

```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val error: AppError) : Result<Nothing>()
}

sealed class AppError {
    data object Network : AppError()
    data object NotFound : AppError()
    data object Unknown : AppError()
}

suspend fun getUser(id: Int): Result<User> = try {
    Result.Success(mapper.toDomain(api.getUser(id)))
} catch (e: IOException) {
    Result.Error(AppError.Network)
} catch (e: HttpException) {
    if (e.code() == 404) Result.Error(AppError.NotFound)
    else Result.Error(AppError.Unknown)
}
```

Так ViewModel не зависит от Retrofit и может реагировать на `AppError` универсально. Логирование оригинальной ошибки стоит оставить в Repository или в отдельном перехватчике, чтобы не потерять диагностику.

### 6.7. Базовое понимание единого источника данных {#edinyy-istochnik-dannyh}

Single Source of Truth (SSOT) — принцип, при котором для каждой сущности есть один авторитетный источник данных, и все остальные читают из него. В Android-приложении таким источником обычно становится локальная БД: UI наблюдает за БД, а сеть лишь обновляет её. Тогда даже при отсутствии сети UI показывает последние сохранённые данные, а при появлении сети — обновляется автоматически.

SSOT устраняет расхождения: нет ситуации, когда один экран показывает старые данные, а другой — новые. Repository обеспечивает SSOT, скрывая от UI факт того, что данные могли прийти из сети. Для Junior-уровня достаточно понимать идею и применять её к простым случаям: «БД — источник истины, сеть — обновление».

**Типичные ошибки:**
- ViewModel напрямую вызывает Retrofit и Room, минуя Repository — логика данных размазывается и не тестируется.
- Утечка DTO и Entity в UI-слой — смена API ломает экраны.
- Несколько независимых источников для одной сущности без синхронизации — рассинхронизированный UI.
- Игнорирование ошибок сети — приложение падает или молчит.
- Repository, знающий о View и Context — нарушение слоёв.

**Короткая самопроверка:**
- [ ] Могу объяснить, зачем нужен Repository и что он скрывает от ViewModel.
- [ ] Понимаю разницу между data source и бизнес-логикой.
- [ ] Умею описать интерфейс Repository и его реализацию.
- [ ] Знаю, как маппить ошибки источников в доменные типы.
- [ ] Понимаю идею Single Source of Truth.

### Вопросы на собеседовании


## 7. UI State {#ui-state}

UI State — модель того, что экран должен показать пользователю в конкретный момент: данные, флаги загрузки, ошибки, выбранные элементы. Явная модель состояния делает поведение экрана предсказуемым и упрощает отрисовку: UI становится функцией от состояния.

### 7.1. Понятие UI State {#ponyatie-ui-state}

Состояние экрана — это все данные, необходимые для отрисовки интерфейса в данный момент: список элементов, текст заголовка, флаг загрузки, сообщение об ошибке, выбранная вкладка. Вместо набора разрозненных переменных и флагов в Activity лучше иметь один объект `UiState`, описывающий весь экран.

Явное состояние упрощает рассуждение о поведении: «если состояние такое — показываем вот это». Оно также помогает избежать противоречивых комбинаций, например одновременно показывать спиннер и данные. Хранится состояние во ViewModel, а View лишь отображает его.

Явное состояние также упрощает командную работу: дизайнер и разработчик могут договориться о наборе состояний экрана, а затем реализовывать их независимо. При добавлении нового состояния (например, «пустой список») достаточно добавить вариант в sealed-иерархию и обновить рендеринг — компилятор подскажет все места, где состояние используется. Это снижает риск забыть обновить один из экранов или диалогов.

### 7.2. Loading, Success и Error {#loading-success-error}

Большинство экранов проходят через три базовых состояния асинхронной операции: загрузка, успех, ошибка. Эти состояния взаимоисключающие — экран не может одновременно грузиться и показывать ошибку. Поэтому их удобно моделировать через sealed-класс или sealed-интерфейс.

```kotlin
sealed interface UiState {
    data object Loading : UiState
    data class Success(val items: List<Item>) : UiState
    data class Error(val message: String) : UiState
}
```

Такая модель заставляет View обработать все случаи: компилятор не даст забыть ветку. При переходе из Loading в Success спиннер скрывается и показывается список; при Error — сообщение и кнопка повтора. Никаких «половинчатых» состояний.

### 7.3. Data class для состояния экрана {#data-class-sostoyaniya}

Когда состояний много и они пересекаются, удобнее один data-класс со всеми полями, где часть полей может быть null или пустой. Это проще для сложных экранов с несколькими независимыми блоками.

```kotlin
data class ProfileScreenState(
    val isLoading: Boolean = false,
    val user: User? = null,
    val errorMessage: String? = null,
    val isRefreshing: Boolean = false
)
```

Плюс подхода — гибкость: можно показывать частичные данные во время обновления. Минус — возможность противоречивых комбинаций (например, `isLoading = true` и `errorMessage != null` одновременно). Для простых экранов предпочтительнее sealed-состояния, для сложных — data-класс с инвариантами, проверяемыми в ViewModel.

На практике часто комбинируют оба подхода: верхнеуровневое состояние экрана моделируют через sealed-класс (Loading/Content/Error), а внутри Content хранят data-класс с полями. Такой гибрид сохраняет исчерпывающую проверку в `when` и позволяет описывать сложные данные внутри успешного состояния. Выбор конкретной формы зависит от количества независимых осей изменения экрана.

### 7.4. Sealed class и sealed interface для состояний {#sealed-class-interface}

Sealed-иерархия ограничивает набор наследников: все варианты известны на этапе компиляции. `when` по sealed-типу становится исчерпывающим — компилятор потребует обработать все ветки и не даст добавить новую без обновления UI.

```kotlin
sealed interface ScreenState {
    data object Loading : ScreenState
    data class Content(val data: List<Item>) : ScreenState
    data class Error(val reason: Throwable) : ScreenState
    data object Empty : ScreenState
}
```

Sealed interface предпочтительнее sealed class, если не нужно хранить общее состояние в базовом типе: интерфейс не навязывает конструктор и позволяет наследовать несколько иерархий. Для UI State sealed interface — современный стандарт.

### 7.5. Immutable UI State {#immutable-ui-state}

Состояние должно быть неизменяемым: вместо изменения полей создаётся новая копия через `copy()`. Это упрощает отслеживание изменений (diff), делает эмиссии StateFlow корректными и исключает гонки при параллельном доступе.

```kotlin
data class UiState(
    val query: String = "",
    val results: List<Item> = emptyList(),
    val isLoading: Boolean = false
)

// обновление
_state.value = _state.value.copy(isLoading = true)
```

Иммутабельность также упрощает тестирование: состояние до и после операции можно сравнить напрямую. Mutable-поля в state-объекте приводят к скрытым изменениям и багам, когда UI не замечает обновление.

Иммутабельность также упрощает откат и повтор изменений (undo/redo): достаточно хранить список предыдущих состояний и возвращаться к нужному. В отладке это позволяет воспроизвести любой момент жизни экрана. Кроме того, иммутабельные объекты безопасно передавать между потоками без дополнительной синхронизации, что важно при работе с корутинами и Flow.

### 7.6. Хранение состояния во ViewModel {#khranenie-sostoyaniya-viewmodel}

ViewModel хранит состояние в `MutableStateFlow`, а наружу отдаёт read-only `StateFlow`. Это гарантирует, что только ViewModel может менять состояние, а View — только наблюдать. При пересоздании Activity состояние сохраняется, потому что ViewModel переживает configuration change.

```kotlin
class SearchViewModel(
    private val repo: SearchRepository
) : ViewModel() {

    private val _state = MutableStateFlow(UiState())
    val state: StateFlow<UiState> = _state.asStateFlow()

    fun search(query: String) {
        _state.value = _state.value.copy(isLoading = true, query = query)
        viewModelScope.launch {
            val result = repo.search(query)
            _state.value = _state.value.copy(isLoading = false, results = result)
        }
    }
}
```

Важно: не отдавать наружу `MutableStateFlow` и не менять `_state.value` из View. Единственная точка изменения — методы ViewModel, вызываемые по событиям пользователя.

### 7.7. Отображение состояния в Activity и Fragment {#otobrazhenie-sostoyaniya}

View подписывается на `StateFlow` и перерисовывает UI при каждом новом состоянии. Используют `repeatOnLifecycle`, чтобы сбор происходил только когда экран видим, и останавливался при уходе в фон — это экономит ресурсы и предотвращает обновления невидимого UI.

```kotlin
class SearchFragment : Fragment(R.layout.fragment_search) {

    private val viewModel: SearchViewModel by viewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.state.collect { state ->
                    render(state)
                }
            }
        }
    }

    private fun render(state: UiState) {
        when (state) {
            is UiState.Loading -> showProgress()
            is UiState.Success -> showList(state.items)
            is UiState.Error -> showError(state.message)
        }
    }
}
```

Рендеринг выносят в отдельную функцию `render`, которая полностью описывает, как состояние превращается в UI. Это делает код читаемым и тестируемым: можно проверить `render` отдельно или проверить, что ViewModel эмитит ожидаемые состояния.

Важно не смешивать логику и отображение: функция `render` должна только читать состояние и обновлять View, без вызовов Repository или навигации. Побочные эффекты (навигация, показ Snackbar, запрос разрешений) лучше выносить в отдельный канал событий (SharedFlow), чтобы они не повторялись при каждом новом состоянии и не терялись при пересоздании View. Разделение состояния и одноразовых событий — частая точка ошибок на Junior-уровне.

**Типичные ошибки:**
- Хранение состояния в Activity/Fragment — теряется при повороте экрана.
- Несколько LiveData/Flow для одного экрана без объединения — сложно синхронизировать.
- Изменение состояния из View напрямую — нарушение инкапсуляции.
- Отсутствие обработки всех веток sealed-состояния — неполный UI.
- Сбор Flow без `repeatOnLifecycle` — утечки и лишняя работа в фоне.

**Короткая самопроверка:**
- [ ] Могу описать состояние экрана одним объектом.
- [ ] Умею моделировать Loading/Success/Error через sealed-интерфейс.
- [ ] Понимаю, зачем состояние иммутабельно.
- [ ] Умею хранить состояние в ViewModel через StateFlow.
- [ ] Знаю, как собирать состояние в Activity/Fragment через repeatOnLifecycle.

### Вопросы на собеседовании


## 8. Односторонний поток данных {#odnostoronniy-potok-dannyh}

Unidirectional Data Flow (UDF) — архитектурный принцип, при котором состояние движется только вниз (от логики к UI), а пользовательские события — только вверх (от UI к логике). Это делает поток данных предсказуемым и упрощает отладку.

### 8.1. State вниз {#state-vniz}

Состояние передаётся от ViewModel к View. View не хранит собственное состояние экрана и не вычисляет его; она получает готовый объект `UiState` и отображает. При изменении состояния ViewModel эмитит новое значение, и View перерисовывается.

Направление «вниз» означает, что данные текут от источника истины (ViewModel) к потребителю (View). View не может изменить состояние напрямую — только запросить изменение через событие. Это исключает ситуацию, когда View и ViewModel расходятся во мнении о том, что сейчас на экране.

### 8.2. Events вверх {#events-vverkh}

Пользовательские действия (клик, ввод, свайп) передаются вверх как события. View не меняет состояние сама — она вызывает метод ViewModel (`onItemClick`, `onRetry`) или отправляет объект события. ViewModel обрабатывает событие, обновляет состояние и эмитит новое значение вниз.

```kotlin
// View
button.setOnClickListener { viewModel.onRetry() }

// ViewModel
fun onRetry() {
    _state.value = _state.value.copy(isLoading = true)
    viewModelScope.launch {
        val data = repo.load()
        _state.value = _state.value.copy(isLoading = false, data = data)
    }
}
```

Разделение «событие вверх, состояние вниз» делает поток однонаправленным: всегда понятно, откуда пришло изменение. Это особенно важно при отладке: можно логировать каждое событие и каждое новое состояние.

### 8.3. Single Source of Truth {#single-source-of-truth}

В UDF для каждого куска состояния есть один источник истины — обычно ViewModel (или Repository для данных). Никакой другой компонент не хранит свою копию, которую нужно синхронизировать. View — чистая функция от состояния, она не добавляет собственной логики.

SSOT устраняет класс багов, когда два компонента хранят состояние независимо и расходятся. Например, если и Activity, и Fragment держат флаг `isLoading`, они могут показать разное. С UDF флаг один — во ViewModel, и все читают его оттуда.

На практике SSOT означает, что при конфликте данных между кэшем и сетью побеждает тот источник, который объявлен авторитетным. Repository обеспечивает это правило: он решает, откуда брать данные и как объединять источники. ViewModel же всегда читает готовое состояние и не пытается «угадать», какой источник актуальнее. Это особенно важно при оффлайн-режиме, когда локальная БД может содержать устаревшие, но последние известные данные.

### 8.4. Immutability {#immutability}

Состояние в UDF неизменно. Каждое изменение создаёт новое значение состояния, а не мутирует старое. Это позволяет StateFlow корректно определять изменения (сравнение по равенству), сохранять историю изменений и откатывать состояние при необходимости.

Иммутабельность также делает код потокобезопасным: состояние не может измениться «под ногами» у читающего кода. При параллельных операциях каждая создаёт свою копию, и конфликтов состояния не возникает.

В Kotlin иммутабельность достигается использованием `val` и data-классов с `copy()`. Важно не забывать, что коллекции внутри data-класса (например, `List`) должны быть неизменяемыми: `listOf`, а не `mutableListOf`. Иначе внешний код сможет изменить список внутри «неизменяемого» объекта, что ломает гарантии. Для защиты используйте `toList()` при создании состояния.

### 8.5. Обработка пользовательских событий {#obrabotka-polzovatelskih-sobytiy}

События пользователя должны быть явными и типизированными. Вместо произвольных вызовов методов удобно использовать sealed-класс событий, который View отправляет в ViewModel. Это делает контракт между View и ViewModel явным и проверяемым компилятором.

```kotlin
sealed interface UserEvent {
    data class QueryChanged(val query: String) : UserEvent
    data object SearchClicked : UserEvent
    data class ItemClicked(val id: Int) : UserEvent
}

class SearchViewModel : ViewModel() {
    fun onEvent(event: UserEvent) {
        when (event) {
            is UserEvent.QueryChanged -> updateQuery(event.query)
            UserEvent.SearchClicked -> performSearch()
            is UserEvent.ItemClicked -> openItem(event.id)
        }
    }
}
```

Единая точка входа `onEvent` упрощает логирование, тестирование и добавление новых событий: достаточно добавить вариант в sealed-класс и обработать его в `when`.

### 8.6. Обновление UI State {#obnovlenie-ui-state}

Обновление состояния происходит в ViewModel в ответ на событие. Процесс: получить текущее состояние, вычислить новое (обычно через `copy`), присвоить `_state.value`. Если обновление зависит от асинхронной операции, сначала можно выставить промежуточное состояние (Loading), а после завершения — финальное (Success/Error).

```kotlin
fun performSearch() {
    val query = _state.value.query
    _state.value = _state.value.copy(isLoading = true, error = null)
    viewModelScope.launch {
        val result = try {
            repo.search(query)
        } catch (e: Exception) {
            null
        }
        _state.value = if (result != null) {
            _state.value.copy(isLoading = false, results = result)
        } else {
            _state.value.copy(isLoading = false, error = "Не удалось загрузить")
        }
    }
}
```

Важно обновлять состояние атомарно и не оставлять «полусостояния», когда часть полей уже обновлена, а часть — нет. Иммутабельный `copy` помогает: новое значение создаётся целиком.

### 8.7. Преимущества предсказуемого потока данных {#preimushchestva-predskazuemogo-potoka}

UDF даёт несколько практических преимуществ. Отладка упрощается: состояние — функция событий, поэтому по логу событий можно воспроизвести любое состояние. Тестирование становится простым: отправить событие, проверить эмитированное состояние. UI становится детерминированным: одинаковое состояние всегда даёт одинаковый экран.

Также упрощается работа с configuration changes: ViewModel хранит состояние, View при пересоздании просто подписывается заново и получает актуальное. Нет необходимости сохранять и восстанавливать состояние вручную. Для Junior-разработчика UDF — основа для понимания MVVM и подготовка к MVI на Middle-уровне.

Ещё одно преимущество — предсказуемость при тестировании. Тест отправляет событие и проверяет, что ViewModel эмитировала ожидаемую последовательность состояний. Нет скрытых зависимостей от порядка вызовов или внутренних флагов. Это делает тесты стабильными и понятными: «при событии X состояние становится Y». Именно поэтому UDF рекомендуется как стандарт для новых Android-проектов.

**Типичные ошибки:**
- View напрямую меняет состояние, минуя ViewModel — нарушение направления потока.
- Несколько источников истины для одного экрана — рассинхронизация.
- Мутация состояния вместо создания копии — StateFlow не эмитит обновление.
- Смешение событий и состояния в одном объекте — путаница в потоке.
- Обработка событий в View вместо ViewModel — логика утекает в UI.

**Короткая самопроверка:**
- [ ] Могу объяснить, почему состояние идёт вниз, а события — вверх.
- [ ] Понимаю, что такое Single Source of Truth.
- [ ] Знаю, зачем состояние иммутабельно.
- [ ] Умею моделировать события через sealed-класс.
- [ ] Могу описать полный цикл: событие → обновление состояния → перерисовка.

### Вопросы на собеседовании


## 9. Dependency Injection Basics {#dependency-injection-basics}

Dependency Injection (DI) — техника, при которой объект получает свои зависимости извне, а не создаёт их сам. Это снижает связанность компонентов и упрощает тестирование и замену реализаций.

### 9.1. Понятие зависимости {#ponyatie-zavisimosti}

Зависимость — объект, который нужен другому объекту для работы. Например, `UserRepository` зависит от `UserApi` и `UserDao`; `LoginViewModel` зависит от `LoginUseCase`. Если класс сам создаёт свои зависимости через `new`/конструктор, он жёстко связан с их конкретными реализациями и не может работать с другими.

```kotlin
class LoginViewModel {
    // жёсткая связанность: ViewModel сам создаёт репозиторий
    private val repo = UserRepositoryImpl(RetrofitInstance.api, AppDatabase.dao)
}
```

Зависимость становится проблемой, когда её нужно заменить (в тесте, при смене реализации) или когда один и тот же объект нужно разделить между несколькими потребителями. DI решает эту проблему, передавая зависимости снаружи.

### 9.2. Dependency Injection {#dependency-injection}

DI — передача зависимостей объекту извне, обычно через конструктор. Объект не знает, как создать зависимость, он только использует её. Созданием и связыванием занимается внешний код — composition root или DI-фреймворк.

```kotlin
class LoginViewModel(
    private val loginUseCase: LoginUseCase
) : ViewModel() {
    fun login(email: String, password: String) {
        viewModelScope.launch { loginUseCase(email, password) }
    }
}
```

Теперь `LoginViewModel` зависит от абстракции `LoginUseCase` (или интерфейса), а конкретная реализация подставляется снаружи. В тесте можно передать фейковый use-case. Это и есть инверсия управления: контроль над созданием объектов переходит от класса к внешнему коду.

### 9.3. Constructor Injection {#constructor-injection}

Constructor Injection — основной и самый предпочтительный вид DI: зависимости передаются через конструктор и сохраняются в `private val` полях. Это делает зависимости явными, неизменяемыми и гарантирует, что объект не может существовать без них.

```kotlin
class OrderRepositoryImpl(
    private val api: OrderApi,
    private val dao: OrderDao,
    private val mapper: OrderMapper
) : OrderRepository { ... }
```

Преимущества: зависимости видны в сигнатуре, их нельзя забыть; объект иммутабелен; легко создать в тесте, передав фейки. Альтернативы (field injection, setter injection) скрывают зависимости и позволяют создать объект в невалидном состоянии — их используют только там, где конструктор недоступен (например, Android-компоненты без фабрики).

### 9.4. Dependency Inversion (базовое понимание) {#dependency-inversion}

Dependency Inversion Principle (DIP) — принцип SOLID: модули верхнего уровня не должны зависеть от модулей нижнего уровня; оба должны зависеть от абстракций. Абстракции не должны зависеть от деталей; детали зависят от абстракций.

На практике это означает: ViewModel зависит от интерфейса Repository, а не от его реализации с Retrofit. Реализация зависит от того же интерфейса. Связь между слоями идёт через абстракцию, поэтому можно подменить реализацию (например, перейти с Retrofit на Ktor) без изменения ViewModel. DI и DIP идут рука об руку: DI — механизм передачи зависимостей, DIP — правило, от чего зависеть.

### 9.5. Ручное создание объектов и проблема жёсткой связанности {#ruchnoe-sozdanie}

Без DI объекты создаются вручную, часто в Activity или Application. Это приводит к жёсткой связанности: чтобы создать ViewModel, нужно создать Repository, который требует API и DAO, которые требуют Context и базу данных. Граф зависимостей растёт, и его приходится собирать вручную в каждом месте.

```kotlin
// ручная сборка в Activity — плохо масштабируется
val db = Room.databaseBuilder(context, AppDb::class.java, "db").build()
val api = Retrofit.Builder().baseUrl(BASE_URL).build().create(UserApi::class.java)
val repo = UserRepositoryImpl(api, db.userDao())
val vm = UserViewModel(repo)
```

Проблемы: дублирование кода сборки, сложность тестирования (нельзя подменить зависимости), риск создать несколько экземпляров там, где нужен один. DI-фреймворки автоматизируют эту сборку.

### 9.6. Передача зависимостей между слоями {#peredacha-zavisimostey}

Зависимости передаются сверху вниз по слоям: UI получает ViewModel, ViewModel — use-case или Repository, Repository — data source. Каждый слой зависит только от абстракций соседнего нижнего слоя. Это сохраняет направление зависимостей и не даёт нижним слоям знать о верхних.

Важно не «протаскивать» зависимости через слои без необходимости: если Repository нужен только ViewModel, он не должен попадать в Activity. Каждый компонент получает только то, что ему нужно. Это принцип минимальных знаний (Least Knowledge) и он упрощает тестирование каждого слоя отдельно.

### 9.7. Назначение DI-фреймворков {#naznachenie-di-freymvorkov}

DI можно делать вручную (Pure DI), но на больших проектах граф зависимостей становится громоздким. DI-фреймворки (Hilt, Koin, Dagger) автоматизируют создание и связывание объектов: описываете, как создавать каждую зависимость, а фреймворк строит граф и внедряет их туда, где нужно.

Фреймворки также управляют жизненным циклом: singleton на всё приложение, scoped на Activity/Fragment/ViewModel, factory для новых экземпляров. Это избавляет от ручного управления экземплярами и предотвращает утечки. Для Junior-уровня достаточно понять идею и базовые аннотации/DSL; глубокая настройка — задача Middle-уровня.

### 9.8. Паттерны проектирования: Factory, Builder, Observer, Singleton {#patterny-proektirovaniya}

Несколько базовых паттернов, которые часто встречаются вместе с DI:

- **Factory** — объект, отвечающий за создание других объектов. Инкапсулирует логику создания и позволяет подменять создаваемый тип. Пример: `ViewModelFactory`, создающая ViewModel с зависимостями.
- **Builder** — пошаговое конструирование сложного объекта. Полезен, когда у объекта много параметров, часть из которых опциональны. Пример: `Retrofit.Builder()`, `AlertDialog.Builder`.
- **Observer** — объект уведомляет подписчиков об изменениях своего состояния. В Android это `LiveData`, `StateFlow`, `Flow`: View подписывается на изменения состояния ViewModel.
- **Singleton** — гарантирует один экземпляр класса на всё приложение. Используется для общих ресурсов (база данных, сетевой клиент). В DI-фреймворках помечается аннотацией `@Singleton` или scope-ом.

Эти паттерны не заменяют DI, а дополняют его: Factory создаёт объекты с зависимостями, Builder собирает сложные конфигурации, Observer распространяет изменения состояния, Singleton управляет общими ресурсами.

**Мостик к Hilt и Koin (Middle).** На Junior-уровне DI делают вручную или через простые фабрики. На Middle-уровне переходят к фреймворкам:
- **Hilt** — обёртка над Dagger для Android: аннотации `@HiltAndroidApp`, `@AndroidEntryPoint`, `@Inject`, `@Module`, `@Provides`/`@Binds`, scopes (`@Singleton`, `@ViewModelScoped`). Интегрируется с ViewModel и WorkManager.
- **Koin** — лёгкий DI-фреймворк на Kotlin DSL: модули с `single`, `factory`, `viewModel`, внедрение через `by inject()`/`by viewModel()`. Проще в настройке, но без compile-time проверки графа.

Оба решают одну задачу — автоматическая сборка графа зависимостей. Выбор между ними зависит от проекта: Hilt даёт compile-time безопасность и интеграцию с Android, Koin — простоту и гибкость. Подробное изучение — на Middle-уровне.

**Типичные ошибки:**
- Создание зависимостей внутри класса — жёсткая связанность и нетестируемость.
- Зависимость от конкретной реализации вместо интерфейса — нарушение DIP.
- Использование service locator вместо DI без необходимости — скрытые зависимости.
- Singleton для объектов с состоянием запроса — утечки и гонки.
- Передача Context во все слои — нарушение границ.

**Короткая самопроверка:**
- [ ] Могу объяснить, что такое зависимость и зачем её внедрять.
- [ ] Понимаю Constructor Injection и его преимущества.
- [ ] Знаю принцип Dependency Inversion на базовом уровне.
- [ ] Могу описать проблемы ручного создания объектов.
- [ ] Знаю назначение DI-фреймворков и различие Hilt/Koin на уровне идеи.
- [ ] Могу кратко описать паттерны Factory, Builder, Observer, Singleton.

### Вопросы на собеседовании


## Итоговая самопроверка категории {#itogovaya-samoproverka}

- [ ] Понимаю паттерны MVC, MVP, MVVM и их различия.
- [ ] Умею создавать и использовать ViewModel и переживать configuration changes.
- [ ] Знаю основы LiveData и StateFlow и умею наблюдать за данными.
- [ ] Могу реализовать Repository с интерфейсом и маппингом ошибок.
- [ ] Умею моделировать UI State через sealed-классы и хранить его во ViewModel.
- [ ] Понимаю принцип одностороннего потока данных.
- [ ] Знаю основы Dependency Injection и базовые паттерны проектирования.

## Источники и документация {#istochniki-i-dokumentaciya}

### Официальная документация

- [Guide to app architecture](https://developer.android.com/topic/architecture)
- [ViewModel overview](https://developer.android.com/topic/libraries/architecture/viewmodel)
- [LiveData overview](https://developer.android.com/topic/libraries/architecture/livedata)
- [Data layer — Repository](https://developer.android.com/topic/architecture/data-layer)
- [UI layer — state holders](https://developer.android.com/topic/architecture/ui-layer/stateholders)
- [Unidirectional data flow](https://developer.android.com/topic/architecture/ui-layer#udf)
- [Dependency injection in Android](https://developer.android.com/training/dependency-injection)
- [Hilt](https://developer.android.com/training/dependency-injection/hilt-android)
- [Koin](https://insert-koin.io/docs/quickstart/android/)

### Статьи

- [Android architecture recommendations](https://developer.android.com/topic/architecture/recommendations)
- [StateFlow and SharedFlow](https://developer.android.com/kotlin/flow/stateflow-and-sharedflow)
- [SavedStateHandle](https://developer.android.com/topic/libraries/architecture/viewmodel/viewmodel-savedstate)
- [Manual dependency injection](https://developer.android.com/training/dependency-injection/manual)
- [Architecture components samples](https://github.com/android/architecture-samples)
