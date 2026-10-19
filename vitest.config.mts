import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    env: {
      NEXT_PUBLIC_FIREBASE_API_KEY: "test-api-key",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "test.firebaseapp.com",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "test-project",
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "test.appspot.com",
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "000000000000",
      NEXT_PUBLIC_FIREBASE_APP_ID: "1:000000000000:web:test",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/core/**",
        "src/lib/firestore.ts",
        "src/lib/firestore-actions.ts",
        "src/adapters/firestore-client/*-commands.ts",
        "src/shared/lib/permission-denied.ts",
        "src/shared/lib/toast-state.ts",
      ],
      thresholds: {
        lines: 50,
        functions: 50,
        branches: 50,
        statements: 50,
      },
    },
  },
});
