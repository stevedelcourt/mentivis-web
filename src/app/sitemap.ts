import { MetadataRoute } from "next";
import { INSIGHTS } from "@/data/insights";
import { REFERENTIEL_META } from "@/data/referentiel-meta";
import videosFr from "@/content/videos/videos-fr.json";
import videosEn from "@/content/videos/videos-en.json";

export const dynamic = "force-static";

const BASE_URL = "https://mentivis.com";

/** Static pages referenced by navigation (no orphans). */
const STATIC_PAGES = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "enterprise", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "of", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "solutions", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "mentivisos", priority: 0.8, changeFrequency: "monthly" as const },

  { path: "insights", priority: 0.8, changeFrequency: "weekly" as const },
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
        url: `${BASE_URL}/${lang}${page.path ? `/${page.path}` : ''}/`,
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
        url: `${BASE_URL}/${lang}/insights/${article.slug}/`,
        lastModified: new Date(article.date),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  // Referentiel articles × 2 languages
  for (const lang of ["fr", "en"]) {
    for (const article of REFERENTIEL_META) {
      if (article.lang !== lang) continue;
      entries.push({
        url: `${BASE_URL}/${lang}/referentiel/${article.slug}/`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  // Video pages with video metadata (YouTube hosted)
  const videoData = { fr: videosFr, en: videosEn };
  for (const lang of ["fr", "en"]) {
    const { videos } = videoData[lang as keyof typeof videoData];
    entries.push({
      url: `${BASE_URL}/${lang}/videos/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
      videos: videos
        .filter((v: any) => v.youtube)
        .map((v: any) => ({
          title: v.title,
          thumbnail_loc: `https://img.youtube.com/vi/${v.youtube}/hqdefault.jpg`,
          description: v.description,
          player_loc: `https://www.youtube-nocookie.com/embed/${v.youtube}`,
        })),
    });
  }

  return entries;
}
