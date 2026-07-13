/**
 * Builds the CompanyCam .mcpb bundle for Claude Desktop.
 *
 *   1. Bundle the stdio server into a self-contained file (mcpb-build/server/index.js).
 *   2. Stage manifest.json into mcpb-build/, with `version` synced from package.json.
 *   3. Pack mcpb-build/ into companycam-mcp-server-<version>.mcpb.
 *
 * Run with `yarn bundle`.
 */
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const run = (cmd: string) => execSync(cmd, { cwd: root, stdio: "inherit" });

// 1. Self-contained server bundle -> mcpb-build/server/index.js (clean: true wipes it first).
run("tsdown --config tsdown.mcpb.config.ts");

// 2. Stage the manifest with the version from package.json.
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
  version: string;
};
const manifest = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"));
manifest.version = pkg.version;

const buildDir = join(root, "mcpb-build");
mkdirSync(buildDir, { recursive: true });
writeFileSync(
  join(buildDir, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);

// 3. Pack -> companycam-mcp-server-<version>.mcpb
const output = `companycam-mcp-server-${pkg.version}.mcpb`;
run(`mcpb pack mcpb-build ${output}`);
console.log(`\nBuilt ${output}`);
