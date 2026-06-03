"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  REFERENTIEL_META,
  getCibles,
  getThematiques,
  getAllTags,
} from "@/data/referentiel-meta";
import PageShell from "@/components/layout/PageShell";
import ReferentielSidebar from "./ReferentielSidebar";
import ReferentielFilters from "./ReferentielFilters";
import { useSearchParamsClient } from "@/lib/use-search-params";

export default function ReferentielClient() {
  const router = useRouter();
  const { get } = useSearchParamsClient();

  const [activeCible, setActiveCible] = useState("");
  const [activeThematique, setActiveThematique] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setActiveCible(get("cible"));
    setActiveThematique(get("thematique"));
    setActiveTag(get("tag"));
    setQuery(get("q"));
  }, [get]);

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
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "tag") params.delete("tag");
    router.push(`/fr/referentiel/?${params.toString()}`, { scroll: false });
  };

  return (
    <PageShell hidePreFooterCTA>
      <section style={{ padding: "80px 0 40px", background: "var(--m-bg)" }}>
        <div className="container">
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, lineHeight: 1.15, color: "var(--m-ink)", marginBottom: 8 }}>
              Le Référentiel
            </h1>
            <p style={{ fontSize: 16, color: "var(--m-ink-2)", lineHeight: 1.5, maxWidth: 620 }}>
              Articles pratiques et conformes pour les organismes de formation.
            </p>
          </div>

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
                activeCible={activeCible}
                activeThematique={activeThematique}
                activeTag={activeTag}
                query={query}
              />
            </div>
            <div>
              <p style={{
                display: "flex", alignItems: "center", justifyContent: "center", height: "100%",
                color: "var(--m-ink-2)", fontSize: 16, textAlign: "center",
              }}>
                Sélectionnez un article dans la liste pour le lire.
              </p>
            </div>
          </div>
        </div>
      </section>
      <style>{`
        @media (max-width: 768px) {
          .referentiel-layout { grid-template-columns: 1fr !important; }
          .referentiel-layout > div:last-child { display: none; }
        }
      `}</style>
    </PageShell>
  );
}
