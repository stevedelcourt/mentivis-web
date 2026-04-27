"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

type FooterMessages = {
  nav: { cta: string; home: string; about: string; enterprise: string; of: string; solutions: string; };
  footer: {
    tagline: string;
    newsletterTitle: string;
    newsletterBody: string;
    newsletterPlaceholder: string;
    newsletterCta: string;
    newsletterSuccess: string;
    navigation: string;
    offer: string;
    legal: string;
    contact: string;
    legalLinks: string[];
    copy: string;
  };
  common: { learnMore: string; };
};

type FooterProps = {
  t: FooterMessages;
  lang: string;
};

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
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
            <a href={l.href} style={{ color: "var(--m-ink-2)", fontSize: 13.5, transition: "color 0.18s" }}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterAbstractShapes() {
  return (
    <div aria-hidden="true" style={{
      position: "absolute" as const,
      inset: 0,
      pointerEvents: "none" as const,
      overflow: "hidden",
    }}>
      <svg style={{ position: "absolute" as const, left: "50%", top: "10%", transform: "translateX(-50%)", width: 720, height: 720, opacity: 0.7 }} viewBox="0 0 400 400">
        <defs>
          <radialGradient id="ftr-r" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#dfe4f7" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#eef0f8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#fafafd" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="200" fill="url(#ftr-r)" />
      </svg>
      <svg style={{ position: "absolute" as const, left: "6%", bottom: "0%", width: 240, height: 200 }} viewBox="0 0 240 200" fill="none">
        <defs>
          <linearGradient id="rib-l" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff7a59" />
            <stop offset="100%" stopColor="#c1452f" />
          </linearGradient>
        </defs>
        <path d="M20 140 Q 60 60, 140 80 T 220 50 L 220 200 L 20 200 Z" fill="url(#rib-l)" opacity="0.9" />
        <ellipse cx="60" cy="160" rx="50" ry="20" fill="#ff7a59" opacity="0.7" />
      </svg>
      <svg style={{ position: "absolute" as const, right: "5%", bottom: "0%", width: 280, height: 230 }} viewBox="0 0 280 230" fill="none">
        <defs>
          <linearGradient id="td-r" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6b73d6" />
            <stop offset="100%" stopColor="#000776" />
          </linearGradient>
          <linearGradient id="td-r2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a8b1e6" />
            <stop offset="100%" stopColor="#6b73d6" />
          </linearGradient>
        </defs>
        <path d="M 30 180 Q 80 90, 200 60 Q 260 50, 270 140 Q 250 210, 130 220 Q 50 220, 30 180 Z" fill="url(#td-r)" opacity="0.85" />
        <ellipse cx="100" cy="100" rx="70" ry="30" transform="rotate(-25 100 100)" fill="url(#td-r2)" opacity="0.6" />
      </svg>
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
        <FooterAbstractShapes />
        <div className="container" style={{ position: "relative" as const, zIndex: 2 }}>
          <h2 className="t-display" style={{
            fontSize: "clamp(40px, 5.5vw, 68px)",
            margin: 0,
            maxWidth: 780,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.05,
          }}>
            {lang === "fr" ? "Démarrer un projet avec Mentivis" : "Start a project with Mentivis"}
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
            {lang === "fr"
              ? "Premier échange gratuit, sans engagement. Nous écoutons, puis nous vous disons honnêtement si nous sommes les bons interlocuteurs."
              : "First conversation is free, no commitment. We listen, then tell you honestly whether we're the right fit."}
          </p>
          <div style={{ marginTop: 32, display: "inline-flex", gap: 10 }}>
            <Link href={`/${lang}/contact`} style={{
              padding: "12px 22px",
              fontSize: 14,
              fontWeight: 600,
              color: "white",
              background: "var(--m-ink)",
              borderRadius: 999,
              transition: "background 0.15s",
            }}>
              {t.nav.cta} →
            </Link>
            <Link href={`/${lang}/about`} style={{
              padding: "12px 22px",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--m-ink)",
              background: "white",
              border: "1px solid var(--m-line)",
              borderRadius: 999,
              transition: "border-color 0.15s",
            }}>
              {t.common.learnMore}
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
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1.2fr",
            gap: 48,
            paddingBottom: 36,
            borderBottom: "1px solid var(--m-line-2)",
          }} className="m-footer-cols">
            <div>
              <Logo size={22} />
              <p style={{
                color: "var(--m-ink-3)",
                fontSize: 13.5,
                lineHeight: 1.55,
                marginTop: 16,
                maxWidth: 260,
              }}>
                {t.footer.tagline}
              </p>
            </div>
            <FooterCol title={t.footer.navigation} links={[
              { href: `/${lang}/`, label: t.nav.home },
              { href: `/${lang}/about`, label: t.nav.about },
              { href: `/${lang}/enterprise`, label: t.nav.enterprise },
              { href: `/${lang}/of`, label: t.nav.of },
              { href: `/${lang}/solutions`, label: t.nav.solutions },
            ]} />
            <FooterCol title={t.footer.contact} links={[
              { href: "mailto:contact@mentivis.com", label: "contact@mentivis.com" },
              { href: "tel:+33189481002", label: "+33 1 89 48 10 02" },
              { href: "#", label: "Paris · France" },
              { href: "#", label: "LinkedIn ↗" },
            ]} />
            <FooterCol title={t.footer.legal} links={t.footer.legalLinks.map((l) => l.toLowerCase() === 'cookies' ? { href: "#", label: l, onClick: () => { if (typeof window !== 'undefined' && (window as any).CookieConsent) { (window as any).CookieConsent.showPreferences(); } } } : { href: "#", label: l })} />
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
                      →
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
            <div className="t-mono" style={{ color: "var(--m-ink-4)" }}>
              v.1 · {lang.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        textAlign: "center",
        padding: "0 24px 24px",
        position: "relative" as const,
        zIndex: 1,
      }}>
        <div style={{
          fontFamily: "var(--f-display)",
          fontWeight: 700,
          fontSize: "clamp(80px, 18vw, 260px)",
          letterSpacing: "-0.04em",
          lineHeight: 0.85,
          color: "var(--m-ink)",
          opacity: 0.92,
          userSelect: "none" as const,
          display: "inline-flex",
          alignItems: "baseline",
          gap: "0.04em",
        }}>
          mentivis<span style={{ color: "var(--m-purple)" }}>.</span>
        </div>
      </div>
    </footer>
  );
}