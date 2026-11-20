/** Duration of the TOC-driven page scroll, in milliseconds. */
export const TOC_SCROLL_DURATION = 260;

/** Ease-out curve: fast start, gentle landing. */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Absolute document offset for a heading, honouring its `scroll-margin-top`. */
export function scrollTargetTop(
  rectTop: number,
  scrollY: number,
  margin: number,
): number {
  return Math.max(0, rectTop + scrollY - margin);
}
