"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "./Logo";
import Icon from "./ui/Icon";

export type NavMessages = {
  nav: {
    home: string;
    about: string;
    enterprise: string;
    of: string;
    solutions: string;
    resources: string;
    insights: string;
    corporate: string;
    contact: string;
    cta: string;
    ctaShort: string;
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
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [corporateOpen, setCorporateOpen] = useState(false);
  const [desktopResourcesOpen, setDesktopResourcesOpen] = useState(false);
  const [desktopSolutionsOpen, setDesktopSolutionsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const solutionsDropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const solutionsTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    let last = false;
    const onScroll = () => {
      const curr = window.scrollY > 8;
      if (curr !== last) {
        last = curr;
        setScrolled(curr);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.dataset.scrollY = String(scrollY);
    } else {
      const scrollY = document.body.dataset.scrollY || "0";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      delete document.body.dataset.scrollY;
      window.scrollTo(0, parseInt(scrollY, 10));
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    return () => {
      if (solutionsTimeoutRef.current) clearTimeout(solutionsTimeoutRef.current);
    };
  }, []);

  const links = [
    { href: `/${lang}/enterprise`, label: t.nav.enterprise },
    { href: `/${lang}/of`, label: t.nav.of },
  ];

  const allResourceLinks = [
    { href: `/${lang}/insights`, label: t.nav.insights },
    { href: `/${lang}/guides`, label: lang === "fr" ? "Guides de référence" : "Reference guides" },
    { href: `/${lang}/score-formation`, label: "Score Formation" },
    { href: `/${lang}/videos`, label: lang === "fr" ? "Vidéos" : "Videos" },
  ];

  const corporateLinks = [
    { href: `/${lang}/contact`, label: t.nav.contact },
    { href: `/${lang}/careers`, label: lang === "fr" ? "Carrière" : "Careers" },
    { href: `/${lang}/meeting`, label: lang === "fr" ? "Prendre rendez-vous" : "Book a meeting" },
  ];

  const isActive = (href: string) => route && href === `/${lang}` + route.replace(/^\/[a-z]{2}/, "");

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDesktopResourcesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDesktopResourcesOpen(false);
    }, 150);
  };

  const handleSolutionsMouseEnter = () => {
    if (solutionsTimeoutRef.current) clearTimeout(solutionsTimeoutRef.current);
    setDesktopSolutionsOpen(true);
  };

  const handleSolutionsMouseLeave = () => {
    solutionsTimeoutRef.current = setTimeout(() => {
      setDesktopSolutionsOpen(false);
    }, 150);
  };

  return (
    <>
      <header
        className="m-header-load"
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
        <div className={`m-header-scroll ${scrolled ? "scrolled m-header-shadow" : ""}`}
          style={{
            pointerEvents: "auto" as const,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            width: "100%",
            maxWidth: 1280,
            background: scrolled ? "rgba(255,255,255,0.92)" : "#ffffff",
            borderRadius: 16,
            padding: "10px 20px",
            transition: "background 0.3s ease, backdrop-filter 0.3s ease",
            backdropFilter: scrolled ? "blur(8px)" : "none",
          }}>
           {/* Logo - left */}
          <div className="m-nav-item m-nav-item-delay-0" style={{ display: "flex", alignItems: "center", flexShrink: 0, minWidth: 150, cursor: "pointer" }} onClick={() => window.dispatchEvent(new CustomEvent('triggerFaqScroll'))}>
            <Logo lang={lang} width={150} height={35} />
          </div>

          {/* Nav links - centered */}
          <nav className="m-nav-pill m-nav-item m-nav-item-delay-1" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, margin: "0 auto" }}>
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
                    borderRadius: 8,
                    background: isActive(l.href) ? "rgba(0,0,0,0.05)" : "transparent",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  {l.label}
                </Link>
              ))}

              {/* Desktop Solutions Dropdown */}
              <div
                ref={solutionsDropdownRef}
                className="m-desktop-dropdown"
                onMouseEnter={handleSolutionsMouseEnter}
                onMouseLeave={handleSolutionsMouseLeave}
                style={{ position: "relative" }}
              >
                <button
                  className="m-nav-link"
                  style={{
                    padding: "8px 14px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--m-ink-2)",
                    letterSpacing: "-0.005em",
                    borderRadius: 8,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {t.nav.solutions}
                  <span style={{
                    display: "inline-block",
                    transition: "transform 0.2s",
                    transform: desktopSolutionsOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}>
                    <Icon name="expand_more" size={16} />
                  </span>
                </button>

                <div className={`m-dropdown-panel ${desktopSolutionsOpen ? "open" : ""}`}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#f7f7f4",
                    borderRadius: 12,
                    padding: "20px 24px",
                    minWidth: 220,
                    boxShadow: "0 16px 56px rgba(0,0,0,0.12)",
                    border: "1px solid rgba(0,0,0,0.04)",
                    zIndex: 60,
                  }}>
                  <span style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--m-ink-3)",
                    marginBottom: 12,
                    display: "block",
                    fontWeight: 600,
                  }}>
                {lang === "fr" ? "ingénierie" : "engineering"}
                  </span>
                  <Link
                    href={`/mentivis-solutions`}
                    className="m-dropdown-link"
                  >
                    {lang === "fr" ? "Mentivis Solutions" : "Mentivis Solutions"}
                  </Link>
                </div>
              </div>

              {/* Desktop Resources Dropdown */}
              <div
                ref={dropdownRef}
                className="m-desktop-dropdown"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ position: "relative" }}
              >
                <button
                  className="m-nav-link"
                  style={{
                    padding: "8px 14px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--m-ink-2)",
                    letterSpacing: "-0.005em",
                    borderRadius: 8,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {t.nav.resources}
                  <span style={{
                    display: "inline-block",
                    transition: "transform 0.2s",
                    transform: desktopResourcesOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}>
                    <Icon name="expand_more" size={16} />
                  </span>
                </button>

                <div className={`m-dropdown-panel ${desktopResourcesOpen ? "open" : ""}`}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#f7f7f4",
                    borderRadius: 12,
                    padding: "20px 24px",
                    minWidth: 220,
                    boxShadow: "0 16px 56px rgba(0,0,0,0.12)",
                    border: "1px solid rgba(0,0,0,0.04)",
                    zIndex: 60,
                  }}>
                  <span style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--m-ink-3)",
                    marginBottom: 12,
                    display: "block",
                    fontWeight: 600,
                  }}>
                    {t.nav.resources}
                  </span>
                  {allResourceLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="m-dropdown-link"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* About link - after Resources */}
              <Link
                href={`/${lang}/about`}
                className="m-nav-link"
                style={{
                  padding: "8px 14px",
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive(`/${lang}/about`) ? "var(--m-ink)" : "var(--m-ink-2)",
                  letterSpacing: "-0.005em",
                  borderRadius: 8,
                  background: isActive(`/${lang}/about`) ? "rgba(0,0,0,0.05)" : "transparent",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {t.nav.about}
              </Link>
            </nav>

          {/* Right side: FR/EN + Contact button + Burger */}
          <div className="m-nav-item m-nav-item-delay-2" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div className="m-nav-item m-nav-item-delay-3">
              <LangToggle lang={lang} />
            </div>

            {/* Contact button - desktop only */}
            <Link
              href={`/${lang}/contact`}
              className="m-nav-cta m-nav-item m-nav-item-delay-2"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 16px",
                fontSize: 13,
                fontWeight: 600,
                color: "white",
                background: "var(--m-purple)",
                borderRadius: 12,
                textDecoration: "none",
                transition: "opacity 0.25s ease, transform 0.25s ease",
              }}
            >
              {t.nav.ctaShort}
              <Icon name="chevron_right" size={16} />
            </Link>

            {/* Burger button */}
            <button
              className="m-nav-burger m-nav-item m-nav-item-delay-3"
              aria-label="Menu"
              onClick={() => setMobileOpen((v) => !v)}
              style={{
                display: "none",
                background: "var(--m-bg-soft)",
                border: "1px solid var(--m-line-2)",
                borderRadius: 8,
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
      </header>

{/* Mobile Fullscreen Menu */}
       {mobileOpen && (
         <div className="m-mobile-fullscreen" style={{
           position: "fixed" as const,
           inset: 0,
           zIndex: 100,
           display: "flex",
           flexDirection: "column" as const,
           height: "100vh",
           overflow: "hidden",
           background: "#f7f7f4",
         }}>
          {/* Header — exact same style as normal header (white pill) to prevent logo jump */}
<div style={{
             display: "flex",
             justifyContent: "center",
             padding: "0 16px",
             position: "relative",
             top: 12,
             zIndex: 2,
           }}>
<div style={{
               display: "flex",
               alignItems: "center",
               justifyContent: "space-between",
               width: "100%",
               maxWidth: 1280,
               background: "#ffffff",
               borderRadius: 16,
               padding: "10px 20px",
               boxShadow: "none",
             }}>
              <div style={{ display: "flex", alignItems: "center", flexShrink: 0, minWidth: 150 }}>
                <Logo lang={lang} width={150} height={35} />
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 8,
                  fontSize: 24,
                  color: "var(--m-ink)",
                  lineHeight: 1,
                }}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Menu content — beige background, starts below the pill header */}
          <div className="m-mobile-menu-content" style={{
            flex: 1,
            overflow: "auto",
            background: "#f7f7f4",
            padding: "0 20px",
            display: "flex",
            flexDirection: "column" as const,
            marginTop: 8,
          }}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="m-mobile-nav-item"
              >
                {l.label}
              </Link>
            ))}

            {/* Solutions accordion */}
            <button
              onClick={() => {
                setSolutionsOpen(v => !v);
                setResourcesOpen(false);
                setCorporateOpen(false);
              }}
              className="m-mobile-nav-item m-mobile-nav-accordion"
            >
              <span>{t.nav.solutions}</span>
              <span
                style={{
                  color: "var(--m-ink-3)",
                  transition: "transform 0.2s",
                  transform: solutionsOpen ? "rotate(90deg)" : "rotate(0deg)",
                }}
              >
                <Icon name="chevron_right" size={24} />
              </span>
            </button>
            <div className={`m-mobile-submenu ${solutionsOpen ? "open" : ""}`}>
              <span style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--m-ink-3)",
                margin: "12px 0 8px",
                display: "block",
                fontWeight: 600,
              }}>
                {lang === "fr" ? "ingénierie" : "engineering"}
              </span>
              <Link
                href={`/mentivis-solutions`}
                onClick={() => setMobileOpen(false)}
                className="m-mobile-subitem"
              >
                {lang === "fr" ? "Mentivis Solutions" : "Mentivis Solutions"}
              </Link>
            </div>

            {/* Ressources accordion */}
            <button
              onClick={() => {
                setResourcesOpen(v => !v);
                setSolutionsOpen(false);
                setCorporateOpen(false);
              }}
              className="m-mobile-nav-item m-mobile-nav-accordion"
            >
              <span>{t.nav.resources}</span>
              <span
                style={{
                  color: "var(--m-ink-3)",
                  transition: "transform 0.2s",
                  transform: resourcesOpen ? "rotate(90deg)" : "rotate(0deg)",
                }}
              >
                <Icon name="chevron_right" size={24} />
              </span>
            </button>
            <div className={`m-mobile-submenu ${resourcesOpen ? "open" : ""}`}>
              {allResourceLinks.map((l) => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="m-mobile-subitem"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* About link - after Resources */}
            <Link
              href={`/${lang}/about`}
              onClick={() => setMobileOpen(false)}
              className="m-mobile-nav-item"
            >
              {t.nav.about}
            </Link>

            {/* Corporate accordion */}
            <button
              onClick={() => {
                setCorporateOpen(v => !v);
                setResourcesOpen(false);
              }}
              className="m-mobile-nav-item m-mobile-nav-accordion"
            >
              <span>{t.nav.corporate}</span>
              <span
                style={{
                  color: "var(--m-ink-3)",
                  transition: "transform 0.2s",
                  transform: corporateOpen ? "rotate(90deg)" : "rotate(0deg)",
                }}
              >
                <Icon name="chevron_right" size={24} />
              </span>
            </button>
            <div className={`m-mobile-submenu ${corporateOpen ? "open" : ""}`}>
              {corporateLinks.map((l) => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="m-mobile-subitem"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA bottom */}
          <div style={{
            padding: "20px",
            borderTop: "1px solid rgba(0,0,0,0.06)",
          }}>
            <Link
              href={`/${lang}/contact`}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 24px",
                fontSize: 16,
                fontWeight: 600,
                color: "white",
                background: "var(--m-purple)",
                borderRadius: 12,
                textDecoration: "none",
              }}
            >
              {t.nav.cta}
              <Icon name="chevron_right" size={20} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
