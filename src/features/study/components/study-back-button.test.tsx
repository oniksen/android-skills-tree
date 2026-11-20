import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import StudyBackButton from "./StudyBackButton";

describe("StudyBackButton", () => {
  const html = renderToStaticMarkup(
    <StudyBackButton href="/tree/junior" label="Назад к дереву" />,
  );

  it("отдаёт ссылку на backHref с доступным именем", () => {
    expect(html).toContain('href="/tree/junior"');
    expect(html).toContain('aria-label="Назад к дереву"');
  });

  it("рендерит классы иконки и подписи", () => {
    expect(html).toContain("study-back-float");
    expect(html).toContain("study-back-float-label");
    expect(html).toContain("Назад к дереву");
  });

  it("прячет крестик от скринридера", () => {
    expect(html).toContain("<svg");
    expect(html).toContain('aria-hidden="true"');
  });
});
