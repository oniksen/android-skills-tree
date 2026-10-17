import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "@/adapters/firestore-admin/admin-app";

export interface VerifiedUser {
  uid: string;
  email: string | null;
}

export async function verifyIdToken(idToken: string): Promise<VerifiedUser> {
  const decoded = await getAuth(getAdminApp()).verifyIdToken(idToken);
  return { uid: decoded.uid, email: decoded.email ?? null };
}
