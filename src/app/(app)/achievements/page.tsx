import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AchievementsClient from "@/components/achievements/AchievementsClient";

export default async function AchievementsPage() {
  const uid = await getCurrentUser();
  if (!uid) redirect("/login");

  return <AchievementsClient />;
}
