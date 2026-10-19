import { redirect } from "next/navigation";
import { getCurrentUser } from "@/adapters/auth/session";
import ProjectsClient from "@/features/projects/components/ProjectsClient";

export default async function ProjectsPage() {
  const uid = await getCurrentUser();
  if (!uid) redirect("/login");

  return <ProjectsClient />;
}
