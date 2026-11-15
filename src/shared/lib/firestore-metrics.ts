interface FirestoreMetrics {
  reads: number;
  writes: number;
  bySource: Record<string, number>;
}

let metrics: FirestoreMetrics = { reads: 0, writes: 0, bySource: {} };

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function recordRead(source: string, count: number = 1): void {
  if (isProduction()) return;
  metrics.reads += count;
  metrics.bySource[source] = (metrics.bySource[source] ?? 0) + count;
}

export function recordWrite(source: string, count: number = 1): void {
  if (isProduction()) return;
  metrics.writes += count;
  metrics.bySource[source] = (metrics.bySource[source] ?? 0) + count;
}

export function getFirestoreMetrics(): FirestoreMetrics {
  return {
    reads: metrics.reads,
    writes: metrics.writes,
    bySource: { ...metrics.bySource },
  };
}

export function resetFirestoreMetrics(): void {
  metrics = { reads: 0, writes: 0, bySource: {} };
}

if (!isProduction() && typeof window !== "undefined") {
  (window as unknown as { __firestoreMetrics?: unknown }).__firestoreMetrics = {
    get: getFirestoreMetrics,
    reset: resetFirestoreMetrics,
  };
}