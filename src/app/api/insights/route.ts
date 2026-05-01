import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "insights");
const FEATURED_FILE = path.join(process.cwd(), "src", "content", "featured-insights.json");
const TS_FILE = path.join(process.cwd(), "src", "data", "insights.ts");

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
    .filter((f) => f.endsWith(".json"))
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
  const tsContent = fs.readFileSync(TS_FILE, "utf-8");

  // Generate import statements
  const imports = articles
    .map(
      (a, i) =>
        `import article${i + 1} from "../content/insights/${a.slug}.json";`
    )
    .join("\n");

  // Generate INSIGHTS array
  const names = articles.map((_, i) => `article${i + 1}`).join(", ");
  const arrayLines = [];
  for (let i = 0; i < articles.length; i += 5) {
    const chunk = articles.slice(i, i + 5).map((_, j) => `article${i + j + 1}`);
    const lineEnd = i + 5 >= articles.length ? "" : ",";
    arrayLines.push(`  ${chunk.join(", ")}${lineEnd}`);
  }
  const arrayBlock = `export const INSIGHTS: InsightArticle[] = [\n${arrayLines.join("\n")}\n] as InsightArticle[];`;

  // Replace imports block (everything between first import and the export interface)
  const importStart = tsContent.indexOf('import article1');
  const interfaceStart = tsContent.indexOf('export interface InsightArticle');
  const newContent =
    tsContent.substring(0, importStart) +
    imports +
    "\n\n" +
    tsContent.substring(interfaceStart, tsContent.indexOf('export const INSIGHTS')) +
    arrayBlock +
    "\n\n" +
    tsContent.substring(tsContent.indexOf('export function getInsightBySlug'));

  fs.writeFileSync(TS_FILE, newContent, "utf-8");
}

export async function GET() {
  const err = checkDev();
  if (err) return err;
  try {
    const data = readAllArticles();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const err = checkDev();
  if (err) return err;
  try {
    const body = await req.json();

    // Featured config save
    if (body._action === "featured") {
      fs.writeFileSync(
        FEATURED_FILE,
        JSON.stringify(body.config, null, 2),
        "utf-8"
      );
      return NextResponse.json({ ok: true });
    }

    const isNew = !fs.existsSync(path.join(CONTENT_DIR, `${body.slug}.json`));
    writeArticle(body);

    if (isNew) {
      // New article: regenerate imports in insights.ts
      const all = readAllArticles();
      updateTsImports(all);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const err = checkDev();
  if (err) return err;
  try {
    const { slug } = await req.json();
    deleteArticle(slug);

    // Regenerate imports in insights.ts
    const all = readAllArticles();
    updateTsImports(all);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
