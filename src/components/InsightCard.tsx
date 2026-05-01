"use client";

import Image from "next/image";
import Link from "next/link";
import { CATEGORY_LABELS, type InsightArticle } from "@/data/insights";

export default function InsightCard({
  article,
  lang,
  variant = "list",
}: {
  article: InsightArticle;
  lang: string;
  variant?: "list" | "grid";
}) {
  const d = new Date(article.date);
  const dateStr = d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const title = lang === "fr" ? article.titleFr : article.titleEn || article.titleFr;
  const excerpt = lang === "fr" ? article.excerptFr : article.excerptEn || article.excerptFr;
  const categoryLabel = CATEGORY_LABELS[article.category][lang as "fr" | "en"];

  if (variant === "grid") {
    return (
      <Link
        href={`/${lang}/insights/${article.slug}`}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          textDecoration: "none",
          color: "inherit",
        }}
        className="insight-card"
      >
        {/* Image */}
        <div
          className="m-insight-img-wrap"
          style={{
            position: "relative",
            overflow: "hidden",
            background: "var(--m-line-2)",
            aspectRatio: "16/9",
            borderRadius: 8,
            flexShrink: 0,
          }}
        >
          <Image
            src={article.heroImage}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 720px) 100vw, 33vw"
          />
        </div>

        {/* Meta */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            <CategoryBadge label={categoryLabel} />
            <span style={{ fontSize: 12, color: "var(--m-ink-3)" }}>{dateStr}</span>
          </div>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 600,
              lineHeight: 1.3,
              color: "var(--m-ink)",
              margin: 0,
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontSize: 14,
              color: "var(--m-ink-2)",
              lineHeight: 1.6,
              margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {excerpt}
          </p>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 13,
              fontWeight: 600,
              color: "var(--m-ink)",
              marginTop: 4,
              width: "fit-content",
              transition: "color 0.2s ease",
            }}
            className="insight-read-btn"
          >
            {lang === "fr" ? "Lire" : "Read"}
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              chevron_right
            </span>
          </span>
        </div>
      </Link>
    );
  }

  /* variant === "list" */
  return (
    <Link
      href={`/${lang}/insights/${article.slug}`}
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        gap: 28,
        padding: "32px 0",
        borderBottom: "1px solid var(--m-line-2)",
        textDecoration: "none",
        color: "inherit",
        alignItems: "flex-start",
      }}
      className="insight-card"
    >
      {/* Image */}
      <div
        className="m-insight-img-wrap"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "var(--m-line-2)",
          aspectRatio: "16/9",
          flexShrink: 0,
          borderRadius: 8,
        }}
      >
        <Image
          src={article.heroImage}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          sizes="260px"
        />
      </div>

      {/* Meta */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 2 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          <CategoryBadge label={categoryLabel} />
          <span style={{ fontSize: 12, color: "var(--m-ink-3)" }}>{dateStr}</span>
        </div>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            lineHeight: 1.3,
            color: "var(--m-ink)",
            margin: 0,
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "var(--m-ink-2)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {excerpt}
        </p>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 13,
            fontWeight: 600,
            color: "var(--m-ink)",
            marginTop: 4,
            width: "fit-content",
            transition: "color 0.2s ease",
          }}
          className="insight-read-btn"
        >
          {lang === "fr" ? "Lire" : "Read"}
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            chevron_right
          </span>
        </span>
      </div>
    </Link>
  );
}

export function CategoryBadge({ label }: { label: string }) {
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 500,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: "var(--m-ink-3)",
        background: "var(--m-surface-2)",
        padding: "3px 8px",
        border: "1px solid var(--m-line-2)",
        borderRadius: 4,
      }}
    >
      {label}
    </span>
  );
}
