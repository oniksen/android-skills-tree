import type { QuizQuestion } from "./types";

export const seniorQuizQuestions: QuizQuestion[] = [
  // ============================
  // Senior: Kotlin Expert
  // ============================
  {
    id: "sq-kotlin-compiler",
    skillId: "senior-kotlin-compiler",
    grade: "senior",
    topic: "Kotlin Compiler Internals",
    question:
      "Опиши путь Kotlin-кода от исходного файла до исполняемого артефакта. Как устроена архитектура K2, какие задачи выполняют FIR и IR, где происходят разрешение типов и генерация целевого кода? В каких случаях для расширения компиляции следует выбрать KSP, KAPT или Compiler Plugin?",
    rubric:
      "Кандидат должен объяснить общую архитектуру компилятора: frontend анализирует исходный код, разрешает имена и перегрузки, проверяет типы и формирует промежуточное представление; backend преобразует представление в целевой код. Нужно понимать роль K2 и FIR как frontend-представления, предназначенного для анализа и последующих преобразований, и IR как платформенно-независимого промежуточного представления, используемого backend-ами. Следует различать JVM, Kotlin/Native, Kotlin/JS и Wasm backends и понимать, что общие этапы компиляции могут завершаться платформенно-специфичной генерацией. Кандидат должен объяснить различия KSP, KAPT и Compiler Plugins: KSP анализирует символы Kotlin и генерирует дополнительные исходники, KAPT обеспечивает совместимость с Java annotation processors через генерацию stubs, а Compiler Plugin может глубже вмешиваться в компиляцию и преобразовывать представление программы. Нужно понимать роль IR transformations, ограничения symbol processing по сравнению с изменением семантики компиляции, incremental compilation и различия isolating/aggregating генерации на концептуальном уровне. Хороший ответ включает пример выбора инструмента для генерации DI-кода, сериализации или изменения поведения composable-функций. Кандидат должен учитывать стоимость поддержки плагина, совместимость с версиями Kotlin Compiler, бинарную совместимость и сложность диагностики ошибок на разных этапах компиляции.",
  },
  {
    id: "sq-kotlin-memory",
    skillId: "senior-kotlin-memory",
    grade: "senior",
    topic: "Memory Model и JVM Internals",
    question:
      "Приложение на Kotlin/JVM неожиданно потребляет много памяти и создаёт высокую нагрузку на GC. Как устроено представление объектов в памяти JVM и какие механизмы могут влиять на фактический размер и время жизни объектов? Объясни Stack, Heap, Metaspace, Object Header, compressed references, Escape Analysis, boxing/unboxing и различия моделей памяти JVM и Kotlin/Native.",
    rubric:
      "Кандидат должен объяснить назначение Stack, Heap и Metaspace и понимать, что локальные переменные и ссылки не означают автоматического размещения всех объектов на стеке: объекты обычно размещаются в heap, но JIT может применять оптимизации. Нужно знать концептуальное устройство объектной модели JVM: заголовок объекта, ссылки, выравнивание и влияние compressed ordinary object pointers на размер ссылок при определённых конфигурациях. Следует объяснить достижимость объектов через GC roots и работу Garbage Collector, включая generational подход и различия G1 и ZGC на уровне целей и характеристик. Кандидат должен понимать Escape Analysis и Scalar Replacement: если объект не выходит за пределы определённого контекста, JVM может устранить его фактическую аллокацию или разложить на скалярные значения, но это зависит от оптимизаций runtime. Нужно разобрать boxing/unboxing, влияние generic-контекстов и value classes на представление значений. Важно понимать Java Memory Model: visibility, happens-before и гарантии синхронизации, а также не смешивать её с особенностями памяти Kotlin/Native. Для Kotlin/Native следует объяснить современную модель управления памятью, tracing GC и взаимодействие с Objective-C/Swift ARC, включая ownership и возможные циклы удержания. Хороший ответ опирается на heap dump, allocation profiling и измерения, а не на предположения о физическом размещении каждого Kotlin-объекта.",
  },
  {
    id: "sq-kotlin-multiplatform",
    skillId: "senior-kotlin-multiplatform",
    grade: "senior",
    topic: "Kotlin Multiplatform Architecture",
    question:
      "Спроектируй архитектуру Kotlin Multiplatform-приложения для Android, iOS, JVM Desktop и Web. Как определить границы common-кода, организовать source sets и платформенные реализации, когда использовать expect/actual, а когда интерфейсную абстракцию? Какие ограничения необходимо учитывать при публикации и сопровождении KMP-библиотеки?",
    rubric:
      "Кандидат должен предложить архитектуру, в которой общий код содержит действительно переносимую бизнес-логику, модели, use cases, контракты и подходящие multiplatform-зависимости, а платформенные source sets реализуют специфичные возможности. Нужно объяснить структуру CommonMain и платформенных source sets, Hierarchical Project Structure и наследование зависимостей между source sets. Следует сравнить expect/actual с interface-based abstraction: expect/actual подходит для небольших платформенных различий и компиляторно связанных деклараций, интерфейсы позволяют явно управлять зависимостями, внедрять реализации и тестировать контракты. Кандидат должен понимать особенности Kotlin/JVM, Kotlin/Native и iOS interop, Kotlin/JS и Kotlin/Wasm, Compose Multiplatform и доступность библиотек на разных targets. Нужно учитывать платформенные API, различия threading/concurrency, файловой системы, сетевого стека, хранения данных и UI-интеграции. Хороший ответ объясняет, как подключать Ktor, Coroutines и Serialization без утечки платформенных деталей в commonMain, как тестировать общий и платформенный код и как организовать Gradle targets и source sets без избыточных зависимостей. Следует рассмотреть публикацию KMP-библиотеки: metadata, target artifacts, совместимость Kotlin и Gradle, API/ABI, документацию и тестирование потребителями. Важно обосновать, что именно следует разделять между платформами, а не стремиться максимизировать процент общего кода любой ценой.",
  },
  {
    id: "sq-kotlin-perf",
    skillId: "senior-kotlin-perf",
    grade: "senior",
    topic: "Kotlin Performance Engineering",
    question:
      "Представь, что критичный Kotlin-модуль показывает высокое время CPU и большое количество аллокаций. Как провести performance investigation от гипотезы до подтверждённой оптимизации? Объясни стоимость Kotlin-абстракций, lambda, inline, коллекций, корутин, boxing, JIT/AOT и роль JMH.",
    rubric:
      "Кандидат должен описать воспроизводимый процесс: определить метрику и workload, сформулировать гипотезу, снять baseline, профилировать, локализовать hotspot, изменить реализацию и повторно измерить в сопоставимых условиях. Нужно понимать, как Kotlin-код преобразуется в JVM bytecode и почему высокоуровневая конструкция не всегда имеет ожидаемую runtime-стоимость. Следует рассмотреть аллокации лямбд и функциональных объектов, boxing/unboxing, generic-типы, value classes, inline-функции и стоимость создания промежуточных коллекций. Кандидат должен объяснить, когда Sequence может уменьшить количество промежуточных объектов, а когда его overhead будет выше выигрыша. Нужно понимать стоимость запуска и диспетчеризации корутин, переключения контекста и синхронизации, но не считать сами корутины отдельными потоками. Следует различать JIT и AOT-компиляцию и понимать влияние прогрева JVM на измерения. JMH должен быть представлен как специализированный инструмент JVM microbenchmarking с корректной организацией warmup, forks, iterations и предотвращением dead-code elimination. Хороший ответ включает allocation profiling, анализ bytecode, измерение throughput/latency и оценку trade-offs между производительностью, читаемостью и поддерживаемостью. Важно не делать выводы по единичному запуску или только по синтетическому микробенчмарку.",
  },
  {
    id: "sq-kotlin-reflection",
    skillId: "senior-kotlin-reflection",
    grade: "senior",
    topic: "Advanced Reflection",
    question:
      "Тебе необходимо разработать инфраструктурный механизм, который анализирует Kotlin-типы, конструкторы, свойства и аннотации, а затем динамически создаёт объекты. Как построить такое решение с помощью Kotlin Reflection? Объясни KCallable, KParameter, KType, callBy и KVisibility. Какие ограничения, затраты и риски возникают в production?",
    rubric:
      "Кандидат должен объяснить архитектуру Kotlin Reflection API и взаимосвязь KCallable, KFunction, KProperty, KMutableProperty, KParameter и KType. Нужно понимать различия call и callBy, работу с параметрами конструктора, значениями по умолчанию, receiver-параметрами и видимостью. Следует объяснить, как получать аннотации, анализировать generic type information и обращаться к членам класса, включая ограничения доступа к private-членам на JVM. Нужно сравнить Kotlin Reflection и Java Reflection, понимать роль Kotlin Metadata и то, что KType может представлять информацию о generic-типах в reflection-модели, но не отменяет ограничений runtime type erasure. Кандидат должен рассмотреть применение reflection в DI, serialization, mapping и инфраструктурных библиотеках. Важны стоимость runtime-анализа, кэширование метаданных, влияние R8/obfuscation, требования к kotlin-reflect и ограничения Kotlin Multiplatform. Хороший ответ предлагает стратегию кэширования и безопасной диагностики, обсуждает ограничения модульной системы и объясняет, когда compile-time code generation через KSP или Compiler Plugin предпочтительнее динамической рефлексии. Необходимо учитывать, что reflection API может быть неполностью доступен на некоторых KMP-платформах.",
  },
  {
    id: "sq-kotlin-annotations",
    skillId: "senior-kotlin-annotations",
    grade: "senior",
    topic: "Annotations и Annotation Processing",
    question:
      "Спроектируй annotation-driven библиотеку, которая анализирует пользовательские декларации Kotlin и генерирует типобезопасный код на этапе компиляции. Как определить контракт аннотаций, выбрать между KAPT, KSP и Compiler Plugin и реализовать инкрементальную генерацию без нарушения совместимости API?",
    rubric:
      "Кандидат должен объяснить проектирование аннотаций через @Target, @Retention, @Repeatable и мета-аннотации, а также назначение параметров аннотаций и Kotlin/Java interoperability. Нужно различать SOURCE, BINARY и RUNTIME retention и объяснить, как выбор retention влияет на доступность информации процессору и runtime reflection. Следует сравнить KAPT, KSP и Compiler Plugins: KAPT работает через Java annotation processing и stubs, KSP анализирует Kotlin symbols и генерирует исходники, Compiler Plugin может выполнять более глубокие преобразования компиляции. Кандидат должен уметь выбрать инструмент с учётом требований к доступу к декларациям, изменению семантики кода, скорости сборки и совместимости с Kotlin Compiler. Нужно понимать KSP symbols, validation, deferred symbols, generated source files и различия aggregating/isolating processors с точки зрения инкрементальной сборки. Следует рассмотреть диагностику ошибок через processor logger, обработку некорректных аннотаций и deterministic generation. Хороший ответ объясняет эволюцию annotation API, бинарную совместимость генерируемых классов, поведение при изменении схемы и тестирование процессора на реальных compilation fixtures. Важно учитывать стоимость поддержки compiler plugin и не выбирать его, если задачу можно решить обычной генерацией исходников.",
  },

  // ============================
  // Senior: Concurrency Expert
  // ============================
  {
    id: "sq-concurrency-internals",
    skillId: "senior-concurrency-internals",
    grade: "senior",
    topic: "Coroutine Internals",
    question:
      "Что происходит с suspend-функцией после компиляции Kotlin? Объясни преобразование в Continuation Passing Style, устройство Continuation и state machine, сохранение локальных переменных между suspension points и механизм resume. Как в этом процессе участвуют ContinuationInterceptor и DispatchedContinuation?",
    rubric:
      "Кандидат должен объяснить, что suspend-функции компилируются в CPS-представление: к функции добавляется Continuation, через который передаётся результат или исключение после возобновления. Нужно понимать, что suspend-функция может возвращать специальный маркер COROUTINE_SUSPENDED, а не блокировать поток. Следует объяснить генерацию state machine: suspension points становятся состояниями, локальные переменные, необходимые после приостановки, сохраняются в полях continuation-объекта, а label определяет точку продолжения. Нужно знать назначение ContinuationImpl и invokeSuspend на уровне сгенерированной реализации, а также различать suspension и resumption. Кандидат должен объяснить роль ContinuationInterceptor и CoroutineDispatcher в перехвате continuation и управлении местом выполнения возобновления; DispatchedContinuation является частью runtime-механизма диспетчеризации. Нужно понимать CancellableContinuation и координацию отмены с callback-based API, включая гонки между отменой и resume. Следует рассмотреть stacktrace recovery, debug probes и взаимодействие компилятора с kotlinx.coroutines runtime. Хороший ответ основан на анализе декомпилированного кода или bytecode, но подчёркивает, что конкретные внутренние классы и детали реализации не являются стабильным публичным контрактом.",
  },
  {
    id: "sq-concurrency-dispatchers",
    skillId: "senior-concurrency-dispatchers",
    grade: "senior",
    topic: "Dispatchers Internals",
    question:
      "Как устроено планирование корутин в kotlinx.coroutines на JVM? Объясни роли CoroutineDispatcher, CoroutineScheduler, worker threads и work-stealing. Почему Dispatchers.IO связан с Dispatchers.Default, как работает ограничение параллелизма и какие проблемы могут возникать при смешении blocking и CPU-bound workload?",
    rubric:
      "Кандидат должен объяснить CoroutineDispatcher как механизм определения способа выполнения continuation и назначение dispatch/isDispatchNeeded. Нужно понимать общую архитектуру Dispatchers.Default и CoroutineScheduler, worker threads, очереди задач и work-stealing как способ балансировки нагрузки. Следует объяснить, что Dispatchers.IO предназначен для блокирующих I/O-операций и реализован с использованием общей инфраструктуры планирования с Default, но имеет отдельные ограничения и правила допуска blocking-задач. Кандидат должен понимать ограничение параллелизма через limitedParallelism и различать ограничение количества одновременно выполняемых задач от создания отдельного фиксированного пула потоков. Нужно рассмотреть Dispatchers.Main и Android HandlerContext, ExecutorCoroutineDispatcher и необходимость корректного закрытия собственного dispatcher. Важно объяснить starvation, fairness, избыточную диспетчеризацию, блокировку worker threads и ситуации, когда blocking-код требует изоляции. Хороший ответ предлагает диагностику через thread dumps, tracing и профилирование, объясняет, почему Dispatchers.IO не следует автоматически назначать любой suspend-функции и учитывает, что внутренняя реализация CoroutineScheduler может меняться между версиями библиотеки.",
  },
  {
    id: "sq-concurrency-statemachine",
    skillId: "senior-concurrency-statemachine",
    grade: "senior",
    topic: "Coroutine State Machine",
    question:
      "Опиши жизненный цикл Job от создания до завершения или отмены. Какие состояния и переходы происходят при наличии дочерних корутин? Как связаны Job state machine, Continuation, cancellation handlers и NonCancellable sections? Как диагностировать корутину, которая не завершается после cancel()?",
    rubric:
      "Кандидат должен объяснить жизненный цикл корутины и внутреннюю роль Job в управлении её состоянием и иерархией. Нужно понимать состояния активного выполнения, completing, cancelling и завершения, а также то, что завершение родительской корутины может ожидать завершения дочерних задач и выполнения completion handlers. Следует объяснить распространение cancellation по иерархии, отличие отмены от нормального завершения и связь Job state machine с Continuation и suspension/resumption. Кандидат должен понимать кооперативную природу отмены: корутина может не завершиться, если выполняет длительный блокирующий код или не проверяет состояние отмены. Нужно объяснить назначение invokeOnCompletion, cancellation handlers и withContext(NonCancellable) для ограниченных cleanup-операций. Важно отметить, что NonCancellable не должен использоваться для продолжения произвольной работы или бесконечного ожидания. Хороший ответ предлагает диагностику: проверка isActive, поиск блокирующих вызовов, анализ дочерних Job, thread dump, coroutine debug information и проверка callback-интеграций. Кандидат должен различать публичные гарантии API и конкретные внутренние состояния реализации Job.",
  },
  {
    id: "sq-concurrency-atomic",
    skillId: "senior-concurrency-atomic",
    grade: "senior",
    topic: "Atomic Operations и Lock-free Algorithms",
    question:
      "Спроектируй потокобезопасный компонент с высокой конкуренцией за обновление общего состояния. Когда следует использовать AtomicReference и CAS, когда Mutex, а когда обычную синхронизацию? Объясни lock-free и wait-free алгоритмы, happens-before, memory ordering и ABA problem.",
    rubric:
      "Кандидат должен объяснить атомарные операции как неделимые операции над разделяемым состоянием и принцип CAS: обновление выполняется только при совпадении текущего значения с ожидаемым. Нужно понимать типичную CAS-loop, повторное чтение и вычисление нового состояния при неуспешной попытке, а также требования к чистоте повторяемого вычисления. Следует различать lock-free как гарантию системного прогресса при наличии конкурентной активности и wait-free как более сильную гарантию завершения каждой операции за ограниченное число собственных шагов. Нужно объяснить visibility, happens-before и memory ordering в контексте Java Memory Model, а также назначение AtomicReference, atomic primitives и AtomicFU в Kotlin-проектах и KMP. Кандидат должен разобрать ABA problem: значение может измениться A → B → A, и простое сравнение не обнаружит промежуточное изменение; возможные решения включают version stamp или иной протокол идентификации версии. Важно сравнить atomic operations, Mutex и synchronized по сложности, contention, критической секции и корректности. Хороший ответ учитывает риск starvation, false sharing и стоимость lock-free реализации, а также необходимость stress-тестирования и профилирования. Нельзя считать lock-free автоматически более быстрым или простым решением.",
  },
  {
    id: "sq-concurrency-sharedflow",
    skillId: "senior-concurrency-sharedflow",
    grade: "senior",
    topic: "SharedFlow Internals",
    question:
      "Разбери внутреннюю архитектуру MutableSharedFlow: как организовано хранение replay cache, регистрация подписчиков, буферизация и синхронизация конкурентных emit? Как меняется поведение при разных BufferOverflow и отсутствии подписчиков? Какие внутренние гарантии нельзя считать частью публичного API?",
    rubric:
      "Кандидат должен объяснить семантическую модель SharedFlow как горячего broadcast-потока с несколькими подписчиками и общим хранилищем последних значений. Нужно понимать концепции replay cache, subscriber state, буферизации и синхронизации producer/consumer, не сводя их к предположению об одной фиксированной структуре памяти для всех версий. Следует подробно разобрать SUSPEND, DROP_OLDEST и DROP_LATEST, поведение emit и tryEmit при заполнении буфера и конкурирующих подписчиках. Важно понимать поведение при отсутствии подписчиков: replay cache может сохранять последние значения, но extraBufferCapacity не превращается в устойчивую очередь, а overflow policy не даёт гарантии доставки отсутствующему consumer. Кандидат должен объяснить subscriptionCount и жизненный цикл подписки, обработку конкурентных emit и последствия медленного подписчика. Нужно сравнить SharedFlow и Channel с точки зрения broadcast, распределения элементов, ownership и backpressure. Хороший ответ обсуждает производительность и ограничения SharedFlow для гарантированной доставки событий, а также чётко разделяет контракт публичного API и детали реализации — внутренние массивы, индексы, блокировки и конкретные алгоритмы могут измениться между версиями kotlinx.coroutines.",
  },

  // ============================
  // Senior: Android Platform Expert
  // ============================
  {
    id: "sq-platform-art",
    skillId: "senior-platform-art",
    grade: "senior",
    topic: "Android Runtime (ART)",
    question:
      "Опиши путь Android-приложения от DEX-файлов до выполнения машинного кода в ART. Как взаимодействуют interpretation, JIT, AOT, dex2oat и profile-guided compilation? Как работа ART и Garbage Collector влияет на startup, latency и использование памяти?",
    rubric:
      "Кандидат должен объяснить ART как runtime Android, пришедший на смену Dalvik, и понимать назначение DEX как формата байткода, содержащего классы, методы и инструкции приложения. Следует разобрать загрузку и verification классов, интерпретацию DEX и JIT-компиляцию часто выполняемого кода, а также AOT-компиляцию через dex2oat и профильную оптимизацию на основе данных о типичных сценариях выполнения. Нужно понимать, что современные Android-системы могут комбинировать interpretation, JIT и AOT, а стратегия зависит от версии платформы, профилей и состояния приложения. Кандидат должен объяснить роль Baseline Profiles и ART profiles, не смешивая их полностью с механизмами профилирования конкретного benchmark. Следует рассмотреть GC в ART, concurrent и generational подходы, влияние аллокаций, pause times и memory pressure на latency. Нужно понимать связь runtime с System Server и системными службами на архитектурном уровне. Хороший ответ объясняет, как диагностировать startup и runtime-проблемы через tracing, профилирование, GC metrics и анализ compiled artifacts, а также почему теоретическое знание ART не заменяет измерения на целевых устройствах.",
  },
  {
    id: "sq-platform-binder",
    skillId: "senior-platform-binder",
    grade: "senior",
    topic: "Binder IPC",
    question:
      "Как работает Binder IPC в Android от вызова интерфейса клиентом до выполнения метода в другом процессе? Объясни Stub/Proxy, IBinder, Parcel, binder driver, Binder thread pool и различия synchronous и one-way transactions. Какие ограничения и угрозы безопасности необходимо учитывать при проектировании IPC?",
    rubric:
      "Кандидат должен объяснить Binder как основной механизм IPC Android, связывающий клиентский Proxy с серверным Stub через IBinder и Binder driver в ядре. Нужно описать общий путь вызова: формирование Parcel, транзакция через драйвер, доставка в поток Binder thread pool процесса-получателя, вызов соответствующего Stub и возврат результата. Следует понимать роль AIDL для генерации контрактов, Parcelable/Parcel для передачи данных и различия synchronous и one-way transactions: синхронный вызов ожидает ответ, one-way не возвращает результат вызывающему и имеет другую семантику обработки. Кандидат должен объяснить ограничения размера транзакций и причины TransactionTooLargeException, особенности Binder thread pool, риск deadlocks и блокировки вызывающего потока. Нужно знать назначение death recipients и binderDied для обнаружения смерти удалённого процесса. Важно рассмотреть Binder identity, calling UID/PID, проверку полномочий, permissions и доверие к данным из межпроцессного вызова. Хороший ответ объясняет, почему IPC нельзя бездумно выполнять на главном потоке, как проектировать компактные контракты и как диагностировать ошибки Binder-транзакций.",
  },
  {
    id: "sq-platform-zygote",
    skillId: "senior-platform-zygote",
    grade: "senior",
    topic: "Zygote",
    question:
      "Как Android создаёт процесс приложения через Zygote? Объясни предварительную загрузку классов и ресурсов, fork, Copy-on-Write, shared memory pages и взаимодействие Zygote с System Server. Как этот механизм влияет на время запуска приложения и потребление памяти?",
    rubric:
      "Кандидат должен объяснить Zygote как специальный процесс Android, который запускается при старте системы, предварительно инициализирует runtime и загружает часть классов и ресурсов, после чего создаёт процессы приложений через fork. Нужно понимать Copy-on-Write: дочерний процесс изначально использует общие страницы памяти с родительским процессом, а физическое копирование происходит при изменении соответствующих страниц. Следует объяснить, почему preload уменьшает повторные затраты на инициализацию и может влиять на startup latency и суммарное использование памяти. Кандидат должен понимать роль Zygote socket и команды запуска, связь с System Server и общую последовательность создания app process. Нужно знать назначение USAP Pool как механизма предварительно созданных процессов для ускорения запуска там, где он применяется. Хороший ответ обсуждает ограничения fork в Android-среде, необходимость корректной инициализации после создания процесса и влияние ранней загрузки классов на память. Важно не утверждать, что каждый процесс полностью копирует память Zygote или что все ресурсы остаются общими после запуска.",
  },
  {
    id: "sq-platform-ams",
    skillId: "senior-platform-ams",
    grade: "senior",
    topic: "ActivityManagerService и ActivityTaskManagerService",
    question:
      "Разбери системный путь запуска Activity: от вызова startActivity() до создания или возобновления Activity в процессе приложения. Как взаимодействуют ActivityManagerService, ActivityTaskManagerService, System Server, Zygote, ActivityThread и ClientTransaction? Как система принимает решение об importance процесса и его завершении?",
    rubric:
      "Кандидат должен описать запуск Activity как взаимодействие приложения с системными сервисами через Binder IPC. Нужно понимать роль ActivityTaskManagerService в управлении задачами, Activity launch и back stack, а ActivityManagerService — в управлении процессами и другими аспектами жизненного цикла приложения; точное распределение ответственности зависит от версии Android и рефакторинга системных компонентов. Следует объяснить роль System Server, PackageManager при разрешении компонента, Zygote при создании нового процесса и ActivityThread как главного клиентского управляющего компонента процесса приложения. Нужно знать назначение ClientTransaction и транзакций, которыми система доставляет процессу команды жизненного цикла Activity. Кандидат должен понимать process importance/states, foreground и background процессы, связь с пользовательской видимостью и ограничениями памяти, а также роль lmkd/Low Memory Killer в выборе процессов при дефиците памяти. Следует различать системное завершение процесса и штатный callback onDestroy: приложение не может рассчитывать на получение callback перед принудительным завершением. Хороший ответ включает сценарий cold start, запуск Activity в существующем процессе, возврат из background и восстановление после Process Death, а также объясняет, где искать диагностику системных решений.",
  },
  {
    id: "sq-platform-wms",
    skillId: "senior-platform-wms",
    grade: "senior",
    topic: "WindowManagerService",
    question:
      "Как Android управляет окнами и поверхностями приложения? Объясни роли WindowManagerService, Window hierarchy, window tokens, SurfaceControl и SurfaceFlinger. Как связаны layout окон, insets, input routing, transitions и multi-window режимы?",
    rubric:
      "Кандидат должен объяснить WindowManagerService как системный компонент управления окнами, их размещением, видимостью, конфигурацией и взаимодействием с дисплеями. Нужно понимать связь WindowManager API приложения с системным WMS, назначение window types, tokens и WindowManager.LayoutParams. Следует объяснить, как система определяет размещение окон, применяет ограничения дисплея, обрабатывает multi-window и multi-display, а также управляет системными insets и областями status/navigation bars. Кандидат должен понимать роль Surface и SurfaceControl как механизмов управления графическими поверхностями, а SurfaceFlinger — как системного композитора, который объединяет слои для отображения на экране. Нужно рассмотреть связь оконной системы с input windows и маршрутизацией событий ввода, а также с анимациями и transitions. Хороший ответ объясняет взаимодействие WMS с ActivityTaskManagerService при открытии, закрытии и изменении окон, и умеет локализовать проблемы, связанные с неправильными insets, перекрытиями, z-order или multi-window. Важно отличать ответственность WMS от ответственности самого приложения и от графического композитора.",
  },
  {
    id: "sq-platform-package",
    skillId: "senior-platform-package",
    grade: "senior",
    topic: "PackageManager Internals",
    question:
      "Как Android устанавливает и обновляет APK на устройстве? Разбери роли PackageManagerService, PackageInstaller, package scanning, проверки подписи, разрешений и разрешения Intent. Как диагностировать ситуацию, когда установка или обновление приложения завершается ошибкой?",
    rubric:
      "Кандидат должен объяснить роль PackageManager API как публичного интерфейса и PackageManagerService как системной реализации управления установленными пакетами. Нужно понимать общий процесс установки через PackageInstaller: получение пакета, проверку структуры и подписи, обработку манифеста, разрешений, компонентов и регистрацию пакета в системных данных. Следует объяснить ApplicationInfo и PackageInfo, package scanning и разрешение Activity/Service/Receiver через Intent filters. Кандидат должен различать APK signing schemes на концептуальном уровне, понимать проверку совместимости подписей при обновлении и назначение Play App Signing, Upload Key и App Signing Key. Нужно знать ограничения package visibility и QUERY_ALL_PACKAGES, а также понимать, что приложение не может произвольно получать сведения обо всех установленных пакетах. Хороший ответ рассматривает диагностику через Package Manager shell commands, Logcat и коды ошибок установки: несовместимая подпись, downgrade versionCode, конфликт package name, отсутствующая ABI, недостающие split APK или некорректный Manifest. Важно учитывать, что конкретные этапы и внутренние классы PackageManagerService могут различаться между версиями Android.",
  },
  {
    id: "sq-platform-looper",
    skillId: "senior-platform-looper",
    grade: "senior",
    topic: "Looper и MessageQueue Internals",
    question:
      "Что происходит внутри Main Looper, когда Android обрабатывает события UI и синхронизирует работу с кадрами? Объясни MessageQueue, native poller/epoll, Message lifecycle, IdleHandler, synchronization barriers, asynchronous messages и взаимодействие с Choreographer.",
    rubric:
      "Кандидат должен объяснить Looper как цикл обработки сообщений конкретного потока, а MessageQueue как механизм хранения и выбора следующей задачи для выполнения. Нужно понимать жизненный цикл Message, повторное использование объектов через message pool и роль Handler при постановке и обработке сообщений. Следует объяснить, что MessageQueue взаимодействует с native poller, который может ожидать событий через механизмы ОС, включая epoll, и пробуждается при появлении новых сообщений или других событий. Кандидат должен понимать назначение IdleHandler, synchronization barriers и asynchronous messages: барьеры могут временно задерживать синхронные сообщения, а асинхронные сообщения способны проходить через соответствующие барьеры. Нужно объяснить роль Choreographer и frame callbacks в координации UI-работы с VSync и этапами кадра. Хороший ответ рассматривает, как долгие callback блокируют Main Looper, вызывают input latency и ANR, а также как анализировать задержки через tracing и message timing. Важно различать публичное поведение Handler/Looper и внутренние реализации MessageQueue, которые могут меняться.",
  },

  // ============================
  // Senior: Compose Advanced
  // ============================
  {
    id: "sq-compose-compiler",
    skillId: "senior-compose-compiler",
    grade: "senior",
    topic: "Compose Compiler Internals",
    question:
      "Как Compose Compiler Plugin преобразует @Composable-функции при компиляции? Объясни composable transformation, добавление Composer и служебных параметров, changed/default masks, restartable/skippable groups и stability inference. Как диагностировать проблемы совместимости Compose Compiler и Kotlin?",
    rubric:
      "Кандидат должен объяснить, что Compose Compiler Plugin интегрируется с Kotlin Compiler и преобразует composable-функции в форму, понятную Compose Runtime. Нужно понимать, что в преобразованном коде появляются служебные параметры и вызовы, связанные с Composer, а также информация об изменениях параметров и default values. Следует объяснить назначение changed и default parameter masks на концептуальном уровне: они помогают runtime определить, какие параметры изменились или были использованы по умолчанию. Кандидат должен понимать restartable и skippable группы, compiler-generated code и роль stability inference при принятии решения о пропуске вызова. Нужно объяснить Strong Skipping Mode с учётом версии Compose Compiler и соответствующих правил сравнения параметров. Важно знать, как собирать compiler metrics/reports, анализировать stability и диагностику преобразования composable-функций. Хороший ответ рассматривает интеграцию плагина с Kotlin Compiler, совместимость версий, миграцию compiler plugin configurations и разницу между публичным API и нестабильными деталями lowering. Кандидат должен уметь определить, когда проблема вызвана неправильным state model, нестабильным параметром или настройкой компилятора, а не предполагать, что любая рекомпозиция свидетельствует о дефекте.",
  },
  {
    id: "sq-compose-slot",
    skillId: "senior-compose-slot",
    grade: "senior",
    topic: "Slot Table Internals",
    question:
      "Как Slot Table хранит структуру Composition и remembered values? Объясни группы, слоты, anchors, group keys, positional memoization и movable groups. Как Compose сохраняет идентичность элементов при изменении порядка или динамического состава UI?",
    rubric:
      "Кандидат должен объяснить Slot Table как внутреннюю структуру хранения информации о группах композиции и associated slot values. Нужно понимать различие между группами и слотами: группы описывают структурные участки композиции, а слоты хранят значения, в том числе запомненные через remember. Следует объяснить positional memoization и роль ключей в сопоставлении участков композиции между проходами. Anchors позволяют ссылаться на логические позиции групп, несмотря на изменения внутреннего расположения данных. Нужно понимать назначение restartable и movable groups, вставки, удаления и перемещения элементов, особенно в динамических списках. Кандидат должен объяснить, как ключи помогают сохранить идентичность элемента при изменении порядка и почему отсутствие устойчивых ключей может привести к неверному переносу состояния или лишним операциям. Следует знать, что некоторые детали Slot Table могут реализовываться с использованием gap-buffer-подобных структур, но это внутренняя деталь, а не контракт для прикладного кода. Хороший ответ связывает Slot Table с Composer, remember и recomposition, демонстрируя понимание причин сохранения или сброса состояния при изменении дерева.",
  },
  {
    id: "sq-compose-recomposer",
    skillId: "senior-compose-recomposer",
    grade: "senior",
    topic: "Recomposer Internals",
    question:
      "Как Recomposer координирует выполнение Composition и рекомпозицию? Объясни invalidation scheduling, frame clock, ожидание следующего кадра, применение изменений и взаимодействие со Snapshot System. Что происходит при ошибке во время recomposition и как управлять временем жизни Recomposer?",
    rubric:
      "Кандидат должен объяснить Recomposer как runtime-компонент, который отслеживает invalidation, планирует рекомпозицию и координирует применение изменений к композициям. Нужно понимать связь Composition и Recomposer, механизмы ожидания изменений и планирования работы. Следует объяснить роль MonotonicFrameClock и frame callbacks: некоторые операции композиции и анимации синхронизируются с кадрами, а ожидание следующего кадра позволяет координировать UI-обновления. Кандидат должен понимать этап применения изменений, взаимодействие с Snapshot System и то, как наблюдение состояния приводит к invalidation соответствующих scope. Нужно рассмотреть lifecycle Recomposer, его coroutine context и необходимость корректно управлять им в тестах или нестандартных Compose-host окружениях. Следует объяснить, что ошибки во время composition могут нарушить ожидаемый проход обновления и должны обрабатываться в соответствии с runtime-механизмами и границами приложения. Хороший ответ отличает публичные возможности API от внутренних состояний Recomposer, понимает concurrent recomposition на концептуальном уровне и предлагает инструменты диагностики, а не предполагает, что ручное управление Recomposer требуется обычному экрану.",
  },
  {
    id: "sq-compose-snapshot",
    skillId: "senior-compose-snapshot",
    grade: "senior",
    topic: "Snapshot System Internals",
    question:
      "Объясни внутреннюю архитектуру Snapshot System Compose: StateObject, SnapshotMutableState, read/write observation, MutableSnapshot, apply и распространение изменений. Как Recomposer узнаёт об изменении состояния и что происходит при конфликтующих snapshot updates?",
    rubric:
      "Кандидат должен объяснить StateObject как основу snapshot-aware объектов состояния и SnapshotMutableState как наблюдаемую реализацию состояния, используемую Compose. Нужно понимать, что Snapshot System отслеживает чтение и запись состояния и позволяет выполнять операции в контексте определённого snapshot. Следует объяснить Snapshot.takeSnapshot и MutableSnapshot, изоляцию изменений, apply и обработку конфликтов при попытке объединить несовместимые изменения. Кандидат должен знать назначение read/write observers и SnapshotStateObserver, а также понимать, как применение snapshot приводит к распространению уведомлений и invalidation в Recomposer. Нужно рассмотреть взаимодействие snapshot system с derived state, параллельными изменениями и несколькими наблюдателями. Хороший ответ объясняет, почему внешние mutable-объекты не становятся наблюдаемыми автоматически, почему произвольная мутация коллекции может не вызвать recomposition и какие механизмы нужны для корректного обновления UI. Важно различать гарантию согласованности snapshot-состояния и общую потокобезопасность произвольного кода, а также не использовать внутренние API как стабильную основу прикладной архитектуры без необходимости.",
  },

  // ============================
  // Senior: Architecture & Design
  // ============================
  {
    id: "sq-arch-ddd",
    skillId: "senior-arch-ddd",
    grade: "senior",
    topic: "Domain-Driven Design Advanced",
    question:
      "Представь крупную систему с несколькими бизнес-доменами, разными командами и независимыми моделями данных. Как применить Strategic и Tactical DDD для выделения Bounded Contexts, построения Context Map и определения отношений между контекстами? Когда нужны Anti-Corruption Layer, Shared Kernel и Domain Events?",
    rubric:
      "Кандидат должен различать Strategic DDD, определяющий границы и отношения предметных контекстов, и Tactical DDD, описывающий внутреннее моделирование Entity, Value Object, Aggregate, Domain Service и Repository. Нужно понимать Bounded Context как границу, внутри которой терминология и модель имеют согласованный смысл, и уметь объяснить Ubiquitous Language. Следует описать Context Map и варианты отношений: Shared Kernel, Customer-Supplier, Conformist, Anti-Corruption Layer, Open Host Service, Published Language и Separate Ways. Кандидат должен понимать, что Anti-Corruption Layer защищает внутреннюю модель от внешнего контракта, а Shared Kernel требует согласованного управления общей частью модели и усиливает координацию команд. Нужно объяснить Aggregate Root и consistency boundaries, инварианты агрегата, Domain Events и Repository per Aggregate. Важно рассмотреть интеграцию контекстов через API или события, eventual consistency и необходимость не распространять внутренние Entity одного контекста в другие. Хороший ответ применяет DDD к мобильной и распределённой системе, объясняет, где доменная модель должна жить в клиентском приложении и когда DDD создаёт неоправданную сложность. Кандидат должен обосновывать границы предметными правилами, а не только техническими слоями или названиями модулей.",
  },
  {
    id: "sq-arch-event",
    skillId: "senior-arch-event",
    grade: "senior",
    topic: "Event-Driven Architecture",
    question:
      "Спроектируй событийно-ориентированную архитектуру для нескольких независимых сервисов и мобильного клиента. Как организовать producers, consumers и broker, обеспечить обработку повторных сообщений, порядок событий и восстановление после сбоев? Объясни delivery semantics, transactional outbox, DLQ и Saga.",
    rubric:
      "Кандидат должен объяснить Event-Driven Architecture как модель взаимодействия через события, при которой producer публикует факт произошедшего изменения, а consumers независимо реагируют на него. Нужно понимать Publish/Subscribe, роль Event Broker и различия at-most-once, at-least-once и заявлений exactly-once. Кандидат должен подчеркнуть, что exactly-once end-to-end обычно нельзя гарантировать простым выбором брокера: требуется учитывать границы транзакций, side effects и дедупликацию. Следует объяснить idempotent consumers, message ordering, partitioning или другие способы сохранения необходимого порядка, deduplication и Dead Letter Queue для сообщений, которые не удаётся обработать. Нужно понимать разницу Event Sourcing и обычной передачи событий, назначение CQRS, Transactional Outbox для атомарной фиксации бизнес-изменения и исходящего события и Saga для координации распределённых операций с компенсациями. Хороший ответ рассматривает Kafka/RabbitMQ на архитектурном уровне, версионирование событий, schema evolution, повторную обработку и observability. Для мобильного клиента важно объяснить, что push notifications или WebSocket могут сигнализировать об изменении, но клиент должен корректно восстанавливать состояние после потери соединения и не считать событие единственным источником истины.",
  },
  {
    id: "sq-arch-cqrs",
    skillId: "senior-arch-cqrs",
    grade: "senior",
    topic: "CQRS",
    question:
      "В системе сложная модель записи и множество различных сценариев чтения. Как спроектировать CQRS с отдельными Command и Query paths, handlers и read models? Объясни projections, eventual consistency, связь с Event Sourcing и ситуации, когда CQRS не оправдан.",
    rubric:
      "Кандидат должен объяснить CQRS как разделение ответственности за изменение состояния и чтение данных, при котором Command выражает намерение изменить систему, а Query возвращает данные без изменения состояния. Нужно понимать роли Command Handler и Query Handler, а также возможность использования разных моделей записи и чтения. Следует объяснить read models и projections как специализированные представления, создаваемые для конкретных запросов; materialized views позволяют ускорить чтение ценой дополнительной логики обновления. Кандидат должен понимать eventual consistency: read model может временно отставать от модели записи, поэтому система должна определить допустимую задержку, UX-поведение и механизмы повторной обработки. Важно различать CQRS без Event Sourcing и CQRS с Event Store: первое возможно без сохранения полной истории событий. Нужно рассмотреть versioning событий, обновление projections, повторное проигрывание и обработку ошибок. Хороший ответ объясняет интеграцию CQRS с DDD, применение в мобильном клиенте через специализированные read endpoints или локальные представления, а также цену дублирования моделей и инфраструктуры. Кандидат должен назвать ситуации, когда обычный Repository и единая модель данных проще и надёжнее.",
  },
  {
    id: "sq-arch-scalability",
    skillId: "senior-arch-scalability",
    grade: "senior",
    topic: "Scalability и Architecture Evolution",
    question:
      "Кодовая база Android-приложения растёт, команда увеличивается, а сборка и внесение изменений становятся всё дороже. Как спроектировать эволюцию архитектуры без полного переписывания? Объясни границы модулей, Dynamic Feature Modules, Lazy Initialization, Configuration Cache, Build Cache, Convention Plugins и роль ADR.",
    rubric:
      "Кандидат должен рассматривать масштабируемость как рост способности кодовой базы, команды и сборочной инфраструктуры поддерживать новые изменения без пропорционального увеличения сложности. Нужно уметь определить архитектурные границы, разделить application, feature и core responsibilities, сократить циклические зависимости и контролировать публичные API модулей. Следует объяснить, когда Dynamic Feature Modules полезны для условной доставки функциональности и почему они не являются универсальной заменой обычным модулям. Нужно понимать Lazy Initialization и Lazy Loading как способы отложить необязательную работу или загрузку ресурсов, но учитывать влияние на первый пользовательский доступ. Кандидат должен знать роль Gradle Configuration Cache, Build Cache, инкрементальной сборки и Convention Plugins; уметь отличать конфигурационную фазу от исполнения задач и объяснить, почему некорректные плагины или build scripts мешают кэшированию. Следует рассмотреть технический долг, миграцию поэтапно, совместимость модулей и стоимость изменений. ADR должен фиксировать контекст, рассматриваемые варианты, принятое решение и его последствия. Хороший ответ предлагает измеримые критерии успеха: время сборки, количество затронутых модулей, скорость CI, частота конфликтов и стоимость сопровождения. Важно избегать архитектурного переписывания ради абстрактной чистоты.",
  },
  {
    id: "sq-arch-bounded",
    skillId: "senior-arch-bounded",
    grade: "senior",
    topic: "Bounded Context и Context Mapping",
    question:
      "В приложении несколько функциональных областей используют одинаковые термины, но подразумевают разные бизнес-сущности и правила. Как определить Bounded Contexts и построить Context Map? Объясни Shared Kernel, Customer-Supplier, Conformist, Anti-Corruption Layer, Open Host Service и Published Language. Какие признаки указывают на неверно выбранные границы?",
    rubric:
      "Кандидат должен объяснить Bounded Context как границу, внутри которой модель и термины имеют однозначный смысл, а Ubiquitous Language согласован между разработчиками и бизнес-экспертами. Нужно уметь определять границы по бизнес-правилам, инвариантам, ответственности команд и характеру изменений, а не только по техническим компонентам. Следует объяснить Context Map и отношения между контекстами: Shared Kernel требует совместного управления общим подмножеством модели; Customer-Supplier описывает зависимость потребителя от поставщика; Conformist предполагает принятие модели upstream-контекста; Anti-Corruption Layer преобразует внешний контракт в собственную модель; Open Host Service предоставляет стабильный интерфейс; Published Language задаёт опубликованный формат интеграции. Нужно понимать Separate Ways как осознанный отказ от интеграции, когда стоимость связи выше пользы. Хороший ответ рассматривает признаки неправильного разбиения: постоянные изменения сразу в нескольких контекстах, протекание внутренних моделей, частые циклические зависимости, дублирование бизнес-правил и слишком широкие shared-модули. Кандидат должен объяснить эволюцию границ, версионирование контрактов и интеграцию через API или события без навязывания единой модели всем областям.",
  },

  // ============================
  // Senior: Data Layer
  // ============================
  {
    id: "sq-data-room",
    skillId: "senior-data-room",
    grade: "senior",
    topic: "Room Internals",
    question:
      "Как Room преобразует DAO и Entity в работающий слой доступа к SQLite? Объясни роль Room Compiler, KSP, сгенерированных DAO implementation, RoomDatabase и InvalidationTracker. Как устроено обновление Flow после изменения таблиц и где могут возникать проблемы производительности?",
    rubric:
      "Кандидат должен объяснить, что Room Compiler анализирует Entity, DAO и SQL-аннотации на этапе компиляции, проверяет запросы и генерирует реализации DAO и Database. Нужно понимать использование KSP или других поддерживаемых механизмов обработки аннотаций в зависимости от конфигурации проекта. Следует объяснить, что сгенерированный DAO-код связывает типизированные методы с SQLite-операциями, а RoomDatabase управляет конфигурацией базы, соединениями, executor/coroutine integration и транзакциями. Кандидат должен понимать роль InvalidationTracker: отслеживание изменений таблиц позволяет реактивным запросам Flow повторно выполняться при invalidation соответствующих таблиц. Важно объяснить, что invalidation может быть шире фактически изменившихся строк, поэтому частые записи и запросы способны вызывать лишние обновления. Нужно рассмотреть выполнение DAO-запросов, connection management, многопоточный доступ, транзакции и влияние индексов на производительность. Хороший ответ предлагает анализ generated code, EXPLAIN QUERY PLAN, tracing и измерение времени запросов, объясняет schema validation и миграции. Следует различать стабильные публичные гарантии Room и внутреннюю реализацию InvalidationTracker или connection management, которая может изменяться между версиями.",
  },
  {
    id: "sq-data-query",
    skillId: "senior-data-query",
    grade: "senior",
    topic: "SQLite Query Optimization",
    question:
      "В production SQLite-запрос начинает занимать сотни миллисекунд на больших объёмах данных. Как провести диагностику и оптимизацию? Объясни EXPLAIN QUERY PLAN, full table scan, composite и covering indexes, порядок колонок в индексе, JOIN, CTE, WAL и массовые транзакции.",
    rubric:
      "Кандидат должен описать процесс оптимизации от воспроизводимого набора данных и измерения до анализа плана выполнения. Нужно понимать назначение EXPLAIN QUERY PLAN, различия SCAN и SEARCH, использование индексов и признаки полного сканирования таблицы. Следует объяснить single-column, composite, covering и partial indexes, важность порядка колонок в составном индексе с учётом фильтрации и сортировки, а также цену индексов при INSERT/UPDATE/DELETE. Кандидат должен разбираться в оптимизации JOIN, подзапросов и CTE, уметь объяснить проблему N+1 и необходимость пакетного получения связанных данных. Следует рассмотреть FTS для полнотекстового поиска и отличие его применения от обычного LIKE. Нужно понимать транзакции, WAL и journal modes, batch operations и почему группировка массовых INSERT/UPDATE в транзакцию может значительно уменьшить накладные расходы. Хороший ответ учитывает реальную селективность данных, размер таблиц, стоимость сортировки, объём возвращаемых колонок и конкуренцию чтения/записи. Кандидат должен подтверждать улучшение измерениями на данных, близких к production, а не добавлять индексы без анализа.",
  },
  {
    id: "sq-data-multi",
    skillId: "senior-data-multi",
    grade: "senior",
    topic: "Multi-source Data Architecture",
    question:
      "Спроектируй слой данных приложения, который получает информацию из локальной базы, удалённого API, файлового кэша и realtime-источника. Как определить Source of Truth, приоритет источников, актуальность данных и поведение при частичной недоступности? Как избежать противоречивых результатов?",
    rubric:
      "Кандидат должен начать с определения семантики каждого источника: авторитетность, актуальность, полнота, доступность и стоимость обращения. Нужно понимать Source of Truth как явно определённый источник истины для конкретного типа данных или операции, а не автоматически назначать один источник главным для всей системы. Следует объяснить стратегии приоритетов, объединения результатов и fallback: локальная база может обеспечивать немедленное чтение, remote source — обновление, realtime — сигнализировать об изменении, но каждое значение должно иметь понятное происхождение и версию. Кандидат должен рассмотреть метаданные актуальности, timestamps/versions, ETag, checkpoints, cache invalidation и конфликты между источниками. Нужно объяснить обработку частично доступных источников, деградацию функциональности, частичный успех и восстановление после сбоя. Хороший ответ предлагает модель, при которой Repository или orchestration layer явно определяет правила объединения, маппинг и приоритеты, а UI не принимает архитектурных решений о достоверности данных. Следует рассмотреть тестирование комбинаций доступности источников, наблюдаемость, логирование причин fallback и возможность воспроизвести проблему. Важно не маскировать конфликтующие данные простым выбором «последнего ответа», если порядок обновления не гарантирует актуальность.",
  },
  {
    id: "sq-data-sync",
    skillId: "senior-data-sync",
    grade: "senior",
    topic: "Synchronization Engines",
    question:
      "Спроектируй Sync Engine для мобильного приложения с локальной базой, несколькими устройствами, realtime-обновлениями и нестабильной сетью. Как объединить polling, push notifications, WebSocket, full/incremental/delta synchronization, outbox/inbox, checkpoints, idempotency и conflict resolution? Когда следует рассмотреть CRDT или Operational Transformation?",
    rubric:
      "Кандидат должен предложить архитектуру синхронизации с чётким разделением входящего и исходящего потоков изменений. Нужно объяснить polling как периодическое обнаружение обновлений, push notifications и WebSocket как сигналы или realtime-каналы, которые могут ускорять обнаружение, но не должны быть единственным надёжным механизмом восстановления состояния. Следует различать full, incremental и delta synchronization, cursor/checkpoint management и возможность продолжить синхронизацию после сбоя. Outbox хранит исходящие изменения устойчиво, Inbox или deduplication storage помогает распознавать повторно доставленные входящие сообщения. Кандидат должен объяснить idempotency, event ordering, retry/backoff, acknowledgements и обработку частичного успеха. Нужно рассмотреть optimistic concurrency control и бизнес-правила разрешения конфликтов. CRDT подходят для определённых типов данных и операций, где можно формально определить сходимость реплик, но требуют подходящей модели данных и дополнительных метаданных. Operational Transformation применяет преобразование конкурентных операций и чаще рассматривается для совместного редактирования с определённой семантикой операций. Хороший ответ объясняет стоимость этих подходов, согласованность при offline-изменениях, удаление сущностей, replay операций и восстановление после потери checkpoint. Важно выбирать модель синхронизации под предметную область, а не использовать CRDT или OT как универсальную замену конфликт-резолюции.",
  },

  // ============================
  // Senior: Networking
  // ============================
  {
    id: "sq-networking-http2",
    skillId: "senior-networking-http2",
    grade: "senior",
    topic: "HTTP/2 Internals",
    question:
      "Как HTTP/2 организует передачу нескольких запросов по одному соединению? Объясни binary framing, streams и frames, multiplexing, HPACK, flow control на уровне stream и connection, WINDOW_UPDATE, ALPN и ограничения HTTP/2 поверх TCP. Как эти механизмы влияют на мобильный клиент?",
    rubric:
      "Кандидат должен объяснить HTTP/2 как бинарный протокол с фреймированием, где один TCP connection может содержать несколько логических streams. Нужно понимать назначение stream ID и основных типов frames, а также multiplexing, позволяющий чередовать данные нескольких запросов в одном соединении. Следует объяснить HPACK и сжатие заголовков, включая контекст состояния таблиц и компромиссы безопасности. Кандидат должен различать flow control на уровне отдельного stream и всего connection, понимать роль WINDOW_UPDATE и влияние медленного consumer на доступность окна передачи. Нужно знать назначение ALPN при согласовании протокола поверх TLS и понимать, что серверное push в HTTP/2 в современной веб-экосистеме имеет ограниченное применение и не является универсальной оптимизацией. Важно объяснить, что HTTP/2 устраняет прикладной head-of-line blocking между потоками на уровне HTTP-мультиплексирования, но потоки по-прежнему используют один TCP connection и могут испытывать транспортный head-of-line blocking при потере TCP-сегмента. Хороший ответ рассматривает connection reuse, поведение на мобильных сетях, влияние потери пакетов, настройки OkHttp/сетевого стека и диагностику negotiated protocol. Кандидат должен понимать, что фактическая поддержка и поведение зависят от сервера, TLS, клиента и сетевой инфраструктуры.",
  },
  {
    id: "sq-networking-http3",
    skillId: "senior-networking-http3",
    grade: "senior",
    topic: "HTTP/3 и QUIC",
    question:
      "Чем HTTP/3 поверх QUIC отличается от HTTP/2 поверх TCP? Объясни установление соединения с TLS 1.3, independent streams, Connection ID, migration, QPACK, congestion control и 0-RTT. Какие особенности HTTP/3 важны для мобильных сетей и как оценить поддержку на Android?",
    rubric:
      "Кандидат должен объяснить, что HTTP/3 использует QUIC поверх UDP, а QUIC реализует надёжную передачу, шифрование на основе TLS 1.3, управление потоками и контроль перегрузки на транспортном уровне. Нужно понимать, что независимые QUIC streams устраняют TCP-level head-of-line blocking между потоками, хотя внутри одного потока порядок данных сохраняется. Следует объяснить Connection ID и connection migration: соединение может сохраняться при изменении сетевого пути или адреса клиента при соблюдении условий протокола. Нужно знать назначение QPACK как механизма сжатия заголовков, учитывающего мультиплексирование и блокировки между потоками, а также принципы congestion control и packet loss recovery. Кандидат должен объяснить 0-RTT и риск replay для ранних данных, поэтому небезопасно отправлять в таком режиме операции с побочными эффектами без соответствующих гарантий идемпотентности. Следует сравнить HTTP/2 и HTTP/3 по latency, устойчивости при смене сетей и поведению при потере пакетов, не утверждая, что HTTP/3 всегда быстрее. Хороший ответ учитывает UDP-блокировки в сетях, fallback на TCP-based протоколы, поддержку HTTP/3 в используемом Android network stack и клиентских библиотеках, а также способы диагностики negotiated protocol.",
  },
  {
    id: "sq-networking-grpc",
    skillId: "senior-networking-grpc",
    grade: "senior",
    topic: "gRPC",
    question:
      "Спроектируй gRPC-клиент для Android-приложения, который поддерживает unary и streaming RPC, авторизацию, deadlines, отмену и нестабильное мобильное соединение. Как устроен gRPC поверх HTTP/2, какую роль играют Protocol Buffers, ManagedChannel, interceptors, metadata и flow control?",
    rubric:
      "Кандидат должен объяснить архитектуру gRPC: контракт сервиса задаётся в .proto, а клиентские и серверные API могут генерироваться из описаний сообщений и методов. Нужно различать Unary, Server Streaming, Client Streaming и Bidirectional Streaming RPC. Следует объяснить, что gRPC использует HTTP/2 для транспорта и protobuf для компактного бинарного представления сообщений, а ManagedChannel управляет соединением и вызовами. Кандидат должен понимать deadlines как ограничение времени операции, cancellation как прекращение ненужного вызова, interceptors и metadata для авторизации, tracing и передачи контекста. Нужно знать gRPC status codes и отделять транспортные сбои от прикладных ошибок. Важны flow control и backpressure при streaming, корректная обработка медленного consumer и управление памятью. Хороший ответ рассматривает TLS/mTLS, reconnect, состояние долгоживущих каналов, повторные вызовы, retry policies и идемпотентность. Следует учитывать ограничения мобильной сети: смена соединения, sleep/background, нестабильный NAT, ограниченный канал и необходимость восстановления состояния после reconnect. Кандидат должен объяснить, почему повторный вызов не всегда безопасен и почему retry должен учитывать тип операции и server-side semantics.",
  },
  {
    id: "sq-networking-tls",
    skillId: "senior-networking-tls",
    grade: "senior",
    topic: "TLS Internals",
    question:
      "Разбери TLS handshake для TLS 1.2 и TLS 1.3. Как формируются ключи сессии, проверяется сертификат сервера и достигается forward secrecy? Объясни SNI, ALPN, session resumption, 0-RTT, OCSP и mTLS. Как диагностировать handshake failure на мобильном устройстве?",
    rubric:
      "Кандидат должен описать основные этапы TLS handshake и различия TLS 1.2 и TLS 1.3, включая упрощённую структуру обмена и сокращение числа round trips в TLS 1.3. Нужно понимать назначение ClientHello и ServerHello, согласование параметров, сертификат сервера, CertificateVerify и derivation session keys через выбранный key exchange. Следует объяснить forward secrecy и роль ephemeral Diffie-Hellman key exchange, а также то, почему простое использование сертификата не означает forward secrecy само по себе. Кандидат должен знать назначение cipher suites, SNI для выбора сертификата/виртуального хоста, ALPN для согласования прикладного протокола и session resumption для сокращения повторных handshake. Нужно объяснить 0-RTT в TLS 1.3 и replay risk для ранних данных, назначение OCSP и ограничения проверки отзыва сертификатов. mTLS предполагает проверку клиентского сертификата сервером. Хороший ответ рассматривает certificate chain validation, hostname verification, trust store, несовместимые cipher/protocol configurations, время на устройстве, прокси и особенности сетевых стеков. Следует уметь локализовать handshake failure через системные логи, сетевой trace и проверку серверного TLS-конфига. Важно не предлагать отключение проверки сертификатов как способ устранения проблемы.",
  },
  {
    id: "sq-networking-cert",
    skillId: "senior-networking-cert",
    grade: "senior",
    topic: "Certificate Management",
    question:
      "Спроектируй жизненный цикл сертификатов для мобильного приложения и серверной инфраструктуры с требованиями к высокой доступности и mTLS. Как организовать PKI, trust stores, выпуск, ротацию, отзыв и мониторинг истечения сертификатов? Как действовать при компрометации приватного ключа?",
    rubric:
      "Кандидат должен объяснить основы PKI и роли Certificate Authority, Root CA и Intermediate CA. Нужно понимать построение и валидацию certificate chain, trust stores на клиенте и сервере, назначение server и client certificates. Следует описать lifecycle: генерация ключевой пары, выпуск сертификата, распространение доверия, контроль срока действия, ротация и отзыв. Кандидат должен различать CRL и OCSP как механизмы распространения информации об отзыве и понимать ограничения их доступности и кэширования. Для mTLS необходимо рассмотреть выдачу клиентских сертификатов, безопасное хранение закрытого ключа, аутентификацию клиента и процесс отзыва скомпрометированных credentials. Нужно понимать Certificate Pinning и управление pin sets, резервные pins и риски массового отказа старых клиентов после смены сертификата. Следует рассмотреть Certificate Transparency для мониторинга публично выпущенных сертификатов, где применимо. Хороший ответ предлагает мониторинг expiration, автоматизированную ротацию, staged rollout, rollback и аварийный план при компрометации ключа: отзыв, перевыпуск, блокировка старых credentials и оценка затронутых клиентов. Важно учитывать длительный срок жизни мобильных клиентов: обновление доверенных сертификатов не всегда происходит одновременно с обновлением сервера.",
  },

  // ============================
  // Senior: Dependency Injection
  // ============================
  {
    id: "sq-di-dagger",
    skillId: "senior-di-dagger",
    grade: "senior",
    topic: "Dagger Internals",
    question:
      "Как Dagger Compiler преобразует описание DI-графа в исполняемый код? Объясни binding resolution, генерацию Factory и MembersInjector, component hierarchy, scoped bindings, DoubleCheck, multibindings и assisted injection. Как диагностировать и оптимизировать большие графы зависимостей?",
    rubric:
      "Кандидат должен объяснить compile-time архитектуру Dagger: compiler анализирует binding declarations, строит граф зависимостей, проверяет его корректность и генерирует Java-код реализации компонентов и фабрик. Нужно понимать binding key как сочетание типа и qualifier, различать provision и members injection, а также назначение Component, Subcomponent и component dependencies. Следует объяснить, как Dagger генерирует Factory и MembersInjector, как работают scoped bindings и почему scoped instance привязан к жизненному циклу соответствующего компонента. Кандидат должен понимать роль DoubleCheck или аналогичного механизма double-checked provider для ленивого безопасного создания scoped объектов. Нужно знать multibindings для объединения нескольких реализаций в Set или Map и assisted injection для сочетания DI-зависимостей с runtime-параметрами. Следует уметь диагностировать missing/duplicate bindings, циклические зависимости, ошибки qualifier и scope mismatch. Хороший ответ рассматривает размер графа, стоимость генерации, количество модулей и влияние DI на время сборки и startup. Важно отличать generated implementation от публичных гарантий Dagger и не строить архитектуру на предположении о конкретном внутреннем имени или алгоритме фабрики.",
  },
  {
    id: "sq-di-graph",
    skillId: "senior-di-graph",
    grade: "senior",
    topic: "Dependency Graph Resolution",
    question:
      "В большом приложении DI-граф содержит циклические зависимости, неоднозначные bindings, чрезмерное создание объектов и конфликтующие scopes. Как системно диагностировать и переработать граф? Объясни binding keys, qualifiers, Provider, Lazy, assisted injection, multibindings и optional bindings.",
    rubric:
      "Кандидат должен объяснить граф зависимостей как ориентированный граф объектов и bindings, где узлы представляют зависимости, а рёбра — необходимость создания одного объекта через другой. Нужно понимать binding key и роль qualifier: один тип может иметь несколько bindings, но выбор должен быть однозначным. Следует различать missing binding, duplicate binding, dependency cycle и scope mismatch и объяснить способы диагностики каждого случая через сообщения compiler. Кандидат должен знать назначение Provider<T> и Lazy<T> для отложенного получения зависимостей, но понимать, что они не являются автоматическим исправлением неправильной архитектуры или цикла. Нужно рассмотреть assisted injection для runtime-параметров, multibindings для коллекций реализаций и optional bindings для условной доступности зависимости. Важно объяснить, как scope влияет на повторное использование объектов и почему долгоживущая зависимость не должна удерживать короткоживущие ресурсы без необходимости. Хороший ответ предлагает рефакторинг циклов через пересмотр ответственности, events/callback contracts или разделение компонентов, оценивает избыточное создание объектов и тестирует граф отдельно. Следует учитывать границы модулей и не превращать DI-контейнер в место размещения бизнес-логики.",
  },
  {
    id: "sq-di-scopes",
    skillId: "senior-di-scopes",
    grade: "senior",
    topic: "Scopes и Component Lifecycle Advanced",
    question:
      "Спроектируй иерархию DI-компонентов для приложения с application-, session-, activity-, feature- и screen-level зависимостями. Как связать scopes с реальным lifecycle Android-компонентов, корректно освобождать ресурсы и избежать утечек при пересоздании Activity или завершении пользовательской сессии?",
    rubric:
      "Кандидат должен объяснить, что scope определяет повторное использование экземпляра в рамках компонента, а фактическое время жизни зависит от создания и уничтожения самого компонента. Нужно предложить иерархию parent/child components, понимать наследование доступности зависимостей и ограничения scope при переходах между уровнями. Следует объяснить связь application-level объектов с процессом приложения, activity-level — с Activity, retained/session-level — с соответствующим владельцем жизненного цикла, screen-level — с ViewModel или отдельным компонентом экрана. Кандидат должен учитывать, что Configuration Change может пересоздать Activity, но некоторые retained-области сохраняются, тогда как Process Death уничтожает весь процесс и его DI-граф. Нужно понимать, как release scoped instances происходит через освобождение ссылки на компонент и почему долгоживущие объекты могут удерживать Activity, View, callback или coroutine scope. Следует рассмотреть пользовательские scopes, межмодульные границы, thread safety scoped objects и тестирование переходов жизненного цикла. Хороший ответ объясняет, как завершить session scope при logout, корректно отменить фоновые операции и очистить чувствительные ресурсы, а также почему нельзя рассчитывать на гарантированный вызов отдельных UI callback для освобождения всех объектов.",
  },

  // ============================
  // Senior: Performance
  // ============================
  {
    id: "sq-perf-anr",
    skillId: "senior-perf-anr",
    grade: "senior",
    topic: "ANR Diagnostics",
    question:
      "В production-приложении выросло количество ANR, но проблема воспроизводится не на всех устройствах. Как организовать диагностику от системного ANR report до первопричины? Объясни типы ANR, input dispatching timeout, broadcast/service/provider timeout, thread contention, Binder calls, deadlocks, StrictMode и ApplicationExitInfo.",
    rubric:
      "Кандидат должен объяснить ANR как превышение системно заданного времени реакции в определённых сценариях, а не просто любое зависание интерфейса. Нужно различать input dispatching timeout и таймауты обработки BroadcastReceiver, Service и ContentProvider. Следует уметь анализировать ANR traces и thread stacks, определять, заблокирован ли Main Thread на I/O, monitor lock, Binder call, CPU-intensive операции или ожидание другого потока. Кандидат должен понимать deadlock, lock contention и цепочки зависимостей между потоками, а также риск синхронного IPC на главном потоке. Нужно знать назначение StrictMode для обнаружения потенциально опасных операций на UI thread и ApplicationExitInfo для получения системной информации о причинах завершения процесса и доступных диагностических данных. Следует объяснить использование Perfetto/System Trace для анализа scheduling и длительных участков выполнения. Хороший ответ включает стратегию production-диагностики: группировка ANR по типу и версии, сопоставление stack traces, сбор безопасного контекста, корреляция с устройствами и условиями, исправление и проверка. Важно не ограничиваться увеличением timeout или переносом всех операций в IO, а определить конкретную блокировку и устранить её на архитектурном уровне.",
  },
  {
    id: "sq-perf-framemetrics",
    skillId: "senior-perf-framemetrics",
    grade: "senior",
    topic: "FrameMetrics и Rendering Pipeline",
    question:
      "Как измерить и локализовать задержки отрисовки Android UI на уровне конкретного кадра? Объясни FrameMetrics, FrameTimeline, VSync, Choreographer, RenderThread, GPU stages и SurfaceFlinger. Как отличить CPU bottleneck от GPU bottleneck и input latency?",
    rubric:
      "Кандидат должен объяснить frame rendering pipeline и временной бюджет кадра с учётом частоты обновления дисплея. Нужно понимать назначение VSync и Choreographer, связь UI Thread с подготовкой кадра, RenderThread с обработкой графических команд и GPU с выполнением рендеринга. Следует объяснить FrameMetrics для анализа временных составляющих кадра, FrameTimeline и Perfetto для сопоставления фактического и ожидаемого времени кадров, а также роль SurfaceFlinger в композиции слоёв. Кандидат должен различать CPU bottleneck, например долгий measure/layout/draw или блокировку UI Thread, GPU bottleneck, например тяжёлые графические операции, и input latency, связанную с задержкой обработки пользовательского ввода. Нужно понимать overdraw, refresh rate, missed frames и baseline frame time. Хороший ответ строит диагностику на trace и профилировании, рассматривает View и Compose отдельно, проверяет scrolling и animations и подтверждает эффект после оптимизации. Важно не считать факт превышения 16 мс универсальным критерием для всех устройств: frame budget зависит от refresh rate, а метрики следует интерпретировать с учётом конкретного устройства и pipeline.",
  },
  {
    id: "sq-perf-memory",
    skillId: "senior-perf-memory",
    grade: "senior",
    topic: "Advanced Memory Profiling",
    question:
      "Приложение периодически получает memory pressure и завершает работу на части устройств. Как провести глубокий анализ памяти Android-процесса? Объясни различия Java/Kotlin Heap и Native Heap, PSS/RSS/USS, HPROF, dominator tree, GC roots, allocation tracking, bitmap memory и memory pressure.",
    rubric:
      "Кандидат должен объяснить различия Java/Kotlin Heap, где хранятся managed objects, и Native Heap, используемый native-кодом и некоторыми платформенными ресурсами. Нужно различать RSS как объём резидентных страниц процесса, PSS как пропорционально учитываемую долю shared pages и USS как private resident memory. Следует понимать назначение heap dump/HPROF, shallow и retained size, dominator tree, GC roots и object reachability при поиске удерживаемых объектов. Кандидат должен объяснить allocation tracking и анализ частых аллокаций, а также влияние GC на latency и потребление CPU. Важно учитывать bitmap/graphics memory, native allocations и то, что не всё потребление памяти отражается в Java heap. Нужно знать назначение LeakCanary и понимать границы его диагностики относительно native memory и системного graphics memory. Хороший ответ описывает сбор данных, воспроизведение memory pressure, анализ heap и native allocations, проверку удерживаемых объектов, сопоставление с ApplicationExitInfo и production-метриками. Следует объяснить оптимизацию памяти в условиях ограниченного бюджета, включая размеры кэшей, обработку изображений, пулы объектов и корректное освобождение ресурсов. Кандидат должен отличать утечку от высокого, но ограниченного потребления памяти и нормальной работы GC.",
  },
  {
    id: "sq-perf-battery",
    skillId: "senior-perf-battery",
    grade: "senior",
    topic: "Battery и Power Optimization",
    question:
      "Приложение активно синхронизирует данные в background и расходует больше энергии, чем ожидается. Как провести power investigation и перепроектировать фоновые задачи? Объясни Doze, App Standby Buckets, WakeLock, JobScheduler, WorkManager, AlarmManager, batching сетевых запросов и Battery Historian.",
    rubric:
      "Кандидат должен объяснить, что энергопотребление Android зависит от CPU, радиомодулей, экрана, пробуждений устройства, датчиков и фоновой активности. Нужно понимать ограничения Doze и App Standby Buckets и то, что система может откладывать фоновые задачи и сетевую активность. Следует различать partial и full WakeLock, объяснить риск удержания WakeLock дольше необходимого и необходимость ограничивать его время жизни. Кандидат должен сравнить JobScheduler и WorkManager для отложенных операций, AlarmManager для сценариев, где важна временная точность, и учитывать ограничения exact alarms и background execution. Нужно рассмотреть batching запросов, уменьшение частоты polling, объединение операций, использование push-сигналов и адаптивную синхронизацию. Хороший ответ включает Battery Historian, Energy Profiler и Perfetto power traces, а также методику измерения энергопотребления на сопоставимом устройстве и сценарии. Важно найти баланс между актуальностью данных, временем реакции и расходом энергии, а не просто увеличивать интервалы всех фоновых задач. Следует учитывать, что Foreground Service не является способом обхода системных ограничений энергопотребления.",
  },

  // ============================
  // Senior: Testing
  // ============================
  {
    id: "sq-test-contract",
    skillId: "senior-test-contract",
    grade: "senior",
    topic: "Contract Testing",
    question:
      "В мобильном приложении и backend API разрабатываются независимыми командами. Как организовать Contract Testing, чтобы обнаруживать несовместимые изменения до релиза? Объясни Consumer-Driven Contracts, Pact, Provider Verification, contract versioning и роль OpenAPI.",
    rubric:
      "Кандидат должен объяснить Contract Testing как проверку соглашения между потребителем и поставщиком интерфейса, дополняющую unit и integration tests. Нужно различать consumer и provider, понимать Consumer-Driven Contract Testing: потребитель фиксирует ожидаемые взаимодействия, а поставщик проверяет, что его реализация удовлетворяет контракту. Следует объяснить роль Pact: consumer tests формируют контракт, provider verification проверяет его на стороне сервера, а опубликованные контракты позволяют сопоставлять версии потребителей и поставщиков. Кандидат должен понимать versioning, backward compatibility и breaking changes API, а также роль OpenAPI в описании HTTP-контрактов и автоматической валидации схем. Нужно рассмотреть stub servers для локальной разработки и тестов, управление контрактами в CI и правила, при которых релиз не должен продвигаться при нарушении критического контракта. Хороший ответ применяет подход к Android API client: проверяет структуру JSON, status codes, headers, optional/nullable fields и сценарии ошибок, но не пытается заменить контрактными тестами реальные end-to-end проверки. Следует объяснить ограничения: контракт подтверждает согласованный формат взаимодействия, но не гарантирует бизнес-корректность и производительность системы.",
  },
  {
    id: "sq-test-integration",
    skillId: "senior-test-integration",
    grade: "senior",
    topic: "Integration Testing Advanced",
    question:
      "Спроектируй интеграционную стратегию тестирования большого Android-приложения с Room, Retrofit, Coroutines, DI и несколькими feature-модулями. Как определить границы интеграционных тестов, обеспечить изоляцию окружения и устранить flaky tests при параллельном запуске в CI?",
    rubric:
      "Кандидат должен объяснить назначение integration tests как проверки взаимодействия нескольких реальных компонентов, отличая их от unit и end-to-end тестов. Нужно определить набор важных границ: Repository + Data Sources, Room + migrations, Retrofit/OkHttp + HTTP server, Coroutine/Flow integration, DI graph, Android lifecycle и межмодульные контракты. Следует объяснить применение in-memory Room для тестирования DAO, MockWebServer для HTTP-сценариев и тестовых DI-конфигураций для Hilt/Dagger. Кандидат должен понимать управление test fixtures, подготовку данных, изоляцию базы, сети, файлов и системных ресурсов. Важно рассмотреть параллельное выполнение: уникальные database names, порты, временные директории, изоляцию состояния singleton и независимые test accounts. Нужно объяснить причины flaky tests: реальные задержки, неуправляемое время, гонки, внешняя сеть, shared state, порядок тестов и зависимость от окружения. Хороший ответ предлагает детерминированные dispatcher/scheduler, controllable test server, повторяемые fixtures, CI reports и отдельное управление нестабильными тестами без маскировки реальных дефектов. Следует описать разумный test pyramid и критерии выбора тестов, которые запускаются на каждом PR, nightly или перед релизом.",
  },
  {
    id: "sq-test-mutation",
    skillId: "senior-test-mutation",
    grade: "senior",
    topic: "Mutation Testing",
    question:
      "Как оценить, действительно ли существующий набор unit-тестов обнаруживает ошибки в бизнес-логике? Объясни Mutation Testing, mutation operators, killed и surviving mutants, equivalent mutants и mutation score. Как внедрить mutation testing в проект с ограниченным временем CI?",
    rubric:
      "Кандидат должен объяснить Mutation Testing как проверку качества тестов путём автоматического внесения небольших изменений в код и проверки, обнаруживают ли существующие тесты эти изменения. Нужно различать mutant, killed mutant и surviving mutant, понимать mutation score как отношение обнаруженных тестами мутантов к релевантным проверяемым мутантам с учётом исключённых эквивалентных. Следует объяснить equivalent mutants: изменения, которые не меняют наблюдаемое поведение в рамках заданного домена, поэтому тесты не обязаны их обнаруживать. Кандидат должен понимать отличие mutation testing от code coverage: покрытие показывает, что участок кода выполнялся, а мутации проверяют способность assertion обнаружить изменение поведения. Нужно знать назначение инструментов вроде PIT/Pitest и ограничения поддержки Kotlin-конструкций, inline, generated code и bytecode transformation. Хороший ответ предлагает выбор критичных модулей, ограничение числа операторов/мутантов, incremental или nightly execution, сохранение отчётов и анализ surviving mutants вручную. Важно учитывать стоимость вычислений и не превращать mutation score в единственную метрику качества тестов.",
  },
  {
    id: "sq-test-snapshot",
    skillId: "senior-test-snapshot",
    grade: "senior",
    topic: "Screenshot и Visual Regression Testing",
    question:
      "Как организовать visual regression testing для Android-приложения с Views и Compose? Объясни golden images, pixel diff, настройку детерминированного окружения, управление эталонами и порогами отличий. Как использовать Paparazzi или Roborazzi и интегрировать screenshot tests в CI без большого количества flaky results?",
    rubric:
      "Кандидат должен объяснить screenshot testing как сравнение фактического изображения UI с эталонным golden image и различать snapshot testing и более широкую стратегию visual regression testing. Нужно понимать назначение Paparazzi, Roborazzi и подходов для Compose, а также ограничения конкретных инструментов и их совместимость с тестируемыми UI-технологиями. Следует объяснить pixel diff, допустимый threshold и причины, по которым слепое повышение порога может скрыть реальные дефекты. Кандидат должен рассмотреть детерминированность окружения: фиксированные размеры и density, системные шрифты, font scale, тему, locale, время, анимации, сетевые данные и состояние компонентов. Нужно знать, как тестировать разные размеры экранов, light/dark themes и accessibility-сценарии, а также управлять обновлением golden files через review process. Хороший ответ включает CI-интеграцию, артефакты diff, локальное воспроизведение, baseline ownership и стратегию обновления эталонов при намеренных изменениях дизайна. Важно объяснить, что screenshot tests дополняют функциональные UI-тесты, но не заменяют проверку взаимодействия, accessibility и поведения на реальном устройстве.",
  },

  // ============================
  // Senior: CI/CD
  // ============================
  {
    id: "sq-cicd-github",
    skillId: "senior-cicd-github",
    grade: "senior",
    topic: "Advanced CI/CD и GitHub Actions",
    question:
      "Спроектируй GitHub Actions pipeline для крупного Android/Kotlin-проекта с несколькими targets, параллельными тестами, анализом качества, сборкой артефактов и автоматизированными релизами. Как организовать reusable workflows, matrix builds, caching, self-hosted runners, секреты, OIDC, concurrency и защиту supply chain?",
    rubric:
      "Кандидат должен предложить pipeline с разделением этапов проверки, тестирования, сборки, публикации артефактов и релиза. Нужно понимать модель GitHub Actions: workflow, jobs, steps, dependencies, matrix builds, reusable workflows и composite actions, а также выбирать уровень переиспользования в зависимости от общей ответственности. Следует объяснить использование Gradle dependency/build cache и configuration cache, правильную изоляцию cache keys, artifact retention и передачу результатов между jobs. Кандидат должен рассмотреть self-hosted runners: контроль окружения и производительности против требований к обновлению, изоляции, безопасности и очистке runner после выполнения. Важно понимать GitHub Secrets, permissions для GITHUB_TOKEN, минимально необходимые права, OIDC и short-lived credentials вместо долгоживущих ключей там, где поддерживается. Нужно знать concurrency groups для отмены или сериализации конфликтующих запусков, environments и approvals для защищённых deployment stages. Хороший ответ включает защиту цепочки поставки: pinning actions на commit SHA, контроль сторонних actions, ограничение permissions, dependency scanning, сохранение provenance и защита signing credentials. Следует описать оптимизацию параллельности, отчёты тестов и coverage, flaky pipeline diagnostics и правила promotion артефакта между окружениями без повторной несогласованной сборки.",
  },
  {
    id: "sq-cicd-fastlane",
    skillId: "senior-cicd-fastlane",
    grade: "senior",
    topic: "Fastlane Advanced",
    question:
      "Как организовать Fastlane как часть production release pipeline Android-приложения? Объясни структуру Fastfile, lanes, shared configuration, интеграцию с Gradle и Google Play/Firebase App Distribution, управление signing credentials и идемпотентность повторного запуска релизной операции.",
    rubric:
      "Кандидат должен объяснить Fastlane как средство автоматизации release-процессов, а не замену Gradle или CI orchestrator. Нужно знать назначение Fastfile, lane, private lanes, shared configuration и переменных окружения. Следует описать интеграцию с Gradle tasks для сборки конкретных variants, получение versionCode/versionName, подготовку release notes и выбор артефактов. Нужно понимать загрузку в Google Play через соответствующие actions/API, публикацию в Firebase App Distribution, управление tester groups и распределение dev/QA/release сборок. Важно объяснить безопасное хранение keystore, passwords и service account credentials через защищённые CI secrets или краткоживущие credentials, не записывая их в репозиторий и build logs. Кандидат должен рассмотреть несколько flavors/variants, обработку ошибок частичной публикации, повторные запуски и защиту от дублирования релизов. Хороший ответ объясняет идемпотентность через проверку версии и состояния релиза, раздельные lanes для build/test/distribute/promote и прозрачное логирование. Следует понимать, что повторный запуск публикации должен быть безопасным и не приводить к неожиданному продвижению версии или перезаписи артефактов.",
  },
  {
    id: "sq-cicd-firebase",
    skillId: "senior-cicd-firebase",
    grade: "senior",
    topic: "Firebase App Distribution",
    question:
      "Спроектируй распространение dev, QA и release-candidate сборок Android-приложения через Firebase App Distribution. Как управлять tester groups, версиями, release notes, доступом, артефактами и публикацией через Fastlane/GitHub Actions? Как обеспечить воспроизводимость и контроль тестовых релизов?",
    rubric:
      "Кандидат должен объяснить назначение Firebase App Distribution как канала доставки тестовых сборок определённым группам тестировщиков. Нужно понимать публикацию поддерживаемых артефактов, управление release metadata, tester groups, invitations и доступом. Следует описать автоматизацию через Firebase CLI или Fastlane и интеграцию с GitHub Actions: сборка нужного variant, загрузка, release notes, выбор групп тестеров и сохранение идентификатора релиза. Кандидат должен учитывать разные каналы dev/QA/release candidate, версионирование, повторные публикации и связь сборки с конкретным commit SHA. Важно объяснить управление credentials через secrets/OIDC или защищённые service account credentials с минимальными правами. Нужно рассмотреть хранение артефактов и срок их доступности, обратную связь от тестеров и воспроизводимость дефектов. Хороший ответ предлагает процесс promotion: один и тот же проверенный бинарный артефакт должен быть идентифицируем и связан с тестовой проверкой, а не пересобираться без необходимости перед дальнейшим продвижением. Следует сравнить App Distribution с внутренними каналами Google Play и другими способами доставки, учитывая удобство, аудиторию и контроль доступа.",
  },
  {
    id: "sq-cicd-play",
    skillId: "senior-cicd-play",
    grade: "senior",
    topic: "Google Play Publishing",
    question:
      "Спроектируй полный релизный процесс Android-приложения через Google Play: от подписи и загрузки до staged rollout, мониторинга Android Vitals и остановки публикации при деградации качества. Объясни Play App Signing, upload key, app signing key, tracks, Developer API, pre-launch reports и стратегию rollback/hotfix.",
    rubric:
      "Кандидат должен объяснить различие Upload Key и App Signing Key в модели Play App Signing: upload key используется для аутентифицированной загрузки пакета, а Google Play управляет ключом подписи распространяемых APK в рамках соответствующей схемы. Нужно понимать internal, closed, open testing и production tracks, продвижение релиза между tracks и назначение staged rollout для постепенного увеличения аудитории. Следует объяснить управление versionCode/versionName, локализацию release notes, Google Play Developer API и автоматизацию публикации через CI. Кандидат должен понимать роль pre-launch reports, Android Vitals и production metrics: crashes, ANRs, startup и другие показатели качества. Важно учитывать актуальные требования Google Play к target API, Data Safety и декларациям приложения, не воспринимая их как разовую настройку. Хороший ответ предлагает release gates, проверку подписи и артефактов, минимальные permissions service account, staged rollout с критериями остановки, мониторинг после расширения аудитории и процедуру rollback или hotfix. Нужно понимать, что rollback в Google Play не всегда означает мгновенное возвращение старой версии всем пользователям: стратегия зависит от состояния rollout и уже установленных версий. Следует описать контроль доступа, аудит действий и защиту ключей подписи.",
  },

  // ============================
  // Senior: Security
  // ============================
  {
    id: "sq-security-owasp",
    skillId: "senior-security-owasp",
    grade: "senior",
    topic: "OWASP Mobile Security",
    question:
      "Как построить процесс security verification Android-приложения на основе OWASP MASVS и MASTG? Объясни threat modeling, определение security requirements, выбор verification level и сочетание SAST, DAST, dependency scanning, static/dynamic analysis. Как приоритизировать найденные уязвимости?",
    rubric:
      "Кандидат должен объяснить назначение OWASP MASVS как стандарта требований к безопасности мобильных приложений, MASTG как руководства по тестированию и MASWE как классификации слабых мест. Нужно показать процесс threat modeling: определение активов, границ доверия, субъектов угроз, attack surface и сценариев злоупотребления. Следует объяснить, как требования безопасности связываются с категорией данных, моделью угроз и verification level, а не применяются одинаково ко всем приложениям. Кандидат должен различать SAST для анализа исходного/скомпилированного кода, DAST для проверки работающего приложения и dependency scanning для поиска известных проблем в библиотеках. Нужно рассмотреть secure storage, cryptography, authentication, network communication, platform interaction, code quality, tampering resistance и privacy. Хороший ответ описывает аудит Android-компонентов, exported surface, IPC, WebView, локального хранения, TLS, логирования и резервного копирования. Важно уметь оценить impact, exploitability, likelihood и затронутые активы, приоритизировать исправления и документировать остаточный риск. Кандидат должен предложить security checklist и повторную проверку исправлений, а не ограничиваться формальным соответствием стандарту.",
  },
  {
    id: "sq-security-encryption",
    skillId: "senior-security-encryption",
    grade: "senior",
    topic: "Advanced Cryptography",
    question:
      "Спроектируй криптографическую систему защиты чувствительных локальных данных и сетевых секретов Android-приложения. Как выбрать между AES-GCM, RSA-OAEP, ECC и цифровыми подписями? Объясни HMAC, HKDF, PBKDF2, salt, nonce, key hierarchy, envelope encryption, ротацию ключей и восстановление после потери ключа.",
    rubric:
      "Кандидат должен начать с модели угроз и выбора криптографических примитивов под конкретную задачу, а не с произвольного выбора алгоритма. Нужно объяснить AES-GCM как AEAD для конфиденциальности и аутентификации данных, требования к уникальности nonce для одного ключа и последствия повторного использования. Следует различать RSA-OAEP для асимметричного шифрования подходящих объёмов данных или ключей, ECC для задач асимметричной криптографии и цифровые подписи для проверки подлинности и целостности. Кандидат должен объяснить HMAC как MAC на основе секретного ключа, HKDF для извлечения/производства ключей из подходящего key material и PBKDF2 для password-based key derivation с солью и достаточно дорогими параметрами. Нужно понимать key hierarchy и envelope encryption: data encryption key защищает данные, а ключ шифрования ключей или Android Keystore защищает DEK. Следует рассмотреть secure random generation, ротацию, версионирование ciphertext format, key invalidation/revocation и восстановление после потери ключа. Важно объяснить, что зашифрованные данные могут стать невосстановимыми, если ключ привязан к устройству и не предусмотрен корректный backup/renewal flow. Хороший ответ учитывает side-channel risks, защиту от brute force, хранение ключей отдельно от данных, cryptographic agility и аудит реализации. Кандидат должен отвергать самодельные алгоритмы, ECB для конфиденциальных данных и отключение проверки authentication tag.",
  },
  {
    id: "sq-security-root",
    skillId: "senior-security-root",
    grade: "senior",
    topic: "Root Detection и Device Integrity",
    question:
      "Приложение обрабатывает финансово значимые операции и должно оценивать целостность устройства. Как построить risk-based проверку root, bootloader state и App/Device Integrity с использованием Play Integrity API? Почему локальная root detection не может быть единственным основанием для блокировки пользователя и как организовать server-side verification?",
    rubric:
      "Кандидат должен объяснить модель угроз для скомпрометированного устройства: root, разблокированный bootloader, модифицированная ОС, hooking, instrumentation и подмена окружения. Нужно понимать, что локальные сигналы root detection могут быть обойдены, подделаны или давать false positives, поэтому их нельзя рассматривать как криптографическое доказательство доверенности устройства. Следует объяснить назначение Play Integrity API и различия сигналов app integrity и device integrity в соответствии с доступными verdicts. Кандидат должен описать server-side verification: клиент получает integrity token, отправляет его на backend, сервер проверяет подлинность и связывает результат с конкретным запросом или действием, включая защиту от replay и повторного использования. Нужно понимать, что решение должно учитывать риск операции, модель угроз и возможные легитимные ограничения устройства. Хороший ответ предлагает Defense in Depth: серверная авторизация, risk scoring, дополнительные проверки для критичных операций, мониторинг и degraded security modes. Важно учитывать ложноположительные результаты, устройства без Google Play services, доступность API, приватность и пользовательский сценарий при отказе. Кандидат должен объяснить, что integrity verdict не заменяет аутентификацию, авторизацию и проверку бизнес-правил на сервере.",
  },
  {
    id: "sq-security-tamper",
    skillId: "senior-security-tamper",
    grade: "senior",
    topic: "Tamper и Runtime Integrity Detection",
    question:
      "Как защитить Android-приложение от модификации APK, hooking и вмешательства в runtime? Объясни проверку подписи, Play Integrity, code/runtime integrity checks, обнаружение debugger и instrumentation, роль R8 и native code. Какие ограничения anti-tampering механизмов необходимо учитывать при проектировании?",
    rubric:
      "Кандидат должен объяснить threat model модификации приложения: переподпись APK, изменение DEX/resources, runtime hooking, instrumentation, debugger и перехват критичных функций. Нужно понимать проверку подписи приложения и ограничения локальных integrity checks: атакующий с контролем устройства может модифицировать саму проверку или её результат. Следует объяснить роль Play Integrity и обязательную server-side валидацию verdict для чувствительных операций. Кандидат должен знать назначение R8 и обфускации как средств повышения стоимости анализа, но не считать их надёжной криптографической защитой. Нужно понимать, что native code также может быть исследован и модифицирован, а обнаружение Frida/debugger/instrumentation является сигналом риска, а не гарантией отсутствия вмешательства. Важно рассмотреть false positives, совместимость с legitimate debugging/accessibility tools, производительность и влияние на стабильность. Хороший ответ предлагает Defense in Depth: критические бизнес-решения выполняются сервером, секреты не встраиваются в клиент, integrity signals используются для risk-based policy, а система регистрирует и анализирует подозрительные сценарии. Кандидат должен объяснить, почему абсолютная защита клиентского приложения невозможна при полном контроле атакующего над устройством и какие меры реально уменьшают риск.",
  },
  {
    id: "sq-security-leak",
    skillId: "senior-security-leak",
    grade: "senior",
    topic: "Data Leak Prevention",
    question:
      "Проведи threat modeling для предотвращения утечки чувствительных данных из Android-приложения. Какие риски возникают в local storage, memory, clipboard, screenshots, backup, Intent, exported components, ContentProvider, WebView, logs, crash reports и telemetry? Как построить систему классификации и минимизации данных?",
    rubric:
      "Кандидат должен начать с классификации данных по чувствительности и принципа data minimization: приложение должно собирать, хранить и передавать только необходимую информацию. Нужно рассмотреть защиту at rest и in transit, ограничение срока хранения, доступ к чувствительным данным в памяти и корректную очистку после завершения сценария, учитывая, что гарантированное стирание копий из managed memory не всегда возможно. Следует объяснить риски clipboard leakage, скриншотов и screen recording, назначение FLAG_SECURE и ограничения его применения. Нужно рассмотреть Android backup/data extraction rules, экспортируемые компоненты, Intent extras, URI permissions и ContentProvider access control. Кандидат должен понимать риски WebView и JavaScript bridge, включая избыточные привилегии, загрузку недоверенного контента и некорректную проверку источника. Важно анализировать логи, crash reports, analytics и telemetry: токены, персональные данные и содержимое запросов не должны попадать в диагностику без необходимости и защиты. Хороший ответ включает secure storage, защиту сессий и токенов, управление конфигурационными секретами, redaction, минимизацию telemetry, аудит и тестирование утечек. Следует учитывать баланс между безопасностью и UX: например, FLAG_SECURE не должен применяться автоматически ко всему приложению без анализа реальных требований.",
  },
];