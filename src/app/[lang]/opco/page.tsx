"use client";
import Link from "next/link";
import Image from "next/image";
import PageShell from "@/components/layout/PageShell";
import OpcoCalculator from "@/components/OpcoCalculator";
import { useMessages } from "@/lib/messages";

export default function OpcoPage() {
  const { t, lang } = useMessages();
  const s = t.opco;

  return (
    <PageShell>
      <section style={{ paddingTop: 120, paddingBottom: 0 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 48, alignItems: "center" }} className="m-split-grid">
            <div style={{ borderRadius: 16, overflow: "hidden", background: "var(--m-bg-soft)" }}>
              <Image src="/score.webp" alt="OPCO" width={560} height={320} style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
            <div>
              <div className="t-eyebrow" style={{ marginBottom: 16 }}>{s.eyebrow}</div>
              <h1 className="t-display" style={{ fontSize: "clamp(28px, 4vw, 48px)", margin: "0 0 16px", lineHeight: 1.1 }}>
                {s.title}
              </h1>
              <p style={{ color: "var(--m-ink-3)", fontSize: 18, lineHeight: 1.55, margin: "0 0 24px" }}>
                {s.sub}
              </p>
              <Link href={`/${lang}/contact`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 20px", fontSize: 14, fontWeight: 600, color: "white", background: "var(--m-purple)", borderRadius: 999, textDecoration: "none" }}>
                {t.nav.cta}
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 60, paddingBottom: 60 }}>
        <OpcoCalculator />
      </section>
    </PageShell>
  );
}
