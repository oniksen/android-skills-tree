import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
} from "firebase/app-check";
import { clientEnv } from "@/adapters/env/client";

const app = initializeApp({
  apiKey: clientEnv.apiKey,
  authDomain: clientEnv.authDomain,
  projectId: clientEnv.projectId,
  storageBucket: clientEnv.storageBucket,
  messagingSenderId: clientEnv.messagingSenderId,
  appId: clientEnv.appId,
});

type GlobalWithFirebase = typeof globalThis & {
  __androidSkillsFirestore?: Firestore;
  __appCheckInitialized?: boolean;
};

const globalScope = globalThis as GlobalWithFirebase;

export const db: Firestore =
  typeof window === "undefined"
    ? (globalScope.__androidSkillsFirestore ??
      (globalScope.__androidSkillsFirestore = initializeFirestore(app, {
        // A single `undefined` field value makes Firestore reject the whole
        // write ("Unsupported field value: undefined"), which used to keep the
        // user state document from ever being created. Optional fields are
        // already omitted when normalized; this is the transport-level guard.
        ignoreUndefinedProperties: true,
      })))
    : (globalScope.__androidSkillsFirestore ??
      (globalScope.__androidSkillsFirestore = initializeFirestore(app, {
        ignoreUndefinedProperties: true,
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      })));

export const auth = getAuth(app);

if (typeof window !== "undefined" && clientEnv.appCheckSiteKey) {
  if (!globalScope.__appCheckInitialized) {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(clientEnv.appCheckSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
    globalScope.__appCheckInitialized = true;
  }
}

export default app;
