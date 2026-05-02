import type { MonarchicMcpClientConfig } from "./config.js";
import type { JsonRpcRequest, JsonRpcResponse } from "./jsonRpc.js";
import { HttpUpstreamMcpClient } from "./upstream.js";

export interface HostedMcpSmokeOptions {
  tenantId?: string;
  projectKey?: string;
  prompt?: string;
  runId?: string;
  launch?: boolean;
}

export interface HostedMcpSmokeSummary {
  upstreamUrl: string;
  serverName: string | null;
  toolNames: string[];
  sessionAuthenticated: boolean;
  listedRuns: boolean;
  launchedRunId: string | null;
  followedRunId: string | null;
}

const REQUIRED_HOSTED_TOOLS = [
  "monarchic_session",
  "monarchic_runs_list",
  "monarchic_launch",
  "monarchic_run_follow",
] as const;

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function resultOf(response: JsonRpcResponse | null, label: string): unknown {
  if (response === null) {
    throw new Error(`${label} returned no JSON-RPC response`);
  }
  if (isObject(response) && isObject(response.error)) {
    throw new Error(`${label} returned JSON-RPC error: ${JSON.stringify(response.error)}`);
  }
  if (!isObject(response) || !("result" in response)) {
    throw new Error(`${label} returned malformed JSON-RPC response`);
  }
  return response.result;
}

function textContentJson(value: unknown, label: string): unknown {
  if (!isObject(value) || !Array.isArray(value.content)) {
    throw new Error(`${label} returned malformed MCP tool content`);
  }
  const first = value.content[0];
  if (!isObject(first) || first.type !== "text" || typeof first.text !== "string") {
    throw new Error(`${label} did not return text content`);
  }
  return JSON.parse(first.text) as unknown;
}

function jsonRpcRequest(
  id: number,
  method: string,
  params?: unknown,
): JsonRpcRequest {
  return params === undefined
    ? { jsonrpc: "2.0", id, method }
    : { jsonrpc: "2.0", id, method, params };
}

function readRunId(value: unknown): string | null {
  if (!isObject(value)) {
    return null;
  }
  for (const key of ["runId", "run_id"]) {
    const candidate = value[key];
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }
  return null;
}

export async function runHostedMcpSmoke(
  config: MonarchicMcpClientConfig,
  options: HostedMcpSmokeOptions = {},
  fetchImpl: typeof fetch = fetch,
): Promise<HostedMcpSmokeSummary> {
  if (config.authorizationHeader === null) {
    throw new Error(
      "Hosted MCP smoke requires MONARCHIC_BEARER_TOKEN, MONARCHIC_API_BEARER_TOKEN, or MONARCHIC_API_KEY.",
    );
  }

  const client = new HttpUpstreamMcpClient(config, fetchImpl);
  let requestId = 1;
  const forward = (request: Omit<JsonRpcRequest, "jsonrpc" | "id">) =>
    client.forward(jsonRpcRequest(requestId++, request.method, request.params));

  const initialize = resultOf(
    await forward({
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: {
          name: "@monarchic-ai/mcp-smoke",
          version: "0.1.0",
        },
      },
    }),
    "initialize",
  );
  const serverName =
    isObject(initialize) &&
    isObject(initialize.serverInfo) &&
    typeof initialize.serverInfo.name === "string"
      ? initialize.serverInfo.name
      : null;

  const toolsResult = resultOf(await forward({ method: "tools/list" }), "tools/list");
  if (!isObject(toolsResult) || !Array.isArray(toolsResult.tools)) {
    throw new Error("tools/list returned malformed hosted MCP tool inventory");
  }
  const toolNames = toolsResult.tools
    .map((tool) => (isObject(tool) && typeof tool.name === "string" ? tool.name : null))
    .filter((toolName): toolName is string => toolName !== null);
  const missingTools = REQUIRED_HOSTED_TOOLS.filter((toolName) => !toolNames.includes(toolName));
  if (missingTools.length > 0) {
    throw new Error(`Hosted MCP is missing required tools: ${missingTools.join(", ")}`);
  }

  const sessionResult = resultOf(
    await forward({
      method: "tools/call",
      params: {
        name: "monarchic_session",
        arguments: {},
      },
    }),
    "monarchic_session",
  );
  const session = textContentJson(sessionResult, "monarchic_session");
  const sessionAuthenticated = isObject(session) && session.authenticated === true;
  if (!sessionAuthenticated) {
    throw new Error("monarchic_session did not return an authenticated session");
  }

  resultOf(
    await forward({
      method: "tools/call",
      params: {
        name: "monarchic_runs_list",
        arguments: options.tenantId === undefined ? {} : { tenantId: options.tenantId },
      },
    }),
    "monarchic_runs_list",
  );

  let launchedRunId: string | null = null;
  if (options.launch === true) {
    if (options.projectKey === undefined || options.projectKey.trim().length === 0) {
      throw new Error("MONARCHIC_MCP_SMOKE_PROJECT_KEY is required when launch smoke is enabled");
    }
    const launchResult = resultOf(
      await forward({
        method: "tools/call",
        params: {
          name: "monarchic_launch",
          arguments: {
            ...(options.tenantId === undefined ? {} : { tenantId: options.tenantId }),
            projectKey: options.projectKey,
            prompt:
              options.prompt ??
              "Hosted MCP smoke launch. Confirm the control plane accepts authenticated MCP launch requests.",
          },
        },
      }),
      "monarchic_launch",
    );
    launchedRunId = readRunId(textContentJson(launchResult, "monarchic_launch"));
  }

  const followedRunId = options.runId ?? launchedRunId;
  if (followedRunId !== null && followedRunId !== undefined) {
    resultOf(
      await forward({
        method: "tools/call",
        params: {
          name: "monarchic_run_follow",
          arguments: { runId: followedRunId },
        },
      }),
      "monarchic_run_follow",
    );
  }

  return {
    upstreamUrl: config.upstreamUrl,
    serverName,
    toolNames,
    sessionAuthenticated,
    listedRuns: true,
    launchedRunId,
    followedRunId: followedRunId ?? null,
  };
}
