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
  { id: "junior-proj-todo", levelId: "junior", name: "ToDo List", description: "Приложение для заметок с Room и MVVM", requiredTechnologies: ["Room", "MVVM", "RecyclerView"], sortOrder: 1 },
  { id: "junior-proj-movie", levelId: "junior", name: "Movie Browser", description: "Браузер фильмов с Retrofit и навигацией", requiredTechnologies: ["Retrofit", "Navigation", "Detail Screen"], sortOrder: 2 },
  { id: "junior-proj-notes", levelId: "junior", name: "Notes App", description: "CRUD приложение с поиском", requiredTechnologies: ["CRUD", "Room", "Search"], sortOrder: 3 },
  { id: "junior-proj-weather", levelId: "junior", name: "Weather App", description: "Погодное приложение с API", requiredTechnologies: ["API", "Retrofit", "State Handling"], sortOrder: 4 },
  { id: "junior-proj-calc", levelId: "junior", name: "Calculator", description: "Калькулятор с сохранением состояния", requiredTechnologies: ["UI", "State", "Persistence"], sortOrder: 5 },
  // Middle
  { id: "middle-proj-news", levelId: "middle", name: "News App", description: "Новостное приложение с пагинацией и офлайн режимом", requiredTechnologies: ["Retrofit", "Paging3", "Room", "Offline First", "Dark Theme"], sortOrder: 1 },
  { id: "middle-proj-todopro", levelId: "middle", name: "ToDo Pro", description: "Продвинутый туду-лист на Compose", requiredTechnologies: ["Compose", "Room", "DataStore", "WorkManager", "Hilt"], sortOrder: 2 },
  { id: "middle-proj-chat", levelId: "middle", name: "Chat App", description: "Чат с WebSocket и кешированием", requiredTechnologies: ["WebSocket", "Local Cache", "Realtime"], sortOrder: 3 },
  { id: "middle-proj-moviepro", levelId: "middle", name: "Movie Browser Pro", description: "Браузер фильмов с кешированием и пагинацией", requiredTechnologies: ["Caching", "Pagination", "Image Loading"], sortOrder: 4 },
  { id: "middle-proj-habit", levelId: "middle", name: "Habit Tracker", description: "Трекер привычек со статистикой", requiredTechnologies: ["Statistics", "Notifications", "Background Tasks"], sortOrder: 5 },
  // Strong Middle
  { id: "strong-proj-newsreader", levelId: "strong-middle", name: "News Reader Pro", description: "Новостной ридер с офлайн и мультимодульностью", requiredTechnologies: ["Offline First", "Push", "Multi Module"], sortOrder: 1 },
  { id: "strong-proj-tasks", levelId: "strong-middle", name: "Tasks Manager", description: "Менеджер задач с WorkManager", requiredTechnologies: ["WorkManager", "Compose", "Sync"], sortOrder: 2 },
  { id: "strong-proj-securechat", levelId: "strong-middle", name: "Secure Chat", description: "Защищённый чат с шифрованием", requiredTechnologies: ["Encryption", "WebSocket", "Offline Cache"], sortOrder: 3 },
  { id: "strong-proj-media", levelId: "strong-middle", name: "Media Player", description: "Медиа плеер с ExoPlayer", requiredTechnologies: ["ExoPlayer", "Audio Focus", "Background Playback"], sortOrder: 4 },
  { id: "strong-proj-ecommerce", levelId: "strong-middle", name: "E-Commerce Mini", description: "Мини e-commerce с корзиной", requiredTechnologies: ["Cart", "Offline", "Caching", "Analytics"], sortOrder: 5 },
  // Senior
  { id: "senior-proj-superapp", levelId: "senior", name: "Super App", description: "Мультимодульное приложение с feature flags", requiredTechnologies: ["Multi Module", "Feature Flags", "Analytics", "Offline First"], sortOrder: 1 },
  { id: "senior-proj-social", levelId: "senior", name: "Social Network", description: "Социальная сеть с realtime", requiredTechnologies: ["Paging3", "Realtime", "Media", "Comments"], sortOrder: 2 },
  { id: "senior-proj-finance", levelId: "senior", name: "Finance App", description: "Финансовое приложение с биометрией", requiredTechnologies: ["Biometrics", "Encryption", "Security", "Offline"], sortOrder: 3 },
  { id: "senior-proj-messenger", levelId: "senior", name: "Messenger", description: "Мессенджер с шифрованием", requiredTechnologies: ["XMPP/WebSocket", "Push", "Encryption", "Background Services"], sortOrder: 4 },
  { id: "senior-proj-mediaplatform", levelId: "senior", name: "Media Platform", description: "Медиа платформа с DRM", requiredTechnologies: ["Streaming", "Downloads", "DRM", "Picture in Picture"], sortOrder: 5 },
  { id: "senior-proj-kmp", levelId: "senior", name: "Kotlin Multiplatform Product", description: "KMP проект с общим доменом", requiredTechnologies: ["Android", "iOS", "Shared Domain", "Compose Multiplatform"], sortOrder: 6 },
];

export function getProjectsByLevelId(levelId: string): Project[] {
  return projects.filter((p) => p.levelId === levelId).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
