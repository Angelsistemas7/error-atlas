# Error Atlas

Una wikipedia técnica de errores reales: pegas un mensaje de error y encuentras causas conocidas, soluciones ordenadas por probabilidad, y el contexto (framework, versión) en el que aplican. No otro hilo de Stack Overflow a medio responder ni una respuesta genérica de un chatbot — un catálogo curado, estructurado y verificable.

## Por qué existe

Hoy la información sobre un error concreto está dispersa entre Stack Overflow (desordenado, respuestas viejas), GitHub Issues (oro puro, pero no estructurado como referencia), Reddit, Discord (no indexable) y blogs de ingeniería. Error Atlas no copia esas fuentes — les da la estructura que ninguna tiene: descripción, causas conocidas (ordenadas de más a menos probable), soluciones concretas, y el framework/versión exacto donde aplica.

## Stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS v4**
- **Fuse.js** para búsqueda difusa client-side
- Páginas de error pre-renderizadas estáticamente (`generateStaticParams`)
- **Servidor MCP** (`mcp/`) — expone el catálogo a Claude/Cursor, ver [`mcp/README.md`](mcp/README.md)
- **CLI** (`bin/error-atlas.js`) — `error-atlas search <texto>` / `error-atlas show <slug>`
- **GitHub Action semanal** (`.github/workflows/related-issues.yml`) que busca issues/PRs reales nuevos y propone agregarlos vía PR — nunca automerge

## Cómo correrlo

```bash
npm install
npm run dev
```

## Estructura

```
src/
  app/
    page.tsx              → homepage con buscador
    error/[slug]/page.tsx → ficha de cada error
  components/
    SearchBox.tsx          → búsqueda en vivo
  lib/
    types.ts               → tipo ErrorEntry
    errors.ts               → acceso al catálogo
    search.ts               → índice Fuse.js
  data/
    errors.json             → catálogo curado (22 errores por ahora)
mcp/
  server.js                  → servidor MCP (search_errors, get_error)
scripts/
  find-related-issues.mjs    → bot semanal, ver .github/workflows/related-issues.yml
bin/
  error-atlas.js              → CLI
```

## Roadmap

**Cerca (siguiente):**
- [ ] Formulario de contribución: validar un `ErrorEntry` nuevo con un schema (zod) en CI antes de mergear
- [ ] Sección "¿Te sirvió esta solución?" con conteo simple (sin cuentas, localStorage) para ordenar soluciones por utilidad real reportada, no una sola vez
- [ ] Publicar el CLI en npm (`npx error-atlas`) — hoy solo corre local

**Integraciones con fuentes reales (no inventadas):**
- [x] Vincular cada error a Issues/PRs reales de GitHub que lo mencionan, vía la API pública de GitHub (`search/issues`), mostrando el link y el estado (abierto/cerrado/mergeado) tal cual están — nunca un resumen inventado del issue
- [x] Un job periódico (GitHub Actions) que busca nuevos issues/PRs en repos de referencia y propone la actualización como PR para revisión humana — nunca auto-mergeado. Deliberadamente conservador: solo cuando hay un repo de referencia mapeado, para no meter ruido de matches irrelevantes.
- [ ] Changelog watcher: cuando un framework saca una versión mayor, señalar en la ficha del error si sigue aplicando a esa versión o si fue resuelto upstream
- [ ] Ampliar `TAG_TO_REPO` a más frameworks (hoy solo React, Next.js, TypeScript tienen repo de referencia mapeado)

**Búsqueda y producto:**
- [ ] Búsqueda semántica (embeddings) para encontrar errores por descripción del síntoma, no solo por el texto exacto del mensaje — complementaria a Fuse.js, no un reemplazo, y siempre mostrando por qué hizo match
- [ ] API pública de solo lectura (`/api/errors`, `/api/errors/:slug`) para que otras herramientas puedan consultar el catálogo
- [x] CLI (`error-atlas search`/`show`) que busca en el catálogo desde la terminal
- [x] Servidor MCP para que Claude/Cursor consulten el catálogo directamente
- [ ] Extensión de VS Code que detecta el error en la terminal integrada y sugiere la ficha correspondiente sin salir del editor

**Contenido:**
- [ ] Cada solución con nivel de confianza basado en algo verificable (ej. "confirmado en el issue oficial #1234", "reportado por N contribuidores") en vez de un porcentaje inventado
- [ ] Ejemplos de reproducción mínima por error, cuando aplique

## Contribuir

Un `ErrorEntry` nuevo es un PR: agregar la entrada a `src/data/errors.json` siguiendo el tipo de `src/lib/types.ts`, con causas y soluciones reales (verificables, no copiadas de otra fuente sin verificar). Ramas pequeñas, PRs chicos — un error o una mejora concreta por PR.

## Licencia

MIT
