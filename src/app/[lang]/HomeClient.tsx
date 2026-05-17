"use client";
import { useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ImageHero from "@/components/ImageHero";
import PillarCard from "@/components/PillarCard";
import SectionHeader from "@/components/SectionHeader";
import ScrollCardsSection from "@/components/ScrollCardsSection";
import PageShell from "@/components/layout/PageShell";
import JsonLd from "@/components/JsonLd";
import FaqSection from "@/components/FaqSection";
import { useMessages } from "@/lib/messages";
import { SITE } from "@/lib/config";
import Icon from "@/components/ui/Icon";

const FinalCTA = dynamic(() => import("@/components/FinalCTA"), { ssr: false });
const FeaturedInsights = dynamic(() => import("@/components/FeaturedInsights"), { ssr: false });

export default function HomeClient() {
  const { t, lang } = useMessages();
  const h = t.home;

  // Handle anchor scroll after hydration
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        const timeout = setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        return () => clearTimeout(timeout);
      }
    }
  }, []);

  return (
    <PageShell hidePreFooterCTA>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: h.title.join(" "),
        description: h.lead,
        url: `${SITE.baseUrl}/${lang}/`,
        mainEntity: { "@id": `${SITE.baseUrl}/#organization` },
        image: `${SITE.baseUrl}/images/heroes/two-women.avif`,
        inLanguage: lang === "fr" ? "fr-FR" : "en-US",
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: h.faq.items.map((item: { question: string; answer: string }) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }} />
      <ImageHero
        image="/images/heroes/two-women.avif"
        eyebrow={h.eyebrow}
        title={<><span style={{ color: "white" }}>{h.title[0]}</span><br /><em style={{ color: "white" }}>{h.title[1]}</em></>}
        lead={h.definition || h.lead}
      >
        <Link href={`/${lang}/contact?subject=Home`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, color: "white", background: "var(--m-purple)", borderRadius: 12, textDecoration: "none" }}>
          {t.nav.cta}
          <Icon name="chevron_right" size={18} />
        </Link>
      </ImageHero>

      <section className="section">
        <div className="container">
          <SectionHeader title={h.missionTitle} />
          <ol style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40, marginTop: 56, padding: 0, listStyle: "none" }} className="m-grid-3">
            {h.mission.map((m, i) => (
              <li key={i} style={{ borderTop: "1px solid var(--m-line)", paddingTop: 24 }}>
                <div style={{ fontFamily: "var(--f-display)", color: "var(--m-purple)", fontSize: 14, marginBottom: 12 }}>0{i + 1}</div>
                <p style={{ fontSize: 17, color: "var(--m-ink)", margin: 0, lineHeight: 1.5, fontFamily: "var(--f-display)", letterSpacing: "-0.005em" }}>{m}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ScrollCardsSection
        lang={lang}
        entries={{
          enterprise: h.entryEnterprise,
          of: h.entryOf,
          solutions: h.entrySolutions,
        }}
      />

      <div className="container"><div className="rule" /></div>

      <section className="section">
        <div className="container">
          <SectionHeader title={h.expertiseTitle} lead={h.expertiseLead} />
          <ol style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, marginTop: 56, padding: 0, listStyle: "none" }} className="m-grid-2">
            {h.expertise.map((e, i) => (
              <li key={i}><PillarCard n={e.n} title={e.title} body={e.body} /></li>
            ))}
          </ol>
        </div>
      </section>

      <section style={{ padding: "100px 0", background: "var(--m-bg-soft)", borderTop: "1px solid var(--m-line)", borderBottom: "1px solid var(--m-line)" }}>
        <div className="container">
          <SectionHeader title={h.whyTitle} lead={h.whyLead} />
          <ol style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, marginTop: 56, padding: 0, listStyle: "none", border: "1px solid var(--m-line)", borderRadius: 16, overflow: "hidden", background: "white" }} className="m-grid-4">
            {h.why.map((w, i) => (
              <li key={i} style={{ padding: 32, borderRight: i < h.why.length - 1 ? "1px solid var(--m-line)" : "none" }}>
                <div style={{ fontFamily: "var(--f-display)", color: "var(--m-purple)", fontSize: 14, marginBottom: 12 }}>0{i + 1}</div>
                <h4 style={{ fontFamily: "var(--f-display)", fontSize: 22, fontWeight: 500, letterSpacing: "-0.5px", margin: "0 0 10px" }}>{w.title}</h4>
                <p style={{ color: "var(--m-ink-3)", fontSize: 14.5, margin: 0, lineHeight: 1.55 }}>{w.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80 }} className="m-split-grid">
            <SectionHeader title={h.costTitle} lead={h.costLead} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="m-grid-2">
              {h.cost.map((c, i) => (
                <div key={i} style={{ borderTop: "1px solid var(--m-ink)", paddingTop: 18 }}>
                  <h4 style={{ fontFamily: "var(--f-display)", fontSize: 20, fontWeight: 500, letterSpacing: "-0.5px", margin: "0 0 8px" }}>{c.title}</h4>
                  <p style={{ color: "var(--m-ink-3)", fontSize: 15, margin: 0, lineHeight: 1.5 }}>{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "100px 0", background: "var(--m-bg-soft)", borderTop: "1px solid var(--m-line)", borderBottom: "1px solid var(--m-line)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80 }} className="m-split-grid">
            <SectionHeader eyebrow={lang === "fr" ? "Différenciation" : "What sets us apart"} title={h.diffTitle} lead={h.diffLead} />
            <ol style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, padding: 0, listStyle: "none", background: "var(--m-line)", border: "1px solid var(--m-line)", borderRadius: 16, overflow: "hidden" }} className="m-diff-grid">
              {h.differentiation.map((d, i) => (
                <li key={i} style={{ background: "white", padding: 32 }}>
                  <div style={{ fontFamily: "var(--f-display)", color: "var(--m-purple)", fontSize: 14 }}>{d.n}</div>
                  <h4 style={{ fontFamily: "var(--f-display)", fontSize: 22, fontWeight: 500, letterSpacing: "-0.5px", margin: "10px 0 12px" }}>{d.title}</h4>
                  <p style={{ color: "var(--m-ink-3)", fontSize: 15, lineHeight: 1.55, margin: 0 }}>{d.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <FaqSection t={h.faq} />

      <FinalCTA t={t} title={h.finalCtaTitle} lead={h.finalCtaLead} lang={lang} accent="purple" />
      <FeaturedInsights pageKey="about" lang={lang} />
    </PageShell>
  );
}
