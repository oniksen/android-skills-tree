export type QuizGrade = "junior" | "middle" | "strong-middle" | "senior";

export interface QuizQuestion {
  id: string;
  skillId: string;
  grade: QuizGrade;
  topic: string;
  question: string;
  rubric: string;
}

export const quizQuestionsBySkill: Record<string, QuizQuestion[]> = {
  "junior-osnovy-perem": [
    {
      id: "jp-perem-junior",
      skillId: "junior-osnovy-perem",
      grade: "junior",
      topic: "Переменные",
      question:
        "Что такое переменная в программировании и зачем она нужна? Приведи короткий пример.",
      rubric:
        "Должно быть: имя для хранения значения/данных в памяти; значение можно менять; пример присваивания (например x = 5).",
    },
    {
      id: "jp-perem-middle",
      skillId: "junior-osnovy-perem",
      grade: "middle",
      topic: "Переменные",
      question:
        "Чем отличаются val и var в Kotlin? Когда предпочитать val, как работает вывод типа и область видимости переменной? Приведи пример.",
      rubric:
        "Должно быть: val — неизменяемая ссылка, var — изменяемая; type inference; область видимости; пример выбора val/var.",
    },
    {
      id: "jp-perem-strong-middle",
      skillId: "junior-osnovy-perem",
      grade: "strong-middle",
      topic: "Переменные",
      question:
        "Как работают делегаты свойств (by lazy, observable, vetoable)? Какие подводные камни у lazy в многопоточном коде?",
      rubric:
        "Должно быть: назначение делегатов; lazy и синхронизация; observable/vetoable; риски инициализации.",
    },
    {
      id: "jp-perem-senior",
      skillId: "junior-osnovy-perem",
      grade: "senior",
      topic: "Переменные",
      question:
        "Как val/var и неизменяемость влияют на потокобезопасность и архитектуру? Как выбрать между mutable state, StateFlow и неизменяемыми data class?",
      rubric:
        "Должно быть: неизменяемость и потоки; mutable state vs StateFlow; границы ответственности; тестируемость.",
    },
  ],
  "junior-osnovy-uslov": [
    {
      id: "jp-uslov-junior",
      skillId: "junior-osnovy-uslov",
      grade: "junior",
      topic: "Условные конструкции",
      question:
        "В чём разница между условием if и циклом for? Когда что используют?",
      rubric:
        "if выполняет код при выполнении условия один раз; for повторяет код заданное число раз/по коллекции. Примеры использования.",
    },
    {
      id: "jp-uslov-middle",
      skillId: "junior-osnovy-uslov",
      grade: "middle",
      topic: "Условные конструкции",
      question:
        "Как работает when в Kotlin как выражение? Чем when с проверкой типа (is) отличается от if/else и когда он делает код безопаснее?",
      rubric:
        "Должно быть: when как выражение; проверка типа; исчерпываемость; сравнение с if/else.",
    },
    {
      id: "jp-uslov-strong-middle",
      skillId: "junior-osnovy-uslov",
      grade: "strong-middle",
      topic: "Условные конструкции",
      question:
        "Как sealed class/interface и exhaustive when помогают моделировать состояния? Какие ошибки компиляции возникают при неполном when?",
      rubric:
        "Должно быть: sealed-иерархия; exhaustive when; ошибки компиляции; моделирование состояний.",
    },
    {
      id: "jp-uslov-senior",
      skillId: "junior-osnovy-uslov",
      grade: "senior",
      topic: "Условные конструкции",
      question:
        "Как проектировать ветвление для сложных доменных состояний без if-лестниц? Когда использовать state machine, sealed types и таблицы переходов?",
      rubric:
        "Должно быть: state machine; таблицы переходов; sealed types; поддерживаемость и тестирование.",
    },
  ],
  "junior-osnovy-funkc": [
    {
      id: "jp-funkc-junior",
      skillId: "junior-osnovy-funkc",
      grade: "junior",
      topic: "Функции",
      question:
        "Что такое функция (метод) и зачем выносить код в функцию? Приведи пример.",
      rubric:
        "Функция — именованный блок кода с входами/выходом; переиспользование, читаемость, изоляция. Пример объявления и вызова.",
    },
    {
      id: "jp-funkc-middle",
      skillId: "junior-osnovy-funkc",
      grade: "middle",
      topic: "Функции",
      question:
        "Что такое функция высшего порядка и лямбда? Приведи пример передачи функции как параметра и объясни замыкание.",
      rubric:
        "Должно быть: HOF; лямбда; передача функции; замыкание; пример.",
    },
    {
      id: "jp-funkc-strong-middle",
      skillId: "junior-osnovy-funkc",
      grade: "strong-middle",
      topic: "Функции",
      question:
        "Как inline, noinline и crossinline влияют на производительность и захват переменных? Когда inline может ухудшить размер байткода?",
      rubric:
        "Должно быть: inline; noinline/crossinline; захват переменных; влияние на байткод.",
    },
    {
      id: "jp-funkc-senior",
      skillId: "junior-osnovy-funkc",
      grade: "senior",
      topic: "Функции",
      question:
        "Как проектировать DSL и builder API на Kotlin? Как scope functions, receivers и контракты влияют на читаемость и бинарную совместимость?",
      rubric:
        "Должно быть: DSL; builder API; scope functions; receivers; бинарная совместимость.",
    },
  ],
  "junior-android-project": [
    {
      id: "andr-project-junior",
      skillId: "junior-android-project",
      grade: "junior",
      topic: "Android Basics",
      question:
        "Из каких директорий состоит модуль Android-приложения и зачем разделение src/main, src/test и src/androidTest?",
      rubric:
        "Должно быть: src/main для кода и ресурсов; src/test для JVM-тестов; src/androidTest для инструментальных тестов.",
    },
    {
      id: "andr-project-middle",
      skillId: "junior-android-project",
      grade: "middle",
      topic: "Android Basics",
      question:
        "Чем APK отличается от AAB? Как Gradle формирует артефакт и где обычно искать результат сборки?",
      rubric:
        "Должно быть: APK устанавливаемый пакет; AAB формат публикации; outputs/apk и outputs/bundle.",
    },
    {
      id: "andr-project-strong-middle",
      skillId: "junior-android-project",
      grade: "strong-middle",
      topic: "Android Basics",
      question:
        "Как разделение на модули (app, core, feature) влияет на сборку, тестирование и масштабирование Android-проекта? Какие границы модулей важны?",
      rubric:
        "Должно быть: независимые модули; зависимости; скорость сборки; границы API.",
    },
    {
      id: "andr-project-senior",
      skillId: "junior-android-project",
      grade: "senior",
      topic: "Android Basics",
      question:
        "Как проектировать многомодульный Android-проект для масштабируемости: разделение API/implementation, версионирование модулей и контроль зависимостей?",
      rubric:
        "Должно быть: api/implementation; границы модулей; версионирование; контроль зависимостей.",
    },
  ],
  "junior-android-resources": [
    {
      id: "andr-resources-junior",
      skillId: "junior-android-resources",
      grade: "junior",
      topic: "Android Basics",
      question:
        "Что такое resource qualifier? Приведи пример values-ru или layout-land и как Android выбирает подходящий ресурс.",
      rubric:
        "Должно быть: суффикс папки; выбор по конфигурации; пример; вариант по умолчанию.",
    },
    {
      id: "andr-resources-middle",
      skillId: "junior-android-resources",
      grade: "middle",
      topic: "Android Basics",
      question:
        "Как qualifiers и альтернативные ресурсы помогают поддерживать разные экраны, ориентации и темы? Как избежать дублирования?",
      rubric:
        "Должно быть: qualifiers; альтернативные ресурсы; smallest width; тёмная тема.",
    },
    {
      id: "andr-resources-strong-middle",
      skillId: "junior-android-resources",
      grade: "strong-middle",
      topic: "Android Basics",
      question:
        "Как оптимизировать ресурсы в release-сборке и какие риски несёт сокращение ресурсов при использовании reflection или динамических имён?",
      rubric:
        "Должно быть: shrinkResources; R8; динамические имена; риски удаления.",
    },
    {
      id: "andr-resources-senior",
      skillId: "junior-android-resources",
      grade: "senior",
      topic: "Android Basics",
      question:
        "Как проектировать систему ресурсов для масштабируемого приложения: темы, дизайн-токены, локализация и доступность?",
      rubric:
        "Должно быть: дизайн-токены; темы; локализация; доступность; консистентность.",
    },
  ],
  "junior-android-manifest": [
    {
      id: "andr-manifest-junior",
      skillId: "junior-android-manifest",
      grade: "junior",
      topic: "Android Basics",
      question:
        "Какие задачи решает AndroidManifest.xml? Что обычно объявляют в нём компоненты, разрешения и фильтры интентов?",
      rubric:
        "Должно быть: компоненты; разрешения; intent-фильтры; minSdk/targetSdk.",
    },
    {
      id: "andr-manifest-middle",
      skillId: "junior-android-manifest",
      grade: "middle",
      topic: "Android Basics",
      question:
        "Как compileSdk, minSdk и targetSdk влияют на совместимость? Как безопасно использовать новые API на старых версиях Android?",
      rubric:
        "Должно быть: compileSdk/minSdk/targetSdk; проверка SDK_INT; backward compatibility.",
    },
    {
      id: "andr-manifest-strong-middle",
      skillId: "junior-android-manifest",
      grade: "strong-middle",
      topic: "Android Basics",
      question:
        "Как объявления манифеста влияют на безопасность приложения: разрешения, exported-компоненты, deep links и защита данных?",
      rubric:
        "Должно быть: exported; разрешения; deep links; безопасность компонентов.",
    },
    {
      id: "andr-manifest-senior",
      skillId: "junior-android-manifest",
      grade: "senior",
      topic: "Android Basics",
      question:
        "Как проектировать манифест и конфигурацию сборки для нескольких flavor/сборок с разными разрешениями, компонентами и deep links?",
      rubric:
        "Должно быть: flavors; manifest placeholders; разные конфигурации; безопасность.",
    },
  ],
  "junior-android-gradle": [
    {
      id: "andr-gradle-junior",
      skillId: "junior-android-gradle",
      grade: "junior",
      topic: "Android Basics",
      question:
        "Что такое Gradle в Android-проекте и зачем нужны build.gradle на уровне проекта и модуля?",
      rubric:
        "Должно быть: система сборки; project vs module; плагины; зависимости.",
    },
    {
      id: "andr-gradle-middle",
      skillId: "junior-android-gradle",
      grade: "middle",
      topic: "Android Basics",
      question:
        "Чем отличаются implementation, api и testImplementation? Как выбор конфигурации влияет на размер приложения и тесты?",
      rubric:
        "Должно быть: implementation/api/testImplementation; видимость зависимостей; размер и тесты.",
    },
    {
      id: "andr-gradle-strong-middle",
      skillId: "junior-android-gradle",
      grade: "strong-middle",
      topic: "Android Basics",
      question:
        "Что такое build type, product flavor и build variant? Как flavors помогают разделить staging и production?",
      rubric:
        "Должно быть: build type; flavor; variant; staging/production; applicationIdSuffix.",
    },
    {
      id: "andr-gradle-senior",
      skillId: "junior-android-gradle",
      grade: "senior",
      topic: "Android Basics",
      question:
        "Как оптимизировать Gradle-сборку большого Android-проекта: кэширование, параллелизм, конфигурация модулей и version catalogs?",
      rubric:
        "Должно быть: build cache; parallel; configuration cache; version catalogs.",
    },
  ],
  "junior-android-lifecycle": [
    {
      id: "andr-lifecycle-junior",
      skillId: "junior-android-lifecycle",
      grade: "junior",
      topic: "Android Basics",
      question:
        "Назови основные методы жизненного цикла Activity и в каком порядке они вызываются при запуске.",
      rubric:
        "Должно быть: onCreate, onStart, onResume; порядок; назначение.",
    },
    {
      id: "andr-lifecycle-middle",
      skillId: "junior-android-lifecycle",
      grade: "middle",
      topic: "Android Basics",
      question:
        "Что происходит при повороте экрана? Как сохранить состояние через onSaveInstanceState и ViewModel?",
      rubric:
        "Должно быть: пересоздание Activity; onSaveInstanceState; ViewModel; состояние UI.",
    },
    {
      id: "andr-lifecycle-strong-middle",
      skillId: "junior-android-lifecycle",
      grade: "strong-middle",
      topic: "Android Basics",
      question:
        "Как жизненный цикл влияет на подписки, корутины и ресурсы? Как избежать утечек при асинхронной работе?",
      rubric:
        "Должно быть: lifecycle-aware; repeatOnLifecycle; отмена корутин; утечки.",
    },
    {
      id: "andr-lifecycle-senior",
      skillId: "junior-android-lifecycle",
      grade: "senior",
      topic: "Android Basics",
      question:
        "Как проектировать устойчивый UI при process death и восстановлении состояния? Какие стратегии сохранения состояния использовать?",
      rubric:
        "Должно быть: process death; SavedStateHandle; восстановление; стратегии.",
    },
  ],
  "junior-android-intent": [
    {
      id: "andr-intent-junior",
      skillId: "junior-android-intent",
      grade: "junior",
      topic: "Android Basics",
      question:
        "Чем явный Intent отличается от неявного? Как запустить другую Activity?",
      rubric:
        "Должно быть: explicit/implicit; startActivity; component name.",
    },
    {
      id: "andr-intent-middle",
      skillId: "junior-android-intent",
      grade: "middle",
      topic: "Android Basics",
      question:
        "Как передать данные между Activity через extras и Bundle? Как получить результат запуска Activity?",
      rubric:
        "Должно быть: putExtra/getExtra; Bundle; Activity Result API.",
    },
    {
      id: "andr-intent-strong-middle",
      skillId: "junior-android-intent",
      grade: "strong-middle",
      topic: "Android Basics",
      question:
        "Как безопасно использовать deep links и PendingIntent? Какие риски связаны с неявными интентами?",
      rubric:
        "Должно быть: deep links; PendingIntent; безопасность; неявные интенты.",
    },
    {
      id: "andr-intent-senior",
      skillId: "junior-android-intent",
      grade: "senior",
      topic: "Android Basics",
      question:
        "Как проектировать навигацию и межмодульное взаимодействие без жёсткой связанности компонентов?",
      rubric:
        "Должно быть: навигация; модульные границы; абстракции; тестируемость.",
    },
  ],
  "junior-osnovy-tipy": [
    {
      id: "jp-tipy-junior",
      skillId: "junior-osnovy-tipy",
      grade: "junior",
      topic: "Типы данных",
      question: "Какие базовые типы данных есть в Kotlin и чем они отличаются? Приведи примеры объявления переменных разных типов.",
      rubric: "Должно быть: Int/Long/Double/Float, String, Boolean, массивы/списки; различия по размеру и точности; примеры val/var с типами.",
    },
    {
      id: "jp-tipy-middle",
      skillId: "junior-osnovy-tipy",
      grade: "middle",
      topic: "Типы данных",
      question: "Как работает вывод типов (type inference) в Kotlin и когда стоит указывать тип явно? Какие риски у неявных типов?",
      rubric: "Должно быть: вывод типа компилятором; явное указание для публичных API/сложных выражений; риски читаемости и бинарной совместимости.",
    },
    {
      id: "jp-tipy-strong-middle",
      skillId: "junior-osnovy-tipy",
      grade: "strong-middle",
      topic: "Типы данных",
      question: "Как примитивы Kotlin отображаются на JVM (Int vs int) и как это влияет на производительность и nullability? Когда использовать value class?",
      rubric: "Должно быть: boxing/unboxing; nullable Int; inline/value classes; влияние на память и производительность.",
    },
    {
      id: "jp-tipy-senior",
      skillId: "junior-osnovy-tipy",
      grade: "senior",
      topic: "Типы данных",
      question: "Как проектировать типобезопасные API на Kotlin: sealed types, value classes, typealiases? Какие компромиссы по бинарной совместимости и производительности?",
      rubric: "Должно быть: sealed/value classes; typealias; бинарная совместимость; производительность и читаемость.",
    },
  ],
  "junior-osnovy-cikly": [
    {
      id: "jp-cikly-junior",
      skillId: "junior-osnovy-cikly",
      grade: "junior",
      topic: "Циклы",
      question: "Чем отличаются циклы for, while и do-while в Kotlin? Приведи примеры.",
      rubric: "Должно быть: for по диапазону/коллекции; while с предусловием; do-while с постусловием; примеры.",
    },
    {
      id: "jp-cikly-middle",
      skillId: "junior-osnovy-cikly",
      grade: "middle",
      topic: "Циклы",
      question: "Как работают ranges (until, downTo, step) и как итерировать по коллекции с индексами? Чем отличается forEach от for?",
      rubric: "Должно быть: IntRange; until/downTo/step; indices/withIndex; forEach vs for.",
    },
    {
      id: "jp-cikly-strong-middle",
      skillId: "junior-osnovy-cikly",
      grade: "strong-middle",
      topic: "Циклы",
      question: "Как избежать лишних аллокаций при итерации по большим коллекциям? Когда использовать последовательности (Sequence) и ленивые операции?",
      rubric: "Должно быть: Sequence; ленивые map/filter; терминальные операции; аллокации.",
    },
    {
      id: "jp-cikly-senior",
      skillId: "junior-osnovy-cikly",
      grade: "senior",
      topic: "Циклы",
      question: "Как проектировать эффективные циклы в высоконагруженном коде: unrolling, векторизация, параллелизм? Какие подводные камни у вложенных циклов?",
      rubric: "Должно быть: сложность O(n²); кэш-локальность; параллельные стримы; профилирование.",
    },
  ],
  "junior-osnovy-oop": [
    {
      id: "jp-oop-junior",
      skillId: "junior-osnovy-oop",
      grade: "junior",
      topic: "ООП основы",
      question: "Что такое класс и объект в ООП? Как объявить класс с конструктором в Kotlin?",
      rubric: "Должно быть: класс как шаблон; объект как экземпляр; primary/secondary конструкторы; свойства.",
    },
    {
      id: "jp-oop-middle",
      skillId: "junior-osnovy-oop",
      grade: "middle",
      topic: "ООП основы",
      question: "Чем отличаются наследование и композиция? Как работают интерфейсы и абстрактные классы в Kotlin?",
      rubric: "Должно быть: extends vs composition; интерфейсы с default-методами; абстрактные классы; выбор подхода.",
    },
    {
      id: "jp-oop-strong-middle",
      skillId: "junior-osnovy-oop",
      grade: "strong-middle",
      topic: "ООП основы",
      question: "Как инкапсуляция и модификаторы видимости влияют на дизайн API? Когда использовать sealed/interface вместо наследования?",
      rubric: "Должно быть: private/protected/internal; инкапсуляция инвариантов; sealed для ограниченных иерархий.",
    },
    {
      id: "jp-oop-senior",
      skillId: "junior-osnovy-oop",
      grade: "senior",
      topic: "ООП основы",
      question: "Как проектировать доменные модели с учётом наследования, иммутабельности и бинарной совместимости? Какие антипаттерны в ООП?",
      rubric: "Должно быть: иммутабельность; фрагильный базовый класс; композиция; стабильность API.",
    },
  ],
  "junior-osnovy-coll": [
    {
      id: "jp-coll-junior",
      skillId: "junior-osnovy-coll",
      grade: "junior",
      topic: "Коллекции",
      question: "Чем отличаются List, Set и Map в Kotlin? Как создать изменяемую и неизменяемую коллекцию?",
      rubric: "Должно быть: List/Set/Map; mutable vs immutable; listOf/mutableListOf; примеры.",
    },
    {
      id: "jp-coll-middle",
      skillId: "junior-osnovy-coll",
      grade: "middle",
      topic: "Коллекции",
      question: "Как работают основные операции коллекций (filter, map, find, groupBy)? Чем отличается Sequence от коллекции?",
      rubric: "Должно быть: функции высшего порядка; ленивость Sequence; терминальные операции.",
    },
    {
      id: "jp-coll-strong-middle",
      skillId: "junior-osnovy-coll",
      grade: "strong-middle",
      topic: "Коллекции",
      question: "Как оптимизировать работу с коллекциями: избежать лишних копий, выбрать правильную структуру данных, использовать asSequence?",
      rubric: "Должно быть: выбор структуры; аллокации; asSequence; профилирование.",
    },
    {
      id: "jp-coll-senior",
      skillId: "junior-osnovy-coll",
      grade: "senior",
      topic: "Коллекции",
      question: "Как проектировать API, работающие с коллекциями: копирование vs представление, иммутабельность, потокобезопасность?",
      rubric: "Должно быть: defensive copy; неизменяемость; потокобезопасность; контракты API.",
    },
  ],
  "junior-osnovy-oshibki": [
    {
      id: "jp-oshibki-junior",
      skillId: "junior-osnovy-oshibki",
      grade: "junior",
      topic: "Обработка ошибок",
      question: "Как обработать исключение в Kotlin с помощью try/catch/finally? Приведи пример.",
      rubric: "Должно быть: try/catch/finally; типы исключений; пример обработки.",
    },
    {
      id: "jp-oshibki-middle",
      skillId: "junior-osnovy-oshibki",
      grade: "middle",
      topic: "Обработка ошибок",
      question: "Чем отличаются ?. , ?: и !! в Kotlin? Когда использовать runCatching и Result?",
      rubric: "Должно быть: safe call; elvis; not-null assertion; runCatching/Result; выбор подхода.",
    },
    {
      id: "jp-oshibki-strong-middle",
      skillId: "junior-osnovy-oshibki",
      grade: "strong-middle",
      topic: "Обработка ошибок",
      question: "Как проектировать обработку ошибок в приложении: исключения vs Result/sealed types? Какие подводные камни у !! и платформенных типов?",
      rubric: "Должно быть: Result/sealed; платформенные типы; риски NPE; архитектура ошибок.",
    },
    {
      id: "jp-oshibki-senior",
      skillId: "junior-osnovy-oshibki",
      grade: "senior",
      topic: "Обработка ошибок",
      question: "Как построить единый слой обработки ошибок в Android-приложении (сетевые, БД, доменные) с учётом тестируемости и UX?",
      rubric: "Должно быть: доменные ошибки; маппинг; retry; UX-сообщения; тестирование.",
    },
  ],

  "junior-kotlin-sintaks": [
    {
      id: "kt-sintaks-junior",
      skillId: "junior-kotlin-sintaks",
      grade: "junior",
      topic: "Синтаксис Kotlin",
      question: "Какие базовые элементы синтаксиса Kotlin нужно знать новичку? Приведи примеры строк, комментариев и импортов.",
      rubric: "Должно быть: val/var; строки и шаблоны; комментарии; пакеты/импорты; отсутствие ;.",
    },
    {
      id: "kt-sintaks-middle",
      skillId: "junior-kotlin-sintaks",
      grade: "middle",
      topic: "Синтаксис Kotlin",
      question: "Чем when отличается от if/else в Kotlin и когда использовать каждый? Как работают шаблонные строки и многострочные строки?",
      rubric: "Должно быть: when как выражение; шаблоны ${}; многострочные \"\"\"; сравнение с if.",
    },
    {
      id: "kt-sintaks-strong-middle",
      skillId: "junior-kotlin-sintaks",
      grade: "strong-middle",
      topic: "Синтаксис Kotlin",
      question: "Как синтаксические возможности Kotlin (extension functions, default args, named args) влияют на читаемость и API-дизайн?",
      rubric: "Должно быть: extension functions; default/named args; читаемость; API-дизайн.",
    },
    {
      id: "kt-sintaks-senior",
      skillId: "junior-kotlin-sintaks",
      grade: "senior",
      topic: "Синтаксис Kotlin",
      question: "Как стандартизировать стиль и синтаксис в большой команде: ktlint/detekt, code review, соглашения? Какие риски неоднородного стиля?",
      rubric: "Должно быть: ktlint/detekt; соглашения; code review; риски поддержки.",
    },
  ],
  "junior-kotlin-null": [
    {
      id: "kt-null-junior",
      skillId: "junior-kotlin-null",
      grade: "junior",
      topic: "Null Safety",
      question: "Что такое null safety в Kotlin и как объявить nullable переменную?",
      rubric: "Должно быть: ? тип; nullable vs non-null; примеры.",
    },
    {
      id: "kt-null-middle",
      skillId: "junior-kotlin-null",
      grade: "middle",
      topic: "Null Safety",
      question: "Как работают операторы ?. , ?: и !!? Когда использовать let/also для null-check?",
      rubric: "Должно быть: safe call; elvis; not-null assertion; let/also; выбор.",
    },
    {
      id: "kt-null-strong-middle",
      skillId: "junior-kotlin-null",
      grade: "strong-middle",
      topic: "Null Safety",
      question: "Что такое платформенные типы и как они приводят к NPE? Как правильно работать с Java-interop nullability?",
      rubric: "Должно быть: платформенные типы; аннотации @Nullable/@NotNull; риски; interop.",
    },
    {
      id: "kt-null-senior",
      skillId: "junior-kotlin-null",
      grade: "senior",
      topic: "Null Safety",
      question: "Как проектировать null-safe API на границах модулей и при работе с внешними данными (JSON, БД)? Какие паттерны валидации?",
      rubric: "Должно быть: валидация на границах; sealed/Result; mapping; тестирование.",
    },
  ],
  "junior-kotlin-data": [
    {
      id: "kt-data-junior",
      skillId: "junior-kotlin-data",
      grade: "junior",
      topic: "Data Class",
      question: "Что такое data class в Kotlin и зачем он нужен? Приведи пример.",
      rubric: "Должно быть: data class; автоматические equals/hashCode/toString/copy; пример.",
    },
    {
      id: "kt-data-middle",
      skillId: "junior-kotlin-data",
      grade: "middle",
      topic: "Data Class",
      question: "Как работает функция copy() и деструктуризация (componentN) в data class?",
      rubric: "Должно быть: copy с параметрами; componentN; деструктуризация в val.",
    },
    {
      id: "kt-data-strong-middle",
      skillId: "junior-kotlin-data",
      grade: "strong-middle",
      topic: "Data Class",
      question: "Какие ограничения и подводные камни у data class (val параметры, наследование, производительность)?",
      rubric: "Должно быть: только val/var в конструкторе; final; equals по всем полям; аллокации.",
    },
    {
      id: "kt-data-senior",
      skillId: "junior-kotlin-data",
      grade: "senior",
      topic: "Data Class",
      question: "Когда data class не подходит и что использовать вместо него (value class, обычный класс)? Как влияет на бинарную совместимость?",
      rubric: "Должно быть: value class; обычный класс; бинарная совместимость; производительность.",
    },
  ],
  "junior-kotlin-ext": [
    {
      id: "kt-ext-junior",
      skillId: "junior-kotlin-ext",
      grade: "junior",
      topic: "Extension Functions",
      question: "Что такое extension function в Kotlin и как её объявить? Приведи пример.",
      rubric: "Должно быть: синтаксис fun Receiver.ext(); вызов как метод; пример.",
    },
    {
      id: "kt-ext-middle",
      skillId: "junior-kotlin-ext",
      grade: "middle",
      topic: "Extension Functions",
      question: "Чем extension function отличается от метода класса? Как работают extension properties?",
      rubric: "Должно быть: статическое разрешение; receiver; extension properties; ограничения.",
    },
    {
      id: "kt-ext-strong-middle",
      skillId: "junior-kotlin-ext",
      grade: "strong-middle",
      topic: "Extension Functions",
      question: "Как extension functions влияют на читаемость и возможность конфликтов имён? Как организовывать их в проекте?",
      rubric: "Должно быть: конфликты имён; импорты; организация по модулям; читаемость.",
    },
    {
      id: "kt-ext-senior",
      skillId: "junior-kotlin-ext",
      grade: "senior",
      topic: "Extension Functions",
      question: "Как проектировать DSL и builder API с помощью extension functions и receivers? Какие риски для бинарной совместимости?",
      rubric: "Должно быть: DSL; receivers; бинарная совместимость; тестирование.",
    },
  ],
  "junior-kotlin-lambda": [
    {
      id: "kt-lambda-junior",
      skillId: "junior-kotlin-lambda",
      grade: "junior",
      topic: "Lambda",
      question: "Что такое лямбда в Kotlin и как её записать? Приведи пример передачи в функцию.",
      rubric: "Должно быть: синтаксис { params -> body }; передача как аргумент; пример.",
    },
    {
      id: "kt-lambda-middle",
      skillId: "junior-kotlin-lambda",
      grade: "middle",
      topic: "Lambda",
      question: "Что такое trailing lambda и замыкания (closures)? Как использовать it в лямбдах с одним параметром?",
      rubric: "Должно быть: trailing lambda; it; замыкания; захват переменных.",
    },
    {
      id: "kt-lambda-strong-middle",
      skillId: "junior-kotlin-lambda",
      grade: "strong-middle",
      topic: "Lambda",
      question: "Как тип лямбды (Function1/Function2) влияет на производительность и инлайнинг? Когда использовать inline?",
      rubric: "Должно быть: inline; FunctionN; аллокации; производительность.",
    },
    {
      id: "kt-lambda-senior",
      skillId: "junior-kotlin-lambda",
      grade: "senior",
      topic: "Lambda",
      question: "Как лямбды и захват переменных влияют на память и жизненный цикл в Android (корутины, слушатели)? Как избежать утечек?",
      rubric: "Должно быть: захват this; утечки; корутины; отмена.",
    },
  ],
  "junior-kotlin-hof": [
    {
      id: "kt-hof-junior",
      skillId: "junior-kotlin-hof",
      grade: "junior",
      topic: "Higher Order Functions",
      question: "Что такое функция высшего порядка? Приведи пример функции, принимающей другую функцию.",
      rubric: "Должно быть: функция как параметр; пример; назначение.",
    },
    {
      id: "kt-hof-middle",
      skillId: "junior-kotlin-hof",
      grade: "middle",
      topic: "Higher Order Functions",
      question: "Как вернуть функцию из функции и как передавать ссылки на функции (::)?",
      rubric: "Должно быть: function reference; возврат функции; примеры.",
    },
    {
      id: "kt-hof-strong-middle",
      skillId: "junior-kotlin-hof",
      grade: "strong-middle",
      topic: "Higher Order Functions",
      question: "Как inline и noinline влияют на производительность HOF? Когда инлайнинг может увеличить размер байткода?",
      rubric: "Должно быть: inline/noinline/crossinline; байткод; производительность.",
    },
    {
      id: "kt-hof-senior",
      skillId: "junior-kotlin-hof",
      grade: "senior",
      topic: "Higher Order Functions",
      question: "Как проектировать API с HOF для переиспользования и тестируемости? Какие риски при злоупотреблении?",
      rubric: "Должно быть: переиспользование; тестируемость; читаемость; риски.",
    },
  ],
  "junior-kotlin-scope": [
    {
      id: "kt-scope-junior",
      skillId: "junior-kotlin-scope",
      grade: "junior",
      topic: "Scope Functions",
      question: "Что такое scope functions (let, run, apply, also, with) и зачем они нужны? Приведи пример apply.",
      rubric: "Должно быть: назначение; apply для инициализации; пример.",
    },
    {
      id: "kt-scope-middle",
      skillId: "junior-kotlin-scope",
      grade: "middle",
      topic: "Scope Functions",
      question: "Чем отличаются let, run, apply, also и with по возвращаемому значению и receiver? Когда что выбирать?",
      rubric: "Должно быть: receiver vs argument; возвращаемое значение; выбор по сценарию.",
    },
    {
      id: "kt-scope-strong-middle",
      skillId: "junior-kotlin-scope",
      grade: "strong-middle",
      topic: "Scope Functions",
      question: "Как scope functions влияют на читаемость и отладку? Какие антипаттерны при вложенном использовании?",
      rubric: "Должно быть: читаемость; вложенность; отладка; антипаттерны.",
    },
    {
      id: "kt-scope-senior",
      skillId: "junior-kotlin-scope",
      grade: "senior",
      topic: "Scope Functions",
      question: "Как стандартизировать использование scope functions в команде и избежать злоупотреблений в сложных цепочках?",
      rubric: "Должно быть: соглашения; читаемость; code review; поддержка.",
    },
  ],
  "junior-kotlin-enum": [
    {
      id: "kt-enum-junior",
      skillId: "junior-kotlin-enum",
      grade: "junior",
      topic: "Enum",
      question: "Что такое enum в Kotlin и как объявить перечисление с параметрами?",
      rubric: "Должно быть: enum class; параметры; свойства; пример.",
    },
    {
      id: "kt-enum-middle",
      skillId: "junior-kotlin-enum",
      grade: "middle",
      topic: "Enum",
      question: "Как добавить методы и реализовать интерфейс в enum? Чем ordinal и name отличаются?",
      rubric: "Должно быть: методы; интерфейсы; ordinal/name; сравнение.",
    },
    {
      id: "kt-enum-strong-middle",
      skillId: "junior-kotlin-enum",
      grade: "strong-middle",
      topic: "Enum",
      question: "Когда enum недостаточно и нужен sealed class? Какие ограничения enum по наследованию?",
      rubric: "Должно быть: sealed; ограничения enum; выбор модели.",
    },
    {
      id: "kt-enum-senior",
      skillId: "junior-kotlin-enum",
      grade: "senior",
      topic: "Enum",
      question: "Как проектировать типобезопасные состояния с помощью enum/sealed и как это влияет на when-exhaustive и бинарную совместимость?",
      rubric: "Должно быть: exhaustive when; бинарная совместимость; эволюция API.",
    },
  ],
  "junior-kotlin-sealed": [
    {
      id: "kt-sealed-junior",
      skillId: "junior-kotlin-sealed",
      grade: "junior",
      topic: "Sealed Class",
      question: "Что такое sealed class в Kotlin и зачем он нужен? Приведи пример.",
      rubric: "Должно быть: sealed class; ограниченные подтипы; пример.",
    },
    {
      id: "kt-sealed-middle",
      skillId: "junior-kotlin-sealed",
      grade: "middle",
      topic: "Sealed Class",
      question: "Чем sealed class отличается от enum и когда использовать sealed interface?",
      rubric: "Должно быть: enum vs sealed; sealed interface; гибкость.",
    },
    {
      id: "kt-sealed-strong-middle",
      skillId: "junior-kotlin-sealed",
      grade: "strong-middle",
      topic: "Sealed Class",
      question: "Как exhaustive when работает с sealed hierarchies и какие ошибки компиляции возникают при неполном when?",
      rubric: "Должно быть: exhaustive when; ошибки компиляции; моделирование состояний.",
    },
    {
      id: "kt-sealed-senior",
      skillId: "junior-kotlin-sealed",
      grade: "senior",
      topic: "Sealed Class",
      question: "Как проектировать доменные состояния с помощью sealed types для масштабируемости и тестируемости?",
      rubric: "Должно быть: доменные состояния; масштабируемость; тестирование; эволюция.",
    },
  ],
  "junior-kotlin-packages": [
    {
      id: "kt-packages-junior",
      skillId: "junior-kotlin-packages",
      grade: "junior",
      topic: "Packages",
      question: "Как объявить пакет и импортировать классы в Kotlin? Приведи пример.",
      rubric: "Должно быть: package; import; пример.",
    },
    {
      id: "kt-packages-middle",
      skillId: "junior-kotlin-packages",
      grade: "middle",
      topic: "Packages",
      question: "Что такое package-level функции и как работает видимость (public, internal, private)?",
      rubric: "Должно быть: top-level функции; модификаторы видимости; internal.",
    },
    {
      id: "kt-packages-strong-middle",
      skillId: "junior-kotlin-packages",
      grade: "strong-middle",
      topic: "Packages",
      question: "Как организовать пакеты в многомодульном проекте и избежать циклических зависимостей?",
      rubric: "Должно быть: структура пакетов; модули; циклические зависимости.",
    },
    {
      id: "kt-packages-senior",
      skillId: "junior-kotlin-packages",
      grade: "senior",
      topic: "Packages",
      question: "Как проектировать модульные границы и публичный API с учётом видимости и бинарной совместимости?",
      rubric: "Должно быть: модульные границы; публичный API; бинарная совместимость.",
    },
  ],

  "junior-android-studio": [
    {
      id: "andr-studio-junior",
      skillId: "junior-android-studio",
      grade: "junior",
      topic: "Android Basics",
      question: "Как создать новый проект в Android Studio и запустить его на эмуляторе?",
      rubric: "Должно быть: создание проекта; выбор шаблона; запуск на эмуляторе.",
    },
    {
      id: "andr-studio-middle",
      skillId: "junior-android-studio",
      grade: "middle",
      topic: "Android Basics",
      question: "Как использовать Logcat и отладчик в Android Studio для поиска ошибок?",
      rubric: "Должно быть: Logcat; breakpoints; inspection; отладка.",
    },
    {
      id: "andr-studio-strong-middle",
      skillId: "junior-android-studio",
      grade: "strong-middle",
      topic: "Android Basics",
      question: "Как использовать Layout Inspector и другие инструменты профилирования в Android Studio?",
      rubric: "Должно быть: Layout Inspector; CPU/Memory profiler; анализ.",
    },
    {
      id: "andr-studio-senior",
      skillId: "junior-android-studio",
      grade: "senior",
      topic: "Android Basics",
      question: "Как оптимизировать рабочий процесс в Android Studio для большой команды (gradle, индексация, шаблоны)?",
      rubric: "Должно быть: gradle; индексация; шаблоны; производительность IDE.",
    },
  ],
  "junior-android-layouts": [
    {
      id: "andr-layouts-junior",
      skillId: "junior-android-layouts",
      grade: "junior",
      topic: "Android Basics",
      question: "Что такое XML-разметка в Android и как описать простой экран?",
      rubric: "Должно быть: XML; layout_width/height; базовые атрибуты; пример.",
    },
    {
      id: "andr-layouts-middle",
      skillId: "junior-android-layouts",
      grade: "middle",
      topic: "Android Basics",
      question: "Чем отличаются LinearLayout, FrameLayout, RelativeLayout и ConstraintLayout? Когда что использовать?",
      rubric: "Должно быть: различия; выбор по задаче; ConstraintLayout преимущества.",
    },
    {
      id: "andr-layouts-strong-middle",
      skillId: "junior-android-layouts",
      grade: "strong-middle",
      topic: "Android Basics",
      question: "Как оптимизировать глубину иерархии view с помощью ConstraintLayout и merge/include?",
      rubric: "Должно быть: flatten hierarchy; merge; include; производительность.",
    },
    {
      id: "andr-layouts-senior",
      skillId: "junior-android-layouts",
      grade: "senior",
      topic: "Android Basics",
      question: "Как проектировать масштабируемые XML-экраны с учётом тем, локализации и доступности?",
      rubric: "Должно быть: темы; локализация; доступность; масштабируемость.",
    },
  ],
  "junior-android-view": [
    {
      id: "andr-view-junior",
      skillId: "junior-android-view",
      grade: "junior",
      topic: "Android Basics",
      question: "Что такое View и ViewGroup в Android? Как задать размеры view в XML?",
      rubric: "Должно быть: View vs ViewGroup; layout_width/height; match_parent/wrap_content.",
    },
    {
      id: "andr-view-middle",
      skillId: "junior-android-view",
      grade: "middle",
      topic: "Android Basics",
      question: "Как найти view по id (findViewById) и изменить её свойства программно?",
      rubric: "Должно быть: findViewById; View Binding; изменение свойств.",
    },
    {
      id: "andr-view-strong-middle",
      skillId: "junior-android-view",
      grade: "strong-middle",
      topic: "Android Basics",
      question: "Как управлять видимостью, padding и margin? Как избежать лишних measure/layout проходов?",
      rubric: "Должно быть: visibility; padding/margin; measure/layout; производительность.",
    },
    {
      id: "andr-view-senior",
      skillId: "junior-android-view",
      grade: "senior",
      topic: "Android Basics",
      question: "Как проектировать кастомные View с учётом onMeasure/onLayout/onDraw и доступности?",
      rubric: "Должно быть: custom View; onMeasure/onLayout/onDraw; accessibility.",
    },
  ],
  "junior-android-toast": [
    {
      id: "andr-toast-junior",
      skillId: "junior-android-toast",
      grade: "junior",
      topic: "Android Basics",
      question: "Как показать простое сообщение пользователю с помощью Toast?",
      rubric: "Должно быть: Toast.makeText; show; длительность.",
    },
    {
      id: "andr-toast-middle",
      skillId: "junior-android-toast",
      grade: "middle",
      topic: "Android Basics",
      question: "Чем отличаются Toast, Snackbar и AlertDialog? Когда что использовать?",
      rubric: "Должно быть: различия; UX; выбор.",
    },
    {
      id: "andr-toast-strong-middle",
      skillId: "junior-android-toast",
      grade: "strong-middle",
      topic: "Android Basics",
      question: "Как правильно показывать диалоги (DialogFragment) и Snackbar в архитектуре с ViewModel?",
      rubric: "Должно быть: DialogFragment; Snackbar; ViewModel; жизненный цикл.",
    },
    {
      id: "andr-toast-senior",
      skillId: "junior-android-toast",
      grade: "senior",
      topic: "Android Basics",
      question: "Как проектировать систему уведомлений/диалогов в приложении с учётом доступности и локализации?",
      rubric: "Должно быть: доступность; локализация; централизация; тестирование.",
    },
  ],

};

export const allQuizQuestions: QuizQuestion[] = Object.values(
  quizQuestionsBySkill,
).flat();

export function getQuizQuestionsBySkill(skillId: string): QuizQuestion[] {
  return quizQuestionsBySkill[skillId] ?? [];
}

export const QUIZ_GRADES: QuizGrade[] = [
  "junior",
  "middle",
  "strong-middle",
  "senior",
];

export function getGradeLevelOrder(grade: QuizGrade): number {
  switch (grade) {
    case "junior":
      return 1;
    case "middle":
      return 2;
    case "strong-middle":
      return 3;
    case "senior":
      return 4;
  }
}

export function getQuizGradeCounts(skillId: string): Record<QuizGrade, number> {
  const counts = QUIZ_GRADES.reduce((acc, grade) => {
    acc[grade] = 0;
    return acc;
  }, {} as Record<QuizGrade, number>);
  for (const q of getQuizQuestionsBySkill(skillId)) counts[q.grade] += 1;
  return counts;
}

export function getTotalQuizQuestions(skillId: string): number {
  return getQuizQuestionsBySkill(skillId).length;
}

/** @deprecated Use allQuizQuestions */
export const juniorProgrammingBasicsQuestions = allQuizQuestions;
