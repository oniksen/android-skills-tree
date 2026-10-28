export function isQuotaExceeded(error: unknown): boolean {
  if (!error) return false;
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? (error as { code?: unknown }).code
      : undefined;
  return code === "resource-exhausted";
}
