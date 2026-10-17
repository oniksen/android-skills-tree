import { redirect } from "next/navigation";
import { getCurrentUser } from "@/adapters/auth/session";
import ProfileContent from "@/components/profile/ProfileContent";

export default async function ProfilePage() {
  const uid = await getCurrentUser();
  if (!uid) redirect("/login");

  return <ProfileContent />;
}
