const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const rootDir = path.join(__dirname, "..");
const apiDir = path.join(rootDir, "src", "app", "api");
const apiBackupDir = path.join(rootDir, ".api-temp");
const nextDir = path.join(rootDir, ".next");

// Clean Next.js cache to avoid stale route references
if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log("Cleaned .next cache");
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
  execSync("NEXT_BUILD_TARGET=ftp next build", {
    stdio: "inherit",
    cwd: rootDir,
    env: { ...process.env, NEXT_BUILD_TARGET: "ftp" },
  });
} finally {
  // Always restore API routes
  if (fs.existsSync(apiBackupDir)) {
    fs.cpSync(apiBackupDir, apiDir, { recursive: true });
    fs.rmSync(apiBackupDir, { recursive: true, force: true });
    console.log("Restored .api-temp → src/app/api");
  }
}
