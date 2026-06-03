#!/usr/bin/env node
/**
 * generate-referentiel-meta.js — Génère referentiel-meta.json à partir des articles JSON
 *
 * Usage:
 *   node scripts/generate-referentiel-meta.js
 *
 * Lit tous les fichiers .json dans src/content/referentiel/
 * et extrait seulement les métadonnées (sans le champ content)
 * pour créer src/data/referentiel-meta.json.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const REFERENTIEL_DIR = path.join(ROOT, "src", "content", "referentiel");
const META_OUT = path.join(ROOT, "src", "data", "referentiel-meta.json");

function main() {
  if (!fs.existsSync(REFERENTIEL_DIR)) {
    console.error("❌ Dossier introuvable:", REFERENTIEL_DIR);
    process.exit(1);
  }

  const files = fs
    .readdirSync(REFERENTIEL_DIR)
    .filter((f) => f.endsWith(".json") && !f.endsWith(".tech.json"));

  const meta = [];

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(REFERENTIEL_DIR, file), "utf8"));
    meta.push({
      slug: data.slug,
      title: data.title,
      cible: data.cible,
      thematique: data.thematique,
      tags: data.tags,
      shortDescription: data.shortDescription,
      metaDescription: data.metaDescription,
      order: data.order,
    });
  }

  // Sort by order ascending
  meta.sort((a, b) => a.order - b.order);

  fs.writeFileSync(META_OUT, JSON.stringify(meta, null, 2) + "\n");
  console.log(`✓ referentiel-meta.json généré (${meta.length} articles)`);
}

main();
