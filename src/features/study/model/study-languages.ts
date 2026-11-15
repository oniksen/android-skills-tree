import type { LanguageFn } from "lowlight";
import bash from "highlight.js/lib/languages/bash";
import groovy from "highlight.js/lib/languages/groovy";
import java from "highlight.js/lib/languages/java";
import json from "highlight.js/lib/languages/json";
import kotlin from "highlight.js/lib/languages/kotlin";
import plaintext from "highlight.js/lib/languages/plaintext";
import sql from "highlight.js/lib/languages/sql";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

/**
 * Languages the study materials are allowed to use in fenced code blocks:
 * exactly the list in `STUDY_MATERIALS_FORMATTING.txt`, section 8.
 */
export const STUDY_CODE_LANGUAGES = [
  "kotlin",
  "xml",
  "java",
  "json",
  "bash",
  "text",
  "sql",
  "gradle",
  "yaml",
] as const;

export type StudyCodeLanguage = (typeof STUDY_CODE_LANGUAGES)[number];

/**
 * Grammars handed to `lowlight` — the whole highlighting bundle.
 *
 * `rehype-highlight` is not used here on purpose: it always imports lowlight's
 * `common` set (37 grammars) at module level, so its `languages` option narrows
 * what gets highlighted but not what gets bundled. This map is the bundle.
 *
 * highlight.js ships no Gradle grammar, so `gradle` uses the Groovy one;
 * `text` is `plaintext`, which emits the code without any `hljs-*` tokens.
 */
export const STUDY_HIGHLIGHT_LANGUAGES: Readonly<
  Record<StudyCodeLanguage, LanguageFn>
> = {
  kotlin,
  xml,
  java,
  json,
  bash,
  text: plaintext,
  sql,
  gradle: groovy,
  yaml,
};
