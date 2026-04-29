"use client";
import Link from "next/link";
import PillarCard from "@/components/PillarCard";
import FinalCTA from "@/components/FinalCTA";
import SectionHeader from "@/components/SectionHeader";
import PageShell from "@/components/layout/PageShell";
import { useMessages } from "@/lib/messages";

export default function AboutPage() {
  const { t, lang } = useMessages();
  const a = t.about;

  return (
    <PageShell>
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: 560,
          backgroundImage: "url(/site-images/twowomen.avif)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: 140, paddingBottom: 100, textAlign: "left" }}>
          <div className="t-eyebrow" style={{ marginBottom: 28, color: "white" }}>
            {a.eyebrow}
          </div>
          <h1 className="t-display" style={{ fontSize: "clamp(32px, 5vw, 68px)", maxWidth: 720, margin: 0, color: "white" }}>
            <span style={{ color: "white" }}>{a.title[0]}</span>{" "}
            <em style={{ color: "white" }}>{a.title[1]}</em>
          </h1>
          <p className="t-lead" style={{ marginTop: 28, maxWidth: 560, color: "rgba(255,255,255,0.9)" }}>
            {a.lead}
          </p>
          <div style={{ marginTop: 36, textAlign: "left" }}>
            <Link href={`/${lang}/contact`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 20px", fontSize: 14, fontWeight: 600, color: "white", background: "var(--m-purple)", borderRadius: 999, textDecoration: "none" }}>
              {t.nav.cta}
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80, alignItems: "start" }} className="m-split-grid">
            <SectionHeader eyebrow="01 - Identité" title={a.missionTitle} />
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 24 }}>
              {a.mission.map((m, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 20, paddingBottom: 24, borderBottom: i < a.mission.length - 1 ? "1px solid var(--m-line)" : "none" }}>
                  <div style={{ fontFamily: "var(--f-display)", color: "var(--m-purple)", fontSize: 18 }}>0{i + 1}</div>
                  <p style={{ fontSize: 19, color: "var(--m-ink)", margin: 0, lineHeight: 1.45, fontFamily: "var(--f-display)", letterSpacing: "-0.005em" }}>{m}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container"><div className="rule" /></div>

      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="02 - Expertises" title={a.expertiseTitle} lead={a.expertiseLead} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, marginTop: 56 }} className="m-grid-2">
            {a.expertise.map((e, i) => (
              <PillarCard key={i} n={e.n} title={e.title} body={e.body} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "100px 0", background: "var(--m-bg-soft)", borderTop: "1px solid var(--m-line)", borderBottom: "1px solid var(--m-line)" }}>
        <div className="container">
          <SectionHeader eyebrow="03 - Pourquoi" title={a.whyTitle} lead={a.whyLead} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, marginTop: 56, border: "1px solid var(--m-line)", borderRadius: 16, overflow: "hidden", background: "white" }} className="m-grid-4">
            {a.why.map((w, i) => (
              <div key={i} style={{ padding: 32, borderRight: i < a.why.length - 1 ? "1px solid var(--m-line)" : "none" }}>
                <div style={{ fontFamily: "var(--f-display)", color: "var(--m-purple)", fontSize: 14, marginBottom: 12 }}>0{i + 1}</div>
                <h4 style={{ fontFamily: "var(--f-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", margin: "0 0 10px" }}>{w.title}</h4>
                <p style={{ color: "var(--m-ink-3)", fontSize: 14.5, margin: 0, lineHeight: 1.55 }}>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80 }} className="m-split-grid">
            <SectionHeader eyebrow="04 - Tarification" title={a.costTitle} lead={a.costLead} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="m-grid-2">
              {a.cost.map((c, i) => (
                <div key={i} style={{ borderTop: "1px solid var(--m-ink)", paddingTop: 18 }}>
                  <h4 style={{ fontFamily: "var(--f-display)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px", margin: "0 0 8px" }}>{c.title}</h4>
                  <p style={{ color: "var(--m-ink-3)", fontSize: 15, margin: 0, lineHeight: 1.5 }}>{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FinalCTA t={t} title={t.home.finalCtaTitle} lead={t.home.finalCtaLead} lang={lang} accent="ink" />
    </PageShell>
  );
}
