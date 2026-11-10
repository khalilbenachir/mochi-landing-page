import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const srcDir = path.join(root, "src");
const rel = (file: string) => path.relative(root, file).split(path.sep).join("/");

/** Modules that must stay on the server: they inline whole message or article files into the bundle. */
const SERVER_ONLY = [/^messages\/.+\.json$/, /^src\/features\/blog\/content\/articles\/.+\.json$/, /^src\/features\/blog\/content\/copy\.ts$/];

const sourceFiles = (readdirSync(srcDir, { recursive: true }) as string[])
  .filter((file) => /\.(ts|tsx)$/.test(file) && !/\.test\.tsx?$/.test(file))
  .map((file) => path.join(srcDir, file));

function resolveImport(from: string, specifier: string): string | undefined {
  const base = specifier.startsWith("@/")
    ? path.join(srcDir, specifier.slice(2))
    : specifier.startsWith(".")
      ? path.resolve(path.dirname(from), specifier)
      : undefined;
  if (!base) return undefined;
  return [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")].find(
    (candidate) => existsSync(candidate) && statSync(candidate).isFile(),
  );
}

function localImports(file: string): string[] {
  const source = readFileSync(file, "utf8");
  // Type-only imports are erased at compile time and never reach the bundle.
  const specifiers = [...source.matchAll(/^import\s+(?!type\s)[^;]*?from\s+"([^"]+)"/gm)].map((match) => match[1] ?? "");
  return specifiers.map((specifier) => resolveImport(file, specifier)).filter((resolved): resolved is string => Boolean(resolved && /\.(ts|tsx|json)$/.test(resolved)));
}

/** Returns the import chain from `entry` to a server-only module, if any. */
function serverOnlyChain(entry: string, seen = new Set<string>()): string[] | undefined {
  if (SERVER_ONLY.some((pattern) => pattern.test(rel(entry)))) return [rel(entry)];
  if (seen.has(entry) || entry.endsWith(".json")) return undefined;
  seen.add(entry);
  for (const dependency of localImports(entry)) {
    const chain = serverOnlyChain(dependency, seen);
    if (chain) return [rel(entry), ...chain];
  }
  return undefined;
}

describe("client boundary", () => {
  it("keeps whole message files and article copy out of client components", () => {
    const clientEntries = sourceFiles.filter((file) => /^\s*["']use client["']/.test(readFileSync(file, "utf8")));
    expect(clientEntries.length).toBeGreaterThan(0);
    const leaks = clientEntries.map((file) => serverOnlyChain(file)).filter(Boolean).map((chain) => chain!.join(" -> "));
    expect(leaks).toEqual([]);
  });
});
