// Metadata-only insights array — used for listings and cards.
// For full article content (bodyFr/bodyEn), use @/data/insights

import insightsMetaJson from "./insights-meta.json";

export interface InsightArticleMeta {
  slug: string;
  date: string;
  category: InsightCategory;
  author: string;
  readTime: string;
  titleFr: string;
  titleEn: string;
  excerptFr: string;
  excerptEn: string;
  heroImage: string;
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

export const INSIGHTS_META: InsightArticleMeta[] = insightsMetaJson as InsightArticleMeta[];

export function getInsightMetaBySlug(slug: string): InsightArticleMeta | undefined {
  return INSIGHTS_META.find((a) => a.slug === slug);
}

export function getInsightMetaSlugs(): string[] {
  return INSIGHTS_META.map((a) => a.slug);
}

export function getInsightMetaByCategory(category: InsightCategory): InsightArticleMeta[] {
  return INSIGHTS_META.filter((a) => a.category === category);
}

export function getInsightMetaCategories(): InsightCategory[] {
  const set = new Set<InsightCategory>();
  INSIGHTS_META.forEach((a) => set.add(a.category));
  return Array.from(set);
}
