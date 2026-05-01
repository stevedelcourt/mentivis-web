const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(__dirname, "..", "src", "content", "insights");
const OUTPUT_FILE = path.join(__dirname, "..", "public", "llms.txt");
const BASE_URL = "https://www.mentivis.com";

function getRecentArticles(n = 10) {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".json") && !f.endsWith(".tech.json"));

  const articles = files
    .map((f) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8");
      return JSON.parse(raw);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, n);

  return articles;
}

function generateLlmsTxt() {
  const articles = getRecentArticles(10);

  const lines = [
    "# Mentivis",
    "",
    "Conseil en formation et solutions digitales pour entreprises et organismes de formation.",
    "",
    "## Pages principales",
    "",
    "- /fr/ — Accueil Mentivis",
    "- /fr/about — À propos de Mentivis",
    "- /fr/enterprise — Conseil en formation pour entreprises",
    "- /fr/of — Conseil pour organismes de formation",
    "- /fr/solutions — Solutions digitales formation",
    "- /fr/contact — Contact et demande de diagnostic",
    "- /fr/insights — Publications et perspectives",
    "- /fr/guides — Guides pratiques BPF, CPF, POEI",
    "- /fr/score-formation — Évaluez votre dispositif de formation",
    "- /fr/careers — Rejoindre l'équipe Mentivis",
    "- /fr/meeting — Prendre rendez-vous",
    "",
    "## Insights récents",
    "",
  ];

  for (const a of articles) {
    const title = a.titleFr || a.slug;
    const url = `${BASE_URL}/fr/insights/${a.slug}`;
    const date = a.date;
    const excerpt = a.excerptFr || "";
    lines.push(`- ${title} (${date}) — ${url}`);
    if (excerpt) {
      lines.push(`  ${excerpt.replace(/\n/g, " ")}`);
    }
    lines.push("");
  }

  lines.push("## Contact");
  lines.push("");
  lines.push("- Email: contact@mentivis.com");
  lines.push("- Téléphone: +33 1 89 48 10 02");
  lines.push("- Adresse: 60 Rue François 1er, 75008 Paris");
  lines.push("- LinkedIn: https://www.linkedin.com/company/mentivis/");
  lines.push("");

  fs.writeFileSync(OUTPUT_FILE, lines.join("\n"), "utf-8");
  console.log(`Generated ${OUTPUT_FILE} with ${articles.length} recent articles.`);
}

generateLlmsTxt();
