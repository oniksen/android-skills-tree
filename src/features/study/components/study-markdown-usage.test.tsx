import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

/**
 * `react-markdown` rebuilds its unified processor on every render. The study
 * feature must not use it any more: `markdown-pipeline` owns the one processor
 * of the client bundle.
 */
const calls = vi.hoisted(() => ({ count: 0 }));

vi.mock("react-markdown", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-markdown")>();
  return {
    ...actual,
    default: () => {
      calls.count += 1;
      return null;
    },
  };
});

import { FIXTURE } from "./study-html-fixture";
import StudyMarkdownRenderer from "./StudyMarkdownRenderer";

describe("study markdown usage", () => {
  it("рендер фикстуры не вызывает react-markdown", () => {
    const html = renderToStaticMarkup(
      <StudyMarkdownRenderer content={FIXTURE} grade="junior" />,
    );

    // The page really rendered: the mock would have produced empty output.
    expect(html).toContain("Переменные в Kotlin");
    expect(calls.count).toBe(0);
  });
});
