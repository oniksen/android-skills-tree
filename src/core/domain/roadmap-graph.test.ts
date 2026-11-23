import { describe, expect, it } from "vitest";
import { buildRoadmapGraph } from "./roadmap-graph";
import { getSkillsByLevelId } from "@/data/skills";
import { getCategoriesByLevelId } from "@/data/categories";
import type { RoadmapLink } from "@/data/roadmap-links";

function completedMap(skillId: string) {
  const skill = getSkillsByLevelId("junior").find((item) => item.id === skillId);
  if (!skill) throw new Error(`missing skill ${skillId}`);
  return {
    [skillId]: {
      subtopics: Object.fromEntries(skill.subtopics.map((name) => [name, true])),
    },
  };
}

describe("buildRoadmapGraph", () => {
  it("includes every skill of the current grade", () => {
    const graph = buildRoadmapGraph({ levelId: "junior", assessmentMap: {}, links: [] });
    expect(graph.nodes).toHaveLength(getSkillsByLevelId("junior").length);
  });

  it("orders columns by category sortOrder", () => {
    const graph = buildRoadmapGraph({ levelId: "junior", assessmentMap: {}, links: [] });
    expect(graph.columns.map((column) => column.categoryId)).toEqual(
      getCategoriesByLevelId("junior").map((category) => category.id),
    );
  });

  it("orders rows by skill sortOrder inside a category", () => {
    const graph = buildRoadmapGraph({ levelId: "junior", assessmentMap: {}, links: [] });
    const column = graph.columns.find((item) => item.categoryId === "junior-osnovy");
    const rows = graph.nodes
      .filter((node) => node.categoryId === "junior-osnovy")
      .sort((a, b) => a.row - b.row)
      .map((node) => node.skillId);
    expect(rows).toEqual(column?.skillIds);
  });

  it("assigns done, in-progress and remaining", () => {
    const skillId = "junior-osnovy-perem";
    const skill = getSkillsByLevelId("junior").find((item) => item.id === skillId);
    if (!skill) throw new Error("missing skill");
    const partial = { [skillId]: { subtopics: { [skill.subtopics[0]]: true } } };

    const empty = buildRoadmapGraph({ levelId: "junior", assessmentMap: {}, links: [] });
    const started = buildRoadmapGraph({ levelId: "junior", assessmentMap: partial, links: [] });
    const done = buildRoadmapGraph({ levelId: "junior", assessmentMap: completedMap(skillId), links: [] });

    const find = (graph: ReturnType<typeof buildRoadmapGraph>) =>
      graph.nodes.find((node) => node.skillId === skillId);
    expect(find(empty)?.status).toBe("remaining");
    expect(find(started)?.status).toBe("in-progress");
    expect(find(done)?.status).toBe("done");
  });

  it("carries requiredForLevelUp", () => {
    const graph = buildRoadmapGraph({ levelId: "junior", assessmentMap: {}, links: [] });
    const required = getSkillsByLevelId("junior").find((skill) => skill.requiredForLevelUp);
    const optional = getSkillsByLevelId("junior").find((skill) => !skill.requiredForLevelUp);
    expect(graph.nodes.find((node) => node.skillId === required?.id)?.requiredForLevelUp).toBe(true);
    expect(graph.nodes.find((node) => node.skillId === optional?.id)?.requiredForLevelUp).toBe(false);
  });

  it("keeps only same-grade edges", () => {
    const links: RoadmapLink[] = [
      { from: "junior-osnovy-perem", to: "junior-osnovy-tipy", kind: "requires" },
      { from: "junior-osnovy-tipy", to: "middle-kotlin-generics", kind: "requires" },
      { from: "unknown", to: "junior-osnovy-tipy", kind: "requires" },
    ];
    const graph = buildRoadmapGraph({ levelId: "junior", assessmentMap: {}, links });
    expect(graph.edges).toEqual([
      { from: "junior-osnovy-perem", to: "junior-osnovy-tipy", kind: "requires" },
    ]);
  });

  it("returns an empty graph for an unknown level", () => {
    const graph = buildRoadmapGraph({ levelId: "unknown", assessmentMap: {}, links: [] });
    expect(graph.nodes).toEqual([]);
    expect(graph.columns).toEqual([]);
  });
});
