"use client";

import { useState, useMemo, useCallback } from "react";
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

const CIBLE_EN: Record<string, string> = {
  "Organismes de formation": "Training Organizations",
  "Entreprises": "Companies",
  "EdTech, plateformes et outils numériques": "EdTech, Platforms and Digital Tools",
};

export default function ReferentielClient() {
  const [navKey, setNavKey] = useState(0);
  const { get } = useSearchParamsClient();

  const lang = typeof window !== "undefined"
    ? window.location.pathname.split("/")[1] || "fr"
    : "fr";

  const activeCible = get("cible");
  const activeThematique = get("thematique");
  const activeTag = get("tag");
  const [query, setQuery] = useState(get("q"));

  const isFr = lang === "fr";

  const filtered = useMemo(() => {
    let result = REFERENTIEL_META.filter((a) => a.lang === lang);
    void navKey;
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
  }, [activeCible, activeThematique, activeTag, query, navKey, lang]);

  const updateFilter = useCallback((key: string, value: string) => {
    if (typeof window === "undefined") return;
    const l = window.location.pathname.split("/")[1] || "fr";
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== "tag") params.delete("tag");
    window.history.pushState(null, "", `/${l}/referentiel/?${params.toString()}`);
    setNavKey((n) => n + 1);
  }, []);

  return (
    <PageShell hidePreFooterCTA>
      <section style={{ padding: "80px 0 40px", background: "var(--m-bg)" }}>
        <div className="container">
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, lineHeight: 1.15, color: "var(--m-ink)", marginBottom: 8 }}>
              {isFr ? "Le Référentiel" : "The Reference"}
            </h1>
            <p style={{ fontSize: 16, color: "var(--m-ink-2)", lineHeight: 1.5, maxWidth: 620 }}>
              {isFr
                ? "Articles pratiques et conformes pour les organismes de formation."
                : "Practical compliance guides for training organizations."}
            </p>
          </div>

          <ReferentielFilters
            cibles={getCibles()} thematiques={getThematiques()} allTags={getAllTags()}
            activeCible={activeCible} activeThematique={activeThematique}
            activeTag={activeTag} query={query}
            onUpdateFilter={updateFilter} onSetQuery={setQuery}
            lang={lang} cibleEn={CIBLE_EN}
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
                lang={lang}
              />
            </div>
            <div>
              <p style={{
                display: "flex", alignItems: "center", justifyContent: "center", height: "100%",
                color: "var(--m-ink-2)", fontSize: 16, textAlign: "center",
              }}>
                {isFr
                  ? "Sélectionnez un article dans la liste pour le lire."
                  : "Select an article from the list to read it."}
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
