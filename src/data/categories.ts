export interface Category {
  id: string;
  levelId: string;
  name: string;
  sortOrder: number;
}

export const categories: Category[] = [
  // Junior
  { id: "junior-osnovy", levelId: "junior", name: "Основы программирования", sortOrder: 1 },
  { id: "junior-kotlin", levelId: "junior", name: "Kotlin Basics", sortOrder: 2 },
  { id: "junior-android", levelId: "junior", name: "Android Basics", sortOrder: 3 },
  { id: "junior-ui", levelId: "junior", name: "UI Basics (XML)", sortOrder: 4 },
  { id: "junior-data", levelId: "junior", name: "Data & Storage Basics", sortOrder: 5 },
  { id: "junior-async", levelId: "junior", name: "Асинхронность", sortOrder: 6 },
  { id: "junior-arch", levelId: "junior", name: "Архитектура", sortOrder: 7 },
  { id: "junior-nav", levelId: "junior", name: "Навигация и компоненты", sortOrder: 8 },
  { id: "junior-test", levelId: "junior", name: "Тестирование", sortOrder: 9 },
  { id: "junior-tools", levelId: "junior", name: "Инструменты", sortOrder: 10 },
  // Middle
  { id: "middle-kotlin", levelId: "middle", name: "Kotlin", sortOrder: 1 },
  { id: "middle-coroutines", levelId: "middle", name: "Coroutines & Flow", sortOrder: 2 },
  { id: "middle-components", levelId: "middle", name: "Android Components", sortOrder: 3 },
  { id: "middle-ui", levelId: "middle", name: "UI (Views + Compose)", sortOrder: 4 },
  { id: "middle-arch", levelId: "middle", name: "Architecture", sortOrder: 5 },
  { id: "middle-data", levelId: "middle", name: "Data Layer", sortOrder: 6 },
  { id: "middle-networking", levelId: "middle", name: "Networking", sortOrder: 7 },
  { id: "middle-di", levelId: "middle", name: "Dependency Injection", sortOrder: 8 },
  { id: "middle-test", levelId: "middle", name: "Testing", sortOrder: 9 },
  { id: "middle-tools", levelId: "middle", name: "Tools", sortOrder: 10 },
  // Strong Middle
  { id: "strong-kotlin", levelId: "strong-middle", name: "Kotlin Advanced", sortOrder: 1 },
  { id: "strong-flow", levelId: "strong-middle", name: "Flow Deep Dive", sortOrder: 2 },
  { id: "strong-compose", levelId: "strong-middle", name: "Compose Advanced", sortOrder: 3 },
  { id: "strong-arch", levelId: "strong-middle", name: "Architecture", sortOrder: 4 },
  { id: "strong-data", levelId: "strong-middle", name: "Data", sortOrder: 5 },
  { id: "strong-security", levelId: "strong-middle", name: "Security", sortOrder: 6 },
  { id: "strong-perf", levelId: "strong-middle", name: "Performance", sortOrder: 7 },
  // Senior
  { id: "senior-kotlin", levelId: "senior", name: "Kotlin Expert", sortOrder: 1 },
  { id: "senior-concurrency", levelId: "senior", name: "Concurrency Expert", sortOrder: 2 },
  { id: "senior-platform", levelId: "senior", name: "Android Platform Expert", sortOrder: 3 },
  { id: "senior-compose", levelId: "senior", name: "Compose Advanced", sortOrder: 4 },
  { id: "senior-arch", levelId: "senior", name: "Architecture & Design", sortOrder: 5 },
  { id: "senior-data", levelId: "senior", name: "Data Layer", sortOrder: 6 },
  { id: "senior-networking", levelId: "senior", name: "Networking", sortOrder: 7 },
  { id: "senior-di", levelId: "senior", name: "Dependency Injection", sortOrder: 8 },
  { id: "senior-perf", levelId: "senior", name: "Performance", sortOrder: 9 },
  { id: "senior-test", levelId: "senior", name: "Testing", sortOrder: 10 },
  { id: "senior-cicd", levelId: "senior", name: "CI/CD", sortOrder: 11 },
  { id: "senior-security", levelId: "senior", name: "Security", sortOrder: 12 },
];

export function getCategoriesByLevelId(levelId: string): Category[] {
  return categories.filter((c) => c.levelId === levelId).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
