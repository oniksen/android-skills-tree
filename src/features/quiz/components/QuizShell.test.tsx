import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import QuizShell from "./QuizShell";

describe("QuizShell", () => {
  it("keeps the terminal and the session panel in the same workspace", () => {
    const html = renderToStaticMarkup(
      <QuizShell panel={<aside>panel</aside>}>
        <div>terminal</div>
      </QuizShell>,
    );

    expect(html).toContain("terminal");
    expect(html).toContain("panel");
    expect(html).toContain("max-w-[2000px]");
    expect(html).toContain("hidden xl:flex");
  });
});
