import { ReactNode } from "react";
import Reveal from "./Reveal";

type PageHeroProps = {
  eyebrow: string;
  titleParts: string[];
  lead?: string;
  accentIndices?: number[];
  children?: ReactNode;
};

export default function PageHero({ eyebrow, titleParts, lead, accentIndices = [], children }: PageHeroProps) {
  return (
    <section style={{ paddingTop: 140, paddingBottom: 80, position: "relative" as const, overflow: "hidden" }}>
      <div aria-hidden="true" style={{
        position: "absolute" as const,
        inset: 0,
        backgroundImage: "linear-gradient(var(--m-line-2) 1px, transparent 1px)",
        backgroundSize: "100% 96px",
        opacity: 0.5,
        pointerEvents: "none" as const,
        maskImage: "linear-gradient(to bottom, black, transparent)",
      }} />
      <div className="container" style={{ position: "relative" as const }}>
        <Reveal>
          <div className="t-eyebrow" style={{ marginBottom: 28 }}>
            {eyebrow}
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="t-display" style={{ fontSize: "clamp(44px, 7vw, 92px)", maxWidth: 1080, margin: 0 }}>
            {titleParts.map((p, i) => (
              accentIndices.includes(i)
                ? <em key={i}>{p}</em>
                : <span key={i}>{p}{i < titleParts.length - 1 ? " " : " "}</span>
            ))}
          </h1>
        </Reveal>
        {lead && (
          <Reveal delay={160}>
            <p className="t-lead" style={{ marginTop: 28, maxWidth: 680 }}>{lead}</p>
          </Reveal>
        )}
        {children && <Reveal delay={220}><div style={{ marginTop: 36 }}>{children}</div></Reveal>}
      </div>
    </section>
  );
}