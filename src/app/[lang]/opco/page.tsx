"use client";
import PageShell from "@/components/layout/PageShell";
import OpcoCalculator from "@/components/OpcoCalculator";

export default function OpcoPage() {
  return (
    <PageShell>
      <section style={{ paddingTop: 100, paddingBottom: 60 }}>
        <OpcoCalculator />
      </section>
    </PageShell>
  );
}
