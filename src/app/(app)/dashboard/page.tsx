import { redirect } from "next/navigation";
import { getCurrentUser } from "@/adapters/auth/session";
import DashboardClient from "@/features/dashboard/components/DashboardClient";

export default async function DashboardPage() {
  const uid = await getCurrentUser();
  if (!uid) redirect("/login");

  return <DashboardClient />;
}
