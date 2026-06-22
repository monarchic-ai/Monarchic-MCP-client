# Storage Artifact Catalog

This catalog records monarchic-mcp-client persistence and evidence surfaces.
Classification values are `structured state` and `object storage / blob`.

| Surface | Classification | Owner | Persistence | Notes |
| --- | --- | --- | --- | --- |
| Local stdio JSON-RPC frames | structured state | monarchic-mcp-client | Transient process stream | Requests and responses bridged between an MCP host and hosted Monarchic-MCP. |
| `.env.local` | structured state | Operator | Local config file | Local endpoint and token configuration; do not commit populated secrets. |
| Hosted MCP endpoint URL and token environment | structured state | Operator | Environment/config | Runtime configuration. |
| Smoke test request/response payloads | structured state | Client shim tests | Transient process payload | Used to verify hosted MCP connectivity. |
| Upstream run summaries and receipts | structured state | Hosted Monarchic-MCP/API | Remote response/artifact | Durable run state belongs to Monarchic infrastructure. |
| Upstream run artifacts | object storage / blob | Hosted Monarchic-MCP/API | Remote artifact | Logs, reports, and patch bytes are remote artifacts, not local shim state. |
| Database queries | structured state | Hosted service | Not owned locally | This client shim does not query databases directly. |

