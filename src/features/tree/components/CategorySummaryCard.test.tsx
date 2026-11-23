import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CategorySummaryCard from "./CategorySummaryCard";

const baseProps = {
  href: "/tree/junior/category/junior-osnovy",
  name: "Основы программирования",
  score: 120,
  maxScore: 220,
  skillsDone: 4,
  skillsTotal: 8,
};

describe("CategorySummaryCard", () => {
  it("shows the block name, XP progress and completed topics", () => {
    const html = renderToStaticMarkup(<CategorySummaryCard {...baseProps} />);

    expect(html).toContain("Основы программирования");
    expect(html).toContain("120/220 XP");
    expect(html).toContain("4/8 тем");
    expect(html).toContain('href="/tree/junior/category/junior-osnovy"');
  });

  it("links the category study material", () => {
    const html = renderToStaticMarkup(
      <CategorySummaryCard
        {...baseProps}
        studyHref="/tree/junior/category/junior-osnovy/study"
      />,
    );

    expect(html).toContain('href="/tree/junior/category/junior-osnovy/study"');
  });

  it("marks a fully completed block", () => {
    const html = renderToStaticMarkup(
      <CategorySummaryCard {...baseProps} score={220} skillsDone={8} isComplete />,
    );

    expect(html).toContain("макс");
  });

  it("dims blocks of a locked grade", () => {
    const html = renderToStaticMarkup(
      <CategorySummaryCard {...baseProps} muted />,
    );

    expect(html).toContain("opacity-60");
  });
});
