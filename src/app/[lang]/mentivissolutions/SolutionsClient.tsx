"use client";
import Link from "next/link";
import Image from "next/image";
import ImageHero from "@/components/ImageHero";
import FinalCTA from "@/components/FinalCTA";
import FeaturedInsights from "@/components/FeaturedInsights";
import SectionHeader from "@/components/SectionHeader";
import PageShell from "@/components/layout/PageShell";
import JsonLd from "@/components/JsonLd";
import { useMessages } from "@/lib/messages";
import { SITE } from "@/lib/config";
import { encodeEntities } from "@/lib/utils";
import Icon from "@/components/ui/Icon";

export default function SolutionsClient() {
  const { t, lang } = useMessages();
  const s = t.solutions;

  return (
    <PageShell hidePreFooterCTA>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: lang === "fr" ? "Solutions digitales formation" : "Digital training solutions",
        description: s.heroLead,
        provider: { "@id": `${SITE.baseUrl}/#organization` },
        url: `${SITE.baseUrl}/${lang}/solutions`,
        image: `${SITE.baseUrl}/images/heroes/teamflash.avif`,
        areaServed: { "@type": "Country", name: "France" },
        inLanguage: lang === "fr" ? "fr-FR" : "en-US",
      }} />
      <ImageHero
        image="/images/heroes/teamflash.avif"
        eyebrow={s.eyebrow}
        title={<><span style={{ color: "white" }}>{s.heroTitle[0]}</span>{" "}<em style={{ color: "white" }}>{s.heroTitle[1]}</em>{" "}<span style={{ color: "white" }}>{s.heroTitle[2]}</span></>}
        lead={s.heroLead}
      >
        <Link href={`/${lang}/contact`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, color: "white", background: "var(--m-purple)", borderRadius: 12, textDecoration: "none" }}>
          {t.nav.cta}
          <Icon name="chevron_right" size={18} />
        </Link>
        <a href={`/${lang}/mentivis-solutions`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, color: "white", background: "transparent", border: "1.5px solid rgba(255,255,255,0.45)", borderRadius: 12, textDecoration: "none" }}>
          {lang === "fr" ? "Voir plus" : "Explore"}
          <Icon name="chevron_right" size={18} />
        </a>
      </ImageHero>

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
                  <Icon name={x.icon as any} size={22} />
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

      {/* Sectors */}
      <section style={{ padding: "100px 0", background: "var(--m-bg-soft)", borderTop: "1px solid var(--m-line)" }}>
        <div className="container">
          <SectionHeader eyebrow={s.sectorsTitle.eyebrow} title={s.sectorsTitle.title} lead={s.sectorsTitle.lead} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginTop: 56 }} className="m-grid-2">
            {s.sectors.map((sec: any, i: number) => (
              <div key={i} style={{
                padding: 32,
                border: "1px solid var(--m-line)",
                borderRadius: 16,
                background: "white",
                display: "flex",
                flexDirection: "column" as const,
                gap: 16,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "var(--m-purple-soft)",
                  color: "var(--m-purple)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name={sec.icon as any} size={22} />
                </div>
                <div>
                  <h4 style={{ fontFamily: "var(--f-display)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", margin: "0 0 8px" }}>{sec.title}</h4>
                  <p style={{ color: "var(--m-ink-3)", fontSize: 15, lineHeight: 1.55, margin: 0 }}>{sec.body}</p>
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
                    <Icon name={i === 0 ? "architecture" : i === 1 ? "code_blocks" : "neurology"} size={36} />
                  </div>
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(24px, 2.5vw, 32px)", fontWeight: 500, letterSpacing: "-1px", margin: 0, lineHeight: 1.1 }}>{p.title}</h3>
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

      {/* Julie Steiner */}
      <section style={{ padding: "100px 0", background: "var(--m-bg-soft)", borderTop: "1px solid var(--m-line)" }}>
        <div className="container">
          <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 500, letterSpacing: "-1.5px", lineHeight: 1.1, margin: "0 0 48px" }}>
            {lang === "fr" ? "Votre interlocutrice pour vos projets" : "Your contact for your projects"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 48, alignItems: "start" }} className="m-julie-row">
            <div style={{ aspectRatio: "1 / 1", position: "relative", overflow: "hidden", borderRadius: 16 }}>
              <Image
                src="/images/team/julie-steiner.webp"
                alt={s.julie.name}
                fill
                style={{ objectFit: "cover" }}
                sizes="260px"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 14, paddingTop: 4 }}>
              <div>
                <h3 style={{ fontFamily: "var(--f-display)", fontSize: 22, fontWeight: 500, letterSpacing: "-0.5px", margin: "0 0 4px" }}>{s.julie.name}</h3>
                <p style={{ fontSize: 14, color: "var(--m-purple)", fontWeight: 600, margin: 0 }}>Partner Mentivis</p>
              </div>
              <p style={{ color: "var(--m-ink-3)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>{s.julie.body}</p>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, fontSize: 14, color: "var(--m-ink-3)", marginTop: 4 }}>
                <Link href={`/${lang}/contact`} className="m-footer-link" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Icon name="mail" size={16} />
                  <span dangerouslySetInnerHTML={{ __html: encodeEntities(SITE.email) }} />
                </Link>
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="m-footer-link" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Icon name="phone" size={16} />
                  <span dangerouslySetInnerHTML={{ __html: encodeEntities(SITE.phone) }} />
                </a>
                <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="m-footer-link" style={{ display: "inline-flex", alignItems: "flex-start", gap: 8, lineHeight: 1.45 }}>
                  <Icon name="location_on" size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span dangerouslySetInnerHTML={{ __html: encodeEntities(SITE.address) }} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA t={t} title={s.finalCta} lang={lang} accent="purple" />
      <FeaturedInsights pageKey="solutions" lang={lang} />
    </PageShell>
  );
}
