import Link from "next/link";
import Icon from "./ui/Icon";

type DualEntryCardProps = {
  data: {
    kicker: string;
    title: string;
    items: string[];
    cta: string;
  };
  href: string;
  tone: "dark" | "purple" | "light";
  bg?: string;
};

export default function DualEntryCard({ data, href, tone, bg: bgProp }: DualEntryCardProps) {
  const isDark = tone === "dark";
  const isPurple = tone === "purple";
  const isLight = tone === "light";
  const bg = bgProp ?? (isDark ? "var(--m-ink)" : isPurple ? "var(--m-purple)" : "var(--m-bg-soft)");
  const fg = isDark || isPurple ? "white" : "var(--m-ink)";
  const meta = isDark || isPurple ? "rgba(255,255,255,0.7)" : "var(--m-ink-3)";
  const border = isDark || isPurple ? "rgba(255,255,255,0.15)" : "var(--m-line)";
  const bgLetter = isDark || isPurple ? "rgba(255,255,255,0.05)" : "rgba(0,7,118,0.04)";
  const letterText = isLight ? "S" : (isPurple ? "OF" : "E");

  return (
    <div className="m-dual-card" style={{
      background: bg,
      color: fg,
      padding: "44px 40px",
      borderRadius: 16,
      position: "relative" as const,
      overflow: "hidden",
      minHeight: 380,
      border: isLight ? "1px solid var(--m-line)" : "none",
    }}>
      <Link href={href} style={{
        display: "block",
        position: "absolute" as const,
        inset: 0,
        zIndex: 1,
        borderRadius: 16,
      }} aria-label={data.cta} />
      <div style={{ display: "flex", flexDirection: "column" as const, height: "100%", minHeight: 320, position: "relative" as const, zIndex: 2 }}>
        <div style={{ fontFamily: "var(--f-display)", fontSize: 18, color: meta, letterSpacing: "0.01em", fontWeight: 500 }}>{data.kicker}</div>
        <h3 style={{
          fontFamily: "var(--f-display)",
          fontSize: "clamp(22px, 2.5vw, 32px)",
          fontWeight: 400,
          letterSpacing: "-0.015em",
          lineHeight: 1.15,
          margin: "14px 0 20px",
          maxWidth: 380,
        }}>{data.title}</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, marginTop: "auto" }}>
          {data.items.map((it, i) => (
            <li key={i} style={{ padding: "11px 0", borderTop: `1px solid ${border}`, fontSize: 14.5, color: meta }}>
              {it}
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 24, display: "inline-flex", alignItems: "center", position: "relative" as const, zIndex: 3 }}>
          <Link href={href} style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 20px",
            fontSize: 13.5,
            fontWeight: 600,
            color: isDark || isPurple ? "white" : "var(--m-ink)",
            border: `1.5px solid ${isDark || isPurple ? "rgba(255,255,255,0.5)" : "var(--m-ink)"}`,
            borderRadius: 12,
            textDecoration: "none",
            transition: "all 0.18s ease",
          }}>
            {data.cta}
            <Icon name="chevron_right" size={18} />
          </Link>
        </div>
      </div>

    </div>
  );
}
