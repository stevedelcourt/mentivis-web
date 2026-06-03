"use client";

import { useState, useEffect, useCallback } from "react";
import {
  REFERENTIEL_META,
  type ReferentielArticleMeta,
  getCibles,
  getThematiques,
  getAllTags,
} from "@/data/referentiel-meta";

interface ReferentielArticle extends ReferentielArticleMeta {
  content: string;
}

const EMPTY_ARTICLE: ReferentielArticle = {
  slug: "",
  title: "",
  cible: "",
  thematique: "",
  tags: [],
  shortDescription: "",
  metaDescription: "",
  content: "",
  order: 0,
};

const ALL_CIBLES = ["Organismes de formation", "Entreprises", "DRH", "Dirigeants", "Formateurs"];
const ALL_THEMATIQUES = ["Apprentissage", "Bilan de compétences", "Certification", "Financement", "Pédagogie", "Qualiopi", "Réglementation"];

export default function AdminReferentielPage() {
  const [articles, setArticles] = useState<ReferentielArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ReferentielArticle | null>(null);
  const [message, setMessage] = useState("");

  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch("/api/referentiel");
      const data = await res.json();
      setArticles(data);
    } catch (e) {
      setMessage("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleSave = async (article: ReferentielArticle) => {
    try {
      const res = await fetch("/api/referentiel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      });
      if (!res.ok) throw new Error("Save failed");
      setMessage("Sauvegardé ✓");
      setEditing(null);
      await fetchArticles();
    } catch (e) {
      setMessage("Erreur de sauvegarde");
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Supprimer définitivement cet article ?")) return;
    try {
      const res = await fetch("/api/referentiel", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setMessage("Supprimé ✓");
      await fetchArticles();
    } catch (e) {
      setMessage("Erreur de suppression");
    }
  };

  const handleNew = () => {
    setEditing({
      ...EMPTY_ARTICLE,
      order: articles.length + 1,
    });
  };

  const updateField = (field: keyof ReferentielArticle, value: any) => {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 12px", fontSize: 14, fontFamily: "system-ui",
    border: "1px solid #ddd", borderRadius: 6, boxSizing: "border-box",
  };
  const textareaStyle: React.CSSProperties = {
    ...inputStyle, minHeight: 200, resize: "vertical", fontFamily: "monospace",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4, display: "block",
    textTransform: "uppercase", letterSpacing: "0.05em",
  };
  const btnStyle: React.CSSProperties = {
    padding: "8px 16px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none",
    cursor: "pointer", fontFamily: "system-ui",
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
      {message && (
        <div style={{ marginBottom: 16, padding: "8px 16px", background: "#e8f5e9", borderRadius: 6, fontSize: 13, fontFamily: "system-ui" }}>
          {message}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: "system-ui", margin: 0 }}>
          Le Référentiel ({articles.length} articles)
        </h2>
        <button onClick={handleNew} style={{ ...btnStyle, background: "#000776", color: "#fff" }}>
          + Nouvel article
        </button>
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "system-ui", fontSize: 13, marginBottom: 32 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e5e5e5", textAlign: "left" }}>
            <th style={{ padding: "8px 12px", fontWeight: 600, color: "#666" }}>#</th>
            <th style={{ padding: "8px 12px", fontWeight: 600, color: "#666" }}>Titre</th>
            <th style={{ padding: "8px 12px", fontWeight: 600, color: "#666" }}>Cible</th>
            <th style={{ padding: "8px 12px", fontWeight: 600, color: "#666" }}>Thématique</th>
            <th style={{ padding: "8px 12px", fontWeight: 600, color: "#666" }}>Tags</th>
            <th style={{ padding: "8px 12px", fontWeight: 600, color: "#666" }}>Ordre</th>
            <th style={{ padding: "8px 12px", fontWeight: 600, color: "#666", width: 100 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles
            .sort((a, b) => a.order - b.order)
            .map((a, i) => (
              <tr key={a.slug} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "8px 12px", color: "#999" }}>{i + 1}</td>
                <td style={{ padding: "8px 12px", fontWeight: 500 }}>{a.title}</td>
                <td style={{ padding: "8px 12px", color: "#666" }}>{a.cible}</td>
                <td style={{ padding: "8px 12px", color: "#666" }}>{a.thematique}</td>
                <td style={{ padding: "8px 12px" }}>
                  {(a.tags || []).map((t: string) => (
                    <span key={t} style={{ display: "inline-block", padding: "1px 6px", margin: "1px 2px", background: "#f0f0f0", borderRadius: 4, fontSize: 11, color: "#666" }}>{t}</span>
                  ))}
                </td>
                <td style={{ padding: "8px 12px", color: "#666" }}>{a.order}</td>
                <td style={{ padding: "8px 12px", display: "flex", gap: 6 }}>
                  <button onClick={() => setEditing({ ...a })} style={{ ...btnStyle, background: "#f0f0f0", color: "#333" }}>
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(a.slug)} style={{ ...btnStyle, background: "#fee", color: "#c00" }}>
                    Suppr.
                  </button>
                </td>
              </tr>
            ))}
          {articles.length === 0 && !loading && (
            <tr><td colSpan={7} style={{ padding: 32, textAlign: "center", color: "#999" }}>Aucun article</td></tr>
          )}
        </tbody>
      </table>

      {/* Edit Form */}
      {editing && (
        <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12, padding: "24px", marginTop: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "system-ui", margin: "0 0 20px" }}>
            {editing.slug ? `Modifier : ${editing.title}` : "Nouvel article"}
          </h3>
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label style={labelStyle}>Slug</label>
              <input value={editing.slug} onChange={(e) => updateField("slug", e.target.value)} style={inputStyle} placeholder="mon-article-slug" />
            </div>
            <div>
              <label style={labelStyle}>Titre</label>
              <input value={editing.title} onChange={(e) => updateField("title", e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Cible</label>
                <input value={editing.cible} onChange={(e) => updateField("cible", e.target.value)} style={inputStyle} list="cibles" />
                <datalist id="cibles">{ALL_CIBLES.map((c) => <option key={c} value={c} />)}</datalist>
              </div>
              <div>
                <label style={labelStyle}>Thématique</label>
                <input value={editing.thematique} onChange={(e) => updateField("thematique", e.target.value)} style={inputStyle} list="thematiques" />
                <datalist id="thematiques">{ALL_THEMATIQUES.map((t) => <option key={t} value={t} />)}</datalist>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Tags (séparés par des virgules)</label>
              <input value={(editing.tags || []).join(", ")} onChange={(e) => updateField("tags", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} style={inputStyle} placeholder="Qualiopi, audit, RNQ" />
            </div>
            <div>
              <label style={labelStyle}>Description courte (listing)</label>
              <textarea value={editing.shortDescription} onChange={(e) => updateField("shortDescription", e.target.value)} style={{ ...textareaStyle, minHeight: 60 }} />
            </div>
            <div>
              <label style={labelStyle}>Meta description (SEO ~155 chars)</label>
              <textarea value={editing.metaDescription} onChange={(e) => updateField("metaDescription", e.target.value)} style={{ ...textareaStyle, minHeight: 60 }} />
            </div>
            <div>
              <label style={labelStyle}>Ordre</label>
              <input type="number" value={editing.order} onChange={(e) => updateField("order", parseInt(e.target.value) || 0)} style={{ ...inputStyle, width: 80 }} />
            </div>
            <div>
              <label style={labelStyle}>Contenu (Markdown)</label>
              <textarea value={editing.content} onChange={(e) => updateField("content", e.target.value)} style={textareaStyle} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <button onClick={() => handleSave(editing)} style={{ ...btnStyle, background: "#000776", color: "#fff" }}>
              Sauvegarder
            </button>
            <button onClick={() => setEditing(null)} style={{ ...btnStyle, background: "#f0f0f0", color: "#666" }}>
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
