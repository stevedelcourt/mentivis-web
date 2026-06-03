#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const FR_DIR = path.join(ROOT, "src", "content", "referentiel");
const EN_LOT_DIR = path.join(ROOT, "referentiel", "EN");

// — Step 1: Backfill "lang": "fr" to existing files —
console.log("=== Step 1: Backfill lang:fr ===");
const frFiles = fs.readdirSync(FR_DIR).filter(f => f.endsWith(".json") && !f.includes(".en."));
for (const file of frFiles) {
  const fp = path.join(FR_DIR, file);
  const data = JSON.parse(fs.readFileSync(fp, "utf8"));
  if (!data.lang) {
    data.lang = "fr";
    fs.writeFileSync(fp, JSON.stringify(data, null, 2) + "\n", "utf8");
    console.log(`  ✓ ${file} ← lang:fr`);
  }
}

// — Step 2: Generate EN JSONs from EN lot files —
console.log("\n=== Step 2: Generate EN JSONs ===");
const enLotFiles = fs.readdirSync(EN_LOT_DIR).filter(f => f.endsWith(".md"));

// Load all FR articles indexed by order (for slug mapping)
const frByOrder = {};
for (const file of frFiles) {
  const data = JSON.parse(fs.readFileSync(path.join(FR_DIR, file), "utf8"));
  frByOrder[data.order] = data;
}

// Map EN lot file → FR slugs by order
const LOT_SIZES = [0, 10, 20, 30, 40, 50, 60, 70, 80]; // offset per lot
// lot index 0 = articles 1-10, lot index 1 = articles 11-20, etc.

// Map FR lot file → EN lot file by order
// FR: lot-1-of → EN: lot-1-of-EN
// FR: lot-4-entreprises → EN: lot-4-entreprises-EN
const LOT_ORDER = { of: 0, entreprises: 1, edtech: 2 };
const LOT_TYPES = ["of", "of", "of", "entreprises", "entreprises", "entreprises", "edtech", "edtech", "edtech"];

function slugify(title) {
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractFirstSentence(text) {
  const match = text.match(/^([^.]*\.)/);
  return match ? match[1].trim() : text.substring(0, 150).trim();
}

function parseArticles(content) {
  const articles = [];
  const lines = content.split("\n");
  let currentTitle = "";
  let currentBody = [];
  let inArticle = false;
  let inHeader = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (inHeader) {
      if (line.startsWith("# ") && !line.match(/^# \d+\./)) continue;
      if (line.startsWith("---")) { inHeader = false; continue; }
      continue;
    }
    const articleMatch = line.match(/^# \d+\.\s+(.+)/);
    if (articleMatch) {
      if (currentTitle) articles.push({ title: currentTitle, body: currentBody.join("\n").trim() });
      currentTitle = articleMatch[1].trim();
      currentBody = [];
      inArticle = true;
      continue;
    }
    if (line.trim() === "---" && inArticle && currentBody.length > 0) {
      articles.push({ title: currentTitle, body: currentBody.join("\n").trim() });
      currentTitle = "";
      currentBody = [];
      inArticle = false;
      continue;
    }
    if (inArticle) currentBody.push(line);
  }
  if (currentTitle && currentBody.length > 0) {
    articles.push({ title: currentTitle, body: currentBody.join("\n").trim() });
  }
  return articles;
}

// Cible mapping FR → EN
const CIBLE_EN = {
  "Organismes de formation": "Training Organizations",
  "Entreprises": "Companies",
  "EdTech, plateformes et outils numériques": "EdTech, Platforms and Digital Tools",
};

const THEMATIQUE_EN = {
  "Certification": "Certification",
  "Financement": "Funding",
  "Apprentissage": "Apprenticeship",
  "Pédagogie": "Pedagogy",
  "Réglementation": "Regulation",
  "Développement": "Development",
  "Qualiopi": "Qualiopi",
  "Bilan de compétences": "Skills Assessment",
};

const TAG_KEYWORDS = [
  "Qualiopi", "CFA", "CPF", "OPCO", "France Compétences", "France Travail",
  "Pro-A", "VAE", "RNCP", "RNQ", "DREETS", "BPF", "FSE", "POEI",
  "apprentissage", "alternance", "audit", "bilan de compétences",
  "certification", "coût", "déclaration", "financement", "formation",
  "LMS", "e-learning", "blended", "microlearning", "gamification",
  "IA", "EdTech", "VR", "no-code", "chatbot",
  "management", "onboarding", "tutorat", "reconversion",
  "accessibilité", "handicap", "conformité", "RGAA", "WCAG",
  "taxe d'apprentissage", "entretien professionnel",
];

function detectTags(content) {
  const tags = new Set();
  const lower = content.toLowerCase();
  for (const tag of TAG_KEYWORDS) {
    if (lower.includes(tag.toLowerCase())) tags.add(tag);
  }
  return Array.from(tags).sort();
}

function detectThematique(content) {
  const rules = [
    { keywords: ["Qualiopi", "audit", "RNQ", "certification", "renewal"], t: "Certification" },
    { keywords: ["CPF", "funding", "OPCO", "budget", "cost", "FNE", "Pro-A", "PTP", "financial"], t: "Funding" },
    { keywords: ["apprentice", "alternance", "CFA", "apprenticeship tax"], t: "Apprenticeship" },
    { keywords: ["pedagog", "program", "framework", "assessment", "skill", "content", "blended", "microlearning", "e-learning", "LMS", "platform", "digital", "distance", "classroom", "hybrid", "virtual", "VR", "no-code", "chatbot", "gamification", "video"], t: "Pedagogy" },
    { keywords: ["declaration", "DREETS", "contract", "regulation", "subcontract", "obligation", "law", "decree", "RGAA", "WCAG", "accessibility", "disability", "professional interview", "GPEC", "CSE", "compliance", "refusal", "traceability"], t: "Regulation" },
    { keywords: ["market", "tender", "development", "sales", "acquisition", "customer", "commercial", "retention", "onboarding", "culture", "management", "manager", "retraining", "tutoring", "internal", "external", "VAE", "skills assessment", "RNCP", "international"], t: "Development" },
  ];
  const lower = content.toLowerCase();
  for (const rule of rules) {
    for (const kw of rule.keywords) {
      if (lower.includes(kw.toLowerCase())) return rule.t;
    }
  }
  return "Regulation";
}

// Determine cible from EN file name
let totalEn = 0;
for (const enFile of enLotFiles.sort()) {
  let cibleEn = "Training Organizations";
  if (enFile.includes("entreprises")) cibleEn = "Companies";
  else if (enFile.includes("edtech")) cibleEn = "EdTech, Platforms and Digital Tools";
  // Cible FR
  const cibleFr = Object.keys(CIBLE_EN).find(k => CIBLE_EN[k] === cibleEn) || "Organismes de formation";

  const content = fs.readFileSync(path.join(EN_LOT_DIR, enFile), "utf8");
  const articles = parseArticles(content);

  for (const article of articles) {
    const localIdx = articles.indexOf(article);
    const lotIdx = enLotFiles.indexOf(enFile);
    const order = localIdx + 1 + lotIdx * 10;

    // Use FR slug (same URL for both languages)
    const frArticle = frByOrder[order];
    const slug = frArticle ? frArticle.slug : slugify(article.title);

    const body = article.body;
    const firstSentence = extractFirstSentence(body);
    const thematique = detectThematique(body);
    const tags = detectTags(body);

    const jsonData = {
      slug,
      lang: "en",
      title: article.title,
      cible: cibleFr,
      cibleEn,
      thematique,
      thematiqueEn: THEMATIQUE_EN[thematique] || thematique,
      tags,
      shortDescription: firstSentence.length > 200 ? firstSentence.substring(0, 197) + "..." : firstSentence,
      metaDescription: firstSentence,
      content: body,
      order,
    };

    const outFile = path.join(FR_DIR, `${slug}.en.json`);
    fs.writeFileSync(outFile, JSON.stringify(jsonData, null, 2) + "\n", "utf8");
    console.log(`  ✓ ${order}: ${article.title}`);
    totalEn++;
  }
}

console.log(`\n✅ Done. ${totalEn} EN articles generated.`);
