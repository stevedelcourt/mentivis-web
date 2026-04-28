"use client";
import PageShell from "@/components/layout/PageShell";
import ComingSoon from "@/components/ui/ComingSoon";
import Reveal from "@/components/Reveal";
import { useMessages } from "@/lib/messages";

export default function OpcoPage() {
  const { lang } = useMessages();
  const title = lang === "fr" ? "Calculateur OPCO" : "OPCO Calculator";

  return (
    <PageShell>
      <section style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <Reveal>
            <h1 className="t-display" style={{ fontSize: "clamp(36px, 5vw, 56px)", margin: "0 0 16px" }}>
              {title}
            </h1>
          </Reveal>
          <ComingSoon />
        </div>
      </section>
    </PageShell>
  );
}
