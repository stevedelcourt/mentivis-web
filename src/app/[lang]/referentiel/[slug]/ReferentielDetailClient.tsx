"use client";

import { useMemo, useState } from "react";
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
import ReferentielFilters from "../ReferentielFilters";
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
  const [query, setQuery] = useState("");

  const cibles = getCibles();
  const thematiques = getThematiques();
  const allTags = getAllTags();

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

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== "tag") params.delete("tag");
    const qs = params.toString();
    window.history.replaceState(null, "", `/fr/referentiel/${article.slug}/${qs ? `?${qs}` : ""}`);
  };

  const buildListUrl = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tag");
    const qs = params.toString();
    return `/fr/referentiel/${qs ? `?${qs}` : ""}`;
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
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.metaDescription || article.shortDescription,
        keywords: article.tags.join(", "),
        url: `https://mentivis.com/fr/referentiel/${article.slug}/`,
      }} />
      <section style={{ padding: "80px 0 60px", background: "var(--m-bg)" }}>
        <div className="container">
          <ReferentielFilters
            cibles={cibles} thematiques={thematiques} allTags={allTags}
            activeCible={activeCible} activeThematique={activeThematique}
            activeTag={activeTag} query={query}
            onUpdateFilter={updateFilter} onSetQuery={setQuery}
          />

          <div className="referentiel-layout" style={{
            display: "grid", gridTemplateColumns: "320px 1fr", gap: 48, minHeight: 400,
          }}>
            <div className="referentiel-sidebar" style={{
              position: "sticky", top: 80, maxHeight: "calc(100vh - 100px)", overflowY: "auto", paddingRight: 16,
            }}>
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
              <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, lineHeight: 1.15, color: "var(--m-ink)", marginBottom: 16, fontFamily: "var(--font-sans, 'IBM Plex Sans')" }}>
                {article.title}
              </h1>
              <div>
                <span style={{ display: "inline-block", padding: "4px 12px", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", borderRadius: 6, background: "var(--m-bg-warm)", color: "var(--m-ink-2)", fontFamily: "var(--font-sans, 'IBM Plex Sans')", marginRight: 8, marginBottom: 24 }}>
                  {article.cible}
                </span>
                <span style={{ display: "inline-block", padding: "4px 12px", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", borderRadius: 6, background: "var(--m-bg-warm)", color: "var(--m-ink-2)", fontFamily: "var(--font-sans, 'IBM Plex Sans')", marginRight: 8, marginBottom: 24 }}>
                  {article.thematique}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 32 }}>
                {article.tags.map((tag) => (
                  <span key={tag} style={{ display: "inline-block", padding: "2px 8px", fontSize: 11, background: "var(--m-bg-soft)", borderRadius: 4, color: "var(--m-ink-3)", fontFamily: "var(--font-sans, 'IBM Plex Sans')" }}>
                    {tag}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: 16, lineHeight: 1.75, color: "var(--m-ink-2)", fontFamily: "var(--font-sans, 'IBM Plex Sans')" }}
                className="referentiel-content"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
              {/* Mobile back to list */}
              <div className="referentiel-mobile-back" style={{ marginTop: 32 }}>
                <a href={buildListUrl()}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: "var(--m-purple)", textDecoration: "none" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  Retour à la liste
                </a>
              </div>
              {/* Share bar */}
              <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--m-line)", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 13, color: "var(--m-ink-3)", fontFamily: "var(--font-sans, 'IBM Plex Sans')" }}>Partager :</span>
                <button onClick={handleCopy}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", fontSize: 12, fontWeight: 500, fontFamily: "var(--font-sans, 'IBM Plex Sans')", border: "1px solid var(--m-line)", borderRadius: 6, background: "transparent", color: "var(--m-ink-2)", cursor: "pointer" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  Copier le lien
                </button>
                <button onClick={() => handleShare("twitter")}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", fontSize: 12, fontWeight: 500, fontFamily: "var(--font-sans, 'IBM Plex Sans')", border: "1px solid var(--m-line)", borderRadius: 6, background: "transparent", color: "var(--m-ink-2)", cursor: "pointer" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X (Twitter)
                </button>
                <button onClick={() => handleShare("linkedin")}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", fontSize: 12, fontWeight: 500, fontFamily: "var(--font-sans, 'IBM Plex Sans')", border: "1px solid var(--m-line)", borderRadius: 6, background: "transparent", color: "var(--m-ink-2)", cursor: "pointer" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style>{`
        @media (max-width: 768px) {
          .referentiel-layout { grid-template-columns: 1fr !important; }
          .referentiel-sidebar { display: none; }
          .referentiel-mobile-back { display: block; }
        }
        @media (min-width: 769px) {
          .referentiel-mobile-back { display: none; }
        }
      `}</style>
    </PageShell>
  );
}
