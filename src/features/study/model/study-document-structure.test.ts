import { expect, it } from "vitest";
import { parseStudyDocument, type StudyDocument } from "./parse-study-document";
import { STUDY_MATERIALS } from "../study-materials.generated";

function structure(document: StudyDocument) {
  return {
    title: document.meta.title,
    sections: document.sections.map((section) => ({
      title: section.title,
      sources: section.isSources,
      blocks: section.blocks.map((block) => block.type),
    })),
  };
}

for (const material of Object.values(STUDY_MATERIALS)) {
  it(`${material.id}: структура документа стабильна`, () => {
    const document = parseStudyDocument(material.content, {
      grade: material.grade,
    });
    expect(document).not.toBeNull();
    expect(structure(document!)).toMatchSnapshot();
  });
}
