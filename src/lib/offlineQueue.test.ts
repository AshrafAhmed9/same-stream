import { describe, it, expect } from "vitest";
import { readQueue, enqueueById, dequeueById, type QueueStorage } from "./offlineQueue";

function fakeStorage(): QueueStorage {
  let value: string | null = null;
  return {
    get: () => value,
    set: (v: string) => {
      value = v;
    },
  };
}

describe("offline queue", () => {
  it("starts empty", () => {
    expect(readQueue(fakeStorage())).toEqual([]);
  });

  it("enqueues an item", () => {
    const s = fakeStorage();
    enqueueById(s, "id", { id: "a", val: 1 });
    expect(readQueue(s)).toEqual([{ id: "a", val: 1 }]);
  });

  it("replaces (not duplicates) an item with the same id on re-enqueue", () => {
    const s = fakeStorage();
    enqueueById(s, "id", { id: "a", val: 1 });
    enqueueById(s, "id", { id: "a", val: 2 });
    expect(readQueue(s)).toEqual([{ id: "a", val: 2 }]);
  });

  it("keeps multiple distinct items", () => {
    const s = fakeStorage();
    enqueueById(s, "id", { id: "a", val: 1 });
    enqueueById(s, "id", { id: "b", val: 2 });
    expect(readQueue(s)).toHaveLength(2);
  });

  it("dequeues by id, leaving others intact", () => {
    const s = fakeStorage();
    enqueueById(s, "id", { id: "a", val: 1 });
    enqueueById(s, "id", { id: "b", val: 2 });
    dequeueById(s, "id", "a");
    expect(readQueue(s)).toEqual([{ id: "b", val: 2 }]);
  });

  it("dequeuing a missing id is a no-op", () => {
    const s = fakeStorage();
    enqueueById(s, "id", { id: "a", val: 1 });
    dequeueById(s, "id", "nonexistent");
    expect(readQueue(s)).toEqual([{ id: "a", val: 1 }]);
  });

  it("recovers from corrupted storage instead of throwing", () => {
    const s: QueueStorage = { get: () => "{not json", set: () => {} };
    expect(readQueue(s)).toEqual([]);
  });
});
