# 5NF State Schema

This document defines repo-specific fifth-normal-form schemas for structured-state artifacts in `docs/storage-artifact-catalog.md`.
Each atomic fact has its own relation; there is no generic payload table and no generic EAV field table.
Object storage / blob artifacts are intentionally excluded from relational state tables except by reference facts.

Structured-state artifacts covered: 6
Blob artifacts excluded: 1

## 001_local_stdio_json_rpc_frames

Surface: Local stdio JSON-RPC frames

Candidate key: `001_local_stdio_json_rpc_frames_id`

| Relation | Purpose | Primary key |
| --- | --- | --- |
| `monarchic_mcp_client__001_local_stdio_json_rpc_frames__identity` | Artifact identity and catalog binding. | `001_local_stdio_json_rpc_frames_id` |
| `monarchic_mcp_client__001_local_stdio_json_rpc_frames__catalog_version` | Catalog-version provenance independent of artifact contents. | `001_local_stdio_json_rpc_frames_id, catalog_sha256` |
| `monarchic_mcp_client__001_local_stdio_json_rpc_frames__owner` | Owner assignment independent of persistence and artifact facts. | `001_local_stdio_json_rpc_frames_id, owner_name` |
| `monarchic_mcp_client__001_local_stdio_json_rpc_frames__persistence` | Persistence location/pattern independent of owner and facts. | `001_local_stdio_json_rpc_frames_id, persistence_kind, location_pattern` |
| `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_stdio` | Atomic stdio fact for this artifact. | `001_local_stdio_json_rpc_frames_id, stdio_value` |
| `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_json_rpc` | Atomic json_rpc fact for this artifact. | `001_local_stdio_json_rpc_frames_id, json_rpc_value` |
| `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_frames` | Atomic frames fact for this artifact. | `001_local_stdio_json_rpc_frames_id, frames_value` |
| `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_process` | Atomic process fact for this artifact. | `001_local_stdio_json_rpc_frames_id, process_value` |
| `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_stream` | Atomic stream fact for this artifact. | `001_local_stdio_json_rpc_frames_id, stream_value` |
| `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_requests` | Atomic requests fact for this artifact. | `001_local_stdio_json_rpc_frames_id, requests_value` |
| `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_responses` | Atomic responses fact for this artifact. | `001_local_stdio_json_rpc_frames_id, responses_value` |
| `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_bridged` | Atomic bridged fact for this artifact. | `001_local_stdio_json_rpc_frames_id, bridged_value` |
| `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_between` | Atomic between fact for this artifact. | `001_local_stdio_json_rpc_frames_id, between_value` |
| `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_host` | Atomic host fact for this artifact. | `001_local_stdio_json_rpc_frames_id, host_value` |
| `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_hosted` | Atomic hosted fact for this artifact. | `001_local_stdio_json_rpc_frames_id, hosted_value` |
| `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_monarchic_mcp` | Atomic monarchic_mcp fact for this artifact. | `001_local_stdio_json_rpc_frames_id, monarchic_mcp_value` |
| `monarchic_mcp_client__001_local_stdio_json_rpc_frames__evidence_reference` | Reference-only evidence relation; bytes and object payloads stay outside relational state. | `001_local_stdio_json_rpc_frames_id, reference_kind, reference_value` |

Atomic fact relations: `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_stdio`, `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_json_rpc`, `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_frames`, `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_process`, `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_stream`, `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_requests`, `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_responses`, `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_bridged`, `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_between`, `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_host`, `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_hosted`, `monarchic_mcp_client__001_local_stdio_json_rpc_frames__fact_monarchic_mcp`

Reconstruction view: `monarchic_mcp_client__001_local_stdio_json_rpc_frames__reconstruction_v`

## 002_env_local

Surface: `.env.local`

Candidate key: `002_env_local_id`

| Relation | Purpose | Primary key |
| --- | --- | --- |
| `monarchic_mcp_client__002_env_local__identity` | Artifact identity and catalog binding. | `002_env_local_id` |
| `monarchic_mcp_client__002_env_local__catalog_version` | Catalog-version provenance independent of artifact contents. | `002_env_local_id, catalog_sha256` |
| `monarchic_mcp_client__002_env_local__owner` | Owner assignment independent of persistence and artifact facts. | `002_env_local_id, owner_name` |
| `monarchic_mcp_client__002_env_local__persistence` | Persistence location/pattern independent of owner and facts. | `002_env_local_id, persistence_kind, location_pattern` |
| `monarchic_mcp_client__002_env_local__fact_env` | Atomic env fact for this artifact. | `002_env_local_id, env_value` |
| `monarchic_mcp_client__002_env_local__fact_config` | Atomic config fact for this artifact. | `002_env_local_id, config_value` |
| `monarchic_mcp_client__002_env_local__fact_endpoint` | Atomic endpoint fact for this artifact. | `002_env_local_id, endpoint_value` |
| `monarchic_mcp_client__002_env_local__fact_token` | Atomic token fact for this artifact. | `002_env_local_id, token_value` |
| `monarchic_mcp_client__002_env_local__fact_configuration` | Atomic configuration fact for this artifact. | `002_env_local_id, configuration_value` |
| `monarchic_mcp_client__002_env_local__fact_commit` | Atomic commit fact for this artifact. | `002_env_local_id, commit_value` |
| `monarchic_mcp_client__002_env_local__fact_populated` | Atomic populated fact for this artifact. | `002_env_local_id, populated_value` |
| `monarchic_mcp_client__002_env_local__fact_secrets` | Atomic secrets fact for this artifact. | `002_env_local_id, secrets_value` |
| `monarchic_mcp_client__002_env_local__evidence_reference` | Reference-only evidence relation; bytes and object payloads stay outside relational state. | `002_env_local_id, reference_kind, reference_value` |

Atomic fact relations: `monarchic_mcp_client__002_env_local__fact_env`, `monarchic_mcp_client__002_env_local__fact_config`, `monarchic_mcp_client__002_env_local__fact_endpoint`, `monarchic_mcp_client__002_env_local__fact_token`, `monarchic_mcp_client__002_env_local__fact_configuration`, `monarchic_mcp_client__002_env_local__fact_commit`, `monarchic_mcp_client__002_env_local__fact_populated`, `monarchic_mcp_client__002_env_local__fact_secrets`

Reconstruction view: `monarchic_mcp_client__002_env_local__reconstruction_v`

## 003_hosted_mcp_endpoint_url_and_token_environment

Surface: Hosted MCP endpoint URL and token environment

Candidate key: `003_hosted_mcp_endpoint_url_and_token_environment_id`

| Relation | Purpose | Primary key |
| --- | --- | --- |
| `monarchic_mcp_client__003_hosted_mcp_endpoint_url_and_token_environment__identity` | Artifact identity and catalog binding. | `003_hosted_mcp_endpoint_url_and_token_environment_id` |
| `monarchic_mcp_client__003_hosted_mcp_endpoint_url_and_token_environment__catalog_version` | Catalog-version provenance independent of artifact contents. | `003_hosted_mcp_endpoint_url_and_token_environment_id, catalog_sha256` |
| `monarchic_mcp_client__003_hosted_mcp_endpoint_url_and_token_environment__owner` | Owner assignment independent of persistence and artifact facts. | `003_hosted_mcp_endpoint_url_and_token_environment_id, owner_name` |
| `monarchic_mcp_client__003_hosted_mcp_endpoint_url_and_token_environment__persistence` | Persistence location/pattern independent of owner and facts. | `003_hosted_mcp_endpoint_url_and_token_environment_id, persistence_kind, location_pattern` |
| `monarchic_mcp_client__003_hosted_mcp_endpoint_url_and_token_environment__fact_hosted` | Atomic hosted fact for this artifact. | `003_hosted_mcp_endpoint_url_and_token_environment_id, hosted_value` |
| `monarchic_mcp_client__003_hosted_mcp_endpoint_url_and_token_environment__fact_endpoint` | Atomic endpoint fact for this artifact. | `003_hosted_mcp_endpoint_url_and_token_environment_id, endpoint_value` |
| `monarchic_mcp_client__003_hosted_mcp_endpoint_url_and_token_environment__fact_url` | Atomic url fact for this artifact. | `003_hosted_mcp_endpoint_url_and_token_environment_id, url_value` |
| `monarchic_mcp_client__003_hosted_mcp_endpoint_url_and_token_environment__fact_token` | Atomic token fact for this artifact. | `003_hosted_mcp_endpoint_url_and_token_environment_id, token_value` |
| `monarchic_mcp_client__003_hosted_mcp_endpoint_url_and_token_environment__fact_environment` | Atomic environment fact for this artifact. | `003_hosted_mcp_endpoint_url_and_token_environment_id, environment_value` |
| `monarchic_mcp_client__003_hosted_mcp_endpoint_url_and_token_environment__fact_config` | Atomic config fact for this artifact. | `003_hosted_mcp_endpoint_url_and_token_environment_id, config_value` |
| `monarchic_mcp_client__003_hosted_mcp_endpoint_url_and_token_environment__fact_configuration` | Atomic configuration fact for this artifact. | `003_hosted_mcp_endpoint_url_and_token_environment_id, configuration_value` |
| `monarchic_mcp_client__003_hosted_mcp_endpoint_url_and_token_environment__evidence_reference` | Reference-only evidence relation; bytes and object payloads stay outside relational state. | `003_hosted_mcp_endpoint_url_and_token_environment_id, reference_kind, reference_value` |

Atomic fact relations: `monarchic_mcp_client__003_hosted_mcp_endpoint_url_and_token_environment__fact_hosted`, `monarchic_mcp_client__003_hosted_mcp_endpoint_url_and_token_environment__fact_endpoint`, `monarchic_mcp_client__003_hosted_mcp_endpoint_url_and_token_environment__fact_url`, `monarchic_mcp_client__003_hosted_mcp_endpoint_url_and_token_environment__fact_token`, `monarchic_mcp_client__003_hosted_mcp_endpoint_url_and_token_environment__fact_environment`, `monarchic_mcp_client__003_hosted_mcp_endpoint_url_and_token_environment__fact_config`, `monarchic_mcp_client__003_hosted_mcp_endpoint_url_and_token_environment__fact_configuration`

Reconstruction view: `monarchic_mcp_client__003_hosted_mcp_endpoint_url_and_token_environment__reconstruction_v`

## 004_smoke_test_request_response_payloads

Surface: Smoke test request/response payloads

Candidate key: `004_smoke_test_request_response_payloads_id`

| Relation | Purpose | Primary key |
| --- | --- | --- |
| `monarchic_mcp_client__004_smoke_test_request_response_payloads__identity` | Artifact identity and catalog binding. | `004_smoke_test_request_response_payloads_id` |
| `monarchic_mcp_client__004_smoke_test_request_response_payloads__catalog_version` | Catalog-version provenance independent of artifact contents. | `004_smoke_test_request_response_payloads_id, catalog_sha256` |
| `monarchic_mcp_client__004_smoke_test_request_response_payloads__owner` | Owner assignment independent of persistence and artifact facts. | `004_smoke_test_request_response_payloads_id, owner_name` |
| `monarchic_mcp_client__004_smoke_test_request_response_payloads__persistence` | Persistence location/pattern independent of owner and facts. | `004_smoke_test_request_response_payloads_id, persistence_kind, location_pattern` |
| `monarchic_mcp_client__004_smoke_test_request_response_payloads__fact_smoke` | Atomic smoke fact for this artifact. | `004_smoke_test_request_response_payloads_id, smoke_value` |
| `monarchic_mcp_client__004_smoke_test_request_response_payloads__fact_test` | Atomic test fact for this artifact. | `004_smoke_test_request_response_payloads_id, test_value` |
| `monarchic_mcp_client__004_smoke_test_request_response_payloads__fact_payloads` | Atomic payloads fact for this artifact. | `004_smoke_test_request_response_payloads_id, payloads_value` |
| `monarchic_mcp_client__004_smoke_test_request_response_payloads__fact_process` | Atomic process fact for this artifact. | `004_smoke_test_request_response_payloads_id, process_value` |
| `monarchic_mcp_client__004_smoke_test_request_response_payloads__fact_verify` | Atomic verify fact for this artifact. | `004_smoke_test_request_response_payloads_id, verify_value` |
| `monarchic_mcp_client__004_smoke_test_request_response_payloads__fact_hosted` | Atomic hosted fact for this artifact. | `004_smoke_test_request_response_payloads_id, hosted_value` |
| `monarchic_mcp_client__004_smoke_test_request_response_payloads__fact_connectivity` | Atomic connectivity fact for this artifact. | `004_smoke_test_request_response_payloads_id, connectivity_value` |
| `monarchic_mcp_client__004_smoke_test_request_response_payloads__evidence_reference` | Reference-only evidence relation; bytes and object payloads stay outside relational state. | `004_smoke_test_request_response_payloads_id, reference_kind, reference_value` |

Atomic fact relations: `monarchic_mcp_client__004_smoke_test_request_response_payloads__fact_smoke`, `monarchic_mcp_client__004_smoke_test_request_response_payloads__fact_test`, `monarchic_mcp_client__004_smoke_test_request_response_payloads__fact_payloads`, `monarchic_mcp_client__004_smoke_test_request_response_payloads__fact_process`, `monarchic_mcp_client__004_smoke_test_request_response_payloads__fact_verify`, `monarchic_mcp_client__004_smoke_test_request_response_payloads__fact_hosted`, `monarchic_mcp_client__004_smoke_test_request_response_payloads__fact_connectivity`

Reconstruction view: `monarchic_mcp_client__004_smoke_test_request_response_payloads__reconstruction_v`

## 005_upstream_run_summaries_and_receipts

Surface: Upstream run summaries and receipts

Candidate key: `005_upstream_run_summaries_and_receipts_id`

| Relation | Purpose | Primary key |
| --- | --- | --- |
| `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__identity` | Artifact identity and catalog binding. | `005_upstream_run_summaries_and_receipts_id` |
| `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__catalog_version` | Catalog-version provenance independent of artifact contents. | `005_upstream_run_summaries_and_receipts_id, catalog_sha256` |
| `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__owner` | Owner assignment independent of persistence and artifact facts. | `005_upstream_run_summaries_and_receipts_id, owner_name` |
| `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__persistence` | Persistence location/pattern independent of owner and facts. | `005_upstream_run_summaries_and_receipts_id, persistence_kind, location_pattern` |
| `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__fact_upstream` | Atomic upstream fact for this artifact. | `005_upstream_run_summaries_and_receipts_id, upstream_value` |
| `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__fact_run` | Atomic run fact for this artifact. | `005_upstream_run_summaries_and_receipts_id, run_value` |
| `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__fact_summaries` | Atomic summaries fact for this artifact. | `005_upstream_run_summaries_and_receipts_id, summaries_value` |
| `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__fact_receipts` | Atomic receipts fact for this artifact. | `005_upstream_run_summaries_and_receipts_id, receipts_value` |
| `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__fact_remote` | Atomic remote fact for this artifact. | `005_upstream_run_summaries_and_receipts_id, remote_value` |
| `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__fact_durable` | Atomic durable fact for this artifact. | `005_upstream_run_summaries_and_receipts_id, durable_value` |
| `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__fact_belongs` | Atomic belongs fact for this artifact. | `005_upstream_run_summaries_and_receipts_id, belongs_value` |
| `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__fact_monarchic` | Atomic monarchic fact for this artifact. | `005_upstream_run_summaries_and_receipts_id, monarchic_value` |
| `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__fact_infrastructure` | Atomic infrastructure fact for this artifact. | `005_upstream_run_summaries_and_receipts_id, infrastructure_value` |
| `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__rel_receipt` | Independent receipt relationship predicate. | `005_upstream_run_summaries_and_receipts_id, receipt_target_id, relationship_role` |
| `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__evidence_reference` | Reference-only evidence relation; bytes and object payloads stay outside relational state. | `005_upstream_run_summaries_and_receipts_id, reference_kind, reference_value` |

Atomic fact relations: `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__fact_upstream`, `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__fact_run`, `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__fact_summaries`, `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__fact_receipts`, `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__fact_remote`, `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__fact_durable`, `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__fact_belongs`, `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__fact_monarchic`, `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__fact_infrastructure`

Reconstruction view: `monarchic_mcp_client__005_upstream_run_summaries_and_receipts__reconstruction_v`

## 007_database_queries

Surface: Database queries

Candidate key: `007_database_queries_id`

| Relation | Purpose | Primary key |
| --- | --- | --- |
| `monarchic_mcp_client__007_database_queries__identity` | Artifact identity and catalog binding. | `007_database_queries_id` |
| `monarchic_mcp_client__007_database_queries__catalog_version` | Catalog-version provenance independent of artifact contents. | `007_database_queries_id, catalog_sha256` |
| `monarchic_mcp_client__007_database_queries__owner` | Owner assignment independent of persistence and artifact facts. | `007_database_queries_id, owner_name` |
| `monarchic_mcp_client__007_database_queries__persistence` | Persistence location/pattern independent of owner and facts. | `007_database_queries_id, persistence_kind, location_pattern` |
| `monarchic_mcp_client__007_database_queries__fact_database` | Atomic database fact for this artifact. | `007_database_queries_id, database_value` |
| `monarchic_mcp_client__007_database_queries__fact_queries` | Atomic queries fact for this artifact. | `007_database_queries_id, queries_value` |
| `monarchic_mcp_client__007_database_queries__fact_locally` | Atomic locally fact for this artifact. | `007_database_queries_id, locally_value` |
| `monarchic_mcp_client__007_database_queries__fact_client` | Atomic client fact for this artifact. | `007_database_queries_id, client_value` |
| `monarchic_mcp_client__007_database_queries__fact_shim` | Atomic shim fact for this artifact. | `007_database_queries_id, shim_value` |
| `monarchic_mcp_client__007_database_queries__fact_does` | Atomic does fact for this artifact. | `007_database_queries_id, does_value` |
| `monarchic_mcp_client__007_database_queries__fact_query` | Atomic query fact for this artifact. | `007_database_queries_id, query_value` |
| `monarchic_mcp_client__007_database_queries__fact_databases` | Atomic databases fact for this artifact. | `007_database_queries_id, databases_value` |
| `monarchic_mcp_client__007_database_queries__fact_directly` | Atomic directly fact for this artifact. | `007_database_queries_id, directly_value` |
| `monarchic_mcp_client__007_database_queries__rel_query` | Independent query relationship predicate. | `007_database_queries_id, query_target_id, relationship_role` |
| `monarchic_mcp_client__007_database_queries__evidence_reference` | Reference-only evidence relation; bytes and object payloads stay outside relational state. | `007_database_queries_id, reference_kind, reference_value` |

Atomic fact relations: `monarchic_mcp_client__007_database_queries__fact_database`, `monarchic_mcp_client__007_database_queries__fact_queries`, `monarchic_mcp_client__007_database_queries__fact_locally`, `monarchic_mcp_client__007_database_queries__fact_client`, `monarchic_mcp_client__007_database_queries__fact_shim`, `monarchic_mcp_client__007_database_queries__fact_does`, `monarchic_mcp_client__007_database_queries__fact_query`, `monarchic_mcp_client__007_database_queries__fact_databases`, `monarchic_mcp_client__007_database_queries__fact_directly`

Reconstruction view: `monarchic_mcp_client__007_database_queries__reconstruction_v`

