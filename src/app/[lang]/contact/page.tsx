"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import fr from "@/messages/fr.json";
import en from "@/messages/en.json";

const messages: Record<string, typeof fr> = { fr, en };

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
  const params = useParams();
  const lang = (params?.lang as string) || "fr";
  const t = messages[lang] || messages.fr;
  const c = t.contact;
  const [form, setForm] = useState({ name: "", you: c.youOptions[0], email: "", phone: "", project: "" });
  const [sent, setSent] = useState(false);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="page-shell">
      <TopNav t={t as any} lang={lang} setLang={() => {}} route="" />
      <section style={{ paddingTop: 120, paddingBottom: 60 }}>
        <div className="container">
          <Reveal>
            <div className="t-eyebrow" style={{ marginBottom: 28 }}>
              {c.eyebrow}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="t-display" style={{ fontSize: "clamp(48px, 7vw, 88px)", margin: 0, maxWidth: 880 }}>
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
                  <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
                    {c.labels.submit} →
                  </button>
                </div>
              </form>
            )}

            <aside style={{ borderLeft: "1px solid var(--m-line)", paddingLeft: 40 }} className="m-aside">
              <h4 style={{ fontFamily: "var(--f-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", margin: 0 }}>{c.direct.title}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: "24px 0 0", display: "flex", flexDirection: "column" as const, gap: 16 }}>
                <li>
                  <div style={{ fontSize: 12, color: "var(--m-ink-4)", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>Email</div>
                  <a href={"mailto:" + c.direct.email} style={{ fontSize: 17, color: "var(--m-ink)" }}>{c.direct.email}</a>
                </li>
                <li>
                  <div style={{ fontSize: 12, color: "var(--m-ink-4)", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>Tel.</div>
                  <a href={"tel:" + c.direct.phone.replace(/\s/g, "")} style={{ fontSize: 17, color: "var(--m-ink)" }}>{c.direct.phone}</a>
                </li>
                <li>
                  <div style={{ fontSize: 12, color: "var(--m-ink-4)", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{lang === "fr" ? "Localisation" : "Location"}</div>
                  <span style={{ fontSize: 17 }}>{c.direct.loc}</span>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </section>
      <Footer t={t as any} lang={lang} />
    </main>
  );
}