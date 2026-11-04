import AchievementsClient from "@/features/achievements/components/AchievementsClient";

// Auth is enforced by proxy.ts, so this page can stay static and be prefetched.
export default function AchievementsPage() {
  return <AchievementsClient />;
}
