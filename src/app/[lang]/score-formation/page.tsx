"use client";
import dynamic from "next/dynamic";
import PageShell from "@/components/layout/PageShell";

const ScoreCalculator = dynamic(
  () => import("@/components/ScoreCalculator"),
  { ssr: false, loading: () => <div style={{ minHeight: 600 }} /> }
);

export default function ScoreFormationPage() {
  return (
    <PageShell>
      <section style={{ paddingTop: 100, paddingBottom: 60 }}>
        <ScoreCalculator />
      </section>
    </PageShell>
  );
}
