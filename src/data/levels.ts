export interface Level {
  id: string;
  name: string;
  slug: string;
  description: string;
  levelOrder: number;
  requiredProjectCount: number;
}

export const levels: Level[] = [
  {
    id: "junior",
    name: "Junior",
    slug: "junior",
    description: "Разработчик способен создавать простые Android-приложения и понимает основные механизмы платформы.",
    levelOrder: 1,
    requiredProjectCount: 0,
  },
  {
    id: "middle",
    name: "Middle",
    slug: "middle",
    description: "Разработчик уверенно решает типовые задачи, работает с API и базами данных. Самостоятельно разрабатывает production-ready приложения.",
    levelOrder: 2,
    requiredProjectCount: 2,
  },
  {
    id: "strong-middle",
    name: "Strong Middle",
    slug: "strong-middle",
    description: "Проектирует архитектуру, работает с многомодульностью и производительностью.",
    levelOrder: 3,
    requiredProjectCount: 3,
  },
  {
    id: "senior",
    name: "Senior",
    slug: "senior",
    description: "Способен проектировать архитектуру продукта и принимать технические решения масштаба компании.",
    levelOrder: 4,
    requiredProjectCount: 5,
  },
];

export function getLevelBySlug(slug: string): Level | undefined {
  return levels.find((l) => l.slug === slug);
}

export function getLevelById(id: string): Level | undefined {
  return levels.find((l) => l.id === id);
}
