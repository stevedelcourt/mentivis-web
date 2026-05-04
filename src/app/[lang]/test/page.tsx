"use client";
import PageShell from "@/components/layout/PageShell";
import ScrollCardsSection from "@/components/ScrollCardsSection";
import { useMessages } from "@/lib/messages";
import FinalCTA from "@/components/FinalCTA";
import FeutreBalls from "@/components/FeutreBalls";
import BlobTwo from "@/components/BlobTwo";
import Hand from "@/components/Hand";

export default function TestPage() {
  const { t, lang } = useMessages();
  const h = t.home;

  return (
    <PageShell>
<div style={{ paddingTop: 80 }}>
        {/* Spacer for scroll */}
        <div style={{ height: "40vh" }} />
        
        <ScrollCardsSection
          lang={lang}
          entries={{
            enterprise: h.entryEnterprise,
            of: h.entryOf,
            solutions: h.entrySolutions,
          }}
        />
        
        {/* Feutre Balls + Blob Two side by side */}
        <div style={{ padding: "40px 0", display: "flex", gap: "40px", justifyContent: "center", flexWrap: "wrap" }}>
          <FeutreBalls />
          <BlobTwo />
        </div>

        {/* Hand component */}
        <div style={{ padding: "40px 0", display: "flex", justifyContent: "center" }}>
          <Hand />
        </div>

        {/* Spacer for scroll */}
        <div style={{ height: "40vh" }} />
        
        <FinalCTA
          title={lang === "fr" ? "Un projet de formation à structurer ?" : "Have a training project to structure?"}
          lead={lang === "fr" ? "Premier échange sans engagement, analyse de votre besoin et positionnement clair sur notre capacité à vous accompagner." : "First conversation with no commitment, analysis of your needs and clear positioning on our ability to support you."}
          t={t}
          lang={lang}
        />
      </div>
    </PageShell>
  );
}
