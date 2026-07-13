import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { type Config } from "../config.js";
import TOOLS from "../tools/tools.js";
import { executeTool } from "./executeTool.js";

/** Build a fresh MCP server instance (stateless HTTP creates one per request). */
export function buildServer(config: Config): McpServer {
  const server = new McpServer({ name: "companycam", version: "1.0.0" });

  for (const tool of TOOLS) {
    server.registerTool(
      tool.name,
      {
        title: tool.title,
        description: tool.description,
        inputSchema: tool.inputSchema,
        annotations: tool.annotations,
      },
      (args): Promise<CallToolResult> =>
        executeTool(tool, args as Record<string, unknown>, config),
    );
  }

  return server;
}
