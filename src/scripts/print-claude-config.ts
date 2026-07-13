/**
 * Prints a ready-to-paste Claude Desktop (stdio) MCP server config, with the
 * absolute node/entry paths resolved for this machine. Run: `yarn claude-config`.
 *
 * Values for COMPANYCAM_API_TOKEN / MCP_AUTH_TOKEN / COMPANYCAM_USER_EMAIL are
 * taken from the environment if set, otherwise placeholders are emitted.
 *
 * Human-readable notes go to stderr and the JSON to stdout, so you can pipe it:
 *   yarn claude-config > snippet.json
 */

import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const entry = join(root, "dist", "index.js");

// stdio needs no MCP_AUTH_TOKEN (no network endpoint to protect).
const env: Record<string, string> = {
  COMPANYCAM_API_TOKEN:
    process.env.COMPANYCAM_API_TOKEN ?? "your_companycam_token",
};
if (process.env.COMPANYCAM_USER_EMAIL) {
  env.COMPANYCAM_USER_EMAIL = process.env.COMPANYCAM_USER_EMAIL;
}

const config = {
  mcpServers: {
    companycam: {
      // Absolute path to the Node binary running this script — avoids Claude
      // Desktop launching with a different PATH than your shell.
      command: process.execPath,
      args: [entry, "--stdio"],
      env,
    },
  },
};

const configPath =
  process.platform === "darwin"
    ? "~/Library/Application Support/Claude/claude_desktop_config.json"
    : process.platform === "win32"
      ? "%APPDATA%\\Claude\\claude_desktop_config.json"
      : "~/.config/Claude/claude_desktop_config.json";

const notes: string[] = [
  "",
  "Merge this into your Claude Desktop config, then fully quit and reopen Claude Desktop:",
  `  ${configPath}`,
  '(If you already have other mcpServers, add the "companycam" entry alongside them.)',
  "",
];
if (!existsSync(entry)) {
  notes.push("⚠  dist/index.js not found — run `yarn build` first.");
}
if (!process.env.COMPANYCAM_API_TOKEN) {
  notes.push(
    "⚠  COMPANYCAM_API_TOKEN not set — replace the placeholder, or re-run with it in your env:",
    "     COMPANYCAM_API_TOKEN=xxx MCP_AUTH_TOKEN=yyy yarn claude-config",
  );
}
notes.push("");

console.error(notes.join("\n"));
console.log(JSON.stringify(config, null, 2));
