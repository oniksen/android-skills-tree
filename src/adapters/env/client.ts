import { z } from "zod";

const clientEnvSchema = z.object({
  apiKey: z.string().min(1),
  authDomain: z.string().min(1),
  projectId: z.string().min(1),
  storageBucket: z.string().min(1),
  messagingSenderId: z.string().min(1),
  appId: z.string().min(1),
});

const parsed = clientEnvSchema.safeParse({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

if (!parsed.success) {
  const missing = Object.keys(parsed.error.flatten().fieldErrors).join(", ");
  throw new Error(
    `Invalid Firebase client configuration. Missing or empty env vars: ${missing}. ` +
      "See .env.example for the required NEXT_PUBLIC_FIREBASE_* variables.",
  );
}

export const clientEnv = parsed.data;
