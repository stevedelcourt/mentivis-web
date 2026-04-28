"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";

export type NavMessages = {
  nav: {
    home: string;
    about: string;
    enterprise: string;
    of: string;
    solutions: string;
    resources: string;
    contact: string;
    cta: string;
  };
};

function LangToggle({ lang }: { lang: string }) {
  const switchLang = () => {
    if (typeof window === "undefined") return;
    const target = lang === "fr" ? "en" : "fr";
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(/^\/(fr|en)\b/, `/${target}`);
    window.location.assign(newPath);
  };

  return (
    <button
      onClick={switchLang}
      style={{
        background: "none",
        border: "none",
        fontSize: 13,
        fontWeight: 600,
        color: "var(--m-ink-2)",
        cursor: "pointer",
        padding: "4px 2px",
        letterSpacing: "0.04em",
        textTransform: "uppercase" as const,
        fontFamily: "inherit",
      }}
    >
      {lang === "fr" ? "EN" : "FR"}
    </button>
  );
}

type TopNavProps = {
  t: NavMessages;
  lang: string;
  route?: string;
};

export default function TopNav({ t, lang, route = "" }: TopNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: `/${lang}/about`, label: t.nav.about },
    { href: `/${lang}/enterprise`, label: t.nav.enterprise },
    { href: `/${lang}/of`, label: t.nav.of },
    { href: `/${lang}/solutions`, label: t.nav.solutions },
  ];

  const resourceLinks = [
    { href: `/${lang}/resources`, label: lang === "fr" ? "Guides de référence" : "Reference guides" },
    { href: `/${lang}/opco`, label: lang === "fr" ? "Calculateur OPCO" : "OPCO calculator" },
    { href: `/${lang}/score-formation`, label: "Score Formation" },
    { href: `/${lang}/careers`, label: lang === "fr" ? "Carrière" : "Careers" },
    { href: "#", label: lang === "fr" ? "Insights (à venir)" : "Insights (coming soon)" },
  ];

  const isActive = (href: string) => route && href === `/${lang}` + route.replace(/^\/[a-z]{2}/, "");

  return (
    <header
      style={{
        position: "fixed",
        top: 12, left: 0, right: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        padding: "0 16px",
        pointerEvents: "none" as const,
      }}
    >
      <div style={{
        pointerEvents: "auto" as const,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        width: "100%",
        maxWidth: 1280,
        background: "#ffffff",
        borderRadius: 16,
        padding: "10px 20px",
        boxShadow: scrolled ? "0 6px 24px rgba(16,24,40,0.08)" : "0 2px 12px rgba(16,24,40,0.06)",
        border: "1px solid var(--m-line)",
        transition: "box-shadow 0.2s ease",
      }}>
        {/* Logo — left */}
        <div style={{ display: "flex", alignItems: "center", flexShrink: 0, minWidth: 150 }}>
          <Logo width={150} height={35} />
        </div>

        {/* Nav pill — centered */}
        <div className="m-nav-pill" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          background: "var(--m-bg-soft)",
          border: "1px solid var(--m-line-2)",
          borderRadius: 999,
          padding: "4px 4px 4px 12px",
          flex: "1 1 auto",
          maxWidth: "fit-content",
          margin: "0 auto",
        }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="m-nav-link"
                style={{
                  padding: "8px 14px",
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive(l.href) ? "var(--m-ink)" : "var(--m-ink-2)",
                  letterSpacing: "-0.005em",
                  borderRadius: 999,
                  background: isActive(l.href) ? "rgba(0,0,0,0.05)" : "transparent",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side: FR/EN + Contact button + Burger */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <LangToggle lang={lang} />

          {/* Contact button — desktop only, Mentivis blue pill */}
          <Link
            href={`/${lang}/contact`}
            className="m-nav-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "white",
              background: "var(--m-purple)",
              borderRadius: 999,
              textDecoration: "none",
              transition: "opacity 0.25s ease, transform 0.25s ease",
            }}
          >
            {t.nav.cta}
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
          </Link>

          <button
            className="m-nav-burger"
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              display: "none",
              background: "var(--m-bg-soft)",
              border: "1px solid var(--m-line-2)",
              borderRadius: 999,
              padding: 8,
              cursor: "pointer",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <line x1="2" y1="5" x2="16" y2="5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <line x1="2" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="m-nav-mobile" style={{
          position: "absolute" as const, top: 64, left: 16, right: 16,
          background: "white", borderRadius: 16, padding: 16,
          boxShadow: "0 12px 40px rgba(16,24,40,0.12)",
          border: "1px solid var(--m-line)",
          pointerEvents: "auto" as const,
        }}>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  padding: "12px 8px",
                  fontSize: 16,
                  fontWeight: 500,
                  color: "var(--m-ink)",
                  borderBottom: "1px solid var(--m-line-2)",
                  textDecoration: "none",
                }}
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => setResourcesOpen(v => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 8px",
                fontSize: 16,
                fontWeight: 500,
                color: "var(--m-ink)",
                background: "none",
                border: "none",
                borderBottom: "1px solid var(--m-line-2)",
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
              }}
            >
              <span>{t.nav.resources}</span>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 18,
                  color: "var(--m-ink-3)",
                  transition: "transform 0.2s",
                  transform: resourcesOpen ? "rotate(90deg)" : "rotate(0deg)",
                }}
              >
                chevron_right
              </span>
            </button>
            {resourcesOpen && (
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 4, paddingLeft: 12, paddingBottom: 8 }}>
                {resourceLinks.map((l) => (
                  <Link
                    key={l.href + l.label}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: "block",
                      padding: "10px 8px",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--m-ink-2)",
                      textDecoration: "none",
                    }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column" as const, gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <LangToggle lang={lang} />
            </div>
            <Link href={`/${lang}/contact`} onClick={() => setMobileOpen(false)} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 20px",
              fontSize: 14,
              fontWeight: 600,
              color: "white",
              background: "var(--m-purple)",
              borderRadius: 999,
              textDecoration: "none",
            }}>
              {t.nav.cta}
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
            </Link>
            <a href="mailto:contact@mentivis.com" onClick={() => setMobileOpen(false)} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 20px",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--m-ink)",
              background: "transparent",
              border: "1.5px solid var(--m-line)",
              borderRadius: 999,
              textDecoration: "none",
            }}>
              contact@mentivis.com
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
