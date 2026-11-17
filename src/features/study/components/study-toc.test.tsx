import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import StudyMarkdownRenderer from "./StudyMarkdownRenderer";

const DOC = `# Переменные

## 1. Переменные {#peremennye}

### 1.1. \`val\` и \`var\` {#val-var}

### Кратко

## Источники и документация {#istochniki}

### Официальная документация {#docs}
`;

function markup(): string {
  return renderToStaticMarkup(
    <StudyMarkdownRenderer content={DOC} grade="junior" />,
  );
}

describe("StudyToc", () => {
  it("строит оглавление с якорями", () => {
    const html = markup();

    expect(html).toContain('class="study-toc"');
    expect(html).toContain('href="#peremennye"');
    expect(html).toContain('href="#val-var"');
    expect(html).toContain('href="#istochniki"');
    expect(html).not.toContain('href="#docs"');
    expect(html).not.toContain("{#");
  });

  it("каждая ссылка оглавления ведёт на существующий id", () => {
    const html = markup();
    const nav = html.slice(
      html.indexOf('class="study-toc"'),
      html.indexOf("</nav>"),
    );
    const hrefs = [...nav.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
    const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));

    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) expect(ids, href).toContain(href);
  });

  it("не показывает подпункты раздела источников", () => {
    expect(markup()).not.toContain('href="#docs"');
  });
});
