"use client";
import { useEffect, useState } from "react";
import { checkLevelUp } from "@/app/actions/assessments";
import CelebrationModal from "@/components/shared/CelebrationModal";

export default function LevelUpHandler() {
  const [result, setResult] = useState<{ fromLevel: string; toLevel: string; score: number } | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked) return;
    setChecked(true);
    const run = async () => {
      try {
        const r = await checkLevelUp();
        if (r) setResult(r);
      } catch {}
    };
    run();
  }, [checked]);

  if (!result) return null;

  return (
    <CelebrationModal open={true} levelName={result.toLevel} onClose={() => {
      setResult(null);
      window.location.reload();
    }} />
  );
}
