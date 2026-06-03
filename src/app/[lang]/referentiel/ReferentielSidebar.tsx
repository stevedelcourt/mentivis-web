"use client";

import Link from "next/link";
import { ReferentielArticleMeta } from "@/data/referentiel-meta";

interface Props {
  articles: ReferentielArticleMeta[];
  activeSlug?: string;
  activeCible: string;
  activeThematique: string;
  activeTag: string;
  query: string;
}

export default function ReferentielSidebar({
  articles,
  activeSlug,
  activeCible,
  activeThematique,
  activeTag,
  query,
}: Props) {
  if (articles.length === 0) {
    return (
      <p style={{ fontSize: 14, color: "var(--m-ink-2)", fontFamily: "var(--font-sans, 'IBM Plex Sans')" }}>
        Aucun article trouvé.
      </p>
    );
  }

  const buildHref = (slug: string) => {
    const params = new URLSearchParams();
    if (activeCible) params.set("cible", activeCible);
    if (activeThematique) params.set("thematique", activeThematique);
    if (activeTag) params.set("tag", activeTag);
    if (query) params.set("q", query);
    const qs = params.toString();
    return `/fr/referentiel/${slug}/${qs ? `?${qs}` : ""}`;
  };

  const itemStyle = (isActive: boolean): React.CSSProperties => ({
    display: "block",
    padding: "12px 12px",
    borderRadius: 8,
    textDecoration: "none",
    borderLeft: isActive ? "3px solid var(--m-purple)" : "3px solid transparent",
    background: isActive ? "var(--m-bg-soft)" : "transparent",
    transition: "background 0.15s ease",
    marginBottom: 4,
  });

  const titleStyle = (isActive: boolean): React.CSSProperties => ({
    fontSize: 15,
    fontWeight: isActive ? 600 : 400,
    lineHeight: 1.35,
    color: "var(--m-ink)",
    fontFamily: "var(--font-sans, 'IBM Plex Sans')",
    marginBottom: 4,
  });

  const descStyle: React.CSSProperties = {
    fontSize: 12,
    lineHeight: 1.4,
    color: "var(--m-ink-3)",
    fontFamily: "var(--font-sans, 'IBM Plex Sans')",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };

  const tagStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "1px 6px",
    fontSize: 10,
    fontWeight: 500,
    fontFamily: "var(--font-sans, 'IBM Plex Sans')",
    background: "var(--m-bg-warm)",
    color: "var(--m-ink-3)",
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  };

  return (
    <div>
      {articles.map((article) => (
        <Link
          key={article.slug}
          href={buildHref(article.slug)}
          style={itemStyle(article.slug === activeSlug)}
        >
          <p style={titleStyle(article.slug === activeSlug)}>{article.title}</p>
          <p style={descStyle}>{article.shortDescription}</p>
          <div style={{ marginTop: 4 }}>
            <span style={tagStyle}>{article.cible}</span>
            <span style={tagStyle}>{article.thematique}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
