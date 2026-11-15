/**
 * Regenerates `src/features/study/components/__fixtures__/study-render/*.html`.
 *
 * The fixtures are a byte-exact baseline of the Markdown rendering path, so
 * this is not a "make the test green" shortcut: run it only after an
 * intentional rendering change, then review `git diff` on `__fixtures__`.
 * A diff in `kotlin-basics.html` / `osnovy-programmirovaniya-kotlin.html`
 * without a content edit is a regression.
 *
 * Usage: `npm run study:golden`
 */
import { spawn } from "node:child_process";

// One command string: with `shell: true`, an args array triggers DEP0190 on
// Node 22+ (it is concatenated unescaped anyway).
const child = spawn(
  "npx vitest run src/features/study/components/study-render-golden.test.tsx",
  {
    stdio: "inherit",
    // `shell: true` is required for `npx` on Windows.
    shell: true,
    env: { ...process.env, STUDY_GOLDEN_UPDATE: "1" },
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`study:golden stopped by ${signal}`);
    process.exit(1);
  }

  process.exit(code ?? 1);
});
