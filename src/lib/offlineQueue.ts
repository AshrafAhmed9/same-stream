/**
 * Pure queue logic for retrying a failed submission, separated from
 * main.ts so it's unit-testable without a browser/localStorage mock for
 * every test. Storage itself stays a thin wrapper the caller provides.
 */
export interface QueueStorage {
  get(): string | null;
  set(value: string): void;
}

export function localStorageQueue(key: string): QueueStorage {
  return {
    get: () => localStorage.getItem(key),
    set: (v: string) => localStorage.setItem(key, v),
  };
}

export function readQueue<T>(storage: QueueStorage): T[] {
  try {
    return JSON.parse(storage.get() ?? "[]");
  } catch {
    return [];
  }
}

/** Adds/replaces an item by id, so a retry of a still-failing submission
 * never duplicates the queued entry. */
export function enqueueById<T extends Record<string, unknown>>(
  storage: QueueStorage,
  idField: keyof T,
  item: T
): void {
  const queue = readQueue<T>(storage);
  const without = queue.filter((p) => p[idField] !== item[idField]);
  without.push(item);
  storage.set(JSON.stringify(without));
}

export function dequeueById<T extends Record<string, unknown>>(
  storage: QueueStorage,
  idField: keyof T,
  id: unknown
): void {
  const queue = readQueue<T>(storage);
  storage.set(JSON.stringify(queue.filter((p) => p[idField] !== id)));
}
