"use client";

import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { useMessages } from "@/lib/messages";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/Reveal";
import ParallaxHero from "@/components/mentivisos/ParallaxHero";
import SectorShowcase from "@/components/mentivisos/SectorShowcase";
import PipelineSection from "@/components/mentivisos/PipelineSection";
import FaqSection from "@/components/FaqSection";

export default function MentivisOSClient() {
  const { t, lang } = useMessages();
  const s = t.skillpath;

  return (
    <PageShell hidePreFooterCTA>
      {/* 1. Hero + parallax module strip */}
      <ParallaxHero />

      {/* 2. Problem text */}
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

      {/* 3. Three steps */}
      <section id="steps" style={{ padding: "96px 0", background: "var(--m-bg)" }}>
        <div className="container">
          <Reveal>
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
                    background: "var(--m-bg)",
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
          </Reveal>
        </div>
      </section>

      {/* 4. SectorShowcase — 4 organisational types */}
      <SectorShowcase />

      {/* 5. Corporate badge + CTA */}
      <section style={{ padding: "80px 0", background: "var(--m-purple-tint)" }}>
        <div className="container">
          <Reveal>
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
          </Reveal>
        </div>
      </section>

      {/* 6. PipelineSection — 6-step video */}
      <PipelineSection />

      {/* 7. FAQ */}
      <FaqSection t={t.mentivisos.faq} />

      {/* 8. Final CTA */}
      <section
        style={{
          padding: "120px 0 100px",
          background: "var(--m-bg)",
          textAlign: "center",
        }}
      >
        <div className="container">
          <Reveal>
            <p
              style={{
                fontFamily: "var(--f-display)",
                fontSize: "clamp(24px, 3.5vw, 36px)",
                lineHeight: 1.2,
                fontWeight: 300,
                color: "var(--m-ink)",
                maxWidth: 640,
                margin: "0 auto 36px",
              }}
            >
              {s.finalCtaText}
            </p>
            <Link
              href="https://app.mentivisos.com/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 600,
                color: "white",
                background: "var(--m-purple)",
                borderRadius: 12,
                textDecoration: "none",
              }}
            >
              {s.finalCtaBtn}
              <Icon name="chevron_right" size={18} />
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
