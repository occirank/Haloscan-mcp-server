#!/usr/bin/env node
// cli.ts
import { Command } from "commander";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
// Initialize dotenv
dotenv.config();
// Get package version
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = join(__dirname, "..", "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
const program = new Command();
program
    .name("mcp-haloscan-server")
    .description("MCP server for Haloscan SEO API")
    .version(packageJson.version);
program
    .command("start")
    .description("Start the MCP server with stdio transport")
    .option("-k, --api-key <key>", "Haloscan API key")
    .action((options) => {
    if (options.apiKey) {
        process.env.HALOSCAN_API_KEY = options.apiKey;
    }
    import("./index.js");
});
program
    .command("http")
    .description("Start the MCP server with HTTP/SSE transport")
    .option("-p, --port <number>", "Port number", "3000")
    .option("-k, --api-key <key>", "Haloscan API key")
    .action((options) => {
    if (options.apiKey) {
        process.env.HALOSCAN_API_KEY = options.apiKey;
    }
    if (options.port) {
        process.env.PORT = options.port;
    }
    import("./http-server.js");
});
program
    .command("install-claude")
    .description("Help install the server in Claude for Desktop")
    .action(() => {
    const fs = require("fs");
    const os = require("os");
    const path = require("path");
    // Determine the correct config path based on OS
    let configPath;
    if (process.platform === "darwin") {
        configPath = path.join(os.homedir(), "Library", "Application Support", "Claude", "claude_desktop_config.json");
    }
    else if (process.platform === "win32") {
        configPath = path.join(os.homedir(), "AppData", "Roaming", "Claude", "claude_desktop_config.json");
    }
    else {
        console.log("Unsupported platform. Claude for Desktop is only available on macOS and Windows.");
        return;
    }
    // Check if config already exists
    let config = { mcpServers: {} };
    try {
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        }
    }
    catch (error) {
        console.log("Error reading existing config:", error);
    }
    // Add or update our server configuration
    const serverExecutable = path.resolve(__dirname, "..", "build", "index.js");
    config.mcpServers = {
        ...config.mcpServers,
        haloscan: {
            command: "node",
            args: [serverExecutable],
            env: {
                HALOSCAN_API_KEY: process.env.HALOSCAN_API_KEY || "<YOUR_API_KEY_HERE>"
            }
        }
    };
    // Create directory if it doesn't exist
    const configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }
    // Write the updated config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`\nSuccessfully added Haloscan MCP server to Claude for Desktop configuration:`);
    console.log(`Config path: ${configPath}`);
    console.log("\nPlease:");
    console.log("1. Replace <YOUR_API_KEY_HERE> with your actual Haloscan API key in the config file");
    console.log("2. Restart Claude for Desktop app");
    console.log("\nYou should now see the Haloscan MCP tools available in Claude for Desktop");
});
program.parse();
