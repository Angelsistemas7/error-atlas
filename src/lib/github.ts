import type { ErrorEntry } from "./types";

export type GithubIssueResult = {
  id: number;
  title: string;
  url: string;
  repo: string;
  state: "open" | "closed";
  isPullRequest: boolean;
  number: number;
};

const TAG_TO_REPO: Record<string, string> = {
  react: "react/react",
  nextjs: "vercel/next.js",
  typescript: "microsoft/TypeScript",
};

function buildSearchQuery(error: ErrorEntry): string {
  const repo = error.tags.map((tag) => TAG_TO_REPO[tag]).find(Boolean);
  const quotedTitle = `"${error.title.split(":").pop()?.trim() ?? error.title}"`;
  return repo ? `${quotedTitle} repo:${repo}` : `${quotedTitle} in:title`;
}

/**
 * Busca issues/PRs reales en GitHub relacionados a un error, vía la API
 * pública de búsqueda. Nunca inventa un resumen del issue: solo muestra lo
 * que la API devuelve tal cual (título, estado, link).
 */
export async function fetchRelatedGithubIssues(
  error: ErrorEntry,
  limit = 5
): Promise<GithubIssueResult[]> {
  const query = buildSearchQuery(error);
  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=${limit}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const items: unknown[] = Array.isArray(data.items) ? data.items : [];

    return items.map((rawItem) => {
      const item = rawItem as {
        id: number;
        title: string;
        html_url: string;
        state: "open" | "closed";
        pull_request?: unknown;
        number: number;
        repository_url: string;
      };
      return {
        id: item.id,
        title: item.title,
        url: item.html_url,
        state: item.state,
        isPullRequest: Boolean(item.pull_request),
        number: item.number,
        repo: item.repository_url.replace("https://api.github.com/repos/", ""),
      };
    });
  } catch {
    return [];
  }
}
