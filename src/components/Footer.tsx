"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/config";
import { encodeEntities } from "@/lib/utils";

type FooterMessages = {
  nav: { cta: string; home: string; about: string; enterprise: string; of: string; solutions: string; resources: string; corporate: string; };
  footer: {
    tagline: string;
    ctaTitle: string;
    ctaLead: string;
    navigation: string;
    copy: string;
  };
  common: { learnMore: string };
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

function FooterCol({ title, links }: { title: string; links: { href: string; label: string; external?: boolean; onClick?: () => void }[] }) {
  return (
    <div>
      <h5 style={{
        fontSize: 11,
        textTransform: "uppercase" as const,
        letterSpacing: "0.12em",
        color: "rgba(255,255,255,0.5)",
        margin: "0 0 16px 0",
        fontWeight: 600,
      }}>{title}</h5>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {links.map((l, i) => (
          <li key={i} style={{ marginBottom: 9 }}>
            {l.onClick ? (
              <button onClick={l.onClick} className="m-footer-link-dark" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit", textAlign: "left", display: "inline-flex", alignItems: "center", position: "relative", color: "rgba(255,255,255,0.85)" }}>
                <span className="material-symbols-outlined m-footer-chevron-dark" style={{ position: "absolute", left: -16, top: "50%", transform: "translateY(-50%)", fontSize: 13 }}>chevron_right</span>
                {l.label}
              </button>
            ) : (
              <a href={l.href} target={l.external ? "_blank" : undefined} rel={l.external ? "noopener noreferrer" : undefined} className="m-footer-link-dark" style={{ display: "inline-flex", alignItems: "center", position: "relative", color: "rgba(255,255,255,0.85)" }}>
                <span className="material-symbols-outlined m-footer-chevron-dark" style={{ position: "absolute", left: -16, top: "50%", transform: "translateY(-50%)", fontSize: 13 }}>chevron_right</span>
                {l.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PageStats() {
  const [stats, setStats] = useState({ time: 0.72 });

  useEffect(() => {
    const perf = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (!perf) return;
    const loadTime = perf.loadEventEnd - perf.fetchStart;
    setStats({
      time: Math.round(loadTime / 10) / 100,
    });
  }, []);

  return (
    <div style={{
      padding: "10px 0",
      textAlign: "center",
      color: "var(--m-ink-4)",
      fontSize: 12,
      fontFamily: "var(--f-mono)",
      background: "#ffffff",
      borderTop: "1px solid var(--m-line)",
    }}>
      Page chargée en <strong>{stats.time.toFixed(2)} secondes</strong>.
    </div>
  );
}

export default function Footer({ t, lang }: FooterProps) {
  return (
    <footer style={{ background: "#fafafd", marginTop: 0, position: "relative" as const, overflow: "hidden", padding: "24px 24px 0" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          borderRadius: 28,
          overflow: "hidden",
        }}
        className="m-footer-gradient-bg"
      >
        <div style={{ position: "relative" as const, zIndex: 2, padding: "48px 56px 40px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            gap: 40,
            paddingBottom: 36,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }} className="m-footer-cols">
            <div>
              <Link href={`/${lang}/`}>
                <Image src="/logo-noir.svg" alt="Mentivis" width={120} height={28} style={{ filter: "invert(1) brightness(100)" }} />
              </Link>
              <p style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: 13.5,
                lineHeight: 1.55,
                marginTop: 16,
                maxWidth: 260,
              }}>
                {t.footer.tagline}
              </p>
              <div style={{ marginTop: 16, color: "rgba(255,255,255,0.65)", fontSize: 13.5, lineHeight: 1.6 }}>
                <Link href={`/${lang}/contact`} className="m-footer-link-dark" style={{ display: "block", marginBottom: 4, color: "rgba(255,255,255,0.85)" }}>
                  <span dangerouslySetInnerHTML={{ __html: encodeEntities(SITE.email) }} />
                </Link>
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="m-footer-link-dark" style={{ display: "block", marginBottom: 4, color: "rgba(255,255,255,0.85)" }}>
                  <span dangerouslySetInnerHTML={{ __html: encodeEntities("Tél. " + SITE.phone) }} />
                </a>
                <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="m-footer-link-dark" style={{ display: "block", color: "rgba(255,255,255,0.85)" }}>
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
              { href: `/${lang}/guides`, label: lang === "fr" ? "Guides de référence" : "Reference guides" },
              { href: `/${lang}/score-formation`, label: "Score Formation" },
              { href: "#", label: lang === "fr" ? "Insights (à venir)" : "Insights (coming soon)", external: true },
            ]} />
            <FooterCol title={t.nav.corporate} links={[
              { href: `/${lang}/careers`, label: lang === "fr" ? "Carrière" : "Careers" },
              { href: `/${lang}/meeting`, label: lang === "fr" ? "Prendre rendez-vous" : "Book a meeting" },
            ]} />
          </div>

          <div style={{
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "rgba(255,255,255,0.4)",
            fontSize: 12.5,
            flexWrap: "wrap" as const,
            gap: 12,
          }}>
            <div>{t.footer.copy}</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" as const }}>
              <a href={`/${lang}/legal`} className="m-footer-bar-link-dark">Mentions légales</a>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
              <a href={`/${lang}/privacy`} className="m-footer-bar-link-dark">Confidentialité</a>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
              <a href={`/${lang}/terms`} className="m-footer-bar-link-dark">CGU</a>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
              <a href={`/${lang}/cgv`} className="m-footer-bar-link-dark">CGV</a>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
              <button onClick={openCookies} className="m-footer-bar-link-dark" style={{ background: "none", border: "none", fontSize: 12.5, padding: 0 }}>
                Cookies
              </button>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
              <div className="t-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
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
