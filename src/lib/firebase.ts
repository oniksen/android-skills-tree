import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { clientEnv } from "@/adapters/env/client";

const app = initializeApp({
  apiKey: clientEnv.apiKey,
  authDomain: clientEnv.authDomain,
  projectId: clientEnv.projectId,
  storageBucket: clientEnv.storageBucket,
  messagingSenderId: clientEnv.messagingSenderId,
  appId: clientEnv.appId,
});

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
