type SessionReset = () => void;

const resets = new Set<SessionReset>();

/**
 * Registers a callback that clears per-user data when the signed-in user
 * changes (sign-out or account switch).
 */
export function registerSessionReset(reset: SessionReset): () => void {
  resets.add(reset);
  return () => {
    resets.delete(reset);
  };
}

export function resetSession(): void {
  resets.forEach((reset) => {
    try {
      reset();
    } catch (error) {
      console.error("Error resetting session data:", error);
    }
  });
}
