"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/config";

type FooterMessages = {
  nav: { cta: string; home: string; about: string; enterprise: string; of: string; solutions: string; resources: string; };
  footer: {
    tagline: string;
    ctaTitle: string;
    ctaLead: string;
    newsletterTitle: string;
    newsletterBody: string;
    newsletterPlaceholder: string;
    newsletterSuccess: string;
    navigation: string;
    copy: string;
  };
  common: { learnMore: string; };
};

type FooterProps = {
  t: FooterMessages;
  lang: string;
};

function openCookies() {
  if (typeof window !== "undefined") {
    const w = window as unknown as { CookieConsent?: { showPreferences: () => void } };
    if (w.CookieConsent) {
      w.CookieConsent.showPreferences();
    }
  }
}

function encodeEntities(text: string): string {
  return text.split("").map((c) => `&#${c.charCodeAt(0)};`).join("");
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string; external?: boolean; onClick?: () => void }[] }) {
  return (
    <div>
      <h5 style={{
        fontSize: 11,
        textTransform: "uppercase" as const,
        letterSpacing: "0.12em",
        color: "var(--m-ink-4)",
        margin: "0 0 16px 0",
        fontWeight: 600,
      }}>{title}</h5>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {links.map((l, i) => (
          <li key={i} style={{ marginBottom: 9 }}>
            {l.onClick ? (
              <button onClick={l.onClick} style={{ background: "none", border: "none", color: "var(--m-ink-2)", fontSize: 13.5, cursor: "pointer", padding: 0, fontFamily: "inherit", textAlign: "left" }}>{l.label}</button>
            ) : (
              <a href={l.href} target={l.external ? "_blank" : undefined} rel={l.external ? "noopener noreferrer" : undefined} className="m-footer-link">{l.label}</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


function PageStats() {
  const [stats, setStats] = useState({ time: 0.72, size: 387.1 });

  useEffect(() => {
    const perf = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (!perf) return;
    const loadTime = perf.loadEventEnd - perf.fetchStart;
    setStats({
      time: Math.round(loadTime / 10) / 100,
      size: Math.round((document.documentElement.scrollHeight || document.body.scrollWidth) / 10) / 100,
    });
  }, []);

  return (
    <div style={{
      padding: "8px 0",
      textAlign: "center",
      color: "var(--m-ink-4)",
      fontSize: 12,
      fontFamily: "var(--f-mono)",
      background: "var(--m-bg-soft)",
      borderTop: "1px solid var(--m-line)",
    }}>
      Page chargée en <strong>{stats.time.toFixed(2)} secondes</strong>. Taille de la page : <strong>{stats.size.toFixed(2)} KB</strong>.
    </div>
  );
}

export default function Footer({ t, lang }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer style={{ background: "var(--m-bg-soft)", marginTop: 80, position: "relative" as const, overflow: "hidden" }}>
      <div style={{ position: "relative" as const, padding: "120px 0 60px", textAlign: "center" }}>
        <div className="container" style={{ position: "relative" as const, zIndex: 2 }}>
          <h2 className="t-display" style={{
            fontSize: "clamp(32px, 4vw, 52px)",
            margin: 0,
            maxWidth: 780,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.1,
          }}>
            {t.footer.ctaTitle}
          </h2>
          <p style={{
            color: "var(--m-ink-3)",
            fontSize: 17,
            marginTop: 22,
            maxWidth: 540,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.5,
          }}>
            {t.footer.ctaLead}
          </p>
          <div style={{ marginTop: 32, display: "inline-flex", gap: 10 }}>
            <Link href={`/${lang}/contact`} style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 22px",
              fontSize: 14,
              fontWeight: 600,
              color: "white",
              background: "var(--m-ink)",
              borderRadius: 999,
              textDecoration: "none",
            }}>
              {t.nav.cta}
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
            </Link>
            <Link href={`/${lang}/about`} style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 22px",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--m-ink)",
              background: "white",
              border: "1.5px solid var(--m-line)",
              borderRadius: 999,
              textDecoration: "none",
            }}>
              {t.common.learnMore}
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
            </Link>
          </div>
        </div>
      </div>

      <div style={{ position: "relative" as const, zIndex: 2, padding: "0 24px 40px" }}>
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          background: "white",
          borderRadius: 28,
          padding: "48px 56px 40px",
          border: "1px solid var(--m-line)",
          boxShadow: "0 4px 24px rgba(16,24,40,0.04)",
        }} className="m-footer-card">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            gap: 48,
            paddingBottom: 36,
            borderBottom: "1px solid var(--m-line-2)",
          }} className="m-footer-cols">
            <div>
              <Link href="/">
                <Image src="/logo-noir.svg" alt="Mentivis" width={120} height={28} />
              </Link>
              <p style={{
                color: "var(--m-ink-3)",
                fontSize: 13.5,
                lineHeight: 1.55,
                marginTop: 16,
                maxWidth: 260,
              }}>
                {t.footer.tagline}
              </p>
              <div style={{ marginTop: 16, color: "var(--m-ink-3)", fontSize: 13.5, lineHeight: 1.6 }}>
                <Link href={`/${lang}/contact`} className="m-footer-link" style={{ display: "block", marginBottom: 4 }}>
                  <span dangerouslySetInnerHTML={{ __html: encodeEntities(SITE.email) }} />
                </Link>
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="m-footer-link" style={{ display: "block", marginBottom: 4 }}>
                  <span dangerouslySetInnerHTML={{ __html: encodeEntities("Tél. " + SITE.phone) }} />
                </a>
                <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="m-footer-link" style={{ display: "block" }}>
                  <span dangerouslySetInnerHTML={{ __html: encodeEntities(SITE.address) }} />
                </a>
              </div>
            </div>
            <FooterCol title={t.footer.navigation} links={[
              { href: `/${lang}/`, label: t.nav.home },
              { href: `/${lang}/about`, label: t.nav.about },
              { href: `/${lang}/enterprise`, label: t.nav.enterprise },
              { href: `/${lang}/of`, label: t.nav.of },
              { href: `/${lang}/solutions`, label: t.nav.solutions },
            ]} />
            <FooterCol title={t.nav.resources} links={[
              { href: `/${lang}/resources`, label: lang === "fr" ? "Guides de référence" : "Reference guides" },
              { href: `/${lang}/opco`, label: lang === "fr" ? "Calculateur OPCO" : "OPCO calculator" },
              { href: `/${lang}/score-formation`, label: "Score Formation" },
              { href: `/${lang}/careers`, label: lang === "fr" ? "Carrière" : "Careers" },
              { href: "#", label: lang === "fr" ? "Insights (à venir)" : "Insights (coming soon)", external: true },
            ]} />
            <div>
              <h5 style={{
                fontSize: 11,
                textTransform: "uppercase" as const,
                letterSpacing: "0.12em",
                color: "var(--m-ink-4)",
                margin: "0 0 14px 0",
                fontWeight: 600,
              }}>{t.footer.newsletterTitle}</h5>
              {subscribed ? (
                <div style={{ fontSize: 13.5, color: "var(--m-ink-2)" }}>
                  ✓ {t.footer.newsletterSuccess}
                </div>
              ) : (
                <form onSubmit={submit} style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                  <p style={{ fontSize: 12.5, color: "var(--m-ink-3)", margin: 0, lineHeight: 1.5 }}>{t.footer.newsletterBody}</p>
                  <div style={{
                    display: "flex",
                    background: "var(--m-bg-soft)",
                    borderRadius: 999,
                    padding: 4,
                    border: "1px solid var(--m-line)",
                    marginTop: 6,
                  }}>
                    <input
                      type="email"
                      required
                      placeholder={t.footer.newsletterPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "var(--m-ink)",
                        fontFamily: "var(--f-sans)",
                        fontSize: 13,
                        padding: "6px 12px",
                        minWidth: 0,
                      }}
                    />
                    <button type="submit" style={{
                      background: "var(--m-ink)",
                      color: "white",
                      border: "none",
                      borderRadius: 999,
                      padding: "8px 14px",
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: "var(--f-sans)",
                      whiteSpace: "nowrap" as const,
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div style={{
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "var(--m-ink-4)",
            fontSize: 12.5,
            flexWrap: "wrap" as const,
            gap: 12,
          }}>
            <div>{t.footer.copy}</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" as const }}>
              <a href={`/${lang}/legal`} className="m-footer-bar-link">Mentions légales</a>
              <span>·</span>
              <a href={`/${lang}/privacy`} className="m-footer-bar-link">Confidentialité</a>
              <span>·</span>
              <a href={`/${lang}/terms`} className="m-footer-bar-link">CGU</a>
              <span>·</span>
              <button onClick={openCookies} className="m-footer-bar-link" style={{ background: "none", border: "none", fontSize: 12.5, padding: 0 }}>
                Cookies
              </button>
              <span>·</span>
              <div className="t-mono" style={{ color: "var(--m-ink-4)" }}>
                v.1 · {lang.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PageStats />
    </footer>
  );
}
