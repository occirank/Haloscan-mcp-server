// index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { configureHaloscanServer } from "./haloscan-core.js";

// Create an MCP server
const server = new McpServer({
  name: "Haloscan SEO",
  version: "1.0.0"
});

// Configure the server with Haloscan tools and prompts
configureHaloscanServer(server);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);

console.error("Haloscan MCP Server running on stdio...");