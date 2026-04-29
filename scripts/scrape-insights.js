const fs = require("fs");
const path = require("path");
const https = require("https");
const cheerio = require("cheerio");

// ── CONFIG ────────────────────────────────────────────────
const RIP_HTML = path.join(__dirname, "..", "..", "insights", "rip-insights.html");
const OUT_DATA = path.join(__dirname, "..", "src", "data", "insights.ts");
const OUT_IMAGES = path.join(__dirname, "..", "public", "images", "insights");

const ALLOWED_TAGS = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "ul", "ol", "li", "a", "img",
  "strong", "em", "b", "i", "blockquote", "br", "hr",
]);

const CAT_MAP = {
  "Règlementations": "regulatory-insights",
  "Actualités": "news",
  "Marché": "strategy-papers",
  "Digital Data IA": "perspectives",
  "Éducation": "perspectives",
  "Formation": "perspectives",
  "Insights": "perspectives",
  "Recrutement": "perspectives",
};

const MONTH_MAP = {
  "Jan": "01", "Fév": "02", "Mar": "03", "Avr": "04",
  "Mai": "05", "Juin": "06", "Juil": "07", "Août": "08",
  "Sep": "09", "Oct": "10", "Nov": "11", "Déc": "12",
};

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchUrl(res.headers.location).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for image ${url}`));
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (e) => {
        fs.unlink(destPath, () => {});
        reject(e);
      });
  });
}

function toIsoDate(d, m, y) {
  const mm = MONTH_MAP[m] || "01";
  return `${y}-${mm}-${d.padStart(2, "0")}`;
}

function mapCategory(wpCats) {
  for (const c of wpCats) {
    if (CAT_MAP[c]) return CAT_MAP[c];
  }
  return "perspectives";
}

function extractAuthor($) {
  // Try JSON-LD
  const ld = $("script[type='application/ld+json']").first().html() || "";
  const m = ld.match(/"author"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"/);
  if (m) return m[1];
  // Try meta
  const meta = $('meta[name="author"]').attr("content");
  if (meta) return meta;
  return "";
}

function extractReadTime($) {
  const ld = $("script[type='application/ld+json']").first().html() || "";
  const m = ld.match(/"Estimation du temps de lecture"[\s\S]*?"([^"]+)"/);
  if (m) return m[1];
  return "";
}

function cleanNode($, node) {
  const tag = node.tagName?.toLowerCase();
  if (!tag) {
    // text node
    const text = $(node).text();
    return text ? text.replace(/\s+/g, " ") : "";
  }
  if (!ALLOWED_TAGS.has(tag)) {
    // unwrap: recurse into children
    return $(node)
      .contents()
      .map((_, child) => cleanNode($, child))
      .get()
      .join("");
  }

  let attrs = "";
  if (tag === "a") {
    const href = $(node).attr("href");
    if (href) attrs += ` href="${href}"`;
  }
  if (tag === "img") {
    const src = $(node).attr("src");
    const alt = $(node).attr("alt") || "";
    if (src) attrs += ` src="${src}" alt="${alt}"`;
  }

  const inner = $(node)
    .contents()
    .map((_, child) => cleanNode($, child))
    .get()
    .join("");

  if (tag === "img") return `<img${attrs}>`;
  if (["br", "hr"].includes(tag)) return `<${tag}${attrs}>`;
  return `<${tag}${attrs}>${inner}</${tag}>`;
}

function cleanBodyHtml($, rawHtml) {
  const $wrapper = cheerio.load(rawHtml, null, false);
  // Remove h1 title from body (it's stored separately)
  $wrapper("h1").remove();
  // Remove empty elements recursively
  $wrapper("*")
    .filter(function () {
      return $(this).text().trim() === "" && $(this).find("img").length === 0;
    })
    .remove();

  const body = $wrapper.root().children().map((_, el) => cleanNode($wrapper, el)).get().join("");
  // Clean up whitespace
  return body
    .replace(/\n\s*\n/g, "\n")
    .replace(/>\s+</g, "><")
    .trim();
}

async function main() {
  console.log("Reading article list...");
  const ripHtml = fs.readFileSync(RIP_HTML, "utf-8");
  const match = ripHtml.match(/const\s+ARTICLES\s+=\s+(\[[\s\S]*?\]);/);
  if (!match) {
    throw new Error("Could not find ARTICLES array in rip-insights.html");
  }
  const articles = eval(match[1]);

  // Filter out article #11 (english)
  const filtered = articles.filter((a) => a.n !== 11);
  console.log(`Found ${filtered.length} articles to scrape (excluded #11 EN)`);

  if (!fs.existsSync(OUT_IMAGES)) {
    fs.mkdirSync(OUT_IMAGES, { recursive: true });
  }

  const results = [];

  for (let i = 0; i < filtered.length; i++) {
    const a = filtered[i];
    console.log(`\n[${i + 1}/${filtered.length}] ${a.title}`);
    console.log(`  URL: ${a.url}`);

    try {
      await delay(800 + Math.random() * 700);
      const html = await fetchUrl(a.url);
      const $ = cheerio.load(html);

      // Title
      const title = $("h1.qodef-e-title").first().text().trim() || a.title;

      // Body
      const rawBody = $(".qodef-e-text").first().html() || "";
      const body = cleanBodyHtml($, rawBody);

      // Meta
      const author = extractAuthor($);
      const readTime = extractReadTime($);
      const category = mapCategory(a.cats);
      const date = toIsoDate(a.d, a.m, a.y);
      const slug = a.url
        .replace("https://mentivis.com/", "")
        .replace(/\/$/, "")
        .replace(/[^a-z0-9-]/g, "-");

      // Image — try rip URL first, then og:image fallback
      let imgUrl = a.img;
      let imgFilename = imgUrl.split("/").pop();
      let imgDest = path.join(OUT_IMAGES, imgFilename);

      // Remove empty/corrupted files so we retry them
      if (fs.existsSync(imgDest) && fs.statSync(imgDest).size === 0) {
        fs.unlinkSync(imgDest);
      }

      let downloaded = false;
      if (!fs.existsSync(imgDest)) {
        try {
          console.log(`  Downloading image: ${imgFilename}`);
          await downloadImage(imgUrl, imgDest);
          downloaded = true;
        } catch (err) {
          console.log(`  ✗ Rip image failed: ${err.message}`);
        }
      } else {
        downloaded = true;
        console.log(`  Image already exists: ${imgFilename}`);
      }

      if (!downloaded) {
        // Fallback: try og:image from HTML
        const ogImage = $('meta[property="og:image"]').attr("content");
        if (ogImage) {
          imgUrl = ogImage;
          imgFilename = imgUrl.split("/").pop();
          imgDest = path.join(OUT_IMAGES, imgFilename);
          if (fs.existsSync(imgDest) && fs.statSync(imgDest).size === 0) {
            fs.unlinkSync(imgDest);
          }
          if (!fs.existsSync(imgDest)) {
            try {
              console.log(`  Fallback og:image: ${imgFilename}`);
              await downloadImage(imgUrl, imgDest);
              downloaded = true;
            } catch (err2) {
              console.log(`  ✗ og:image also failed: ${err2.message}`);
            }
          } else {
            downloaded = true;
          }
        }
      }

      if (!downloaded) {
        console.log(`  ✗ No image available for this article`);
      }

      results.push({
        slug,
        date,
        category,
        author,
        readTime,
        titleFr: title,
        titleEn: "",
        excerptFr: a.excerpt,
        excerptEn: "",
        bodyFr: body,
        bodyEn: "",
        heroImage: `/images/insights/${imgFilename}`,
        keywords: a.cats.join(", "),
      });

      console.log(`  ✓ Done — ${body.length} chars body, author: ${author || "?"}, cat: ${category}`);
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
    }
  }

  // Generate JSON data file
  const JSON_DATA = path.join(__dirname, "..", "src", "data", "insights.json");
  fs.writeFileSync(JSON_DATA, JSON.stringify(results, null, 2), "utf-8");
  console.log(`\n✓ Written ${JSON_DATA} (${results.length} articles)`);

  // Generate TypeScript wrapper
  const ts = `/* eslint-disable */
// Auto-generated by scripts/scrape-insights.js
// Editable via the dev admin at /admin/insights

import rawInsights from "./insights.json";

export interface InsightArticle {
  slug: string;
  date: string;              // ISO date
  category: InsightCategory;
  author: string;
  readTime: string;
  titleFr: string;
  titleEn: string;
  excerptFr: string;
  excerptEn: string;
  bodyFr: string;            // simplified HTML
  bodyEn: string;
  heroImage: string;         // local path
  keywords: string;
}

export type InsightCategory =
  | "announcements"
  | "perspectives"
  | "regulatory-insights"
  | "news"
  | "strategy-papers";

export const INSIGHT_CATEGORIES: InsightCategory[] = [
  "announcements",
  "perspectives",
  "regulatory-insights",
  "news",
  "strategy-papers",
];

export const CATEGORY_LABELS: Record<InsightCategory, { fr: string; en: string }> = {
  announcements:      { fr: "Annonces",              en: "Announcements" },
  perspectives:       { fr: "Perspectives",          en: "Perspectives" },
  "regulatory-insights": { fr: "Analyses réglementaires", en: "Regulatory Insights" },
  news:               { fr: "Actualités",            en: "News" },
  "strategy-papers":  { fr: "Notes stratégiques",    en: "Strategy Papers" },
};

export const INSIGHTS: InsightArticle[] = rawInsights as InsightArticle[];

export function getInsightBySlug(slug: string): InsightArticle | undefined {
  return INSIGHTS.find((a) => a.slug === slug);
}

export function getInsightSlugs(): string[] {
  return INSIGHTS.map((a) => a.slug);
}

export function getInsightsByCategory(category: InsightCategory): InsightArticle[] {
  return INSIGHTS.filter((a) => a.category === category);
}

export function getInsightCategories(): InsightCategory[] {
  const set = new Set<InsightCategory>();
  INSIGHTS.forEach((a) => set.add(a.category));
  return Array.from(set);
}
`;

  fs.writeFileSync(OUT_DATA, ts, "utf-8");
  console.log(`✓ Written ${OUT_DATA}`);
  console.log(`✓ Images saved to ${OUT_IMAGES}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
