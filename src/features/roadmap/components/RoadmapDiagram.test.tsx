import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import RoadmapDiagram from "./RoadmapDiagram";
import type { RoadmapGraph } from "@/core/domain/roadmap-graph";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const graph: RoadmapGraph = {
  levelId: "junior",
  levelName: "Junior",
  columns: [
    { categoryId: "junior-osnovy", categoryName: "Основы", skillIds: ["a", "b"] },
  ],
  edges: [{ from: "a", to: "b", kind: "requires" }],
  nodes: [
    {
      skillId: "a",
      name: "Переменные",
      categoryId: "junior-osnovy",
      categoryName: "Основы",
      status: "done",
      completionPercent: 100,
      requiredForLevelUp: true,
      column: 0,
      row: 0,
    },
    {
      skillId: "b",
      name: "Типы данных",
      categoryId: "junior-osnovy",
      categoryName: "Основы",
      status: "remaining",
      completionPercent: 0,
      requiredForLevelUp: false,
      column: 0,
      row: 1,
    },
  ],
};

describe("RoadmapDiagram", () => {
  it("renders category headers, nodes and an arrow marker", () => {
    const html = renderToStaticMarkup(<RoadmapDiagram graph={graph} levelSlug="junior" />);
    expect(html).toContain("Основы");
    expect(html).toContain("Переменные");
    expect(html).toContain("Типы данных");
    expect(html).toContain('role="link"');
    expect(html).toContain("marker-end");
  });

  it("marks an optional skill with a dashed stroke and keeps required solid", () => {
    const html = renderToStaticMarkup(<RoadmapDiagram graph={graph} levelSlug="junior" />);
    expect(html).toContain('stroke-dasharray="5 4"');
  });

  it("shows a message for an empty graph", () => {
    const html = renderToStaticMarkup(
      <RoadmapDiagram graph={{ ...graph, nodes: [], edges: [], columns: [] }} levelSlug="junior" />,
    );
    expect(html).not.toContain("<svg");
    expect(html).toContain("Нет навыков");
  });

  it("keeps a long name in the title while the visible text is truncated", () => {
    const longName = "Очень длинное название навыка, которое не должно ломать раскладку узла";
    const html = renderToStaticMarkup(
      <RoadmapDiagram
        graph={{
          ...graph,
          nodes: [{ ...graph.nodes[0], name: longName }],
          edges: [],
        }}
        levelSlug="junior"
      />,
    );
    expect(html).toContain(`<title>${longName}</title>`);
    expect(html).toContain("…");
  });
});
