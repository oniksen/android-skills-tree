"use client";

import { useState, useEffect, useCallback } from "react";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface Subtopic {
  name: string;
  completed: boolean;
}

interface SkillCheckboxProps {
  skillId: string;
  skillName: string;
  subtopics: Subtopic[];
  onProgressChange?: (completed: boolean) => void;
}

export function SkillCheckbox({ skillId, skillName, subtopics, onProgressChange }: SkillCheckboxProps) {
  const [localSubtopics, setLocalSubtopics] = useState<Subtopic[]>(subtopics);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = auth.currentUser;

  // Sync local state with Firestore on mount
  useEffect(() => {
    if (!user) return;

    const assessmentRef = doc(db, "users", user.uid, "assessments", skillId);
    const unsub = onSnapshot(assessmentRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data?.subtopics) {
          setLocalSubtopics(
            subtopics.map((st) => ({
              ...st,
              completed: data.subtopics[st.name] === true,
            }))
          );
        }
      }
    });

    return () => unsub();
  }, [skillId, user, subtopics]);

  // Calculate overall skill completion
  const allCompleted = localSubtopics.every((st) => st.completed);
  const completionPercentage = Math.round(
    (localSubtopics.filter((st) => st.completed).length / localSubtopics.length) * 100
  );

  const handleToggle = useCallback(
    async (clickedName: string) => {
      if (!user) return;

      setIsSubmitting(true);

      const assessmentRef = doc(db, "users", user.uid, "assessments", skillId);

      // Find the index of the clicked subtopic
      const subtopicIndex = localSubtopics.findIndex((st) => st.name === clickedName);

      // Create updated subtopics list
      const updatedSubtopics = localSubtopics.map((st, idx) => {
        if (idx === subtopicIndex) {
          return { ...st, completed: !st.completed };
        }
        return st;
      });

      // Convert to the map format expected by Firestore
      const subtopicsMap = updatedSubtopics.reduce(
        (acc, st) => ({ ...acc, [st.name]: st.completed }),
        {} as Record<string, boolean>
      );

      try {
        await updateDoc(assessmentRef, {
          subtopics: subtopicsMap,
          // Calculate score based on completion ratio
          score:
            updatedSubtopics.length > 0
              ? Math.round(
                  (updatedSubtopics.filter((s) => s.completed).length / updatedSubtopics.length) * 5
                )
              : 0,
          completed: updatedSubtopics.every((s) => s.completed),
          updatedAt: new Date(),
        });

        // Recalculate completion state
        const newAllCompleted = updatedSubtopics.every((s) => s.completed);
        onProgressChange?.(newAllCompleted);
      } catch (error) {
        console.error("Error updating subtopic:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [skillId, user, localSubtopics, onProgressChange]
  );

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between pb-1 border-b border-slate-700">
        <span className="text-sm text-slate-300 font-medium">{skillName}</span>
        <span className="text-xs text-slate-500">
          {completionPercentage}%
        </span>
      </div>

      {localSubtopics.map((subtopic) => (
        <div key={subtopic.name} className="flex items-center gap-2 py-1">
          <input
            type="checkbox"
            name={subtopic.name}
            checked={subtopic.completed}
            onChange={() => handleToggle(subtopic.name)}
            className="w-4 h-4 rounded border-slate-600 cursor-pointer"
            disabled={isSubmitting}
          />
          <span
            className={`text-sm text-slate-300 ${subtopic.completed ? "line-through text-slate-500" : ""}`}
          >
            {subtopic.name}
          </span>
        </div>
      ))}
    </div>
  );
}