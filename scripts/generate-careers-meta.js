/**
 * Reads all job .json files from src/content/careers/,
 * strips descriptionFr/descriptionEn body content,
 * writes src/data/careers-meta.json.
 */
const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(__dirname, "..", "src", "content", "careers");
const META_OUT = path.join(__dirname, "..", "src", "data", "careers-meta.json");

const metaFields = ["slug", "titleFr", "titleEn", "department", "location", "type", "remote", "date"];

if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  fs.writeFileSync(META_OUT, "[]", "utf-8");
  console.log("No careers found — wrote empty careers-meta.json");
  process.exit(0);
}

const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith(".json") && !f.endsWith(".tech.json")).sort();
const meta = files.map(f => {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8");
  const data = JSON.parse(raw);
  const entry = {};
  metaFields.forEach(k => { if (k in data) entry[k] = data[k]; });
  return entry;
});

meta.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
fs.writeFileSync(META_OUT, JSON.stringify(meta, null, 2), "utf-8");
console.log(`generate-careers-meta: wrote ${meta.length} jobs`);
