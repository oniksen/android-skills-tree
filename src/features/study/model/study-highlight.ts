import type { Element, ElementContent, Root } from "hast";
import { createLowlight } from "lowlight";
import { STUDY_HIGHLIGHT_LANGUAGES } from "./study-languages";

/**
 * Rehype plugin replacing `rehype-highlight` with the narrowed grammar set.
 *
 * `rehype-highlight` builds a `lowlight` instance per instance of
 * `<ReactMarkdown>`, and every one of them registers its grammars again; on a
 * material page that happens 40–60 times. One module-level instance avoids it.
 * Output is the same: `hljs` on the `<code>` element and `hljs-*` spans inside.
 */
const lowlight = createLowlight(STUDY_HIGHLIGHT_LANGUAGES);

/** Language of a `<code>` element, or `false` for an explicit no-highlight. */
function languageOf(node: Element): string | false | undefined {
  const list = node.properties.className;
  if (!Array.isArray(list)) return undefined;

  let name: string | undefined;
  for (const item of list) {
    const value = String(item);
    if (value === "no-highlight" || value === "nohighlight") return false;
    if (!name && value.slice(0, 5) === "lang-") name = value.slice(5);
    if (!name && value.slice(0, 9) === "language-") name = value.slice(9);
  }
  return name;
}

/** Code blocks hold plain text; equivalent to `toText(node, {whitespace: "pre"})`. */
function textOf(node: Element): string {
  let text = "";
  for (const child of node.children) {
    if (child.type === "text") text += child.value;
    else if (child.type === "element") text += textOf(child);
  }
  return text;
}

function highlightCode(node: Element): void {
  const lang = languageOf(node);
  // No language: the block stays plain, like `rehype-highlight` without `detect`.
  if (!lang) return;

  const classes = Array.isArray(node.properties.className)
    ? [...node.properties.className]
    : [];
  if (!classes.includes("hljs")) classes.unshift("hljs");
  node.properties.className = classes;

  try {
    const result = lowlight.highlight(lang, textOf(node));
    if (result.children.length > 0) {
      node.children = result.children as ElementContent[];
    }
  } catch (error) {
    // An unregistered language (`foobar`) must render, not blow up the page.
    if (error instanceof Error && /Unknown language/.test(error.message)) {
      return;
    }
    throw error;
  }
}

function visit(node: Root | Element, parentTag: string | undefined): void {
  for (const child of node.children) {
    if (child.type !== "element") continue;
    if (child.tagName === "code" && parentTag === "pre") highlightCode(child);
    visit(child, child.tagName);
  }
}

export default function rehypeStudyHighlight() {
  return (tree: Root): void => {
    visit(tree, undefined);
  };
}
