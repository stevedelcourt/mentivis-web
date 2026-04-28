"use client";
import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import PageShell from "@/components/layout/PageShell";
import { useMessages } from "@/lib/messages";
import { SITE } from "@/lib/config";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

function ContactSuccess({ message }: { message: string }) {
  return (
    <div style={{ padding: "60px 48px", border: "1px solid var(--m-line)", borderRadius: 20, background: "var(--m-bg-soft)", textAlign: "center" as const }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%", background: "var(--m-purple)",
        display: "inline-flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 24,
        marginBottom: 24,
      }}>✓</div>
      <h3 style={{ fontFamily: "var(--f-display)", fontSize: 32, fontWeight: 700, letterSpacing: "-1px", margin: 0 }}>{message}</h3>
    </div>
  );
}

export default function ContactPage() {
  const { t, lang } = useMessages();
  const c = t.contact;
  const [form, setForm] = useState({ name: "", you: c.youOptions[0], email: "", phone: "", project: "" });
  const [sent, setSent] = useState(false);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.project) return;
    setSent(true);
  };

  return (
    <PageShell>
      <section style={{ paddingTop: 120, paddingBottom: 60 }}>
        <div className="container">
          <Reveal>
            <div className="t-eyebrow" style={{ marginBottom: 28 }}>
              {c.eyebrow}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="t-display" style={{ fontSize: "clamp(36px, 5vw, 68px)", margin: 0, maxWidth: 880 }}>
              {c.title[0]}<br />
              <em>{c.title[1]}</em><br />
              {c.title[2]}
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="t-lead" style={{ marginTop: 28, maxWidth: 580 }}>{c.lead}</p>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: "40px 0 100px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 80, alignItems: "start" }} className="m-split-grid">
            {sent ? (
              <ContactSuccess message={c.success} />
            ) : (
              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column" as const, gap: 24 }}>
                <Field label={c.labels.name}>
                  <input className="input" required value={form.name} onChange={(e) => update("name", e.target.value)} />
                </Field>
                <Field label={c.labels.you}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                    {c.youOptions.map((opt) => (
                      <button key={opt} type="button" onClick={() => update("you", opt)} style={{
                        padding: "12px 18px",
                        borderRadius: 12,
                        border: "1px solid " + (form.you === opt ? "var(--m-ink)" : "var(--m-line)"),
                        background: form.you === opt ? "var(--m-ink)" : "white",
                        color: form.you === opt ? "white" : "var(--m-ink-2)",
                        fontFamily: "var(--f-sans)",
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="m-grid-2">
                  <Field label={c.labels.email}>
                    <input type="email" className="input" required value={form.email} onChange={(e) => update("email", e.target.value)} />
                  </Field>
                  <Field label={c.labels.phone}>
                    <input type="tel" className="input" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                  </Field>
                </div>
                <Field label={c.labels.project}>
                  <textarea className="textarea" required value={form.project} onChange={(e) => update("project", e.target.value)} />
                </Field>
                <div>
                  <button type="submit" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 20px", fontSize: 14, fontWeight: 600, color: "white", background: "var(--m-purple)", border: "none", borderRadius: 999, cursor: "pointer", marginTop: 8 }}>
                    {c.labels.submit}
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
                  </button>
                </div>
              </form>
            )}

            <aside style={{ borderLeft: "1px solid var(--m-line)", paddingLeft: 40 }} className="m-aside">
              <p style={{ fontSize: 14, color: "var(--m-ink-3)", margin: "0 0 20px", lineHeight: 1.5 }}>
                {lang === "fr" ? "Vous pouvez également appeler" : "You can also call"}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "var(--m-bg-soft)" }}>
                  <Image src="/mathias.costes.webp" alt="Mathias Costes" width={56} height={56} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, color: "var(--m-ink)" }}>Mathias Costes</div>
                  <div style={{ fontSize: 13, color: "var(--m-ink-3)" }}>Partner Mentivis</div>
                </div>
              </div>
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} style={{ fontSize: 17, color: "var(--m-ink)", fontWeight: 500, textDecoration: "none" }}>
                {SITE.phone}
              </a>
            </aside>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
