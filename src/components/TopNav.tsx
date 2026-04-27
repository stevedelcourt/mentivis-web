"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";

type Messages = {
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

type LangToggleProps = {
  lang: string;
  setLang: (lang: string) => void;
};

function LangToggle({ lang, setLang }: LangToggleProps) {
  return (
    <div style={{
      display: "inline-flex",
      background: "rgba(0,0,0,0.04)",
      borderRadius: 999,
      padding: 2,
      fontSize: 11,
      fontWeight: 600,
    }}>
      {["fr", "en"].map((L) => (
        <button
          key={L}
          onClick={() => setLang(L)}
          style={{
            padding: "5px 10px",
            borderRadius: 999,
            border: "none",
            background: lang === L ? "white" : "transparent",
            color: lang === L ? "var(--m-ink)" : "var(--m-ink-3)",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase" as const,
            cursor: "pointer",
            boxShadow: lang === L ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.15s",
          }}
        >
          {L}
        </button>
      ))}
    </div>
  );
}

type TopNavProps = {
  t: Messages;
  lang: string;
  setLang: (lang: string) => void;
  route: string;
};

export default function TopNav({ t, lang, setLang, route }: TopNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const isActive = (href: string) => route && href === `/${lang}` + route.replace(/^\/[a-z]{2}/, "");

  return (
    <header
      style={{
        position: "fixed",
        top: 16, left: 0, right: 0,
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
        gap: 8,
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 999,
        padding: "6px 8px 6px 18px",
        boxShadow: scrolled ? "0 6px 24px rgba(16,24,40,0.06)" : "0 2px 12px rgba(16,24,40,0.04)",
        transition: "box-shadow 0.2s ease",
      }}>
        <Logo />

        <span aria-hidden="true" style={{ width: 1, height: 18, background: "rgba(0,0,0,0.08)", margin: "0 8px" }} />

        <nav className="m-nav-desktop" style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                padding: "8px 14px",
                fontSize: 14,
                fontWeight: 500,
                color: isActive(l.href) ? "var(--m-ink)" : "var(--m-ink-2)",
                letterSpacing: "-0.005em",
                borderRadius: 999,
                background: isActive(l.href) ? "rgba(0,0,0,0.05)" : "transparent",
                transition: "background 0.15s",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <span aria-hidden="true" style={{ width: 1, height: 18, background: "rgba(0,0,0,0.08)", margin: "0 6px" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LangToggle lang={lang} setLang={setLang} />
          <Link href={`/${lang}/contact`} style={{
            padding: "9px 16px",
            fontSize: 13,
            fontWeight: 600,
            color: "white",
            background: "var(--m-purple)",
            borderRadius: 999,
            letterSpacing: "-0.005em",
            whiteSpace: "nowrap" as const,
            transition: "background 0.15s",
          }}>
            {t.nav.cta}
          </Link>
          <button
            className="m-nav-burger"
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              display: "none",
              background: "transparent",
              border: "none",
              borderRadius: 999,
              padding: 8,
              cursor: "pointer",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d={mobileOpen ? "M3 3 L15 15 M15 3 L3 15" : "M2 5 H16 M2 13 H16"} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
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
          {links.map((l) => (
            <Link key={l.href} href={l.href} style={{ display: "block", padding: "12px 8px", fontSize: 16, fontWeight: 500, color: "var(--m-ink)", borderBottom: "1px solid var(--m-line-2)" }}>
              {l.label}
            </Link>
          ))}
          <Link href={`/${lang}/contact`} className="btn btn-primary" style={{ marginTop: 16, width: "100%", justifyContent: "center" }}>
            {t.nav.cta}
          </Link>
        </div>
      )}
    </header>
  );
}