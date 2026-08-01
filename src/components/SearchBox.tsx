"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ErrorEntry } from "@/lib/types";
import { searchErrors } from "@/lib/search";

export default function SearchBox({ errors }: { errors: ErrorEntry[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchErrors(errors, query), [errors, query]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Pega tu error, ej. Hydration failed..."
        className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue-500"
        autoFocus
      />

      {query.trim() && (
        <ul className="mt-3 divide-y divide-neutral-200 dark:divide-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          {results.length === 0 && (
            <li className="px-4 py-3 text-sm text-neutral-500">
              Sin resultados todavía para &quot;{query}&quot;. El atlas sigue creciendo.
            </li>
          )}
          {results.map((error) => (
            <li key={error.slug}>
              <Link
                href={`/error/${error.slug}`}
                className="block px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <p className="font-medium">{error.title}</p>
                <p className="text-sm text-neutral-500 mt-0.5">{error.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
