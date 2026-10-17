import { z } from "zod";

const serverEnvSchema = z.object({
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
});

const parsed = serverEnvSchema.safeParse({
  AUTH_SECRET: process.env.AUTH_SECRET,
});

if (!parsed.success) {
  const missing = Object.keys(parsed.error.flatten().fieldErrors).join(", ");
  throw new Error(
    `Invalid server configuration. Missing or empty env vars: ${missing}. ` +
      "See .env.example for the required server variables.",
  );
}

export const serverEnv = parsed.data;
