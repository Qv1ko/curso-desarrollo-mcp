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
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city
      )}&count=1&language=en&format=json`
    );
    const data: any = await response.json();

    if (!data.results || data.results.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No se encontro información sobre el clima de ${city}`,
          },
        ],
      };
    }

    const { latitude, longitude } = data.results[0];

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current=temperature_2m,is_day,precipitation,rain,relative_humidity_2m,apparent_temperature,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure&forecast_days=1`
    );
    const weatherData = await weatherResponse.json();

    return {
      content: [{ type: "text", text: JSON.stringify(weatherData, null, 2) }],
    };
  } // tratamiento de la información
);

// 3. Escuchar las conexiones del cliente
const transport = new StdioServerTransport();
await server.connect(transport);
