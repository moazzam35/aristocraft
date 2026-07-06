/**
 * Bug Condition Exploration Tests
 *
 * Task 1 — Property 1: Bug Condition - All Eight Config Defects Present
 *
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8
 *
 * These tests assert the CORRECT / EXPECTED behavior.
 * They are expected to FAIL on unfixed code — that failure IS the success case:
 * it confirms the bugs exist and surfaces concrete counterexamples.
 *
 * DO NOT fix any code in this file or in the project during this task.
 */

import { execSync, spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");

let passed = 0;
let failed = 0;
const counterexamples = [];

function assert(label, condition, actual, expected) {
  if (condition) {
    console.log(`  ✅ PASS  ${label}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL  ${label}`);
    console.log(`           Expected : ${expected}`);
    console.log(`           Actual   : ${actual}`);
    counterexamples.push({ label, expected, actual });
    failed++;
  }
}

function run(cmd, opts = {}) {
  const result = spawnSync(cmd, {
    shell: true,
    cwd: ROOT,
    encoding: "utf8",
    timeout: 60_000,
    ...opts,
  });
  return {
    stdout: (result.stdout || "").trim(),
    stderr: (result.stderr || "").trim(),
    status: result.status ?? -1,
    combined: ((result.stdout || "") + (result.stderr || "")).trim(),
  };
}

// ─────────────────────────────────────────────
// Test 1 — .env.local double-assignment
// Expected failure: DATABASE_URL starts with "DATABASE_URL=" instead of "postgresql://"
// ─────────────────────────────────────────────
console.log("\n━━━ Test 1: .env.local DATABASE_URL value ━━━");
{
  const envLocalPath = join(ROOT, ".env.local");
  const envLocalContent = existsSync(envLocalPath)
    ? readFileSync(envLocalPath, "utf8")
    : "";

  // Extract the raw value from the file (right-hand side of DATABASE_URL=)
  const match = envLocalContent.match(/^DATABASE_URL=(.+)$/m);
  const rawValue = match ? match[1].trim() : "";

  // The CORRECT behavior: value starts with "postgresql://" (not "DATABASE_URL=")
  assert(
    "DATABASE_URL value starts with 'postgresql://'",
    rawValue.startsWith("postgresql://"),
    rawValue.substring(0, 60) + (rawValue.length > 60 ? "…" : ""),
    "starts with 'postgresql://'"
  );

  // Additional check: value must NOT start with "DATABASE_URL=" (the bug pattern)
  assert(
    "DATABASE_URL value does NOT contain double-assignment prefix",
    !rawValue.startsWith("DATABASE_URL="),
    rawValue.substring(0, 60) + (rawValue.length > 60 ? "…" : ""),
    "no 'DATABASE_URL=' prefix in value"
  );
}

// ─────────────────────────────────────────────
// Test 2 — prisma/schema.prisma missing url field
// Expected failure: "prisma validate" fails with "Datasource needs a url field"
// ─────────────────────────────────────────────
console.log("\n━━━ Test 2: prisma/schema.prisma has url field ━━━");
{
  const schemaPath = join(ROOT, "prisma", "schema.prisma");
  const schemaContent = existsSync(schemaPath)
    ? readFileSync(schemaPath, "utf8")
    : "";

  // Check url field exists in datasource block (static file check — fast, no CLI needed)
  const datasourceBlock = schemaContent.match(/datasource\s+\w+\s*\{[^}]+\}/s)?.[0] ?? "";
  const hasUrl = /url\s*=/.test(datasourceBlock);

  assert(
    "schema.prisma datasource block contains 'url' field",
    hasUrl,
    hasUrl ? "url field present" : "url field MISSING from datasource block",
    "url = env(\"DATABASE_URL\") present in datasource db { ... }"
  );

  // Also run `prisma validate` to capture the CLI error
  console.log("  → Running: npx prisma validate …");
  const result = run("npx prisma validate");
  const exitOk = result.status === 0;
  assert(
    "npx prisma validate exits with code 0",
    exitOk,
    `exit code ${result.status} — ${result.combined.substring(0, 200)}`,
    "exit code 0"
  );
}

// ─────────────────────────────────────────────
// Test 3 — prisma.config.ts invalid 'env' export
// Expected failure: "does not provide an export named 'env'"
// ─────────────────────────────────────────────
console.log("\n━━━ Test 3: prisma.config.ts valid API usage ━━━");
{
  const configPath = join(ROOT, "prisma.config.ts");
  const configContent = existsSync(configPath)
    ? readFileSync(configPath, "utf8")
    : "";

  // Check static: file must NOT import 'env' from 'prisma/config'
  const importsEnv = /import\s*\{[^}]*\benv\b[^}]*\}\s*from\s*['"]prisma\/config['"]/.test(configContent);
  assert(
    "prisma.config.ts does NOT import 'env' from 'prisma/config'",
    !importsEnv,
    importsEnv
      ? "File imports 'env' from 'prisma/config' — this export does not exist"
      : "No invalid 'env' import",
    "Only 'defineConfig' imported from 'prisma/config'"
  );

  // Check static: file must NOT have a 'datasource' key in defineConfig
  const hasDatasourceKey = /defineConfig\s*\(\s*\{[^}]*datasource\s*:/.test(configContent);
  assert(
    "prisma.config.ts does NOT use 'datasource' key in defineConfig",
    !hasDatasourceKey,
    hasDatasourceKey
      ? "File uses 'datasource' key in defineConfig — not a valid Prisma v7 config option"
      : "No invalid 'datasource' key",
    "No 'datasource' key inside defineConfig({ ... })"
  );

  // Run prisma generate to capture runtime error
  console.log("  → Running: npx prisma generate …");
  const result = run("npx prisma generate");
  const noEnvExportError = !result.combined.includes("does not provide an export named 'env'");
  assert(
    "npx prisma generate does NOT throw module-resolution error for 'env'",
    noEnvExportError,
    noEnvExportError
      ? "No 'env' export error"
      : `Error found: ${result.combined.substring(0, 300)}`,
    "No 'does not provide an export named \\\"env\\\"' error"
  );
}

// ─────────────────────────────────────────────
// Test 4 — lib/db.ts wrong adapter init (neon() instead of Pool)
// Expected failure: adapter type-mismatch error at runtime
// ─────────────────────────────────────────────
console.log("\n━━━ Test 4: lib/db.ts correct adapter initialization ━━━");
{
  const dbPath = join(ROOT, "lib", "db.ts");
  const dbContent = existsSync(dbPath) ? readFileSync(dbPath, "utf8") : "";

  // Must import Pool from @neondatabase/serverless, not neon()
  const importsPool = /import\s*\{[^}]*\bPool\b[^}]*\}\s*from\s*['"]@neondatabase\/serverless['"]/.test(dbContent);
  assert(
    "lib/db.ts imports 'Pool' from '@neondatabase/serverless'",
    importsPool,
    importsPool ? "Pool imported" : "Pool NOT imported — imports neon() instead",
    "'Pool' imported from '@neondatabase/serverless'"
  );

  // Must NOT import neon() (the HTTP-fetch pattern)
  const importsNeonFn = /import\s*\{[^}]*\bneon\b[^}]*\}\s*from\s*['"]@neondatabase\/serverless['"]/.test(dbContent);
  assert(
    "lib/db.ts does NOT import 'neon' function from '@neondatabase/serverless'",
    !importsNeonFn,
    importsNeonFn
      ? "File imports 'neon' HTTP-fetch function — PrismaNeon requires a Pool, not neon()"
      : "No invalid 'neon' function import",
    "No 'neon' HTTP-fetch function imported"
  );

  // Must import neonConfig to set webSocketConstructor
  const importsNeonConfig = /import\s*\{[^}]*\bneonConfig\b[^}]*\}\s*from\s*['"]@neondatabase\/serverless['"]/.test(dbContent);
  assert(
    "lib/db.ts imports 'neonConfig' to configure WebSocket transport",
    importsNeonConfig,
    importsNeonConfig ? "neonConfig imported" : "neonConfig NOT imported",
    "'neonConfig' imported from '@neondatabase/serverless'"
  );

  // Must import ws for WebSocket support in Node.js
  const importsWs = /import\s+ws\s+from\s+['"]ws['"]/.test(dbContent);
  assert(
    "lib/db.ts imports 'ws' for Node.js WebSocket support",
    importsWs,
    importsWs ? "ws imported" : "ws NOT imported",
    "import ws from 'ws'"
  );

  // Must set neonConfig.webSocketConstructor = ws
  const setsWebSocket = /neonConfig\.webSocketConstructor\s*=\s*ws/.test(dbContent);
  assert(
    "lib/db.ts sets neonConfig.webSocketConstructor = ws",
    setsWebSocket,
    setsWebSocket ? "webSocketConstructor set" : "webSocketConstructor NOT set",
    "neonConfig.webSocketConstructor = ws"
  );

  // Must use new Pool(...) and pass pool to PrismaNeon
  const usesPool = /new\s+Pool\s*\(/.test(dbContent);
  assert(
    "lib/db.ts constructs 'new Pool(...)' for the adapter",
    usesPool,
    usesPool ? "Pool constructed" : "Pool NOT constructed — uses neon() instead",
    "const pool = new Pool({ connectionString: process.env.DATABASE_URL! })"
  );
}

// ─────────────────────────────────────────────
// Test 5 — API routes: default exports instead of named handlers
// Expected failure: HTTP 404 for GET /api/auth, /api/users, /api/orders
// ─────────────────────────────────────────────
console.log("\n━━━ Test 5: API route files export named HTTP handlers ━━━");
{
  const routeFiles = [
    { path: join(ROOT, "app", "api", "auth", "route.js"), name: "auth" },
    { path: join(ROOT, "app", "api", "users", "route.js"), name: "users" },
    { path: join(ROOT, "app", "api", "orders", "route.js"), name: "orders" },
  ];

  for (const { path: routePath, name } of routeFiles) {
    const content = existsSync(routePath) ? readFileSync(routePath, "utf8") : "";

    // Must NOT have default export
    const hasDefaultExport = /export\s+default\s+function/.test(content);
    assert(
      `app/api/${name}/route.js does NOT use 'export default function'`,
      !hasDefaultExport,
      hasDefaultExport
        ? `File uses 'export default function' — Next.js App Router ignores default exports in route files`
        : "No default export",
      "No 'export default function' in route file"
    );

    // Must have named GET export
    const hasNamedGet = /export\s+(async\s+)?function\s+GET/.test(content);
    assert(
      `app/api/${name}/route.js exports named 'GET' handler`,
      hasNamedGet,
      hasNamedGet ? "Named GET handler present" : "Named GET handler MISSING — route returns 404",
      "export async function GET(_request) { ... }"
    );
  }
}

// ─────────────────────────────────────────────
// Test 6 — next.config.ts invalid turbopack.root key
// Expected failure: "Unrecognized key(s): 'root'" warning on next dev/build
// ─────────────────────────────────────────────
console.log("\n━━━ Test 6: next.config.ts does not use invalid turbopack.root key ━━━");
{
  const nextConfigPath = join(ROOT, "next.config.ts");
  const nextConfigContent = existsSync(nextConfigPath)
    ? readFileSync(nextConfigPath, "utf8")
    : "";

  // Must NOT have turbopack.root
  const hasTurbopackRoot = /turbopack\s*:\s*\{[^}]*root\s*:/.test(nextConfigContent);
  assert(
    "next.config.ts does NOT contain invalid 'turbopack.root' key",
    !hasTurbopackRoot,
    hasTurbopackRoot
      ? "File contains 'turbopack: { root: ... }' — 'root' is not a valid TurbopackConfig key in Next.js 16"
      : "No invalid turbopack.root",
    "No 'turbopack' block or no 'root' key inside it"
  );
}

// ─────────────────────────────────────────────
// Test 7 — tsconfig.json stray file paths in include array
// Expected failure: spurious TS errors from stray paths
// ─────────────────────────────────────────────
console.log("\n━━━ Test 7: tsconfig.json include array has no stray file paths ━━━");
{
  const tsconfigPath = join(ROOT, "tsconfig.json");
  const tsconfigContent = existsSync(tsconfigPath)
    ? readFileSync(tsconfigPath, "utf8")
    : "";

  let tsconfig;
  try {
    // Remove trailing commas for lenient parsing (the stray paths produce bad JSON)
    const lenient = tsconfigContent.replace(/,\s*([}\]])/g, "$1");
    tsconfig = JSON.parse(lenient);
  } catch {
    tsconfig = null;
  }

  const includeArray = tsconfig?.include ?? [];

  // Stray paths that should NOT be present
  const strayPaths = [
    "app/(shop)/page.tsx",
    "app/(shop)/layout.jsx",
    "lib/auth.js",
  ];

  for (const stray of strayPaths) {
    const present = includeArray.includes(stray);
    assert(
      `tsconfig.json include does NOT contain stray path '${stray}'`,
      !present,
      present
        ? `'${stray}' is present in include array — this is a stray IDE-injected path that corrupts TS compilation`
        : "Not present",
      `'${stray}' absent from include array`
    );
  }

  // Also check raw content for the stray inline pattern (even if JSON parse failed)
  const rawHasStray = strayPaths.some((p) => tsconfigContent.includes(p));
  assert(
    "tsconfig.json raw content does NOT contain stray individual file paths",
    !rawHasStray,
    rawHasStray
      ? `Raw file contains stray paths: ${strayPaths.filter((p) => tsconfigContent.includes(p)).join(", ")}`
      : "No stray paths in raw content",
    "No stray individual file paths in include"
  );

  // Run tsc to capture any real TS errors from the stray paths
  console.log("  → Running: npx tsc --noEmit …");
  const result = run("npx tsc --noEmit", { timeout: 120_000 });
  assert(
    "npx tsc --noEmit exits with code 0",
    result.status === 0,
    `exit code ${result.status}${result.combined ? " — " + result.combined.substring(0, 300) : ""}`,
    "exit code 0"
  );
}

// ─────────────────────────────────────────────
// Test 8 — middleware file: proxy.ts should be middleware.ts
// Expected failure: middleware never invoked (wrong filename)
// ─────────────────────────────────────────────
console.log("\n━━━ Test 8: middleware.ts exists and exports 'middleware' function ━━━");
{
  const middlewarePath = join(ROOT, "middleware.ts");
  const proxyPath = join(ROOT, "proxy.ts");

  const middlewareExists = existsSync(middlewarePath);
  const proxyExists = existsSync(proxyPath);

  // middleware.ts must exist
  assert(
    "middleware.ts exists at project root",
    middlewareExists,
    middlewareExists ? "middleware.ts exists" : "middleware.ts is MISSING — Next.js will not load any middleware",
    "middleware.ts present at project root"
  );

  // proxy.ts must NOT exist (it's the wrong filename)
  assert(
    "proxy.ts does NOT exist at project root (wrong filename for middleware)",
    !proxyExists,
    proxyExists
      ? "proxy.ts still exists — Next.js ignores this file as middleware; rename it to middleware.ts"
      : "proxy.ts absent",
    "proxy.ts absent from project root"
  );

  // If middleware.ts exists, it must export 'middleware' (not 'proxy')
  if (middlewareExists) {
    const middlewareContent = readFileSync(middlewarePath, "utf8");
    const exportsMiddlewareFn = /export\s+(function|const)\s+middleware/.test(middlewareContent);
    assert(
      "middleware.ts exports a function named 'middleware'",
      exportsMiddlewareFn,
      exportsMiddlewareFn
        ? "Named 'middleware' export present"
        : "Named 'middleware' export MISSING — Next.js requires the export to be named 'middleware'",
      "export function middleware(_request: NextRequest) { ... }"
    );
  }

  // If proxy.ts exists, confirm it has the wrong export name (documents the bug)
  if (proxyExists) {
    const proxyContent = readFileSync(proxyPath, "utf8");
    const exportsProxy = /export\s+function\s+proxy/.test(proxyContent);
    assert(
      "proxy.ts confirms wrong export name 'proxy' (documents bug)",
      false, // always fails — we're documenting the bug exists
      exportsProxy
        ? "proxy.ts exports 'proxy' instead of 'middleware' — Next.js ignores non-middleware exports in non-middleware files"
        : "proxy.ts does not export 'proxy'",
      "File should be named middleware.ts and export 'middleware'"
    );
  }
}

// ─────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────
console.log("\n════════════════════════════════════════════");
console.log(`  Bug Exploration Results`);
console.log(`  Passed: ${passed}   Failed: ${failed}`);
console.log("════════════════════════════════════════════");

if (counterexamples.length > 0) {
  console.log("\n📋 Counterexamples (confirms bugs exist):\n");
  counterexamples.forEach((ex, i) => {
    console.log(`  ${i + 1}. [${ex.label}]`);
    console.log(`     Expected : ${ex.expected}`);
    console.log(`     Actual   : ${ex.actual}`);
    console.log();
  });
  console.log(
    "  ✔ TASK 1 SUCCESS: Counterexamples confirm all bugs are present.\n" +
    "    These failures are expected on unfixed code.\n" +
    "    Re-run this script after applying all fixes (Task 3) to verify they all pass.\n"
  );
} else {
  console.log(
    "\n  ⚠ All checks passed — either the code is already fixed or the tests\n" +
    "    did not correctly target the bugs. Review carefully before proceeding.\n"
  );
}
