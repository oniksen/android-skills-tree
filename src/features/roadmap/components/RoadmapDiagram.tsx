"use client";

import { useRouter } from "next/navigation";
import type { RefObject } from "react";
import type { RoadmapGraph, RoadmapGraphNode } from "@/core/domain/roadmap-graph";
import { isDesktopViewport, skillDetailHref, treeSkillHref } from "@/lib/viewport";

const NODE_W = 200;
const NODE_H = 56;
const LINE_H = 16;
const MAX_LINES = 3;
const MAX_LINE_CHARS = 20;
const COL_W = 300;
const VERTICAL_GAP = 40;
const PADDING = 24;
const HEADER_H = 48;

const STATUS_RECT_CLASS: Record<RoadmapGraphNode["status"], string> = {
  done: "fill-emerald-500/15 stroke-emerald-400/60",
  "in-progress": "fill-blue-500/15 stroke-blue-500/60",
  remaining: "fill-slate-800/40 stroke-slate-600",
};

interface NodeBox {
  x: number;
  y: number;
  w: number;
  h: number;
  lines: string[];
}

function wrapName(name: string): string[] {
  const words = name.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  const finish = (truncated: boolean): string[] => {
    if (!truncated) return lines;
    const lastIndex = lines.length - 1;
    const last = lines[lastIndex] ?? "";
    const clipped =
      last.length >= MAX_LINE_CHARS
        ? last.slice(0, MAX_LINE_CHARS - 1)
        : last;
    return [...lines.slice(0, lastIndex), `${clipped}…`];
  };

  for (const word of words) {
    let rest = word;
    while (rest.length > 0) {
      const candidate = current ? `${current} ${rest}` : rest;
      if (candidate.length <= MAX_LINE_CHARS) {
        current = candidate;
        rest = "";
        break;
      }
      if (current) {
        lines.push(current);
        current = "";
        if (lines.length >= MAX_LINES) return finish(true);
        continue;
      }
      if (lines.length >= MAX_LINES) return finish(true);
      lines.push(rest.slice(0, MAX_LINE_CHARS));
      rest = rest.slice(MAX_LINE_CHARS);
    }
  }

  if (current) {
    if (lines.length >= MAX_LINES) return finish(true);
    lines.push(current);
  }

  return lines.length > 0 ? lines : [name];
}

function buildLayout(graph: RoadmapGraph): {
  boxes: Map<string, NodeBox>;
  width: number;
  height: number;
} {
  const nodesById = new Map(graph.nodes.map((node) => [node.skillId, node]));
  const boxes = new Map<string, NodeBox>();
  let maxRight = PADDING;
  let maxBottom = PADDING + HEADER_H;

  graph.columns.forEach((column, columnIndex) => {
    let y = PADDING + HEADER_H;
    const x = PADDING + columnIndex * COL_W;
    column.skillIds.forEach((skillId) => {
      const node = nodesById.get(skillId);
      if (!node) return;
      const lines = wrapName(node.name);
      const h = NODE_H + (lines.length - 1) * LINE_H;
      boxes.set(skillId, { x, y, w: NODE_W, h, lines });
      y += h + VERTICAL_GAP;
      maxRight = Math.max(maxRight, x + NODE_W);
    });
    maxBottom = Math.max(maxBottom, y - VERTICAL_GAP);
  });

  return {
    boxes,
    width: maxRight + PADDING,
    height: maxBottom + PADDING,
  };
}

function edgePath(from: NodeBox, to: NodeBox): string {
  if (from.x === to.x) {
    const x1 = from.x + from.w;
    const y1 = from.y + from.h / 2;
    const x2 = to.x + to.w;
    const y2 = to.y + to.h / 2;
    const bow = x1 + 60;
    return `M ${x1} ${y1} C ${bow} ${y1}, ${bow} ${y2}, ${x2} ${y2}`;
  }

  const leftToRight = to.x > from.x;
  const x1 = leftToRight ? from.x + from.w : from.x;
  const y1 = from.y + from.h / 2;
  const x2 = leftToRight ? to.x : to.x + to.w;
  const y2 = to.y + to.h / 2;
  const c1 = leftToRight ? x1 + 60 : x1 - 60;
  const c2 = leftToRight ? x2 - 60 : x2 + 60;
  return `M ${x1} ${y1} C ${c1} ${y1}, ${c2} ${y2}, ${x2} ${y2}`;
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
  scrollRef,
}: {
  graph: RoadmapGraph;
  levelSlug: string;
  scrollRef?: RefObject<HTMLDivElement | null>;
}) {
  const router = useRouter();

  if (graph.nodes.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-500">
        Нет навыков для построения диаграммы.
      </p>
    );
  }

  const openSkill = (skillId: string) => {
    router.push(
      isDesktopViewport()
        ? treeSkillHref(levelSlug, skillId)
        : skillDetailHref(levelSlug, skillId),
    );
  };

  const { boxes, width, height } = buildLayout(graph);

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
      <p className="text-xs text-slate-500">
        Сплошная стрелка — обязательная связь, пунктирная — рекомендация.
      </p>

      <div
        ref={scrollRef}
        id="roadmap-diagram-scroll"
        className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
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
              className="fill-slate-400 text-sm font-medium"
            >
              {column.categoryName}
            </text>
          ))}

          {graph.edges.map((edge) => {
            const from = boxes.get(edge.from);
            const to = boxes.get(edge.to);
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
            const box = boxes.get(node.skillId);
            if (!box) return null;
            const { x, y, w, h, lines } = box;
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
                  width={w}
                  height={h}
                  rx={10}
                  strokeWidth={1.5}
                  strokeDasharray={node.requiredForLevelUp ? undefined : "5 4"}
                  className={STATUS_RECT_CLASS[node.status]}
                />
                <text x={x + 14} y={y + 22} className="fill-white text-sm">
                  {lines.map((line, index) => (
                    <tspan key={index} x={x + 14} dy={index === 0 ? 0 : LINE_H}>
                      {line}
                    </tspan>
                  ))}
                </text>
                <text x={x + 14} y={y + h - 12} className="fill-slate-500 text-xs">
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
