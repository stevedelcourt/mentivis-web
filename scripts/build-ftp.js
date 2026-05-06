const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const rootDir = path.join(__dirname, "..");
const apiDir = path.join(rootDir, "src", "app", "api");
const apiBackupDir = path.join(rootDir, ".api-temp");
const nextDir = path.join(rootDir, ".next");
const outDir = path.join(rootDir, "out");

// Clean Next.js cache AND out/ to avoid stale chunk references.
// Next.js static export appends to out/ rather than replacing it,
// so old chunks can persist and cause inconsistent HTML references.
if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log("Cleaned .next cache");
}
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
  console.log("Cleaned out/ directory");
}

// Copy API routes to temp backup, then remove from src/app
// (Next.js scans all folders inside src/app/; we must completely remove api/)
if (fs.existsSync(apiDir)) {
  if (fs.existsSync(apiBackupDir)) {
    fs.rmSync(apiBackupDir, { recursive: true, force: true });
  }
  fs.cpSync(apiDir, apiBackupDir, { recursive: true });
  fs.rmSync(apiDir, { recursive: true, force: true });
  console.log("Backed up src/app/api → .api-temp");
}

try {
  execSync("node scripts/txt2json.js", {
    stdio: "inherit",
    cwd: rootDir,
  });
  execSync("node scripts/generate-insights-meta.js", {
    stdio: "inherit",
    cwd: rootDir,
  });
  execSync("node scripts/gen-llms-txt.js", {
    stdio: "inherit",
    cwd: rootDir,
  });
  execSync("npx next build --webpack", {
    stdio: "inherit",
    cwd: rootDir,
    env: {
      ...process.env,
      NEXT_BUILD_TARGET: "ftp",
      NEXT_PUBLIC_GTM_ID: "GTM-PM93CCQL",
    },
  });
  execSync("node scripts/inject-preconnect.js", {
    stdio: "inherit",
    cwd: rootDir,
  });
} finally {
  // Always restore API routes
  if (fs.existsSync(apiBackupDir)) {
    fs.cpSync(apiBackupDir, apiDir, { recursive: true });
    fs.rmSync(apiBackupDir, { recursive: true, force: true });
    console.log("Restored .api-temp → src/app/api");
  }
}

// ── Post-build: trailingSlash: true handles folder/index.html natively ──
// No manual conversion needed since Next.js static export with trailingSlash
// generates fr/index.html, fr/insights/index.html, etc. automatically.

// ── Sanitize bracket characters in chunk paths ──
// Next.js generates [lang] / [slug] directories; some Apache/nginx configs
// block URLs containing brackets. Rename dirs and update references.
console.log("Sanitizing bracket characters in chunk paths...");
try {
  execSync("python3 scripts/sanitize-chunks.py", {
    stdio: "inherit",
    cwd: rootDir,
  });
} catch (e) {
  console.error("sanitize-chunks.py failed:", e.message);
  process.exit(1);
}

console.log("Build complete — trailingSlash: true enabled");

// ── Post-build: copy fr/index.html to root to eliminate redirect ──
// Apache .htaccess redirects / → /fr/ (301, +34ms).
// Serving fr/index.html directly at / saves the redirect round-trip.
const frIndex = path.join(outDir, "fr", "index.html");
const rootIndex = path.join(outDir, "index.html");
if (fs.existsSync(frIndex)) {
  fs.copyFileSync(frIndex, rootIndex);
  console.log("Copied fr/index.html → out/index.html (eliminates root redirect)");
}
