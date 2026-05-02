import type { MonarchicMcpClientConfig } from "./config.js";
import type { JsonRpcRequest, JsonRpcResponse } from "./jsonRpc.js";

export interface UpstreamMcpClient {
  forward(request: JsonRpcRequest): Promise<JsonRpcResponse | null>;
}

export class HttpUpstreamMcpClient implements UpstreamMcpClient {
  constructor(
    private readonly config: MonarchicMcpClientConfig,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async forward(request: JsonRpcRequest): Promise<JsonRpcResponse | null> {
    const response = await this.fetchImpl(this.config.upstreamUrl, {
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(
        `Monarchic MCP upstream returned HTTP ${response.status} ${response.statusText}`.trim(),
      );
    }

    if (request.id === undefined) {
      return null;
    }

    const body = await response.text();
    if (body.trim().length === 0) {
      return null;
    }

    return parseUpstreamResponseBody(
      body,
      response.headers.get("content-type") ?? "",
    );
  }

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
    };
    if (this.config.authorizationHeader !== null) {
      headers.authorization = this.config.authorizationHeader;
    }
    return headers;
  }
}

export function parseUpstreamResponseBody(
  body: string,
  contentType: string,
): JsonRpcResponse {
  if (contentType.toLowerCase().includes("text/event-stream")) {
    const eventData = body
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice("data:".length).trim())
      .filter((line) => line.length > 0 && line !== "[DONE]")
      .join("\n");
    return JSON.parse(eventData) as JsonRpcResponse;
  }

  return JSON.parse(body) as JsonRpcResponse;
}
