export type ErrorSolution = {
  title: string;
  detail: string;
};

export type ErrorSource = {
  type: "github_issue" | "github_pr";
  url: string;
  label: string;
  repo: string;
  number: number;
  foundAt: string;
};

export type ErrorEntry = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  causes: string[];
  solutions: ErrorSolution[];
  affected: string[];
  tags: string[];
  /** Issues/PRs reales encontrados por el bot semanal — nunca un resumen generado, solo lo que la API de GitHub devuelve. */
  sources?: ErrorSource[];
};
