"use client";

import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { useMessages } from "@/lib/messages";
import Icon from "@/components/ui/Icon";

export default function MentivisOSClient() {
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
            {s.steps.map((step, i: number) => (
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
                  icon: "psychology",
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
              borderRadius: 12,
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
              href={`/${lang}/contact?subject=MentivisOS`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: 600,
                color: "white",
                background: "var(--m-purple)",
                borderRadius: 12,
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
            {s.modes.map((mode, i: number) => (
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
          background: "var(--m-purple)",
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
            href={`/${lang}/contact?subject=MentivisOS`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              fontSize: 15,
              fontWeight: 600,
                color: "var(--m-ink)",
                background: "white",
                borderRadius: 12,
                textDecoration: "none",
              }}
            >
              {s.finalCtaBtn}
            <Icon name="chevron_right" size={18} />
          </Link>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section style={{ padding: "100px 0", background: "white" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 48,
              alignItems: "center",
            }}
            className="m-grid-2"
          >
            <div style={{ borderRadius: 16, overflow: "hidden", background: "white" }}>
              <img
                src="/images/heroes/skill-screen.avif"
                alt="MentivisOS Dashboard"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <p
                style={{
                  fontSize: "clamp(16px, 1.6vw, 20px)",
                  lineHeight: 1.6,
                  color: "var(--m-ink-2)",
                  margin: 0,
                }}
              >
                Ici votre espace de travail. Vous centralisez vos parcours de formation, vos modules actifs et le suivi de vos progrès en temps réel. Tout est structuré pour vous permettre d&apos;accéder rapidement à vos contenus, d&apos;évaluer vos acquis et de piloter votre activité de formation de manière fluide et continue.
              </p>
              <a
                href="https://app.mentivisos.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 24px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "white",
                  background: "var(--m-purple)",
                  borderRadius: 12,
                  textDecoration: "none",
                  width: "fit-content",
                }}
              >
                MentivisOS Dashboard
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M5.60002 0.899994C5.82094 0.899994 6.00002 1.07908 6.00002 1.29999C6.00002 1.52091 5.82094 1.69999 5.60002 1.69999H1.60002C1.37911 1.69999 1.20002 1.87908 1.20002 2.09999V10.9C1.20002 11.1209 1.37911 11.3 1.60002 11.3H10.4C10.6209 11.3 10.8 11.1209 10.8 10.9V6.89999C10.8 6.67908 10.9791 6.49999 11.2 6.49999C11.4209 6.49999 11.6 6.67908 11.6 6.89999V10.9C11.6 11.5627 11.0628 12.1 10.4 12.1H1.60002C0.937283 12.1 0.400024 11.5627 0.400024 10.9V2.09999C0.400024 1.43725 0.937283 0.899994 1.60002 0.899994H5.60002ZM11.2 0.899994C11.2299 0.899994 11.2598 0.903486 11.2891 0.91015C11.3078 0.91442 11.3259 0.920467 11.3438 0.927338C11.3496 0.9296 11.3552 0.932601 11.361 0.93515C11.3771 0.942258 11.3927 0.950169 11.4078 0.959369C11.414 0.963129 11.4206 0.966183 11.4266 0.970306C11.4466 0.984054 11.4654 0.999763 11.4828 1.01718L11.5344 1.07968C11.5431 1.09292 11.5485 1.1079 11.5555 1.12187C11.56 1.13085 11.5657 1.13915 11.5696 1.14843C11.5832 1.18169 11.5911 1.21637 11.5953 1.25156C11.5973 1.26761 11.6 1.28365 11.6 1.29999V4.49999C11.6 4.72091 11.4209 4.89999 11.2 4.89999C10.9791 4.89999 10.8 4.72091 10.8 4.49999V2.26562L7.48284 5.58281C7.32663 5.73902 7.07342 5.73902 6.91721 5.58281C6.761 5.4266 6.761 5.17339 6.91721 5.01718L10.2344 1.69999H8.00003C7.77911 1.69999 7.60003 1.52091 7.60003 1.29999C7.60003 1.07908 7.77911 0.899994 8.00003 0.899994H11.2Z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>
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
