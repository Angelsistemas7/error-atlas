import Link from "next/link";
import { getAllErrors, getAllTags } from "@/lib/errors";

export default function BrowsePage() {
  const tags = getAllTags();
  const errors = getAllErrors();

  return (
    <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Volver a la búsqueda
      </Link>

      <h1 className="text-2xl font-bold mt-4">Explorar por categoría</h1>
      <p className="text-neutral-500 mt-1">
        {errors.length} errores, agrupados por tag.
      </p>

      <div className="flex flex-wrap gap-2 mt-6">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/browse/${tag}`}
            className="text-sm px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
          >
            #{tag} <span className="text-neutral-400">({count})</span>
          </Link>
        ))}
      </div>

      <h2 className="text-lg font-semibold mt-10 mb-3">Todos los errores</h2>
      <ul className="divide-y divide-neutral-200 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        {errors.map((error) => (
          <li key={error.slug}>
            <Link
              href={`/error/${error.slug}`}
              className="block px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
            >
              <p className="font-medium text-sm">{error.title}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{error.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
