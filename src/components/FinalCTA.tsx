"use client";
import Link from "next/link";

type FinalCTAProps = {
  title: string;
  lead?: string;
  t: { nav: { cta: string }; common: { learnMore: string } };
  lang: string;
  accent?: "purple" | "ink";
};

export default function FinalCTA({ title, lead, t, lang, accent = "purple" }: FinalCTAProps) {
  return (
    <section style={{
      padding: "120px 0 100px",
      background: accent === "purple" ? "var(--m-purple)" : "var(--m-ink)",
      color: "white",
      position: "relative" as const,
      overflow: "hidden",
    }}>
      <div aria-hidden="true" style={{
        position: "absolute" as const,
        right: -60,
        top: -100,
        fontFamily: "var(--f-display)",
        fontStyle: "italic",
        fontWeight: 700,
        fontSize: 480,
        lineHeight: 1,
        color: "rgba(255,255,255,0.06)",
        userSelect: "none" as const,
        pointerEvents: "none" as const,
      }}>M</div>
      <div className="container" style={{ position: "relative" as const }}>
        <div style={{ maxWidth: 760 }}>
          <h2 className="t-display" style={{ fontSize: "clamp(40px, 6vw, 72px)", margin: 0, color: "white" }}>
            {title}
          </h2>
          {lead && <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 19, marginTop: 22, maxWidth: 560, lineHeight: 1.5 }}>{lead}</p>}
          <div style={{ marginTop: 40, display: "flex", gap: 14, flexWrap: "wrap" as const }}>
            <Link href={`/${lang}/contact`} className="btn" style={{ background: "white", color: "var(--m-ink)" }}>
              {t.nav.cta} →
            </Link>
            <Link href={`/${lang}/about`} className="btn" style={{ background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>
              {t.common.learnMore}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}