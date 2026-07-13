import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";

/** Build an error tool result carrying the given message. */
export function errResult(message: string): CallToolResult {
  return { isError: true, content: [{ type: "text", text: message }] };
}
