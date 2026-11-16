import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it } from "vitest";
import {
  STUDY_INLINE_COMPONENTS,
  STUDY_MARKDOWN_COMPONENTS,
} from "../components/markdown-components";
import {
  __CACHE_LIMIT,
  __getCacheSize,
  __hasCachedTree,
  __resetCache,
  renderMarkdown,
} from "./markdown-pipeline";

/** Render a Markdown string the way `StudyProse` does. */
function render(markdown: string): string {
  return renderToStaticMarkup(
    <>{renderMarkdown(markdown, STUDY_MARKDOWN_COMPONENTS)}</>,
  );
}

describe("markdown pipeline", () => {
  it("raw HTML показывается текстом, а не исчезает", () => {
    const generic = render("Тип List<T> в тексте.");
    expect(generic).toContain("List");
    expect(generic).toContain("&lt;T&gt;");

    const lineBreak = render("Первая строка<br>вторая");
    expect(lineBreak).toContain("Первая строка");
    expect(lineBreak).toContain("вторая");
    expect(lineBreak).toContain("&lt;br&gt;");

    const comment = render("Текст <!-- x --> после");
    expect(comment).toContain("&lt;!--");
  });

  it("пустая строка даёт пустой документ", () => {
    expect(render("").trim()).toBe("");
  });

  it("изменённая строка не берёт устаревшее дерево", () => {
    const first = render("# Первый");
    const second = render("# Второй");

    expect(first).toContain("Первый");
    expect(second).toContain("Второй");
    expect(first).not.toBe(second);
  });

  it("инлайновый текст рендерится тем же пайплайном", () => {
    const html = renderToStaticMarkup(
      <>{renderMarkdown("**жирный** `код`", STUDY_INLINE_COMPONENTS)}</>,
    );

    expect(html).toContain("<strong>жирный</strong>");
    expect(html).toContain("<code>код</code>");
  });

  it("опасный протокол ссылки вырезается", () => {
    const html = render("[ссылка](javascript:alert(1))");

    // The link itself is kept, only the protocol is dropped by
    // `defaultUrlTransform` — otherwise the assertion below would pass
    // vacuously if the parser dropped the whole link.
    expect(html).toContain("<a ");
    expect(html).toContain('href=""');
    expect(html).not.toContain("javascript:");
  });
});

describe("markdown pipeline: кэш деревьев", () => {
  beforeEach(() => {
    __resetCache();
  });

  it(`держит не больше ${__CACHE_LIMIT} записей и вытесняет первые 10`, () => {
    const sources = Array.from(
      { length: __CACHE_LIMIT + 10 },
      (_, index) => `# Заголовок ${index}`,
    );

    for (const source of sources) render(source);

    expect(__getCacheSize()).toBe(__CACHE_LIMIT);
    expect(__hasCachedTree(sources[0])).toBe(false);
    expect(__hasCachedTree(sources[9])).toBe(false);
    expect(__hasCachedTree(sources[10])).toBe(true);
    expect(__hasCachedTree(sources[__CACHE_LIMIT + 9])).toBe(true);
  });

  it("повторный рендер строки не добавляет запись", () => {
    render("# Один");
    const size = __getCacheSize();
    render("# Один");

    expect(__getCacheSize()).toBe(size);
  });
});
