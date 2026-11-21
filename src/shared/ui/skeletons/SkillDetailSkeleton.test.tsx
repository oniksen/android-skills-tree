import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import SkillDetailSkeleton from "./SkillDetailSkeleton";

describe("SkillDetailSkeleton", () => {
  it("always matches the widened skill page grid", () => {
    const html = renderToStaticMarkup(<SkillDetailSkeleton />);

    expect(html).toContain("xl:grid-cols-2");
  });
});
