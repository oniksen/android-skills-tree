import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ToastProvider } from "@/shared/lib/toast-context";
import SkillDetailContent from "./SkillDetailContent";

const props = {
  skillId: "junior-kotlin-sintaks",
  name: "Переменные",
  description: "Объявление переменных и их инициализация.",
  subtopics: ["val, var", "Объявление и инициализация"],
  subtopicState: {},
  subtopicPercent: 0,
  readonly: true,
};

function render(ui: React.ReactNode) {
  return renderToStaticMarkup(<ToastProvider>{ui}</ToastProvider>);
}

describe("SkillDetailContent", () => {
  it("shows every subtopic inline", () => {
    const html = render(<SkillDetailContent {...props} />);

    expect(html).toContain("val, var");
    expect(html).toContain("Объявление и инициализация");
  });

  it("hides the category name inside a category page block", () => {
    const withCategory = render(<SkillDetailContent {...props} />);
    const withoutCategory = render(
      <SkillDetailContent {...props} showCategory={false} />,
    );

    expect(withCategory).toContain("Kotlin Basics");
    expect(withoutCategory).not.toContain("Kotlin Basics");
  });

  it("keeps the quiz info affordance", () => {
    const html = render(<SkillDetailContent {...props} />);

    expect(html).toContain("Информация о вопросах квиза");
  });
});
