import Link from "next/link";

type DualEntryCardProps = {
  data: {
    kicker: string;
    title: string;
    items: string[];
    cta: string;
  };
  href: string;
  tone: "dark" | "purple";
};

export default function DualEntryCard({ data, href, tone }: DualEntryCardProps) {
  const isDark = tone === "dark";
  const isPurple = tone === "purple";
  const bg = isDark ? "var(--m-ink)" : isPurple ? "var(--m-purple)" : "white";
  const fg = isDark || isPurple ? "white" : "var(--m-ink)";
  const meta = isDark || isPurple ? "rgba(255,255,255,0.7)" : "var(--m-ink-3)";

  return (
    <Link href={href} style={{
      display: "block",
      background: bg,
      color: fg,
      padding: "44px 40px",
      borderRadius: 24,
      position: "relative" as const,
      overflow: "hidden",
      minHeight: 380,
      transition: "transform 0.25s ease",
    }}>
      <div style={{ display: "flex", flexDirection: "column" as const, height: "100%", minHeight: 320, position: "relative" as const, zIndex: 1 }}>
        <div style={{ fontFamily: "var(--f-display)", fontSize: 16, color: meta, letterSpacing: "0.01em" }}>{data.kicker}</div>
        <h3 style={{
          fontFamily: "var(--f-display)",
          fontSize: "clamp(28px, 3.4vw, 42px)",
          fontWeight: 400,
          letterSpacing: "-0.015em",
          lineHeight: 1.1,
          margin: "16px 0 24px",
          maxWidth: 380,
        }}>{data.title}</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, marginTop: "auto" }}>
          {data.items.map((it, i) => (
            <li key={i} style={{ padding: "12px 0", borderTop: "1px solid " + (isDark || isPurple ? "rgba(255,255,255,0.15)" : "var(--m-line)"), fontSize: 15, color: meta }}>
              {it}
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 28, fontSize: 14.5, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8 }}>
          {data.cta} <span style={{ display: "inline-block", transition: "transform 0.2s" }}>→</span>
        </div>
      </div>
      <div aria-hidden="true" style={{
        position: "absolute" as const, right: -20, top: -40,
        fontFamily: "var(--f-display)", fontWeight: 700,
        fontSize: 240, lineHeight: 1, color: isDark || isPurple ? "rgba(255,255,255,0.05)" : "rgba(0,7,118,0.04)",
        userSelect: "none" as const,
      }}>
        {isPurple ? "OF" : "E"}
      </div>
    </Link>
  );
}