"use client";
import Link from "next/link";
import Icon from "./ui/Icon";

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
      <div className="container" style={{ position: "relative" as const }}>
        <div style={{ maxWidth: 760 }}>
          <h2 className="t-display" style={{ fontSize: "clamp(32px, 4vw, 52px)", margin: 0, color: "white", lineHeight: 1.1 }}>
            {title}
          </h2>
          {lead && <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, marginTop: 22, maxWidth: 560, lineHeight: 1.5 }}>{lead}</p>}
          <div style={{ marginTop: 36, display: "flex", gap: 14, flexWrap: "wrap" as const }}>
            <Link href={`/${lang}/contact`} style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 22px",
              fontSize: 14,
              fontWeight: 600,
              color: accent === "purple" ? "var(--m-purple)" : "var(--m-ink)",
              background: "white",
              borderRadius: 999,
              textDecoration: "none",
            }}>
              {t.nav.cta}
              <Icon name="chevron_right" size={18} />
            </Link>
            <Link href={`/${lang}/about`} style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 22px",
              fontSize: 14,
              fontWeight: 600,
              color: "white",
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.35)",
              borderRadius: 999,
              textDecoration: "none",
            }}>
              {t.common.learnMore}
              <Icon name="chevron_right" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
