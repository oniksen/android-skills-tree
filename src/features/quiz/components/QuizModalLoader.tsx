"use client";

import dynamic from "next/dynamic";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useAssessments } from "@/hooks/useAssessments";

const JuniorQuizModal = dynamic(() => import("./JuniorQuizModal"), { ssr: false });

export default function QuizModalLoader() {
  const { uid, loading: authLoading } = useFirebaseAuth();
  const { assessmentMap, loading: assessmentsLoading } = useAssessments();

  const hasCompletedSubtopic = Object.values(assessmentMap).some((a) =>
    a?.subtopics ? Object.values(a.subtopics).some(Boolean) : false,
  );

  if (authLoading || assessmentsLoading) return null;
  if (!uid || !hasCompletedSubtopic) return null;

  return <JuniorQuizModal />;
}