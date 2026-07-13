import { type OAuthHelpers } from "@cloudflare/workers-oauth-provider";

/**
 * Worker bindings. `OAUTH_KV` and `OAUTH_PROVIDER` are used by the OAuth layer;
 * the rest mirror the environment variables the Node entry reads.
 */
export interface Env {
  /** KV namespace the OAuth provider uses for token/grant/client storage. */
  OAUTH_KV: KVNamespace;
  /** Injected by OAuthProvider; drives the authorization flow. */
  OAUTH_PROVIDER: OAuthHelpers;
  /** CompanyCam access token (required). */
  COMPANYCAM_API_TOKEN: string;
  /** Default X-CompanyCam-User header value (optional). */
  COMPANYCAM_USER_EMAIL?: string;
  /** Owner approval secret checked on the consent screen (required). */
  MCP_AUTH_TOKEN: string;
}
