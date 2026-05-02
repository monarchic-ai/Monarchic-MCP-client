import test from "node:test";
import assert from "node:assert/strict";

import { HttpUpstreamMcpClient, parseUpstreamResponseBody } from "../src/upstream.js";

test("HTTP upstream forwards JSON-RPC with auth headers", async () => {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const client = new HttpUpstreamMcpClient(
    {
      upstreamUrl: "https://mcp.monarchic.test/mcp",
      authorizationHeader: "Bearer token-123",
    },
    async (url, init) => {
      calls.push({ url: String(url), init: init ?? {} });
      return new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          result: { tools: [] },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      );
    },
  );

  assert.deepEqual(
    await client.forward({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
    {
      jsonrpc: "2.0",
      id: 1,
      result: { tools: [] },
    },
  );
  assert.equal(calls.length, 1);
  assert.equal(calls[0]?.url, "https://mcp.monarchic.test/mcp");
  assert.equal(calls[0]?.init.method, "POST");
  assert.deepEqual(JSON.parse(String(calls[0]?.init.body)), {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
  });
  assert.equal(
    (calls[0]?.init.headers as Record<string, string>).authorization,
    "Bearer token-123",
  );
});

test("HTTP upstream parses event-stream JSON-RPC responses", () => {
  assert.deepEqual(
    parseUpstreamResponseBody(
      'event: message\ndata: {"jsonrpc":"2.0","id":1,"result":{"ok":true}}\n\n',
      "text/event-stream",
    ),
    {
      jsonrpc: "2.0",
      id: 1,
      result: { ok: true },
    },
  );
});

test("HTTP upstream reports non-2xx responses", async () => {
  const client = new HttpUpstreamMcpClient(
    {
      upstreamUrl: "https://mcp.monarchic.test/mcp",
      authorizationHeader: null,
    },
    async () => new Response("no", { status: 401, statusText: "Unauthorized" }),
  );

  await assert.rejects(
    () => client.forward({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
    /Monarchic MCP upstream returned HTTP 401 Unauthorized/,
  );
});
