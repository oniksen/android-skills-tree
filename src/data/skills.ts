import { categories } from "./categories";

export interface Skill {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  subtopics: string[];
  maxWeight: number;
  sortOrder: number;
  requiredForLevelUp: boolean;
}

export const skills: Skill[] = [
  // ============================
  // Junior: Основы программирования
  // ============================
  {
    id: "junior-osnovy-perem", categoryId: "junior-osnovy", name: "Переменные",
    description: "Хранение данных в переменных. Типы переменных (val, var), область видимости и правила именования.",
    subtopics: ["val vs var", "Типы переменных", "Инициализация", "Константы"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "junior-osnovy-tipy", categoryId: "junior-osnovy", name: "Типы данных",
    description: "Примитивные и ссылочные типы данных в Kotlin. Number, String, Boolean, Array, nullable-типы.",
    subtopics: ["Number (Int, Double, Float)", "String", "Boolean", "Array", "Null safety basics", "Type inference"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "junior-osnovy-uslov", categoryId: "junior-osnovy", name: "Условные конструкции",
    description: "Управление потоком выполнения через if/else, when и тернарные выражения.",
    subtopics: ["if/else", "when (expression)", "when с произвольными аргументами", "Вложенность условий"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "junior-osnovy-cikly", categoryId: "junior-osnovy", name: "Циклы",
    description: "Повторяющиеся конструкции: for, while, do-while. Работа с диапазонами и коллекциями.",
    subtopics: ["for (until, downTo, step)", "while", "do-while", "break/continue", "Вложенные циклы"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "junior-osnovy-funkc", categoryId: "junior-osnovy", name: "Функции",
    description: "Объявление и вызов функций. Параметры, возвращаемые значения, параметры по умолчанию, именованные аргументы.",
    subtopics: ["Объявление функции", "Параметры и аргументы", "Параметры по умолчанию", "Именованные аргументы", "Unit и expression body", "Single-expression functions"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },
  {
    id: "junior-osnovy-oop", categoryId: "junior-osnovy", name: "ООП основы",
    description: "Классы, объекты, наследование, интерфейсы и инкапсуляция. Основы объектно-ориентированного программирования.",
    subtopics: ["Классы и объекты", "Конструкторы", "Наследование", "Интерфейсы", "Инкапсуляция (private, protected)", "Абстрактные классы"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: false,
  },
  {
    id: "junior-osnovy-coll", categoryId: "junior-osnovy", name: "Коллекции",
    description: "Структуры данных: List, Set, Map. Неизменяемые (immutable) и изменяемые (mutable) коллекции, основные операции.",
    subtopics: ["List / MutableList", "Set / MutableSet", "Map / MutableMap", "Итерирование", "Основные операции (filter, map, find)", "Spread operator"],
    maxWeight: 5, sortOrder: 7, requiredForLevelUp: false,
  },
  {
    id: "junior-osnovy-oshibki", categoryId: "junior-osnovy", name: "Обработка ошибок",
    description: "Механизмы обработки исключений: try/catch/finally, опциональные значения (nullable) как способ избежания ошибок.",
    subtopics: ["try/catch/finally", "Типы исключений", "Работа с null (?., ?:, !!)", "runCatching", "Паттерн «Success/Failure»"],
    maxWeight: 5, sortOrder: 8, requiredForLevelUp: false,
  },

  // ============================
  // Junior: Kotlin Basics
  // ============================
  {
    id: "junior-kotlin-sintaks", categoryId: "junior-kotlin", name: "Синтаксис Kotlin",
    description: "Базовый синтаксис языка Kotlin. Строки, шаблоны,�ри строки, комментарии, пакеты и импорты.",
    subtopics: ["Строки и шаблонные строки", "Комментарии", "Пакеты и импорты", "Точка с запятой", "when vs if", "Функции расширения (базово)"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: true,
  },
  {
    id: "junior-kotlin-null", categoryId: "junior-kotlin", name: "Null Safety",
    description: "Система безопасной работы с null-значениями. Операторы ?, ?:, !!, safe casts и let.",
    subtopics: ["Nullable типы (? operator)", "Elvis operator (?:)", "Not-null assertion (!!)", "Safe casts (as?)", "let, also для null-check", "Платформенные типы"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: true,
  },
  {
    id: "junior-kotlin-data", categoryId: "junior-kotlin", name: "Data Class",
    description: "Классы данных с автоматической генерацией equals(), hashCode(), toString(), copy() и компонентными функциями.",
    subtopics: ["Синтаксис data class", "copy() функция", "Деструктуризация (componentN)", "Равенство (equals)", "hashCode и toString", "Ограничения (val параметры)"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: true,
  },
  {
    id: "junior-kotlin-ext", categoryId: "junior-kotlin", name: "Extension Functions",
    description: "Расширение функциональности существующих классов без наследования. Определяются как обычные функции с接收ателем.",
    subtopics: ["Синтаксис extension функций", "Extension properties", "nullable接收атели", "Конвенции вызова", "Внутренние extension функции"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "junior-kotlin-lambda", categoryId: "junior-kotlin", name: "Lambda",
    description: "Анонимные функции (лямбды). Синтаксис, замыкания, короткие замыкания (it), возврат значений.",
    subtopics: ["Синтаксис лямбд", "it (короткое замыкание)", "Последняя лямбда (trailing lambda)", "Замыкания (closures)", "Лямбды с возвратом", "Тип лямбды (Function1, Function2)"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },
  {
    id: "junior-kotlin-hof", categoryId: "junior-kotlin", name: "Higher Order Functions",
    description: "Функции, принимающие или возвращающие другие функции. Основы функционального программирования в Kotlin.",
    subtopics: ["Функция как параметр", "Функция как возврат", "inline функции", "Функции типа (Function)", "Передача функций"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: false,
  },
  {
    id: "junior-kotlin-scope", categoryId: "junior-kotlin", name: "Scope Functions",
    description: "Функции области видимости: let, run, with, apply, also. Краткая запись типичных операций с объектами.",
    subtopics: ["let", "run", "apply", "also", "with", "Когда использовать каждую", "Различия возвращаемых значений"],
    maxWeight: 5, sortOrder: 7, requiredForLevelUp: false,
  },
  {
    id: "junior-kotlin-enum", categoryId: "junior-kotlin", name: "Enum",
    description: "Перечисления (enum classes). Свойства, методы, реализация интерфейсов в enum.",
    subtopics: ["Базовый синтаксис", "Свойства enum", "Методы enum", "Реализация интерфейсов", "ordinal и name", "Перечисления с параметрами"],
    maxWeight: 5, sortOrder: 8, requiredForLevelUp: false,
  },
  {
    id: "junior-kotlin-sealed", categoryId: "junior-kotlin", name: "Sealed Class",
    description: "Запечатанные классы для ограничения иерархии наследования. Полезны для representing ограниченных наборов состояний.",
    subtopics: ["Синтаксис sealed class", "sealed interface", "when exhaustive", "Сравнение с enum", "Паттерн «ограниченные подтипы»"],
    maxWeight: 5, sortOrder: 9, requiredForLevelUp: false,
  },
  {
    id: "junior-kotlin-packages", categoryId: "junior-kotlin", name: "Packages",
    description: "Организация кода в пакеты. Импорт, видимость по умолчанию (public), internal модификатор.",
    subtopics: ["Объявление пакета", "Импорт (import)", "Пакетные функции", "Видимость (public, internal)", "Алиасы импорта"],
    maxWeight: 5, sortOrder: 10, requiredForLevelUp: false,
  },

  // ============================
  // Junior: Android Basics
  // ============================
  {
    id: "junior-android-studio", categoryId: "junior-android", name: "Android Studio",
    description: "Основы работы с Android Studio. Настройка среды, запуск эмулятора, отладка приложений.",
    subtopics: ["Установка и настройка", "Создание проекта", "Запуск на эмуляторе", "Logcat и отладка", "Layout Inspector", "Структура проекта в IDE"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: true,
  },
  {
    id: "junior-android-project", categoryId: "junior-android", name: "Проект и модули",
    description: "Структура Android-проекта: модули, src-директории, ресурсы, манифест, build-файлы.",
    subtopics: ["Структура директорий", "Модули (app, library)", "src/main, src/test", "Ресурсы (res)", "Build configuration", "Сборка APK/AAB"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: true,
  },
  {
    id: "junior-android-gradle", categoryId: "junior-android", name: "Gradle",
    description: "Система сборки Gradle. build.gradle, зависимости, плагины, product flavors и build types.",
    subtopics: ["build.gradle (project vs module)", "Зависимости (implementation, api)", "Плагины Android", "Product Flavors", "Build Types (debug/release)", "Gradle tasks"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: true,
  },
  {
    id: "junior-android-manifest", categoryId: "junior-android", name: "AndroidManifest",
    description: "Манифест приложения: компоненты, разрешения, интент-фильтры, минимальная и целевая версии SDK.",
    subtopics: ["Структура манифеста", "Регистрация Activity", "Разрешения (uses-permission)", "Интент-фильтры", "minSdkVersion / targetSdkVersion", "App-level vs System-level"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: true,
  },
  {
    id: "junior-android-resources", categoryId: "junior-android", name: "Resources",
    description: "Ресурсы приложения: строки, цвета, размеры, изображения, drawable, layouts и многоязычность.",
    subtopics: ["strings.xml", "colors.xml и themes", "dimens.xml", "Drawables и mipmap", "Ресурсы для разных конфигураций (layout-land)", "Многоязычность (strings.xml)"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: true,
  },
  {
    id: "junior-android-layouts", categoryId: "junior-android", name: "Layouts XML",
    description: "Создание пользовательского интерфейса с помощью XML-layouts. Типы layout-контейнеров и их особенности.",
    subtopics: ["XML разметка", "FrameLayout", "LinearLayout", "ConstraintLayout", "RelativeLayout", "ViewGroup vs View"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: true,
  },
  {
    id: "junior-android-view", categoryId: "junior-android", name: "View/ViewGroup",
    description: "Базовые компоненты UI: View и ViewGroup. Кастомизация через XML-атрибуты и программно.",
    subtopics: ["View hierarchy", "XML атрибуты (layout_width, height)", "Programmatic view creation", "View ID и findViewById", "View visibility", "Padding vs Margin"],
    maxWeight: 5, sortOrder: 7, requiredForLevelUp: false,
  },
  {
    id: "junior-android-lifecycle", categoryId: "junior-android", name: "Activity Lifecycle",
    description: "Жизненный цикл Activity: onCreate, onStart, onResume, onPause, onStop, onDestroy. Управление состоянием.",
    subtopics: ["onCreate → onStart → onResume", "onPause → onStop → onDestroy", "onSaveInstanceState", "onRestoreInstanceState", "Перезапуск при повороте", "Process Death"],
    maxWeight: 5, sortOrder: 8, requiredForLevelUp: true,
  },
  {
    id: "junior-android-intent", categoryId: "junior-android", name: "Intent",
    description: "Межкомпонентное взаимодействие через Intent: явные и неявные интенты, передача данных между Activity.",
    subtopics: ["Явные интенты (explicit)", "Неявные интенты (implicit)", "putExtra / getExtra", "Bundle для передачи данных", "startActivityForResult", "PendingIntent"],
    maxWeight: 5, sortOrder: 9, requiredForLevelUp: false,
  },
  {
    id: "junior-android-toast", categoryId: "junior-android", name: "Toast/Dialog/Snackbar",
    description: "Вспомогательные UI-компоненты: всплывающие уведомления, диалоги и снэкбары с действиями.",
    subtopics: ["Toast.makeText", "AlertDialog", "DialogFragment", "Snackbar", "Custom Dialog", "Material Dialog"],
    maxWeight: 5, sortOrder: 10, requiredForLevelUp: false,
  },

  // ============================
  // Junior: UI Basics (XML)
  // ============================
  {
    id: "junior-ui-textview", categoryId: "junior-ui", name: "TextView",
    description: "Отображение текста. Кастомизация шрифтов, цветов, размеров, выравнивания и обработки длинного текста.",
    subtopics: ["Текст и атрибуты", "Шрифты и textStyle", "Цвета и фон", "Автоподбор размера (autoSize)", "Clickable links (autoLink)", "Многострочный текст"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: true,
  },
  {
    id: "junior-ui-button", categoryId: "junior-ui", name: "Button",
    description: "Кнопки: Button, ImageButton, MaterialButton. Обработка нажатий, стилизация, состояния (enabled/disabled).",
    subtopics: ["Button", "ImageButton", "setOnClickListener", "Enabled/disabled state", "MaterialButton", "Кастомный фон кнопки"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: true,
  },
  {
    id: "junior-ui-imageview", categoryId: "junior-ui", name: "ImageView",
    description: "Отображение изображений. Загрузка из ресурсов, scaleType, программное изменение.",
    subtopics: ["src (XML)", "scaleType (centerCrop, fitCenter)", "Загрузка из drawable", "Content description", "Programmatic image loading", "Shape Drawable"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: true,
  },
  {
    id: "junior-ui-edittext", categoryId: "junior-ui", name: "EditText",
    description: "Поля ввода текста. Типы ввода, валидация, слушатели изменений, автозаполнение.",
    subtopics: ["Типы ввода (text, number, email)", "inputType атрибуты", "TextWatcher / addTextChangedListener", "Валидация", "imeOptions (actionDone, actionSearch)", "Text Input Layout (Material)"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: true,
  },
  {
    id: "junior-ui-linear", categoryId: "junior-ui", name: "LinearLayout",
    description: "Линейное расположение элементов горизонтально или вертикально. Вес (weight), отступы, выравнивание.",
    subtopics: ["orientation (horizontal/vertical)", "layout_weight", "gravity vs layout_gravity", "Отступы (margin, padding)", "Baseline alignment", "Вложенность"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: true,
  },
  {
    id: "junior-ui-constraint", categoryId: "junior-ui", name: "ConstraintLayout",
    description: "Гибкая разметка с ограничениями (constraints). Guidelines, chains, barriers для сложных UI-макетов.",
    subtopics: ["Базовые constraints", "Guidelines (horizontal, vertical)", "Chains (spread, packed)", "Barriers", "Позиционирование (constraintLeft_toRightOf)", "Bias"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: true,
  },

  // ============================
  // Junior: Data & Storage Basics
  // ============================
  {
    id: "junior-data-shared", categoryId: "junior-data", name: "SharedPreferences",
    description: "Простое хранилище ключ-значение для настроек и маленьких данных. Синхронный и асинхронный доступ.",
    subtopics: ["getSharedPreferences / PreferenceManager", "edit() и commit() vs apply()", "Типы данных (String, Int, Boolean)", "Работа из разных потоков", "PreferenceScreen XML", "DataStore как замена"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: true,
  },
  {
    id: "junior-data-files", categoryId: "junior-data", name: "Files",
    description: "Работа с файловой системой Android. Internal и external storage, контекст для доступа к файлам.",
    subtopics: ["Internal storage", "External storage ( Scoped Storage)", "context.filesDir", "openFileInput / openFileOutput", "FileInputStream / FileOutputStream", "Кэширование (cacheDir)"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "junior-data-sqlite", categoryId: "junior-data", name: "SQLite",
    description: "Работа с SQLite напрямую через SQLiteOpenHelper. SQL-запросы, миграции, Cursors.",
    subtopics: ["SQLiteOpenHelper", "onCreate / onUpgrade", "SQL-запросы (INSERT, SELECT, UPDATE, DELETE)", "Cursors", "Raw query", "Транзакции"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "junior-data-room", categoryId: "junior-data", name: "Room Basics",
    description: "Абстракция над SQLite от Google. Аннотации @Entity, @Dao, @Database. Типобезопасные запросы.",
    subtopics: ["@Entity аннотация", "Ключи (@PrimaryKey)", "DAO (@Dao)", "Запросы (@Query)", "Вставка (@Insert)", "@Database и миграции"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "junior-data-json", categoryId: "junior-data", name: "JSON",
    description: "Парсинг JSON-данных. Сериализация и десериализация объектов, работа с JSONArray и JSONObject.",
    subtopics: ["JSONObject", "JSONArray", "Ручной парсинг", "Gson basics", "Десериализация в модели", "Обработка ошибок парсинга"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },
  {
    id: "junior-data-retrofit", categoryId: "junior-data", name: "Retrofit GET",
    description: "Базовый запрос данных через Retrofit. Интерфейс API, аннотации @GET, @Query, @Path. Асинхронные вызовы.",
    subtopics: ["Retrofit builder", "Интерфейс API (@GET)", "@Query параметры", "@Path параметры", "Call<T> и enqueue", "Базовый URL"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: false,
  },

  // ============================
  // Junior: Асинхронность
  // ============================
  {
    id: "junior-async-thread", categoryId: "junior-async", name: "Thread",
    description: "Основы потоков выполнения в Java/Kotlin. Создание потоков, runnable, жизненный цикл потока.",
    subtopics: ["Создание Thread", "Runnable", "Запуск и остановка", "isAlive, join()", "Приоритеты", "Daemon threads"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "junior-async-handler", categoryId: "junior-async", name: "Handler",
    description: "Обработка сообщений между потоками. Handler, Looper, MessageQueue для связи UI и фоновых потоков.",
    subtopics: ["Handler.post()", "Handler с Looper", "Message и Bundle", "postDelayed", "removeCallbacks", " main thread handler"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "junior-async-looper", categoryId: "junior-async", name: "Looper",
    description: "Механизм цикла обработки сообщений в потоке. Looper, MessageQueue, цикл обработки событий.",
    subtopics: ["Looper.myLooper()", "Looper.prepare()", "Looper.loop()", "MessageQueue", "Работа main Looper", "Custom Looper thread"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "junior-async-coroutines", categoryId: "junior-async", name: "Coroutines Basics",
    description: "Легковесные фоновые задачи в Kotlin. launch, async, runBlocking, scope и отмена корутин.",
    subtopics: ["launch", "async / await", "runBlocking", "CoroutineScope", "Отмена (cancel)", "join()"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "junior-async-dispatchers", categoryId: "junior-async", name: "Dispatchers",
    description: "Диспетчеры корутин: Main (UI), IO (сеть/диск), Default (CPU-bound). Выбор правильного диспетчера.",
    subtopics: ["Dispatchers.Main", "Dispatchers.IO", "Dispatchers.Default", "withContext", "Dispatchers.Unconfined", "Принцип выбора диспетчера"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },
  {
    id: "junior-async-suspend", categoryId: "junior-async", name: "Suspend Functions",
    description: "Приостанавливаемые функции, которые можно вызывать из корутин. Не блокируют поток при ожидании.",
    subtopics: ["Ключевое слово suspend", "Приостановка vs блокировка", "Нельзя вызывать из обычных функций", "Сохранение контекста", "Прерывание (cancellation)"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: false,
  },

  // ============================
  // Junior: Архитектура
  // ============================
  {
    id: "junior-arch-mvc", categoryId: "junior-arch", name: "MVC",
    description: "Паттерн Model-View-Controller. Разделение ответственности: данные, UI и логика в разных компонентах.",
    subtopics: ["Model (данные)", "View (UI)", "Controller (логика)", "Связь компонентов", "Проблемы (Massive Activity)", "Сравнение с MVP/MVVM"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "junior-arch-mvp", categoryId: "junior-arch", name: "MVP",
    description: "Паттерн Model-View-Presenter. Presenter берёт логику из Activity, View становится пассивной.",
    subtopics: ["Model", "View (интерфейс)", "Presenter", "Contract", "Тестируемость", "Lifecycle awareness"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "junior-arch-mvvm", categoryId: "junior-arch", name: "MVVM",
    description: "Model-View-ViewModel. Двусторонняя привязка данных, LiveData/StateFlow для реактивного обновления UI.",
    subtopics: ["Model", "View (Activity/Fragment)", "ViewModel", "LiveData / StateFlow", "Data Binding (опционально)", "Разделение ответственности"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "junior-arch-livedata", categoryId: "junior-arch", name: "LiveData",
    description: "Наблюдаемый контейнер данных от Google. Автоматически уведомляет UI об изменениях, учитываетLifecycle.",
    subtopics: ["MutableLiveData / LiveData", "observe()", "setValue / postValue", "Transformations (map, switchMap)", "MediatorLiveData", "Lifecycle-awareness"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "junior-arch-viewmodel", categoryId: "junior-arch", name: "ViewModel",
    description: "Хранит данные, связанные с UI, переживает пересоздание Activity/Fragment. Живёт до уничтожения экрана.",
    subtopics: ["Создание ViewModel", "AndroidViewModel", "Переживание Process Death", "Фабрики ViewModel", "ViewModelScope", "SharedViewModel между фрагментами"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },
  {
    id: "junior-arch-repository", categoryId: "junior-arch", name: "Repository",
    description: "Паттерн-посредник между источниками данных (сеть, БД). Единая точка доступа к данным для ViewModel.",
    subtopics: ["Единый источник правды", "Работа с сетью", "Работа с БД", "Кэширование", "Offline-first подход", "Интерфейсы репозиториев"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: false,
  },
  {
    id: "junior-arch-udf", categoryId: "junior-arch", name: "Односторонний поток данных",
    description: "UDF (Unidirectional Data Flow): состояние спускается вниз, события поднимаются вверх. Предсказуемость UI.",
    subtopics: ["State вниз", "Events вверх", "Single source of truth", "Immutability", "Сравнение с потоком данных в обе стороны", "Паттерн Redux/MVI"],
    maxWeight: 5, sortOrder: 7, requiredForLevelUp: false,
  },

  // ============================
  // Junior: Навигация и компоненты
  // ============================
  {
    id: "junior-nav-fragment", categoryId: "junior-nav", name: "Fragment",
    description: "Переиспользуемые части UI с собственным жизненным циклом. Встраивание в Activity, передача аргументов.",
    subtopics: ["Создание Fragment", "Fragment lifecycle", "FragmentManager / FragmentTransaction", "add / replace / remove", "Аргументы (arguments)", "attach / detach"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "junior-nav-navigation", categoryId: "junior-nav", name: "Navigation Component",
    description: "Официальная библиотека навигации от Google. Граф навигации, NavController, Safe Args.",
    subtopics: ["Navigation Graph XML", "NavController", "NavHostFragment", "Safe Args", "Deep Links", "Bottom Navigation"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "junior-nav-service", categoryId: "junior-nav", name: "Service",
    description: "Фоновый компонент для длительных операций. Started и Bound Service, Foreground Service.",
    subtopics: ["Started Service", "Bound Service", "Foreground Service", "IntentService", "WorkManager vs Service", "Остановка Service"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "junior-nav-broadcast", categoryId: "junior-nav", name: "BroadcastReceiver",
    description: "Приём системных и пользовательских широковещательных сообщений. Регистрация в Manifest и динамически.",
    subtopics: ["Манифест-регистрация", "Динамическая регистрация", "Системные BroadcastReceiver", "Пользовательские Intent-ы", "LocalBroadcastManager", "Ограничения (API 26+)"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },

  // ============================
  // Junior: Тестирование
  // ============================
  {
    id: "junior-test-junit", categoryId: "junior-test", name: "JUnit",
    description: "Фреймворк модульного тестирования. Аннотации @Test, @Before, @After, @Mock, проверки (assertions).",
    subtopics: ["@Test аннотация", "@Before / @After", "@BeforeClass / @AfterClass", "Assertions (assertEquals, assertTrue)", "Ожидаемые исключения (@Test(expected))", "Параметризованные тесты"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "junior-test-espresso", categoryId: "junior-test", name: "Espresso",
    description: "UI-тестирование Android-приложений. Проверка отображения элементов, взаимодействие, ViewMatchers.",
    subtopics: ["onView()", "ViewMatchers (withId, withText)", "ViewActions (click, typeText)", "ViewAssertions (matches, doesNotExist)", "Idling Resources", "RecyclerView actions"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "junior-test-mockk", categoryId: "junior-test", name: "MockK Basics",
    description: "Мокинг объектов в Kotlin-тестах. Создание моков, настройка поведения, проверки вызовов.",
    subtopics: ["mockk<T>()", "every / returns", "verify", "Slot и capture", "Совместное использование с JUnit", "Разница между mock и spy"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },

  // ============================
  // Junior: Инструменты
  // ============================
  {
    id: "junior-tools-git", categoryId: "junior-tools", name: "Git",
    description: "Система контроля версий. Основные команды, ветвление, слияние, разрешение конфликтов.",
    subtopics: ["git add / commit / push", "git branch / checkout", "git merge", "git pull / fetch", "Разрешение конфликтов", ".gitignore"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: true,
  },
  {
    id: "junior-tools-logcat", categoryId: "junior-tools", name: "Logcat",
    description: "Просмотр логов приложения. Фильтрация по тегам, уровням, поиск ошибок и отладка.",
    subtopics: ["Log.d / Log.e / Log.w / Log.i", "Фильтрация по тегу", "Поиск по ключевым словам", "Логирование исключений", "Пользовательские теги", "Экспорт логов"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: true,
  },
  {
    id: "junior-tools-build", categoryId: "junior-tools", name: "Build Variants",
    description: "Конфигурации сборки: debug/release, product flavors, custom build types для разных окружений.",
    subtopics: ["Build Types (debug, release)", "Product Flavors", "Build Variants", "Signing Configs", "BuildConfig", "ProGuard / R8 (включение)"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },

  // ============================
  // Middle: Kotlin
  // ============================
  {
    id: "middle-kotlin-generics", categoryId: "middle-kotlin", name: "Generics",
    description: "Обобщённое программирование. Параметры типов, ограничения (where), инвариантность и ковариантность.",
    subtopics: ["Параметры типов <T>", "Ограничения (where T : Comparable)", "Инвариантность (List)", "Ковариантность (out)", "Контравариантность (in)", "Reified generics (базово)"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "middle-kotlin-collections", categoryId: "middle-kotlin", name: "Collections Deep Dive",
    description: "Продвинутая работа с коллекциями. Функциональные операции (map, filter, flatMap), sequence, группировка.",
    subtopics: ["map, filter, find, first", "flatMap", "groupBy, partition", "fold, reduce", "Sequence (ленивые вычисления)", "Пользовательские операции"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "middle-kotlin-delegation", categoryId: "middle-kotlin", name: "Delegation",
    description: "Делегирование свойств и классов. by-оператор, ленивое делегирование, собственные делегаты.",
    subtopics: ["Делегирование свойств (by)", "lazy", "observable / vetoable", " map delegation", "Делегирование классов (by)", "Пользовательские делегаты"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "middle-kotlin-inline", categoryId: "middle-kotlin", name: "Inline",
    description: "Inline функции для избежания накладных расходов на лямбды. crossinline, noinline, инлайнинг параметров.",
    subtopics: ["inline функция", "noinline параметры", "crossinline", "Накладные расходы лямбд", "Когда использовать inline", "Reified в inline контексте"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "middle-kotlin-reified", categoryId: "middle-kotlin", name: "Reified",
    description: "Сохранение информации о типе в inline-функциях. Доступ к типу T в рантайме без передачи Class<T>.",
    subtopics: ["reified в inline функциях", "::class в рантайме", "Проверка типа (is T)", "Приведение типа (as T)", "Получение Class<T>", "Ограничения reified"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },
  {
    id: "middle-kotlin-dsl", categoryId: "middle-kotlin", name: "DSL Basics",
    description: "Построение типобезопасных DSL (Domain Specific Languages) с помощью лямбд с接收ателем и @DslMarker.",
    subtopics: ["Лямбды с接收ателем", "Типобезопасные конструкторы", "@DslMarker аннотация", "Построение XML/JSON", "Builder-паттерн на Kotlin", "Примеры (Kotlin HTML, DSL)"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: false,
  },
  {
    id: "middle-kotlin-contracts", categoryId: "middle-kotlin", name: "Contracts Basics",
    description: "Контракты для помощи компилятору в.smart-cast и инференции типов. Определение поведения функций.",
    subtopics: ["contract { ... }", "Последствия (returns)", "implies", "Smart cast помощь", "Ограничения контрактов", "Практическое применение"],
    maxWeight: 5, sortOrder: 7, requiredForLevelUp: false,
  },

  // ============================
  // Middle: Coroutines & Flow
  // ============================
  {
    id: "middle-coroutines-scope", categoryId: "middle-coroutines", name: "CoroutineScope",
    description: "Управление жизненным циклом корутин. Привязка scope к компонентам, создание и отмена.",
    subtopics: ["Создание CoroutineScope", "coroutineScope vs supervisorScope", "Привязка к жизненному циклу", "Отмена scope", "Обработка ошибок в scope", "GlobalScope (и почему стоит избегать)"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: true,
  },
  {
    id: "middle-coroutines-structured", categoryId: "middle-coroutines", name: "Structured Concurrency",
    description: "Структурированный подход к корутинам: дочерние корутины наследуют scope и автоматически отменяются.",
    subtopics: ["Иерархия корутин", "Наследование scope", "Автоматическая отмена", "Exception propagation", "supervisorScope vs coroutineScope", "Практические паттерны"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: true,
  },
  {
    id: "middle-coroutines-supervisor", categoryId: "middle-coroutines", name: "SupervisorJob",
    description: "Разделение обработки ошибок между дочерними корутинами. Одна упавшая корутина не ломает остальные.",
    subtopics: ["SupervisorJob()", "SupervisorCoroutineScope", "Отличие от Job", "Когда использовать", "Обработка ошибок в дочерних корутинах", "supervisorScope функция"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "middle-coroutines-exception", categoryId: "middle-coroutines", name: "Exception Handling",
    description: "Обработка исключений в корутинах: try/catch, CoroutineExceptionHandler, необработанные исключения.",
    subtopics: ["try/catch в корутинах", "CoroutineExceptionHandler", "Необработанные исключения", "launch vs async (обработка)", "Exception propagation", "Паттерн safe API calls"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: true,
  },
  {
    id: "middle-coroutines-flow", categoryId: "middle-coroutines", name: "Flow",
    description: "Потоки данных (reactive streams). Ленивые асинхронные последовательности значений с поддержкой отмены.",
    subtopics: ["flow { ... }", "Операторы (map, filter, combine)", "collect", "Flow-specific операторы (debounce, distinctUntilChanged)", "Buffer", "flowOn"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: true,
  },
  {
    id: "middle-coroutines-stateflow", categoryId: "middle-coroutines", name: "StateFlow",
    description: "Поток с начальным значением, всегда хранящий последний элемент. Замена LiveData в ViewModel.",
    subtopics: ["MutableStateFlow / StateFlow", "value свойство", "collectAsState()", "distinctUntilChanged", "update {} (thread-safe)", "Интеграция с Compose"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: true,
  },
  {
    id: "middle-coroutines-sharedflow", categoryId: "middle-coroutines", name: "SharedFlow",
    description: "Распределённый поток без начального значения. Идеален для событий (одноразовых),uição UI-событий.",
    subtopics: ["MutableSharedFlow / SharedFlow", "replay cache", "Операторы SharedFlow", "Сравнение с StateFlow", "Единый обработчик событий (SingleLiveEvent)", "Потери событий и как избежать"],
    maxWeight: 5, sortOrder: 7, requiredForLevelUp: false,
  },
  {
    id: "middle-coroutines-channels", categoryId: "middle-coroutines", name: "Channels",
    description: "Каналы для передачи данных между корутинами. Producer-consumer паттерн, разные стратегии буферизации.",
    subtopics: ["Channel<T>", "BufferedChannel", "RendezvousChannel", "ConflatedChannel", "receive / tryReceive", "Когда использовать каналы vs Flow"],
    maxWeight: 5, sortOrder: 8, requiredForLevelUp: false,
  },
  {
    id: "middle-coroutines-repeat", categoryId: "middle-coroutines", name: "repeatOnLifecycle",
    description: "Запуск потока, повторяющегося при входе в определённое состояние Lifecycle. Паттерн для UI-обновлений.",
    subtopics: ["repeatOnLifecycle(STARTED)", "Повторный запуск при возобновлении", "Остановка при уходе с экрана", "Сравнение с collectAsStateWithLifecycle", "Lifecycle-aware Flow collection", "Миграция с LiveData"],
    maxWeight: 5, sortOrder: 9, requiredForLevelUp: false,
  },

  // ============================
  // Middle: Android Components
  // ============================
  {
    id: "middle-components-lifecycle", categoryId: "middle-components", name: "Lifecycle",
    description: "Понимание жизненного цикла Android-компонентов. LifecycleObserver, ProcessLifecycleOwner, события жизненного цикла.",
    subtopics: ["Lifecycle и состояния", "LifecycleObserver", "DefaultLifecycleObserver", "ProcessLifecycleOwner", "Lifecycle-aware components", "События жизненного цикла"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "middle-components-fragment", categoryId: "middle-components", name: "Fragment Lifecycle",
    description: "Жизненный цикл Fragment: от onAttach до onDestroy. Навигация, результаты и обработка состояния.",
    subtopics: ["Fragment lifecycle", "setFragmentResult / setFragmentResultListener", "Navigation с Fragment", "Fragment Result API", "Child Fragment Manager", "View Binding в Fragment"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "middle-components-death", categoryId: "middle-components", name: "Process Death",
    description: "Восстановление состояния после уничтожения процесса. onSaveInstanceState, ViewModelSavedStateHandle.",
    subtopics: ["Когда происходит Process Death", "onSaveInstanceState", "SavedStateHandle", "Restoring UI state", "Потеря данных в ViewModel", "Тестирование Process Death"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "middle-components-services", categoryId: "middle-components", name: "Services",
    description: "Фоновые сервисы: Foreground Service, Bound Service, WorkManager. Правила и ограничения Android 12+.",
    subtopics: ["Foreground Service", "Bound Service", "Service lifecycle", "WorkManager vs Service", "Ограничения Android 12+", "Notification для Foreground Service"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "middle-components-broadcast", categoryId: "middle-components", name: "BroadcastReceiver",
    description: "Приём событий: системные (BOOT_COMPLETED) и пользовательские. Динамическая регистрация и ограничения.",
    subtopics: ["Регистрация в Manifest", "Динамическая регистрация", "LocalBroadcastManager", "Системные события", "Экспортные и неэкспортные", "Ограничения API 26+"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },
  {
    id: "middle-components-provider", categoryId: "middle-components", name: "ContentProvider",
    description: "Предоставление данных другим приложениям. URI, Cursors, authority, безопасность через permissions.",
    subtopics: ["ContentProvider", "URI и authority", "query / insert / update / delete", "Cursors", "ContentResolver", "Разрешения и безопасность"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: false,
  },

  // ============================
  // Middle: UI (Views + Compose)
  // ============================
  {
    id: "middle-ui-measure", categoryId: "middle-ui", name: "Measure/Layout/Draw",
    description: "Три фазы отрисовки View: измерение, размещение, рисование. Кастомные View и производительность.",
    subtopics: ["onMeasure", "onLayout", "onDraw", "MeasureSpec", "Проведение (invalidate / requestLayout)", "Оптимизация отрисовки"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "middle-ui-recyclerview", categoryId: "middle-ui", name: "RecyclerView Deep Dive",
    description: "Продвинутая работа с RecyclerView. ViewHolder, DiffUtil, кастомные LayoutManager, анимации.",
    subtopics: ["ViewHolder и Adapter", "DiffUtil", "LinearLayoutManager", "GridLayoutManager", "StaggeredGridLayoutManager", "ItemDecoration", "ItemAnimator"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "middle-ui-animations", categoryId: "middle-ui", name: "Animations",
    description: "Анимации в Android: View Animation, Object Animator, Transition API, Motion Layout.",
    subtopics: ["View Animation (alpha, translate)", "Object Animator", "AnimatorSet", "Transition API", "Motion Layout", "Shared Element Transition"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "middle-ui-compose", categoryId: "middle-ui", name: "Jetpack Compose",
    description: "Декларативный UI-фреймворк. Composable функции, модификаторы, Material Design, темы.",
    subtopics: ["@Composable функции", "Modifier chain", "Material Theme", "Стейт в Compose (remember)", "LazyColumn / LazyRow", "Navigation Compose"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: true,
  },
  {
    id: "middle-ui-state", categoryId: "middle-ui", name: "State",
    description: "Управление состоянием в Compose. remember, mutableStateOf, state hoisting, делегирование.",
    subtopics: ["remember", "mutableStateOf", "by state delegation", "State hoisting", "ProducedState", "derivedStateOf"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: true,
  },
  {
    id: "middle-ui-remember", categoryId: "middle-ui", name: "Remember",
    description: "Сохранение состояния между рекомпозициями. remember и rememberSaveable для различных сценариев.",
    subtopics: ["remember {}", "remember { mutableStateOf() }", "rememberSaveable", "Ключи remember", "Сохранение состояния поворота", "Потери состояния"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: false,
  },
  {
    id: "middle-ui-sideeffects", categoryId: "middle-ui", name: "Side Effects",
    description: "Побочные эффекты в Compose: LaunchedEffect, DisposableEffect, SideEffect и другие.",
    subtopics: ["LaunchedEffect", "DisposableEffect", "SideEffect", "produceState", "derivedStateOf", "rememberCoroutineScope"],
    maxWeight: 5, sortOrder: 7, requiredForLevelUp: false,
  },
  {
    id: "middle-ui-navcompose", categoryId: "middle-ui", name: "Navigation Compose",
    description: "Навигация в Compose: NavHost, composable route, аргументы, вложенная навигация.",
    subtopics: ["NavHost и NavController", "composable(route)", "_ARGUMENTS_", "Навигация с аргументами", "Вложенная навигация", "Bottom Navigation"],
    maxWeight: 5, sortOrder: 8, requiredForLevelUp: false,
  },

  // ============================
  // Middle: Architecture
  // ============================
  {
    id: "middle-arch-mvvm", categoryId: "middle-arch", name: "MVVM",
    description: "Продвинутая реализация MVVM: StateFlow, делегирование UI-состояния, тестирование ViewModel.",
    subtopics: ["ViewModel + StateFlow", "UI State sealed class", "State hoisting", "Обработка ошибок", "Тестирование ViewModel", "Паттерн MVI на базе MVVM"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: true,
  },
  {
    id: "middle-arch-mvi", categoryId: "middle-arch", name: "MVI",
    description: "Model-View-Intent: предсказуемый поток данных. Состояние, намерения (интенты), редюсеры.",
    subtopics: ["State (единое состояние)", "Intent / Action", "Reducer", "Side Effects", "Сравнение с MVVM", "Библиотеки MVI"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "middle-arch-udf", categoryId: "middle-arch", name: "UDF",
    description: "Unidirectional Data Flow: однонаправленный поток данных. Состояние вниз, события вверх. Предсказуемость.",
    subtopics: ["State вниз", "Events вверх", "Single source of truth", "Immutability", "Поток данных в архитектуре", "Преимущества для тестирования"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "middle-arch-state", categoryId: "middle-arch", name: "State Management",
    description: "Управление состоянием приложения. Глобальное vs локальное, нормализация, синхронизация.",
    subtopics: ["Глобальное состояние (DI)", "Локальное состояние", "Нормализация данных", "Синхронизация с сервером", "Кэширование", "Offline-first паттерн"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "middle-arch-usecase", categoryId: "middle-arch", name: "UseCase",
    description: "Бизнес-логика в отдельных классах. Единая ответственность, переиспользование, тестирование.",
    subtopics: ["Одна UseCase — одна операция", "Инжекция репозитория", "Тестируемость", "Переиспользование между ViewModel", "Когда не нужны UseCase", "Паттерн clean architecture"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },
  {
    id: "middle-arch-repository", categoryId: "middle-arch", name: "Repository",
    description: "Паттерн Repository: единый источник данных с кэшированием, обработкой ошибок и стратегиями загрузки.",
    subtopics: ["Кэширование данных", "Стратегии загрузки (remote-first, cache-first)", "Обработка ошибок", "Маппинг DTO → Domain", "Repository interface", "Паттерн «Offline First»"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: true,
  },

  // ============================
  // Middle: Data Layer
  // ============================
  {
    id: "middle-data-room", categoryId: "middle-data", name: "Room",
    description: "Абстракция над SQLite: аннотации, типобезопасные запросы, Flow-интеграция,ypeConverters.",
    subtopics: ["@Entity с ключами", "DAO с @Query", "TypeConverters", "Интеграция с Flow", "suspend DAO функции", "Миграции (autoMigrations)"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: true,
  },
  {
    id: "middle-data-migration", categoryId: "middle-data", name: "Migration",
    description: "Миграции базы данных: ручные и автоматические миграции, тестирование миграций.",
    subtopics: ["Migration class", "AutoMigrations", "Тестирование миграций", "FallbackToDestructiveMigration", "Версия БД", "Распространённые ошибки"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "middle-data-paging", categoryId: "middle-data", name: "Paging3",
    description: "Постраничная загрузка данных. PagingSource, RemoteMediator, Paging Compose Integration.",
    subtopics: ["PagingSource", "PagingData", "Pager builder", "RemoteMediator", "Paging Compose (LazyPagingItems)", "LoadState (Loading, Error)"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: true,
  },
  {
    id: "middle-data-datastore", categoryId: "middle-data", name: "DataStore",
    description: "Потоковая замена SharedPreferences. Preferences DataStore и Proto DataStore для типобезопасных данных.",
    subtopics: ["Preferences DataStore", "Proto DataStore", "Работа с Flow", "Транзакции (edit)", "Миграция из SharedPreferences", "Асинхронный доступ"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "middle-data-caching", categoryId: "middle-data", name: "Caching",
    description: "Стратегии кэширования: in-memory, in-disk, слои кэша, TTL и инвалидация.",
    subtopics: ["In-memory cache", "Disk cache (Room, DataStore)", "Cache invalidation", "TTL (time-to-live)", "Cache-first стратегия", "LRU eviction"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },
  {
    id: "middle-data-offline", categoryId: "middle-data", name: "Offline First",
    description: "Приложение работает без сети: локальные данные как основной источник, синхронизация при подключении.",
    subtopics: ["Локальный источник данных", "Синхронизация при подключении", "Конфликты синхронизации", "Оффлайн-операции", "Индикатор сети", "WorkManager для синхронизации"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: true,
  },
  {
    id: "middle-data-workmanager", categoryId: "middle-data", name: "WorkManager",
    description: "Гарантированное выполнение фоновых задач. WorkRequest, условия, цепочки задач, повторные попытки.",
    subtopics: ["WorkRequest", "OneTimeWorkRequest vs PeriodicWorkRequest", "Conditions (constraints)", "Цепочки задач (then)", "Повторные попытки", "Текущий статус (WorkInfo)"],
    maxWeight: 5, sortOrder: 7, requiredForLevelUp: true,
  },

  // ============================
  // Middle: Networking
  // ============================
  {
    id: "middle-networking-okhttp", categoryId: "middle-networking", name: "OkHttp",
    description: "HTTP-клиент: перехватчики, кэширование,.connection pooling, логирование запросов.",
    subtopics: ["OkHttpClient builder", "Interceptors", "Logging Interceptor", "Кэширование HTTP", "Connection Pool", "Таймауты"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "middle-networking-retrofit", categoryId: "middle-networking", name: "Retrofit",
    description: "Типобезопасный HTTP-клиент. Интерфейсы API, конвертеры, обработка ошибок, аутентификация.",
    subtopics: ["Retrofit builder + OkHttp", "Интерфейсы API", "Converter (Gson, Moshi)", "Call vs suspend fun", "Обработка ошибок (Response<T>)", "Базовый URL и перехватчики"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: true,
  },
  {
    id: "middle-networking-converters", categoryId: "middle-networking", name: "Converters",
    description: "Конвертеры данных: Gson, Moshi, KotlinX Serialization. Сериализация/десериализация JSON и других форматов.",
    subtopics: ["GsonConverterFactory", "MoshiConverterFactory", "KotlinX Serialization", "Custom Converter", "Аннотации (@SerializedName)", "Обработка null полей"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "middle-networking-errors", categoryId: "middle-networking", name: "Error Handling",
    description: "Обработка сетевых ошибок: HTTP-коды, таймауты, отсутствие сети, парсинг ошибок API.",
    subtopics: ["HTTP status codes (4xx, 5xx)", "Таймауты и retry", "Отсутствие сети", "Типизированные ошибки API", "Пользовательские исключения", "Error sealed class"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: true,
  },
  {
    id: "middle-networking-upload", categoryId: "middle-networking", name: "Upload",
    description: "Загрузка файлов на сервер: multipart, progress tracking, отмена загрузки.",
    subtopics: ["@Multipart POST", "RequestBody", "Progress tracking", "Отмена загрузки", "Размер файла", "Content-Type header"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },
  {
    id: "middle-networking-download", categoryId: "middle-networking", name: "Download",
    description: "Загрузка файлов: скачивание в файл, progress tracking, возобновление прерванной загрузки.",
    subtopics: ["Скачивание в файл", "Progress tracking", "Возобновление загрузки (Range)", "Работа с InputStream", "Сохранение в storage", "Отмена загрузки"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: false,
  },
  {
    id: "middle-networking-websocket", categoryId: "middle-networking", name: "WebSocket",
    description: "Двусторонняя связь в реальном времени. OkHttp WebSocket, обработка сообщений и состояний.",
    subtopics: ["OkHttp WebSocket", "newWebSocket()", "onMessage / onFailure", "Ping / Pong", "Переподключение", "Протокол WS vs WSS"],
    maxWeight: 5, sortOrder: 7, requiredForLevelUp: false,
  },
  {
    id: "middle-networking-cert", categoryId: "middle-networking", name: "Certificate Pinning",
    description: "Фиксирование SSL-сертификатов для защиты от MITM-атак. Настройка в OkHttp.",
    subtopics: ["Certificate Pinning", "OkHttp certificatePinner", "SHA-256 пиннинг", "Резервные пинны", "Обновление пиннов", "Когда это необходимо"],
    maxWeight: 5, sortOrder: 8, requiredForLevelUp: false,
  },

  // ============================
  // Middle: Dependency Injection
  // ============================
  {
    id: "middle-di-hilt", categoryId: "middle-di", name: "Hilt",
    description: "Фреймворк DI от Google на базе Dagger. Аннотации @HiltViewModel, @Inject, @Module, @Provides.",
    subtopics: ["@AndroidEntryPoint", "@HiltViewModel", "@Inject constructor", "@Module / @Provides", "@Binds", "@Singleton"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: true,
  },
  {
    id: "middle-di-dagger", categoryId: "middle-di", name: "Dagger",
    description: "Основы Dagger: компоненты, модули, scope,(@Inject), @Provides, @Binds, цикл жизни объектов.",
    subtopics: ["@Inject конструктор", "@Component", "@Module", "@Provides / @Binds", "@Scope", "@Singleton"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "middle-di-modules", categoryId: "middle-di", name: "Modules",
    description: "Модули DI: предоставление зависимостей, @Provides для объектов без конструктора, @Binds для интерфейсов.",
    subtopics: ["@Module аннотация", "@Provides функция", "@Binds для интерфейсов", "InstalIn (Hilt)", "Вложенные модули", "Переопределение (override)"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "middle-di-scopes", categoryId: "middle-di", name: "Scopes",
    description: "Область видимости объектов: @Singleton, @ActivityScoped, @ViewModelScoped, пользовательские scope.",
    subtopics: ["@Singleton", "@ActivityScoped", "@ViewModelScoped", "Создание пользовательского @Scope", "Жизненный цикл Scoped объектов", "Когда нужен scope"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "middle-di-inject", categoryId: "middle-di", name: "@Inject",
    description: "Конструкторная инъекция依赖. @Inject constructor для автоматического предоставления зависимостей.",
    subtopics: ["@Inject constructor", "Параметры конструктора", "Автоматическое предоставление", "Требования к типу", "Инъекция в Activity/Fragment", "Lazy инъекция"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },
  {
    id: "middle-di-provides", categoryId: "middle-di", name: "@Provides",
    description: "Предоставление依赖 через функции модуля. Для объектов без конструктора или с кастомной инициализацией.",
    subtopics: ["@Provides в @Module", "Возвращаемое значение", "Параметры @Provides", "Контекст из модуля", "Пользовательские фабрики", "Область видимости @Provides"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: false,
  },
  {
    id: "middle-di-binds", categoryId: "middle-di", name: "@Binds",
    description: "Привязка интерфейса к реализации. Экономит память (не создаёт новый экземпляр) в отличие от @Provides.",
    subtopics: ["@Binds abstract function", "Интерфейс → Реализация", "Преимущества перед @Provides", "Связывание в модуле", "Комбинирование с @Provides", "Мультибайндинг (опционально)"],
    maxWeight: 5, sortOrder: 7, requiredForLevelUp: false,
  },

  // ============================
  // Middle: Testing
  // ============================
  {
    id: "middle-test-unit", categoryId: "middle-test", name: "Unit Tests",
    description: "Модульное тестирование业务逻辑. Мокирование зависимостей, паттерн Arrange-Act-Assert.",
    subtopics: ["JUnit 5", "Arrange-Act-Assert", "MockK / Mockito", "Тестирование ViewModel", "Корутин-тесты (runTest)", "Fake vs Mock"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "middle-test-coroutines", categoryId: "middle-test", name: "Coroutine Tests",
    description: "Тестирование корутин и Flow. runTest, TestCoroutineDispatcher, TestCoroutineScope, advanceUntilIdle.",
    subtopics: ["runTest { }", "TestCoroutineDispatcher", "TestCoroutineScope", "advanceUntilIdle", "advanceTimeBy", "TestCoroutineScheduler"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "middle-test-repository", categoryId: "middle-test", name: "Repository Tests",
    description: "Тестирование уровня данных: мокирование DAO и API, проверка логики кэширования и ошибок.",
    subtopics: ["Мокирование DAO", "Мокирование API", "Тестирование кэширования", "Обработка ошибок", "Pat턴 Fake Repository", "Интеграционные тесты БД"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "middle-test-viewmodel", categoryId: "middle-test", name: "ViewModel Tests",
    description: "Тестирование ViewModel: проверка состояния, обработки событий,Side Effects и навигации.",
    subtopics: ["Тестирование состояния", "Проверка обработки событий", "Testing Side Effects", "Навигация и навигационные события", "Паттерн TestRule", "Coroutines в тестах"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "middle-test-ui", categoryId: "middle-test", name: "UI Tests",
    description: "Интеграционные UI-тесты: Espresso (Views) и Compose Testing (Compose). Проверка отображения и взаимодействия.",
    subtopics: ["Espresso (onView, perform)", "Compose Testing (onNodeWithTag)", "Проверка отображения", "Взаимодействие с элементами", "Ожидание загрузки", "Screenshot тесты"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },

  // ============================
  // Middle: Tools
  // ============================
  {
    id: "middle-tools-gitflow", categoryId: "middle-tools", name: "Git Flow",
    description: "Модель ветвления Git Flow: main, develop, feature, release, hotfix ветки.",
    subtopics: ["main / develop ветки", "feature ветки", "release ветки", "hotfix ветки", "Merge vs Rebase", "Pull Requests / Merge Requests"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "middle-tools-kts", categoryId: "middle-tools", name: "Gradle KTS",
    description: "Билд-скрипты на Kotlin DSL. Типобезопасные конфигурации, функции, расширения.",
    subtopics: ["build.gradle.kts", "Типобезопасные зависимости", "Функции в скриптах", "Расширения (extensions)", "Сравнение с Groovy DSL", "Скорость сборки"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "middle-tools-r8", categoryId: "middle-tools", name: "R8",
    description: "Оптимизация и обфускация кода: tree shaking, минификация, оптимизация. Замена ProGuard.",
    subtopics: ["R8 vs ProGuard", "minifyEnabled", "proguard-rules.pro", "Tree shaking", "Оптимизации (inlining, devirtualization)", "Тестирование обфускации"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "middle-tools-proguard", categoryId: "middle-tools", name: "Proguard",
    description: "Сжатие, оптимизация и обфускация Java/кода. Настройка правил,keep-правила и отладка.",
    subtopics: ["proguard-rules.pro", "keep классы/методы", "Диагностика (mapping.txt)", "Ручные правила", "Сравнение с R8", "Когда ещё используется"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "middle-tools-profiler", categoryId: "middle-tools", name: "Profiler",
    description: "Профилирование производительности: CPU, Memory, Network, Energy в Android Studio.",
    subtopics: ["CPU Profiler", "Memory Profiler", "Network Profiler", "Energy Profiler", "Tracing", "Heap dumps"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },
  {
    id: "middle-tools-crashlytics", categoryId: "middle-tools", name: "Firebase Crashlytics",
    description: "Мониторинг крашей и ошибок в продакшене. Логирование, кастомные ключи, non-fatal ошибки.",
    subtopics: ["Интеграция Crashlytics", "Логирование ошибок", "Кастомные ключи", "Non-fatal exceptions", "Breadcrumb логи", "Уведомления о крашах"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: false,
  },

  // ============================
  // Strong Middle: Kotlin Advanced
  // ============================
  {
    id: "strong-kotlin-inline", categoryId: "strong-kotlin", name: "Inline",
    description: "Продвинутый инлайн: inline class, value class, crossinline, non-local return, оптимизация лямбд.",
    subtopics: ["inline class / value class", "crossinline детально", "Non-local return", "Байткод инлайн функций", "Сравнение inline vs普通 функции", "Оптимизация производительности"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "strong-kotlin-reified", categoryId: "strong-kotlin", name: "Reified",
    description: "Продвинутое использование reified типов: дженерики в рантайме, типобезопасные приведения, рефлексия.",
    subtopics: ["Reified в泛型 контексте", "Проверка типов в рантайме", "Получение KClass", "Сравнение с Class<T>", "Ограничения (inline only)", "Практические паттерны"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "strong-kotlin-contracts", categoryId: "strong-kotlin", name: "Contracts",
    description: "Продвинутые контракты для оптимизации кода. Помощь компилятору,smart-cast, инференция типов.",
    subtopics: ["Последствия контрактов", "implies для smart cast", "Custom contract effects", "Ограничения контрактов", "Паттерны использования", "Контракты и null safety"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "strong-kotlin-delegation", categoryId: "strong-kotlin", name: "Delegation",
    description: "Продвинутое делегирование: кастомные делегаты, ленивые вычисления, потокобезопасные делегаты.",
    subtopics: ["ReadWriteProperty", "ReadOnlyProperty", "Потокобезопасные делегаты", "Кастомная реализация lazy", "DelegatingViewModel", "Делегирование по интерфейсу"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "strong-kotlin-dsl", categoryId: "strong-kotlin", name: "DSL",
    description: "Продвинутое построение DSL: типобезопасные билдеры, @DslMarker, вложенные DSL, композиция.",
    subtopics: ["Продвинутый @DslMarker", "Вложенные DSL", "Композиция билдеров", "Типобезопасные ссылки", "Кастомные операторы", "Построение UI DSL"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },
  {
    id: "strong-kotlin-reflection", categoryId: "strong-kotlin", name: "Reflection",
    description: "Рефлексия в Kotlin: KClass, KFunction, KProperty, вызов методов и доступ к свойствам в рантайме.",
    subtopics: ["::class синтаксис", "KClass API", "KFunction / KCallable", "KProperty", "invoke() динамический вызов", "Ограничения и производительность"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: false,
  },
  {
    id: "strong-kotlin-kclass", categoryId: "strong-kotlin", name: "KClass",
    description: "Представление класса в рантайме: пространства имён, аннотации, члены класса, дочерние классы.",
    subtopics: ["qualifiedName vs simpleName", "members / declaredMembers", "annotations", "supertypes (иерархия)", "isSubclassOf", "Получение KClass из泛型"],
    maxWeight: 5, sortOrder: 7, requiredForLevelUp: false,
  },
  {
    id: "strong-kotlin-value", categoryId: "strong-kotlin", name: "Value Classes",
    description: "Значимые классы (inline class/value class) для типобезопасной обёртки без накладных расходов.",
    subtopics: ["value class", "inline class", "Ограничения (одно свойство)", "Компаньонные объекты", "Сравнение с data class", "Производительность в bytecode"],
    maxWeight: 5, sortOrder: 8, requiredForLevelUp: false,
  },

  // ============================
  // Strong Middle: Flow Deep Dive
  // ============================
  {
    id: "strong-flow-shared", categoryId: "strong-flow", name: "SharedFlow",
    description: "Продвинутое использование SharedFlow: стратегии буферизации, replay, объединение потоков.",
    subtopics: ["Buffer стратегии (DROP_OLDEST)", "Replay и replay cache", "Объединение (combine, merge)", "Потери событий", "SingleLiveEvent паттерн", "SharedFlow vs StateFlow"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "strong-flow-state", categoryId: "strong-flow", name: "StateFlow",
    description: "Продвинутые паттерны StateFlow: кэширование, трансформации, интеграция с UI-слой.",
    subtopics: ["stateIn", ".shareIn", "transformWhile", "Кэширование в ViewModel", "Мультипоточная запись", "Потери состояния при смене ViewModel"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "strong-flow-buffer", categoryId: "strong-flow", name: "Buffer",
    description: "Буферизация потоков:	buffer(), conflate(), collect в отдельной корутине для производительности.",
    subtopics: ["buffer()", "conflate()", "collectLatest", "Когда буферизовать", "Размер буфера", "Влияние на производительность"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "strong-flow-conflate", categoryId: "strong-flow", name: "Conflate",
    description: "Пропуск промежуточных значений в потоке. conflate() для оптимизации производительности UI.",
    subtopics: ["conflate()", "Когда использовать", "Пропуск промежуточных значений", "Сравнение с buffer()", "Реальные кейсы", "Проблемы с обработкой"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "strong-flow-select", categoryId: "strong-flow", name: "Select",
    description: "Одновременный выбор из нескольких каналов/потоков. select {} для обработки первого завершённого.",
    subtopics: ["select { }", "onReceive", "onSend", "onAwait", "Примеры использования", "Параллельная обработка"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },
  {
    id: "strong-flow-channels", categoryId: "strong-flow", name: "Channels",
    description: "Продвинутые каналы: типы буферов,fan-out/fan-in, мультипоточная обработка, producers и consumers.",
    subtopics: ["BufferedChannel", "ConflatedChannel", "Fan-out (многопотребители)", "Fan-in (многопроизводители)", "Producers coroutine", "Channel() factory"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: false,
  },
  {
    id: "strong-flow-actor", categoryId: "strong-flow", name: "Actor Model",
    description: "Паттерн Actor для последовательной обработки сообщений. Обеспечивает thread-safety без блокировок.",
    subtopics: ["Паттерн Actor", "Последовательная обработка", "Channel для связи", "Сравнение с Mutex", "Потребитель (consumer)", "Когда использовать actor"],
    maxWeight: 5, sortOrder: 7, requiredForLevelUp: false,
  },

  // ============================
  // Strong Middle: Compose Advanced
  // ============================
  {
    id: "strong-compose-composition", categoryId: "strong-compose", name: "Composition",
    description: "Внутренний механизм Compose: фазы composition, slot table, composers, side effects.",
    subtopics: ["Composition phases", "Slot table", "Recomposer", "Applier", "Composition references", "Группы composition"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "strong-compose-recomposition", categoryId: "strong-compose", name: "Recomposition",
    description: "Перерисовка Compose: smart recomposition, стабильность, un stability, оптимизации.",
    subtopics: ["Smart recomposition", "Stability (@Stable, @Immutable)", "Un stability", "Recomposition scope", "Key для recomposition", "Оптимизация (derivedStateOf)"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "strong-compose-snapshot", categoryId: "strong-compose", name: "Snapshot System",
    description: "Система снимков для управления состоянием: Snapshot, snapshot { }, atomic operations.",
    subtopics: ["Snapshot object", "snapshot { }", "Snapshot.withMutableSnapshot", "atomic operations", "Reading/writing state", "Прозрачные объекты (SnapshotMutableState)"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "strong-compose-stability", categoryId: "strong-compose", name: "Stability",
    description: "Анализ стабильности классов для Compose: @Stable, @Immutable,稳定 types, рекомендации.",
    subtopics: ["@Stable аннотация", "@Immutable аннотация", "Stable types list", "CompositionLocal", "Рекомендации по стабильности", "Инструменты (compose compiler reports)"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "strong-compose-derived", categoryId: "strong-compose", name: "DerivedStateOf",
    description: "Производные состояния: derivedStateOf для вычислений на основе других состояний с оптимизацией.",
    subtopics: ["derivedStateOf { }", "Когда использовать", "Преимущества перед lazy", "Производительность", "Паттерны (фильтрация, сортировка)", "Признаки неправильного использования"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },
  {
    id: "strong-compose-layouts", categoryId: "strong-compose", name: "Custom Layouts",
    description: "Создание кастомных layout-компонентов в Compose: Layout, Measurable, Placeable, constraints.",
    subtopics: ["Layout { } composable", "Measurable и Placeable", "Constraints", "Placeable.place()", "Пользовательские layout modifiers", "Проведение (layout кастомизация)"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: false,
  },

  // ============================
  // Strong Middle: Architecture
  // ============================
  {
    id: "strong-arch-clean", categoryId: "strong-arch", name: "Clean Architecture",
    description: "Чистая архитектура: слои (data, domain, presentation), зависимости только внутрь, независимость от фреймворков.",
    subtopics: ["Data / Domain / Presentation слои", "Dependency Rule (зависимости внутрь)", "Entities / UseCases", "Interface Adapters", "Frameworks & Drivers", "Мульти-модульность"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: true,
  },
  {
    id: "strong-arch-feature", categoryId: "strong-arch", name: "Feature Modules",
    description: "Модульное разделение по фичам: each feature в отдельном модуле, API-контракты, динамическая подгрузка.",
    subtopics: ["Feature module structure", "API-контракты модулей", "Dynamic Feature Module", "Базовый модуль (core)", "Интеграция feature-модулей", "Тестирование модулей"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "strong-arch-multi", categoryId: "strong-arch", name: "Multi Module",
    description: "Мультимодульная архитектура: разделение ответственности, ускорение сборки, изоляция изменений.",
    subtopics: ["Мотивация мультимодульности", "Типы модулей (app, feature, core)", "Изоляция зависимостей", "API vs Implementation", "Ускорение сборки", "Миграция на мультимодули"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: true,
  },
  {
    id: "strong-arch-solid", categoryId: "strong-arch", name: "SOLID",
    description: "Принципы SOLID в контексте Android: единственная ответственность, открытость, подстановка, интерфейсная сегрегация, инверсия зависимостей.",
    subtopics: ["Single Responsibility", "Open/Closed", "Liskov Substitution", "Interface Segregation", "Dependency Inversion", "Практические примеры в Android"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "strong-arch-ddd", categoryId: "strong-arch", name: "DDD Basics",
    description: "Domain-Driven Design: aggregates, value objects, domain events, bounded contexts в Android-приложениях.",
    subtopics: ["Aggregates", "Value Objects", "Domain Events", "Bounded Contexts", "Repository паттерн", "Анти-паттерны (Anemic Domain)"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },

  // ============================
  // Strong Middle: Data
  // ============================
  {
    id: "strong-data-remote", categoryId: "strong-data", name: "RemoteMediator",
    description: "Загрузка данных из сети с кэшированием в Room. Стратегии: prepend, append, refresh. Offline-first.",
    subtopics: ["RemoteMediator实现", "LoadResult (Success/Error)", "Prepend / Append / Refresh", "Пагинация из кэша", "Стратегии обновления", "Потери данных при обновлении"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "strong-data-proto", categoryId: "strong-data", name: "Proto DataStore",
    description: "Типобезопасное хранилище на Protocol Buffers. Миграция из Preferences DataStore, schema evolution.",
    subtopics: ["Proto DataStore setup", "Schema definition", "Работа с Flow", "Миграция из Preferences", "Schema evolution", "Обработка ошибок"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "strong-data-sync", categoryId: "strong-data", name: "Sync",
    description: "Синхронизация данных между сервером и клиентом: стратегии, конфликты, фоновая синхронизация.",
    subtopics: ["Полная синхронизация", "Инкрементальная синхронизация", "Офлайн-операции и синхронизация", "Конфликты", "WorkManager для синхронизации", "Conflict resolution strategies"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "strong-data-conflict", categoryId: "strong-data", name: "Conflict Resolution",
    description: "Разрешение конфликтов при синхронизации: last-write-wins, merge, versioning, оптимистичная блокировка.",
    subtopics: ["Last-write-wins", "Server wins", "Merge стратегии", "Vector clocks", "Оптимистичная блокировка", "Пользовательское разрешение"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },

  // ============================
  // Strong Middle: Security
  // ============================
  {
    id: "strong-security-keystore", categoryId: "strong-security", name: "Keystore",
    description: "Безопасное хранение ключей шифрования: Android Keystore System, генерация и управление ключами.",
    subtopics: ["Android Keystore", "Ключевые пары (RSA, EC)", "Симметричные ключи", "Безопасная генерация", "Хранение и доступ", "API level considerations"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "strong-security-encryption", categoryId: "strong-security", name: "Encryption",
    description: "Шифрование данных: AES, RSA, EncryptedSharedPreferences, EncryptedFile, EncryptedString.",
    subtopics: ["AES/GCM", "RSA", "EncryptedSharedPreferences", "EncryptedFile", "Мастер-ключ (AndroidKeyStore)", "Практические примеры"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "strong-security-ssl", categoryId: "strong-security", name: "SSL Pinning",
    description: "Закрепление SSL/TLS-сертификатов для предотвращения MITM-атак. Настройка и тестирование.",
    subtopics: ["Certificate pinning", "OkHttp CertificatePinner", "Network Security Config", "Резервные пинны", "Тестирование пиннинга", "Когда необходимо"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "strong-security-biometric", categoryId: "strong-security", name: "BiometricPrompt",
    description: "Биометрическая аутентификация: отпечаток, лицо, PIN. Интеграция с AndroidX Biometric.",
    subtopics: ["BiometricPrompt API", "Показ диалога", "Обработка результата", "Биометрические凭据", "KeyguardManager", "Fallback на PIN/пароль"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },

  // ============================
  // Strong Middle: Performance
  // ============================
  {
    id: "strong-perf-jank", categoryId: "strong-perf", name: "Jank",
    description: "Определение и исправление подтормаживаний UI. Frame rendering, Jank detection, baseline profiles.",
    subtopics: ["Frame rendering pipeline", "Jank detection (FrameMetrics)", "Systrace", "Layout thrashing", "Overdraw", "Optimization checklist"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "strong-perf-startup", categoryId: "strong-perf", name: "Startup Time",
    description: "Оптимизация времени запуска: холодный/тёплый/горячий запуск, замедление, App Startup Library.",
    subtopics: ["Типы запуска (cold, warm, hot)", "Trace для запуска", "Lazy initialization", "App Startup Library", "Splash Screen API", "Baseline Profiles для запуска"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "strong-perf-memory", categoryId: "strong-perf", name: "Memory Leaks",
    description: "Обнаружение и исправление утечек памяти. LeakCanary, профилировщик, типичные причины.",
    subtopics: ["LeakCanary", "Heap dumps", "Типичные утечки (Activity, Context)", "WeakReference / SoftReference", "Profilers для памяти", "Best practices для предотвращения"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "strong-perf-macro", categoryId: "strong-perf", name: "Macrobenchmark",
    description: "Бенчмарки производительности: запуск, рендеринг, составные операции. Мониторинг в CI.",
    subtopics: ["Macrobenchmark setup", "Startup benchmarks", "Scrolling benchmarks", "Цель (target) и compile", "CI интеграция", "Анализ результатов"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "strong-perf-baseline", categoryId: "strong-perf", name: "Baseline Profiles",
    description: "Оптимизация запуска иACING через Baseline Profiles. Профилирование, генерация, применение.",
    subtopics: ["Baseline Profiles concept", "Генерация профилей", "Профилирование AOT компиляции", "Бенчмарки с профилями", "CI интеграция", "Результаты (startup, jank reduction)"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },

  // ============================
  // Senior: Kotlin Expert
  // ============================
  {
    id: "senior-kotlin-compiler", categoryId: "senior-kotlin", name: "Compiler",
    description: "Компилятор Kotlin: AST, фазы компиляции, плагины, кастомные генераторы кода.",
    subtopics: ["Kotlin Compiler phases", "Плагины компилятора", "KSP (Kotlin Symbol Processing)", "Кастомные IR трансформации", "Анализ кода на этапе компиляции", "Оптимизации компилятора"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "senior-kotlin-memory", categoryId: "senior-kotlin", name: "Memory Model",
    description: "Модель памяти Kotlin/JVM:对象引用, GC,逃逸分析,inline classes и их влияние на память.",
    subtopics: ["Объектная модель JVM", "Сборка мусора (GC)", "Escape analysis", "Inline classes в памяти", "Compressed oops", "Память в Kotlin/Native"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "senior-kotlin-multiplatform", categoryId: "senior-kotlin", name: "Multiplatform",
    description: "Kotlin Multiplatform: общая кодовая база для Android/iOS/Desktop/Web. Ожидаемые (expect) и фактные (actual) декларации.",
    subtopics: ["Kotlin Multiplatform setup", "expect / actual declarations", "Common module", "Platform-specific код", "Компоненты (ktor, coroutines)", "Состояние KMP (стабильность)"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "senior-kotlin-perf", categoryId: "senior-kotlin", name: "Performance",
    description: "Производительность Kotlin: инлайн, zero-cost абстракции, оптимизации bytecode, boxing/unboxing.",
    subtopics: ["Zero-cost abstractions", "Inline functions", "Value classes (без boxing)", "Optimal bytecode generation", "Benchmarking Kotlin кода", "JVM-specific optimizations"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "senior-kotlin-reflection", categoryId: "senior-kotlin", name: "Reflection",
    description: "Продвинутая рефлексия: KCallable, KProperty, KFunction,invoke(),доступ к приватным членам, безопасность.",
    subtopics: ["KCallable / KFunction", "KProperty (get/set)", "Динамический вызов invoke()", "Доступ к приватным成员", "Аннотации в рефлексии", "Безопасность и ограничения"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },
  {
    id: "senior-kotlin-annotations", categoryId: "senior-kotlin", name: "Annotations",
    description: "Пользовательские аннотации, мета-аннотации,_RUNTIME retention, влияние на компиляцию и рефлексию.",
    subtopics: ["Пользовательские аннотации", "@Retention (RUNTIME, SOURCE)", "@Target", "Мета-аннотации", "Аннотационные处理器 (KSP)", "Практические примеры"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: false,
  },

  // ============================
  // Senior: Concurrency Expert
  // ============================
  {
    id: "senior-concurrency-internals", categoryId: "senior-concurrency", name: "Coroutine Internals",
    description: "Внутренний механизм корутин: Continuation, State Machine, dispatching, instrumentation.",
    subtopics: ["Continuation", "State Machine (корутина как FSM)", "DispatchedContinuation", "Контекст корутины", "Создание корутины (createCoroutine)", "Стек кадров"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "senior-concurrency-dispatchers", categoryId: "senior-concurrency", name: "Dispatchers Internals",
    description: "Внутренняя реализация диспетчеров: ThreadPool, limited parallelism, Scheduler, контекст потоков.",
    subtopics: ["Dispatchers.Default (кThreadPool)", "Dispatchers.IO (limitedParallelism)", "Dispatchers.Main (Handler)", "limitedParallelism()", "CoroutineScheduler", "Work stealing"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "senior-concurrency-statemachine", categoryId: "senior-concurrency", name: "State Machine",
    description: "Корутина как конечный автомат: состояния (CREATED, RUNNING, SUSPENDED, COMPLETED), переходы.",
    subtopics: ["CREATED state", "RUNNING state", "SUSPENDED state", "COMPLETED state", "Переходы состояний", "Восстановление после suspension"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "senior-concurrency-atomic", categoryId: "senior-concurrency", name: "Atomic Operations",
    description: "Атомарные операции в Kotlin coroutines: AtomicReference, CAS, compareAndSet, lock-free алгоритмы.",
    subtopics: ["AtomicReference", "compareAndSet (CAS)", "Lock-free алгоритмы", "Атомарные обновления", "Memory visibility", "ABA problem"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "senior-concurrency-sharedflow", categoryId: "senior-concurrency", name: "SharedFlow Internals",
    description: "Внутренний механизм SharedFlow: буферы, подписчики, управление памятью, emission policies.",
    subtopics: ["Subscriber buffer", "Replay cache", "Emission policy (SUSPEND, DROP_OLDEST)", "Наблюдатели и сборка мусора", "SharedFlow vs Channel", "Продвинутые конфигурации"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },

  // ============================
  // Senior: Android Platform Expert
  // ============================
  {
    id: "senior-platform-art", categoryId: "senior-platform", name: "ART",
    description: "Android Runtime (ART): JIT/AOT компиляция, сборка мусора, профилирование, bytecode transformations.",
    subtopics: ["AOT vs JIT компиляция", "Сборка мусора (GC)", "Profile-guided compilation", "Bytecode transformations", "dex2oat", "Работа с ART internals"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "senior-platform-binder", categoryId: "senior-platform", name: "Binder",
    description: "Межпроцессное взаимодействие (IPC) через Binder. AIDL, Service с привязкой, транзакции.",
    subtopics: ["Binder mechanism", "AIDL", "Service binding", "Транзакции и Parcel", "Remote callback", "Performance implications"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "senior-platform-zygote", categoryId: "senior-platform", name: "Zygote",
    description: "Процесс Zygote: fork для новых приложений, shared runtime, preload классов и ресурсов.",
    subtopics: ["Роль Zygote", "Fork процесса", "Shared runtime", "Preload классов", "Причины использования", "Ограничения"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "senior-platform-ams", categoryId: "senior-platform", name: "AMS",
    description: "Activity Manager Service: управление компонентами, жизненным циклом, очередью задач, памятью.",
    subtopics: ["Activity Manager Service", "Управление жизненным циклом", "Task и Back Stack", "Приоритеты процессов", "Low Memory Killer", "Restrictions"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "senior-platform-wms", categoryId: "senior-platform", name: "WMS",
    description: "Window Manager Service: управление окнами, позиционирование, анимации переходов, multi-window.",
    subtopics: ["Window Manager Service", "Окна и их типы", "Позиционирование", "Анимации переходов", "Multi-window", "Display и Screens"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },
  {
    id: "senior-platform-package", categoryId: "senior-platform", name: "PackageManager",
    description: "Управление пакетами: установка, удаление, разрешения, интент-фильтры, компоненты.",
    subtopics: ["PackageManager", "Разрешения (permissions)", "Интент-фильтры", "PackageInfo / ApplicationInfo", "Динамические разрешения", "Установка APK"],
    maxWeight: 5, sortOrder: 6, requiredForLevelUp: false,
  },
  {
    id: "senior-platform-looper", categoryId: "senior-platform", name: "Looper Internals",
    description: "Внутренний механизм Looper: MessageQueue, Idle Handlers, паттерн event loop, производительность.",
    subtopics: ["MessageQueue internals", "Idle Handlers", "Idle паттерн", "Синхронные барьеры", "Производительность Looper", "Custom Looper"],
    maxWeight: 5, sortOrder: 7, requiredForLevelUp: false,
  },

  // ============================
  // Senior: Compose Advanced
  // ============================
  {
    id: "senior-compose-compiler", categoryId: "senior-compose", name: "Compiler",
    description: "Плагин компилятора Compose: трансформации, composable inference, restartable groups, оптимизации.",
    subtopics: ["Compose Compiler plugin", "Composable inference", "Restartable groups", "Сканирование stable parameters", "Компиляция в bytecode", "Debugging Compose compiler"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "senior-compose-slot", categoryId: "senior-compose", name: "Slot Table",
    description: "Slot Table — внутреннее хранилище Compose для отслеживания группы,位置и, содержимого composition.",
    subtopics: ["Slot table structure", "Groups (restartable, movable)", "Positions в slot table", "Чтение/запись slots", "Slot table для lazy lists", "Оптимизации slot table"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "senior-compose-recomposer", categoryId: "senior-compose", name: "Recomposer",
    description: "Recomposer: координатор перекомпозиции, управление ожиданием, обработка ошибок, текущее состояние.",
    subtopics: ["Recomposer role", "awaitDeferred compositions", "Обработка ошибок recomposition", "CurrentRecomposer", "Принудительная recomposition", "Recomposer и爷爷 scope"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "senior-compose-snapshot", categoryId: "senior-compose", name: "Snapshot System",
    description: "Продвинутая система снимков: AtomicReference, observation, invalidation, parallel recomposition.",
    subtopics: ["Snapshot mechanics", "Observation system", "Invalidation и recomposition", "Parallel recomposition", "Атомарные операции", "Snapshot и state management"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },

  // ============================
  // Senior: Architecture & Design
  // ============================
  {
    id: "senior-arch-ddd", categoryId: "senior-arch", name: "DDD",
    description: "Domain-Driven Design в масштабе: bounded contexts, aggregates, domain events, стратегический и тактический DDD.",
    subtopics: ["Bounded Contexts (стратегический DDD)", "Aggregates (тактический DDD)", "Domain Events", "Repository per Aggregate", "Anti-corruption layer", "Context mapping"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "senior-arch-event", categoryId: "senior-arch", name: "Event Driven",
    description: "Событийно-ориентированная архитектура: pub/sub, event sourcing, CQRS, message brokers.",
    subtopics: ["Event sourcing", "CQRS", "Pub/sub паттерн", "Message brokers (Kafka, RabbitMQ)", "Event-driven в Android", "Сравнение с request/response"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "senior-arch-cqrs", categoryId: "senior-arch", name: "CQRS Basics",
    description: "Command Query Responsibility Segregation: разделение чтения и записи, проекции, read models.",
    subtopics: ["Command side", "Query side", "Проекции", "Read models", "Event Store", "Применение в Android"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "senior-arch-scalability", categoryId: "senior-arch", name: "Scalability",
    description: "Масштабируемость архитектуры: модульность, lazy loading, динамические фичи, оптимизация сборки.",
    subtopics: ["Модульная масштабируемость", "Dynamic Feature Modules", "Lazy loading", "Build cache", "Configuration cache", "Планирование роста"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "senior-arch-bounded", categoryId: "senior-arch", name: "Bounded Context",
    description: "Границы контекстов: как разделить доменную логику,避免 анемную модель, интеграция контекстов.",
    subtopics: ["Определение границ", "Совместное языковое пространство", "Интеграция контекстов", "Anti-corruption layer", "Shared kernel", "Причины разделения"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },

  // ============================
  // Senior: Data Layer
  // ============================
  {
    id: "senior-data-room", categoryId: "senior-data", name: "Room Internals",
    description: "Внутренний механизм Room: кодогенерация, bytecode, visualization, потоки данных, производительность запросов.",
    subtopics: ["Room annotation processor", "Кодогенерация DAO", "Query visualization", "Потоки (Flow, LiveData)", "Индексы", "Производительность запросов"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "senior-data-query", categoryId: "senior-data", name: "Query Optimization",
    description: "Оптимизация запросов: индексы, EXPLAIN QUERY PLAN, batch operations, tuned queries.",
    subtopics: ["Индексы (CREATE INDEX)", "EXPLAIN QUERY PLAN", "Пакетные операции (@Transaction)", "Типы колонок", "Оптимизация joins", "Фрагментация и шардинг"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "senior-data-multi", categoryId: "senior-data", name: "Multi Source Data",
    description: "Работа с несколькими источниками данных: синхронизация, приоритеты, fallback стратегии.",
    subtopics: ["Мультиисточниковая архитектура", "Приоритет источников", "Fallback стратегии", "Синхронизация данных", "Конфликты", "Offline-first multi-source"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "senior-data-sync", categoryId: "senior-data", name: "Sync Engines",
    description: "Движки синхронизации: HTTP sync, Realtime sync (WebSocket/Firebase), conflict-free replicated data.",
    subtopics: ["HTTP polling sync", "WebSocket realtime sync", "Firebase Realtime", "CRDT (conflict-free)", "Операционная трансформация", "Выбор стратегии"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },

  // ============================
  // Senior: Networking
  // ============================
  {
    id: "senior-networking-http2", categoryId: "senior-networking", name: "HTTP2",
    description: "HTTP/2: мультиплексирование, server push, HPACK сжатие заголовков, stream prioritization.",
    subtopics: ["Мультиплексирование", "Server Push", "HPACK сжатие", "Stream Prioritization", "OkHttp H2 support", "Отладка HTTP/2"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "senior-networking-http3", categoryId: "senior-networking", name: "HTTP3",
    description: "HTTP/3 на QUIC: уменьшение задержки, 0-RTT, миграция соединений, библиотеки поддержки.",
    subtopics: ["QUIC protocol", "0-RTT", "Connection migration", "QUIC vs TCP+TLS", "OkHttp HTTP/3", "Поддержка на платформе"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "senior-networking-grpc", categoryId: "senior-networking", name: "gRPC",
    description: "gRPC для Android: Protobuf, stream, bidirectional, мобильные особенности и оптимизации.",
    subtopics: ["Protobuf serialization", "Unary RPC", "Server streaming", "Client streaming", "Bidirectional streaming", "Mobile optimizations"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "senior-networking-tls", categoryId: "senior-networking", name: "TLS",
    description: "TLS 1.3, handshake, cipher suites, certificate chain validation, mobile security considerations.",
    subtopics: ["TLS 1.3", "Handshake process", "Cipher suites", "Certificate chain", "Mobile TLS quirks", "Protocol versions"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "senior-networking-cert", categoryId: "senior-networking", name: "Certificate Management",
    description: "Управление сертификатами: certificates, key stores, rotation, monitoring, revocation.",
    subtopics: ["Certificate stores", "Certificate rotation", "Monitoring expiry", "Revocation (CRL/OCSP)", "Client certificates", "Certificate Transparency"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },

  // ============================
  // Senior: Dependency Injection
  // ============================
  {
    id: "senior-di-dagger", categoryId: "senior-di", name: "Dagger Internals",
    description: "Внутренний механизм Dagger: кодогенерация компонентов, граф зависимостей, оптимизации.",
    subtopics: ["Component code generation", "Graph resolution", "Scoped components", "Subcomponents", "Provision vs Members injection", "Мультибайндинг internals"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "senior-di-graph", categoryId: "senior-di", name: "Graph Resolution",
    description: "Разрешение графа зависимостей: циклические зависимости, lazy, provider, увеличение производительности.",
    subtopics: ["Cycle detection", "@Lazy инъекция", "@Provider", "Граф производительности", "Профилирование графа", "Оптимизация графа"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "senior-di-scopes", categoryId: "senior-di", name: "Scopes Deep Dive",
    description: "Продвинутое управление областью видимости: кастомные scope, component lifecycle, binding lifecycle.",
    subtopics: ["Кастомные @Scope", "Component lifecycle", "Binding lifecycle", "Scope inheritance", "Releasing scope", "Многопоточный scope"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },

  // ============================
  // Senior: Performance
  // ============================
  {
    id: "senior-perf-anr", categoryId: "senior-perf", name: "ANR",
    description: "Application Not Responding: причины, диагностика, трассировка, профилактика ANR.",
    subtopics: ["Причины ANR", "Трассировка (trace.txt)", "Diagnosing ANR", "Main thread violations", "Приоритеты потоков", "Проактивная профилактика"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "senior-perf-framemetrics", categoryId: "senior-perf", name: "FrameMetrics",
    description: "Метрики кадров: время рендеринга, jank detection, frame timeline, GPU rendering.",
    subtopics: ["FrameMetrics API", "Jank detection", "Frame timeline", "GPU rendering profiling", "Choreographer callback", "Baseline frame times"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "senior-perf-memory", categoryId: "senior-perf", name: "Memory Profiling",
    description: "Профилирование памяти: heap dumps, allocation tracking, native memory, memory leaks.",
    subtopics: ["Heap dumps", "Allocation tracking", "Native memory profiling", "Leak detection", "Shallow vs Retained size", "Memory annotation"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "senior-perf-battery", categoryId: "senior-perf", name: "Battery Optimization",
    description: "Оптимизация энергопотребления: Doze, App Standby, WakeLock, алармы, job scheduling.",
    subtopics: ["Doze mode", "App Standby", "WakeLock (и проблемы)", "Альтернативы AlarmManager", "WorkManager best practices", "Battery profiling"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },

  // ============================
  // Senior: Testing
  // ============================
  {
    id: "senior-test-contract", categoryId: "senior-test", name: "Contract Tests",
    description: "Контрактные тесты для проверки совместимости между компонентами. Pact,.consumer-driven contracts.",
    subtopics: ["Consumer-driven contracts", "Pact framework", "Provider verification", "Публикация контрактов", "CI интеграция", "Версионирование контрактов"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "senior-test-integration", categoryId: "senior-test", name: "Integration Tests",
    description: "Интеграционные тесты: проверка взаимодействия компонентов, сетевые вызовы, БД, Android-компоненты.",
    subtopics: ["Component integration", "Network integration tests", "Database integration tests", "Android component tests", "Test rules", "Параллельное тестирование"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "senior-test-mutation", categoryId: "senior-test", name: "Mutation Tests",
    description: "Мутационное тестирование: проверка качества тестов через внесение мутаций в код, выявление слабых мест.",
    subtopics: ["PIT (PITest)", "Типы мутаций", "Убийство мутаций", "Coverage vs Mutation score", "CI интеграция", "Стоимость мутационного тестирования"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "senior-test-snapshot", categoryId: "senior-test", name: "Snapshot Tests",
    description: "Снимки UI: проверка визуальной целостности через скриншоты, обновление снимков, CI интеграция.",
    subtopics: ["Paparazzi (Android)", "Screenshot testing", "Visual regression", "Обновление снимков", "CI интеграция", "Пороги差异"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },

  // ============================
  // Senior: CI/CD
  // ============================
  {
    id: "senior-cicd-github", categoryId: "senior-cicd", name: "GitHub Actions",
    description: "Автоматизация CI/CD через GitHub Actions: сборка, тестирование, деплой, кеширование.",
    subtopics: ["Workflow файлы", "Jobs и Steps", "Кеширование зависимостей", "Секреты (env secrets)", "Matrix builds", "Reusable workflows"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "senior-cicd-fastlane", categoryId: "senior-cicd", name: "Fastlane",
    description: "Автоматизация сборки и деплоя: lanes, match (код подписи), supply (Play Store), snapshots.",
    subtopics: ["Fastfile (lanes)", "Match (код подписи)", "Supply (Play Store)", "Snapshot (скриншоты)", "Deliver", "CI интеграция"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "senior-cicd-firebase", categoryId: "senior-cicd", name: "Firebase Distribution",
    description: "Распространение APK/ AAB через Firebase App Distribution: тестирование, группы, автоматический деплой.",
    subtopics: ["Firebase App Distribution", "Тестирование через Firebase", "Группы тестеров", "Release notes", "CI интеграция", "Сравнение с alternatives"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "senior-cicd-play", categoryId: "senior-cicd", name: "Play Publishing",
    description: "Публикация в Google Play: внутренние/внешние тестирования, staged rollout, управление релизами.",
    subtopics: ["Internal / Closed / Open testing", "Staged rollout", "Play Console API", "Управление версиями", "Обратная связь", "Мониторинг статуса"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },

  // ============================
  // Senior: Security
  // ============================
  {
    id: "senior-security-owasp", categoryId: "senior-security", name: "OWASP Mobile Top 10",
    description: "Топ-10 уязвимостей мобильных приложений по OWASP: insecure storage, transport, authentication.",
    subtopics: ["Insecure Storage", "Insecure Transport", "Insecure Authentication", "Insufficient Cryptography", "Code Tampering", "Reverse Engineering"],
    maxWeight: 5, sortOrder: 1, requiredForLevelUp: false,
  },
  {
    id: "senior-security-encryption", categoryId: "senior-security", name: "Encryption",
    description: "Продвинутое шифрование: AES-GCM, RSA-OAEP, ключевые иерархии, управление жизненным циклом ключей.",
    subtopics: ["AES-GCM", "RSA-OAEP", "Key hierarchy", "Key rotation", "EncryptedFile / EncryptedSharedPreferences", "Hardware-backed keystore"],
    maxWeight: 5, sortOrder: 2, requiredForLevelUp: false,
  },
  {
    id: "senior-security-root", categoryId: "senior-security", name: "Root Detection",
    description: "Обнаружение rooted-устройств: методы проверки, кастомная детекция, ограничения и обходы.",
    subtopics: ["Методы проверки (su, SuperSU)", "SafetyNet / Play Integrity", "Кастомная детекция", "Проблемы с root detection", "Ложные срабатывания", "Balance security vs UX"],
    maxWeight: 5, sortOrder: 3, requiredForLevelUp: false,
  },
  {
    id: "senior-security-tamper", categoryId: "senior-security", name: "Tamper Detection",
    description: "Обнаружение модификации приложения: проверка подписи, целостности кода,anti-tampering.",
    subtopics: ["Signature verification", "Code integrity checks", "Self-signed APK detection", "ProGuard/R8 в защитных целях", "Временные проверки", "Обфускация логики"],
    maxWeight: 5, sortOrder: 4, requiredForLevelUp: false,
  },
  {
    id: "senior-security-leak", categoryId: "senior-security", name: "Data Leak Prevention",
    description: "Предотвращение утечек данных: безопасное хранение, передача, логирование, безопасность в памяти.",
    subtopics: ["Безопасное хранение (Keystore)", "Безопасная передача (Intent flags)", "Логирование в release", "Память (credentials в RAM)", "Бэкап и безопасность", "Проверка на утечки"],
    maxWeight: 5, sortOrder: 5, requiredForLevelUp: false,
  },
];

export function getSkillsByCategoryId(categoryId: string): Skill[] {
  return skills.filter((s) => s.categoryId === categoryId).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getSkillById(id: string): Skill | undefined {
  return skills.find((s) => s.id === id);
}

export function getSkillsByLevelId(levelId: string): Skill[] {
  const levelCategoryIds = categories
    .filter((c) => c.levelId === levelId)
    .map((c) => c.id);
  return skills.filter((s) => levelCategoryIds.includes(s.categoryId));
}
