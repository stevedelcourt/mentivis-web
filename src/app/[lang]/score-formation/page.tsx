"use client";
import PageShell from "@/components/layout/PageShell";
import ScoreCalculator from "@/components/ScoreCalculator";
import { useMessages } from "@/lib/messages";

export default function ScoreFormationPage() {
  const { lang } = useMessages();
  const title = lang === "fr" ? "Score Formation" : "Training Impact Score";

  return (
    <PageShell>
      <section style={{ paddingTop: 100, paddingBottom: 60 }}>
        <div className="container">
          <h1 className="t-display" style={{ fontSize: "clamp(36px, 5vw, 56px)", margin: "0 0 16px" }}>
            {title}
          </h1>
          <ScoreCalculator />
        </div>
      </section>
    </PageShell>
  );
}
