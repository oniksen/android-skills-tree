import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AppCloseButton from "./AppCloseButton";

describe("AppCloseButton", () => {
  it("renders a labelled link with a cross", () => {
    const html = renderToStaticMarkup(
      <AppCloseButton href="/tree/junior" label="Назад к дереву" />,
    );

    expect(html).toContain('href="/tree/junior"');
    expect(html).toContain('aria-label="Назад к дереву"');
    expect(html).toContain("Назад к дереву");
    expect(html).toContain("<svg");
  });
});
