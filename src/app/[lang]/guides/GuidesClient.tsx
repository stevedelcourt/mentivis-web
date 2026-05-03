"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Reveal from "@/components/Reveal";
import { useMessages } from "@/lib/messages";
import { useHubSpotSubmit } from "@/lib/hubspot";
import Icon from "@/components/ui/Icon";

const GUIDES = [
  {
    id: "bpf",
    titleKey: "bpfTitle",
    descKey: "bpfDesc",
    pagesKey: "bpfPages",
    image: "/guide-images/bpf.avif",
    pdf: "/guide-pdf/BPF-guide.pdf",
  },
  {
    id: "fse",
    titleKey: "fseTitle",
    descKey: "fseDesc",
    pagesKey: "fsePages",
    image: "/guide-images/fse.avif",
    pdf: "/guide-pdf/FSEguide.pdf",
  },
  {
    id: "poei",
    titleKey: "poeiTitle",
    descKey: "poeiDesc",
    pagesKey: "poeiPages",
    image: "/guide-images/poei.avif",
    pdf: "/guide-pdf/POEI-guide.pdf",
  },
  {
    id: "cpf",
    titleKey: "cpfTitle",
    descKey: "cpfDesc",
    pagesKey: "cpfPages",
    image: "/guide-images/cpf.avif",
    pdf: "/guide-pdf/CPF-guide.pdf",
  },
  {
    id: "conventions",
    titleKey: "conventionsTitle",
    descKey: "conventionsDesc",
    pagesKey: "conventionsPages",
    image: "/guide-images/conventions.avif",
    pdf: "/guide-pdf/Convention-de-Formation-guide.pdf",
  },
  {
    id: "taxe",
    titleKey: "taxeTitle",
    descKey: "taxeDesc",
    pagesKey: "taxePages",
    image: "/guide-images/taxe.avif",
    pdf: "/guide-pdf/Taxe-dapprentissage-guide.pdf",
  },
];

const STORAGE_KEY = "guides_unlocked";

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
        pageName: "Guides de référence Mentivis",
      }
    );

    if (ok) {
      onSuccess();
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
              {t.guides.modalSuccessTitle}
            </h3>
            <p style={{ color: "var(--m-ink-3)", fontSize: 15, lineHeight: 1.5, margin: 0 }}>
              {t.guides.modalSuccessBody}
            </p>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 6px", color: "var(--m-ink)" }}>
              {t.guides.modalTitle}
            </h3>
            <p style={{ color: "var(--m-ink-3)", fontSize: 14, lineHeight: 1.5, margin: "0 0 22px" }}>
              {t.guides.modalSub}
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
              {/* honeypot */}
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
                  {t.guides.conent}{" "}
                  <Link href={`/${lang}/privacy`} style={{ color: "var(--m-purple)", textDecoration: "underline" }}>
                    {t.guides.consentLink}
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
                  borderRadius: 999,
                  border: "none",
                  cursor: loading || !consent ? "not-allowed" : "pointer",
                  transition: "opacity 0.2s",
                  fontFamily: "inherit",
                  marginTop: 4,
                }}
              >
                {loading ? t.guides.submitting : t.guides.submit}
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

function GuideCard({
  guide,
  index,
  unlocked,
  onDownload,
  t,
}: {
  guide: (typeof GUIDES)[number];
  index: number;
  unlocked: boolean;
  onDownload: () => void;
  t: any;
}) {
  const isEven = index % 2 === 0;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 0,
        background: "white",
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid var(--m-line)",
        boxShadow: "0 4px 20px rgba(16,24,40,0.04)",
      }}
      className="m-guide-card"
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          aspectRatio: "1 / 1",
          overflow: "hidden",
          order: isEven ? 0 : 1,
        }}
        className="m-guide-img"
      >
        <Image
          src={guide.image}
          alt={t.guides[guide.titleKey]}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 900px) 100vw, 50vw"
        />
      </div>

      {/* Content */}
      <div
        style={{
          padding: "36px 32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          order: isEven ? 1 : 0,
        }}
        className="m-guide-body"
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
          {t.guides.guideLabel}
        </span>
        <h3
          style={{
            fontSize: "clamp(20px, 2.5vw, 26px)",
            fontWeight: 500,
            color: "var(--m-ink)",
            margin: "0 0 12px",
            lineHeight: 1.2,
          }}
        >
          {t.guides[guide.titleKey]}
        </h3>
        <p
          style={{
            color: "var(--m-ink-3)",
            fontSize: 15,
            lineHeight: 1.55,
            margin: "0 0 20px",
          }}
        >
          {t.guides[guide.descKey]}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: "auto",
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: "var(--m-ink-4)",
              fontWeight: 500,
            }}
          >
            {t.guides[guide.pagesKey]}
          </span>
          {unlocked ? (
            <a
              href={guide.pdf}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 18px",
                fontSize: 13,
                fontWeight: 600,
                color: "white",
                background: "var(--m-purple)",
                borderRadius: 999,
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
            >
              {t.guides.download}
              <Icon name="download" size={16} />
            </a>
          ) : (
            <button
              onClick={onDownload}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 18px",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--m-ink)",
                background: "var(--m-bg-soft)",
                border: "1.5px solid var(--m-line)",
                borderRadius: 999,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "opacity 0.2s",
              }}
            >
              <Icon name="lock" size={16} />
              {t.guides.downloadLocked}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GuidesClient() {
  const { t, lang } = useMessages();
  const [modalOpen, setModalOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUnlocked(sessionStorage.getItem(STORAGE_KEY) === "1");
    }
  }, []);

  const handleUnlock = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setUnlocked(true);
  }, []);

  return (
    <PageShell>
      {/* Hero */}
      <section style={{ paddingTop: 140, paddingBottom: 60 }}>
        <div className="container" style={{ maxWidth: 800, textAlign: "center" }}>
          <Reveal>
            <span
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "var(--m-ink-4)",
                fontWeight: 600,
              }}
            >
              {t.guides.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1
              className="t-display"
              style={{
                fontSize: "clamp(36px, 5vw, 56px)",
                margin: "14px 0 16px",
                lineHeight: 1.1,
              }}
            >
              {t.guides.title}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              style={{
                color: "var(--m-ink-3)",
                fontSize: 18,
                lineHeight: 1.55,
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              {t.guides.lead}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Guides Grid */}
      <section style={{ paddingBottom: 80 }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 32,
            }}
          >
            {GUIDES.map((guide, i) => (
              <Reveal key={guide.id} delay={i * 0.06}>
                <GuideCard
                  guide={guide}
                  index={i}
                  unlocked={unlocked}
                  onDownload={() => setModalOpen(true)}
                  t={t}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-link teasers */}
      <section style={{ padding: "60px 0 100px", background: "var(--m-bg-soft)" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 24,
              maxWidth: 560,
              margin: "0 auto",
            }}
            className="m-guide-teasers"
          >
            {/* Score Formation teaser */}
            <Reveal delay={0.06}>
              <Link
                href={`/${lang}/score-formation`}
                style={{
                  display: "block",
                  background: "white",
                  borderRadius: 20,
                  padding: "32px",
                  border: "1px solid var(--m-line)",
                  textDecoration: "none",
                }}
                className="m-guide-teaser-card"
              >
                <span
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "var(--m-ink-4)",
                    fontWeight: 600,
                  }}
                >
                  {t.guides.teaserScoreEyebrow}
                </span>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    color: "var(--m-ink)",
                    margin: "10px 0 8px",
                    lineHeight: 1.2,
                  }}
                >
                  {t.guides.teaserScoreTitle}
                </h3>
                <p
                  style={{
                    color: "var(--m-ink-3)",
                    fontSize: 14,
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {t.guides.teaserScoreBody}
                </p>
                <div
                  style={{
                    marginTop: 18,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--m-purple)",
                  }}
                >
                  {t.guides.teaserCta}
                  <Icon name="chevron_right" size={16} />
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

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
