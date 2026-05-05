"use client";

import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { useMessages } from "@/lib/messages";
import Icon from "@/components/ui/Icon";

export default function SkillpathClient() {
  const { t, lang } = useMessages();
  const s = t.skillpath;

  return (
    <PageShell hidePreFooterCTA>
      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: 560,
          backgroundImage: "url(/images/heroes/skillpath.avif)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* SEO title only — visual title is inside the hero image */}
        <h1 className="visually-hidden">{s.heroTitle}</h1>
      </section>

      {/* ── HERO TAGLINE ── */}
      <section style={{ padding: "80px 0 40px", background: "white" }}>
        <div className="container" style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              fontSize: "clamp(20px, 2.8vw, 28px)",
              lineHeight: 1.35,
              fontWeight: 400,
              color: "var(--m-ink)",
              margin: "0 0 14px",
            }}
          >
            {s.heroLead}
          </p>
          <p
            style={{
              fontSize: "clamp(16px, 1.8vw, 20px)",
              lineHeight: 1.45,
              fontWeight: 500,
              color: "var(--m-purple)",
              margin: 0,
            }}
          >
            {s.heroSub}
          </p>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ padding: "80px 0", background: "var(--m-bg-soft)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.65,
              color: "var(--m-ink-2)",
              margin: "0 auto",
              maxWidth: 720,
            }}
          >
            {s.problemText}
          </p>
        </div>
      </section>

      {/* ── THREE STEPS ── */}
      <section id="steps" style={{ padding: "96px 0", background: "white" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
            }}
            className="m-grid-3"
          >
            {s.steps.map((step: any, i: number) => (
              <div
                key={i}
                style={{
                  padding: "36px 28px",
                  border: "1px solid var(--m-line)",
                  borderRadius: 16,
                  background: "white",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "var(--m-purple-soft)",
                    color: "var(--m-purple)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    fontWeight: 700,
                    fontFamily: "var(--f-display)",
                  }}
                >
                  {i + 1}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: 20,
                    fontWeight: 600,
                    lineHeight: 1.25,
                    margin: 0,
                    color: "var(--m-ink)",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: "var(--m-ink-2)",
                    margin: 0,
                  }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR WHO ── */}
      <section style={{ padding: "110px 0", background: "var(--m-bg-soft)" }}>
        <div className="container">
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <h2
              className="t-display"
              style={{
                fontSize: "clamp(28px, 3.5vw, 44px)",
                margin: "0 0 56px",
                textAlign: "center",
                lineHeight: 1.1,
              }}
            >
              {s.forWhoTitle}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 20,
              }}
              className="m-grid-2"
            >
              {[
                {
                  icon: "trending_up",
                  title: s.forWhoSubtitles[0],
                  text: s.forWho[0],
                },
                {
                  icon: "corporate_fare",
                  title: s.forWhoSubtitles[1],
                  text: s.forWho[1],
                },
                {
                  icon: "school",
                  title: s.forWhoSubtitles[2],
                  text: s.forWho[2],
                },
                {
                  icon: "book",
                  title: s.forWhoSubtitles[3],
                  text: s.forWho[3],
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: "36px 32px",
                    background: "var(--m-purple)",
                    borderRadius: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    cursor: "default",
                    boxShadow: "0 2px 8px rgba(0,7,118,0.15)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,7,118,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,7,118,0.15)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <div style={{ color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name={item.icon as any} size={28} />
                    </div>
                    <span
                      style={{
                        fontSize: "clamp(18px, 1.8vw, 22px)",
                        fontWeight: 700,
                        color: "white",
                        lineHeight: 1.2,
                        fontFamily: "var(--font-jetbrains)",
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "clamp(14px, 1.3vw, 16px)",
                      lineHeight: 1.55,
                      color: "rgba(255,255,255,0.85)",
                      margin: 0,
                      fontWeight: 400,
                      textAlign: "left",
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CORPORATE ── */}
      <section style={{ padding: "80px 0", background: "var(--m-purple-tint)" }}>
        <div className="container">
          <div
            style={{
              maxWidth: 720,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <span
              style={{
                display: "inline-block",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--m-purple)",
                background: "var(--m-purple-soft)",
                padding: "6px 14px",
                borderRadius: 999,
                marginBottom: 20,
              }}
            >
              {s.corporateBadge}
            </span>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.65,
                color: "var(--m-ink-2)",
                margin: "0 0 28px",
              }}
            >
              {s.corporateText}
            </p>
            <Link
              href={`/${lang}/contact?subject=Skillpath`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: 600,
                color: "white",
                background: "var(--m-purple)",
                borderRadius: 999,
                textDecoration: "none",
              }}
            >
              {s.corporateCta}
              <Icon name="chevron_right" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── INTEGRATION MODES ── */}
      <section style={{ padding: "96px 0", background: "white" }}>
        <div className="container">
          <h2
            className="t-display"
            style={{
              fontSize: "clamp(24px, 3vw, 36px)",
              margin: "0 0 48px",
              textAlign: "center",
            }}
          >
            {s.modesTitle}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
            }}
            className="m-grid-3"
          >
            {s.modes.map((mode: any, i: number) => (
              <div
                key={i}
                style={{
                  padding: "32px 28px",
                  border: "1px solid var(--m-line)",
                  borderRadius: 16,
                  background: "white",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: 18,
                    fontWeight: 600,
                    lineHeight: 1.3,
                    margin: 0,
                    color: "var(--m-ink)",
                  }}
                >
                  {mode.title}
                </h3>
                {mode.items.map((item: string, j: number) => (
                  <div
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: 14,
                      color: "var(--m-ink-2)",
                      lineHeight: 1.5,
                    }}
                  >
                    <Icon name="check" size={16} style={{ color: "var(--m-purple)", flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        style={{
          padding: "120px 0 100px",
          background: "var(--m-ink)",
          color: "white",
          textAlign: "center",
        }}
      >
        <div className="container">
          <p
            style={{
              fontSize: "clamp(18px, 2.5vw, 24px)",
              lineHeight: 1.45,
              color: "rgba(255,255,255,0.85)",
              maxWidth: 640,
              margin: "0 auto 36px",
            }}
          >
            {s.finalCtaText}
          </p>
          <Link
            href={`/${lang}/contact?subject=Skillpath`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              fontSize: 15,
              fontWeight: 600,
              color: "var(--m-ink)",
              background: "white",
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            {s.finalCtaBtn}
            <Icon name="chevron_right" size={18} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER NOTE ── */}
      <section style={{ padding: "40px 0", background: "var(--m-bg-soft)", borderTop: "1px solid var(--m-line)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "var(--m-ink-3)", margin: 0 }}>
            {s.footerNote}
          </p>
        </div>
      </section>
    </PageShell>
  );
}
