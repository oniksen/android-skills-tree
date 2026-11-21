export type PageWidth = "wide" | "study" | "quiz" | "default";

const WIDE_PAGES = new Set([
  "/dashboard",
  "/roadmap",
  "/projects",
  "/shop",
  "/achievements",
  "/profile",
]);

/**
 * Width tier for the app shell. The tree and the collection pages share the
 * wide container; study and quiz own their layout; everything else keeps the
 * readable default width.
 */
export function pageWidthFor(pathname: string): PageWidth {
  const path = (pathname || "/").split("?")[0];

  if (/\/study(\/|$)/.test(path)) return "study";
  if (path === "/quiz" || path.startsWith("/quiz/")) return "quiz";
  if (path === "/tree" || path.startsWith("/tree/")) return "wide";
  if (WIDE_PAGES.has(path)) return "wide";
  return "default";
}
