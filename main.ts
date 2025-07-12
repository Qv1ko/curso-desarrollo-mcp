import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// 1. Crear servidor:
// Interfaz principal con el protocolo MCP.
// Maneja la comunicación entre el cliente y el servidor.
const server = new McpServer({
  name: "Demo",
  version: "1.0.0",
});

// 2. Definir las herramientas:
// Permiten al LLM realizar acciones a través de tu servidor.
server.tool(
  "fetch-weather", // título
  "Tool to fetch the weather of a city", // descripción
  {
    city: z.string().describe("City name"),
  }, // parametros
  async ({ city }) => {
    return {
      content: [{ type: "text", text: `El clima de ${city} es soleado` }],
    };
  } // tratamiento de la información
);

// 3. Escuchar las conexiones del cliente
const transport = new StdioServerTransport();
await server.connect(transport);
