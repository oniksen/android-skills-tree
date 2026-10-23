import type { ComponentType } from "react";
import AndroidProjectStructureStudy from "./materials/android-project-structure";
import KotlinVariablesStudy from "./materials/kotlin-variables";
import KotlinConditionalsStudy from "./materials/kotlin-conditionals";
import KotlinTypesStudy from "./materials/kotlin-types";
import KotlinLoopsStudy from "./materials/kotlin-loops";
import KotlinFunctionsStudy from "./materials/kotlin-functions";
import KotlinOopBasicsStudy from "./materials/kotlin-oop-basics";
import KotlinCollectionsStudy from "./materials/kotlin-collections";
import KotlinErrorHandlingStudy from "./materials/kotlin-error-handling";
import KotlinSyntaxStudy from "./materials/kotlin-syntax";

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
  "kotlin-types": {
    id: "kotlin-types",
    title: "Типы данных в Kotlin",
    component: KotlinTypesStudy,
  },
  "kotlin-loops": {
    id: "kotlin-loops",
    title: "Циклы в Kotlin",
    component: KotlinLoopsStudy,
  },
  "kotlin-functions": {
    id: "kotlin-functions",
    title: "Функции в Kotlin",
    component: KotlinFunctionsStudy,
  },
  "kotlin-oop-basics": {
    id: "kotlin-oop-basics",
    title: "ООП основы в Kotlin",
    component: KotlinOopBasicsStudy,
  },
  "kotlin-collections": {
    id: "kotlin-collections",
    title: "Коллекции в Kotlin",
    component: KotlinCollectionsStudy,
  },
  "kotlin-error-handling": {
    id: "kotlin-error-handling",
    title: "Обработка ошибок в Kotlin",
    component: KotlinErrorHandlingStudy,
  },
  "kotlin-syntax": {
    id: "kotlin-syntax",
    title: "Синтаксис Kotlin",
    component: KotlinSyntaxStudy,
  },
};

export function getStudyMaterial(id?: string | null): StudyMaterial | undefined {
  if (!id) return undefined;
  return studyMaterials[id];
}
