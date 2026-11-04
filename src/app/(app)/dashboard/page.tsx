import DashboardClient from "@/features/dashboard/components/DashboardClient";

// Auth is enforced by proxy.ts, so this page can stay static and be prefetched.
export default function DashboardPage() {
  return <DashboardClient />;
}
