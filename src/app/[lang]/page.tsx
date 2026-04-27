"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import PillarCard from "@/components/PillarCard";
import FinalCTA from "@/components/FinalCTA";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import DualEntryCard from "@/components/DualEntryCard";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import fr from "@/messages/fr.json";
import en from "@/messages/en.json";

const messages: Record<string, typeof fr> = { fr, en };

function HomeHeroBackdrop() {
  return (
    <div aria-hidden="true" style={{
      position: "absolute" as const,
      inset: 0,
      pointerEvents: "none" as const,
      overflow: "hidden",
    }}>
      <svg style={{ position: "absolute" as const, top: 80, right: -120, width: 580, height: 580, opacity: 0.55 }} viewBox="0 0 400 400">
        <defs>
          <radialGradient id="hh-r" cx="0.4" cy="0.4" r="0.7">
            <stop offset="0%" stopColor="#6b73d6" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#000776" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#000776" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="180" fill="url(#hh-r)" />
        {[40, 70, 100, 130, 160, 190].map((r, i) => (
          <circle key={i} cx="200" cy="200" r={r} fill="none" stroke="rgba(0,7,118,0.10)" strokeWidth="0.8" />
        ))}
      </svg>
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
  const params = useParams();
  const lang = (params?.lang as string) || "fr";
  const t = messages[lang] || messages.fr;
  const h = t.home;

  return (
    <main className="page-shell">
      <TopNav t={t as any} lang={lang} setLang={() => {}} route="" />
      <section style={{ paddingTop: 96, paddingBottom: 40, position: "relative" as const, overflow: "hidden" }}>
        <HomeHeroBackdrop />
        <div className="container" style={{ position: "relative" as const }}>
          <Reveal>
            <div className="t-eyebrow" style={{ marginBottom: 32 }}>
              <span className="dot" />{h.eyebrow}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="t-display" style={{ fontSize: "clamp(48px, 8vw, 116px)", maxWidth: 1180, margin: 0, lineHeight: 0.98 }}>
              {h.heroTitle[0]}<br />
              {h.heroTitle[1]}<br />
              {h.heroTitle[2]}<em>{h.heroTitle[3]}</em>{h.heroTitle[4]}
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 64, marginTop: 56, alignItems: "end" }} className="m-home-leadgrid">
              <p className="t-lead" style={{ maxWidth: 580, margin: 0 }}>{h.heroLead}</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" as const }}>
                <Link href={`/${lang}/contact`} className="btn btn-primary">{t.nav.cta} →</Link>
                <Link href={`/${lang}/about`} className="btn btn-outline">{t.common.learnMore}</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: "80px 0 100px" }}>
        <div className="container">
          <div className="t-eyebrow" style={{ marginBottom: 24 }}>
            <span className="dot" />{t.common.youAre}…
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="m-dual-grid">
            <DualEntryCard data={h.entryEnterprise} href={`/${lang}/enterprise`} tone="dark" />
            <DualEntryCard data={h.entryOf} href={`/${lang}/of`} tone="purple" />
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
            <span className="dot" />{h.promiseTitle}
          </div>
          <blockquote style={{
            margin: 0,
            maxWidth: 980,
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
            fontFamily: "var(--f-display)",
            fontSize: "clamp(28px, 3.6vw, 48px)",
            fontWeight: 400,
            lineHeight: 1.2,
            letterSpacing: "-0.015em",
            color: "var(--m-ink)",
          }}>
            <span style={{ fontFamily: "var(--f-display)", color: "var(--m-purple)", fontSize: "1.4em", lineHeight: 0, verticalAlign: "-0.2em", marginRight: 8 }}>"</span>
            {h.promiseBody}
            <span style={{ fontFamily: "var(--f-display)", color: "var(--m-purple)", fontSize: "1.4em", lineHeight: 0, verticalAlign: "-0.2em", marginLeft: 4 }}>"</span>
          </blockquote>
          <p style={{ textAlign: "center", marginTop: 28, color: "var(--m-ink-3)", fontFamily: "var(--f-display)", fontSize: 18 }}>{h.promiseSig}</p>
        </div>
      </section>

      <section style={{ padding: "100px 0", background: "var(--m-ink)", color: "white" }}>
        <div className="container">
          <div className="t-eyebrow" style={{ marginBottom: 28, color: "rgba(255,255,255,0.6)" }}>
            <span className="dot" style={{ background: "white" }} />{h.proofTitle}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, overflow: "hidden", marginTop: 24 }} className="m-proof-grid">
            {h.proofs.map((p, i) => (
              <div key={i} style={{ background: "var(--m-ink)", padding: "44px 32px" }}>
                <div style={{
                  fontFamily: "var(--f-display)",
                  fontWeight: 700,
                  fontSize: "clamp(56px, 7vw, 96px)",
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
          <p style={{ marginTop: 24, color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{h.proofNote}</p>
        </div>
      </section>

      <FinalCTA t={t as any} title={h.finalCtaTitle} lead={h.finalCtaLead} lang={lang} accent="purple" />
      <Footer t={t as any} lang={lang} />
    </main>
  );
}