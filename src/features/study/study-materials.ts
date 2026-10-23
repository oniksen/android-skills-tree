import type { ComponentType } from "react";
import AndroidProjectStructureStudy from "./materials/android-project-structure";
import KotlinVariablesStudy from "./materials/kotlin-variables";
import KotlinConditionalsStudy from "./materials/kotlin-conditionals";

export interface StudyMaterial {
  id: string;
  title: string;
  component: ComponentType;
}

export const studyMaterials: Record<string, StudyMaterial> = {
  "android-project-structure": {
    id: "android-project-structure",
    title: "Как устроен Android-проект",
    component: AndroidProjectStructureStudy,
  },
  "kotlin-variables": {
    id: "kotlin-variables",
    title: "Переменные в Kotlin",
    component: KotlinVariablesStudy,
  },
  "kotlin-conditionals": {
    id: "kotlin-conditionals",
    title: "Условные конструкции в Kotlin",
    component: KotlinConditionalsStudy,
  },
};

export function getStudyMaterial(id?: string | null): StudyMaterial | undefined {
  if (!id) return undefined;
  return studyMaterials[id];
}
