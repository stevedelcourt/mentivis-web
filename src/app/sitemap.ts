import { MetadataRoute } from "next";
import { INSIGHTS } from "@/data/insights";

export const dynamic = "force-static";

const BASE_URL = "https://www.mentivis.com";

/** Static pages referenced by navigation (no orphans). */
const STATIC_PAGES = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "enterprise", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "of", priority: 0.8, changeFrequency: "monthly" as const },

  { path: "insights", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "guides", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "score-formation", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "careers", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "meeting", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "contact", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "videos", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "legal", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "terms", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "cgv", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages × 2 languages
  for (const lang of ["fr", "en"]) {
    for (const page of STATIC_PAGES) {
      entries.push({
        url: `${BASE_URL}/${lang}/${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  // Insight articles × 2 languages
  for (const lang of ["fr", "en"]) {
    for (const article of INSIGHTS) {
      entries.push({
        url: `${BASE_URL}/${lang}/insights/${article.slug}`,
        lastModified: new Date(article.date),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
