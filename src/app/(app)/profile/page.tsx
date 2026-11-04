import ProfileContent from "@/features/profile/components/ProfileContent";

// Auth is enforced by proxy.ts, so this page can stay static and be prefetched.
export default function ProfilePage() {
  return <ProfileContent />;
}
