import rawErrors from "@/data/errors.json";
import type { ErrorEntry } from "./types";

const errors = rawErrors as ErrorEntry[];

export function getAllErrors(): ErrorEntry[] {
  return errors;
}

export function getErrorBySlug(slug: string): ErrorEntry | undefined {
  return errors.find((error) => error.slug === slug);
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const error of errors) {
    for (const tag of error.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getErrorsByTag(tag: string): ErrorEntry[] {
  return errors.filter((error) => error.tags.includes(tag));
}
