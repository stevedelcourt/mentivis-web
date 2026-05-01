"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/config";
import { encodeEntities } from "@/lib/utils";

type FooterMessages = {
  nav: { cta: string; home: string; about: string; enterprise: string; of: string; solutions: string; resources: string; insights: string; corporate: string; };
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
                <div style={{ filter: "invert(1) brightness(100)" }}>
                  <Image src="/logo-noir.svg" alt="Mentivis" width={120} height={28} />
                </div>
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
              <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center" }}>
                <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.1)", color: "white", transition: "background 0.2s" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.1)", color: "white", transition: "background 0.2s" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
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
              { href: `/${lang}/insights`, label: t.nav.insights },
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
