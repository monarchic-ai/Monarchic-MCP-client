import test from "node:test";
import assert from "node:assert/strict";

import { resolveMonarchicMcpClientConfig } from "../src/config.js";

test("config resolves explicit MCP URL and bearer token", () => {
  assert.deepEqual(
    resolveMonarchicMcpClientConfig({
      MONARCHIC_MCP_URL: "https://mcp.monarchic.test/rpc",
      MONARCHIC_BEARER_TOKEN: "token-123",
    }),
    {
      upstreamUrl: "https://mcp.monarchic.test/rpc",
      authorizationHeader: "Bearer token-123",
    },
  );
});

test("config derives MCP URL from API base URL", () => {
  assert.deepEqual(
    resolveMonarchicMcpClientConfig({
      MONARCHIC_API_BASE_URL: "https://dev-api.monarchic.io/",
      MONARCHIC_API_KEY: "mk_test",
    }),
    {
      upstreamUrl: "https://dev-api.monarchic.io/mcp",
      authorizationHeader: "Bearer mk_test",
    },
  );
});

test("config defaults to production API MCP endpoint without auth", () => {
  assert.deepEqual(resolveMonarchicMcpClientConfig({}), {
    upstreamUrl: "https://api.monarchic.io/mcp",
    authorizationHeader: null,
  });
});
