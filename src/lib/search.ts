import Fuse from "fuse.js";
import type { ErrorEntry } from "./types";

export function createErrorSearchIndex(errors: ErrorEntry[]) {
  return new Fuse(errors, {
    keys: [
      { name: "title", weight: 0.6 },
      { name: "summary", weight: 0.2 },
      { name: "tags", weight: 0.15 },
      { name: "affected", weight: 0.05 },
    ],
    threshold: 0.4,
    ignoreLocation: true,
  });
}

export function searchErrors(errors: ErrorEntry[], query: string, limit = 8): ErrorEntry[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const index = createErrorSearchIndex(errors);
  return index
    .search(trimmed)
    .slice(0, limit)
    .map((result) => result.item);
}
