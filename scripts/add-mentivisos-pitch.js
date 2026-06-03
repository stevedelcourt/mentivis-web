#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "src", "content", "referentiel");
const files = fs.readdirSync(DIR).filter(f => f.endsWith(".json") && !f.endsWith(".tech.json"));

const FR_PITCH = "**MentivisOS n'est pas un LMS.** C'est un système natif IA qui diagnostique l'écart, génère le parcours exact et mesure l'acquisition réelle, du référentiel à la certification. [Découvrir MentivisOS](https://mentivis.com/fr/mentivisos/)";
const EN_PITCH = "**MentivisOS is not an LMS.** It is an AI-native system that diagnoses the gap, generates the exact learning path and measures real acquisition, from framework to certification. [Discover MentivisOS](https://mentivis.com/en/mentivisos/)";

// Lead-in sentences by category
const LEADINS_FR = {
  "LMS": "Contrairement à un LMS qui se limite à diffuser des contenus, MentivisOS va bien plus loin :",
  "plateforme": "Dans un paysage où cohabitent LMS, outils auteurs et plateformes de diffusion, MentivisOS occupe une place à part :",
  "compétences": "Là où la plupart des outils se contentent de suivre l'activité, MentivisOS place l'acquisition réelle des compétences au cœur du système :",
  "pédagogie": "Pour aller au-delà de la simple mise à disposition de contenus et piloter l'acquisition réelle,",
  "EdTech": "Dans l'univers des EdTech, MentivisOS se distingue par sa capacité à générer plutôt qu'à diffuser :",
  "default": "Contrairement à un LMS qui se limite à diffuser des contenus,",
};

const LEADINS_EN = {
  "LMS": "Unlike an LMS that merely distributes content, MentivisOS goes much further:",
  "plateforme": "In a landscape where LMS platforms, authoring tools and delivery platforms coexist, MentivisOS occupies a unique position:",
  "compétences": "While most tools only track activity, MentivisOS puts real skills acquisition at the core of the system:",
  "pédagogie": "To go beyond content delivery and drive real acquisition,",
  "EdTech": "In the EdTech landscape, MentivisOS stands out by generating rather than distributing:",
  "default": "Unlike an LMS that merely distributes content,",
};

// Articles that already have a MentivisOS link (skip)
function hasMentivisosLink(content) {
  return content.includes("mentivisos") || content.includes("MentivisOS") || content.includes("mentivisos.com");
}

// Detect if article is relevant for MentivisOS pitch
function isRelevant(data) {
  const text = (data.title + " " + data.content + " " + (data.tags || []).join(" ")).toLowerCase();
  const keywords = ["lms", "plateforme", "compétence", "compétences", "pédagogie", "pédagogique",
    "edtech", "e-learning", "formation", "apprentissage", "programme", "parcours",
    "évaluation", "certification"];
  for (const kw of keywords) {
    if (text.includes(kw)) return true;
  }
  return false;
}

// Choose best lead-in category
function getCategory(title, content, tags, cible) {
  const text = (title + " " + content + " " + (tags || []).join(" ")).toLowerCase();
  if (text.includes("lms")) return "LMS";
  if (cible && cible.toLowerCase().includes("edtech")) return "EdTech";
  if (text.includes("plateforme")) return "plateforme";
  if (text.includes("pédagog") || text.includes("évalu")) return "pédagogie";
  if (text.includes("compét") || text.includes("acquis")) return "compétences";
  return "default";
}

let count = 0;
let skipped = 0;

for (const file of files) {
  const fp = path.join(DIR, file);
  let data;
  try { data = JSON.parse(fs.readFileSync(fp, "utf8")); } catch { continue; }

  if (hasMentivisosLink(data.content)) {
    skipped++;
    continue;
  }

  if (!isRelevant(data)) continue;

  const isEn = file.endsWith(".en.json");
  const category = getCategory(data.title, data.content, data.tags, data.cible);
  const leadins = isEn ? LEADINS_EN : LEADINS_FR;
  const pitch = isEn ? EN_PITCH : FR_PITCH;
  const leadin = leadins[category] || leadins.default;

  data.content += `\n\n---\n\n_${leadin}_ ${pitch}`;
  fs.writeFileSync(fp, JSON.stringify(data, null, 2) + "\n", "utf8");
  count++;
  console.log(`  ${isEn ? "EN" : "FR"} ${data.order}: added to "${data.title}" (${category})`);
}

console.log(`\n✅ Done: ${count} articles updated, ${skipped} skipped (already had link)`);
