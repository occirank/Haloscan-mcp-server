import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { configureHaloscanServer } from "./haloscan-core.js";

// Setup Express
const app = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10);

// Enable CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests
app.options("*", (_req: Request, res: Response) => {
  res.sendStatus(200);
});

// Use JSON parser, except for /messages
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path === "/messages") return next();
  express.json()(req, res, next);
});

// MCP server
const server = new McpServer({
  name: "Haloscan SEO",
  version: "1.0.0"
});

configureHaloscanServer(server);

// Transport and session-level API key store
const transports: Record<string, SSEServerTransport> = {};
export const sessionApiKeys: Record<string, string> = {}; // <-- Exported

// SSE endpoint
app.get("/sse", (req: Request, res: Response) => {
  try {
    const apiKey = req.query["haloscan-api-key"];
    if (typeof apiKey !== "string") {
      return res.status(400).send("Missing haloscan-api-key");
    }

    const transport = new SSEServerTransport("/messages", res);
    transports[transport.sessionId] = transport;
    sessionApiKeys[transport.sessionId] = apiKey;

    res.on("close", () => {
      delete transports[transport.sessionId];
      delete sessionApiKeys[transport.sessionId];
    });

    server.connect(transport); // No second param!
  } catch (error) {
    console.error("Error setting up SSE connection:", error);
    res.sendStatus(500);
  }
});

// /messages endpoint
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
  console.log(`✅ Haloscan MCP Server running on http://localhost:${PORT}`);
  console.log(`🔄 Connect via /sse`);
});