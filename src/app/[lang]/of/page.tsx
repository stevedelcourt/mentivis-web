"use client";
import Link from "next/link";
import Image from "next/image";
import ImageHero from "@/components/ImageHero";
import PillarCard from "@/components/PillarCard";
import FinalCTA from "@/components/FinalCTA";
import FeaturedInsights from "@/components/FeaturedInsights";
import SectionHeader from "@/components/SectionHeader";
import PageShell from "@/components/layout/PageShell";
import JsonLd from "@/components/JsonLd";
import { useMessages } from "@/lib/messages";
import { SITE } from "@/lib/config";
import Icon from "@/components/ui/Icon";

export default function OfPage() {
  const { t, lang } = useMessages();
  const o = t.of;

  return (
    <PageShell hidePreFooterCTA>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: lang === "fr" ? "Conseil organismes de formation" : "Training organisation consulting",
        description: o.heroLead,
        provider: { "@id": `${SITE.baseUrl}/#organization` },
        url: `${SITE.baseUrl}/${lang}/of`,
        image: `${SITE.baseUrl}/images/heroes/of.avif`,
        areaServed: { "@type": "Country", name: "France" },
        inLanguage: lang === "fr" ? "fr-FR" : "en-US",
      }} />
      <ImageHero
        image="/images/heroes/of.avif"
        eyebrow={o.eyebrow}
        title={<><span style={{ color: "white" }}>{o.heroTitle[0]}</span>{" "}<span style={{ color: "white" }}>{o.heroTitle[1]}</span>{" "}<span style={{ color: "white" }}>{o.heroTitle[2]}</span>{" "}<span style={{ color: "white" }}>{o.heroTitle[3]}</span></>}
        lead={o.heroLead}
      >
        <Link href={`/${lang}/contact`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 20px", fontSize: 14, fontWeight: 600, color: "white", background: "var(--m-purple)", borderRadius: 999, textDecoration: "none" }}>
          {t.nav.cta}
          <Icon name="chevron_right" size={18} />
        </Link>
        <Link href={`/${lang}/of#pillars`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 20px", fontSize: 14, fontWeight: 600, color: "white", background: "transparent", border: "1.5px solid white", borderRadius: 999, textDecoration: "none" }}>
          {lang === "fr" ? "Voir les pôles" : "View pillars"}
          <Icon name="chevron_right" size={18} />
        </Link>
      </ImageHero>

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
              05 - {lang === "fr" ? "Externalisation" : "Outsourcing"}
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
                  <Icon name={s.icon as any} size={22} style={{ color: "#6b73d6" }} />
                  <span style={{ fontFamily: "var(--f-display)", color: "#6b73d6", fontSize: 14 }}>0{i + 1}</span>
                </div>
                <h4 style={{ fontFamily: "var(--f-display)", fontSize: 22, fontWeight: 500, letterSpacing: "-0.5px", margin: "0 0 10px", color: "white" }}>{s.title}</h4>
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
              fontWeight: 500,
            }}>%</div>
            <div>
              <h4 style={{ fontFamily: "var(--f-display)", fontSize: 24, fontWeight: 500, letterSpacing: "-0.5px", margin: "0 0 8px", color: "white" }}>{o.paymentTitle}</h4>
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
                  <span style={{ fontFamily: "var(--f-display)", fontSize: 22, fontWeight: 500, letterSpacing: "-0.5px", color: "var(--m-ink)", lineHeight: 1.3 }}>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 48, alignItems: "center", marginTop: 80, padding: "40px 0", borderTop: "1px solid var(--m-line)" }} className="m-split-grid">
            <div style={{ borderRadius: 16, overflow: "hidden", background: "var(--m-bg-soft)" }}>
              <Image src="/guide-images/bpf.avif" alt="Guides de référence" width={560} height={320} style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
            <div>
              <div className="t-eyebrow" style={{ marginBottom: 16 }}>{lang === "fr" ? "Ressources" : "Resources"}</div>
              <h3 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 500, letterSpacing: "-0.5px", lineHeight: 1.15, margin: "0 0 16px", color: "var(--m-ink)" }}>
                {lang === "fr" ? "Les guides pratiques pour structurer votre organisme" : "Practical guides to structure your organization"}
              </h3>
              <p style={{ color: "var(--m-ink-3)", fontSize: 16, lineHeight: 1.55, margin: "0 0 24px", maxWidth: 480 }}>
                {lang === "fr" ? "BPF, FSE+, POEI, CPF, conventions de formation, taxe d'apprentissage - six guides concrets pour sécuriser votre conformité et optimiser vos financements." : "BPF, FSE+, POEI, CPF, training agreements, apprenticeship tax - six concrete guides to secure your compliance and optimize your funding."}
              </p>
              <Link href={`/${lang}/guides`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 20px", fontSize: 14, fontWeight: 600, color: "white", background: "var(--m-purple)", borderRadius: 999, textDecoration: "none" }}>
                {lang === "fr" ? "Consulter les guides" : "Browse the guides"}
                <Icon name="chevron_right" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA t={t} title={o.finalCta} lang={lang} accent="purple" />
      <FeaturedInsights pageKey="of" lang={lang} />
    </PageShell>
  );
}
