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
import KotlinNullSafetyStudy from "./materials/kotlin-null-safety";
import KotlinDataClassStudy from "./materials/kotlin-data-class";
import KotlinExtensionFunctionsStudy from "./materials/kotlin-extension-functions";
import KotlinLambdaStudy from "./materials/kotlin-lambda";
import KotlinHigherOrderFunctionsStudy from "./materials/kotlin-higher-order-functions";
import KotlinScopeFunctionsStudy from "./materials/kotlin-scope-functions";

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
  "kotlin-null-safety": {
    id: "kotlin-null-safety",
    title: "Null Safety в Kotlin",
    component: KotlinNullSafetyStudy,
  },
  "kotlin-data-class": {
    id: "kotlin-data-class",
    title: "Data Class в Kotlin",
    component: KotlinDataClassStudy,
  },
  "kotlin-extension-functions": {
    id: "kotlin-extension-functions",
    title: "Extension Functions в Kotlin",
    component: KotlinExtensionFunctionsStudy,
  },
  "kotlin-lambda": {
    id: "kotlin-lambda",
    title: "Лямбды в Kotlin",
    component: KotlinLambdaStudy,
  },
  "kotlin-higher-order-functions": {
    id: "kotlin-higher-order-functions",
    title: "Функции высшего порядка в Kotlin",
    component: KotlinHigherOrderFunctionsStudy,
  },
  "kotlin-scope-functions": {
    id: "kotlin-scope-functions",
    title: "Scope Functions в Kotlin",
    component: KotlinScopeFunctionsStudy,
  },
};

export function getStudyMaterial(id?: string | null): StudyMaterial | undefined {
  if (!id) return undefined;
  return studyMaterials[id];
}
