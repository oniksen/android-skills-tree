import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const uid = await getCurrentUser();
  if (!uid) redirect("/login");

  return <DashboardClient />;
}
