import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "referentiel");
const TS_FILE = path.join(process.cwd(), "src", "data", "referentiel.ts");

function checkDev() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Admin API is disabled in production" },
      { status: 403 }
    );
  }
  return null;
}

function readAllArticles(): any[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".json") && !f.endsWith(".tech.json"))
    .sort();
  return files.map((f) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8");
    return JSON.parse(raw);
  });
}

function writeArticle(article: any) {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
  const filePath = path.join(CONTENT_DIR, `${article.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(article, null, 2), "utf-8");
}

function deleteArticle(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

function updateTsImports(articles: any[]) {
  const slugs = articles.map((a) => a.slug).sort();
  let tsContent = `/* eslint-disable */
// Full article data with body content — used ONLY for article detail pages.
// For listings and cards, use @/data/referentiel-meta (much lighter, no body content).

import type { ReferentielArticleMeta } from "./referentiel-meta";
import { CATEGORY_LABELS } from "./referentiel-meta";
export { CATEGORY_LABELS };\n`;

  const varNames: string[] = [];
  slugs.forEach((slug: string, i: number) => {
    const varName = `article${i + 1}`;
    varNames.push(varName);
    tsContent += `import ${varName} from "../content/referentiel/${slug}.json";\n`;
  });

  tsContent += `\nexport interface ReferentielArticle extends ReferentielArticleMeta {
  content: string;
}\n\n`;

  tsContent += `export const REFERENTIEL: ReferentielArticle[] = [\n`;
  const lines: string[] = [];
  for (let i = 0; i < varNames.length; i += 5) {
    lines.push("  " + varNames.slice(i, i + 5).join(", "));
  }
  tsContent += lines.join(",\n");
  tsContent += ",\n] as ReferentielArticle[];\n\n";

  tsContent += `export function getReferentielBySlug(slug: string): ReferentielArticle | undefined {
  return REFERENTIEL.find((a) => a.slug === slug);
}

export function getReferentielSlugs(): string[] {
  return REFERENTIEL.map((a) => a.slug);
}

export function getReferentielByCible(cible: string): ReferentielArticle[] {
  return REFERENTIEL.filter((a) => a.cible === cible);
}

export function getReferentielByThematique(thematique: string): ReferentielArticle[] {
  return REFERENTIEL.filter((a) => a.thematique === thematique);
}
`;

  fs.writeFileSync(TS_FILE, tsContent, "utf-8");
}

// GET — list all articles
export async function GET() {
  const devCheck = checkDev();
  if (devCheck) return devCheck;

  const articles = readAllArticles();
  return NextResponse.json(articles);
}

// POST — create or update an article
export async function POST(request: NextRequest) {
  const devCheck = checkDev();
  if (devCheck) return devCheck;

  try {
    const article = await request.json();
    if (!article.slug || !article.title) {
      return NextResponse.json({ error: "slug and title are required" }, { status: 400 });
    }

    writeArticle(article);

    // Update TS imports
    const articles = readAllArticles();
    updateTsImports(articles);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE — remove an article
export async function DELETE(request: NextRequest) {
  const devCheck = checkDev();
  if (devCheck) return devCheck;

  try {
    const { slug } = await request.json();
    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    deleteArticle(slug);

    // Update TS imports
    const articles = readAllArticles();
    updateTsImports(articles);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
