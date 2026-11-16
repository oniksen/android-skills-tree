import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

/**
 * The processor must be built once per module, not once per render.
 *
 * `react-markdown` calls `unified()` in `createProcessor` on every render, so a
 * study page with 40–60 blocks built 40–60 processors. `markdown-pipeline`
 * builds its processor at import time instead. `unified` is wrapped here to
 * count real invocations — a module-load counter inside the pipeline itself
 * would be tautological (it can only ever be 1).
 */
const calls = vi.hoisted(() => ({ count: 0 }));

vi.mock("unified", async (importOriginal) => {
  const actual = await importOriginal<typeof import("unified")>();
  return {
    ...actual,
    unified: ((...args: Parameters<typeof actual.unified>) => {
      calls.count += 1;
      return actual.unified(...args);
    }) as typeof actual.unified,
  };
});

// Imported after the mock is registered: the pipeline builds its processor at
// module load, so the count below covers that build plus every render.
const { default: StudyMarkdownRenderer } = await import(
  "../components/StudyMarkdownRenderer"
);
const { FIXTURE } = await import("../components/study-html-fixture");

describe("markdown pipeline: сборка процессора", () => {
  it("строит процессор один раз, а не на каждый рендер", () => {
    const first = renderToStaticMarkup(
      createElement(StudyMarkdownRenderer, {
        content: FIXTURE,
        grade: "junior",
      }),
    );
    const second = renderToStaticMarkup(
      createElement(StudyMarkdownRenderer, {
        content: FIXTURE,
        grade: "junior",
      }),
    );

    // Both renders really produced the page, so the count below is meaningful.
    expect(first).toContain("Переменные в Kotlin");
    expect(second).toBe(first);
    expect(calls.count).toBe(1);
  });
});
