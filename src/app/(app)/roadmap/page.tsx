import RoadmapClient from "@/features/roadmap/components/RoadmapClient";

// Auth is enforced by proxy.ts, so this page can stay static and be prefetched.
export default function RoadmapPage() {
  return <RoadmapClient />;
}
