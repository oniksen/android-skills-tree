export interface Category {
  id: string;
  levelId: string;
  name: string;
  maxScore: number;
  sortOrder: number;
}

export const categories: Category[] = [
  // Junior
  { id: "junior-osnovy", levelId: "junior", name: "Основы программирования", maxScore: 40, sortOrder: 1 },
  { id: "junior-kotlin", levelId: "junior", name: "Kotlin Basics", maxScore: 40, sortOrder: 2 },
  { id: "junior-android", levelId: "junior", name: "Android Basics", maxScore: 50, sortOrder: 3 },
  { id: "junior-ui", levelId: "junior", name: "UI Basics (XML)", maxScore: 30, sortOrder: 4 },
  { id: "junior-data", levelId: "junior", name: "Data & Storage Basics", maxScore: 30, sortOrder: 5 },
  { id: "junior-async", levelId: "junior", name: "Асинхронность", maxScore: 25, sortOrder: 6 },
  { id: "junior-arch", levelId: "junior", name: "Архитектура", maxScore: 25, sortOrder: 7 },
  { id: "junior-nav", levelId: "junior", name: "Навигация и компоненты", maxScore: 20, sortOrder: 8 },
  { id: "junior-test", levelId: "junior", name: "Тестирование", maxScore: 15, sortOrder: 9 },
  { id: "junior-tools", levelId: "junior", name: "Инструменты", maxScore: 15, sortOrder: 10 },
  // Middle
  { id: "middle-kotlin", levelId: "middle", name: "Kotlin", maxScore: 35, sortOrder: 1 },
  { id: "middle-coroutines", levelId: "middle", name: "Coroutines & Flow", maxScore: 50, sortOrder: 2 },
  { id: "middle-components", levelId: "middle", name: "Android Components", maxScore: 25, sortOrder: 3 },
  { id: "middle-ui", levelId: "middle", name: "UI (Views + Compose)", maxScore: 40, sortOrder: 4 },
  { id: "middle-arch", levelId: "middle", name: "Architecture", maxScore: 35, sortOrder: 5 },
  { id: "middle-data", levelId: "middle", name: "Data Layer", maxScore: 40, sortOrder: 6 },
  { id: "middle-networking", levelId: "middle", name: "Networking", maxScore: 40, sortOrder: 7 },
  { id: "middle-di", levelId: "middle", name: "Dependency Injection", maxScore: 40, sortOrder: 8 },
  { id: "middle-test", levelId: "middle", name: "Testing", maxScore: 25, sortOrder: 9 },
  { id: "middle-tools", levelId: "middle", name: "Tools", maxScore: 25, sortOrder: 10 },
  // Strong Middle
  { id: "strong-kotlin", levelId: "strong-middle", name: "Kotlin Advanced", maxScore: 35, sortOrder: 1 },
  { id: "strong-flow", levelId: "strong-middle", name: "Flow Deep Dive", maxScore: 35, sortOrder: 2 },
  { id: "strong-compose", levelId: "strong-middle", name: "Compose Advanced", maxScore: 35, sortOrder: 3 },
  { id: "strong-arch", levelId: "strong-middle", name: "Architecture", maxScore: 40, sortOrder: 4 },
  { id: "strong-data", levelId: "strong-middle", name: "Data", maxScore: 35, sortOrder: 5 },
  { id: "strong-security", levelId: "strong-middle", name: "Security", maxScore: 30, sortOrder: 6 },
  { id: "strong-perf", levelId: "strong-middle", name: "Performance", maxScore: 30, sortOrder: 7 },
  // Senior
  { id: "senior-kotlin", levelId: "senior", name: "Kotlin Expert", maxScore: 30, sortOrder: 1 },
  { id: "senior-concurrency", levelId: "senior", name: "Concurrency Expert", maxScore: 30, sortOrder: 2 },
  { id: "senior-platform", levelId: "senior", name: "Android Platform Expert", maxScore: 30, sortOrder: 3 },
  { id: "senior-compose", levelId: "senior", name: "Compose Advanced", maxScore: 25, sortOrder: 4 },
  { id: "senior-arch", levelId: "senior", name: "Architecture & Design", maxScore: 30, sortOrder: 5 },
  { id: "senior-data", levelId: "senior", name: "Data Layer", maxScore: 25, sortOrder: 6 },
  { id: "senior-networking", levelId: "senior", name: "Networking", maxScore: 25, sortOrder: 7 },
  { id: "senior-di", levelId: "senior", name: "Dependency Injection", maxScore: 20, sortOrder: 8 },
  { id: "senior-perf", levelId: "senior", name: "Performance", maxScore: 25, sortOrder: 9 },
  { id: "senior-test", levelId: "senior", name: "Testing", maxScore: 25, sortOrder: 10 },
  { id: "senior-cicd", levelId: "senior", name: "CI/CD", maxScore: 30, sortOrder: 11 },
  { id: "senior-security", levelId: "senior", name: "Security", maxScore: 30, sortOrder: 12 },
];

export function getCategoriesByLevelId(levelId: string): Category[] {
  return categories.filter((c) => c.levelId === levelId).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
