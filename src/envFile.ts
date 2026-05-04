import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export interface LoadMonarchicEnvFilesOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  files?: readonly string[];
}

function parseEnvLine(line: string): [string, string] | null {
  const trimmed = line.trim();
  if (trimmed.length === 0 || trimmed.startsWith("#")) {
    return null;
  }

  const normalized = trimmed.startsWith("export ") ? trimmed.slice(7).trimStart() : trimmed;
  const separatorIndex = normalized.indexOf("=");
  if (separatorIndex <= 0) {
    return null;
  }

  const key = normalized.slice(0, separatorIndex).trim();
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
    return null;
  }

  let value = normalized.slice(separatorIndex + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return [key, value];
}

export function loadMonarchicEnvFiles(
  options: LoadMonarchicEnvFilesOptions = {},
): void {
  const cwd = options.cwd ?? process.cwd();
  const env = options.env ?? process.env;
  const files = options.files ?? [".env", ".env.local"];
  const protectedKeys = new Set(Object.keys(env));

  for (const file of files) {
    const path = resolve(cwd, file);
    if (!existsSync(path)) {
      continue;
    }

    for (const line of readFileSync(path, "utf8").split(/\r?\n/u)) {
      const parsed = parseEnvLine(line);
      if (parsed === null) {
        continue;
      }
      const [key, value] = parsed;
      if (!protectedKeys.has(key)) {
        env[key] = value;
      }
    }
  }
}
