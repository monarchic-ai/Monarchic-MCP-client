import test from "node:test";
import assert from "node:assert/strict";

import { runHostedMcpSmoke } from "../src/smoke.js";

test("hosted MCP smoke verifies tools, session, runs list, and optional follow", async () => {
  const requests: unknown[] = [];
  const summary = await runHostedMcpSmoke(
    {
      upstreamUrl: "https://mcp.monarchic.test/mcp",
      authorizationHeader: "Bearer token-123",
    },
    {
      tenantId: "dev",
      runId: "run-smoke",
    },
    async (_url, init) => {
      const request = JSON.parse(String(init?.body)) as {
        id: number;
        method: string;
        params?: { name?: string };
      };
      requests.push(request);
      if (request.method === "initialize") {
        return Response.json({
          jsonrpc: "2.0",
          id: request.id,
          result: {
            serverInfo: { name: "monarchic-api-mcp" },
          },
        });
      }
      if (request.method === "tools/list") {
        return Response.json({
          jsonrpc: "2.0",
          id: request.id,
          result: {
            tools: [
              { name: "monarchic_session" },
              { name: "monarchic_runs_list" },
              { name: "monarchic_launch" },
              { name: "monarchic_run_follow" },
            ],
          },
        });
      }
      if (request.params?.name === "monarchic_session") {
        return Response.json({
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify({ authenticated: true }),
              },
            ],
          },
        });
      }
      return Response.json({
        jsonrpc: "2.0",
        id: request.id,
        result: {
          content: [{ type: "text", text: "{}" }],
        },
      });
    },
  );

  assert.equal(summary.serverName, "monarchic-api-mcp");
  assert.equal(summary.sessionAuthenticated, true);
  assert.equal(summary.listedRuns, true);
  assert.equal(summary.followedRunId, "run-smoke");
  assert.deepEqual(
    requests.map((request) => (request as { method: string; params?: { name?: string } }).params?.name ?? (request as { method: string }).method),
    [
      "initialize",
      "tools/list",
      "monarchic_session",
      "monarchic_runs_list",
      "monarchic_run_follow",
    ],
  );
});

test("hosted MCP smoke requires an auth credential", async () => {
  await assert.rejects(
    () =>
      runHostedMcpSmoke({
        upstreamUrl: "https://mcp.monarchic.test/mcp",
        authorizationHeader: null,
      }),
    /requires MONARCHIC_BEARER_TOKEN/,
  );
});
