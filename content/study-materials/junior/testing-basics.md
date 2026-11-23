# Тестирование в Android

**Уровень:** Junior  
**Категория:** Тестирование  
**Язык:** Kotlin  
**Кратко:** Как писать модульные и UI-тесты Android-приложения и не тратить на них больше времени, чем они экономят.

## 1. JUnit и Unit Testing Basics {#junit-i-unit-testing}

Модульный тест (unit test) проверяет одну небольшую единицу логики — функцию, метод класса или правило — в изоляции от Android-фреймворка, базы данных и сети. Цель unit-тестов — быстро и дёшево находить ошибки в чистой логике: расчётах, преобразованиях, ветвлениях, состояниях. Они выполняются на JVM за миллисекунды, поэтому их можно запускать сотнями при каждом изменении.

### 1.1. Назначение Unit Testing {#naznachenie-unit-testing}

Без тестов регрессии обнаруживаются вручную: разработчик меняет код, запускает приложение, кликает по экранам и надеется, что ничего не сломалось. На маленьком проекте это работает, но с ростом кодовой базы цена ручной проверки растёт, а уверенность падает. Unit-тесты превращают проверку в автоматическую: написал тест один раз — он будет проверять поведение при каждом запуске сборки.

Тесты также служат живой документацией: по ним видно, как функция должна себя вести на корректных и некорректных входах. Хороший тест описывает контракт, а не реализацию, поэтому его можно сохранить при рефакторинге.

### 1.2. Unit vs Integration vs UI Tests {#unit-vs-integration-vs-ui}

Тесты различаются по масштабу проверяемого куска системы.

- Unit-тест проверяет один класс или функцию в изоляции. Зависимости заменяются фейками или моками. Быстрый, запускается на JVM без эмулятора.
- Integration-тест проверяет взаимодействие нескольких компонентов: например, репозиторий с реальной базой данных Room или сетевой слой с мок-сервером. Запускается на эмуляторе или через Robolectric, медленнее unit-тестов.
- UI-тест проверяет поведение экрана с точки зрения пользователя: нажатия, ввод текста, отображение элементов. В Android чаще всего Espresso для View или Compose UI Test для Compose. Самый медленный и хрупкий уровень.

Практическое правило: пишите много unit-тестов, меньше интеграционных и совсем мало UI-тестов. Это классическая пирамида тестирования. UI-тесты дороги в поддержке, поэтому ими покрывают только критические пользовательские сценарии, а логику проверяют unit-тестами.

### 1.3. Аннотация @Test {#test-annotation}

Любой метод, помеченный `@Test`, становится тестом. Метод должен быть без параметров и возвращать `Unit` (или `void` в Java). JUnit 5 (Jupiter) — стандарт для новых проектов, но в существующих Android-кодовых базах JUnit 4 по-прежнему очень распространён.

```kotlin
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class CalculatorTest {

    @Test
    fun `1 + 2 equals 3`() {
        val result = 1 + 2
        assertEquals(3, result)
    }
}
```

Тест считается успешным, если он завершился без исключений и все проверки прошли. Если проверка не прошла, JUnit бросает `AssertionError` и помечает тест как проваленный.

### 1.4. @Before и @After {#before-after}

`@BeforeEach` (JUnit 5) выполняется перед каждым тестом, `@AfterEach` — после. В JUnit 4 аналоги — `@Before` и `@After`. Они нужны для подготовки общего состояния: создание объектов, очистка базы, сброс синглтонов.

```kotlin
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class CounterTest {

    private lateinit var counter: Counter

    @BeforeEach
    fun setUp() {
        counter = Counter()
    }

    @AfterEach
    fun tearDown() {
        // освобождение ресурсов, если нужно
    }

    @Test
    fun `increment increases value by one`() {
        counter.increment()
        assertEquals(1, counter.value)
    }
}
```

Важно: состояние между тестами не должно утекать. Каждый тест начинается с чистого объекта, созданного в `@BeforeEach`. Если тест зависит от порядка выполнения других тестов — это запах: тесты должны быть независимыми.

### 1.5. Assertions {#assertions}

Проверки (assertions) — сердце теста. JUnit предоставляет набор функций для сравнения значений.

```kotlin
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.assertThrows

@Test
fun `assertions examples`() {
    assertEquals(4, 2 + 2)
    assertNotEquals(5, 2 + 2)
    assertTrue(2 + 2 == 4)
    assertFalse(2 + 2 == 5)
    assertNull(null)
    assertNotNull("hello")
    assertThrows<IllegalArgumentException> {
        require(false) { "bad input" }
    }
}
```

`assertEquals(expected, actual)` принимает ожидаемое значение первым аргументом. Порядок важен: при провале сообщение покажет «expected X but was Y». Для сравнения объектов используется `equals`, поэтому data-классы сравниваются по содержимому.

Для проверки исключений есть `assertThrows`, который возвращает брошенное исключение — его можно дополнительно проверить.

### 1.6. Arrange-Act-Assert {#arrange-act-assert}

AAA — стандартная структура теста из трёх шагов.

- Arrange (подготовка): создать объекты, задать входные данные.
- Act (действие): вызвать тестируемый метод.
- Assert (проверка): сравнить результат с ожиданием.

```kotlin
@Test
fun `calculateDiscount returns 10 percent for loyal customer`() {
    // Arrange
    val customer = Customer(loyaltyYears = 3)
    val price = 1000

    // Act
    val discounted = calculateDiscount(customer, price)

    // Assert
    assertEquals(900, discounted)
}
```

Разделение шагов пустыми строками делает тест читаемым. Один тест — одна проверяемая идея. Если в тесте несколько несвязанных проверок, его стоит разбить.

### 1.7. Проверка граничных случаев {#granichnye-sluchai}

Граничные случаи (edge cases) — входы на границах допустимого диапазона: ноль, пустая строка, пустой список, максимальное значение, отрицательное число. Именно здесь чаще всего прячутся баги: деление на ноль, off-by-one, пустые коллекции.

```kotlin
@Test
fun `average of empty list returns zero`() {
    assertEquals(0, averageOf(emptyList()))
}

@Test
fun `average of single element returns that element`() {
    assertEquals(5, averageOf(listOf(5)))
}
```

Полезно думать в терминах: что минимальное, максимальное, типичное, пустое, null (если допустимо). Покрытие граничных случаев даёт больше пользы, чем тестирование «средних» значений.

### 1.8. Тестирование исключений {#testirovanie-isklyucheniy}

Если метод должен бросать исключение при некорректном вводе, это нужно проверить явно. Иначе тест пройдёт даже если метод просто вернёт мусор.

```kotlin
@Test
fun `divide by zero throws`() {
    val exception = assertThrows<IllegalArgumentException> {
        divide(10, 0)
    }
    assertEquals("divisor must not be zero", exception.message)
}
```

Проверяйте не только тип исключения, но и сообщение или поле, если оно важно для логики. В production-коде для валидации входов используют `require` и `check`, которые бросают `IllegalArgumentException` и `IllegalStateException` соответственно.

### 1.9. Именование тестов {#imenovanie-testov}

Имя теста должно описывать сценарий и ожидаемый результат. В Kotlin удобно использовать имена с обратными кавычками и пробелами.

```kotlin
@Test
fun `login with empty password returns error`() { ... }

@Test
fun `user with age 18 is adult`() { ... }
```

Формат «метод + условие + результат» читается как предложение. Избегайте имён вроде `test1` или `testLogin`: они не объясняют, что именно проверяется, и при провале не помогают понять причину.

### 1.10. runTest и тестирование suspend-функций {#runtest-suspend}

Suspend-функции нельзя вызвать из обычного теста напрямую. Библиотека `kotlinx-coroutines-test` предоставляет `runTest`, который запускает корутину в тестовом диспетчере и ждёт её завершения.

```kotlin
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.Test

class UserRepositoryTest {

    @Test
    fun `fetchUser returns user from api`() = runTest {
        val repo = UserRepository(FakeApi())
        val user = repo.fetchUser(1)
        assertEquals("Alex", user.name)
    }
}
```

`runTest` по умолчанию использует `StandardTestDispatcher` с виртуальным временем: `delay` не тратит реальные секунды, а лишь сдвигает виртуальные часы теста. Для тестирования ViewModel и use-case с корутинами `runTest` — обязательный инструмент.

Зависимость: `testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:...")`.

### 1.11. Базовое тестирование ViewModel {#testirovanie-viewmodel}

ViewModel обычно содержит состояние UI и вызывает use-case или репозиторий. Чтобы протестировать её, подменяем зависимость фейковым репозиторием и проверяем изменение состояния.

```kotlin
class ProfileViewModel(
    private val repo: UserRepository
) : ViewModel() {

    private val _state = MutableStateFlow<UiState>(UiState.Loading)
    val state: StateFlow<UiState> = _state.asStateFlow()

    fun load(userId: Int) = viewModelScope.launch {
        _state.value = UiState.Success(repo.getUser(userId))
    }
}

class FakeUserRepository : UserRepository {
    override suspend fun getUser(id: Int) = User(id, "Alex")
}

@Test
fun `load sets success state`() = runTest {
    val vm = ProfileViewModel(FakeUserRepository())
    vm.load(1)
    assertEquals(UiState.Success(User(1, "Alex")), vm.state.value)
}
```

Такой тест проверяет логику преобразования данных в состояние, а не Android-компоненты. Для проверки `StateFlow` используйте `runTest` и чтение `.value` после завершения корутины. Более сложные сценарии (несколько эмиссий) проверяют через Turbine.

**Типичные ошибки:**
- Тестирование реализации вместо поведения: тест ломается при рефакторинге, хотя поведение не изменилось.
- Общее изменяемое состояние между тестами — приводит к флаки-тестам.
- Запуск suspend-функции без `runTest` — не скомпилируется или зависнет.
- Путаница порядка аргументов в `assertEquals` — сообщение об ошибке будет вводить в заблуждение.

**Короткая самопроверка:**
- [ ] Могу объяснить, зачем нужны unit-тесты и чем они отличаются от UI-тестов.
- [ ] Умею писать тест с `@Test`, `@BeforeEach` и assertions.
- [ ] Понимаю структуру AAA и применяю её.
- [ ] Умею тестировать suspend-функции через `runTest`.
- [ ] Могу написать тест для ViewModel с фейковым репозиторием.

## 2. Espresso Basics {#espresso-basics}

Espresso — фреймворк для UI-тестирования Android-приложений, работающих на классических View (XML-разметка, Fragment, Activity). Он синхронизируется с главным потоком UI и автоматически ждёт завершения операций, что делает тесты стабильнее ручных кликов.

Важно: на современных проектах, использующих Jetpack Compose, Espresso применяют только к legacy-экранам на View. Для Compose-экранов используют Compose UI Test (`compose-ui-test`), где взаимодействие строится вокруг семантического дерева, а не View-иерархии. Espresso не видит Compose-компоненты, поэтому попытка применить его к Compose-экрану приведёт к падению теста с ошибкой «view not found». Если проект смешанный (View + Compose), Espresso покрывает старые экраны, а Compose Test — новые.

### 2.1. Назначение Espresso {#naznachenie-espresso}

Espresso нужен, чтобы автоматически проверять, что экран отображает нужные элементы, реагирует на действия пользователя и переходит между состояниями. Тест запускается на эмуляторе или реальном устройстве и выполняет реальные жесты.

Типичные сценарии: проверка формы логина, навигация по списку, отображение ошибки при пустом вводе. Espresso не заменяет unit-тесты: он медленный и хрупкий, поэтому им покрывают только критические пользовательские пути.

### 2.2. onView() {#onview}

Точка входа — `onView(matcher)`, которая находит View по матчеру и возвращает `ViewInteraction`. Дальнейшие действия и проверки цепляются к этому объекту.

```kotlin
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.matcher.ViewMatchers.withId

onView(withId(R.id.loginButton)).perform(click())
```

Если матчер находит несколько View, Espresso бросает `AmbiguousViewMatcherException`. Если не находит ни одного — `NoMatchingViewException`. Это помогает быстро локализовать проблему: элемент не отображён или матчер слишком общий.

### 2.3. ViewMatchers {#viewmatchers}

Матчеры описывают, какую View ищем. Основные: `withId`, `withText`, `withHint`, `isDisplayed`, `isEnabled`, `isChecked`. Их можно комбинировать через `allOf` и `anyOf`.

```kotlin
import androidx.test.espresso.matcher.ViewMatchers.*

onView(allOf(withId(R.id.submitButton), isEnabled()))
onView(withText("Войти"))
onView(withHint("Email"))
```

Комбинирование матчеров делает поиск точным: например, кнопка с конкретным id и текстом. Избегайте матчеров только по тексту, если текст может меняться из-за локализации.

### 2.4. ViewActions {#viewactions}

Действия имитируют жесты пользователя: клик, ввод текста, прокрутка, свайп.

```kotlin
import androidx.test.espresso.action.ViewActions.*

onView(withId(R.id.emailInput)).perform(typeText("user@example.com"))
onView(withId(R.id.loginButton)).perform(click())
onView(withId(R.id.scrollView)).perform(scrollTo())
```

`typeText` вводит строку в поле ввода. `click()` выполняет клик. `closeSoftKeyboard()` закрывает клавиатуру — часто нужен после ввода, иначе следующий элемент может быть перекрыт.

### 2.5. ViewAssertions {#viewassertions}

Проверки подтверждают состояние View после действий.

```kotlin
import androidx.test.espresso.assertion.ViewAssertions.*

onView(withId(R.id.welcomeText)).check(matches(isDisplayed()))
onView(withId(R.id.errorText)).check(matches(withText("Неверный пароль")))
onView(withId(R.id.loginButton)).check(matches(isEnabled()))
```

`matches(matcher)` — основная проверка. `doesNotExist()` проверяет, что View отсутствует. Именно через assertions тест подтверждает ожидаемый результат.

### 2.6. Проверка отображения и взаимодействия {#otobrazhenie-vzaimodeystvie}

Полный сценарий: ввести данные, нажать кнопку, проверить результат.

```kotlin
@Test
fun loginShowsWelcome() {
    onView(withId(R.id.emailInput)).perform(typeText("user@example.com"), closeSoftKeyboard())
    onView(withId(R.id.passwordInput)).perform(typeText("secret"), closeSoftKeyboard())
    onView(withId(R.id.loginButton)).perform(click())

    onView(withId(R.id.welcomeText)).check(matches(isDisplayed()))
    onView(withId(R.id.welcomeText)).check(matches(withText("Добро пожаловать")))
}
```

Такой тест проверяет сквозной сценарий на экране. Он запускается на эмуляторе и зависит от разметки, поэтому при изменении id элементов тест придётся обновить.

### 2.7. Базовое тестирование RecyclerView {#recyclerview}

RecyclerView не имеет простого `onView` для элементов списка, потому что элементы создаются лениво. Используют `RecyclerViewActions` из `espresso-contrib`.

```kotlin
import androidx.test.espresso.contrib.RecyclerViewActions

onView(withId(R.id.recyclerView)).perform(
    RecyclerViewActions.actionOnItemAtPosition<MyAdapter.ViewHolder>(
        0, click()
    )
)

onView(withId(R.id.recyclerView)).check(
    matches(hasDescendant(withText("Kotlin")))
)
```

`actionOnItemAtPosition` выполняет действие на элементе с заданной позицией. `hasDescendant` проверяет, что среди потомков RecyclerView есть View с нужным текстом. Для больших списков предпочтительнее скроллить к элементу через `scrollToPosition` перед действием.

### 2.8. Idling Resources {#idling-resources}

Idling Resources сообщают Espresso, что приложение занято фоновой работой (сетевой запрос, анимация, таймер) и тест должен подождать. Без них Espresso может проверить результат до того, как данные загрузились, и тест упадёт ложно.

```kotlin
class SimpleIdlingResource : IdlingResource {
    private var callback: IdlingResource.ResourceCallback? = null
    @Volatile private var isIdle = true

    override fun getName() = "SimpleIdlingResource"
    override fun isIdleNow() = isIdle
    override fun registerIdleTransitionCallback(cb: IdlingResource.ResourceCallback) {
        callback = cb
    }

    fun setIdleState(isIdleNow: Boolean) {
        isIdle = isIdleNow
        if (isIdleNow) callback?.onTransitionToIdle()
    }
}
```

Idling resource регистрируют в тестовом коде (`androidTest`): сама реализация может жить в `debug` source set или приходить через DI, а в релизной сборке остаётся no-op. Регистрируют их через `IdlingRegistry`; готовые реализации вроде OkHttp IdlingResource подключают так же. В Compose Test вместо idling resources ждут нужное состояние через `waitUntil`.

### 2.9. Настройка проекта и запуск тестов {#nastroyka-espresso}

Espresso-тесты — инструментальные: они выполняются на эмуляторе или устройстве. Зависимости добавляют в `build.gradle.kts` модуля `app` в блоке `androidTest`.

```gradle
androidTestImplementation("androidx.test.ext:junit:1.2.1")
androidTestImplementation("androidx.test.espresso:espresso-core:3.6.1")
androidTestImplementation("androidx.test.espresso:espresso-contrib:3.6.1")
```

Тестовый класс помечают аннотацией `@RunWith(AndroidJUnit4::class)` (JUnit 4) или используют JUnit 5 с плагином. Перед тестом запускают Activity через `ActivityScenario` или правило `ActivityScenarioRule`.

```kotlin
import androidx.test.core.app.ActivityScenario
import androidx.test.ext.junit.rules.ActivityScenarioRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class LoginScreenTest {

    @get:Rule
    val rule = ActivityScenarioRule(LoginActivity::class.java)

    @Test
    fun loginShowsWelcome() {
        // ...
    }
}
```

`ActivityScenarioRule` запускает Activity перед каждым тестом и закрывает после. Это гарантирует чистое состояние экрана. Запуск: `./gradlew connectedAndroidTest` или через панель тестов в Android Studio.

Espresso автоматически синхронизируется с главным потоком UI: перед каждым действием он ждёт, пока очередь сообщений главного потока опустеет. Именно поэтому `Thread.sleep` в Espresso-тестах обычно не нужен — и его использование считается антипаттерном, так как замедляет тесты и не гарантирует корректность.

### 2.10. Флаки-тесты и стабильность {#flaky-tests}

Флаки-тесты — тесты, которые иногда проходят, а иногда падают без изменения кода. Главные причины в Espresso: асинхронные операции без Idling Resources, зависимость от анимаций (Espresso сам их не отключает — это делают флагом `testOptions.animationsDisabled` в Gradle или вручную на тестовом устройстве), нестабильные данные (например, список, зависящий от сервера).

Рекомендации: отключайте анимации на тестовом устройстве (Настройки разработчика → Window/Transition/Animator animation scale → Off), используйте фейковые данные вместо реальных, регистрируйте Idling Resources для всех асинхронных операций, избегайте жёстких ожиданий через `Thread.sleep`.

**Типичные ошибки:**
- Применение Espresso к Compose-экранам — тест не найдёт View.
- Слишком общие матчеры, приводящие к `AmbiguousViewMatcherException`.
- Забытый `closeSoftKeyboard()` — следующий `click` попадает в клавиатуру.
- Отсутствие Idling Resources при асинхронных операциях — флаки-тесты.
- Использование `Thread.sleep` вместо Idling Resources.

**Короткая самопроверка:**
- [ ] Понимаю, когда Espresso уместен, а когда нужен Compose UI Test.
- [ ] Умею найти View через `onView` и матчеры.
- [ ] Могу выполнить действие и проверку результата.
- [ ] Знаю, зачем нужны Idling Resources.
- [ ] Могу настроить и запустить инструментальный тест.

## 3. Test Doubles и MockK Basics {#test-doubles-i-mockk}

Тестируемый класс часто зависит от других компонентов: репозитория, API, базы данных, SharedPreferences. Чтобы проверить логику изолированно, зависимости подменяют тестовыми дублёрами (test doubles). Это позволяет контролировать входы и выходы зависимостей и не тащить в тест тяжёлую инфраструктуру.

### 3.1. Назначение Test Doubles {#naznachenie-test-doubles}

Test double — объект, который подменяет реальную зависимость в тесте. Цели: изоляция (тест не зависит от сети/БД), скорость (нет реальных вызовов), детерминированность (контролируемый результат), возможность проверить взаимодействие (был ли вызван метод и с какими аргументами).

Без дублёров unit-тест превращается в интеграционный: он будет падать из-за сети, требовать эмулятор и выполняться секунды. Дублёры возвращают логику в центр внимания.

### 3.2. Fake, Stub, Mock и Spy {#fake-stub-mock-spy}

- Fake — рабочая упрощённая реализация интерфейса. Например, `FakeUserRepository`, хранящий данные в `MutableList` вместо Room. Ведёт себя как реальный объект, но без внешних зависимостей.
- Stub — объект, возвращающий заранее заданные ответы. Не проверяет вызовы, просто отвечает.
- Mock — объект с ожиданиями: тест указывает, какие методы должны быть вызваны и с какими аргументами, и проверяет это.
- Spy — обёртка вокруг реального объекта, которая записывает вызовы, но выполняет реальную логику (или частично).

Границы размыты: MockK создаёт моки, которые могут вести себя как стабы (через `every`/`returns`). Важна идея: Fake даёт реальное поведение в упрощённом виде, Mock — проверяет взаимодействие.

### 3.3. Создание mock-объектов {#sozdanie-mock}

В MockK мок создаётся функцией `mockk<T>()`. Для интерфейсов и классов.

```kotlin
import io.mockk.mockk

interface UserRepository {
    suspend fun getUser(id: Int): User
}

val repo: UserRepository = mockk()
```

По умолчанию все методы мока бросают исключение, если не настроены через `every`. Это заставляет явно задавать поведение и предотвращает случайные вызовы.

Для spy: `spyk(realObject)`. Для релаксированных моков (возвращают дефолтные значения): `mockk(relaxed = true)` — удобно для объектов с множеством методов, где важны только некоторые.

### 3.4. every и returns {#every-returns}

`every { ... } returns ...` настраивает ответ мока на вызов.

```kotlin
import io.mockk.every
import io.mockk.coEvery

// suspend-функцию настраивают через coEvery
coEvery { repo.getUser(1) } returns User(1, "Alex")

// обычную (не suspend) функцию — через every
every { formValidator.isValid("user@example.com") } returns true
```

`coEvery` используется для suspend-функций. Можно задавать ответы в зависимости от аргументов: `coEvery { repo.getUser(any()) } returns User(0, "Unknown")`. `any()`, `eq(...)`, `match { ... }` — матчеры аргументов.

Можно настраивать последовательность ответов: `returnsMany(listOf(...))` или цепочка `returns ... andThen ...`.

### 3.5. verify {#verify}

`verify` проверяет, что метод был вызван (и с какими аргументами).

```kotlin
import io.mockk.verify
import io.mockk.coVerify

// suspend-функции проверяют через coVerify
coVerify { repo.getUser(1) }        // вызвана ровно раз
coVerify(exactly = 2) { repo.getUser(1) }
verify { repo wasNot Called }       // не вызывалась вообще

// обычные (не suspend) функции — через verify
verify { formValidator.isValid("user@example.com") }
```

`verify` помещают после действия, чтобы проверить взаимодействие. Это ключевая возможность моков: убедиться, что тестируемый код действительно обращается к зависимости с правильными параметрами.

### 3.6. Совместное использование MockK и JUnit {#mockk-junit}

MockK интегрируется с JUnit через аннотации. `@MockK` создаёт мок-поле, `@InjectMockKs` внедряет моки в тестируемый объект.

```kotlin
import io.mockk.MockKAnnotations
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class ProfileViewModelTest {

    @MockK
    lateinit var repo: UserRepository

    @InjectMockKs
    lateinit var viewModel: ProfileViewModel

    @BeforeEach
    fun setUp() {
        MockKAnnotations.init(this)
    }

    @Test
    fun `load calls repository`() = runTest {
        coEvery { repo.getUser(1) } returns User(1, "Alex")
        viewModel.load(1)
        coVerify { repo.getUser(1) }
    }
}
```

`MockKAnnotations.init(this)` инициализирует все `@MockK`-поля. Вызывать в `@BeforeEach`, чтобы каждый тест начинался с чистых моков.

### 3.7. Проверка взаимодействия с зависимостями {#vzaimodeystvie}

Моки позволяют проверить не только результат, но и то, как тестируемый код общается с зависимостями: сколько раз вызван метод, с какими аргументами, в каком порядке.

```kotlin
@Test
fun `save user calls repository once with correct data`() = runTest {
    val service = UserService(repo)
    service.register("Alex", 25)

    coVerify(exactly = 1) { repo.save(User(name = "Alex", age = 25)) }
}
```

Такие проверки полезны для use-case и ViewModel, где важно не дублировать запросы и передавать корректные данные. Но чрезмерная проверка взаимодействий делает тесты хрупкими: они ломаются при любом изменении внутренней реализации, даже если поведение сохранилось.

### 3.8. Когда предпочтительнее Fake вместо Mock {#fake-vs-mock}

Fake предпочтительнее Mock, когда:
- Зависимость имеет состояние (коллекция, кэш, база) и тест проверяет последовательность операций.
- Тестируется сложная логика с множеством вызовов зависимостей — моки превращаются в громоздкие настройки.
- Нужно использовать зависимость в нескольких тестах — Fake переиспользуется.

Mock предпочтительнее Fake, когда:
- Нужно проверить, что метод был вызван (или не вызван) — Fake не отслеживает вызовы без дополнительного кода.
- Зависимость внешняя и сложная (сетевой клиент) — Fake пришлось бы писать самому.
- Тест проверяет один сценарий — настройка мока короче.

Практическое правило: начинайте с Fake для репозиториев и хранилищ, используйте MockK для внешних сервисов и случаев, где важна проверка вызовов. Не смешивайте оба подхода в одном тесте без необходимости.

### 3.9. Матчеры аргументов и захват значений {#matchers-slot}

MockK предоставляет матчеры для гибкой настройки и проверки: `any()`, `eq(value)`, `match { predicate }`, `or`, `and`. Для захвата переданного значения используют `slot<T>()` и функцию `capture`.

```kotlin
import io.mockk.slot
import io.mockk.capture

@Test
fun `register passes user with correct age`() = runTest {
    val slot = slot<User>()
    coEvery { repo.save(capture(slot)) } returns Unit

    service.register("Alex", 25)

    assertEquals("Alex", slot.captured.name)
    assertEquals(25, slot.captured.age)
}
```

Захват полезен, когда важно проверить не точное равенство объекта, а отдельные поля или вычисленные значения. Вместо `slot` можно использовать `verify { repo.save(match { it.age >= 18 }) }` — проверка через предикат без захвата.

### 3.10. Порядок вызовов и множественные проверки {#verify-order}

MockK умеет проверять порядок вызовов через `verifyOrder` и `verifySequence`. Это важно, когда логика требует строгой последовательности: сначала валидация, потом сохранение, потом уведомление.

```kotlin
import io.mockk.verifyOrder

verifyOrder {
    repo.validate(any())
    repo.save(any())
    notifier.notify(any())
}
```

`verifyAll` проверяет, что вызваны все перечисленные методы (порядок не важен). Для проверки, что мок больше ничего не вызывал, используют `confirmVerified(mock)` — он падает, если были непроверенные вызовы.

### 3.11. Настройка проекта {#nastroyka-mockk}

Зависимость добавляют в `build.gradle.kts`:

```gradle
testImplementation("io.mockk:mockk:1.13.12")
testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.9.0")
```

Для инструментальных тестов (androidTest) используют `mockk-android`. MockK работает с JUnit 4 и JUnit 5; с JUnit 5 достаточно обычной зависимости `mockk`.

**Типичные ошибки:**
- Мокирование всего подряд, включая простые data-классы — тесты становятся нечитаемыми.
- Отсутствие `coEvery`/`coVerify` для suspend-функций — ошибка компиляции или ложный результат.
- Проверка внутренних вызовов вместо публичного поведения — хрупкие тесты.
- Использование `relaxed = true` везде — скрывает неожиданные вызовы и маскирует баги.
- Забытый `MockKAnnotations.init(this)` в `@BeforeEach` — поля остаются неинициализированными.

**Короткая самопроверка:**
- [ ] Могу объяснить разницу между Fake, Stub, Mock и Spy.
- [ ] Умею создать мок и настроить ответ через `every`/`returns`.
- [ ] Умею проверить вызов через `verify`.
- [ ] Знаю, когда выбрать Fake, а когда Mock.
- [ ] Могу захватить аргумент через `slot` и проверить его поля.

## Итоговая самопроверка категории {#itogovaya-samoproverka}

- [ ] Умею писать unit-тесты на JUnit с assertions и AAA-структурой.
- [ ] Могу тестировать suspend-функции через `runTest`.
- [ ] Умею писать тесты для ViewModel с тестовыми дублёрами.
- [ ] Понимаю, когда применять Espresso, а когда Compose UI Test.
- [ ] Могу написать Espresso-тест для View-экрана: поиск, действие, проверка.
- [ ] Умею создавать моки в MockK и настраивать их поведение.
- [ ] Знаю разницу между Fake, Stub, Mock и Spy и выбираю подходящий инструмент.

## Источники и документация {#istochniki-i-dokumentaciya}

### Официальная документация

- [Testing fundamentals](https://developer.android.com/training/testing/fundamentals)
- [Local unit tests](https://developer.android.com/training/testing/local-tests)
- [Instrumented tests](https://developer.android.com/training/testing/instrumented-tests)
- [Espresso](https://developer.android.com/training/testing/espresso)
- [Compose testing](https://developer.android.com/jetpack/compose/testing)
- [Coroutines testing](https://developer.android.com/kotlin/coroutines/test)
- [ViewModel testing](https://developer.android.com/codelabs/basic-android-kotlin-compose-test-viewmodel)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [MockK documentation](https://mockk.io/)

### Статьи

- [Android testing pyramid](https://developer.android.com/training/testing/fundamentals/strategies#testing-pyramid)
- [Idling resources](https://developer.android.com/training/testing/espresso/idling-resource)
- [RecyclerView testing with Espresso](https://developer.android.com/training/testing/espresso/lists)
- [Test doubles](https://developer.android.com/training/testing/fundamentals/test-doubles)
