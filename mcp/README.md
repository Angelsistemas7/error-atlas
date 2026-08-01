# error-atlas-mcp

Servidor MCP (Model Context Protocol) que expone el catálogo de [Error Atlas](..) directamente a Claude Desktop, Claude Code, Cursor y cualquier otro cliente MCP — sin que el agente tenga que navegar la web.

## Herramientas expuestas

- **`search_errors(query)`** — busca en el catálogo por texto (mensaje de error, framework, tag). Devuelve una lista de coincidencias con su `slug`.
- **`get_error(slug)`** — devuelve la ficha completa (descripción, causas conocidas, soluciones ordenadas por probabilidad, versiones/frameworks afectados) de un error dado su slug exacto.

Lee directamente `../src/data/errors.json` — el mismo catálogo que usa la web, sin duplicar datos.

## Instalar y correr

```bash
cd mcp
npm install
npm start
```

## Conectar a Claude Desktop / Claude Code

Agregar a tu configuración MCP (`claude_desktop_config.json` en Claude Desktop, o `.mcp.json` en un proyecto para Claude Code):

```json
{
  "mcpServers": {
    "error-atlas": {
      "command": "node",
      "args": ["/ruta/absoluta/a/error-atlas/mcp/server.js"]
    }
  }
}
```

Reinicia el cliente. Deberías poder pedirle algo como *"busca en error-atlas el error de hydration failed"* y que use las herramientas directamente.

## Probado

Verificado en vivo con el protocolo real por stdio (`initialize` → `tools/list` → `tools/call`), no solo que compile — ver el historial del PR que introdujo este servidor para el script de prueba usado.
