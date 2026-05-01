"use client";
import Link from "next/link";
import Icon from "./ui/Icon";

type PreFooterCTAMessages = {
  nav: { cta: string };
  footer: {
    ctaTitle: string;
    ctaLead: string;
  };
  common: { learnMore: string };
};

type PreFooterCTAProps = {
  t: PreFooterCTAMessages;
  lang: string;
};

export default function PreFooterCTA({ t, lang }: PreFooterCTAProps) {
  return (
    <section
      style={{
        position: "relative" as const,
        padding: "120px 0 60px",
        textAlign: "center",
        background: "var(--m-bg-soft)",
      }}
    >
      <div className="container" style={{ position: "relative" as const, zIndex: 2 }}>
          <h2
          className="t-display"
          style={{
            fontSize: "clamp(22px, 4vw, 52px)",
            margin: 0,
            maxWidth: 780,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.1,
            color: "var(--m-ink)",
          }}
        >
          {t.footer.ctaTitle}
        </h2>
        <p
          style={{
            color: "var(--m-ink-3)",
            fontSize: 17,
            marginTop: 22,
            maxWidth: 540,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.5,
          }}
        >
          {t.footer.ctaLead}
        </p>
        <div style={{ marginTop: 32, display: "inline-flex", gap: 10, flexWrap: "wrap" as const, justifyContent: "center" }}>
          <Link
            href={`/${lang}/contact`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 22px",
              fontSize: 14,
              fontWeight: 600,
              color: "white",
              background: "var(--m-purple)",
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            {t.nav.cta}
            <Icon name="chevron_right" size={18} />
          </Link>
          <Link
            href={`/${lang}/about`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 22px",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--m-ink)",
              background: "white",
              border: "1.5px solid var(--m-line)",
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            {t.common.learnMore}
            <Icon name="chevron_right" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
