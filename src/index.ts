/**
 * CompanyCam MCP Server
 * ---------------------
 * Exposes all 62 CompanyCam Core API (v2) operations as MCP tools.
 * Tool definitions live in src/tools/tools.ts, generated from
 * src/tools/openapi.json by src/tools/convert.ts (`yarn generate`).
 *
 * This is the Node entry (express + stdio). For Cloudflare Workers see
 * src/worker.ts, which serves the same tools over the Fetch API.
 *
 * Transports:
 *   - Streamable HTTP (default)  -> for use as a Claude custom connector
 *   - stdio (--stdio flag)       -> for local testing / Claude Desktop
 *
 * Environment variables:
 *   COMPANYCAM_API_TOKEN   (required) CompanyCam access token
 *   COMPANYCAM_USER_EMAIL  (optional) default X-CompanyCam-User header value
 *   MCP_AUTH_TOKEN         (required) shared secret; requests to the MCP
 *                          endpoint must send "Authorization: Bearer <MCP_AUTH_TOKEN>"
 *   MCP_PATH               (optional) endpoint path, default "/mcp"
 *   PORT                   (optional) default 3000
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { type Request, type Response } from "express";

import { type Config, readConfig } from "./config.js";
import TOOLS from "./tools/tools.js";
import { buildServer } from "./utils/buildServer.js";

const PORT = Number(process.env.PORT || 3000);
const isStdio = process.argv.includes("--stdio");

let config: Config;
try {
  // stdio has no network endpoint, so it doesn't need MCP_AUTH_TOKEN.
  config = readConfig(process.env, { requireAuthToken: !isStdio });
} catch (e) {
  console.error(`FATAL: ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
}
const { mcpPath: MCP_PATH, authToken: MCP_AUTH_TOKEN } = config;

// ---------------------------------------------------------------------------
// stdio mode (local testing / Claude Desktop)
// ---------------------------------------------------------------------------
if (isStdio) {
  const transport = new StdioServerTransport();
  await buildServer(config).connect(transport);
  // Log to stderr: in stdio mode stdout is the JSON-RPC transport, so anything
  // written there (console.log/info) would corrupt the protocol stream.
  console.error("CompanyCam MCP server running on stdio");
} else {
  // -------------------------------------------------------------------------
  // Streamable HTTP mode (Claude custom connector)
  // -------------------------------------------------------------------------
  // Loaded lazily so stdio mode (and the self-contained .mcpb bundle, which
  // marks express external) never imports express.
  const { default: express } = await import("express");
  const app = express();
  app.use(express.json({ limit: "50mb" })); // document uploads are base64, up to 30 MB

  app.get("/", (_req: Request, res: Response) =>
    res.json({
      ok: true,
      server: "companycam-mcp",
      tools: TOOLS.length,
      endpoint: MCP_PATH,
    }),
  );

  const requireAuth = (req: Request, res: Response): boolean => {
    const header = req.headers.authorization || "";
    if (header === `Bearer ${MCP_AUTH_TOKEN}`) return true;
    res.status(401).json({
      jsonrpc: "2.0",
      error: {
        code: -32001,
        message: "Unauthorized: missing or invalid bearer token",
      },
      id: null,
    });
    return false;
  };

  app.post(MCP_PATH, async (req: Request, res: Response) => {
    if (!requireAuth(req, res)) return;
    try {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // stateless
        enableJsonResponse: true,
      });
      res.on("close", () => transport.close());
      await buildServer(config).connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (e) {
      console.error("MCP request error:", e);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        });
      }
    }
  });

  // Stateless server: no SSE stream or session termination to offer.
  app.get(MCP_PATH, (_req: Request, res: Response) =>
    res.status(405).set("Allow", "POST").send(),
  );
  app.delete(MCP_PATH, (_req: Request, res: Response) =>
    res.status(405).set("Allow", "POST").send(),
  );

  app.listen(PORT, () => {
    console.log(
      `CompanyCam MCP server listening on :${PORT}${MCP_PATH} (${TOOLS.length} tools)`,
    );
    console.log("Endpoint auth: bearer token required");
  });
}
