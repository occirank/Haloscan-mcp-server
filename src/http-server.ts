// mcp-server.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { configureHaloscanServer } from "./haloscan-core.js";

// Setup Express
const app = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10);

// Enable CORS with preflight support
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight OPTIONS requests globally
app.options("*", (_req: Request, res: Response) => {
  res.sendStatus(200);
});

// Use express.json() everywhere except /messages
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path === "/messages") return next(); // Skip JSON parsing for /messages
  express.json()(req, res, next);
});

// Create an MCP server
const server = new McpServer({
  name: "Haloscan SEO",
  version: "1.0.0"
});

// Configure the server with Haloscan tools and prompts
configureHaloscanServer(server);

// Track active transports
const transports: Record<string, SSEServerTransport> = {};

// SSE endpoint
app.get("/sse", (req: Request, res: Response) => {
  try {
    const transport = new SSEServerTransport("/messages", res);
    transports[transport.sessionId] = transport;

    res.on("close", () => {
      delete transports[transport.sessionId];
    });

    server.connect(transport);
  } catch (error) {
    console.error("Error setting up SSE connection:", error);
    res.sendStatus(500);
  }
});

// Raw message endpoint 
app.post("/messages", (req: Request, res: Response) => {
  const sessionId = req.query.sessionId;

  if (typeof sessionId !== "string") {
    return res.status(400).send("Invalid sessionId");
  }

  const transport = transports[sessionId];

  if (!transport) {
    return res.status(400).send("No transport found for sessionId");
  }

  try {
    transport.handlePostMessage(req, res);
  } catch (err) {
    console.error("handlePostMessage error:", err);
    res.status(500).send("Internal server error");
  }
});

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send({
    status: "ok",
    server: "Haloscan MCP Server",
    version: "1.0.0"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Haloscan MCP Server running on http://localhost:${PORT}`);
  console.log(`Connect to /sse for SSE transport`);
});