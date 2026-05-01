"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { marked } from "marked";
import {
  INSIGHT_CATEGORIES,
  CATEGORY_LABELS,
  type InsightArticle,
  type InsightCategory,
} from "@/data/insights";
import featuredConfig from "@/content/featured-insights.json";

const EMPTY_ARTICLE: InsightArticle = {
  slug: "",
  date: new Date().toISOString().slice(0, 10),
  category: "news",
  author: "",
  readTime: "",
  titleFr: "",
  titleEn: "",
  excerptFr: "",
  excerptEn: "",
  bodyFr: "",
  bodyEn: "",
  heroImage: "/images/insights/",
  keywords: "",
};

const PAGE_KEYS = [
  { key: "about", label: "À propos" },
  { key: "enterprise", label: "Entreprises" },
  { key: "of", label: "Organismes de formation" },
  { key: "solutions", label: "Solutions" },
];

export default function AdminInsightsPage() {
  const [tab, setTab] = useState<"articles" | "pages">("articles");
  const [articles, setArticles] = useState<InsightArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<InsightArticle | null>(null);
  const [message, setMessage] = useState("");

  // Featured config state — initialized directly from the JSON file
  const [featured, setFeatured] = useState<Record<string, string[]>>(() => {
    const normalized: Record<string, string[]> = {};
    PAGE_KEYS.forEach(({ key }) => {
      const arr = (featuredConfig as any)[key] || [];
      normalized[key] = [arr[0] || "", arr[1] || "", arr[2] || ""];
    });
    return normalized;
  });
  const [featuredLoading, setFeaturedLoading] = useState(false);

  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch("/api/insights");
      const data = await res.json();
      setArticles(data);
    } catch (e) {
      setMessage("Erreur de chargement des articles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleSave = async (article: InsightArticle) => {
    try {
      const res = await fetch("/api/insights", {
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
      const res = await fetch("/api/insights", {
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

  const handleSaveFeatured = async () => {
    setFeaturedLoading(true);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _action: "featured", config: featured }),
      });
      if (!res.ok) throw new Error("Save failed");
      setMessage("Configuration sauvegardée ✓");
    } catch (e) {
      setMessage("Erreur de sauvegarde");
    } finally {
      setFeaturedLoading(false);
    }
  };

  const updateFeatured = (page: string, pos: number, slug: string) => {
    setFeatured((prev) => {
      const next = { ...prev };
      next[page] = [...next[page]];
      next[page][pos] = slug;
      return next;
    });
  };

  if (loading) {
    return (
      <div style={{ padding: 40, fontFamily: "system-ui" }}>
        Chargement...
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 32px", fontFamily: "system-ui", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Admin Insights</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {message && (
            <span style={{ fontSize: 13, color: "#149e61" }}>{message}</span>
          )}
          <button
            onClick={() => window.location.href = "/api/insights/backup"}
            style={{
              padding: "8px 16px",
              background: "#fff",
              color: "#000776",
              border: "1.5px solid #000776",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            📦 Backup
          </button>
          {tab === "articles" && (
            <button
              onClick={() => setEditing({ ...EMPTY_ARTICLE })}
              style={{
                padding: "8px 16px",
                background: "#000776",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              + Nouvel article
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid #dedee5" }}>
        <button
          onClick={() => setTab("articles")}
          style={{
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: tab === "articles" ? 700 : 500,
            border: "none",
            borderBottom: tab === "articles" ? "2px solid #000776" : "2px solid transparent",
            background: "transparent",
            cursor: "pointer",
            color: tab === "articles" ? "#000776" : "#686b82",
          }}
        >
          Articles
        </button>
        <button
          onClick={() => setTab("pages")}
          style={{
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: tab === "pages" ? 700 : 500,
            border: "none",
            borderBottom: tab === "pages" ? "2px solid #000776" : "2px solid transparent",
            background: "transparent",
            cursor: "pointer",
            color: tab === "pages" ? "#000776" : "#686b82",
          }}
        >
          Pages
        </button>
      </div>

      {tab === "articles" ? (
        editing ? (
          <ArticleForm
            article={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {articles.map((a) => (
              <div
                key={a.slug}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  border: "1px solid #eef0f5",
                  borderRadius: 8,
                  background: "#fafafd",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: "#eef0f5",
                      color: "#686b82",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {CATEGORY_LABELS[a.category].fr}
                  </span>
                  <span style={{ fontSize: 13, color: "#9497a9", whiteSpace: "nowrap" }}>
                    {a.date}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#101114", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {a.titleFr || a.slug}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <Link
                    href={`/fr/insights/${a.slug}`}
                    target="_blank"
                    style={{ fontSize: 12, color: "#000776", textDecoration: "none", padding: "4px 8px" }}
                  >
                    Voir →
                  </Link>
                  <button
                    onClick={() => setEditing({ ...a })}
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      border: "1px solid #dedee5",
                      background: "#fff",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(a.slug)}
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      border: "1px solid #dedee5",
                      background: "#fff",
                      color: "#c62828",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {PAGE_KEYS.map(({ key, label }) => (
              <div
                key={key}
                style={{
                  border: "1px solid #dedee5",
                  borderRadius: 12,
                  padding: 24,
                  background: "#fff",
                }}
              >
                <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>{label}</h3>
                {[0, 1, 2].map((pos) => (
                  <div key={pos} style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#686b82", display: "block", marginBottom: 4 }}>
                      Position {pos + 1}
                    </label>
                    <select
                      value={featured[key][pos] || ""}
                      onChange={(e) => updateFeatured(key, pos, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        border: "1px solid #dedee5",
                        borderRadius: 6,
                        fontSize: 13,
                        background: "#fff",
                      }}
                    >
                      <option value="">— Aucun —</option>
                      {articles.map((a) => (
                        <option key={a.slug} value={a.slug}>
                          {a.titleFr || a.slug}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <button
              onClick={handleSaveFeatured}
              disabled={featuredLoading}
              style={{
                padding: "10px 20px",
                background: "#000776",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: featuredLoading ? "not-allowed" : "pointer",
                fontWeight: 600,
                opacity: featuredLoading ? 0.6 : 1,
              }}
            >
              {featuredLoading ? "Sauvegarde…" : "Sauvegarder la configuration"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ArticleForm({
  article,
  onSave,
  onCancel,
}: {
  article: InsightArticle;
  onSave: (a: InsightArticle) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<InsightArticle>({ ...article });

  const update = (field: keyof InsightArticle, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      className="admin-form"
      style={{
        border: "1px solid #dedee5",
        borderRadius: 12,
        padding: 24,
        background: "#fff",
      }}
    >
      <h2 style={{ margin: "0 0 20px", fontSize: 18 }}>
        {article.slug ? "Modifier l'article" : "Nouvel article"}
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Slug (URL) *">
          <input
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            placeholder="mon-article"
          />
        </Field>
        <Field label="Date *">
          <input
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </Field>
        <Field label="Catégorie *">
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value as InsightCategory)}
          >
            {INSIGHT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c].fr}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Auteur">
          <input
            value={form.author}
            onChange={(e) => update("author", e.target.value)}
            placeholder="Prénom Nom"
          />
        </Field>
        <Field label="Temps de lecture">
          <input
            value={form.readTime}
            onChange={(e) => update("readTime", e.target.value)}
            placeholder="8 minutes"
          />
        </Field>
        <Field label="Image (chemin)">
          <input
            value={form.heroImage}
            onChange={(e) => update("heroImage", e.target.value)}
            placeholder="/images/insights/mon-image.avif"
          />
        </Field>
        <Field label="Mots-clés">
          <input
            value={form.keywords}
            onChange={(e) => update("keywords", e.target.value)}
            placeholder="formation, IA, éducation"
          />
        </Field>
      </div>

      <Field label="Titre FR *" style={{ marginTop: 16 }}>
        <input
          value={form.titleFr}
          onChange={(e) => update("titleFr", e.target.value)}
          placeholder="Titre en français"
        />
      </Field>
      <Field label="Titre EN">
        <input
          value={form.titleEn}
          onChange={(e) => update("titleEn", e.target.value)}
          placeholder="Title in English"
        />
      </Field>

      <Field label="Extrait FR">
        <textarea
          value={form.excerptFr}
          onChange={(e) => update("excerptFr", e.target.value)}
          rows={3}
          placeholder="Résumé court..."
        />
      </Field>
      <Field label="Extrait EN">
        <textarea
          value={form.excerptEn}
          onChange={(e) => update("excerptEn", e.target.value)}
          rows={3}
          placeholder="Short excerpt..."
        />
      </Field>

      <MarkdownField
        label="Body FR (Markdown) *"
        value={form.bodyFr}
        onChange={(v) => update("bodyFr", v)}
        rows={12}
        placeholder="# Titre&#10;Contenu en **Markdown**..."
      />
      <MarkdownField
        label="Body EN (Markdown)"
        value={form.bodyEn}
        onChange={(v) => update("bodyEn", v)}
        rows={12}
        placeholder="# Title&#10;Content in **Markdown**..."
      />

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button
          onClick={() => onSave(form)}
          style={{
            padding: "10px 20px",
            background: "#000776",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Sauvegarder
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: "10px 20px",
            background: "#f4f4f8",
            color: "#101114",
            border: "1px solid #dedee5",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  style,
}: {
  label: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#686b82" }}>{label}</span>
      {children}
    </label>
  );
}

function MarkdownField({
  label,
  value,
  onChange,
  rows = 12,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const [preview, setPreview] = useState(false);

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#686b82" }}>{label}</span>
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 10px",
            border: "1px solid #dedee5",
            background: preview ? "#000776" : "#fff",
            color: preview ? "#fff" : "#686b82",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          {preview ? "Éditer" : "Preview"}
        </button>
      </div>
      {preview ? (
        <div
          dangerouslySetInnerHTML={{ __html: marked.parse(value) as string }}
          style={{
            border: "1px solid #dedee5",
            borderRadius: 6,
            padding: 12,
            background: "#fafafd",
            minHeight: rows * 20,
            fontSize: 14,
            lineHeight: 1.6,
            color: "var(--m-ink-2)",
            overflow: "auto",
          }}
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: 10,
            border: "1px solid #dedee5",
            borderRadius: 6,
            fontFamily: "monospace",
            fontSize: 13,
            lineHeight: 1.5,
            resize: "vertical",
          }}
        />
      )}
    </div>
  );
}
