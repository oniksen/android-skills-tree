import { redirect } from "next/navigation";
import { getCurrentUser } from "@/adapters/auth/session";
import ShopClient from "@/features/shop/components/ShopClient";

export default async function ShopPage() {
  const uid = await getCurrentUser();
  if (!uid) redirect("/login");

  return <ShopClient />;
}
