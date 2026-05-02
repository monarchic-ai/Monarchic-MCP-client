#!/usr/bin/env node

import { resolveMonarchicMcpClientConfig } from "../config.js";
import { runStdioProxy } from "../stdio.js";
import { HttpUpstreamMcpClient } from "../upstream.js";

const config = resolveMonarchicMcpClientConfig();
const upstream = new HttpUpstreamMcpClient(config);

try {
  await runStdioProxy({
    input: process.stdin,
    output: process.stdout,
    errorOutput: process.stderr,
    upstream,
  });
} catch (error) {
  process.stderr.write(`monarchic-mcp: ${String(error)}\n`);
  process.exitCode = 1;
}
