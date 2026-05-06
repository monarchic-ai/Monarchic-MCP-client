export interface MonarchicMcpClientConfig {
  upstreamUrl: string;
  authorizationHeader: string | null;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function readNonEmptyEnv(
  env: NodeJS.ProcessEnv,
  names: readonly string[],
): string | null {
  for (const name of names) {
    const value = env[name];
    if (value !== undefined && value.trim().length > 0) {
      return value.trim();
    }
  }
  return null;
}

export function resolveMonarchicMcpClientConfig(
  env: NodeJS.ProcessEnv = process.env,
): MonarchicMcpClientConfig {
  const explicitMcpUrl = readNonEmptyEnv(env, ["MONARCHIC_MCP_URL"]);
  const apiBaseUrl = readNonEmptyEnv(env, [
    "MONARCHIC_API_BASE_URL",
    "MONARCHIC_API_URL",
  ]);
  const upstreamUrl =
    explicitMcpUrl ??
    `${trimTrailingSlash(apiBaseUrl ?? "https://api.monarchic.io")}/mcp/monarchic`;
  const token = readNonEmptyEnv(env, [
    "MONARCHIC_BEARER_TOKEN",
    "MONARCHIC_API_BEARER_TOKEN",
    "MONARCHIC_API_KEY",
  ]);

  return {
    upstreamUrl,
    authorizationHeader: token === null ? null : `Bearer ${token}`,
  };
}
