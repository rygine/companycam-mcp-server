/**
 * Runtime configuration, resolved from an environment record.
 *
 * On Node this is `process.env`; on Cloudflare Workers it is the per-request
 * `env` binding. Reading it explicitly (rather than touching `process.env`
 * directly) keeps the tool-execution code runtime-agnostic.
 */
export interface Config {
  /** CompanyCam access token (required). */
  apiToken: string;
  /** Default X-CompanyCam-User header value. */
  userEmail?: string;
  /**
   * Owner secret protecting network access. On the Node HTTP entry it is the
   * static bearer token requests must send; on the Worker (OAuth) entry it is the
   * approval secret on the consent screen. Required for those transports, but not
   * for stdio (which has no network endpoint) — hence optional here.
   * See src/worker.ts and src/oauth/defaultHandler.ts.
   */
  authToken?: string;
  /** Endpoint path for the MCP handler. */
  mcpPath: string;
}

/**
 * Build a {@link Config} from an environment record; throws if a required var is
 * missing. `MCP_AUTH_TOKEN` is required by default (network transports), but the
 * stdio entry passes `requireAuthToken: false`.
 */
export function readConfig(
  env: Record<string, string | undefined>,
  { requireAuthToken = true }: { requireAuthToken?: boolean } = {},
): Config {
  const apiToken = env.COMPANYCAM_API_TOKEN;
  if (!apiToken) {
    throw new Error("COMPANYCAM_API_TOKEN environment variable is not set.");
  }
  const authToken = env.MCP_AUTH_TOKEN;
  if (requireAuthToken && !authToken) {
    throw new Error("MCP_AUTH_TOKEN environment variable is not set.");
  }
  return {
    apiToken,
    userEmail: env.COMPANYCAM_USER_EMAIL,
    authToken,
    mcpPath: env.MCP_PATH || "/mcp",
  };
}
