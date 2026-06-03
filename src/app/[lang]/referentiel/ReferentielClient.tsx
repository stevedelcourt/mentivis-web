"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  REFERENTIEL_META,
  getCibles,
  getThematiques,
  getAllTags,
} from "@/data/referentiel-meta";
import ReferentielSidebar from "./ReferentielSidebar";

export default function ReferentielClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCible = searchParams.get("cible") || "";
  const activeThematique = searchParams.get("thematique") || "";
  const activeTag = searchParams.get("tag") || "";
  const [query, setQuery] = useState(searchParams.get("q") || "");

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

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset tag when changing cible or thematique
    if (key !== "tag") params.delete("tag");
    router.push(`/fr/referentiel/?${params.toString()}`, { scroll: false });
  };

  const sectionStyle: React.CSSProperties = {
    padding: "80px 0 40px",
    background: "var(--m-bg)",
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: 32,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "clamp(28px, 4vw, 48px)",
    fontWeight: 300,
    lineHeight: 1.15,
    color: "var(--m-ink)",
    marginBottom: 8,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: 16,
    color: "var(--m-ink-2)",
    lineHeight: 1.5,
    maxWidth: 620,
  };

  const topBarStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
    alignItems: "center",
  };

  const selectStyle: React.CSSProperties = {
    padding: "8px 14px",
    fontSize: 13,
    fontFamily: "var(--font-sans, 'IBM Plex Sans')",
    border: "1px solid var(--m-line)",
    borderRadius: 8,
    background: "var(--m-bg)",
    color: "var(--m-ink)",
    cursor: "pointer",
    minWidth: 140,
  };

  const searchStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 200,
    maxWidth: 360,
    padding: "8px 14px",
    fontSize: 13,
    fontFamily: "var(--font-sans, 'IBM Plex Sans')",
    border: "1px solid var(--m-line)",
    borderRadius: 8,
    background: "var(--m-bg)",
    color: "var(--m-ink)",
  };

  const tagStyle = (active: boolean): React.CSSProperties => ({
    padding: "4px 12px",
    fontSize: 12,
    fontWeight: 500,
    fontFamily: "var(--font-sans, 'IBM Plex Sans')",
    border: `1px solid ${active ? "var(--m-purple)" : "var(--m-line)"}`,
    borderRadius: 100,
    background: active ? "var(--m-purple)" : "transparent",
    color: active ? "#fff" : "var(--m-ink-2)",
    cursor: "pointer",
    transition: "all 0.15s ease",
  });

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

  const placeHolderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "var(--m-ink-2)",
    fontSize: 16,
    textAlign: "center",
  };

  return (
    <section style={sectionStyle}>
      <div className="container">
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>Le Référentiel</h1>
          <p style={subtitleStyle}>
            Articles pratiques et conformes pour les organismes de formation.
          </p>
        </div>

        {/* Top bar — filters */}
        <div style={topBarStyle}>
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={searchStyle}
          />
          <select
            value={activeCible}
            onChange={(e) => updateFilter("cible", e.target.value)}
            style={selectStyle}
          >
            <option value="">Toutes les cibles</option>
            {cibles.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={activeThematique}
            onChange={(e) => updateFilter("thematique", e.target.value)}
            style={selectStyle}
          >
            <option value="">Toutes les thématiques</option>
            {thematiques.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Tag pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 32 }}>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => updateFilter("tag", activeTag === tag ? "" : tag)}
              style={tagStyle(activeTag === tag)}
            >
              {tag}
            </button>
          ))}
          {activeCible && (
            <button
              onClick={() => updateFilter("cible", "")}
              style={{ ...tagStyle(false), background: "#fee", borderColor: "#fcc", color: "#c00" }}
            >
              ✕ {activeCible}
            </button>
          )}
          {activeThematique && (
            <button
              onClick={() => updateFilter("thematique", "")}
              style={{ ...tagStyle(false), background: "#fee", borderColor: "#fcc", color: "#c00" }}
            >
              ✕ {activeThematique}
            </button>
          )}
        </div>

        {/* Layout — sidebar + content */}
        <div style={layoutStyle} className="referentiel-layout">
          <div style={sidebarWrapStyle} className="referentiel-sidebar">
            <ReferentielSidebar
              articles={filtered}
              activeCible={activeCible}
              activeThematique={activeThematique}
              activeTag={activeTag}
              query={query}
            />
          </div>
          <div>
            <p style={placeHolderStyle}>
              Sélectionnez un article dans la liste pour le lire.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
