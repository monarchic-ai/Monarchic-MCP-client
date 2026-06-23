// @ts-nocheck
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

export function defaultManifestPath() {
  return resolve(here, "../docs/storage-adapter-manifest.json");
}

export function loadStorageAdapterManifest(manifestPath = defaultManifestPath()) {
  return JSON.parse(readFileSync(manifestPath, "utf8"));
}

export function artifactById(manifest, artifactId) {
  const artifact = manifest.artifacts.find((candidate) => candidate.artifact_id === artifactId);
  if (!artifact) throw new Error("unknown storage artifact: " + artifactId);
  return artifact;
}

export function verifyStorageAdapterManifest(manifest = loadStorageAdapterManifest()) {
  for (const artifact of manifest.artifacts) {
    const actual = artifact.adapters.map((adapter) => adapter.kind).sort().join(",");
    const expected = artifact.classification === "structured state" ? "dynamodb,sqlite" : "minio,s3";
    if (actual !== expected) throw new Error("artifact " + artifact.artifact_id + " has adapters " + actual + "; expected " + expected);
  }
}

export class SqliteArtifactStateAdapter {
  constructor(manifest, artifact, executor) {
    this.manifest = manifest;
    this.artifact = artifact;
    this.executor = executor;
    this.spec = artifact.adapters.find((adapter) => adapter.kind === "sqlite");
    if (!this.spec) throw new Error("artifact " + artifact.artifact_id + " has no sqlite adapter");
  }
  initialize() {
    return this.executor.run("CREATE TABLE IF NOT EXISTS artifact_state_records (repo_id TEXT NOT NULL, artifact_id TEXT NOT NULL, payload_json TEXT NOT NULL, metadata_json TEXT NOT NULL, updated_at TEXT NOT NULL, PRIMARY KEY (repo_id, artifact_id))");
  }
  put(payload, metadata = {}) {
    this.initialize();
    return this.executor.run("INSERT INTO artifact_state_records (repo_id, artifact_id, payload_json, metadata_json, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(repo_id, artifact_id) DO UPDATE SET payload_json = excluded.payload_json, metadata_json = excluded.metadata_json, updated_at = excluded.updated_at", [this.manifest.repo_id, this.artifact.artifact_id, JSON.stringify(payload), JSON.stringify(metadata), new Date().toISOString()]);
  }
  get() {
    return this.executor.get?.("SELECT payload_json, metadata_json, updated_at FROM artifact_state_records WHERE repo_id = ? AND artifact_id = ?", [this.manifest.repo_id, this.artifact.artifact_id]);
  }
  list() {
    return this.executor.all?.("SELECT artifact_id, metadata_json, updated_at FROM artifact_state_records WHERE repo_id = ? ORDER BY artifact_id", [this.manifest.repo_id]) ?? [];
  }
  delete() {
    return this.executor.run("DELETE FROM artifact_state_records WHERE repo_id = ? AND artifact_id = ?", [this.manifest.repo_id, this.artifact.artifact_id]);
  }
}

export class DynamoDbArtifactStateAdapter {
  constructor(manifest, artifact, transport) {
    this.manifest = manifest;
    this.artifact = artifact;
    this.transport = transport;
    this.spec = artifact.adapters.find((adapter) => adapter.kind === "dynamodb");
    if (!this.spec) throw new Error("artifact " + artifact.artifact_id + " has no dynamodb adapter");
  }
  key() {
    return { pk: { S: "repo#" + this.manifest.repo_id }, sk: { S: "artifact#" + this.artifact.artifact_id } };
  }
  putRequest(payload, metadata = {}) {
    return { method: "POST", operation: "PutItem", headers: { "x-amz-target": "DynamoDB_20120810.PutItem", "content-type": "application/x-amz-json-1.0" }, body: { TableName: this.spec.table, Item: { ...this.key(), payload_json: { S: JSON.stringify(payload) }, metadata_json: { S: JSON.stringify(metadata) }, updated_at: { S: new Date().toISOString() } } } };
  }
  getRequest() {
    return { method: "POST", operation: "GetItem", headers: { "x-amz-target": "DynamoDB_20120810.GetItem", "content-type": "application/x-amz-json-1.0" }, body: { TableName: this.spec.table, Key: this.key() } };
  }
  deleteRequest() {
    return { method: "POST", operation: "DeleteItem", headers: { "x-amz-target": "DynamoDB_20120810.DeleteItem", "content-type": "application/x-amz-json-1.0" }, body: { TableName: this.spec.table, Key: this.key() } };
  }
  put(payload, metadata = {}) { const request = this.putRequest(payload, metadata); return this.transport ? this.transport(request) : request; }
  get() { const request = this.getRequest(); return this.transport ? this.transport(request) : request; }
  delete() { const request = this.deleteRequest(); return this.transport ? this.transport(request) : request; }
}

export class ObjectStorageArtifactAdapter {
  constructor(kind, manifest, artifact, transport) {
    if (kind !== "minio" && kind !== "s3") throw new Error("kind must be minio or s3");
    this.kind = kind;
    this.manifest = manifest;
    this.artifact = artifact;
    this.transport = transport;
    this.spec = artifact.adapters.find((adapter) => adapter.kind === kind);
    if (!this.spec) throw new Error("artifact " + artifact.artifact_id + " has no " + kind + " adapter");
  }
  objectKey(name, body) {
    const digest = body === undefined ? name : createHash("sha256").update(body).digest("hex");
    return this.manifest.repo_id + "/" + this.artifact.artifact_id + "/" + digest;
  }
  putRequest(name, body, metadata = {}) {
    return { method: "PUT", operation: this.kind === "s3" ? "PutObject" : "put_object", url: "/" + String(this.spec.bucket) + "/" + this.objectKey(name, body), headers: { "x-amz-meta-repo-id": this.manifest.repo_id, "x-amz-meta-artifact-id": this.artifact.artifact_id, ...metadata }, body };
  }
  getRequest(name) { return { method: "GET", operation: this.kind === "s3" ? "GetObject" : "get_object", url: "/" + String(this.spec.bucket) + "/" + this.objectKey(name), headers: {} }; }
  deleteRequest(name) { return { method: "DELETE", operation: this.kind === "s3" ? "DeleteObject" : "delete_object", url: "/" + String(this.spec.bucket) + "/" + this.objectKey(name), headers: {} }; }
  put(name, body, metadata = {}) { const request = this.putRequest(name, body, metadata); return this.transport ? this.transport(request) : request; }
  get(name) { const request = this.getRequest(name); return this.transport ? this.transport(request) : request; }
  delete(name) { const request = this.deleteRequest(name); return this.transport ? this.transport(request) : request; }
}

export function createStorageAdapters(artifactId, options = {}) {
  const manifest = options.manifest ?? loadStorageAdapterManifest();
  const artifact = artifactById(manifest, artifactId);
  if (artifact.classification === "structured state") {
    return { sqlite: options.sqlite ? new SqliteArtifactStateAdapter(manifest, artifact, options.sqlite) : undefined, dynamodb: new DynamoDbArtifactStateAdapter(manifest, artifact, options.dynamodb) };
  }
  return { minio: new ObjectStorageArtifactAdapter("minio", manifest, artifact, options.minio), s3: new ObjectStorageArtifactAdapter("s3", manifest, artifact, options.s3) };
}
