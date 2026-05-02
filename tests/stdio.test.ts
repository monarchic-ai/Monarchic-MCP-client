import test from "node:test";
import assert from "node:assert/strict";

import { handleJsonRpcLine } from "../src/stdio.js";
import type { UpstreamMcpClient } from "../src/upstream.js";

test("stdio handler forwards valid JSON-RPC requests", async () => {
  const seen: unknown[] = [];
  const upstream: UpstreamMcpClient = {
    async forward(request) {
      seen.push(request);
      return {
        jsonrpc: "2.0",
        id: request.id,
        result: { tools: [] },
      };
    },
  };

  const response = await handleJsonRpcLine(
    '{"jsonrpc":"2.0","id":1,"method":"tools/list"}',
    upstream,
  );

  assert.deepEqual(seen, [
    {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list",
    },
  ]);
  assert.deepEqual(response, {
    jsonrpc: "2.0",
    id: 1,
    result: { tools: [] },
  });
});

test("stdio handler reports parse and validation errors locally", async () => {
  const upstream: UpstreamMcpClient = {
    async forward() {
      throw new Error("should not forward invalid input");
    },
  };

  assert.deepEqual(await handleJsonRpcLine("{", upstream), {
    jsonrpc: "2.0",
    id: null,
    error: {
      code: -32700,
      message: "Parse error",
      data: "SyntaxError: Expected property name or '}' in JSON at position 1 (line 1 column 2)",
    },
  });
  assert.deepEqual(await handleJsonRpcLine('{"id":1}', upstream), {
    jsonrpc: "2.0",
    id: 1,
    error: {
      code: -32600,
      message: "Invalid JSON-RPC request",
    },
  });
});

test("stdio handler maps upstream failures to JSON-RPC errors", async () => {
  const upstream: UpstreamMcpClient = {
    async forward() {
      throw new Error("offline");
    },
  };

  assert.deepEqual(
    await handleJsonRpcLine(
      '{"jsonrpc":"2.0","id":"abc","method":"tools/list"}',
      upstream,
    ),
    {
      jsonrpc: "2.0",
      id: "abc",
      error: {
        code: -32000,
        message: "Monarchic MCP upstream request failed",
        data: "Error: offline",
      },
    },
  );
});
