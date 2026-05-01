import Reveal from "@/components/Reveal";

export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export type LegalSection =
  | { title: string; body: string }
  | { title: string; blocks: LegalBlock[] };

export default function LegalPageLayout({
  title,
  date,
  sections,
}: {
  title: string;
  date: string;
  sections: LegalSection[];
}) {
  return (
    <section style={{ paddingTop: 140, paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <Reveal>
          <h1 className="t-display" style={{ fontSize: "clamp(36px, 5vw, 56px)", margin: "0 0 16px" }}>
            {title}
          </h1>
          <p style={{ color: "var(--m-ink-3)", fontSize: 14, marginBottom: 48 }}>{date}</p>
        </Reveal>
        {sections.map((section, i) => (
          <Reveal key={i} delay={i * 50}>
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: "var(--f-display)", fontSize: 22, fontWeight: 500, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
                {section.title}
              </h2>
              {"body" in section ? (
                <p style={{ color: "var(--m-ink-2)", fontSize: 16, lineHeight: 1.6, margin: 0 }} dangerouslySetInnerHTML={{ __html: section.body.replace(/\n/g, "<br/>") }} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {section.blocks.map((block, j) => (
                    block.type === "paragraph" ? (
                      <p key={j} style={{ color: "var(--m-ink-2)", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                        {block.text}
                      </p>
                    ) : (
                      <ul key={j} className="bullet-list">
                        {block.items.map((item, k) => (
                          <li key={k}>{item}</li>
                        ))}
                      </ul>
                    )
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
