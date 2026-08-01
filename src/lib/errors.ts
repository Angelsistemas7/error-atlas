import rawErrors from "@/data/errors.json";
import type { ErrorEntry } from "./types";

const errors = rawErrors as ErrorEntry[];

export function getAllErrors(): ErrorEntry[] {
  return errors;
}

export function getErrorBySlug(slug: string): ErrorEntry | undefined {
  return errors.find((error) => error.slug === slug);
}
