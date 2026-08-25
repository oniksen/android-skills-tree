import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration - read from environment variables
// Set these in .env.local or Vercel dashboard (NEXT_PUBLIC_ prefix for client access)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBdj4zq4AM5ENYZ3XZk9refsOJaeUBed7A",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "android-dev-skill-tree.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "android-dev-skill-tree",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "android-dev-skill-tree.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "916873454999",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:916873454999:web:bdb63831e2652f322c50d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore and Auth instances
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;