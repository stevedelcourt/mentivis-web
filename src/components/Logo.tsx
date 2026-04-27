export default function Logo({ variant = "dark", size = 22 }: { variant?: "dark" | "light"; size?: number }) {
  const fill = variant === "light" ? "#ffffff" : "var(--m-ink)";
  return (
    <a href="/" className="m-logo" style={{ display: "inline-flex", alignItems: "center", gap: 9, color: fill }}>
      <svg width="20" height="20" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="10.25" fill="none" stroke={fill} strokeWidth="1.1" />
        <path d="M5 14 L8.5 6 L11 12 L13.5 6 L17 14" fill="none" stroke={fill} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{
        fontFamily: "var(--f-display)",
        fontSize: size,
        fontWeight: 600,
        letterSpacing: "-0.01em",
        lineHeight: 1,
      }}>
        Mentivis
      </span>
    </a>
  );
}