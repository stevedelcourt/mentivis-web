"use client";

import Image from "next/image";
import Link from "next/link";
import { marked } from "marked";
import PageShell from "@/components/layout/PageShell";
import { useMessages } from "@/lib/messages";
import { CATEGORY_LABELS, type InsightArticle } from "@/data/insights";

export default function InsightDetailClient({
  article,
}: {
  article: InsightArticle;
}) {
  const { t, lang } = useMessages();

  const title =
    lang === "fr" ? article.titleFr : article.titleEn || article.titleFr;
  const body =
    lang === "fr" ? article.bodyFr : article.bodyEn || article.bodyFr;
  const excerpt =
    lang === "fr" ? article.excerptFr : article.excerptEn || article.excerptFr;
  const categoryLabel =
    CATEGORY_LABELS[article.category][lang as "fr" | "en"];

  const d = new Date(article.date);
  const dateStr = d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    datePublished: article.date,
    author: article.author
      ? { "@type": "Person", name: article.author }
      : undefined,
    image: article.heroImage,
    keywords: article.keywords,
    articleSection: categoryLabel,
    inLanguage: lang === "fr" ? "fr-FR" : "en-US",
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article
        style={{ maxWidth: 780, margin: "0 auto", padding: "120px 24px 100px" }}
      >
        {/* Back link */}
        <Link
          href={`/${lang}/insights`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "var(--m-ink-3)",
            textDecoration: "none",
            marginBottom: 32,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M9 5H1M5 9L1 5l4-4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t.insights.backToList}
        </Link>

        {/* Category + date */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#fff",
              background: "var(--m-ink)",
              padding: "4px 10px",
              borderRadius: 4,
            }}
          >
            {categoryLabel}
          </span>
          <span style={{ fontSize: 13, color: "var(--m-ink-3)" }}>
            {dateStr}
            {article.readTime ? ` \u00b7 ${article.readTime}` : ""}
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "clamp(28px, 4.5vw, 42px)",
            fontWeight: 700,
            lineHeight: 1.15,
            color: "var(--m-ink)",
            margin: "0 0 8px",
          }}
        >
          {title}
        </h1>

        {/* Author under headline */}
        {article.author && (
          <p
            style={{
              fontSize: 15,
              color: "var(--m-ink-3)",
              margin: "0 0 28px",
              fontStyle: "italic",
            }}
          >
            {lang === "fr" ? "Par" : "By"} {article.author}
          </p>
        )}

        {/* Hero image */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            borderRadius: 12,
            overflow: "hidden",
            background: "var(--m-line-2)",
            marginBottom: 40,
          }}
        >
          <Image
            src={article.heroImage}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 780px) 100vw, 780px"
            priority
          />
        </div>

        {/* Body */}
        <div
          className="insight-body"
          dangerouslySetInnerHTML={{ __html: marked.parse(body) as string }}
          style={{
            fontSize: 16,
            lineHeight: 1.7,
            color: "var(--m-ink-2)",
          }}
        />
      </article>
    </PageShell>
  );
}
