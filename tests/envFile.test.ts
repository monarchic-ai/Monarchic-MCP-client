import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { loadMonarchicEnvFiles } from "../src/envFile.js";

test("env file loader reads .env and .env.local from the working directory", () => {
  const cwd = mkdtempSync(join(tmpdir(), "monarchic-mcp-env-"));
  const env: NodeJS.ProcessEnv = {};

  writeFileSync(
    join(cwd, ".env"),
    [
      "MONARCHIC_API_BASE_URL=https://api.example.test",
      "MONARCHIC_BEARER_TOKEN=from-env",
    ].join("\n"),
  );
  writeFileSync(
    join(cwd, ".env.local"),
    [
      "MONARCHIC_BEARER_TOKEN=from-local",
      "export MONARCHIC_MCP_SMOKE_TENANT_ID=dev",
      "QUOTED_VALUE=\"quoted value\"",
    ].join("\n"),
  );

  loadMonarchicEnvFiles({ cwd, env });

  assert.equal(env.MONARCHIC_API_BASE_URL, "https://api.example.test");
  assert.equal(env.MONARCHIC_BEARER_TOKEN, "from-local");
  assert.equal(env.MONARCHIC_MCP_SMOKE_TENANT_ID, "dev");
  assert.equal(env.QUOTED_VALUE, "quoted value");
});

test("env file loader preserves existing shell environment values", () => {
  const cwd = mkdtempSync(join(tmpdir(), "monarchic-mcp-env-"));
  const env: NodeJS.ProcessEnv = {
    MONARCHIC_BEARER_TOKEN: "from-shell",
  };

  writeFileSync(join(cwd, ".env.local"), "MONARCHIC_BEARER_TOKEN=from-file\n");

  loadMonarchicEnvFiles({ cwd, env });

  assert.equal(env.MONARCHIC_BEARER_TOKEN, "from-shell");
});
