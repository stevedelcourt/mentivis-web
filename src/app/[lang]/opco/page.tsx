"use client";
import Image from "next/image";
import PageShell from "@/components/layout/PageShell";
import OpcoCalculator from "@/components/OpcoCalculator";

export default function OpcoPage() {
  return (
    <PageShell>
      <section style={{ paddingTop: 120, paddingBottom: 0 }}>
        <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ borderRadius: 16, overflow: "hidden", background: "var(--m-bg-soft)" }}>
            <Image src="/score.webp" alt="OPCO" width={920} height={520} style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 60, paddingBottom: 60 }}>
        <OpcoCalculator />
      </section>
    </PageShell>
  );
}
