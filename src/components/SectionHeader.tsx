type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  kicker?: string;
};

export default function SectionHeader({ eyebrow, title, lead, align = "left", kicker }: SectionHeaderProps) {
  return (
    <div style={{ textAlign: align, maxWidth: align === "center" ? 760 : 880, margin: align === "center" ? "0 auto" : "0" }}>
      {eyebrow && (
        <div className="t-eyebrow" style={{ marginBottom: 18 }}>
          <span className="dot" />{eyebrow}
        </div>
      )}
      {kicker && <div style={{ fontFamily: "var(--f-display)", color: "var(--m-purple)", fontSize: 18, marginBottom: 8 }}>{kicker}</div>}
      <h2 className="t-display" style={{ fontSize: "clamp(36px, 5vw, 60px)", margin: 0 }}>{title}</h2>
      {lead && <p className="t-lead" style={{ marginTop: 22, maxWidth: 640 }}>{lead}</p>}
    </div>
  );
}