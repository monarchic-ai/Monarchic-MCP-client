import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";

test("compiled bin proxies stdio JSON-RPC to hosted MCP endpoint", async () => {
  const server = createServer((request, response) => {
    assert.equal(request.method, "POST");
    assert.equal(request.url, "/mcp");
    assert.equal(request.headers.authorization, "Bearer token-123");

    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      assert.deepEqual(JSON.parse(body), {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/list",
      });
      response.writeHead(200, { "content-type": "application/json" });
      response.end(
        JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          result: { tools: [] },
        }),
      );
    });
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address() as AddressInfo;

  const child = spawn(process.execPath, ["dist/bin/monarchic-mcp.js"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      MONARCHIC_MCP_URL: `http://127.0.0.1:${address.port}/mcp`,
      MONARCHIC_BEARER_TOKEN: "token-123",
    },
    stdio: ["pipe", "pipe", "pipe"],
  });
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    stdout += chunk;
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });

  child.stdin.end('{"jsonrpc":"2.0","id":1,"method":"tools/list"}\n');
  const [exitCode] = (await once(child, "exit")) as [number | null];
  server.close();

  assert.equal(exitCode, 0, stderr);
  assert.deepEqual(JSON.parse(stdout.trim()), {
    jsonrpc: "2.0",
    id: 1,
    result: { tools: [] },
  });
});
