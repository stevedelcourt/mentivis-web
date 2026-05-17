"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PageShell from "@/components/layout/PageShell";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { useMessages } from "@/lib/messages";

const PROFILE_ICONS = [
  <svg key={0} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="3"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></svg>,
  <svg key={1} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M6.34 18.34A7.97 7.97 0 0 1 12 14a7.97 7.97 0 0 1 5.66 2.34"/></svg>,
  <svg key={2} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><circle cx="10" cy="8" r="2"/><path d="M10 13c-1.5 0-3 .5-4 2"/><path d="M16 7l2 2 4-4"/></svg>,
  <svg key={3} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-7.07l-2.83 2.83M9.76 14.24l-2.83 2.83m12.14 0l-2.83-2.83M9.76 9.76L6.93 6.93"/></svg>,
  <svg key={4} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15h3"/></svg>,
  <svg key={5} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="6" y1="7" x2="6" y2="7.01"/><line x1="10" y1="7" x2="18" y2="7"/><line x1="6" y1="11" x2="6" y2="11.01"/><line x1="10" y1="11" x2="18" y2="11"/><line x1="6" y1="15" x2="6" y2="15.01"/><line x1="10" y1="15" x2="18" y2="15"/></svg>,
  <svg key={6} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 2a10 10 0 0 0-10 10"/><path d="M2 12h20"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="10"/></svg>,
  <svg key={7} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1.5"/><circle cx="9" cy="13" r=".8"/><circle cx="15" cy="13" r=".8"/></svg>,
  <svg key={8} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/><path d="M7 7l5-2.5L17 7"/></svg>,
];

export default function AmbassadorsClient() {
  const { t, lang } = useMessages();
  const a = t.ambassadors;

  return (
    <PageShell hidePreFooterCTA>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: a.faq.items.map((item: { question: string; answer: string }) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }} />

      {/* Hero */}
      <section className="section" style={{ paddingTop: 120, paddingBottom: 80 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="m-split-grid">
            <div>
              <Reveal>
                <div className="t-eyebrow" style={{ marginBottom: 20, color: "var(--m-ink-3)" }}>
                  {a.hero.eyebrow}
                </div>
              </Reveal>
              <Reveal delay={50}>
                <h1 className="t-display" style={{ fontSize: "clamp(32px, 5vw, 60px)", marginBottom: 24 }}>
                  {a.hero.headline}
                </h1>
              </Reveal>
              <Reveal delay={100}>
                <p className="t-lead" style={{ maxWidth: 600, marginBottom: 16 }}>
                  {a.hero.body}
                </p>
              </Reveal>
              <Reveal delay={150}>
                <p style={{ fontSize: 15, color: "var(--m-ink-2)", lineHeight: 1.6, marginBottom: 8, maxWidth: 560 }}>
                  {a.hero.commission}
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--m-purple)", marginBottom: 36 }}>
                  {a.hero.rate}
                </p>
              </Reveal>
              <Reveal delay={200}>
                <Link
                  href={`/${lang}/contact?subject=Programme+Ambassadeurs`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "14px 24px", fontSize: 14, fontWeight: 600,
                    color: "white", background: "var(--m-purple)",
                    borderRadius: 999, textDecoration: "none",
                  }}
                >
                  {a.hero.ctaJoin}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </Reveal>
            </div>
            <Reveal delay={80}>
              <Image
                src="/images/ambassador.avif"
                alt=""
                width={600}
                height={600}
                style={{ width: "100%", height: "auto", borderRadius: 16, display: "block" }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Who */}
      <section className="section" style={{ background: "var(--m-bg-soft)", borderTop: "1px solid var(--m-line)", borderBottom: "1px solid var(--m-line)" }}>
        <div className="container">
          <Reveal>
            <h2 className="t-display" style={{ fontSize: "clamp(24px, 3.2vw, 36px)", marginBottom: 12, fontWeight: 400 }}>
              {a.who.title}
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--m-ink-3)", maxWidth: 640, marginBottom: 40 }}>
              {a.who.subtitle}
            </p>
          </Reveal>

          <Reveal delay={60}>
            <p className="t-mono" style={{ marginBottom: 16, color: "var(--m-ink-3)" }}>
              {a.who.profilesTitle}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12, marginBottom: 48 }}>
              {a.who.profiles.map((profile: string, i: number) => (
                <div key={profile} style={{
                  background: "#ffffff", borderRadius: 12, padding: "16px 20px",
                  fontSize: 14, fontWeight: 500, color: "var(--m-ink)",
                  border: "1px solid var(--m-line-2)",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <span style={{ color: "var(--m-ink-3)", flexShrink: 0, display: "flex" }}>
                    {PROFILE_ICONS[i] || null}
                  </span>
                  {profile}
                </div>
              ))}
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }} className="m-split-grid">
            <Reveal delay={80}>
              <h3 style={{ fontSize: 20, fontWeight: 500, color: "var(--m-ink)", marginBottom: 12 }}>
                {a.who.notSellerTitle}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--m-ink-2)" }}>
                {a.who.notSellerBody}
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h3 style={{ fontSize: 20, fontWeight: 500, color: "var(--m-ink)", marginBottom: 12 }}>
                {a.who.whyTitle}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--m-ink-2)" }}>
                {a.who.whyBody}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How */}
      <section className="section">
        <div className="container">
          <Reveal>
            <h2 className="t-display" style={{ fontSize: "clamp(24px, 3.2vw, 36px)", marginBottom: 40, fontWeight: 400 }}>
              {a.how.title}
            </h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {a.how.steps.map((step: { num: string; title: string; body: string }, i: number) => (
              <Reveal key={step.num} delay={60 + i * 60}>
                <div style={{
                  display: "grid", gridTemplateColumns: "70px 1fr", gap: 28, alignItems: "start",
                  padding: "28px 32px", background: "var(--m-bg-soft)", borderRadius: 16,
                  border: "1px solid var(--m-line-2)",
                }}>
                  <span style={{ fontSize: 28, color: "var(--m-ink-4)", fontFamily: "var(--f-mono)" }}>
                    {step.num}
                  </span>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 500, color: "var(--m-ink)", marginBottom: 8 }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--m-ink-2)" }}>
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <AmbassadorsFaq t={a.faq} />

      {/* Bottom CTA */}
      <section className="section" style={{ textAlign: "center", paddingBottom: 100 }}>
        <div className="container">
          <Reveal>
            <h2 className="t-display" style={{ fontSize: "clamp(24px, 3.2vw, 36px)", marginBottom: 24, fontWeight: 400 }}>
              {a.hero.headline}
            </h2>
            <Link
              href={`/${lang}/contact?subject=Programme+Ambassadeurs`}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 28px", fontSize: 15, fontWeight: 600,
                color: "white", background: "var(--m-purple)",
                borderRadius: 999, textDecoration: "none",
              }}
            >
              {a.hero.ctaJoin}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}

function AmbassadorsFaq({ t }: { t: { title: string; subtitle: string; items: { question: string; answer: string }[] } }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIndex(prev => prev === i ? null : i);

  return (
    <section style={{ padding: "clamp(4rem, 10vw, 7rem) 0", background: "var(--m-ink)", color: "white" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "clamp(2.5rem, 6vw, 6rem)" }} className="m-faq-grid">
          <div>
            <div className="t-eyebrow" style={{ marginBottom: "1.75rem", color: "rgba(255,255,255,0.45)" }}>FAQ</div>
            <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.025em", margin: "0 0 1.75rem" }}>
              {t.title}
            </h2>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "rgba(255,255,255,0.75)", maxWidth: "36ch", margin: 0 }}>
              {t.subtitle}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {t.items.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <article key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <button onClick={() => toggle(i)} aria-expanded={isOpen} type="button"
                    style={{ width: "100%", background: "transparent", border: 0, color: "white", fontFamily: "inherit", cursor: "pointer", textAlign: "left", padding: "1.85rem 0", display: "grid", gridTemplateColumns: "2.25rem 1fr auto", alignItems: "center", gap: "1.5rem", fontSize: "1.0625rem", fontWeight: 400 }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.12em", color: isOpen ? "white" : "rgba(255,255,255,0.45)", fontVariantNumeric: "tabular-nums" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 style={{ margin: 0, fontSize: "inherit", fontWeight: "inherit", color: "inherit" }}>{item.question}</h3>
                    <span style={{ position: "relative", width: 14, height: 14, flexShrink: 0 }}>
                      <span style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: 1, background: isOpen ? "white" : "rgba(255,255,255,0.45)", transform: "translateY(-50%)" }} />
                      <span style={{ position: "absolute", left: "50%", top: 0, width: 1, height: "100%", background: isOpen ? "white" : "rgba(255,255,255,0.45)", transform: isOpen ? "translateX(-50%) rotate(90deg)" : "translateX(-50%)" }} />
                    </span>
                  </button>
                  <div role="region" style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.5s cubic-bezier(0.65, 0, 0.35, 1)" }}>
                    <div style={{ overflow: "hidden" }}>
                      <p style={{ padding: "0 0 2.25rem calc(2.25rem + 1.5rem)", fontSize: "0.9375rem", lineHeight: 1.75, color: "rgba(255,255,255,0.75)", maxWidth: "62ch", margin: 0 }}>
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
