import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import SkillDetailSkeleton from "./SkillDetailSkeleton";

describe("SkillDetailSkeleton", () => {
  it("keeps the stacked skill block layout used on category pages", () => {
    const html = renderToStaticMarkup(<SkillDetailSkeleton />);

    expect(html).toContain("aria-busy");
    expect(html).not.toContain("xl:grid-cols-2");
  });
});
