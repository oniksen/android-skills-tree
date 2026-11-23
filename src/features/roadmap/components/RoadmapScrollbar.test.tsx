import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { RoadmapScrollbarView } from "./RoadmapScrollbar";

describe("RoadmapScrollbarView", () => {
  it("renders a glass scrollbar with the current position when content overflows", () => {
    const html = renderToStaticMarkup(
      <RoadmapScrollbarView
        metrics={{ left: 100, client: 800, width: 2400 }}
        onScrollTo={vi.fn()}
      />,
    );

    expect(html).toContain("glass-panel");
    expect(html).toContain('role="scrollbar"');
    expect(html).toContain('aria-valuenow="100"');
    expect(html).toContain('aria-valuemax="1600"');
  });

  it("renders nothing when the diagram does not overflow", () => {
    const html = renderToStaticMarkup(
      <RoadmapScrollbarView
        metrics={{ left: 0, client: 800, width: 800 }}
        onScrollTo={vi.fn()}
      />,
    );

    expect(html).toBe("");
  });
});
