import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PageSummaryCard from "./PageSummaryCard";

describe("PageSummaryCard", () => {
  it("fills the bento cell it is placed in", () => {
    const html = renderToStaticMarkup(
      <PageSummaryCard title="Навыки" value="1/2" />,
    );

    expect(html).toContain("card-surface");
    expect(html).toContain("h-full");
  });
});
