const chains = new Map<string, Promise<unknown>>();

export function runExclusive<T>(uid: string, task: () => Promise<T>): Promise<T> {
  const previous = chains.get(uid) ?? Promise.resolve();
  const result = previous.then(task, task);
  const tail = result.then(
    () => undefined,
    () => undefined,
  );
  chains.set(uid, tail);
  void tail.finally(() => {
    if (chains.get(uid) === tail) chains.delete(uid);
  });
  return result;
}
