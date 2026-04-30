"use client";
import Link from "next/link";
import FinalCTA from "@/components/FinalCTA";

import PageShell from "@/components/layout/PageShell";
import { useMessages } from "@/lib/messages";

export default function SolutionsPage() {
  const { t, lang } = useMessages();
  const s = t.solutions;

  return (
    <PageShell>
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: 560,
          backgroundImage: "url(/images/heroes/teamflash.avif)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: 140, paddingBottom: 100, textAlign: "left" }}>
          <div className="t-eyebrow" style={{ marginBottom: 28, color: "white" }}>
            {s.eyebrow}
          </div>
          <h1 className="t-display" style={{ fontSize: "clamp(32px, 5vw, 68px)", maxWidth: 1080, margin: 0, color: "white" }}>
            <span style={{ color: "white" }}>{s.heroTitle[0]}</span>{" "}
            <em style={{ color: "white" }}>{s.heroTitle[1]}</em>{" "}
            <span style={{ color: "white" }}>{s.heroTitle[2]}</span>
          </h1>
          <p className="t-lead" style={{ marginTop: 28, maxWidth: 680, color: "rgba(255,255,255,0.9)" }}>
            {s.heroLead}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const, marginTop: 36 }}>
            <Link href={`/${lang}/contact`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 20px", fontSize: 14, fontWeight: 600, color: "white", background: "var(--m-purple)", borderRadius: 999, textDecoration: "none" }}>
              {t.nav.cta}
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
            </Link>
            <Link href={`/${lang}/solutions#solutions-pillars`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 20px", fontSize: 14, fontWeight: 600, color: "white", background: "transparent", border: "1.5px solid rgba(255,255,255,0.45)", borderRadius: 999, textDecoration: "none" }}>
              {lang === "fr" ? "Nos approches" : "Our approaches"}
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "20px 0 80px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 0 }} className="m-grid-3">
            {[
              { label: lang === "fr" ? "Conception" : "Design", icon: "architecture" },
              { label: lang === "fr" ? "Développement" : "Development", icon: "code_blocks" },
              { label: lang === "fr" ? "IA appliquée" : "Applied AI", icon: "neurology" },
            ].map((x, i) => (
              <div key={i} style={{
                padding: "26px 28px",
                border: "1px solid var(--m-line)",
                borderRadius: 14,
                background: "white",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "var(--m-purple-soft)",
                  color: "var(--m-purple)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{x.icon}</span>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "var(--m-ink-4)", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>0{i + 1}</div>
                  <div style={{ fontFamily: "var(--f-display)", fontSize: 20, letterSpacing: "-0.01em" }}>{x.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="solutions-pillars">
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 24 }}>
            {s.pillars.map((p, i) => (
              <article key={i} style={{
                display: "grid",
                gridTemplateColumns: "180px 1fr 1.2fr",
                gap: 48,
                padding: "48px 0",
                borderTop: "1px solid var(--m-ink)",
                alignItems: "start",
              }} className="m-solution-row">
                <div>
                  <div style={{ fontFamily: "var(--f-display)", color: "var(--m-purple)", fontSize: 22 }}>{p.n}</div>
                  <div style={{
                    marginTop: 14, width: 80, height: 80, borderRadius: 16,
                    background: "var(--m-purple-soft)", display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--m-purple)",
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 36 }}>
                      {i === 0 ? "architecture" : i === 1 ? "code_blocks" : "neurology"}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(24px, 2.5vw, 32px)", fontWeight: 700, letterSpacing: "-1px", margin: 0, lineHeight: 1.1 }}>{p.title}</h3>
                  <p style={{ color: "var(--m-ink-3)", fontSize: 16.5, lineHeight: 1.55, margin: "16px 0 0", maxWidth: 360 }}>{p.body}</p>
                </div>
                <ul className="dot-list" style={{ marginTop: 4 }}>
                  {p.items.map((it, j) => <li key={j} style={{ fontSize: 16 }}>{it}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA t={t} title={s.finalCta} lang={lang} accent="purple" />
    </PageShell>
  );
}
