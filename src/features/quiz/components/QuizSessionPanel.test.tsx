import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import QuizSessionPanel from "./QuizSessionPanel";

const props = {
  grade: "junior",
  topic: "Переменные и val/var",
  skillName: "Переменные",
  used: 3,
  limit: 5,
  score: 72,
  reason: "Ответ раскрывает val, но не упоминает var.",
  rubric: "val и var, области видимости",
  savedLast4: "ab12",
  canAskNew: true,
  onNew: () => {},
  onExit: () => {},
};

describe("QuizSessionPanel", () => {
  it("shows the session context and actions", () => {
    const html = renderToStaticMarkup(<QuizSessionPanel {...props} />);

    expect(html).toContain("junior");
    expect(html).toContain("Переменные и val/var");
    expect(html).toContain("3/5");
    expect(html).toContain("72");
    expect(html).toContain("[new]");
    expect(html).toContain("[exit]");
    expect(html).toContain("Что оценивается");
  });

  it("disables a new question when the session cannot ask one", () => {
    const html = renderToStaticMarkup(
      <QuizSessionPanel {...props} canAskNew={false} />,
    );

    expect(html).toMatch(/disabled[^>]*>\[new\]/);
  });
});
