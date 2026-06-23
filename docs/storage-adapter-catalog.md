# Storage Adapter Catalog

This catalog maps each artifact surface from `docs/storage-artifact-catalog.md` to the required storage adapters.
Structured state surfaces are covered by SQLite and DynamoDB adapters. Object storage / blob surfaces are covered by MinIO and S3 adapters.

The machine-readable source of truth is `docs/storage-adapter-manifest.json`.

| Artifact ID | Surface | Classification | Required adapters |
| --- | --- | --- | --- |
| `001-local-stdio-json-rpc-frames` | Local stdio JSON-RPC frames | structured state | `sqlite`, `dynamodb` |
| `002-env-local` | `.env.local` | structured state | `sqlite`, `dynamodb` |
| `003-hosted-mcp-endpoint-url-and-token-environment` | Hosted MCP endpoint URL and token environment | structured state | `sqlite`, `dynamodb` |
| `004-smoke-test-request-response-payloads` | Smoke test request/response payloads | structured state | `sqlite`, `dynamodb` |
| `005-upstream-run-summaries-and-receipts` | Upstream run summaries and receipts | structured state | `sqlite`, `dynamodb` |
| `006-upstream-run-artifacts` | Upstream run artifacts | object storage / blob | `minio`, `s3` |
| `007-database-queries` | Database queries | structured state | `sqlite`, `dynamodb` |

## Adapter Contracts

- `sqlite`: stores structured artifacts in `artifact_state_records` keyed by `repo_id` and `artifact_id`, with JSON payload and metadata columns.
- `dynamodb`: stores structured artifacts in `${DYNAMODB_ARTIFACT_STATE_TABLE}` keyed by repository partition and artifact sort key.
- `minio`: stores blob artifacts in `${MINIO_ARTIFACT_BUCKET}` below `<repo>/<artifact_id>/` object keys with metadata headers.
- `s3`: stores blob artifacts in `${S3_ARTIFACT_BUCKET}` below `<repo>/<artifact_id>/` object keys with object metadata tags.
