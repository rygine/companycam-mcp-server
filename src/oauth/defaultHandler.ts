import {
  type AuthRequest,
  type ClientInfo,
} from "@cloudflare/workers-oauth-provider";

import { type Env } from "./env.js";

/**
 * Strict CSP for the consent page: no scripts (default-src 'none' also covers
 * script-src), inline styles only, and the form may only post back to us.
 */
const CSP =
  "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'";

const SECURITY_HEADERS: Record<string, string> = {
  "content-type": "text/html; charset=utf-8",
  "content-security-policy": CSP,
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
};

/** KV key for a pending authorization request, and how long it lives (seconds). */
const authKey = (nonce: string): string => `authreq:${nonce}`;
const AUTH_REQUEST_TTL = 600;

/** Escape a value for HTML text content and double-quoted attributes. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlResponse(body: string, status = 200): Response {
  return new Response(body, { status, headers: SECURITY_HEADERS });
}

/**
 * Consent screen. The pending OAuth request lives server-side in KV under
 * `nonce`; the page reflects only that nonce (and the client's display name),
 * so no client-controlled request parameters are rendered into the HTML.
 */
function renderConsent(
  nonce: string,
  client: ClientInfo | null,
  error?: string,
): Response {
  const name = esc(client?.clientName ?? client?.clientId ?? "An MCP client");
  return htmlResponse(
    `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Authorize — CompanyCam MCP</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 26rem; margin: 4rem auto; padding: 0 1rem; color: #1a1a1a; }
  h1 { font-size: 1.25rem; }
  .client { font-weight: 600; }
  form { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem; }
  input[type=password] { padding: 0.6rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 6px; }
  button { padding: 0.6rem; font-size: 1rem; border: 0; border-radius: 6px; background: #1a7f5a; color: #fff; cursor: pointer; }
  .error { color: #b00020; margin-top: 1rem; }
</style>
</head>
<body>
  <h1>Authorize access to CompanyCam</h1>
  <p><span class="client">${name}</span> is requesting access to your CompanyCam MCP server.</p>
  ${error ? `<p class="error">${esc(error)}</p>` : ""}
  <form method="post" action="/authorize">
    <input type="hidden" name="nonce" value="${esc(nonce)}" />
    <label for="secret">Owner approval secret</label>
    <input id="secret" name="secret" type="password" autocomplete="off" autofocus required />
    <button type="submit">Approve</button>
  </form>
</body>
</html>`,
    error ? 401 : 200,
  );
}

/**
 * Handles everything that isn't an authorized MCP request: the health check and
 * the OAuth authorization (consent) UI. Token/registration/metadata endpoints
 * are implemented by OAuthProvider itself.
 */
export const defaultHandler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return Response.json({ ok: true, server: "companycam-mcp" });
    }

    if (url.pathname === "/authorize") {
      // Start of flow: stash the parsed request server-side, show the form.
      if (request.method === "GET") {
        const oauthReq = await env.OAUTH_PROVIDER.parseAuthRequest(request);
        const client = await env.OAUTH_PROVIDER.lookupClient(oauthReq.clientId);
        const nonce = crypto.randomUUID();
        await env.OAUTH_KV.put(authKey(nonce), JSON.stringify(oauthReq), {
          expirationTtl: AUTH_REQUEST_TTL,
        });
        return renderConsent(nonce, client);
      }

      // Consent submitted: reload the request by nonce, check the secret.
      if (request.method === "POST") {
        const form = await request.formData();
        const nonce = String(form.get("nonce") ?? "");
        const secret = String(form.get("secret") ?? "");

        const stored = nonce ? await env.OAUTH_KV.get(authKey(nonce)) : null;
        if (!stored) {
          return htmlResponse(
            "<!doctype html><meta charset=utf-8><p>This authorization request has expired. Please start again from your client.</p>",
            400,
          );
        }
        const oauthReq = JSON.parse(stored) as AuthRequest;
        const client = await env.OAUTH_PROVIDER.lookupClient(oauthReq.clientId);

        // Fail closed: rejects when MCP_AUTH_TOKEN is unset (undefined) too.
        // The nonce is left in place so the owner can retry until it expires.
        if (secret !== env.MCP_AUTH_TOKEN) {
          return renderConsent(nonce, client, "Incorrect approval secret.");
        }

        await env.OAUTH_KV.delete(authKey(nonce)); // single-use
        const { redirectTo } = await env.OAUTH_PROVIDER.completeAuthorization({
          request: oauthReq,
          userId: "owner",
          metadata: { client: client?.clientName ?? oauthReq.clientId },
          scope: oauthReq.scope,
          props: { userId: "owner" },
        });
        // Manual redirect so we can strip the referrer (the target URL carries
        // the authorization code).
        return new Response(null, {
          status: 302,
          headers: { location: redirectTo, "referrer-policy": "no-referrer" },
        });
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
