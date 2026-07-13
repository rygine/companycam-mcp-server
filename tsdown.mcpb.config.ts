import { defineConfig } from "tsdown";

// Self-contained build for the .mcpb bundle: inline all dependencies into a
// single ESM file under mcpb-build/server/ so it runs under Claude Desktop's
// bundled Node runtime without a node_modules folder.
//
// Express is intentionally left external: stdio mode never imports it (see
// src/index.ts, where it is a dynamic import inside the HTTP branch), so it is
// dead code for the bundle. Excluding it keeps the bundle small and avoids
// bundling Express's CommonJS internals.
//
// Target node20 (conservative) because the runtime version Claude Desktop
// ships is not pinned; package.json's engines ">=26" is stricter than the code
// actually needs.
export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  platform: "node",
  target: "node20",
  outDir: "mcpb-build/server",
  fixedExtension: false,
  noExternal: [/.*/],
  external: ["express"],
  dts: false,
  sourcemap: false,
  clean: true,
});
