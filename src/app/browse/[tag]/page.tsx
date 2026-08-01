import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTags, getErrorsByTag } from "@/lib/errors";

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const errors = getErrorsByTag(tag);

  if (errors.length === 0) {
    notFound();
  }

  return (
    <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
      <Link href="/browse" className="text-sm text-blue-600 hover:underline">
        ← Todas las categorías
      </Link>

      <h1 className="text-2xl font-bold mt-4">#{tag}</h1>
      <p className="text-neutral-500 mt-1">
        {errors.length} error{errors.length === 1 ? "" : "es"}
      </p>

      <ul className="divide-y divide-neutral-200 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mt-6">
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
