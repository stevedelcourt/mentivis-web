#!/usr/bin/env node
/**
 * sync-favicon.js — Copie le favicon source vers les emplacements requis par Next.js
 *
 * Usage:
 *   node scripts/sync-favicon.js     # copie depuis favicon.ico (racine)
 *   npm run favicon                   # alias via package.json
 *
 * Le fichier favicon.ico à la racine du projet est la source de vérité.
 * Il est copié vers :
 *   - src/app/favicon.ico    (utilisé par Next.js App Router pour le <link rel="icon">)
 *   - public/favicon.ico     (servi directement à l'URL /favicon.ico)
 */

const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const source = path.join(rootDir, "favicon.ico");
const targets = [
  path.join(rootDir, "src", "app", "favicon.ico"),
  path.join(rootDir, "public", "favicon.ico"),
];

if (!fs.existsSync(source)) {
  console.error("❌ favicon.ico introuvable à la racine du projet");
  console.error("   Place ton fichier favicon.ico à la racine, puis relance : npm run favicon");
  process.exit(1);
}

const stats = fs.statSync(source);
if (!stats.isFile()) {
  console.error("❌ favicon.ico existe mais n'est pas un fichier");
  process.exit(1);
}

let copied = 0;
for (const target of targets) {
  const dir = path.dirname(target);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.copyFileSync(source, target);
  copied++;
  console.log(`✓ ${path.relative(rootDir, target)}`);
}

console.log(`\n✅ Favicon synchronisé (${(stats.size / 1024).toFixed(1)} KB) → ${copied} destination(s)`);
console.log("   Source : favicon.ico (racine du projet)");
