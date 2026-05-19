# Hosted MCP Client Architecture

`@monarchic-ai/mcp` is a local stdio shim for MCP hosts. It forwards JSON-RPC
requests to the Monarchic MCP/API endpoint running in infrastructure.

## Boundary

The client owns:

- stdio MCP transport for local MCP hosts
- configuration loading from environment and local ignored env files
- forwarding authenticated JSON-RPC requests to the hosted MCP endpoint
- surfacing hosted API/MCP errors without leaking credentials
- smoke tests that verify the hosted endpoint and required tools

The client must not:

- execute Monarchic locally
- clone repositories or create workspaces
- read AWS, Auth0, Cloudflare, or database resources directly
- implement account creation, billing, or orchestration policy
- hide local run state that conflicts with hosted API state

## Authentication

Hosted MCP users authenticate with credentials issued by the hosted account
surface:

- bearer tokens for clients that can supply an authorization header
- API keys for longer-lived automation clients

The shim sends those credentials to the hosted endpoint. Session resolution,
tenant access, route scopes, entitlement, and usage metering belong to the API.

## Hosted Access Configuration

MCP hosts should configure this package as a local stdio shim and point it at
the hosted API/MCP endpoint:

- `MONARCHIC_MCP_URL` for an explicit hosted MCP URL
- `MONARCHIC_API_BASE_URL` or `MONARCHIC_API_URL` when deriving
  `/mcp/monarchic`
- `MONARCHIC_BEARER_TOKEN`, `MONARCHIC_API_BEARER_TOKEN`, or
  `MONARCHIC_API_KEY` for hosted authorization

The package may load ignored local `.env` or `.env.local` files for developer
convenience, but published clients should treat credentials as operator-local
configuration. It must never read AWS, Auth0, Cloudflare, database, SQS, S3, or
worker-local resources directly.

## Hosted Endpoint Shape

By default, the shim derives the MCP endpoint from `MONARCHIC_API_BASE_URL` by
appending `/mcp/monarchic`. `MONARCHIC_MCP_URL` may override the full endpoint.

The hosted endpoint owns the MCP tools and orchestration behavior. The local
package should stay small enough that future MCP clients for other hosted
Monarchic services can reuse the same boundary pattern.
