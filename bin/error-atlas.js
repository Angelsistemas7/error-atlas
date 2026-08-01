#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const errorsPath = path.join(__dirname, "..", "src", "data", "errors.json");
const errors = JSON.parse(fs.readFileSync(errorsPath, "utf8"));

function score(error, query) {
  const q = query.toLowerCase();
  const haystacks = [error.title, error.summary, ...error.tags];
  let best = 0;
  for (const text of haystacks) {
    if (text.toLowerCase().includes(q)) best = Math.max(best, 1);
  }
  return best;
}

function search(query) {
  return errors
    .map((error) => ({ error, matched: score(error, query) }))
    .filter((entry) => entry.matched > 0)
    .map((entry) => entry.error);
}

function printError(error) {
  console.log(`\n${error.title}`);
  console.log(`  ${error.summary}\n`);
  console.log("  Causas conocidas:");
  error.causes.forEach((cause, i) => console.log(`   ${i + 1}. ${cause}`));
  console.log("\n  Soluciones (orden de probabilidad):");
  error.solutions.forEach((solution, i) =>
    console.log(`   ${i + 1}. ${solution.title} — ${solution.detail}`)
  );
  console.log(`\n  Afecta: ${error.affected.join(", ")}`);
  console.log(`  Tags: ${error.tags.map((t) => "#" + t).join(" ")}`);
}

function main() {
  const [, , command, ...rest] = process.argv;
  const query = rest.join(" ");

  if (command === "search" && query) {
    const results = search(query);
    if (results.length === 0) {
      console.log(`Sin resultados para "${query}". El catálogo tiene ${errors.length} errores por ahora.`);
      return;
    }
    results.forEach((error) => console.log(`- ${error.slug}: ${error.title}`));
    console.log(`\n${results.length} resultado(s). Usa "error-atlas show <slug>" para ver el detalle completo.`);
    return;
  }

  if (command === "show" && query) {
    const error = errors.find((e) => e.slug === query.trim());
    if (!error) {
      console.log(`No existe ningún error con slug "${query}".`);
      return;
    }
    printError(error);
    return;
  }

  console.log(`error-atlas — catálogo local de errores (${errors.length} entradas)

Uso:
  error-atlas search <texto>   Busca errores por título, resumen o tag
  error-atlas show <slug>      Muestra la ficha completa de un error
`);
}

main();
