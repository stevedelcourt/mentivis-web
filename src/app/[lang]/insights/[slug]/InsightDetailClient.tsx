"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { marked } from "marked";
import PageShell from "@/components/layout/PageShell";
import JsonLd from "@/components/JsonLd";
import { useMessages } from "@/lib/messages";
import { useHubSpotSubmit } from "@/lib/hubspot";
import Icon from "@/components/ui/Icon";
import { SITE } from "@/lib/config";
import { CATEGORY_LABELS, type InsightArticle } from "@/data/insights";

function DownloadModal({
  open,
  onClose,
  onSuccess,
  t,
  lang,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  t: any;
  lang: string;
}) {
  const { submit, loading, success, error } = useHubSpotSubmit();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    if (open) {
      setFirstname("");
      setLastname("");
      setEmail("");
      setPhone("");
      setCompany("");
      setConsent(false);
      setHoneypot("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    if (!consent) return;

    const ok = await submit(
      {
        firstname,
        lastname,
        email,
        phone,
        company,
      },
      {
        pageUri: typeof window !== "undefined" ? window.location.href : "",
        pageName: "Étude IA et transformation de l'éducation",
      }
    );

    if (ok) {
      onSuccess();
      if (typeof window !== "undefined" && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: "form_submit_success",
          form_name: "insight_pdf",
          form_language: lang,
        });
      }
    }
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(16,17,20,0.55)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        className="m-guide-modal"
        style={{
          background: "white",
          borderRadius: 20,
          padding: "36px 32px 32px",
          width: "100%",
          maxWidth: 460,
          boxShadow: "0 20px 60px rgba(16,24,40,0.18)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            color: "var(--m-ink-3)",
          }}
          aria-label="Close"
        >
          <Icon name="close" size={22} />
        </button>

        {success ? (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#e8f5e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <Icon name="check" size={28} style={{ color: "#2e7d32" }} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 10px", color: "var(--m-ink)" }}>
              {t.insights.pdfModalSuccessTitle}
            </h3>
            <p style={{ color: "var(--m-ink-3)", fontSize: 15, lineHeight: 1.5, margin: 0 }}>
              {t.insights.pdfModalSuccessBody}
            </p>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 6px", color: "var(--m-ink)" }}>
              {t.insights.pdfModalTitle}
            </h3>
            <p style={{ color: "var(--m-ink-3)", fontSize: 14, lineHeight: 1.5, margin: "0 0 22px" }}>
              {t.insights.pdfModalSub}
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="m-guide-modal-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <input
                  type="text"
                  placeholder={t.guides.firstname}
                  required
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  style={{
                    padding: "11px 14px",
                    borderRadius: 10,
                    border: "1.5px solid var(--m-line)",
                    fontSize: 14,
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                />
                <input
                  type="text"
                  placeholder={t.guides.lastname}
                  required
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  style={{
                    padding: "11px 14px",
                    borderRadius: 10,
                    border: "1.5px solid var(--m-line)",
                    fontSize: 14,
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                />
              </div>
              <input
                type="email"
                placeholder={t.guides.email}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1.5px solid var(--m-line)",
                  fontSize: 14,
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
              <input
                type="tel"
                placeholder={t.guides.phone}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1.5px solid var(--m-line)",
                  fontSize: 14,
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
              <input
                type="text"
                placeholder={t.guides.company}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={{
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1.5px solid var(--m-line)",
                  fontSize: 14,
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ position: "absolute", opacity: 0, pointerEvents: "none", height: 0 }}
              />
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "var(--m-ink-3)", lineHeight: 1.45, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={{ marginTop: 2, flexShrink: 0 }}
                />
                <span>
                  {t.insights.pdfConsent}{" "}
                  <Link href={`/${lang}/privacy`} style={{ color: "var(--m-purple)", textDecoration: "underline" }}>
                    {t.insights.pdfConsentLink}
                  </Link>
                </span>
              </label>
              {error && (
                <p style={{ color: "#c62828", fontSize: 13, margin: 0 }}>{error}</p>
              )}
              <button
                type="submit"
                disabled={loading || !consent}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "12px 22px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "white",
                  background: loading || !consent ? "var(--m-ink-4)" : "var(--m-purple)",
                  borderRadius: 12,
                  border: "none",
                  cursor: loading || !consent ? "not-allowed" : "pointer",
                  transition: "opacity 0.2s",
                  fontFamily: "inherit",
                  marginTop: 4,
                }}
              >
                {loading ? t.insights.pdfSubmitting : t.insights.pdfSubmit}
                {!loading && (
                  <Icon name="chevron_right" size={18} />
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function InsightDetailClient({
  article,
}: {
  article: InsightArticle;
}) {
  const { t, lang } = useMessages();

  const [modalOpen, setModalOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const storageKey = `insight_pdf_unlocked_${article.slug}`;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUnlocked(sessionStorage.getItem(storageKey) === "1");
    }
  }, [storageKey]);

  const handleUnlock = useCallback(() => {
    sessionStorage.setItem(storageKey, "1");
    setUnlocked(true);
  }, [storageKey]);

  const title =
    lang === "fr" ? article.titleFr : article.titleEn || article.titleFr;
  const body =
    lang === "fr" ? article.bodyFr : article.bodyEn || article.bodyFr;
  const excerpt =
    lang === "fr" ? article.excerptFr : article.excerptEn || article.excerptFr;
  const pdfTitle =
    lang === "fr"
      ? article.pdfTitleFr
      : article.pdfTitleEn || article.pdfTitleFr;
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

        {/* PDF download (end of article) */}
        {article.pdfPath && (
          <div
            id="insight-pdf-download"
            style={{
              marginTop: 60,
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              gap: 0,
              background: "white",
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid var(--m-line)",
              boxShadow: "0 4px 20px rgba(16,24,40,0.04)",
            }}
            className="m-guide-card"
          >
            <div
              style={{
                position: "relative",
                aspectRatio: "3 / 4",
                overflow: "hidden",
              }}
              className="m-guide-img"
            >
              {article.pdfImage ? (
                <Image
                  src={article.pdfImage}
                  alt={pdfTitle || title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="200px"
                />
              ) : (
                <Image
                  src={article.heroImage}
                  alt={pdfTitle || title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="200px"
                />
              )}
            </div>
            <div
              style={{
                padding: "28px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--m-ink-4)",
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                {t.insights.pdfEyebrow}
              </span>
              <h3
                style={{
                  fontSize: "clamp(18px, 2.5vw, 24px)",
                  fontWeight: 500,
                  color: "var(--m-ink)",
                  margin: "0 0 10px",
                  lineHeight: 1.25,
                }}
              >
                {pdfTitle}
              </h3>
              <p
                style={{
                  color: "var(--m-ink-3)",
                  fontSize: 14,
                  lineHeight: 1.55,
                  margin: "0 0 20px",
                }}
              >
                {t.insights.pdfSub}
              </p>
              {unlocked ? (
                <a
                  href={article.pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "11px 20px",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "white",
                    background: "var(--m-purple)",
                    borderRadius: 12,
                    textDecoration: "none",
                    width: "fit-content",
                    transition: "opacity 0.2s",
                  }}
                >
                  {t.insights.pdfDownload}
                  <Icon name="download" size={16} />
                </a>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <button
                      onClick={() => setModalOpen(true)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "11px 20px",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--m-ink)",
                        background: "var(--m-bg-soft)",
                        border: "1.5px solid var(--m-line)",
                        borderRadius: 12,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "opacity 0.2s",
                      }}
                    >
                      <Icon name="lock" size={16} />
                      {t.insights.pdfUnlock}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

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
              borderRadius: 12,
              textDecoration: "none",
              transition: "opacity 0.25s ease",
            }}
          >
            {lang === "fr" ? "Contact" : "Contact"}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        </article>

      <DownloadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleUnlock}
        t={t}
        lang={lang}
      />
    </PageShell>
  );
}
