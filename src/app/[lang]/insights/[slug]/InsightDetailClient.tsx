"use client";

import Image from "next/image";
import Link from "next/link";
import { marked } from "marked";
import PageShell from "@/components/layout/PageShell";
import JsonLd from "@/components/JsonLd";
import { useMessages } from "@/lib/messages";
import { SITE } from "@/lib/config";
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

  const articleUrl = `${SITE.baseUrl}/${lang}/insights/${article.slug}`;
  const imageUrl = article.heroImage?.startsWith("http")
    ? article.heroImage
    : `${SITE.baseUrl}${article.heroImage}`;

  const jsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    url: articleUrl,
    datePublished: article.date,
    image: imageUrl,
    keywords: article.keywords,
    articleSection: categoryLabel,
    inLanguage: lang === "fr" ? "fr-FR" : "en-US",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.baseUrl}/images/logo/mentivis-logo.png`,
      },
    },
  };

  if (article.author) {
    jsonLd.author = {
      "@type": "Person",
      name: article.author,
    };
  }

  return (
    <PageShell>
      <JsonLd data={jsonLd} />

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
              fontWeight: 500,
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
            fontWeight: 500,
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

        {/* Article CTA */}
        <div
          style={{
            marginTop: 60,
            padding: "32px 36px",
            background: "var(--m-bg-soft)",
            borderRadius: 16,
            border: "1px solid var(--m-line)",
            textAlign: "center" as const,
          }}
        >
          <h3
            style={{
              fontFamily: "var(--f-display)",
              fontSize: "clamp(20px, 2.5vw, 26px)",
              fontWeight: 500,
              color: "var(--m-ink)",
              margin: "0 0 12px",
              lineHeight: 1.2,
            }}
          >
            {lang === "fr" ? "Vous souhaitez en savoir plus ?" : "Want to learn more?"}
          </h3>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--m-ink-3)",
              margin: "0 0 24px",
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {lang === "fr"
              ? "Discutons de vos besoins et explorez ce que Mentivis peut construire pour vous."
              : "Let's discuss your needs and explore what Mentivis can build for you."}
          </p>
          <Link
            href={`/${lang}/contact?subject=Insights`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 600,
              color: "white",
              background: "var(--m-purple)",
              borderRadius: 999,
              textDecoration: "none",
              transition: "opacity 0.25s ease",
            }}
          >
            {lang === "fr" ? "Contact et demande de démo" : "Contact and demo request"}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
