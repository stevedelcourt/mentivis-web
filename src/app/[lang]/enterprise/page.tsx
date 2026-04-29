"use client";
import Link from "next/link";
import Image from "next/image";
import PillarCard from "@/components/PillarCard";
import FinalCTA from "@/components/FinalCTA";
import SectionHeader from "@/components/SectionHeader";
import PageShell from "@/components/layout/PageShell";
import { useMessages } from "@/lib/messages";

export default function EnterprisePage() {
  const { t, lang } = useMessages();
  const e = t.enterprise;

  return (
    <PageShell>
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: 560,
          backgroundImage: "url(/site-images/investor.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: 140, paddingBottom: 100, textAlign: "left" }}>
          <div className="t-eyebrow" style={{ marginBottom: 28, color: "white", textAlign: "left" }}>
            {e.eyebrow}
          </div>
          <h1 className="t-display" style={{ fontSize: "clamp(32px, 5vw, 68px)", maxWidth: 720, margin: 0, color: "white", textAlign: "left" }}>
            <span style={{ color: "white" }}>{e.heroTitle[0]}</span><br />
            <em style={{ color: "white" }}>{e.heroTitle[1]}</em>
          </h1>
          <p className="t-lead" style={{ marginTop: 28, maxWidth: 560, color: "rgba(255,255,255,0.9)", textAlign: "left" }}>{e.heroLead}</p>
          <div style={{ marginTop: 36, textAlign: "left" }}>
            <Link href={`/${lang}/contact`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 20px", fontSize: 14, fontWeight: 600, color: "var(--m-purple)", background: "white", borderRadius: 999, textDecoration: "none" }}>
              {t.nav.cta}
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 0", background: "var(--m-bg-soft)", borderTop: "1px solid var(--m-line)", borderBottom: "1px solid var(--m-line)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80 }} className="m-split-grid">
            <SectionHeader eyebrow={lang === "fr" ? "État des lieux" : "The reality"} title={e.problemsTitle} />
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {e.problems.map((p, i) => (
                <li key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 20, padding: "20px 0", borderBottom: i < e.problems.length - 1 ? "1px solid var(--m-line)" : "none" }}>
                  <div style={{ fontFamily: "var(--f-display)", color: "var(--m-ink-4)", fontSize: 18 }}>-</div>
                  <span style={{ fontSize: 17, color: "var(--m-ink-2)", lineHeight: 1.5 }}>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader eyebrow={lang === "fr" ? "Axes d'intervention" : "Intervention axes"} title={e.pillarsTitle} lead={e.pillarsLead} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, marginTop: 56 }} className="m-grid-2">
            {e.pillars.map((p, i) => {
              const icons = ["lightbulb", "engineering", "folder_open", "rocket_launch"];
              return (
                <PillarCard key={i} n={p.n} title={p.title} body={p.body} items={p.items} icon={icons[i]} />
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ padding: "100px 0", background: "var(--m-ink)", color: "white" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }} className="m-grid-2">
            <div>
              <div className="t-eyebrow" style={{ marginBottom: 20, color: "rgba(255,255,255,0.6)" }}>
                {lang === "fr" ? "Résultats" : "Results"}
              </div>
              <h3 className="t-display" style={{ fontSize: "clamp(26px, 3.5vw, 40px)", color: "white", margin: 0 }}>{e.resultsTitle}</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: "32px 0 0" }}>
                {e.results.map((r, i) => (
                  <li key={i} style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", fontSize: 16, lineHeight: 1.5 }}>{r}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="t-eyebrow" style={{ marginBottom: 20, color: "#6b73d6" }}>
                Mentivis
              </div>
              <h3 className="t-display" style={{ fontSize: "clamp(26px, 3.5vw, 40px)", color: "white", margin: 0 }}>{e.whyTitle}</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: "32px 0 0" }}>
                {e.why.map((w, i) => (
                  <li key={i} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 14, padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.95)", fontSize: 16, lineHeight: 1.5 }}>
                    <span style={{ color: "#6b73d6" }}>→</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 48, alignItems: "center", padding: "40px 0", borderTop: "1px solid var(--m-line)" }} className="m-split-grid">
            <div style={{ borderRadius: 16, overflow: "hidden", background: "var(--m-bg-soft)" }}>
              <Image src="/score.webp" alt="Score Formation" width={560} height={320} style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
            <div>
              <div className="t-eyebrow" style={{ marginBottom: 16 }}>{e.scoreTeaserEyebrow}</div>
              <h3 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700, letterSpacing: "-0.5px", lineHeight: 1.15, margin: "0 0 16px", color: "var(--m-ink)" }}>
                {e.scoreTeaserTitle}
              </h3>
              <p style={{ color: "var(--m-ink-3)", fontSize: 16, lineHeight: 1.55, margin: "0 0 24px", maxWidth: 480 }}>
                {e.scoreTeaserBody}
              </p>
              <Link href={`/${lang}/score-formation`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 20px", fontSize: 14, fontWeight: 600, color: "white", background: "var(--m-purple)", borderRadius: 999, textDecoration: "none" }}>
                {e.scoreTeaserCta}
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA t={t} title={e.finalCta} lang={lang} accent="purple" />
    </PageShell>
  );
}
