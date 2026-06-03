"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { marked } from "marked";
import {
  REFERENTIEL_META,
  getCibles,
  getThematiques,
  getAllTags,
} from "@/data/referentiel-meta";
import { ReferentielArticle } from "@/data/referentiel";
import ReferentielSidebar from "../ReferentielSidebar";
import JsonLd from "@/components/JsonLd";
import PageShell from "@/components/layout/PageShell";

interface Props {
  article: ReferentielArticle;
  lang: string;
}

export default function ReferentielDetailClient({ article, lang }: Props) {
  const searchParams = useSearchParams();
  const activeCible = searchParams.get("cible") || "";
  const activeThematique = searchParams.get("thematique") || "";
  const activeTag = searchParams.get("tag") || "";
  const query = searchParams.get("q") || "";

  const filtered = useMemo(() => {
    let result = REFERENTIEL_META;
    if (activeCible) result = result.filter((a) => a.cible === activeCible);
    if (activeThematique) result = result.filter((a) => a.thematique === activeThematique);
    if (activeTag) result = result.filter((a) => a.tags.includes(activeTag));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.shortDescription.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [activeCible, activeThematique, activeTag, query]);

  const htmlContent = useMemo(() => {
    try {
      return marked.parse(article.content) as string;
    } catch {
      return article.content;
    }
  }, [article.content]);

  const sectionStyle: React.CSSProperties = {
    padding: "80px 0 60px",
    background: "var(--m-bg)",
  };

  const layoutStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: 48,
    minHeight: 400,
  };

  const sidebarWrapStyle: React.CSSProperties = {
    position: "sticky",
    top: 80,
    maxHeight: "calc(100vh - 100px)",
    overflowY: "auto",
    paddingRight: 16,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "clamp(28px, 4vw, 44px)",
    fontWeight: 300,
    lineHeight: 1.15,
    color: "var(--m-ink)",
    marginBottom: 16,
    fontFamily: "var(--font-sans, 'IBM Plex Sans')",
  };

  const badgeStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "4px 12px",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    borderRadius: 6,
    background: "var(--m-bg-warm)",
    color: "var(--m-ink-2)",
    fontFamily: "var(--font-sans, 'IBM Plex Sans')",
    marginRight: 8,
    marginBottom: 24,
  };

  const contentStyle: React.CSSProperties = {
    fontSize: 16,
    lineHeight: 1.75,
    color: "var(--m-ink-2)",
    fontFamily: "var(--font-sans, 'IBM Plex Sans')",
  };

  const shareBarStyle: React.CSSProperties = {
    marginTop: 48,
    paddingTop: 24,
    borderTop: "1px solid var(--m-line)",
    display: "flex",
    alignItems: "center",
    gap: 16,
  };

  const shareLabelStyle: React.CSSProperties = {
    fontSize: 13,
    color: "var(--m-ink-3)",
    fontFamily: "var(--font-sans, 'IBM Plex Sans')",
  };

  const shareBtnStyle: React.CSSProperties = {
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 500,
    fontFamily: "var(--font-sans, 'IBM Plex Sans')",
    border: "1px solid var(--m-line)",
    borderRadius: 6,
    background: "transparent",
    color: "var(--m-ink-2)",
    cursor: "pointer",
  };

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleShare = (platform: string) => {
    if (typeof window === "undefined") return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article.title);
    const maps: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    if (maps[platform]) window.open(maps[platform], "_blank", "noopener");
  };

  return (
    <PageShell hidePreFooterCTA>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.metaDescription || article.shortDescription,
          keywords: article.tags.join(", "),
          url: `https://mentivis.com/fr/referentiel/${article.slug}/`,
        }}
      />
      <section style={sectionStyle}>
        <div className="container">
          <div style={layoutStyle} className="referentiel-layout">
            <div style={sidebarWrapStyle} className="referentiel-sidebar">
              <ReferentielSidebar
                articles={filtered}
                activeSlug={article.slug}
                activeCible={activeCible}
                activeThematique={activeThematique}
                activeTag={activeTag}
                query={query}
              />
            </div>
            <div>
              <h1 style={titleStyle}>{article.title}</h1>
              <div>
                <span style={badgeStyle}>{article.cible}</span>
                <span style={badgeStyle}>{article.thematique}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 32 }}>
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      fontSize: 11,
                      background: "var(--m-bg-soft)",
                      borderRadius: 4,
                      color: "var(--m-ink-3)",
                      fontFamily: "var(--font-sans, 'IBM Plex Sans')",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div
                style={contentStyle}
                className="referentiel-content"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
              <div style={shareBarStyle}>
                <span style={shareLabelStyle}>Partager :</span>
                <button onClick={handleCopy} style={shareBtnStyle}>
                  Copier le lien
                </button>
                <button onClick={() => handleShare("twitter")} style={shareBtnStyle}>
                  X (Twitter)
                </button>
                <button onClick={() => handleShare("linkedin")} style={shareBtnStyle}>
                  LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
