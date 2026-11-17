import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { renderMarkdown } from "../model/markdown-pipeline";
import {
  createStudyMarkdownComponents,
  parseStudyHeadingAnchor,
} from "./markdown-components";

describe("parseStudyHeadingAnchor", () => {
  it("снимает корректный якорь", () => {
    expect(parseStudyHeadingAnchor("1.1. `val` и `var` {#val-var}")).toEqual({
      text: "1.1. `val` и `var`",
      anchor: "val-var",
    });
  });

  it("оставляет заголовок без якоря", () => {
    expect(parseStudyHeadingAnchor("Кратко")).toEqual({
      text: "Кратко",
      anchor: null,
    });
  });

  it.each(["Foo {#Bad}", "Foo {#bad id}", "Foo {#bad_id}", "Foo {#}"])(
    "не считает якорем %s",
    (title) => {
      expect(parseStudyHeadingAnchor(title)).toEqual({
        text: title,
        anchor: null,
      });
    },
  );
});

describe("заголовки Markdown с якорем", () => {
  it("ставят id и убирают маркер", () => {
    const html = renderToStaticMarkup(
      <>
        {renderMarkdown(
          "### 1.1. `val` и `var` {#val-var}\n\n#### Детали {#details}",
          createStudyMarkdownComponents(),
        )}
      </>,
    );

    expect(html).toContain('<h3 id="val-var" class="study-subtitle">');
    expect(html).toContain('id="details"');
    expect(html).not.toContain("{#");
  });

  it("не ставит id заголовку без якоря", () => {
    const html = renderToStaticMarkup(
      <>{renderMarkdown("### Кратко", createStudyMarkdownComponents())}</>,
    );

    expect(html).toBe('<h3 class="study-subtitle">Кратко</h3>');
  });
});
