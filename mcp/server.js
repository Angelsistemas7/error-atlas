#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const errorsPath = path.join(__dirname, "..", "src", "data", "errors.json");
const errors = JSON.parse(readFileSync(errorsPath, "utf8"));

function matches(error, query) {
  const q = query.toLowerCase();
  return [error.title, error.summary, ...error.tags].some((text) =>
    text.toLowerCase().includes(q)
  );
}

function formatEntry(error) {
  const causes = error.causes.map((c, i) => `${i + 1}. ${c}`).join("\n");
  const solutions = error.solutions
    .map((s, i) => `${i + 1}. ${s.title} — ${s.detail}`)
    .join("\n");

  return [
    `# ${error.title}`,
    "",
    error.description,
    "",
    `Afecta: ${error.affected.join(", ")}`,
    `Tags: ${error.tags.map((t) => "#" + t).join(" ")}`,
    "",
    "## Causas conocidas",
    causes,
    "",
    "## Soluciones (orden de probabilidad)",
    solutions,
  ].join("\n");
}

const server = new McpServer({
  name: "error-atlas",
  version: "1.0.0",
});

server.registerTool(
  "search_errors",
  {
    title: "Buscar en Error Atlas",
    description:
      "Busca errores de desarrollo conocidos en el catálogo de Error Atlas por texto (mensaje de error, framework o tag). Devuelve una lista de coincidencias con su slug — usa get_error con el slug para el detalle completo.",
    inputSchema: {
      query: z.string().describe("Texto a buscar, ej. el mensaje de error exacto"),
    },
  },
  async ({ query }) => {
    const results = errors.filter((error) => matches(error, query));

    if (results.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `Sin resultados para "${query}" en el catálogo de Error Atlas (${errors.length} errores documentados). No es necesariamente que el error no exista — el catálogo es curado a mano y sigue creciendo.`,
          },
        ],
      };
    }

    const list = results
      .map((error) => `- ${error.slug}: ${error.title}`)
      .join("\n");

    return {
      content: [{ type: "text", text: list }],
    };
  }
);

server.registerTool(
  "get_error",
  {
    title: "Ver ficha completa de un error",
    description:
      "Devuelve la ficha completa de un error del catálogo de Error Atlas (descripción, causas conocidas, soluciones ordenadas por probabilidad) dado su slug exacto.",
    inputSchema: {
      slug: z.string().describe("El slug exacto del error, obtenido de search_errors"),
    },
  },
  async ({ slug }) => {
    const error = errors.find((e) => e.slug === slug);

    if (!error) {
      return {
        content: [
          { type: "text", text: `No existe ningún error con slug "${slug}" en el catálogo.` },
        ],
        isError: true,
      };
    }

    return {
      content: [{ type: "text", text: formatEntry(error) }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
