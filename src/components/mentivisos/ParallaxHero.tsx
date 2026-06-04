"use client";

import { useMessages } from "@/lib/messages";
import ButtonLink from "@/components/ui/ButtonLink";

const GAP = 30;
const BASE_SPEED = 0.25;
export default function ParallaxHero() {
  const { t, lang } = useMessages();
  const h = t.mentivisos.hero;

  const sharedImg: React.CSSProperties = {
    height: "var(--parallax-img-h, 25vh)",
    width: "auto",
    flexShrink: 0,
    display: "block",
    userSelect: "none",
  };

  return (
    <>
      {/* Text hero */}
      <section
        style={{
          padding: "clamp(80px, 11vw, 140px) 0 clamp(32px, 5vw, 56px)",
          background: "var(--m-bg)",
        }}
      >
        <div className="container" style={{ maxWidth: 800 }}>
          <p
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--m-ink-3)",
              marginBottom: 20,
            }}
          >
            {h.eyebrow}
          </p>
          <h1
            style={{
              fontFamily: "var(--f-display)",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "var(--m-ink)",
              marginBottom: 20,
            }}
          >
            {h.headline.split("|").map((line: string, i: number) => (
              <span key={i} style={{ display: "block" }}>
                {line}
              </span>
            ))}
          </h1>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.6,
              color: "var(--m-ink-2)",
              maxWidth: 560,
              marginBottom: 36,
            }}
          >
            {h.subheadline}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
            <ButtonLink href="https://app.mentivisos.com/" variant="primary">
              {h.ctaPrimary}
            </ButtonLink>
            <ButtonLink href={`https://mentivisos.com/${lang}/`} variant="outline" target="_blank" rel="noopener">
              {lang === "fr" ? "Site MentivisOS" : "MentivisOS Website"}
            </ButtonLink>
          </div>
          {h.proof && (
            <p style={{ fontSize: 14, color: "var(--m-ink-3)", margin: 0 }}>
              {h.proof}
            </p>
          )}
        </div>
      </section>

      {/* Static image strip (no parallax animation) */}
      <div style={{ width: "100%", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: `${GAP}px`, width: "max-content" }}>
          <img src="/images/mentivisos/proportions-back.webp" alt="" draggable={false} style={sharedImg} />
          <img src="/images/mentivisos/proportions-back.webp" alt="" draggable={false} style={sharedImg} />
          <img src="/images/mentivisos/proportions-back.webp" alt="" draggable={false} style={sharedImg} />
          <img src="/images/mentivisos/proportions-back.webp" alt="" draggable={false} style={sharedImg} />
        </div>
        <div className="m-front-track" style={{ display: "flex", gap: `${GAP}px`, width: "max-content" }}>
          <img src="/images/mentivisos/proportions-front.webp" alt="" draggable={false} style={sharedImg} />
          <img src="/images/mentivisos/proportions-front.webp" alt="" draggable={false} style={sharedImg} />
          <img src="/images/mentivisos/proportions-front.webp" alt="" draggable={false} style={sharedImg} />
          <img src="/images/mentivisos/proportions-front.webp" alt="" draggable={false} style={sharedImg} />
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root { --parallax-img-h: 25vh; }
            .m-front-track { transform: translateY(-300px); }
            @media (max-width: 768px) {
              :root { --parallax-img-h: 18vh; }
              .m-front-track { transform: translateY(-136px); }
            }
          `,
        }}
      />
    </>
  );
}
