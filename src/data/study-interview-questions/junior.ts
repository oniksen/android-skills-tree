import type { StudyInterviewTopic } from "./types";

export const juniorStudyInterviewQuestions: StudyInterviewTopic[] = [
  {
    "grade": "junior",
    "materialId": "android-basics",
    "skillId": "junior-android-studio",
    "topic": "Android Studio",
    "questions": [
      {
        "question": "Чем Logcat отличается от Debugger?",
        "answer": "Logcat пассивно показывает поток логов с уровнем, тегом и PID и содержит стектрейсы крашей; Debugger останавливает выполнение на breakpoint и позволяет шагать по коду и вычислять выражения в рантайме.",
        "rubric": "Проверяется: Чем Logcat отличается от Debugger.",
        "priority": 2,
      },
      {
        "question": "Зачем нужен Layout Inspector и почему он не работает на release-сборке?",
        "answer": "Он показывает дерево View/Compose текущего экрана со свойствами и помогает найти перекрывающий или неправильно измеренный View. Инструмент подключается к отладочному процессу, поэтому доступен только для debug-сборки.",
        "rubric": "Проверяется: Зачем нужен Layout Inspector и почему он не работает на release-сборке.",
        "priority": 2,
      },
      {
        "question": "Как найти утечку памяти через Profiler?",
        "answer": "В Memory Profiler снимают heap dump, ищут уцелевший после ухода с экрана экземпляр `Activity` и смотрят цепочку ссылок, которые его удерживают (синглтон, статическое поле, listener). Утечку подтверждают повторным дампом после принудительного GC.",
        "rubric": "Проверяется: Как найти утечку памяти через Profiler.",
        "priority": 2,
      },
      {
        "question": "Как отфильтровать логи в Logcat?",
        "answer": "Фильтруют по пакету приложения, тегу, уровню (Verbose…Assert) или регулярному выражению; тег обычно совпадает с именем класса. Это позволяет быстро найти стектрейс среди системных сообщений.",
        "rubric": "Проверяется: Как отфильтровать логи в Logcat.",
        "priority": 2,
      },
      {
        "question": "Почему нельзя ставить breakpoint в `onDraw`?",
        "answer": "`onDraw` вызывается каждый кадр, поэтому отладчик будет останавливаться десятки раз в секунду и «заморозит» отрисовку. Для таких мест используют conditional breakpoint или logpoint.",
        "rubric": "Проверяется: Почему нельзя ставить breakpoint в `onDraw`.",
        "priority": 2,
      },
      {
        "question": "Что делать, если устройство не видно в `adb devices`?",
        "answer": "Нужно включить «Параметры разработчика» и «Отладку по USB», подтвердить RSA-диалог при первом подключении и проверить драйвер, кабель и режим USB («Передача файлов»).",
        "rubric": "Проверяется: Что делать, если устройство не видно в `adb devices`.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "android-basics",
    "skillId": "junior-android-project",
    "topic": "Проект и модули",
    "questions": [
      {
        "question": "Чем `src/main`, `src/test` и `src/androidTest` различаются?",
        "answer": "`src/main` содержит код и ресурсы приложения, `src/test` — быстрые JVM-юнит-тесты (JUnit, MockK) без Android, `src/androidTest` — инструментальные тесты (Espresso), которые запускаются на устройстве и имеют доступ к Android API.",
        "rubric": "Проверяется: Чем `src/main`, `src/test` и `src/androidTest` различаются.",
        "priority": 3,
      },
      {
        "question": "Зачем выносить код в library-модуль?",
        "answer": "Модуль с плагином `com.android.library` собирается в AAR, переиспользует код и изолирует ответственность; Gradle кэширует неизменённые модули, поэтому ускоряется инкрементальная сборка. Направление зависимостей однонаправленное: `app → feature → core`.",
        "rubric": "Проверяется: Зачем выносить код в library-модуль.",
        "priority": 3,
      },
      {
        "question": "Чем APK отличается от AAB?",
        "answer": "APK устанавливается на устройство, а AAB — формат публикации в Google Play, из которого Play генерирует оптимизированные APK под плотность экрана и архитектуру. AAB нельзя поставить через `adb install`: для локальной установки нужен bundletool или собранный APK.",
        "rubric": "Проверяется: Чем APK отличается от AAB.",
        "priority": 3,
      },
      {
        "question": "Почему library-модуль не должен зависеть от app?",
        "answer": "Это создаёт циклическую зависимость, которую Gradle не соберёт. Зависимости идут только вниз по слоям: app зависит от feature, feature — от core, core — ни от чего.",
        "rubric": "Проверяется: Почему library-модуль не должен зависеть от app.",
        "priority": 3,
      },
      {
        "question": "Где объявляются зависимости проекта?",
        "answer": "В module-level `build.gradle.kts` в блоке `dependencies`; project-level файл лишь подключает плагины с `apply false`. Зависимость, добавленная в корневой файл, в модуль не попадёт.",
        "rubric": "Проверяется: Где объявляются зависимости проекта.",
        "priority": 3,
      },
      {
        "question": "Что такое `applicationId` и чем он отличается от `namespace`?",
        "answer": "`applicationId` — уникальный идентификатор приложения на устройстве и в Google Play, его можно менять для вариантов через `applicationIdSuffix`. `namespace` задаётся в build.gradle и с AGP 8.0 заменил атрибут `package` в манифесте для генерации `R` и кода.",
        "rubric": "Проверяется: Что такое `applicationId` и чем он отличается от `namespace`.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "android-basics",
    "skillId": "junior-android-gradle",
    "topic": "Gradle",
    "questions": [
      {
        "question": "В чём разница между `implementation` и `api`?",
        "answer": "`api` экспортирует зависимость потребителям модуля и добавляет её в их classpath, `implementation` оставляет её внутри модуля. По умолчанию используют `implementation`: это уменьшает classpath и ускоряет пересборку; `api` нужен, только когда типы библиотеки видны в публичном API.",
        "rubric": "Проверяется: В чём разница между `implementation` и `api`.",
        "priority": 4,
      },
      {
        "question": "Что такое build variant?",
        "answer": "Это комбинация build type (`debug`/`release`) и product flavor (`dev`/`prod`): например, `devDebug` или `prodRelease`. Gradle создаёт отдельные задачи и source sets для каждого варианта.",
        "rubric": "Проверяется: Что такое build variant.",
        "priority": 4,
      },
      {
        "question": "Чем build type отличается от product flavor?",
        "answer": "Build type задаёт режим сборки: отладка, `isMinifyEnabled`, ключ подписи. Flavor описывает вариант продукта (free/paid, dev/prod) со своим `applicationId` и ресурсами; flavor-специфичный код лежит в `src/dev/`, а не в `src/main`.",
        "rubric": "Проверяется: Чем build type отличается от product flavor.",
        "priority": 4,
      },
      {
        "question": "Зачем нужен Version Catalog?",
        "answer": "`gradle/libs.versions.toml` хранит версии и координаты в одном месте и даёт type-safe accessors вроде `libs.androidx.core.ktx`. Это устраняет дублирование версий по модулям и упрощает обновление.",
        "rubric": "Проверяется: Зачем нужен Version Catalog.",
        "priority": 4,
      },
      {
        "question": "Как исключить транзитивную зависимость?",
        "answer": "Через `exclude(group = \"...\", module = \"...\")` в объявлении зависимости или правило `resolutionStrategy`; дерево смотрят командой `./gradlew app:dependencies`. Исключать аккуратно: можно получить `NoClassDefFoundError` в рантайме.",
        "rubric": "Проверяется: Как исключить транзитивную зависимость.",
        "priority": 4,
      },
      {
        "question": "Чем AGP отличается от Gradle?",
        "answer": "Gradle — универсальный движок с графом задач и кэшированием, а AGP — плагин, добавляющий Android-задачи (AAPT2, DEX, APK/AAB, R8). Версии должны совпадать: AGP 8.x требует Gradle 8.x и JDK 17.",
        "rubric": "Проверяется: Чем AGP отличается от Gradle.",
        "priority": 4,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "android-basics",
    "skillId": "junior-android-manifest",
    "topic": "AndroidManifest",
    "questions": [
      {
        "question": "Зачем с Android 12 обязателен `android:exported`?",
        "answer": "Начиная с API 31, Activity, Service и Receiver с intent-filter обязаны явно указать этот атрибут, иначе сборка упадёт. Изменение закрыло ситуацию, когда компонент с фильтром по умолчанию становился доступен другим приложениям.",
        "rubric": "Проверяется: Зачем с Android 12 обязателен `android:exported`.",
        "priority": 2,
      },
      {
        "question": "Чем `<uses-permission>` отличается от runtime-запроса?",
        "answer": "Декларация в манифесте обязательна для всех разрешений, но dangerous (например, `CAMERA` или `ACCESS_FINE_LOCATION`) с Android 6.0 требуют ещё и согласия пользователя во время работы через `ActivityResultContracts.RequestPermission()`. Без запроса вызов упадёт с `SecurityException`.",
        "rubric": "Проверяется: Чем `<uses-permission>` отличается от runtime-запроса.",
        "priority": 2,
      },
      {
        "question": "Что такое `<intent-filter>` и зачем в нём `CATEGORY_DEFAULT`?",
        "answer": "Фильтр объявляет `<action>`, `<category>` и `<data>`, которые компонент умеет обрабатывать; по нему система находит обработчика implicit Intent. Без `android.intent.category.DEFAULT` Activity не будет найдена для неявного Intent'а.",
        "rubric": "Проверяется: Что такое `<intent-filter>` и зачем в нём `CATEGORY_DEFAULT`.",
        "priority": 2,
      },
      {
        "question": "Чем отличаются `minSdk`, `targetSdk` и `compileSdk`?",
        "answer": "`minSdk` задаёт минимальную версию Android и охват устройств, `targetSdk` — версию, под которую приложение оптимизировано и с которой система применяет поведенческие изменения, `compileSdk` — SDK, против которого компилируется код. Google Play требует актуальный `targetSdk`.",
        "rubric": "Проверяется: Чем отличаются `minSdk`, `targetSdk` и `compileSdk`.",
        "priority": 2,
      },
      {
        "question": "Почему не стоит добавлять `android:configChanges` «для всех случаев»?",
        "answer": "Атрибут отключает пересоздание Activity при указанных изменениях и вызывает `onConfigurationChanged()` вместо него, но тогда приложение само обновляет ресурсы и layout. Это легко приводит к утечкам и некорректному отображению.",
        "rubric": "Проверяется: Почему не стоит добавлять `android:configChanges` «для всех случаев».",
        "priority": 2,
      },
      {
        "question": "Чем опасно `exported=\"true\"` у всех компонентов?",
        "answer": "Экспортированный компонент может быть запущен другим приложением с произвольными extras и данными. Экспортируют только MAIN/LAUNCHER и реально нужные извне компоненты, остальным ставят `exported=\"false\"`.",
        "rubric": "Проверяется: Чем опасно `exported=\"true\"` у всех компонентов.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "android-basics",
    "skillId": "junior-android-resources",
    "topic": "Resources",
    "questions": [
      {
        "question": "Чем `dp` отличается от `sp`?",
        "answer": "`dp` масштабируется только по плотности экрана и используется для размеров и отступов, а `sp` дополнительно учитывает пользовательский масштаб шрифта. Текст поэтому всегда задают в `sp`, а `px` не рекомендуется.",
        "rubric": "Проверяется: Чем `dp` отличается от `sp`.",
        "priority": 3,
      },
      {
        "question": "Как Android выбирает ресурс под устройство?",
        "answer": "Система смотрит квалификаторы папок (`values-ru`, `values-night`, `values-sw600dp`, `drawable-xhdpi`) и берёт наиболее специфичный подходящий вариант, иначе default. Порядок квалификаторов регламентирован: ошибка в имени папки заставит Android проигнорировать её.",
        "rubric": "Проверяется: Как Android выбирает ресурс под устройство.",
        "priority": 3,
      },
      {
        "question": "Почему строки нельзя хардкодить?",
        "answer": "Хардкод в коде или XML делает локализацию невозможной и не позволяет переопределить текст под конфигурацию. Строки лежат в `res/values/strings.xml`, переводы — в `values-<язык>`, а порядок слов и множественное число задаются позиционными аргументами (`%1$s`) и `<plurals>`.",
        "rubric": "Проверяется: Почему строки нельзя хардкодить.",
        "priority": 3,
      },
      {
        "question": "Зачем иконку приложения класть в `res/mipmap`, а не в `drawable`?",
        "answer": "Отдельная mipmap-папка позволяет лаунчеру выбрать иконку нужной плотности независимо от плотности экрана устройства; иначе иконка может выглядеть размытой.",
        "rubric": "Проверяется: Зачем иконку приложения класть в `res/mipmap`, а не в `drawable`.",
        "priority": 3,
      },
      {
        "question": "Чем style отличается от theme?",
        "answer": "Style — набор атрибутов для одного View, theme — style, применённый ко всему приложению или Activity и разрешающий ссылки `?attr/...`. Лучше одна базовая тема с переопределениями, чем настройка каждой Activity.",
        "rubric": "Проверяется: Чем style отличается от theme.",
        "priority": 3,
      },
      {
        "question": "Как получить ресурс из кода?",
        "answer": "Через Context: `getString(R.string.app_name)`, `ContextCompat.getColor(...)` или `resources.getDimensionPixelSize(...)`. Обращаться к ресурсам можно, только когда Context уже доступен, — не в статическом инициализаторе.",
        "rubric": "Проверяется: Как получить ресурс из кода.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "android-basics",
    "skillId": "junior-android-context",
    "topic": "Context и Application",
    "questions": [
      {
        "question": "Чем Activity Context отличается от Application Context?",
        "answer": "Activity Context привязан к экрану, имеет тему, окно и View-иерархию и живёт до уничтожения Activity. Application Context привязан к процессу, живёт всё время работы приложения, но не имеет темы Activity и не может показывать диалоги.",
        "rubric": "Проверяется: Чем Activity Context отличается от Application Context.",
        "priority": 3,
      },
      {
        "question": "Почему нельзя хранить Activity в синглтоне?",
        "answer": "Синглтон живёт дольше экрана, поэтому ссылка на Activity не даёт GC собрать её после поворота или ухода — это утечка памяти. В долгоживущих объектах используют `applicationContext`.",
        "rubric": "Проверяется: Почему нельзя хранить Activity в синглтоне.",
        "priority": 3,
      },
      {
        "question": "Что такое утечка Context и как её найти?",
        "answer": "Это ситуация, когда статическое поле, внутренний класс, незакрытый listener или Handler удерживает ссылку на уничтоженную Activity. LeakCanary в debug-сборке показывает цепочку ссылок, которая её держит.",
        "rubric": "Проверяется: Что такое утечка Context и как её найти.",
        "priority": 3,
      },
      {
        "question": "Какой Context выбрать для диалога и для базы данных?",
        "answer": "Для UI (диалог, Toast, Snackbar, View с темой) нужен Activity Context; для БД, сети, SharedPreferences, файлов и WorkManager — Application Context, не привязанный к жизненному циклу экрана.",
        "rubric": "Проверяется: Какой Context выбрать для диалога и для базы данных.",
        "priority": 3,
      },
      {
        "question": "Зачем нужен кастомный класс `Application`?",
        "answer": "Он создаётся один раз при старте процесса до любой Activity, регистрируется в манифесте через `android:name` и служит для инициализации DI, Firebase и Crashlytics. Тяжёлую работу и сетевые запросы в `onCreate()` делать нельзя — это задерживает старт приложения.",
        "rubric": "Проверяется: Зачем нужен кастомный класс `Application`.",
        "priority": 3,
      },
      {
        "question": "Почему ViewModel не должна хранить Context?",
        "answer": "ViewModel переживает поворот экрана, а ссылка на Activity внутри неё привела бы к утечке. Зависимости передают через DI, а если Context реально нужен — берут `applicationContext`.",
        "rubric": "Проверяется: Почему ViewModel не должна хранить Context.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "android-basics",
    "skillId": "junior-android-layouts",
    "topic": "Layouts XML",
    "questions": [
      {
        "question": "Почему вредна глубокая вложенность `LinearLayout`?",
        "answer": "Каждый уровень добавляет проходы measure и layout, а `layout_weight` заставляет контейнер измерять детей дважды; при вложенности работа умножается и тормозит старт экрана. Иерархию стараются делать плоской.",
        "rubric": "Проверяется: Почему вредна глубокая вложенность `LinearLayout`.",
        "priority": 2,
      },
      {
        "question": "Чем `ConstraintLayout` лучше `RelativeLayout`?",
        "answer": "`ConstraintLayout` позиционирует детей относительно других View, родителя или guidelines и позволяет избежать вложенности; измерение `RelativeLayout` требует дорогих множественных проходов. `RelativeLayout` считается legacy и нужен в основном для старого кода.",
        "rubric": "Проверяется: Чем `ConstraintLayout` лучше `RelativeLayout`.",
        "priority": 2,
      },
      {
        "question": "Что означает `0dp` в `ConstraintLayout`?",
        "answer": "Это «match constraints»: View занимает всё доступное место между привязанными сторонами. Для детей `ConstraintLayout` это рекомендуемая замена `match_parent`.",
        "rubric": "Проверяется: Что означает `0dp` в `ConstraintLayout`.",
        "priority": 2,
      },
      {
        "question": "Для чего нужны `<include>`, `<merge>` и `<ViewStub>`?",
        "answer": "`<include>` переиспользует кусок разметки, `<merge>` убирает лишний корневой контейнер при вставке, а `<ViewStub>` лениво раздувает часть UI только после вызова `inflate()`. Все три помогают уменьшить глубину дерева.",
        "rubric": "Проверяется: Для чего нужны `<include>`, `<merge>` и `<ViewStub>`.",
        "priority": 2,
      },
      {
        "question": "Чем `match_parent` отличается от `wrap_content`?",
        "answer": "`match_parent` занимает всё доступное место родителя, `wrap_content` — размер по содержимому. `match_parent` у ребёнка `ScrollView` даёт бесконечную высоту, а `wrap_content` у корня экрана не заполнит экран.",
        "rubric": "Проверяется: Чем `match_parent` отличается от `wrap_content`.",
        "priority": 2,
      },
      {
        "question": "Как устроены проходы measure и layout?",
        "answer": "Родитель вызывает `measure()` у детей с ограничениями MeasureSpec (EXACTLY, AT_MOST, UNSPECIFIED), затем в `layout()` размещает их, после чего идёт отрисовка. Понимание двух проходов помогает найти причину нулевого размера View.",
        "rubric": "Проверяется: Как устроены проходы measure и layout.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "android-basics",
    "skillId": "junior-android-view",
    "topic": "View и ViewGroup",
    "questions": [
      {
        "question": "Чем `padding` отличается от `layout_margin`?",
        "answer": "Padding — внутренний отступ между границей View и содержимым, им управляет сам View; margin — внешний отступ до соседей, им управляет родитель через `LayoutParams`. В RTL используют `paddingStart`/`marginStart`.",
        "rubric": "Проверяется: Чем `padding` отличается от `layout_margin`.",
        "priority": 2,
      },
      {
        "question": "Что происходит при `invalidate()` и `requestLayout()`?",
        "answer": "`invalidate()` помечает View нуждающимся в перерисовке и приводит к `onDraw` без пересчёта размеров; `requestLayout()` заново запускает measure и layout, если изменились размеры или положение. Для смены цвета достаточно `invalidate()`, для смены размеров — `requestLayout()`.",
        "rubric": "Проверяется: Что происходит при `invalidate()` и `requestLayout()`.",
        "priority": 2,
      },
      {
        "question": "Почему `findViewById` заменили View Binding?",
        "answer": "`findViewById` обходит дерево (O(n)) и возвращает View, которую легко не найти и получить null; View Binding генерирует типобезопасные прямые ссылки и проверяет id на этапе компиляции. В библиотеках и legacy-коде `findViewById` ещё встречается.",
        "rubric": "Проверяется: Почему `findViewById` заменили View Binding.",
        "priority": 2,
      },
      {
        "question": "Чем `INVISIBLE` отличается от `GONE`?",
        "answer": "`INVISIBLE` не рисуется, но занимает место и участвует в measure/layout, а `GONE` не занимает место и сдвигает соседей. Для анимации появления лучше `INVISIBLE` → `VISIBLE`, чтобы не пересчитывать layout каждый кадр.",
        "rubric": "Проверяется: Чем `INVISIBLE` отличается от `GONE`.",
        "priority": 2,
      },
      {
        "question": "Что такое `WindowInsets` и зачем их обрабатывать?",
        "answer": "Это отступы системы: статус-бар, навигационная панель, вырезы и клавиатура. Их применяют к корневой разметке через `ViewCompat.setOnApplyWindowInsetsListener`; с Android 15 edge-to-edge включён по умолчанию для `targetSdk 35`, и без инсетов контент уйдёт под бары.",
        "rubric": "Проверяется: Что такое `WindowInsets` и зачем их обрабатывать.",
        "priority": 2,
      },
      {
        "question": "Чем IME insets отличаются от `systemBars()`?",
        "answer": "`Type.ime()` описывает клавиатуру и меняется, когда поле ввода получает фокус, а `Type.systemBars()` — статус и навигационные бары. Если учитывать только бары, поле уедет под клавиатуру; инсеты приходят асинхронно после первого layout.",
        "rubric": "Проверяется: Чем IME insets отличаются от `systemBars()`.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "android-basics",
    "skillId": "junior-android-lifecycle",
    "topic": "Activity Lifecycle",
    "questions": [
      {
        "question": "Какая последовательность колбэков при повороте экрана?",
        "answer": "`onPause` → `onStop` → `onSaveInstanceState` → `onDestroy`, затем у новой Activity `onCreate` → `onStart` → `onRestoreInstanceState` → `onResume`. Новая Activity получает `savedInstanceState`, а ViewModel переживает пересоздание.",
        "rubric": "Проверяется: Какая последовательность колбэков при повороте экрана.",
        "priority": 1,
      },
      {
        "question": "Чем configuration change отличается от process death?",
        "answer": "При configuration change процесс жив, Activity пересоздаётся и ViewModel сохраняется; при process death процесс убит системой, ViewModel теряется, но `savedInstanceState` и `SavedStateHandle` восстанавливаются. Критичные данные кладут в `SavedStateHandle`.",
        "rubric": "Проверяется: Чем configuration change отличается от process death.",
        "priority": 1,
      },
      {
        "question": "Почему нельзя полагаться на `onDestroy()`?",
        "answer": "Система не гарантирует его вызов: при нехватке памяти процесс может быть убит без `onDestroy()`. Ресурсы освобождают в `onPause`/`onStop`, а данные сохраняют в `onSaveInstanceState`.",
        "rubric": "Проверяется: Почему нельзя полагаться на `onDestroy()`.",
        "priority": 1,
      },
      {
        "question": "Что сохраняют в `onSaveInstanceState`?",
        "answer": "Лёгкое состояние UI (текст поля, позиция скролла) в `Bundle` с примитивами или Parcelable. Bundle ограничен примерно 1 МБ, большие списки и изображения вызывают `TransactionTooLargeException` — их хранят в ViewModel.",
        "rubric": "Проверяется: Что сохраняют в `onSaveInstanceState`.",
        "priority": 1,
      },
      {
        "question": "Почему `onPause` должен быть быстрым?",
        "answer": "Система ждёт окончания `onPause`, прежде чем показать следующий экран, поэтому там быстро освобождают камеру, датчики и анимации. Сетевой запрос запускают не здесь, а через ViewModel и корутины.",
        "rubric": "Проверяется: Почему `onPause` должен быть быстрым.",
        "priority": 1,
      },
      {
        "question": "Чем опасно подавление пересоздания через `configChanges`?",
        "answer": "`android:configChanges=\"orientation|screenSize\"` вызывает `onConfigurationChanged()` вместо пересоздания, но приложение само должно обновить ресурсы и layout. Бездумное использование ведёт к утечкам и неверному отображению.",
        "rubric": "Проверяется: Чем опасно подавление пересоздания через `configChanges`.",
        "priority": 1,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "android-basics",
    "skillId": "junior-android-intent",
    "topic": "Intent и Activity Result API",
    "questions": [
      {
        "question": "Чем explicit Intent отличается от implicit?",
        "answer": "Explicit указывает конкретный класс, например `Intent(context, DetailsActivity::class.java)`, и используется внутри приложения; implicit задаёт action (`ACTION_VIEW`) и систему просят найти обработчика. Перед запуском implicit проверяют `resolveActivity()`, иначе `ActivityNotFoundException`.",
        "rubric": "Проверяется: Чем explicit Intent отличается от implicit.",
        "priority": 2,
      },
      {
        "question": "Почему `startActivityForResult()` устарел?",
        "answer": "Его заменил Activity Result API: лаунчер регистрируют через `registerForActivityResult(contract) { ... }` до состояния STARTED, он типобезопасен, не требует `requestCode` и корректно работает при пересоздании и process death.",
        "rubric": "Проверяется: Почему `startActivityForResult()` устарел.",
        "priority": 2,
      },
      {
        "question": "Зачем нужен `PendingIntent`?",
        "answer": "Это обёртка, позволяющая системе или другому приложению выполнить ваш Intent от вашего имени: в уведомлениях, виджетах и AlarmManager. С Android 12 обязателен `FLAG_IMMUTABLE` или `FLAG_MUTABLE`, иначе `IllegalArgumentException`.",
        "rubric": "Проверяется: Зачем нужен `PendingIntent`.",
        "priority": 2,
      },
      {
        "question": "Что передают через extras и почему туда нельзя класть большие объекты?",
        "answer": "`putExtra` принимает примитивы, String, Parcelable, Serializable и Bundle; ключи принято писать с префиксом пакета. Объекты больше примерно 1 МБ вызывают `TransactionTooLargeException`, поэтому передают id и загружают данные из репозитория.",
        "rubric": "Проверяется: Что передают через extras и почему туда нельзя класть большие объекты.",
        "priority": 2,
      },
      {
        "question": "Что делает `Intent.createChooser`?",
        "answer": "Он гарантирует показ системного диалога «Поделиться», даже если приложение по умолчанию уже выбрано; MIME-тип (`text/plain`, `image/*`) определяет список приложений. Для нескольких файлов используют `ACTION_SEND_MULTIPLE`.",
        "rubric": "Проверяется: Что делает `Intent.createChooser`.",
        "priority": 2,
      },
      {
        "question": "Чем статические App Shortcuts отличаются от динамических?",
        "answer": "Статические объявляются в `res/xml/shortcuts.xml` и манифесте, динамические создаются через `ShortcutManager` и могут меняться во время работы; pinned-ярлыки закрепляет пользователь. Статических ярлыков можно не больше 4.",
        "rubric": "Проверяется: Чем статические App Shortcuts отличаются от динамических.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "android-basics",
    "skillId": "junior-android-permissions",
    "topic": "Permissions",
    "questions": [
      {
        "question": "Чем normal permission отличается от dangerous?",
        "answer": "Normal (`INTERNET`, `VIBRATE`) выдаётся автоматически при установке; dangerous (`CAMERA`, `ACCESS_FINE_LOCATION`) с Android 6.0 требует runtime-согласия пользователя. Оба типа всё равно объявляют в манифесте через `<uses-permission>`.",
        "rubric": "Проверяется: Чем normal permission отличается от dangerous.",
        "priority": 3,
      },
      {
        "question": "Как обработать отказ «Больше не спрашивать»?",
        "answer": "После повторного отказа `shouldShowRequestPermissionRationale()` возвращает false и системный диалог больше не появится. Пользователя направляют в настройки через `Settings.ACTION_APPLICATION_DETAILS_SETTINGS` и сохраняют запасной путь (например, выбрать фото из галереи).",
        "rubric": "Проверяется: Как обработать отказ «Больше не спрашивать».",
        "priority": 3,
      },
      {
        "question": "Что изменилось с уведомлениями в Android 13?",
        "answer": "Показ уведомлений потребовал dangerous-разрешения `POST_NOTIFICATIONS`, которое запрашивают через `ActivityResultContracts.RequestPermission()`; без него `notify()` тихо игнорируется. На Android 12 и ниже разрешение не нужно.",
        "rubric": "Проверяется: Что изменилось с уведомлениями в Android 13.",
        "priority": 3,
      },
      {
        "question": "Как проверить и запросить разрешение?",
        "answer": "Сначала `ContextCompat.checkSelfPermission(...) == PackageManager.PERMISSION_GRANTED`, иначе `registerForActivityResult(ActivityResultContracts.RequestPermission())` и `launch(...)`. Запрашивают в контексте действия пользователя, а не при старте приложения.",
        "rubric": "Проверяется: Как проверить и запросить разрешение.",
        "priority": 3,
      },
      {
        "question": "Что такое one-time permission и auto-reset?",
        "answer": "С Android 11 пользователь может выдать разрешение «только в этот раз», а для давно неиспользуемых приложений разрешения сбрасываются автоматически. Поэтому статус проверяют перед каждым использованием, а не кэшируют навсегда.",
        "rubric": "Проверяется: Что такое one-time permission и auto-reset.",
        "priority": 3,
      },
      {
        "question": "Зачем в Android 13 появились гранулярные медиа-разрешения?",
        "answer": "`READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO` и `READ_MEDIA_AUDIO` заменили широкое `READ_EXTERNAL_STORAGE`. Ещё лучше использовать Photo Picker и не запрашивать разрешение на медиа вообще.",
        "rubric": "Проверяется: Зачем в Android 13 появились гранулярные медиа-разрешения.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "android-basics",
    "skillId": "junior-android-task",
    "topic": "Task и Back Stack",
    "questions": [
      {
        "question": "Чем Back отличается от Up?",
        "answer": "Back — системная навигация: завершает текущую Activity и возвращает к предыдущей в Back Stack; Up возвращает к логическому родителю (`android:parentActivityName` или Navigation Graph) и может создать его заново. Back работает на уровне задачи, Up — внутри приложения.",
        "rubric": "Проверяется: Чем Back отличается от Up.",
        "priority": 3,
      },
      {
        "question": "Чем `singleTop` отличается от `singleTask`?",
        "answer": "`singleTop` не создаёт новую копию, если Activity уже на верху стека, и доставляет Intent в `onNewIntent()`; `singleTask` делает её корнем задачи и уничтожает всё, что лежало выше. По умолчанию используют `standard`.",
        "rubric": "Проверяется: Чем `singleTop` отличается от `singleTask`.",
        "priority": 3,
      },
      {
        "question": "Зачем нужен `FLAG_ACTIVITY_CLEAR_TOP`?",
        "answer": "Если Activity уже есть в стеке, флаг уничтожает все лежащие выше неё; сама Activity пересоздаётся или получает Intent через `onNewIntent()`, если она `singleTop`. Его часто комбинируют с `FLAG_ACTIVITY_NEW_TASK`.",
        "rubric": "Проверяется: Зачем нужен `FLAG_ACTIVITY_CLEAR_TOP`.",
        "priority": 3,
      },
      {
        "question": "Почему при запуске из Service или уведомления нужен `FLAG_ACTIVITY_NEW_TASK`?",
        "answer": "У Service и Receiver нет Activity-контекста, и без флага `startActivity()` упадёт. Для полного «сброса» стека при логауте используют `NEW_TASK` вместе с `FLAG_ACTIVITY_CLEAR_TASK`.",
        "rubric": "Проверяется: Почему при запуске из Service или уведомления нужен `FLAG_ACTIVITY_NEW_TASK`.",
        "priority": 3,
      },
      {
        "question": "Чем Task отличается от процесса?",
        "answer": "Task — пользовательский контекст, стек Activity в Recents; процесс — исполнение кода. Система может убить процесс, но Back Stack сохранится и Activity воссоздадутся, поэтому данные нельзя держать только в статических полях.",
        "rubric": "Проверяется: Чем Task отличается от процесса.",
        "priority": 3,
      },
      {
        "question": "Чем App Link отличается от обычного Deep Link?",
        "answer": "App Link — HTTPS-ссылка с `android:autoVerify=\"true\"`, домен подтверждён через Digital Asset Links и открывается без диалога выбора; Deep Link вида `myapp://` может показать chooser. Параметры извлекают из `intent.data`.",
        "rubric": "Проверяется: Чем App Link отличается от обычного Deep Link.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "android-basics",
    "skillId": "junior-android-main-thread",
    "topic": "Main Thread и ANR",
    "questions": [
      {
        "question": "Что такое ANR и через какое время он возникает?",
        "answer": "ANR (Application Not Responding) — системный диалог, когда главный поток не отвечает: 5 секунд на ввод для Activity, 10 — на `onReceive` BroadcastReceiver, 20 — на `onStartCommand`/`onBind` Service. Это не исключение, try/catch здесь не поможет.",
        "rubric": "Проверяется: Что такое ANR и через какое время он возникает.",
        "priority": 3,
      },
      {
        "question": "Почему нельзя делать сетевой запрос в UI-потоке?",
        "answer": "Сеть блокирует поток: пока идёт ответ, очередь сообщений главного потока стоит, интерфейс замирает и может появиться ANR. В debug такой вызов ловится как `NetworkOnMainThreadException`; запросы уносят в `Dispatchers.IO`.",
        "rubric": "Проверяется: Почему нельзя делать сетевой запрос в UI-потоке.",
        "priority": 3,
      },
      {
        "question": "Как диагностировать ANR?",
        "answer": "Снимают `adb bugreport` (каталог `/data/anr/` приложению недоступен), смотрят трассировку главного потока в Android Studio Profiler и агрегированные данные в Play Console (Android Vitals). Ищут место, где поток «застрял».",
        "rubric": "Проверяется: Как диагностировать ANR.",
        "priority": 3,
      },
      {
        "question": "Почему нельзя обновлять View из фонового потока?",
        "answer": "View-система не потокобезопасна: обращение не из главного потока даёт `CalledFromWrongThreadException`. Вернуться в UI помогают `Dispatchers.Main`, `runOnUiThread` и `view.post {}`.",
        "rubric": "Проверяется: Почему нельзя обновлять View из фонового потока.",
        "priority": 3,
      },
      {
        "question": "Как устроен цикл сообщений главного потока?",
        "answer": "Looper берёт сообщения из MessageQueue и выполняет их строго по очереди: пока предыдущее не завершилось, следующее не начнётся. Choreographer синхронизирует отрисовку с vsync, поэтому работа дольше ~16 мс пропускает кадры.",
        "rubric": "Проверяется: Как устроен цикл сообщений главного потока.",
        "priority": 3,
      },
      {
        "question": "Чем помогает StrictMode?",
        "answer": "В debug-сборке `StrictMode.ThreadPolicy` с `detectNetwork()`, `detectDiskReads()` и `penaltyLog()` пишет в логи блокирующие операции главного потока, не ломая приложение.",
        "rubric": "Проверяется: Чем помогает StrictMode.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "android-basics",
    "skillId": "junior-android-toast",
    "topic": "Toast, Dialog и Snackbar",
    "questions": [
      {
        "question": "Чем Snackbar отличается от Toast?",
        "answer": "Toast — краткое сообщение без действий, которое нельзя отменить; Snackbar привязан к корневому View (обычно `CoordinatorLayout`), поддерживает кнопку действия и сам сдвигается при появлении `FloatingActionButton` или клавиатуры. Когда нужна кнопка «Отменить», выбирают Snackbar.",
        "rubric": "Проверяется: Чем Snackbar отличается от Toast.",
        "priority": 3,
      },
      {
        "question": "Почему DialogFragment предпочтительнее AlertDialog?",
        "answer": "AlertDialog, созданный напрямую, уничтожается при повороте экрана и может вызвать утечку; DialogFragment — Fragment, чьё состояние сохраняется FragmentManager, поэтому диалог переживает configuration change. Данные передают через arguments.",
        "rubric": "Проверяется: Почему DialogFragment предпочтительнее AlertDialog.",
        "priority": 3,
      },
      {
        "question": "Как сохранить диалог при повороте экрана?",
        "answer": "Оформить его как `DialogFragment` и показывать через `show(parentFragmentManager, tag)`, а результат возвращать через Fragment Result API (`setFragmentResult` / `setFragmentResultListener`), а не прямой ссылкой на Activity.",
        "rubric": "Проверяется: Как сохранить диалог при повороте экрана.",
        "priority": 3,
      },
      {
        "question": "Когда используют `setCancelable(false)`?",
        "answer": "Для критических решений, которые пользователь не должен закрыть кнопкой «Назад» или касанием вне диалога. В остальных случаях модальный диалог лучше не злоупотреблять — он прерывает поток работы.",
        "rubric": "Проверяется: Когда используют `setCancelable(false)`.",
        "priority": 3,
      },
      {
        "question": "Как передать результат диалога в ViewModel?",
        "answer": "Диалог только собирает решение: слушатель или Fragment Result API доставляет его хосту, а бизнес-логику выполняют ViewModel и Repository. Так диалог не удерживает ссылки и легко тестируется.",
        "rubric": "Проверяется: Как передать результат диалога в ViewModel.",
        "priority": 3,
      },
      {
        "question": "Какие уведомления считаются «лёгкими», а какие — модальными?",
        "answer": "Лёгкие: Toast для подтверждения и Snackbar для сообщения с действием; модальные: `AlertDialog` и BottomSheet, когда нужен явный ответ. Для уведомлений, не привязанных к экрану, используют системные Notifications.",
        "rubric": "Проверяется: Какие уведомления считаются «лёгкими», а какие — модальными.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "android-basics",
    "skillId": "junior-android-notifications",
    "topic": "Notifications",
    "questions": [
      {
        "question": "Зачем нужны NotificationChannel?",
        "answer": "С Android 8.0 (API 26) каждое уведомление обязано принадлежать каналу, который задаёт звук, вибрацию и importance; пользователь меняет эти настройки в системе. Канал нельзя пересоздать с новыми значениями — `deleteNotificationChannel()` не сбрасывает их.",
        "rubric": "Проверяется: Зачем нужны NotificationChannel.",
        "priority": 3,
      },
      {
        "question": "Что даёт `POST_NOTIFICATIONS`?",
        "answer": "С Android 13 (API 33) показ уведомлений требует этого dangerous-разрешения, запрашиваемого через `ActivityResultContracts.RequestPermission()`. Без него `notify()` тихо игнорируется; на Android 12 и ниже разрешение не нужно.",
        "rubric": "Проверяется: Что даёт `POST_NOTIFICATIONS`.",
        "priority": 3,
      },
      {
        "question": "Зачем в уведомлении нужен `PendingIntent`?",
        "answer": "Он задаёт действие по клику (`setContentIntent`) или кнопки (`addAction`) и выполняется системой от имени приложения. С Android 12 обязателен `FLAG_IMMUTABLE`, если extras не меняются, или `FLAG_MUTABLE`; requestCode должен быть уникальным.",
        "rubric": "Проверяется: Зачем в уведомлении нужен `PendingIntent`.",
        "priority": 3,
      },
      {
        "question": "Что обязательно для уведомления foreground-службы?",
        "answer": "`startForeground()` нужно вызвать в течение 5 секунд после запуска, уведомление делают `ongoing`; с Android 14 (API 34) объявляют `foregroundServiceType` и получают разрешение. По завершении вызывают `stopForeground(STOP_FOREGROUND_REMOVE)` и `stopSelf()`.",
        "rubric": "Проверяется: Что обязательно для уведомления foreground-службы.",
        "priority": 3,
      },
      {
        "question": "Как обновить уже показанное уведомление?",
        "answer": "Повторный `notify()` с тем же id обновляет его, например меняет прогресс-бар через `setProgress`. `setAutoCancel(true)` закрывает уведомление, когда пользователь по нему кликнул.",
        "rubric": "Проверяется: Как обновить уже показанное уведомление.",
        "priority": 3,
      },
      {
        "question": "Чем Notification message отличается от Data message в FCM?",
        "answer": "Notification message показывает система FCM, когда приложение в фоне, а в foreground сообщение приходит в `onMessageReceived`. Data message всегда доставляется в `onMessageReceived`, и приложение само решает, что показать.",
        "rubric": "Проверяется: Чем Notification message отличается от Data message в FCM.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "android-basics",
    "skillId": "junior-android-security",
    "topic": "Android Security Basics",
    "questions": [
      {
        "question": "Что такое Application Sandbox?",
        "answer": "Каждое приложение получает уникальный Linux UID, а его файлы в `/data/data/<package>` принадлежат этому UID, поэтому другие приложения не могут их прочитать; дополнительно доступ ограничивают SELinux и permissions. Sandbox не защищает от root, бэкапов и ошибок самого приложения.",
        "rubric": "Проверяется: Что такое Application Sandbox.",
        "priority": 2,
      },
      {
        "question": "Почему нельзя хранить секреты в исходном коде?",
        "answer": "APK легко декомпилируется (apktool, jadx), поэтому API-ключи и токены в `strings.xml` или `BuildConfig` перестают быть секретами. Секреты держат на сервере, а клиентские ключи ограничивают по package name и SHA-1; обфускация R8 — не шифрование.",
        "rubric": "Проверяется: Почему нельзя хранить секреты в исходном коде.",
        "priority": 2,
      },
      {
        "question": "Чем опасно логирование персональных данных?",
        "answer": "Логи читаются через `logcat`, и токены, email или тела запросов в `Log.d` становятся утечкой; разрешение `READ_LOGS` обычному приложению не выдаётся, но логи попадают в bugreport. В release логи отключают, например через Timber, и оставляют только идентификаторы.",
        "rubric": "Проверяется: Чем опасно логирование персональных данных.",
        "priority": 2,
      },
      {
        "question": "Как безопасно хранить токен?",
        "answer": "В Android Keystore или в DataStore с шифрованием; Jetpack Security Crypto (`EncryptedSharedPreferences`, `EncryptedFile`) объявлен deprecated и считается legacy-подходом. Нельзя класть токен в обычные SharedPreferences, внешнее хранилище или кэш.",
        "rubric": "Проверяется: Как безопасно хранить токен.",
        "priority": 2,
      },
      {
        "question": "Почему важен принцип минимальных разрешений?",
        "answer": "Каждое лишнее разрешение расширяет поверхность атаки и снижает доверие пользователя: лучше Photo Picker вместо доступа к медиа и `ACCESS_COARSE_LOCATION` вместо `FINE`. С Android 11 видимость других приложений ограничивается через `<queries>` в манифесте.",
        "rubric": "Проверяется: Почему важен принцип минимальных разрешений.",
        "priority": 2,
      },
      {
        "question": "Чем опасно `exported=\"true\"`?",
        "answer": "Экспортированный компонент доступен другим приложениям, которые могут передать произвольные extras или URI. По умолчанию ставят `exported=\"false\"`, а входные данные экспортированных компонентов валидируют и ограничивают через `android:permission`.",
        "rubric": "Проверяется: Чем опасно `exported=\"true\"`.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "architecture-basics",
    "skillId": "junior-arch-mvc",
    "topic": "MVC",
    "questions": [
      {
        "question": "Почему в MVC на Android Activity часто становится «толстым» контроллером?",
        "answer": "Activity одновременно играет роль View и Controller: держит ссылки на View-компоненты, обрабатывает клики и сама вызывает репозиторий. Без явной границы между ролями в ней скапливаются привязка View, сетевые запросы и работа с БД, что приводит к Massive Activity.",
        "rubric": "Проверяется: Почему в MVC на Android Activity часто становится «толстым» контроллером.",
        "priority": 3,
      },
      {
        "question": "Кто владеет моделью в MVC и что в неё входит?",
        "answer": "Модель — это данные приложения и правила работы с ними: сущности, валидация, преобразования, доступ к БД и сети. Она ничего не знает о View, Activity и жизненном цикле Android, поэтому её тестируют на JVM отдельно от экрана.",
        "rubric": "Проверяется: Кто владеет моделью в MVC и что в неё входит.",
        "priority": 3,
      },
      {
        "question": "Чем MVC отличается от MVP?",
        "answer": "В MVP логика представления вынесена в Presenter, а View описана интерфейсом и стала пассивной; в Android-MVC обе роли часто совмещены в Activity. Presenter тестируется без эмулятора, а в MVC тестируемая логика обычно завязана на Activity.",
        "rubric": "Проверяется: Чем MVC отличается от MVP.",
        "priority": 3,
      },
      {
        "question": "Чем MVC отличается от MVVM?",
        "answer": "В MVVM состояние экрана живёт в ViewModel и обновляет UI реактивно через `StateFlow`, а Activity/Fragment только подписываются и отправляют события. В MVC обновление View происходит вручную, а состояние часто хранится прямо в Activity и теряется при пересоздании.",
        "rubric": "Проверяется: Чем MVC отличается от MVVM.",
        "priority": 3,
      },
      {
        "question": "Что происходит с состоянием MVC-экрана при повороте экрана?",
        "answer": "Activity уничтожается и создаётся заново, поэтому данные в её полях теряются, если их не сохранить вручную (например, через `onSaveInstanceState`). Отсутствие компонента, который переживает смену конфигурации, — одно из главных ограничений MVC на Android.",
        "rubric": "Проверяется: Что происходит с состоянием MVC-экрана при повороте экрана.",
        "priority": 3,
      },
      {
        "question": "В чём разница между классическим MVC и тем, что получается на Android по умолчанию?",
        "answer": "В классическом MVC Controller — отдельный компонент: получает событие от View, меняет Model и обновляет View. На Android эту роль обычно берёт сама Activity, круг замыкается в одном классе, и границы между ролями стираются.",
        "rubric": "Проверяется: В чём разница между классическим MVC и тем, что получается на Android по умолчанию.",
        "priority": 3,
      },
      {
        "question": "Зачем изучать MVC, если в новых проектах она почти не встречается?",
        "answer": "MVC — концептуальная модель разделения на данные, отображение и логику; MVP и MVVM — ответ на её проблемы применительно к Android. Понимание MVC помогает читать legacy-код и видеть, зачем появились ViewModel и реактивные потоки.",
        "rubric": "Проверяется: Зачем изучать MVC, если в новых проектах она почти не встречается.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "architecture-basics",
    "skillId": "junior-arch-mvp",
    "topic": "MVP",
    "questions": [
      {
        "question": "Чем MVP отличается от MVC?",
        "answer": "В MVP Presenter — отдельный класс, а View описана интерфейсом и стала пассивной: она только показывает данные и передаёт события. Это убирает логику из Activity и позволяет тестировать Presenter на JVM, тогда как в Android-MVC логика обычно остаётся в Activity.",
        "rubric": "Проверяется: Чем MVP отличается от MVC.",
        "priority": 3,
      },
      {
        "question": "Где в MVP живёт бизнес-логика?",
        "answer": "Логика представления живёт в Presenter: он реагирует на действия пользователя, вызывает Model через репозиторий и решает, что показать: загрузку, данные или ошибку. Чистые бизнес-правила и данные остаются в Model, а View не принимает решений.",
        "rubric": "Проверяется: Где в MVP живёт бизнес-логика.",
        "priority": 3,
      },
      {
        "question": "Почему View в MVP описывают интерфейсом?",
        "answer": "Интерфейс делает View заменяемой: в тесте вместо Activity подставляют фейковую View и проверяют вызовы `showLoading()` или `showUser(user)`. В production интерфейс реализует Activity/Fragment, делегируя обновление реальным View-компонентам.",
        "rubric": "Проверяется: Почему View в MVP описывают интерфейсом.",
        "priority": 3,
      },
      {
        "question": "Что такое Contract в MVP?",
        "answer": "Contract — обычно пара интерфейсов View и Presenter в одном файле: он фиксирует, что экран умеет показывать и какие события отправляет. Граница слоёв становится явной, а весь контракт экрана видно в одном месте.",
        "rubric": "Проверяется: Что такое Contract в MVP.",
        "priority": 3,
      },
      {
        "question": "Переживает ли Presenter поворот экрана?",
        "answer": "В классическом MVP нет: Presenter привязан к жизненному циклу View и создаётся заново вместе с Activity, поэтому состояние теряется, если его не сохранить вручную. Эту проблему решает ViewModel в MVVM — она переживает configuration change.",
        "rubric": "Проверяется: Переживает ли Presenter поворот экрана.",
        "priority": 3,
      },
      {
        "question": "Почему Presenter не должен держать сильную ссылку на View?",
        "answer": "Activity может быть уничтожена, и ссылка на неё в долгоживущем Presenter приведёт к утечке памяти: сборщик мусора не сможет освободить Activity. Поэтому используют `attachView`/`detachView`, обнуляют ссылку в `onDestroy` и проверяют, что View жива, перед вызовом её методов.",
        "rubric": "Проверяется: Почему Presenter не должен держать сильную ссылку на View.",
        "priority": 3,
      },
      {
        "question": "Как тестируют Presenter и почему это дешевле тестов Activity?",
        "answer": "Presenter зависит только от интерфейсов: подставляют фейковую View и фейковый репозиторий, запускают корутины через `runTest` и проверяют порядок вызовов. Эмулятор не нужен, поэтому тесты быстрые и детерминированные.",
        "rubric": "Проверяется: Как тестируют Presenter и почему это дешевле тестов Activity.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "architecture-basics",
    "skillId": "junior-arch-mvvm",
    "topic": "MVVM",
    "questions": [
      {
        "question": "Кто владеет состоянием в MVVM?",
        "answer": "Состояние экрана хранится в ViewModel: она держит `MutableStateFlow` и отдаёт наружу только read-only `StateFlow`. View не хранит свою копию, а отображает то, что пришло из ViewModel.",
        "rubric": "Проверяется: Кто владеет состоянием в MVVM.",
        "priority": 1,
      },
      {
        "question": "Чем `StateFlow` полезен для UI-состояния?",
        "answer": "`StateFlow` — горячий поток, который всегда хранит текущее значение и сразу отдаёт его новому подписчику. После переподписки (например, после поворота) View получит актуальное состояние, а обновления доставляются через `collect`.",
        "rubric": "Проверяется: Чем `StateFlow` полезен для UI-состояния.",
        "priority": 1,
      },
      {
        "question": "Почему наружу отдают `StateFlow`, а не `MutableStateFlow`?",
        "answer": "Так только ViewModel может менять состояние, а View — только наблюдать за ним. Все изменения проходят через методы ViewModel, поэтому поток остаётся предсказуемым.",
        "rubric": "Проверяется: Почему наружу отдают `StateFlow`, а не `MutableStateFlow`.",
        "priority": 1,
      },
      {
        "question": "Почему View не должна лезть во внутренности ViewModel и менять `_state.value`?",
        "answer": "Прямое изменение состояния из View нарушает инкапсуляцию и односторонний поток: изменение идёт в обход событий, его нельзя логировать или воспроизвести в тесте. Вместо этого View вызывает публичный метод (`load()`, `onItemClick(id)`), а ViewModel сама обновляет состояние.",
        "rubric": "Проверяется: Почему View не должна лезть во внутренности ViewModel и менять `_state.value`.",
        "priority": 1,
      },
      {
        "question": "Что делать с одноразовыми событиями вроде Snackbar или перехода на другой экран?",
        "answer": "Их не смешивают с состоянием, а отправляют в отдельный поток — `SharedFlow` или `Channel`, который View собирает один раз. Если использовать для этого `StateFlow`, повторная подписка после поворота покажет старое событие снова.",
        "rubric": "Проверяется: Что делать с одноразовыми событиями вроде Snackbar или перехода на другой экран.",
        "priority": 1,
      },
      {
        "question": "Как View подписывается на состояние во View-системе и зачем нужен `repeatOnLifecycle`?",
        "answer": "Подписку запускают в `viewLifecycleOwner.lifecycleScope` с `repeatOnLifecycle(Lifecycle.State.STARTED)`, чтобы сбор шёл только когда экран виден. Без этого корутина в `lifecycleScope` живёт до уничтожения View и продолжает обновлять невидимый UI в фоне.",
        "rubric": "Проверяется: Как View подписывается на состояние во View-системе и зачем нужен `repeatOnLifecycle`.",
        "priority": 1,
      },
      {
        "question": "Как подписка на состояние выглядит в Compose?",
        "answer": "`@Composable`-функция вызывает `collectAsState()`, который превращает `StateFlow` в Compose `State` и перерисовывает UI при каждом новом значении. UI становится функцией состояния: `when (state)` выбирает нужный вариант экрана.",
        "rubric": "Проверяется: Как подписка на состояние выглядит в Compose.",
        "priority": 1,
      },
      {
        "question": "Чем MVVM лучше MVP при повороте экрана?",
        "answer": "ViewModel переживает configuration change и хранит состояние в `StateFlow`, поэтому после пересоздания Activity View заново подписывается и получает актуальные данные. В MVP Presenter создаётся заново, и состояние приходится сохранять вручную.",
        "rubric": "Проверяется: Чем MVVM лучше MVP при повороте экрана.",
        "priority": 1,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "architecture-basics",
    "skillId": "junior-arch-livedata",
    "topic": "LiveData Basics",
    "questions": [
      {
        "question": "Чем `LiveData` отличается от `StateFlow`?",
        "answer": "`LiveData` привязана к Android-жизненному циклу и уведомляет только активных наблюдателей (STARTED/RESUMED), тогда как `StateFlow` входит в Kotlin Coroutines, не зависит от Android и сразу отдаёт последнее значение новым подписчикам. Для нового кода, особенно с Compose, предпочитают `StateFlow`.",
        "rubric": "Проверяется: Чем `LiveData` отличается от `StateFlow`.",
        "priority": 3,
      },
      {
        "question": "Почему `LiveData` называют lifecycle-aware?",
        "answer": "Она знает состояние `LifecycleOwner`: при переходе в STOPPED наблюдение приостанавливается, а при DESTROYED наблюдатель удаляется автоматически. Это избавляет от ручной отписки и защищает от обновления уничтоженного UI.",
        "rubric": "Проверяется: Почему `LiveData` называют lifecycle-aware.",
        "priority": 3,
      },
      {
        "question": "Что происходит с наблюдателями при повороте экрана?",
        "answer": "Старый `LifecycleOwner` уничтожается, и его наблюдатели снимаются автоматически; новый экран при подписке через `observe()` сразу получает последнее значение. Данные в ViewModel при этом сохраняются, поэтому подписка просто пересоздаётся.",
        "rubric": "Проверяется: Что происходит с наблюдателями при повороте экрана.",
        "priority": 3,
      },
      {
        "question": "В чём разница между `setValue` и `postValue`?",
        "answer": "`setValue` обновляет значение синхронно и вызывается только из главного потока, а `postValue` планирует обновление на главный поток из фонового. При нескольких `postValue` подряд до главного потока доходит только последнее значение, поэтому промежуточные обновления теряются.",
        "rubric": "Проверяется: В чём разница между `setValue` и `postValue`.",
        "priority": 3,
      },
      {
        "question": "Зачем нужны `MutableLiveData` и приватное поле?",
        "answer": "`LiveData<T>` снаружи только читается, а изменение доступно через `MutableLiveData<T>`: обычно это приватный `_user` и публичный `user: LiveData<User>`. Так View не может изменить состояние напрямую.",
        "rubric": "Проверяется: Зачем нужны `MutableLiveData` и приватное поле.",
        "priority": 3,
      },
      {
        "question": "Что делают `Transformations.map` и `switchMap`?",
        "answer": "`map` создаёт новую `LiveData`, применяя функцию к каждому значению источника, а `switchMap` переключается на новую `LiveData`, возвращённую функцией при каждом изменении источника (аналог `flatMapLatest`). В современном коде вместо них используют операторы Flow: `map` и `flatMapLatest`.",
        "rubric": "Проверяется: Что делают `Transformations.map` и `switchMap`.",
        "priority": 3,
      },
      {
        "question": "Почему во Fragment используют `viewLifecycleOwner`, а не `this`?",
        "answer": "Жизненный цикл View короче lifecycle самого Fragment (`onCreateView`…`onDestroyView`). Подписка с `viewLifecycleOwner` корректно отменится при уничтожении View, а подписка с `this` проживёт дольше и может обновить несуществующий UI.",
        "rubric": "Проверяется: Почему во Fragment используют `viewLifecycleOwner`, а не `this`.",
        "priority": 3,
      },
      {
        "question": "Почему тестировать `LiveData` сложнее, чем `StateFlow`?",
        "answer": "Наблюдение привязано к главному потоку, поэтому в тестах нужен `InstantTaskExecutorRule`, делающий главный поток синхронным, и `getOrAwaitValue()` для чтения значения. Для `StateFlow` достаточно `runTest` и чтения `.value`.",
        "rubric": "Проверяется: Почему тестировать `LiveData` сложнее, чем `StateFlow`.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "architecture-basics",
    "skillId": "junior-arch-viewmodel",
    "topic": "ViewModel",
    "questions": [
      {
        "question": "Почему `ViewModel` переживает поворот экрана?",
        "answer": "Она хранится в `ViewModelStore`, привязанном к Activity/Fragment, который не уничтожается при смене конфигурации: создаётся заново только View, а ViewModel переиспользуется. Поэтому состояние в `StateFlow` и запущенные корутины продолжают жить.",
        "rubric": "Проверяется: Почему `ViewModel` переживает поворот экрана.",
        "priority": 2,
      },
      {
        "question": "Переживает ли `ViewModel` убийство процесса?",
        "answer": "Нет: при process death создаётся новый процесс, и ViewModel появляется заново с начальным состоянием. Для данных, которые должны выжить (поисковый запрос, идентификатор), используют `SavedStateHandle` или постоянное хранилище.",
        "rubric": "Проверяется: Переживает ли `ViewModel` убийство процесса.",
        "priority": 2,
      },
      {
        "question": "Почему в `ViewModel` нельзя хранить ссылку на View, binding или `Context`?",
        "answer": "View и binding живут короче ViewModel (во Fragment — между `onCreateView` и `onDestroyView`), поэтому после пересоздания ссылка станет устаревшей и вызовет утечку памяти. ViewModel зависит только от данных и абстракций; исключение — разве что `Application`-контекст.",
        "rubric": "Проверяется: Почему в `ViewModel` нельзя хранить ссылку на View, binding или `Context`.",
        "priority": 2,
      },
      {
        "question": "Чем `viewModelScope` отличается от `GlobalScope`?",
        "answer": "`viewModelScope` привязан к жизненному циклу ViewModel и автоматически отменяет все корутины, когда экран окончательно закрывается. `GlobalScope` живёт весь процесс, не отменяется сам и легко приводит к утечкам и работе с устаревшими данными. Подробнее: [ViewModel overview](https://developer.android.com/topic/libraries/architecture/viewmodel).",
        "rubric": "Проверяется: Чем `viewModelScope` отличается от `GlobalScope`.",
        "priority": 2,
      },
      {
        "question": "Как получают ViewModel в Activity и Fragment?",
        "answer": "Используют делегаты `by viewModels()` для своего экрана или `by activityViewModels()` для общей с Activity; в Compose — `viewModel()` из `androidx.lifecycle.viewmodel.compose`. Один раз созданная ViewModel переиспользуется при пересоздании владельца.",
        "rubric": "Проверяется: Как получают ViewModel в Activity и Fragment.",
        "priority": 2,
      },
      {
        "question": "Зачем нужен `ViewModelProvider.Factory`?",
        "answer": "Фреймворк создаёт ViewModel сам, поэтому при наличии зависимостей нужно указать, как их передать: фабрика знает, как сконструировать ViewModel с репозиторием. С Hilt фабрика генерируется автоматически через `@HiltViewModel`.",
        "rubric": "Проверяется: Зачем нужен `ViewModelProvider.Factory`.",
        "priority": 2,
      },
      {
        "question": "Что такое Shared ViewModel и когда она нужна?",
        "answer": "Это одна ViewModel для нескольких Fragment в рамках Activity (`by activityViewModels()`), удобная для обмена данными между экранами без аргументов. Она живёт, пока жива Activity, и её не стоит превращать в глобальное хранилище.",
        "rubric": "Проверяется: Что такое Shared ViewModel и когда она нужна.",
        "priority": 2,
      },
      {
        "question": "Как тестируют ViewModel?",
        "answer": "На JVM: подменяют репозиторий фейком, запускают корутины через `runTest` и проверяют значения `StateFlow` (для нескольких эмиссий — с Turbine). Эмулятор не нужен, потому что ViewModel зависит только от абстракций.",
        "rubric": "Проверяется: Как тестируют ViewModel.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "architecture-basics",
    "skillId": "junior-arch-repository",
    "topic": "Repository",
    "questions": [
      {
        "question": "Зачем нужен слой Repository?",
        "answer": "Он скрывает от ViewModel детали источников данных (сеть, БД, кэш) и даёт единый интерфейс для работы с сущностью. Политика получения данных (когда брать кэш и когда обновлять сеть) сосредоточена в одном классе и тестируется изолированно.",
        "rubric": "Проверяется: Зачем нужен слой Repository.",
        "priority": 3,
      },
      {
        "question": "В чём разница между cache-first и network-first?",
        "answer": "При cache-first UI сразу показывает данные из локальной БД или кэша, а сеть в фоне их обновляет; при network-first сначала ждут ответ сети и только потом показывают данные. Cache-first даёт мгновенный ответ и работает офлайн, network-first — актуальные данные ценой задержки.",
        "rubric": "Проверяется: В чём разница между cache-first и network-first.",
        "priority": 3,
      },
      {
        "question": "Почему UI не должен работать с DTO напрямую?",
        "answer": "DTO отражает формат API и может измениться вместе с ним; если он попадёт в UI, смена контракта сломает экраны. Repository маппит DTO в доменную модель (`User`), поэтому изменения остаются в data-слое, а ViewModel работает с доменными типами.",
        "rubric": "Проверяется: Почему UI не должен работать с DTO напрямую.",
        "priority": 3,
      },
      {
        "question": "Что такое Single Source of Truth и почему источником истины обычно служит БД?",
        "answer": "SSOT означает, что для сущности есть один авторитетный источник, из которого читают все. В Android локальная БД обычно играет эту роль: UI наблюдает за ней через `Flow`, а сеть лишь обновляет её, поэтому экраны не расходятся.",
        "rubric": "Проверяется: Что такое Single Source of Truth и почему источником истины обычно служит БД.",
        "priority": 3,
      },
      {
        "question": "Зачем Repository начинать с интерфейса?",
        "answer": "ViewModel зависит от интерфейса (`UserRepository`), а не от реализации, поэтому в тестах её подменяют фейком, а источник данных можно заменить без изменений ViewModel. Методы называют по бизнес-смыслу (`getProfile`, `observeOrders`), не протаскивая детали Retrofit или Room.",
        "rubric": "Проверяется: Зачем Repository начинать с интерфейса.",
        "priority": 3,
      },
      {
        "question": "Как Repository обрабатывает ошибки источников?",
        "answer": "`IOException`, `HttpException` и ошибки БД привязаны к конкретным технологиям и не несут бизнес-смысла, поэтому Repository превращает их в доменные типы вроде sealed `AppError`. ViewModel показывает понятное сообщение, а оригинальную ошибку логируют внутри data-слоя.",
        "rubric": "Проверяется: Как Repository обрабатывает ошибки источников.",
        "priority": 3,
      },
      {
        "question": "Как Repository координирует сеть и локальную БД?",
        "answer": "Он подписывается на DAO, который эмитит изменения через `Flow`, и параллельно запускает сетевой запрос, сохраняющий результат в ту же таблицу. UI наблюдает за одним потоком и автоматически получает обновления без ручной синхронизации.",
        "rubric": "Проверяется: Как Repository координирует сеть и локальную БД.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "architecture-basics",
    "skillId": "junior-arch-uistate",
    "topic": "UI State",
    "questions": [
      {
        "question": "Что такое UI State?",
        "answer": "Это модель всего, что экран должен показать в данный момент: данные, флаги загрузки, ошибки, выбранные элементы. Вместо разрозненных переменных в Activity используют один объект состояния, и UI становится функцией от него.",
        "rubric": "Проверяется: Что такое UI State.",
        "priority": 3,
      },
      {
        "question": "Как моделировать Loading, Success и Error?",
        "answer": "Состояния взаимоисключающие, поэтому их описывают sealed-классом или sealed-интерфейсом с вариантами `Loading`, `Success(items)`, `Error(message)`. Компилятор потребует обработать все ветки в `when`, так что нельзя забыть показать ошибку или скрыть спиннер.",
        "rubric": "Проверяется: Как моделировать Loading, Success и Error.",
        "priority": 3,
      },
      {
        "question": "Почему состояние должно быть неизменяемым?",
        "answer": "Вместо мутации полей создаётся новая копия через `copy()`: это позволяет `StateFlow` корректно заметить изменение, упрощает сравнение в тестах и убирает гонки при параллельном доступе. Mutable-поля приводят к скрытым изменениям, которых UI не замечает.",
        "rubric": "Проверяется: Почему состояние должно быть неизменяемым.",
        "priority": 3,
      },
      {
        "question": "В чём разница между sealed-состоянием и data-классом с флагами?",
        "answer": "Sealed-иерархия исключает недопустимые комбинации (нельзя одновременно грузиться и показывать ошибку), а data-класс с `isLoading`, `user`, `errorMessage` гибче, но допускает противоречия. Для сложных экранов часто комбинируют: sealed для верхнего уровня, data-класс внутри `Content`.",
        "rubric": "Проверяется: В чём разница между sealed-состоянием и data-классом с флагами.",
        "priority": 3,
      },
      {
        "question": "Почему `sealed interface` предпочтительнее `sealed class` для UI State?",
        "answer": "Если не нужно хранить общее состояние в базовом типе, интерфейс не навязывает конструктор и позволяет наследовать несколько иерархий. Для UI State он считается современным стандартом.",
        "rubric": "Проверяется: Почему `sealed interface` предпочтительнее `sealed class` для UI State.",
        "priority": 3,
      },
      {
        "question": "Зачем одноразовые эффекты (Snackbar, навигация) отделять от состояния?",
        "answer": "Состояние — это то, что можно перерисовать в любой момент, а эффект должен сработать один раз. Если хранить «показать Snackbar» в `StateFlow`, повторная подписка после поворота покажет его снова; для таких событий используют `SharedFlow` или `Channel`.",
        "rubric": "Проверяется: Зачем одноразовые эффекты (Snackbar, навигация) отделять от состояния.",
        "priority": 3,
      },
      {
        "question": "Где хранится состояние и как View его получает?",
        "answer": "ViewModel держит `MutableStateFlow` и отдаёт `StateFlow`, а View собирает его в `repeatOnLifecycle(Lifecycle.State.STARTED)` и вызывает `render(state)`. Функция `render` только читает состояние и обновляет View, без вызовов Repository и навигации.",
        "rubric": "Проверяется: Где хранится состояние и как View его получает.",
        "priority": 3,
      },
      {
        "question": "Почему опасно хранить состояние в Activity или Fragment?",
        "answer": "Они уничтожаются при смене конфигурации, и состояние теряется, если его не сохранить вручную. ViewModel переживает поворот, поэтому состояние экрана держат в ней.",
        "rubric": "Проверяется: Почему опасно хранить состояние в Activity или Fragment.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "architecture-basics",
    "skillId": "junior-arch-udf",
    "topic": "Односторонний поток данных",
    "questions": [
      {
        "question": "Что означает «state вниз, events вверх»?",
        "answer": "Состояние течёт только вниз, от ViewModel к View, а пользовательские действия (клики, ввод) идут вверх как события. View не меняет состояние сама, а вызывает метод ViewModel (`onRetry()`, `onItemClick(id)`) и получает новое состояние вниз.",
        "rubric": "Проверяется: Что означает «state вниз, events вверх».",
        "priority": 1,
      },
      {
        "question": "Что такое Single Source of Truth в UDF?",
        "answer": "Для каждого куска состояния есть один владелец (обычно ViewModel, а для данных — Repository), и никто больше не хранит свою копию. Если и Activity, и Fragment держат свой флаг `isLoading`, они могут разойтись; с SSOT все читают одно значение.",
        "rubric": "Проверяется: Что такое Single Source of Truth в UDF.",
        "priority": 1,
      },
      {
        "question": "Почему двустороннее связывание (two-way binding) рискованно?",
        "answer": "Когда View может напрямую менять состояние, нельзя понять, откуда пришло изменение, и легко получить рассинхронизацию или циклы обновлений. UDF оставляет единственный путь изменения: через событие в ViewModel. Это упрощает отладку и логирование.",
        "rubric": "Проверяется: Почему двустороннее связывание (two-way binding) рискованно.",
        "priority": 1,
      },
      {
        "question": "Зачем состояние в UDF иммутабельно?",
        "answer": "Каждое изменение создаёт новое значение через `copy()` вместо мутации старого, поэтому `StateFlow` корректно видит обновление, а состояние можно логировать и откатывать. Коллекции внутри data-класса тоже должны быть неизменяемыми (`listOf`, `toList()`), иначе «неизменяемый» объект изменится извне.",
        "rubric": "Проверяется: Зачем состояние в UDF иммутабельно.",
        "priority": 1,
      },
      {
        "question": "Как выглядит обработка событий через sealed-класс?",
        "answer": "View отправляет типизированное событие (`QueryChanged`, `SearchClicked`, `ItemClicked`) в единую точку `onEvent(event)`, а ViewModel обрабатывает его в `when` и обновляет состояние. Контракт становится проверяемым компилятором, а логирование и тесты — проще.",
        "rubric": "Проверяется: Как выглядит обработка событий через sealed-класс.",
        "priority": 1,
      },
      {
        "question": "Как обновляется UI State после асинхронной операции?",
        "answer": "ViewModel сначала выставляет промежуточное состояние (`isLoading = true`), затем по результату — финальное (`Success` или `Error`), создавая новое значение через `copy()`. Важно обновлять состояние атомарно и не оставлять «полусостояний».",
        "rubric": "Проверяется: Как обновляется UI State после асинхронной операции.",
        "priority": 1,
      },
      {
        "question": "Какие преимущества даёт предсказуемый поток данных?",
        "answer": "Состояние — функция событий, поэтому по логу событий можно воспроизвести любое состояние и написать стабильный тест «событие X → состояние Y». UI детерминирован, а configuration change не требует ручного сохранения: View просто заново подписывается к ViewModel.",
        "rubric": "Проверяется: Какие преимущества даёт предсказуемый поток данных.",
        "priority": 1,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "architecture-basics",
    "skillId": "junior-arch-di",
    "topic": "Dependency Injection Basics",
    "questions": [
      {
        "question": "Зачем нужен DI в Android?",
        "answer": "Объект получает зависимости извне, а не создаёт их сам, поэтому его можно протестировать с фейками и подменить реализацию без изменения кода. Это снижает связанность компонентов и упрощает сборку графа на больших проектах.",
        "rubric": "Проверяется: Зачем нужен DI в Android.",
        "priority": 3,
      },
      {
        "question": "В чём разница между constructor injection и field injection?",
        "answer": "При constructor injection зависимости передаются в конструктор, видны в сигнатуре и хранятся в `private val`, гарантируя, что объект не окажется в невалидном состоянии. Field/setter injection скрывает зависимости и позволяет создать объект без них; его применяют лишь там, где конструктор недоступен.",
        "rubric": "Проверяется: В чём разница между constructor injection и field injection.",
        "priority": 3,
      },
      {
        "question": "Что такое Dependency Inversion Principle и чем он отличается от DI?",
        "answer": "DIP — принцип SOLID: и верхние, и нижние модули зависят от абстракций, а не друг от друга. DI — механизм, который внедряет эту абстракцию: например, ViewModel зависит от интерфейса `UserRepository`, а не от `UserRepositoryImpl`.",
        "rubric": "Проверяется: Что такое Dependency Inversion Principle и чем он отличается от DI.",
        "priority": 3,
      },
      {
        "question": "Что такое Service Locator и чем он хуже DI?",
        "answer": "Service Locator — глобальный реестр, у которого класс сам запрашивает нужные объекты (например, `Locator.getRepository()`). Зависимости становятся скрытыми: по сигнатуре не видно, что нужно классу, а подменить их в тесте сложнее, чем при передаче через конструктор.",
        "rubric": "Проверяется: Что такое Service Locator и чем он хуже DI.",
        "priority": 3,
      },
      {
        "question": "Какие проблемы создаёт ручное создание объектов в Activity?",
        "answer": "Чтобы собрать ViewModel, приходится вручную создавать Repository, API, DAO и БД в каждом месте, дублируя код сборки. Нельзя подменить зависимости в тесте, легко получить несколько экземпляров там, где нужен один; DI-фреймворк автоматизирует сборку.",
        "rubric": "Проверяется: Какие проблемы создаёт ручное создание объектов в Activity.",
        "priority": 3,
      },
      {
        "question": "Зачем нужны DI-фреймворки и чем Hilt отличается от Koin?",
        "answer": "Они строят граф зависимостей и управляют жизненным циклом: singleton на приложение, scope на Activity или ViewModel. Hilt — обёртка над Dagger с compile-time проверкой и интеграцией с Android (`@HiltAndroidApp`, `@AndroidEntryPoint`), Koin — лёгкий Kotlin DSL (`single`, `factory`, `viewModel`) без compile-time проверки графа.",
        "rubric": "Проверяется: Зачем нужны DI-фреймворки и чем Hilt отличается от Koin.",
        "priority": 3,
      },
      {
        "question": "Как зависимости передаются между слоями?",
        "answer": "Сверху вниз: UI получает ViewModel, ViewModel — use-case или Repository, Repository — data source, и каждый слой зависит только от абстракций соседнего. Не стоит протаскивать зависимость через слои, где она не используется, — принцип минимальных знаний.",
        "rubric": "Проверяется: Как зависимости передаются между слоями.",
        "priority": 3,
      },
      {
        "question": "Как DI связан с паттернами Factory, Builder, Observer и Singleton?",
        "answer": "Factory инкапсулирует создание объектов с зависимостями (например, `ViewModelFactory`), Builder собирает сложные конфигурации (`Retrofit.Builder()`), Observer распространяет изменения состояния (`LiveData`, `StateFlow`), а Singleton задаёт один экземпляр общего ресурса через scope или `@Singleton`.",
        "rubric": "Проверяется: Как DI связан с паттернами Factory, Builder, Observer и Singleton.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "asynchronous-basics",
    "skillId": "junior-async-thread",
    "topic": "Thread и Concurrency Basics",
    "questions": [
      {
        "question": "Чем `Thread` отличается от корутины?",
        "answer": "`Thread` — реальный поток ОС со своим стеком (по умолчанию ~1 МБ), а корутина — дешёвая приостанавливаемая задача на пуле потоков. Тысячи корутин выполняются на нескольких потоках, тогда как потоков столько, сколько создано.",
        "rubric": "Проверяется: Чем `Thread` отличается от корутины.",
        "priority": 1,
      },
      {
        "question": "В чём разница между concurrency и parallelism?",
        "answer": "Concurrency — способность управлять несколькими задачами, переключаясь между ними, в том числе на одном ядре; parallelism — одновременное выполнение на разных ядрах. Корутины дают concurrency, а `Dispatchers.Default` на пуле потоков добавляет parallelism.",
        "rubric": "Проверяется: В чём разница между concurrency и parallelism.",
        "priority": 1,
      },
      {
        "question": "Почему доступ к общим данным из нескольких потоков опасен?",
        "answer": "Потоки разделяют кучу, поэтому два потока могут одновременно менять один объект, и результат зависит от порядка выполнения (race condition). Операция `counter++` не атомарна, поэтому без синхронизации через `synchronized`, `@Volatile` или `Mutex` обновления теряются.",
        "rubric": "Проверяется: Почему доступ к общим данным из нескольких потоков опасен.",
        "priority": 1,
      },
      {
        "question": "Чем вызов `start()` отличается от `run()` у `Thread`?",
        "answer": "`start()` создаёт новый поток и асинхронно планирует `run()`, а прямой вызов `run()` выполняет метод в текущем потоке как обычную функцию. Повторный `start()` на уже запущенном потоке бросает `IllegalThreadStateException`.",
        "rubric": "Проверяется: Чем вызов `start()` отличается от `run()` у `Thread`.",
        "priority": 1,
      },
      {
        "question": "Что делает `join()` и чем он отличается от `isAlive()`?",
        "answer": "`join()` блокирует вызывающий поток до завершения целевого (с необязательным таймаутом), а `isAlive()` лишь сообщает, запущен ли поток и ещё не завершился. Результат `isAlive()` устаревает сразу после вызова, поэтому для синхронизации используют `join()`.",
        "rubric": "Проверяется: Что делает `join()` и чем он отличается от `isAlive()`.",
        "priority": 1,
      },
      {
        "question": "Что происходит при долгой операции на главном потоке?",
        "answer": "Если главный поток заблокирован сетевым запросом или вычислением дольше пяти секунд, система показывает ANR. Блокирующую работу выносят в фоновый поток, а результат возвращают в UI через `Handler.post` или `withContext(Dispatchers.Main)`.",
        "rubric": "Проверяется: Что происходит при долгой операции на главном потоке.",
        "priority": 1,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "asynchronous-basics",
    "skillId": "junior-async-handler",
    "topic": "Handler",
    "questions": [
      {
        "question": "Зачем нужен `Looper` и почему главный поток не завершается?",
        "answer": "`Looper` — бесконечный цикл, который разбирает сообщения из `MessageQueue`. У главного потока он создаётся системой, поэтому поток живёт до `quit()`, ожидая и обрабатывая события вместо того, чтобы завершиться после старта.",
        "rubric": "Проверяется: Зачем нужен `Looper` и почему главный поток не завершается.",
        "priority": 3,
      },
      {
        "question": "Что делает `Handler.postDelayed()`?",
        "answer": "`postDelayed(runnable, delayMillis)` ставит задачу в очередь `Looper` с выполнением через указанную задержку от момента вызова. Реальное выполнение может сдвинуться, если главный поток занят.",
        "rubric": "Проверяется: Что делает `Handler.postDelayed()`.",
        "priority": 3,
      },
      {
        "question": "Зачем вызывать `removeCallbacks()` при уничтожении экрана?",
        "answer": "Отложенная задача, оставшаяся в очереди, выполнится после закрытия Activity и обратится к уничтоженному View — это утечка памяти и краш. `removeCallbacks(runnable)` удаляет ещё не выполненную задачу, поэтому каждому `postDelayed` должен соответствовать вызов в коллбэке жизненного цикла.",
        "rubric": "Проверяется: Зачем вызывать `removeCallbacks()` при уничтожении экрана.",
        "priority": 3,
      },
      {
        "question": "Как `Handler` связан с `MessageQueue`?",
        "answer": "При создании `Handler` получает `Looper` и через него его `MessageQueue`; `post`/`sendMessage` кладут `Message` в эту очередь, устанавливая `msg.target = this`. `Looper` достаёт сообщение и вызывает `dispatchMessage` нужного Handler'а.",
        "rubric": "Проверяется: Как `Handler` связан с `MessageQueue`.",
        "priority": 3,
      },
      {
        "question": "Можно ли использовать один `Looper` для нескольких `Handler`'ов?",
        "answer": "Да: Handler'ы, привязанные к одному Looper, пишут в общую очередь, а Looper распределяет сообщения по полю `target`. Наоборот, один Handler привязан ровно к одному Looper, и сменить его нельзя.",
        "rubric": "Проверяется: Можно ли использовать один `Looper` для нескольких `Handler`'ов.",
        "priority": 3,
      },
      {
        "question": "Чем `post()` отличается от `handleMessage()`?",
        "answer": "`post(Runnable)` ставит в очередь готовую задачу, удобную для обычных действий, а `handleMessage(Message)` переопределяют, когда нужно передать структурированные данные с кодом `what` и payload в `obj`/`data`. Оба способа выполняются в потоке владельца Looper.",
        "rubric": "Проверяется: Чем `post()` отличается от `handleMessage()`.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "asynchronous-basics",
    "skillId": "junior-async-looper",
    "topic": "Looper и MessageQueue",
    "questions": [
      {
        "question": "Как получить Main Looper и зачем он нужен?",
        "answer": "`Looper.getMainLooper()` возвращает Looper главного потока, создаваемый системой до `Application.onCreate`. Все операции с UI должны выполняться в потоке этого Looper'а; проверить текущий поток можно через `Looper.myLooper() == Looper.getMainLooper()`.",
        "rubric": "Проверяется: Как получить Main Looper и зачем он нужен.",
        "priority": 2,
      },
      {
        "question": "В каком порядке обрабатываются сообщения в `MessageQueue`?",
        "answer": "Это не простая FIFO-очередь: сообщения хранятся связным списком, отсортированным по полю `when` (время выполнения), а при равном времени — в порядке поступления. `Looper.loop()` вызывает `queue.next()`, который блокируется, если ближайшее сообщение ещё не готово.",
        "rubric": "Проверяется: В каком порядке обрабатываются сообщения в `MessageQueue`.",
        "priority": 2,
      },
      {
        "question": "Что такое idle handler и когда он полезен?",
        "answer": "`queue.addIdleHandler { ... }` регистрирует обработчик, вызываемый, когда очередь пуста. Он полезен для отложенной инициализации — работы, которую можно сделать, пока главный поток свободен; возврат `true` оставляет обработчик в очереди.",
        "rubric": "Проверяется: Что такое idle handler и когда он полезен.",
        "priority": 2,
      },
      {
        "question": "Почему в обычной разработке не создают `Looper` вручную?",
        "answer": "Система сама создаёт Looper главного потока, а для фоновых задач есть `HandlerThread`, `ExecutorService` и корутины с диспетчерами. Ручной `Looper.prepare()` + `Looper.loop()` нужен только в специальных случаях и требует парного `quit()`/`quitSafely()`, иначе поток утечёт.",
        "rubric": "Проверяется: Почему в обычной разработке не создают `Looper` вручную.",
        "priority": 2,
      },
      {
        "question": "Что произойдёт, если вызвать `Looper.prepare()` дважды в одном потоке?",
        "answer": "Каждый поток может иметь не более одного Looper, поэтому повторный `Looper.prepare()` в том же потоке бросает `RuntimeException`. Looper хранится в потоке через `ThreadLocal`, и использовать его из другого потока без синхронизации — ошибка.",
        "rubric": "Проверяется: Что произойдёт, если вызвать `Looper.prepare()` дважды в одном потоке.",
        "priority": 2,
      },
      {
        "question": "Почему главный поток «зависает» при долгой задаче?",
        "answer": "Вся работа главного потока — обработка очередного сообщения в `Looper.loop()`. Пока внутри `dispatchMessage` выполняется долгая операция, следующее сообщение (например, касание) ждёт, очередь растёт и интерфейс перестаёт отвечать.",
        "rubric": "Проверяется: Почему главный поток «зависает» при долгой задаче.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "asynchronous-basics",
    "skillId": "junior-async-coroutines",
    "topic": "Coroutines Basics",
    "questions": [
      {
        "question": "В чём разница между `launch` и `async`?",
        "answer": "`launch` запускает корутину «выстрелил и забыл» и возвращает `Job` без результата, а `async` возвращает `Deferred<T>`, значение которого получают через `await()`. `launch` используют для побочных эффектов, `async` — когда нужно вычисление и параллельный запуск нескольких задач.",
        "rubric": "Проверяется: В чём разница между `launch` и `async`.",
        "priority": 1,
      },
      {
        "question": "Что делает `runBlocking` и почему его избегают в production?",
        "answer": "`runBlocking` создаёт корутину и блокирует текущий поток до её завершения; он нужен как мост в `main()`, тестах и скриптах. В Android на главном потоке он заморозит UI, поэтому внутри приложения используют `viewModelScope`/`lifecycleScope` и suspend-функции.",
        "rubric": "Проверяется: Что делает `runBlocking` и почему его избегают в production.",
        "priority": 1,
      },
      {
        "question": "Что такое `Job` и как управлять корутиной?",
        "answer": "`Job` представляет запущенную корутину и образует дерево: `cancel()` запрашивает отмену, `join()` дожидается завершения, а `isActive`/`isCompleted`/`isCancelled` показывают состояние. Отмена кооперативная, поэтому `cancel()` не прерывает поток принудительно.",
        "rubric": "Проверяется: Что такое `Job` и как управлять корутиной.",
        "priority": 1,
      },
      {
        "question": "Что такое структурированная конкуренция?",
        "answer": "Это принцип, при котором корутины образуют дерево: родитель не завершится, пока не завершатся все дети, отмена родителя отменяет детей, а исключение ребёнка пробрасывается родителю. Благодаря этому корутины не «висят» и не утекают.",
        "rubric": "Проверяется: Что такое структурированная конкуренция.",
        "priority": 1,
      },
      {
        "question": "Чем `coroutineScope` отличается от `supervisorScope`?",
        "answer": "В `coroutineScope` сбой одного ребёнка отменяет родителя и остальных детей, а `supervisorScope` делает задачи независимыми: ошибка одного не роняет остальные. `supervisorScope` используют, когда задачи независимы и ошибку обрабатывают локально.",
        "rubric": "Проверяется: Чем `coroutineScope` отличается от `supervisorScope`.",
        "priority": 1,
      },
      {
        "question": "Почему опасно использовать `GlobalScope`?",
        "answer": "Корутины в `GlobalScope` не привязаны к жизненному циклу компонента и не отменяются автоматически, поэтому легко получить утечку и работу после уничтожения экрана. Вместо него используют `viewModelScope`, `lifecycleScope` или собственный scope с вызовом `cancel()`.",
        "rubric": "Проверяется: Почему опасно использовать `GlobalScope`.",
        "priority": 1,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "asynchronous-basics",
    "skillId": "junior-async-dispatchers",
    "topic": "Dispatchers",
    "questions": [
      {
        "question": "Чем `Dispatchers.IO` отличается от `Dispatchers.Default`?",
        "answer": "`IO` — эластичный пул для блокирующих операций: по умолчанию минимум 64 потока (`max(64, число ядер)`) для сети, диска и БД. `Default` — пул размером с число ядер (минимум 2) для CPU-работы: сортировки, парсинга и криптографии.",
        "rubric": "Проверяется: Чем `Dispatchers.IO` отличается от `Dispatchers.Default`.",
        "priority": 3,
      },
      {
        "question": "Почему `suspend`-функция сама не переключает поток?",
        "answer": "`suspend` означает лишь, что функцию можно приостановить; по умолчанию её тело выполняется на диспетчере вызывающего кода. Если внутри есть блокирующий вызов без `withContext(Dispatchers.IO)`, он заблокирует главный поток.",
        "rubric": "Проверяется: Почему `suspend`-функция сама не переключает поток.",
        "priority": 3,
      },
      {
        "question": "Когда нужен `withContext`?",
        "answer": "`withContext(dispatcher)` переключает контекст текущей корутины, выполняет блок и возвращает результат, не создавая новую корутину. Он нужен, чтобы разместить блокирующее I/O на `Dispatchers.IO`, вычисления на `Dispatchers.Default`, а обновление UI на `Dispatchers.Main`; отмена при этом распространяется.",
        "rubric": "Проверяется: Когда нужен `withContext`.",
        "priority": 3,
      },
      {
        "question": "Что даёт `Dispatchers.Main.immediate`?",
        "answer": "Это вариант `Dispatchers.Main`, который не ставит задачу в очередь, если корутина уже в главном потоке, а выполняет продолжение сразу, снижая задержку обновления UI. В unit-тестах `Dispatchers.Main` подменяют через `Dispatchers.setMain`.",
        "rubric": "Проверяется: Что даёт `Dispatchers.Main.immediate`.",
        "priority": 3,
      },
      {
        "question": "В чём ошибка запуска CPU-задачи на `Dispatchers.IO`?",
        "answer": "CPU-цикл на `IO` занимает потоки, предназначенные для ожидания ввода-вывода, создаёт лишние потоки и тратит память, замедляя реальные I/O-операции. Для вычислений используют `Dispatchers.Default`, а для блокирующих вызовов — `IO`.",
        "rubric": "Проверяется: В чём ошибка запуска CPU-задачи на `Dispatchers.IO`.",
        "priority": 3,
      },
      {
        "question": "Что происходит при частых `withContext` внутри цикла?",
        "answer": "Каждое переключение включает планирование задачи в пул потоков: дёшево, но не бесплатно. На горячих путях данные собирают в один `withContext` и обрабатывают разом, а не переключаются на каждый элемент.",
        "rubric": "Проверяется: Что происходит при частых `withContext` внутри цикла.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "asynchronous-basics",
    "skillId": "junior-async-suspend",
    "topic": "Suspend Functions и Cancellation",
    "questions": [
      {
        "question": "Чем suspension отличается от blocking?",
        "answer": "При suspension (`delay`, suspend-вызов) корутина «засыпает», а поток возвращается в пул и может выполнять другие корутины. При blocking (`Thread.sleep`, синхронный `execute()`) поток занят ожиданием и простаивает.",
        "rubric": "Проверяется: Чем suspension отличается от blocking.",
        "priority": 3,
      },
      {
        "question": "Что такое кооперативная отмена?",
        "answer": "`job.cancel()` лишь выставляет флаг отмены, а остановка происходит в suspend-точках (`delay`, `yield`, каналы, Flow), которые проверяют флаг и бросают `CancellationException`. Долгий CPU-цикл без suspend-точек не отменится, пока не достигнет такой точки.",
        "rubric": "Проверяется: Что такое кооперативная отмена.",
        "priority": 3,
      },
      {
        "question": "Почему `CancellationException` нельзя «глушить»?",
        "answer": "Если поймать `Exception` и не пробросить `CancellationException`, отмена сломается и корутина продолжит работу после отмены. Её перебрасывают (`throw e`) либо проверяют тип: `if (e is CancellationException) throw e`; для родителя это штатное завершение, а не ошибка.",
        "rubric": "Проверяется: Почему `CancellationException` нельзя «глушить».",
        "priority": 3,
      },
      {
        "question": "Как сделать долгий цикл отменяемым?",
        "answer": "В цикле вызывают `ensureActive()` (бросит `CancellationException`, если отменено), проверяют `isActive` или добавляют `yield()` — suspend-точку, которая тоже проверяет отмену. Для блокирующих API используют `suspendCancellableCoroutine` с `invokeOnCancellation`, чтобы отменить нижележащую операцию.",
        "rubric": "Проверяется: Как сделать долгий цикл отменяемым.",
        "priority": 3,
      },
      {
        "question": "Что ключевое слово `suspend` делает с функцией?",
        "answer": "Оно помечает функцию как приостанавливаемую: её можно вызвать только из корутины или другой suspend-функции, а компилятор строит конечный автомат с continuation. Если внутри нет suspend-вызовов, функция выполняется синхронно на текущем диспетчере.",
        "rubric": "Проверяется: Что ключевое слово `suspend` делает с функцией.",
        "priority": 3,
      },
      {
        "question": "Как ошибка в дочерней корутине влияет на остальные?",
        "answer": "По умолчанию в `coroutineScope` ошибка ребёнка отменяет родителя и всех других детей, а исключение пробрасывается в точку ожидания. Чтобы сбой одного не ронял остальные, используют `supervisorScope`/`SupervisorJob` и обрабатывают ошибку в каждом `launch`.",
        "rubric": "Проверяется: Как ошибка в дочерней корутине влияет на остальные.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "asynchronous-basics",
    "skillId": "junior-async-flow",
    "topic": "Flow Basics",
    "questions": [
      {
        "question": "Чем холодный Flow отличается от горячего?",
        "answer": "У холодного (`flow { }`, `flowOf`) код билдера запускается заново для каждого коллектора, и ничего не эмитится без `collect`; каждый подписчик получает независимую последовательность. Горячий (`StateFlow`, `SharedFlow`) эмитит значения независимо от подписчиков, а новые получают только новые или последнее закэшированное значение.",
        "rubric": "Проверяется: Чем холодный Flow отличается от горячего.",
        "priority": 3,
      },
      {
        "question": "Чем Flow отличается от suspend-функции?",
        "answer": "Suspend-функция возвращает одно значение и завершается — это разовая операция, а Flow даёт потенциально много значений со временем для наблюдения за изменениями. Flow можно представить как suspend-функцию, вызывающую `emit` несколько раз; если нужен первый результат, используют `first()`.",
        "rubric": "Проверяется: Чем Flow отличается от suspend-функции.",
        "priority": 3,
      },
      {
        "question": "Зачем в ViewModel использовать `StateFlow`?",
        "answer": "`StateFlow` — горячий поток с текущим значением, который сразу отдаёт его новым подписчикам и не эмитит равные значения повторно (conflation по `equals`). Он хранит состояние экрана в ViewModel и заменяет `LiveData`, а сбор во View идёт с учётом жизненного цикла через `repeatOnLifecycle` или `collectAsStateWithLifecycle`.",
        "rubric": "Проверяется: Зачем в ViewModel использовать `StateFlow`.",
        "priority": 3,
      },
      {
        "question": "Чем `collect` отличается от `first()`, `single()` и `toList()`?",
        "answer": "`collect` — терминальный оператор, который запускает поток и применяет побочный эффект к каждому значению, не возвращая результата. `first()` возвращает первое значение, `single()` требует ровно одно (иначе `IllegalStateException`), `toList()` собирает все значения в список.",
        "rubric": "Проверяется: Чем `collect` отличается от `first()`, `single()` и `toList()`.",
        "priority": 3,
      },
      {
        "question": "Почему операторы `map`/`filter` не работают без `collect`?",
        "answer": "Операторы Flow ленивые: они возвращают новый Flow и не выполняются, пока не вызван терминальный оператор, например `collect`. Каждый элемент проходит по всей цепочке, а по умолчанию преобразования выполняются на диспетчере коллектора.",
        "rubric": "Проверяется: Почему операторы `map`/`filter` не работают без `collect`.",
        "priority": 3,
      },
      {
        "question": "Что будет, если собирать Flow напрямую в `lifecycleScope`?",
        "answer": "Без `repeatOnLifecycle` сбор продолжается, когда экран ушёл в фон: это лишняя работа, обновления невидимого UI и риск утечки. Во Fragment используют `repeatOnLifecycle(Lifecycle.State.STARTED)`, в Compose — `collectAsStateWithLifecycle`.",
        "rubric": "Проверяется: Что будет, если собирать Flow напрямую в `lifecycleScope`.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "data-and-storage-basics",
    "skillId": "junior-data-shared",
    "topic": "SharedPreferences и DataStore Basics",
    "questions": [
      {
        "question": "Чем `commit()` отличается от `apply()` в SharedPreferences?",
        "answer": "`commit()` синхронно записывает данные на диск и возвращает `Boolean` об успехе, блокируя вызывающий поток. `apply()` обновляет кэш в памяти сразу, запись делает асинхронно и ничего не возвращает — его используют почти всегда.",
        "rubric": "Проверяется: Чем `commit()` отличается от `apply()` в SharedPreferences.",
        "priority": 2,
      },
      {
        "question": "Почему SharedPreferences может заблокировать главный поток?",
        "answer": "при первом обращении он целиком загружает XML-файл в память, и чтение идёт на том потоке, где вызван `getSharedPreferences` или первый `get*`. Диск трогает и `commit()`, а задержку помогает поймать через `StrictMode` с `detectDiskReads()`/`detectDiskWrites()`.",
        "rubric": "Проверяется: Почему SharedPreferences может заблокировать главный поток.",
        "priority": 2,
      },
      {
        "question": "Почему для новых проектов предпочтительнее Preferences DataStore?",
        "answer": "он асинхронный, работает на корутинах и `Flow`, не блокирует UI и использует типизированные `Preferences.Key` вместо строковых ключей. Запись через `edit { }` транзакционна, ошибки I/O пробрасываются как исключения, а миграция со старых настроек встроена ([DataStore](https://developer.android.com/topic/libraries/architecture/datastore)).",
        "rubric": "Проверяется: Почему для новых проектов предпочтительнее Preferences DataStore.",
        "priority": 2,
      },
      {
        "question": "Что происходит внутри `edit { }` в DataStore?",
        "answer": "`edit` — `suspend`-функция: все изменения применяются атомарно, либо все, либо ни одного. Вызывать вложенный `edit` того же DataStore нельзя — это приведёт к дедлоку.",
        "rubric": "Проверяется: Что происходит внутри `edit { }` в DataStore.",
        "priority": 2,
      },
      {
        "question": "Как перенести настройки из SharedPreferences в DataStore?",
        "answer": "при создании хранилища через `preferencesDataStore` передайте `SharedPreferencesMigration(context, \"old_settings\")` в `produceMigrations`. Старый файл останется на диске, но DataStore больше его не читает.",
        "rubric": "Проверяется: Как перенести настройки из SharedPreferences в DataStore.",
        "priority": 2,
      },
      {
        "question": "Какие типы можно хранить и как быть со сложными объектами?",
        "answer": "поддерживаются `Boolean`, `Int`, `Long`, `Float`, `Double`, `String` и `Set<String>` (`Double` — только в DataStore). Объекты сериализуют в JSON-строку, кладут в Proto DataStore или хранят в Room, а в настройках оставляют только идентификатор.",
        "rubric": "Проверяется: Какие типы можно хранить и как быть со сложными объектами.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "data-and-storage-basics",
    "skillId": "junior-data-files",
    "topic": "Files и Storage",
    "questions": [
      {
        "question": "Чем внутреннее хранилище отличается от app-specific внешнего?",
        "answer": "внутреннее (`filesDir`, `cacheDir`) приватно для приложения, не требует разрешений и удаляется вместе с приложением. App-specific внешнее (`getExternalFilesDir()`) тоже не требует разрешений и удаляется при удалении приложения, но подходит для больших файлов, которые не должны попасть в общую галерею.",
        "rubric": "Проверяется: Чем внутреннее хранилище отличается от app-specific внешнего.",
        "priority": 3,
      },
      {
        "question": "Что такое Scoped Storage и зачем он был введён?",
        "answer": "это модель доступа с Android 10 (обязательная с Android 11): приложение имеет прямой доступ только к своей директории и файлам, которые само создало. Чужие файлы нельзя читать через абсолютные пути вроде `/sdcard/DCIM/...` — нужны `Uri`, `MediaStore` и Storage Access Framework ([Data and file storage overview](https://developer.android.com/training/data-storage)).",
        "rubric": "Проверяется: Что такое Scoped Storage и зачем он был введён.",
        "priority": 3,
      },
      {
        "question": "Почему для медиафайлов используют `MediaStore`, а не путь к файлу?",
        "answer": "в Scoped Storage чужие фото, видео и аудио адресуются через `content://` URI в `MediaStore`, а не через путь файловой системы. Так приложение получает доступ к медиа без разрешения читать всё внешнее хранилище.",
        "rubric": "Проверяется: Почему для медиафайлов используют `MediaStore`, а не путь к файлу.",
        "priority": 3,
      },
      {
        "question": "Зачем нужны `Uri` и `ContentResolver`?",
        "answer": "`Uri` — унифицированный адрес ресурса, а `ContentResolver` — шлюз к контент-провайдерам: через `openInputStream()`, `openOutputStream()` и `query()` он читает и пишет данные системы и других приложений. Прямые пути в Scoped Storage не работают, поэтому это основной способ работы с чужими файлами.",
        "rubric": "Проверяется: Зачем нужны `Uri` и `ContentResolver`.",
        "priority": 3,
      },
      {
        "question": "Что даёт Storage Access Framework (SAF)?",
        "answer": "пользователь выбирает файл или директорию системным диалогом (`ACTION_OPEN_DOCUMENT`, `ACTION_CREATE_DOCUMENT`, `ACTION_OPEN_DOCUMENT_TREE`), а приложение получает `Uri` без запроса разрешений. Чтобы права не пропали после перезапуска, вызывают `takePersistableUriPermission()`.",
        "rubric": "Проверяется: Что даёт Storage Access Framework (SAF).",
        "priority": 3,
      },
      {
        "question": "В чём разница между `filesDir` и `cacheDir`?",
        "answer": "`filesDir` хранит постоянные файлы, которые система не удаляет сама; `cacheDir` — временные, которые могут быть очищены при нехватке места. Важные данные в кэш не кладут, и очистка кэша не должна удалять пользовательские файлы.",
        "rubric": "Проверяется: В чём разница между `filesDir` и `cacheDir`.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "data-and-storage-basics",
    "skillId": "junior-data-sqlite",
    "topic": "SQLite и SQL Basics",
    "questions": [
      {
        "question": "Зачем таблице `PRIMARY KEY`?",
        "answer": "первичный ключ уникально идентифицирует строку; в Android обычно используют `INTEGER PRIMARY KEY AUTOINCREMENT`. Он гарантирует отсутствие дублей и служит опорой для ссылок из других таблиц.",
        "rubric": "Проверяется: Зачем таблице `PRIMARY KEY`.",
        "priority": 3,
      },
      {
        "question": "Что такое `FOREIGN KEY` и почему нужно включать `PRAGMA foreign_keys = ON`?",
        "answer": "внешний ключ — столбец, ссылающийся на первичный ключ другой таблицы, то есть связь «многие к одному». SQLite по умолчанию не проверяет такие ссылки, поэтому без `PRAGMA foreign_keys = ON` они становятся «тихими» ошибками; `ON DELETE CASCADE` удаляет зависимые строки автоматически.",
        "rubric": "Проверяется: Что такое `FOREIGN KEY` и почему нужно включать `PRAGMA foreign_keys = ON`.",
        "priority": 3,
      },
      {
        "question": "Как `WHERE` влияет на `SELECT`?",
        "answer": "`SELECT` извлекает данные, а `WHERE` фильтрует строки по условию до попадания в результат. Доступны `=`, `<>`, `BETWEEN`, `LIKE`, `IN`, `IS NULL` и логические `AND`/`OR`/`NOT`; отсутствие значения проверяют через `IS NULL`, а не `= NULL`.",
        "rubric": "Проверяется: Как `WHERE` влияет на `SELECT`.",
        "priority": 3,
      },
      {
        "question": "Чем `WHERE` отличается от `HAVING`?",
        "answer": "`WHERE` фильтрует отдельные строки до группировки, а `HAVING` — группы уже после `GROUP BY`. Поэтому агрегатные функции вроде `COUNT()` нельзя использовать в `WHERE`, но можно в `HAVING`.",
        "rubric": "Проверяется: Чем `WHERE` отличается от `HAVING`.",
        "priority": 3,
      },
      {
        "question": "Что делает `JOIN` и чем `INNER JOIN` отличается от `LEFT JOIN`?",
        "answer": "`JOIN` объединяет строки таблиц по условию связи, например `orders.user_id = users.id`, и позволяет не дублировать данные. `INNER JOIN` оставляет только совпадения в обеих таблицах, `LEFT JOIN` сохраняет все строки левой таблицы, подставляя `NULL`, если справа совпадения нет.",
        "rubric": "Проверяется: Что делает `JOIN` и чем `INNER JOIN` отличается от `LEFT JOIN`.",
        "priority": 3,
      },
      {
        "question": "Зачем нужны транзакции?",
        "answer": "транзакция применяет группу SQL-операций атомарно: либо сохраняются все изменения, либо ни одного, а при ошибке вызывают `ROLLBACK`. Это защищает данные при сбое на середине операции (перевод между счетами, массовое обновление) и при параллельном доступе — свойства ACID.",
        "rubric": "Проверяется: Зачем нужны транзакции.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "data-and-storage-basics",
    "skillId": "junior-data-room",
    "topic": "Room Basics",
    "questions": [
      {
        "question": "Почему Room проверяет SQL на этапе компиляции?",
        "answer": "Room генерирует реализацию DAO при сборке и разбирает строки `@Query`: несуществующая таблица, столбец или неподходящий тип параметра привели бы к ошибке сборки, а не к крашу в рантайме. Параметры подставляются в запрос через `:paramName`.",
        "rubric": "Проверяется: Почему Room проверяет SQL на этапе компиляции.",
        "priority": 2,
      },
      {
        "question": "Чем `@Entity`, `@Dao` и `@Database` отличаются по роли?",
        "answer": "`@Entity` описывает таблицу (каждое поле — столбец), `@Dao` — интерфейс операций, реализацию которого генерирует Room, а `@Database` объединяет сущности и DAO и хранит `version`. Экземпляр базы создают один раз, обычно через DI.",
        "rubric": "Проверяется: Чем `@Entity`, `@Dao` и `@Database` отличаются по роли.",
        "priority": 2,
      },
      {
        "question": "Что будет, если увеличить `version` в `@Database` без миграции?",
        "answer": "Room ожидает `Migration(startVersion, endVersion)`, и без неё открытие базы упадёт с `IllegalStateException`. `fallbackToDestructiveMigration()` пересоздаёт базу и теряет данные — это допустимо только для кэша.",
        "rubric": "Проверяется: Что будет, если увеличить `version` в `@Database` без миграции.",
        "priority": 2,
      },
      {
        "question": "Зачем пишут миграции и экспортируют схему?",
        "answer": "миграция переносит данные пользователя на новую схему, например `ALTER TABLE users ADD COLUMN phone TEXT`. `exportSchema = true` сохраняет историю схем в JSON для сравнения версий, но файл реально пишется только при настроенном `room.schemaLocation` или Room Gradle plugin ([Migrate Room databases](https://developer.android.com/training/data-storage/room/migrating-db-versions)).",
        "rubric": "Проверяется: Зачем пишут миграции и экспортируют схему.",
        "priority": 2,
      },
      {
        "question": "Чем `suspend`-метод DAO отличается от метода, возвращающего `Flow`?",
        "answer": "`suspend` возвращает результат один раз и вызывается из корутины: вставка, удаление, чтение по id. `Flow` — реактивное наблюдение: Room сам переэмитит данные при изменении таблицы, а в ViewModel его обычно переводят в `StateFlow` через `stateIn`.",
        "rubric": "Проверяется: Чем `suspend`-метод DAO отличается от метода, возвращающего `Flow`.",
        "priority": 2,
      },
      {
        "question": "Что такое `@Transaction` и когда он нужен?",
        "answer": "`@Transaction` объединяет несколько операций DAO в одну транзакцию: применяются либо все изменения, либо ни одного. Он нужен, когда целостность требует нескольких действий сразу — например, вставка заказа вместе со списанием баланса.",
        "rubric": "Проверяется: Что такое `@Transaction` и когда он нужен.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "data-and-storage-basics",
    "skillId": "junior-data-json",
    "topic": "JSON и Serialization",
    "questions": [
      {
        "question": "Чем Gson отличается от kotlinx.serialization?",
        "answer": "Gson работает через рефлексию в рантайме, почти не требует настроек, но хуже дружит с Kotlin null-safety, значениями по умолчанию в конструкторе и R8 (нужны keep-правила). kotlinx.serialization генерирует сериализаторы на этапе компиляции для классов с `@Serializable`: быстрее, типобезопасно и дружелюбно к R8, поэтому для новых проектов рекомендуется он.",
        "rubric": "Проверяется: Чем Gson отличается от kotlinx.serialization.",
        "priority": 3,
      },
      {
        "question": "Зачем класс помечают `@Serializable`?",
        "answer": "аннотация говорит компилятору сгенерировать сериализатор для этого класса; без неё `decodeFromString<T>()` не сработает. Поддерживаются значения по умолчанию, sealed-классы, полиморфизм и кастомные сериализаторы.",
        "rubric": "Проверяется: Зачем класс помечают `@Serializable`.",
        "priority": 3,
      },
      {
        "question": "Что произойдёт, если в JSON нет поля, объявленного non-null без default?",
        "answer": "парсинг упадёт: сериализатору неоткуда взять обязательное значение. Отсутствующее необязательное поле объявляют nullable (`String? = null`) или задают default (`val bio: String = \"\"`).",
        "rubric": "Проверяется: Что произойдёт, если в JSON нет поля, объявленного non-null без default.",
        "priority": 3,
      },
      {
        "question": "Почему опасно делать все поля API nullable?",
        "answer": "nullable-типы убирают помощь компилятора и переносят проверки в рантайм, поэтому `null` в критичном поле легко приводит к крашу или неверному UI. Non-null объявляйте только поля, которые реально приходят всегда, остальные обрабатывайте явно.",
        "rubric": "Проверяется: Почему опасно делать все поля API nullable.",
        "priority": 3,
      },
      {
        "question": "Зачем нужен `@SerialName`?",
        "answer": "он задаёт имя поля в JSON, отличное от имени свойства Kotlin: сервер часто присылает `user_name`, а в коде принято `userName`. Без `@SerialName` сериализатор будет искать ключ `userName` и не найдёт `user_name`.",
        "rubric": "Проверяется: Зачем нужен `@SerialName`.",
        "priority": 3,
      },
      {
        "question": "Как безопасно парсить JSON из сети?",
        "answer": "оберните `decodeFromString` в `runCatching` или `try/catch`: неверный синтаксис даёт `JsonDecodingException`, несовпадение структуры — `SerializationException`, null в non-null поле — `IllegalArgumentException`. Ошибку стоит логировать без чувствительных данных и показать пользователю, а не глотать молча.",
        "rubric": "Проверяется: Как безопасно парсить JSON из сети.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "data-and-storage-basics",
    "skillId": "junior-data-http",
    "topic": "HTTP и REST Basics",
    "questions": [
      {
        "question": "Чем `GET` отличается от `POST`, `PUT` и `PATCH`?",
        "answer": "`GET` получает ресурс и не должен менять состояние, `POST` создаёт новый ресурс, `PUT` полностью заменяет его, а `PATCH` обновляет только часть полей. Неправильный выбор метода ломает кэши и прокси: `PUT` требует полное тело, `PATCH` — только изменяемые поля.",
        "rubric": "Проверяется: Чем `GET` отличается от `POST`, `PUT` и `PATCH`.",
        "priority": 3,
      },
      {
        "question": "Что такое идемпотентность и какие методы идемпотентны?",
        "answer": "идемпотентность означает, что повтор того же запроса даёт тот же результат. `GET`, `PUT` и `DELETE` идемпотентны, а `POST` — нет: повторная отправка может создать дубликат.",
        "rubric": "Проверяется: Что такое идемпотентность и какие методы идемпотентны.",
        "priority": 3,
      },
      {
        "question": "Чем отличаются 4xx и 5xx статусы?",
        "answer": "`4xx` — ошибка клиента (`400`, `401`, `403`, `404`, `422`, `429`), `5xx` — ошибка сервера (`500`, `502`, `503`). Реакция должна быть разной: 401 — обновить токен, 404 — показать «не найдено», 5xx — предложить повторить позже.",
        "rubric": "Проверяется: Чем отличаются 4xx и 5xx статусы.",
        "priority": 3,
      },
      {
        "question": "Чем `401 Unauthorized` отличается от `403 Forbidden`?",
        "answer": "`401` означает, что аутентификации нет или токен устарел: нужно обновить токен или разлогинить пользователя. `403` означает, что запрос аутентифицирован, но прав недостаточно — повтор с тем же токеном не поможет.",
        "rubric": "Проверяется: Чем `401 Unauthorized` отличается от `403 Forbidden`.",
        "priority": 3,
      },
      {
        "question": "В чём разница между path- и query-параметрами?",
        "answer": "path (`/users/42`) идентифицирует ресурс, query (`?page=2&lang=ru`) уточняет запрос: фильтрацию, сортировку, пагинацию. Значения кодируют через `URLEncoder` или доверяют Retrofit/OkHttp — ручная конкатенация строк ломается на пробелах и спецсимволах.",
        "rubric": "Проверяется: В чём разница между path- и query-параметрами.",
        "priority": 3,
      },
      {
        "question": "Почему в Android используют HTTPS и нельзя отключать проверку сертификатов?",
        "answer": "HTTPS — HTTP поверх TLS: трафик шифруется, а подлинность сервера проверяется сертификатами; с Android 9 cleartext по умолчанию отключён. Для локального сервера разработки HTTP разрешают через `network_security_config.xml`, но в продакшене TrustAllCerts недопустим.",
        "rubric": "Проверяется: Почему в Android используют HTTPS и нельзя отключать проверку сертификатов.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "data-and-storage-basics",
    "skillId": "junior-data-retrofit",
    "topic": "Retrofit Basics",
    "questions": [
      {
        "question": "Зачем Retrofit нужен `ConverterFactory`?",
        "answer": "конвертер превращает тело запроса и ответа между Kotlin-объектами и байтами; для Kotlinx Serialization используют `Json.asConverterFactory(contentType)`. Без него Retrofit вернёт `ResponseBody`/`RequestBody` и парсить придётся вручную, а несколько JSON-конвертеров могут скрыть ошибки.",
        "rubric": "Проверяется: Зачем Retrofit нужен `ConverterFactory`.",
        "priority": 2,
      },
      {
        "question": "Чем `@Path` отличается от `@Query`?",
        "answer": "`@Path` подставляет значение в путь URL (`users/{id}`), а `@Query` добавляет параметр в query-строку (`?page=1`). Nullable `@Query` со значением `null` в URL не добавляется, а значения по умолчанию позволяют не передавать параметр.",
        "rubric": "Проверяется: Чем `@Path` отличается от `@Query`.",
        "priority": 2,
      },
      {
        "question": "В чём разница между `Call<T>` и `suspend`-функцией?",
        "answer": "`Call<T>` — старый асинхронный API с `enqueue(callback)` или `execute()`, который остался в legacy-коде. `suspend`-функция выполняет запрос в корутине и возвращает результат напрямую; при необходимости прочитать код или заголовки ответа возвращают `Response<T>`.",
        "rubric": "Проверяется: В чём разница между `Call<T>` и `suspend`-функцией.",
        "priority": 2,
      },
      {
        "question": "Зачем нужен `HttpLoggingInterceptor` и почему его отключают в релизе?",
        "answer": "он логирует запросы и ответы в Logcat; уровни `NONE`, `BASIC`, `HEADERS`, `BODY`. Уровень `BODY` печатает тела с токенами, поэтому в продакшене ставят `NONE` или включают логирование только в debug-сборке через `BuildConfig.DEBUG`.",
        "rubric": "Проверяется: Зачем нужен `HttpLoggingInterceptor` и почему его отключают в релизе.",
        "priority": 2,
      },
      {
        "question": "Почему `baseUrl` должен заканчиваться на `/`?",
        "answer": "Retrofit склеивает базовый URL с относительным путём эндпоинта; без завершающего слэша он бросит `IllegalArgumentException`. Если путь эндпоинта начинается с `/`, базовый путь игнорируется — это частая причина запросов не туда.",
        "rubric": "Проверяется: Почему `baseUrl` должен заканчиваться на `/`.",
        "priority": 2,
      },
      {
        "question": "Как обрабатывать ошибки при `suspend`-запросе?",
        "answer": "HTTP-ошибки (4xx/5xx) бросают `HttpException`, а сетевые проблемы и таймауты — `IOException` (`SocketTimeoutException` — его подкласс). Их ловят отдельно в `try/catch`, показывая пользователю понятные сообщения, и не выводят сырой `errorBody()` в UI.",
        "rubric": "Проверяется: Как обрабатывать ошибки при `suspend`-запросе.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "data-and-storage-basics",
    "skillId": "junior-data-dto",
    "topic": "DTO и Data Mapping",
    "questions": [
      {
        "question": "Зачем нужна отдельная Domain-модель, если есть DTO?",
        "answer": "DTO зеркалит ответ сервера: snake_case, nullable-поля и технические поля вроде `created_at`. Domain описывает сущность в терминах приложения — non-null где возможно и удобные типы вроде `Instant`, поэтому изменения API не ломают UI.",
        "rubric": "Проверяется: Зачем нужна отдельная Domain-модель, если есть DTO.",
        "priority": 3,
      },
      {
        "question": "Почему DTO нельзя отдавать напрямую в UI?",
        "answer": "при зависимости экранов от DTO любое переименование поля или смена типа на бэкенде ломает интерфейс и бизнес-логику. DTO также тащит в UI технические детали, а ViewModel удобнее тестировать с чистыми Domain-объектами.",
        "rubric": "Проверяется: Почему DTO нельзя отдавать напрямую в UI.",
        "priority": 3,
      },
      {
        "question": "Где происходит маппинг DTO → Domain?",
        "answer": "в репозитории: сеть возвращает DTO, репозиторий преобразует его и отдаёт Domain, с которым работают ViewModel и UI. Маппинг держат в одном месте — extension-функциями рядом с моделями или в `*Mapper.kt` — и покрывают unit-тестами.",
        "rubric": "Проверяется: Где происходит маппинг DTO → Domain.",
        "priority": 3,
      },
      {
        "question": "Как обработать nullable-поле ответа при маппинге?",
        "answer": "опциональные поля (аватар, описание) оставляют nullable и обрабатывают в UI через placeholder; критичные подставляют default (`fullName ?: \"Без имени\"`) или отбрасывают сущность целиком через `toDomainOrNull(): User?`. Не делайте все поля non-null, если сервер может прислать `null`.",
        "rubric": "Проверяется: Как обработать nullable-поле ответа при маппинге.",
        "priority": 3,
      },
      {
        "question": "Что делает `ignoreUnknownKeys = true` и зачем оно нужно?",
        "answer": "без него появление нового поля на бэкенде уронит парсинг; с ним неизвестные поля игнорируются. В продакшене он почти всегда нужен, но в критичных местах неизвестные поля стоит логировать, чтобы заметить изменение контракта.",
        "rubric": "Проверяется: Что делает `ignoreUnknownKeys = true` и зачем оно нужно.",
        "priority": 3,
      },
      {
        "question": "Что будет, если сервер не пришлёт обязательное поле?",
        "answer": "non-null поле без default приведёт к ошибке парсинга, а опциональное с default или nullable обработается нормально. Такой ответ — повод вернуть ошибку и показать пользователю, что данные устарели.",
        "rubric": "Проверяется: Что будет, если сервер не пришлёт обязательное поле.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "kotlin-basics",
    "skillId": "junior-kotlin-sintaks",
    "topic": "Синтаксис Kotlin",
    "questions": [
      {
        "question": "Чем Kotlin-файл отличается от Java-класса с точки зрения структуры?",
        "answer": "В Kotlin один файл может содержать несколько классов, интерфейсов и функций верхнего уровня, а Java-файл обычно содержит один публичный класс с именем файла.",
        "rubric": "Проверяется: Чем Kotlin-файл отличается от Java-класса с точки зрения структуры.",
        "priority": 2,
      },
      {
        "question": "Обязательно ли помещать каждый класс в отдельный `.kt`-файл?",
        "answer": "Нет, в одном `.kt`-файле можно объявить несколько классов; число публичных классов на файл не ограничено.",
        "rubric": "Проверяется: Обязательно ли помещать каждый класс в отдельный `.kt`-файл.",
        "priority": 2,
      },
      {
        "question": "Что такое top-level function?",
        "answer": "Функция, объявленная вне класса на уровне файла; на JVM она компилируется в статический метод класса с суффиксом `Kt`.",
        "rubric": "Проверяется: Что такое top-level function.",
        "priority": 2,
      },
      {
        "question": "В чём разница между выражением и инструкцией?",
        "answer": "Выражение имеет значение и может стоять в правой части присваивания, инструкция выполняет действие и значения не возвращает.",
        "rubric": "Проверяется: В чём разница между выражением и инструкцией.",
        "priority": 2,
      },
      {
        "question": "Почему в Kotlin `if` может возвращать значение?",
        "answer": "Потому что `if` в Kotlin — выражение: последнее выражение выбранной ветки становится его результатом, поэтому `val x = if (ok) 1 else 0` допустимо.",
        "rubric": "Проверяется: Почему в Kotlin `if` может возвращать значение.",
        "priority": 2,
      },
      {
        "question": "Что такое Smart Cast и когда компилятор его выполняет?",
        "answer": "Это автоматическое приведение типа после проверки `is` или `!= null`, когда компилятор доказывает, что значение не изменится между проверкой и использованием.",
        "rubric": "Проверяется: Что такое Smart Cast и когда компилятор его выполняет.",
        "priority": 2,
      },
      {
        "question": "Почему Smart Cast может не работать для `var`-свойства?",
        "answer": "Потому что `var` может измениться между проверкой и использованием в том числе из другого потока, а для свойства с кастомным геттером гарантий нет.",
        "rubric": "Проверяется: Почему Smart Cast может не работать для `var`-свойства.",
        "priority": 2,
      },
      {
        "question": "Чем отличаются `is` и `as`?",
        "answer": "`is` проверяет тип и возвращает `Boolean`, а `as` выполняет приведение и бросает `ClassCastException` при несовпадении; безопасный вариант — `as?`.",
        "rubric": "Проверяется: Чем отличаются `is` и `as`.",
        "priority": 2,
      },
      {
        "question": "Что проверяет оператор `in`?",
        "answer": "Принадлежность значения диапазону, коллекции или объекту с методом `contains`, например `x in 1..10`.",
        "rubric": "Проверяется: Что проверяет оператор `in`.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "kotlin-basics",
    "skillId": "junior-kotlin-null",
    "topic": "Null Safety",
    "questions": [
      {
        "question": "Чем `String` отличается от `String?`?",
        "answer": "`String` гарантированно содержит объект, `String?` может быть `null`; компилятор запрещает передать `String?` туда, где ожидается `String`.",
        "rubric": "Проверяется: Чем `String` отличается от `String?`.",
        "priority": 1,
      },
      {
        "question": "Что делает оператор `?.`?",
        "answer": "Вызывает метод или обращается к свойству только если получатель не `null`, иначе возвращает `null`.",
        "rubric": "Проверяется: Что делает оператор `?.`.",
        "priority": 1,
      },
      {
        "question": "В чём отличие `?:` от `!!`?",
        "answer": "`?:` возвращает значение по умолчанию для `null`, а `!!` принудительно снимает nullable и бросает `NullPointerException`, если значение равно `null`.",
        "rubric": "Проверяется: В чём отличие `?:` от `!!`.",
        "priority": 1,
      },
      {
        "question": "Что произойдёт при вызове `!!` на `null`?",
        "answer": "Будет брошен `NullPointerException`: оператор `!!` снимает с компилятора ответственность за проверку.",
        "rubric": "Проверяется: Что произойдёт при вызове `!!` на `null`.",
        "priority": 1,
      },
      {
        "question": "Чем `as` отличается от `as?`?",
        "answer": "`as` при несовпадении типа бросает `ClassCastException`, а `as?` возвращает `null`.",
        "rubric": "Проверяется: Чем `as` отличается от `as?`.",
        "priority": 1,
      },
      {
        "question": "Как работает `let` в сочетании с `?.`?",
        "answer": "`value?.let { ... }` выполняет лямбду только для не-null значения и передаёт его как `it`, возвращая результат лямбды.",
        "rubric": "Проверяется: Как работает `let` в сочетании с `?.`.",
        "priority": 1,
      },
      {
        "question": "Что такое Smart Cast?",
        "answer": "Автоматическое сужение типа до non-null после проверки `!= null` или `is`, если компилятор уверен, что значение не изменится.",
        "rubric": "Проверяется: Что такое Smart Cast.",
        "priority": 1,
      },
      {
        "question": "Почему Smart Cast может не работать с `var`-свойством?",
        "answer": "Потому что `var` может быть изменён между проверкой и использованием, в том числе из другого потока, поэтому гарантии нет.",
        "rubric": "Проверяется: Почему Smart Cast может не работать с `var`-свойством.",
        "priority": 1,
      },
      {
        "question": "Что такое platform type?",
        "answer": "Тип из Java-кода (`String!`), про nullable-ность которого Kotlin ничего не знает: компилятор разрешает оба варианта, а ошибка проявляется в рантайме.",
        "rubric": "Проверяется: Что такое platform type.",
        "priority": 1,
      },
      {
        "question": "Почему даже в Kotlin возможен `NullPointerException`?",
        "answer": "Из-за `!!`, platform-типов из Java, приведений без проверки и Java-библиотек, которые возвращают `null` из API без аннотаций.",
        "rubric": "Проверяется: Почему даже в Kotlin возможен `NullPointerException`.",
        "priority": 1,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "kotlin-basics",
    "skillId": "junior-kotlin-data",
    "topic": "Data Class",
    "questions": [
      {
        "question": "Чем data class отличается от обычного класса?",
        "answer": "Компилятор дополнительно генерирует `equals()`, `hashCode()`, `toString()`, `copy()` и `componentN()` на основе свойств первичного конструктора.",
        "rubric": "Проверяется: Чем data class отличается от обычного класса.",
        "priority": 2,
      },
      {
        "question": "Какие методы генерируются автоматически?",
        "answer": "`equals()`, `hashCode()`, `toString()`, `copy()` и по одному `componentN()` для каждого свойства первичного конструктора.",
        "rubric": "Проверяется: Какие методы генерируются автоматически.",
        "priority": 2,
      },
      {
        "question": "На основании каких свойств генерируются `equals()` и `hashCode()`?",
        "answer": "Только на свойствах, объявленных в первичном конструкторе; свойства из тела класса не участвуют.",
        "rubric": "Проверяется: На основании каких свойств генерируются `equals()` и `hashCode()`.",
        "priority": 2,
      },
      {
        "question": "Что такое `copy()`?",
        "answer": "Метод, создающий новый экземпляр с теми же значениями и позволяющий переопределить отдельные свойства именованными аргументами.",
        "rubric": "Проверяется: Что такое `copy()`.",
        "priority": 2,
      },
      {
        "question": "Выполняет ли `copy()` глубокое копирование?",
        "answer": "Нет, копирование поверхностное: ссылочные свойства по-прежнему указывают на те же объекты.",
        "rubric": "Проверяется: Выполняет ли `copy()` глубокое копирование.",
        "priority": 2,
      },
      {
        "question": "Что такое `componentN()`?",
        "answer": "Методы, сгенерированные для каждого свойства конструктора; они включают data class в деструктуризацию `val (a, b) = user`.",
        "rubric": "Проверяется: Что такое `componentN()`.",
        "priority": 2,
      },
      {
        "question": "Чем отличаются `==` и `===`?",
        "answer": "`==` вызывает `equals()` и сравнивает содержимое, `===` сравнивает ссылки и истинен только для одного и того же объекта.",
        "rubric": "Проверяется: Чем отличаются `==` и `===`.",
        "priority": 2,
      },
      {
        "question": "Участвуют ли свойства из тела класса в автоматическом сравнении?",
        "answer": "Нет, в сгенерированных `equals()`, `hashCode()` и `toString()` попадают только свойства первичного конструктора.",
        "rubric": "Проверяется: Участвуют ли свойства из тела класса в автоматическом сравнении.",
        "priority": 2,
      },
      {
        "question": "Можно ли объявить data class через `open`?",
        "answer": "Нет, data class не может быть `open`, `sealed` или `inner`: наследование запрещено, чтобы сохранить корректность сгенерированных методов.",
        "rubric": "Проверяется: Можно ли объявить data class через `open`.",
        "priority": 2,
      },
      {
        "question": "Почему data class подходит для DTO и UI State?",
        "answer": "Сравнение по значению упрощает обновление состояния и тесты, а `copy()` удобно использовать для создания нового состояния с изменённым полем.",
        "rubric": "Проверяется: Почему data class подходит для DTO и UI State.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "kotlin-basics",
    "skillId": "junior-kotlin-properties",
    "topic": "Properties и Accessors",
    "questions": [
      {
        "question": "Что такое property в Kotlin?",
        "answer": "Объявление в классе, которое заменяет поле вместе с геттером и сеттером: обращение выглядит как к полю, но компилятор вызывает аксессоры.",
        "rubric": "Проверяется: Что такое property в Kotlin.",
        "priority": 3,
      },
      {
        "question": "Чем свойство отличается от поля?",
        "answer": "Свойство имеет геттер и, для `var`, сеттер; поле — просто ячейка памяти, доступная внутри класса через `field`.",
        "rubric": "Проверяется: Чем свойство отличается от поля.",
        "priority": 3,
      },
      {
        "question": "Как работают getter и setter?",
        "answer": "Геттер вызывается при чтении `obj.x`, сеттер — при `obj.x = 1`; стандартные реализации можно заменить кастомными.",
        "rubric": "Проверяется: Как работают getter и setter.",
        "priority": 3,
      },
      {
        "question": "Когда вызывается custom getter?",
        "answer": "При каждом чтении свойства, поэтому вычисляемое свойство пересчитывается каждый раз, если результат не кэшировать.",
        "rubric": "Проверяется: Когда вызывается custom getter.",
        "priority": 3,
      },
      {
        "question": "Что такое backing field?",
        "answer": "Скрытое поле, которое компилятор создаёт для свойства, чтобы хранить значение между обращениями к аксессорам.",
        "rubric": "Проверяется: Что такое backing field.",
        "priority": 3,
      },
      {
        "question": "Для чего используется `field`?",
        "answer": "Чтобы обратиться к самому backing field внутри геттера или сеттера, не вызывая рекурсивно аксессор.",
        "rubric": "Проверяется: Для чего используется `field`.",
        "priority": 3,
      },
      {
        "question": "Почему нельзя обращаться к свойству напрямую внутри его setter?",
        "answer": "Потому что `x = value` внутри сеттера снова вызовет сеттер и приведёт к бесконечной рекурсии; нужно `field = value`.",
        "rubric": "Проверяется: Почему нельзя обращаться к свойству напрямую внутри его setter.",
        "priority": 3,
      },
      {
        "question": "Может ли свойство не иметь backing field?",
        "answer": "Да, если геттер вычисляет значение из других свойств и не использует `field`, например `val fullName get() = \"$first $last\"`.",
        "rubric": "Проверяется: Может ли свойство не иметь backing field.",
        "priority": 3,
      },
      {
        "question": "Чем `private set` отличается от `private var`?",
        "answer": "`private set` оставляет геттер публичным и закрывает только запись, а `private var` делает невидимым всё свойство.",
        "rubric": "Проверяется: Чем `private set` отличается от `private var`.",
        "priority": 3,
      },
      {
        "question": "В чём преимущество вычисляемых свойств?",
        "answer": "Они не хранят дублирующие данные и всегда согласованы с источником, но пересчитываются при каждом обращении.",
        "rubric": "Проверяется: В чём преимущество вычисляемых свойств.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "kotlin-basics",
    "skillId": "junior-kotlin-object",
    "topic": "Object и Companion Object",
    "questions": [
      {
        "question": "Что такое object declaration?",
        "answer": "`object Name { ... }` — объявление синглтона: единственный экземпляр создаётся лениво и потокобезопасно.",
        "rubric": "Проверяется: Что такое object declaration.",
        "priority": 3,
      },
      {
        "question": "Как в Kotlin реализовать Singleton?",
        "answer": "Через `object`: экземпляр создаётся при первом обращении и гарантированно один на процесс без ручной синхронизации.",
        "rubric": "Проверяется: Как в Kotlin реализовать Singleton.",
        "priority": 3,
      },
      {
        "question": "Когда инициализируется object declaration?",
        "answer": "Лениво, при первом обращении к любому его члену, потокобезопасно.",
        "rubric": "Проверяется: Когда инициализируется object declaration.",
        "priority": 3,
      },
      {
        "question": "Что такое object expression?",
        "answer": "Анонимный объект вида `object : Interface { ... }`, создающий новый экземпляр в месте использования.",
        "rubric": "Проверяется: Что такое object expression.",
        "priority": 3,
      },
      {
        "question": "Для чего используют object expression в Android?",
        "answer": "Для одноразовых слушателей, компараторов и анонимных реализаций интерфейсов, когда именованный класс не нужен.",
        "rubric": "Проверяется: Для чего используют object expression в Android.",
        "priority": 3,
      },
      {
        "question": "Что такое companion object?",
        "answer": "Объект внутри класса, члены которого доступны через имя класса и не привязаны к конкретному экземпляру.",
        "rubric": "Проверяется: Что такое companion object.",
        "priority": 3,
      },
      {
        "question": "Чем companion object отличается от static в Java?",
        "answer": "Это реальный объект с экземпляром: его можно передать как значение и заставить реализовать интерфейс; static — просто члены класса без объекта.",
        "rubric": "Проверяется: Чем companion object отличается от static в Java.",
        "priority": 3,
      },
      {
        "question": "Можно ли реализовать интерфейс через companion object?",
        "answer": "Да, `companion object : Factory<User>` — тогда его можно передать туда, где ожидается `Factory`.",
        "rubric": "Проверяется: Можно ли реализовать интерфейс через companion object.",
        "priority": 3,
      },
      {
        "question": "В чём разница между object и обычным классом?",
        "answer": "У `object` нет конструктора и существует один лениво созданный экземпляр, а экземпляры класса создаются через конструктор.",
        "rubric": "Проверяется: В чём разница между object и обычным классом.",
        "priority": 3,
      },
      {
        "question": "Почему чрезмерное использование singleton может усложнить тестирование?",
        "answer": "Глобальное состояние и жёсткая зависимость от конкретного экземпляра мешают подменить его заглушкой и делают тесты взаимозависимыми.",
        "rubric": "Проверяется: Почему чрезмерное использование singleton может усложнить тестирование.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "kotlin-basics",
    "skillId": "junior-kotlin-ext",
    "topic": "Extension Functions",
    "questions": [
      {
        "question": "Что такое extension function?",
        "answer": "Функция, объявленная вне класса, но вызываемая как его метод, например `fun String.lastChar(): Char = this[length - 1]`.",
        "rubric": "Проверяется: Что такое extension function.",
        "priority": 3,
      },
      {
        "question": "Добавляет ли расширение реальный метод в класс?",
        "answer": "Нет, компилятор генерирует статический метод с получателем первым аргументом; байткод исходного класса не меняется.",
        "rubric": "Проверяется: Добавляет ли расширение реальный метод в класс.",
        "priority": 3,
      },
      {
        "question": "Что такое receiver?",
        "answer": "Тип перед точкой в объявлении `fun String.foo()`; внутри функции он доступен как `this`.",
        "rubric": "Проверяется: Что такое receiver.",
        "priority": 3,
      },
      {
        "question": "Может ли extension function обращаться к private-свойству?",
        "answer": "Нет, расширение имеет права обычного внешнего кода и видит только публичные члены класса.",
        "rubric": "Проверяется: Может ли extension function обращаться к private-свойству.",
        "priority": 3,
      },
      {
        "question": "Можно ли объявлять extension properties?",
        "answer": "Да, но без backing field: значение вычисляется геттером при каждом обращении.",
        "rubric": "Проверяется: Можно ли объявлять extension properties.",
        "priority": 3,
      },
      {
        "question": "Почему у extension property нет backing field?",
        "answer": "Потому что расширение не добавляет поле в класс — оно компилируется только в вызов геттера.",
        "rubric": "Проверяется: Почему у extension property нет backing field.",
        "priority": 3,
      },
      {
        "question": "Что происходит, если extension function имеет ту же сигнатуру, что и метод класса?",
        "answer": "Побеждает метод класса: расширение не переопределяет уже существующие члены.",
        "rubric": "Проверяется: Что происходит, если extension function имеет ту же сигнатуру, что и метод класса.",
        "priority": 3,
      },
      {
        "question": "Используют ли extension functions динамический полиморфизм?",
        "answer": "Нет, реализация выбирается статически по объявленному типу получателя.",
        "rubric": "Проверяется: Используют ли extension functions динамический полиморфизм.",
        "priority": 3,
      },
      {
        "question": "Что такое статическое разрешение расширений?",
        "answer": "Выбор функции на этапе компиляции по типу выражения, а не по конкретному объекту в рантайме.",
        "rubric": "Проверяется: Что такое статическое разрешение расширений.",
        "priority": 3,
      },
      {
        "question": "Чем extension function отличается от наследования?",
        "answer": "Расширение не меняет класс и не создаёт подтип, а наследование создаёт новый тип и переопределяет поведение.",
        "rubric": "Проверяется: Чем extension function отличается от наследования.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "kotlin-basics",
    "skillId": "junior-kotlin-lambda",
    "topic": "Lambda",
    "questions": [
      {
        "question": "Что такое lambda expression?",
        "answer": "Анонимная функция в фигурных скобках, которую можно передать как значение, например `{ x: Int -> x + 1 }`.",
        "rubric": "Проверяется: Что такое lambda expression.",
        "priority": 3,
      },
      {
        "question": "Как записывается функциональный тип?",
        "answer": "Как `(Int, String) -> Boolean`: в скобках параметры, после стрелки — тип результата; при отсутствии результата используется `Unit`.",
        "rubric": "Проверяется: Как записывается функциональный тип.",
        "priority": 3,
      },
      {
        "question": "Что означает `(Int, Int) -> String`?",
        "answer": "Функцию с двумя параметрами типа `Int`, которая возвращает `String`.",
        "rubric": "Проверяется: Что означает `(Int, Int) -> String`.",
        "priority": 3,
      },
      {
        "question": "Что такое `it`?",
        "answer": "Неявное имя единственного параметра лямбды, доступное, когда параметр не объявлен явно.",
        "rubric": "Проверяется: Что такое `it`.",
        "priority": 3,
      },
      {
        "question": "Что такое trailing lambda?",
        "answer": "Лямбда, вынесенная за круглые скобки вызова, когда она последний аргумент: `list.map { it * 2 }`.",
        "rubric": "Проверяется: Что такое trailing lambda.",
        "priority": 3,
      },
      {
        "question": "Что такое closure?",
        "answer": "Лямбда, захватывающая переменные из окружающей области и сохраняющая доступ к ним после выхода из неё.",
        "rubric": "Проверяется: Что такое closure.",
        "priority": 3,
      },
      {
        "question": "Может ли лямбда изменять переменные внешней функции?",
        "answer": "Да, в отличие от Java, Kotlin-лямбды могут изменять захваченные `var`-переменные.",
        "rubric": "Проверяется: Может ли лямбда изменять переменные внешней функции.",
        "priority": 3,
      },
      {
        "question": "Чем анонимная функция отличается от lambda?",
        "answer": "В анонимной функции можно явно указать тип возврата и имена параметров, а `return` внутри неё всегда локальный.",
        "rubric": "Проверяется: Чем анонимная функция отличается от lambda.",
        "priority": 3,
      },
      {
        "question": "Что делает `return@forEach`?",
        "answer": "Возвращает управление из лямбды, а не из внешней функции, поэтому код после `forEach` продолжает выполняться.",
        "rubric": "Проверяется: Что делает `return@forEach`.",
        "priority": 3,
      },
      {
        "question": "Что такое non-local return?",
        "answer": "`return` из лямбды, который завершает внешнюю функцию; разрешён только в inline-функциях.",
        "rubric": "Проверяется: Что такое non-local return.",
        "priority": 3,
      },
      {
        "question": "Почему обычный `return` работает внутри `forEach`, но не работает в любой другой функции с лямбдой?",
        "answer": "Потому что `forEach` — inline-функция: её лямбда встраивается в вызывающий код, и `return` становится возвратом из внешней функции.",
        "rubric": "Проверяется: Почему обычный `return` работает внутри `forEach`, но не работает в любой другой функции с лямбдой.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "kotlin-basics",
    "skillId": "junior-kotlin-hof",
    "topic": "Higher Order Functions",
    "questions": [
      {
        "question": "Что такое Higher Order Function?",
        "answer": "Функция, которая принимает другую функцию в параметрах или возвращает её.",
        "rubric": "Проверяется: Что такое Higher Order Function.",
        "priority": 3,
      },
      {
        "question": "Может ли функция возвращать другую функцию?",
        "answer": "Да, типом результата может быть функциональный тип: `fun make(): (Int) -> Int = { it + 1 }`.",
        "rubric": "Проверяется: Может ли функция возвращать другую функцию.",
        "priority": 3,
      },
      {
        "question": "Что обозначает тип `(Int) -> String`?",
        "answer": "Функцию одного `Int`-аргумента, возвращающую `String`.",
        "rubric": "Проверяется: Что обозначает тип `(Int) -> String`.",
        "priority": 3,
      },
      {
        "question": "Чем `() -> Unit` отличается от `Unit`?",
        "answer": "Первое — тип функции без аргументов и без результата, второе — тип самого результата, то есть отсутствие значения.",
        "rubric": "Проверяется: Чем `() -> Unit` отличается от `Unit`.",
        "priority": 3,
      },
      {
        "question": "Что такое callable reference?",
        "answer": "Ссылка на существующую функцию, конструктор или свойство через `::`, например `::length`.",
        "rubric": "Проверяется: Что такое callable reference.",
        "priority": 3,
      },
      {
        "question": "Что делает оператор `::`?",
        "answer": "Преобразует функцию, конструктор или свойство в значение функционального типа.",
        "rubric": "Проверяется: Что делает оператор `::`.",
        "priority": 3,
      },
      {
        "question": "Как передать метод объекта в другую функцию?",
        "answer": "Через ссылку `obj::method` или лямбду `{ obj.method(it) }`.",
        "rubric": "Проверяется: Как передать метод объекта в другую функцию.",
        "priority": 3,
      },
      {
        "question": "Что такое lambda with receiver?",
        "answer": "Лямбда, внутри которой получатель доступен как `this`, например `StringBuilder.() -> Unit`.",
        "rubric": "Проверяется: Что такое lambda with receiver.",
        "priority": 3,
      },
      {
        "question": "Чем `String.() -> Unit` отличается от `(String) -> Unit`?",
        "answer": "В первом случае `String` — получатель (`this`), во втором — обычный параметр (`it`).",
        "rubric": "Проверяется: Чем `String.() -> Unit` отличается от `(String) -> Unit`.",
        "priority": 3,
      },
      {
        "question": "Почему `map` и `filter` относятся к функциям высшего порядка?",
        "answer": "Потому что принимают лямбду, задающую преобразование или условие отбора, и применяют её к элементам.",
        "rubric": "Проверяется: Почему `map` и `filter` относятся к функциям высшего порядка.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "kotlin-basics",
    "skillId": "junior-kotlin-scope",
    "topic": "Scope Functions",
    "questions": [
      {
        "question": "Что такое scope functions?",
        "answer": "Стандартные функции `let`, `run`, `with`, `apply` и `also`, выполняющие лямбду в контексте объекта.",
        "rubric": "Проверяется: Что такое scope functions.",
        "priority": 3,
      },
      {
        "question": "Какие пять scope functions предоставляет Kotlin?",
        "answer": "`let`, `run`, `with`, `apply` и `also`.",
        "rubric": "Проверяется: Какие пять scope functions предоставляет Kotlin.",
        "priority": 3,
      },
      {
        "question": "Чем отличаются `let` и `also`?",
        "answer": "Обе получают объект как `it`, но `let` возвращает результат лямбды, а `also` — сам объект.",
        "rubric": "Проверяется: Чем отличаются `let` и `also`.",
        "priority": 3,
      },
      {
        "question": "Чем отличаются `run` и `apply`?",
        "answer": "Обе используют `this`, но `run` возвращает результат лямбды, а `apply` — объект.",
        "rubric": "Проверяется: Чем отличаются `run` и `apply`.",
        "priority": 3,
      },
      {
        "question": "В чём разница между `run` и `with`?",
        "answer": "По смыслу они одинаковы: `with(obj) { ... }` эквивалентно `obj.run { ... }`; разница только в форме вызова.",
        "rubric": "Проверяется: В чём разница между `run` и `with`.",
        "priority": 3,
      },
      {
        "question": "Какие функции используют `this`, а какие — `it`?",
        "answer": "`run`, `with` и `apply` используют `this`, `let` и `also` — `it`.",
        "rubric": "Проверяется: Какие функции используют `this`, а какие — `it`.",
        "priority": 3,
      },
      {
        "question": "Какие функции возвращают исходный объект?",
        "answer": "`apply` и `also`.",
        "rubric": "Проверяется: Какие функции возвращают исходный объект.",
        "priority": 3,
      },
      {
        "question": "Какие функции возвращают результат лямбды?",
        "answer": "`let`, `run` и `with`.",
        "rubric": "Проверяется: Какие функции возвращают результат лямбды.",
        "priority": 3,
      },
      {
        "question": "Для чего обычно используется `apply`?",
        "answer": "Для конфигурации объекта при создании, например `TextView(context).apply { text = \"Hi\" }`: после лямбды возвращается сам объект.",
        "rubric": "Проверяется: Для чего обычно используется `apply`.",
        "priority": 3,
      },
      {
        "question": "Почему не следует чрезмерно использовать scope functions?",
        "answer": "Длинные цепочки `let`/`apply` маскируют поток управления; иногда явная локальная переменная читается понятнее.",
        "rubric": "Проверяется: Почему не следует чрезмерно использовать scope functions.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "kotlin-basics",
    "skillId": "junior-kotlin-enum",
    "topic": "Enum",
    "questions": [
      {
        "question": "Что такое enum class?",
        "answer": "Перечисление с фиксированным набором констант, каждая из которых является его единственным экземпляром.",
        "rubric": "Проверяется: Что такое enum class.",
        "priority": 3,
      },
      {
        "question": "Чем enum отличается от обычного класса?",
        "answer": "Константы перечисляются прямо в объявлении, у них есть `name` и `ordinal`, а компилятор генерирует `values()` и `valueOf()`.",
        "rubric": "Проверяется: Чем enum отличается от обычного класса.",
        "priority": 3,
      },
      {
        "question": "Может ли enum иметь конструктор?",
        "answer": "Да, но только приватный: параметры передаются каждой константе при её объявлении.",
        "rubric": "Проверяется: Может ли enum иметь конструктор.",
        "priority": 3,
      },
      {
        "question": "Могут ли enum-константы иметь собственные свойства и поведение?",
        "answer": "Да, можно передать значения в конструктор и переопределить методы у отдельных констант.",
        "rubric": "Проверяется: Могут ли enum-константы иметь собственные свойства и поведение.",
        "priority": 3,
      },
      {
        "question": "Может ли enum реализовывать интерфейс?",
        "answer": "Да, enum class может реализовать интерфейс, и каждая константа способна по-своему переопределить его метод.",
        "rubric": "Проверяется: Может ли enum реализовывать интерфейс.",
        "priority": 3,
      },
      {
        "question": "Что возвращает `name`?",
        "answer": "Имя константы в виде строки в точности так, как она записана в объявлении.",
        "rubric": "Проверяется: Что возвращает `name`.",
        "priority": 3,
      },
      {
        "question": "Что возвращает `ordinal`?",
        "answer": "Позицию константы в объявлении, начиная с нуля.",
        "rubric": "Проверяется: Что возвращает `ordinal`.",
        "priority": 3,
      },
      {
        "question": "Почему не следует сохранять ordinal в базе данных?",
        "answer": "При правке перечисления порядок констант меняется, и сохранённые числа начнут соответствовать другим значениям.",
        "rubric": "Проверяется: Почему не следует сохранять ordinal в базе данных.",
        "priority": 3,
      },
      {
        "question": "Чем `entries` отличается от `values()`?",
        "answer": "`entries` — рекомендуемый в современном Kotlin способ получить все константы, `values()` — более старый аналог.",
        "rubric": "Проверяется: Чем `entries` отличается от `values()`.",
        "priority": 3,
      },
      {
        "question": "В каких случаях enum лучше заменить на sealed class?",
        "answer": "Когда варианты несут разные данные или их список может расширяться в других модулях.",
        "rubric": "Проверяется: В каких случаях enum лучше заменить на sealed class.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "kotlin-basics",
    "skillId": "junior-kotlin-sealed",
    "topic": "Sealed Class и Sealed Interface",
    "questions": [
      {
        "question": "Что такое sealed class?",
        "answer": "Ограниченная иерархия, все прямые наследники которой известны компилятору и находятся в том же модуле.",
        "rubric": "Проверяется: Что такое sealed class.",
        "priority": 3,
      },
      {
        "question": "Чем sealed interface отличается от sealed class?",
        "answer": "Интерфейс позволяет наследоваться от других классов и реализовывать несколько интерфейсов, а класс накладывает ограничения на конструктор.",
        "rubric": "Проверяется: Чем sealed interface отличается от sealed class.",
        "priority": 3,
      },
      {
        "question": "Где должны находиться прямые наследники sealed-типа?",
        "answer": "В том же модуле и пакете, что и сам sealed-тип.",
        "rubric": "Проверяется: Где должны находиться прямые наследники sealed-типа.",
        "priority": 3,
      },
      {
        "question": "Что такое exhaustive when?",
        "answer": "`when`, обрабатывающий все варианты sealed-типа, благодаря чему ветка `else` не нужна.",
        "rubric": "Проверяется: Что такое exhaustive when.",
        "priority": 3,
      },
      {
        "question": "Почему для sealed-типа можно не писать `else`?",
        "answer": "Компилятор знает полный список наследников и проверяет полноту ветвей.",
        "rubric": "Проверяется: Почему для sealed-типа можно не писать `else`.",
        "priority": 3,
      },
      {
        "question": "Чем sealed class отличается от enum?",
        "answer": "У enum одна константа на значение без дополнительных данных, а наследники sealed — полноценные классы со своим состоянием.",
        "rubric": "Проверяется: Чем sealed class отличается от enum.",
        "priority": 3,
      },
      {
        "question": "Когда вариант sealed-типа должен быть data class?",
        "answer": "Когда он хранит данные и его нужно сравнивать по значению, например `data class Error(val message: String)`.",
        "rubric": "Проверяется: Когда вариант sealed-типа должен быть data class.",
        "priority": 3,
      },
      {
        "question": "Почему sealed interface удобен для моделирования UI State?",
        "answer": "Позволяет описать состояния с разными данными и получить проверку полноты `when` на этапе компиляции.",
        "rubric": "Проверяется: Почему sealed interface удобен для моделирования UI State.",
        "priority": 3,
      },
      {
        "question": "Что такое прямой и косвенный наследник?",
        "answer": "Прямой объявлен непосредственно от sealed-типа, косвенный — через прямого; для проверки `when` важен именно прямой набор.",
        "rubric": "Проверяется: Что такое прямой и косвенный наследник.",
        "priority": 3,
      },
      {
        "question": "Почему несколько Boolean для описания состояния могут быть плохой моделью?",
        "answer": "Они допускают противоречивые комбинации вроде `isLoading && isError`, а sealed-тип делает невозможные состояния невыразимыми.",
        "rubric": "Проверяется: Почему несколько Boolean для описания состояния могут быть плохой моделью.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "kotlin-basics",
    "skillId": "junior-kotlin-packages",
    "topic": "Packages и Visibility Modifiers",
    "questions": [
      {
        "question": "Для чего нужны packages?",
        "answer": "Для организации кода и пространства имён; они также влияют на видимость `private` и `internal`.",
        "rubric": "Проверяется: Для чего нужны packages.",
        "priority": 3,
      },
      {
        "question": "Обязательно ли имя package должно соответствовать директории?",
        "answer": "Нет, компилятор это не проверяет, но соглашение рекомендуется соблюдать для навигации по проекту.",
        "rubric": "Проверяется: Обязательно ли имя package должно соответствовать директории.",
        "priority": 3,
      },
      {
        "question": "Что можно импортировать в Kotlin?",
        "answer": "Классы, функции, свойства, объекты и extension functions; из пакета `kotlin` члены импортируются автоматически.",
        "rubric": "Проверяется: Что можно импортировать в Kotlin.",
        "priority": 3,
      },
      {
        "question": "Как работает import alias?",
        "answer": "`import com.example.User as ApiUser` даёт классу другое имя в файле и помогает разрешить конфликты.",
        "rubric": "Проверяется: Как работает import alias.",
        "priority": 3,
      },
      {
        "question": "Какой модификатор доступа используется по умолчанию?",
        "answer": "`public`: член виден везде, где виден содержащий его класс.",
        "rubric": "Проверяется: Какой модификатор доступа используется по умолчанию.",
        "priority": 3,
      },
      {
        "question": "Чем `private` на уровне файла отличается от `private` внутри класса?",
        "answer": "На уровне файла объявление видно только в этом файле, внутри класса — только внутри класса.",
        "rubric": "Проверяется: Чем `private` на уровне файла отличается от `private` внутри класса.",
        "priority": 3,
      },
      {
        "question": "Что означает `protected`?",
        "answer": "Видимость внутри класса и его наследников, но не в остальном пакете.",
        "rubric": "Проверяется: Что означает `protected`.",
        "priority": 3,
      },
      {
        "question": "Что такое `internal`?",
        "answer": "Видимость в пределах одного модуля; на JVM реализуется через name mangling в именах.",
        "rubric": "Проверяется: Что такое `internal`.",
        "priority": 3,
      },
      {
        "question": "Чем Kotlin-модуль отличается от package?",
        "answer": "Модуль — единица компиляции и граница `internal`, package — только пространство имён.",
        "rubric": "Проверяется: Чем Kotlin-модуль отличается от package.",
        "priority": 3,
      },
      {
        "question": "Почему публичный API не должен раскрывать internal-тип?",
        "answer": "Потому что потребители модуля не смогут получить доступ к такому типу, и публичная сигнатура окажется бесполезной.",
        "rubric": "Проверяется: Почему публичный API не должен раскрывать internal-тип.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "kotlin-basics",
    "skillId": "junior-kotlin-generics",
    "topic": "Generics Basics",
    "questions": [
      {
        "question": "Что такое generics?",
        "answer": "Обобщённое программирование: параметры типов позволяют переиспользовать код с разными типами без потери типобезопасности.",
        "rubric": "Проверяется: Что такое generics.",
        "priority": 3,
      },
      {
        "question": "Для чего используется параметр типа `T`?",
        "answer": "Как заполнитель конкретного типа, который станет известен при использовании класса или функции.",
        "rubric": "Проверяется: Для чего используется параметр типа `T`.",
        "priority": 3,
      },
      {
        "question": "В чём разница между `T`, `E`, `K` и `V`?",
        "answer": "Это соглашения об именах: `T` — тип, `E` — элемент, `K` — ключ, `V` — значение; на поведение они не влияют.",
        "rubric": "Проверяется: В чём разница между `T`, `E`, `K` и `V`.",
        "priority": 3,
      },
      {
        "question": "Как создать generic-класс?",
        "answer": "Например `class Box<T>(val value: T)`, затем `Box<String>(\"x\")`.",
        "rubric": "Проверяется: Как создать generic-класс.",
        "priority": 3,
      },
      {
        "question": "Как создать generic-функцию?",
        "answer": "`fun <T> first(list: List<T>): T = list[0]`: параметр типа указывается сразу после `fun`.",
        "rubric": "Проверяется: Как создать generic-функцию.",
        "priority": 3,
      },
      {
        "question": "Что такое upper bound?",
        "answer": "Ограничение параметра типа, например `T : Number`, сужающее множество допустимых типов.",
        "rubric": "Проверяется: Что такое upper bound.",
        "priority": 3,
      },
      {
        "question": "Что означает `T : Number`?",
        "answer": "Параметр `T` должен быть подтипом `Number`, поэтому внутри доступны его методы.",
        "rubric": "Проверяется: Что означает `T : Number`.",
        "priority": 3,
      },
      {
        "question": "Для чего используется `where`?",
        "answer": "Для нескольких ограничений, в том числе пользовательских интерфейсов: `where T : Number, T : Comparable<T>`.",
        "rubric": "Проверяется: Для чего используется `where`.",
        "priority": 3,
      },
      {
        "question": "Что означает `T : Any`?",
        "answer": "Явно делает параметр non-nullable; по умолчанию upper bound для `T` — `Any?`.",
        "rubric": "Проверяется: Что означает `T : Any`.",
        "priority": 3,
      },
      {
        "question": "Почему generic-код безопаснее, чем использование `Any`?",
        "answer": "Компилятор проверяет типы и не требует приведений, которые могут упасть с `ClassCastException`.",
        "rubric": "Проверяется: Почему generic-код безопаснее, чем использование `Any`.",
        "priority": 3,
      },
      {
        "question": "Что означает `List<String>`?",
        "answer": "Список, гарантированно содержащий строки; попытка добавить другой тип не компилируется.",
        "rubric": "Проверяется: Что означает `List<String>`.",
        "priority": 3,
      },
      {
        "question": "Чем отличаются `List<String>` и `List<Any>`?",
        "answer": "`List` ковариантен (`out E`), поэтому `List<String>` можно передать туда, где ожидается `List<Any>`, но не наоборот.",
        "rubric": "Проверяется: Чем отличаются `List<String>` и `List<Any>`.",
        "priority": 3,
      },
      {
        "question": "Что такое type erasure?",
        "answer": "На JVM параметры типов стираются при компиляции, поэтому `List<String>` и `List<Int>` в рантайме имеют один и тот же тип `List`.",
        "rubric": "Проверяется: Что такое type erasure.",
        "priority": 3,
      },
      {
        "question": "Почему нельзя проверить `value is List<String>` во время выполнения на JVM?",
        "answer": "Из-за стирания типов информация о `String` отсутствует, и компилятор запрещает такую проверку.",
        "rubric": "Проверяется: Почему нельзя проверить `value is List<String>` во время выполнения на JVM.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "navigaciya-i-komponenty",
    "skillId": "junior-nav-fragment",
    "topic": "Fragment",
    "questions": [
      {
        "question": "Чем `viewLifecycleOwner` отличается от жизненного цикла самого Fragment?",
        "answer": "`viewLifecycleOwner` живёт только пока есть View — от `onCreateView` до `onDestroyView`, а Fragment может оставаться в back stack и после этого. Наблюдателей LiveData и корутины для UI привязывают к `viewLifecycleOwner`, иначе они продолжат работать с уничтоженной View и вызовут утечку или крах.",
        "rubric": "Проверяется: Чем `viewLifecycleOwner` отличается от жизненного цикла самого Fragment.",
        "priority": 2,
      },
      {
        "question": "Почему binding надо обнулять в `onDestroyView()`?",
        "answer": "View в `onDestroyView` уничтожается, а сам Fragment ещё жив, поэтому оставленная ссылка на binding удерживает мёртвую View и ведёт к утечке памяти. После `_binding = null` обращение к `binding` даст `NullPointerException`, что вовремя покажет ошибку.",
        "rubric": "Проверяется: Почему binding надо обнулять в `onDestroyView()`.",
        "priority": 2,
      },
      {
        "question": "Чем `Fragment Result API` лучше прямых ссылок между Fragment'ами?",
        "answer": "`setFragmentResult()` и `setFragmentResultListener()` связывают отправителя и получателя через ключ вместо прямых ссылок друг на друга и на Activity. Это снижает связность и риск утечек, а результат доставляется через общий `FragmentManager`, даже если экраны не знают о существовании друг друга.",
        "rubric": "Проверяется: Чем `Fragment Result API` лучше прямых ссылок между Fragment'ами.",
        "priority": 2,
      },
      {
        "question": "В чём разница между `childFragmentManager` и `parentFragmentManager`?",
        "answer": "`childFragmentManager` управляет вложенными Fragment'ами внутри текущего, а `parentFragmentManager` — менеджером родителя (или Activity для корневого Fragment). Неверный выбор приведёт к транзакции в чужом контейнере и неправильному back stack.",
        "rubric": "Проверяется: В чём разница между `childFragmentManager` и `parentFragmentManager`.",
        "priority": 2,
      },
      {
        "question": "Почему нельзя передавать данные через конструктор Fragment?",
        "answer": "При восстановлении система создаёт Fragment через рефлексию пустым конструктором, поэтому конструктор с параметрами упадёт после поворота экрана или смерти процесса. Данные кладут в `arguments` (`Bundle`), обычно через фабричный метод `newInstance()`.",
        "rubric": "Проверяется: Почему нельзя передавать данные через конструктор Fragment.",
        "priority": 2,
      },
      {
        "question": "Чем `commit()` отличается от `commitNow()`?",
        "answer": "`commit()` ставит `FragmentTransaction` в очередь и выполняет её асинхронно на главном потоке, поддерживая `addToBackStack()`. `commitNow()` выполняется синхронно, но не позволяет добавить транзакцию в back stack.",
        "rubric": "Проверяется: Чем `commit()` отличается от `commitNow()`.",
        "priority": 2,
      },
      {
        "question": "Что происходит со View Fragment при `replace()` и помещении в back stack?",
        "answer": "`replace()` удаляет предыдущий Fragment из контейнера и вызывает у него `onDestroyView()`, но не `onDestroy` — сам Fragment остаётся в back stack. Поэтому состояние, переживающее возврат, хранят в ViewModel или `arguments`, а не в полях View.",
        "rubric": "Проверяется: Что происходит со View Fragment при `replace()` и помещении в back stack.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "navigaciya-i-komponenty",
    "skillId": "junior-nav-navigation",
    "topic": "Navigation Component",
    "questions": [
      {
        "question": "Зачем нужен граф навигации вместо ручных `FragmentTransaction`?",
        "answer": "Граф в `res/navigation/` декларативно описывает экраны и переходы, а `NavController` берёт на себя back stack. Это убирает дублирование транзакций в коде и делает навигацию предсказуемой.",
        "rubric": "Проверяется: Зачем нужен граф навигации вместо ручных `FragmentTransaction`.",
        "priority": 2,
      },
      {
        "question": "Что дают type-safe маршруты и Safe Args?",
        "answer": "Плагин Safe Args генерирует классы `*Args` и `*Directions`, заменяя ручные ключи `Bundle`, поэтому опечатки и неверные типы ловятся на этапе компиляции. В Compose ту же роль играют сериализуемые объекты маршрутов вместо строковых путей.",
        "rubric": "Проверяется: Что дают type-safe маршруты и Safe Args.",
        "priority": 2,
      },
      {
        "question": "Как передать аргументы между экранами?",
        "answer": "Аргументы объявляются в графе тегом `<argument>` с типом, а значение передаётся через сгенерированный `*Directions`-класс или `Bundle`. Получатель читает их через `DetailsFragmentArgs.fromBundle(requireArguments())`.",
        "rubric": "Проверяется: Как передать аргументы между экранами.",
        "priority": 2,
      },
      {
        "question": "Чем `popUpTo` отличается от `navigate()`?",
        "answer": "`navigate()` добавляет destination в back stack, а `app:popUpTo` с `popUpToInclusive` на action, наоборот, выталкивает экраны из стека перед переходом. Так предотвращают накопление дубликатов, например возвращаясь к корневому экрану.",
        "rubric": "Проверяется: Чем `popUpTo` отличается от `navigate()`.",
        "priority": 2,
      },
      {
        "question": "Как работает deep link?",
        "answer": "В графе объявляется `<deepLink app:uri=\"...\">`, а в манифесте Activity — `<intent-filter>` с действием `VIEW` и категорией `BROWSABLE`. `NavController` сам разбирает URI и открывает нужный destination с аргументами; явный deep link может прийти из `PendingIntent` уведомления.",
        "rubric": "Проверяется: Как работает deep link.",
        "priority": 2,
      },
      {
        "question": "Чем `navigateUp()` отличается от `popBackStack()`?",
        "answer": "`navigateUp()` учитывает иерархию графа и работает как «Up», а `popBackStack()` просто снимает верхний destination как кнопка «Назад». На стартовом destination «Назад» завершает Activity.",
        "rubric": "Проверяется: Чем `navigateUp()` отличается от `popBackStack()`.",
        "priority": 2,
      },
      {
        "question": "Зачем у `NavHostFragment` указывать `app:defaultNavHost=\"true\"`?",
        "answer": "Флаг делает NavHost обработчиком системной кнопки «Назад», чтобы она управляла back stack графа. Без него навигация не перехватывает «Назад» и её придётся обрабатывать вручную.",
        "rubric": "Проверяется: Зачем у `NavHostFragment` указывать `app:defaultNavHost=\"true\"`.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "navigaciya-i-komponenty",
    "skillId": "junior-nav-service",
    "topic": "Service",
    "questions": [
      {
        "question": "Чем started Service отличается от bound?",
        "answer": "Started Service запускается через `startService()` и живёт до `stopSelf()`/`stopService()`, даже если клиентов нет. Bound привязывается через `bindService()` и работает, пока есть хотя бы один клиент с `IBinder`; если Service и started, и bound, он уничтожается только после остановки и отключения всех клиентов.",
        "rubric": "Проверяется: Чем started Service отличается от bound.",
        "priority": 3,
      },
      {
        "question": "Почему с Android 8.0 запрещено запускать обычный Service в фоне?",
        "answer": "Background execution limits не дают фоновому приложению вызвать `startService()`: система бросит `IllegalStateException`. Это сделано ради экономии батареи, поэтому для заметной пользователю работы нужен Foreground Service, а для отложенной — WorkManager или JobScheduler.",
        "rubric": "Проверяется: Почему с Android 8.0 запрещено запускать обычный Service в фоне.",
        "priority": 3,
      },
      {
        "question": "Когда выбрать WorkManager вместо Service?",
        "answer": "WorkManager подходит для отложенной гарантированной работы: она переживает перезагрузку и учитывает ограничения вроде сети и зарядки. Для длительной работы в реальном времени с индикацией (музыка, навигация) нужен Foreground Service, а для мгновенной короткой задачи — корутина в ViewModel.",
        "rubric": "Проверяется: Когда выбрать WorkManager вместо Service.",
        "priority": 3,
      },
      {
        "question": "Зачем Foreground Service показывает уведомление?",
        "answer": "Уведомление делает длительную работу видимой пользователю и даёт ему возможность остановить её, такой Service система не убивает при нехватке памяти. Канал уведомлений обязателен с Android 8.0.",
        "rubric": "Проверяется: Зачем Foreground Service показывает уведомление.",
        "priority": 3,
      },
      {
        "question": "Что нужно сделать после `startForegroundService()`?",
        "answer": "Примерно в течение 5 секунд нужно вызвать `startForeground()` с уведомлением, иначе система остановит приложение. На Android 14+ (API 34) дополнительно обязательны `android:foregroundServiceType` в манифесте и соответствующее разрешение.",
        "rubric": "Проверяется: Что нужно сделать после `startForegroundService()`.",
        "priority": 3,
      },
      {
        "question": "Как возвращаемое значение `onStartCommand()` влияет на перезапуск Service?",
        "answer": "`START_STICKY` перезапускает Service с null intent, `START_NOT_STICKY` не перезапускает, а `START_REDELIVER_INTENT` возвращает тот же intent. Выбор зависит от того, можно ли потерять команду при убийстве процесса.",
        "rubric": "Проверяется: Как возвращаемое значение `onStartCommand()` влияет на перезапуск Service.",
        "priority": 3,
      },
      {
        "question": "Выполняется ли код Service в фоновом потоке?",
        "answer": "Нет: по умолчанию колбэки Service идут в главном потоке процесса, поэтому тяжёлую работу выносят в корутины или отдельные потоки. Иначе главный поток блокируется и возникает ANR.",
        "rubric": "Проверяется: Выполняется ли код Service в фоновом потоке.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "navigaciya-i-komponenty",
    "skillId": "junior-nav-broadcast",
    "topic": "BroadcastReceiver",
    "questions": [
      {
        "question": "Чем регистрация в манифесте отличается от динамической?",
        "answer": "Manifest-registered receiver может получить broadcast даже когда приложение не запущено, но с Android 8.0 большинство implicit broadcasts ему не доставляется. Динамическая регистрация через `registerReceiver()` работает только пока жив компонент и удобна для событий, актуальных во время работы приложения; её нужно снимать через `unregisterReceiver()`.",
        "rubric": "Проверяется: Чем регистрация в манифесте отличается от динамической.",
        "priority": 3,
      },
      {
        "question": "Почему с Android 8.0 ограничены implicit broadcasts?",
        "answer": "Для экономии батареи система не доставляет фоновым приложениям большинство неявных broadcasts через манифест; исключения вроде `BOOT_COMPLETED` и `ACTION_LOCALE_CHANGED` перечислены в документации. Вместо них используют явные broadcasts, WorkManager, JobScheduler или foreground Service.",
        "rubric": "Проверяется: Почему с Android 8.0 ограничены implicit broadcasts.",
        "priority": 3,
      },
      {
        "question": "Зачем при динамической регистрации указывать `RECEIVER_EXPORTED` или `RECEIVER_NOT_EXPORTED`?",
        "answer": "Начиная с Android 14 (targetSdk 34) флаг экспорта обязателен и явно определяет, может ли receiver получать сообщения от других приложений. Для внутренних событий используют `RECEIVER_NOT_EXPORTED`, чтобы не открывать receiver внешним приложениям.",
        "rubric": "Проверяется: Зачем при динамической регистрации указывать `RECEIVER_EXPORTED` или `RECEIVER_NOT_EXPORTED`.",
        "priority": 3,
      },
      {
        "question": "Что делает `goAsync()` и зачем вызывать `finish()`?",
        "answer": "`goAsync()` позволяет продолжить обработку broadcast в фоновом потоке после возврата из `onReceive()`, не блокируя главный. Работа должна закончиться вызовом `pendingResult.finish()`, иначе результат останется незавершённым и возможна утечка.",
        "rubric": "Проверяется: Что делает `goAsync()` и зачем вызывать `finish()`.",
        "priority": 3,
      },
      {
        "question": "Почему `onReceive()` должен быть быстрым?",
        "answer": "`onReceive()` вызывается в главном потоке, и система ожидает быстрого возврата: ориентир миллисекунды, жёсткий предел около 10 секунд. Сетевые запросы и тяжёлые вычисления прямо в нём грозят ANR, поэтому работу передают в WorkManager, Service или `goAsync()`.",
        "rubric": "Проверяется: Почему `onReceive()` должен быть быстрым.",
        "priority": 3,
      },
      {
        "question": "Чем `android:exported` отличается от флагов динамической регистрации?",
        "answer": "`android:exported` в манифесте определяет, может ли другое приложение отправить broadcast статическому receiver, и с Android 12 (API 31) атрибут обязателен при наличии `intent-filter`. Для динамических receiver ту же роль играют `RECEIVER_EXPORTED` и `RECEIVER_NOT_EXPORTED`.",
        "rubric": "Проверяется: Чем `android:exported` отличается от флагов динамической регистрации.",
        "priority": 3,
      },
      {
        "question": "Почему для событий внутри приложения лучше `SharedFlow`/`StateFlow`, а не broadcasts?",
        "answer": "Они типобезопасны, быстрее и не зависят от ограничений ОС на broadcasts. `LocalBroadcastManager` устарел, а системные broadcasts для внутренних событий избыточны.",
        "rubric": "Проверяется: Почему для событий внутри приложения лучше `SharedFlow`/`StateFlow`, а не broadcasts.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "navigaciya-i-komponenty",
    "skillId": "junior-nav-content-provider",
    "topic": "ContentProvider Basics",
    "questions": [
      {
        "question": "Зачем нужен ContentProvider?",
        "answer": "Он даёт единый контракт доступа к структурированным данным и позволяет безопасно делиться ими между приложениями, скрывая хранилище вроде БД или файлов. Системные провайдеры контактов, медиа и календаря доступны через `ContentResolver` без написания своего провайдера.",
        "rubric": "Проверяется: Зачем нужен ContentProvider.",
        "priority": 3,
      },
      {
        "question": "Из чего состоит `content://` URI и что такое authority?",
        "answer": "URI вида `content://authority/path/id` включает схему `content://`, authority — имя провайдера из `android:authorities`, путь и при необходимости id. `ContentResolver` находит провайдера по authority, а `ContentUris.withAppendedId()` добавляет id записи.",
        "rubric": "Проверяется: Из чего состоит `content://` URI и что такое authority.",
        "priority": 3,
      },
      {
        "question": "Что возвращает `ContentResolver.query()`?",
        "answer": "`Cursor` со строками результата или `null`, если запрос не удался, и его обязательно закрывают через `use` или `close()`. Данные читают после `moveToNext()`, а проекцию, `selection` с `selectionArgs` и сортировку задают аргументами запроса.",
        "rubric": "Проверяется: Что возвращает `ContentResolver.query()`.",
        "priority": 3,
      },
      {
        "question": "Зачем нужны URI permissions и `grantUriPermissions`?",
        "answer": "Они дают другому приложению временный доступ к конкретному URI без постоянного разрешения: FileProvider с `android:grantUriPermissions=\"true\"` раздаёт файлы через `content://` вместо запрещённых с Android 7.0 `file://`. Право передаётся флагом `FLAG_GRANT_READ_URI_PERMISSION` в Intent.",
        "rubric": "Проверяется: Зачем нужны URI permissions и `grantUriPermissions`.",
        "priority": 3,
      },
      {
        "question": "Почему опасно объявлять провайдер `exported=\"true\"`?",
        "answer": "Другие приложения смогут читать и менять данные, а непроверенный `selection` откроет путь к SQL-инъекции. Для внутренних провайдеров ставят `exported=\"false\"`, доступ ограничивают `android:readPermission` и `android:writePermission`, а входящие URI валидируют.",
        "rubric": "Проверяется: Почему опасно объявлять провайдер `exported=\"true\"`.",
        "priority": 3,
      },
      {
        "question": "Что даёт Photo Picker и почему он предпочтительнее прямого доступа к медиа?",
        "answer": "Photo Picker, доступный с Android 13+, а на 11+ через Google Play Services, показывает системный UI выбора, а приложение получает URI с временным доступом. Он не требует `READ_MEDIA_*` или `READ_EXTERNAL_STORAGE`, поэтому проще по разрешениям и приватнее.",
        "rubric": "Проверяется: Что даёт Photo Picker и почему он предпочтительнее прямого доступа к медиа.",
        "priority": 3,
      },
      {
        "question": "Что означают типы `vnd.android.cursor.item/` и `vnd.android.cursor.dir/`?",
        "answer": "Провайдер возвращает их из `getType(uri)`: первый означает одиночную запись, второй — набор записей. Клиент по MIME-типу понимает, как отображать результат.",
        "rubric": "Проверяется: Что означают типы `vnd.android.cursor.item/` и `vnd.android.cursor.dir/`.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "osnovy-programmirovaniya-kotlin",
    "skillId": "junior-osnovy-perem",
    "topic": "Переменные",
    "questions": [
      {
        "question": "Чем `val` отличается от `var`?",
        "answer": "`val` объявляет ссылку только для чтения: после присваивания её нельзя переназначить, а `var` можно. При этом `val` не делает сам объект неизменяемым — элементы mutable-коллекции всё равно можно менять.",
        "rubric": "Проверяется: Чем `val` отличается от `var`.",
        "priority": 3,
      },
      {
        "question": "Чем `const val` отличается от обычного `val`?",
        "answer": "`const val` — константа времени компиляции: её значение известно компилятору заранее. Разрешены только `String` и примитивные типы на уровне файла, `object` или `companion object`; результат вызова функции так объявить нельзя.",
        "rubric": "Проверяется: Чем `const val` отличается от обычного `val`.",
        "priority": 3,
      },
      {
        "question": "Когда использовать `lateinit`, а когда `lazy`?",
        "answer": "`lateinit var` подходит, когда значение задаёт внешний код позже, например View Binding после создания View. `lazy` вычисляет значение при первом чтении и кэширует его; `lateinit` работает только с `var` и не поддерживает примитивы, а `lazy` — с `val`.",
        "rubric": "Проверяется: Когда использовать `lateinit`, а когда `lazy`.",
        "priority": 3,
      },
      {
        "question": "Что произойдёт при чтении неинициализированного `lateinit`-свойства?",
        "answer": "Будет выброшено `UninitializedPropertyAccessException`. Проверить, задано ли значение, можно через `::property.isInitialized`.",
        "rubric": "Проверяется: Что произойдёт при чтении неинициализированного `lateinit`-свойства.",
        "priority": 3,
      },
      {
        "question": "Чем свойство отличается от поля?",
        "answer": "Поле — это ячейка памяти для данных, а свойство — уровень выше: оно может иметь getter и setter и использовать backing field. Простое `val x = 1` обычно даёт приватное поле и публичный геттер, но если getter вычисляет значение сам, backing field может не создаваться: [Kotlin docs: Properties and Fields](https://kotlinlang.org/docs/properties.html).",
        "rubric": "Проверяется: Чем свойство отличается от поля.",
        "priority": 3,
      },
      {
        "question": "Почему `lateinit` нельзя объявить с типом `Int`?",
        "answer": "`lateinit` требует non-nullable ссылочного типа и не поддерживает примитивы вроде `Int`, `Boolean` и `Double`. Для отложенной инициализации примитивов используют `lazy` или nullable-тип.",
        "rubric": "Проверяется: Почему `lateinit` нельзя объявить с типом `Int`.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "osnovy-programmirovaniya-kotlin",
    "skillId": "junior-osnovy-tipy",
    "topic": "Типы данных",
    "questions": [
      {
        "question": "Чем `Int` отличается от `Long`?",
        "answer": "`Int` — 32-битное целое с диапазоном от −2^31 до 2^31−1, `Long` — 64-битное и вмещает гораздо больше. Суффикс `L` явно задаёт тип `Long`, когда значений может не хватить `Int`.",
        "rubric": "Проверяется: Чем `Int` отличается от `Long`.",
        "priority": 2,
      },
      {
        "question": "Почему `toInt()` нужно вызывать явно, а преобразование не происходит само?",
        "answer": "Kotlin не делает неявных числовых преобразований: присвоить `Long` переменной `Int` напрямую нельзя. Явный вызов `toInt()` делает возможную потерю данных заметной в коде.",
        "rubric": "Проверяется: Почему `toInt()` нужно вызывать явно, а преобразование не происходит само.",
        "priority": 2,
      },
      {
        "question": "Что такое `Any`, `Unit` и `Nothing`?",
        "answer": "`Any` — корень иерархии всех non-nullable типов. `Unit` — тип с единственным значением, который возвращают функции без осмысленного результата, а `Nothing` описывает выражения, которые никогда не возвращают управление, например всегда бросающие исключение.",
        "rubric": "Проверяется: Что такое `Any`, `Unit` и `Nothing`.",
        "priority": 2,
      },
      {
        "question": "Как работает выведение типа?",
        "answer": "Компилятор определяет тип по инициализатору или возвращаемому значению: `val x = 10` даёт `Int`. Тип указывают явно, когда он неоднозначен, важен для публичного API или нужен другой числовой тип.",
        "rubric": "Проверяется: Как работает выведение типа.",
        "priority": 2,
      },
      {
        "question": "Чем `toInt()` отличается от `toIntOrNull()`?",
        "answer": "`toInt()` выбрасывает `NumberFormatException`, если строку нельзя разобрать как число. `toIntOrNull()` возвращает `null` вместо исключения, поэтому удобнее для пользовательского ввода.",
        "rubric": "Проверяется: Чем `toInt()` отличается от `toIntOrNull()`.",
        "priority": 2,
      },
      {
        "question": "Почему `Float` используют осторожно?",
        "answer": "Вещественный литерал вроде `1.1` по умолчанию имеет тип `Double`; для `Float` нужен суффикс `f`. `Double` точнее, а `Float` экономит память в основном на больших массивах.",
        "rubric": "Проверяется: Почему `Float` используют осторожно.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "osnovy-programmirovaniya-kotlin",
    "skillId": "junior-osnovy-uslov",
    "topic": "Условные конструкции",
    "questions": [
      {
        "question": "Чем `when` в Kotlin лучше `switch` в Java?",
        "answer": "`when` — выражение, поэтому оно возвращает значение, и оно поддерживает произвольные условия, диапазоны `in` и проверки типов `is`. Ветви не «проваливаются» вниз: выполняется только первая подходящая, без неявного `break`.",
        "rubric": "Проверяется: Чем `when` в Kotlin лучше `switch` в Java.",
        "priority": 2,
      },
      {
        "question": "Почему говорят, что `if` в Kotlin — выражение?",
        "answer": "Его результат можно использовать справа от `=`: `val max = if (a > b) a else b`. В Java для того же пришлось бы применять тернарный оператор `?:`.",
        "rubric": "Проверяется: Почему говорят, что `if` в Kotlin — выражение.",
        "priority": 2,
      },
      {
        "question": "Что такое короткое замыкание (short-circuit evaluation)?",
        "answer": "Операторы `&&` и `||` не вычисляют правую часть, если результат уже известен по левой: при `false && ...` правая часть не выполнится. Это позволяет безопасно писать `s != null && s.isNotEmpty()`.",
        "rubric": "Проверяется: Что такое короткое замыкание (short-circuit evaluation).",
        "priority": 2,
      },
      {
        "question": "Что значит exhaustive `when` и когда можно не писать `else`?",
        "answer": "В выражении `when` ветви должны покрывать все варианты, иначе компилятор потребует `else`. Для `Boolean`, `enum` и `sealed class` все значения можно перечислить явно, и `else` становится лишним.",
        "rubric": "Проверяется: Что значит exhaustive `when` и когда можно не писать `else`.",
        "priority": 2,
      },
      {
        "question": "Чем `when (x)` отличается от `when` без аргумента?",
        "answer": "`when (x)` сравнивает одно значение с каждым вариантом, а `when { condition -> ... }` проверяет независимые условия. Второй вид удобен для диапазонов и сложных условий.",
        "rubric": "Проверяется: Чем `when (x)` отличается от `when` без аргумента.",
        "priority": 2,
      },
      {
        "question": "Как проверить попадание числа в диапазон?",
        "answer": "Оператор `in`: `x in 10..100`; отрицание записывается как `!in`. Он работает не только с числами, но и с любым типом, для которого определён `contains`.",
        "rubric": "Проверяется: Как проверить попадание числа в диапазон.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "osnovy-programmirovaniya-kotlin",
    "skillId": "junior-osnovy-cikly",
    "topic": "Циклы",
    "questions": [
      {
        "question": "Чем диапазон `..` отличается от `until`?",
        "answer": "`1..5` включает обе границы: 1, 2, 3, 4, 5. `1 until 5` исключает правую границу: 1, 2, 3, 4 — это удобно для перебора индексов.",
        "rubric": "Проверяется: Чем диапазон `..` отличается от `until`.",
        "priority": 2,
      },
      {
        "question": "Как создать убывающий диапазон?",
        "answer": "Функция `downTo`: `5 downTo 1` даёт 5, 4, 3, 2, 1 с шагом −1 и включительной правой границей.",
        "rubric": "Проверяется: Как создать убывающий диапазон.",
        "priority": 2,
      },
      {
        "question": "Зачем нужен `step`?",
        "answer": "Он задаёт шаг итерации: `1..10 step 2` даёт 1, 3, 5, 7, 9. Значение `step` всегда положительное, а направление задают `downTo` или обычный возрастающий порядок.",
        "rubric": "Проверяется: Зачем нужен `step`.",
        "priority": 2,
      },
      {
        "question": "Как работает `break` с меткой?",
        "answer": "Метка вида `outer@ for (...)` называет цикл, а `break@outer` завершает именно его, а не ближайший внутренний. Без метки `break` прерывает только самый внутренний цикл.",
        "rubric": "Проверяется: Как работает `break` с меткой.",
        "priority": 2,
      },
      {
        "question": "Чем `continue` отличается от `break`?",
        "answer": "`break` полностью прекращает выполнение цикла, а `continue` пропускает только текущую итерацию и переходит к следующей. Оба оператора поддерживают метки.",
        "rubric": "Проверяется: Чем `continue` отличается от `break`.",
        "priority": 2,
      },
      {
        "question": "Чем перебор по индексу отличается от перебора по элементам?",
        "answer": "`for (i in 0..lastIndex)` даёт индексы и позволяет обращаться к элементу по номеру, а `for (item in collection)` перебирает сами элементы. Второй вариант короче, когда индекс не нужен.",
        "rubric": "Проверяется: Чем перебор по индексу отличается от перебора по элементам.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "osnovy-programmirovaniya-kotlin",
    "skillId": "junior-osnovy-funkc",
    "topic": "Функции",
    "questions": [
      {
        "question": "Зачем нужны параметры по умолчанию?",
        "answer": "Они позволяют не передавать все аргументы: `fun greet(name: String = \"Guest\")`. Это заменяет несколько перегрузок и делает API компактнее.",
        "rubric": "Проверяется: Зачем нужны параметры по умолчанию.",
        "priority": 2,
      },
      {
        "question": "Что такое именованные аргументы?",
        "answer": "Это передача значений по имени параметра: `greet(name = \"Alex\")`. Особенно полезно, когда параметров несколько и часть из них имеет значения по умолчанию.",
        "rubric": "Проверяется: Что такое именованные аргументы.",
        "priority": 2,
      },
      {
        "question": "Что такое expression body функции?",
        "answer": "Краткая форма `fun square(x: Int) = x * x`, где телом служит одно выражение, а его результат становится возвращаемым значением. В форме с `{ ... }` нужно явно писать `return`, если результат не `Unit`.",
        "rubric": "Проверяется: Что такое expression body функции.",
        "priority": 2,
      },
      {
        "question": "Чем `vararg` отличается от обычного параметра и как работает spread?",
        "answer": "`vararg items: String` принимает произвольное число аргументов. Чтобы передать уже существующий массив, используют префикс `*`: `foo(*array)`.",
        "rubric": "Проверяется: Чем `vararg` отличается от обычного параметра и как работает spread.",
        "priority": 2,
      },
      {
        "question": "Зачем нужны локальные функции?",
        "answer": "Это функции внутри другой функции: они видят переменные внешней области и помогают вынести повторяющуюся логику, не расширяя её видимость.",
        "rubric": "Проверяется: Зачем нужны локальные функции.",
        "priority": 2,
      },
      {
        "question": "Почему параметры функции нельзя переназначать?",
        "answer": "Параметры в Kotlin ведут себя как `val`: присваивание `x = 5` внутри функции — ошибка компиляции. Если нужно изменить значение, создают локальную `var`.",
        "rubric": "Проверяется: Почему параметры функции нельзя переназначать.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "osnovy-programmirovaniya-kotlin",
    "skillId": "junior-osnovy-oop",
    "topic": "ООП основы",
    "questions": [
      {
        "question": "Почему классы в Kotlin `final` по умолчанию?",
        "answer": "Нельзя наследоваться от final-класса, поэтому компилятор и JVM могут выполнять оптимизации вроде встраивания вызовов. Чтобы разрешить наследование, класс явно помечают `open`.",
        "rubric": "Проверяется: Почему классы в Kotlin `final` по умолчанию.",
        "priority": 3,
      },
      {
        "question": "Чем первичный конструктор отличается от вторичного?",
        "answer": "Первичный входит в заголовок `class User(val name: String)` и не содержит кода: инициализация идёт в блоках `init`. Вторичный — это `constructor(...)` в теле класса, он может выполнять код и делегирует первичному через `this`.",
        "rubric": "Проверяется: Чем первичный конструктор отличается от вторичного.",
        "priority": 3,
      },
      {
        "question": "Чем абстрактный класс отличается от интерфейса?",
        "answer": "Абстрактный класс может хранить состояние и наследуется только один раз. Интерфейс описывает контракт, может иметь реализации по умолчанию, но не хранит состояние, и класс может реализовывать несколько интерфейсов.",
        "rubric": "Проверяется: Чем абстрактный класс отличается от интерфейса.",
        "priority": 3,
      },
      {
        "question": "Что значит «композиция вместо наследования»?",
        "answer": "Класс содержит другие объекты и делегирует им работу («имеет») вместо того чтобы наследоваться («является»). Это даёт слабую связанность и позволяет менять поведение во время выполнения.",
        "rubric": "Проверяется: Что значит «композиция вместо наследования».",
        "priority": 3,
      },
      {
        "question": "Что такое полиморфизм на примере Kotlin?",
        "answer": "Если `open class Animal` и `class Dog : Animal()`, переменная типа `Animal` может хранить `Dog`, а вызов виртуального метода выполнит реализацию из `Dog`. Код работает с базовым типом, не зная конкретный подкласс.",
        "rubric": "Проверяется: Что такое полиморфизм на примере Kotlin.",
        "priority": 3,
      },
      {
        "question": "Чем `override` отличается от `open`?",
        "answer": "`open` разрешает переопределить член в подклассе, а `override` — само переопределение. Переопределённый член снова становится `open`, если его явно не пометить `final`.",
        "rubric": "Проверяется: Чем `override` отличается от `open`.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "osnovy-programmirovaniya-kotlin",
    "skillId": "junior-osnovy-coll",
    "topic": "Коллекции",
    "questions": [
      {
        "question": "Чем `List` отличается от `MutableList`?",
        "answer": "`List` — read-only интерфейс: можно читать и искать элементы, но нельзя добавлять или удалять их. `MutableList` добавляет операции `add`, `remove`, `clear`.",
        "rubric": "Проверяется: Чем `List` отличается от `MutableList`.",
        "priority": 1,
      },
      {
        "question": "Когда выбрать `Set`, а когда `Map`?",
        "answer": "`Set` хранит уникальные значения, когда важно только наличие элемента. `Map` хранит пары ключ–значение, когда по ключу нужно получить связанное значение.",
        "rubric": "Проверяется: Когда выбрать `Set`, а когда `Map`.",
        "priority": 1,
      },
      {
        "question": "Чем `filter` отличается от `map`?",
        "answer": "`filter` оставляет элементы, удовлетворяющие условию, не меняя их, а `map` преобразует каждый элемент в новый результат. Оба возвращают новую коллекцию и не изменяют исходную.",
        "rubric": "Проверяется: Чем `filter` отличается от `map`.",
        "priority": 1,
      },
      {
        "question": "Почему `val list = mutableListOf(...)` можно изменять?",
        "answer": "`val` защищает только ссылку от повторного присваивания, но не запрещает операции над объектом: `list.add(...)` разрешён, а `list = ...` — нет.",
        "rubric": "Проверяется: Почему `val list = mutableListOf(...)` можно изменять.",
        "priority": 1,
      },
      {
        "question": "Почему read-only коллекция не обязательно immutable?",
        "answer": "`List<T>` просто не предоставляет методов изменения, но лежащий в основе объект может быть изменяемым: если это `MutableList`, его можно привести к нему и изменить. Kotlin не гарантирует неизменяемость: [Kotlin docs: Collections overview](https://kotlinlang.org/docs/collections-overview.html).",
        "rubric": "Проверяется: Почему read-only коллекция не обязательно immutable.",
        "priority": 1,
      },
      {
        "question": "Чем `find` отличается от `first` и `firstOrNull`?",
        "answer": "`find` — синоним `firstOrNull`: возвращает первый подходящий элемент или `null`. Метод `first` выбрасывает `NoSuchElementException`, если подходящего элемента нет.",
        "rubric": "Проверяется: Чем `find` отличается от `first` и `firstOrNull`.",
        "priority": 1,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "osnovy-programmirovaniya-kotlin",
    "skillId": "junior-osnovy-oshibki",
    "topic": "Обработка ошибок",
    "questions": [
      {
        "question": "Чем `Exception` отличается от `Error`?",
        "answer": "Оба наследуют `Throwable`, но `Exception` описывает ситуации, которые разумно перехватывать и обрабатывать, например `IOException`. `Error` сигнализирует о серьёзной проблеме среды выполнения, такой как `OutOfMemoryError`, и обычно его не перехватывают.",
        "rubric": "Проверяется: Чем `Exception` отличается от `Error`.",
        "priority": 3,
      },
      {
        "question": "Зачем нужен блок `finally`?",
        "answer": "Он выполняется после `try` и `catch` независимо от того, возникло исключение или нет. В нём закрывают файлы и соединения: код выполнится и при повторном выбросе из `catch`.",
        "rubric": "Проверяется: Зачем нужен блок `finally`.",
        "priority": 3,
      },
      {
        "question": "Чем `runCatching` отличается от `try/catch`?",
        "answer": "`runCatching` выполняет блок и возвращает `Result<T>` со значением или исключением вместо передачи управления в `catch`. Он ловит любой `Throwable`, поэтому в корутинах важно не потерять `CancellationException`: [Kotlin docs: Exception handling](https://kotlinlang.org/docs/exception-handling.html).",
        "rubric": "Проверяется: Чем `runCatching` отличается от `try/catch`.",
        "priority": 3,
      },
      {
        "question": "Почему `!!` считается плохой практикой?",
        "answer": "`!!` принудительно превращает nullable-значение в non-nullable и бросает `NullPointerException`, если оно `null`. Так теряется причина ошибки; обычно используют `?.`, `?:` или явную проверку на `null`.",
        "rubric": "Проверяется: Почему `!!` считается плохой практикой.",
        "priority": 3,
      },
      {
        "question": "Зачем использовать `sealed class` для результата операции?",
        "answer": "Он ограничивает набор вариантов, например `Success`, `InvalidPassword`, `UserNotFound`, и компилятор проверяет, что `when` обработал их все. Бизнес-результаты становятся явными на уровне типов, в отличие от `Result<T>`, где ошибка — просто `Throwable`.",
        "rubric": "Проверяется: Зачем использовать `sealed class` для результата операции.",
        "priority": 3,
      },
      {
        "question": "Что вернёт `getOrNull()` у `Result` при ошибке?",
        "answer": "`null`, а не повторный выброс исключения. Для получения значения с выбросом есть `getOrThrow()`, а для запасного значения — `getOrElse {}`.",
        "rubric": "Проверяется: Что вернёт `getOrNull()` у `Result` при ошибке.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "osnovy-programmirovaniya-kotlin",
    "skillId": "junior-osnovy-algo",
    "topic": "Основы алгоритмов",
    "questions": [
      {
        "question": "Что такое Big O и что он описывает?",
        "answer": "Big O описывает порядок роста количества операций при увеличении входных данных, а не время в миллисекундах. Он позволяет сравнивать алгоритмы независимо от языка и железа.",
        "rubric": "Проверяется: Что такое Big O и что он описывает.",
        "priority": 3,
      },
      {
        "question": "Чем O(n) отличается от O(n²)?",
        "answer": "При O(n) число операций растёт линейно, при O(n²) — пропорционально квадрату размера входа. Если размер удвоить, O(n) сделает примерно вдвое больше работы, а O(n²) — примерно вчетверо.",
        "rubric": "Проверяется: Чем O(n) отличается от O(n²).",
        "priority": 3,
      },
      {
        "question": "Когда линейный поиск хуже бинарного?",
        "answer": "На больших отсортированных массивах: линейный поиск требует O(n), бинарный — O(log n). Но бинарному нужны отсортированные данные и доступ по индексу, а на маленьких или несортированных массивах линейный поиск проще.",
        "rubric": "Проверяется: Когда линейный поиск хуже бинарного.",
        "priority": 3,
      },
      {
        "question": "Как оценить число операций во вложенных циклах?",
        "answer": "Перемножают число итераций: два цикла по `n` дают n·n = n². Если внутренний цикл зависит от внешнего, например `for (j in i until n)`, суммируют и получают n(n−1)/2 — тоже O(n²).",
        "rubric": "Проверяется: Как оценить число операций во вложенных циклах.",
        "priority": 3,
      },
      {
        "question": "Почему доступ к элементу списка по индексу — O(1)?",
        "answer": "У типичной индексируемой реализации вроде `ArrayList` элементы лежат в массиве и смещение вычисляется сразу по индексу. У связанного списка такой доступ был бы O(n).",
        "rubric": "Проверяется: Почему доступ к элементу списка по индексу — O(1).",
        "priority": 3,
      },
      {
        "question": "Чем сортировка помогает поиску?",
        "answer": "После сортировки можно искать бинарным поиском за O(log n) вместо линейного O(n). Сама сортировка стоит около O(n log n), поэтому выгодна, когда по тем же данным ищут много раз.",
        "rubric": "Проверяется: Чем сортировка помогает поиску.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "testing-basics",
    "skillId": "junior-test-junit",
    "topic": "JUnit и Unit Testing Basics",
    "questions": [
      {
        "question": "Чем unit-тест отличается от instrumentation-теста?",
        "answer": "Unit-тест выполняется на JVM без эмулятора и проверяет одну единицу логики в изоляции от Android-фреймворка, сети и базы. Instrumentation-тест запускается на устройстве или эмуляторе и работает с реальными Android-компонентами. [Local unit tests](https://developer.android.com/training/testing/local-tests)",
        "rubric": "Проверяется: Чем unit-тест отличается от instrumentation-теста.",
        "priority": 3,
      },
      {
        "question": "Зачем в тесте нужны `@BeforeEach` и `@AfterEach`?",
        "answer": "Они выполняются перед каждым и после каждого теста: готовят объекты и сбрасывают состояние, а затем освобождают ресурсы. Это аннотации JUnit 5; в JUnit 4 им соответствуют `@Before` и `@After`.",
        "rubric": "Проверяется: Зачем в тесте нужны `@BeforeEach` и `@AfterEach`.",
        "priority": 3,
      },
      {
        "question": "Как проверить, что метод бросает исключение?",
        "answer": "Используют `assertThrows<T> { ... }`: тест провалится, если исключение не было брошено, а брошенное можно дополнительно проверить. Например, можно сверить `exception.message` с ожидаемым сообщением.",
        "rubric": "Проверяется: Как проверить, что метод бросает исключение.",
        "priority": 3,
      },
      {
        "question": "Почему тесты должны быть изолированными?",
        "answer": "Общее изменяемое состояние и зависимость от порядка запуска приводят к флаки-тестам: результат зависит от предыдущих тестов. Каждый тест должен начинаться с чистых объектов, например созданных в `@BeforeEach`.",
        "rubric": "Проверяется: Почему тесты должны быть изолированными.",
        "priority": 3,
      },
      {
        "question": "Что означает Arrange-Act-Assert?",
        "answer": "Это три шага теста: подготовка данных и объектов, вызов тестируемого метода и проверка результата. Такой порядок делает тест читаемым и помогает придерживаться одной проверяемой идеи на тест.",
        "rubric": "Проверяется: Что означает Arrange-Act-Assert.",
        "priority": 3,
      },
      {
        "question": "Почему suspend-функцию нельзя вызвать из обычного `@Test` и как поступить?",
        "answer": "Обычный тест не может вызвать suspend-функцию напрямую, поэтому используют `runTest` из `kotlinx-coroutines-test`. Он запускает корутину в тестовом диспетчере и ждёт завершения, а `delay` не тратит реальные секунды, сдвигая виртуальные часы теста.",
        "rubric": "Проверяется: Почему suspend-функцию нельзя вызвать из обычного `@Test` и как поступить.",
        "priority": 3,
      },
      {
        "question": "В каком порядке передавать аргументы в `assertEquals`?",
        "answer": "Сначала ожидаемое значение, затем фактическое: `assertEquals(expected, actual)`. При провале JUnit покажет «expected X but was Y», и перепутанный порядок делает сообщение об ошибке бессмысленным.",
        "rubric": "Проверяется: В каком порядке передавать аргументы в `assertEquals`.",
        "priority": 3,
      },
      {
        "question": "Сколько UI-тестов должно быть относительно unit-тестов?",
        "answer": "По пирамиде тестирования unit-тестов много, интеграционных меньше, UI-тестов совсем мало. UI-тесты медленные и хрупкие, поэтому ими покрывают только критические пользовательские сценарии. [Testing pyramid](https://developer.android.com/training/testing/fundamentals/strategies#testing-pyramid)",
        "rubric": "Проверяется: Сколько UI-тестов должно быть относительно unit-тестов.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "testing-basics",
    "skillId": "junior-test-espresso",
    "topic": "Espresso Basics",
    "questions": [
      {
        "question": "Что делает `onView()` и почему тест может упасть с `AmbiguousViewMatcherException`?",
        "answer": "`onView(matcher)` находит View по матчеру и возвращает `ViewInteraction` для действий и проверок. Исключение возникает, если матчер слишком общий и нашёл несколько View; если не найдено ни одной, тест падает с `NoMatchingViewException`.",
        "rubric": "Проверяется: Что делает `onView()` и почему тест может упасть с `AmbiguousViewMatcherException`.",
        "priority": 3,
      },
      {
        "question": "Чем отличаются `perform()` и `check()`?",
        "answer": "`perform()` применяет `ViewActions`, например `click()` или `typeText()`, имитируя действия пользователя. `check()` применяет `ViewAssertions`, например `matches(isDisplayed())`, и подтверждает состояние View.",
        "rubric": "Проверяется: Чем отличаются `perform()` и `check()`.",
        "priority": 3,
      },
      {
        "question": "Как сделать матчер для View надёжным?",
        "answer": "Ищите по `withId` и при необходимости уточняйте через `allOf(withId(...), isEnabled())`. Матчеры только по тексту хрупки: текст меняется при локализации и может совпасть у нескольких элементов.",
        "rubric": "Проверяется: Как сделать матчер для View надёжным.",
        "priority": 3,
      },
      {
        "question": "Что такое IdlingResource?",
        "answer": "Это механизм, которым приложение сообщает Espresso о незавершённой фоновой работе: сетевом запросе, анимации или таймере. Espresso подождёт, пока ресурс не станет idle; без этого проверка может произойти до загрузки данных и тест ложно упадёт. [Idling resources](https://developer.android.com/training/testing/espresso/idling-resource)",
        "rubric": "Проверяется: Что такое IdlingResource.",
        "priority": 3,
      },
      {
        "question": "Почему нельзя использовать `Thread.sleep` в Espresso-тесте?",
        "answer": "Espresso сам синхронизируется с главным потоком и ждёт опустевшей очереди сообщений перед каждым действием. `Thread.sleep` лишь замедляет тест и не гарантирует завершения асинхронной операции — для этого нужны Idling Resources.",
        "rubric": "Проверяется: Почему нельзя использовать `Thread.sleep` в Espresso-тесте.",
        "priority": 3,
      },
      {
        "question": "Почему UI-тесты на Espresso бывают нестабильными?",
        "answer": "Главные причины: асинхронные операции без Idling Resources, включённые анимации и зависимость от данных сервера. Помогают отключение анимаций на устройстве, фейковые данные и корректно зарегистрированные Idling Resources.",
        "rubric": "Проверяется: Почему UI-тесты на Espresso бывают нестабильными.",
        "priority": 3,
      },
      {
        "question": "Можно ли написать Espresso-тест для Compose-экрана?",
        "answer": "Нет: Espresso работает с View-иерархией и не видит Compose-компоненты, поэтому поиск View завершится ошибкой. Для Compose используют Compose UI Test и семантическое дерево, а Espresso применяют к legacy-экранам.",
        "rubric": "Проверяется: Можно ли написать Espresso-тест для Compose-экрана.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "testing-basics",
    "skillId": "junior-test-mockk",
    "topic": "Test Doubles и MockK Basics",
    "questions": [
      {
        "question": "Чем различаются Fake, Stub, Mock и Spy?",
        "answer": "Fake — упрощённая рабочая реализация, Stub возвращает заранее заданные ответы, Mock проверяет вызовы и аргументы, а Spy оборачивает реальный объект и записывает вызовы. В MockK один мок может совмещать роли: `every`/`returns` превращают его в стаб.",
        "rubric": "Проверяется: Чем различаются Fake, Stub, Mock и Spy.",
        "priority": 3,
      },
      {
        "question": "Что произойдёт, если вызвать метод мока MockK без настройки?",
        "answer": "По умолчанию такой вызов бросает исключение, поэтому поведение нужно явно задать через `every`. `mockk(relaxed = true)` возвращает дефолтные значения, но скрывает неожиданные вызовы, и злоупотреблять им не стоит.",
        "rubric": "Проверяется: Что произойдёт, если вызвать метод мока MockK без настройки.",
        "priority": 3,
      },
      {
        "question": "В чём разница между `every` и `coEvery`?",
        "answer": "`every { ... } returns ...` настраивает обычные функции, а `coEvery` — suspend-функции, например `coEvery { repo.getUser(1) } returns User(1, \"Alex\")`. Для проверки вызовов есть пара `verify` / `coVerify`.",
        "rubric": "Проверяется: В чём разница между `every` и `coEvery`.",
        "priority": 3,
      },
      {
        "question": "Зачем вызывать `verify` после выполнения тестируемого кода?",
        "answer": "Чтобы убедиться, что зависимость вызвана с нужными аргументами и нужное число раз: `coVerify(exactly = 1) { repo.getUser(1) }`. Так проверяется взаимодействие, которое не видно по одному только результату.",
        "rubric": "Проверяется: Зачем вызывать `verify` после выполнения тестируемого кода.",
        "priority": 3,
      },
      {
        "question": "Почему не стоит мокать чужой код?",
        "answer": "Мокирование стандартных классов или сторонних библиотек привязывает тест к их внутреннему устройству и ломается при обновлении версии. Лучше скрыть такой код за своим интерфейсом и подменять в тесте уже его.",
        "rubric": "Проверяется: Почему не стоит мокать чужой код.",
        "priority": 3,
      },
      {
        "question": "Когда выбрать Fake вместо Mock?",
        "answer": "Fake удобен, когда зависимость имеет состояние (коллекция, кэш, база) и сценарий состоит из нескольких операций или дублёр переиспользуется в тестах. Mock лучше, когда важно проверить сам факт и параметры вызова или когда реальную зависимость слишком сложно воспроизвести.",
        "rubric": "Проверяется: Когда выбрать Fake вместо Mock.",
        "priority": 3,
      },
      {
        "question": "Как проверить переданный в мок аргумент, если точное значение заранее неизвестно?",
        "answer": "Используют матчеры `any()`, `eq(...)`, `match { ... }` или захват `slot<T>()` через `capture(slot)`. После вызова проверяют поля через `slot.captured`, например имя или возраст пользователя.",
        "rubric": "Проверяется: Как проверить переданный в мок аргумент, если точное значение заранее неизвестно.",
        "priority": 3,
      },
      {
        "question": "Чем опасна чрезмерная проверка взаимодействий через `verify`?",
        "answer": "Тест начинает ломаться при любой смене внутренней реализации, даже если внешнее поведение не изменилось. Поэтому проверяют публичный результат, а `verify` применяют только там, где вызов зависимости действительно важен.",
        "rubric": "Проверяется: Чем опасна чрезмерная проверка взаимодействий через `verify`.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "tools-basics",
    "skillId": "junior-tools-git",
    "topic": "Git",
    "questions": [
      {
        "question": "Чем `git merge` отличается от `git rebase`?",
        "answer": "`git merge` создаёт merge-коммит с двумя родителями и сохраняет историю ветки, а `git rebase` перекладывает коммиты поверх другой ветки, давая линейную историю. Rebase перезаписывает коммиты, поэтому его не применяют к опубликованным общим веткам.",
        "rubric": "Проверяется: Чем `git merge` отличается от `git rebase`.",
        "priority": 4,
      },
      {
        "question": "Чем `git reset` отличается от `git revert`?",
        "answer": "`git reset` перемещает указатель ветки и удаляет коммиты из истории, а `git revert` создаёт новый коммит, отменяющий изменения старого. `git revert` безопасен для общих веток, потому что не перезаписывает существующую историю.",
        "rubric": "Проверяется: Чем `git reset` отличается от `git revert`.",
        "priority": 4,
      },
      {
        "question": "Зачем нужен `git cherry-pick`?",
        "answer": "`git cherry-pick` применяет изменения одного выбранного коммита из другой ветки к текущей и создаёт новый коммит. Так переносят отдельный фикс, не сливая всю ветку целиком.",
        "rubric": "Проверяется: Зачем нужен `git cherry-pick`.",
        "priority": 4,
      },
      {
        "question": "Как разрешить конфликт после обновления ветки через `git pull`?",
        "answer": "Git помечает конфликтующие строки маркерами `<<<<<<<`, `=======` и `>>>>>>>`; нужно выбрать или объединить варианты, удалить маркеры, выполнить `git add` и `git commit`. В Android Studio для этого есть встроенный инструмент Merge Conflicts.",
        "rubric": "Проверяется: Как разрешить конфликт после обновления ветки через `git pull`.",
        "priority": 4,
      },
      {
        "question": "Чем `git pull` отличается от `git fetch`?",
        "answer": "`git fetch` только загружает изменения и обновляет удалённые ветки, не меняя рабочую директорию, а `git pull` делает `fetch` и сразу `merge` в текущую ветку. `fetch` полезен, когда хотите сначала посмотреть, что изменилось у коллег.",
        "rubric": "Проверяется: Чем `git pull` отличается от `git fetch`.",
        "priority": 4,
      },
      {
        "question": "В чём разница между `git diff` и `git diff --staged`?",
        "answer": "`git diff` показывает изменения рабочей директории, ещё не добавленные в индекс, а `git diff --staged` — изменения, уже подготовленные в индексе. Так проверяют, что именно попадёт в следующий коммит.",
        "rubric": "Проверяется: В чём разница между `git diff` и `git diff --staged`.",
        "priority": 4,
      },
      {
        "question": "Что произойдёт при `git push --force` в общую ветку `main`?",
        "answer": "принудительная отправка перезаписывает удалённую историю и может стереть коммиты коллег, после чего их локальные ветки расходятся с удалённой. `--force` допустим только в личных feature-ветках.",
        "rubric": "Проверяется: Что произойдёт при `git push --force` в общую ветку `main`.",
        "priority": 4,
      },
      {
        "question": "Почему `.gitignore` не удаляет файл, уже попавший в репозиторий?",
        "answer": "`.gitignore` действует только на неотслеживаемые файлы, а уже добавленный в индекс файл Git продолжает отслеживать. Чтобы прекратить отслеживание, выполняют `git rm --cached`.",
        "rubric": "Проверяется: Почему `.gitignore` не удаляет файл, уже попавший в репозиторий.",
        "priority": 4,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "tools-basics",
    "skillId": "junior-tools-logcat",
    "topic": "Logcat и Debugging",
    "questions": [
      {
        "question": "Как отфильтровать Logcat по тегу и уровню важности?",
        "answer": "в Android Studio используют фильтры `tag:UserRepo` и выбор уровня, например `ERROR`; в терминале — `adb logcat -s MyApp:D` для тега `MyApp` уровня `DEBUG` или `*:E` для всех ошибок. Это убирает системный шум.",
        "rubric": "Проверяется: Как отфильтровать Logcat по тегу и уровню важности.",
        "priority": 4,
      },
      {
        "question": "Чем breakpoint отличается от watchpoint?",
        "answer": "line breakpoint останавливает выполнение на строке или при входе в метод, а field watchpoint срабатывает при изменении значения поля. Watchpoint помогает узнать, кто именно меняет поле.",
        "rubric": "Проверяется: Чем breakpoint отличается от watchpoint.",
        "priority": 4,
      },
      {
        "question": "Для чего используется `Log.wtf`?",
        "answer": "`Log.wtf` (`What a Terrible Failure`) пишет сообщение с уровнем `ASSERT`, самым критичным из доступных. Его применяют для ситуаций, которые никогда не должны возникать в корректной работе приложения.",
        "rubric": "Проверяется: Для чего используется `Log.wtf`.",
        "priority": 4,
      },
      {
        "question": "Как воспроизвести баг, проявляющийся только в release-сборке?",
        "answer": "нужно собрать и установить release-вариант, потому что минификация R8 и отключённые отладочные логи меняют поведение. Проверяют `keep`-правила для классов, вызываемых через рефлексию, и смотрят логи уровней `WARN`/`ERROR`.",
        "rubric": "Проверяется: Как воспроизвести баг, проявляющийся только в release-сборке.",
        "priority": 4,
      },
      {
        "question": "Как читать stack trace при краше?",
        "answer": "первая строка с именем вашего пакета указывает на место ошибки, а строки `android.*` и `kotlin.*` относятся к системному коду и обычно пропускаются. На найденной строке ставят breakpoint и воспроизводят сценарий.",
        "rubric": "Проверяется: Как читать stack trace при краше.",
        "priority": 4,
      },
      {
        "question": "Чем `Step Over` отличается от `Step Into`?",
        "answer": "`Step Over (F8)` выполняет текущую строку целиком и переходит к следующей в том же методе, а `Step Into (F7)` заходит внутрь вызываемого метода. `Step Into` нужен, когда исследуют внутренности вызова.",
        "rubric": "Проверяется: Чем `Step Over` отличается от `Step Into`.",
        "priority": 4,
      },
      {
        "question": "Зачем проверять `BuildConfig.DEBUG` перед `Timber.plant()`?",
        "answer": "`Timber.DebugTree()` сажают только в debug-сборке, поэтому в release логи не выводятся. Это защищает от утечки чувствительных данных в продакшене.",
        "rubric": "Проверяется: Зачем проверять `BuildConfig.DEBUG` перед `Timber.plant()`.",
        "priority": 4,
      },
      {
        "question": "Почему нельзя логировать токены и пароли?",
        "answer": "Logcat доступен другим инструментам, поэтому чувствительные данные в логах — угроза безопасности. В проде оставляют только `WARN`/`ERROR`, чтобы не раскрывать внутренности приложения.",
        "rubric": "Проверяется: Почему нельзя логировать токены и пароли.",
        "priority": 4,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "tools-basics",
    "skillId": "junior-tools-build",
    "topic": "Build Variants и APK/AAB",
    "questions": [
      {
        "question": "Чем `debug` отличается от `release` buildType?",
        "answer": "`debug` не минифицируется, содержит отладочные символы, имеет `isDebuggable = true` и суффикс `.debug`, чтобы ставиться рядом с release; `release` проходит через R8 и подписывается release-ключом.",
        "rubric": "Проверяется: Чем `debug` отличается от `release` buildType.",
        "priority": 4,
      },
      {
        "question": "Чем Build Type отличается от Product Flavor?",
        "answer": "Build Type задаёт, как собирается код (оптимизация и отладка), а Product Flavor — для кого (окружение dev/prod или free/premium) со своими `applicationId`, ресурсами и `buildConfigField`. Build Variant — комбинация того и другого, например `prodRelease`.",
        "rubric": "Проверяется: Чем Build Type отличается от Product Flavor.",
        "priority": 4,
      },
      {
        "question": "Зачем нужны `productFlavors`?",
        "answer": "они позволяют собрать из одного кода версии для разных окружений или тарифов: у каждого flavor свой `applicationIdSuffix`, константы и папка ресурсов `src/dev/`. Каждый новый flavor увеличивает число вариантов и требует дополнительного тестирования.",
        "rubric": "Проверяется: Зачем нужны `productFlavors`.",
        "priority": 4,
      },
      {
        "question": "Почему Google Play требует AAB вместо APK?",
        "answer": "из AAB Play сам собирает оптимизированные APK под конкретное устройство — только нужная архитектура, плотность экрана и язык — что уменьшает размер загрузки. С 2021 года новые приложения принимаются только в формате AAB, а локально AAB устанавливают через `bundletool`.",
        "rubric": "Проверяется: Почему Google Play требует AAB вместо APK.",
        "priority": 4,
      },
      {
        "question": "Что такое signing config и почему нельзя терять release-ключ?",
        "answer": "signing config задаёт keystore, пароли и alias для подписи APK/AAB: debug подписывается автоматически, release — release-ключом. Потеря ключа делает невозможным обновление приложения в Google Play, поэтому пароли хранят в переменных окружения.",
        "rubric": "Проверяется: Что такое signing config и почему нельзя терять release-ключ.",
        "priority": 4,
      },
      {
        "question": "Что делает R8 и почему нужно тестировать release?",
        "answer": "R8 удаляет неиспользуемый код, обфусирует имена и оптимизирует байт-код. Для классов, вызываемых через рефлексию (Retrofit, Room, Gson), нужны `keep`-правила в `proguard-rules.pro`, иначе приложение упадёт только в release.",
        "rubric": "Проверяется: Что делает R8 и почему нужно тестировать release.",
        "priority": 4,
      },
      {
        "question": "Что такое `BuildConfig` и как его включить в AGP 8.0+?",
        "answer": "`BuildConfig` — автогенерируемый класс с константами `DEBUG`, `BUILD_TYPE`, `FLAVOR` и пользовательскими полями через `buildConfigField`. В AGP 8.0+ он отключён по умолчанию и включается флагом `buildConfig = true` в `buildFeatures`.",
        "rubric": "Проверяется: Что такое `BuildConfig` и как его включить в AGP 8.0+.",
        "priority": 4,
      },
      {
        "question": "Какими командами собрать APK и AAB?",
        "answer": "`./gradlew assembleRelease` даёт APK в `app/build/outputs/apk/release/`, а `./gradlew bundleRelease` — AAB в `app/build/outputs/bundle/release/`. Тесты конкретного варианта запускают, например, `./gradlew testDevDebugUnitTest`.",
        "rubric": "Проверяется: Какими командами собрать APK и AAB.",
        "priority": 4,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "tools-basics",
    "skillId": "junior-tools-adb",
    "topic": "ADB Basics",
    "questions": [
      {
        "question": "Для чего нужен `adb shell`?",
        "answer": "`adb shell` открывает оболочку на устройстве или выполняет одну команду, например `pm list packages` или `am start`. Команды идут от имени shell-пользователя, а не root, поэтому часть файлов недоступна.",
        "rubric": "Проверяется: Для чего нужен `adb shell`.",
        "priority": 4,
      },
      {
        "question": "Чем `adb install -r` отличается от обычной установки?",
        "answer": "`-r` переустанавливает приложение, сохраняя его данные, тогда как без флага установка поверх существующего пакета может завершиться ошибкой. Если APK подписан другим ключом, сначала делают `adb uninstall`.",
        "rubric": "Проверяется: Чем `adb install -r` отличается от обычной установки.",
        "priority": 4,
      },
      {
        "question": "Как снять скриншот и записать видео через ADB?",
        "answer": "скриншот получают командой `adb exec-out screencap -p > screen.png`, запись экрана — `adb shell screenrecord /sdcard/demo.mp4`. Это удобно для баг-репортов и документации.",
        "rubric": "Проверяется: Как снять скриншот и записать видео через ADB.",
        "priority": 4,
      },
      {
        "question": "Что делает `adb logcat -c`?",
        "answer": "флаг `-c` очищает буфер логов устройства. Перед воспроизведением бага буфер очищают, выполняют сценарий и смотрят только свежие сообщения.",
        "rubric": "Проверяется: Что делает `adb logcat -c`.",
        "priority": 4,
      },
      {
        "question": "Что показывает `adb devices` и что означает статус `unauthorized`?",
        "answer": "команда выводит устройства со статусами: `device` — готово, `offline` — соединение потеряно, `unauthorized` — не подтверждена отладка на устройстве. В последнем случае нужно подтвердить диалог отладки на экране телефона.",
        "rubric": "Проверяется: Что показывает `adb devices` и что означает статус `unauthorized`.",
        "priority": 4,
      },
      {
        "question": "Как направить команду конкретному устройству?",
        "answer": "при нескольких устройствах указывают серийный номер через `-s`, например `adb -s emulator-5554 install app.apk`, либо задают переменную `ANDROID_SERIAL`. В CI номер указывают явно, чтобы команда не ушла на другое устройство.",
        "rubric": "Проверяется: Как направить команду конкретному устройству.",
        "priority": 4,
      },
      {
        "question": "Как заглянуть в данные debug-приложения через `adb shell`?",
        "answer": "на нерутованном устройстве `ls /data/data/com.example.app` вернёт `Permission denied`, но для debug-сборки помогает `adb shell run-as com.example.app ls`. Для release-сборки такой способ не работает.",
        "rubric": "Проверяется: Как заглянуть в данные debug-приложения через `adb shell`.",
        "priority": 4,
      },
      {
        "question": "Как подключить устройство по Wi-Fi?",
        "answer": "с Android 11 выполняют `adb pair ip:port` с кодом сопряжения из настроек устройства, затем `adb connect ip:port`; оба устройства должны быть в одной сети. Это удобно, когда USB-порт занят.",
        "rubric": "Проверяется: Как подключить устройство по Wi-Fi.",
        "priority": 4,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "tools-basics",
    "skillId": "junior-tools-dependencies",
    "topic": "Dependencies и Version Catalogs",
    "questions": [
      {
        "question": "Чем `implementation` отличается от `api`?",
        "answer": "`api` экспортирует зависимость потребителям модуля и делает её видимой в их compile classpath, а `implementation` скрывает её, оставляя доступной только внутри модуля и в runtime. Из-за этого `api` замедляет пересборку зависимых модулей.",
        "rubric": "Проверяется: Чем `implementation` отличается от `api`.",
        "priority": 3,
      },
      {
        "question": "Зачем нужен Version Catalog и `libs.versions.toml`?",
        "answer": "он хранит версии и координаты в одном файле `gradle/libs.versions.toml` и даёт type-safe accessors вроде `libs.androidx.core.ktx`, поэтому версии не дублируются по модулям. Каталог подхватывается Gradle автоматически.",
        "rubric": "Проверяется: Зачем нужен Version Catalog и `libs.versions.toml`.",
        "priority": 3,
      },
      {
        "question": "Как устроен `libs.versions.toml`?",
        "answer": "файл содержит секции `[versions]`, `[libraries]` и `[plugins]`, а библиотека ссылается на версию через `version.ref`, например `androidx-core-ktx = { group = \"androidx.core\", name = \"core-ktx\", version.ref = \"coreKtx\" }`. Дефисы в именах превращаются во вложенные свойства: `libs.androidx.core.ktx`.",
        "rubric": "Проверяется: Как устроен `libs.versions.toml`.",
        "priority": 3,
      },
      {
        "question": "Что такое транзитивная зависимость?",
        "answer": "это библиотека, которая подтягивается автоматически как зависимость вашей зависимости: `retrofit` тянет `okhttp` и `okio`. Вы её явно не объявляете, но она попадает в граф сборки.",
        "rubric": "Проверяется: Что такое транзитивная зависимость.",
        "priority": 3,
      },
      {
        "question": "Как найти конфликт версий зависимостей?",
        "answer": "`./gradlew app:dependencies --configuration releaseRuntimeClasspath` печатает дерево зависимостей, а `./gradlew app:dependencyInsight --dependency okhttp` показывает, кто запросил конкретную версию. По умолчанию Gradle берёт новейшую версию, что может нарушить совместимость.",
        "rubric": "Проверяется: Как найти конфликт версий зависимостей.",
        "priority": 3,
      },
      {
        "question": "Как исключить конфликтующую транзитивную зависимость?",
        "answer": "используют `exclude(group = \"com.example\", module = \"conflicting\")` у зависимости или правило `resolutionStrategy`; это помогает при ошибке `Duplicate class`. В строгих проектах включают `failOnVersionConflict()`.",
        "rubric": "Проверяется: Как исключить конфликтующую транзитивную зависимость.",
        "priority": 3,
      },
      {
        "question": "Чем `compileOnly` и `runtimeOnly` отличаются от `implementation`?",
        "answer": "`compileOnly` нужна только при компиляции (например, аннотации) и не попадает в APK, а `runtimeOnly` используется только во время выполнения и не видна компилятору. `implementation` доступна на обоих этапах.",
        "rubric": "Проверяется: Чем `compileOnly` и `runtimeOnly` отличаются от `implementation`.",
        "priority": 3,
      },
      {
        "question": "Зачем запускать Android Lint, Ktlint и Detekt в CI?",
        "answer": "Android Lint проверяет Android-специфику: разметку, API и доступность, Ktlint — стиль Kotlin, Detekt — качество и архитектуру кода. Проверки в CI ловят проблемы до ревью и мешают «быстро собрать» локально с отключённым линтером.",
        "rubric": "Проверяется: Зачем запускать Android Lint, Ktlint и Detekt в CI.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "ui-basics",
    "skillId": "junior-ui-textview",
    "topic": "TextView",
    "questions": [
      {
        "question": "Чем `sp` отличается от `dp` и почему размер текста задают в `sp`?",
        "answer": "`dp` не зависит от плотности экрана, а `sp` дополнительно учитывает пользовательский масштаб шрифта. Если задать размер в `dp`, текст не будет увеличиваться при изменении настройки размера шрифта в системе, что ухудшает доступность.",
        "rubric": "Проверяется: Чем `sp` отличается от `dp` и почему размер текста задают в `sp`.",
        "priority": 2,
      },
      {
        "question": "Чем `maxLines` отличается от `ellipsize`?",
        "answer": "`maxLines` ограничивает количество отображаемых строк, а `ellipsize` определяет, как отметить обрезанный текст: многоточием в конце, начале или середине. Их часто комбинируют: `maxLines=\"1\"` с `ellipsize=\"end\"` для однострочных заголовков.",
        "rubric": "Проверяется: Чем `maxLines` отличается от `ellipsize`.",
        "priority": 2,
      },
      {
        "question": "Как работает AutoSize TextView и когда он не сработает?",
        "answer": "`android:autoSizeTextType=\"uniform\"` автоматически уменьшает размер текста, чтобы он поместился в заданные границы, в диапазоне `autoSizeMinTextSize`/`autoSizeMaxTextSize`. Он не сработает с `wrap_content`, когда границы не ограничены, — контейнер должен иметь фиксированный размер.",
        "rubric": "Проверяется: Как работает AutoSize TextView и когда он не сработает.",
        "priority": 2,
      },
      {
        "question": "Нужен ли `contentDescription` для TextView?",
        "answer": "нет: TalkBack читает сам текст TextView, поэтому `contentDescription` нужен ImageView и иконкам без текста. Лишнее описание у текстового View создаёт дублирующую озвучку.",
        "rubric": "Проверяется: Нужен ли `contentDescription` для TextView.",
        "priority": 2,
      },
      {
        "question": "Как сделать кликабельную ссылку в TextView?",
        "answer": "через `android:autoLink` и `linksClickable=\"true\"` для простых телефонов и URL либо через `SpannableString` с `ClickableSpan` и `Linkify.addLinks` для сложных сценариев. В View обязательно нужно установить `movementMethod = LinkMovementMethod.getInstance()`, иначе ссылки не реагируют на нажатия.",
        "rubric": "Проверяется: Как сделать кликабельную ссылку в TextView.",
        "priority": 2,
      },
      {
        "question": "Как задать межстрочный интервал в TextView?",
        "answer": "в XML используют `android:lineSpacingMultiplier` (множитель) и `android:lineSpacingExtra` (дополнительный отступ), в Compose — параметр `lineHeight` в `TextStyle`. Выбор зависит от того, нужен ли пропорциональный или фиксированный отступ.",
        "rubric": "Проверяется: Как задать межстрочный интервал в TextView.",
        "priority": 2,
      },
      {
        "question": "Почему не стоит хардкодить текст через `android:text=\"Hello\"`?",
        "answer": "такую строку нельзя перевести и переиспользовать, поэтому текст выносят в ресурс `@string/...`. Это упрощает локализацию и поддержку приложения.",
        "rubric": "Проверяется: Почему не стоит хардкодить текст через `android:text=\"Hello\"`.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "ui-basics",
    "skillId": "junior-ui-button",
    "topic": "Button",
    "questions": [
      {
        "question": "Чем отличается `setOnClickListener` от `View.OnClickListener`?",
        "answer": "`View.OnClickListener` — это интерфейс с методом `onClick`, а `setOnClickListener` — метод View, который этот интерфейс устанавливает. В Kotlin обычно передают лямбду: `button.setOnClickListener { ... }`, что короче анонимного объекта.",
        "rubric": "Проверяется: Чем отличается `setOnClickListener` от `View.OnClickListener`.",
        "priority": 3,
      },
      {
        "question": "Как защититься от двойного нажатия на кнопку?",
        "answer": "запоминают время последнего клика и игнорируют повторные нажатия в течение интервала (debounce) либо отключают кнопку на время операции через `isEnabled = false`. Надёжнее блокировать именно логику, а не только визуальное состояние, иначе гонка приведёт к дублированию действия.",
        "rubric": "Проверяется: Как защититься от двойного нажатия на кнопку.",
        "priority": 3,
      },
      {
        "question": "Зачем нужно состояние enabled/disabled у кнопки?",
        "answer": "отключённая кнопка (`android:enabled` / `isEnabled`) не реагирует на клики и визуально приглушается. Её отключают, пока форма невалидна или идёт запрос, чтобы пользователь не отправил данные повторно.",
        "rubric": "Проверяется: Зачем нужно состояние enabled/disabled у кнопки.",
        "priority": 3,
      },
      {
        "question": "Чем `MaterialButton` отличается от обычного `Button`?",
        "answer": "`MaterialButton` из Material Components поддерживает стили `filled`, `outlined`, `text`, `tonal`, атрибуты `app:cornerRadius`, `app:icon`, `app:iconGravity` и читает цвета из темы Material 3. Обычный `Button` — наследник TextView с базовым оформлением из темы.",
        "rubric": "Проверяется: Чем `MaterialButton` отличается от обычного `Button`.",
        "priority": 3,
      },
      {
        "question": "Какая кнопка нужна для кликабельной иконки и почему?",
        "answer": "`ImageButton` в View или `IconButton` в Compose: они отображают drawable вместо текста. Обязательно задавайте `contentDescription`, иначе TalkBack не сможет описать действие.",
        "rubric": "Проверяется: Какая кнопка нужна для кликабельной иконки и почему.",
        "priority": 3,
      },
      {
        "question": "Почему не стоит выполнять долгую работу прямо в обработчике клика?",
        "answer": "обработчик должен только зафиксировать намерение пользователя и передать его во ViewModel или состояние. Долгая работа в `setOnClickListener` блокирует главный поток и может привести к ANR.",
        "rubric": "Проверяется: Почему не стоит выполнять долгую работу прямо в обработчике клика.",
        "priority": 3,
      },
      {
        "question": "Как стилизовать кнопки так, чтобы поддержать смену темы?",
        "answer": "через атрибуты темы (`colorPrimary`, `shapeAppearanceSmallComponent`) и готовые стили `Widget.Material3.Button`, а не хардкодом цветов в разметке. В Compose для этого используют `MaterialTheme` и `ButtonDefaults`.",
        "rubric": "Проверяется: Как стилизовать кнопки так, чтобы поддержать смену темы.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "ui-basics",
    "skillId": "junior-ui-imageview",
    "topic": "ImageView",
    "questions": [
      {
        "question": "Чем `android:src` отличается от `app:srcCompat`?",
        "answer": "`android:src` работает с растровыми изображениями и векторами на API 21+, а `app:srcCompat` вместе с `AppCompatImageView` добавляет поддержку векторных drawable на более старых версиях. На minSdk < 21 использование `android:src` для вектора приведёт к `Resources.NotFoundException`.",
        "rubric": "Проверяется: Чем `android:src` отличается от `app:srcCompat`.",
        "priority": 2,
      },
      {
        "question": "Что делает `scaleType=\"centerCrop\"` и чем он отличается от `fitCenter`?",
        "answer": "`centerCrop` масштабирует изображение так, чтобы заполнить контейнер, обрезая края, и подходит для аватарок. `fitCenter` вписывает изображение целиком с сохранением пропорций, оставляя поля, и подходит для логотипов. В Compose это `ContentScale.Crop` и `ContentScale.Fit`.",
        "rubric": "Проверяется: Что делает `scaleType=\"centerCrop\"` и чем он отличается от `fitCenter`.",
        "priority": 2,
      },
      {
        "question": "Почему нельзя использовать `fitXY` для фотографий?",
        "answer": "`fitXY` растягивает изображение по обеим осям независимо, искажая пропорции. Для фотографий выбирают `centerCrop` или `fitCenter`.",
        "rubric": "Проверяется: Почему нельзя использовать `fitXY` для фотографий.",
        "priority": 2,
      },
      {
        "question": "Чем Coil/Glide лучше ручной загрузки изображений?",
        "answer": "они кэшируют изображения в памяти и на диске, масштабируют битмапы и отменяют запросы при уходе с экрана. Ручная загрузка через `HttpURLConnection` и декодирование без кэша медленная и грозит OOM. Coil рекомендуется для Compose (`AsyncImage`), Glide — для legacy View-проектов.",
        "rubric": "Проверяется: Чем Coil/Glide лучше ручной загрузки изображений.",
        "priority": 2,
      },
      {
        "question": "Зачем нужны placeholder и error-изображения?",
        "answer": "placeholder показывается, пока изображение загружается, а error — если загрузка не удалась. Они скрывают пустоты и предотвращают «прыжки» интерфейса, особенно для больших изображений; в Coil задаются параметрами `placeholder` и `error`.",
        "rubric": "Проверяется: Зачем нужны placeholder и error-изображения.",
        "priority": 2,
      },
      {
        "question": "Нужен ли `contentDescription` для ImageView?",
        "answer": "да, для осмысленных изображений он описывает картинку для TalkBack. Для декоративных изображений ставят `null` в Compose или `@null` в XML, чтобы диктор их пропускал, иначе он прочитает имя ресурса.",
        "rubric": "Проверяется: Нужен ли `contentDescription` для ImageView.",
        "priority": 2,
      },
      {
        "question": "Как устроено кэширование в загрузчиках изображений?",
        "answer": "декодированные битмапы хранятся в памяти (`MemoryCache` у Coil, LruCache у Glide), а исходные файлы — на диске (`DiskCache`). Ключ кэша строится из URL и параметров трансформаций, а при нехватке памяти старые записи удаляются по LRU.",
        "rubric": "Проверяется: Как устроено кэширование в загрузчиках изображений.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "ui-basics",
    "skillId": "junior-ui-edittext",
    "topic": "EditText",
    "questions": [
      {
        "question": "Зачем задавать `android:inputType` у EditText?",
        "answer": "`inputType` определяет тип данных и подсказывает клавиатуре, какую раскладку показать: `textEmailAddress`, `number`, `phone`, `textPassword`. Это упрощает ввод и валидацию; в Compose аналог — `KeyboardOptions` с `KeyboardType`.",
        "rubric": "Проверяется: Зачем задавать `android:inputType` у EditText.",
        "priority": 3,
      },
      {
        "question": "В чём ошибка использования `inputType=\"number\"` для телефонного номера?",
        "answer": "`number` допускает только цифры, поэтому плюс, скобки и пробелы будут потеряны. Для телефонов нужен `inputType=\"phone\"`.",
        "rubric": "Проверяется: В чём ошибка использования `inputType=\"number\"` для телефонного номера.",
        "priority": 3,
      },
      {
        "question": "Как работает `TextWatcher` и зачем он нужен?",
        "answer": "`TextWatcher` реагирует на изменения текста через `beforeTextChanged`, `onTextChanged` и `afterTextChanged`; последний часто используют для валидации. В Compose изменение обрабатывают в `onValueChange`. Важно удалять watcher, чтобы не копить дублирующиеся вызовы и утечки.",
        "rubric": "Проверяется: Как работает `TextWatcher` и зачем он нужен.",
        "priority": 3,
      },
      {
        "question": "Чем `TextInputLayout` отличается от обычного `EditText`?",
        "answer": "`TextInputLayout` из Material Components оборачивает `TextInputEditText` и добавляет плавающую подсказку, счётчик символов, иконки и оформление (outlined/filled) с показом ошибок. Внутри него нужно использовать именно `TextInputEditText`, иначе часть функций, например корректный hint, потеряется.",
        "rubric": "Проверяется: Чем `TextInputLayout` отличается от обычного `EditText`.",
        "priority": 3,
      },
      {
        "question": "Как валидировать ввод и показывать ошибку пользователю?",
        "answer": "проверяют значение в `afterTextChanged` / `onValueChange` или при отправке формы и показывают ошибку рядом с полем через `setError`, `TextInputLayout.error` или `isError` в Compose. Сообщение должно исчезать при исправлении ввода. Одного тоста недостаточно: пользователю не видно, какое именно поле неверно.",
        "rubric": "Проверяется: Как валидировать ввод и показывать ошибку пользователю.",
        "priority": 3,
      },
      {
        "question": "Где должно жить значение поля ввода?",
        "answer": "в состоянии: ViewModel для View или `remember { mutableStateOf(\"\") }` для Compose, а не только в самом View. Если читать `editText.text` лишь в момент клика, значение потеряется при пересоздании Activity.",
        "rubric": "Проверяется: Где должно жить значение поля ввода.",
        "priority": 3,
      },
      {
        "question": "Что такое `imeOptions` и зачем оно нужно?",
        "answer": "`imeOptions` задаёт действие на клавиатуре (`actionDone`, `actionSearch`, `actionSend`), которое обрабатывают через `setOnEditorActionListener`. Чтобы клавиатура показала действие вместо переноса строки, поле должно быть однострочным (`maxLines=\"1\"`).",
        "rubric": "Проверяется: Что такое `imeOptions` и зачем оно нужно.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "ui-basics",
    "skillId": "junior-ui-linear",
    "topic": "LinearLayout",
    "questions": [
      {
        "question": "Почему `layout_weight` «дорог» по производительности?",
        "answer": "при весе размер элемента вдоль направления раскладки должен быть `0dp`: иначе LinearLayout сначала измеряет детей с их естественным размером, а затем пересчитывает оставшееся место, то есть делает двойной проход `measure`. В списках это заметно тормозит отрисовку.",
        "rubric": "Проверяется: Почему `layout_weight` «дорог» по производительности.",
        "priority": 2,
      },
      {
        "question": "Чем `gravity` отличается от `layout_gravity`?",
        "answer": "`android:gravity` выравнивает содержимое внутри самого View, например текст в TextView, а `android:layout_gravity` — сам View внутри родителя. Проще запомнить так: `gravity` — как текст лежит в кнопке, `layout_gravity` — как кнопка лежит в контейнере.",
        "rubric": "Проверяется: Чем `gravity` отличается от `layout_gravity`.",
        "priority": 2,
      },
      {
        "question": "В каком направлении работает `layout_gravity` в LinearLayout?",
        "answer": "только поперёк направления раскладки: в вертикальном LinearLayout по горизонтали (`center_horizontal`, `end`), в горизонтальном по вертикали (`center_vertical`, `bottom`). Для выравнивания вдоль направления используют веса или отступы.",
        "rubric": "Проверяется: В каком направлении работает `layout_gravity` в LinearLayout.",
        "priority": 2,
      },
      {
        "question": "Когда стоит избегать вложенных LinearLayout?",
        "answer": "когда глубина дерева превышает 3–4 уровня, появляется Lint-предупреждение `TooDeepLayout` или тормозит прокрутка. Тогда вложенные контейнеры заменяют одним ConstraintLayout с плоской иерархией или переходят на Compose.",
        "rubric": "Проверяется: Когда стоит избегать вложенных LinearLayout.",
        "priority": 2,
      },
      {
        "question": "Чем отличаются `padding` и `layout_margin`?",
        "answer": "`padding` — внутренний отступ между границей View и его содержимым, `layout_margin` — внешний отступ до соседей или родителя. Предпочтительнее directional-атрибуты `paddingStart` и `layout_marginEnd`, которые учитывают RTL.",
        "rubric": "Проверяется: Чем отличаются `padding` и `layout_margin`.",
        "priority": 2,
      },
      {
        "question": "Зачем нужен `android:baselineAligned`?",
        "answer": "он выравнивает базовые линии текстовых элементов в одной строке, чтобы заголовок и подпись разного размера выглядели ровно. Если текст рядом не важен, например иконка с надписью, атрибут отключают, экономя проход измерения.",
        "rubric": "Проверяется: Зачем нужен `android:baselineAligned`.",
        "priority": 2,
      },
      {
        "question": "Зачем задавать `android:weightSum`?",
        "answer": "атрибут задаёт суммарный вес, относительно которого делится свободное место; без него за сумму принимается сумма весов всех детей. Это позволяет, например, отдать детям только часть ширины, оставив место другим элементам.",
        "rubric": "Проверяется: Зачем задавать `android:weightSum`.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "ui-basics",
    "skillId": "junior-ui-constraint",
    "topic": "ConstraintLayout",
    "questions": [
      {
        "question": "Что означает `0dp` в ConstraintLayout?",
        "answer": "`0dp` для ширины или высоты означает «match constraints»: размер вычисляется из ограничений с двух сторон, а не из содержимого. Это отличается от `match_parent`, который для детей ConstraintLayout трактуется как `0dp`, и от `wrap_content`.",
        "rubric": "Проверяется: Что означает `0dp` в ConstraintLayout.",
        "priority": 2,
      },
      {
        "question": "Что такое bias и когда он работает?",
        "answer": "`app:layout_constraintHorizontal_bias` и `app:layout_constraintVertical_bias` смещают элемент между двумя противоположными ограничениями: 0 — к началу, 0.5 — по центру, 1 — к концу. Без двух противоположных ограничений bias игнорируется.",
        "rubric": "Проверяется: Что такое bias и когда он работает.",
        "priority": 2,
      },
      {
        "question": "Чем Guideline отличается от Barrier?",
        "answer": "Guideline — фиксированная невидимая линия, задаваемая отступом или процентом, к которой привязывают элементы. Barrier вычисляет позицию динамически как край (max/min) набора других View, поэтому следует за самой длинной меткой.",
        "rubric": "Проверяется: Чем Guideline отличается от Barrier.",
        "priority": 2,
      },
      {
        "question": "Зачем нужны chains и как задать их стиль?",
        "answer": "Chain объединяет элементы двусторонними ограничениями и распределяет между ними место; стиль задаётся на первом элементе через `app:layout_constraintHorizontal_chainStyle`: `spread`, `spread_inside` или `packed`. Обязательна связь `End_toStartOf` у первого элемента, иначе цепочка не образуется.",
        "rubric": "Проверяется: Зачем нужны chains и как задать их стиль.",
        "priority": 2,
      },
      {
        "question": "Что произойдёт, если у View нет ограничения по одной из осей?",
        "answer": "элемент «упадёт» в начало координат (0,0) по этой оси, а Lint предупредит о пропущенном ограничении. Каждый View должен иметь минимум по одному ограничению по горизонтали и вертикали.",
        "rubric": "Проверяется: Что произойдёт, если у View нет ограничения по одной из осей.",
        "priority": 2,
      },
      {
        "question": "Чем Group отличается от Layer в ConstraintLayout?",
        "answer": "Group управляет только видимостью набора элементов через `constraint_referenced_ids`, но не позиционирует их. Layer применяет трансформации, например поворот или масштаб, к группе View.",
        "rubric": "Проверяется: Чем Group отличается от Layer в ConstraintLayout.",
        "priority": 2,
      },
      {
        "question": "Зачем нужна привязка по базовой линии?",
        "answer": "`app:layout_constraintBaseline_toBaselineOf` выравнивает базовые линии текста двух View, чтобы подписи разного размера смотрелись ровно. Это аналог `baselineAligned` у LinearLayout.",
        "rubric": "Проверяется: Зачем нужна привязка по базовой линии.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "ui-basics",
    "skillId": "junior-ui-viewbinding",
    "topic": "View Binding",
    "questions": [
      {
        "question": "Чем View Binding лучше `findViewById`?",
        "answer": "`findViewById` ищет View в дереве во время выполнения и возвращает nullable-тип или требует приведения, поэтому ошибка проявляется только в рантайме. View Binding генерирует типобезопасные поля на этапе компиляции: если id удалён из XML, проект не соберётся. Он также быстрее, потому что не ищет View в дереве.",
        "rubric": "Проверяется: Чем View Binding лучше `findViewById`.",
        "priority": 2,
      },
      {
        "question": "Чем View Binding отличается от Data Binding?",
        "answer": "View Binding даёт только типобезопасный доступ к View, а Data Binding поддерживает выражения в XML (`@{user.name}`), двухстороннюю привязку и BindingAdapter'ы. Data Binding требует аннотаций и дольше компилируется; если логика в разметке не нужна, выбирают View Binding. Их можно использовать вместе.",
        "rubric": "Проверяется: Чем View Binding отличается от Data Binding.",
        "priority": 2,
      },
      {
        "question": "Как называется сгенерированный класс для `item_user.xml`?",
        "answer": "`ItemUserBinding`: имя выводится из имени layout-файла в camelCase. Класс содержит поле `root` и поля для каждого View с `android:id`, например `titleText` для `title_text`.",
        "rubric": "Проверяется: Как называется сгенерированный класс для `item_user.xml`.",
        "priority": 2,
      },
      {
        "question": "Почему в Fragment нужно обнулять binding в `onDestroyView`?",
        "answer": "View Fragment уничтожается раньше самого Fragment, например при уходе в back stack, а binding хранит на него ссылку. Если не обнулить `_binding` в `onDestroyView`, получится утечка View или краш при обращении к уничтоженной иерархии.",
        "rubric": "Проверяется: Почему в Fragment нужно обнулять binding в `onDestroyView`.",
        "priority": 2,
      },
      {
        "question": "Что будет при обращении к `binding` после `onDestroyView`?",
        "answer": "геттер `_binding!!` бросит `NullPointerException`, если обратиться к View после обнуления, а если не обнулять, приложение будет держать ссылку на мёртвый View. Поэтому используют паттерн nullable `_binding` и не-nullable `binding`, а обращения привязывают к `viewLifecycleOwner`.",
        "rubric": "Проверяется: Что будет при обращении к `binding` после `onDestroyView`.",
        "priority": 2,
      },
      {
        "question": "Как включить View Binding и можно ли исключить отдельный layout?",
        "answer": "в `build.gradle.kts` добавляют `buildFeatures { viewBinding = true }`. Отдельный layout исключают атрибутом `tools:viewBindingIgnore=\"true\"` на корневом элементе; включение действует на уровне модуля.",
        "rubric": "Проверяется: Как включить View Binding и можно ли исключить отдельный layout.",
        "priority": 2,
      },
      {
        "question": "Чем `inflate` отличается от `bind` у binding-класса?",
        "answer": "`inflate(layoutInflater)` создаёт и View, и binding; он используется в Activity вместе с `setContentView(binding.root)`. Метод `bind(view)` привязывает binding к уже существующему View.",
        "rubric": "Проверяется: Чем `inflate` отличается от `bind` у binding-класса.",
        "priority": 2,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "ui-basics",
    "skillId": "junior-ui-recyclerview",
    "topic": "RecyclerView Basics",
    "questions": [
      {
        "question": "Зачем нужен ViewHolder?",
        "answer": "он хранит ссылки на View элемента, чтобы не вызывать `findViewById` при каждом `onBindViewHolder`. ViewHolder создаётся один раз и переиспользуется при прокрутке, поэтому в нём нельзя хранить состояние конкретного элемента — оно перезапишется при следующем bind.",
        "rubric": "Проверяется: Зачем нужен ViewHolder.",
        "priority": 1,
      },
      {
        "question": "Что делает `DiffUtil` и чем полезен `ListAdapter`?",
        "answer": "`DiffUtil` вычисляет разницу между старым и новым списком и вызывает точные уведомления, например `notifyItemInserted`, вместо `notifyDataSetChanged()`. `ListAdapter` делает это автоматически через `submitList` в фоне и требует реализации `DiffUtil.ItemCallback` с методами `areItemsTheSame` и `areContentsTheSame`.",
        "rubric": "Проверяется: Что делает `DiffUtil` и чем полезен `ListAdapter`.",
        "priority": 1,
      },
      {
        "question": "Чем `LayoutManager` отличается от `Adapter`?",
        "answer": "LayoutManager позиционирует элементы и управляет скроллом (`LinearLayoutManager`, `GridLayoutManager`), а Adapter связывает данные со списком: создаёт ViewHolder и привязывает к нему данные. Без LayoutManager список не отобразится.",
        "rubric": "Проверяется: Чем `LayoutManager` отличается от `Adapter`.",
        "priority": 1,
      },
      {
        "question": "Почему нельзя хранить позицию вместо стабильного id?",
        "answer": "позиция элемента меняется при вставке или удалении, поэтому колбэк с устаревшей `position` из `onBindViewHolder` может обратиться не к тому элементу. Используют `bindingAdapterPosition` с проверкой на `RecyclerView.NO_POSITION` и данные со стабильным id.",
        "rubric": "Проверяется: Почему нельзя хранить позицию вместо стабильного id.",
        "priority": 1,
      },
      {
        "question": "Что даёт вызов `setHasFixedSize(true)`?",
        "answer": "RecyclerView пересчитывает размеры элементов при каждом изменении данных, даже если они фиксированные. Для списка с одинаковой высотой элементов этот вызов отключает лишние измерения.",
        "rubric": "Проверяется: Что даёт вызов `setHasFixedSize(true)`.",
        "priority": 1,
      },
      {
        "question": "Почему в `onBindViewHolder` нельзя делать тяжёлую работу?",
        "answer": "метод вызывается часто при прокрутке для каждого переиспользуемого элемента. Любая загрузка или вычисление на главном потоке приведёт к просадкам fps, поэтому такие операции выносят в фон или подготавливают данные заранее.",
        "rubric": "Проверяется: Почему в `onBindViewHolder` нельзя делать тяжёлую работу.",
        "priority": 1,
      },
      {
        "question": "Чем `LazyColumn` отличается от RecyclerView?",
        "answer": "LazyColumn — декларативный аналог в Compose: он тоже создаёт только видимые элементы, но не требует Adapter и ViewHolder, а для стабильной идентификации использует `key` в `items` вместо DiffUtil. Для новых Compose-экранов выбирают LazyColumn, для legacy-кода и кастомных LayoutManager — RecyclerView.",
        "rubric": "Проверяется: Чем `LazyColumn` отличается от RecyclerView.",
        "priority": 1,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "ui-basics",
    "skillId": "junior-ui-style",
    "topic": "Styles, Themes и Material 3",
    "questions": [
      {
        "question": "Чем style отличается от theme?",
        "answer": "Style применяется точечно к одному View через `style=\"@style/...\"` и переопределяет конкретные атрибуты. Theme назначается глобально в манифесте и задаёт значения по умолчанию и цветовые роли для всех View; по сути theme — тот же style, но с именем `Theme.*`.",
        "rubric": "Проверяется: Чем style отличается от theme.",
        "priority": 3,
      },
      {
        "question": "Как работает наследование стилей?",
        "answer": "через атрибут `parent`, например `parent=\"TextAppearance.Material3.TitleLarge\"`, или неявно по точке в имени: `Widget.MyApp.Button` наследует от `Widget.MyApp`. Это позволяет переопределить только нужные атрибуты, не дублируя остальные.",
        "rubric": "Проверяется: Как работает наследование стилей.",
        "priority": 3,
      },
      {
        "question": "Что такое theme attribute `?attr/…` и зачем он нужен?",
        "answer": "это ссылка на значение из текущей темы, например `?attr/colorOnSurface` или `?textAppearanceTitleLarge`. В отличие от жёсткого `@color/black`, такой атрибут автоматически подстраивается под светлую и тёмную тему и Dynamic Color.",
        "rubric": "Проверяется: Что такое theme attribute `?attr/…` и зачем он нужен.",
        "priority": 3,
      },
      {
        "question": "Что даёт Material 3 и чем он отличается от Material 2?",
        "answer": "Material 3 (Material You) добавляет динамические цвета, обновлённые компоненты (`MaterialButton`, `TopAppBar`, `NavigationBar`), скруглённые формы и новые токены. Подключается зависимостью `com.google.android.material:material` и темой `Theme.Material3.*`.",
        "rubric": "Проверяется: Что даёт Material 3 и чем он отличается от Material 2.",
        "priority": 3,
      },
      {
        "question": "Как включить Dynamic Color?",
        "answer": "вызовом `DynamicColors.applyToActivitiesIfAvailable(this)` в `Application.onCreate()` при Material 3 теме. Палитра вычисляется из обоев пользователя на Android 12+, а на более старых версиях используется статическая палитра, поэтому нужен fallback.",
        "rubric": "Проверяется: Как включить Dynamic Color.",
        "priority": 3,
      },
      {
        "question": "Что такое DayNight-тема?",
        "answer": "тема `Theme.Material3.DayNight.*` автоматически переключает светлую и тёмную версии ресурсов в зависимости от системной настройки; цвета переопределяются в `values-night`. При смене темы Activity пересоздаётся, поэтому состояние хранят в ViewModel или SavedStateHandle.",
        "rubric": "Проверяется: Что такое DayNight-тема.",
        "priority": 3,
      },
      {
        "question": "Почему лучше не хардкодить цвета в разметке?",
        "answer": "жёстко заданный `@color/black` ломает тёмную тему и Dynamic Color, а также ухудшает контраст. Используют theme attributes (`?attr/colorPrimary`) и роли `on*` для текста на соответствующем фоне.",
        "rubric": "Проверяется: Почему лучше не хардкодить цвета в разметке.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "ui-basics",
    "skillId": "junior-ui-dimensions",
    "topic": "Размеры и Accessibility",
    "questions": [
      {
        "question": "Чем отличаются `px`, `dp` и `sp`?",
        "answer": "`px` — физические пиксели и зависят от плотности, `dp` — независимые от плотности единицы, приравненные к 1 px при 160 dpi, а `sp` — как dp, но дополнительно учитывает масштаб шрифта пользователя. Размеры View задают в dp, размер текста — в sp.",
        "rubric": "Проверяется: Чем отличаются `px`, `dp` и `sp`.",
        "priority": 3,
      },
      {
        "question": "Почему нельзя использовать `px` в разметке?",
        "answer": "на устройствах с разной плотностью один и тот же размер в пикселях выглядит по-разному: на hdpi элемент станет физически меньше. Для конвертации в коде используют `TypedValue.applyDimension`, но лучше хранить значения в dp.",
        "rubric": "Проверяется: Почему нельзя использовать `px` в разметке.",
        "priority": 3,
      },
      {
        "question": "Зачем минимальный touch target 48dp?",
        "answer": "рекомендация Material: кликабельная область должна быть не меньше 48dp, иначе пользователю трудно попасть по элементу, особенно при моторных ограничениях. Если иконка 24dp, область увеличивают через padding или `minWidth`/`minHeight`.",
        "rubric": "Проверяется: Зачем минимальный touch target 48dp.",
        "priority": 3,
      },
      {
        "question": "Как TalkBack использует `contentDescription`?",
        "answer": "TalkBack — экранный диктор, который навигирует по фокусируемым элементам и озвучивает их текст или `contentDescription`. Для ImageView и иконок без текста описание обязательно, а для декоративных элементов ставят `@null`, чтобы диктор их пропускал.",
        "rubric": "Проверяется: Как TalkBack использует `contentDescription`.",
        "priority": 3,
      },
      {
        "question": "Что ломается при системном масштабе шрифта?",
        "answer": "если размер задан в `dp` или у контейнера жёсткая высота, увеличенный шрифт обрезается или выходит за границы. Поэтому текст задают в `sp`, избегают фиксированных высот и проверяют UI при максимальном масштабе.",
        "rubric": "Проверяется: Что ломается при системном масштабе шрифта.",
        "priority": 3,
      },
      {
        "question": "Зачем хранить размеры в `dimens.xml`?",
        "answer": "это централизует значения и позволяет задавать разные размеры для экранов через квалификаторы, например `values-sw600dp`. В XML обращаются через `@dimen/...`, в коде — через `resources.getDimensionPixelSize()`.",
        "rubric": "Проверяется: Зачем хранить размеры в `dimens.xml`.",
        "priority": 3,
      },
      {
        "question": "Как улучшить доступность экрана помимо contentDescription?",
        "answer": "обеспечивают логичный порядок фокуса, группируют связанные элементы через `android:screenReaderFocusable`, проверяют контраст, минимум 4.5:1 по WCAG, и тестируют с Accessibility Scanner и включённым TalkBack на реальном устройстве.",
        "rubric": "Проверяется: Как улучшить доступность экрана помимо contentDescription.",
        "priority": 3,
      }
    ]
  },
  {
    "grade": "junior",
    "materialId": "ui-basics",
    "skillId": "junior-ui-compose-basics",
    "topic": "Jetpack Compose Basics",
    "questions": [
      {
        "question": "Чем `@Composable` отличается от View?",
        "answer": "composable-функция не создаёт и не возвращает View, а описывает интерфейс как функцию от состояния; Compose сам рисует и обновляет нужные части. Функции должны быть быстрыми, идемпотентными и без побочных эффектов, а их имена пишут с заглавной буквы.",
        "rubric": "Проверяется: Чем `@Composable` отличается от View.",
        "priority": 2,
      },
      {
        "question": "Что такое рекомпозиция?",
        "answer": "это повторный вызов composable-функции, когда изменилось состояние, которое она читала. Compose отслеживает чтения состояния и перерисовывает только затронутые части дерева, поэтому тяжёлую работу выносят из composable.",
        "rubric": "Проверяется: Что такое рекомпозиция.",
        "priority": 2,
      },
      {
        "question": "Зачем нужны `remember` и `mutableStateOf`?",
        "answer": "`mutableStateOf` создаёт наблюдаемый контейнер: при изменении `.value` Compose перерисовывает зависимые части. `remember` сохраняет это значение между рекомпозициями, но теряет его при уходе composable из композиции, поэтому для долгоживущего состояния используют ViewModel или `rememberSaveable`.",
        "rubric": "Проверяется: Зачем нужны `remember` и `mutableStateOf`.",
        "priority": 2,
      },
      {
        "question": "Чем `LazyColumn` отличается от `Column`?",
        "answer": "`Column` размещает всех детей сразу, а `LazyColumn` создаёт только видимые элементы, как RecyclerView. Для длинных списков LazyColumn эффективнее, а для стабильной идентификации в `items` передают `key = { it.id }`.",
        "rubric": "Проверяется: Чем `LazyColumn` отличается от `Column`.",
        "priority": 2,
      },
      {
        "question": "Как встроить Compose в XML-экран?",
        "answer": "добавляют `ComposeView` в разметку и вызывают `composeView.setContent { MaterialTheme { ... } }` в Activity или Fragment. Нужно обеспечить тему и корректные размеры View, иначе композиция может не отрисоваться.",
        "rubric": "Проверяется: Как встроить Compose в XML-экран.",
        "priority": 2,
      },
      {
        "question": "Почему порядок модификаторов важен?",
        "answer": "модификаторы применяются слева направо, и каждый оборачивает результат предыдущего. Например, `Modifier.padding(8.dp).clickable {}` делает отступ внутри кликабельной области, а обратный порядок оставляет кликабельной только область после отступа.",
        "rubric": "Проверяется: Почему порядок модификаторов важен.",
        "priority": 2,
      },
      {
        "question": "Чем `remember` отличается от `rememberSaveable`?",
        "answer": "`remember` хранит значение, только пока composable находится в композиции, и теряет его при повороте экрана. `rememberSaveable` сохраняет состояние через SavedInstanceState и переживает configuration change и process death.",
        "rubric": "Проверяется: Чем `remember` отличается от `rememberSaveable`.",
        "priority": 2,
      }
    ]
  }
];
