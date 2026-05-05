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
    "Training consulting and digital solutions for enterprises and training organizations.",
    "",
    "## Pages principales / Main Pages",
    "",
    "### Français",
    "",
    "- /fr/ — Accueil Mentivis",
    "- /fr/about — À propos de Mentivis",
    "- /fr/enterprise — Conseil en formation pour entreprises",
    "- /fr/of — Conseil pour organismes de formation",
    "- /fr/solutions — Solutions digitales (conception d'outils sur mesure, développement spécifique, IA)",
    "- /fr/mentivissolutions — Mentivis Solutions (iframe externe)",
    "- /fr/contact — Contact et demande de diagnostic",
    "- /fr/insights — Publications et perspectives",
    "- /fr/guides — Guides pratiques BPF, CPF, POEI",
    "- /fr/score-formation — Évaluez votre dispositif de formation",
    "- /fr/careers — Rejoindre l'équipe Mentivis",
    "- /fr/meeting — Prendre rendez-vous",
    "- /fr/videos — Vidéos Mentivis",
    "",
    "### English",
    "",
    "- /en/ — Mentivis Home",
    "- /en/about — About Mentivis",
    "- /en/enterprise — Enterprise training consulting",
    "- /en/of — Training organization consulting",
    "- /en/solutions — Digital solutions (custom tool design, specific development, AI)",
    "- /en/mentivissolutions — Mentivis Solutions (external iframe)",
    "- /en/contact — Contact and diagnostic request",
    "- /en/insights — Insights and perspectives",
    "- /en/guides — Reference guides BPF, CPF, POEI",
    "- /en/score-formation — Score Formation diagnostic",
    "- /en/careers — Join the Mentivis team",
    "- /en/meeting — Book a meeting",
    "- /en/videos — Mentivis Videos",
    "",
    "## Cas clients / Client Cases",
    "",
    "### Entreprises / Enterprise",
    "",
    "- Réseau immobilier international — Étude Go/NoGo pour 2 dispositifs de formation (Start Immo + BTS alternance). Budget: 9.9k €, 6 semaines.",
    "- Éditeur de logiciels métiers — Création et déploiement de 3 centres de formation (Nice, Lyon, Bordeaux). Budget: ~2.2 M€, 3 ans.",
    "",
    "### Organismes de formation / Training Organizations",
    "",
    "- PSH Sup — Externalisation opérationnelle complète (administratif, relations entreprises, marketing). Contrat 3 ans.",
    "- Ecolearn — Structuration Qualiopi et croissance (+85% CA, 480 apprenants). Budget: 14.5k € + 3.5k €/mois.",
    "",
    "## Insights récents / Recent Insights",
    "",
  ];

  for (const a of articles) {
    const titleFr = a.titleFr || a.slug;
    const titleEn = a.titleEn || a.titleFr || a.slug;
    const urlFr = `${BASE_URL}/fr/insights/${a.slug}`;
    const urlEn = `${BASE_URL}/en/insights/${a.slug}`;
    const date = a.date;
    const excerptFr = a.excerptFr || "";
    const excerptEn = a.excerptEn || "";

    lines.push(`- ${titleFr} (${date}) — ${urlFr}`);
    if (excerptFr) {
      lines.push(`  ${excerptFr.replace(/\n/g, " ")}`);
    }
    lines.push(`- ${titleEn} (${date}) — ${urlEn}`);
    if (excerptEn) {
      lines.push(`  ${excerptEn.replace(/\n/g, " ")}`);
    }
    lines.push("");
  }

  lines.push("## Contact");
  lines.push("");
  lines.push("- Email: contact@mentivis.com");
  lines.push("- Phone: +33 1 89 48 10 02");
  lines.push("- Address: 60 Rue François 1er, 75008 Paris");
  lines.push("- LinkedIn: https://www.linkedin.com/company/mentivis/");
  lines.push("");

  fs.writeFileSync(OUTPUT_FILE, lines.join("\n"), "utf-8");
  console.log(`Generated ${OUTPUT_FILE} with ${articles.length} recent articles (bilingual).`);
}

generateLlmsTxt();
