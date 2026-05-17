"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { useMessages } from "@/lib/messages";
import { SITE } from "@/lib/config";
import { CAREERS_META, JOB_TYPE_LABELS, type JobMeta } from "@/data/careers-meta";

export default function CareersClient() {
  const { t, lang } = useMessages();
  const c = t.careers;
  const isFr = lang === "fr";
  const [selectedDept, setSelectedDept] = useState("all");

  const departments = Array.from(new Set(CAREERS_META.map((j) => j.department))).sort();
  const filteredJobs = selectedDept === "all" ? CAREERS_META : CAREERS_META.filter((j) => j.department === selectedDept);

  const scrollToOpenings = () => {
    document.getElementById("openings")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PageShell>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: c.title,
        description: c.lead,
        url: `${SITE.baseUrl}/${lang}/careers`,
        publisher: { "@id": `${SITE.baseUrl}/#organization` },
        inLanguage: lang === "fr" ? "fr-FR" : "en-US",
      }} />

      {/* Hero */}
      <section style={{
        position: "relative", width: "100%", aspectRatio: "16 / 9",
        minHeight: 420, maxHeight: 640,
        backgroundImage: "url(/images/heroes/blobs.avif)",
        backgroundSize: "cover", backgroundPosition: "center",
        display: "flex", alignItems: "center", textAlign: "left", color: "white", overflow: "hidden",
      }}>
        <div className="container" style={{ position: "relative", zIndex: 2, width: "100%", paddingTop: 80, textAlign: "left" }}>
          <Reveal>
            <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600, opacity: 0.8 }}>
              {c.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={50}>
            <h1 className="t-display" style={{ fontSize: "clamp(40px, 6vw, 72px)", margin: "16px 0 32px", lineHeight: 1.05 }}>
              {c.title}
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <button
              onClick={scrollToOpenings}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 24px", fontSize: 14, fontWeight: 600,
                color: "white", background: "var(--m-purple)",
                borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {c.program ? c.program.cta : (isFr ? "Voir les postes" : "See positions")}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </Reveal>
        </div>
      </section>

      {/* Why Join Us */}
      {c.whyJoin && c.whyJoin.cards && (
        <section style={{ padding: "64px 0", background: "var(--m-bg-soft)", borderTop: "1px solid var(--m-line)", borderBottom: "1px solid var(--m-line)" }}>
          <div className="container">
            <Reveal>
              <h2 className="t-display" style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 400, marginBottom: 40, color: "var(--m-ink)" }}>
                {c.whyJoin.title}
              </h2>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }} className="m-grid-4">
              {c.whyJoin.cards.map((card: { title: string; body: string }, i: number) => (
                <Reveal key={i} delay={60 + i * 60}>
                  <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid var(--m-line-2)" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 500, color: "var(--m-ink)", marginBottom: 12 }}>{card.title}</h3>
                    <p style={{ fontSize: 14, color: "var(--m-ink-3)", lineHeight: 1.5 }}>{card.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Job Openings */}
      <section id="openings" style={{ padding: CAREERS_META.length > 0 ? "80px 0" : "80px 0 0" }}>
        <div className="container">
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
              <h2 className="t-display" style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 400, color: "var(--m-ink)" }}>
                {c.list ? c.list.title : (isFr ? "Postes ouverts" : "Open positions")}
              </h2>
              {departments.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => setSelectedDept("all")} style={{
                    padding: "8px 16px", fontSize: 13, fontWeight: 500, borderRadius: 999, border: "none", cursor: "pointer",
                    background: selectedDept === "all" ? "var(--m-purple)" : "var(--m-bg-soft)",
                    color: selectedDept === "all" ? "#fff" : "var(--m-ink-2)", fontFamily: "inherit",
                  }}>
                    {c.list ? c.list.allDepartments : (isFr ? "Tous" : "All")}
                  </button>
                  {departments.map((dept) => (
                    <button key={dept} onClick={() => setSelectedDept(dept)} style={{
                      padding: "8px 16px", fontSize: 13, fontWeight: 500, borderRadius: 999, border: "none", cursor: "pointer",
                      background: selectedDept === dept ? "var(--m-purple)" : "var(--m-bg-soft)",
                      color: selectedDept === dept ? "#fff" : "var(--m-ink-2)", fontFamily: "inherit",
                    }}>
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredJobs.map((job: JobMeta, i: number) => (
              <Reveal key={job.slug} delay={i * 50}>
                <Link
                  href={`/${lang}/careers/${job.slug}`}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
                    padding: "24px", background: "#fff", borderRadius: 16, border: "1px solid var(--m-line-2)",
                    textDecoration: "none", transition: "border-color 0.2s",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 500, color: "var(--m-ink)", marginBottom: 8 }}>
                      {isFr ? job.titleFr : job.titleEn}
                    </h3>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 14, color: "var(--m-ink-3)" }}>
                      <span>{job.department}</span>
                      <span>{job.location}</span>
                      <span>{JOB_TYPE_LABELS[job.type]?.[lang as keyof typeof JOB_TYPE_LABELS["cdi"]] || job.type}</span>
                      {job.remote && <span>{isFr ? "Remote" : "Remote"}</span>}
                    </div>
                  </div>
                  <span style={{
                    padding: "10px 20px", fontSize: 14, fontWeight: 500, color: "var(--m-purple)",
                    background: "var(--m-bg-soft)", borderRadius: 10, flexShrink: 0,
                  }}>
                    {c.list ? c.list.readMore : (isFr ? "Voir l'offre" : "View position")}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Content — two columns */}
      <section style={{ padding: "80px 0 100px", background: "var(--m-bg-soft)", borderTop: "1px solid var(--m-line)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }} className="m-split-grid">
            {/* Left column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              <Reveal>
                <div>
                  <h2 style={{ fontFamily: "var(--f-display)", fontSize: 32, fontWeight: 500, letterSpacing: "-0.8px", margin: "0 0 18px", color: "var(--m-ink)", lineHeight: 1.15 }}>
                    {c.aboutTitle}
                  </h2>
                  <p style={{ color: "var(--m-ink-2)", fontSize: 15.5, lineHeight: 1.65, margin: 0 }}>
                    {c.aboutBody}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={60}>
                <div style={{ background: "var(--m-bg-soft)", border: "1px solid var(--m-line-2)", borderRadius: 16, padding: "28px" }}>
                  <h3 style={{ fontFamily: "var(--f-display)", fontSize: 18, fontWeight: 500, letterSpacing: "-0.3px", margin: "0 0 10px", color: "var(--m-ink)" }}>
                    {c.equityTitle}
                  </h3>
                  <p style={{ color: "var(--m-ink-2)", fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>
                    {c.equityBody}
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Right column — Marie + CTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <Reveal delay={120}>
                <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                  <div style={{ width: 96, aspectRatio: "1 / 1", borderRadius: 16, overflow: "hidden", flexShrink: 0, background: "var(--m-line-2)" }}>
                    <Image src="/images/team/marie-castelli.avif" alt={c.marieName} width={320} height={320} style={{ objectFit: "cover", width: "100%", height: "100%", display: "block" }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 16, color: "var(--m-ink)", marginBottom: 2 }}>{c.marieName}</div>
                    <div style={{ fontSize: 13, color: "var(--m-ink-3)", marginBottom: 10 }}>{c.marieRole}</div>
                    <p style={{ fontSize: 14, color: "var(--m-ink-2)", lineHeight: 1.55, fontStyle: "italic", margin: 0 }}>
                      &ldquo;{c.marieQuote}&rdquo;
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={180}>
                <div style={{ borderLeft: "3px solid var(--m-purple)", paddingLeft: 20 }}>
                  <h3 style={{ fontFamily: "var(--f-display)", fontSize: 18, fontWeight: 500, letterSpacing: "-0.3px", margin: "0 0 8px", color: "var(--m-ink)" }}>
                    {c.ctaTitle}
                  </h3>
                  <p style={{ color: "var(--m-ink-2)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                    {c.ctaBody}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
