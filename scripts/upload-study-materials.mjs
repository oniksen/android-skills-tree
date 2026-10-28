import fs from "node:fs";
import path from "node:path";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const root = process.cwd();
const contentDir = path.join(root, "content", "study-materials");

const serviceAccountPath =
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
  path.join(root, "android-dev-skill-tree-firebase-adminsdk-fbsvc-b79087e906.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("Service account file not found:", serviceAccountPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

async function main() {
  // collect local ids
  const localIds = new Set();
  const grades = fs.readdirSync(contentDir, { withFileTypes: true });
  for (const gradeEntry of grades) {
    if (!gradeEntry.isDirectory()) continue;
    const gradeDir = path.join(contentDir, gradeEntry.name);
    for (const file of fs.readdirSync(gradeDir).filter((f) => f.endsWith(".md"))) {
      localIds.add(file.replace(/\.md$/, ""));
    }
  }
  // delete stale docs
  const existing = await db.collection("studyMaterials").get();
  for (const doc of existing.docs) {
    if (!localIds.has(doc.id)) {
      await doc.ref.delete();
      console.log("deleted stale", doc.id);
    }
  }
  let count = 0;
  for (const gradeEntry of grades) {
    if (!gradeEntry.isDirectory()) continue;
    const grade = gradeEntry.name;
    const gradeDir = path.join(contentDir, grade);
    const files = fs.readdirSync(gradeDir).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      const id = file.replace(/\.md$/, "");
      const fullPath = path.join(gradeDir, file);
      const raw = fs.readFileSync(fullPath, "utf8");
      const titleMatch = raw.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].trim() : id;
      await db.collection("studyMaterials").doc(id).set(
        {
          id,
          title,
          grade,
          categoryId: id,
          content: raw,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
      count++;
      console.log(`uploaded ${grade}/${file}`);
    }
  }
  console.log(`done: ${count} materials`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
