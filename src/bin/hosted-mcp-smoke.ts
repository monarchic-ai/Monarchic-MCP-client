#!/usr/bin/env node

import { resolveMonarchicMcpClientConfig } from "../config.js";
import { runHostedMcpSmoke } from "../smoke.js";

function envFlag(name: string): boolean {
  const value = process.env[name];
  return value === "1" || value?.toLowerCase() === "true";
}

try {
  const summary = await runHostedMcpSmoke(resolveMonarchicMcpClientConfig(), {
    tenantId: process.env.MONARCHIC_MCP_SMOKE_TENANT_ID ?? process.env.MONARCHIC_TENANT_ID,
    projectKey:
      process.env.MONARCHIC_MCP_SMOKE_PROJECT_KEY ?? process.env.MONARCHIC_PROJECT_KEY,
    prompt: process.env.MONARCHIC_MCP_SMOKE_PROMPT,
    runId: process.env.MONARCHIC_MCP_SMOKE_RUN_ID,
    launch: envFlag("MONARCHIC_MCP_SMOKE_LAUNCH"),
  });
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
} catch (error) {
  process.stderr.write(`hosted-mcp-smoke: ${String(error)}\n`);
  process.exitCode = 1;
}
