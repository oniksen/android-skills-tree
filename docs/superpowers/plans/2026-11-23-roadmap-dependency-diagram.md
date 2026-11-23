# Roadmap All-Topics Diagram Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On `xl+`, show every skill of the current grade as a category-column SVG graph with status colors, a dashed border for optional skills, and dependency arrows; below `xl`, keep the existing `GapList`.

**Architecture:** Edges live in one data file keyed by existing skill IDs. A pure domain function groups all skills of the current grade into category columns, computes `done` / `in-progress` / `remaining`, and filters edges to the grade. A client SVG component renders columns and arrows; `RoadmapClient` shows it only above `xl`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Vitest (`node` environment; component tests use `renderToStaticMarkup`).

**Spec:** `docs/superpowers/specs/2026-11-23-roadmap-dependency-diagram-design.md`

## Global Constraints

- No new npm dependencies; no graph library. The diagram is hand-rolled SVG.
- UI copy is Russian; identifiers, code, and comments-in-code are English.
- Domain logic lives in `src/core/domain` with a colocated `*.test.ts`.
- The diagram is for `xl` (1280px) and wider only; below `xl` the current `RoadmapClient` + `GapList` behavior must be unchanged.
- Do not modify `src/data/skills/*` or `src/data/categories.ts`; links are a separate data file.
- Edges are same-grade only; cross-grade edges are rejected by the data test.
- Tailwind v4 palette is remapped (`emerald-*` terminal green, `blue-*` coral accent, `slate-950` light paper); do not assume default colors.
- Never import study-material modules from client components.
- Verify with `npm run lint`, `npm run typecheck`, `npm test`.
- Use conventional commit subjects.

## Review Focus

- **Unknown, duplicate, cyclic, or cross-grade links:** the data test must fail for each. Task 1.
- **All skills are present:** the junior graph contains exactly `getSkillsByLevelId("junior")`, including skills with no edges. Task 2.
- **Category columns:** column order follows category `sortOrder`; row order follows skill `sortOrder`. Task 2.
- **Statuses:** 100% → `done`, partial → `in-progress`, 0% → `remaining`; `requiredForLevelUp` is carried on the node. Task 2.
- **Optional border:** a node with `requiredForLevelUp === false` gets a dashed SVG stroke; a required node does not. Task 3.
- **Empty graph and long labels:** the diagram renders a message instead of an empty SVG, and a long name keeps its full value in a `<title>` with `…` in the visible text. Task 3.

---

### Task 1: Roadmap links data file and integrity test

**Files:**
- Create: `src/data/roadmap-links.ts`
- Create: `src/data/roadmap-links.test.ts`

**Interfaces:**
- Produces:
  - `type RoadmapLinkKind = "requires" | "recommends"`
  - `interface RoadmapLink { from: string; to: string; kind: RoadmapLinkKind }`
  - `const ROADMAP_LINKS: RoadmapLink[]`

- [ ] **Step 1: Write the failing test**

Create `src/data/roadmap-links.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/data/roadmap-links.test.ts`
Expected: FAIL — cannot resolve `./roadmap-links`.

- [ ] **Step 3: Create `src/data/roadmap-links.ts`**

Use the exact types above. Seed the file with at least these same-grade edges (all IDs exist in `src/data/skills/junior.ts`):

```ts
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
  // UI
  { from: "junior-ui-textview", to: "junior-ui-button", kind: "requires" },
  { from: "junior-ui-button", to: "junior-ui-imageview", kind: "requires" },
  // Кросс-категорийные рекомендации (тот же грейд)
  { from: "junior-kotlin-sintaks", to: "junior-android-studio", kind: "recommends" },
  { from: "junior-android-layouts", to: "junior-ui-textview", kind: "recommends" },
];
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/data/roadmap-links.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/roadmap-links.ts src/data/roadmap-links.test.ts
git commit -m "feat: add roadmap dependency links"
```

---

### Task 2: Domain graph builder (all skills, category columns)

**Files:**
- Create: `src/core/domain/roadmap-graph.ts`
- Create: `src/core/domain/roadmap-graph.test.ts`

**Interfaces:**
- Consumes: `ROADMAP_LINKS`/`RoadmapLink` (Task 1), `getSkillsByLevelId`, `getSkillById`, `getCategoriesByLevelId`, `getCategoryById`, `calcSkillCompletionPercent`, `levels`.
- Produces:
  - `type RoadmapNodeStatus = "done" | "in-progress" | "remaining"`
  - `interface RoadmapGraphNode { skillId; name; categoryId; categoryName; status; completionPercent; requiredForLevelUp; column; row }`
  - `interface RoadmapGraphEdge { from; to; kind }`
  - `interface RoadmapGraphColumn { categoryId; categoryName; skillIds }`
  - `interface RoadmapGraph { levelId; levelName; nodes; edges; columns }`
  - `buildRoadmapGraph(params: { levelId: string; assessmentMap: Record<string, { subtopics?: Record<string, boolean> }>; links: RoadmapLink[] }): RoadmapGraph`

- [ ] **Step 1: Write the failing tests**

Create `src/core/domain/roadmap-graph.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/core/domain/roadmap-graph.test.ts`
Expected: FAIL — cannot resolve `./roadmap-graph`.

- [ ] **Step 3: Implement `src/core/domain/roadmap-graph.ts`**

Rules:
- `level = levels.find((item) => item.id === levelId)`; if missing, return `{ levelId, levelName: "", nodes: [], edges: [], columns: [] }`.
- `levelSkills = getSkillsByLevelId(levelId)`; `levelCategories = getCategoriesByLevelId(levelId)`.
- For each category in order: `skills = levelSkills.filter(categoryId).sort(sortOrder, id)`; assign `column` = category index, `row` = index; push `skillIds` and node metadata.
- `status`: completion === 100 → `done`; completion > 0 → `in-progress`; else `remaining`.
- `edges = links.filter((edge) => levelSkillIds.has(edge.from) && levelSkillIds.has(edge.to))`.
- `categoryName` from the category; `name` from the skill; `completionPercent` from `calcSkillCompletionPercent`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/core/domain/roadmap-graph.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Run typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/core/domain/roadmap-graph.ts src/core/domain/roadmap-graph.test.ts
git commit -m "feat: build roadmap category graph with statuses"
```

---

### Task 3: SVG diagram component

**Files:**
- Create: `src/features/roadmap/components/RoadmapDiagram.tsx`
- Create: `src/features/roadmap/components/RoadmapDiagram.test.tsx`

**Interfaces:**
- Consumes: `RoadmapGraph`/`RoadmapGraphNode` (Task 2), `treeSkillHref`/`skillDetailHref`.
- Produces: default export `RoadmapDiagram({ graph, levelSlug }: { graph: RoadmapGraph; levelSlug: string })`.

- [ ] **Step 1: Write the failing test**

Create `src/features/roadmap/components/RoadmapDiagram.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/features/roadmap/components/RoadmapDiagram.test.tsx`
Expected: FAIL — cannot resolve `./RoadmapDiagram`.

- [ ] **Step 3: Implement `RoadmapDiagram.tsx`**

- `"use client"`; `useRouter`.
- Constants: `NODE_W = 200`, `NODE_H = 56`, `COL_W = 240`, `ROW_H = 76`, `PADDING = 24`.
- Width = `PADDING * 2 + graph.columns.length * COL_W`; height = `PADDING * 2 + maxRows * ROW_H` plus a header row.
- Column headers: category name at the top of each column.
- Nodes: x = `PADDING + node.column * COL_W`, y = `header + node.row * ROW_H`.
- `<defs><marker id="roadmap-arrow" ... /></defs>`; edges use `markerEnd="url(#roadmap-arrow)"`, `strokeDasharray={kind === "recommends" ? "4 4" : undefined}`.
- Node `<g role="link" tabIndex={0} onClick={() => router.push(href)} onKeyDown={Enter/Space} aria-label={...}>` with `<title>{name}</title>`, `<rect>`, `<text>` for a shortened name (`…`) and percent.
- Rect status classes:
  - `done` → `fill-emerald-500/15 stroke-emerald-400/60`
  - `in-progress` → `fill-blue-500/15 stroke-blue-500/60`
  - `remaining` → `fill-slate-800/40 stroke-slate-600`
- Optional border: `strokeDasharray="5 4"` when `!requiredForLevelUp`.
- Legend: `Пройдено` / `В изучении` / `Осталось закрыть` / `Дополнительный` (пунктир).
- Empty `nodes` → `<p>Нет навыков для построения диаграммы.</p>`.
- Wrapper `<div className="overflow-x-auto">`.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/features/roadmap/components/RoadmapDiagram.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Run lint/typecheck**

Run: `npm run lint`
Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/features/roadmap/components/RoadmapDiagram.tsx src/features/roadmap/components/RoadmapDiagram.test.tsx
git commit -m "feat: add roadmap category diagram"
```

---

### Task 4: Integrate the diagram into the Roadmap page

**Files:**
- Modify: `src/features/roadmap/components/RoadmapClient.tsx`

**Interfaces:**
- Consumes: `buildRoadmapGraph` (Task 2), `RoadmapDiagram` (Task 3), `ROADMAP_LINKS` (Task 1).
- Produces: `/roadmap` with the all-topics diagram at `xl+` and the list below.

- [ ] **Step 1: Compute the graph**

In `RoadmapClient`, after the list `items` are built:
```ts
const graph = buildRoadmapGraph({
  levelId: currentLevel.id,
  assessmentMap,
  links: ROADMAP_LINKS,
});
```

- [ ] **Step 2: Render by breakpoint**

- Wrap the sort toolbar and `hideCompleted` control in `<div className="xl:hidden">` (they belong to the list).
- Add above the list:
```tsx
<div className="hidden xl:block">
  <RoadmapDiagram graph={graph} levelSlug={currentLevel.slug} />
</div>
```
- Wrap the existing `GapList` block in `<div className="xl:hidden">`.
- Keep `PageHero` and `PageSummaryCard` unchanged for all breakpoints.

- [ ] **Step 3: Verify the list path is unchanged**

Run: `npx vitest run src/core/domain/roadmap-sort.test.ts src/features/roadmap/components/RoadmapDiagram.test.tsx`
Expected: PASS.

- [ ] **Step 4: Run lint/typecheck/test**

Run: `npm run lint`
Run: `npm run typecheck`
Run: `npm test`
Expected: PASS; the 8 pre-existing failures in `currency`, `weights`, `scoring`, `quiz-questions` may remain if the branch still has them.

- [ ] **Step 5: Commit**

```bash
git add src/features/roadmap/components/RoadmapClient.tsx
git commit -m "feat: show the roadmap diagram on wide screens"
```

---

### Task 5: Keep the AGENTS.md section in sync

**Files:**
- Modify (only if the implementation differs): `AGENTS.md`

The `## Roadmap dependency graph and diagram` section is already present in `AGENTS.md`.

- [ ] **Step 1: Review the existing section**

Confirm it names the real files and behaviors:
- Source of truth: `src/data/roadmap-links.ts` (`from`/`to`/`kind`; same-grade only).
- Domain: `src/core/domain/roadmap-graph.ts` (`buildRoadmapGraph`; all current-grade skills; category columns; `done`/`in-progress`/`remaining`; `requiredForLevelUp`).
- Renderer: `src/features/roadmap/components/RoadmapDiagram.tsx` (dependency-free SVG, category columns, dashed optional border, horizontal scroll, `xl+`; `GapList` below).
- Invariants: all link IDs exist; same-grade edges only; graph is acyclic; no graph library; edges only in the links file.

- [ ] **Step 2: Commit any correction**

```bash
git add AGENTS.md
git commit -m "docs: sync roadmap graph notes with the implementation"
```
