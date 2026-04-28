"use client";
import PageShell from "@/components/layout/PageShell";
import ScoreCalculator from "@/components/ScoreCalculator";
import { useMessages } from "@/lib/messages";

export default function ScoreFormationPage() {
  return (
    <PageShell>
      <section style={{ paddingTop: 100, paddingBottom: 60 }}>
        <ScoreCalculator />
      </section>
    </PageShell>
  );
}
