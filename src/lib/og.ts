// OG image helper — maps page/hero to OG image
// For static export, OG images are just URLs to public assets.
// Prefer hero image per page, fallback to default opengraph-image.jpg

const SITE_BASE = "https://mentivis.com";

export type OgImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

const HERO_OG_MAP: Record<string, OgImage> = {
  "/": { url: `${SITE_BASE}/images/heroes/hero-1c.avif`, width: 3526, height: 1800, alt: "Mentivis" },
  "/enterprise": { url: `${SITE_BASE}/images/heroes/men-enterprise.avif`, width: 2000, height: 1143, alt: "Mentivis" },
  "/of": { url: `${SITE_BASE}/images/heroes/of.avif`, width: 1920, height: 1097, alt: "Mentivis" },
  "/about": { url: `${SITE_BASE}/images/heroes/teamflash.avif`, width: 1920, height: 1097, alt: "Mentivis" },
  "/solutions": { url: `${SITE_BASE}/images/heroes/diversity.avif`, width: 1920, height: 1097, alt: "Mentivis" },
  "/contact": { url: `${SITE_BASE}/images/heroes/investor.avif`, width: 1920, height: 1097, alt: "Mentivis" },
  "/mentivisos": { url: `${SITE_BASE}/images/mentivisos/thumb-product.webp`, width: 1200, height: 630, alt: "MentivisOS" },
  "/referentiel": { url: `${SITE_BASE}/images/referentiel-og.jpg`, width: 1200, height: 630, alt: "Le Référentiel — Mentivis" },
  "/insights": { url: `${SITE_BASE}/images/insights/profarticle.avif`, width: 1200, height: 630, alt: "Mentivis Insights" },
  "/videos": { url: `${SITE_BASE}/images/heroes/video-open.avif`, width: 1920, height: 1097, alt: "Mentivis" },
  "/guides": { url: `${SITE_BASE}/images/heroes/blobs.avif`, width: 1920, height: 1097, alt: "Mentivis" },
  "/score-formation": { url: `${SITE_BASE}/images/heroes/score.avif`, width: 1920, height: 1097, alt: "Mentivis" },
  "/careers": { url: `${SITE_BASE}/images/team/mathias.costes.avif`, width: 320, height: 320, alt: "Mentivis" },
  "/default": { url: `${SITE_BASE}/opengraph-image.jpg`, width: 1200, height: 630, alt: "Mentivis" },
};

export function getOgImage(pagePath: string, lang: string = "fr"): OgImage {
  // Normalize: remove trailing slash, ensure leading slash
  let key = pagePath;
  if (!key.startsWith("/")) key = `/${key}`;
  if (key.length > 1 && key.endsWith("/")) key = key.slice(0, -1);
  // Direct match
  if (HERO_OG_MAP[key]) return HERO_OG_MAP[key];
  // Prefix match for nested routes like /insights/[slug] -> use insights
  if (key.startsWith("/insights")) return HERO_OG_MAP["/insights"];
  if (key.startsWith("/referentiel")) return HERO_OG_MAP["/referentiel"];
  if (key.startsWith("/careers")) return HERO_OG_MAP["/careers"];
  return HERO_OG_MAP["/default"];
}

export function getOgImageForInsight(article: { heroImage: string; titleFr?: string; titleEn?: string }, lang: string = "fr"): OgImage {
  // Articles use their heroImage directly (already in public)
  if (article?.heroImage) {
    return {
      url: article.heroImage.startsWith("http") ? article.heroImage : `${SITE_BASE}${article.heroImage}`,
      width: 1200,
      height: 630,
      alt: lang === "fr" ? article.titleFr || "Mentivis" : article.titleEn || "Mentivis",
    };
  }
  return HERO_OG_MAP["/default"];
}

export function getOgImageForReferentiel(article?: { title: string } | null, lang: string = "fr"): OgImage {
  // Referentiel articles currently share default OG; future per-article OG can be added here
  if (article) {
    return { url: `${SITE_BASE}/images/referentiel-og.jpg`, width: 1200, height: 630, alt: article.title };
  }
  return HERO_OG_MAP["/referentiel"];
}
