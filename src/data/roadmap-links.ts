export type RoadmapLinkKind = "requires" | "recommends";

export interface RoadmapLink {
  from: string;
  to: string;
  kind: RoadmapLinkKind;
}

export const ROADMAP_LINKS: RoadmapLink[] = [
  // Основы программирования
  { from: "junior-osnovy-perem", to: "junior-osnovy-tipy", kind: "requires" },
  { from: "junior-osnovy-tipy", to: "junior-osnovy-uslov", kind: "requires" },
  { from: "junior-osnovy-uslov", to: "junior-osnovy-cikly", kind: "requires" },
  { from: "junior-osnovy-cikly", to: "junior-osnovy-funkc", kind: "requires" },
  { from: "junior-osnovy-funkc", to: "junior-osnovy-oop", kind: "requires" },
  { from: "junior-osnovy-oop", to: "junior-osnovy-coll", kind: "requires" },
  // Kotlin
  { from: "junior-kotlin-sintaks", to: "junior-kotlin-null", kind: "requires" },
  { from: "junior-kotlin-null", to: "junior-kotlin-data", kind: "requires" },
  { from: "junior-kotlin-data", to: "junior-kotlin-properties", kind: "requires" },
  { from: "junior-kotlin-properties", to: "junior-kotlin-object", kind: "requires" },
  { from: "junior-kotlin-object", to: "junior-kotlin-ext", kind: "requires" },
  { from: "junior-kotlin-ext", to: "junior-kotlin-lambda", kind: "requires" },
  { from: "junior-kotlin-lambda", to: "junior-kotlin-hof", kind: "requires" },
  { from: "junior-kotlin-hof", to: "junior-kotlin-scope", kind: "requires" },
  // Android
  { from: "junior-android-studio", to: "junior-android-project", kind: "requires" },
  { from: "junior-android-project", to: "junior-android-gradle", kind: "requires" },
  { from: "junior-android-gradle", to: "junior-android-manifest", kind: "requires" },
  { from: "junior-android-manifest", to: "junior-android-resources", kind: "requires" },
  { from: "junior-android-resources", to: "junior-android-layouts", kind: "requires" },
  { from: "junior-android-layouts", to: "junior-android-view", kind: "requires" },
  { from: "junior-android-view", to: "junior-android-lifecycle", kind: "requires" },
  { from: "junior-android-lifecycle", to: "junior-android-intent", kind: "requires" },
  { from: "junior-android-intent", to: "junior-android-task", kind: "requires" },
  { from: "junior-android-intent", to: "junior-android-notifications", kind: "requires" },
  // UI
  { from: "junior-ui-textview", to: "junior-ui-button", kind: "requires" },
  { from: "junior-ui-button", to: "junior-ui-imageview", kind: "requires" },
  { from: "junior-ui-textview", to: "junior-ui-compose-basics", kind: "requires" },
  // Async & Навигация (Junior)
  { from: "junior-async-suspend", to: "junior-async-flow", kind: "requires" },
  { from: "junior-nav-broadcast", to: "junior-nav-content-provider", kind: "recommends" },
  // Кросс-категорийные рекомендации (тот же грейд)
  { from: "junior-kotlin-sintaks", to: "junior-android-studio", kind: "recommends" },
  { from: "junior-android-layouts", to: "junior-ui-textview", kind: "recommends" },
  { from: "junior-async-flow", to: "junior-arch-viewmodel", kind: "recommends" },
  // Middle
  { from: "middle-di-hilt", to: "middle-di-koin", kind: "recommends" },
  { from: "middle-networking-retrofit", to: "middle-networking-graphql", kind: "recommends" },
  { from: "middle-tools-kts", to: "middle-tools-lint", kind: "recommends" },
  { from: "middle-tools-crashlytics", to: "middle-tools-google-play-services", kind: "recommends" },
  // Strong Middle
  { from: "strong-arch-multi", to: "strong-arch-convention-plugins", kind: "requires" },
  // Senior
  { from: "senior-platform-art", to: "senior-platform-ai", kind: "recommends" },
];
