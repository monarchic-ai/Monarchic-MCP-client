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
