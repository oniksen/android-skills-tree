import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import { bench, describe } from "vitest";
import { STUDY_INLINE_COMPONENTS } from "../components/markdown-components";
import StudyMarkdownRenderer from "../components/StudyMarkdownRenderer";
import { STUDY_MATERIALS } from "../study-materials.generated";
import { __processor, __resetCache, __toHastTree } from "./markdown-pipeline";

/**
 * Split of the Markdown pipeline into its two halves, used to decide whether a
 * tree cache pays for itself (brief T3b, step 1).
 */
const OPTIONS = { time: 5000, warmupTime: 500, warmupIterations: 2 };

const materials = Object.values(STUDY_MATERIALS);

describe("markdown pipeline: parse + transform", () => {
  for (const material of materials) {
    bench(
      material.id,
      () => {
        __processor.runSync(__processor.parse(material.content));
      },
      OPTIONS,
    );
  }
});

describe("markdown pipeline: toJsxRuntime on a prebuilt tree", () => {
  for (const material of materials) {
    const tree = __toHastTree(material.content);
    bench(
      material.id,
      () => {
        toJsxRuntime(tree, {
          Fragment,
          components: STUDY_INLINE_COMPONENTS,
          ignoreInvalidStyle: true,
          jsx,
          jsxs,
          passKeys: true,
          passNode: true,
        });
      },
      OPTIONS,
    );
  }
});

/**
 * A study page mounts 40–60 blocks, so the tree cache only pays off across
 * renders. `cold` is first paint (cache emptied every iteration, comparable to
 * the T3a baseline), `warm` is the re-render path where every block hits.
 */
describe("markdown pipeline: page render, cold cache", () => {
  for (const material of materials) {
    bench(
      material.id,
      () => {
        __resetCache();
        renderToStaticMarkup(
          <StudyMarkdownRenderer
            content={material.content}
            grade={material.grade}
          />,
        );
      },
      OPTIONS,
    );
  }
});

describe("markdown pipeline: page render, warm cache", () => {
  for (const material of materials) {
    bench(
      material.id,
      () => {
        renderToStaticMarkup(
          <StudyMarkdownRenderer
            content={material.content}
            grade={material.grade}
          />,
        );
      },
      OPTIONS,
    );
  }
});
