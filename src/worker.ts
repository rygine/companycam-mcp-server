/**
 * CompanyCam MCP Server — Cloudflare Workers entry (OAuth 2.1)
 * -----------------------------------------------------------
 * Serves the same 62 tools as src/index.ts, but over the Fetch API and behind
 * the MCP OAuth authorization flow, implemented with Cloudflare's
 * @cloudflare/workers-oauth-provider. The provider serves the discovery
 * metadata (.well-known/oauth-authorization-server & -protected-resource),
 * the token & dynamic-client-registration endpoints, and validates access
 * tokens before routing to the MCP handler.
 *
 *   apiRoute "/mcp"   -> apiHandler      (authorized MCP requests only)
 *   /authorize        -> defaultHandler  (owner consent screen)
 *   /token, /register -> OAuthProvider   (built in)
 *
 * Requires a KV binding `OAUTH_KV` (see wrangler.toml) and these secrets:
 *   wrangler secret put COMPANYCAM_API_TOKEN
 *   wrangler secret put MCP_AUTH_TOKEN     # owner approval secret (consent)
 */

import { OAuthProvider } from "@cloudflare/workers-oauth-provider";

import { apiHandler } from "./oauth/apiHandler.js";
import { defaultHandler } from "./oauth/defaultHandler.js";
import { type Env } from "./oauth/env.js";

export default new OAuthProvider<Env>({
  apiRoute: "/mcp",
  apiHandler,
  defaultHandler,
  authorizeEndpoint: "/authorize",
  tokenEndpoint: "/token",
  clientRegistrationEndpoint: "/register",
  scopesSupported: ["mcp"],
});
