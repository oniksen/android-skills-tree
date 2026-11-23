import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ProfileHeroCard from "./ProfileHeroCard";

describe("ProfileHeroCard", () => {
  it("shows identity only, without progress metrics", () => {
    const html = renderToStaticMarkup(
      <ProfileHeroCard
        email="dev@example.com"
        levelName="Middle"
        levelColor="text-blue-400"
        headingId="profile-heading"
      />,
    );

    expect(html).toContain("dev@example.com");
    expect(html).toContain("Middle");
    expect(html).not.toContain("XP");
    expect(html).not.toContain("Кристаллы");
    expect(html).not.toContain("Стрик");
  });
});
