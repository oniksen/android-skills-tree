import { describe, expect, it } from "vitest";
import { ROADMAP_LINKS, type RoadmapLink } from "./roadmap-links";
import { getCategoryById } from "./categories";
import { getSkillById, skills } from "./skills";

const skillIds = new Set(skills.map((skill) => skill.id));

function levelOf(skillId: string): string | null {
  const skill = getSkillById(skillId);
  if (!skill) return null;
  return getCategoryById(skill.categoryId)?.levelId ?? null;
}

function hasCycle(links: RoadmapLink[]): boolean {
  const outgoing = new Map<string, string[]>();
  for (const link of links) {
    outgoing.set(link.from, [...(outgoing.get(link.from) ?? []), link.to]);
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    for (const next of outgoing.get(id) ?? []) {
      if (visit(next)) return true;
    }
    visiting.delete(id);
    visited.add(id);
    return false;
  };

  return [...outgoing.keys()].some((id) => visit(id));
}

describe("ROADMAP_LINKS", () => {
  it("references only existing skills", () => {
    for (const link of ROADMAP_LINKS) {
      expect(skillIds.has(link.from), `unknown from: ${link.from}`).toBe(true);
      expect(skillIds.has(link.to), `unknown to: ${link.to}`).toBe(true);
    }
  });

  it("has no duplicate edges", () => {
    const keys = ROADMAP_LINKS.map((link) => `${link.from}->${link.to}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("has no cycles", () => {
    expect(hasCycle(ROADMAP_LINKS)).toBe(false);
  });

  it("keeps every edge inside one grade", () => {
    for (const link of ROADMAP_LINKS) {
      expect(levelOf(link.from), `missing level for ${link.from}`).not.toBeNull();
      expect(levelOf(link.to), `missing level for ${link.to}`).not.toBeNull();
      expect(levelOf(link.from)).toBe(levelOf(link.to));
    }
  });
});
