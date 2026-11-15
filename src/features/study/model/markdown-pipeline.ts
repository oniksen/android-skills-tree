import type { Root as HastRoot } from "hast";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { urlAttributes } from "html-url-attributes";
import type { ReactNode } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { defaultUrlTransform } from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import rehypeStudyHighlight from "./study-highlight";

/**
 * The one Markdown processor of the study feature.
 *
 * `react-markdown` rebuilds its unified processor on every render, and a study
 * page mounts 40–60 of them. This module is imported once per client bundle, so
 * the processor (parser, GFM, mdast→hast, highlighting) is built once at import
 * time. Behaviour matches `react-markdown@10.1.0`:
 * `createProcessor` + `post` from `node_modules/react-markdown/lib/index.js`.
 */
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStudyHighlight);

/**
 * `react-markdown`'s `post()` pre-pass: raw HTML becomes text (no
 * `skipHtml`, no `rehype-raw`) and URL attributes are sanitized.
 */
function buildHastTree(markdown: string): HastRoot {
  const tree = processor.runSync(processor.parse(markdown)) as HastRoot;

  visit(tree, (node, index, parent) => {
    if (node.type === "raw" && parent && typeof index === "number") {
      parent.children[index] = { type: "text", value: node.value };
      return index;
    }

    if (node.type !== "element") return;

    for (const key of Object.keys(urlAttributes)) {
      if (!Object.hasOwn(node.properties, key)) continue;

      const allowedTags = urlAttributes[key];
      if (allowedTags === null || allowedTags.includes(node.tagName)) {
        node.properties[key] = defaultUrlTransform(
          String(node.properties[key] || ""),
        );
      }
    }
  });

  return tree;
}

/** Renders Markdown to React nodes with the caller's component map. */
export function renderMarkdown(
  markdown: string,
  components: Components,
): ReactNode {
  return toJsxRuntime(treeFor(markdown), {
    Fragment,
    components,
    ignoreInvalidStyle: true,
    jsx,
    jsxs,
    passKeys: true,
    passNode: true,
  });
}

/**
 * FIFO cache of parsed trees, keyed by the Markdown source.
 *
 * Measured split (see `markdown-pipeline.bench.tsx`): parse + transform is
 * 64–68 % of a full render, so the same block is not parsed twice. Trees are
 * stored **after** `post()`, i.e. already sanitized, and `toJsxRuntime` only
 * reads them, so a cached tree is never mutated again.
 *
 * The limit is exported because the guard test derives its numbers from it. It
 * has to cover the keys of one page, not one section: a study page renders a
 * `StudyProse`/`StudyInline` per block, and the largest material
 * (`osnovy-programmirovaniya-kotlin`) produces 63 distinct sources, so a limit
 * of 50 evicted the entries the next render needs (measured: 146.7 ms warm vs
 * 32.8 ms at 128).
 */
export const __CACHE_LIMIT = 128;
const treeCache = new Map<string, HastRoot>();

function treeFor(markdown: string): HastRoot {
  const cached = treeCache.get(markdown);
  if (cached) return cached;

  const tree = buildHastTree(markdown);
  treeCache.set(markdown, tree);

  if (treeCache.size > __CACHE_LIMIT) {
    const oldest = treeCache.keys().next().value;
    if (oldest !== undefined) treeCache.delete(oldest);
  }

  return tree;
}

/** Guard for tests: how many trees the FIFO cache currently holds. */
export function __getCacheSize(): number {
  return treeCache.size;
}

/** Guard for tests: whether a source string still has a cached tree. */
export function __hasCachedTree(markdown: string): boolean {
  return treeCache.has(markdown);
}

/** Guard for tests: start the cache assertions from a known state. */
export function __resetCache(): void {
  treeCache.clear();
}

/** Benchmark-only handle on the shared processor. */
export const __processor = processor;

/** Benchmark-only handle on the parse + transform half of the pipeline. */
export const __toHastTree = buildHastTree;
