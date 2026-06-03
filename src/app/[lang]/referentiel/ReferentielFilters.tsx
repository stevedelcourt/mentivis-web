"use client";

interface Props {
  cibles: string[];
  thematiques: string[];
  allTags: string[];
  activeCible: string;
  activeThematique: string;
  activeTag: string;
  query: string;
  onUpdateFilter: (key: string, value: string) => void;
  onSetQuery: (q: string) => void;
  lang?: string;
  cibleEn?: Record<string, string>;
}

const THEMATIQUE_EN: Record<string, string> = {
  "Certification": "Certification",
  "Financement": "Funding",
  "Apprentissage": "Apprenticeship",
  "Pédagogie": "Pedagogy",
  "Réglementation": "Regulation",
  "Développement": "Development",
  "Qualiopi": "Qualiopi",
  "Bilan de compétences": "Skills Assessment",
};

const topBarStyle: React.CSSProperties = {
  display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16, alignItems: "center",
};

const selectStyle: React.CSSProperties = {
  padding: "8px 14px", fontSize: 13, fontFamily: "var(--font-sans, 'IBM Plex Sans')",
  border: "1px solid var(--m-line)", borderRadius: 8, background: "var(--m-bg)",
  color: "var(--m-ink)", cursor: "pointer", minWidth: 140,
};

const searchStyle: React.CSSProperties = {
  flex: 1, minWidth: 200, maxWidth: 360, padding: "8px 14px", fontSize: 13,
  fontFamily: "var(--font-sans, 'IBM Plex Sans')", border: "1px solid var(--m-line)",
  borderRadius: 8, background: "var(--m-bg)", color: "var(--m-ink)",
};

export default function ReferentielFilters({
  cibles, thematiques, allTags,
  activeCible, activeThematique, activeTag, query,
  onUpdateFilter, onSetQuery,
  lang = "fr", cibleEn = {},
}: Props) {
  const isFr = lang === "fr";

  const label = (fr: string, en: string) => isFr ? fr : en;
  const tagStyle = (active: boolean): React.CSSProperties => ({
    padding: "4px 12px", fontSize: 12, fontWeight: 500,
    fontFamily: "var(--font-sans, 'IBM Plex Sans')",
    border: `1px solid ${active ? "var(--m-purple)" : "var(--m-line)"}`,
    borderRadius: 100, background: active ? "var(--m-purple)" : "transparent",
    color: active ? "#fff" : "var(--m-ink-2)", cursor: "pointer",
    transition: "all 0.15s ease",
  });

  return (
    <>
      <div style={topBarStyle}>
          <input type="text" placeholder={label("Rechercher un article...", "Search...")} value={query}
          onChange={(e) => onSetQuery(e.target.value)} style={searchStyle} />
        <select value={activeCible}
          onChange={(e) => onUpdateFilter("cible", e.target.value)} style={selectStyle}>
          <option value="">{label("Toutes les cibles", "All targets")}</option>
          {cibles.map((c) => <option key={c} value={c}>{label(c, cibleEn[c] || c)}</option>)}
        </select>
        <select value={activeThematique}
          onChange={(e) => onUpdateFilter("thematique", e.target.value)} style={selectStyle}>
          <option value="">{label("Toutes les thématiques", "All themes")}</option>
          {thematiques.map((t) => <option key={t} value={t}>{label(t, THEMATIQUE_EN[t] || t)}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 32 }}>
        {allTags.map((tag) => (
          <button key={tag} onClick={() => onUpdateFilter("tag", activeTag === tag ? "" : tag)}
            style={tagStyle(activeTag === tag)}>{tag}</button>
        ))}
        {activeCible && (
          <button onClick={() => onUpdateFilter("cible", "")}
            style={{ ...tagStyle(false), background: "#fee", borderColor: "#fcc", color: "#c00" }}>
            ✕ {activeCible}
          </button>
        )}
        {activeThematique && (
          <button onClick={() => onUpdateFilter("thematique", "")}
            style={{ ...tagStyle(false), background: "#fee", borderColor: "#fcc", color: "#c00" }}>
            ✕ {activeThematique}
          </button>
        )}
      </div>
    </>
  );
}
