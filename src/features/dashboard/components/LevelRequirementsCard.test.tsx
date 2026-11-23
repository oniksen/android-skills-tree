import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import LevelRequirementsCard from "./LevelRequirementsCard";

const requirements = [
  {
    id: "categories" as const,
    label: "Категории текущего уровня",
    done: true,
    current: 2,
    target: 4,
  },
  {
    id: "xp" as const,
    label: "Общий XP",
    done: false,
    current: 200,
    target: 1000,
  },
];

describe("LevelRequirementsCard", () => {
  it("renders every requirement with its progress", () => {
    const html = renderToStaticMarkup(
      <LevelRequirementsCard requirements={requirements} nextLevelName="Middle" />,
    );

    expect(html).toContain("Категории текущего уровня");
    expect(html).toContain("Общий XP");
    expect(html).toContain("2/4");
    expect(html).toContain("200/1000");
  });

  it("renders the ready state when every requirement is done", () => {
    const html = renderToStaticMarkup(
      <LevelRequirementsCard
        requirements={requirements.map((item) => ({ ...item, done: true }))}
        nextLevelName="Middle"
      />,
    );

    expect(html).toContain("условия выполнены");
  });
});
