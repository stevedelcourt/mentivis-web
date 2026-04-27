"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import FinalCTA from "@/components/FinalCTA";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import fr from "@/messages/fr.json";
import en from "@/messages/en.json";

const messages: Record<string, typeof fr> = { fr, en };

export default function SolutionsPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "fr";
  const t = messages[lang] || messages.fr;
  const s = t.solutions;

  return (
    <main className="page-shell">
      <TopNav t={t as any} lang={lang} setLang={() => {}} route="" />
      <PageHero
        eyebrow={s.eyebrow}
        titleParts={[s.heroTitle[0], s.heroTitle[1], s.heroTitle[2]]}
        accentIndices={[1]}
        lead={s.heroLead}
      >
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
          <Link href={`/${lang}/contact`} className="btn btn-primary">{t.nav.cta} →</Link>
          <Link href={`/${lang}/solutions#solutions-pillars`} className="btn btn-outline">{lang === "fr" ? "Nos approches" : "Our approaches"}</Link>
        </div>
      </PageHero>

      <section style={{ padding: "20px 0 80px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 0 }} className="m-grid-3">
            {[
              { label: lang === "fr" ? "Conception" : "Design", icon: "□" },
              { label: lang === "fr" ? "Développement" : "Development", icon: "◇" },
              { label: lang === "fr" ? "IA appliquée" : "Applied AI", icon: "○" },
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
                  fontSize: 22, fontFamily: "var(--f-display)",
                }}>{x.icon}</div>
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
                    color: "var(--m-purple)", fontFamily: "var(--f-display)", fontSize: 36, fontWeight: 700,
                  }}>{i === 0 ? "□" : i === 1 ? "◇" : "○"}</div>
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(28px, 3vw, 38px)", fontWeight: 700, letterSpacing: "-1px", margin: 0, lineHeight: 1.1 }}>{p.title}</h3>
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

      <FinalCTA t={t as any} title={s.finalCta} lang={lang} accent="purple" />
      <Footer t={t as any} lang={lang} />
    </main>
  );
}