"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import FinalCTA from "@/components/FinalCTA";
import FeaturedInsights from "@/components/FeaturedInsights";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import DualEntryCard from "@/components/DualEntryCard";
import PageShell from "@/components/layout/PageShell";
import JsonLd from "@/components/JsonLd";
import { useMessages } from "@/lib/messages";
import { useTypewriter } from "@/lib/useTypewriter";
import { SITE } from "@/lib/config";

function ProofSection({ proofs, proofTitle, proofNote }: { proofs: { value: string; unit: string; label: string }[]; proofTitle: string; proofNote: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: "100px 0", background: "var(--m-ink)", color: "white" }}>
      <div className="container">
        <div className="t-eyebrow" style={{ marginBottom: 28, color: "rgba(255,255,255,0.6)" }}>
          {proofTitle}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, overflow: "hidden", marginTop: 24 }} className="m-proof-grid">
          {proofs.map((p, i) => (
            <div
              key={i}
              className={`m-proof-stat ${revealed ? "revealed" : ""}`}
              style={{
                background: "var(--m-ink)",
                padding: "44px 32px",
                animationDelay: revealed ? `${i * 120}ms` : "0ms",
              }}
            >
              <div style={{
                fontFamily: "var(--f-display)",
                fontWeight: 700,
                fontSize: "clamp(44px, 5.5vw, 76px)",
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                color: "white",
              }}>
                {p.value}<span style={{ color: "#6b73d6", fontSize: "0.5em", verticalAlign: "0.6em", marginLeft: 4 }}>{p.unit}</span>
              </div>
              <div style={{ marginTop: 18, color: "rgba(255,255,255,0.7)", fontSize: 14.5, lineHeight: 1.45 }}>{p.label}</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 24, color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{proofNote}</p>
      </div>
    </section>
  );
}

function HomeHeroBackdrop() {
  return (
    <div aria-hidden="true" style={{
      position: "absolute" as const,
      inset: 0,
      pointerEvents: "none" as const,
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute" as const,
        inset: 0,
        backgroundImage: "linear-gradient(var(--m-line-2) 1px, transparent 1px)",
        backgroundSize: "100% 120px",
        opacity: 0.5,
        maskImage: "linear-gradient(to bottom, black 30%, transparent 90%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 30%, transparent 90%)",
      }} />
    </div>
  );
}

export default function HomePage() {
  const { t, lang } = useMessages();
  const h = t.home;

  const typewriterWords = t.animation?.words ?? ["Concevoir", "Structurer", "Déployer"];
  const subtitleText = t.animation?.subtitle ?? "des dispositifs de formation qui fonctionnent";

  const { displayedText } = useTypewriter({
    words: typewriterWords,
    typeSpeed: 100,
    deleteSpeed: 60,
    pauseType: 1200,
    pauseDelete: 250,
    loop: true,
  });

  const subtitleWords = subtitleText.split(" ");
  const subtitleNavyWords = subtitleWords.slice(-2).join(" ");
  const subtitleBlackWords = subtitleWords.slice(0, -2).join(" ");

  const heroSize = "clamp(36px, 6vw, 88px)";

  return (
    <PageShell>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${SITE.baseUrl}/#organization`,
          name: SITE.name,
          url: SITE.baseUrl,
          logo: `${SITE.baseUrl}/images/ui/logo-dark.svg`,
          sameAs: [SITE.linkedin, SITE.instagram],
          contactPoint: {
            "@type": "ContactPoint",
            telephone: SITE.phone,
            contactType: "customer service",
            email: SITE.email,
            availableLanguage: ["French", "English"],
          },
          address: {
            "@type": "PostalAddress",
            streetAddress: "60 Rue François 1er",
            addressLocality: "Paris",
            postalCode: "75008",
            addressCountry: "FR",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          url: `${SITE.baseUrl}/${lang}/`,
          publisher: { "@id": `${SITE.baseUrl}/#organization` },
        },
      ]} />
      <section style={{ paddingTop: 96, paddingBottom: 40, position: "relative" as const, overflow: "hidden" }}>
        <HomeHeroBackdrop />
        <div className="container" style={{ position: "relative" as const }}>
          <Reveal>
            <div className="t-eyebrow" style={{ marginBottom: 32 }}>
              {h.eyebrow}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1
              className="t-display"
              aria-live="polite"
              aria-atomic="true"
              style={{ fontSize: heroSize, maxWidth: 1180, margin: 0, lineHeight: 0.98, color: "var(--m-ink)", minHeight: "1.1em" }}
            >
              {displayedText}
            </h1>
            <p className="t-display" style={{ fontSize: heroSize, maxWidth: 1180, margin: "4px 0 0", lineHeight: 0.98, color: "var(--m-ink)" }}>
              {subtitleBlackWords}
            </p>
            <p className="t-display" style={{ fontSize: heroSize, maxWidth: 1180, margin: "4px 0 0", lineHeight: 0.98, color: "#000776" }}>
              {subtitleNavyWords}
            </p>
          </Reveal>
          <Reveal delay={160}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 64, marginTop: 56, alignItems: "end" }} className="m-home-leadgrid">
              <p className="t-lead" style={{ maxWidth: 580, margin: 0 }}>{h.heroLead}</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" as const }}>
                <Link href={`/${lang}/contact`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 20px", fontSize: 14, fontWeight: 600, color: "white", background: "var(--m-purple)", borderRadius: 999, textDecoration: "none" }}>
                  {t.nav.cta}
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
                </Link>
                <Link href={`/${lang}/about`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 20px", fontSize: 14, fontWeight: 600, color: "var(--m-purple)", background: "transparent", border: "1.5px solid var(--m-purple)", borderRadius: 999, textDecoration: "none" }}>
                  {t.common.learnMore}
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: "80px 0 100px" }}>
        <div className="container">
          <div className="t-eyebrow" style={{ marginBottom: 24 }}>
            {t.common.youAre}…
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }} className="m-triple-grid">
            <DualEntryCard data={h.entryEnterprise} href={`/${lang}/enterprise`} tone="dark" />
            <DualEntryCard data={h.entryOf} href={`/${lang}/of`} tone="purple" />
            <DualEntryCard data={h.entrySolutions} href={`/${lang}/solutions`} tone="light" bg="#e0e1ee" />
          </div>
        </div>
      </section>

      <section style={{ padding: "100px 0", background: "var(--m-bg-soft)", borderTop: "1px solid var(--m-line)", borderBottom: "1px solid var(--m-line)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80 }} className="m-split-grid">
            <SectionHeader eyebrow={lang === "fr" ? "Différenciation" : "What sets us apart"} title={h.diffTitle} lead={h.diffLead} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--m-line)", border: "1px solid var(--m-line)", borderRadius: 16, overflow: "hidden" }} className="m-diff-grid">
              {h.differentiation.map((d, i) => (
                <div key={i} style={{ background: "white", padding: 32 }}>
                  <div style={{ fontFamily: "var(--f-display)", color: "var(--m-purple)", fontSize: 14 }}>{d.n}</div>
                  <h4 style={{ fontFamily: "var(--f-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", margin: "10px 0 12px" }}>{d.title}</h4>
                  <p style={{ color: "var(--m-ink-3)", fontSize: 15, lineHeight: 1.55, margin: 0 }}>{d.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "120px 0" }}>
        <div className="container">
          <div className="t-eyebrow" style={{ marginBottom: 28, textAlign: "center" as const }}>
            {h.promiseTitle}
          </div>
          <blockquote style={{
            margin: 0,
            maxWidth: 980,
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
            fontFamily: "var(--f-display)",
            fontSize: "clamp(22px, 3vw, 38px)",
            fontWeight: 400,
            lineHeight: 1.2,
            letterSpacing: "-0.015em",
            color: "var(--m-ink)",
          }}>
            <span style={{ fontFamily: "var(--f-display)", color: "var(--m-purple)", fontSize: "1.4em", lineHeight: 0, verticalAlign: "-0.2em", marginRight: 8 }}>&ldquo;</span>
            {h.promiseBody}
            <span style={{ fontFamily: "var(--f-display)", color: "var(--m-purple)", fontSize: "1.4em", lineHeight: 0, verticalAlign: "-0.2em", marginLeft: 4 }}>&rdquo;</span>
          </blockquote>
          <p style={{ textAlign: "center", marginTop: 28, color: "var(--m-ink-3)", fontFamily: "var(--f-display)", fontSize: 18 }}>{h.promiseSig}</p>
        </div>
      </section>

      <ProofSection proofs={h.proofs} proofTitle={h.proofTitle} proofNote={h.proofNote} />

      <FinalCTA t={t} title={h.finalCtaTitle} lead={h.finalCtaLead} lang={lang} accent="purple" />
      <FeaturedInsights pageKey="enterprise" lang={lang} />
    </PageShell>
  );
}
