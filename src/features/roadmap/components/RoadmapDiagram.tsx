"use client";

import { useRouter } from "next/navigation";
import type { RoadmapGraph, RoadmapGraphNode } from "@/core/domain/roadmap-graph";
import { isDesktopViewport, skillDetailHref, treeSkillHref } from "@/lib/viewport";

const NODE_W = 200;
const NODE_H = 56;
const COL_W = 240;
const ROW_H = 76;
const PADDING = 24;
const HEADER_H = 48;
const MAX_NAME_CHARS = 22;

const STATUS_RECT_CLASS: Record<RoadmapGraphNode["status"], string> = {
  done: "fill-emerald-500/15 stroke-emerald-400/60",
  "in-progress": "fill-blue-500/15 stroke-blue-500/60",
  remaining: "fill-slate-800/40 stroke-slate-600",
};

function shortenName(name: string): string {
  if (name.length <= MAX_NAME_CHARS) return name;
  return `${name.slice(0, MAX_NAME_CHARS - 1).trimEnd()}…`;
}

function nodeBox(node: RoadmapGraphNode) {
  return {
    x: PADDING + node.column * COL_W,
    y: PADDING + HEADER_H + node.row * ROW_H,
  };
}

function edgePath(from: RoadmapGraphNode, to: RoadmapGraphNode): string {
  const a = nodeBox(from);
  const b = nodeBox(to);

  if (to.column > from.column) {
    const x1 = a.x + NODE_W;
    const y1 = a.y + NODE_H / 2;
    const x2 = b.x;
    const y2 = b.y + NODE_H / 2;
    const mid = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
  }

  if (to.column < from.column) {
    const x1 = a.x;
    const y1 = a.y + NODE_H / 2;
    const x2 = b.x + NODE_W;
    const y2 = b.y + NODE_H / 2;
    const mid = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
  }

  // Same column: bow out to the right instead of drawing a straight vertical line.
  const x1 = a.x + NODE_W;
  const y1 = a.y + NODE_H / 2;
  const x2 = b.x + NODE_W;
  const y2 = b.y + NODE_H / 2;
  const bow = x1 + 36;
  return `M ${x1} ${y1} C ${bow} ${y1}, ${bow} ${y2}, ${x2} ${y2}`;
}

const LEGEND: { label: string; swatch: string }[] = [
  { label: "Пройдено", swatch: "border-emerald-400/60 bg-emerald-500/15" },
  { label: "В изучении", swatch: "border-blue-500/60 bg-blue-500/15" },
  { label: "Осталось закрыть", swatch: "border-slate-600 bg-slate-800/40" },
  { label: "Дополнительный", swatch: "border-dashed border-slate-600 bg-transparent" },
];

export default function RoadmapDiagram({
  graph,
  levelSlug,
}: {
  graph: RoadmapGraph;
  levelSlug: string;
}) {
  const router = useRouter();

  if (graph.nodes.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-500">Нет навыков для построения диаграммы.</p>;
  }

  const openSkill = (skillId: string) => {
    router.push(
      isDesktopViewport()
        ? treeSkillHref(levelSlug, skillId)
        : skillDetailHref(levelSlug, skillId),
    );
  };

  const maxRows = graph.columns.reduce(
    (max, column) => Math.max(max, column.skillIds.length),
    0,
  );
  const rows = Math.max(
    maxRows,
    graph.nodes.reduce((max, node) => Math.max(max, node.row + 1), 0),
  );
  const width = PADDING * 2 + graph.columns.length * COL_W;
  const height = PADDING * 2 + HEADER_H + rows * ROW_H;

  const nodesById = new Map(graph.nodes.map((node) => [node.skillId, node]));

  return (
    <div className="space-y-3">
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
        {LEGEND.map((item) => (
          <li key={item.label} className="inline-flex items-center gap-1.5">
            <span className={`h-3 w-5 rounded-sm border ${item.swatch}`} aria-hidden />
            {item.label}
          </li>
        ))}
      </ul>

      <div className="overflow-x-auto">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="group"
          aria-label={`Диаграмма зависимостей навыков: ${graph.levelName || graph.levelId}`}
          className="block max-w-none"
        >
          <defs>
            <marker
              id="roadmap-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-500" />
            </marker>
          </defs>

          {graph.columns.map((column, index) => (
            <text
              key={column.categoryId}
              x={PADDING + index * COL_W + NODE_W / 2}
              y={PADDING + 20}
              textAnchor="middle"
              className="fill-slate-500 text-sm font-medium"
            >
              {column.categoryName}
            </text>
          ))}

          {graph.edges.map((edge) => {
            const from = nodesById.get(edge.from);
            const to = nodesById.get(edge.to);
            if (!from || !to || from === to) return null;
            return (
              <path
                key={`${edge.from}->${edge.to}`}
                d={edgePath(from, to)}
                fill="none"
                markerEnd="url(#roadmap-arrow)"
                strokeDasharray={edge.kind === "recommends" ? "4 4" : undefined}
                className="stroke-slate-500"
              />
            );
          })}

          {graph.nodes.map((node) => {
            const { x, y } = nodeBox(node);
            const label = `${node.name}, ${node.completionPercent}%${
              node.requiredForLevelUp ? "" : ", дополнительный навык"
            }`;
            return (
              <g
                key={node.skillId}
                role="link"
                tabIndex={0}
                aria-label={label}
                onClick={() => openSkill(node.skillId)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openSkill(node.skillId);
                  }
                }}
                className="cursor-pointer [&:focus-visible>rect]:stroke-2"
              >
                <title>{node.name}</title>
                <rect
                  x={x}
                  y={y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={10}
                  strokeWidth={1.5}
                  strokeDasharray={node.requiredForLevelUp ? undefined : "5 4"}
                  className={STATUS_RECT_CLASS[node.status]}
                />
                <text x={x + 14} y={y + 24} className="fill-white text-sm">
                  {shortenName(node.name)}
                </text>
                <text x={x + 14} y={y + 43} className="fill-slate-500 text-xs">
                  {node.completionPercent}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
