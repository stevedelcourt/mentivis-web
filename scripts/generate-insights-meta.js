#!/usr/bin/env node
/**
 * generate-insights-meta.js — Génère insights-meta.json à partir des articles JSON
 *
 * Usage:
 *   node scripts/generate-insights-meta.js
 *   npm run generate:meta
 *
 * Ce script lit tous les fichiers .json dans src/content/insights/
 * et extrait seulement les métadonnées (sans bodyFr/bodyEn)
 * pour créer src/data/insights-meta.json.
 *
 * Le fichier généré est utilisé par les listings et cartes d'articles
 * afin d'éviter d'embarquer tout le contenu HTML dans le bundle principal.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const INSIGHTS_DIR = path.join(ROOT, "src", "content", "insights");
const META_OUT = path.join(ROOT, "src", "data", "insights-meta.json");

function main() {
  if (!fs.existsSync(INSIGHTS_DIR)) {
    console.error("❌ Dossier introuvable:", INSIGHTS_DIR);
    process.exit(1);
  }

  const files = fs
    .readdirSync(INSIGHTS_DIR)
    .filter((f) => f.endsWith(".json") && !f.endsWith(".tech.json"));

  const meta = [];

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(INSIGHTS_DIR, file), "utf8"));
    meta.push({
      slug: data.slug,
      date: data.date,
      category: data.category,
      author: data.author,
      readTime: data.readTime,
      titleFr: data.titleFr,
      titleEn: data.titleEn,
      excerptFr: data.excerptFr,
      excerptEn: data.excerptEn,
      heroImage: data.heroImage,
      keywords: data.keywords,
    });
  }

  // Sort by date descending
  meta.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  fs.writeFileSync(META_OUT, JSON.stringify(meta, null, 2) + "\n");
  console.log(`✓ insights-meta.json généré (${meta.length} articles)`);
}

main();
