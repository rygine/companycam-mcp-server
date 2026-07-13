import { type ToolAnnotations } from "@modelcontextprotocol/sdk/types.js";
import { type z } from "zod";

/** A single tool definition (see src/tools/tools.ts, generated from openapi.json). */
export interface Tool {
  name: string;
  title?: string;
  description?: string;
  method: string;
  path: string;
  /** Maps a parameter name to its location: "path" | "header" | "query". */
  paramIn?: Record<string, string>;
  /** Zod raw shape passed to `McpServer.registerTool({ inputSchema })`. */
  inputSchema: z.ZodRawShape;
  annotations?: ToolAnnotations;
}
