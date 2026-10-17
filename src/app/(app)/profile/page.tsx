import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ProfileContent from "@/components/profile/ProfileContent";

export default async function ProfilePage() {
  const uid = await getCurrentUser();
  if (!uid) redirect("/login");

  return <ProfileContent />;
}
