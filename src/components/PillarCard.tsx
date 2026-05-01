import Icon from "./ui/Icon";

type PillarCardProps = {
  n: string;
  title: string;
  body?: string;
  items?: string[];
  accent?: boolean;
  icon?: string;
};

export default function PillarCard({ n, title, body, items, accent = false, icon }: PillarCardProps) {
  return (
    <article className="m-pillar-card" style={{
      padding: "36px 32px",
      borderRadius: 18,
      border: "1px solid var(--m-line)",
      background: accent ? "var(--m-bg-soft)" : "white",
      height: "100%",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 18,
      }}>
        {icon && (
          <Icon name={icon as any} size={20} style={{ color: "var(--m-purple)" }} />
        )}
        <span style={{
          fontFamily: "var(--f-display)",
          fontStyle: "italic",
          fontSize: 18,
          color: "var(--m-purple)",
          fontWeight: 400,
        }}>{n}</span>
        <span style={{ flex: 1, height: 1, background: "var(--m-line)" }} />
      </div>
      <h3 style={{
        fontFamily: "var(--f-display)",
        fontSize: 30,
        fontWeight: 400,
        letterSpacing: "-0.015em",
        lineHeight: 1.1,
        margin: "0 0 14px",
      }}>{title}</h3>
      {body && (
        <p style={{ color: "var(--m-ink-3)", fontSize: 15.5, lineHeight: 1.55, margin: "0 0 22px" }}>
          {body}
        </p>
      )}
      {items && items.length > 0 && (
        <ul className="dot-list" style={{ marginTop: 18 }}>
          {items.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      )}
    </article>
  );
}