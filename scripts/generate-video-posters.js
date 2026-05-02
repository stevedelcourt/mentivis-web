#!/usr/bin/env node
/**
 * generate-video-posters.js — Extract a thumbnail at 10s (or mid-duration) from each MP4
 *
 * Usage:
 *   node scripts/generate-video-posters.js
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const MEDIA_DIR = path.join(ROOT, "public", "videos", "media");

function getVideoDuration(filePath) {
  try {
    const stdout = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`,
      { encoding: "utf-8" }
    );
    return parseFloat(stdout.trim());
  } catch {
    return 0;
  }
}

function generatePoster(mp4Path) {
  const basename = path.basename(mp4Path, ".mp4");
  const posterPath = path.join(MEDIA_DIR, `${basename}.jpg`);

  // Skip if poster already exists
  if (fs.existsSync(posterPath)) {
    console.log(`  ✓ ${basename}.avif already exists, skipping`);
    return posterPath;
  }

  const duration = getVideoDuration(mp4Path);
  const seekTime = duration > 10 ? 10 : Math.floor(duration / 2);

  console.log(`  → ${basename}.mp4 (${duration.toFixed(1)}s) — extracting at ${seekTime}s`);

  try {
    execSync(
      `ffmpeg -y -ss ${seekTime} -i "${mp4Path}" -vf "scale=960:-1" -frames:v 1 -update 1 "${posterPath}"`,
      { stdio: "ignore" }
    );
    console.log(`  ✓ ${basename}.jpg created`);
    return posterPath;
  } catch {
    console.error(`  ✗ Failed to generate poster for ${basename}.mp4`);
    return null;
  }
}

function updateTxtFiles() {
  const videosDir = path.join(ROOT, "src", "content", "videos");
  const pairs = [
    { txt: "videos-fr.txt", json: "videos-fr.json" },
    { txt: "videos-en.txt", json: "videos-en.json" },
  ];

  for (const { txt, json } of pairs) {
    const txtPath = path.join(videosDir, txt);
    const jsonPath = path.join(videosDir, json);

    if (!fs.existsSync(txtPath)) continue;

    let text = fs.readFileSync(txtPath, "utf-8");
    const lines = text.split(/\r?\n/);
    const newLines = [];
    let inVideo = false;
    let hasPoster = false;

    for (const raw of lines) {
      const line = raw.trim();

      if (line.startsWith("#")) {
        inVideo = true;
        hasPoster = false;
        newLines.push(raw);
        continue;
      }

      if (line.startsWith("poster:")) {
        hasPoster = true;
        // Keep existing poster line
        newLines.push(raw);
        continue;
      }

      if (line.startsWith("filepath:")) {
        newLines.push(raw);
        // Insert poster line right after filepath if not present
        if (!hasPoster) {
          const filepath = line.replace("filepath:", "").trim();
          const basename = path.basename(filepath, ".mp4");
          const jpgPoster = `videos/media/${basename}.jpg`;

          if (fs.existsSync(path.join(ROOT, "public", jpgPoster))) {
            newLines.push(`poster: ${jpgPoster}`);
            hasPoster = true;
          }
        }
        continue;
      }

      newLines.push(raw);
    }

    const newText = newLines.join("\n");
    if (newText !== text) {
      fs.writeFileSync(txtPath, newText, "utf-8");
      console.log(`✓ Updated ${txt}`);
    }
  }
}

function main() {
  if (!fs.existsSync(MEDIA_DIR)) {
    console.log("No videos/media directory found.");
    return;
  }

  const mp4s = fs
    .readdirSync(MEDIA_DIR)
    .filter((f) => f.endsWith(".mp4"));

  if (mp4s.length === 0) {
    console.log("No MP4 files found in public/videos/media/");
    return;
  }

  console.log(`Found ${mp4s.length} video(s)\n`);

  for (const mp4 of mp4s) {
    generatePoster(path.join(MEDIA_DIR, mp4));
  }

  console.log("\nUpdating txt files...");
  updateTxtFiles();

  console.log("\n✅ Done. Run `npm run texts` to regenerate JSON.");
}

main();
