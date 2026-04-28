"use client";
import Link from "next/link";
import PillarCard from "@/components/PillarCard";
import FinalCTA from "@/components/FinalCTA";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import PageShell from "@/components/layout/PageShell";
import { useMessages } from "@/lib/messages";

export default function OfPage() {
  const { t, lang } = useMessages();
  const o = t.of;

  return (
    <PageShell>
      <PageHero
        eyebrow={o.eyebrow}
        titleParts={lang === "fr"
          ? [o.heroTitle[0] + " " + o.heroTitle[1], o.heroTitle[2], o.heroTitle[3]]
          : [o.heroTitle[0], o.heroTitle[1], o.heroTitle[2] + o.heroTitle[3]]}
        accentIndices={[1]}
        lead={o.heroLead}
      >
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
          <Link href={`/${lang}/contact`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 20px", fontSize: 14, fontWeight: 600, color: "white", background: "var(--m-purple)", borderRadius: 999, textDecoration: "none" }}>
            {t.nav.cta}
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
          </Link>
          <Link href={`/${lang}/of#pillars`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 20px", fontSize: 14, fontWeight: 600, color: "var(--m-purple)", background: "transparent", border: "1.5px solid var(--m-purple)", borderRadius: 999, textDecoration: "none" }}>
            {lang === "fr" ? "Voir les pôles" : "View pillars"}
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
          </Link>
        </div>
      </PageHero>

      <section className="section" id="pillars">
        <div className="container">
          <SectionHeader eyebrow={lang === "fr" ? "Pôles d'intervention" : "Pillars"} title={o.pillarsTitle} lead={o.pillarsLead} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, marginTop: 56 }} className="m-grid-2">
            {o.pillars.map((p, i) => {
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
          <div style={{ maxWidth: 800 }}>
            <div className="t-eyebrow" style={{ marginBottom: 24, color: "rgba(255,255,255,0.6)" }}>
              05 — {lang === "fr" ? "Externalisation" : "Outsourcing"}
            </div>
            <h2 className="t-display" style={{ fontSize: "clamp(28px, 4vw, 48px)", margin: 0, color: "white" }}>{o.externalisedTitle}</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 19, marginTop: 22, maxWidth: 720, lineHeight: 1.55 }}>{o.externalisedLead}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, overflow: "hidden", marginTop: 56 }} className="m-grid-3">
            {[
              { ...o.externalised[0], icon: "person_search" },
              { ...o.externalised[1], icon: "school" },
              { ...o.externalised[2], icon: "campaign" },
              { ...o.externalised[3], icon: "folder_open" },
              { ...o.externalised[4], icon: "verified" },
              { ...o.externalised[5], icon: "build" },
            ].map((s, i) => (
              <div key={i} style={{ background: "var(--m-ink)", padding: 32, minHeight: 180 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <span className="material-symbols-outlined" style={{ color: "#6b73d6", fontSize: 22 }}>{s.icon}</span>
                  <span style={{ fontFamily: "var(--f-display)", color: "#6b73d6", fontSize: 14 }}>0{i + 1}</span>
                </div>
                <h4 style={{ fontFamily: "var(--f-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", margin: "0 0 10px", color: "white" }}>{s.title}</h4>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14.5, margin: 0, lineHeight: 1.55 }}>{s.body}</p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 40,
            padding: "32px 36px",
            border: "1px solid rgba(107,115,214,0.3)",
            borderRadius: 16,
            background: "linear-gradient(135deg, rgba(0,7,118,0.28), rgba(0,7,118,0.06))",
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 28,
            alignItems: "center",
          }} className="m-payment-callout">
            <div style={{
              fontFamily: "var(--f-display)",
              fontStyle: "italic",
              fontSize: 56,
              color: "#6b73d6",
              lineHeight: 1,
              fontWeight: 700,
            }}>%</div>
            <div>
              <h4 style={{ fontFamily: "var(--f-display)", fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px", margin: "0 0 8px", color: "white" }}>{o.paymentTitle}</h4>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15.5, lineHeight: 1.55, margin: 0 }}>{o.paymentBody}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80 }} className="m-split-grid">
            <SectionHeader eyebrow={lang === "fr" ? "Résultats" : "Results"} title={o.resultsTitle} />
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {o.results.map((r, i) => (
                <li key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 20, padding: "22px 0", borderBottom: "1px solid var(--m-line)" }}>
                  <div style={{ fontFamily: "var(--f-display)", color: "var(--m-purple)", fontSize: 18 }}>0{i + 1}</div>
                  <span style={{ fontFamily: "var(--f-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: "var(--m-ink)", lineHeight: 1.3 }}>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <FinalCTA t={t} title={o.finalCta} lang={lang} accent="purple" />
    </PageShell>
  );
}
