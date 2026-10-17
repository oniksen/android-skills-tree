import { redirect } from "next/navigation";
import { getCurrentUser } from "@/adapters/auth/session";
import RoadmapClient from "@/features/roadmap/components/RoadmapClient";

export default async function RoadmapPage() {
  const uid = await getCurrentUser();
  if (!uid) redirect("/login");

  return <RoadmapClient />;
}
