#!/usr/bin/env node
/**
 * Busca, en los últimos 7 días, issues/PRs reales de GitHub relacionados a
 * cada error del catálogo, y los agrega a `sources` en errors.json si son
 * nuevos. No inventa ni resume nada — solo persiste título/estado/link
 * reales devueltos por la API pública de búsqueda de GitHub.
 *
 * Pensado para correr en un job periódico de GitHub Actions que abre un PR
 * con el diff (ver .github/workflows/related-issues.yml). Nunca hace commit
 * directo a main ni automerge — el diff siempre pasa por revisión humana.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const errorsPath = path.join(__dirname, "..", "src", "data", "errors.json");

const TAG_TO_REPO = {
  react: "react/react",
  nextjs: "vercel/next.js",
  typescript: "microsoft/TypeScript",
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Deliberadamente conservador: solo construye una query cuando el error
 * tiene un repo de referencia conocido (ver TAG_TO_REPO). Sin un repo:
 * qualifier, una búsqueda por título de un error genérico (ej. "Failed to
 * fetch") devuelve demasiado ruido de proyectos no relacionados — se
 * probó en vivo y la señal era mala. Mejor cubrir menos errores que
 * ensuciar el catálogo con fuentes irrelevantes.
 */
function buildQuery(error) {
  const repo = error.tags.map((tag) => TAG_TO_REPO[tag]).find(Boolean);
  if (!repo) return null;

  const createdSince = new Date(Date.now() - SEVEN_DAYS_MS).toISOString().slice(0, 10);
  return `"${error.title}" repo:${repo} created:>${createdSince}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function searchGithub(query) {
  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=5`;
  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    console.error(`  GitHub search falló (${response.status}) para: ${query}`);
    return [];
  }
  const data = await response.json();
  return Array.isArray(data.items) ? data.items : [];
}

async function main() {
  const errors = JSON.parse(readFileSync(errorsPath, "utf8"));
  let changed = false;

  for (const error of errors) {
    const query = buildQuery(error);
    if (!query) continue;

    const items = await searchGithub(query);
    await sleep(1500); // evitar el rate limit de la API de búsqueda

    for (const item of items) {
      const existing = error.sources ?? [];
      const alreadyKnown = existing.some((source) => source.url === item.html_url);
      if (alreadyKnown) continue;

      const repo = item.repository_url.replace("https://api.github.com/repos/", "");
      const source = {
        type: item.pull_request ? "github_pr" : "github_issue",
        url: item.html_url,
        label: item.title,
        repo,
        number: item.number,
        foundAt: new Date().toISOString().slice(0, 10),
      };

      error.sources = [...existing, source];
      changed = true;
      console.log(`+ ${error.slug}: ${source.type} ${repo}#${source.number} — ${source.label}`);
    }
  }

  if (changed) {
    writeFileSync(errorsPath, JSON.stringify(errors, null, 2) + "\n", "utf8");
    console.log("errors.json actualizado.");
  } else {
    console.log("Sin novedades esta semana.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
