import ProjectsClient from "@/features/projects/components/ProjectsClient";

// Auth is enforced by proxy.ts, so this page can stay static and be prefetched.
export default function ProjectsPage() {
  return <ProjectsClient />;
}
