import { redirect } from "next/navigation";
import { getCurrentUser } from "@/adapters/auth/session";
import AchievementsClient from "@/features/achievements/components/AchievementsClient";

export default async function AchievementsPage() {
  const uid = await getCurrentUser();
  if (!uid) redirect("/login");

  return <AchievementsClient />;
}
