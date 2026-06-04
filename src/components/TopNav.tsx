"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "./Logo";
import Icon from "./ui/Icon";
import { useContactUrl } from "@/lib/contact-url";

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
    ambassadors: string;
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
  const contactUrl = useContactUrl(lang);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [corporateOpen, setCorporateOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [desktopResourcesOpen, setDesktopResourcesOpen] = useState(false);
  const [desktopSolutionsOpen, setDesktopSolutionsOpen] = useState(false);
  const [desktopAboutOpen, setDesktopAboutOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const solutionsDropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const solutionsTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const aboutTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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
    { href: `/${lang}/referentiel`, label: lang === "fr" ? "Le Référentiel" : "The Reference" },
    { href: `/${lang}/guides`, label: lang === "fr" ? "Guides de référence" : "Reference guides" },
    { href: `/${lang}/score-formation`, label: "Score Formation" },
    { href: `/${lang}/videos`, label: lang === "fr" ? "Vidéos" : "Videos" },
  ];

  const corporateLinks = [
    { href: `/${lang}/contact`, label: t.nav.contact },
    { href: `/${lang}/meeting`, label: lang === "fr" ? "Prendre rendez-vous" : "Book a meeting" },
  ];

  const aboutLinks = [
    { href: `/${lang}/careers`, label: lang === "fr" ? "Carrière" : "Careers" },
    { href: `/${lang}/ambassadors`, label: t.nav.ambassadors },
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

  const handleAboutMouseEnter = () => {
    if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
    setDesktopAboutOpen(true);
  };

  const handleAboutMouseLeave = () => {
    aboutTimeoutRef.current = setTimeout(() => {
      setDesktopAboutOpen(false);
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
                style={{ position: "relative", display: "flex", alignItems: "center", gap: 0 }}
              >
                <Link
                  href={`/${lang}/solutions`}
                  className="m-nav-link"
                  style={{
                    padding: "8px 2px 8px 14px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: isActive(`/${lang}/solutions`) ? "var(--m-ink)" : "var(--m-ink-2)",
                    letterSpacing: "-0.005em",
                    borderRadius: "8px 0 0 8px",
                    background: isActive(`/${lang}/solutions`) ? "rgba(0,0,0,0.05)" : "transparent",
                    textDecoration: "none",
                    fontFamily: "inherit",
                  }}
                >
                  {t.nav.solutions}
                </Link>
                <button
                  className="m-nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setDesktopSolutionsOpen(v => !v);
                  }}
                  style={{
                    padding: "8px 14px 8px 2px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--m-ink-2)",
                    letterSpacing: "-0.005em",
                    borderRadius: "0 8px 8px 0",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
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
                  <Link
                    href={`/${lang}/mentivisos`}
                    className="m-dropdown-link"
                  >
                    MentivisOS
                  </Link>
                  <a
                    href="https://mentivisos.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="m-dropdown-link"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}
                  >
                    <span>MentivisOS website</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
                      <path d="M5.60002 0.899994C5.82094 0.899994 6.00002 1.07908 6.00002 1.29999C6.00002 1.52091 5.82094 1.69999 5.60002 1.69999H1.60002C1.37911 1.69999 1.20002 1.87908 1.20002 2.09999V10.9C1.20002 11.1209 1.37911 11.3 1.60002 11.3H10.4C10.6209 11.3 10.8 11.1209 10.8 10.9V6.89999C10.8 6.67908 10.9791 6.49999 11.2 6.49999C11.4209 6.49999 11.6 6.67908 11.6 6.89999V10.9C11.6 11.5627 11.0628 12.1 10.4 12.1H1.60002C0.937283 12.1 0.400024 11.5627 0.400024 10.9V2.09999C0.400024 1.43725 0.937283 0.899994 1.60002 0.899994H5.60002ZM11.2 0.899994C11.2299 0.899994 11.2598 0.903486 11.2891 0.91015C11.3078 0.91442 11.3259 0.920467 11.3438 0.927338C11.3496 0.9296 11.3552 0.932601 11.361 0.93515C11.3771 0.942258 11.3927 0.950169 11.4078 0.959369C11.414 0.963129 11.4206 0.966183 11.4266 0.970306C11.4466 0.984054 11.4654 0.999763 11.4828 1.01718L11.5344 1.07968C11.5431 1.09292 11.5485 1.1079 11.5555 1.12187C11.56 1.13085 11.5657 1.13915 11.5696 1.14843C11.5832 1.18169 11.5911 1.21637 11.5953 1.25156C11.5973 1.26761 11.6 1.28365 11.6 1.29999V4.49999C11.6 4.72091 11.4209 4.89999 11.2 4.89999C10.9791 4.89999 10.8 4.72091 10.8 4.49999V2.26562L7.48284 5.58281C7.32663 5.73902 7.07342 5.73902 6.91721 5.58281C6.761 5.4266 6.761 5.17339 6.91721 5.01718L10.2344 1.69999H8.00003C7.77911 1.69999 7.60003 1.52091 7.60003 1.29999C7.60003 1.07908 7.77911 0.899994 8.00003 0.899994H11.2Z" fill="currentColor"/>
                    </svg>
                  </a>
                  <a
                    href="/mentivis-solutions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="m-dropdown-link"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}
                  >
                    <span>Mentivis Solutions</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
                      <path d="M5.60002 0.899994C5.82094 0.899994 6.00002 1.07908 6.00002 1.29999C6.00002 1.52091 5.82094 1.69999 5.60002 1.69999H1.60002C1.37911 1.69999 1.20002 1.87908 1.20002 2.09999V10.9C1.20002 11.1209 1.37911 11.3 1.60002 11.3H10.4C10.6209 11.3 10.8 11.1209 10.8 10.9V6.89999C10.8 6.67908 10.9791 6.49999 11.2 6.49999C11.4209 6.49999 11.6 6.67908 11.6 6.89999V10.9C11.6 11.5627 11.0628 12.1 10.4 12.1H1.60002C0.937283 12.1 0.400024 11.5627 0.400024 10.9V2.09999C0.400024 1.43725 0.937283 0.899994 1.60002 0.899994H5.60002ZM11.2 0.899994C11.2299 0.899994 11.2598 0.903486 11.2891 0.91015C11.3078 0.91442 11.3259 0.920467 11.3438 0.927338C11.3496 0.9296 11.3552 0.932601 11.361 0.93515C11.3771 0.942258 11.3927 0.950169 11.4078 0.959369C11.414 0.963129 11.4206 0.966183 11.4266 0.970306C11.4466 0.984054 11.4654 0.999763 11.4828 1.01718L11.5344 1.07968C11.5431 1.09292 11.5485 1.1079 11.5555 1.12187C11.56 1.13085 11.5657 1.13915 11.5696 1.14843C11.5832 1.18169 11.5911 1.21637 11.5953 1.25156C11.5973 1.26761 11.6 1.28365 11.6 1.29999V4.49999C11.6 4.72091 11.4209 4.89999 11.2 4.89999C10.9791 4.89999 10.8 4.72091 10.8 4.49999V2.26562L7.48284 5.58281C7.32663 5.73902 7.07342 5.73902 6.91721 5.58281C6.761 5.4266 6.761 5.17339 6.91721 5.01718L10.2344 1.69999H8.00003C7.77911 1.69999 7.60003 1.52091 7.60003 1.29999C7.60003 1.07908 7.77911 0.899994 8.00003 0.899994H11.2Z" fill="currentColor"/>
                    </svg>
                  </a>
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

              {/* Desktop About Dropdown */}
              <div
                className="m-desktop-dropdown"
                onMouseEnter={handleAboutMouseEnter}
                onMouseLeave={handleAboutMouseLeave}
                style={{ position: "relative" }}
              >
                <Link
                  href={`/${lang}/about`}
                  className="m-nav-link"
                  style={{
                    padding: "8px 14px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--m-ink-2)",
                    letterSpacing: "-0.005em",
                    borderRadius: 8,
                    background: "transparent",
                    textDecoration: "none",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {t.nav.about}
                  <span style={{
                    display: "inline-block",
                    transition: "transform 0.2s",
                    transform: desktopAboutOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}>
                    <Icon name="expand_more" size={16} />
                  </span>
                </Link>

                <div className={`m-dropdown-panel ${desktopAboutOpen ? "open" : ""}`}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#f7f7f4",
                    borderRadius: 12,
                    padding: "20px 24px",
                    minWidth: 180,
                    boxShadow: "0 16px 56px rgba(0,0,0,0.12)",
                    border: "1px solid rgba(0,0,0,0.04)",
                    zIndex: 60,
                  }}>
                  {aboutLinks.map((l) => (
                    <Link key={l.href} href={l.href} className="m-dropdown-link">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

          {/* Right side: FR/EN + Contact button + Burger */}
          <div className="m-nav-item m-nav-item-delay-2" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div className="m-nav-item m-nav-item-delay-3">
              <LangToggle lang={lang} />
            </div>

            {/* Contact button - desktop only */}
            <Link
              href={contactUrl}
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

            {/* Burger button — morph SVG, invisible pill */}
            <button
              className={`m-nav-burger m-nav-item m-nav-item-delay-3 ${mobileOpen ? "m-burger-open" : ""}`}
              aria-label="Menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              style={{
                display: "none",
                background: "none",
                border: "none",
                padding: 8,
                cursor: "pointer",
                color: "var(--m-ink)",
                lineHeight: 1,
              }}
            >
              <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                <line className="m-burger-line m-burger-line-top" x1="18" y1="34" x2="82" y2="34"/>
                <line className="m-burger-line m-burger-line-mid" x1="18" y1="50" x2="82" y2="50"/>
                <line className="m-burger-line m-burger-line-bot" x1="18" y1="66" x2="82" y2="66"/>
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
            <div className="m-mobile-nav-item m-mobile-nav-accordion" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Link
                href={`/${lang}/solutions`}
                onClick={() => setMobileOpen(false)}
                style={{ flex: 1, textDecoration: "none", color: "inherit", fontWeight: 500 }}
              >
                {t.nav.solutions}
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSolutionsOpen(v => !v);
                  setResourcesOpen(false);
                  setCorporateOpen(false);
                  setAboutOpen(false);
                }}
                style={{
                  background: "none", border: "none", cursor: "pointer", padding: "8px",
                  color: "var(--m-ink-3)", display: "flex", alignItems: "center",
                  transition: "transform 0.2s",
                  transform: solutionsOpen ? "rotate(90deg)" : "rotate(0deg)",
                }}
              >
                <Icon name="chevron_right" size={24} />
              </button>
            </div>
            <div className={`m-mobile-submenu ${solutionsOpen ? "open" : ""}`}>
                  <Link
                    href={`/${lang}/mentivisos`}
                    onClick={() => setMobileOpen(false)}
                    className="m-mobile-subitem"
                  >
                    MentivisOS
                  </Link>
                  <a
                    href="https://mentivisos.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="m-mobile-subitem"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}
                  >
                    <span>MentivisOS website</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
                      <path d="M5.60002 0.899994C5.82094 0.899994 6.00002 1.07908 6.00002 1.29999C6.00002 1.52091 5.82094 1.69999 5.60002 1.69999H1.60002C1.37911 1.69999 1.20002 1.87908 1.20002 2.09999V10.9C1.20002 11.1209 1.37911 11.3 1.60002 11.3H10.4C10.6209 11.3 10.8 11.1209 10.8 10.9V6.89999C10.8 6.67908 10.9791 6.49999 11.2 6.49999C11.4209 6.49999 11.6 6.67908 11.6 6.89999V10.9C11.6 11.5627 11.0628 12.1 10.4 12.1H1.60002C0.937283 12.1 0.400024 11.5627 0.400024 10.9V2.09999C0.400024 1.43725 0.937283 0.899994 1.60002 0.899994H5.60002ZM11.2 0.899994C11.2299 0.899994 11.2598 0.903486 11.2891 0.91015C11.3078 0.91442 11.3259 0.920467 11.3438 0.927338C11.3496 0.9296 11.3552 0.932601 11.361 0.93515C11.3771 0.942258 11.3927 0.950169 11.4078 0.959369C11.414 0.963129 11.4206 0.966183 11.4266 0.970306C11.4466 0.984054 11.4654 0.999763 11.4828 1.01718L11.5344 1.07968C11.5431 1.09292 11.5485 1.1079 11.5555 1.12187C11.56 1.13085 11.5657 1.13915 11.5696 1.14843C11.5832 1.18169 11.5911 1.21637 11.5953 1.25156C11.5973 1.26761 11.6 1.28365 11.6 1.29999V4.49999C11.6 4.72091 11.4209 4.89999 11.2 4.89999C10.9791 4.89999 10.8 4.72091 10.8 4.49999V2.26562L7.48284 5.58281C7.32663 5.73902 7.07342 5.73902 6.91721 5.58281C6.761 5.4266 6.761 5.17339 6.91721 5.01718L10.2344 1.69999H8.00003C7.77911 1.69999 7.60003 1.52091 7.60003 1.29999C7.60003 1.07908 7.77911 0.899994 8.00003 0.899994H11.2Z" fill="currentColor"/>
                    </svg>
                  </a>
                  <a
                    href="/mentivis-solutions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="m-mobile-subitem"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}
                  >
                    <span>Mentivis Solutions</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
                      <path d="M5.60002 0.899994C5.82094 0.899994 6.00002 1.07908 6.00002 1.29999C6.00002 1.52091 5.82094 1.69999 5.60002 1.69999H1.60002C1.37911 1.69999 1.20002 1.87908 1.20002 2.09999V10.9C1.20002 11.1209 1.37911 11.3 1.60002 11.3H10.4C10.6209 11.3 10.8 11.1209 10.8 10.9V6.89999C10.8 6.67908 10.9791 6.49999 11.2 6.49999C11.4209 6.49999 11.6 6.67908 11.6 6.89999V10.9C11.6 11.5627 11.0628 12.1 10.4 12.1H1.60002C0.937283 12.1 0.400024 11.5627 0.400024 10.9V2.09999C0.400024 1.43725 0.937283 0.899994 1.60002 0.899994H5.60002ZM11.2 0.899994C11.2299 0.899994 11.2598 0.903486 11.2891 0.91015C11.3078 0.91442 11.3259 0.920467 11.3438 0.927338C11.3496 0.9296 11.3552 0.932601 11.361 0.93515C11.3771 0.942258 11.3927 0.950169 11.4078 0.959369C11.414 0.963129 11.4206 0.966183 11.4266 0.970306C11.4466 0.984054 11.4654 0.999763 11.4828 1.01718L11.5344 1.07968C11.5431 1.09292 11.5485 1.1079 11.5555 1.12187C11.56 1.13085 11.5657 1.13915 11.5696 1.14843C11.5832 1.18169 11.5911 1.21637 11.5953 1.25156C11.5973 1.26761 11.6 1.28365 11.6 1.29999V4.49999C11.6 4.72091 11.4209 4.89999 11.2 4.89999C10.9791 4.89999 10.8 4.72091 10.8 4.49999V2.26562L7.48284 5.58281C7.32663 5.73902 7.07342 5.73902 6.91721 5.58281C6.761 5.4266 6.761 5.17339 6.91721 5.01718L10.2344 1.69999H8.00003C7.77911 1.69999 7.60003 1.52091 7.60003 1.29999C7.60003 1.07908 7.77911 0.899994 8.00003 0.899994H11.2Z" fill="currentColor"/>
                    </svg>
                  </a>
             </div>
 
             {/* Ressources accordion */}
            <button
              onClick={() => {
                setResourcesOpen(v => !v);
                setSolutionsOpen(false);
                setCorporateOpen(false);
                setAboutOpen(false);
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

            {/* About accordion */}
            <div className="m-mobile-nav-item m-mobile-nav-accordion" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Link
                href={`/${lang}/about`}
                onClick={() => setMobileOpen(false)}
                style={{ flex: 1, textDecoration: "none", color: "inherit", fontWeight: 500 }}
              >
                {t.nav.about}
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAboutOpen(v => !v);
                  setResourcesOpen(false);
                  setSolutionsOpen(false);
                  setCorporateOpen(false);
                }}
                style={{
                  background: "none", border: "none", cursor: "pointer", padding: "8px",
                  color: "var(--m-ink-3)", display: "flex", alignItems: "center",
                  transition: "transform 0.2s",
                  transform: aboutOpen ? "rotate(90deg)" : "rotate(0deg)",
                }}
              >
                <Icon name="chevron_right" size={24} />
              </button>
            </div>
            <div className={`m-mobile-submenu ${aboutOpen ? "open" : ""}`}>
              {aboutLinks.map((l) => (
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
              href={contactUrl}
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
