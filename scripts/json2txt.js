#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const MESSAGES_DIR = path.join(ROOT, "src", "messages");
const INSIGHTS_DIR = path.join(ROOT, "src", "content", "insights");

function writeSection(lines, obj, sectionPrefix) {
  let started = false;
  let lastWasComplex = false;

  for (const [k, v] of Object.entries(obj)) {
    const isPrimitive = !Array.isArray(v) && (typeof v !== "object" || v === null);
    const isPrimitiveArray = Array.isArray(v) && v.every((item) => typeof item !== "object" || item === null);
    const isComplex = !isPrimitive && !isPrimitiveArray;

    if (isComplex) {
      lastWasComplex = true;
      if (Array.isArray(v)) {
        v.forEach((item, i) => {
          lines.push("");
          lines.push(`# ${sectionPrefix}.${k}[${i}]`);
          for (const [ik, iv] of Object.entries(item)) {
            if (Array.isArray(iv) && iv.every((x) => typeof x !== "object" || x === null)) {
              iv.forEach((x, j) => lines.push(`${ik}[${j}]: ${x}`));
            } else if (typeof iv !== "object" || iv === null) {
              lines.push(`${ik}: ${iv}`);
            } else {
              lines.push(`${ik}: ${JSON.stringify(iv)}`);
            }
          }
        });
      } else {
        lines.push("");
        lines.push(`# ${sectionPrefix}.${k}`);
        for (const [sk, sv] of Object.entries(v)) {
          if (Array.isArray(sv) && sv.every((item) => typeof item !== "object" || item === null)) {
            sv.forEach((item, i) => lines.push(`${sk}[${i}]: ${item}`));
          } else if (Array.isArray(sv)) {
            sv.forEach((item, i) => {
              lines.push("");
              lines.push(`# ${sectionPrefix}.${k}.${sk}[${i}]`);
              for (const [ik, iv] of Object.entries(item)) {
                if (Array.isArray(iv) && iv.every((x) => typeof x !== "object" || x === null)) {
                  iv.forEach((x, j) => lines.push(`${ik}[${j}]: ${x}`));
                } else if (typeof iv !== "object" || iv === null) {
                  lines.push(`${ik}: ${iv}`);
                } else {
                  lines.push(`${ik}: ${JSON.stringify(iv)}`);
                }
              }
            });
          } else if (typeof sv !== "object" || sv === null) {
            lines.push(`${sk}: ${sv}`);
          } else {
            lines.push(`${sk}: ${JSON.stringify(sv)}`);
          }
        }
      }
    } else {
      if (lastWasComplex || !started) {
        lines.push("");
        lines.push(`# ${sectionPrefix}`);
        lastWasComplex = false;
        started = true;
      }
      if (isPrimitiveArray) {
        v.forEach((item, i) => lines.push(`${k}[${i}]: ${item}`));
      } else {
        lines.push(`${k}: ${v}`);
      }
    }
  }
}

function convertMessages() {
  for (const lang of ["fr", "en"]) {
    const json = JSON.parse(fs.readFileSync(path.join(MESSAGES_DIR, `${lang}.json`), "utf-8"));
    const lines = [];
    for (const [sectionKey, sectionValue] of Object.entries(json)) {
      if (typeof sectionValue === "object" && sectionValue !== null && !Array.isArray(sectionValue)) {
        writeSection(lines, sectionValue, sectionKey);
      } else {
        lines.push(`${sectionKey}: ${sectionValue}`);
      }
    }
    fs.writeFileSync(path.join(MESSAGES_DIR, `site-${lang}.txt`), lines.join("\n"), "utf-8");
    console.log(`✓ ${lang}.json → site-${lang}.txt`);
  }
}

function convertInsights() {
  if (!fs.existsSync(INSIGHTS_DIR)) return;
  const files = fs.readdirSync(INSIGHTS_DIR).filter((f) => f.endsWith(".json") && !f.endsWith(".tech.json"));
  for (const file of files) {
    const slug = file.replace(".json", "");
    const data = JSON.parse(fs.readFileSync(path.join(INSIGHTS_DIR, file), "utf-8"));
    const tech = {};
    ["slug", "date", "category", "author", "readTime", "heroImage", "keywords"].forEach((f) => {
      if (f in data) tech[f] = data[f];
    });
    fs.writeFileSync(path.join(INSIGHTS_DIR, `${slug}.tech.json`), JSON.stringify(tech, null, 2) + "\n", "utf-8");
    const text = [];
    text.push("# metadata");
    text.push(`titleFr: ${data.titleFr || ""}`);
    text.push(`titleEn: ${data.titleEn || ""}`);
    text.push(`excerptFr: ${data.excerptFr || ""}`);
    text.push(`excerptEn: ${data.excerptEn || ""}`);
    text.push("");
    text.push("# bodyFr");
    if (data.bodyFr) {
      data.bodyFr.split("\n\n").forEach((p, i) => {
        if (i > 0) text.push("///");
        text.push(p.trim());
      });
    }
    text.push("");
    text.push("# bodyEn");
    if (data.bodyEn) {
      data.bodyEn.split("\n\n").forEach((p, i) => {
        if (i > 0) text.push("///");
        text.push(p.trim());
      });
    }
    fs.writeFileSync(path.join(INSIGHTS_DIR, `${slug}.txt`), text.join("\n"), "utf-8");
    console.log(`✓ ${file} → ${slug}.txt + ${slug}.tech.json`);
  }
}

console.log("🔄 json2txt\n");
convertMessages();
convertInsights();
console.log("\n✅ Done.");
