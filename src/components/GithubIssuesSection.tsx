import { fetchRelatedGithubIssues } from "@/lib/github";
import type { ErrorEntry } from "@/lib/types";

export default async function GithubIssuesSection({ error }: { error: ErrorEntry }) {
  const issues = await fetchRelatedGithubIssues(error);

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold mb-3">Issues y PRs relacionados en GitHub</h2>

      {issues.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Sin resultados de la API de búsqueda de GitHub en este momento (o
          alcanzó el límite de peticiones sin autenticar). No se muestra
          contenido inventado en su lugar.
        </p>
      ) : (
        <ul className="space-y-2">
          {issues.map((issue) => (
            <li key={issue.id}>
              <a
                href={issue.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-sm hover:underline"
              >
                <span
                  className={`mt-0.5 shrink-0 text-xs px-1.5 py-0.5 rounded ${
                    issue.state === "open"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                      : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400"
                  }`}
                >
                  {issue.isPullRequest ? "PR" : "issue"} · {issue.state}
                </span>
                <span>
                  {issue.title}{" "}
                  <span className="text-neutral-400">
                    ({issue.repo}#{issue.number})
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-neutral-400 mt-3">
        Resultados en vivo de la API pública de búsqueda de GitHub — nunca un
        resumen generado, siempre el título y estado reales del issue/PR.
      </p>
    </section>
  );
}
