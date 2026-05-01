import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import os from "os";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "insights");
const IMAGES_DIR = path.join(process.cwd(), "public", "images", "insights");
const FEATURED_FILE = path.join(process.cwd(), "src", "content", "featured-insights.json");

function checkDev() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Admin API is disabled in production" },
      { status: 403 }
    );
  }
  return null;
}

export async function GET() {
  const err = checkDev();
  if (err) return err;

  try {
    const timestamp = new Date().toISOString().slice(0, 10);
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "mentivis-backup-"));
    const backupName = `mentivis-insights-backup-${timestamp}`;
    const backupDir = path.join(tmpDir, backupName);
    fs.mkdirSync(backupDir, { recursive: true });

    // 1. Copy all JSON + TXT + tech.json articles
    const articlesDir = path.join(backupDir, "articles");
    fs.mkdirSync(articlesDir, { recursive: true });
    if (fs.existsSync(CONTENT_DIR)) {
      const files = fs.readdirSync(CONTENT_DIR);
      for (const f of files) {
        if (f.endsWith(".json") || f.endsWith(".txt")) {
          fs.copyFileSync(path.join(CONTENT_DIR, f), path.join(articlesDir, f));
        }
      }
    }

    // 2. Copy featured config
    if (fs.existsSync(FEATURED_FILE)) {
      fs.copyFileSync(FEATURED_FILE, path.join(backupDir, "featured-insights.json"));
    }

    // 3. Copy images
    const imagesBackupDir = path.join(backupDir, "images");
    fs.mkdirSync(imagesBackupDir, { recursive: true });
    if (fs.existsSync(IMAGES_DIR)) {
      const imgFiles = fs.readdirSync(IMAGES_DIR);
      for (const f of imgFiles) {
        fs.copyFileSync(path.join(IMAGES_DIR, f), path.join(imagesBackupDir, f));
      }
    }

    // 4. Create manifest
    const manifest = {
      backupDate: new Date().toISOString(),
      articleCount: fs.readdirSync(articlesDir).filter((f) => f.endsWith(".json") && !f.endsWith(".tech.json")).length,
      source: "Mentivis Insights",
    };
    fs.writeFileSync(path.join(backupDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf-8");

    // 5. Create ZIP
    const zipPath = path.join(tmpDir, `${backupName}.zip`);
    execSync(`cd "${tmpDir}" && zip -r "${zipPath}" "${backupName}"`, { stdio: "ignore" });

    // 6. Stream ZIP response
    const zipBuffer = fs.readFileSync(zipPath);

    // Cleanup
    fs.rmSync(tmpDir, { recursive: true, force: true });

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${backupName}.zip"`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
