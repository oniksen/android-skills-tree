import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { levels } from "@/data/levels";
import LevelHero from "./LevelHero";

describe("LevelHero", () => {
  it("показывает обязательный и дополнительный XP грейда", () => {
    const html = renderToStaticMarkup(
      <LevelHero
        level={levels[0]}
        accent="text-green-400"
        levelNumber={1}
        totalLevels={levels.length}
        score={63}
        maxScore={426}
        requiredScore={218}
        categoriesDone={0}
        categoriesTotal={1}
        subtopicPercent={15}
      />,
    );

    expect(html).toContain("218 XP");
    expect(html).toContain("208 XP до 100%");
  });
});
