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
