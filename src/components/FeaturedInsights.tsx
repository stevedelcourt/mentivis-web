"use client";

import InsightCard from "./InsightCard";
import { INSIGHTS } from "@/data/insights";
import featuredConfig from "@/content/featured-insights.json";

const PAGE_LABELS: Record<string, { fr: string; en: string }> = {
  about:      { fr: "À propos",     en: "About" },
  enterprise: { fr: "Entreprises",  en: "Enterprise" },
  of:         { fr: "Organismes de formation", en: "Training organizations" },
  solutions:  { fr: "Solutions",    en: "Solutions" },
};

export default function FeaturedInsights({
  pageKey,
  lang,
}: {
  pageKey: string;
  lang: string;
}) {
  const slugs = (featuredConfig as Record<string, string[]>)[pageKey] || [];
  const articles = slugs
    .map((slug) => INSIGHTS.find((a) => a.slug === slug))
    .filter(Boolean);

  if (articles.length === 0) return null;

  return (
    <section
      style={{
        padding: "80px 0",
        background: "var(--m-bg-soft)",
        borderTop: "1px solid var(--m-line)",
      }}
    >
      <div className="container">
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--m-ink-3)",
            marginBottom: 12,
          }}
        >
          {lang === "fr" ? "Articles connexes" : "Related insights"}
        </div>
        <h3
          style={{
            fontSize: "clamp(22px, 3vw, 32px)",
            fontWeight: 500,
            lineHeight: 1.15,
            color: "var(--m-ink)",
            margin: "0 0 40px",
          }}
        >
          {lang === "fr" ? "Ce qui fait notre actualité" : "What we're following"}
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(articles.length, 3)}, 1fr)`,
            gap: 32,
          }}
          className="featured-insights-grid"
        >
          {articles.map((article) => (
            <InsightCard
              key={article!.slug}
              article={article!}
              lang={lang}
              variant="grid"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
