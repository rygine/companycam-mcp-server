import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

import { readConfig } from "../config.js";
import { buildServer } from "../utils/buildServer.js";
import { type Env } from "./env.js";

/**
 * MCP handler for authorized requests. OAuthProvider only routes requests here
 * once it has validated the access token, so no auth check is needed — the
 * request has already passed OAuth.
 */
export const apiHandler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
      return new Response(null, { status: 405, headers: { Allow: "POST" } });
    }

    const config = readConfig(
      env as unknown as Record<string, string | undefined>,
    );
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless
      enableJsonResponse: true,
    });
    await buildServer(config).connect(transport);
    return transport.handleRequest(request);
  },
};
