# Monarchic MCP Client

`@monarchic-ai/mcp` is a small stdio MCP shim for hosted Monarchic. MCP hosts
start this package locally, and the shim forwards MCP JSON-RPC requests to the
Monarchic MCP endpoint running in infrastructure.

## Usage

```json
{
  "mcpServers": {
    "monarchic": {
      "command": "pnpm",
      "args": ["dlx", "@monarchic-ai/mcp"],
      "env": {
        "MONARCHIC_API_BASE_URL": "https://dev-api.monarchic.io",
        "MONARCHIC_BEARER_TOKEN": "<token>"
      }
    }
  }
}
```

You can also set an explicit hosted MCP endpoint:

```sh
export MONARCHIC_MCP_URL=https://dev-api.monarchic.io/mcp
export MONARCHIC_BEARER_TOKEN=<token>
pnpm dlx @monarchic-ai/mcp
```

## Configuration

- `MONARCHIC_MCP_URL`: full hosted MCP HTTP endpoint. Takes precedence.
- `MONARCHIC_API_BASE_URL` or `MONARCHIC_API_URL`: base API URL. The shim appends
  `/mcp`.
- `MONARCHIC_BEARER_TOKEN` or `MONARCHIC_API_BEARER_TOKEN`: bearer token.
- `MONARCHIC_API_KEY`: API key fallback; sent as `Authorization: Bearer ...`.

The shim does not execute Monarchic locally and does not read cloud resources
directly. All tool behavior belongs to the hosted Monarchic MCP/API.

## Hosted Smoke Test

The package includes an opt-in non-interactive smoke command for deployment
checks. It verifies the hosted MCP endpoint, required hosted tools, authenticated
session resolution, and run listing. It can also follow a supplied run id or
launch a new run when explicitly enabled.

```sh
export MONARCHIC_API_BASE_URL=https://dev-api.monarchic.io
export MONARCHIC_BEARER_TOKEN=<token-or-api-key>
export MONARCHIC_MCP_SMOKE_TENANT_ID=dev
pnpm smoke:hosted
```

Optional launch/follow inputs:

- `MONARCHIC_MCP_SMOKE_RUN_ID`: follow an existing run after the read-only smoke.
- `MONARCHIC_MCP_SMOKE_LAUNCH=true`: launch a new run, then follow it when the
  launch response includes a run id.
- `MONARCHIC_MCP_SMOKE_PROJECT_KEY`: project key required when launch is enabled.
- `MONARCHIC_MCP_SMOKE_PROMPT`: custom launch prompt.
