/**
 * OpenAPI -> Zod codegen
 * ----------------------
 * Reads openapi.json (CompanyCam Core API v2) and generates tools.ts: a typed
 * `tools` array where each tool's `inputSchema` is a real Zod raw shape written
 * out as code. This replaces runtime JSON-Schema-to-Zod conversion — the Zod
 * schemas are baked in at build time and imported directly by src/index.ts.
 *
 * Run with: `yarn generate` (tsx src/tools/convert.ts)
 *
 * Fidelity notes (same rules the runtime converter used):
 *   - Object schemas emit `z.looseObject(...)` so unknown keys pass through —
 *     the free-form request `body` must not be stripped by input validation.
 *   - OpenAPI's custom `format` values (id / int32 / int64 / float) have no Zod
 *     equivalent, so they are folded into the field description.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

/** The JSON Schema subset that appears in the CompanyCam OpenAPI spec. */
interface JsonSchema {
  $ref?: string;
  type?: string;
  description?: string;
  format?: string;
  default?: unknown;
  nullable?: boolean;
  maximum?: number;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
}

interface Parameter {
  name: string;
  in?: string;
  description?: string;
  required?: boolean;
  schema?: JsonSchema;
}

interface Operation {
  operationId: string;
  summary?: string;
  description?: string;
  parameters?: Parameter[];
  requestBody?: {
    required?: boolean;
    content?: Record<string, { schema?: JsonSchema }>;
  };
}

interface OpenApiSpec {
  paths: Record<string, Record<string, Operation>>;
  components: { schemas: Record<string, JsonSchema> };
}

const spec = JSON.parse(
  readFileSync(join(here, "openapi.json"), "utf8"),
) as OpenApiSpec;
const schemas = spec.components.schemas;

/** Resolve $ref recursively (with cycle guard) and strip response-only noise. */
function deref(node: unknown, seen = new Set<string>()): JsonSchema {
  if (node === null || typeof node !== "object") return node as JsonSchema;
  if (Array.isArray(node)) {
    return node.map((n) => deref(n, seen)) as unknown as JsonSchema;
  }
  const record = node as Record<string, unknown>;
  if (typeof record.$ref === "string") {
    const name = record.$ref.split("/").pop() ?? "";
    if (seen.has(name)) return { type: "object", description: `(${name})` };
    const next = new Set(seen);
    next.add(name);
    return deref(schemas[name] ?? {}, next);
  }
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(record)) {
    if (k === "example" || k === "examples" || k === "xml") continue;
    out[k] = deref(v, seen);
  }
  return out as JsonSchema;
}

const toSnake = (s: string): string =>
  s.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();

// ---------------------------------------------------------------------------
// Zod code emitter
// ---------------------------------------------------------------------------

/** Emit a Zod expression (as source code) for one JSON Schema node. */
function zodExpr(schema: JsonSchema): string {
  // `type` is sometimes omitted; JSON Schema infers it from `properties`/`items`.
  const type =
    schema.type ??
    (schema.properties ? "object" : schema.items ? "array" : undefined);

  let expr: string;
  switch (type) {
    case "string":
      expr = "z.string()";
      break;
    case "integer":
      expr =
        "z.number().int()" +
        (typeof schema.maximum === "number" ? `.max(${schema.maximum})` : "");
      break;
    case "number":
      expr =
        "z.number()" +
        (typeof schema.maximum === "number" ? `.max(${schema.maximum})` : "");
      break;
    case "boolean":
      expr = "z.boolean()";
      break;
    case "array":
      expr = `z.array(${schema.items ? zodExpr(schema.items) : "z.unknown()"})`;
      break;
    case "object":
      // Loose: preserve unknown keys (bodies are free-form pass-through).
      expr = `z.looseObject(${shapeLiteral(schema)})`;
      break;
    default:
      expr = "z.unknown()";
  }

  const notes = [
    schema.description,
    schema.format ? `format: ${schema.format}` : undefined,
  ].filter(Boolean) as string[];
  if (notes.length > 0)
    expr += `.describe(${JSON.stringify(notes.join(" — "))})`;
  if (schema.nullable) expr += ".nullable()";
  if (schema.default !== undefined) {
    expr += `.default(${JSON.stringify(schema.default)})`;
  }
  return expr;
}

/** Emit an object literal of Zod properties (a raw shape) as source code. */
function shapeLiteral(schema: JsonSchema): string {
  const required = new Set(schema.required ?? []);
  const entries = Object.entries(schema.properties ?? {}).map(([key, prop]) => {
    const value = required.has(key)
      ? zodExpr(prop)
      : `${zodExpr(prop)}.optional()`;
    return `${JSON.stringify(key)}: ${value}`;
  });
  return entries.length > 0 ? `{ ${entries.join(", ")} }` : "{}";
}

// ---------------------------------------------------------------------------
// Extract tools from the spec (mirrors the fields src/index.ts expects)
// ---------------------------------------------------------------------------

interface ExtractedTool {
  name: string;
  title?: string;
  description: string;
  method: string;
  path: string;
  paramIn: Record<string, string>;
  shape: string; // pre-rendered Zod raw shape source
  annotations: Record<string, unknown>;
}

const tools: ExtractedTool[] = [];
for (const [apiPath, methods] of Object.entries(spec.paths)) {
  for (const [method, op] of Object.entries(methods)) {
    const properties: Record<string, JsonSchema> = {};
    const required: string[] = [];
    const paramIn: Record<string, string> = {};

    for (const p of op.parameters ?? []) {
      const schema = deref(p.schema ?? { type: "string" });
      properties[p.name] = { ...schema };
      if (p.description) properties[p.name].description = p.description;
      paramIn[p.name] = p.in ?? "query";
      if (p.in === "path") {
        properties[p.name].description =
          (properties[p.name].description ?? "") +
          " (path parameter, required)";
        required.push(p.name);
      } else if (p.required) {
        required.push(p.name);
      }
    }

    const rbSchema = op.requestBody?.content?.["application/json"]?.schema;
    if (rbSchema) {
      const bodySchema = deref(rbSchema);
      properties.body = {
        ...bodySchema,
        description:
          "JSON request body." +
          (bodySchema.description ? " " + bodySchema.description : ""),
      };
      if (op.requestBody?.required !== false) required.push("body");
    }

    const isGet = method === "get";
    const isDelete = method === "delete";
    const desc = [op.summary, op.description].filter(Boolean).join(" — ");

    tools.push({
      name: toSnake(op.operationId),
      title: op.summary,
      description: `${desc}. ${method.toUpperCase()} ${apiPath}`,
      method: method.toUpperCase(),
      path: apiPath,
      paramIn,
      shape: shapeLiteral({
        type: "object",
        properties,
        ...(required.length ? { required } : {}),
      }),
      annotations: {
        title: op.summary,
        readOnlyHint: isGet,
        destructiveHint: isDelete,
        idempotentHint: isGet || method === "put" || isDelete,
        openWorldHint: true,
      },
    });
  }
}

tools.sort((a, b) => a.name.localeCompare(b.name));

// ---------------------------------------------------------------------------
// Render tools.ts
// ---------------------------------------------------------------------------

function renderTool(t: ExtractedTool): string {
  const fields = [
    `name: ${JSON.stringify(t.name)}`,
    t.title !== undefined ? `title: ${JSON.stringify(t.title)}` : undefined,
    `description: ${JSON.stringify(t.description)}`,
    `method: ${JSON.stringify(t.method)}`,
    `path: ${JSON.stringify(t.path)}`,
    `paramIn: ${JSON.stringify(t.paramIn)}`,
    `inputSchema: ${t.shape}`,
    `annotations: ${JSON.stringify(t.annotations)}`,
  ].filter(Boolean);
  return `  {\n    ${fields.join(",\n    ")},\n  },`;
}

const output = `// GENERATED FILE — do not edit by hand.
// Run \`yarn generate\` (src/tools/convert.ts) to regenerate from openapi.json.

import { z } from "zod";

import { type Tool } from "./types.js";

const tools: Tool[] = [
${tools.map(renderTool).join("\n")}
];

export default tools;
`;

writeFileSync(join(here, "tools.ts"), output);
console.log(`Wrote tools.ts with ${tools.length} tools`);
