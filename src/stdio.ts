import { createInterface } from "node:readline";
import type { Readable, Writable } from "node:stream";

import {
  buildJsonRpcErrorResponse,
  isJsonRpcRequest,
  type JsonRpcRequest,
  type JsonRpcResponse,
} from "./jsonRpc.js";
import type { UpstreamMcpClient } from "./upstream.js";

export interface StdioProxyOptions {
  input: Readable;
  output: Writable;
  errorOutput?: Writable;
  upstream: UpstreamMcpClient;
}

function requestIdOf(parsed: unknown): string | number | null {
  if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
    const id = (parsed as Record<string, unknown>).id;
    if (typeof id === "string" || typeof id === "number" || id === null) {
      return id;
    }
  }
  return null;
}

function writeJsonLine(output: Writable, value: JsonRpcResponse): void {
  output.write(`${JSON.stringify(value)}\n`);
}

export async function handleJsonRpcLine(
  line: string,
  upstream: UpstreamMcpClient,
): Promise<JsonRpcResponse | null> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(line) as unknown;
  } catch (error) {
    return buildJsonRpcErrorResponse(
      null,
      -32700,
      "Parse error",
      String(error),
    );
  }

  if (!isJsonRpcRequest(parsed)) {
    return buildJsonRpcErrorResponse(
      requestIdOf(parsed),
      -32600,
      "Invalid JSON-RPC request",
    );
  }

  try {
    return await upstream.forward(parsed satisfies JsonRpcRequest);
  } catch (error) {
    if (parsed.id === undefined) {
      return null;
    }
    return buildJsonRpcErrorResponse(
      parsed.id,
      -32000,
      "Monarchic MCP upstream request failed",
      String(error),
    );
  }
}

export async function runStdioProxy(options: StdioProxyOptions): Promise<void> {
  const lines = createInterface({
    input: options.input,
    crlfDelay: Infinity,
  });

  for await (const line of lines) {
    if (line.trim().length === 0) {
      continue;
    }
    const response = await handleJsonRpcLine(line, options.upstream);
    if (response !== null) {
      writeJsonLine(options.output, response);
    }
  }
}
