import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ShopClient from "@/components/shop/ShopClient";

export default async function ShopPage() {
  const uid = await getCurrentUser();
  if (!uid) redirect("/login");

  return <ShopClient />;
}
