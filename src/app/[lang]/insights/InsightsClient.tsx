"use client";

import { useState, useMemo, useEffect } from "react";
import PageShell from "@/components/layout/PageShell";
import Reveal from "@/components/Reveal";
import { useMessages } from "@/lib/messages";
import {
  INSIGHTS_META,
  CATEGORY_LABELS,
  type InsightCategory,
} from "@/data/insights-meta";
import InsightCard from "@/components/InsightCard";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { SITE } from "@/lib/config";

const PER_PAGE = 15;

export default function InsightsClient() {
  const { t, lang } = useMessages();
  const i = t.insights;

  const [activeCategory, setActiveCategory] = useState<InsightCategory | "">("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const set = new Set<InsightCategory>();
    INSIGHTS_META.forEach((a) => set.add(a.category));
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => {
    let list = activeCategory
      ? INSIGHTS_META.filter((a) => a.category === activeCategory)
      : [...INSIGHTS_META];
    list.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });
    return list;
  }, [activeCategory, sortOrder]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => {
    if (page > 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

  const handleCategoryChange = (cat: InsightCategory | "") => {
    setActiveCategory(cat);
    setPage(1);
  };

  const handleSortChange = (order: "newest" | "oldest") => {
    setSortOrder(order);
    setPage(1);
  };

  return (
    <PageShell>
      <BreadcrumbJsonLd items={[
        { name: lang === "fr" ? "Accueil" : "Home", url: `${SITE.baseUrl}/${lang}/` },
        { name: lang === "fr" ? "Insights" : "Insights" }
      ]} />
      <section
        style={{
          padding: "120px 24px 40px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <Reveal>
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
            {i.eyebrow}
          </div>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 500,
              lineHeight: 1.12,
              color: "var(--m-ink)",
              margin: 0,
            }}
          >
            {i.title}
          </h1>
        </Reveal>
      </section>

      {/* Filters */}
      <section
        style={{
          padding: "0 24px 24px",
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Reveal delay={60}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <FilterPill
              label={i.filterAll}
              active={activeCategory === ""}
              onClick={() => handleCategoryChange("")}
            />
            {categories.map((cat) => (
              <FilterPill
                key={cat}
                label={CATEGORY_LABELS[cat][lang as "fr" | "en"]}
                active={activeCategory === cat}
                onClick={() => handleCategoryChange(cat)}
              />
            ))}
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div style={{ display: "flex", gap: 8 }}>
            <SortPill
              label={i.filterNewest}
              active={sortOrder === "newest"}
              onClick={() => handleSortChange("newest")}
            />
            <SortPill
              label={i.filterOldest}
              active={sortOrder === "oldest"}
              onClick={() => handleSortChange("oldest")}
            />
          </div>
        </Reveal>
      </section>

      {/* Count */}
      <section
        style={{
          padding: "0 24px 16px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <Reveal delay={100}>
          <span style={{ fontSize: 13, color: "var(--m-ink-3)" }}>
            {filtered.length} {lang === "fr" ? "articles" : "articles"}
          </span>
        </Reveal>
      </section>

      {/* Article list */}
      <section
        style={{
          padding: "0 24px 40px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {paginated.length === 0 ? (
          <Reveal>
            <p style={{ color: "var(--m-ink-3)", fontSize: 15 }}>
              {i.noArticles}
            </p>
          </Reveal>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {paginated.map((article, idx) => (
              <Reveal key={article.slug} delay={idx * 60}>
                <InsightCard article={article} lang={lang} variant="list" />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section
          style={{
            padding: "0 24px 100px",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span
                style={{
                  fontSize: 13,
                  color: "var(--m-ink-3)",
                  marginRight: 8,
                }}
              >
                {lang === "fr" ? "Pages" : "Pages"}
              </span>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    fontSize: 14,
                    fontWeight: p === page ? 700 : 500,
                    padding: "6px 12px",
                    border: "none",
                    background: "transparent",
                    color: p === page ? "var(--m-ink)" : "var(--m-ink-3)",
                    cursor: "pointer",
                    textDecoration: p === page ? "underline" : "none",
                    textUnderlineOffset: 4,
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </Reveal>
        </section>
      )}
    </PageShell>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding: "7px 14px",
        borderRadius: 100,
        border: active ? "1px solid var(--m-ink)" : "1px solid var(--m-line-2)",
        background: active ? "var(--m-ink)" : "var(--m-surface-2)",
        color: active ? "#fff" : "var(--m-ink-2)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "var(--m-ink)";
          e.currentTarget.style.color = "var(--m-ink)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "var(--m-line-2)";
          e.currentTarget.style.color = "var(--m-ink-2)";
        }
      }}
    >
      {label}
    </button>
  );
}

function SortPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        padding: "6px 12px",
        borderRadius: 6,
        border: "1px solid transparent",
        background: "transparent",
        color: active ? "var(--m-ink)" : "var(--m-ink-3)",
        cursor: "pointer",
        textDecoration: active ? "underline" : "none",
        textUnderlineOffset: 4,
      }}
    >
      {label}
    </button>
  );
}


