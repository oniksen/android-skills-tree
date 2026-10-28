"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchStudyMaterial, type StudyMaterialContent } from "../study-material";

export function useStudyMaterial(id: string | null | undefined) {
  return useQuery<StudyMaterialContent | null>({
    queryKey: ["studyMaterial", id],
    queryFn: () => fetchStudyMaterial(id as string),
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  });
}
