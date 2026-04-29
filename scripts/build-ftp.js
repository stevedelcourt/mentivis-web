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

// ── Post-build: convert nested .html files to folder/index.html ──
// This lets Apache serve them cleanly without extension rewriting.
const outDir = path.join(rootDir, "out");
const locales = ["fr", "en"];
const nestedDirs = ["insights"];

for (const loc of locales) {
  for (const dir of nestedDirs) {
    const fullDir = path.join(outDir, loc, dir);
    if (!fs.existsSync(fullDir)) continue;

    // Copy the parent page (e.g. fr/insights.html) into fr/insights/index.html
    // so that Apache can serve it when the directory is requested.
    const parentHtml = path.join(outDir, loc, `${dir}.html`);
    const dirIndex = path.join(fullDir, "index.html");
    if (fs.existsSync(parentHtml) && !fs.existsSync(dirIndex)) {
      fs.copyFileSync(parentHtml, dirIndex);
      console.log(`Copied ${loc}/${dir}.html → ${loc}/${dir}/index.html`);
    }

    // Convert nested slug.html files to slug/index.html
    // Skip index.html (the list page already copied above)
    const files = fs.readdirSync(fullDir);
    for (const f of files) {
      if (!f.endsWith(".html") || f === "index.html") continue;
      const slug = f.slice(0, -5);
      const slugDir = path.join(fullDir, slug);
      const oldPath = path.join(fullDir, f);
      const newPath = path.join(slugDir, "index.html");
      if (!fs.existsSync(slugDir)) {
        fs.mkdirSync(slugDir, { recursive: true });
      }
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed ${loc}/${dir}/${f} → ${loc}/${dir}/${slug}/index.html`);
    }
  }
}
