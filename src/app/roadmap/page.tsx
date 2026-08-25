import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import RoadmapClient from "@/components/roadmap/RoadmapClient";

export default async function RoadmapPage() {
  const uid = await getCurrentUser();
  if (!uid) redirect("/login");

  return <RoadmapClient />;
}
