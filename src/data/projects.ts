export interface Project {
  id: string;
  levelId: string;
  name: string;
  description: string;
  requiredTechnologies: string[];
  sortOrder: number;
}

export const projects: Project[] = [
  // Junior
  {
    id: "junior-proj-todo",
    levelId: "junior",
    name: "ToDo List",
    description:
      "Локальный менеджер задач: создание, редактирование, удаление и отображение списка задач с сохранением данных и обработкой состояний интерфейса.",
    requiredTechnologies: [
      "Kotlin Basics",
      "Android UI (Views)",
      "RecyclerView",
      "Room Basics",
      "CRUD",
      "ViewModel",
      "UI State",
    ],
    sortOrder: 1,
  },
  {
    id: "junior-proj-movie",
    levelId: "junior",
    name: "Movie Browser",
    description:
      "Каталог фильмов с загрузкой данных из REST API, экраном подробной информации и обработкой состояний загрузки, ошибки и пустого результата.",
    requiredTechnologies: [
      "HTTP/REST Basics",
      "Retrofit",
      "JSON Serialization",
      "Coroutines Basics",
      "Activity/Fragment Navigation",
      "Loading/Error/Empty States",
    ],
    sortOrder: 2,
  },
  {
    id: "junior-proj-notes",
    levelId: "junior",
    name: "Notes App",
    description:
      "Приложение заметок с CRUD-операциями, поиском, локальным хранением и простым экспортом заметок в файл.",
    requiredTechnologies: [
      "Room Basics",
      "Repository Basics",
      "CRUD",
      "Search",
      "Files",
      "Input Validation",
    ],
    sortOrder: 3,
  },
  {
    id: "junior-proj-weather",
    levelId: "junior",
    name: "Weather App",
    description:
      "Погодное приложение, которое получает данные из API, преобразует DTO в модель отображения и корректно реагирует на сетевые ошибки.",
    requiredTechnologies: [
      "REST API",
      "Retrofit",
      "DTO/Data Mapping",
      "Coroutines",
      "Repository Pattern Basics",
      "UI State",
    ],
    sortOrder: 4,
  },
  {
    id: "junior-proj-calc",
    levelId: "junior",
    name: "Calculator",
    description:
      "Калькулятор с обработкой пользовательского ввода, проверкой некорректных операций, сохранением состояния экрана и тестированием вычислений.",
    requiredTechnologies: [
      "Kotlin Functions",
      "Conditional Logic",
      "UI Events",
      "State Management Basics",
      "Activity Lifecycle",
      "JUnit Basics",
    ],
    sortOrder: 5,
  },

  // Middle
  {
    id: "middle-proj-news",
    levelId: "middle",
    name: "News App",
    description:
      "Новостная лента с постраничной загрузкой, локальным кэшем и доступом к ранее загруженным материалам без сети.",
    requiredTechnologies: [
      "Jetpack Compose",
      "Paging 3",
      "Room",
      "Flow/StateFlow",
      "Offline-First Basics",
      "Lifecycle-Aware Collection",
      "Repository Pattern",
      "Coroutine Testing",
    ],
    sortOrder: 1,
  },
  {
    id: "middle-proj-todopro",
    levelId: "middle",
    name: "ToDo Pro",
    description:
      "Полноценный менеджер задач на Compose: фильтры, категории, напоминания, настройки и фоновая обработка запланированных операций.",
    requiredTechnologies: [
      "Jetpack Compose",
      "MVVM/UDF",
      "StateFlow",
      "UseCase",
      "Room",
      "DataStore",
      "WorkManager",
      "Dependency Injection",
      "ViewModel/Repository Testing",
    ],
    sortOrder: 2,
  },
  {
    id: "middle-proj-chat",
    levelId: "middle",
    name: "Chat App",
    description:
      "Чат с обменом сообщениями в реальном времени, локальной историей, восстановлением соединения и согласованным отображением отправляемых сообщений.",
    requiredTechnologies: [
      "WebSocket",
      "Realtime State Management",
      "Structured Concurrency",
      "Reconnect/Retry",
      "Local Cache",
      "Optimistic UI Updates",
      "Integration Testing",
    ],
    sortOrder: 3,
  },
  {
    id: "middle-proj-moviepro",
    levelId: "middle",
    name: "Movie Browser Pro",
    description:
      "Расширенный каталог фильмов с пагинацией, поиском и фильтрами, кэшированием изображений и контролируемой обработкой сетевых ошибок.",
    requiredTechnologies: [
      "Jetpack Compose",
      "Paging 3",
      "Search/Filtering",
      "Caching Strategy",
      "Image Loading",
      "Flow",
      "Network Error Handling",
      "Performance Profiling",
    ],
    sortOrder: 4,
  },
  {
    id: "middle-proj-habit",
    levelId: "middle",
    name: "Habit Tracker",
    description:
      "Трекер привычек с календарём, статистикой, уведомлениями и фоновой обработкой. Данные должны корректно сохраняться при перезапуске приложения.",
    requiredTechnologies: [
      "Jetpack Compose",
      "Room",
      "WorkManager",
      "Notifications",
      "Date/Time Handling",
      "Statistics",
      "Background Execution Limits",
      "Offline Persistence",
    ],
    sortOrder: 5,
  },

  // Strong Middle
  {
    id: "strong-proj-newsreader",
    levelId: "strong-middle",
    name: "News Reader Pro",
    description:
      "Мультимодульный новостной ридер с независимыми функциональными модулями, офлайн-доступом, обновлением контента и продуманными границами между слоями.",
    requiredTechnologies: [
      "Feature-Based Modularization",
      "Module API/Dependency Graph",
      "Clean Architecture in Practice",
      "Offline-First Architecture",
      "Data Synchronization",
      "Paging 3",
      "Push Notifications",
      "Architecture Decision Records",
    ],
    sortOrder: 1,
  },
  {
    id: "strong-proj-tasks",
    levelId: "strong-middle",
    name: "Tasks Manager",
    description:
      "Архитектурный кейс: менеджер задач с авторизацией, офлайн-режимом и синхронизацией. Нужно спроектировать модули, потоки данных, разрешение конфликтов и восстановление после сбоев.",
    requiredTechnologies: [
      "Application Architecture Design",
      "Clean Architecture",
      "Feature-Based Modularization",
      "Authentication",
      "Offline-First Architecture",
      "Data Synchronization",
      "Conflict Resolution",
      "Retry/Backoff",
      "Idempotency",
      "Request Deduplication",
      "WorkManager",
      "Architecture Trade-offs",
    ],
    sortOrder: 2,
  },
  {
    id: "strong-proj-securechat",
    levelId: "strong-middle",
    name: "Secure Chat",
    description:
      "Защищённый чат с обменом сообщениями в реальном времени, локальной очередью, восстановлением соединения и безопасным хранением чувствительных данных.",
    requiredTechnologies: [
      "WebSocket",
      "Connection Lifecycle",
      "Structured Concurrency",
      "Message Delivery/Deduplication",
      "Offline Queue",
      "Android Keystore",
      "Secure Storage",
      "Failure Recovery",
      "Concurrency Testing",
    ],
    sortOrder: 3,
  },
  {
    id: "strong-proj-media",
    levelId: "strong-middle",
    name: "Media Player",
    description:
      "Медиаплеер с управлением воспроизведением, фоновой работой, аудиофокусом, медиасессией и кэшированием загружаемого контента.",
    requiredTechnologies: [
      "AndroidX Media3",
      "MediaSession",
      "Audio Focus",
      "Background Playback",
      "Lifecycle Management",
      "Caching/Downloads",
      "Performance Profiling",
    ],
    sortOrder: 4,
  },
  {
    id: "strong-proj-ecommerce",
    levelId: "strong-middle",
    name: "E-Commerce Mini",
    description:
      "Мини-магазин с каталогом, корзиной и оформлением заказа. Особое внимание уделяется согласованности состояния корзины, обработке повторных запросов и сетевых сбоев.",
    requiredTechnologies: [
      "Domain Modeling",
      "Cart State Management",
      "Repository/UseCase Design",
      "Caching",
      "Consistency/Idempotency",
      "Network Failure Handling",
      "Analytics",
      "Architecture Testing",
    ],
    sortOrder: 5,
  },

  // Senior
  {
    id: "senior-proj-superapp",
    levelId: "senior",
    name: "Super App",
    description:
      "Развитие крупного мультимодульного приложения: управление независимыми функциональными областями, контрактами модулей, feature flags, наблюдаемостью и производительностью сборки.",
    requiredTechnologies: [
      "Scalable Modular Architecture",
      "Module/API Governance",
      "Feature Flags",
      "Dependency Management",
      "Build Performance",
      "Observability",
      "Analytics",
      "Offline-First Architecture",
      "Architecture Evolution",
    ],
    sortOrder: 1,
  },
  {
    id: "senior-proj-social",
    levelId: "senior",
    name: "Social Network",
    description:
      "Клиент социальной платформы с лентой, медиаконтентом, комментариями и realtime-обновлениями. Требуется учитывать рост объёма данных, производительность и эволюцию API.",
    requiredTechnologies: [
      "Scalable Client Architecture",
      "Paging 3",
      "Realtime Updates",
      "Media Uploads",
      "Caching/Cache Invalidation",
      "Push Notifications/Deep Links",
      "API Evolution",
      "Performance/Observability",
    ],
    sortOrder: 2,
  },
  {
    id: "senior-proj-finance",
    levelId: "senior",
    name: "Finance App",
    description:
      "Финансовое приложение с биометрической аутентификацией, защищённым хранением данных и безопасной работой с пользовательской сессией и сетевыми операциями.",
    requiredTechnologies: [
      "Threat Modeling",
      "BiometricPrompt",
      "Android Keystore",
      "Secure Storage",
      "Network Security",
      "Session Management",
      "Privacy by Design",
      "Security Testing",
      "Failure-Safe UX",
    ],
    sortOrder: 3,
  },
  {
    id: "senior-proj-messenger",
    levelId: "senior",
    name: "Messenger",
    description:
      "Масштабируемый мессенджер с синхронизацией истории, доставкой сообщений, push-уведомлениями и защищённым обменом данными при нестабильной сети.",
    requiredTechnologies: [
      "WebSocket/XMPP",
      "Message Delivery Semantics",
      "End-to-End Encryption Integration",
      "Offline-First Synchronization",
      "Push Notifications",
      "Background Execution",
      "Retry/Backoff/Idempotency",
      "Observability",
    ],
    sortOrder: 4,
  },
  {
    id: "senior-proj-mediaplatform",
    levelId: "senior",
    name: "Media Platform",
    description:
      "Медиаплатформа со streaming, офлайн-загрузками и DRM. Нужно спроектировать управление воспроизведением, ограничениями хранилища, фоновыми сценариями и платформенными возможностями.",
    requiredTechnologies: [
      "AndroidX Media3",
      "Streaming Architecture",
      "DRM Integration",
      "Offline Downloads",
      "Picture-in-Picture",
      "Background Playback",
      "Storage Management",
      "Performance Monitoring",
    ],
    sortOrder: 5,
  },
  {
    id: "senior-proj-kmp",
    levelId: "senior",
    name: "Kotlin Multiplatform Product",
    description:
      "Кроссплатформенный продукт с разделением общей бизнес-логики и платформенных реализаций, независимыми интерфейсами модулей и согласованной стратегией тестирования и релизов.",
    requiredTechnologies: [
      "Kotlin Multiplatform",
      "Shared Domain/Data Layers",
      "Platform-Specific Implementations",
      "Compose Multiplatform",
      "Multiplatform Module Design",
      "expect/actual",
      "Cross-Platform Testing",
      "Dependency/Build Management",
      "Release Strategy",
    ],
    sortOrder: 6,
  },
];

export function getProjectsByLevelId(levelId: string): Project[] {
  return projects
    .filter((p) => p.levelId === levelId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
