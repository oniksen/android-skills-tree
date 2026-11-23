import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import GradeXpBar from "./GradeXpBar";

describe("GradeXpBar", () => {
  it("показывает обязательную и дополнительную части в одной полосе", () => {
    const html = renderToStaticMarkup(
      <GradeXpBar score={63} required={218} max={426} />,
    );

    expect(html).toContain("обязательно");
    expect(html).toContain("218 XP");
    expect(html).toContain("дополнительно");
    expect(html).toContain("208 XP до 100%");
    expect(html).toContain('data-testid="grade-xp-marker"');
    expect(html).toContain("left:51.17%");
  });

  it("не рисует обязательную метку, если обязательных навыков нет", () => {
    const html = renderToStaticMarkup(
      <GradeXpBar score={63} required={0} max={724} />,
    );

    expect(html).not.toContain('data-testid="grade-xp-marker"');
    expect(html).not.toContain("обязательно");
    expect(html).toContain("724 XP до 100%");
  });

  it("не заливает больше полосы, чем есть", () => {
    const html = renderToStaticMarkup(
      <GradeXpBar score={999} required={218} max={426} />,
    );

    expect(html.match(/█/g)).toHaveLength(20);
  });
});
