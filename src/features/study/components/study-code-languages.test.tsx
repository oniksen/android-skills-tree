import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  STUDY_CODE_LANGUAGES,
  STUDY_HIGHLIGHT_LANGUAGES,
  type StudyCodeLanguage,
} from "../model/study-languages";
import StudyMarkdownRenderer from "./StudyMarkdownRenderer";

/** A snippet each grammar is guaranteed to tokenise. */
const SNIPPETS: Record<StudyCodeLanguage, string> = {
  kotlin: "val x = 1",
  xml: '<root attr="1" />',
  java: "class A { int x = 1; }",
  json: '{"key": "value"}',
  bash: 'echo "hi"',
  text: "обычный текст",
  sql: "SELECT id FROM users;",
  gradle: 'def name = "app"',
  yaml: "key: value",
};

function renderFence(language: string, code: string): string {
  const content = `# Заголовок\n\n## Код\n\n\`\`\`${language}\n${code}\n\`\`\`\n`;

  return renderToStaticMarkup(<StudyMarkdownRenderer content={content} />);
}

describe("study code languages", () => {
  it("грамматики зарегистрированы ровно для документированных языков", () => {
    expect(Object.keys(STUDY_HIGHLIGHT_LANGUAGES).sort()).toEqual(
      [...STUDY_CODE_LANGUAGES].sort(),
    );
  });

  for (const language of STUDY_CODE_LANGUAGES) {
    it(`подсвечивает код как ${language}`, () => {
      const html = renderFence(language, SNIPPETS[language]);

      expect(html).toContain(`class="hljs language-${language}"`);

      if (language === "text") {
        expect(html).not.toContain('<span class="hljs-');
      } else {
        expect(html).toMatch(/<span class="hljs-[a-z]/);
      }
    });
  }

  it("неизвестный язык не падает и не подсвечивается", () => {
    const html = renderFence("foobar", "некоторый код");

    expect(html).toContain('class="hljs language-foobar"');
    expect(html).not.toContain('<span class="hljs-');
  });

  it("блок без языка остаётся без подсветки", () => {
    const html = renderFence("", "некоторый код");

    expect(html).toContain('<code class="hljs">');
    expect(html).not.toContain('<span class="hljs-');
  });
});
