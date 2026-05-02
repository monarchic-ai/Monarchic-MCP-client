export interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: unknown;
}

export interface JsonRpcErrorObject {
  code: number;
  message: string;
  data?: unknown;
}

export interface JsonRpcErrorResponse {
  jsonrpc: "2.0";
  id: string | number | null;
  error: JsonRpcErrorObject;
}

export type JsonRpcResponse = JsonRpcErrorResponse | Record<string, unknown>;

export function isJsonRpcRequest(value: unknown): value is JsonRpcRequest {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  const id = record.id;
  return (
    record.jsonrpc === "2.0" &&
    typeof record.method === "string" &&
    record.method.length > 0 &&
    (id === undefined ||
      id === null ||
      typeof id === "string" ||
      typeof id === "number")
  );
}

export function buildJsonRpcErrorResponse(
  id: string | number | null,
  code: number,
  message: string,
  data?: unknown,
): JsonRpcErrorResponse {
  return {
    jsonrpc: "2.0",
    id,
    error: data === undefined ? { code, message } : { code, message, data },
  };
}
