#!/usr/bin/env node
/**
 * txt2json.js — Convertit les fichiers .txt éditables en .json techniques
 *
 * Usage:
 *   node scripts/txt2json.js           # convertit tout
 *   node scripts/txt2json.js --check   # valide sans écrire
 */

const fs = require("fs");
const path = require("path");

const CHECK_ONLY = process.argv.includes("--check");
const ROOT = path.join(__dirname, "..");
const MESSAGES_DIR = path.join(ROOT, "src", "messages");
const CONTENT_DIR = path.join(ROOT, "src", "content");
const INSIGHTS_DIR = path.join(CONTENT_DIR, "insights");
const VIDEOS_DIR = path.join(CONTENT_DIR, "videos");
const BACKUP_DIR = path.join(ROOT, ".backup");
const MAX_BACKUPS = 10;

/* ============================================================
   Backup
   ============================================================ */
function ensureBackup() {
  if (CHECK_ONLY) return;
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

  const now = new Date();
  const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}`;
  const dest = path.join(BACKUP_DIR, stamp);
  fs.mkdirSync(dest, { recursive: true });

  // Copy all JSON files that will be overwritten
  const files = [];
  if (fs.existsSync(path.join(MESSAGES_DIR, "fr.json"))) files.push(path.join(MESSAGES_DIR, "fr.json"));
  if (fs.existsSync(path.join(MESSAGES_DIR, "en.json"))) files.push(path.join(MESSAGES_DIR, "en.json"));

  const insightJsons = fs.existsSync(INSIGHTS_DIR)
    ? fs.readdirSync(INSIGHTS_DIR).filter((f) => f.endsWith(".json") && !f.endsWith(".tech.json"))
    : [];
  insightJsons.forEach((f) => files.push(path.join(INSIGHTS_DIR, f)));

  files.forEach((src) => {
    const basename = path.relative(ROOT, src);
    const out = path.join(dest, basename);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.copyFileSync(src, out);
  });

  console.log(`✓ Backup created: .backup/${stamp}`);

  // Prune old backups
  const dirs = fs
    .readdirSync(BACKUP_DIR)
    .map((d) => ({ name: d, time: fs.statSync(path.join(BACKUP_DIR, d)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time);
  dirs.slice(MAX_BACKUPS).forEach((d) => {
    fs.rmSync(path.join(BACKUP_DIR, d.name), { recursive: true, force: true });
  });
}

/* ============================================================
   TXT → JSON parser
   ============================================================ */
function parseTxt(text) {
  const lines = text.split(/\r?\n/);
  const result = {};
  let currentSection = null; // ex: "about.expertise[0]"

  for (let raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("#")) {
      // Section header
      currentSection = line.replace(/^#\s*/, "").trim();
      continue;
    }

    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();

    const fullKey = currentSection ? `${currentSection}.${key}` : key;
    setValue(result, fullKey, value);
  }

  return result;
}

function setValue(obj, keyPath, value) {
  // keyPath ex: "about.expertise[0].title" ou "animation.words[0]"
  const parts = keyPath.split(".");
  let current = obj;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const isLast = i === parts.length - 1;

    // Detect array access: "expertise[0]"
    const arrMatch = part.match(/^(.+)\[(\d+)\]$/);
    if (arrMatch) {
      const arrName = arrMatch[1];
      const arrIdx = parseInt(arrMatch[2], 10);

      if (!current[arrName]) current[arrName] = [];
      const arr = current[arrName];
      while (arr.length <= arrIdx) arr.push({});

      if (isLast) {
        arr[arrIdx] = value;
      } else {
        if (typeof arr[arrIdx] !== "object" || arr[arrIdx] === null) arr[arrIdx] = {};
        current = arr[arrIdx];
      }
      continue;
    }

    if (isLast) {
      current[part] = value;
      break;
    }

    if (!current[part] || typeof current[part] !== "object") current[part] = {};
    current = current[part];
  }
}

/* ============================================================
   Convert site text files (fr/en)
   ============================================================ */
function convertSiteTexts() {
  const pairs = [
    { txt: "site-fr.txt", json: "fr.json" },
    { txt: "site-en.txt", json: "en.json" },
  ];

  const results = {};

  for (const { txt, json } of pairs) {
    const txtPath = path.join(MESSAGES_DIR, txt);
    const jsonPath = path.join(MESSAGES_DIR, json);

    if (!fs.existsSync(txtPath)) {
      console.error(`✗ Missing ${txtPath}`);
      process.exit(1);
    }

    const text = fs.readFileSync(txtPath, "utf-8");
    const parsed = parseTxt(text);
    results[json] = parsed;

    if (!CHECK_ONLY) {
      fs.writeFileSync(jsonPath, JSON.stringify(parsed, null, 2) + "\n", "utf-8");
      console.log(`✓ ${txt} → ${json}`);
    } else {
      console.log(`✓ ${txt} parsed (dry-run)`);
    }
  }

  // Cross-validate keys
  const frKeys = collectKeys(results["fr.json"]);
  const enKeys = collectKeys(results["en.json"]);

  const missingInEn = frKeys.filter((k) => !enKeys.includes(k));
  const missingInFr = enKeys.filter((k) => !frKeys.includes(k));

  if (missingInEn.length || missingInFr.length) {
    console.error("\n✗ Structure mismatch between FR and EN:");
    if (missingInEn.length) console.error("  Missing in EN:", missingInEn.slice(0, 5).join(", "));
    if (missingInFr.length) console.error("  Missing in FR:", missingInFr.slice(0, 5).join(", "));
    process.exit(1);
  }

  console.log("✓ FR/EN structure validated");
}

function collectKeys(obj, prefix = "") {
  let keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (typeof item === "object" && item !== null) {
          keys = keys.concat(collectKeys(item, `${full}[${i}]`));
        } else {
          keys.push(`${full}[${i}]`);
        }
      });
    } else if (typeof v === "object" && v !== null) {
      keys = keys.concat(collectKeys(v, full));
    } else {
      keys.push(full);
    }
  }
  return keys.sort();
}

/* ============================================================
   Convert insight articles
   ============================================================ */
function convertInsights() {
  if (!fs.existsSync(INSIGHTS_DIR)) return;

  const files = fs.readdirSync(INSIGHTS_DIR);
  const techFiles = files.filter((f) => f.endsWith(".tech.json"));

  for (const techFile of techFiles) {
    const slug = techFile.replace(".tech.json", "");
    const txtFile = `${slug}.txt`;
    const txtPath = path.join(INSIGHTS_DIR, txtFile);
    const techPath = path.join(INSIGHTS_DIR, techFile);
    const outPath = path.join(INSIGHTS_DIR, `${slug}.json`);

    if (!fs.existsSync(txtPath)) {
      console.warn(`⚠ Missing ${txtFile}, skipping`);
      continue;
    }

    const tech = JSON.parse(fs.readFileSync(techPath, "utf-8"));
    const text = fs.readFileSync(txtPath, "utf-8");
    const parsed = parseInsightTxt(text);

    // Merge tech + parsed
    const merged = { ...tech, ...parsed };
    // Ensure body fields always exist as strings
    if (!('bodyFr' in merged)) merged.bodyFr = '';
    if (!('bodyEn' in merged)) merged.bodyEn = '';

    if (!CHECK_ONLY) {
      fs.writeFileSync(outPath, JSON.stringify(merged, null, 2) + "\n", "utf-8");
      console.log(`✓ ${txtFile} → ${slug}.json`);
    } else {
      console.log(`✓ ${txtFile} parsed (dry-run)`);
    }
  }
}

function parseInsightTxt(text) {
  const lines = text.split(/\r?\n/);
  const result = {};
  let currentSection = null;
  let currentBody = [];
  let currentParagraph = [];

  function flushParagraph() {
    if (currentParagraph.length) {
      currentBody.push(currentParagraph.join("\n").trim());
      currentParagraph = [];
    }
  }

  function flushBody() {
    flushParagraph();
    if (currentSection && currentBody.length) {
      result[currentSection] = currentBody.join("\n\n");
    }
    currentBody = [];
    currentSection = null;
  }

  for (let raw of lines) {
    const line = raw.trimEnd(); // keep leading spaces for body text
    const trimmed = line.trim();

    // Only treat # metadata, # bodyFr, # bodyEn as section headers
    if (/^#\s*(metadata|bodyFr|bodyEn)\s*$/.test(trimmed)) {
      flushBody();
      currentSection = trimmed.replace(/^#\s*/, "").trim();
      continue;
    }

    if (trimmed === "///") {
      flushParagraph();
      continue;
    }

    if (!currentSection) continue;

    if (currentSection === "metadata") {
      if (!trimmed) continue;
      const colonIdx = trimmed.indexOf(":");
      if (colonIdx === -1) continue;
      const key = trimmed.slice(0, colonIdx).trim();
      const value = trimmed.slice(colonIdx + 1).trim();
      result[key] = value;
      continue;
    }

    // body section
    if (trimmed || currentParagraph.length) {
      currentParagraph.push(line.trim());
    }
  }

  flushBody();
  return result;
}

/* ============================================================
   Convert video lists
   ============================================================ */
function convertVideos() {
  if (!fs.existsSync(VIDEOS_DIR)) return;

  const pairs = [
    { txt: "videos-fr.txt", json: "videos-fr.json" },
    { txt: "videos-en.txt", json: "videos-en.json" },
  ];

  for (const { txt, json } of pairs) {
    const txtPath = path.join(VIDEOS_DIR, txt);
    const jsonPath = path.join(VIDEOS_DIR, json);

    if (!fs.existsSync(txtPath)) {
      console.warn(`⚠ Missing ${txt}, skipping`);
      continue;
    }

    const text = fs.readFileSync(txtPath, "utf-8");
    const parsed = parseVideosTxt(text);

    if (!CHECK_ONLY) {
      fs.writeFileSync(jsonPath, JSON.stringify(parsed, null, 2) + "\n", "utf-8");
      console.log(`✓ ${txt} → ${json}`);
    } else {
      console.log(`✓ ${txt} parsed (dry-run)`);
    }
  }
}

function parseVideosTxt(text) {
  const lines = text.split(/\r?\n/);
  const videos = [];
  let currentVideo = null;

  for (let raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("#")) {
      // Section header like # videos[0]
      if (currentVideo) {
        videos.push(currentVideo);
      }
      currentVideo = {};
      continue;
    }

    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();

    if (currentVideo) {
      currentVideo[key] = value;
    }
  }

  if (currentVideo) {
    videos.push(currentVideo);
  }

  return { videos };
}

/* ============================================================
   Main
   ============================================================ */
function main() {
  console.log(CHECK_ONLY ? "🔍 txt2json — dry-run mode\n" : "📝 txt2json — converting\n");

  ensureBackup();
  convertSiteTexts();
  convertInsights();
  convertVideos();

  console.log("\n✅ Done");
}

main();
