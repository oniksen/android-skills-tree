import { HtmlValidate, type Report } from "html-validate";

/**
 * One html-validate setup for every study-markup test.
 *
 * Lives outside `*.test.tsx` so several suites can import it without
 * registering another file's tests. The renderer emits a page fragment, not a
 * document, hence the shell in `documentForStudyMarkup`.
 */
export const studyHtmlValidate = new HtmlValidate({
  extends: ["html-validate:recommended"],
  rules: {
    // react-dom/server serialises booleans as `disabled=""` and voids as
    // `<input/>`; both are serializer artefacts, not authored markup.
    "attribute-boolean-style": "off",
    "void-style": "off",
    // GFM table alignment arrives as `style="text-align:right"` from the
    // Markdown pipeline; there is no class-based equivalent to switch to.
    "no-inline-style": "off",
  },
});

/** The smallest valid document around a rendered study fragment. */
export function documentForStudyMarkup(body: string): string {
  return `<!DOCTYPE html><html lang="ru"><head><title>test</title></head><body>${body}</body></html>`;
}

export async function validateStudyMarkup(markup: string): Promise<Report> {
  return studyHtmlValidate.validateString(documentForStudyMarkup(markup));
}

export function studyHtmlMessages(report: Report): string[] {
  return report.results.flatMap((result) =>
    result.messages.map(
      (message) =>
        `${message.ruleId} (${message.line}:${message.column}) ${message.message}`,
    ),
  );
}

/** Exact class token inside a `class` attribute — not a substring. */
export function hasExactClass(html: string, name: string): boolean {
  for (const [, value] of html.matchAll(/class="([^"]*)"/g)) {
    if (value.split(/\s+/).includes(name)) return true;
  }
  return false;
}
