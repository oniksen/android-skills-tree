import { renderToStaticMarkup } from "react-dom/server";
import { bench, describe } from "vitest";
import { parseStudyDocument } from "../model/parse-study-document";
import { STUDY_MATERIALS } from "../study-materials.generated";
import StudyMarkdownRenderer from "./StudyMarkdownRenderer";

const materials = Object.values(STUDY_MATERIALS);

/** Long enough per case to get a usable sample count on a full page render. */
const OPTIONS = { time: 8000, warmupTime: 1000, warmupIterations: 2 };

describe("study parse", () => {
  for (const material of materials) {
    bench(
      material.id,
      () => {
        parseStudyDocument(material.content, { grade: material.grade });
      },
      OPTIONS,
    );
  }
});

describe("study render", () => {
  for (const material of materials) {
    bench(
      material.id,
      () => {
        renderToStaticMarkup(
          <StudyMarkdownRenderer
            content={material.content}
            grade={material.grade}
          />,
        );
      },
      OPTIONS,
    );
  }
});
