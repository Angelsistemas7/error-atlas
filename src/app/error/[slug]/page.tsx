import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllErrors, getErrorBySlug } from "@/lib/errors";

export function generateStaticParams() {
  return getAllErrors().map((error) => ({ slug: error.slug }));
}

export default async function ErrorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const error = getErrorBySlug(slug);

  if (!error) {
    notFound();
  }

  return (
    <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Volver a la búsqueda
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold mt-4 leading-snug">
        {error.title}
      </h1>
      <p className="text-neutral-500 mt-2">{error.description}</p>

      <div className="flex flex-wrap gap-2 mt-4">
        {error.affected.map((item) => (
          <span
            key={item}
            className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
          >
            {item}
          </span>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Causas conocidas</h2>
        <ol className="space-y-2 list-decimal list-inside text-neutral-700 dark:text-neutral-300">
          {error.causes.map((cause) => (
            <li key={cause}>{cause}</li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">
          Soluciones, ordenadas por probabilidad
        </h2>
        <ol className="space-y-4">
          {error.solutions.map((solution, index) => (
            <li
              key={solution.title}
              className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4"
            >
              <p className="font-medium">
                {index + 1}. {solution.title}
              </p>
              <p className="text-sm text-neutral-500 mt-1">{solution.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {error.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full border border-neutral-200 dark:border-neutral-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
