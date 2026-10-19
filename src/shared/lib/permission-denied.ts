export function isPermissionDenied(error: unknown): boolean {
  if (!error) return false;
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? (error as { code?: unknown }).code
      : undefined;
  return code === "permission-denied";
}
