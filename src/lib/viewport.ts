export const MOBILE_BREAKPOINT = 600;

export function isDesktopViewport(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return true;
  }
  return window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px)`).matches;
}

export function skillDetailHref(slug: string, skillId: string): string {
  return `/tree/${slug}/skill/${skillId}`;
}
