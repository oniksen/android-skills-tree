"use client";
import { useEffect, useRef, useState } from "react";
import { checkLevelUp } from "@/lib/firestore-actions";
import CelebrationModal from "@/components/shared/CelebrationModal";

export default function LevelUpHandler() {
  const [result, setResult] = useState<{ fromLevel: string; toLevel: string; score: number } | null>(null);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    const run = async () => {
      try {
        const r = await checkLevelUp();
        if (r) setResult(r);
      } catch {}
    };
    run();
  }, []);

  if (!result) return null;

  return (
    <CelebrationModal open={true} levelName={result.toLevel} onClose={() => {
      setResult(null);
      window.location.reload();
    }} />
  );
}
