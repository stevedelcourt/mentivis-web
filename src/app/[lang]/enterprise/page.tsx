"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import PillarCard from "@/components/PillarCard";
import FinalCTA from "@/components/FinalCTA";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import fr from "@/messages/fr.json";
import en from "@/messages/en.json";

const messages: Record<string, typeof fr> = { fr, en };

export default function EnterprisePage() {
  const params = useParams();
  const lang = (params?.lang as string) || "fr";
  const t = messages[lang] || messages.fr;
  const e = t.enterprise;

  return (
    <main className="page-shell">
      <TopNav t={t as any} lang={lang} setLang={() => {}} route="" />
      <PageHero
        eyebrow={e.eyebrow}
        titleParts={[e.heroTitle[0], e.heroTitle[1], e.heroTitle[2]]}
        accentIndices={[1]}
        lead={e.heroLead}
      >
        <Link href={`/${lang}/contact`} className="btn btn-primary">{t.nav.cta} →</Link>
      </PageHero>

      <section style={{ padding: "80px 0", background: "var(--m-bg-soft)", borderTop: "1px solid var(--m-line)", borderBottom: "1px solid var(--m-line)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80 }} className="m-split-grid">
            <SectionHeader eyebrow={lang === "fr" ? "État des lieux" : "The reality"} title={e.problemsTitle} />
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {e.problems.map((p, i) => (
                <li key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 20, padding: "20px 0", borderBottom: i < e.problems.length - 1 ? "1px solid var(--m-line)" : "none" }}>
                  <div style={{ fontFamily: "var(--f-display)", color: "var(--m-ink-4)", fontSize: 18 }}>—</div>
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
            {e.pillars.map((p, i) => (
              <PillarCard key={i} n={p.n} title={p.title} body={p.body} items={p.items} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "100px 0", background: "var(--m-ink)", color: "white" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }} className="m-grid-2">
            <div>
              <div className="t-eyebrow" style={{ marginBottom: 20, color: "rgba(255,255,255,0.6)" }}>
                <span className="dot" style={{ background: "white" }} />{lang === "fr" ? "Résultats" : "Results"}
              </div>
              <h3 className="t-display" style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "white", margin: 0 }}>{e.resultsTitle}</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: "32px 0 0" }}>
                {e.results.map((r, i) => (
                  <li key={i} style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", fontSize: 16, lineHeight: 1.5 }}>{r}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="t-eyebrow" style={{ marginBottom: 20, color: "#6b73d6" }}>
                <span className="dot" style={{ background: "#6b73d6" }} />{lang === "fr" ? "Mentivis" : "Mentivis"}
              </div>
              <h3 className="t-display" style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "white", margin: 0 }}>{e.whyTitle}</h3>
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

      <FinalCTA t={t as any} title={e.finalCta} lang={lang} accent="purple" />
      <Footer t={t as any} lang={lang} />
    </main>
  );
}