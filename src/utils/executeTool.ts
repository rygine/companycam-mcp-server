import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { type Config } from "../config.js";
import { type Tool } from "../tools/types.js";
import { appendQuery } from "./appendQuery.js";
import { errResult } from "./errResult.js";

const API_BASE = "https://api.companycam.com/v2";
const MAX_OUTPUT_CHARS = 60_000;

/** Execute one CompanyCam API call described by a tool definition. */
export async function executeTool(
  tool: Tool,
  args: Record<string, unknown>,
  config: Config,
): Promise<CallToolResult> {
  let path = tool.path;
  const query = new URLSearchParams();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${config.apiToken}`,
    Accept: "application/json",
  };
  if (config.userEmail) headers["X-CompanyCam-User"] = config.userEmail;

  let body: unknown;
  for (const [key, value] of Object.entries(args)) {
    if (value === undefined || value === null) continue;
    if (key === "body") {
      body = value;
      continue;
    }
    const loc = (tool.paramIn && tool.paramIn[key]) || "query";
    if (loc === "path") {
      path = path.replace(`{${key}}`, encodeURIComponent(String(value)));
    } else if (loc === "header") {
      headers[key] = String(value);
    } else {
      appendQuery(query, key, value);
    }
  }

  // Any path placeholder left unfilled is a caller error.
  const missing = path.match(/\{([^}]+)\}/);
  if (missing) {
    return errResult(`Missing required path parameter: ${missing[1]}`);
  }

  const url = `${API_BASE}${path}${query.size ? `?${query.toString()}` : ""}`;
  const init: RequestInit = { method: tool.method, headers };
  if (body !== undefined && !["GET", "DELETE"].includes(tool.method)) {
    headers["Content-Type"] = "application/json";
    init.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  let res: globalThis.Response;
  try {
    res = await fetch(url, init);
  } catch (e) {
    return errResult(
      `Network error calling CompanyCam API: ${e instanceof Error ? e.message : String(e)}`,
    );
  }

  const meta: Record<string, string> = {};
  for (const h of [
    "x-next-cursor",
    "x-prev-cursor",
    "retry-after",
    "x-ratelimit-remaining",
  ]) {
    const v = res.headers.get(h);
    if (v) meta[h] = v;
  }

  const raw = await res.text();
  let parsed: unknown;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = raw;
  }

  if (!res.ok) {
    const detail = typeof parsed === "string" ? parsed : JSON.stringify(parsed);
    let msg = `CompanyCam API error ${res.status} ${res.statusText} on ${tool.method} ${path}: ${detail || "(no body)"}`;
    if (res.status === 401)
      msg += " — check that COMPANYCAM_API_TOKEN is valid and not expired.";
    if (res.status === 429)
      msg += ` — rate limited; retry after ${meta["retry-after"] || "a few"} seconds.`;
    return errResult(msg);
  }

  const payload = {
    status: res.status,
    ...(Object.keys(meta).length ? { pagination_headers: meta } : {}),
    data: parsed ?? "(empty response — success)",
  };
  let text = JSON.stringify(payload, null, 2);
  if (text.length > MAX_OUTPUT_CHARS) {
    text =
      text.slice(0, MAX_OUTPUT_CHARS) +
      `\n... [truncated at ${MAX_OUTPUT_CHARS} chars — use per_page/page or cursor pagination (after/before) to narrow results]`;
  }
  return { content: [{ type: "text", text }] };
}
