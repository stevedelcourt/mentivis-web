#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const LOT_DIR = path.join(ROOT, "referentiel");
const OUT_DIR = path.join(ROOT, "src", "content", "referentiel");
const TS_FILE = path.join(ROOT, "src", "data", "referentiel.ts");

const CIBLE_MAP = {
  of: "Organismes de formation",
  entreprises: "Entreprises",
  edtech: "EdTech, plateformes et outils numériques",
};

const THEMATIQUE_KEYWORDS = [
  { keywords: ["Qualiopi", "audit", "RNQ", "certification", "renouvellement"], thematique: "Certification" },
  { keywords: ["CPF", "financement", "OPCO", "budget", "coût", "prise en charge", "FNE", "Pro-A", "PTP"], thematique: "Financement" },
  { keywords: ["apprentissage", "alternant", "CFA", "taxe d'apprentissage", "contrat d'apprentissage", "professionnalisation"], thematique: "Apprentissage" },
  { keywords: ["pédagogie", "programme", "référentiel", "évaluation", "compétences", "contenu", "blended", "microlearning", "e-learning", "LMS", "plateforme", "digital", "distanciel", "présentiel", "hybride", "classe virtuelle", "VR", "réalité virtuelle", "no-code", "chatbot", "assistant IA", "gamification", "vidéo"], thematique: "Pédagogie" },
  { keywords: ["déclaration", "DREETS", "convention", "réglementaire", "sous-traitance", "obligation", "loi", "décret", "RGAA", "WCAG", "accessibilité", "handicap", "entretien professionnel", "GPEC", "CSE", "compliance", "refus", "traçabilité"], thematique: "Réglementation" },
  { keywords: ["marché", "appel d'offre", "développement", "vente", "acquisition", "client", "commercial", "fidéliser", "onboarding", "culture", "management", "manager", "reconversion", "tutorat", "interne", "externe", "VAE", "bilan de compétences", "RNCP", "international"], thematique: "Développement" },
];

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

function slugify(title) {
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function detectThematique(content) {
  for (const rule of THEMATIQUE_KEYWORDS) {
    for (const kw of rule.keywords) {
      if (content.toLowerCase().includes(kw.toLowerCase())) return rule.thematique;
    }
  }
  return "Réglementation";
}

function detectTags(content) {
  const tags = new Set();
  const lower = content.toLowerCase();
  for (const tag of TAG_KEYWORDS) {
    if (lower.includes(tag.toLowerCase())) tags.add(tag);
  }
  return Array.from(tags).sort();
}

function extractFirstSentence(text) {
  const match = text.match(/^([^.]*\.)/);
  return match ? match[1].trim() : text.substring(0, 150).trim();
}

function parseArticles(content, lotFile) {
  const articles = [];
  const lines = content.split("\n");
  let currentTitle = "";
  let currentBody = [];
  let inArticle = false;
  let inHeader = true;

  // Detect cible from file name
  let cible = "Organismes de formation";
  if (lotFile.includes("entreprises")) cible = "Entreprises";
  else if (lotFile.includes("edtech")) cible = "EdTech, plateformes et outils numériques";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip header (before first article)
    if (inHeader) {
      if (line.startsWith("# ") && !line.match(/^# \d+\./)) continue;
      if (line.startsWith("---")) { inHeader = false; continue; }
      continue;
    }

    // Detect article start: "# N. Title"
    const articleMatch = line.match(/^# \d+\.\s+(.+)/);
    if (articleMatch) {
      if (currentTitle) {
        articles.push({ title: currentTitle, body: currentBody.join("\n").trim(), cible });
      }
      currentTitle = articleMatch[1].trim();
      currentBody = [];
      inArticle = true;
      continue;
    }

    // Skip separator lines
    if (line.trim() === "---" && inArticle && currentBody.length > 0) {
      // End of article content section — skip the product links
      articles.push({ title: currentTitle, body: currentBody.join("\n").trim(), cible });
      currentTitle = "";
      currentBody = [];
      inArticle = false;
      continue;
    }

    if (inArticle) {
      currentBody.push(line);
    }
  }

  // Push last article if any
  if (currentTitle && currentBody.length > 0) {
    articles.push({ title: currentTitle, body: currentBody.join("\n").trim(), cible });
  }

  return articles;
}

function main() {
  const lotFiles = fs.readdirSync(LOT_DIR).filter(f => f.endsWith(".md") && f !== "le-referentiel-lot-1-of.md");

  let order = 10; // Continue from existing 10
  let allArticles = [];

  for (const file of lotFiles.sort()) {
    const content = fs.readFileSync(path.join(LOT_DIR, file), "utf8");
    const articles = parseArticles(content, file);

    // Extract thematique from article body for each
    for (const article of articles) {
      order++;
      const slug = slugify(article.title);
      const body = article.body;
      const firstSentence = extractFirstSentence(body);
      const thematique = detectThematique(body);
      const tags = detectTags(body);
      const shortDescription = firstSentence.length > 200 ? firstSentence.substring(0, 197) + "..." : firstSentence;
      const metaDescription = firstSentence;

      // Write JSON file
      const jsonData = {
        slug,
        title: article.title,
        cible: article.cible,
        thematique,
        tags,
        shortDescription,
        metaDescription,
        content: body,
        order,
      };

      const outFile = path.join(OUT_DIR, `${slug}.json`);
      fs.writeFileSync(outFile, JSON.stringify(jsonData, null, 2) + "\n", "utf8");
      console.log(`✓ ${order}: ${article.title} (${article.cible}, ${thematique})`);

      allArticles.push({ slug, title: article.title, order });
    }
  }

  // Generate the import lines for referentiel.ts
  console.log("\n--- Import lines for referentiel.ts ---");
  const importLines = allArticles.map((a, i) => `import article${i + 11} from "../content/referentiel/${a.slug}.json";`);
  const arrayLines = allArticles.map((a, i) => `article${i + 11}`);
  
  // Also update the REFERENTIEL array in the existing file
  const tsContent = fs.readFileSync(TS_FILE, "utf8");
  const lastImportLine = tsContent.lastIndexOf("import article10 from");
  const insertPoint = tsContent.indexOf("\n", lastImportLine) + 1;
  
  // Add imports after existing imports
  const newImports = importLines.join("\n");
  
  // Replace REFERENTIEL array
  const arrayStart = tsContent.indexOf("export const REFERENTIEL");
  const arrayEnd = tsContent.indexOf("] as ReferentielArticle[];", arrayStart);
  
  const existingArray = tsContent.substring(arrayStart, arrayEnd + "] as ReferentielArticle[];".length);
  const newArray = `export const REFERENTIEL: ReferentielArticle[] = [\n  ${arrayLines.join(", ")},\n] as ReferentielArticle[];`;
  
  // We need to add imports and update the array
  const beforeImports = tsContent.substring(0, insertPoint);
  const betweenImportAndArray = tsContent.substring(
    tsContent.indexOf("\n", lastImportLine) + 1,
    arrayStart
  );
  const afterArray = tsContent.substring(arrayEnd + "] as ReferentielArticle[];".length);
  
  const newTsContent = beforeImports + newImports + "\n" + betweenImportAndArray + newArray + afterArray;
  fs.writeFileSync(TS_FILE, newTsContent, "utf8");
  
  console.log(`\n✓ Updated referentiel.ts with ${allArticles.length} new articles`);
  console.log(`✓ Total: ${order} articles`);
}

main();
