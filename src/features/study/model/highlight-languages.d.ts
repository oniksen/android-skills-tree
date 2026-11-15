/**
 * highlight.js ships one grammar module per language but types only its main
 * entry point, so deep imports need an ambient declaration. `lowlight`
 * re-exports the grammar function type.
 */
declare module "highlight.js/lib/languages/*" {
  import type { LanguageFn } from "lowlight";

  const grammar: LanguageFn;
  export default grammar;
}
