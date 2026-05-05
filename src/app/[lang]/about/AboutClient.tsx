"use client";
import Image from "next/image";
import PageShell from "@/components/layout/PageShell";
import ImageHero from "@/components/ImageHero";
import Reveal from "@/components/Reveal";
import FinalCTA from "@/components/FinalCTA";
import { useMessages } from "@/lib/messages";

/* ── sub-components ─────────────────────────────────────── */

function PlaceholderAvatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "clamp(32px, 4vw, 48px)",
        fontWeight: 500,
        color: "white",
      }}
    >
      {initials}
    </div>
  );
}

function TeamPhoto({ member }: { member: any }) {
  if (member.photo) {
    return (
      <div style={{ aspectRatio: "1 / 1", borderRadius: 16, overflow: "hidden", background: "var(--m-line-2)" }}>
        <Image
          src={member.photo}
          alt={member.name}
          width={400}
          height={400}
          style={{ objectFit: "cover", width: "100%", height: "100%", display: "block" }}
        />
      </div>
    );
  }
  return <PlaceholderAvatar initials={member.initials} color={member.color} />;
}

function TeamCard({ member }: { member: any }) {
  return (
    <div>
      <TeamPhoto member={member} />
      <div style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 500, fontSize: 18, color: "var(--m-ink)", marginBottom: 2 }}>{member.name}</div>
        <div style={{ fontSize: 13, color: "var(--m-ink-3)" }}>{member.role}</div>
      </div>
    </div>
  );
}

function AboutForcesDiagram() {
  const forces = [
    { label: "Pénurie de talents", shape: "circle" },
    { label: "Transformation des métiers", shape: "square" },
    { label: "Pression économique", shape: "triangle" },
    { label: "Accélération technologique", shape: "diamond" },
  ];

  const shapeStyle = (shape: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: 48,
      height: 48,
      background: "var(--m-purple)",
    };
    switch (shape) {
      case "circle":
        return { ...base, borderRadius: "50%" };
      case "square":
        return { ...base, borderRadius: 8 };
      case "triangle":
        return {
          width: 0,
          height: 0,
          borderLeft: "24px solid transparent",
          borderRight: "24px solid transparent",
          borderBottom: "42px solid var(--m-purple)",
          background: "transparent",
        };
      case "diamond":
        return {
          ...base,
          borderRadius: 6,
          transform: "rotate(45deg)",
          width: 38,
          height: 38,
        };
      default:
        return base;
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, marginTop: "3rem" }} className="m-forces-grid">
      {forces.map((f, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 48 }}>
            <div style={shapeStyle(f.shape)} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 500, color: "var(--m-ink)" }}>{f.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── page ───────────────────────────────────────────────── */

export default function AboutClient() {
  const { t, lang } = useMessages();
  const a = t.about;

  const heroTitleNode = (
    <>
      {a.heroTitle.map((line: string, i: number) => (
        <span key={i} style={{ display: "block" }}>{line}</span>
      ))}
    </>
  );

  return (
    <PageShell hidePreFooterCTA>
      {/* 1. Hero ─────────────────────────────────────────── */}
      <ImageHero
        image="/images/heroes/young-secretary.avif"
        eyebrow={a.heroEyebrow}
        title={heroTitleNode}
        lead={a.heroSub}
      />

      {/* 2. Story ────────────────────────────────────────── */}
      <section className="section" style={{ borderBottom: "0.5px solid var(--m-line)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 10fr", gap: "2rem", alignItems: "baseline", marginBottom: "2.5rem" }} className="m-split-grid">
            <Reveal>
              <div className="t-eyebrow">{a.storyEyebrow}</div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="t-display" style={{ fontSize: "clamp(28px, 3.2vw, 40px)", lineHeight: 1.1, letterSpacing: "-0.015em", margin: 0, fontWeight: 400 }}>
                {a.storyTitle}
              </h2>
            </Reveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 10fr", gap: "2rem" }} className="m-split-grid">
            <div style={{ gridColumn: "2 / -1", maxWidth: 760 }}>
              <Reveal delay={120}>
                <p className="t-lead" style={{ marginBottom: "1.5rem" }}>{a.storyLede}</p>
              </Reveal>
              <Reveal delay={160}>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--m-ink-2)", marginBottom: "1rem" }}>{a.storyBody1}</p>
              </Reveal>
              <Reveal delay={200}>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--m-ink-2)", marginBottom: "2rem" }}>
                  <strong style={{ color: "var(--m-ink)", fontWeight: 500 }}>{a.storyBody2}</strong>
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div style={{ marginTop: "2.5rem", borderTop: "0.5px solid var(--m-line)" }}>
                  {a.domains.map((d: any, i: number) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: "2rem", padding: "1.25rem 0", borderBottom: "0.5px solid var(--m-line)", alignItems: "baseline" }} className="m-domain-row">
                      <span style={{ fontSize: 20, fontWeight: 400, color: "var(--m-ink)" }}>{d.name}</span>
                      <span className="t-mono" style={{ textAlign: "right" }}>{d.tag}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={280}>
                <p style={{ marginTop: "2rem", fontSize: 15, lineHeight: 1.65, color: "var(--m-ink)" }}>{a.storyClosing}</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why ──────────────────────────────────────────── */}
      <section className="section" style={{ background: "var(--m-bg-soft)", borderBottom: "0.5px solid var(--m-line)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 10fr", gap: "2rem", alignItems: "baseline", marginBottom: "2.5rem" }} className="m-split-grid">
            <Reveal>
              <div className="t-eyebrow">{a.whyEyebrow}</div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="t-display" style={{ fontSize: "clamp(28px, 3.2vw, 40px)", lineHeight: 1.1, letterSpacing: "-0.015em", margin: 0, fontWeight: 400 }}>
                {a.whyTitle}
              </h2>
            </Reveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 10fr", gap: "2rem" }} className="m-split-grid">
            <div style={{ gridColumn: "2 / -1", maxWidth: 900 }}>
              <Reveal delay={120}>
                <p style={{ fontSize: "clamp(20px, 2.4vw, 28px)", lineHeight: 1.4, color: "var(--m-ink)", fontWeight: 400 }}>
                  {a.whyForces}
                </p>
              </Reveal>
              <Reveal delay={160}>
                <p style={{ marginTop: "2rem", fontSize: 16, lineHeight: 1.65, color: "var(--m-ink)" }}>
                  <strong style={{ fontWeight: 500 }}>{a.whyBody}</strong>
                </p>
              </Reveal>
              <Reveal delay={200}>
                <AboutForcesDiagram />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Team ─────────────────────────────────────────── */}
      <section className="section" style={{ background: "white", borderBottom: "0.5px solid var(--m-line)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 10fr", gap: "2rem", alignItems: "baseline", marginBottom: "2.5rem" }} className="m-split-grid">
            <Reveal>
              <div className="t-eyebrow">{a.teamEyebrow}</div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="t-display" style={{ fontSize: "clamp(28px, 3.2vw, 40px)", lineHeight: 1.1, letterSpacing: "-0.015em", margin: 0, fontWeight: 400 }}>
                {a.teamTitle}
              </h2>
            </Reveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 10fr", gap: "2rem" }} className="m-split-grid">
            <div style={{ gridColumn: "2 / -1" }}>
              <Reveal delay={120}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="m-team-grid">
                  {a.team.map((member: any, i: number) => (
                    <TeamCard key={i} member={member} />
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Approach ─────────────────────────────────────── */}
      <section className="section" style={{ background: "var(--m-purple)", color: "white", borderBottom: "0.5px solid rgba(255,255,255,0.15)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 10fr", gap: "2rem", alignItems: "baseline", marginBottom: "2.5rem" }} className="m-split-grid">
            <Reveal>
              <div className="t-eyebrow" style={{ color: "rgba(255,255,255,0.55)" }}>{a.approachEyebrow}</div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="t-display" style={{ fontSize: "clamp(28px, 3.2vw, 40px)", lineHeight: 1.1, letterSpacing: "-0.015em", margin: 0, fontWeight: 400, color: "white" }}>
                {a.approachTitle}
              </h2>
            </Reveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 10fr", gap: "2rem" }} className="m-split-grid">
            <div style={{ gridColumn: "2 / -1", maxWidth: 900 }}>
              <Reveal delay={120}>
                <p className="t-lead" style={{ marginBottom: "1.5rem", color: "rgba(255,255,255,0.85)" }}>
                  {a.approachLede}
                </p>
              </Reveal>
              <Reveal delay={160}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 0, borderTop: "0.5px solid rgba(255,255,255,0.15)" }} className="m-approach-dark-grid">
                  {a.approachBlocks.map((b: any, i: number) => (
                    <div key={i} style={{ padding: "2.5rem", borderBottom: "0.5px solid rgba(255,255,255,0.15)", borderRight: i % 2 === 0 ? "0.5px solid rgba(255,255,255,0.15)" : "none" }}>
                      <span className="t-mono" style={{ color: "rgba(255,255,255,0.45)", display: "block", marginBottom: "0.75rem" }}>{b.marker}</span>
                      <h3 style={{ fontSize: 20, fontWeight: 500, color: "white", marginBottom: "0.5rem" }}>{b.title}</h3>
                      <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.75)" }}>{b.desc}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Distinguish — Editorial list ───────────────── */}
      <section className="section" style={{ background: "var(--m-bg-soft)", borderBottom: "0.5px solid var(--m-line)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 10fr", gap: "2rem", alignItems: "baseline", marginBottom: "2.5rem" }} className="m-split-grid">
            <Reveal>
              <div className="t-eyebrow">{a.distinguishEyebrow}</div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="t-display" style={{ fontSize: "clamp(28px, 3.2vw, 40px)", lineHeight: 1.1, letterSpacing: "-0.015em", margin: 0, fontWeight: 400, color: "var(--m-ink)" }}>
                {a.distinguishTitle}
              </h2>
            </Reveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 10fr", gap: "2rem" }} className="m-split-grid">
            <div style={{ gridColumn: "2 / -1" }}>
              <Reveal delay={120}>
                <div style={{ borderTop: "0.5px solid var(--m-line)" }}>
                  {a.distinguishItems.map((item: any, i: number) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "2rem", padding: "2.5rem 0", borderBottom: "0.5px solid var(--m-line)", alignItems: "start" }} className="m-distinguish-row">
                      <span className="t-display" style={{ fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 500, color: "var(--m-purple)", lineHeight: 1 }}>0{i + 1}</span>
                      <div>
                        <h3 className="t-display" style={{ fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 500, color: "var(--m-ink)", lineHeight: 1.2, margin: "0 0 0.5rem" }}>{item.title}</h3>
                        <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--m-ink-3)", maxWidth: 560 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Values ───────────────────────────────────────── */}
      <section className="section" style={{ background: "#f0f0f5", borderBottom: "0.5px solid var(--m-line)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 10fr", gap: "2rem", alignItems: "baseline", marginBottom: "2.5rem" }} className="m-split-grid">
            <Reveal>
              <div className="t-eyebrow">{a.valuesEyebrow}</div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="t-display" style={{ fontSize: "clamp(28px, 3.2vw, 40px)", lineHeight: 1.1, letterSpacing: "-0.015em", margin: 0, fontWeight: 400, color: "var(--m-ink)" }}>
                {a.valuesTitle}
              </h2>
            </Reveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 10fr", gap: "2rem" }} className="m-split-grid">
            <div style={{ gridColumn: "2 / -1" }}>
              <Reveal delay={120}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 0, borderTop: "0.5px solid var(--m-line)" }} className="m-values-grid">
                  {a.values.map((v: any, i: number) => (
                    <div key={i} style={{ padding: "2rem", borderBottom: "0.5px solid var(--m-line)", borderRight: i % 2 === 0 ? "0.5px solid var(--m-line)" : "none" }}>
                      <h3 style={{ fontSize: 24, fontWeight: 500, color: "var(--m-ink)", lineHeight: 1.2, marginBottom: "0.5rem" }}>{v.name}</h3>
                      <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--m-ink-2)" }}>{v.desc}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FinalCTA ─────────────────────────────────────── */}
      <FinalCTA title={a.finalCtaTitle} lead={a.finalCtaLead} t={t} lang={lang} accent="ink" centered />
    </PageShell>
  );
}
