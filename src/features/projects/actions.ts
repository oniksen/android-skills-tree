"use server";

import { requireUid } from "@/adapters/auth/session";
import { setProjectCompletion } from "@/adapters/firestore-admin/progress";
import { fsPath, getAdminDb } from "@/adapters/firestore-admin/admin-app";
import { userProjectPath } from "@/adapters/firestore-client/paths";

export async function toggleProjectCompletionAction(
  projectId: string,
  completed: boolean,
): Promise<boolean> {
  const uid = await requireUid();
  await setProjectCompletion(uid, projectId, completed);
  return true;
}

export async function deleteProjectProgressAction(
  projectIds: string[],
): Promise<boolean> {
  const uid = await requireUid();
  if (projectIds.length === 0) return true;

  const db = getAdminDb();
  const batch = db.batch();
  for (const projectId of projectIds) {
    batch.delete(db.doc(fsPath(userProjectPath(uid, projectId))));
  }
  await batch.commit();
  return true;
}
