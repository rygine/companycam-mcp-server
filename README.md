# CompanyCam MCP Server

An MCP (Model Context Protocol) server exposing the **full CompanyCam Core API (v2)** — all 62 operations from [docs.companycam.com/reference](https://docs.companycam.com/reference), with tool schemas generated directly from CompanyCam's own OpenAPI definitions.

It runs two ways from one codebase:

- **Cloudflare Workers + OAuth 2.1** (`src/worker.ts`) — the recommended path for **Claude Desktop / claude.ai custom connectors**, which authenticate over OAuth.
- **Node** (`src/index.ts`) — **stdio** for local use (Claude Desktop's local server config) and an **Express Streamable-HTTP** server with a static bearer token (handy for **Claude Code**, gateways, or self-hosting).

## Coverage (62 tools)

| Area                                | Tools                                                                                               |
| ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| Projects                            | list, get, create, update, delete, archive, restore, update notepad                                 |
| Project photos / videos / documents | list project photos, add photo, list videos, upload document, list documents                        |
| Photos                              | list, get, update (internal flag), delete, update description, comments (list/add), tags (list/add) |
| Project collaboration               | assigned users (list/assign/remove), collaborators, invitations (list/create), comments (list/add)  |
| Labels                              | list, add, delete project labels                                                                    |
| Checklists                          | list all, list/create/get project checklists, list checklist templates                              |
| Tags                                | list, get, create, update, delete                                                                   |
| Users                               | list, get, current, create, update, delete                                                          |
| Groups                              | list, get, create, update, delete                                                                   |
| Webhooks                            | list, get, create, update, delete                                                                   |
| Company                             | retrieve company                                                                                    |

Destructive tools (`delete_*`) carry MCP `destructiveHint` annotations; `list_*`/`get_*` tools are marked read-only, so clients treat them appropriately.

## How it works

Tool definitions are **generated as code**, not converted at runtime:

```
src/tools/openapi.json   CompanyCam Core API v2 spec (source of truth)
src/tools/convert.ts     codegen: OpenAPI -> Zod  (run with `yarn generate`)
src/tools/tools.ts       GENERATED: the 62 tools as real Zod schemas
```

Both entry points share the same core, which builds one MCP server per request and validates every tool call against its Zod input schema before touching the CompanyCam API:

```
src/utils/buildServer.ts   registers the 62 tools on an McpServer
src/utils/executeTool.ts   performs the CompanyCam API call for a tool
src/config.ts              resolves config from the environment
src/index.ts               Node entry  — stdio + Express Streamable HTTP
src/worker.ts + src/oauth/ Workers entry — Fetch API + OAuth 2.1
```

## Requirements

- **Node.js 26+** and **Yarn** (for local dev, tooling, and the Node server). See `.node-version`.
- A **CompanyCam access token** — CompanyCam web app → company settings → API/Access Tokens (or an OAuth access token). API access requires a Pro, Premium, or Elite plan.
- For the Workers deployment: a **Cloudflare account** and `wrangler` (installed as a dev dependency).

```bash
yarn install
```

## Configuration

| Variable                | Required           | Applies to         | Purpose                                                                                                                 |
| ----------------------- | ------------------ | ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `COMPANYCAM_API_TOKEN`  | **Yes**            | all                | Bearer token sent to `api.companycam.com`. Lives only on the server; the client never sees it.                          |
| `MCP_AUTH_TOKEN`        | Network transports | Node HTTP + Worker | Owner secret. **Node HTTP:** the bearer clients must send. **Worker:** the approval secret on the OAuth consent screen. |
| `COMPANYCAM_USER_EMAIL` | No                 | all                | Default `X-CompanyCam-User` header — attributes created records to this CompanyCam user.                                |
| `MCP_PATH`              | No                 | Node HTTP only     | Endpoint path (default `/mcp`). The Worker always serves MCP at `/mcp`.                                                 |
| `PORT`                  | No                 | Node HTTP only     | Default `3000`.                                                                                                         |

`COMPANYCAM_API_TOKEN` is always required. `MCP_AUTH_TOKEN` is required for the **network transports** (the Node HTTP server and the Worker), but **not for local stdio**, which has no endpoint to protect.

> **Windows notes**
>
> - The inline `VAR=value command` examples below are **bash** syntax. In **PowerShell** use `$env:VAR="value"; command`; in **cmd** use `set VAR=value && command`. (This only affects the shell examples — the Claude Desktop stdio setup puts tokens in the JSON `env` block, not the shell.)
> - For the Claude Desktop setup, prefer **`yarn claude-config`** — it emits the correct `node.exe` path with escaped backslashes. Hand-written config paths must use `\\` (or forward slashes, which Node accepts on Windows). The config file lives at `%APPDATA%\Claude\claude_desktop_config.json`.
> - `which node` is **`where node`** on Windows (not needed if you use `yarn claude-config`).

---

## Install for Claude Desktop (one-click, `.mcpb`)

Non-technical users don't need to clone, build, or edit any config. Each GitHub
Release ships a prebuilt **MCP Bundle** (`.mcpb`):

1. Download the latest `companycam-mcp-server-<version>.mcpb` from the
   [Releases page](https://github.com/rygine/companycam-mcp-server/releases/latest).
2. **Double-click** it — Claude Desktop opens and shows an install dialog.
3. Paste your **CompanyCam API Token** when prompted (stored securely in your OS
   keychain). The "User Email" field is optional.
4. Click install, then fully quit and reopen Claude Desktop.

The bundle runs the server **locally** on that machine (stdio), so no hosting or
OAuth is involved. To build the `.mcpb` yourself, run `yarn bundle` (output:
`companycam-mcp-server-<version>.mcpb`).

### Install from the Extensions settings page

If you're having trouble double-clicking on the `.mcpb` file to install the MCP bundle, you can manually install the extension by dragging the `.mcpb` bundle onto the Extensions settings page.

### Network access

You may need to add the CompanyCam domain to the network egress allowlist under Capabilities settings. Add `*.companycam.com` to the allowlist to enable all calls to the API.

---

## Option A — Cloudflare Workers + OAuth (recommended for Claude Desktop)

Claude Desktop and claude.ai custom connectors authenticate remote MCP servers with **OAuth 2.1**. The Worker implements the full flow via [`@cloudflare/workers-oauth-provider`](https://github.com/cloudflare/workers-oauth-provider): discovery metadata, dynamic client registration, PKCE, and token issuance (tokens stored in Workers KV). Authorization is a single-owner **consent screen** gated by `MCP_AUTH_TOKEN`.

### Deploy

```bash
# 1. Create the KV namespace for OAuth token storage, then paste the
#    printed id into wrangler.toml (replace REPLACE_WITH_KV_NAMESPACE_ID).
wrangler kv namespace create OAUTH_KV

# 2. Set secrets.
wrangler secret put COMPANYCAM_API_TOKEN
wrangler secret put MCP_AUTH_TOKEN          # the owner approval secret
# optional:
wrangler secret put COMPANYCAM_USER_EMAIL

# 3. Deploy.
yarn deploy                                  # -> https://<name>.<subdomain>.workers.dev
```

Your MCP endpoint is `https://<your-worker>/mcp`.

### Run it locally

```bash
# Put dev secrets in .dev.vars (gitignored):
#   COMPANYCAM_API_TOKEN=...
#   MCP_AUTH_TOKEN=owner-secret
yarn dev:worker            # wrangler dev, local KV via miniflare -> http://localhost:8787
```

### The OAuth flow (what the client does)

1. Client calls `/mcp`, gets `401` with `WWW-Authenticate` → discovers OAuth is required.
2. It reads `/.well-known/oauth-protected-resource` → `/.well-known/oauth-authorization-server`, then **registers dynamically**.
3. It opens `/authorize` in your browser → the **consent screen** asks for the owner approval secret (`MCP_AUTH_TOKEN`).
4. On success it exchanges the code (with PKCE) at `/token` for an access token used on subsequent `/mcp` calls.

### Connect from Claude Desktop / claude.ai

1. **Settings → Connectors → Add custom connector** (on Team/Enterprise, an Owner adds it under Organization settings).
2. Name `CompanyCam`, URL `https://<your-worker>/mcp`.
3. Click **Connect** — your browser opens the consent screen. Enter the approval secret and approve.
4. Enable the connector in a chat via the **+** menu.

Because this is a standard MCP-spec OAuth implementation, the same endpoint also works with **Claude Code**, **VS Code**, the **MCP Inspector**, and any spec-compliant client.

---

## Option B — Node server (stdio, or HTTP with a static bearer)

### Run locally with Claude Desktop (stdio)

This is the simplest way to use the server on your own machine: Claude Desktop launches it as a local subprocess and talks to it over stdio. No hosting, no OAuth, no network exposure — and **no `MCP_AUTH_TOKEN`** (there's no endpoint to protect). You only need your `COMPANYCAM_API_TOKEN`.

**1. Install and build.** From the project folder:

```bash
yarn install
yarn build          # produces dist/index.js
```

(Optional) confirm it runs — it should print `CompanyCam MCP server running on stdio` to stderr and then wait; press Ctrl-C to exit:

```bash
COMPANYCAM_API_TOKEN=your_token yarn stdio
```

**2. Find the absolute paths** you'll need in the config:

```bash
pwd                 # -> /absolute/path/to/companycam-mcp
which node          # -> /absolute/path/to/node  (use this if step 5 fails to start)
```

**3. Open `claude_desktop_config.json`.** In Claude Desktop: **Settings → Developer → Edit Config** (this creates the file if it doesn't exist). Or open it directly:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

**4. Add the server.** The quickest way is to let the project print a ready-to-paste snippet with the absolute paths (and your tokens, if they're in your env) already filled in:

```bash
COMPANYCAM_API_TOKEN=your_token yarn claude-config
```

Copy the printed JSON into the config file (keep any existing `mcpServers` entries). It looks like this:

```json
{
  "mcpServers": {
    "companycam": {
      "command": "/absolute/path/to/node",
      "args": ["/absolute/path/to/companycam-mcp/dist/index.js", "--stdio"],
      "env": {
        "COMPANYCAM_API_TOKEN": "your_companycam_token"
      }
    }
  }
}
```

Notes:

- `yarn claude-config` uses the **absolute path to your Node binary** (`process.execPath`), which sidesteps the PATH issue in the troubleshooting section. If you write the config by hand, use absolute paths for both `command` and the `dist/index.js` arg.
- `COMPANYCAM_USER_EMAIL` is optional; set it in your env before running `yarn claude-config` (or add it to `env`) to attribute created records to a user.

**5. Fully quit and reopen Claude Desktop** (a window close isn't enough — quit from the menu / system tray). On restart it launches the server.

**6. Verify.** In a new chat, open the tools/connectors menu (the **+** or the slider icon) — you should see **companycam** with its 62 tools enabled. Try: _"List my CompanyCam projects."_

**Troubleshooting:**

- **Server not appearing / "failed to start":** most often the `node` binary isn't on the PATH Claude Desktop launches with (common with `nvm`/`fnm`/Volta). Replace `"command": "node"` with the absolute path from `which node`.
- **Check the logs:** macOS `~/Library/Logs/Claude/mcp-server-companycam.log` (and `mcp.log`); Windows `%APPDATA%\Claude\logs\`.
- **`FATAL: … environment variable is not set`:** `COMPANYCAM_API_TOKEN` must be present in `env` (stdio doesn't need `MCP_AUTH_TOKEN`).
- **Changed the code?** Re-run `yarn build` and fully restart Claude Desktop.

> Prefer a remote setup (custom connector with OAuth) instead of a local subprocess? See [Option A](#option-a--cloudflare-workers--oauth-recommended-for-claude-desktop).

### HTTP with a static bearer token

```bash
COMPANYCAM_API_TOKEN=your_token MCP_AUTH_TOKEN=pick_a_secret yarn start
# -> http://localhost:3000/mcp  (send: Authorization: Bearer pick_a_secret)
```

Add it to **Claude Code**:

```bash
claude mcp add --transport http companycam https://your-host/mcp \
  --header "Authorization: Bearer YOUR_MCP_AUTH_TOKEN"
```

Or test with the MCP Inspector (Transport: Streamable HTTP, URL `http://localhost:3000/mcp`, header `Authorization: Bearer <secret>`):

```bash
npx @modelcontextprotocol/inspector
```

### Self-host

Build and run the compiled server:

```bash
yarn build            # bundles to dist/index.js
node dist/index.js     # needs the env vars above; serves on $PORT
```

Or with **Docker** — the included multi-stage `Dockerfile` builds `dist/` and runs the HTTP server with production dependencies only:

```bash
docker build -t companycam-mcp .
docker run -p 3000:3000 \
  -e COMPANYCAM_API_TOKEN=your_token \
  -e MCP_AUTH_TOKEN=pick_a_secret \
  companycam-mcp
# -> http://localhost:3000/mcp
```

Any Node host (Railway, Render, Fly, a VM) works — set the env vars and expose it over HTTPS. Claude Desktop/claude.ai native connectors expect OAuth, so for those use Option A; this HTTP mode is best for Claude Code, an `mcp-remote` bridge, or a gateway that terminates auth.

---

## Regenerating tool definitions

`src/tools/tools.ts` is generated from `src/tools/openapi.json`:

```bash
yarn generate          # runs src/tools/convert.ts, rewrites src/tools/tools.ts
yarn format            # tidy the generated file
```

If CompanyCam changes the API, update `src/tools/openapi.json` and re-run. The converter emits real Zod schemas, folding OpenAPI's custom `format`s (`id`, `int32`, …) into field descriptions and using loose objects for the free-form request `body` so nothing is stripped.

## Security notes

- The CompanyCam token lives **only on the server**; the client never sees it.
- Anyone who can pass auth can act on your CompanyCam account with that token's permissions. Keep `MCP_AUTH_TOKEN` secret; on the Worker, treat it as the key to authorizing new clients.
- `delete_project`, `delete_photo`, `delete_user`, etc. are live destructive operations. Restrict the CompanyCam token's user role to limit blast radius.
- The Worker's OAuth model is **single-owner** (one approval secret, `userId: "owner"`). For real per-user identity, delegate to an external IdP instead.

## Notes on specific endpoints

- **Pagination:** list endpoints support `page`/`per_page` and cursor pagination (`after`/`before`). Cursor values are returned under `pagination_headers` (`x-next-cursor` / `x-prev-cursor`).
- **Photo upload** (`create_project_photo`): pass a publicly accessible image `uri` plus `captured_at` (unix timestamp); optional `tags`.
- **Document upload** (`create_project_document`): base64-encoded contents, 30 MB limit. Note Cloudflare Workers' 128 MB memory limit when handling large uploads.
- **Videos:** until a video's `status` is `processed`, `playback_url` returns the raw upload URL, not the HLS playback URL.
- **Rate limits:** 429 responses surface the `Retry-After` value in the error message.

## Development

| Script               | What it does                                                     |
| -------------------- | ---------------------------------------------------------------- |
| `yarn stdio`         | Node server over stdio                                           |
| `yarn claude-config` | Print a ready-to-paste Claude Desktop (stdio) config             |
| `yarn start`         | Node Express Streamable-HTTP server                              |
| `yarn dev:worker`    | `wrangler dev` — the Workers/OAuth entry, locally                |
| `yarn deploy`        | `wrangler deploy` — deploy the Worker                            |
| `yarn build`         | Bundle the Node entry to `dist/`                                 |
| `yarn generate`      | Regenerate `src/tools/tools.ts` from `openapi.json`              |
| `yarn typecheck`     | `tsc` (Node code) **and** `tsc -p tsconfig.worker.json` (Worker) |
| `yarn lint`          | oxlint                                                           |
| `yarn format`        | oxfmt                                                            |

The Node code (`@types/node`) and the Worker code (`@cloudflare/workers-types`) use conflicting globals, so they type-check under separate tsconfigs — `tsconfig.json` excludes `src/worker.ts` and `src/oauth/`, which `tsconfig.worker.json` covers.
