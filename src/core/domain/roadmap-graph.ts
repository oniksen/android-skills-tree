import { getCategoriesByLevelId } from "@/data/categories";
import { levels } from "@/data/levels";
import { getSkillsByLevelId } from "@/data/skills";
import type { RoadmapLink, RoadmapLinkKind } from "@/data/roadmap-links";
import { calcSkillCompletionPercent } from "./scoring";

export type RoadmapNodeStatus = "done" | "in-progress" | "remaining";

export interface RoadmapGraphNode {
  skillId: string;
  name: string;
  categoryId: string;
  categoryName: string;
  status: RoadmapNodeStatus;
  completionPercent: number;
  requiredForLevelUp: boolean;
  column: number;
  row: number;
}

export interface RoadmapGraphEdge {
  from: string;
  to: string;
  kind: RoadmapLinkKind;
}

export interface RoadmapGraphColumn {
  categoryId: string;
  categoryName: string;
  skillIds: string[];
}

export interface RoadmapGraph {
  levelId: string;
  levelName: string;
  nodes: RoadmapGraphNode[];
  edges: RoadmapGraphEdge[];
  columns: RoadmapGraphColumn[];
}

function getStatus(completionPercent: number): RoadmapNodeStatus {
  if (completionPercent === 100) return "done";
  if (completionPercent > 0) return "in-progress";
  return "remaining";
}

export function buildRoadmapGraph(params: {
  levelId: string;
  assessmentMap: Record<string, { subtopics?: Record<string, boolean> }>;
  links: RoadmapLink[];
}): RoadmapGraph {
  const { levelId, assessmentMap, links } = params;
  const level = levels.find((item) => item.id === levelId);
  if (!level) {
    return { levelId, levelName: "", nodes: [], edges: [], columns: [] };
  }

  const levelSkills = getSkillsByLevelId(levelId);
  const levelCategories = getCategoriesByLevelId(levelId);

  const nodes: RoadmapGraphNode[] = [];
  const columns: RoadmapGraphColumn[] = [];

  levelCategories.forEach((category, columnIndex) => {
    const categorySkills = levelSkills
      .filter((skill) => skill.categoryId === category.id)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id));

    categorySkills.forEach((skill, rowIndex) => {
      const completionPercent = calcSkillCompletionPercent(
        skill.id,
        assessmentMap[skill.id]?.subtopics,
      );
      nodes.push({
        skillId: skill.id,
        name: skill.name,
        categoryId: category.id,
        categoryName: category.name,
        status: getStatus(completionPercent),
        completionPercent,
        requiredForLevelUp: skill.requiredForLevelUp,
        column: columnIndex,
        row: rowIndex,
      });
    });

    columns.push({
      categoryId: category.id,
      categoryName: category.name,
      skillIds: categorySkills.map((skill) => skill.id),
    });
  });

  const levelSkillIds = new Set(levelSkills.map((skill) => skill.id));
  const edges: RoadmapGraphEdge[] = links
    .filter((edge) => levelSkillIds.has(edge.from) && levelSkillIds.has(edge.to))
    .map(({ from, to, kind }) => ({ from, to, kind }));

  return { levelId, levelName: level.name, nodes, edges, columns };
}
